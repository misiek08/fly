import { Runtime } from "./runtime";
import { Readable, Writable } from "stream";
import { ivm } from ".";
import { transferInto } from "./utils/buffer";
import log from "./log";
import { randomBytes } from "crypto";

interface StreamInfo {
  stream: Readable
  addedAt: number
  readLength: number
  endedAt: number
}

const streams: { [key: string]: StreamInfo } = {}

const STREAM_TIMEOUT = 5 * 60 * 1000 // 5 minutes

setInterval(function () {
  log.debug("Checking for old streams.")
  for (let k of Object.keys(streams)) {
    const info = streams[k]
    if (Date.now() - info.addedAt > STREAM_TIMEOUT) {
      log.debug("Deleting old stream id:", k)
      cleanupStream(k, info)
    }
  }
}, 10000)

export const streamIdPrefix = "__fly_stream_id:"

export const streamManager = {
  add(rt: Runtime, stream: Readable): string {
    const id = generateStreamId()
    streams[streamKey(rt, id)] = { stream, readLength: 0, addedAt: Date.now(), endedAt: 0 }
    return id
  },

  addPrefixed(rt: Runtime, stream: Readable) {
    return `${streamIdPrefix}${streamManager.add(rt, stream)}`
  },

  subscribe(rt: Runtime, id: string, cb: ivm.Reference<Function>) {
    const key = streamKey(rt, id)
    log.debug("stream subscribe id:", id)
    const info = streams[key]
    if (!info)
      return cb.applyIgnored(null, ["stream not found or destroyed after timeout"])

    info.stream.once("close", function streamClose() {
      log.debug("stream closed, id:", id)
      cb.applyIgnored(null, ["close"])
      info.endedAt || (info.endedAt = Date.now())
    })
    info.stream.once("end", function streamEnd() {
      log.debug("stream ended, id:", id)
      cb.applyIgnored(null, ["end"])
      info.endedAt || (info.endedAt = Date.now())
    })
    info.stream.on("error", function streamError(err: Error) {
      log.debug("stream error, id:", id, err)
      cb.applyIgnored(null, ["error", err.toString()])
      info.endedAt || (info.endedAt = Date.now())
    })
  },

  read(rt: Runtime, id: string, cb: ivm.Reference<Function>) {
    const key = streamKey(rt, id)
    log.debug("stream:read id:", id)
    const info = streams[key]
    if (!info)
      return cb.applyIgnored(null, ["stream closed, not found or destroyed after timeout"])

    let attempts = 0

    setImmediate(tryRead)
    function tryRead() {
      attempts += 1
      try {
        const chunk = info.stream.read(1024 * 1024)
        log.debug("chunk is null? arraybuffer? string?", !chunk, chunk instanceof Buffer, typeof chunk === "string")

        if (chunk)
          info.readLength += Buffer.byteLength(chunk)

        if (!chunk && !info.endedAt && attempts < 10) // no chunk, not ended, attemptable
          setTimeout(tryRead, 10 * attempts)
        else if (chunk instanceof Buffer) // got a buffer
          cb.apply(null, [null, transferInto(chunk)])
        else // got something else
          cb.apply(null, [null, chunk])

      } catch (e) {
        cb.apply(null, [e.message])
      }
    }
  },

  directRead(rt: Runtime, id: string) {
    const key = streamKey(rt, id)
    log.debug("stream:read id:", id)
    const info = streams[key]
    if (!info)
      throw new Error("stream closed, not found or destroyed after timeout")

    return info.stream.read(10024 * 1024)
  },

  pipe(rt: Runtime, id: string, dst: Writable) {
    const key = streamKey(rt, id)
    log.debug("stream:pipe id:", id)
    const info = streams[key]
    if (!info)
      throw new Error("stream closed, not found or destroyed")
    info.stream.pipe(dst)
  },
}

function cleanupStream(key: string, info: StreamInfo) {
  info.stream.destroy()
  delete streams[key]
}

function streamKey(rt: Runtime, id: string) {
  return `${rt.app.name}:${id}`
}

function generateStreamId() {
  return randomBytes(4).toString('hex')
}