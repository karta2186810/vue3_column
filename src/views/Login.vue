<template>
  <div class="login-page">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-2">
        <label class="form-label fw-bolder">電子郵件</label>
        <validate-input
          :rules="emailRules" v-model="emailVal"
          placeholder="請輸入電子郵件"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-2">
        <label class="form-label fw-bolder">密碼</label>
        <validate-input
          type="password"
          placeholder="請輸入密碼"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary w-100 fw-bolder">登入</button>
      </template>
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

    const onFormSubmit = async (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        try {
          const data = await store.dispatch('loginAndFetch', payload)
          console.log(data)
          router.push('/')
        } catch (e) {
          // catch會接收到由axios攔截器拋出的錯誤
          console.log(e)
        }
      }
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
