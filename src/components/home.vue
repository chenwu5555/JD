<template>
  <el-container class="home-container">
    <!-- 顶部栏 -->
    <el-header class="home-header">
      <div class="home-header-div">
        <img
          class="header-div-img"
          src="../assets/img/bigUserHeader.png"
          alt=""
        >
        <span class="header-div-span">黑马后台登录管理</span>
      </div>
      <el-button type="info" plain @click="loginUp">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="home-aside" :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <!-- unique-opened  只保持一个子菜单的展开 -->
        <!-- router  为侧边栏开启了路由模式 -->
        <!-- default-active  当前激活菜单的index,可以设置高亮-->
        <!-- collapse 是否水平折叠收起菜单 -->
        <!-- collapse-transition 是否开启折叠动画 -->
        <!-- default-active 激活当前菜单的index-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 折叠按钮 -->
          <div class="collapse" @click="collapseClick">
            |||
          </div>
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]" style="margin-right:10px" />
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 创建一个一级菜单图标库对象
      iconObj: {
        '125': 'iconfont icon-yonghu',
        '103': 'iconfont icon-lifangtilitiduomiantifangkuai2',
        '101': 'iconfont icon-gouwudai',
        '102': 'iconfont icon-dingdan',
        '145': 'iconfont icon-42'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath:""
    }
  },
  // 页面加载的时候就应该立即获取左侧菜单
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem("activePath")
    // console.log(window.sessionStorage.getItem("activePath"),"小火车");
  },
  methods: {
    loginUp() {
      // 清空token之后，重新跳转到登录页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 如果状态成功的话，就将获取的到的数据给到menuList数组
      this.menuList = res.data
      console.log(res.data);
    },
    // 折叠点击事件
    collapseClick() {
      // console.log('折叠')
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  .home-header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    background: #373d41;
    .home-header-div {
      display: flex;
      width: 300px;
      height: 60px;
      .header-div-span {
        display: flex;
        margin-left: 10px;
        align-items: center;
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .home-aside {
    background: #333744;
    .el-menu{
      border: 0;
    }
    .collapse{
      height: 30px;
      background: #4a5064;
      line-height: 30px;
      text-align: center;
      font-size: 20px;
    }
  }
  .home-main {
    background: #eaedf1;
  }
}
</style>
