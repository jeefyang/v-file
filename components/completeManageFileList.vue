<script setup lang="ts">
import type { FileStatusType, ManageFileListoprationType } from '~/typings';
import { RefreshLeft, Back } from '@element-plus/icons-vue'
import type { VNodeRef } from 'vue';


const filterStr = ref("")

const props = defineProps<{
    urlList: string[],
    loading: string,
    oprations?: ManageFileListoprationType[][],
    fileList: FileStatusType[]
    isSelection?: boolean,
    clearSelect?: number
}>()

const urlListModel = ref(<string[]>[""])

const emits = defineEmits<{
    changeRouter: [v: string[], forceUpdate: boolean],
    colClick: [key: string, row: FileStatusType],
    colDblclick: [key: string, row: FileStatusType],
    colContextmenu: [key: string, row: FileStatusType],
    colSelect: [rows: FileStatusType[]]
}>()

onMounted(() => {

    watch([() => props.urlList], () => {
        urlListModel.value = props.urlList
        console.log(props.urlList)
    })
    urlListModel.value = props.urlList
})


const onchangeRouter = (v: string[]) => {
    emits("changeRouter", v, false)
}

const oncolClick = (key: string, row: FileStatusType) => {
    emits("colClick", key, row)
}

const oncolDblclick = (key: string, row: FileStatusType) => {
    emits("colDblclick", key, row)
}

const oncolContextmenu = (key: string, row: FileStatusType) => {
    emits("colContextmenu", key, row)
}

const oncolSelect = (rows: FileStatusType[]) => {
    emits("colSelect", rows)
}

const onrefresh = () => {
    emits("changeRouter", urlListModel.value, true)
}

const onreback = () => {
    if (urlListModel.value.length == 1) {
        ElMessage({ message: "不能再回退了", type: "warning" })
        return
    }
    emits("changeRouter", urlListModel.value.slice(0, -1), false)
}


</script>
<template>
    <!-- <el-col :span="24"> -->
    <div>
        <routerUrl v-model="urlListModel" @change-router="onchangeRouter"></routerUrl>
    </div>
    <div style="display: flex">
        <slot name="option"></slot>
        <!-- 回退 -->
        <el-button type="primary" @click="onreback">
            <el-icon size="30px" color="#fff">
                <Back />
            </el-icon>
        </el-button>
        <!-- 间隔 -->
        <div style="width:10px"></div>
        <!-- 刷新 -->
        <el-button type="primary" @click="onrefresh">
            <el-icon size="30px" color="#fff">
                <RefreshLeft />
            </el-icon>
        </el-button>
        <!-- 间隔 -->
        <div style="width:10px"></div>
        <!-- 过滤 -->
        <el-input v-model="filterStr" style="width: 120px" placeholder="过滤" />
    </div>


    <div class="filelist">
        <manage-file-list :clear-select="clearSelect" :file-list="fileList" :filter-key="filterStr" :loading="loading" :oprations="oprations"
            :is-selection="isSelection" @col-dblclick="oncolDblclick" @col-click="oncolClick"
            @col-contextmenu="oncolContextmenu" @col-select="oncolSelect"></manage-file-list>
    </div>
</template>
<style scoped>
.filelist {
    flex-grow: 1;
    overflow: auto;
}
</style>