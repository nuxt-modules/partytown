import { defineNuxtConfig } from 'nuxt3'
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
