<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useRoute } from 'vue-router';



const editorFileUrl = useEditorFileUrl()
const updateTransMsg = useUpdateTransMsg()
const toRouter = useToRouter()
const route = useRoute();
const bottomMsgContent = useBottomMsgContent()
bottomMsgContent.value = "正在加载中..."
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
    { index: "4", router: "/transMsg" }
  ]

  activeIndex.value = list.find(c => c.router == (p || toRouter.value))?.index || "1"
  if (isToRouter) {
    navigateTo(toRouter.value)
    if (activeIndex.value == "4") {
      updateTransMsg.value++
    }
  }

}

onMounted(async () => {
  bottomMsgContent.value = "正在读取配置"
  const isDark = useDark()
  useToggle(isDark)
  watch([toRouter], (v) => {
    changeRouter(v[0], true)
  })
  changeRouter(route.path)

  /** 标题头 */
  const config = await useConfig()
  if (config?.value?.title) {
    document.title = config.value.title
  }


  if (route.path == "/text") {
    toRouter.value = "/"
    navigateTo('/')
  }
  bottomMsgContent.value = "加载完成"
})



</script>

<template>

  <div class="top">
    <el-menu :default-active="activeIndex" class="menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="toRouter = '/'">
        管理器
      </el-menu-item>
      <el-menu-item index="2" :disabled="editorFileUrl.length != 3" @click="toRouter = '/text'">
        文本
      </el-menu-item>
      <el-menu-item index="3" @click="toRouter = '/trans'">
        传输
      </el-menu-item>
      <el-menu-item index="4" @click="toRouter = '/transMsg'">
        传输状态
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
