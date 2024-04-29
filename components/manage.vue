<script setup lang="ts">
import type { PostFileListType, FileStatusType } from '~/typings';

const config = await useFetch("/api/getConfig")
const editorFilter = useEditorFilter()
const urlList = ref(["."])
let p: PostFileListType = {
    baseDir: config.data.value?.baseDir || "./",
    url: urlList.value.join('/'),
    ignore: (config.data.value?.ignore || []).join("||")
}
console.log(p)
const fileList = await useFetch("/api/fileList", {
    method: "post",
    body: p,
    // headers:{
    //     "Content-Type":"multipart/form-data"
    // }
})

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

</script>
<template>
    <div class="big">
        <div class="top">
            <el-input v-model="editorFilter" style="width: 240px" placeholder="过滤" />
        </div>
        <div class="content">
            <el-table :data="filterFileListByName(fileList.data.value?.list || [], editorFilter)" lazy
                highlight-current-row border style="width: 100%" :default-sort="{ prop: 'name', order: 'ascending' }"
                height="100%" :row-class-name="tableRowClassName">
                <el-table-column prop="name" sortable :sort-method="sortFileListByName" label="名称" width="180" />
                <el-table-column prop="mtimeMs" sortable :sort-method="sortFileListByDate" label="修改时间"
                    :formatter="formatDateFunc" width="180" />
                <el-table-column prop="size" sortable :sort-method="sortFileListBySize" label="文件大小"
                    :formatter="formatSizeFunc" width="180" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <div>
                            <el-button link type="primary" size="small">
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
    height: 35px;
}

.content {
    overflow: auto;
    top: 5px;
    height: calc(100% - 40px);
    position: relative;
    width: 100%;
}

.el-table :deep(.folder) {
    /* --el-table-tr-bg-color: #272219 */
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>