# @yukiakai/tls-fetch
![Windows](https://img.shields.io/badge/Windows-supported-brightgreen?logo=windows)
![Linux](https://img.shields.io/badge/Linux-supported-brightgreen?logo=linux)
![Apple Sucks](https://img.shields.io/badge/macOS-unsupported-red?logo=apple&logoColor=white&labelColor=black)

[![npm](https://img.shields.io/npm/v/@yukiakai/tls-fetch?color=crimson&logo=npm)](https://www.npmjs.com/package/@yukiakai/tls-fetch)
[![downloads](https://img.shields.io/npm/dt/@yukiakai/tls-fetch?label=downloads&color=blue&logo=npm)](https://www.npmjs.com/package/@yukiakai/tls-fetch)
[![install size](https://packagephobia.com/badge?p=@yukiakai/tls-fetch)](https://packagephobia.com/result?p=@yukiakai/tls-fetch)
[![GitHub](https://img.shields.io/badge/GitHub-repo-blue?logo=github)](https://github.com/yukiakai212/tls-fetch-prebuilt)
> Native Rust-powered HTTP client with TLS fingerprint bypass – for stealthy and high-performance web scraping or automation.

&#x20;

`@yukiakai/tls-fetch` is a native Node.js module (built with Rust & napi-rs) designed to bypass browser fingerprint authentication by simulating low-level TLS handshakes that resemble real browsers. Note: macOS is not supported.

---

## Features

* ✅ Custom TLS Client Hello for fingerprint evasion
* ✅ Native performance (Rust + Tokio under the hood)
* ✅ Seamless Node.js integration (via `napi-rs`)
* ✅ Supports proxy (HTTP, HTTPS, SOCKS5)
* ✅ Modern fetch-like API design
* ✅ Stream large responses directly to file
* ✅ Lightweight, no Puppeteer or headless browser needed

---

## Installation

```bash
npm install @yukiakai/tls-fetch
```

📦 Runtime Dependency: **OpenSSL 3 (`libssl.so.3`)**

If you encounter an error like:

```
Error: libssl.so.3: cannot open shared object file: No such file or directory
```

Please install OpenSSL 3:

### Ubuntu 22.04+
```bash
sudo apt update
sudo apt install libssl3
```

### Ubuntu 20.04 or older:
Manually build OpenSSL 3:
```bash
sudo apt install build-essential zlib1g-dev checkinstall
cd /usr/local/src
sudo wget https://www.openssl.org/source/openssl-3.0.14.tar.gz
sudo tar -xf openssl-3.0.14.tar.gz
cd openssl-3.0.14
sudo ./config --prefix=/usr/local/openssl-3 --openssldir=/usr/local/openssl-3
sudo make -j$(nproc)
sudo make install
```

Then add this to your environment:
```bash
export LD_LIBRARY_PATH=/usr/local/openssl-3/lib:$LD_LIBRARY_PATH
export PATH=/usr/local/openssl-3/bin:$PATH
```

---

## Usage
### CommonJS
```js
const tlsFetch = require('@yukiakai/tls-fetch');

tlsFetch.get('https://example.com', {
  headers : { 'User-Agent': 'Mozilla/5.0 ...' },
}).then(res => { /* todo */})

```
### ESM
```js
import tlsFetch from '@yukiakai/tls-fetch';

const res = await tlsFetch.post('https://example.com/api', {
  headers: { 'Content-Type': 'application/json' },
  body: Buffer.from(JSON.stringify({ foo: 'bar' })),
});
console.log(res.statusCode);

```

---

## API

All methods are **Promise-based** and use `Buffer` for binary-safe transmission.

### `get(url: string, options?: RequestOptions | undefined | null): Promise<HttpResponse>`

Performs a `GET` request with browser-like TLS fingerprinting.

```ts
import tlsFetch from '@yukiakai/tls-fetch'

const res = await tlsFetch.get('https://example.com', {
  headers : { 'User-Agent': 'Mozilla/5.0 ...' },
})
console.log(res.statusCode, res.headers, res.data.toString())
```

---

### `post(url: string, options?: RequestOptions | undefined | null): Promise<HttpResponse>`

Sends a `POST` request.

```ts
import tlsFetch from '@yukiakai/tls-fetch'

const res = await tlsFetch.post('https://api.example.com', {
  headers: { 'Content-Type': 'application/json' },
  body: Buffer.from(JSON.stringify({ foo: 'bar' }))
})
```

---

### `fetch(url: string, options: RequestOptions): Promise<HttpResponse>`

Generic method supporting any HTTP verb.

```ts
import tlsFetch from '@yukiakai/tls-fetch'

const res = await tlsFetch.fetch('https://api.example.com/item/123', {
  method: 'PUT',
  headers: { 'Authorization': 'Bearer token' },
  body: Buffer.from('payload'),
  proxy: 'http://127.0.0.1:8080'
})
```

---

### `stream(url: string, filePath: string, options?: RequestOptions | undefined | null): Promise<HttpStreamResponse>`

Stream response directly to a file.

```ts
import tlsFetch from '@yukiakai/tls-fetch'

await tlsFetch.stream('https://cdn.example.com/video.mp4', './video.mp4')
```

---

## Interfaces

```ts
interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: Buffer
  proxy?: string
}
interface HttpResponse {
  statusCode: number
  headers: Record<string, string>
  data: Buffer
}
interface HttpStreamResponse {
  statusCode: number
  headers: Record<string, string>
  file: string
}
interface HttpResponsePlus extends HttpResponse {
  json(): any
  text(): string
  buffer(): Buffer
}
```

---

## Use Cases

* Bypass anti-bot browser checks
* Access sites using real browser-like TLS handshakes
* Fetch through proxies (for scraping, automation)
* Download large files directly to disk (stream mode)

---

## Notes

* Requires Node.js 16+
* Compatible with Linux and Windows

---

## License

MIT © [Yuki]

---

## Contributing

PRs and issues welcome. Native TLS customization contributions especially appreciated.
