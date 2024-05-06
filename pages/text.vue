<script setup lang="ts">
import type { PostEditorFileType } from '~/typings';

const fileContent = useFileContent()
const editorFileUrl = useEditorFileUrl()
const fileContentType = useFileContentType()

const onsave = async (content: string, readonly: boolean) => {
    if (readonly) {
        ElMessage({ message: "现在是只读模式,无法保存!!!!", type: "warning" })
        return
    }
    if (fileContent.value == content) {
        ElMessage({ message: "文本检测为未修改,暂不保存!", type: "warning" })
        return
    }
    let body: PostEditorFileType = {
        type: fileContentType.value,
        content: content,
        name: editorFileUrl.value[2],
        baseDir: editorFileUrl.value[0],
        url: editorFileUrl.value[1]
    }
    let res = await $fetch("/api/editorFile", {
        method: "post",
        body: body
    })
    if (res.status) {
        ElMessage({ message: "保存成功!", type: "success" })
        return
    }
    if (res.err == "isDir") {
        ElMessage({ message: "修改的是文件夹,无法写入!!!", type: "error" })
        return
    }
    if (res.err == "noExist") {
        ElMessage({ message: "文件不存在,无法写入!!!", type: "error" })
        return
    }
}

</script>
<template>
    <div class="content">
        <div class="title">
            <el-text type="primary">{{ editorFileUrl[1] + '/' + editorFileUrl[2] }}</el-text>
        </div>
        <div class='editor'>
            <editor :props-content="fileContent" :url="editorFileUrl[1] + '/' + editorFileUrl[2]">
                <template #default="scope">
                    <el-button type="primary" @click="onsave(scope.content, scope.readonly)">保存</el-button>
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