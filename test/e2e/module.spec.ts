import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils'
import fetch from 'node-fetch'

const playground = fileURLToPath(new URL('../../playground', import.meta.url))

await setup({
  rootDir: playground,
  server: true,
})

describe('module', () => {
  it('serves partytown scripts', async () => {
    const result = await $fetch('/~partytown/partytown-sw.js', { responseType: 'text' })
    expect(result).matches(/\/\* Partytown/)
  })

  it('injects partytown config', async () => {
    const result = await $fetch('/')
    expect(result).toContain('<script>partytown = { debug: false')
  })

  it('injects partytown script', async () => {
    const result = await $fetch('/')
    expect(result).toContain('<script>/* Partytown')
  })
})
