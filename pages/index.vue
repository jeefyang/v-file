<script setup lang="ts">
// const fileUrl = useFileUrl()
const displayEditorFile = useDisplayEditorFile()
</script>
<template>
    <manage></manage>
    <div v-if="displayEditorFile" class="editor">
        <editor></editor>
    </div>
    <!-- <editor></editor> -->
    <!-- <div>index!!!</div> -->
</template>
<style scoped>
.editor {
    position: fixed;
    top: 10px;
    left: 10px;
    width: calc(100% - 10px);
    height: calc(100% -10px);
    z-index: 100;
}
</style>