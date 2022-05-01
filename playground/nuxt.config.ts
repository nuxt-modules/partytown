import { defineNuxtConfig } from 'nuxt'
import PartyTownModule from '..'

export default defineNuxtConfig({
  modules: [PartyTownModule],
  app: {
    head: {
      script: [{ src: '/test-script.js', type: 'text/partytown' }],
    },
  },
  partytown: {
    //
  },
})
