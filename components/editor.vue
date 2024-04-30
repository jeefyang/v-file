<script setup lang="ts">
const fileContentLoading = useFileContentLoading()
const fileContent = useFileContent()
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
        <MonacoEditor v-model="fileContent" lang="typescript" class="content_editor" :options="{ 'theme': 'vs-dark' }" />
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