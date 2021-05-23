<template>
  <div class="dropdown" ref="dropdownRef">
    <a  href="#"
        class="btn btn-outline-light my-2 dropdown-toggle"
        @click.prevent="toggleOpen"
        >{{title}}</a>
    <ul v-if="isOpen" class="dropdown-menu" :style="{ display: 'block' }">
      <slot></slot>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'

export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    // 標示下拉菜單是否關閉
    const isOpen = ref(false)
    const dropdownRef = ref<null | HTMLElement>(null)

    // 控制下拉菜單的關閉與開啟
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }

    // 控制點擊dropdown-menu外側關閉菜單的函數
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })

    // #region hook抽取前的筆記
    // // 用於點擊dropdown外的區域時關閉菜單的事件響應函數
    // const handler = (e: MouseEvent) => {
    //   // 如果dropdownRef存在
    //   if (dropdownRef.value) {
    //     // contains可以判斷傳入值是否為當前節點的子節點，返回true或false
    //     // e.target 必須使用類型斷言，因為TS不知道該屬性是否為HTML節點
    //     if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value === true) {
    //       // 判斷如果被點擊的元素不是dropdown裡的節點，以及dropdown為開的狀況下，關閉dropdown
    //       isOpen.value = false
    //     }
    //   }
    // }

    // // 掛載組件時監聽，卸載組件時取消監聽
    // onMounted(() => {
    //   document.addEventListener('click', handler)
    // })
    // onUnmounted(() => {
    //   document.removeEventListener('click', handler)
    // })
    // #endregion

    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>
<style></style>
