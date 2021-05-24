<template>
  <div class="container">
      <global-header :user="currentUser"></global-header>
      <!-- <column-list :list="list"></column-list> -->
      <form>
        <div class="mb-3">
          <label class="form-label" for="email-input">電子郵件</label>
          <validate-input
            id="email-input"
            :rules="emailRules"
            v-model="emailVal"
            type="text"
            placeholder="請輸入電子郵件"
            ></validate-input>
        </div>
        <div class="mb-3">
          <label class="form-label" for="password-input">密碼</label>
          <validate-input
            id="password-input"
            :rules="passwordRules"
            v-model="passwordVal"
            type="password"
            placeholder="請輸入密碼"
            ></validate-input>
        </div>
      </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
// import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'

const currentUser: UserProps = {
  isLogin: true,
  name: 'Leo'
}

// 驗證email格式的正則表達式
// const emailReg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

// #region
// const testData:ColumnProps[] = [
//   {
//     id: 1,
//     title: 'test1專欄',
//     description: '這是test1的專欄，有一段有趣的簡介',
//     avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
//   },
//   {
//     id: 2,
//     title: 'test2專欄',
//     description: '這是test2的專欄，有一段有趣的簡介',
//     avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
//   },
//   {
//     id: 3,
//     title: 'test3專欄',
//     description: '這是test3的專欄，有一段有趣的簡介'
//     // avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
//   },
//   {
//     id: 4,
//     title: 'test4專欄',
//     description: '這是test4的專欄，有一段有趣的簡介',
//     avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/277px-Vue.js_Logo_2.svg.png'
//   }
// ]
// #endregion
export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
    ValidateInput
  },
  setup () {
    const emailVal = ref('')
    const passwordVal = ref('')
    // 用來傳入validateInput組件的規則
    const emailRules:RulesProp = [
      { type: 'required', message: '電子郵件地址不能為空' },
      { type: 'email', message: '請輸入正確的電子郵件格式' }
    ]
    const passwordRules:RulesProp = [
      { type: 'required', message: '密碼不能為空' }
    ]

    /* const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    // 每次輸入框blur的時候執行的函數
    const validateEmail = () => {
      // 將頭尾空格去掉之後值仍然為空
      if (emailRef.val.trim() === '') {
        emailRef.error = true
        emailRef.message = 'Can not be empty!'
      } else if (!emailReg.test(emailRef.val)) {
        emailRef.error = true
        emailRef.message = 'Should be valid email!'
      } else {
        // 其他情況，代表通過所有驗證
        emailRef.error = false
      }
    } */

    return {
      // list: testData,
      currentUser,
      // emailRef,
      // validateEmail,
      emailRules,
      emailVal,
      passwordVal,
      passwordRules
    }
  }
})
</script>

<style lang="sass">

</style>
