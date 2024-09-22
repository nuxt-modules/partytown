export default defineNuxtConfig({
  compatibilityDate: '2024-08-19',
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
