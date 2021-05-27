import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'

// 進行axios基本路徑的設定
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 利用攔截器在每次請求前加上imooc的code
axios.interceptors.request.use(config => {
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: '66009976EB10AF9E' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '66009976EB10AF9E')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '66009976EB10AF9E' }
  }
  return config
})

axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
