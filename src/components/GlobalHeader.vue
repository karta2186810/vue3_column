<template>
  <nav
    class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4 fixed"
    :class="{ 'scroll-down': isScrollDown }"
  >
    <router-link to="/" class="navbar-brand">隨心專欄</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2 fw-bolder">登入</router-link>
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2 fw-bolder">註冊</router-link>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <drop-down :title="`你好，${user.nickName}`">
          <drop-down-item><router-link  to="/create" class="dropdown-item"><i class="fas fa-plus-circle mx-2"></i>新建文章</router-link></drop-down-item>
          <drop-down-item>
            <router-link :to="`/column/${user.column}`" class="dropdown-item">
              <i class="fas fa-columns mx-2"></i>我的專欄
            </router-link>
          </drop-down-item>
          <drop-down-item>
            <router-link to="/edit-profile" class="dropdown-item">
              <i class="fas fa-user-edit mx-2"></i>編輯資料
            </router-link>
          </drop-down-item>
          <drop-down-item><router-link to="/edit-column" class="dropdown-item"><i class="fas fa-edit mx-2"></i>編輯專欄</router-link></drop-down-item>
          <drop-down-item>
            <a href="#" class="dropdown-item" @click="logout">
              <i class="fas fa-sign-out-alt mx-2"></i>退出登入
            </a>
          </drop-down-item>
        </drop-down>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { defineComponent, PropType, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { UserProps, GlobalDataProps } from '../store'
import DropDown from './DropDown.vue'
import DropDownItem from './DropDownItem.vue'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    DropDown,
    DropDownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const isTop = ref(false)
    const isScrollDown = ref(false)
    let oldScrollTop = 0
    const logout = () => {
      if (store.state.user.isLogin) {
        store.commit('logout')
      }
    }
    const setToFixed = () => {
      const scrollTop = document.documentElement.scrollTop
      if (scrollTop > oldScrollTop) {
        isScrollDown.value = true
        oldScrollTop = scrollTop
      } else {
        isScrollDown.value = false
        oldScrollTop = scrollTop
      }
    }
    onMounted(() => {
      document.addEventListener('scroll', setToFixed)
    })
    onUnmounted(() => {
      document.removeEventListener('scroll', setToFixed)
    })
    return {
      logout,
      isScrollDown
    }
  }
})
</script>
<style lang="scss" scoped>
.fixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: 0.3s;
  &.scroll-down {
    transform: translateY(-100%);
  }
}
</style>
