<template>
  <div class="dashboard-container">
    <h1>仪表盘</h1>
    <p>欢迎，{{ userStore.username }}！您的角色是：{{ userStore.role }}</p>

    <el-button type="primary" @click="logout">退出登录</el-button>

    <div v-if="userStore.role === 'admin'" style="margin-top: 20px;">
      <h2>管理员专属功能</h2>
      <router-link to="/device-management">
        <el-button type="success">前往设备管理</el-button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.dashboard-container {
  text-align: center;
  margin-top: 50px;
}
</style> 