<template>
    <div class="row">
      <div v-for="column in columnList" :key="column._id" class="col-4 mb-2 mt-3">
        <div class="card h-100 shadow-sm">
          <div class="card-body text-center d-flex flex-column justify-content-between align-items-center h-100">
            <div>
              <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border border-light w-25 my-3">
              <h5 class="card-title fw-bolder mb-3">{{column.title}}</h5>
              <p class="card-text text-left">{{column.description}}</p>
            </div>
            <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary w-50 mt-5">進入專欄</router-link>
          </div>
        </div>
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
    // 這裡必須使用computed，因為即使父組件props驅動了子組件的更新，但是setup只會執行一次，無法對數據的更新進行處理
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
    // 使用模板內判斷方法
    // eslint-disable-next-line
    // const a = require('@/assets/column.jpg')
    return {
      columnList

    }
  }
})
</script>
<style></style>
