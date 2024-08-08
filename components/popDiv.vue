<script setup lang="ts">



const model_visible=defineModel('visible',{required:false,default:false})

const props = defineProps({
    width: {
        default: 100,
        type: Number
    },
    height: {
        default: 100,
        type: Number
    },
    /** div颜色 */
    color: {
        default: "#242e3d",
        type: String
    },
    /** 是否有背景 */
    hasBackground: {
        default: true,
        type: Boolean
    },
    backColor: {
        default: "#00000077",
        type: String
    }
});

const left = ref(0)
const top = ref(0)

let setCenterFunc = () => {
    let w = window.innerWidth
    let h = window.innerHeight

    top.value = (h - props.height) / 2
    left.value = (w - props.width) / 2
}



watch([() => props.width, () => props.height], () => {
    setCenterFunc()
});
watch([()=>model_visible],()=>{
    setCenterFunc()
})


onMounted(() => {
    setCenterFunc()
})

</script>
<template>
        <div v-if="model_visible" class="pos box" :style="{ backgroundColor: backColor }" @click="model_visible = false"></div>
        <div v-if="model_visible" class='pos popDiv'
            :style="{ width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px', backgroundColor: color }">
            <slot></slot>
        </div>

</template>
<style scoped>
.box {
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    backdrop-filter: blur(10px);
}

.pos {
    position: fixed;
    z-index: 9999;
}

.popDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
</style>