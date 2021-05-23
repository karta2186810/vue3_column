<template>
  <div class="container">
      <global-header :user="currentUser"></global-header>
      <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'

const currentUser: UserProps = {
  isLogin: true,
  name: 'Leo'
}

const testData:ColumnProps[] = [
  {
    id: 1,
    title: 'test1專欄',
    description: '這是test1的專欄，有一段有趣的簡介',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
  },
  {
    id: 2,
    title: 'test2專欄',
    description: '這是test2的專欄，有一段有趣的簡介',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
  },
  {
    id: 3,
    title: 'test3專欄',
    description: '這是test3的專欄，有一段有趣的簡介'
    // avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
  },
  {
    id: 4,
    title: 'test4專欄',
    description: '這是test4的專欄，有一段有趣的簡介',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
  }
]

export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader
  },
  setup () {
    return {
      list: testData,
      currentUser
    }
  }
})
</script>

<style lang="sass">

</style>
