import { defineNuxtConfig } from 'nuxt'
import PartyTownModule from '..'

export default defineNuxtConfig({
  modules: [PartyTownModule],
  meta: {
    script: [{ src: '/test-script.js', type: 'text/partytown' }],
  },
  partytown: {
    //
  },
})
