<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row">
        <div class="col-lg-8 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <div class="slogan-container">
            <h2 class="mt-5" ref="slogan">隨心寫作，自由表達</h2>
          </div>
          <p>
            <router-link to="/create" class="btn btn-primary my-3 fw-bolder"><i class="fas fa-pen me-2"></i>開始寫作</router-link>
          </p>
        </div>
      </div>
    </section>
      <column-list :list="list"></column-list>
    <button
      class="btn btn-outline-primary d-block mt-2 mb-5 mx-auto w-50"
      @click="loadMorePage"
      v-if="!isLastPage"
      >加載更多</button>
    <div v-else class="is-last-page text-center text-secondary py-5 fs-5"><i class="fas fa-exclamation-triangle me-2"></i>沒有更多專欄囉!</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, Ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import ColumnList from '../components/ColumnList.vue'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    // store中的getter屬性類似於computed屬性，將store中的數據處理過後進行返回
    const store = useStore<GlobalDataProps>()
    // 因為setup只會執行一次，但是vuex中的數據是響應式的，最簡單的方式是通過computed去監視vuex中的數據
    const list = computed(() => store.getters.getColumns)
    const total = computed(() => store.state.columns.total)
    const currentPage = computed(() => store.state.columns.currentPage)
    const slogan = ref<null | HTMLHeadingElement>(null)
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { currentPage: currentPage.value ? currentPage.value : 1, pageSize: 3 })

    const sloganAnimation = (slogan: Ref<HTMLHeadingElement | null>) => {
      if (slogan.value && slogan.value.textContent) {
        slogan.value.innerHTML = slogan.value.textContent.replace(/\S/g, '<span>$&</span>')
        let delay = 0
        for (let i = 0; i < slogan.value.children.length; i++) {
          const span = slogan.value.children[i] as HTMLSpanElement
          if (i === 5) delay += 1
          delay += 1
          span.style.setProperty('--delay', `${delay / 4}s`)
        }
        slogan.value.addEventListener('animationend', sloganAddEndedClass(slogan))
      }
    }
    const sloganAddEndedClass = (slogan: Ref<HTMLHeadingElement | null>) => (e: AnimationEvent) => {
      const spans = slogan.value && slogan.value.children
      if (slogan.value && spans && e.target === spans[spans.length - 1]) {
        slogan.value.classList.add('ended')
      }
    }

    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3 })
      sloganAnimation(slogan)
    })

    return {
      list,
      loadMorePage,
      isLastPage,
      slogan
    }
  }
})
</script>
<style lang="scss">
.slogan-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  h2 {
    padding: 0;
    font-family: monospace;
    white-space: nowrap;
    position: relative;
    span {
      display: inline-block;
      overflow: hidden;
      width: 0ch;
      animation: .1s text-in ease-in-out forwards;
      animation-delay: var(--delay);
    }
    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      background-color: var(--bs-blue);
      width: 4px;
      height: 30px;
      border-radius: 1px;
      right: -10px;
    }
    &.ended::after {
      animation: 1s cursor steps(2,jump-none) infinite;
    }
  }
}
@keyframes cursor {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes text-in {
  from {
    width: 0ch;
  }
  to {
    width: 2ch;
  }
}
</style>
