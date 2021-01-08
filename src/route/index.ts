import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/views/ColumnDetail.vue'
import PostList from '@/components/PostList.vue'
import CreatePost from '@/components/CreatePost.vue'
import store from '@/store'
import Signup from '@/views/Signup.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostList
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiresLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { redirectAlreadyLogin: true }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiresLogin && !store.state.user.isLogin) {
    next({ name: 'login' })
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/')
  } else {
    next()
  }
})
export default router
