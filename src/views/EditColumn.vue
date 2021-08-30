<template>
  <div class="edit-column py-5 w-100">
    <div class="row flex-column align-items-center">
      <h3 class="text-center fw-bold col-lg-6 col-sm-12 mx-auto">編輯專欄</h3>
      <uploader
        action="/upload"
        class="col-lg-6 col-sm-12 d-flex align-items-center justify-content-center  text-secondary mx-auto my-5 circle"
        @file-uploaded="onFileUploaded"
      >
        <div v-if="currentColumn && currentColumn.avatar" class="circle">
          <img :src="currentColumn.avatar.url" :alt="currentColumn.title">
        </div>
        <div v-else class="circle avatar-fallback d-flex justify-content-center align-items-center">
          <i class="fas fa-book b-block w-50 h-50"></i>
        </div>
        <template #loading>
          <div class="d-flex">
            <div class="spinner-border text-secondary mx-3"></div>
            <h2>正在上傳...</h2>
          </div>
        </template>
        <template #uploaded="dataProps">
          <img :src="dataProps.uploadedData.data.url" alt="專欄頭像">
        </template>
      </uploader>
      <validate-form
        @form-submit="onFormSubmit"
      >
        <label class="fw-bolder mb-1">專欄名稱</label>
        <validate-input
          placeholder="請輸入名稱"
          v-model="columnName"
          type="text"
          :rules="nameRule"
        ></validate-input>
        <label class="fw-bolder mb-1">專欄介紹</label>
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
        if (res) {
          columnDesc.value = res.data.description
          columnName.value = res.data.title
        }
      })
    }
    watch(storeUser, async () => {
      if (storeUser.value && storeUser.value.column) {
        if (!currentColumn.value) {
          fetchCurrentColumn(storeUser.value.column)
        }
      }
    })
    onMounted(() => {
      const cid = storeUser.value.column
      if (cid) {
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
              _id: uploadedData.value.data && uploadedData.value.data._id,
              url: uploadedData.value.data && uploadedData.value.data.url
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
  width: 100%;
  height: 100%;
  align-self: start;
  .avatar-fallback {
    background-color: #cfcfcf;
    color: #fff;
  }
  .circle {
    width: 200px;
    height: 200px;
    border-radius: 200px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    border: 1px solid #efefef;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: 0.2s;
    }
    &:hover {
      img {
        transform: scale(1.1);
      }
      &::after {
        content: '點擊上傳圖片';
        font-size: 24px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.2);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
