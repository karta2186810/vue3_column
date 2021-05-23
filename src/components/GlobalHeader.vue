<template>
  <nav class="navbar navbar-dark bg-primary justifiy-content-between mb-4 px-4">
    <a href="#" class="navbar-brand">者也專欄</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <a href="#" class="btn btn-outline-light my-2">登入</a>
      </li>
      <li class="list-inline-item">
        <a href="#" class="btn btn-outline-light my-2">註冊</a>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <drop-down :title="`你好 ${user.name}`">
          <drop-down-item><a href="#" class="dropdown-item">新建文章</a></drop-down-item>
          <drop-down-item disabled><a href="#" class="dropdown-item">編輯資料</a></drop-down-item>
          <drop-down-item><a href="#" class="dropdown-item">退出登入</a></drop-down-item>
        </drop-down>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DropDown from './DropDown.vue'
import DropDownItem from './DropDownItem.vue'

export interface UserProps {
  isLogin: boolean
  name?: string
  id?: number
}
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
  }
})
</script>
<style></style>
