# @yukiakai/tls-fetch

## 2.0.1

### Patch Changes

- f242102: Fix: Minium build requirements (glibc ≥ 2.35, not 2.38)

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
