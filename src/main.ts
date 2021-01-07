import { createApp } from 'vue'
import App from './App.vue'
import router from '@/route'
import store from '@/store'
import axios from 'axios'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    icode: '493E7401B51D60FB'
  }
  if (config.data instanceof FormData) {
    config.data.append('icode', '493E7401B51D60FB')
  } else {
    config.data = {
      ...config.data,
      icode: '493E7401B51D60FB'
    }
  }
  return config
})
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  console.log(e.response)
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
