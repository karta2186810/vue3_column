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
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'

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
    return {
      currentUser,
      isLoading
    }
  }
})
</script>

<style lang="sass">

</style>
