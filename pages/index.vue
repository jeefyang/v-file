<script setup lang="ts">
import type { EditorFileTypeType, FileStatusType, ManageFileListoprationType, PostCreateFileType, PostDelFileType, PostFileContentType, PostRenameFileType, PostUploadFileType } from '~/typings';


// const fileUrl = useFileUrl()
const config = await useConfig()
const fileList = ref(<FileStatusType[]>[])
const urlList = ref([""])
const loading = ref("")
const editorFileUrl = useEditorFileUrl()
const displayEditorFile = useDisplayEditorFile()
const fileContent = useFileContent()
const fileContentType = useFileContentType()
const toRouter = useToRouter()
const popLoading = ref("")
let selectFileStatus: FileStatusType | null = null
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


const onopen = async (row: FileStatusType, type: EditorFileTypeType = "utf-8") => {
    if (row.isDir) {
        loading.value = "正在打开文件夹"
        urlList.value.push(row.name)
        await postFileList()
        loading.value = ""
        return
    }
    editorFileUrl.value = [config.value?.baseDir || "", urlList.value.join('/'), row.name]

    displayEditorFile.value = true

    loading.value = "正在读取文件内容"

    let o = await $fetch('/api/fileContent', {
        method: "post",
        body: {
            baseDir: config.value?.baseDir,
            url: urlList.value.join('/'),
            name: row.name,
            type: type
        } as PostFileContentType
    })

    if (o?.isExist) {
        fileContent.value = o?.content || ""
        loading.value = ""
        toRouter.value = '/text'
    }
    // editorFileUrl.value.push()
}

const ondel = async (row: FileStatusType) => {

    await ElMessageBox.confirm(`确定要删除 ${row.name} 文件吗?`)
    let body: PostDelFileType = {
        baseDir: config.value?.baseDir || "",
        url: urlList.value.join('/'),
        name: row.name,
        isDir: row.isDir
    }
    let o = await $fetch('/api/delFile', {
        method: "post",
        body: body
    })

    if (o.status) {
        ElMessage({ message: "删除成功", type: "success" })
        loading.value = "重新当前列表"
        await postFileList(true)
        loading.value = ""
        return
    }
    if (o.err == "noExist") {
        ElMessage({ message: "当前文件(夹)不存在,无法删除", type: "warning" })
        return
    }
    if (o.err == "noDel") {
        ElMessage({ message: "当前文件(夹)无法删除", type: "error" })
        return
    }
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

const ontest = (r: any) => {
    console.log(r)
}

const onchangeRouter = async (v: string[], forceUpdate: boolean) => {

    urlList.value = v
    loading.value = "正在刷新当前目录"
    await postFileList(forceUpdate)
    loading.value = ""
}

const renameVisible = ref(false)
const renameVal = ref("")
const curnameVal = ref("")
const onrenameInit = (r: FileStatusType) => {
    selectFileStatus = r
    renameVal.value = r.name
    curnameVal.value = r.name
    renameVisible.value = true
}
const onrename = async () => {
    if (!selectFileStatus) {
        ElMessage({ message: "没有选中文件(夹)", type: "warning" })
        renameVisible.value = false
        return
    }
    if (renameVal.value == selectFileStatus.name) {
        ElMessage({ message: "名字一致,并没有修改!!!", type: "warning" })
        return
    }
    if (!renameVal.value) {
        ElMessage({ message: "名字为空,请输入名字!", type: "warning" })
        return
    }
    let body: PostRenameFileType = {
        baseDir: config.value?.baseDir || "",
        url: urlList.value.join('/'),
        name: selectFileStatus.name,
        rename: renameVal.value,
        isDir: selectFileStatus.isDir
    }
    popLoading.value = '正在修改名字'
    let res = await $fetch("/api/renameFile", {
        body: body,
        method: 'post'
    })
    popLoading.value = ""
    if (res.status) {
        ElMessage({ message: "修改名字成功!", type: "success" })
        renameVisible.value = false
        loading.value = "正在刷新当前列表"
        await postFileList(true)
        loading.value = ""
        return
    }
    if (res.err == "isDir") {
        ElMessage({ message: "当前修改的是文件,服务器则为文件夹,不允许交叉修改!", type: "warning" })
        renameVisible.value = false
        return
    }
    if (res.err == "isFile") {
        ElMessage({ message: "当前修改的是文件夹,服务器则为文件,不允许交叉修改!", type: "warning" })
        return
    }
    if (res.err == "noExist") {
        ElMessage({ message: "文件(夹)不存在!", type: "warning" })
        return
    }
}

const oprations: ManageFileListoprationType[][] = [[
    { name: "打开", clickfunc: onopen },
    { name: "属性", clickfunc: onproperty }
], [
    { name: "删除", clickfunc: ondel },
    {
        name: "更多", children: [
            { name: "重命名", clickfunc: onrenameInit },
            { name: "测试", clickfunc: ontest }
        ]
    },
]]

const oncolDblclick = async (key: string, r: FileStatusType) => {
    if (key != "name") {
        return
    }
    await onopen(r)
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
    popLoading.value = "正在上传文件"
    const o = await $fetch("/api/uploadFile", {
        method: "post",
        body: form,
        // headers: {
        //     'Content-type': "multipart/form-data; boundary=ABC"
        // }
    })
    popLoading.value = ""
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

        <CompleteManageFileList :file-list="fileList" :url-list="urlList" @change-router="onchangeRouter"
            :loading="loading" :oprations="oprations" @col-dblclick="oncolDblclick">
            <template v-slot:option>
                <!-- 上传 -->
                <el-button type="primary" @click="uploadVisible = true">
                    上传
                </el-button>


                <!-- 间隔 -->
                <div style="width:10px"></div>

                <!-- 新建文件(夹) -->
                <createFile :width="300" @create="oncreate">
                    <el-button type="primary">新建</el-button>
                </createFile>

                <!-- 间隔 -->
                <div style="width:10px"></div>


            </template>
        </CompleteManageFileList>
    </div>

    <!-- 上传弹出层 -->
    <el-drawer v-model="uploadVisible" :show-close="false" direction='ttb' :loading="popLoading">
        <fileUpload @upload="onupload"></fileUpload>
    </el-drawer>

    <!-- 修改名字弹出层 -->
    <el-drawer v-model="renameVisible" :show-close="false" direction='rtl' :loading="popLoading" size="50%">
        <div class="margin">
            <el-text>{{ curnameVal }}</el-text>
        </div>
        <div class="margin">
            <el-input v-model="renameVal" placeholder="请输入名字" />
        </div>

        <div class="margin">
            <el-button type="primary" @click="onrename">确认</el-button>
        </div>
    </el-drawer>
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



.margin {
    margin-bottom: 10px;
}
</style>