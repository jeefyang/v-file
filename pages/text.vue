<script setup lang="ts">
const displayEditorFile = useDisplayEditorFile()
const fileContentLoading = useFileContentLoading()
const fileContent = useFileContent()
const editorFileUrl = useEditorFileUrl()

</script>
<template>
    <div class="content">
        <div class="title">
            <el-text type="primary">{{ editorFileUrl }}</el-text>
        </div>
        <div class='editor'>
            <editor :props-content="fileContent" :url="editorFileUrl">
                <template #default="scope">
                    <el-button type="primary" @click="console.log(scope.content)">保存</el-button>
                </template>
            
            </editor>
        </div>

    </div>

</template>
<style scoped>
.title {
    width: 100%;
    justify-content: center;
    display: flex;
    background-color: #595e61;
    height: 30px;
}

.editor {
    top: 5px;
    position: relative;
    flex-grow: 1;
}

.content {
    /* position: fixed; */
    top: 10px;
    left: 10px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    /* overflow: auto; */
    display: flex;
    flex-direction: column;
}
</style>