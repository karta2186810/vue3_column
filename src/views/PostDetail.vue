<template>
    <div v-if="currentPost" class="detail-page col-lg-8 mx-auto">
      <modal
        title="刪除文章"
        :visible="isModalVisible"
        @modal-on-close="closeModal"
        @modal-on-confirm="hideAndDelete"
      >
        <p>確定刪除文章?</p>
      </modal>
      <div class="post-image-container" v-if="currentPost.image && typeof currentPost.image === 'object'">
        <img :src="currentPost.image.url" alt="">
      </div>
      <h2 class="fw-bolder">{{ currentPost.title }}</h2>
      <div class="border-top border-bottom py-3 mb-5 d-flex align-items-center justify-content-between">
        <div class="user-profile">
          <user-profile
            @click="toColumn"
            :user="currentPost.author"
            v-if="typeof currentPost.author === 'object'"></user-profile>
        </div>
        <span class="text-muted post-create">發表於: {{ currentPost.createdAt }}</span>
      </div>
      <div v-html="currentHTML" class="post-content"></div>
      <div v-if="showEditArea()" class="bnt-group my-5">
        <router-link
          type="button"
          class="btn btn-primary me-1"
          :to="{ name: 'create', query: { id: currentPost._id }}"
        ><i class="far fa-edit me-2"></i>編輯</router-link>
        <button
          type="button"
          class="btn btn-danger"
          @click="isModalVisible = true"
        ><i class="far fa-trash-alt me-2"></i>刪除</button>
      </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import { GlobalDataProps, PostProps, UserProps, ResponseType } from '../store'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'PostDetail',
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const isModalVisible = ref(false)
    const route = useRoute()
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const md = new MarkdownIt()
    const currentId = route.params.id
    const currentPost = computed<PostProps>(() => store.getters.getPostByCid(currentId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        return md.render(currentPost.value.content)
      } else {
        return ''
      }
    })
    const showEditArea = () => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    }
    const closeModal = () => {
      isModalVisible.value = false
    }
    const hideAndDelete = () => {
      closeModal()
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('刪除成功，2秒後跳轉到專欄首頁', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'column', params: { id: rawData.data.column } })
        }, 2000)
      })
    }
    const toColumn = () => {
      router.push(`/column/${currentPost.value.column}`)
    }
    watchEffect(() => {
      document.title = (currentPost.value && currentPost.value.title) || document.title
    })

    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    return {
      currentId,
      currentPost,
      currentHTML,
      showEditArea,
      isModalVisible,
      closeModal,
      hideAndDelete,
      toColumn
    }
  }
})
</script>
<style lang="scss">
.detail-page {
  width: 100%;
  height: 100%;
  margin-top: 70px;
  h2 {
    margin-top: 48px;
    margin-bottom: 24px;
  }
  .post-image-container {
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  }
  .post-create {
    font-style: italic;
  }
  .user-profile {
    cursor: pointer;
  }
  @media (max-width: 576px) {
    .post-create {
      display: none;
    }
  }
  .post-content {
    padding-bottom: 80px;
    word-break: break-word;
  }
}
</style>
