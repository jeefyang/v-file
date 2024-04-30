<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"
//@ts-ignore
import { ArrowRightBold,House } from '@element-plus/icons-vue'

const isStr = ref(false)
const urlStr = ref("")

let isEmitInput = false
let isEmitInputTimeOut = 100

const model = defineModel<string[]>()
//@ts-ignore
const divref = ref(<MaybeElement>null)
const cloneModel = ref(<string[]>model.value)
const emit = defineEmits<{
    changeRouter: [v: string[]]
}>()
watch([model], () => {
    cloneModel.value = model.value || []
})

onClickOutside(divref, (e) => {
    isEmitInput = false
    if (!isStr.value) {
        return
    }
    isStr.value = false
    // console.log("out")
})
// urlStr.value = cloneModel.value?.join("/") || ""

const backgroundClick = () => {
    urlStr.value = cloneModel.value?.join("/") || ""
    isStr.value = true
}

const selectRouterIndex = (index: number) => {
    cloneModel.value = cloneModel.value?.slice(0, index + 1)
    urlStr.value = cloneModel.value?.join("/") || ""
    emit("changeRouter", cloneModel.value || [])
}

const changeRouter = (v: string) => {
    isEmitInput = true
    setTimeout(() => {
        if (!isEmitInput) {
            return
        }
        if (v[0] != '/')
            v = '/' + v
        cloneModel.value = v.split('/')
        urlStr.value = cloneModel.value?.join("/") || ""
        isStr.value = false
        emit("changeRouter", cloneModel.value || [])
    }, isEmitInputTimeOut);

}

</script>
<template>
    <div class="routerUrl_content" ref="divref">
        <template v-if="!isStr">
            <div class="background" @click="backgroundClick"></div>
            <template v-for=" (temp, index) in cloneModel">
                <div class="urlBtn">
                    <template v-if="temp">
                        <el-button type="info" @click="selectRouterIndex(index)">{{ temp }}</el-button></template>
                    <template v-if="!temp">
                        <el-button type="info" @click="selectRouterIndex(index)" ><el-icon size="20" color="#fff"><House /></el-icon></el-button>
                    </template>
                    
                </div>
                <div @click="backgroundClick" class="urlInterval_big">
                    <div class="urlInterval">
                        <el-icon size="20" color="#66b1ff">
                            <ArrowRightBold />
                        </el-icon>
                    </div>
                </div>

            </template>
        </template>
        <template v-if="isStr">
            <el-input style="width: 95%" v-model="urlStr" @change="changeRouter" />
        </template>
    </div>


</template>
<style scoped>
.background {
    width: 100%;
    position: absolute;
    top: 0px;
    /* background-color: red; */
    height: 35px;
}

.routerUrl_content {
    overflow: auto;
    width: 100%;
    /* position: absolute; */
    top: 0px;
    display: flex;
    height: 35px;
}

.urlBtn {
    top: 0px;
    position: relative;
}

.urlInterval {
    width: 30px;
    top: 0px;
    position: relative;
    text-align: center;
    align-items: center;
}
.urlInterval_big{
    display: flex;
    align-items: center;
}
</style>