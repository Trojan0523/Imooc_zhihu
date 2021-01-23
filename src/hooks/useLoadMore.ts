import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
  currentPage: number;
  pageSize: number;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 2, pageSize: 5 }) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = {
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) === currentPage.value
  })
  return {
    loadMorePage,
    currentPage,
    isLastPage
  }
}

export default useLoadMore
