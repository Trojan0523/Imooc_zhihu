<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
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
        <button class="btn btn-primary btn-large">发表文章</button>
    </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { GlobalDataProps, PostProps } from '@/store'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const titleValue = ref('')
    const contentValue = ref('')
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
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
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleValue.value,
            content: contentValue.value,
            column
          }
          store.commit('createPost', newPost)
          router.push({
            name: 'column',
            params: { id: column }
          })
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
        }).then((res: any) => {
          console.log(res)
        })
      }
    }
    return {
      titleValue,
      titleRules,
      contentValue,
      contentRules,
      onFormSubmit,
      handleFileChange
    }
  }
})
</script>
