<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb03 shadow-sm my-3">
      <div class="card-body px-5 py-4">
        <router-link :to="`/posts/${post._id}`" class="fw-bolder post-title">{{ post.title }}</router-link>
        <div class="row my-3 align-items-center">
          <div v-if="post.image && typeof post.image ==='object'" class="col-3">
            <img :src="post.image.url" :alt="post.title" class="rounded-lg w-75">
          </div>
          <p :class="{ 'col-9': post.image }">{{ post.excerpt }}</p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
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
  .post-title {
    text-decoration: none;
    color: inherit;
    font-size: 24px;
  }
}
</style>
