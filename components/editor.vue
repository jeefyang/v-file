<script setup lang="ts">
import type { PostFileListType } from '~/typings';

const config = await useFetch("/api/getConfig")
const urlList = ref(["."])
let p: PostFileListType = {
    baseDir: config.data.value?.baseDir || "./",
    url: urlList.value.join('/'),
    ignore: (config.data.value?.ignore || []).join("||")
}
console.log(p)
const dirList = await useFetch("/api/fileList", {
    method: "post",
    body: p,
    // headers:{
    //     "Content-Type":"multipart/form-data"
    // }
})
console.log(config)
console.log(dirList.data.value?.list)
</script>
<template>
    <div>
       123
    </div>
    <el-table :data="dirList.data.value?.list||[]" border style="width: 100%">   
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="mtimeMs" label="Date" width="180" />
        </el-table>
    <!-- <div>editor</div> -->

</template>
<style scoped></style>