import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login.vue'
// 引入home组件
import Home from '@/components/home.vue'
// 引入welcome组件
import welcome from '@/components/welcome.vue'
// 引入user用户信息组件
import user from "@/components/user/user.vue"
// 引入 rights 权限组件
import rights from "@/components/power/rights.vue"
// 引入roles 角色列表组件
import roles from "@/components/power/roles.vue"
// 引入cate商品分类组件
import cate from "@/components/goods/cate.vue"
// 引入params商品分类组件
import params from "@/components/goods/params.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    name: 'login',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect:"/welcome",
    children:[
      {
        path:"/welcome",
        name:"welcome",
        component:welcome
      },
      {
        path:"/users",
        name:"user",
        component:user
      },
      {
        path:"/rights",
        name:"rights",
        component:rights
      },
      {
        path:"/roles",
        name:"roles",
        component:roles
      },
      {
        path:"/categories",
        name:"cate",
        component:cate
      },
      {
        path:"/params",
        name:"params",
        component:params
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航卫士
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //   next() 放行   next("/login")  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
