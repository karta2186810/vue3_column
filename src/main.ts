import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'

// 進行axios基本路徑的設定
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 利用攔截器在每次請求前加上imooc的code
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: '66009976EB10AF9E' }
  return config
})
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
