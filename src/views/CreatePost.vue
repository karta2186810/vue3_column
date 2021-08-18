<template>
  <div class="create-post-page py-5">
    <h4 class="text-center fw-bolder">{{ isEditMode? '編輯文章': '新建文章' }}</h4>
    <uploader
      action="/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-50 mx-auto my-4"
      :uploaded="uploadedData"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      >
      <h2>點擊上傳封面圖片</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary mx-3"></div>
          <h2>正在上傳...</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" alt="文章封面">
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label fw-bolder">文章標題:</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="請輸入文章標題"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bolder">文章詳情:</label>
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
        <button class="btn btn-primary btn-large">{{ isEditMode ? '更新文章' : '發表文章' }}</button>
      </template>
    </validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { GlobalDataProps, ResponseType, ImageProps, PostProps } from '../store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '../components/createMessage'
import { beforeUploadCheck } from '../helpers'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup () {
    const uploadedData = ref()
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const route = useRoute()
    // 使用!!轉換成boolean類型，判斷路由是否存在id，代表是否為編輯模式
    const isEditMode = !!route.query.id
    let imageId = ''
    const titleVal = ref('')
    const titleRules:RulesProp = [
      { type: 'required', message: '文章標題不能為空' }
    ]
    const contentVal = ref('')
    const contentRules:RulesProp = [
      { type: 'required', message: '文章內容不能為空' }
    ]
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = computed(() => store.state.user).value
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost

          store.dispatch(actionName, sendData).then(() => {
            createMessage('文章創建完成，2秒後跳轉到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上傳圖片格式僅能為JPG/PNG格式', 'error')
      }
      if (error === 'size') {
        createMessage('上傳圖片大小不能大於 1MB', 'error')
      }
      return passed
    }

    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content
        })
      }
    })

    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      isEditMode
    }
  }
})
</script>
<style lang="scss">
.submit-area {
  text-align: center;
}
.create-post-page {
  .file-upload-container {
    height: 200px;
    cursor: pointer;
    border: 1px solid #efefef;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
