<template>
  <div class="user-profile d-flex justify-content-start align-items-top py-3">
    <img v-if="user.avatar" :src="user.avatar.url" :alt="user.nickName" class="user-profile-image">
    <div v-else class="user-profile-image">
      <i class="fas fa-user-circle b-block w-100 h-100"></i>
    </div>
    <div>
      <h5 class="mb-0">{{ user.nickName }}</h5>
      <p v-if="user.description" class="text-secondary mb-0">{{ user.description }}</p>
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
  }
})
</script>
<style lang="scss">
.user-profile {
  .user-profile-image {
    width: 50px;
    height: 50px;
    margin-right: 16px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: 0.3s;
    color: #cfcfcf;
  }
  &:hover {
    .user-profile-image {
      border: 2px solid var(--bs-blue);
    }
  }
}
</style>
