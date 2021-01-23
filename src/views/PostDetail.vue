<template>
  <div class="post-detail-page">
    <Modal title="删除文章" :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定要删除这篇文章吗？</p>
    </Modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">    <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
    <h2 class="mb-4">{{currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
              <div class="col">
                 <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
               </div>
               <span class="text-muted col text-right font-italic">发表于：{{currentPost.createdAt}}</span>
             </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link :to="{name: 'create', query: {id: currentPost._id}}" type="button" class="btn btn-success">编辑</router-link>
        <router-link to="" type="button" class="btn btn-danger" @click.prevent="modalIsVisible= true">删除</router-link>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import UserProfile from '@/components/UserProfile.vue'
import createMessage from '@/components/createMessage'
import MarkdownIt from 'markdown-it'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, PostProps, ImageProps, UserProps, ResponseType } from '@/store'
import Modal from '@/components/Modal.vue'
export default defineComponent({
  name: 'post-detail',
  components: { UserProfile, Modal },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const modalIsVisible = ref(false)
    const currentId = route.params.id
    const md = MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    const showEditArea = computed(() => {
      const { _id, isLogin } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        return md.render(currentPost.value.content)
      }
    })
    const currentImageUrl = computed(() => {
      const { image } = currentPost.value
      if (currentPost.value && currentPost.value.image) {
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('删除成功, 2秒后跳转专栏首页', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'column', params: { id: rawData.data.column } })
        }, 2000)
      })
    }
    return {
      currentPost,
      currentHTML,
      currentImageUrl,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>

<style></style>
