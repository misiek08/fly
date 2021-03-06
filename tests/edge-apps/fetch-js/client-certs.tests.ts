import * as path from "path"

setupApps({
  "edge.local": path.resolve(__dirname, "client-certs.edge.js")
})

test("client certs pass to server", async () => {
  const response = await fetch("http://edge.local", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      cert,
      key,
      ca: [ca]
    })
  })
  expect(response.status).toEqual(200)
  expect(await response.text()).toMatch(/SSL Authentication OK!/)
})

test("throws on an invalid cert+key", async () => {
  const response = await fetch("http://edge.local", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      cert,
      key: "bad-key",
      ca: [ca]
    })
  })
  expect(response.status).toEqual(500)
  expect(await response.text()).toMatch(/no start line/)
})

const ca = `-----BEGIN CERTIFICATE-----
MIIFgDCCA2gCCQCLtoAQKfdgizANBgkqhkiG9w0BAQsFADCBgTELMAkGA1UEBhMC
VVMxCzAJBgNVBAgMAk1BMQ8wDQYDVQQHDAZCb3N0b24xEzARBgNVBAoMCkV4YW1w
bGUgQ28xEDAOBgNVBAsMB3RlY2hvcHMxCzAJBgNVBAMMAmNhMSAwHgYJKoZIhvcN
AQkBFhFjZXJ0c0BleGFtcGxlLmNvbTAeFw0xOTAzMTIyMTEzNTVaFw00NjA3Mjcy
MTEzNTVaMIGBMQswCQYDVQQGEwJVUzELMAkGA1UECAwCTUExDzANBgNVBAcMBkJv
c3RvbjETMBEGA1UECgwKRXhhbXBsZSBDbzEQMA4GA1UECwwHdGVjaG9wczELMAkG
A1UEAwwCY2ExIDAeBgkqhkiG9w0BCQEWEWNlcnRzQGV4YW1wbGUuY29tMIICIjAN
BgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6hn1srGs0pLbxECr4dmx5rspVAtH
a8+v06ruhov3QkiaLnPSRUBTsvDPyOsipyzk0lU5LToYIlG7jNDmwt4nguVVGmAz
5V1QV7uHiJgIImyDbekQbcwW7bVi1dcp5RwD8zfCJqD/v0/TTtNBW4vMDKN8DR2h
Co9rd1XFnOTSzaC9H3I/bHq2+UR/v7oKW4IweIaEqs7aoG8O/qXpd8a0h9lAoTQ5
24kjRmRp/L+nDyTSzPD7ZK+WQ2JC/hKmV0RPTGDKP4at8mLKS3av9TBh6WLQZgWc
svbBwSqamcsTI/iFoOYykRsMtM7cZ8FEFgjKnty4n7Y04TFbu0XJsWjYkF1kanm1
QwoYFXpxwTmDKqf5RselxxDoWggygZqzMHUKR8cirJe+HYItF9qnD1+WQe1Kvx6c
WCp5vw/Uzg71VobzSedyAxcN79jazyTH1CqNbRqrh/x0Dbg7qYQ3DmW/AvihiX3o
2IKiASKiyFM+p2/C52OZY+JnDGKpbUkJ34mbBthJHPv9K0UxzMBxgK2EAifQblbk
fPTZdPJixE08spDzHaBrhPkLGdqLWKm3ZQVXmS3/p5o0OA8izwdbPLFCRC/DoD20
xLAXna7jJvgFWD2fSZ+YPLAlxIEpM8fg9jrO2nu29iUn2SRJWsCRB97RZtAx4M7t
TRIcLQ64hfTztLMCAwEAATANBgkqhkiG9w0BAQsFAAOCAgEAUjr/6jqLfUfP4HYu
8PtNd/bHqGGXo1VIdS2ne/1G3S3b3IHR/NVFedYfktx5TsMTCGJU+q1pG+PyBH7z
jTgTkOac7J4knBZ5DhGxz3MObD57LpPq1Mtxhsgr9dKHW1eWQnFlE7oLnAqictDs
Pa0tS+H5/YE6g4Ue2ZFr2ksMjjbmhDecrXhoZUWS3b/zl3JNQ/hczw+UNzKuK1AZ
up+cqe8xKwmTfGxx8iwN2SlCjEAtNu1ioU+PLUi3LRyiAxlbm0ampMGNli0me8BQ
N3QvFear3gVleTOCXcDOzYlRX76Ied7IXH7xkdEcDUtra5UaLDV/xzOxJOozhlCY
sKO6fgbVS5gf2gVt3mLVRnVyevsl8P94HhjRsahzmy2tJGD8dCx62EyHyTyscZqX
p/a+PMoeBb82AHllqcGspqxjv24TIsshA65LZbbDtGxJ1qRqMuKVAkOfTcI+u/1t
H2OPe8G3F8HX6aCIm4hgKuRXQ5P28PmFNWCQhsyQR/dPQvVMvyNyKJY53yzzByrj
42IRtl+MYCPQctvsC3Z/2Vfc/xf9Ujpz1OpkMJhmaFw+4PAh1Nbtf9YNdvwopvh7
+IG7qjtHvG25zA8ogVoA4gRYk/qdfPQgX8twRBJAiBrlXtRVzlaM7mpWn0+QUzTF
jNJLqa8fKQgNFs664HWb2od7vZ0=
-----END CERTIFICATE-----`

const cert = `-----BEGIN CERTIFICATE-----
MIIFijCCA3KgAwIBAgIJALurjD6W3dJrMA0GCSqGSIb3DQEBBQUAMIGBMQswCQYD
VQQGEwJVUzELMAkGA1UECAwCTUExDzANBgNVBAcMBkJvc3RvbjETMBEGA1UECgwK
RXhhbXBsZSBDbzEQMA4GA1UECwwHdGVjaG9wczELMAkGA1UEAwwCY2ExIDAeBgkq
hkiG9w0BCQEWEWNlcnRzQGV4YW1wbGUuY29tMB4XDTE5MDMxMjIxMTUzM1oXDTIx
MTIwNTIxMTUzM1owgYYxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJNQTEPMA0GA1UE
BwwGQm9zdG9uMRMwEQYDVQQKDApFeGFtcGxlIENvMRAwDgYDVQQLDAd0ZWNob3Bz
MRAwDgYDVQQDDAdjbGllbnQxMSAwHgYJKoZIhvcNAQkBFhFjZXJ0c0BleGFtcGxl
LmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBANpUhbe9tE5zFU1+
xF3V4djXKETekYcUmIICsF7GXq0PYRFB0qmWDuIunzVw+c1NEdbjhJswQZCAMegC
w415ygCPZYE4j/8Qh4c4BiiVD+P9ocIhlLEmiz4ehRVeysWPkARYrNuj4h1TPYsp
9S8olYbzelRamcIPyyRxwS+gF5ivvgLtJEFgUVATxwH1fusmt0NeGYZEvayNyFSX
QyozQ075lY9FHTnuejOcLjBpX0R9shsFYQugDWvsw/ht/DTg5keZvfoJXwC47HgH
GxVv/XTBGgjDIfXoDJnPVQ6cnUltWQr9eV0GNvX2l+z6GBl4wFbXL8Pq99kWtg73
lY2Hbvd6N1Pvn6kAOOKl2sz8u7x3lDbpXp4Cm1ptwA5LuNWslzMxAKHdEnSTti7+
xbOJfhXiu48X3E3jOC9VsXvqmhdMcdaVm4sR6x8YyjebMd3wpQSbecLHWvrx3dKk
RYxLizYdMm9pxYk+Gr58u9vrluGp8xFPBzwFIHTuh9VcNZBt4edVNcSApMtWf244
pFFAjIKn+FENwjxXI4YTzv3sALylfTPEhTojogYQSursIv05lg0Y93SLksnD83QO
tIgudtwKpJrCgnNaMWqurIzW8m7z0r0Eyx0jmtUS//hxI+LN4hi96S/3bhIbaFoD
2fLnzCM6KtDVyq/l+k+8+MDtkhnRAgMBAAEwDQYJKoZIhvcNAQEFBQADggIBAMZZ
no4CEBgtvT+aLvu3y02Kr9M7glXl8JU4eNJpzsZRkSP0igfUMWvAljty0NsgOju/
tj+jJaVUfsiq7z0hmJFIywRwKEem7mIaCJDykdOttiY8547SRnmR3/44x5PlmgMA
zQmFYpsZAAShzwE/d9V/tlgG63GqGBXTYlitXcyGLk3ely9skETx1U4A0ZJnXA8d
CGKsDpp3/T7oPGSna/6T4NW6INm47TuyPeHM859QaDlspsvlP3UlAHbM22p8jLSl
A1n7TFHtayRU0dBlevrHU+VR6wGpCoSu5CqnkS7uoVgYwemxmOfA4UXnWHFqhD7q
+nUu6BuHnmJbTJs2vR6VytfcE0IzWE3K5fMhD9zzX8EGuMOu7pQbKbBIwCnin01k
WRYy3VtyJfGeNwbGRNahyKa5bF1zFPt0jxGeXq+p4MjkkcWS1oRExQjrU3LOzGfT
JFuvSjAlA3YFhFV9fF1cw5T9uNuOzB7bCYk9uimbRgHEKcyGK02k9zmP14YlxeXN
B5j7KpYs3shrdQYeF2r0gDLHfDDMXleuvSjS3IIH79v27jJHNVugiob0tI2bMJxi
Ss1wAbVyLUL8ocgPwHaLNYW6SLI0CrXO0uxP6eDHmaq5msNwtXoJ6dH42BMWSwOp
T3xf7GOOG9pN3ACBI8FZqfjnxLBcdpVFMGSCoLwP
-----END CERTIFICATE-----`

const key = `-----BEGIN RSA PRIVATE KEY-----
MIIJKgIBAAKCAgEA2lSFt720TnMVTX7EXdXh2NcoRN6RhxSYggKwXsZerQ9hEUHS
qZYO4i6fNXD5zU0R1uOEmzBBkIAx6ALDjXnKAI9lgTiP/xCHhzgGKJUP4/2hwiGU
sSaLPh6FFV7KxY+QBFis26PiHVM9iyn1LyiVhvN6VFqZwg/LJHHBL6AXmK++Au0k
QWBRUBPHAfV+6ya3Q14ZhkS9rI3IVJdDKjNDTvmVj0UdOe56M5wuMGlfRH2yGwVh
C6ANa+zD+G38NODmR5m9+glfALjseAcbFW/9dMEaCMMh9egMmc9VDpydSW1ZCv15
XQY29faX7PoYGXjAVtcvw+r32Ra2DveVjYdu93o3U++fqQA44qXazPy7vHeUNule
ngKbWm3ADku41ayXMzEAod0SdJO2Lv7Fs4l+FeK7jxfcTeM4L1Wxe+qaF0xx1pWb
ixHrHxjKN5sx3fClBJt5wsda+vHd0qRFjEuLNh0yb2nFiT4avny72+uW4anzEU8H
PAUgdO6H1Vw1kG3h51U1xICky1Z/bjikUUCMgqf4UQ3CPFcjhhPO/ewAvKV9M8SF
OiOiBhBK6uwi/TmWDRj3dIuSycPzdA60iC523AqkmsKCc1oxaq6sjNbybvPSvQTL
HSOa1RL/+HEj4s3iGL3pL/duEhtoWgPZ8ufMIzoq0NXKr+X6T7z4wO2SGdECAwEA
AQKCAgBYKYlViOUmSJJxmJ7yxUtNpJQ+OyHIyihLV4qgurnAaFVqAopusImSDAF+
MwCsRlLN01HY2MOg9iMw7OzKVEOdtknmxFBhTutrTtQtzwN7rQ+EtMq2Pjo7+1cC
KiT3YeFl3+jtSGAmN1bCu06mnFzFAcyEA5HTK018ifLYqGze2xh/VgMt4xbynwnd
YKS/kAKw0W69KUTuSNJ8VhhpEgo7+czK7b2/hu0Rqh98rRArOBaTkrh9WUQSMKlx
x/fv4mEayJpOPTp/sCzMyxHEtlRCsTcyEpnEEtADzBUssVFSNTWfmntHdRr8d3ch
2lug7YG9j2daVad/ogwiPxfE7st/pIJd59jwKUolmUvmabQez0OqtoN8jyVueuoU
ayMr5OdHiu5u/QJTE+GEPQ/VjEXy7JB1KYlROyt8R4XWHIVR1PPzyj6GsM8cZNjK
WPemN4MiCa4ly32GLQjLNzVIQnaqltwSCnC5QRjqsAxuQ4uMocqqguA3TOTFN7sm
mVhIQIoQsHgGpeHqScNyX1g6DcKJSRtZjSbrvoV6QGLyUmpHdQCGtU6dYDhSkRET
i2JGbmazGGsYojflQApV70zV+NI2HT/Ue3ZKgE/+GAihFtqAHwejQMXLJisYAjFZ
P50Gh5YD30KHhSw54oioyFwgn84ktBxxKNxg1VTDbxFbI3YAAQKCAQEA8QQVLIO8
1WUdT6H3vQlVSErsSm5tIcKwOTjyJmjfj5k4zQi8GimNGbT99/WNUWdEWY8lmgt1
yVRW462peHw5uOdRzqcuv/FNTgSHzprBCQRyk7zkLgjf5HVmCuVAWYVPHqQ+tudW
kcKvcni0rk9HqHtkFJzHYbsLVgQdJJKCtfNM7dk0n8K0nfMfFQ8zwXv9oLwRExHg
dbLgeLbV0IYPrs0GAOi8kGlsqSiZuDk/dsZDwSwX0Gd05ACOOzoY0IycJABYTu/C
2eGWki7lK9cxoxCb1k7leCPiOjKIsTi1EK4fEnXY3tyBFHgdpmdjnBC6IvF8N2WV
PN4ExhzgwO6wgQKCAQEA5+dhpI1LzCjA+EIfVRvgzl9T9ra9PCUltpyhW5C+oA6S
0uKY4bKTrr0qii3Dgmzhw1YvWoqgVpgWe0fyTo/znCcRVNyruhWNMBm88CtlgMPr
/G/zZoWhS8rv2XLf/cvjxJrLuLkEEWRTrI3Fk2UpglNXCqQWt44ZJVt+cTl7D1u1
Y0DJyPb7XgaeqsEis2lyputuVHRf2idaU+yjaYTzPTBgAo3CxXfgMxgOrudm7Mim
/bto/APyNJ2O50NInjkKgiJisMKcx98qtVhD/1jtg3Mr7z+9R+ISSu/XSSUBba5y
f73gdntJr+31n1WvOBZgF4W9MjrpRTnFM1SAoXvBUQKCAQEAkJ6vied+vtmOrgL1
YfQgvWFfygXa7EAjeCKogs25IDSDtdxA6r32Ee/d2RT5+Fer1sWjfXzU77rw7Gt/
XnHEPSRonUUKM1i61062ow2POTb2/ZmBnfHrTu33DiCj7VOltzA9BYlpE8urdVfi
qxmdWQa5dfjhVs5irfmH9zMGxeE5TxtfjWHK+WAyTXOyza318aYH5NZ8RoPQV/71
68sVzADwUklVJJ5t+k8Hdli7sSyk6Vvo6j+6DzoaHoXs7+7/nkaqtqr907menRcQ
oq7c9Qj5Sa5L2TxG+j7qcNUjKOAievRF7uyHc93jhL9TMQmEd4VJ0P/efgiG+s3H
O12+gQKCAQEA55bChDo2/+OTElm2QKBemLnKeA92W6IdT4iL+41JUT48ki2Iz5wu
r8ppuSSKoq1pqFFhaOIXzWKE0QjAioRnnAHH5R+av3LWVLrfXFl6PGVsPeTvBetd
cPtxG48E8cez5ptP52GdFmFCzoemT9Qu59+ihRXpOdXGdvAwDZKBuoyzUDNbUD6W
OQgTXCMULGeZ/+gNfnnZX1r9ceJYLwB+iRTOTL6VS+6zD1NvFmww9TZMzgdiiIrI
TpMqKvmeg6QjQmJkfHFdcJ0FYaSMA20jhKp3ra3RsP+rlPp/3KQAETCtV7SffLMS
m4bgTAadvT1bKSJ+FrOOUXun2+L/skSMgQKCAQEA31Z/I1LzUfFCqEePVHppmQfg
wLPOxK3oGe6dlQBgi/25eUE9/+Jce4k/K8WnZrktuxV5HwNhnDfFK1Rl5/tQuB8Z
HrOOeGaA1/o1xNOW/jDWg81SIMaVK31on9Y3SZG0ftn1gqVtyXaLPcA07IjU5Snx
TuHm3NQAbV0lOBauXrwZOm+EMVzbkqDrBsc1rIWrZamxP0Qt3eZ8C1NLAJNU4HNd
tfRXvxhIjwe+oZI+1JNJoS/e7XkfXcrC95i60OPIEei99HrxOlQeqFUh2mwUkvy1
x6LuLuG1dul6LVbsc50JWaLPK0P9wBQ85enAxJ7joYRmhC0UulvMSomBF/gKtw==
-----END RSA PRIVATE KEY-----`
