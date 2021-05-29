import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface ImageProps {
  _id?: string
  url?: string
  createAt?: string
  fitUrl?: string
}

export interface AvatorProps {
  _id: string
  url: string
}

export interface ResponseType<P = { [key: string]: any }> {
  code: number
  message: string
  data: P
}

export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface AuthorProps {
  _id: string
  email: string
  nickName: string
  avatar?: AvatorProps
  description?: string
}

export interface PostProps {
  _id?: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps | string
  createdAt?: string
  column: string
  author?: AuthorProps | string
}

export interface GlobalErrorProps {
  status: boolean
  message?: string
}

export interface GlobalDataProps {
  token: string
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
  loading: boolean
  error: GlobalErrorProps
}

// 將重複性的AJAX請求代碼進行封裝
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  // 儲存數據的地方
  state: {
    token: localStorage.getItem('token') || '',
    columns: [],
    posts: [],
    user: { isLogin: false },
    loading: false,
    error: { status: false }
  },
  // 在mutation內進行數據的操作
  mutations: {
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
    fetchPost (state, rawData) {
      state.posts = [rawData.data]
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    logout (state) {
      state.user = { isLogin: false }
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  // 異步的操作都在action中執行
  // action中的方法會接收到context裡面有store中的屬性及方法，使用commit提交一個mutation
  actions: {
    fetchColumns ({ commit }) {
      return getAndCommit('/columns?currentPage=1&pageSize=6', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost ({ commit }, cid) {
      return getAndCommit(`/posts/${cid}`, 'fetchPost', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    fetchCurrentUser ({ commit }) {
      getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    async loginAndFetch ({ dispatch }, loginData) {
      await dispatch('login', loginData)
      return await dispatch('fetchCurrentUser')
    },
    createPost ({ commit }, payload) {
      postAndCommit('/posts', 'createPost', commit, payload)
    }
  },
  // 相當於computed
  getters: {
    // 如果getter需要進行參數的接收可以使用函數柯里化的形式
    getColumnsById: state => (cid: string) => {
      if (state.columns) {
        return state.columns.find(c => c._id === cid)
      }
    },
    getPostsByCid: state => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    },
    getPostByCid: state => (cid: string) => {
      return state.posts.find(c => c._id === cid)
    }
  }
})

export default store
