<script setup lang="ts">
import type { EditorTransDataType, GetTransMsgType, TransType, TransingType } from '~/typings/transData';

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



</script>
<template>
    <div>状态:{{ isRunning ? '运行' : "停止" }}; 速率:{{ speedLimit }}KB</div>
    <div style="display: flex">
        <el-input type="number" v-model="changeSpeedLimit" style="width: 120px"></el-input>
        <div style="width:10px"></div>
        <el-button type="primary" @click="onchangeSpeedLimit">更新速率</el-button>
    </div>
    <div>
        <el-button type="primary" @click="onrefresh">刷新</el-button>
        <el-button type="primary" @click="onclear">清空</el-button>
        <el-button type="primary" @click="onstop">停止</el-button>
        <el-button type="primary" @click="onrun">运行</el-button>
    </div>

</template>
<style scoped></style>