<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'

const emit = defineEmits<{
    upload: [list: FileList]
}>()

const highlight = ref(false)

function preventDefaults(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e: DragEvent) {
    preventDefaults(e)
    var dt = e.dataTransfer;
    uploadFiles(dt?.files)
}

async function readFile() {
    return new Promise<FileList>((resolve, _reject) => {
        let input = document.createElement("input")
        input.setAttribute("type", "file")
        input.onchange = (e: any) => {
            resolve(e.target.files)
        }
        input.click()
    })
}

async function uploadFiles(list?: FileList) {
    if (!list) {
        ElMessage({ message: "没有文件需要上传", type: "warning" })
        return
    }
    emit('upload', list)
}


const onclick = async (e: MouseEvent) => {
    let data = await readFile()
    uploadFiles(data)
}

const ondragenter = (e: DragEvent) => {
    preventDefaults(e)
    highlight.value = true
}

const ondragleave = (e: DragEvent) => {
    preventDefaults(e)
    highlight.value = false
}

</script>
<template>
    <div @dragenter="ondragenter" @dragover="preventDefaults" @dragleave="ondragleave" @drop="handleDrop"
        @click="onclick" class="drop_area --el-box-shadow-dark" id="drop_area">
        <el-icon size="80">
            <UploadFilled />
        </el-icon>
        <div :class="highlight ? 'highlight' : 'nohighlight'">(拖放/点击)上传</div>
    </div>
</template>
<style scoped>
.drop_area {
    width: 80%;
    height: 80%;
    position: absolute;
    top: 10%;
    left: 10%;
    border: 1px dashed #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.drop_area:hover {
    border: 1px dashed #409eff;
}

.highlight {
    color: #409eff;
}

.nohighlight {
    color: #fff;
}
</style>