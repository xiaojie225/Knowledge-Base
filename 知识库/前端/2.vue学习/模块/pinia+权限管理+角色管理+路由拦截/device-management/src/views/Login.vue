<template>
  <div class="login-container">
    <h2>登录</h2>
    <el-form :model="loginForm" ref="loginFormRef" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await userStore.login(loginForm.username, loginForm.password)
    ElMessage.success('登录成功')
    router.push('/dashboard') // 登录成功后跳转到仪表盘
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  }
}
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style> 