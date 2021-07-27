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
  posts: { loadedColumns: ListProps<{ currentPage: number; total: number }>, data: ListProps<PostProps> }
  user: UserProps
  loading: boolean
  error: GlobalErrorProps
}

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
  state: {
    token: localStorage.getItem('token') || '',
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {} },
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
      const { data } = state.posts
      const { list, count, currentPage } = rawData.data
      const listData = list as PostProps[]
      state.posts.data = { ...data, ...arrToObj(listData) }
      state.posts.loadedColumns[columnId] = { currentPage, total: count }
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
    editUserProfile (state, rawData) {
      state.user = { ...state.user, ...rawData.data }
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
    fetchPosts ({ state, commit }, params) {
      // 取出傳遞過來的參數
      const { columnId, currentPage = 1, pageSize = 5 } = params
      // 取出代表已經讀取的專欄的物件
      const { loadedColumns } = state.posts
      // 如果專欄存在，則返回該專欄的當前頁數，否則初始化為0
      const loadedCurrentPage = (loadedColumns[columnId] && loadedColumns[columnId].currentPage) || 0
      // 判斷loadedColumns中是否已經讀取該專欄，或是該專欄當前頁面小於要請求的當前頁面
      if (!Object.keys(loadedColumns).includes(columnId) || loadedCurrentPage < currentPage) {
        // 發送請求
        return asyncAndCommit(`/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'GET' }, columnId)
      }
    },
    fetchPost ({ state, commit }, cid) {
      // 取出Posts中的文章
      const { data } = state.posts
      // 將代表當前id的文章取出
      const currentPost = data[cid]
      // 如果不存在當前文章，或是該文章沒有內容
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
    editUserProfile ({ commit }, payload) {
      const { userId } = payload
      return asyncAndCommit(`/user/${userId}`, 'editUserProfile', commit, { method: 'PATCH', data: payload.data })
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
    },
    getTotalByCid: state => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].total
      } else {
        return 0
      }
    },
    getCurrentPageByCid: state => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].currentPage
      } else {
        return 0
      }
    }
  }
})

export default store
