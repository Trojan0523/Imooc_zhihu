<template>
  <div class="signup-page mx-auto p-3 w-330">
    <ValidateForm @from-submit="onFromSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <ValidateInput rules="emailRules"
                       v-model="fromData.email"
                       placeholder="请输入邮箱地址"
                       type="text"/>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <ValidateInput
          :rules="nameRules"
          v-model="formData.nikeName"
          placeholder="请输入昵称"
          type="text"/>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <ValidateInput
          :rules="passwordRules"
          placeholder="请输入密码"
          type="password"
          v-model="formData.password"/>
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <ValidateInput
          :rules="passwordRules"
          placeholder="请再次请输入密码"
          type="password"
          v-model="formData.repeatpassword"/>
      </div>
    </ValidateForm>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ValidateForm from '@/components/ValidateForm'
import ValidateInput, { RulesProp } from '@/components/ValidateInput'
import axios from 'axios'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'Signup',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatpassword: ''
    })
    const router = useRouter()
    const emailsRules: RulesProp = [
      {
        type: 'required',
        message: '电子邮箱地址不能为空'
      },
      {
        type: 'email',
        message: '电子邮箱地址不能为空'
      }
    ]
    const nameRules: RulesProp = [
      {
        type: 'required',
        message: '昵称不能为空'
      }
    ]
    const passwordRules: RulesProp = [
      {
        type: 'required',
        message: '密码不能为空'
      }
    ]
    const repeatpasswordRules: RulesProp = [
      {
        type: 'required',
        message: '重复密码不能为空'
      },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatpassword
        },
        message: '密码不相同'
      }
    ]
    const onFromSubmit = async (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        await axios.post('/api/user', payload).then(data => {
          createMessage('注册成功 正在跳转登录界面', 'success', 2000)
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        })
          .catch(e => {
            console.error(e)
          })
      }
    }
    return {
      onFromSubmit,
      emailsRules,
      nameRules,
      passwordRules,
      repeatpasswordRules
    }
  }
})
</script>
