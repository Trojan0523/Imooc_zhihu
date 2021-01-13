import { createApp } from 'vue'
import App from './App.vue'
import router from '@/route'
import store from '@/store'
import axios from 'axios'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    icode: 'D79C86268C2634B2'
  }
  if (config.data instanceof FormData) {
    config.data.append('icode', 'D79C86268C2634B2')
  } else {
    config.data = {
      ...config.data,
      icode: 'D79C86268C2634B2'
    }
  }
  return config
})
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', {
    status: false,
    message: ''
  })
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', {
    status: true,
    message: error
  })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
axios.get('/columns', { params: { key: 'hello' } }).then(res => {
  console.log(res.data)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
