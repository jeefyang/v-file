<script setup lang="ts">
import type { MonacoEditorLangType } from '~/typings';
import { RefreshLeft } from '@element-plus/icons-vue'

const props = defineProps<{
    propsContent: string
    propsLang?: MonacoEditorLangType,
    url?: string
    loading?: boolean
    propOPHeight?: string
}>()

const langList: ([MonacoEditorLangType, ...string[]])[] = [
    ['plaintext', 'txt', 'text'],
    ['bat'],
    ['c'],
    ['cpp'],
    ['csharp'],
    ['dart'],
    ['go'],
    ['html'],
    ['ini'],
    ['java'],
    ['javascript', 'js'],
    ['julia'],
    ['kotlin'],
    ['less'],
    ['lua'],
    ['markdown', 'md'],
    ['coffeescript', "cjs"],
    ['mysql'],
    ['objective-c'],
    ['pascal'],
    ['perl'],
    ['php'],
    ['powershell', 'ps1', 'psm1'],
    ['pug'],
    ['python', 'py'],
    ['ruby'],
    ['rust', 'rs'],
    ['scss'],
    ['shell', "sh"],
    ['sql'],
    ['swift'],
    ['typescript', 'ts'],
    ['vb'],
    ['xml'],
    ['yaml', 'toml'],
    ['json', 'jsonc'],
]
const options = langList.map(c => { return { value: c[0], label: c[0] } })
const language = ref<MonacoEditorLangType>("plaintext")
const content = ref<string>("")
const readOnly = ref(true)
const opHeight = ref("")

watch([() => props.url], () => {
    if (!props.url) {
        language.value = "plaintext"
        return
    }

    let a = props.url.split('.')
    let ex = a[a.length - 1] || ""
    let f = langList.find(c => c.findIndex(cc => cc == ex) == -1)
    if (!f) {
        language.value = "plaintext"
    }
    else {
        language.value = f[0]
    }
})

watch([() => props.propsLang], () => {
    language.value = props.propsLang || "plaintext"
})

watch([() => props.propsContent], () => {
    content.value = props.propsContent || ""
})

watch([() => props.propOPHeight], () => {
    opHeight.value = props.propOPHeight || "40px"
})

content.value = props.propsContent || ""
language.value = props.propsLang || "plaintext"
opHeight.value = props.propOPHeight || "40px"

const reback = () => {
    content.value = props.propsContent || ""
}
</script>
<template>

    <div class="content_editor">
        <div class="editor_op" :style="{ height: opHeight }">
            <slot :content="content"></slot>
            <el-button type="primary" round @click="reback">
                <el-icon size="30px" color="#fff">
                    <RefreshLeft />
                </el-icon>
            </el-button>
            <div style="width: 10px;"></div>
            <el-switch v-model="readOnly" size="default" inline-prompt active-text="只读" inactive-text="读写" />
            <div style="width: 10px;"></div>
            <el-select v-model="language" placeholder="Select" size="default" style="width: 120px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <MonacoEditor class="monoca_editor" v-model="content" :lang="language"
            :options="{ 'theme': 'vs-dark', 'readOnly': readOnly }" />
    </div>


</template>
<style scoped>
.editor_op {
    display: flex;
    flex-direction: row;
    margin-left: 2px;
}

.content_editor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column
}

.monoca_editor {
    flex-grow: 1;
}
</style>