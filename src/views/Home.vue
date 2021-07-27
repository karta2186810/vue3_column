<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light mt-5">隨心寫作，自由表達</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-3 fw-bolder">開始寫作</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center fw-bolder">發現精彩</h4>
    <column-list :list="list"></column-list>
    <button
      class="btn btn-outline-primary d-block mt-2 mb-5 mx-auto w-25"
      @click="loadMorePage"
      v-if="!isLastPage"
      >加載更多</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import ColumnList from '../components/ColumnList.vue'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    // store中的getter屬性類似於computed屬性，將store中的數據處理過後進行返回
    const store = useStore<GlobalDataProps>()
    // 因為setup只會執行一次，但是vuex中的數據是響應式的，最簡單的方式是通過computed去監視vuex中的數據
    const list = computed(() => store.getters.getColumns)
    const total = computed(() => store.state.columns.total)
    const currentPage = computed(() => store.state.columns.currentPage)

    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { currentPage: currentPage.value ? currentPage.value : 2, pageSize: 3 })

    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3 })
    })
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
<style></style>
