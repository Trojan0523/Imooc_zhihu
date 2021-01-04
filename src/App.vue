<template>
  <div class="container">
    <GlobalHeader :user="currentUser" style="padding: 10px;"></GlobalHeader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 知乎专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader, { UserProps } from '@/components/GlobalHeader.vue'
import { RulesProp } from '@/components/ValidateInput.vue'

const currentUser: UserProps = {
  isLogin: false,
  name: 'Trojan'

}
const emailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader
  },
  setup () {
    const inputRef = ref<any>()
    const emailValue = ref('123@test.com')
    const emailRules: RulesProp = [
      {
        type: 'required',
        message: '电子邮箱地址不能为空'
      },
      {
        type: 'email',
        message: '请输入正确的电子邮箱格式'
      }
    ]
    const emailRef = reactive({
      value: '',
      error: false,
      message: ''
    })
    const passwordValue = ref('123')
    const passwordRules: RulesProp = [
      {
        type: 'required',
        message: '密码不能为空'
      }
    ]
    const validateEmail = () => {
      if (emailRef.value.trim() === '') {
        emailRef.error = true
        emailRef.message = 'can not be empty'
      } else if (!emailReg.test(emailRef.value)) {
        emailRef.error = true
        emailRef.message = 'Email validation is not correct'
      }
    }
    const onFormSubmit = (result: boolean) => {
      console.log('result', result)
    }
    return {
      currentUser,
      emailRef,
      validateEmail,
      emailRules,
      onFormSubmit,
      inputRef,
      emailValue,
      passwordValue,
      passwordRules
    }
  }
})
</script>

<style>
</style>
