<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light mt-5">隨心寫作，自由表達</h2>
          <p>
            <a href="#" class="btn btn-primary my-3 fw-bolder">開始寫作</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center fw-bolder">發現精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    // 因為setup只會執行一次，但是vuex中的數據是響應式的，最簡單的方式是通過computed去監視vuex中的數據
    const list = computed(() => store.state.columns)
    // store中的getter屬性類似於computed屬性，將store中的數據處理過後進行返回

    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    return {
      list
    }
  }
})
</script>
<style></style>
