import { Commit, createStore } from 'vuex'
import axios from 'axios'

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}

export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string; // 摘要
  content?: string;
  image?: ImageProps;
  createdAt?: string;
  column: string;
}

export interface GlobalDataProps {
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
const store = createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: [],
    user: {
      isLogin: false,
      name: 'trojan',
      columnId: 1
    }
  },
  mutations: {
    login (state) {
      state.user = {
        ...state.user,
        isLogin: true,
        name: 'trojan'
      }
    },
    fetchColumns (state, rowData) {
      state.columns = rowData.data.list
    },
    fetchColumn (state, rowData) {
      state.columns = [rowData.data]
    },
    fetchPosts (state, rowData) {
      state.posts = rowData.data.list
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
