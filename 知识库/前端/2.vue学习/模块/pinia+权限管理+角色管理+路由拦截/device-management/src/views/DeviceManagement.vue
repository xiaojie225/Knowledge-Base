<template>
  <div class="device-management-container">
    <h1>设备管理</h1>
    <p>这里是管理员专属的设备管理页面。</p>
    <el-button type="primary" @click="goBack">返回仪表盘</el-button>
    <!-- 实际的设备管理功能，例如表格展示设备列表、添加/编辑/删除设备等 -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.device-management-container {
  text-align: center;
  margin-top: 50px;
}
</style> 