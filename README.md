# @nuxtjs/partytown

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> [Partytown](https://github.com/BuilderIO/partytown/wiki) integration for [Nuxt](https://v3.nuxtjs.org)

## Features

- 👌 Zero-config required
- 🔥 Relocates resource intensive scripts into a web worker
- ⚡️ Speeds up your site
- 💯 Nuxt 3 and Nuxt Bridge support

## Quick setup

1. Add `@nuxtjs/partytown` dependency to your project

```bash
yarn add @nuxtjs/partytown # or npm install @nuxtjs/partytown
```

2. Add `@nuxtjs/partytown` to the `modules` section of `nuxt.config.ts`

3. Add `type: 'text/partytown'` attribute to any scripts you want to be handled by partytown.

```js
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  meta: {
    script: [{ src: '/test-script.js', type: 'text/partytown' }],
  },
  modules: ['@nuxtjs/partytown'],
})
```

## Configuration

Partytown supports a number of options, which you can pass in your `nuxt.config.ts` file:

```js
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  // ...
  partytown: {
    /**
     * When `true`, Partytown scripts are not minified. See the
     * [Debugging docs](https://github.com/BuilderIO/partytown/wiki/Debugging) on how to enable more logging.
     *
     * @default true in development
     */
    debug: boolean
    /** Log method calls */
    logCalls?: boolean
    /** Log getter calls */
    logGetters?: boolean
    /** Log setter calls */
    logSetters?: boolean
    /** Log Image() src requests */
    logImageRequests?: boolean
    /** Log script executions */
    logScriptExecution?: boolean
    /** Log navigator.sendBeacon() requests */
    logSendBeaconRequests?: boolean
    /** Log stack traces */
    logStackTraces?: boolean
    /**
     * An array of strings representing function calls on the main thread to forward to the web worker. See
     * [Forwarding Events and Triggers](https://github.com/BuilderIO/partytown/wiki/Forwarding-Events-and-Triggers)
     * for more info.
     *
     * @default []
     */
    forward: string[]
    /**
     * Path where the Partytown library can be found your server. Note that the path must both start
     * and end with a `/` character, and the files must be hosted from the same origin as the webpage.
     *
     * @default '/~partytown/'
     */
    lib: string
    /**
     * Hook that is called to resolve URLs which can be used to modify URLs. The hook uses the API:
     * `resolveUrl(url: URL, location: URL, method: string)`. See
     * [Proxying Requests](https://github.com/BuilderIO/partytown/wiki/Proxying-Requests) for more information.
     *
     * This should be provided as a string, which will be inlined into a `<script>` tag.
     */
    resolveUrl?: string
  },
})
```

## Development

- Run `yarn prepare` to generate type stubs.
- Use `yarn dev` to start [playground](./playground) in development mode.

## Licence

[MIT Licence](./LICENCE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/partytown/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxtjs/partytown
[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/partytown.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/partytown
[github-actions-ci-src]: https://github.com/nuxt-community/partytown-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-community/partytown-module/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/partytown-module.svg
[codecov-href]: https://codecov.io/gh/nuxt-community/partytown-module
[license-src]: https://img.shields.io/npm/l/@nuxtjs/partytown.svg
[license-href]: https://npmjs.com/package/@nuxtjs/partytown
