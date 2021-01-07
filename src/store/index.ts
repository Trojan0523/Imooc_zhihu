import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: number;
  column?: string;
  email?: string;
}

export interface PostProps {
  _id: number;
  title: string;
  excerpt?: string; // 摘要
  content?: string;
  image?: ImageProps;
  createdAt?: string;
  column: string;
}

export interface GlobalDataProps {
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

const getAndCommit = async (url: string, mutationsName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationsName, data)
}

const postAndCommit = async (url: string, mutationsName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationsName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    token: '',
    loading: false,
    columns: [],
    posts: [],
    user: {
      isLogin: false
    }
  },
  mutations: {
    // login (state) {
    //   state.user = {
    //     ...state.user,
    //     isLogin: true,
    //     name: 'trojan'
    //   }
    // },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    setLoading (state, status) {
      state.loading = status
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    async fetchColumn ({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    async fetchPosts ({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    fetchCurrentUser ({ commit }) {
      getAndCommit('/user/current', 'fetchCurrentUser', commit)
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  },
  modules: {}
})

export default store
