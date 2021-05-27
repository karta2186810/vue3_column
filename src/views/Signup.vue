<template>
  <div class="signup-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label fw-bolder">電子郵件</label>
        <validate-input
          :rules="emailRules"
          v-model="formData.email"
          placeholder="請輸入電子郵件地址"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bolder">暱稱</label>
        <validate-input
          :rules="nameRules"
          v-model="formData.nickName"
          placeholder="請輸入暱稱"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bolder">密碼</label>
        <validate-input
          :rules="passwordRules"
          v-model="formData.password"
          placeholder="請輸入密碼"
          type="password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bolder">重複密碼</label>
        <validate-input
          :rules="repeatPasswordRules"
          v-model="formData.repeatPassword"
          placeholder="請再次輸入密碼"
          type="password"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary w-100 fw-bolder">註冊</button>
      </template>
    </validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
export default defineComponent({
  name: 'Signup',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const router = useRouter()
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const emailRules:RulesProp = [
      { type: 'required', message: '電子郵件地址不能為空' },
      { type: 'email', message: '請輸入正確的電子郵件地址格式' }
    ]
    const nameRules:RulesProp = [
      { type: 'required', message: '暱稱不能為空' }
    ]
    const passwordRules:RulesProp = [
      { type: 'required', message: '密碼不能為空' }
    ]
    const repeatPasswordRules:RulesProp = [
      { type: 'required', message: '重複密碼不能為空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '重複密碼不相同'
      }
    ]
    const onFormSubmit = async (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        try {
          await axios.post('/users/', payload)
          createMessage('註冊成功，即將跳轉頁面', 'success')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } catch (e) {
          console.log(e)
        }
      }
    }

    return {
      formData,
      onFormSubmit,
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules
    }
  }
})
</script>
<style></style>
