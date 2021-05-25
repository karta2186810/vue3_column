<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">隨心寫作，自由表達</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">開始寫作</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">發現精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
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
    const list = computed(() => store.state.columns)
    const biggerColumnLen = computed(() => store.getters.biggerColumnLen)
    return {
      list,
      biggerColumnLen
    }
  }
})
</script>
<style></style>
