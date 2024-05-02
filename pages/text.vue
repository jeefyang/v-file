<script setup lang="ts">
const fileContent = useFileContent()
const editorFileUrl = useEditorFileUrl()

const onsave = (content: string, readonly: boolean) => {
    if (readonly) {
        ElMessage({message:"现在是只读模式,无法保存!!!!",type:"warning"})
        return
    }
    if(fileContent.value==content){
        ElMessage({message:"文本检测为未修改,暂不保存!",type:"warning"})
        return
    }
}

</script>
<template>
    <div class="content">
        <div class="title">
            <el-text type="primary">{{ editorFileUrl }}</el-text>
        </div>
        <div class='editor'>
            <editor :props-content="fileContent" :url="editorFileUrl">
                <template #default="scope">
                    <el-button type="primary" @click="onsave(scope.content,scope.readonly)">保存</el-button>
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