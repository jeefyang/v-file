// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@element-plus/nuxt', "nuxt-monaco-editor"],
  css: ['element-plus/dist/index.css',"element-plus/theme-chalk/dark/css-vars.css"],
  elementPlus: {
    "themes": ["dark"]
  }
})