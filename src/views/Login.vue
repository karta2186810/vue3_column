<template>
  <div class="login-page">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">電子郵件</label>
        <validate-input
          :rules="emailRules" v-model="emailVal"
          placeholder="請輸入電子郵件"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密碼</label>
        <validate-input
          type="password"
          placeholder="請輸入密碼"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// 與useRoute不同useRouter用來定義路由的行為
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()

    const emailVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '電子郵件地址不能為空' },
      { type: 'email', message: '請輸入正確的電子郵件格式' }
    ]

    const passwordVal = ref('')
    const passwordRules: RulesProp = [
      { type: 'required', message: '密碼不能為空' }
    ]

    const onFormSubmit = (result: boolean) => {
      console.log('result', result)
      router.push('/')
      store.commit('login')
    }

    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>
<style></style>
