// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxtjs/color-mode",
  ],
  runtimeConfig: {
    public: {
      API_KEY: process.env.VUE_APP_API_KEY,
      ANTHROPIC_API_KEY: process.env.VUE_APP_ANTHROPIC_API_KEY,
    },
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            jersey: 'Jersey 15',
          },
        },
      },
    },
  },
});
