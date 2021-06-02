<template>
  <div class="user-profile d-flex justify-content-start align-items-top py-3">
    <img :src="fitUrl" :alt="user.nickName">
    <div>
      <h5 class="mb-0">{{ user.nickName }}</h5>
      <p v-if="user.description" class="text-secondary text-secondary mb-0">{{ user.description }}</p>
      <p v-else class="text-secondary mt-1 mb-0">還沒有任何介紹哦!</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, onMounted } from 'vue'
import { UserProps } from '../store'
export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup (props) {
    console.log(props.user)
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
