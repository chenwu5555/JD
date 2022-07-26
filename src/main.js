import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入css全局样式重置表
import './assets/css/global.css'
// 引入iconfont-css图标样式
import './assets/font/iconfont.css'
// 引入axios插件
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://175.27.228.178:3434/api/private/v1/'
// axios.defaults.baseURL = "/api"

// 配置$axios拦截器
// export const $axios = axios.create({ // 这里是配置项
//   timeout: 7000
// })
// 拦截请求头  request 就是一个请求的拦截器
axios.interceptors.request.use((config) => {
  // 为请求对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  // 在最后必须返回 return config
  return config
})

// 在原型下面挂载一个http的方法,所有组件都可以通过this.$http的方法来使用axios来发送请求
Vue.prototype.$http = axios


// 引入element-ui插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入需要的element
import { Form, FormItem, Button, Input, Message, Container, Header, Aside, Main, MessageBox} from 'element-ui'
// 引入消息提示框 Message
Vue.prototype.$message = Message

//
Vue.prototype.$confirm =MessageBox.confirm;
Vue.use(Form, FormItem)
Vue.use(Button)
Vue.use(Input)
// 布局容器部分container
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.config.productionTip = false

// 引入vue-table-with-tree-grid 插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
