<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章標題:</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="請輸入文章標題"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章詳情:</label>
        <validate-input
          type="text"
          tag="textarea"
          rows="10"
          :rules="contentRules"
          v-model="contentVal"
          placeholder="請輸入文章詳情"
        ></validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">發表文章</button>
      </template>
    </validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { GlobalDataProps, PostProps } from '../store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()

    const titleVal = ref('')
    const titleRules:RulesProp = [
      { type: 'required', message: '文章標題不能為空' }
    ]
    const contentVal = ref('')
    const contentRules:RulesProp = [
      { type: 'required', message: '文章內容不能為空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column } = computed(() => store.state.user).value
        if (column) {
          const newPost:PostProps = {
            _id: '' + new Date().getTime(),
            title: titleVal.value,
            content: contentVal.value,
            column: '' + column,
            createdAt: new Date().toLocaleString()
          }
          // 使用commit方法觸發store中的mutations內的函數，commit第一個參數是要觸發的函數名字，第二個參數是要傳遞的數據
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit
    }
  }
})
</script>
<style></style>
