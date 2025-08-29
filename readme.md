# @yukiakai/tls-fetch
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

> Native Rust-powered HTTP client with TLS fingerprint bypass – for stealthy and high-performance web scraping or automation.

&#x20;

`@yukiakai/tls-fetch` is a native Node.js module (built with Rust & napi-rs) designed to bypass browser fingerprint authentication by simulating low-level TLS handshakes that resemble real browsers. Note: macOS is not supported.

---

## Features

* ✅ Real-browser TLS/JA3 fingerprint emulation
* ✅ Native performance (Rust + Tokio under the hood)
* ✅ Seamless Node.js integration (via `napi-rs`)
* ✅ Supports proxy (HTTP, HTTPS, SOCKS5)
* ✅ Modern fetch-like API design
* ✅ Lightweight, no Puppeteer or headless browser needed

---

## Installation

```bash
npm install @yukiakai/tls-fetch
```

### System Requirements

* **Node.js 16+**
* **glibc ≥ 2.35** (ships with Ubuntu 22.04+ or equivalent)

---

## Usage
### CommonJS
```js
const { TLSFetch } = require('@yukiakai/tls-fetch');

TLSFetch.get('https://example.com', {
  headers : { 'User-Agent': 'Mozilla/5.0 ...' },
}).then(res => { /* todo */})

```
### ESM
```js
import { TLSFetch }  from '@yukiakai/tls-fetch';

const res = await TLSFetch.post('https://example.com/api', {
  headers: { 'Content-Type': 'application/json' },
  body: Buffer.from(JSON.stringify({ foo: 'bar' })),
});
console.log(res.statusCode);

```

---

## API

See docs: [API docs][api-docs-url]

All methods are **Promise-based** and use `Buffer` for binary-safe transmission.

### `get(url: string, options?: HttpOptions): Promise<HttpResponse>`

Performs a `GET` request with browser-like TLS fingerprinting.

```ts
import { tlsFetch } from '@yukiakai/tls-fetch'

const res = await tlsFetch.get('https://example.com', {
  headers : { 'User-Agent': 'Mozilla/5.0 ...' },
})
console.log(res.statusCode, res.headers, res.text())
```

---

### `post(url: string, options?: HttpOptions): Promise<HttpResponse>`

Sends a `POST` request.

```ts
import { TLSFetch } from '@yukiakai/tls-fetch'

const res = await TLSFetch.post('https://api.example.com', {
  headers: { 'Content-Type': 'application/json' },
  body: Buffer.from(JSON.stringify({ foo: 'bar' }))
})
```

---

### `fetch(url: string, options: RequestOptions): Promise<HttpResponse>`

Generic method supporting any HTTP verb.

```ts
import { TLSFetch } from '@yukiakai/tls-fetch'

const res = await TLSFetch.fetch('https://api.example.com/item/123', {
  method: 'PUT',
  headers: { 'Authorization': 'Bearer token' },
  body: Buffer.from('payload'),
  proxy: 'http://127.0.0.1:8080'
})
```

---

### `stream(url: string, filePath: string, options?: RequestOptions): Promise<HttpStreamResponse>`

Stream response directly to a file.

```ts
import { TLSFetch } from '@yukiakai/tls-fetch'

await TLSFetch.stream('https://cdn.example.com/video.mp4', './video.mp4')
```

---

##  Upgrade Guide to V2

Version **v2** introduces several important changes compared to v1:

### 1. Fully rewritten in TypeScript

* The library is now fully written in TypeScript with **strict typing**.
* Provides better IDE autocomplete and reduces type-related bugs.

### 2. Uses N-API v3

* Improves request/response performance compared to v1.
* Fully compatible with modern Node.js and other platforms (Linux, Windows)(x64, arm).

### 3. Internal TLS change

* From v2, `@yukiakai/tls-fetch` bundles its own OpenSSL.
* You no longer need to install or link against the system’s OpenSSL library.

### 4. Major API changes

#### a. `tlsFetch.post` / `tlsFetch.get` / `tlsFetch.delete` …

* These methods now use **`HttpOptions`** instead of the old `RequestOptions`.
* **`RequestOptions`** still exists, but is now **only used for the generic `fetch()` method**.

**Example:**

```ts
// v2
tlsFetch.post(url, { body, headers }); // HttpOptions
tlsFetch.fetch(url, { method: "POST", body, headers }); // RequestOptions (generic)
```

> Make sure to update all calls to `post/get/delete/...` to use the new `HttpOptions` interface.

---

#### b. `Response.headers`

**Before (v1):**

```ts
headers: Record<string, string>
```

**After (v2):**

```ts
headers: Record<string, string | string[] | undefined>
```

> Supports headers with multiple values or undefined.
> If your code reads `headers['some-header']` directly, check the type before using:

```ts
const value = response.headers['set-cookie'];
if (Array.isArray(value)) {
  value.forEach(cookie => console.log(cookie));
} else if (value) {
  console.log(value);
}
```

---

#### c. No more default import

* v2 **does not support default import**.
* Update your import statements:

```ts
// Old v1 style
import tlsFetch from '@yukiakai/tls-fetch';

// New v2 style
import { TLSFetch } from '@yukiakai/tls-fetch';
```

> This is required for TypeScript strict mode and better tree-shaking.

---


### 4. How to upgrade

1. Update your package:

```bash
npm install @yukiakai/tls-fetch@latest
```

2. Change all calls to `post/get/delete/...` to use `HttpOptions`.
3. For generic requests, use `fetch()` with `RequestOptions`.
4. Update all import statements to **named import**:

```ts
import { TLSFetch } from '@yukiakai/tls-fetch';
```

5. Review all usage of `Response.headers` → make sure your code handles `string | string[] | undefined`.
6. Rebuild your project if using TypeScript.

---

**Tip:** v2 is optimized for speed with N-API v3, so you’ll notice significant improvements when performing many parallel requests or handling large data.

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

## Changelog

See full release notes in [CHANGELOG.md][changelog-url]

---

## License

MIT © [Yuki](https://github.com/yukiakai212)

---

## Contributing

PRs and issues welcome. Native TLS customization contributions especially appreciated.


[npm-downloads-image]: https://badgen.net/npm/dm/@yukiakai/tls-fetch
[npm-downloads-url]: https://www.npmjs.com/package/@yukiakai/tls-fetch
[npm-url]: https://www.npmjs.com/package/@yukiakai/tls-fetch
[npm-version-image]: https://badgen.net/npm/v/@yukiakai/tls-fetch
[changelog-url]: https://github.com/yukiakai212/tls-fetch-prebuilt/blob/main/CHANGELOG.md
[api-docs-url]: https://yukiakai212.github.io/tls-fetch-prebuilt/

