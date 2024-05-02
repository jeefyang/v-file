<script setup lang="ts">
import { Files, Folder } from '@element-plus/icons-vue'
import type { FileStatusType } from '~/typings';

defineProps<{
    fileList: FileStatusType[]
    filterKey: string
    loading?: string
    oprations?: {
        name: string,
        clickfunc: (r: FileStatusType) => void
    }[][]
}>()

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

</script>
<template>
    <el-table :data="filterFileListByName(fileList || [], filterKey)" lazy highlight-current-row border
        style="width: 100%" :default-sort="{ prop: 'name', order: 'ascending' }" height="100%"
        :row-class-name="tableRowClassName" v-loading="!!loading" :element-loading-text="loading">

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
        <el-table-column prop="size" sortable :sort-method="sortFileListBySize" label="文件大小" :formatter="formatSizeFunc"
            width="100" />
        <el-table-column v-if="oprations" fixed="right" label="操作" width="100">
            <template #default="scope">
                <div v-for="c in oprations">
                    <el-button v-for="cc in c" link type="primary" size="small" @click="cc.clickfunc(scope.row)">
                        {{ cc.name }}
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>
<style scoped>
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