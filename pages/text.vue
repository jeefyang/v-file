<script setup lang="ts">
const displayEditorFile = useDisplayEditorFile()
</script>
<template>
    <div v-if="displayEditorFile" class="editor">
        <editor></editor>
    </div>
</template>
<style scoped></style>