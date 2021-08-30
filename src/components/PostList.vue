<template>
  <div class="post-list">
    <transition-group name="posts">
      <article v-for="post in posts" :key="post._id" class="card mb03 shadow-sm my-3">
        <router-link :to="`/posts/${post._id}`">
          <div class="card-body px-4 py-4">
            <h3  class="fw-bolder post-title text-dark">{{ post.title }}</h3>
            <div class="d-flex my-3 align-items-center">
              <div
                v-if="post.image && typeof post.image ==='object'"
                class="col-3 post-image overflow-hidden"
                :style="{ backgroundImage: `url(${post.image.url})` }"
              >
              </div>
              <div
                v-else
                class="col-3 post-image overflow-hidden"
              >
                <i class="fas fa-image w-100 h-100"></i>
              </div>
              <p :class="{ 'col-9': post.image }" class="text-muted post-excerpt ps-5 align-self-start text-break">{{ post.excerpt }}</p>
            </div>
            <span class="text-muted">發表於: {{ post.createdAt }}</span>
          </div>
        </router-link>
      </article>
    </transition-group>
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
  .post-image {
    padding-top: 20%;
    background-position: center center;
    background-size: cover;
    height: 0;
    position: relative;
    svg {
      position: absolute;
      left: 0;
      top: 0;
      background-color: #cfcfcf;
      color: #fff;
    }
  }
  @media (max-width: 576px) {
    .post-excerpt {
      display: none;
    }
    .post-image {
      width: 100%;
      padding-top: 70%;
    }
  }
}
.posts-enter-active,
.posts-leave-active {
  transition: 0.3s;
}
.posts-enter-from,
.posts-leave-to {
  transform: translateY(20%);
}

.posts-leave-from,
.posts-enter-to {
  transform: translateY(0);
}
</style>
