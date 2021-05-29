<template>
  <div class="user-profile d-flex justify-content-start align-items-top py-3">
    <img :src="fitUrl" :alt="user.nickName">
    <div>
      <h5 class="mb-0">{{ user.nickName }}</h5>
      <p v-if="user.description" class="text-secondary text-secondary mb-0">{{ user.description }}</p>
      <p v-else class="text-secondary mb-0">say something</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { AuthorProps } from '../store'
export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<AuthorProps>,
      required: true
    }
    // avatar: {
    //   type: String,
    //   required: true
    // }
  },
  setup (props) {
    const fitUrl = computed(() => {
      if (props.user.avatar) {
        return props.user.avatar.url
      } else {
        return require('@/assets/column.jpg')
      }
    })
    return {
      fitUrl
    }
  }
})
</script>
<style lang="scss">
.user-profile {
  img {
    width: 50px;
    height: 50px;
    margin-right: 16px;
    border-radius: 50%;
  }
}
</style>
