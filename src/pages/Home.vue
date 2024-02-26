<template>
<div class="wrap">
  <div class="container">
    <MainView/>

  
  </div>
</div>
</template>

<script setup>
import MainView from "@/components/MainView.vue"
</script>



<style lang="scss" scoped>

// main.scss 파일에을 import
@import "@/scss/main.scss";


.wrap{
  @include center;
  width: 100%;
  height: 100vh;
  font-size: 10px;
  
  .container{
    @include center-sb;
    width: 55%;
    height: 90%;
    max-width: 1920px;
    max-height: 1354px;
  }
}
</style>