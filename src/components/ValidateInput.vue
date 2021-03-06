<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    <textarea
      v-else
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'

// email驗證正則表達式
const emailReg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

// 用來限制傳入的rule，必須指定類型以及錯誤訊息
interface RuleProp {
  type: 'required' | 'email' | 'custom'
  message: string,
  validator?: () => boolean
}
// 自定義type方便日後使用
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'

export default defineComponent({
  name: 'ValidateInput',
  props: {
    // 接收傳入的rules
    rules: {
      type: Array as PropType<RulesProp>
    },
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    },
    modelValue: String
  },
  // 不要讓傳進來的attr繼承在組件根結點上
  inheritAttrs: false,
  setup (props, context) {
    // 因為需要包含多筆屬性，所以使用reactive創建物件
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })

    // 每次blur之後執行的回調函數
    const validateInput = () => {
      // 如果有rules傳入，便循環驗證每個規則
      if (props.rules) {
        // 陣列的every方法，如果全部返回true，則返回true，只要有一個返回false便會返回false
        const allPassed = props.rules.every(rule => {
          // 定義用來返回的變量，預設為true，代表默認是通過的
          let passed = true
          // 將rule中的訊息賦值給input的錯誤訊息，如果沒有通過驗證時顯示
          inputRef.message = rule.message
          // 尋找與rules類型匹配的case並執行驗證
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val.trim())
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          // 返回passed
          return passed
        })
        // 如果allPassed為true代表通過驗證，inputRef沒有錯誤
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }

    const inputReset = () => {
      inputRef.val = ''
      context.emit('update:modelValue', '')
    }

    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.on('resetInput', inputReset)
    })
    return {
      inputRef,
      validateInput
    }
  }
})
</script>
