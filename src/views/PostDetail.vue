<template>
  <div v-if="currentPost" class="detail-page w-75 mx-auto">
    <div class="post-image-container" v-if="currentPost.image && typeof currentPost.image === 'object'">
      <img :src="currentPost.image.url" alt="">
    </div>
    <h2>{{ currentPost.title }}</h2>
    <div class="border-top border-bottom py-3 mb-5 d-flex align-items-center justify-content-between">
      <div>
        <user-profile :user="currentPost.author"></user-profile>
      </div>
      <span class="text-muted post-create">發表於: {{ currentPost.createdAt }}</span>
    </div>
    <div v-html="currentHTML" class="post-contant"></div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import { GlobalDataProps, PostProps } from '../store'
import UserProfile from '../components/UserProfile.vue'
export default defineComponent({
  name: 'PostDetail',
  components: {
    UserProfile
  },
  setup () {
    const route = useRoute()
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
    onMounted(() => {
      store.dispatch('fetchPost', currentId).then(res => console.log(res)
      )
    })
    return {
      currentId,
      currentPost,
      currentHTML
    }
  }
})
</script>
<style lang="scss">
.detail-page {
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
  .post-contant {
    padding-bottom: 80px;
  }
}
</style>
