import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'

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
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/posts/:id',
      name: 'posts',
      component: PostDetail
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { token, user } = store.state
  // 這裡取出的這兩個值不一定存在，會根據目標路由確定存在與否
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      try {
        await store.dispatch('fetchCurrentUser')
        if (redirectAlreadyLogin) {
          // 如果目標路由存在redirectAlreadyLogin的meta的話(這裡只有訪問/login有這個標籤)，跳轉到主頁面
          next('/')
        } else {
          // 如果沒有直接放行
          next()
        }
      } catch (error) {
        // 即使存在token登入也失敗，代表token有問題
        console.error(error)
        // 清除token
        localStorage.removeItem('token')
        store.commit('logout')
        next('login')
      }
    } else {
      if (requiredLogin) {
        // 如果token不存在，並且目標路由存在requiredLogin的meta，跳轉到登入
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
