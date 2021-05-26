import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface UserProps {
  isLogin: boolean
  name?: string
  id?: number
  column?: number
}

export interface ImageProps {
  _id?: string
  url?: string
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface PostProps {
  _id: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps
  createdAt: string
  column: string
}

export interface GlobalDataProps {
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
  loading: boolean
}

// 將重複性的AJAX請求代碼進行封裝
const asyncCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}

const store = createStore<GlobalDataProps>({
  // 儲存數據的地方
  state: {
    columns: [],
    posts: [],
    user: { isLogin: false, name: 'chen', column: 1 },
    loading: false
  },
  // 在mutation內進行數據的操作
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: 'chen' }
    },
    // mutations對應組件commit的事件，可以接收到commit第二個參數傳過來的數據，這裡是newPost
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading (state, status) {
      state.loading = status
    }
  },
  // 異步的操作都在action中執行
  // action中的方法會接收到context裡面有store中的屬性及方法，使用commit提交一個mutation
  actions: {
    async fetchColumns ({ commit }) {
      asyncCommit('/columns', 'fetchColumns', commit)
    },
    async fetchColumn ({ commit }, cid) {
      asyncCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    async fetchPosts ({ commit }, cid) {
      asyncCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    }
  },
  // 相當於computed
  getters: {
    // 如果getter需要進行參數的接收可以使用函數柯里化的形式
    getColumnsById: state => (id: string) => {
      if (state.columns) {
        return state.columns.find(c => c._id === id)
      }
    },
    getPostsByCid: state => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
