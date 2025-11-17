import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user' // 导入用户 Store

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'user'] } // 示例：需要认证和特定角色
  },
  {
    path: '/device-management',
    name: 'DeviceManagement',
    component: () => import('../views/DeviceManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] } // 示例：只有管理员才能访问
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 未登录，重定向到登录页
      next({ name: 'Login' })
      return
    }

    // 检查角色权限
    if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
      // 没有所需角色，重定向到仪表盘
      // next({ name: 'Dashboard' })
            next('/device-manageme1nt')

      return
    }
  }

  // 如果已登录用户访问登录页，则重定向到仪表盘
  if (to.name === 'Login' && userStore.isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router 