import { ref, onMounted, onUnmounted, Ref } from 'vue'

// useClickOutside主要返回一個true或false的標示符，用來判斷滑鼠是否點擊在元素外面
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  // 用於返回的標示符
  const isClickOutside = ref(false)
  // 判斷是否點擊在元素外面
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside
