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
    <post-list v-if="posts.length" :posts="posts"></post-list>
    <div v-else class="post-list-fallback p-3">
      <h4>你還沒有文章哦</h4>
      <router-link to="/create" class="btn btn-primary my-3 fw-bolder">開始寫作</router-link>
    </div>
    <button
      class="btn btn-outline-primary w-25 mx-auto d-block mb-3"
      v-if="!isLastPage"
      @click="loadMorePage"
      >加載更多</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from '../store'
import PostList from '../components/PostList.vue'
import useLoadMore from '../hooks/useLoadMore'
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
    const columnId = ref(route.params.id)
    const posts = computed(() => store.getters.getPostsByCid(columnId.value))
    const total = computed(() => store.getters.getTotalByCid(columnId.value))
    const currentPage = computed(() => store.getters.getCurrentPageByCid(columnId.value))

    const { isLastPage, loadMorePage } = useLoadMore('fetchPosts', total, { columnId: columnId.value, currentPage: currentPage.value, pageSize: 5 })

    const column = computed(() => {
      const selectColumn = store.getters.getColumnsById(columnId.value) as ColumnProps
      if (selectColumn && !selectColumn.avatar) {
        selectColumn.avatar = { url: require('@/assets/column.jpg') }
      }
      return selectColumn
    })

    onMounted(() => {
      store.dispatch('fetchColumn', columnId.value)
      store.dispatch('fetchPosts', { columnId: columnId.value })
    })

    return {
      column,
      posts,
      isLastPage,
      loadMorePage
    }
  }
})
</script>
<style scoped lang="scss">
.column-detail-page {
  min-height: 480px;
  .post-list-fallback {
    color: #555;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
