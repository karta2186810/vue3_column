<template>
  <form class="validate-form-container" @submit.prevent="submitForm">
    <slot name="default"></slot>
    <div class="submit-area">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">確認</button>
      </slot>
    </div>
  </form>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'

type ValidateFunc = () => boolean

export const emitter = mitt()

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    // 用來儲存validate-input傳過來的驗證函數
    let funcArr: ValidateFunc[] = []

    // 送出表單時的事件函數
    const submitForm = () => {
      // 將所有input傳過來的驗證函數執行之後，使用every確認全部是否通過
      // 使用map的原因是要讓每個驗證函數都執行
      const result = funcArr.map(func => func()).every(result => result)
      // 如果有錯誤，廣播事件resetInput，通知input觸發事件
      if (!result) {
        emitter.emit('resetInput')
      }
      // 向外觸發form-submit事件，並將驗證結果傳遞
      context.emit('form-submit', result)
    }

    // 將input傳遞過來的函數推入陣列
    const callback = (func: ValidateFunc | undefined) => {
      if (func) {
        funcArr.push(func)
      }
    }

    // input觸發事件時執行推入函數
    emitter.on('form-item-created', callback)

    // 解除監聽input事件，清空驗證函數陣列
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })

    return {
      submitForm
    }
  }
})
</script>
<style></style>
