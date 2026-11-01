# @yukiakai/tls-fetch

## 6.0.0

### Breaking Changes

- Use `httpClient` as the named client export. Update earlier examples that import or reference `TLSFetch` or `TlsFetch`.
- Use `request()` for generic HTTP requests instead of `fetch()`.
- Use `download()` instead of `stream()` for file downloads.
- Response header names are normalized to lowercase, and header values no longer include `undefined`: `Record<string, string | string[] | undefined>` is now `Record<string, string | string[]>`.
- Platform-native packages now use the `@tls-fetch/addon-*` naming scheme. Applications should import only `@yukiakai/tls-fetch`.

### Added

- Support for macOS on Apple Silicon (`arm64`) and Intel (`x64`).
- Support for Windows `ia32`.
- Support for Linux ARMv7 GNU (`arm-gnueabihf`).
- Support for FreeBSD `x64`.
- A default export for the configured HTTP client.
- `ERR_TLS_FETCH_NATIVE_ADDON_UNAVAILABLE` when no compatible native add-on can be loaded.

### Changed

- The native HTTP layer now uses Rustls for TLS, replacing the bundled OpenSSL implementation documented in v2.
- Native add-ons are resolved automatically for the current operating system and architecture.

### Fixed

- The top-level `request` export is bound to its HTTP client and can be safely called directly.

### Migration

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

## 2.0.2

### Patch Changes

- 5cdd280: Support import fetch direct

## 2.0.1

### Patch Changes

- f242102: Fix: Minium build requirements (glibc ≥ 2.35, not 2.39)

## 2.0.0

### Major Changes

- ### Breaking Changes
  - Minimum OS requirement: **Ubuntu 22.04** or later.
  - **Default import removed** → You must now use named imports:

  ```ts
  // Before
  import TLSFetch from '@yukiakai/tls-fetch';

  // After
  import { TLSFetch } from '@yukiakai/tls-fetch';
  ```

  - **`HttpResponsePlus` removed** → Its functionality has been merged into `HttpResponse`.
    Update your code to use `HttpResponse` directly.
  - **Request options structure refactored** → These get(), post(),... methods now use **`HttpOptions`** instead of the old `RequestOptions`.
    `RequestOptions` still exists, but is now **only used for the generic `fetch()` method**.

  ### Added
  - Support for response headers with multiple values or undefined
  - Support for Linux ARM64 architecture

  ### Changed
  - Refactor options structure
  - Rewritten fully in TypeScript with strict typing
  - Upgrade to N-API v3
  - Internal TLS change: v2 now bundles **OpenSSL directly** into the codebase. No more dependency on system-wide `libssl.so`. Instead, requires **glibc ≥ 2.35** (Ubuntu 22.04+ or equivalent).

  ### Removed
  - Default import
  - `HttpResponsePlus`, merged into `HttpResponse`

  ### Security
  - Patch for CVE-2025-55159

  ### Improved
  - Internal refactoring for better type safety and clearer API separation
  - Documentation updated to reflect new usage patterns
