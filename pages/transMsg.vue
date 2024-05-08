<script setup lang="ts">
import type { EditorTransDataType, EditorTransDataTypeEditorType, GetTransMsgType, TransType, TransingType } from '~/typings/transData';

const updateTransMsg = useUpdateTransMsg()
const isRunning = ref(false)
const speedLimit = ref(0)
const changeSpeedLimit = ref(0)
const transList = ref<TransingType[]>([])

onMounted(() => {
    watch([updateTransMsg], async () => {
        await onrefresh()
    })
})

const onrun = async () => {
    let body: EditorTransDataType = {
        type: "start"
    }
    let s = await $fetch("/api/transFile", {
        method: "post",
        body
    })
    await onrefresh()
}

const onstop = async () => {
    let body: EditorTransDataType = {
        type: "stop"
    }
    let s = await $fetch("/api/transFile", {
        method: "post",
        body
    })
    await onrefresh()
}

const onclear = async () => {
    let body: EditorTransDataType = {
        type: "clear"
    }
    let s = await $fetch("/api/transFile", {
        method: "post",
        body
    })
    await onrefresh()
}

const onrefresh = async () => {
    let a = await $fetch('/api/transMsg')
    isRunning.value = a.isRuning
    speedLimit.value = a.data.limitSpeed
    transList.value = a.data.list
    console.log(a)
}

const onchangeSpeedLimit = async () => {
    let body: EditorTransDataType = {
        type: "limitSpeed",
        limitSpeed: changeSpeedLimit.value
    }
    let s = await $fetch("/api/transFile", {
        method: "post",
        body
    })
    await onrefresh()
}

const formatDateFunc = (_row: any, _col: any, cell: string) => {
    return formatDate(Number(cell))
}

const displayExtraMsg = (r: TransingType, type: "isCut" | "isIncludeDir" | "isUrgent") => {
    if (type == "isCut") {
        return r.isCut ? "剪切" : "复制"
    }
    if (type == "isIncludeDir") {
        return r.isIncludeDir ? "包含文件夹" : "不包含文件夹"
    }
    if (type == "isUrgent") {
        return r.isUrgent ? "加急" : "队列"
    }
}

const getStat = (r: TransingType) => {
    console.log(r, r.status)
    if (r.status == "done") {
        return "已完成"
    }
    if (r.status == "ready") {
        return "正准备"
    }
    if (r.status == "stop") {
        return "已停止"
    }
    if (r.status == "transing") {
        return "传输中"
    }
}

const setStat = async (r: TransingType, type: EditorTransDataTypeEditorType) => {
    let body: EditorTransDataType = {
        type: "editor",
        editorData: r,
        editorType: type
    }
    let s = await $fetch("/api/transFile", {
        method: "post",
        body
    })
    await onrefresh()
}



</script>
<template>
    <div class="status">状态:{{ isRunning ? '运行' : "停止" }}; 速率:{{ speedLimit }}KB</div>
    <div class="speed">
        <el-input type="number" v-model="changeSpeedLimit" style="width: 120px"></el-input>
        <div style="width:10px"></div>
        <el-button type="primary" @click="onchangeSpeedLimit">更新速率</el-button>
    </div>
    <div class="btn">
        <el-button type="primary" @click="onrefresh">刷新</el-button>
        <el-button type="primary" @click="onclear">清空</el-button>
        <el-button type="primary" @click="onstop">停止</el-button>
        <el-button type="primary" @click="onrun">运行</el-button>
    </div>
    <div>
        <el-table :data="transList" class="table">

            <el-table-column prop="from" label="从...复制" width="130" />
            <el-table-column prop="to" label="粘贴到..." width="130" />
            <el-table-column prop="translatedCount" label="已传输个数" width="95" />
            <el-table-column prop="ctime" label="创建时间" width="120" :formatter="formatDateFunc" />
            <el-table-column prop="mtime" label="修改时间" width="120" :formatter="formatDateFunc" />
            <el-table-column fixed="right" label="额外信息" width="80">
                <template #default="scope">
                    <div>
                        <el-text type="warning" size="large">{{ displayExtraMsg(scope.row, 'isCut') }}</el-text>
                    </div>
                    <div>
                        <el-text type="warning" size="large">{{ displayExtraMsg(scope.row, 'isUrgent') }}</el-text>
                    </div>
                    <div>
                        <el-text type="warning" size="large">{{ displayExtraMsg(scope.row, 'isIncludeDir') }}</el-text>
                    </div>

                </template>
            </el-table-column>
            <el-table-column fixed="right" label="状态" width="100">
                <template #default="scope">
                    <div class="btn">
                        <el-text type="primary" size="large">{{ getStat(scope.row) }}</el-text>
                    </div>
                    <div class="btn">
                        <el-button type="primary" @click="setStat(scope.row, 'delay')">延后</el-button>
                    </div>
                    <div class="btn">
                        <el-button type="primary" @click="setStat(scope.row, 'urgent')">优先</el-button>
                    </div>
                    <div class="btn">
                        <el-button type="primary" @click="setStat(scope.row, 'delete')">删除</el-button>
                    </div>

                </template>
            </el-table-column>
        </el-table>
    </div>

</template>
<style scoped>
.status {
    margin: 10px;
}

.speed {
    display: flex;
    margin: 10px;
}

.btn {
    margin: 10px;
}

.table {
    width: 100%
}
</style>