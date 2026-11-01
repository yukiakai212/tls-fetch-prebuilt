# @yukiakai/tls-fetch
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

> Native Rust-powered HTTP client with TLS fingerprint bypass – for stealthy and high-performance web scraping or automation.

&#x20;

`@yukiakai/tls-fetch` is a native Node.js module (built with Rust & napi-rs) designed to bypass browser fingerprint authentication by simulating low-level TLS handshakes that resemble real browsers.

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
* A supported operating system and CPU architecture
* The native HTTP layer uses Rustls for TLS. No separate OpenSSL runtime needs to be documented as a v6 requirement.
**Linux:** an OpenSSL 3 runtime that provides `libssl.so.3`

> The Linux native addon dynamically links against the system OpenSSL runtime. Ensure OpenSSL 3 is installed in the
  host or container image before running the package.

| Platform |  Supported targets                                               |
| :---:    | :---:                                                            |
| Linux    |  x64 GNU, ARM64 GNU, x64 musl, ARM64 musl, ARMv7 GNU (gnueabihf) |
| Windows  |  x64, ARM64, ia32                                                |
| macOS    |  Apple Silicon (ARM64), Intel (x64)                              |
| FreeBSD  |  x64                                                             |

You normally do not need to install an @tls-fetch/addon-* package directly. The root package resolves the appropriate
native add-on for the current platform.
  
---

## Usage

### ESM
```js
import { httpClient }  from '@yukiakai/tls-fetch';

const res = await httpClient.post('https://example.com/api', {
  headers: { 'Content-Type': 'application/json' },
  body: Buffer.from(JSON.stringify({ foo: 'bar' })),
});
console.log(res.statusCode);

```

### CommonJS
```js
const { httpClient } = require('@yukiakai/tls-fetch');

httpClient.get('https://example.com', {
  headers : { 'User-Agent': 'Mozilla/5.0 ...' },
}).then(res => { /* todo */})

```

---

## API

See docs: [API docs][api-docs-url] for the complete reference

### Client exports

```js
import client, { httpClient, request } from '@yukiakai/tls-fetch';
```

- `httpClient` is the configured `HttpClient` instance.
- `request` is a bound shortcut for `httpClient.request()`.

`httpClient` exposes:

```ts
httpClient.get(url, options?);
httpClient.head(url, options?);
httpClient.post(url, options?);
httpClient.put(url, options?);
httpClient.patch(url, options?);
httpClient.delete(url, options?);
httpClient.request(url, options?);
httpClient.download(url, destinationPath, options?);
```

### Requests

Performs a `POST` request with browser-like TLS fingerprinting.

```js
import { httpClient } from '@yukiakai/tls-fetch';

const response = await httpClient.post('https://api.example.com/items', {
  headers: {
    'content-type': 'application/json',
  },
  body: Buffer.from(JSON.stringify({ name: 'example' })),
});

console.log(response.statusCode);
```

Use request() for any HTTP method:

```js
import { request } from '@yukiakai/tls-fetch';

const response = await request('https://api.example.com/items/123', {
  method: 'PATCH',
  headers: {
    authorization: 'Bearer token',
    'content-type': 'application/json',
  },
  body: Buffer.from(JSON.stringify({ enabled: true })),
  proxy: 'http://127.0.0.1:8080',
});

console.log(response.json());
```

### Downloads

download() writes the response body directly to the supplied destination path.

```js
import { httpClient } from '@yukiakai/tls-fetch';

const response = await httpClient.download(
  'https://example.com/archive.zip',
  './archive.zip',
);

console.log(response.statusCode);
console.log(response.filePath);
```

### Request options

- Request-header values must be strings.
- Request bodies must be Node.js `Buffer` instances.
- `GET` and `HEAD` requests cannot include a body.
- `request()` and `download()` default to `GET` when `method` is omitted.

### Responses

`HttpResponse` contains:

```ts
response.statusCode;
response.headers;
response.buffer();
response.text();
response.json<T>();
```

Response header names are normalized to lowercase. A header with multiple values is represented as string[].

```js
const setCookie = response.headers['set-cookie'];

if (Array.isArray(setCookie)) {
  for (const cookie of setCookie) {
    console.log(cookie);
  }
}
```

`download()` returns `HttpDownloadResponse`, which contains `statusCode`, `headers`, and `filePath`.

---

## Migrating to v6

```ts
// Before
import { TLSFetch, fetch } from '@yukiakai/tls-fetch';

await TLSFetch.stream(url, destination);
await fetch(url, { method: 'PATCH' });

// v6
import { httpClient, request } from '@yukiakai/tls-fetch';

await httpClient.download(url, destination);
await request(url, { method: 'PATCH' });
```
	
- Use `httpClient` instead of `TLSFetch` or `TlsFetch`.
- Use `request()` instead of `fetch()` for generic HTTP requests.
- Use `download()` instead of `stream()` for file downloads.
- Response header values changed from `string | string[] | undefined` to `string | string[]`.
- Platform add-ons are now named `@tls-fetch/addon-*`; application code should import only `@yukiakai/tls-fetch.
- v6 adds support for macOS, FreeBSD x64, Windows ia32, and Linux ARMv7 GNU.
- Linux deployments must include the OpenSSL 3 runtime required by the native add-on.

---

## Use Cases

* Bypass anti-bot browser checks
* Access sites using real browser-like TLS handshakes
* Fetch through proxies (for scraping, automation)
* Download large files directly to disk

---

## Troubleshooting

### No compatible native add-on

If loading the package throws `ERR_TLS_FETCH_NATIVE_ADDON_UNAVAILABLE`, verify that the current operating system and architecture are listed above. 
Then reinstall dependencies without omitting optional dependencies.

### Missing OpenSSL on Linux

If Node reports that `libssl.so.3` cannot be opened, install the OpenSSL 3 runtime in the host or container image.
The native add-on cannot load until that library is available.

## Documentation

See the generated API documentation: [API docs][api-docs-url]

---

## Changelog

See full release notes in [CHANGELOG.md][changelog-url]

---

## License

MIT © [Yuki Akai](https://github.com/yukiakai212)

---

## Contributing

PRs and issues welcome. Native TLS customization contributions especially appreciated.


[npm-downloads-image]: https://badgen.net/npm/dm/@yukiakai/tls-fetch
[npm-downloads-url]: https://www.npmjs.com/package/@yukiakai/tls-fetch
[npm-url]: https://www.npmjs.com/package/@yukiakai/tls-fetch
[npm-version-image]: https://badgen.net/npm/v/@yukiakai/tls-fetch
[changelog-url]: https://github.com/yukiakai212/tls-fetch-prebuilt/blob/main/CHANGELOG.md
[api-docs-url]: https://yukiakai212.github.io/tls-fetch-prebuilt/

