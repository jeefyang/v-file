<script setup lang="ts">
import type { MonacoEditorLangType } from '~/typings';

const fileContentLoading = useFileContentLoading()
const fileContent = useFileContent()
const editorFileUrl = useEditorFileUrl()
const langList: ([MonacoEditorLangType, ...string[]])[] = [
    ['plaintext', 'txt'],
    ['plaintext', 'text'],
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
const language = ref<MonacoEditorLangType>("plaintext")

watch([editorFileUrl], () => {
    let a = editorFileUrl.value.split('.')
    let ex = a[a.length - 1] || ""
    let f = langList.find(c => c.findIndex(cc => cc == ex) == -1)
    if (!f) {
        language.value = "plaintext"
    }
    else {
        language.value = f[0]
    }
})
// setTimeout(() => {
//     //@ts-ignore
//     monaco.editor.create(divRef.value, {
//          language: "typescript", 
//          value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
//          theme:"vs-dark"
//          })
// }, 1000);

</script>
<template>
    <el-row v-loading="fileContentLoading">
        <MonacoEditor v-model="fileContent" :lang="language" class="content_editor"
            :options="{ 'theme': 'vs-dark', }" />
    </el-row>

</template>
<style scoped>
.content_editor {
    width: 500px;
    height: 500px;
    top: 50px;
    left: 50px;
}
</style>