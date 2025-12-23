<template>
  <div class="main">
    <h1>页面未找到，请检查路由是否拼写错误</h1>
    <el-button
      type="primary"
      @click="toHome"
    >返回首页</el-button>
  </div>
</template>

<script setup>
import router from '../router';

const toHome = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    color: transparent;
    background: -webkit-linear-gradient(to right, #2ebf91, #8360c3);
    background: linear-gradient(to right, #2ebf91, #8360c3);
    -webkit-background-clip: text;
    background-clip: text;
    font-weight: bold;
    font-size: 40px;
  }
}
</style>