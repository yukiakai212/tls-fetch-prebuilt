# @yukiakai/tls-fetch

> Native Rust-powered HTTP client with TLS fingerprint bypass – for stealthy and high-performance web scraping or automation.

&#x20;

`@yukiakai/tls-fetch` is a native Node.js module (built with Rust & napi-rs) designed to bypass browser fingerprint authentication by simulating low-level TLS handshakes that resemble real browsers. Note: currently not supporting macOS.

---

## Features

* ✅ Custom TLS Client Hello for fingerprint evasion
* ✅ Native performance (Rust + Tokio under the hood)
* ✅ Seamless Node.js integration (via `napi-rs`)
* ✅ Support for streaming responses to file
* ✅ Lightweight, no Puppeteer or headless browser needed

---

## Installation

```bash
npm install @yukiakai/tls-fetch
```

️ Runtime Dependency: OpenSSL 3

This package requires **OpenSSL 3 runtime (`libssl.so.3`)** to load native bindings correctly.

If you encounter an error like:

    Error: libssl.so.3: cannot open shared object file: No such file or directory

Please install OpenSSL 3:

🐧 Ubuntu 22.04+ (most systems already have it):

    sudo apt update
    sudo apt install libssl3

🐧 Ubuntu 20.04 or older:

OpenSSL 3 is not available in the default repository. You have two options:

1. Upgrade your OS to Ubuntu 22.04 or later  
2. Manually build OpenSSL 3:

    sudo apt update && sudo apt install build-essential zlib1g-dev checkinstall
    cd /usr/local/src
    sudo wget https://www.openssl.org/source/openssl-3.0.14.tar.gz
    sudo tar -xf openssl-3.0.14.tar.gz
    cd openssl-3.0.14
    sudo ./config --prefix=/usr/local/openssl-3 --openssldir=/usr/local/openssl-3
    sudo make -j$(nproc)
    sudo make install

Then add this to your environment:

    export LD_LIBRARY_PATH=/usr/local/openssl-3/lib:$LD_LIBRARY_PATH
    export PATH=/usr/local/openssl-3/bin:$PATH


## Usage
### CommonJS
```js
const tlsFetch = require('@yukiakai/tls-fetch');

tlsFetch.get('https://example.com', {
  'User-Agent': 'Mozilla/5.0 ...',
}).then(res => { /* todo */})

```
### ESM
```js
import tlsFetch from '@yukiakai/tls-fetch';

tlsFetch.get('https://example.com', {
  'User-Agent': 'Mozilla/5.0 ...',
}).then(res => { /* todo */})

```

---

## API

All methods are **Promise-based** and use `Buffer` for binary-safe transmission.

### `get(url: string, headers: Record<string, string>): Promise<HttpResponse>`

Performs a `GET` request with browser-like TLS fingerprinting.

```ts
import tlsFetch from '@yukiakai/tls-fetch'

const res = await tlsFetch.get('https://example.com', {
  'User-Agent': 'Mozilla/5.0 ...',
})
console.log(res.statusCode, res.header, res.data.toString())
```

---

### `post(url: string, headers: Record<string, string>, body?: Buffer | null): Promise<HttpResponse>`

Sends a `POST` request.

```ts
import tlsFetch from '@yukiakai/tls-fetch'

const res = await tlsFetch.post('https://api.example.com', {
  'Content-Type': 'application/json',
}, Buffer.from(JSON.stringify({ foo: 'bar' })))
```

---

### `fetch(method: string, url: string, headers: Record<string, string>, body?: Buffer | null): Promise<HttpResponse>`

Generic method supporting any HTTP verb.

```ts
import tlsFetch from '@yukiakai/tls-fetch'

const res = await tlsFetch.fetch('PUT', 'https://api.example.com/item/123', {
  'Authorization': 'Bearer token',
}, Buffer.from('payload'))
```

---

### `stream(method: string, url: string, headers: Record<string, string>, filePath: string, body?: Buffer | null): Promise<HttpStreamResponse>`

Streams the response body directly to a local file (e.g. for large downloads).

```ts
import tlsFetch from '@yukiakai/tls-fetch'

await tlsFetch.stream('GET', 'https://cdn.example.com/video.mp4', {
  'User-Agent': 'Mozilla/5.0 ...',
}, './video.mp4')
```

---

## Interfaces

```ts
interface HttpResponse {
  statusCode: number
  header: Record<string, string>
  data: Buffer
}

interface HttpStreamResponse {
  statusCode: number
  header: Record<string, string>
  file: string
}
```

---

## Use Cases

* Bypass browser check
* Fetch resources with real browser-like TLS handshake
* Automate API interaction with stealth
* Stream large media files without browser

---

## Notes

* Requires Node.js 16+
* Compatible with Linux and Windows (macOS support WIP)
* Ensure Rust toolchain is installed if building locally

---

## License

MIT © \[Yuki]

---

## Contributing

PRs and issues welcome. Native TLS customization contributions especially appreciated.
