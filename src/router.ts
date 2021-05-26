import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      // meta屬性的值會添加到路由物件的meta屬性中，作為路由守衛的判斷依據
      // meta只是一個標籤作為判斷之用，沒有額外的特殊效果
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 通過meta標籤與登入狀態，判斷是否進行跳轉
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    // next函數傳入一個物件，name屬性表示要跳轉到的路由名字
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next({ name: 'home' })
  } else {
    next()
  }
})
export default router
