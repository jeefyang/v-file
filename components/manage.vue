<script setup lang="ts">
import type { PostFileListType, FileStatusType, PostFileContentType } from '~/typings';
//@ts-ignore
import { Files, Folder } from '@element-plus/icons-vue'

const config = await useFetch("/api/getConfig")
const editorFilter = useEditorFilter()
const editorFileUrl = useEidtorFileUrl()
const manageLoading = useManageLoading()
const displayEditorFile = useDisplayEditorFile()
const fileContentLoading = useFileContentLoading()
const fileContent = useFileContent()
const urlList = ref([""])
const fileList = ref(<FileStatusType[]>[])
const postFileList = async () => {
    const a = await useFetch("/api/fileList", {
        method: "post",
        body: <PostFileListType>{
            baseDir: config.data.value?.baseDir || "./",
            url: urlList.value.join('/'),
            ignore: (config.data.value?.ignore || []).join("||")
        },
        deep: false
    })
    fileList.value.splice(0, fileList.value.length)
    fileList.value.push(...a.data.value?.list || [])
}

await postFileList()


const formatDateFunc = (row: FileStatusType, _col: any, cell: string) => {
    return formatDate(Number(cell))
}
const formatSizeFunc = (row: FileStatusType, _col: any, cell: string) => {
    if (row.isDir) {
        return "0"
    }
    let size = Number(cell)
    return formatSize(size)
}
const tableRowClassName = ({ row }: {
    row: FileStatusType
}) => {
    if (row.isDir) {
        return "folder"
    }
    else {
        return "file"
    }
}

const onopen = async (row: FileStatusType) => {
    if (row.isDir) {
        manageLoading.value = true
        urlList.value.push(row.name)
        await postFileList()
        manageLoading.value = false
        return
    }
    editorFileUrl.value = urlList.value.join('/') + `/${row.name}`
    fileContentLoading.value = true
    displayEditorFile.value = true
    navigateTo('/text')
    fileContentLoading.value = true
    await new Promise((res)=>{
        setTimeout(() => {
            res(undefined)
        }, 2000);
    })
    let o = await useFetch('/api/fileContent', {
        method: "post",
        body: {
            baseDir: config.data.value?.baseDir,
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

const onchangeRouter = async (v: string[]) => {
    urlList.value = v
    await postFileList()
}

</script>
<template>
    <div class="big">
        <div class="top">
            <div>
                <routerUrl v-model="urlList" @change-router="onchangeRouter"></routerUrl>
            </div>
            <div class="filterInput">
                <el-input v-model="editorFilter" style="width: 150px" placeholder="过滤" />
            </div>


        </div>
        <div class="content">
            <el-table :data="filterFileListByName(fileList || [], editorFilter)" lazy highlight-current-row border
                style="width: 100%" :default-sort="{ prop: 'name', order: 'ascending' }" height="100%"
                :row-class-name="tableRowClassName" v-loading="manageLoading">

                <el-table-column prop="name" sortable :sort-method="sortFileListByName" label="名称" width="180">
                    <template #default="scope">
                        <div class="filename">
                            <template v-if="scope.row.isDir">
                                <el-icon color="#E6A23C" size="20">
                                    <Folder />
                                </el-icon>
                            </template>
                            <template v-if="!scope.row.isDir">
                                <el-icon color="#fff" size="20">
                                    <Files />
                                </el-icon>
                            </template>
                            <div class="filename_interval"></div>
                            <div class="filename_content">{{ scope.row.name }}</div>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column prop="mtimeMs" sortable :sort-method="sortFileListByDate" label="修改时间"
                    :formatter="formatDateFunc" width="120" />
                <el-table-column prop="size" sortable :sort-method="sortFileListBySize" label="文件大小"
                    :formatter="formatSizeFunc" width="100" />
                <el-table-column fixed="right" label="操作" width="100">
                    <template #default="scope">
                        <div>
                            <el-button link type="primary" size="small" @click="onopen(scope.row)">
                                打开
                            </el-button>
                            <el-button link type="primary" size="small">
                                下载
                            </el-button>
                        </div>
                        <div>
                            <el-button link type="primary" size="small">
                                删除
                            </el-button>
                            <el-button link type="primary" size="small">
                                属性
                            </el-button>
                        </div>

                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>


    <!-- <div>editor</div> -->

</template>
<style scoped>
.big {
    /* overflow: auto; */
    height: 95%
}

.top {
    height: 70px;
}

.filterInput {
    top: 5px;
    position: relative;
}

.content {
    overflow: auto;
    top: 5px;
    height: calc(100% - 75px);
    position: relative;
    width: 100%;
}

.el-table :deep(.folder) {
    /* --el-table-tr-bg-color: #272219 */
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.filename {
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
}

.filename_content {
    word-break: break-all;
}

.filename_interval {
    width: 5px;

}
</style>