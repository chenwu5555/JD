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
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// 引入element-ui插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入需要的element
import { Form, FormItem, Button, Input, Message } from 'element-ui'
// 引入消息提示框 Message
Vue.prototype.$message = Message
Vue.use(Form, FormItem)
Vue.use(Button)
Vue.use(Input)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
