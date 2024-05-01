<script setup lang="ts">
import type { FileStatusType, PostFileListType, PostFileContentType } from '~/typings';

// const fileUrl = useFileUrl()
const config = await useConfig()
const fileList = ref(<FileStatusType[]>[])
const urlList = ref([""])
const filterStr = ref("")
const loading = ref(false)
const editorFileUrl = useEditorFileUrl()
const fileContentLoading = useFileContentLoading()
const displayEditorFile = useDisplayEditorFile()
const fileContent = useFileContent()
const toRouter = useToRouter()
const postFileList = async () => {
    const a = await useFetch("/api/fileList", {
        method: "post",
        body: <PostFileListType>{
            baseDir: config.value?.baseDir || "./",
            url: urlList.value.join('/'),
            ignore: (config.value?.ignore || []).join("||")
        },
        deep: false
    })
    fileList.value.splice(0, fileList.value.length)
    fileList.value.push(...a.data.value?.list || [])
}

await postFileList()


const onopen = async (row: FileStatusType) => {
    if (row.isDir) {
        loading.value = true
        urlList.value.push(row.name)
        await postFileList()
        loading.value = false
        return
    }
    editorFileUrl.value = urlList.value.join('/') + `/${row.name}`
    fileContentLoading.value = true
    displayEditorFile.value = true
    toRouter.value='/text'
    fileContentLoading.value = true
    let o = await useFetch('/api/fileContent', {
        method: "post",
        body: {
            baseDir: config.value?.baseDir,
            url: urlList.value.join('/'),
            name: row.name,
            type: "utf-8"
        } as PostFileContentType
    })
    if (o.data.value?.isExist) {
        fileContent.value = o.data.value.content || ""
        fileContentLoading.value = false
    }
    // editorFileUrl.value.push()

}

const ontest = () => {
    console.log('测试')
}

const onchangeRouter = async (v: string[]) => {
    urlList.value = v
    await postFileList()
}

const oprations: {
    name: string
    clickfunc: (r: FileStatusType) => void
}[][] = [[
    { name: "打开", clickfunc: onopen },
    { name: "下载", clickfunc: ontest }
], [
    { name: "删除", clickfunc: ontest },
    { name: "属性", clickfunc: ontest }
]]

</script>
<template>
    <div class="content">
        <!-- <el-col :span="24"> -->
            <div>
                <routerUrl v-model="urlList" @change-router="onchangeRouter"></routerUrl>
            </div>
            <el-input v-model="filterStr" style="width: 150px" placeholder="过滤" />
            <div class="filelist">
                <manage-file-list :file-list="fileList" :filter-key="filterStr" :loading="loading" :oprations="oprations"></manage-file-list>
            </div>
           
        <!-- </el-col> -->
    </div>


    <!-- <editor></editor> -->
    <!-- <div>index!!!</div> -->
</template>
<style scoped>
.content {
    /* position: fixed; */
    top: 10px;
    left: 10px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    /* overflow: auto; */
    display:flex;
    flex-direction: column;
}

.filelist{
    flex-grow: 1;
    overflow: auto;
}
</style>