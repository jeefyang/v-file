<script setup lang="ts">
import type { FileStatusType } from '~/typings';
import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue'

const config = await useConfig()
const leftFileList = ref(<FileStatusType[]>[])
const leftUrlList = ref([""])
const leftLoading = ref("")
const leftDisplay = ref(true)

const rightFileList = ref(<FileStatusType[]>[])
const rightUrlList = ref([""])
const rightLoading = ref("")
const rightDisplay = ref(false)

const displayTransBtn = ref(false)


const postFileList = async (site: -1 | 1, forceRefresh?: boolean) => {
    const a = await useFileList({
        baseDir: config.value?.baseDir || "./",
        url: (site == -1 ? leftUrlList : rightUrlList).value.join('/'),
        ignore: (config.value?.ignore || []).join("||")
    }, forceRefresh);
    (site == -1 ? leftFileList : rightFileList).value.splice(0, (site == -1 ? leftFileList : rightFileList).value.length);
    (site == -1 ? leftFileList : rightFileList).value.push(...a?.list || []);
}

const oncolDblclick = (site: -1 | 1, key: string, row: FileStatusType) => {

}

const onchangeRouter = async (site: -1 | 1, v: string[], forceRefresh: boolean) => {
    (site == -1 ? leftUrlList : rightUrlList).value = v;
    (site == -1 ? leftLoading : rightLoading).value = "正在刷新当前目录";
    await postFileList(site, forceRefresh);
    (site == -1 ? leftLoading : rightLoading).value = "";
}

const onjumpSite = (site: -1 | 1) => {

}

const onresize = () => {
    console.log('resize')
    console.log(window.innerWidth, window.innerHeight)
    
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
        <div class="left content">
            <CompleteManageFileList :file-list="leftFileList" :url-list="leftUrlList"
                @change-router="(v, f) => { onchangeRouter(-1, v, f) }" :loading="leftLoading"
                @col-dblclick="(key, row) => { oncolDblclick(-1, key, row) }" is-selection>
                <template v-slot:option>
                    <el-text type="primary" size="large">左</el-text>
                    <div style="width: 10px;"></div>
                    <el-button type="primary" @click="onjumpSite(-1)">
                        <el-icon size="30px" color="#fff">
                            <DArrowRight />
                        </el-icon>
                    </el-button>
                </template>

            </CompleteManageFileList>
        </div>
        <!-- 右 -->
        <div class="rigth content" >
            <CompleteManageFileList :file-list="rightFileList" :url-list="rightUrlList"
                @change-router="(v, f) => { onchangeRouter(-1, v, f) }" :loading="rightLoading"
                @col-dblclick="(key, row) => { oncolDblclick(1, key, row) }" is-selection>
                <template v-slot:option>
                    <el-text type="primary" size="large">右</el-text>
                    <div style="width: 10px;"></div>
                    <el-button type="primary" @click="onjumpSite(1)">
                        <el-icon size="30px" color="#fff">
                            <DArrowLeft />
                        </el-icon>
                    </el-button>
                </template>

            </CompleteManageFileList>
        </div>
    </div>
</template>
<style scoped>
.big {
    display: flex;
    /* flex-wrap: wrap; */
    height: 90%;
    /* flex-direction: column; */
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
</style>