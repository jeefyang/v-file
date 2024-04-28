<script setup lang="ts">
const data = await useFetch("/api/test")
</script>
<template>
    <div> {{ data.data }}</div>
    <!-- <div>editor</div> -->

</template>
<style scoped></style>