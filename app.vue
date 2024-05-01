<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useRoute } from 'vue-router';



const editorFileUrl = useEditorFileUrl()
const toRouter = useToRouter()
const isDark = useDark()
useToggle(isDark)
const route = useRoute();

// console.log(nuxtApp)


const activeIndex = ref("1")
const handleSelect = (index: string) => {
  console.log(index)
}

const changeRouter = (p?: string, isToRouter?: boolean) => {
  let list: { index: string, router: string }[] = [
    { index: "1", router: "/" },
    { index: "2", router: "/text" },
    { index: "3", router: "/trans" },
  ]
  
  activeIndex.value = list.find(c => c.router == (p || toRouter.value))?.index || "1"
  if (isToRouter) {
    navigateTo(toRouter.value)
  }

}

watch([toRouter], (v) => {
  changeRouter(v[0], true)
})
changeRouter(route.path)

if(route.path=="/text"){
  console.log("initchange")
  toRouter.value="/"
  navigateTo('/')
}

</script>

<template>

  <div class="top">
    <el-menu :default-active="activeIndex" class="menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="toRouter = '/'">
        管理器
      </el-menu-item>
      <el-menu-item index="2" :disabled="!editorFileUrl" @click="toRouter = '/text'">
        文本
      </el-menu-item>
      <el-menu-item index="3" @click="toRouter = '/trans'">
        传输
      </el-menu-item>
    </el-menu>
  </div>

  <div class="content">
    <!-- <ElButton type="primary">123</ElButton> -->
    <NuxtPage></NuxtPage>
    <!-- <NuxtWelcome /> -->
  </div>


</template>

<style scoped>
.top {
  position: fixed;
  height: 35px;
  top: 0px;
  width: 100%;
}

.content {
  position: fixed;
  height: calc(100% - 35px);
  top: 40px;
  width: calc(100% - 10px);
  left: 5px;
}

.menu {
  height: 35px;
}
</style>
