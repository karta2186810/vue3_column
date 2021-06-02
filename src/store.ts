import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helpers'

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
  avatar?: AvatorProps
  description?: string
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface PostProps {
  _id?: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps | string
  createdAt?: string
  column: string
  author?: UserProps | string
}

export interface GlobalErrorProps {
  status: boolean
  message?: string
}

interface ListProps<P> {
  [id: string]: P
}

export interface GlobalDataProps {
  token: string
  columns: { currentPage: number, data: ListProps<ColumnProps>, total: number }
  posts: { loadedColumns: string[], data: ListProps<PostProps>, total: number, currentPage: number }
  user: UserProps
  loading: boolean
  error: GlobalErrorProps
}

// 將重複性的AJAX請求代碼進行封裝
/* const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
} */
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
  config: AxiosRequestConfig = { method: 'GET' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  // 儲存數據的地方
  state: {
    token: localStorage.getItem('token') || '',
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: [], currentPage: 0, total: 0 },
    user: { isLogin: false },
    loading: false,
    error: { status: false }
  },
  // 在mutation內進行數據的操作
  mutations: {
    // mutations對應組件commit的事件，可以接收到commit第二個參數傳過來的數據，這裡是newPost
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
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
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      /* if (!state.columns.isLoaded) {
        return asyncAndCommit('/columns?currentPage=1&pageSize=6', 'fetchColumns', commit)
      } */
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'GET' }, cid)
      }
    },
    fetchPost ({ state, commit }, cid) {
      const currentPost = state.posts.data[cid]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${cid}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'PATCH',
        data: payload
      })
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, { method: 'POST', data: payload })
    },
    fetchCurrentUser ({ commit }) {
      asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    async loginAndFetch ({ dispatch }, loginData) {
      await dispatch('login', loginData)
      return await dispatch('fetchCurrentUser')
    },
    createPost ({ commit }, payload) {
      asyncAndCommit('/posts', 'createPost', commit, { method: 'POST', data: payload })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'DELETE' })
    }
  },
  // 相當於computed
  getters: {
    getColumns: state => {
      return objToArr(state.columns.data).filter(column => column._id !== state.user.column)
    },
    // 如果getter需要進行參數的接收可以使用函數柯里化的形式
    getColumnsById: state => (id: string) => {
      if (state.columns.data) {
        return state.columns.data[id]
      }
    },
    getPostsByCid: state => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getPostByCid: state => (cid: string) => {
      return state.posts.data[cid]
    }
  }
})

export default store
