// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devServer:{
    host:"192.168.123.120",
    port:3001
  },
  devtools: { enabled: true },
  modules: [
    "nuxt-monaco-editor",
  '@element-plus/nuxt',
  '@nuxtjs/color-mode'
],
  monacoEditor: {
    // These are default values:
    locale: 'zh-hans',
    componentName: {
      codeEditor: 'MonacoEditor',
      diffEditor: 'MonacoDiffEditor',
    }
  },
  elementPlus: {
    themes: ["dark"]
  }
})