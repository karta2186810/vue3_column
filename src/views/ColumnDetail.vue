<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar" :alt="column.title" class="rounded-circle border w-75">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    // useRoute會創建一個物件包含路由的所有訊息
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    // 取得當前路由上的id params
    const currentId = +route.params.id
    const column = store.getters.getColumnsById(currentId)
    const list = store.getters.getPostsByCid(currentId)
    return {
      column,
      list
    }
  }
})
</script>
<style></style>
