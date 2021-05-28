<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload">
      <slot v-if="fileStatus==='loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上傳...</button>
      </slot>
      <slot v-else-if="fileStatus==='success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上傳成功</button>
      </slot>
      <slot v-else name="default" >
        <button class="btn btn-primary">點擊上傳</button>
      </slot>
      <!-- <span v-else-if="fileStatus==='error'">上傳失敗</span> -->
    </div>
    <button class="btn btn-primary" @click.prevent="handleDelete">刪除圖片</button>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change.prevent="handleFileChange"
      >
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import axios from 'axios'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean

export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error', 'file-deleted'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null) // 創建ref接收fileInput的DOM節點
    const fileStatus = ref<UploadStatus>('ready') // 創建用來標示上傳的狀態
    const uploadedData = ref()
    // 給button綁定的事件響應函數
    const triggerUpload = () => {
      // 判斷如果已經拿到fileInput節點
      if (fileInput.value) {
        /* HTMLElement上存在click方法可以模擬該節點被點擊 */
        fileInput.value.click() // 觸發該節點上的點擊事件
      }
    }
    // fileInput改變時的事件響應
    const handleFileChange = async (e: Event) => {
      const currentTarget = e.target as HTMLInputElement // 拿到input節點
      /* type="file"的input節點，使用value可以取得上傳的第一個檔案，files可以訪問上傳的所有檔案 */
      if (currentTarget.files) {
        // 判斷該節點已經選取檔案
        const files = Array.from(currentTarget.files) // files是一個FileList類型的數據，使用Array.from轉換成普通陣列
        if (props.beforeUpload) {
          // 如果用戶有船入beforeUpload
          const result = props.beforeUpload(files[0]) // 將檔案傳入，檢查檔案是否符合用戶的自定義規則
          if (!result) {
            // 如果result為false
            return result // 返回result
          }
        }
        fileStatus.value = 'loading' // 設置標示為上傳中
        const formData = new FormData() // 使用FormData建構函數創建formdata類型的數據
        formData.append('file', files[0]) // 將表單名稱跟檔案加入formdata
        try {
          // 發送上傳請求
          const res = await axios.post(props.action, formData, {
            headers: { 'Content-Type': 'multipart/form-data' } // 設置請求頭
          })
          uploadedData.value = res.data
          fileStatus.value = 'success' // 請求成功後，設置上傳狀態為成功
          context.emit('file-uploaded', res.data) // 向外觸發file-uploaded事件
          if (fileInput.value) {
            // 如果存在fileInput節點
            // 不管請求是成功或失敗，都清空fileInput的值
            fileInput.value.value = ''
          }
        } catch (error) {
          fileStatus.value = 'error' // 請求成功後，設置上傳狀態為失敗
          context.emit('file-uploaded-error', { error }) // 向外觸發file-uploaded-error事件
          if (fileInput.value) {
            // 如果存在fileInput節點
            // 不管請求是成功或失敗，都清空fileInput的值
            fileInput.value.value = ''
          }
        }
      }
    }
    const handleDelete = () => {
      if (uploadedData.value) {
        uploadedData.value = ''
        context.emit('file-deleted')
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange,
      uploadedData,
      handleDelete
    }
  }
})
</script>
<style></style>
