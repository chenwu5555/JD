<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="img_box">
        <img class="img" src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-yonghu"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-suo"
          />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="login_form_item">
          <el-button class="login_btn" type="primary" @click="login">登录</el-button>
          <el-button class="info" @click="refsLoginRorm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 这是登陆表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是登录表单绑定验证对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log(this.$options,"88888");
  },
  methods: {
    // 点击重置按钮   resetFields()方法:对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    refsLoginRorm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录按钮  validate 对保表单进行验证，通过接受一个回调函数,来进行验证
    // 如果某一个方法的返回值是promise，可以通过async和await来简化这个promise操作
    // loginFormRef 表单的一个引用对象
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res) res.meta.status
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        // $message element-ui组件的内置方法
        this.$message.success('登陆成功')
        console.log(res.data);
        //  1.将登陆成功之后的token，保存到客户端的 sessionStorage 中
        //     1.1 项目中出了登录之外的其他API接口，必须在登陆之后才能访问
        //     1.2 token 只应在当前网站打开期间生效，所以将token保存在 sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)

        //  2. 通过编程式导航跳转到后台主页，路由地址是/home
        //     2.1 在vue实例中，你可以通过$router来访问路由实例，所以你可以调用$router.push(路径)来跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container{
  height: 100%;
  background: #2b4b6b;
  .login_box{
    position: absolute;
    top: 50%;left: 50%;
    width: 450px;height: 300px;
    background: #fff;
    border-radius: 3px;
    transform: translate(-50%,-50%);
    .img_box{
      position: absolute;
      left: 50%;
      width: 130px;height: 130px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 10px #ddd;
      // 以自己为参照物，反向移动自己的50%
      transform: translate(-50%,-50%);
      .img{
        width: 100%;height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
  }
  .login_form{
    margin-top: 80px;
    padding: 0 30px;
    .login_form_item{
      display: flex;
      justify-content: center;
    }
  }
}

</style>
