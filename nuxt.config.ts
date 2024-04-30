// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
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