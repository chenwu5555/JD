<template>
  <div>
    <el-button type="info" plain @click="loginUp">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    loginUp() {
      // 清空token之后，重新跳转到登录页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
