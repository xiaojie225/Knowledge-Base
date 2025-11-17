import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: localStorage.getItem('username') || null,
    role: localStorage.getItem('role') || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
  },
  actions: {
    async login(username, password) {
      // 模拟登录API请求
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'admin') {
            this.username = 'admin'
            this.role = 'admin'
            this.token = 'admin_token'
            localStorage.setItem('username', 'admin')
            localStorage.setItem('role', 'admin')
            localStorage.setItem('token', 'admin_token')
            resolve({ username: 'admin', role: 'admin' })
          } else if (username === 'user' && password === 'user') {
            this.username = 'user'
            this.role = 'user'
            this.token = 'user_token'
            localStorage.setItem('username', 'user')
            localStorage.setItem('role', 'user')
            localStorage.setItem('token', 'user_token')
            resolve({ username: 'user', role: 'user' })
          } else {
            reject(new Error('用户名或密码错误'))
          }
        }, 1000)
      })
    },
    logout() {
      this.username = null
      this.role = null
      this.token = null
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('token')
      ElMessage.info('已退出登录')
    },
  },
}) 