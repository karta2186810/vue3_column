import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'
import store from '@/store'

interface LoadParams {
  currentPage: number
  pageSize: number
  [ key: string ]: any
}

// actionName 要進行dispatch的名字
// total 總條目數
// params用來傳遞給後端的當前頁面及每頁的條目數
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 2, pageSize: 5 }) => {
  // 使用store
  const store = useStore()
  // 將params中的currentPage取出，並將其轉換響應式物件
  const currentPage = ref((params && params.currentPage) || 2)
  const requestParams = computed(() => ({
    ...params,
    currentPage: currentPage.value
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return (requestParams.value.pageSize * (currentPage.value - 1)) > total.value
  })
  return {
    loadMorePage,
    isLastPage
  }
}

export default useLoadMore
