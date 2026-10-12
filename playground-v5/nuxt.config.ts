export default defineNuxtConfig({
  modules: ['@nuxtjs/partytown'],
  app: {
    head: {
      script: [{ src: '/test-script.js', type: 'text/partytown' }],
    },
  },
  compatibilityDate: '2024-08-19',
  partytown: {
    //
  },
})
