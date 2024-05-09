<script setup lang="ts">
const visible = ref(false)
const val = ref("")

defineProps<{
    width: number
    placeholder: string
}>()

const emit = defineEmits<{
    enterClick: [v: string]
}>()

const initCreate = () => {
    val.value = ""
    visible.value = true
}

const onenterClick = () => {
    if (!val.value) {
        ElMessage({ message: "输入框不能为空", type: "warning" })
        return
    }
    visible.value = false
    emit('enterClick', val.value)
}


</script>
<template>
    <el-popover :visible="visible" placement="bottom" :width="width" trigger="click">
        <template #reference>
            <div @click="initCreate">
                <slot></slot>
            </div>
        </template>
        <div style="display: flex;flex-direction: column;">
            <el-input v-model="val" :placeholder="placeholder" />
            <div style="height: 10px;"></div>
            <div>
                <el-button type="default" @click="visible = false">取消</el-button>
                <el-button type="primary" @click="onenterClick">确定</el-button>
            </div>
        </div>
    </el-popover>
</template>
<style scoped></style>