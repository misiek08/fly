import * as path from "path"

setupApps({
  "edge.local": path.resolve(__dirname, "proxy.js"),
  "origin.local": path.resolve(__dirname, "body.js")
})

const methods = ["POST", "PUT", "PATCH", "DELETE"]

describe.each(["edge.local", "origin.local"])("Request body to %s", host => {
  test.each(methods)(`from %s request`, async method => {
    const response = await fetch(`http://${host}`, {
      method,
      body: "this is a body"
    })
    expect(response.status).toEqual(200)
    expect(await response.text()).toEqual("this is a body")
  })

  test("cloning", async () => {
    const response = await fetch(`http://${host}/clone`, { method: "POST", body: "hello" })
    expect(response.status).toEqual(200)
    expect(await response.text()).toEqual(`res1: hellohello\nres2: hellohello`)
  })

  test("streaming", async () => {
    const start = new Date().getTime()
    const response = await fetch(`http://${host}/stream`)
    const firstResponse = new Date().getTime()
    expect(firstResponse - start).toBeLessThan(1000)
    expect(response.status).toEqual(200)

    const body = await response.text()
    expect(body).toContain("chunk 0\n")
    expect(body).toContain("chunk 1\n")
    expect(body).toContain("chunk 2\n")
  })
})
