<script setup lang="ts">
import { Files, Folder, ArrowDown } from '@element-plus/icons-vue'
import type { FileStatusType, ManageFileListoprationType, ManageFileListoprationChildType } from '~/typings';
import { onClickOutside } from "@vueuse/core"
import type { VNodeRef } from 'vue';
import type { ElTable } from 'element-plus';

const props = defineProps<{
    fileList: FileStatusType[]
    filterKey: string
    loading?: string
    oprations?: ManageFileListoprationType[][]
    isSelection?: boolean
    clearSelect?: number
}>()

const emits = defineEmits<{
    colClick: [key: string, row: FileStatusType],
    colDblclick: [key: string, row: FileStatusType],
    colContextmenu: [key: string, row: FileStatusType],
    colSelect: [rows: FileStatusType[]]
}>()

const alertDiv = ref<HTMLDivElement>()
const displayAlertDiv = ref<{ x: number, y: number }>()
const alertDivChildren = ref<ManageFileListoprationChildType[]>([])
const alertDivRow = ref<FileStatusType>()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
onMounted(() => {

    onClickOutside(alertDiv.value, (e) => {
        if (!displayAlertDiv.value) {
            return
        }
        displayAlertDiv.value = <any>(null)

    })

    watch([() => props.clearSelect], () => {
        multipleTableRef.value?.clearSelection()
    })
})

const onColClick = (r: FileStatusType, c: { property: string }, cell: HTMLTableCellElement) => {
    // console.log(c.property)
    emits("colClick", c.property, r)
}

const onColDblclick = (r: FileStatusType, c: { property: string }, cell: HTMLTableCellElement) => {
    console.log(c.property)
    emits("colDblclick", c.property, r)
}

const onColContextmenu = (r: FileStatusType, c: { property: string }, cell: HTMLTableCellElement) => {
    emits("colContextmenu", c.property, r)
}

const onColSelect = (rs: FileStatusType[]) => {
    emits("colSelect", rs)
}

const oprationMoreClick = (e: MouseEvent, v: FileStatusType, children: ManageFileListoprationChildType[]) => {
    alertDivRow.value = v
    alertDivChildren.value = [...children]
    if (!displayAlertDiv.value) {
        displayAlertDiv.value = { x: e.clientX, y: e.clientY }
    }
    else {
        displayAlertDiv.value = <any>(null)
    }

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
    <el-table ref="multipleTableRef" :data="filterFileListByName(fileList || [], filterKey)" lazy highlight-current-row
        border style="width: 100%" :default-sort="{ prop: 'name', order: 'ascending' }" height="100%"
        :row-class-name="tableRowClassName" v-loading="!!loading" :element-loading-text="loading"
        @cell-click="onColClick" @cell-dblclick="onColDblclick" @cell-contextmenu="onColContextmenu"
        @selection-change="onColSelect">

        <!-- 选择器 -->
        <el-table-column v-if="isSelection" type="selection" width="45"></el-table-column>

        <!-- 名称 -->
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
        <!-- 修改时间 -->
        <el-table-column prop="mtimeMs" sortable :sort-method="sortFileListByDate" label="修改时间"
            :formatter="formatDateFunc" width="120" />
        <!-- 文件大小 -->
        <el-table-column prop="size" sortable :sort-method="sortFileListBySize" label="文件大小" :formatter="formatSizeFunc"
            width="100" />
        <!-- 额外操作 -->
        <el-table-column v-if="oprations" fixed="right" label="操作" width="100">
            <template #default="scope">
                <div class="flexDiv" v-for="c in oprations">
                    <template v-for="cc in c">
                        <el-button link type="primary" size="small"
                            @click="(cc.clickfunc ? cc?.clickfunc(scope.row) : oprationMoreClick($event, scope.row, cc?.children || []))">
                            {{ cc.name }}
                        </el-button>
                    </template>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <div ref="alertDiv" class="alert" v-show="!!displayAlertDiv"
        :style="{ left: (displayAlertDiv?.x || 0) + 'px', top: (displayAlertDiv?.y || 0) + 'px' }">
        <div v-for="c in alertDivChildren">
            <el-button link type="primary" size="small"
                @click="c.clickfunc && c?.clickfunc(<any>alertDivRow); displayAlertDiv = <any>null">
                {{ c.name }}
            </el-button>
        </div>

    </div>
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

.alert {
    position: fixed;
    /* width: 100px; */
    z-index: 100;
    display: flex;
    flex-direction: column;
    translate: -50% 10px;
    align-items: center;
    align-content: center;
    background-color: #323232;
    padding: 10px;
}

.alert div {
    margin: 5px;
}

/* 
.flexDiv {
    display: flex;
    justify-content: space-between;
} */
</style>