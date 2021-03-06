import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helpers'

export interface ImageProps {
  _id?: string
  url?: string
  createAt?: string
  fitUrl?: string
}

export interface AvatarProps {
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
  avatar?: AvatarProps
  description?: string | unknown
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
  mutations: {
    createPost (state, { data }) {
      state.posts.data[data._id] = data
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
    editUserColumn (state, { data }) {
      state.columns.data[data._id] = data
    },
    logout (state) {
      state.user = { isLogin: false }
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params

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
      // ???????????????????????????
      const { columnId, currentPage = 1, pageSize = 5 } = params
      // ??????????????????????????????????????????
      const { loadedColumns } = state.posts
      // ???????????????????????????????????????????????????????????????????????????0
      const loadedCurrentPage = (loadedColumns[columnId] && loadedColumns[columnId].currentPage) || 0
      // ??????loadedColumns??????????????????????????????????????????????????????????????????????????????????????????
      if (!Object.keys(loadedColumns).includes(columnId) || loadedCurrentPage < currentPage) {
        // ????????????
        return asyncAndCommit(`/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'GET' }, columnId)
      }
    },
    fetchPost ({ state, commit }, cid) {
      // ??????Posts????????????
      const { data } = state.posts
      // ???????????????id???????????????
      const currentPost = data[cid]
      // ?????????????????????????????????????????????????????????
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
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    async loginAndFetch ({ dispatch }, loginData) {
      await dispatch('login', loginData)
      return await dispatch('fetchCurrentUser')
    },
    editUserProfile ({ commit }, payload) {
      const { userId } = payload
      return asyncAndCommit(`/user/${userId}`, 'editUserProfile', commit, { method: 'PATCH', data: payload.data })
    },
    editUserColumn ({ commit }, payload) {
      const { columnId, data } = payload
      return asyncAndCommit(`/columns/${columnId}`, 'editUserColumn', commit, { method: 'PATCH', data })
    },
    createPost ({ commit }, payload) {
      asyncAndCommit('/posts', 'createPost', commit, { method: 'POST', data: payload })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'DELETE' })
    }
  },
  // ?????????computed
  getters: {
    getColumns: state => {
      return objToArr(state.columns.data).filter(column => column._id !== state.user.column)
    },
    getColumnById: state => (id: string) => {
      return state.columns.data[id]
    },
    // ??????getter???????????????????????????????????????????????????????????????
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
