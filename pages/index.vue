<script setup lang="ts">
import type { FileStatusType, PostCreateFileType, PostFileContentType, PostUploadFileType } from '~/typings';
import { RefreshLeft } from '@element-plus/icons-vue'

// const fileUrl = useFileUrl()
const config = await useConfig()
const fileList = ref(<FileStatusType[]>[])
const urlList = ref([""])
const filterStr = ref("")
const loading = ref("")
const editorFileUrl = useEditorFileUrl()
const displayEditorFile = useDisplayEditorFile()
const fileContent = useFileContent()
const toRouter = useToRouter()
const postFileList = async (forceRefresh?: boolean) => {
    const a = await useFileList({
        baseDir: config.value?.baseDir || "./",
        url: urlList.value.join('/'),
        ignore: (config.value?.ignore || []).join("||")
    }, forceRefresh)
    fileList.value.splice(0, fileList.value.length)
    fileList.value.push(...a?.list || [])
}

await postFileList()


const onopen = async (row: FileStatusType) => {
    if (row.isDir) {
        loading.value = "正在打开文件夹"
        urlList.value.push(row.name)
        await postFileList()
        loading.value = ""
        return
    }
    editorFileUrl.value = urlList.value.join('/') + `/${row.name}`

    displayEditorFile.value = true

    loading.value = "正在读取文件内容"

    let o = await $fetch('/api/fileContent', {
        method: "post",
        body: {
            baseDir: config.value?.baseDir,
            url: urlList.value.join('/'),
            name: row.name,
            type: "utf-8"
        } as PostFileContentType
    })

    if (o?.isExist) {
        fileContent.value = o?.content || ""
        loading.value = ""
        toRouter.value = '/text'
    }
    // editorFileUrl.value.push()

}

const onproperty = (row: FileStatusType) => {
    console.log(row)

    // 将模式转换为可读的字符串形式
    const modeString = row.mode.toString(8).padStart(4, '0'); // 转换为8进制并补齐至4位数

    console.log('文件访问权限（模式）:', modeString);

    // 解析权限位
    const read = (row.mode & 256) >> 6;  // 用户读 (u)
    const write = (row.mode & 128) >> 6; // 用户写 (u)
    const execute = (row.mode & 64) >> 6; // 用户执行 (u)

    console.log('用户读:', read);
    console.log('用户写:', write);
    console.log('用户执行:', execute);
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
    { name: "属性", clickfunc: onproperty }
]]

const forcePostFileList = async () => {
    loading.value = "正在刷新文件夹"
    await postFileList(true)
    loading.value = ""
}

const uploadVisible = ref(false)
const onupload = async (list: FileList) => {
    let form = new FormData()
    form.append("baseDir", config?.value?.baseDir || "")
    form.append("url", urlList.value.join('/'))
    form.append("isOverride", "0")
    for (let i = 0; i < list.length; i++) {
        form.append("files[]", list[i])
    }
    loading.value = "正在上传文件"
    const o = await $fetch("/api/uploadFile", {
        method: "post",
        body: form,
        // headers: {
        //     'Content-type': "multipart/form-data; boundary=ABC"
        // }
    })
    if (o.status) {
        ElMessage({ message: "上传成功!", type: "success" })
        loading.value = "正在刷新当前路径"
        await postFileList(true)
        loading.value = ""
        ElMessage({ message: "上传成功且已经刷新目录", type: "success" })
        return
    }
    loading.value = ""
    ElMessage({ message: "上传失败,请查看服务器代码", type: "error" })
}

const oncreate = async (name: string, isDir: boolean) => {

    if (fileList.value.findIndex(c => c.name == name) != -1) {
        ElMessage({ message: "当前路径已经存在相同名称的文件(夹)", type: "error" })
        return
    }
    loading.value = `正在创建文件(夹):${name}`
    const o = await $fetch('/api/createFile', {
        method: "post",
        body: {
            baseDir: config.value?.baseDir,
            url: urlList.value.join('/'),
            type: "utf-8",
            name: name,
            isDir: isDir,
        } as PostCreateFileType
    })
    if (!o.status && o.err == "exist") {
        loading.value = ""
        ElMessage({ message: "当前路径已经存在相同名称的文件(夹)", type: "warning" })
        return
    }
    loading.value = "创建文件(夹)成功,正在刷新当前路径"
    await postFileList(true)
    loading.value = ""
    ElMessage({ message: `创建文件(夹):${name}成功`, type: "success" })
}

</script>
<template>
    <div class="content">
        <!-- <el-col :span="24"> -->
        <div>
            <routerUrl v-model="urlList" @change-router="onchangeRouter"></routerUrl>
        </div>
        <div style="display: flex">
            <!-- 上传 -->
            <el-button type="primary" @click="uploadVisible = true">
                上传
            </el-button>
            <el-drawer v-model="uploadVisible" :show-close="false" direction='ttb'>
                <fileUpload @upload="onupload"></fileUpload>
            </el-drawer>

            <!-- 间隔 -->
            <div style="width:10px"></div>

            <!-- 新建文件(夹) -->
            <createFile :width="300" @create="oncreate">
                <el-button type="primary">新建</el-button>
            </createFile>

            <!-- 间隔 -->
            <div style="width:10px"></div>

            <!-- 刷新 -->
            <el-button type="primary" @click="forcePostFileList">
                <el-icon size="30px" color="#fff">
                    <RefreshLeft />
                </el-icon>
            </el-button>
            <!-- 间隔 -->
            <div style="width:10px"></div>
            <!-- 过滤 -->
            <el-input v-model="filterStr" style="width: 150px" placeholder="过滤" />
        </div>


        <div class="filelist">
            <manage-file-list :file-list="fileList" :filter-key="filterStr" :loading="loading"
                :oprations="oprations"></manage-file-list>
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
    display: flex;
    flex-direction: column;
}

.filelist {
    flex-grow: 1;
    overflow: auto;
}
</style>