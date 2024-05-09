<script setup lang="ts">
import type { FileStatusType } from '~/typings';
import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
import type { ElTable } from 'element-plus';
import type { EditorTransDataType, TransType } from '~/typings/transData';
import path from "path-browserify"

const config = await useConfig()
const leftFileList = ref(<FileStatusType[]>[])
const leftUrlList = ref([""])
const leftLoading = ref("")
const leftDisplay = ref(true)
const leftClearSelect = ref(0)
let leftSelectList: FileStatusType[] = []

const rightFileList = ref(<FileStatusType[]>[])
const rightUrlList = ref([""])
const rightLoading = ref("")
const rightDisplay = ref(false)
// const rightClearSelect = ref(0)
// let rightSelectList: FileStatusType[] = []

const isVertical = ref(false)
const isCut = ref(false)
const isIncludeDir = ref(false)
const isurgent = ref(false)


const postFileList = async (site: -1 | 1, forceRefresh?: boolean) => {
    const a = await useFileList({
        baseDir: config.value?.baseDir || "./",
        url: (site == -1 ? leftUrlList : rightUrlList).value.join('/'),
        ignore: (config.value?.ignore || []).join("||")
    }, forceRefresh);
    (site == -1 ? leftFileList : rightFileList).value.splice(0, (site == -1 ? leftFileList : rightFileList).value.length);
    (site == -1 ? leftFileList : rightFileList).value.push(...a?.list || []);
}

const oncolDblclick = async (site: -1 | 1, key: string, row: FileStatusType) => {
    if (key != "name") {
        return
    }
    await onopen(site, row)
    return
}

const onchangeRouter = async (site: -1 | 1, v: string[], forceRefresh: boolean) => {
    (site == -1 ? leftUrlList : rightUrlList).value = v;
    (site == -1 ? leftLoading : rightLoading).value = "正在刷新当前目录";
    await postFileList(site, forceRefresh);
    (site == -1 ? leftLoading : rightLoading).value = "";
}

const onjumpSite = (site: -1 | 1) => {
    leftDisplay.value = site == -1
    rightDisplay.value = site == 1
}

const oncolSelect = (site: -1 | 1, rows: FileStatusType[]) => {
    // console.log("select", site)
    if (site == -1) {
        leftSelectList = [...rows]
    }
    else {
        // rightSelectList = [...rows]
    }
}

const onopen = async (site: -1 | 1, row: FileStatusType) => {
    if (row.isDir) {
        (site == -1 ? leftLoading : rightLoading).value = "正在打开文件夹";
        (site == -1 ? leftUrlList : rightUrlList).value.push(row.name);
        await postFileList(site, false);
        (site == -1 ? leftLoading : rightLoading).value = ""
        return
    }
    ElMessage({ message: "文件不需要打开", type: "warning" })

    // editorFileUrl.value.push()
}

const ontrans = async () => {
    const addList: TransType[] = []
    if (leftSelectList.length == 0) {
        ElMessage({ message: "请选中左边文件(夹)", type: "warning" })
        return
    }
    let time = (new Date()).getTime()
    if (leftSelectList.length == 1) {
        addList.push({

            from: path.join(config.value?.baseDir || "", ...leftUrlList.value, leftSelectList[0].name),
            to: path.join(config.value?.baseDir || "", ...rightUrlList.value),
            isIncludeDir: isIncludeDir.value,
            isCut: isCut.value,
            isUrgent: isurgent.value,
            mtime: time,
            ctime: time
        })
    }
    else {
        for (let i = 0; i < leftSelectList.length; i++) {
            let c = leftSelectList[i]
            addList.push({
                from: path.join(config.value?.baseDir || "", ...leftUrlList.value, c.name),
                to: path.join(config.value?.baseDir || "", ...rightUrlList.value),
                isIncludeDir: true,
                isCut: isCut.value,
                isUrgent: isurgent.value,
                mtime: time,
                ctime: time
            })
        }
    }
    let body: EditorTransDataType = {
        type: "add",
        addList
    }

    leftLoading.value = "正在触发传输"
    rightLoading.value = "正在触发传输"
    let s = await $fetch("/api/transFile", {
        method: "post",
        body
    })
    leftLoading.value = ""
    rightLoading.value = ""
    leftClearSelect.value++
    ElMessage({
        message: "已经发送传输指令", type: "success"
    })
    // rightClearSelect.value++
}

const onresize = () => {
    if (window.innerWidth > 500) {
        isVertical.value = false
    }
    else {
        isVertical.value = true
    }
}

onMounted(() => {
    onchangeRouter(-1, leftUrlList.value, false)
    onchangeRouter(1, rightUrlList.value, false)
    window.addEventListener("resize", () => {
        onresize()
    })
    onresize()
})

</script>
<template>
    <div class="big">
        <!-- 左 -->
        <div :class="'left content ' + (isVertical ? 'vertical' : 'horizontal')" v-show="!isVertical || leftDisplay">
            <CompleteManageFileList :clear-select="leftClearSelect" :file-list="leftFileList" :url-list="leftUrlList"
                @change-router="(v, f) => { onchangeRouter(-1, v, f) }" :loading="leftLoading"
                @col-dblclick="(key, row) => { oncolDblclick(-1, key, row) }" is-selection
                @col-select="(rows) => { oncolSelect(-1, rows) }">
                <template v-slot:option>
                    <el-text type="primary" size="large">左</el-text>
                    <div style="width: 10px;"></div>
                    <el-button v-if="isVertical" type="primary" @click="onjumpSite(1)">
                        <el-icon size="30px" color="#fff">
                            <DArrowRight />
                        </el-icon>
                    </el-button>
                </template>

            </CompleteManageFileList>
        </div>
        <!-- 右 -->
        <div :class="'right content ' + (isVertical ? 'vertical' : 'horizontal')" v-show="!isVertical || rightDisplay">
            <CompleteManageFileList :file-list="rightFileList" :url-list="rightUrlList"
                @change-router="(v, f) => { onchangeRouter(1, v, f) }" :loading="rightLoading"
                @col-dblclick="(key, row) => { oncolDblclick(1, key, row) }">
                <template v-slot:option>
                    <el-text type="primary" size="large">右</el-text>
                    <div style="width: 10px;"></div>
                    <el-button v-if="isVertical" type="primary" @click="onjumpSite(-1)">
                        <el-icon size="30px" color="#fff">
                            <DArrowLeft />
                        </el-icon>
                    </el-button>
                </template>

            </CompleteManageFileList>
        </div>
    </div>
    <div class="bottom">
        <div style="width: 10px;"></div>
        <el-switch v-model="isCut" inline-prompt active-text="剪切" inactive-text="复制" size="large" />
        <div style="width: 10px;"></div>
        <el-switch v-model="isIncludeDir" inline-prompt active-text="包含文件夹" inactive-text="不包含文件夹" size="large" />
        <div style="width: 10px;"></div>
        <el-switch v-model="isurgent" inline-prompt active-text="急件" inactive-text="队列" size="large" />
        <div style="width: 10px;"></div>
        <el-button type="primary" @click="ontrans">传输</el-button>
    </div>
</template>
<style scoped>
.big {
    display: flex;
    /* flex-wrap: wrap; */
    height: 88%;
    /* flex-direction: column; */
}

.bottom {
    margin-top: 5px;
    display: flex;
}

.content {
    position: relative;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
}

.horizontal {
    position: relative;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
}

.vertical {
    position: relative;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
}
</style>