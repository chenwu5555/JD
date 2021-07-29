<template>
<div>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card >
  <el-row :gutter="20">
    <el-col :span="12">
      <!-- 添加搜索区域 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
    </el-col>
    <el-col :span="6">
      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 用户列表区域 -->
  <!-- slot-scope="scope"  可以获取当前父级的数据 -->
  <el-table :data="userlist" stripe border>
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态" >
      <template slot-scope="scope">
        <!-- {{scope.row}} -->
        <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180px" >
      <template slot-scope="scope">
         <!-- 修改按钮 -->
         <!-- modifyDialogVisible 修改点击事件 -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog(scope.row.id)" ></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete"  size="mini" @click="removeUserById(scope.row.id)"></el-button>
          <template>
            <!-- 分配角色按钮 -->
            <el-tooltip  effect="dark" content="分配角色" placement="top-end" :enterable="enterable">
                <el-button type="warning" icon="el-icon-share" size="mini"></el-button>
          </el-tooltip>
          </template>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 添加用户的对话框 -->
<el-dialog
  title="添加用户信息"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="close"
>
  <!-- 添加内容主体区域 -->
  <span>
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
    </el-form>
  </span>
  <!-- 底部区域 -->
  <span slot="footer" >
    <el-button @click="addDialogVisible = false" >取 消</el-button>
    <el-button type="primary"  @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改内容区域 -->
<!-- modifyDialogVisible 控制修改用户对话框的显示与隐藏 -->
<el-dialog
  title="修改用户"
  :visible.sync="modifyDialogVisible"
  width="50%"
  @close="modifyClose"
>
  <span>
        <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="70px" >
        <el-form-item label="用户名" >
          <el-input v-model="modifyForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyForm.email"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="mobile">
          <el-input v-model="modifyForm.mobile"></el-input>
        </el-form-item>
    </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="modifyDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyUser">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  name:"user",
  // 自定义校验规则
  data() {
      // 定义校验邮箱规则
    var checkEmail = (rule,value,callback) => {
      const resEmail =  /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if(resEmail.test(value)){
        return callback()
      }
      callback(new Error("请输入合法的邮箱"))
    };
    // 验证手机号的规则
    var checkMobile = (rule,value,callback) => {
      const resMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(resMobile.test(value)){
        return callback()
      }
      callback(new Error("请输入合法的手机号"))
    }

    return {
        //获取用户列表的参数对象
        queryInfo:{
          // 搜索关键字
          query:"",
          // 当前的页码数
          pagenum:1,
          // 当前每页显示多少条数据
          pagesize:2
        },
        // 保存获取到的数组
        userlist:[],
        // 总数据条数
        total:0,
        // 鼠标是否可以进tooltip 分配角色按钮
        enterable:false,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible:false,
        // 添加用户的表单数据对象
        addForm:{
          username:"",
          password:"",
          email:"",
          mobile:"",
        },
        // 添加表单的验证规则对象
        addFormRules:{
          username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '请输入登录密码', trigger: 'blur' },
              { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { validator:checkEmail,trigger: 'blur' }
          ],
          mobile: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator:checkMobile ,trigger: 'blur' }
          ],

        },
        // 控制修改用户对话框的显示与隐藏
        modifyDialogVisible:false,
        //查询到的用户信息对象
        modifyForm:{}, 
        // 修改表单的验证规则对象
        modifyFormRules:{
          email: [
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { validator:checkEmail,trigger: 'blur' }
          ],
          mobile: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator:checkMobile ,trigger: 'blur' }
          ],
        }
        
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    // 获取用户数据列表信息
  async getUserList() {
     const {data:res} =  await this.$http.get("/users",{params:this.queryInfo})
    //  console.log(res);
     if (res.meta.status !== 200) return this.$message.error("获取管理员列表失败")
     this.userlist = res.data.users
     this.total = res.data.total
    },
    // 监听 pagesize 每页显示多少条数据 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值 拿到最新的页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态发生变化时的回调函数
    async switchChange(newSwitch){
      // console.log(newSwitch.mg_state);
    const {data:res} = await this.$http.put(`users/${newSwitch.id}/state/${newSwitch.mg_state}`)
    // console.log(res);
      if(res.meta.status !== 200){
            // 返回新的Boolean值给页面，
          newSwitch.mg_state = !newSwitch.mg_state
          return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 监听添加用户对话框的关闭事件
    // resetFields 重置表单
    close(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    // validate() 对表单的一个校验
    // addUser 添加用户的一个确定按钮
    addUser() {
      this.$refs.addFormRef.validate(async value=>{
        if(!value) return
        // 可以发起添加用户的网络请求
       const {data:res} = await this.$http.post("/users",this.addForm)
       if(res.meta.status !== 201) {
          this.$message.error("添加失败")
       }
      //  console.log(res);
       this.$message.success("添加成功")
      //  隐藏添加用户的对话框
      this.addDialogVisible = false
      // 重新获取用户列表数据
      this.getUserList()
      })
    },
    // 展开编辑修改用户的对话框
    async showDialog(id) {
      this.modifyDialogVisible = true
      // console.log(id);
      const {data:res} = await this.$http.get('users/' +id)
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.modifyForm = res.data
    },
    // 修改区域 点击取消按钮，重置表单 
    modifyClose() {
      this.$refs.modifyFormRef.resetFields()
    },
    // 修改之后点击确定，修改数据
    modifyUser() {
      // 对表单进行校验
      this.$refs.modifyFormRef.validate(async value=>{
        if(!value) return
        // 发起修改数据的请求
        const {data:res} = await this.$http.put("users/"+ this.modifyForm.id,{
          email:this.modifyForm.email,
          mobile:this.modifyForm.mobile
        })
        // console.log(res);
        if(res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败")
        }
        // 让修改用户对话框隐藏
        this.modifyDialogVisible = false
        this.$message.success("更新用户信息成功")
        // 修改之后，重新获取一次表单信息
        this.getUserList()
      })
    },
    // 删除消息提示框
    // 根据id删除对应的用户信息
    async removeUserById(id) {
      console.log(id);
      // 弹窗询问用户是否删除数据 
      const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
          return err
        })
        // console.log(confirmResult);
        // 如果用户确认删除，则返回值为字符串  confirm
        // 如果用户取消删除，则返回字符串 cancel
        if(confirmResult !== "confirm") {
          return this.$message.info("已取消删除")
        }
        console.log("以确认删除");
        // 发送删除单个用户信息
       const {data:res} = await this.$http.delete("users/"+id)
       if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
       this.$message.success(res.meta.msg)
       // 重新获取用户列表信息 
      this.getUserList()
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
.el-table{
  margin-top: 15px;
}
.el-pagination{
  margin-top: 15px;
}
</style>