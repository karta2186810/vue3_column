<template>
  <div class="container">
      <global-header :user="currentUser"></global-header>
      <loader v-if="isLoading" text="加載中" background="rgba(0,0,0,.8)"></loader>
      <router-view></router-view>
      <footer class="text-center py-4 text-secondary bg-light mt-6">
        <small>
          <ul class="list-inline mb-0">
            <li class="list-inline-item">2021 者也專欄</li>
            <li class="list-inline-item">課程</li>
            <li class="list-inline-item">文檔</li>
            <li class="list-inline-item">聯繫</li>
            <li class="list-inline-item">更多</li>
          </ul>
        </small>
      </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { GlobalDataProps } from './store'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'
import 'bootstrap/dist/css/bootstrap.min.css'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)

    // 監視error屬性的變化
    // 使用getter方式監視error內的status
    watch(() => error.value.status, () => {
      // 將status與message從error中取出
      const { status, message } = error.value
      // 判斷如果status為true，並且message存在
      if (status && message) {
        // 執行創建應用的函數
        createMessage(message, 'error')
      }
    })

    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style lang="sass">

</style>
