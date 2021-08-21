<template>
  <div class="wrapper">
    <global-header :user="currentUser"></global-header>
    <div class="container">
      <loader v-if="isLoading" text="加載中" background="rgba(0,0,0,.8)"></loader>
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <footer class="footer text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">2021 隨心專欄</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
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

    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style lang="scss">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .container {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
