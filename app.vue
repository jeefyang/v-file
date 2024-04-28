<script setup lang="ts">

const activeIndex = ref("1")
const handleSelect = (index: number) => {
  console.log(index)
}

</script>

<template>

  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">
      <NuxtLink to="/">管理器</NuxtLink>
    </el-menu-item>
    <el-menu-item index="2">
      <NuxtLink to="/trans">传输</NuxtLink>
    </el-menu-item>
  </el-menu>
  <div>
    <!-- <ElButton type="primary">123</ElButton> -->
    <NuxtPage></NuxtPage>
    <!-- <NuxtWelcome /> -->
  </div>


</template>

<style></style>
