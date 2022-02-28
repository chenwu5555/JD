<template>
<!-- 权限列表部分 -->
  <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-tag v-if="scope.row.level === '0'" type="success">一级</el-tag>
              <el-tag v-else-if="scope.row.level === '1'" type="info">二级</el-tag>
              <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>
export default {
  name:"rights",
  data() {
    return {
      // 权限列表 
      rightsList:[],
      // 表单用户数据对象
      rightsFrom:{
        authName:"",
        level:"",
        pid:"",
        path:""
      }
    }
  },
  // 页面加载前立即获取权限列表
  created() {
    this.getRightsList()
  },
  methods:{
    // 获取权限列表
  async getRightsList() {
      // 发送请求，获取权限列表的数据
      const {data:res} = await this.$http.get("rights/list")
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      // 将请求得到的数据给到rightslits数组
      this.rightsList = res.data
      console.log(this.rightsList);
    }
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb{
 margin-top: 15px;
 font-size: 20px;
 box-shadow: 0,1px,rgba(0, 0, 0, 0.15);
}
.el-card{
  margin-top: 25px;
}
</style>