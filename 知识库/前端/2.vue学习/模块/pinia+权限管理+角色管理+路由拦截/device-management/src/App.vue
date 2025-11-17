<script setup>
// 这里可以根据需要添加逻辑，例如显示当前用户信息或退出按钮
</script>

<template>
  <el-container>
    <el-header style="border-bottom: 1px solid #ebeef5; padding: 0 20px;">
      <div class="nav-bar">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/login" class="nav-item">登录</router-link>
        <router-link to="/dashboard" class="nav-item">仪表盘</router-link>
        <router-link to="/device-management" class="nav-item">设备管理 (管理员)</router-link>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.nav-item {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.nav-item.router-link-active {
  color: #409eff;
}
</style>
