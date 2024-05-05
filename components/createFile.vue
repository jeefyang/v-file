<script setup lang="ts">
const visible = ref(false)
const name = ref("")
const isDir = ref(false)

defineProps<{
    width: number
}>()

const emit = defineEmits<{
    create: [name: string, isDir: boolean]
}>()

const initCreate = () => {
    name.value = ""
    isDir.value = false
    visible.value = true
}

const clickCreate = () => {

    if (!name.value) {
        ElMessage({ message: "请输入文件(夹)名", type: "warning" })
        return
    }
    visible.value = false
    emit('create', name.value, isDir.value)
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
            <el-input v-model="name" placeholder="输入新建文件(夹)名" />
            <el-switch v-model="isDir" inline-prompt active-text="文件夹" inactive-text="文件" size="large" />
            <div>
                <el-button type="default" @click="visible = false">取消</el-button>
                <el-button type="primary" @click="clickCreate">创建</el-button>
            </div>
        </div>
    </el-popover>
</template>
<style scoped></style>