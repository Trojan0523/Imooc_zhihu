<template>
  <div class="create-post-page container">
    <h4 style="text-align: center">{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
    <Uploader
      action="/upload"
      :before-upload="beforeuploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex justify-content-center align-items-center bg-light text-secondary w-100 my-4">
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" width="500" height="500">
      </template>
    </Uploader>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <ValidateInput :rules="titleRules" v-model="titleValue" placeholder="请输入文章标题" type="text">
        </ValidateInput>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情: </label>
        <ValidateInput type="textarea" placeholder="请输入文章详情，支持Markdown" :rules="contentRules" v-model="contentValue"
                       rows="10" tag="textarea"></ValidateInput>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode ? '更新文章' : '发表文章'}}</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import Uploader from '@/components/Uploader.vue'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { beforeUploadCheck } from '@/utils/helper'
import createMessage from '@/components/createMessage'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup () {
    const uploadedData = ref()
    const titleValue = ref('')
    const contentValue = ref('')
    let imageId = ''
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const titleRules: RulesProp = [
      {
        type: 'required',
        message: '文章标题不能为空'
      }
    ]
    const contentRules: RulesProp = [
      {
        type: 'required',
        message: '文章详情不能为空'
      }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleValue.value = currentPost.title
          contentValue.value = currentPost.content || ''
        })
      }
    })
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const {
          column,
          _id
        } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleValue.value,
            content: contentValue.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功,2秒后跳转到文章', 'success', 2000)
          }).catch(e => {
            console.error(e)
          })
          setTimeout(() => {
            router.push({
              name: 'column',
              params: { id: column }
            })
          }, 2000)
        }
      }
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => {
          console.log(res)
        })
      }
    }
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const beforeuploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const {
        passed,
        error
      } = result
      if (error === 'format') {
        createMessage('上传图片只能是JPG/PNG格式!', 'error', 5000)
      }
      if (error === 'size') {
        createMessage('上传文件大小不能超过1Mb', 'error', 5000)
      }
      return passed
    }
    return {
      titleValue,
      titleRules,
      contentValue,
      contentRules,
      isEditMode,
      onFormSubmit,
      handleFileChange,
      beforeuploadCheck,
      handleFileUploaded,
      uploadedData
    }
  }
})
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}

.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* CSS属性指定可替换元素的内容可以如何适应到其使用的高度和宽度确定的边框 */
  cursor: pointer;
}
</style>
