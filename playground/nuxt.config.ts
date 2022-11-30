export default defineNuxtConfig({
  modules: ['@nuxtjs/partytown'],
  app: {
    head: {
      script: [{ src: '/test-script.js', type: 'text/partytown' }],
    },
  },
  partytown: {
    //
  },
})
