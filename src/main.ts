import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

// 進行axios基本路徑的設定
axios.defaults.baseURL = 'https://apis.imooc.com/api/'
// 利用攔截器在每次請求前加上imooc的code
axios.interceptors.request.use(config => {
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: 'D7370AA5B92D4586' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', 'D7370AA5B92D4586')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: 'D7370AA5B92D4586' }
  }
  return config
})

axios.interceptors.request.use(config => {
  // 發送請求前將狀態改為讀取
  store.commit('setLoading', true)
  // 並且將狀態設置為沒有錯誤
  store.commit('setError', { status: false, message: '' })
  return config
})
// axios的response攔截器可以接收兩個參數
// 第一個是成功的回調
// 第二個是失敗的回調
axios.interceptors.response.use(config => {
  // 設置狀態沒有讀取
  store.commit('setLoading', false)
  return config
}, e => {
  // axios會將數據包裝在response內，要將其取出
  const { error } = e.response.data
  // 設置狀態為錯誤，以及錯誤訊息
  store.commit('setError', { status: true, message: error })
  // 將狀態改為沒有讀取
  store.commit('setLoading', false)
  // 這邊返回reject是希望可以在外部調用catch處理錯誤
  return Promise.reject(error)
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
