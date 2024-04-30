<script setup lang="ts">
// import monaco from "monaco-editor"
const monaco = useMonaco()!
// const divRef=
// monaco.editor.create
const divRef = ref<HTMLDivElement>()

setTimeout(() => {
    //@ts-ignore
monaco.editor.create(divRef.value, { language: "typescript", value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'), })
}, 1000);

</script>
<template>
    <!-- <div>editor</div> -->
    <div ref="divRef" class="content_editor"></div>
</template>
<style scoped>
.content_editor {
    width:500px;
    height: 500px;
    top:50px;
    left: 50px;
}
</style>