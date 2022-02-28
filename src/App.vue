<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
html, body{
  width: 100%;
  height:100%;
}
#app{
  width: 100%;
  height:100%;
  min-width: 1366px;
}
</style>
