<template>
  <div class="edit-profile">
    <div class="row">
      <h3 class="my-3 fw-bold col-lg-6 col-sm-12 mx-auto">編輯資料</h3>
      <uploader
        action="/upload"
        class="col-lg-6 col-sm-12 d-flex align-items-center justify-content-center  text-secondary mx-auto my-5"
        @file-uploaded="onFileUploaded"
      >
        <div v-if="storeUser.avatar" class="circle">
          <img :src="storeUser.avatar.url" alt="用戶頭像">
        </div>
        <h3 v-else>點擊上傳頭像</h3>
        <template #uploaded="dataProps">
          <div class="circle">
            <img :src="dataProps.uploadedData.data.url" alt="用戶頭像">
          </div>
        </template>
      </uploader>
      <validate-form
        @form-submit="onFormSubmit"
      >
        <label class="mb-1 fw-bold">用戶暱稱</label>
        <validate-input
          placeholder="請輸入暱稱"
          v-model="nameVal"
          type="text"
          :rules="nameRule"
        ></validate-input>
        <label class="mb-1 fw-bold">用戶介紹</label>
        <validate-input
          placeholder="請輸入介紹"
          v-model="descVal"
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
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps, AvatarProps, UserProps } from '../store'
import Uploader from '../components/Uploader.vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'EditProfile',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup () {
    // store
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const uploadedData = ref()
    const storeUser = computed<UserProps>(() => store.state.user)
    const descVal = ref(storeUser.value && storeUser.value.description)
    const nameVal = ref(storeUser.value && storeUser.value.nickName)
    watch(storeUser, () => {
      if (storeUser.value) {
        descVal.value = storeUser.value.description
        nameVal.value = storeUser.value.nickName
      }
    })
    // 輸入框規則
    const nameRule: RulesProp = [{ type: 'required', message: '暱稱不能為空' }]
    const descRule: RulesProp = [{ type: 'required', message: '介紹不能為空' }]
    // 圖片上傳完成事件
    const onFileUploaded = (newAvatar: AvatarProps) => {
      uploadedData.value = newAvatar
    }
    // 表單送出事件
    const onFormSubmit = (result: boolean) => {
      if (result) {
        let sendData
        if (uploadedData.value) {
          sendData = {
            description: descVal.value,
            nickName: nameVal.value,
            avatar: {
              _id: uploadedData.value.data._id,
              url: uploadedData.value.data.url
            }
          }
        } else {
          sendData = {
            description: descVal.value,
            nickName: nameVal.value
          }
        }

        store.dispatch('editUserProfile', { userId: storeUser.value._id, data: sendData }).then(() => {
          createMessage('資料更新完成，2秒後跳轉至首頁', 'success', 2000)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
      }
    }
    return {
      onFormSubmit,
      onFileUploaded,
      descVal,
      nameVal,
      nameRule,
      descRule,
      storeUser
    }
  }
})
</script>
<style lang="scss">
.edit-profile {
  width: 100%;
  height: 100%;
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
