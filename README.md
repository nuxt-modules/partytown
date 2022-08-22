# @nuxtjs/partytown

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> [Partytown](https://partytown.builder.io/) integration for [Nuxt](https://v3.nuxtjs.org)

## Features

- 👌 Zero-config required
- 🔥 Relocates resource intensive scripts into a web worker
- ⚡️ Speeds up your site
- 💯 Nuxt 3 and Nuxt Bridge support

## Quick setup

1. Install `@nuxtjs/partytown`!

   ```bash
   yarn add --dev @nuxtjs/partytown # or npm install --save-dev @nuxtjs/partytown
   ```

2. Add it to the `modules` section of `nuxt.config.ts`

   ```js
   import { defineNuxtConfig } from 'nuxt'

   export default defineNuxtConfig({
     modules: ['@nuxtjs/partytown'],
   })
   ```

3. Add `type: 'text/partytown'` attribute to any scripts you want to be handled by partytown.

   ```vue
   <template>
     <div>
       <Script type="text/partytown" src="https://example.com/analytics.js" />
     </div>
   </template>
   ```

## Configuration

Partytown supports a number of options, which you can pass in your `nuxt.config.ts` file:

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  // ...
  partytown: {
    /**
     * When `true`, Partytown scripts are not minified. See https://partytown.builder.io/configuration
     * on how to enable more logging.
     *
     * @default true in development
     */
    debug: boolean
    /**
     * Path (relative to your base URL) where the Partytown library should be served from.
     *
     * @default '~partytown'
     */
    lib: string
    // For other options, see https://partytown.builder.io/configuration
  },
})
```

## Example Configurations

### Crisp

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['@nuxtjs/partytown'],
  partytown: {
    forward: ['$crisp', '$crisp.push'],
  },
  app: {
    head: {
      script: [
        // Insert your CRISP Script here e.g.:
        { children: 'window.$crisp = []; window.CRISP_WEBSITE_ID = "0000"' },
        { src: 'https://client.crisp.chat/l.js', async: true, type: 'text/partytown' },
      ],
    },
  },
})
```

### Google Tag Manager

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['@nuxtjs/partytown'],
  partytown: {
    forward: ['dataLayer.push'],
  },
  app: {
    head: {
      script: [
        // Insert your Google Tag Manager Script here
        { src: '-', async: true, type: 'text/partytown' },
      ],
    },
  },
})
```

### Plausible Analytics

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['@nuxtjs/partytown'],
  partytown: {
    forward: ['$plausible', '$plausible.push'],
  },
  app: {
    head: {
      script: [
        { children: 'window.$plausible = [];' },
        // Update this
        {
          src: 'https://plausible.io/js/script.js',
          defer: true,
          type: 'text/partytown',
          'data-domain': 'your-domains',
        },
      ],
    },
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
[github-actions-ci-src]: https://github.com/nuxt-modules/partytown/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-modules/partytown/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-modules/partytown.svg
[codecov-href]: https://codecov.io/gh/nuxt-modules/partytown
[license-src]: https://img.shields.io/npm/l/@nuxtjs/partytown.svg
[license-href]: https://npmjs.com/package/@nuxtjs/partytown
