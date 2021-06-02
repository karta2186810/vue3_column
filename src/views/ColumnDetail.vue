<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border w-50">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :posts="posts"></post-list>
    <button class="btn btn-outline-primary w-25 mx-auto d-block mb-3">加載更多</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from '../store'
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
    const currentId = route.params.id
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    const column = computed(() => {
      const selectColumn = store.getters.getColumnsById(currentId) as ColumnProps
      if (selectColumn && !selectColumn.avatar) {
        selectColumn.avatar = { url: require('@/assets/column.jpg') }
      }
      return selectColumn
    })
    const posts = computed(() => store.getters.getPostsByCid(currentId))

    return {
      column,
      posts
    }
  }
})
</script>
<style></style>
