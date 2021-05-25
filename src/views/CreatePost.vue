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
import { defineComponent, ref } from 'vue'
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
        const { columnId } = store.state.user
        if (columnId) {
          const newPost:PostProps = {
            id: new Date().getTime(),
            title: titleVal.value,
            content: contentVal.value,
            columnId,
            createdAt: new Date().toLocaleString()
          }
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: columnId } })
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
