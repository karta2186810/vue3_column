<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb03 shadow-sm my-3">
      <router-link :to="`/posts/${post._id}`">
        <div class="card-body px-5 py-4">
          <h3  class="fw-bolder post-title text-dark">{{ post.title }}</h3>
          <div class="row my-3 align-items-center">
            <div v-if="post.image && typeof post.image ==='object'" class="col-3">
              <img :src="post.image.url" :alt="post.title" class="rounded-lg w-75">
            </div>
            <p :class="{ 'col-9': post.image }" class="text-muted">{{ post.excerpt }}</p>
          </div>
          <span class="text-muted">{{ post.createdAt }}</span>
        </div>
      </router-link>
    </article>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PostProps } from '../store'
export default defineComponent({
  name: 'PostList',
  props: {
    posts: {
      type: Array as PropType<PostProps[]>,
      required: true
    }
  }
})
</script>
<style lang="scss">
.post-list {
  * {
    text-decoration: none;
  }
  .post-title {
    color: inherit;
    font-size: 24px;
  }
  article{
    trasition: 0.3s;
    &:hover {
      background-color: #efefef;
    }
  }
}
</style>
