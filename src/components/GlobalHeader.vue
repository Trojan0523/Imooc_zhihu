<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4">
    <a href="#" class="navbar-brand">之乎者也</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/" class="btn btn-outline-light my-2">首页</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <Dropdown :title="`你好 ${user.name}`">
          <dropdownItem><router-link to="/create" class="dropdown-item">新建文章</router-link></dropdownItem>
          <dropdownItem disabled><a href="#" class="dropdown-item">编辑资料</a></dropdownItem>
          <dropdownItem><a href="#" class="dropdown-item">退出登录</a></dropdownItem>
        </Dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import DropdownItem from '@/components/DropdownItem.vue'

export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}

export default defineComponent({
  name: 'GlobalHeader',
  components: { Dropdown, DropdownItem },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  }
})
</script>

<style></style>
