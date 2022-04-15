import { join } from 'path'
import { promises as fsp } from 'fs'
import { genObjectFromRawEntries } from 'knitwork'
import { defineNuxtModule, isNuxt2 } from '@nuxt/kit'
import type { PartytownConfig } from '@builder.io/partytown/integration'
import { copyLibFiles, libDirPath } from '@builder.io/partytown/utils'
import { withLeadingSlash, withTrailingSlash } from 'ufo'

type ExcludeFrom<G extends Record<string, any>, K> = Pick<
  G,
  {
    [P in keyof G]: NonNullable<G[P]> extends K ? never : P
  }[keyof G]
>

/** For more information read the full details at https://partytown.builder.io/configuration */
export interface ModuleOptions extends ExcludeFrom<PartytownConfig, Function> {
  /**
   * When `true`, Partytown scripts are not minified. See the
   * [Debugging docs](https://partytown.builder.io/debugging) on how to enable more logging.
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
  /**
   * Hook that is called to resolve URLs which can be used to modify URLs. The hook uses the API:
   * `resolveUrl(url: URL, location: URL, method: string)`. See
   * [Proxying Requests](https://partytown.builder.io/proxying-requests) for more information.
   *
   * This should be provided as a string, which will be inlined into a `<script>` tag.
   */
  resolveUrl?: string
  /** This function should be provided as a string, which will be inlined into the partytown config */
  get?: string
  /** This function should be provided as a string, which will be inlined into the partytown config */
  set?: string
  /** This function should be provided as a string, which will be inlined into the partytown config */
  apply?: string
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
    lib: '~partytown',
  }),
  async setup(options, nuxt) {
    // Normalize partytown configuration
    const fns = ['resolveUrl', 'get', 'set', 'apply']
    options.lib = withLeadingSlash(withTrailingSlash(options.lib))
    const rawConfig = Object.entries(options).map(
      ([key, value]) => [key, fns.includes(key) ? value : JSON.stringify(value)] as [string, string]
    )
    const renderedConfig = genObjectFromRawEntries(rawConfig).replace(/\s*\n\s*/g, ' ')

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
      nuxt.options.app.head.script = nuxt.options.app.head.script || []
      nuxt.options.app.head.script.unshift(
        { children: `partytown = ${renderedConfig}` },
        { children: partytownSnippet }
      )
    }

    // Add the partytown library directly from node_modules
    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    nuxt.options.nitro.publicAssets.push({
      baseURL: options.lib,
      dir: libDirPath(),
    })
  },
})
