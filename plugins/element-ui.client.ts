import { defineNuxtPlugin } from "#app"
import { ElButton, ElMenu, ElMenuItem, ElSubMenu } from "element-plus"
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useDark, useToggle } from "@vueuse/core"

export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.vueApp.use(ElButton)
    nuxtApp.vueApp.use(ElMenu)
    nuxtApp.vueApp.use(ElMenuItem)
    nuxtApp.vueApp.use(ElSubMenu)
    const isDark = useDark()
    const toggleDark = useToggle(isDark)
    // nuxtApp.vueApp.use(ElButton)
})