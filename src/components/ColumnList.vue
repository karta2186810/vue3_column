<template>
  <div class="column-list">
    <h4 class="text-center fw-bolder">發現精彩</h4>
    <div class="row">
      <transition-group name="columns">
        <div v-for="column in columnList" :key="column._id" class="col-lg-4 col-md-4 col-sm-12 mb-2 mt-3">
          <div class="card h-100 shadow-sm column-card">
            <div class="card-body text-center d-flex flex-column justify-content-between align-items-center h-100">
              <div class="w-100 overflow-hidden">
                <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle w-25 my-3 d-block mx-auto">
                <h5 class="card-title fw-bolder mb-3">{{column.title}}</h5>
                <p class="card-text text-left">{{column.description}}</p>
              </div>
              <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary w-50 mt-5">進入專欄</router-link>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ColumnProps } from '../store'

export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      /* 判斷是否存在頭圖，沒有的話使用預設頭圖 */
      return props.list.map(column => {
        if (!column.avatar) {
          // 在Vue中如果需要使用本地的資源，需要使用require，@代表指向src
          column.avatar = {
            url: require('@/assets/column.jpg')
          }
        }
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>
<style lang="scss">
.column-list {
  .column-card {
    transition: 0.3s;
    img {
      transition: 0.3s;
      border: 2px solid transparent;
    }
    &:hover {
      background-color: #efefef;
      img {
        border: 2px solid var(--bs-blue);
      }
    }
  }
  img {
    object-fit: cover;
  }
}

.columns-enter-active,
.columns-leave-active {
  transition: 0.3s;
}
.columns-enter-from,
.columns-leave-to {
  transform: translateY(20%);
}

.columns-leave-from,
.columns-enter-to {
  transform: translateY(0);
}
</style>
