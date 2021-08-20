<template>
  <nav class="navbar navbar-dark bg-primary justifiy-content-between mb-4 px-4">
    <router-link to="/" class="navbar-brand">Vue3 專欄</router-link>
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
        <drop-down :title="`你好 ${user.nickName}`">
          <drop-down-item><router-link  to="/create" class="dropdown-item">新建文章</router-link></drop-down-item>
          <drop-down-item><router-link :to="`/column/${user.column}`" class="dropdown-item">我的專欄</router-link></drop-down-item>
          <drop-down-item><router-link to="/edit-profile" class="dropdown-item">編輯資料</router-link></drop-down-item>
          <drop-down-item><router-link to="/edit-column" class="dropdown-item">編輯專欄</router-link></drop-down-item>
          <drop-down-item><a href="#" class="dropdown-item" @click="logout">退出登入</a></drop-down-item>
        </drop-down>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
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
    const logout = () => {
      if (store.state.user.isLogin) {
        store.commit('logout')
      }
    }
    return {
      logout
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
