import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router' // 导入路由实例
import ElementPlus from 'element-plus' // 导入 ElementPlus
import 'element-plus/dist/index.css' // 导入 ElementPlus 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入所有图标
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router) // 使用路由
app.use(ElementPlus) // 使用 ElementPlus 插件

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
