# Vue组件与插件开发文档

## 完整代码

### 1. Vue组件示例

#### Vue 2写法 - 单文件组件
```vue
<!-- MyComponent.vue -->
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  props: {
    title: {
      type: String,
      default: '默认标题'
    },
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.$emit('button-click', {
        count: ++this.count,
        timestamp: new Date().toLocaleString()
      })
    }
  }
}
</script>

<style scoped>
.my-component {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  margin: 0 auto;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
```

#### Vue 3写法 - 单文件组件
```vue
<!-- MyComponent.vue -->
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '默认标题'
  },
  message: {
    type: String,
    required: true
  }
})

const count = ref(0)

const emit = defineEmits(['button-click'])

const handleClick = () => {
  emit('button-click', {
    count: ++count.value,
    timestamp: new Date().toLocaleString()
  })
}
</script>

<style scoped>
.my-component {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  margin: 0 auto;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
```

#### Vue 2写法 - 全局注册组件
```js
// main.js
import Vue from 'vue'
import App from './App.vue'

// 全局注册组件
Vue.component('my-component', {
  template: `
    <div class="my-component">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button @click="handleClick">点击我</button>
    </div>
  `,
  props: {
    title: {
      type: String,
      default: '默认标题'
    },
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.$emit('button-click', {
        count: ++this.count,
        timestamp: new Date().toLocaleString()
      })
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
```

#### Vue 3写法 - 全局注册组件
```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局注册组件
app.component('my-component', {
  template: `
    <div class="my-component">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button @click="handleClick">点击我</button>
    </div>
  `,
  props: {
    title: {
      type: String,
      default: '默认标题'
    },
    message: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const count = ref(0)
  
    const handleClick = () => {
      emit('button-click', {
        count: ++count.value,
        timestamp: new Date().toLocaleString()
      })
    }
  
    return {
      count,
      handleClick
    }
  }
})

app.mount('#app')
```

### 2. Vue插件示例

#### Vue 2写法 - 插件开发
```js
// my-plugin.js
const MyPlugin = {
  install(Vue, options) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
      console.log('这是全局方法')
    }

    // 2. 添加全局资源
    Vue.directive('focus', {
      inserted: function (el) {
        el.focus()
      }
    })

    // 3. 注入组件选项
    Vue.mixin({
      created: function () {
        console.log('组件创建')
      }
    })

    // 4. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
      console.log('实例方法调用，参数为:', methodOptions)
    }
  
    // 5. 添加全局组件
    Vue.component('plugin-component', {
      template: '<div>这是一个插件提供的组件</div>'
    })
  }
}

export default MyPlugin
```

#### Vue 3写法 - 插件开发
```js
// my-plugin.js
import { ref } from 'vue'

const MyPlugin = {
  install(app, options) {
    // 1. 添加全局属性或方法
    app.config.globalProperties.$myGlobalMethod = () => {
      console.log('这是全局方法')
    }

    // 2. 添加全局资源
    app.directive('focus', {
      mounted: (el) => {
        el.focus()
      }
    })

    // 3. 添加全局组件
    app.component('plugin-component', {
      template: '<div>这是一个插件提供的组件</div>'
    })
  
    // 4. 提供一个全局的响应式状态
    const globalState = ref({
      count: 0
    })
  
    app.provide('globalState', globalState)
  
    // 5. 提供一个全局方法
    app.mixin({
      methods: {
        $myMethod(methodOptions) {
          console.log('实例方法调用，参数为:', methodOptions)
        }
      }
    })
  }
}

export default MyPlugin
```

#### Vue 2写法 - 插件注册与使用
```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import MyPlugin from './my-plugin'

// 注册插件
Vue.use(MyPlugin, { someOption: true })

new Vue({
  render: h => h(App),
}).$mount('#app')
```

```vue
<!-- 在组件中使用插件 -->
<template>
  <div>
    <input v-focus />
    <plugin-component />
    <button @click="usePluginMethod">使用插件方法</button>
  </div>
</template>

<script>
export default {
  methods: {
    usePluginMethod() {
      // 使用全局方法
      Vue.myGlobalMethod()
    
      // 使用实例方法
      this.$myMethod({ option1: 'value1' })
    }
  }
}
</script>
```

#### Vue 3写法 - 插件注册与使用
```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyPlugin from './my-plugin'

const app = createApp(App)

// 注册插件
app.use(MyPlugin, { someOption: true })

app.mount('#app')
```

```vue
<!-- 在组件中使用插件 -->
<template>
  <div>
    <input v-focus />
    <plugin-component />
    <button @click="usePluginMethod">使用插件方法</button>
    <p>全局状态计数: {{ globalState.count }}</p>
    <button @click="incrementGlobalCount">增加全局计数</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 注入插件提供的全局状态
const globalState = inject('globalState')

const incrementGlobalCount = () => {
  globalState.value.count++
}

const usePluginMethod = () => {
  // 在 Vue 3 中使用全局方法
  const app = getCurrentInstance().appContext.app
  app.config.globalProperties.$myGlobalMethod()

  // 使用实例方法
  const instance = getCurrentInstance()
  instance.proxy.$myMethod({ option1: 'value1' })
}
</script>
```

### 3. 综合示例 - 插件提供全局组件和功能

#### Vue 2写法
```js
// notification-plugin.js
const NotificationPlugin = {
  install(Vue, options = {}) {
    const defaultOptions = {
      duration: 3000,
      position: 'top-right'
    }
  
    const finalOptions = { ...defaultOptions, ...options }
  
    // 创建通知组件
    const NotificationComponent = Vue.extend({
      props: {
        message: {
          type: String,
          required: true
        },
        type: {
          type: String,
          default: 'info',
          validator: value => ['success', 'warning', 'info', 'error'].includes(value)
        }
      },
      data() {
        return {
          visible: true
        }
      },
      computed: {
        iconClass() {
          const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            error: 'fa-times-circle'
          }
          return `fa ${icons[this.type]}`
        }
      },
      mounted() {
        setTimeout(() => {
          this.visible = false
        }, finalOptions.duration)
      },
      methods: {
        close() {
          this.visible = false
        }
      },
      template: `
        <transition name="notification-fade">
          <div v-if="visible" class="notification" :class="[type, finalOptions.position]">
            <i :class="iconClass"></i>
            <span class="message">{{ message }}</span>
            <button class="close-btn" @click="close">×</button>
          </div>
        </transition>
      `
    })
  
    // 添加全局方法
    Vue.prototype.$notify = function(message, type = 'info') {
      const notificationConstructor = Vue.extend(NotificationComponent)
      const instance = new notificationConstructor({
        propsData: {
          message,
          type
        }
      })
    
      // 挂载到body上
      const mountNode = document.createElement('div')
      document.body.appendChild(mountNode)
      instance.$mount(mountNode)
    
      // 销毁通知
      instance.$watch('visible', (val) => {
        if (!val) {
          setTimeout(() => {
            instance.$destroy()
            document.body.removeChild(mountNode)
          }, 500)
        }
      })
    }
  }
}

export default NotificationPlugin
```

#### Vue 3写法
```js
// notification-plugin.js
import { createApp, h } from 'vue'

const NotificationPlugin = {
  install(app, options = {}) {
    const defaultOptions = {
      duration: 3000,
      position: 'top-right'
    }
  
    const finalOptions = { ...defaultOptions, ...options }
  
    // 创建通知组件
    const NotificationComponent = {
      name: 'Notification',
      props: {
        message: {
          type: String,
          required: true
        },
        type: {
          type: String,
          default: 'info',
          validator: value => ['success', 'warning', 'info', 'error'].includes(value)
        }
      },
      setup(props, { emit }) {
        const visible = ref(true)
      
        const iconClass = computed(() => {
          const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            error: 'fa-times-circle'
          }
          return `fa ${icons[props.type]}`
        })
      
        onMounted(() => {
          setTimeout(() => {
            visible.value = false
          }, finalOptions.duration)
        })
      
        const close = () => {
          visible.value = false
        }
      
        return () => h(
          'transition',
          { name: 'notification-fade' },
          {
            default: () => visible.value ? h('div', {
              class: ['notification', props.type, finalOptions.position]
            }, [
              h('i', { class: iconClass.value }),
              h('span', { class: 'message' }, props.message),
              h('button', {
                class: 'close-btn',
                onClick: close
              }, '×')
            ]) : null
          }
        )
      }
    }
  
    // 创建通知容器
    const notificationContainer = document.createElement('div')
    notificationContainer.id = 'notification-container'
    document.body.appendChild(notificationContainer)
  
    const notificationApp = createApp({
      data() {
        return {
          notifications: []
        }
      },
      methods: {
        addNotification(message, type) {
          const id = Date.now()
          this.notifications.push({ id, message, type })
        
          setTimeout(() => {
            this.removeNotification(id)
          }, finalOptions.duration)
        
          return id
        },
        removeNotification(id) {
          const index = this.notifications.findIndex(n => n.id === id)
          if (index !== -1) {
            this.notifications.splice(index, 1)
          }
        }
      },
      template: `
        <div class="notification-container">
          <notification
            v-for="note in notifications"
            :key="note.id"
            :message="note.message"
            :type="note.type"
          />
        </div>
      `
    })
  
    notificationApp.component('notification', NotificationComponent)
    notificationApp.mount(notificationContainer)
  
    // 添加全局方法
    app.config.globalProperties.$notify = function(message, type = 'info') {
      const root = notificationContainer.__vue_app__
      if (root) {
        return root._instance.ctx.addNotification(message, type)
      }
      return null
    }
  
    // 提供通知方法
    app.provide('$notify', app.config.globalProperties.$notify)
  }
}

export default NotificationPlugin
```

## 学习知识

### 1. Vue组件

#### 组件的定义
- 组件是Vue应用中可复用的UI元素，每个组件拥有自己的HTML、CSS和JavaScript代码
- 在Vue中每个.vue文件可以视为一个组件，也可以通过JavaScript对象定义组件

#### 组件的特点
- **封装性**：组件将模板、逻辑和样式封装在一起
- **可复用性**：组件可以在应用中多次使用
- **维护性**：组件化使代码更加模块化，便于维护
- **通信性**：组件之间可以通过props、events等方式通信

#### 组件的注册方式
- **全局注册**：通过Vue.component()方法注册，可以在任何组件中使用
- **局部注册**：在组件内部通过components选项注册，只能在当前组件及其子组件中使用

#### 组件的编写形式
- **单文件组件(.vue文件)**：包含template、script、style三个部分
- **JavaScript对象形式**：使用JavaScript对象定义组件属性和方法
- **模板标签形式**：在HTML中使用template标签定义组件模板

### 2. Vue插件

#### 插件的定义
- 插件是为Vue添加全局功能的代码包
- 插件通常暴露一个install方法，该方法接收Vue构造函数和一个可选的选项对象作为参数

#### 插件的功能范围
- 添加全局方法或属性
- 添加全局资源，如指令、过滤器、过渡等
- 通过全局混入添加组件选项
- 添加Vue实例方法
- 提供自己的API，同时实现上述一个或多个功能

#### 插件的开发方式
- 定义一个包含install方法的JavaScript对象
- 在install方法中实现插件功能
- 使用Vue.use()注册插件

### 3. 组件与插件的区别

#### 编写形式
- **组件**：通常使用.vue单文件格式，包含模板、脚本和样式
- **插件**：是一个JavaScript对象，包含一个install方法

#### 注册形式
- **组件**：通过Vue.component()全局注册或在组件内部局部注册
- **插件**：通过Vue.use()注册

#### 使用场景
- **组件**：用于构建应用的业务模块，目标是App.vue
- **插件**：用于增强Vue本身的功能，目标是Vue框架

#### 关系
- 插件可以提供全局组件
- 插件可以增强组件的功能
- 组件和插件可以结合使用，共同构建应用

## 用途

### 1. Vue组件的用途

#### UI界面构建
- **页面布局**：使用组件构建应用的页面布局，如头部、侧边栏、内容区等
- **表单元素**：封装输入框、按钮、选择器等表单元素
- **数据展示**：构建表格、卡片、列表等数据展示组件
- **交互组件**：开发模态框、弹窗、提示框等交互组件

#### 业务功能封装
- **业务模块**：将特定业务功能封装为组件，如购物车、用户资料等
- **复杂交互**：封装复杂交互逻辑，如拖拽、排序等
- **数据可视化**：开发图表、地图等数据可视化组件

### 2. Vue插件的用途

#### 功能扩展
- **第三方库集成**：集成第三方库，如Element UI、Vuetify、Vue Router等
- **全局状态管理**：提供全局状态管理功能，如Vuex、Pinia
- **API接口封装**：封装API接口调用，提供统一的接口请求方法

#### 工具集成
- **HTTP请求**：提供axios等HTTP请求工具的全局配置和封装
- **国际化**：提供i18n国际化功能
- **主题管理**：提供应用主题切换功能

#### 开发辅助
- **调试工具**：提供开发环境的调试工具
- **性能监控**：提供应用性能监控功能
- **日志系统**：提供应用日志记录功能

### 3. 组件与插件的实际应用场景

#### 组件应用场景
1. **后台管理系统**：使用组件构建表格、表单、图表等页面
   ```vue
   <!-- 表格组件 -->
   <template>
     <div class="data-table">
       <table>
         <thead>
           <tr>
             <th v-for="column in columns" :key="column.key">{{ column.title }}</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="(item, index) in data" :key="index">
             <td v-for="column in columns" :key="column.key">
               {{ item[column.key] }}
             </td>
           </tr>
         </tbody>
       </table>
     </div>
   </template>
   ```

2. **电商平台**：使用组件构建商品列表、购物车、订单表等
   ```vue
   <!-- 商品卡片组件 -->
   <template>
     <div class="product-card">
       <img :src="product.image" :alt="product.name" class="product-image">
       <h3 class="product-name">{{ product.name }}</h3>
       <p class="product-price">{{ product.price | currency }}</p>
       <button @click="addToCart">加入购物车</button>
     </div>
   </template>
   ```

3. **社交应用**：使用组件构建消息列表、用户资料、评论区等
   ```vue
   <!-- 消息组件 -->
   <template>
     <div class="message" :class="{ 'my-message': isMyMessage }">
       <img :src="message.userAvatar" class="user-avatar">
       <div class="message-content">
         <div class="message-header">
           <span class="username">{{ message.username }}</span>
           <span class="timestamp">{{ message.timestamp }}</span>
         </div>
         <div class="message-text">{{ message.text }}</div>
       </div>
     </div>
   </template>
   ```

#### 插件应用场景
1. **UI框架插件**：如Element UI、Ant Design Vue等
   ```js
   // Element UI插件注册
   import Vue from 'vue'
   import ElementUI from 'element-ui'
   import 'element-ui/lib/theme-chalk/index.css'
 
   Vue.use(ElementUI)
   ```

2. **路由插件**：如Vue Router
   ```js
   // Vue Router插件注册
   import Vue from 'vue'
   import VueRouter from 'vue-router'
 
   Vue.use(VueRouter)
 
   const routes = [
     { path: '/', component: Home },
     { path: '/about', component: About }
   ]
 
   const router = new VueRouter({
     routes
   })
 
   new Vue({
     router
   }).$mount('#app')
   ```

3. **状态管理插件**：如Vuex、Pinia
   ```js
   // Vuex插件注册
   import Vue from 'vue'
   import Vuex from 'vuex'
 
   Vue.use(Vuex)
 
   const store = new Vuex.Store({
     state: {
       count: 0
     },
     mutations: {
       increment(state) {
         state.count++
       }
     }
   })
 
   new Vue({
     store
   }).$mount('#app')
   ```

4. **自定义功能插件**：如通知系统、权限管理等
   ```js
   // 自定义权限管理插件
   const PermissionPlugin = {
     install(Vue, options) {
       // 权限指令
       Vue.directive('permission', {
         inserted(el, binding) {
           const { value } = binding
           const hasPermission = options.checkPermission(value)
         
           if (!hasPermission) {
             el.parentNode && el.parentNode.removeChild(el)
           }
         }
       })
     
       // 权限检查方法
       Vue.prototype.$hasPermission = function(permission) {
         return options.checkPermission(permission)
       }
     }
   }
 
   Vue.use(PermissionPlugin, {
     checkPermission(permission) {
       // 实现权限检查逻辑
       return true
     }
   })
   ```

[标签: Vue 组件与插件]

## 面试题目

### 10个概念题目

1. **什么是Vue组件？什么是Vue插件？它们之间有什么区别？**
   **答案**：
   Vue组件是Vue应用中可复用的UI元素，每个组件拥有自己的HTML、CSS和JavaScript代码。组件通常以.vue文件的形式存在，包含template、script和style三个部分。
 
   Vue插件是为Vue添加全局功能的代码包，通常是一个JavaScript对象，包含一个install方法。插件可以用来添加全局方法或属性、全局资源、组件选项混入、Vue实例方法等。
 
   区别：
   - 编写形式：组件使用.vue单文件格式，插件是一个包含install方法的JavaScript对象
   - 注册方式：组件通过Vue.component()或局部components注册，插件通过Vue.use()注册
   - 使用场景：组件用于构建应用的业务模块，目标是App.vue；插件用于增强Vue本身的功能，目标是Vue框架

2. **Vue组件有哪些注册方式？各自有什么特点和应用场景？**
   **答案**：
   Vue组件有两种注册方式：全局注册和局部注册。
 
   全局注册：通过Vue.component()方法注册，可以在任何组件中使用。特点是一旦注册，整个应用中都可以使用。适用于基础组件，如按钮、输入框等会在多个页面中使用的组件。
 
   局部注册：在组件内部通过components选项注册，只能在当前组件及其子组件中使用。特点是注册范围有限，不会影响其他组件。适用于特定业务场景的组件，如用户资料卡片、商品列表等。

3. **Vue插件的install方法可以接收哪些参数？如何使用这些参数？**
   **答案**：
   Vue插件的install方法可以接收两个参数：Vue构造函数（在Vue 3中是应用实例）和一个可选的选项对象。
 
   Vue构造函数参数（在Vue 2中）或应用实例参数（在Vue 3中）用于访问Vue的全局API，注册全局组件、指令、混入等。选项对象参数用于传递插件的配置信息，可以在install方法中使用这些配置来定制插件的功能。

4. **如何在Vue 2和Vue 3中分别添加全局方法和属性？有什么区别？**
   **答案**：
   在Vue 2中，可以通过以下方式添加全局方法和属性：
   ```js
   // 添加全局方法
   Vue.myGlobalMethod = function () {
     // 逻辑...
   }
 
   // 添加实例方法
   Vue.prototype.$myMethod = function () {
     // 逻辑...
   }
   ```
 
   在Vue 3中，方式有所不同：
   ```js
   // 添加全局属性和方法
   app.config.globalProperties.$myGlobalMethod = function () {
     // 逻辑...
   }
 
   // 在组件中访问
   import { getCurrentInstance } from 'vue'
 
   export default {
     setup() {
       const { proxy } = getCurrentInstance()
       proxy.$myGlobalMethod()
     }
   }
   ```
 
   主要区别：Vue 3使用app.config.globalProperties替代了Vue.prototype，并且需要通过getCurrentInstance来访问当前组件实例。

5. **如何开发一个Vue插件？请描述开发过程和主要步骤。**
   **答案**：
   开发Vue插件的主要步骤如下：
   6. 创建一个JavaScript对象，该对象必须包含一个install方法
   7. 在install方法中实现插件功能，可以包括：
      - 添加全局方法或属性
      - 添加全局资源（指令、过滤器等）
      - 注入组件选项（通过混入）
      - 添加Vue实例方法
      - 注册全局组件
   8. 导出该插件对象
   9. 在应用中通过Vue.use()方法注册插件
   10. 在组件中使用插件提供的功能

11. **Vue组件之间的通信方式有哪些？如何在插件中实现组件间的通信？**
   **答案**：
   Vue组件之间的通信方式有：
   - Props和$emit：父子组件通信
   - ref：直接访问子组件实例
   - EventBus：任意组件通信
   - Vuex/Pinia：全局状态管理
   - provide/inject：祖先与后代组件通信
 
   在插件中实现组件间的通信：
   1. 使用EventBus模式：在插件中创建一个中央事件总线，将其添加到Vue.prototype上
   2. 使用Vuex/Pinia：在插件中集成状态管理库
   3. 使用provide/inject：在插件中提供全局状态或方法，组件通过inject获取

4. **如何在Vue插件中注册全局组件？请给出一个完整的示例。**
   **答案**：
   在Vue插件中注册全局组件的示例如下：
   ```js
   // my-plugin.js
   const MyPlugin = {
     install(Vue) {
       // 全局组件注册
       Vue.component('global-component', {
         template: '<div>这是一个全局组件</div>',
         props: {
           message: {
             type: String,
             default: '默认消息'
           }
         }
       })
     }
   }
 
   export default MyPlugin
   ```

5. **Vue插件中的全局混入(mixin)有什么作用？使用时需要注意什么？**
   **答案**：
   Vue插件中的全局混入可以影响所有组件，向所有组件注入相同的行为或属性。主要用于：
   - 添加全局生命周期钩子
   - 添加全局方法或计算属性
   - 添加全局组件选项
 
   使用时需要注意：
   1. 谨慎使用，避免污染所有组件
   2. 属性或方法命名要有唯一性，避免与组件自身属性冲突
   3. 考虑性能影响，全局混入会在每个组件创建时执行
   4. 在Vue 3中，全局混入被应用混入(app.mixin)替代

5. **如何在Vue插件中实现自定义指令？请给出一个实现元素自动获取焦点的指令示例。**
   **答案**：
   在Vue插件中实现自定义指令的示例如下：
   ```js
   // focus-directive-plugin.js
   const FocusDirectivePlugin = {
     install(Vue) {
       Vue.directive('focus', {
         inserted: function (el) {
           el.focus()
         }
       })
     }
   }
 
   export default FocusDirectivePlugin
   ```
 
   在Vue 3中：
   ```js
   // focus-directive-plugin.js
   const FocusDirectivePlugin = {
     install(app) {
       app.directive('focus', {
         mounted: (el) => {
           el.focus()
         }
       })
     }
   }
 
   export default FocusDirectivePlugin
   ```

6. **什么是单文件组件(.vue文件)？它有什么优势？**
    **答案**：
    单文件组件是Vue特有的文件格式，以.vue为扩展名，包含template、script和style三个部分，分别用于定义组件的模板、逻辑和样式。
  
    单文件组件的优势：
    1. **完整封装**：将一个组件的模板、逻辑和样式封装在一个文件中，使组件更加独立
    2. **语法高亮**：支持语法高亮和代码提示，提高开发效率
    3. **预处理功能**：支持使用预处理器，如Sass、Less、TypeScript等
    4. **模块化**：支持模块化的开发方式，便于代码复用和管理
    5. **作用域样式**：支持scoped属性，使样式只对当前组件有效，避免样式冲突

### 10道业务逻辑题

1. **开发一个全局通知插件，要求可以通过this.$notify()方法在任何组件中调用显示通知，通知应支持不同类型（成功、错误、警告、信息），并设置默认持续时间为3秒。**
   **答案**：
   ```js
   // notification-plugin.js
   const NotificationPlugin = {
     install(Vue, options = {}) {
       const defaultOptions = {
         duration: 3000,
         position: 'top-right'
       }
     
       const finalOptions = { ...defaultOptions, ...options }
     
       // 创建通知组件
       const NotificationConstructor = Vue.extend({
         props: {
           message: {
             type: String,
             required: true
           },
           type: {
             type: String,
             default: 'info',
             validator: value => ['success', 'warning', 'info', 'error'].includes(value)
           }
         },
         data() {
           return {
             visible: true
           }
         },
         computed: {
           iconClass() {
             const icons = {
               success: 'fa-check-circle',
               warning: 'fa-exclamation-triangle',
               info: 'fa-info-circle',
               error: 'fa-times-circle'
             }
             return `fa ${icons[this.type]}`
           },
           containerClass() {
             return `notification-container ${finalOptions.position}`
           }
         },
         mounted() {
           setTimeout(() => {
             this.close()
           }, finalOptions.duration)
         },
         methods: {
           close() {
             this.visible = false
             this.$emit('close')
           }
         },
         template: `
           <div :class="containerClass">
             <div class="notification" :class="type" v-if="visible">
               <i :class="iconClass"></i>
               <span class="message">{{ message }}</span>
               <button class="close-btn" @click="close">×</button>
             </div>
           </div>
         `
       })
     
       // 添加实例方法
       Vue.prototype.$notify = function(message, type = 'info') {
         // 创建通知实例
         const notification = new NotificationConstructor({
           propsData: { message, type }
         })
       
         // 挂载通知
         const mountNode = document.createElement('div')
         document.body.appendChild(mountNode)
         notification.$mount(mountNode)
       
         // 监听关闭事件，移除DOM元素
         notification.$on('close', () => {
           setTimeout(() => {
             notification.$destroy()
             document.body.removeChild(mountNode)
           }, 500)
         })
       
         return notification
       }
     }
   }
 
   export default NotificationPlugin
   ```

2. **开发一个全局过滤器插件，提供日期格式化和货币格式化功能，要求支持Vue 2的过滤器写法和Vue 3的全局属性写法。**
   **答案**：
   ```js
   // format-plugin.js
   const FormatPlugin = {
     install(Vue, options = {}) {
       // Vue 2 过滤器
       if (Vue.version.startsWith('2')) {
         // 日期格式化过滤器
         Vue.filter('date', (value, format = 'YYYY-MM-DD') => {
           if (!value) return ''
           const date = new Date(value)
         
           const year = date.getFullYear()
           const month = String(date.getMonth() + 1).padStart(2, '0')
           const day = String(date.getDate()).padStart(2, '0')
           const hours = String(date.getHours()).padStart(2, '0')
           const minutes = String(date.getMinutes()).padStart(2, '0')
           const seconds = String(date.getSeconds()).padStart(2, '0')
         
           return format
             .replace('YYYY', year)
             .replace('MM', month)
             .replace('DD', day)
             .replace('HH', hours)
             .replace('mm', minutes)
             .replace('ss', seconds)
         })
       
         // 货币格式化过滤器
         Vue.filter('currency', (value, symbol = '¥', decimals = 2) => {
           if (!value) return `${symbol}0.00`
           return `${symbol}${Number(value).toFixed(decimals)}`
         })
       }
     
       // Vue 3 全局属性
       if (Vue.config && Vue.config.globalProperties) {
         // 添加全局方法
         Vue.config.globalProperties.$format = {
           date(value, format = 'YYYY-MM-DD') {
             if (!value) return ''
             const date = new Date(value)
           
             const year = date.getFullYear()
             const month = String(date.getMonth() + 1).padStart(2, '0')
             const day = String(date.getDate()).padStart(2, '0')
             const hours = String(date.getHours()).padStart(2, '0')
             const minutes = String(date.getMinutes()).padStart(2, '0')
             const seconds = String(date.getSeconds()).padStart(2, '0')
           
             return format
               .replace('YYYY', year)
               .replace('MM', month)
               .replace('DD', day)
               .replace('HH', hours)
               .replace('mm', minutes)
               .replace('SS', seconds)
           },
           currency(value, symbol = '¥', decimals = 2) {
             if (!value) return `${symbol}0.00`
             return `${symbol}${Number(value).toFixed(decimals)}`
           }
         }
       }
     }
   }
 
   export default FormatPlugin
   ```

3. **开发一个权限控制插件，提供v-permission指令和$hasPermission方法，用于控制元素显示和路由访问权限。**
   **答案**：
   ```js
   // permission-plugin.js
   const PermissionPlugin = {
     install(Vue, options = {}) {
       // 默认配置
       const defaultOptions = {
         checkPermission: () => false // 默认无权限
       }
     
       // 合并配置
       const finalOptions = { ...defaultOptions, ...options }
     
       // 权限指令
       Vue.directive('permission', {
         inserted(el, binding) {
           const { value } = binding
           const hasPermission = finalOptions.checkPermission(value)
         
           if (!hasPermission) {
             // 移除元素
             el.parentNode && el.parentNode.removeChild(el)
           }
         }
       })
     
       // 权限检查方法
       Vue.prototype.$hasPermission = function(permission) {
         return finalOptions.checkPermission(permission)
       }
     
       // 路由守卫
       if (Vue.router) {
         Vue.router.beforeEach((to, from, next) => {
           // 检查路由是否需要权限
           if (to.meta.requiresAuth) {
             const { permission } = to.meta
             if (permission && !finalOptions.checkPermission(permission)) {
               // 无权限，跳转到无权限页面
               next({ path: '/403' })
             } else {
               next()
             }
           } else {
             next()
           }
         })
       }
     }
   }
 
   export default PermissionPlugin
   ```

4. **开发一个表格组件插件，支持排序、筛选和分页功能，并可以通过配置项自定义列显示和行为。**
   **答案**：
   ```js
   // table-plugin.js
   const TablePlugin = {
     install(Vue) {
       // 表格组件
       const TableComponent = {
         name: 'AdvancedTable',
         props: {
           data: {
             type: Array,
             required: true
           },
           columns: {
             type: Array,
             required: true
           },
           pagination: {
             type: Object,
             default: () => ({
               pageSize: 10,
               currentPage: 1
             })
           }
         },
         data() {
           return {
             sortColumn: '',
             sortDirection: 'asc',
             localPagination: { ...this.pagination }
           }
         },
         computed: {
           filteredData() {
             let result = [...this.data]
           
             // 应用排序
             if (this.sortColumn) {
               result.sort((a, b) => {
                 const valueA = a[this.sortColumn]
                 const valueB = b[this.sortColumn]
               
                 if (valueA < valueB) {
                   return this.sortDirection === 'asc' ? -1 : 1
                 }
                 if (valueA > valueB) {
                   return this.sortDirection === 'asc' ? 1 : -1
                 }
                 return 0
               })
             }
           
             // 应用分页
             const start = (this.localPagination.currentPage - 1) * this.localPagination.pageSize
             const end = start + this.localPagination.pageSize
           
             return result.slice(start, end)
           },
           totalPages() {
             return Math.ceil(this.data.length / this.localPagination.pageSize)
           }
         },
         methods: {
           sort(column) {
             if (this.sortColumn === column) {
               this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
             } else {
               this.sortColumn = column
               this.sortDirection = 'asc'
             }
           },
           getSortIcon(column) {
             if (this.sortColumn !== column) {
               return 'fa-sort'
             }
             return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
           },
           changePage(page) {
             if (page >= 1 && page <= this.totalPages) {
               this.localPagination.currentPage = page
               this.$emit('page-change', page)
             }
           }
         },
         template: `
           <div class="advanced-table">
             <table>
               <thead>
                 <tr>
                   <th v-for="column in columns" :key="column.key" @click="sort(column.key)">
                     {{ column.title }}
                     <i :class="['fa', getSortIcon(column.key)]"></i>
                   </th>
                 </tr>
               </thead>
               <tbody>
                 <tr v-for="(item, index) in filteredData" :key="index">
                   <td v-for="column in columns" :key="column.key">
                     <slot :name="'cell-' + column.key" :row="item" :value="item[column.key]">
                       {{ item[column.key] }}
                     </slot>
                   </td>
                 </tr>
               </tbody>
             </table>
           
             <div class="pagination" v-if="totalPages > 1">
               <button @click="changePage(1)" :disabled="localPagination.currentPage === 1">首页</button>
               <button @click="changePage(localPagination.currentPage - 1)" :disabled="localPagination.currentPage === 1">上一页</button>
               <span>第 {{ localPagination.currentPage }} / {{ totalPages }} 页</span>
               <button @click="changePage(localPagination.currentPage + 1)" :disabled="localPagination.currentPage === totalPages">下一页</button>
               <button @click="changePage(totalPages)" :disabled="localPagination.currentPage === totalPages">末页</button>
             </div>
           </div>
         `
       }
     
       // 注册全局组件
       Vue.component('advanced-table', TableComponent)
     }
   }
 
   export default TablePlugin
   ```

5. **开发一个国际化插件，支持多语言切换，并提供$t方法用于文本翻译。**
   **答案**：
   ```js
   // i18n-plugin.js
   const I18nPlugin = {
     install(Vue, options = {}) {
       // 默认语言和翻译
       const defaultOptions = {
         locale: 'zh-CN',
         fallbackLocale: 'zh-CN',
         messages: {}
       }
     
       // 合并配置
       const finalOptions = { ...defaultOptions, ...options }
     
       // 当前语言
       let currentLocale = finalOptions.locale
     
       // 翻译方法
       const $t = (key, params = {}) => {
         let message = key.split('.').reduce((obj, k) => {
           if (obj) return obj[k]
           return null
         }, finalOptions.messages[currentLocale])
       
         // 如果当前语言没有找到，尝试使用回退语言
         if (!message && currentLocale !== finalOptions.fallbackLocale) {
           message = key.split('.').reduce((obj, k) => {
             if (obj) return obj[k]
             return null
           }, finalOptions.messages[finalOptions.fallbackLocale])
         }
       
         // 如果还是没有找到，返回key
         if (!message) return key
       
         // 替换参数
         return message.replace(/\{(\w+)\}/g, (match, param) => {
           return params[param] || match
         })
       }
     
       // 设置语言方法
       const setLocale = (locale) => {
         currentLocale = locale
       }
     
       // Vue 2
       if (Vue.version.startsWith('2')) {
         // 添加全局方法
         Vue.prototype.$t = $t
         Vue.prototype.$setLocale = setLocale
       
         // 添加全局属性
         Vue.$setLocale = setLocale
         Vue.$currentLocale = () => currentLocale
       }
     
       // Vue 3
       if (Vue.config && Vue.config.globalProperties) {
         // 添加全局方法
         Vue.config.globalProperties.$t = $t
         Vue.config.globalProperties.$setLocale = setLocale
       
         // 添加全局属性
         Vue.$setLocale = setLocale
         Vue.$currentLocale = () => currentLocale
       
         // 提供翻译方法
         Vue.provide('$t', $t)
       }
     
       // 提供混合
       Vue.mixin({
         computed: {
           $currentLocale() {
             return currentLocale
           }
         }
       })
     }
   }
 
   export default I18nPlugin
   ```

6. **开发一个表单验证插件，提供v-validate指令和表单验证方法。**
   **答案**：
   ```js
   // validation-plugin.js
   const ValidationPlugin = {
     install(Vue) {
       // 规则集合
       const rules = {
         required: value => !!value || '必填项',
         email: value => {
           const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
           return pattern.test(value) || '请输入有效的邮箱地址'
         },
         min: (min) => value => {
           if (!value) return true
           return value.length >= min || `最少需要${min}个字符`
         },
         max: (max) => value => {
           if (!value) return true
           return value.length <= max || `最多允许${max}个字符`
         },
         numeric: value => {
           if (!value) return true
           return !isNaN(parseFloat(value)) && isFinite(value) || '请输入数字'
         }
       }
     
       // 验证指令
       Vue.directive('validate', {
         inserted(el, binding, vnode) {
           const { value, arg, modifiers } = binding
           const fieldName = arg || 'field'
           const form = vnode.context
 
           // 初始化表单错误对象
           if (!form.$errors) {
             form.$errors = {}
           }
         
           // 初始化错误消息
           form.$errors[fieldName] = ''
         
           // 验证函数
           const validate = () => {
             const fieldValue = el.value
             let isValid = true
             let errorMsg = ''
           
             // 处理多个规则
             const ruleKeys = Object.keys(modifiers).filter(key => rules[key])
             if (Array.isArray(value)) {
               ruleKeys.push(...value)
             }
           
             // 执行验证
             for (const rule of ruleKeys) {
               const ruleFunc = typeof rule === 'string' ? rules[rule] : rule
               const result = typeof ruleFunc === 'function' ? ruleFunc(fieldValue) : true
             
               if (result !== true) {
                 isValid = false
                 errorMsg = result
                 break
               }
             }
           
             // 更新错误消息
             form.$errors[fieldName] = errorMsg
           
             return isValid
           }
         
           // 初始验证
           validate()
         
           // 添加事件监听
           el.addEventListener('input', validate)
           el.addEventListener('blur', validate)
         
           // 保存验证函数
           el._validate = validate
         },
         unbind(el) {
           // 移除事件监听
           el.removeEventListener('input', el._validate)
           el.removeEventListener('blur', el._validate)
         }
       })
     
       // 表单验证方法
       Vue.prototype.$validateForm = function(formRef) {
         const form = this.$refs[formRef]
         if (!form || !form.$el) return false
       
         let isValid = true
         const inputs = form.$el.querySelectorAll('[v-validate]')
       
         // 触发所有输入的验证
         inputs.forEach(input => {
           if (input._validate && !input._validate()) {
             isValid = false
           }
         })
       
         return isValid
       }
     }
   }
 
   export default ValidationPlugin
   ```

7. **开发一个模态弹窗插件，支持通过this.$modal()方法调用，并返回Promise。**
   **答案**：
   ```js
   // modal-plugin.js
   const ModalPlugin = {
     install(Vue) {
       // 模态框组件
       const ModalComponent = Vue.extend({
         props: {
           title: {
             type: String,
             default: '提示'
           },
           content: {
             type: String,
             default: ''
           },
           showCancel: {
             type: Boolean,
             default: true
           },
           cancelText: {
             type: String,
             default: '取消'
           },
           confirmText: {
             type: String,
             default: '确定'
           }
         },
         data() {
           return {
             visible: true
           }
         },
         methods: {
           confirm() {
             this.visible = false
             this.$emit('confirm')
           },
           cancel() {
             this.visible = false
             this.$emit('cancel')
           }
         },
         template: `
           <transition name="modal-fade">
             <div class="modal-overlay" v-if="visible" @click.self="cancel">
               <div class="modal-container">
                 <div class="modal-header">{{ title }}</div>
                 <div class="modal-body">{{ content }}</div>
                 <div class="modal-footer">
                   <button class="cancel-btn" @click="cancel" v-if="showCancel">{{ cancelText }}</button>
                   <button class="confirm-btn" @click="confirm">{{ confirmText }}</button>
                 </div>
               </div>
             </div>
           </transition>
         `
       })
     
       // 添加实例方法
       Vue.prototype.$modal = function(options) {
         return new Promise((resolve, reject) => {
           // 处理参数
           const props = typeof options === 'string' ? { content: options } : options
         
           // 创建模态框实例
           const modal = new ModalComponent({
             propsData: props
           })
         
           // 挂载模态框
           const mountNode = document.createElement('div')
           document.body.appendChild(mountNode)
           modal.$mount(mountNode)
         
           // 监听事件
           modal.$on('confirm', () => {
             resolve(true)
             setTimeout(() => {
               modal.$destroy()
               document.body.removeChild(mountNode)
             }, 500)
           })
         
           modal.$on('cancel', () => {
             resolve(false)
             setTimeout(() => {
               modal.$destroy()
               document.body.removeChild(mountNode)
             }, 500)
           })
         })
       }
     }
   }
 
   export default ModalPlugin
   ```

8. **开发一个图表组件插件，支持展示不同类型的图表（折线图、柱状图、饼图等）。**
   **答案**：
   ```js
   // chart-plugin.js
   // 假设使用 Chart.js 库
   import Chart from 'chart.js/auto'
 
   const ChartPlugin = {
     install(Vue) {
       // 图表组件
       const ChartComponent = {
         name: 'AppChart',
         props: {
           type: {
             type: String,
             default: 'bar',
             validator: value => ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'].includes(value)
           },
           data: {
             type: Object,
             required: true
           },
           options: {
             type: Object,
             default: () => ({})
           }
         },
         data() {
           return {
             chart: null
           }
         },
         mounted() {
           this.renderChart()
         },
         watch: {
           data: {
             deep: true,
             handler() {
               this.updateChart()
             }
           },
           type() {
             this.updateChart()
           },
           options: {
             deep: true,
             handler() {
               this.updateChart()
             }
           }
         },
         methods: {
           renderChart() {
             const ctx = this.$refs.canvas.getContext('2d')
             this.chart = new Chart(ctx, {
               type: this.type,
               data: this.data,
               options: this.options
             })
           },
           updateChart() {
             if (this.chart) {
               this.chart.destroy()
               this.renderChart()
             }
           }
         },
         template: `
           <div class="chart-container">
             <canvas ref="canvas"></canvas>
           </div>
         `
       }
     
       // 注册全局组件
       Vue.component('app-chart', ChartComponent)
     }
   }
 
   export default ChartPlugin
   ```

9. **开发一个图片懒加载插件，提供v-lazy指令，当图片进入视口时加载。**
   **答案**：
   ```js
   // lazy-load-plugin.js
   const LazyLoadPlugin = {
     install(Vue) {
       // 观察者实例
       let observer = null
     
       // 创建观察者
       const createObserver = () => {
         if (observer) return
       
         observer = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
             if (entry.isIntersecting) {
               const el = entry.target
               const src = el.getAttribute('data-src')
             
               if (src) {
                 el.src = src
                 el.removeAttribute('data-src')
                 observer.unobserve(el)
               }
             }
           })
         }, {
           rootMargin: '50px' // 提前50px加载
         })
       }
     
       // 懒加载指令
       Vue.directive('lazy', {
         inserted(el, binding) {
           // 设置占位图
           el.src = binding.arg || 'placeholder.jpg'
         
           // 设置实际图片地址
           el.setAttribute('data-src', binding.value)
         
           // 确保观察者存在
           createObserver()
         
           // 观察元素
           observer.observe(el)
         },
         unbind(el) {
           if (observer) {
             observer.unobserve(el)
           }
         }
       })
     
       // 添加全局方法刷新所有懒加载图片
       Vue.prototype.$refreshLazyLoad = () => {
         if (observer) {
           // 重新连接观察者
           observer.disconnect()
         
           document.querySelectorAll('[data-src]').forEach(el => {
             observer.observe(el)
           })
         }
       }
     }
   }
 
   export default LazyLoadPlugin
   ```

10. **开发一个无限滚动插件，当用户滚动到页面底部时触发加载更多数据。**
    **答案**：
    ```js
    // infinite-scroll-plugin.js
    const InfiniteScrollPlugin = {
      install(Vue) {
        // 无限滚动指令
        Vue.directive('infinite-scroll', {
          inserted(el, binding, vnode) {
            const { value, expression } = binding
            const context = vnode.context
          
            // 配置选项
            const options = {
              distance: typeof value === 'number' ? value : 100,
              disabled: false,
              immediate: true,
              callback: expression ? context[expression] : () => {}
            }
          
            // 如果传递了对象作为值
            if (typeof value === 'object' && value !== null) {
              Object.keys(value).forEach(key => {
                if (key in options) {
                  options[key] = value[key]
                }
              })
            
              // 支持对象中定义函数
              if (value.callback) {
                options.callback = value.callback
              }
            }
          
            // 处理滚动
            const handleScroll = () => {
              if (options.disabled) return
            
              const scrollDistance = el.scrollHeight - (el.scrollTop + el.clientHeight)
            
              if (scrollDistance <= options.distance) {
                options.callback()
              }
            }
          
            // 添加滚动事件监听
            el.addEventListener('scroll', handleScroll)
          
            // 立即执行一次
            if (options.immediate) {
              options.callback()
            }
          
            // 保存函数引用以便后续移除
            el._infiniteScrollHandler = handleScroll
          },
          unbind(el) {
            // 移除事件监听
            el.removeEventListener('scroll', el._infiniteScrollHandler)
          }
        })
      
        // 添加全局方法
        Vue.prototype.$infiniteScroll = {
          disabled(el) {
            el._infiniteScrollDisabled = true
          },
          enabled(el) {
            el._infiniteScrollDisabled = false
          },
          refresh(el) {
            el.scrollTop = 0
            el.dispatchEvent(new Event('scroll'))
          }
        }
      }
    }
  
    export default InfiniteScrollPlugin
    ```

## 快速使用指南

如果你忘记了如何使用Vue组件与插件功能，可以按照以下步骤快速应用到其他项目：

### 1. 创建和使用组件

#### 创建一个基本组件
```vue
<!-- MyComponent.vue -->
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '默认标题'
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['button-click'])

const handleClick = () => {
  emit('button-click', {
    timestamp: new Date().toLocaleString()
  })
}
</script>

<style scoped>
.my-component {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

#### 在父组件中使用
```vue
<template>
  <div>
    <MyComponent 
      title="我的标题" 
      message="这是我的消息" 
      @button-click="handleButtonClick" 
    />
  </div>
</template>

<script setup>
import MyComponent from './MyComponent.vue'

const handleButtonClick = (data) => {
  console.log('按钮被点击:', data.timestamp)
}
</script>
```

### 2. 全局注册组件

在Vue 3中全局注册组件：

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyComponent from './components/MyComponent.vue'

const app = createApp(App)

// 全局注册组件
app.component('MyComponent', MyComponent)

app.mount('#app')
```

之后在任何组件中都可以直接使用`<MyComponent />`，无需引入。

### 3. 创建和使用插件

#### 创建一个简单插件
```js
// my-plugin.js
const MyPlugin = {
  install(app, options) {
    // 添加全局方法
    app.config.globalProperties.$myMethod = function(message) {
      console.log(message)
    }

    // 添加全局指令
    app.directive('highlight', {
      mounted(el, binding) {
        el.style.backgroundColor = binding.value || 'yellow'
      }
    })

    // 添加全局组件
    app.component('PluginComponent', {
      template: '<div>我是插件提供的组件</div>'
    })
  }
}

export default MyPlugin
```

#### 注册插件
```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyPlugin from './plugins/my-plugin'

const app = createApp(App)

// 注册插件，并传入配置
app.use(MyPlugin, { someOption: true })

app.mount('#app')
```

#### 在组件中使用插件功能
```vue
<template>
  <div>
    <PluginComponent />
    <p v-highlight="'lightblue'">这段文字有背景色</p>
    <button @click="usePluginMethod">调用插件方法</button>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

const usePluginMethod = () => {
  // 调用全局方法
  instance.proxy.$myMethod('Hello from plugin!')
}
</script>
```

### 4. 创建通知插件示例

这是一个实用型插件，可以在任何组件中显示通知：

```js
// notification-plugin.js
import { createApp, h } from 'vue'

const NotificationPlugin = {
  install(app, options = {}) {
    const defaultOptions = {
      duration: 3000,
      position: 'top-right'
    }
  
    const finalOptions = { ...defaultOptions, ...options }
  
    // 创建通知组件
    const NotificationComponent = {
      name: 'Notification',
      props: {
        id: Number,
        message: String,
        type: {
          type: String,
          default: 'info'
        }
      },
      setup(props) {
        return () => h('div', {
          class: ['notification', props.type],
          style: {
            position: 'fixed',
            [finalOptions.position.includes('top') ? 'top' : 'bottom']: '20px',
            [finalOptions.position.includes('right') ? 'right' : 'left']: '20px',
            padding: '10px 15px',
            background: props.type === 'success' ? '#4CAF50' : 
                      props.type === 'error' ? '#F44336' : 
                      props.type === 'warning' ? '#FFC107' : '#2196F3',
            color: 'white',
            borderRadius: '4px',
            marginBottom: '10px',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
          }
        }, props.message)
      }
    }
  
    // 创建通知容器
    const container = document.createElement('div')
    container.id = 'notification-container'
    document.body.appendChild(container)
  
    const notificationApp = createApp({
      data() {
        return {
          notifications: []
        }
      },
      methods: {
        addNotification(message, type = 'info') {
          const id = Date.now()
          this.notifications.push({ id, message, type })
        
          setTimeout(() => {
            this.removeNotification(id)
          }, finalOptions.duration)
        
          return id
        },
        removeNotification(id) {
          const index = this.notifications.findIndex(n => n.id === id)
          if (index !== -1) {
            this.notifications.splice(index, 1)
          }
        }
      },
      render() {
        return h('div', this.notifications.map(note => 
          h(NotificationComponent, {
            key: note.id,
            id: note.id,
            message: note.message,
            type: note.type
          })
        ))
      }
    })
  
    notificationApp.mount(container)
  
    // 添加全局方法
    app.config.globalProperties.$notify = (message, type = 'info') => {
      const root = container.__vue_app__
      if (root) {
        return root._instance.ctx.addNotification(message, type)
      }
      return null
    }
  
    // 提供方法
    app.provide('$notify', app.config.globalProperties.$notify)
  }
}

export default NotificationPlugin
```

#### 使用通知插件
```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import NotificationPlugin from './plugins/notification-plugin'

const app = createApp(App)

app.use(NotificationPlugin, {
  duration: 4000,
  position: 'top-right'
})

app.mount('#app')
```

```vue
<template>
  <div>
    <button @click="showSuccess">成功通知</button>
    <button @click="showError">错误通知</button>
    <button @click="showWarning">警告通知</button>
  </div>
</template>

<script setup>
const showSuccess = () => {
  // 使用全局方法
  const instance = getCurrentInstance()
  instance.proxy.$notify('操作成功！', 'success')
}

const showError = () => {
  // 使用注入的方法
  const $notify = inject('$notify')
  $notify('操作失败！', 'error')
}

const showWarning = () => {
  // 通过getCurrentInstance访问
  getCurrentInstance().proxy.$notify('请注意！', 'warning')
}
</script>
```

[标签: Vue 组件与插件]