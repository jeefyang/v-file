<script setup lang="ts">

const activeIndex = ref("1")
const handleSelect = (index: string) => {
  console.log(index)
}

</script>

<template>
  <div class="top">
    <el-menu :default-active="activeIndex" class="menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">
        <NuxtLink to="/">管理器</NuxtLink>
      </el-menu-item>
      <el-menu-item index="2">
        <NuxtLink to="/trans">传输</NuxtLink>
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
}

.menu {
  height: 35px;
}
</style>
