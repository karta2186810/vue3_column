<template>
  <div class="column-detail-page mx-auto py-5">
    <div class="align-items-center row mb-4 border-bottom pb-4" v-if="column">
      <div v-if="column.avatar" class="avatar-container text-center col-2">
        <img :src="column.avatar.url" :alt="column.title" class="column-avatar rounded-circle">
      </div>
      <div v-else class="avatar-fallback d-flex justify-content-center align-items-center column-avatar col-2 mx-auto">
        <i class="fas fa-book b-block w-50 h-50"></i>
      </div>
      <div class="column-info d-flex flex-column col-10">
        <h4 class="column-title my-0 fw-bolder">{{column.title}}</h4>
        <p class="text-muted my-0 mt-1 column-desc">{{column.description}}</p>
      </div>
    </div>
    <post-list v-if="posts.length" :posts="posts"></post-list>
    <div v-else class="col-lg-8 col-md-8 mx-auto post-list-fallback">
      <img src="../assets/callout.svg" alt="callout" class="col-lg-3 col-md-3 col-sm-8 mx-auto"/>
      <h2 class="font-weight-light mt-5 text-center">您還沒有文章哦!</h2>
      <p class="mx-auto text-center">
        <router-link to="/create" class="btn btn-primary my-3 fw-bolder">開始寫作</router-link>
      </p>
    </div>
    <button
      class="btn btn-outline-primary w-25 mx-auto d-block mb-3"
      v-if="!isLastPage"
      @click="loadMorePage"
      >加載更多</button>
    <div v-if="isLastPage && posts.length" class="is-last-page text-center text-secondary py-4 fs-5"><i class="fas fa-exclamation-triangle me-2"></i>沒有更多文章囉!</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from '@/store'
import PostList from '../components/PostList.vue'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const columnId = ref(route.params.id)
    const posts = computed(() => store.getters.getPostsByCid(columnId.value))
    const total = computed(() => store.getters.getTotalByCid(columnId.value))
    const currentPage = computed(() => store.getters.getCurrentPageByCid(columnId.value))

    const { isLastPage, loadMorePage } = useLoadMore('fetchPosts', total, { columnId: columnId.value, currentPage: currentPage.value, pageSize: 5 })

    const column = computed(() => {
      const selectColumn = store.getters.getColumnsById(columnId.value) as ColumnProps
      return selectColumn
    })

    watchEffect(() => {
      document.title = (column.value && column.value.title) || document.title
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
  width: 100%;
  align-self: start;
  .column-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #efefef;
  }
  .avatar-fallback {
    background-color: #cfcfcf;
    color: #fff;
  }
  .post-list-fallback {
    color: #555;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  @media (max-width: 576px) {
    .avatar-container {
      width: 100%;
    }
    .column-info {
      text-align: center;
      width: 100%;
      margin-top: 1rem;
    }
    .post-list-fallback {
      img {
        width: 50%;
      }
    }
  }
}
</style>
