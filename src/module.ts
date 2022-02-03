import { join } from 'path'
import { promises as fsp } from 'fs'
import { genArrayFromRaw, genObjectFromRaw, genString } from 'knitwork'
import serveStatic from 'serve-static'
import { defineNuxtModule, assertNuxtCompatibility, isNuxt2 } from '@nuxt/kit'
import { copyLibFiles, libDirPath } from '@builder.io/partytown/utils'

export interface ModuleOptions {
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
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/partytown',
    configKey: 'partytown',
    compatibility: {
      bridge: true,
    },
  },
  defaults: nuxt => ({
    debug: nuxt.options.dev,
    forward: [],
    lib: '/~partytown/',
  }),
  async setup(options, nuxt) {
    // Normalize partytown configuration
    const rawConfig: Record<string, any> = {
      debug: options.debug,
      lib: genString(options.lib),
      forward: genArrayFromRaw(options.forward),
    }
    if (options.resolveUrl) {
      rawConfig.resolveUrl = options.resolveUrl
    }
    const renderedConfig = genObjectFromRaw(rawConfig).replace(/\s*\n\s*/g, ' ')

    // Add partytown snippets to document head
    const partytownSnippet = await fsp.readFile(join(libDirPath(), 'partytown.js'), 'utf-8')
    if (isNuxt2()) {
      // Use vue-meta syntax to inject scripts
      nuxt.options.head = nuxt.options.head || {}
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID =
        nuxt.options.head.__dangerouslyDisableSanitizersByTagID || {}
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID.partytown = ['innerHTML']
      nuxt.options.head.__dangerouslyDisableSanitizersByTagID['partytown-config'] = ['innerHTML']
      nuxt.options.head.script.unshift(
        { hid: 'partytown-config', innerHTML: `partytown = ${renderedConfig}` },
        { hid: 'partytown', innerHTML: partytownSnippet }
      )
    } else {
      // Use @vueuse/head syntax to inject scripts
      nuxt.options.meta.script = nuxt.options.meta.script || []
      nuxt.options.meta.script.unshift(
        { children: `partytown = ${renderedConfig}` },
        { children: partytownSnippet }
      )
    }

    if (nuxt.options.dev) {
      // Serve the partytown library directly from node_modules in development
      nuxt.options.serverMiddleware.push({
        path: options.lib,
        handler: serveStatic(libDirPath()),
      })
    } else {
      // Copy partytown directory into .output/public in production build
      nuxt.hook('nitro:generate', async ctx => {
        await copyLibFiles(join(ctx.output.publicDir, options.lib))
        // Remove debugging JS from production build
        if (!options.debug) {
          await fsp.rm(join(ctx.output.publicDir, options.lib, 'debug'), {
            recursive: true,
            force: true,
          })
        }
      })
    }
  },
})
