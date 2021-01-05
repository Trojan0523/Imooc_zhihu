<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <ValidateForm @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">文章标题：</label>
      <ValidateInput :rules="titleRules" v-model="titleValue" placeholder="请输入文章详情" type="text">
      </ValidateInput>
    </div>
    <div class="mb-3">
      <label class="form-label">文章详情: </label>
      <ValidateInput type="textarea" placeholder="请输入文章详情" :rules="contentRules" v-model="contentValue"
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
import { GlobalDataProps } from '@/store'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PostProps } from '@/testData'

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
        const { columnId } = store.state.user
        if (columnId) {
          const newPost: PostProps = {
            id: new Date().getTime(),
            title: titleValue.value,
            content: contentValue.value,
            columnId,
            createdAt: new Date().toLocaleString()
          }
          store.commit('createPost', newPost)
          router.push({
            name: 'column',
            params: { id: columnId }
          })
        }
      }
    }
    return {
      titleValue,
      titleRules,
      contentValue,
      contentRules,
      onFormSubmit
    }
  }
})
</script>
