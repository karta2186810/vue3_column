<template>
  <div class="edit-column">
    <h3 class="my-5">編輯專欄</h3>
    <uploader
      action="/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-50 mx-auto my-4"
      @file-uploaded="onFileUploaded"
    >
      <div v-if="currentColumn && currentColumn.avatar" class="circle">
        <img :src="currentColumn.avatar.url" :alt="currentColumn.title">
      </div>
      <h2 v-else>點擊上傳封面圖片</h2>
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
    <validate-form
      @form-submit="onFormSubmit"
    >
      <label class="fw-bolder mb-1">專欄名稱:</label>
      <validate-input
        placeholder="請輸入名稱"
        v-model="columnName"
        type="text"
        :rules="nameRule"
      ></validate-input>
      <label class="fw-bolder mb-1">專欄介紹:</label>
      <validate-input
        placeholder="請輸入介紹"
        v-model="columnDesc"
        tag="textarea"
        rows="5"
        :rules="descRule"
      ></validate-input>
      <template #submit>
        <button class="btn btn-primary w-100">確認更改</button>
      </template>
    </validate-form>
  </div>
</template>
<script lang="ts">
import { ref, computed, defineComponent, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { AvatarProps, ColumnProps, UserProps } from '@/store'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/components/createMessage'
export default defineComponent({
  name: 'edit-column',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const storeUser = computed<UserProps>(() => store.state.user)
    const currentColumn = computed(() => store.getters.getColumnById(storeUser.value.column))
    const columnName = ref(currentColumn.value && currentColumn.value.title)
    const columnDesc = ref(currentColumn.value && currentColumn.value.description)
    const uploadedData = ref()
    // 輸入框規則
    const nameRule: RulesProp = [{ type: 'required', message: '名稱不能為空' }]
    const descRule: RulesProp = [{ type: 'required', message: '介紹不能為空' }]

    const fetchCurrentColumn = (cid: string) => {
      store.dispatch('fetchColumn', cid).then(res => {
        const { data: { title, description } } = res
        columnDesc.value = description
        columnName.value = title
      })
    }
    watch(storeUser, async () => {
      if (storeUser.value && !currentColumn.value) {
        if (storeUser.value.column) {
          fetchCurrentColumn(storeUser.value.column)
        }
      }
    })
    onMounted(() => {
      const cid = storeUser.value.column
      if (cid && !currentColumn.value) {
        fetchCurrentColumn(cid)
      }
    })
    const onFileUploaded = (newAvatar: any) => {
      uploadedData.value = newAvatar
      console.log(newAvatar)
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        let sendData
        if (uploadedData.value) {
          sendData = {
            description: columnDesc.value,
            title: columnName.value,
            avatar: {
              _id: uploadedData.value.data._id,
              url: uploadedData.value.data.url
            }
          }
        } else {
          sendData = {
            description: columnDesc.value,
            title: columnName.value
          }
        }

        store.dispatch('editUserColumn', { columnId: currentColumn.value._id, data: sendData }).then(() => {
          createMessage('資料更新完成，2秒後跳轉至專欄頁', 'success', 2000)
          setTimeout(() => {
            router.push(`/column/${currentColumn.value._id}`)
          }, 2000)
        })
      }
    }
    return {
      currentColumn,
      columnName,
      columnDesc,
      nameRule,
      descRule,
      onFileUploaded,
      onFormSubmit
    }
  }
})
</script>
<style lang="scss">
.edit-column {
  h3 {
    text-align: center;
  }
  .file-upload-container {
    width: 200px;
    height: 200px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    border: 1px solid #efefef;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
