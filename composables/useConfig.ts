import { type ConfigType } from "~/typings"


const config = ref<ConfigType | null>(null)

export default async function () {
    if (config.value) {
        return config
    }
    let o = await $fetch("/api/getConfig")
    config.value = o
    return config
}