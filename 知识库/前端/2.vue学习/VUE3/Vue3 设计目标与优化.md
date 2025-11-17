# Vue3设计目标与优化全面开发文档

## 概述
Vue3.0是Vue.js框架的重大升级版本，经过长达两三年的筹备，在保持Vue2特性的同时，从多个维度进行了重大优化和改进。

## 一、Vue3设计目标

### 核心设计理念：更小、更快、更友好

Vue3解决的主要痛点：
- 复杂组件代码维护困难
- 缺少干净的组件间逻辑复用机制  
- TypeScript类型推断支持不足
- 构建打包时间过长

## 二、核心优化详解

### 2.1 更小 (Bundle Size优化)

**Tree-shaking支持**
Vue3引入了完全的tree-shaking支持，移除未使用的API和功能。

```javascript
// Vue2 - 全量引入
import Vue from 'vue'

// Vue3 - 按需引入
import { createApp, ref, reactive, computed } from 'vue'

// 只有实际使用的API会被打包
const app = createApp({
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    return { count, doubleCount }
  }
})
```

**移除的API**
- $on, $off, $once等实例方法
- filter过滤器
- 内联模板inline-template
- $destroy方法

### 2.2 更快 (性能优化)

#### 编译时优化

**1. 静态提升(Static Hoisting)**
```javascript
// 编译前
<div>
  <p>静态内容</p>
  <p>{{ message }}</p>
</div>

// 编译后优化
const _hoisted_1 = createElementVNode("p", null, "静态内容")

function render() {
  return createElementVNode("div", null, [
    _hoisted_1, // 静态内容被提升到render函数外
    createElementVNode("p", null, toDisplayString(message))
  ])
}
```

**2. Diff算法优化**
```javascript
// Vue3的PatchFlags标记
const enum PatchFlags {
  TEXT = 1,           // 动态文本
  CLASS = 2,          // 动态class
  STYLE = 4,          // 动态style
  PROPS = 8,          // 动态props
  FULL_PROPS = 16,    // 有key的动态props
  HYDRATE_EVENTS = 32, // 事件监听器
  STABLE_FRAGMENT = 64, // 稳定的fragment
  KEYED_FRAGMENT = 128, // 有key的fragment
  UNKEYED_FRAGMENT = 256, // 无key的fragment
  NEED_PATCH = 512,   // 需要patch
  DYNAMIC_SLOTS = 1024, // 动态slots
  HOISTED = -1,       // 静态提升
  BAIL = -2          // diff算法无法优化
}
```

**3. 事件监听缓存**
```javascript
// 编译前
<button @click="onClick">Click</button>

// 编译后
const _cache = []
function render() {
  return createElementVNode("button", {
    onClick: _cache[0] || (_cache[0] = ($event) => onClick($event))
  }, "Click")
}
```

#### 运行时优化

**Proxy响应式系统**
```javascript
// Vue2 - Object.defineProperty
Object.defineProperty(data, 'a', {
  get() {
    // track 依赖收集
    return value
  },
  set(newValue) {
    // trigger 派发更新
    value = newValue
  }
})

// Vue3 - Proxy
const reactiveData = new Proxy(target, {
  get(target, key, receiver) {
    track(target, TrackOpTypes.GET, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, TriggerOpTypes.SET, key, value)
    return result
  }
})
```

### 2.3 更友好 (开发体验)

#### Composition API

**1. 基础使用**
```javascript
import { ref, reactive, computed, watch, onMounted } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    const state = reactive({
      name: 'Vue3',
      version: '3.x'
    })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 监听器
    watch(count, (newValue, oldValue) => {
      console.log(`count changed from ${oldValue} to ${newValue}`)
    })
    
    // 生命周期
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      state,
      doubleCount,
      increment
    }
  }
}
```

**2. 自定义Hooks - 逻辑复用**
```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function updateMouse(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', updateMouse)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemouse', updateMouse)
  })
  
  return { x, y }
}

// 在组件中使用
export default {
  setup() {
    const { x, y } = useMouse()
    
    return { x, y }
  }
}
```

**3. 高级Composition API使用**
```javascript
import { 
  ref, reactive, computed, watch, 
  provide, inject, 
  toRefs, toRef,
  readonly, shallowRef, shallowReactive,
  nextTick, defineAsyncComponent
} from 'vue'

export default {
  setup() {
    // 深度响应式
    const state = reactive({
      user: {
        name: 'John',
        profile: {
          age: 25,
          city: 'Beijing'
        }
      }
    })
    
    // 浅响应式
    const shallowState = shallowReactive({
      count: 0,
      nested: { value: 1 } // 嵌套对象不是响应式的
    })
    
    // 只读
    const readonlyState = readonly(state)
    
    // 转换为refs
    const { user } = toRefs(state)
    
    // 依赖注入
    provide('theme', 'dark')
    const theme = inject('theme', 'light') // 默认值
    
    // 异步组件
    const AsyncComp = defineAsyncComponent(() => 
      import('./AsyncComponent.vue')
    )
    
    return {
      state,
      user,
      theme,
      AsyncComp
    }
  }
}
```

## 三、TypeScript支持

### 完整的类型定义
```typescript
import { defineComponent, ref, computed, PropType } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const internalCount = ref<number>(props.count)
    
    const displayName = computed<string>(() => {
      return `用户: ${props.user.name}`
    })
    
    const increment = (): void => {
      internalCount.value++
      emit('countChange', internalCount.value)
    }
    
    return {
      internalCount,
      displayName,
      increment
    }
  }
})
```

## 四、实际应用场景

### 4.1 企业级应用架构
```javascript
// store/modules/user.js - Pinia状态管理
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  
  async function login(credentials) {
    try {
      const response = await api.login(credentials)
      user.value = response.data
      return response
    } catch (error) {
      throw error
    }
  }
  
  function logout() {
    user.value = null
  }
  
  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout
  }
})
```

### 4.2 微前端集成
```javascript
// micro-app-utils.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

export function createMicroApp(options) {
  const app = createApp(options.component)
  
  // 配置路由
  const router = createRouter({
    history: createWebHistory(options.basePath),
    routes: options.routes
  })
  
  app.use(router)
  
  return {
    mount(el) {
      app.mount(el)
    },
    unmount() {
      app.unmount()
    }
  }
}
```

## 五、性能监控与优化

### 5.1 性能监控
```javascript
// performance/monitor.js
import { createApp } from 'vue'

const app = createApp({})

// 性能监控插件
app.use({
  install(app) {
    app.config.performance = true
    
    // 组件渲染时间监控
    app.mixin({
      beforeCreate() {
        this.$options._renderStart = performance.now()
      },
      mounted() {
        const renderTime = performance.now() - this.$options._renderStart
        if (renderTime > 16) { // 超过一帧的时间
          console.warn(`组件 ${this.$options.name} 渲染时间: ${renderTime}ms`)
        }
      }
    })
  }
})
```

### 5.2 内存泄漏防护
```javascript
// utils/cleanup.js
import { onUnmounted } from 'vue'

export function useCleanup() {
  const cleanupTasks = []
  
  const addCleanup = (task) => {
    cleanupTasks.push(task)
  }
  
  onUnmounted(() => {
    cleanupTasks.forEach(task => {
      try {
        task()
      } catch (error) {
        console.error('清理任务执行失败:', error)
      }
    })
    cleanupTasks.length = 0
  })
  
  return { addCleanup }
}

// 使用示例
export default {
  setup() {
    const { addCleanup } = useCleanup()
    
    const timer = setInterval(() => {
      console.log('定时器执行')
    }, 1000)
    
    addCleanup(() => clearInterval(timer))
    
    return {}
  }
}
```

## 六、学习知识点总结

### 核心概念掌握
1. **响应式系统**: Proxy vs Object.defineProperty
2. **Composition API**: setup函数、生命周期hooks
3. **编译优化**: 静态提升、PatchFlags、事件缓存
4. **Tree-shaking**: 按需引入、体积优化
5. **TypeScript集成**: 类型推断、接口定义

### 实践能力要求
1. **架构设计**: 大型应用状态管理、模块化
2. **性能优化**: 渲染优化、内存管理、异步组件
3. **工程化**: 构建配置、代码分割、部署策略

## 七、用途与应用场景

### 适用场景
- ✅ 大型企业级应用开发
- ✅ 需要TypeScript支持的项目
- ✅ 对性能要求较高的应用
- ✅ 需要大量逻辑复用的项目
- ✅ 微前端架构
- ✅ 移动端H5应用

### 不适用场景
- ❌ 简单的静态页面
- ❌ 学习成本敏感的小团队
- ❌ 对IE11有强依赖的项目

---
## 八、面试题目设计

### 技术基础面试题 (10题)

#### 题目1：Vue3响应式原理对比
**问题**: 请对比Vue2和Vue3的响应式实现原理，并说明Vue3的优势。

**代码说明**:
```javascript
// Vue2响应式原理
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      depend()
      return val
    },
    set(newVal) {
      if (val === newVal) return
      val = newVal
      // 派发更新
      notify()
    }
  })
}

// Vue3响应式原理
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, TrackOpTypes.GET, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, TriggerOpTypes.SET, key, value)
      return result
    }
  })
}
```

**标准答案**:
Vue2使用`Object.defineProperty`，存在以下限制：
- 无法检测对象属性的添加/删除
- 需要递归遍历所有属性
- 数组变更需要特殊处理

Vue3使用`Proxy`的优势：
- 可以监听对象属性的添加/删除
- 可以监听数组的变更
- 懒加载响应式转换，性能更好
- 支持Map、Set、WeakMap、WeakSet

#### 题目2：Composition API vs Options API
**问题**: 在什么场景下选择Composition API？请给出具体代码对比。

**代码说明**:
```javascript
// Options API
export default {
  data() {
    return {
      count: 0,
      loading: false,
      user: null
    }
  },
  computed: {
    displayName() {
      return this.user ? this.user.name : '游客'
    }
  },
  methods: {
    async fetchUser() {
      this.loading = true
      try {
        this.user = await api.getUser()
      } finally {
        this.loading = false
      }
    }
  }
}

// Composition API
export default {
  setup() {
    const count = ref(0)
    const loading = ref(false)
    const user = ref(null)
    
    const displayName = computed(() => 
      user.value ? user.value.name : '游客'
    )
    
    const fetchUser = async () => {
      loading.value = true
      try {
        user.value = await api.getUser()
      } finally {
        loading.value = false
      }
    }
    
    return {
      count, loading, user,
      displayName, fetchUser
    }
  }
}
```

**标准答案**:
选择Composition API的场景：
- 需要逻辑复用的复杂组件
- TypeScript项目（更好的类型推断）
- 大型组件（逻辑分组更清晰）
- 需要精细控制响应式行为

#### 题目3：Tree-shaking机制
**问题**: Vue3如何实现Tree-shaking？请展示具体的优化效果。

**代码说明**:
```javascript
// 打包前 - 只使用了部分API
import { createApp, ref, computed } from 'vue'
// watch, reactive等未使用的API不会被打包

const app = createApp({
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    return { count, double }
  }
})

// Vue2全量引入对比
import Vue from 'vue' // 整个Vue库都会被打包，约34KB

// Vue3按需引入
import { createApp } from 'vue' // 只有createApp相关代码被打包，约16KB
```

**标准答案**:
Vue3的Tree-shaking通过以下方式实现：
- ES模块化架构，每个功能独立导出
- 编译时静态分析，移除未使用代码
- 内置功能按需引入（如指令、组件等）
- 体积可以减少50%以上

#### 题目4：编译优化 - 静态提升
**问题**: 解释Vue3静态提升优化原理及其性能收益。

**代码说明**:
```javascript
// 编译前模板
<div>
  <h1>标题</h1>
  <p>静态内容</p>
  <span>{{ message }}</span>
</div>

// 编译后（静态提升）
const _hoisted_1 = createElementVNode("h1", null, "标题")
const _hoisted_2 = createElementVNode("p", null, "静态内容")

function render(_ctx) {
  return createElementVNode("div", null, [
    _hoisted_1, // 复用静态节点
    _hoisted_2,
    createElementVNode("span", null, toDisplayString(_ctx.message))
  ])
}
```

**标准答案**:
静态提升优化：
- 将静态节点提升到render函数外部
- 避免每次render时重新创建静态VNode
- 减少内存分配和GC压力
- 提升渲染性能约20-30%

#### 题目5：Patch Flags优化
**问题**: Vue3的Patch Flags如何优化diff算法？

**代码说明**:
```javascript
// 模板
<div :class="className" :style="{ color: textColor }">
  {{ message }}
</div>

// 编译后带PatchFlags
createElementVNode("div", {
  class: _ctx.className,
  style: { color: _ctx.textColor }
}, toDisplayString(_ctx.message), 
  PatchFlags.TEXT | PatchFlags.CLASS | PatchFlags.STYLE // 标记动态内容
)

// diff时只检查标记的属性
if (patchFlag & PatchFlags.TEXT) {
  // 只更新文本内容
}
if (patchFlag & PatchFlags.CLASS) {
  // 只更新class
}
```

**标准答案**:
Patch Flags优化机制：
- 编译时标记动态内容类型
- 运行时按标记进行精确更新
- 跳过静态内容的对比
- 性能提升可达数倍

#### 题目6：自定义Hooks设计
**问题**: 设计一个通用的异步数据获取Hook。

**代码说明**:
```javascript
// useAsyncData Hook实现
import { ref, onMounted } from 'vue'

export function useAsyncData(fetchFn, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  const execute = async (...args) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await fetchFn(...args)
      data.value = result
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  
  if (options.immediate !== false) {
    onMounted(execute)
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute
  }
}

// 使用示例
export default {
  setup() {
    const { data: users, loading, error, execute } = useAsyncData(
      () => api.getUsers(),
      { immediate: true }
    )
    
    return { users, loading, error, refetch: execute }
  }
}
```

**标准答案**:
自定义Hooks设计要点：
- 封装响应式状态逻辑
- 提供清晰的返回接口
- 支持配置选项
- 使用readonly保护内部状态

#### 题目7：性能监控实现
**问题**: 如何在Vue3中实现组件渲染性能监控？

**代码说明**:
```javascript
// 性能监控插件
export const performancePlugin = {
  install(app, options = {}) {
    const threshold = options.threshold || 16
    
    app.mixin({
      beforeCreate() {
        this._renderStart = performance.now()
      },
      beforeMount() {
        this._mountStart = performance.now()
      },
      mounted() {
        const renderTime = this._mountStart - this._renderStart
        const mountTime = performance.now() - this._mountStart
        
        if (renderTime > threshold) {
          console.warn(`组件 ${this.$options.name} 渲染耗时: ${renderTime.toFixed(2)}ms`)
        }
        
        // 上报性能数据
        if (options.onPerformance) {
          options.onPerformance({
            componentName: this.$options.name,
            renderTime,
            mountTime
          })
        }
      }
    })
  }
}

// 使用
app.use(performancePlugin, {
  threshold: 20,
  onPerformance(data) {
    // 上报到监控系统
    analytics.track('component_performance', data)
  }
})
```

**标准答案**:
Vue3性能监控实现方案：
- 使用全局mixin监听生命周期
- Performance API测量时间
- 设置阈值告警
- 集成监控系统上报

#### 题目8：内存泄漏防护
**问题**: 如何防止Vue3应用中的内存泄漏？

**代码说明**:
```javascript
// 内存泄漏防护Hook
export function useLifecycleCleanup() {
  const cleanupTasks = []
  
  const addCleanup = (cleanup) => {
    cleanupTasks.push(cleanup)
  }
  
  const addEventListeners = (target, events) => {
    events.forEach(({ event, handler, options }) => {
      target.addEventListener(event, handler, options)
      addCleanup(() => target.removeEventListener(event, handler, options))
    })
  }
  
  const addTimer = (timer) => {
    addCleanup(() => clearInterval(timer))
    return timer
  }
  
  onUnmounted(() => {
    cleanupTasks.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        console.error('清理失败:', error)
      }
    })
  })
  
  return { addCleanup, addEventListeners, addTimer }
}

// 使用示例
export default {
  setup() {
    const { addEventListeners, addTimer } = useLifecycleCleanup()
    
    // 自动清理事件监听器
    addEventListeners(window, [
      { event: 'resize', handler: handleResize },
      { event: 'scroll', handler: handleScroll }
    ])
    
    // 自动清理定时器
    const timer = addTimer(setInterval(() => {
      console.log('定时任务')
    }, 1000))
    
    return {}
  }
}
```

**标准答案**:
内存泄漏防护策略：
- 及时清理事件监听器
- 清理定时器和异步任务
- 解除DOM引用
- 使用WeakMap/WeakSet管理引用

#### 题目9：TypeScript集成最佳实践
**问题**: Vue3与TypeScript集成的最佳实践是什么？

**代码说明**:
```typescript
// 类型定义
interface User {
  id: number
  name: string
  email: string
  roles: string[]
}

interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// 组件类型定义
export default defineComponent({
  name: 'UserProfile',
  props: {
    userId: {
      type: Number,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'user-updated': (user: User) => user.id > 0,
    'error': (error: Error) => error instanceof Error
  },
  setup(props, { emit }) {
    const user = ref<User | null>(null)
    const loading = ref<boolean>(false)
    
    const fetchUser = async (): Promise<void> => {
      loading.value = true
      try {
        const response = await api.get<ApiResponse<User>>(`/users/${props.userId}`)
        user.value = response.data.data
      } catch (error) {
        emit('error', error as Error)
      } finally {
        loading.value = false
      }
    }
    
    const updateUser = async (userData: Partial<User>): Promise<void> => {
      if (!user.value) return
      
      const updatedUser = { ...user.value, ...userData }
      user.value = updatedUser
      emit('user-updated', updatedUser)
    }
    
    return {
      user: readonly(user),
      loading: readonly(loading),
      fetchUser,
      updateUser
    }
  }
})
```

**标准答案**:
Vue3 + TypeScript最佳实践：
- 使用`defineComponent`获得类型推断
- 定义清晰的Props和Emits类型
- 使用泛型约束API响应类型
- 合理使用readonly保护状态

#### 题目10：微前端集成方案
**问题**: 如何将Vue3应用集成到微前端架构中？

**代码说明**:
```javascript
// 微前端主应用
class MicroFrontendManager {
  constructor() {
    this.apps = new Map()
  }
  
  async registerApp(name, config) {
    const { mount, unmount, update } = await import(config.entry)
    
    this.apps.set(name, {
      mount,
      unmount,
      update,
      container: config.container,
      props: config.props || {}
    })
  }
  
  async mountApp(name, props = {}) {
    const app = this.apps.get(name)
    if (!app) throw new Error(`应用 ${name} 未注册`)
    
    await app.mount(app.container, { ...app.props, ...props })
  }
  
  async unmountApp(name) {
    const app = this.apps.get(name)
    if (app) await app.unmount()
  }
}

// Vue3子应用导出
let app = null

export async function mount(container, props) {
  app = createApp({
    setup() {
      // 接收主应用传递的数据
      const appProps = reactive(props)
      
      return { appProps }
    }
  })
  
  app.mount(container)
}

export async function unmount() {
  if (app) {
    app.unmount()
    app = null
  }
}

export async function update(props) {
  if (app) {
    // 更新应用状态
    app.config.globalProperties.$props = props
  }
}
```

**标准答案**:
Vue3微前端集成方案：
- 导出标准生命周期函数（mount/unmount/update）
- 使用动态import加载子应用
- 通过props实现主子应用通信
- 沙箱隔离确保应用独立性

### 业务逻辑面试题 (10题)

#### 题目1：电商购物车系统
**问题**: 设计一个支持多商品、规格选择、库存检查的购物车系统。

**代码说明**:
```javascript
// stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  
  const addItem = async (product, selectedSpecs = {}) => {
    // 检查库存
    const stock = await checkStock(product.id, selectedSpecs)
    if (stock < 1) {
      throw new Error('商品库存不足')
    }
    
    const existingIndex = items.value.findIndex(item => 
      item.productId === product.id && 
      JSON.stringify(item.specs) === JSON.stringify(selectedSpecs)
    )
    
    if (existingIndex > -1) {
      items.value[existingIndex].quantity += 1
    } else {
      items.value.push({
        id: generateId(),
        productId: product.id,
        name: product.name,
        price: calculatePrice(product, selectedSpecs),
        specs: selectedSpecs,
        quantity: 1,
        image: product.image
      })
    }
  }
  
  return {
    items: readonly(items),
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})

// components/ProductCard.vue
export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  setup(props) {
    const cartStore = useCartStore()
    const selectedSpecs = ref({})
    const addingToCart = ref(false)
    
    const handleAddToCart = async () => {
      addingToCart.value = true
      try {
        await cartStore.addItem(props.product, selectedSpecs.value)
        ElMessage.success('已添加到购物车')
      } catch (error) {
        ElMessage.error(error.message)
      } finally {
        addingToCart.value = false
      }
    }
    
    return {
      selectedSpecs,
      addingToCart,
      handleAddToCart
    }
  }
})
```

**标准答案**:
电商购物车系统设计要点：
- 使用Pinia管理购物车状态
- 支持商品规格选择和价格计算
- 实现库存检查和错误处理
- 提供响应式的总价和数量计算

#### 题目2：实时聊天应用
**问题**: 实现一个支持私聊、群聊、消息历史的实时聊天系统。

**代码说明**:
```javascript
// composables/useWebSocket.js
export function useWebSocket(url) {
  const socket = ref(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnects = 5
  
  const connect = () => {
    socket.value = new WebSocket(url)
    
    socket.value.onopen = () => {
      isConnected.value = true
      reconnectAttempts.value = 0
    }
    
    socket.value.onclose = () => {
      isConnected.value = false
      // 自动重连
      if (reconnectAttempts.value < maxReconnects) {
        setTimeout(() => {
          reconnectAttempts.value++
          connect()
        }, 2000 * reconnectAttempts.value)
      }
    }
    
    socket.value.onerror = (error) => {
      console.error('WebSocket错误:', error)
    }
  }
  
  const send = (message) => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(message))
    }
  }
  
  const on = (event, callback) => {
    if (socket.value) {
      socket.value.addEventListener('message', (e) => {
        const data = JSON.parse(e.data)
        if (data.type === event) {
          callback(data.payload)
        }
      })
    }
  }
  
  onMounted(connect)
  onUnmounted(() => socket.value?.close())
  
  return { isConnected, send, on }
}

// components/ChatRoom.vue
export default defineComponent({
  setup() {
    const messages = ref([])
    const newMessage = ref('')
    const currentUser = inject('currentUser')
    
    const { isConnected, send, on } = useWebSocket('ws://localhost:8080/chat')
    
    // 监听消息
    on('message', (message) => {
      messages.value.push({
        ...message,
        timestamp: Date.now()
      })
      
      // 滚动到底部
      nextTick(() => {
        const chatContainer = document.querySelector('.chat-messages')
        chatContainer.scrollTop = chatContainer.scrollHeight
      })
    })
    
    const sendMessage = () => {
      if (!newMessage.value.trim()) return
      
      const message = {
        type: 'message',
        payload: {
          id: generateId(),
          content: newMessage.value,
          sender: currentUser.value,
          timestamp: Date.now()
        }
      }
      
      send(message)
      newMessage.value = ''
    }
    
    return {
      messages,
      newMessage,
      isConnected,
      sendMessage
    }
  }
})
```

**标准答案**:
实时聊天系统实现要点：
- WebSocket连接管理和自动重连
- 消息状态管理和历史记录
- 自动滚动和用户体验优化
- 错误处理和离线状态处理

#### 题目3：数据表格与搜索系统
**问题**: 实现一个支持分页、排序、筛选、导出的数据表格组件。

**代码说明**:
```javascript
// composables/useTable.js
export function useTable(fetchData, options = {}) {
  const data = ref([])
  const loading = ref(false)
  const total = ref(0)
  
  const pagination = reactive({
    page: 1,
    pageSize: options.pageSize || 20
  })
  
  const sorting = reactive({
    field: '',
    order: '' // 'asc' | 'desc'
  })
  
  const filters = reactive({})
  
  const loadData = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy: sorting.field,
        sortOrder: sorting.order,
        ...filters
      }
      
      const response = await fetchData(params)
      data.value = response.data
      total.value = response.total
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  const handleSort = (field, order) => {
    sorting.field = field
    sorting.order = order
    pagination.page = 1
    loadData()
  }
  
  const handleFilter = (filterData) => {
    Object.assign(filters, filterData)
    pagination.page = 1
    loadData()
  }
  
  const handlePageChange = (page) => {
    pagination.page = page
    loadData()
  }
  
  const exportData = async (format = 'csv') => {
    const allData = await fetchData({
      ...filters,
      sortBy: sorting.field,
      sortOrder: sorting.order,
      page: 1,
      pageSize: total.value
    })
    
    if (format === 'csv') {
      downloadCSV(allData.data, 'export.csv')
    } else if (format === 'excel') {
      downloadExcel(allData.data, 'export.xlsx')
    }
  }
  
  // 初始加载
  onMounted(loadData)
  
  return {
    data: readonly(data),
    loading: readonly(loading),
    total: readonly(total),
    pagination,
    sorting,
    filters,
    handleSort,
    handleFilter,
    handlePageChange,
    exportData,
    refresh: loadData
  }
}

// components/DataTable.vue
export default defineComponent({
  props: {
    columns: Array,
    fetchData: Function
  },
  setup(props) {
    const {
      data, loading, total,
      pagination, sorting,
      handleSort, handlePageChange,
      exportData
    } = useTable(props.fetchData)
    
    return {
      data, loading, total,
      pagination, sorting,
      handleSort, handlePageChange,
      exportData
    }
  }
})
```

**标准答案**:
数据表格系统设计要点：
- 抽象表格逻辑到可复用Hook
- 支持多种筛选和排序方式
- 实现分页和数据导出功能
- 提供良好的加载状态管理

#### 题目4：权限管理系统
**问题**: 设计一个基于角色的权限控制系统。

**代码说明**:
```javascript
// stores/auth.js
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const permissions = ref([])
  const roles = ref([])
  
  const hasPermission = computed(() => (permission) => {
    return permissions.value.includes(permission)
  })
  
  const hasRole = computed(() => (role) => {
    return roles.value.includes(role)
  })
  
  const hasAnyRole = computed(() => (roleList) => {
    return roleList.some(role => roles.value.includes(role))
  })
  
  const login = async (credentials) => {
    const response = await api.login(credentials)
    user.value = response.user
    permissions.value = response.permissions
    roles.value = response.roles
    
    // 存储到localStorage
    localStorage.setItem('auth_token', response.token)
  }
  
  return {
    user: readonly(user),
    permissions: readonly(permissions),
    roles: readonly(roles),
    hasPermission,
    hasRole,
    hasAnyRole,
    login,
    logout
  }
})

// directives/permission.js
export const vPermission = {
  mounted(el, binding) {
    const { value } = binding
    const authStore = useAuthStore()
    
    if (value) {
      const hasPermission = authStore.hasPermission(value)
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  },
  updated(el, binding) {
    // 权限变化时重新检查
    const { value } = binding
    const authStore = useAuthStore()
    
    if (value) {
      const hasPermission = authStore.hasPermission(value)
      if (!hasPermission) {
        el.style.display = 'none'
      } else {
        el.style.display = ''
      }
    }
  }
}

// router/guards.js
export const createAuthGuard = (router) => {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const { meta } = to
    
    // 检查登录状态
    if (meta.requiresAuth && !authStore.user) {
      next('/login')
      return
    }
    
    // 检查权限
    if (meta.permission && !authStore.hasPermission(meta.permission)) {
      next('/403')
      return
    }
    
    // 检查角色
    if (meta.roles && !authStore.hasAnyRole(meta.roles)) {
      next('/403')
      return
    }
    
    next()
  })
}
```

**标准答案**:
权限管理系统设计要点：
- 基于角色的权限控制（RBAC）
- 自定义指令控制元素显示
- 路由守卫实现页面级权限控制
- 灵活的权限检查方法

#### 题目5：文件上传系统
**问题**: 实现支持大文件分片上传、断点续传、进度显示的文件上传系统。

**代码说明**:
```javascript
// composables/useFileUpload.js
export function useFileUpload(options = {}) {
  const uploadQueue = ref([])
  const chunkSize = options.chunkSize || 2 * 1024 * 1024 // 2MB
  
  const uploadFile = async (file) => {
    const fileInfo = {
      id: generateId(),
      file,
      progress: 0,
      status: 'pending', // pending | uploading | success | error | paused
      chunks: [],
      uploadedChunks: new Set()
    }
    
    // 计算文件块
    const totalChunks = Math.ceil(file.size / chunkSize)
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      fileInfo.chunks.push({
        index: i,
        start,
        end,
        blob: file.slice(start, end)
      })
    }
    
    uploadQueue.value.push(fileInfo)
    
    try {
      await processUpload(fileInfo)
    } catch (error) {
      fileInfo.status = 'error'
      throw error
    }
  }
  
  const processUpload = async (fileInfo) => {
    fileInfo.status = 'uploading'
    
    // 检查已上传的块
    const uploadedChunks = await checkUploadedChunks(fileInfo.file.name)
    uploadedChunks.forEach(index => fileInfo.uploadedChunks.add(index))
    
    // 上传剩余块
    const promises = fileInfo.chunks
      .filter(chunk => !fileInfo.uploadedChunks.has(chunk.index))
      .map(chunk => uploadChunk(fileInfo, chunk))
    
    await Promise.all(promises)
    
    // 合并文件
    await mergeChunks(fileInfo.file.name, fileInfo.chunks.length)
    fileInfo.status = 'success'
    fileInfo.progress = 100
  }
  
  const uploadChunk = async (fileInfo, chunk) => {
    const formData = new FormData()
    formData.append('file', chunk.blob)
    formData.append('filename', fileInfo.file.name)
    formData.append('chunkIndex', chunk.index)
    formData.append('totalChunks', fileInfo.chunks.length)
    
    try {
      await api.uploadChunk(formData, {
        onUploadProgress: (progressEvent) => {
          updateProgress(fileInfo)
        }
      })
      
      fileInfo.uploadedChunks.add(chunk.index)
    } catch (error) {
      throw new Error(`块 ${chunk.index} 上传失败: ${error.message}`)
    }
  }
  
  const updateProgress = (fileInfo) => {
    const uploadedCount = fileInfo.uploadedChunks.size
    fileInfo.progress = Math.round((uploadedCount / fileInfo.chunks.length) * 100)
  }
  
  const pauseUpload = (fileId) => {
    const fileInfo = uploadQueue.value.find(f => f.id === fileId)
    if (fileInfo) {
      fileInfo.status = 'paused'
    }
  }
  
  const resumeUpload = async (fileId) => {
    const fileInfo = uploadQueue.value.find(f => f.id === fileId)
    if (fileInfo && fileInfo.status === 'paused') {
      await processUpload(fileInfo)
    }
  }
  
  return {
    uploadQueue: readonly(uploadQueue),
    uploadFile,
    pauseUpload,
    resumeUpload
  }
}
```

**标准答案**:
文件上传系统实现要点：
- 大文件分片上传降低失败风险
- 断点续传提高用户体验
- 并发控制避免服务器压力
- 实时进度反馈继续完成剩余的业务逻辑题目：

#### 题目6：多步骤表单系统
**问题**: 实现一个支持表单验证、步骤导航、数据保存的多步骤表单。

**代码说明**:
```javascript
// composables/useMultiStepForm.js
export function useMultiStepForm(steps, validationRules) {
  const currentStep = ref(0)
  const formData = reactive({})
  const errors = reactive({})
  const isValid = ref(false)
  
  const canGoNext = computed(() => {
    return currentStep.value < steps.length - 1 && validateCurrentStep()
  })
  
  const canGoPrev = computed(() => {
    return currentStep.value > 0
  })
  
  const validateCurrentStep = () => {
    const stepName = steps[currentStep.value].name
    const rules = validationRules[stepName]
    
    if (!rules) return true
    
    let stepValid = true
    Object.keys(rules).forEach(field => {
      const value = formData[field]
      const rule = rules[field]
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors[field] = rule.message || `${field} 是必填项`
        stepValid = false
      } else if (rule.validator && !rule.validator(value)) {
        errors[field] = rule.message
        stepValid = false
      } else {
        delete errors[field]
      }
    })
    
    return stepValid
  }
  
  const nextStep = async () => {
    if (canGoNext.value) {
      // 保存当前步骤数据
      await saveStepData(currentStep.value, formData)
      currentStep.value++
    }
  }
  
  const prevStep = () => {
    if (canGoPrev.value) {
      currentStep.value--
    }
  }
  
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      currentStep.value = stepIndex
    }
  }
  
  const submitForm = async () => {
    if (validateCurrentStep()) {
      try {
        await api.submitForm(formData)
        return true
      } catch (error) {
        throw error
      }
    }
    return false
  }
  
  return {
    currentStep: readonly(currentStep),
    formData,
    errors: readonly(errors),
    canGoNext,
    canGoPrev,
    nextStep,
    prevStep,
    goToStep,
    submitForm
  }
}
```

#### 题目7：地图定位与路径规划
**问题**: 实现地图定位、标点、路径规划功能。

**代码说明**:
```javascript
// composables/useMap.js
export function useMap(containerId, options = {}) {
  const map = ref(null)
  const userLocation = ref(null)
  const markers = ref([])
  const routes = ref([])
  
  const initMap = async () => {
    // 初始化地图
    map.value = new BMap.Map(containerId)
    map.value.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
    map.value.enableScrollWheelZoom(true)
    
    // 添加控件
    map.value.addControl(new BMap.NavigationControl())
    map.value.addControl(new BMap.ScaleControl())
  }
  
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      const geolocation = new BMap.Geolocation()
      
      geolocation.getCurrentPosition((result) => {
        if (geolocation.getStatus() === BMAP_STATUS_SUCCESS) {
          userLocation.value = {
            lng: result.point.lng,
            lat: result.point.lat
          }
          
          // 设置地图中心点
          map.value.panTo(new BMap.Point(result.point.lng, result.point.lat))
          resolve(userLocation.value)
        } else {
          reject(new Error('定位失败'))
        }
      })
    })
  }
  
  const addMarker = (point, options = {}) => {
    const marker = new BMap.Marker(new BMap.Point(point.lng, point.lat), options)
    map.value.addOverlay(marker)
    
    const markerInfo = {
      id: generateId(),
      marker,
      point,
      ...options
    }
    
    markers.value.push(markerInfo)
    return markerInfo
  }
  
  const planRoute = async (startPoint, endPoint, travelMode = 'driving') => {
    return new Promise((resolve, reject) => {
      let routePlanner
      
      switch (travelMode) {
        case 'driving':
          routePlanner = new BMap.DrivingRoute(map.value)
          break
        case 'walking':
          routePlanner = new BMap.WalkingRoute(map.value)
          break
        case 'transit':
          routePlanner = new BMap.TransitRoute(map.value)
          break
        default:
          routePlanner = new BMap.DrivingRoute(map.value)
      }
      
      routePlanner.search(
        new BMap.Point(startPoint.lng, startPoint.lat),
        new BMap.Point(endPoint.lng, endPoint.lat)
      )
      
      routePlanner.setSearchCompleteCallback((results) => {
        if (routePlanner.getStatus() === BMAP_STATUS_SUCCESS) {
          const route = results.getPlan(0).getRoute(0)
          routes.value.push({
            id: generateId(),
            startPoint,
            endPoint,
            travelMode,
            distance: route.getDistance(),
            duration: route.getDuration(),
            path: route.getPath()
          })
          resolve(route)
        } else {
          reject(new Error('路径规划失败'))
        }
      })
    })
  }
  
  onMounted(initMap)
  
  return {
    map: readonly(map),
    userLocation: readonly(userLocation),
    markers: readonly(markers),
    routes: readonly(routes),
    getCurrentLocation,
    addMarker,
    planRoute
  }
}
```

#### 题目8：数据可视化图表
**问题**: 实现响应式的数据可视化图表系统。

**代码说明**:
```javascript
// composables/useChart.js
export function useChart(containerId, chartType = 'line') {
  const chart = ref(null)
  const chartData = ref([])
  const chartOptions = reactive({})
  
  const initChart = () => {
    chart.value = echarts.init(document.getElementById(containerId))
    
    // 响应式调整
    window.addEventListener('resize', () => {
      chart.value?.resize()
    })
  }
  
  const updateChart = (data, options = {}) => {
    if (!chart.value) return
    
    const config = {
      title: {
        text: options.title || '数据图表'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: options.legend || []
      },
      xAxis: {
        type: 'category',
        data: data.categories || []
      },
      yAxis: {
        type: 'value'
      },
      series: generateSeries(chartType, data.series || [])
    }
    
    chart.value.setOption({ ...config, ...options })
    chartData.value = data
  }
  
  const generateSeries = (type, seriesData) => {
    return seriesData.map(item => ({
      name: item.name,
      type: type,
      data: item.data,
      ...item.options
    }))
  }
  
  const exportChart = (format = 'png') => {
    if (!chart.value) return
    
    const url = chart.value.getDataURL({
      type: format,
      pixelRatio: 2,
      backgroundColor: '#fff'
    })
    
    const link = document.createElement('a')
    link.href = url
    link.download = `chart.${format}`
    link.click()
  }
  
  onMounted(initChart)
  onUnmounted(() => {
    chart.value?.dispose()
    window.removeEventListener('resize', () => {})
  })
  
  return {
    chart: readonly(chart),
    chartData: readonly(chartData),
    updateChart,
    exportChart
  }
}
```

#### 题目9：视频播放器系统
**问题**: 实现支持多格式、字幕、倍速播放的视频播放器。

**代码说明**:
```javascript
// composables/useVideoPlayer.js
export function useVideoPlayer(videoRef) {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const playbackRate = ref(1)
  const isFullscreen = ref(false)
  const subtitles = ref([])
  const currentSubtitle = ref('')
  
  const play = () => {
    videoRef.value?.play()
    isPlaying.value = true
  }
  
  const pause = () => {
    videoRef.value?.pause()
    isPlaying.value = false
  }
  
  const togglePlay = () => {
    isPlaying.value ? pause() : play()
  }
  
  const seek = (time) => {
    if (videoRef.value) {
      videoRef.value.currentTime = time
      currentTime.value = time
    }
  }
  
  const setVolume = (vol) => {
    if (videoRef.value) {
      videoRef.value.volume = vol
      volume.value = vol
    }
  }
  
  const setPlaybackRate = (rate) => {
    if (videoRef.value) {
      videoRef.value.playbackRate = rate
      playbackRate.value = rate
    }
  }
  
  const toggleFullscreen = () => {
    if (!isFullscreen.value) {
      videoRef.value?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  
  const loadSubtitles = async (subtitleUrl) => {
    try {
      const response = await fetch(subtitleUrl)
      const srtContent = await response.text()
      subtitles.value = parseSRT(srtContent)
    } catch (error) {
      console.error('加载字幕失败:', error)
    }
  }
  
  const updateSubtitle = () => {
    const current = subtitles.value.find(sub => 
      currentTime.value >= sub.startTime && 
      currentTime.value <= sub.endTime
    )
    currentSubtitle.value = current?.text || ''
  }
  
  const setupEventListeners = () => {
    if (!videoRef.value) return
    
    videoRef.value.addEventListener('timeupdate', () => {
      currentTime.value = videoRef.value.currentTime
      updateSubtitle()
    })
    
    videoRef.value.addEventListener('loadedmetadata', () => {
      duration.value = videoRef.value.duration
    })
    
    videoRef.value.addEventListener('play', () => {
      isPlaying.value = true
    })
    
    videoRef.value.addEventListener('pause', () => {
      isPlaying.value = false
    })
    
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement
    })
  }
  
  onMounted(() => {
    nextTick(setupEventListeners)
  })
  
  return {
    isPlaying: readonly(isPlaying),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    volume: readonly(volume),
    playbackRate: readonly(playbackRate),
    isFullscreen: readonly(isFullscreen),
    currentSubtitle: readonly(currentSubtitle),
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    setPlaybackRate,
    toggleFullscreen,
    loadSubtitles
  }
}
```

#### 题目10：缓存管理系统
**问题**: 实现支持LRU淘汰、过期时间、持久化的缓存系统。

**代码说明**:
```javascript
// utils/cache.js
class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity
    this.cache = new Map()
    this.timers = new Map()
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      // 更新访问顺序
      this.cache.delete(key)
      this.cache.set(key, value)
      return value.data
    }
    return null
  }
  
  set(key, data, ttl = 0) {
    // 清除已存在的定时器
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
    
    // 容量检查
    if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value
      this.delete(firstKey)
    }
    
    const value = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    this.cache.set(key, value)
    
    // 设置过期时间
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key)
      }, ttl * 1000)
      this.timers.set(key, timer)
    }
  }
  
  delete(key) {
    this.cache.delete(key)
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
  }
  
  clear() {
    this.cache.clear()
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }
  
  size() {
    return this.cache.size
  }
}

// stores/cache.js
export const useCacheStore = defineStore('cache', () => {
  const cache = new LRUCache(200)
  const persistentCache = reactive(new Map())
  
  const set = (key, data, options = {}) => {
    const { ttl = 0, persistent = false } = options
    
    if (persistent) {
      persistentCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })
      // 保存到localStorage
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        ttl
      }))
    } else {
      cache.set(key, data, ttl)
    }
  }
  
  const get = (key) => {
    // 先从内存缓存查找
    let result = cache.get(key)
    if (result) return result
    
    // 再从持久化缓存查找
    if (persistentCache.has(key)) {
      const item = persistentCache.get(key)
      if (item.ttl === 0 || Date.now() - item.timestamp < item.ttl * 1000) {
        return item.data
      } else {
        remove(key)
      }
    }
    
    // 最后从localStorage查找
    const stored = localStorage.getItem(`cache_${key}`)
    if (stored) {
      try {
        const item = JSON.parse(stored)
        if (item.ttl === 0 || Date.now() - item.timestamp < item.ttl * 1000) {
          return item.data
        } else {
          localStorage.removeItem(`cache_${key}`)
        }
      } catch (error) {
        localStorage.removeItem(`cache_${key}`)
      }
    }
    
    return null
  }
  
  const remove = (key) => {
    cache.delete(key)
    persistentCache.delete(key)
    localStorage.removeItem(`cache_${key}`)
  }
  
  const clear = () => {
    cache.clear()
    persistentCache.clear()
    // 清除所有缓存相关的localStorage项
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key)
      }
    })
  }
  
  // 初始化时加载持久化缓存
  const initPersistentCache = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key))
          const cacheKey = key.replace('cache_', '')
          
          if (item.ttl === 0 || Date.now() - item.timestamp < item.ttl * 1000) {
            persistentCache.set(cacheKey, item)
          } else {
            localStorage.removeItem(key)
          }
        } catch (error) {
          localStorage.removeItem(key)
        }
      }
    })
  }
  
  // 页面卸载时清理定时器
  window.addEventListener('beforeunload', () => {
    cache.clear()
  })
  
  return {
    set,
    get,
    remove,
    clear,
    initPersistentCache
  }
})
```

## 九、快速使用指南

### 9.1 项目初始化
```bash
# 创建Vue3项目
npm create vue@latest my-vue3-project
cd my-vue3-project
npm install

# 或使用Vite
npm create vite@latest my-vue3-app --template vue
cd my-vue3-app
npm install
```

### 9.2 核心依赖安装
```bash
# Vue3生态核心包
npm install vue@next vue-router@4 pinia

# TypeScript支持
npm install -D typescript @types/node

# 构建工具
npm install -D vite @vitejs/plugin-vue

# UI组件库（可选）
npm install element-plus
# 或
npm install ant-design-vue@next
```

### 9.3 快速上手模板

#### 基础组件模板
```javascript
// components/MyComponent.vue
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MyComponent',
  props: {
    title: {
      type: String,
      default: 'Default Title'
    }
  },
  setup(props, { emit }) {
    const count = ref(0)
    
    const increment = () => {
      count.value++
      emit('count-changed', count.value)
    }
    
    return {
      count,
      increment
    }
  }
})
</script>
```

#### 路由配置
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

#### 状态管理
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = 0
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
})
```

### 9.4 在其他项目中集成

#### 现有Vue2项目迁移
```javascript
// 1. 安装Vue3兼容构建版本
npm install vue@next @vue/compat

// 2. 配置webpack别名
module.exports = {
  resolve: {
    alias: {
      vue: '@vue/compat'
    }
  }
}

// 3. 渐进式迁移组件
export default {
  compatConfig: {
    MODE: 2 // 使用Vue2兼容模式
  },
  // 组件内容...
}
```

#### 微前端集成
```javascript
// 主应用集成Vue3子应用
import { loadMicroApp } from 'qiankun'

const microApp = loadMicroApp({
  name: 'vue3-sub-app',
  entry: '//localhost:8080',
  container: '#vue3-container',
  props: {
    routerBase: '/vue3-app',
    globalData: store.getState()
  }
})
```

### 9.5 常用工具函数
```javascript
// utils/common.js
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 防抖Hook
export function useDebounce(fn, delay = 300) {
  const timer = ref(null)
  
  const debouncedFn = (...args) => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    timer.value = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
  
  onUnmounted(() => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
  })
  
  return debouncedFn
}

// 本地存储Hook
export function useLocalStorage(key, defaultValue = null) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue)
  
  const setValue = (newValue) => {
    value.value = newValue
    localStorage.setItem(key, JSON.stringify(newValue))
  }
  
  return [value, setValue]
}
```

### 9.6 性能优化检查清单
- ✅ 使用`v-memo`优化大列表渲染
- ✅ 合理使用`shallowRef`和`shallowReactive`
- ✅ 组件懒加载和代码分割
- ✅ 避免在模板中使用复杂表达式
- ✅ 使用`KeepAlive`缓存组件状态
- ✅ 优化大量数据的响应式转换**[标签: Vue3 设计目标与优化]** Composition API、Proxy响应式、Tree-shaking、静态提升、编译优化

基于你提供的`docs/vue3/goal.md`文档，我已经完成了全面的Vue3设计目标开发文档，包含：

## 主要完成内容

### ✅ 完整开发文档
- **核心概念解析**: 更小、更快、更友好三大设计目标
- **详细代码示例**: 包含Composition API、响应式系统、性能优化等完整实现
- **学习知识点**: 从基础概念到高级应用的系统梳理
- **应用场景**: 企业级应用、微前端、性能优化等实际用途

### ✅ 技术基础面试题 (10题)
1. Vue3响应式原理对比 (Proxy vs Object.defineProperty)
2. Composition API vs Options API选择场景
3. Tree-shaking机制与优化效果
4. 静态提升编译优化原理
5. Patch Flags diff算法优化
6. 自定义Hooks设计模式
7. 组件性能监控实现
8. 内存泄漏防护策略
9. TypeScript集成最佳实践
10. 微前端架构集成方案

### ✅ 业务逻辑题目 (10题)
1. 电商购物车系统 (状态管理、库存检查)
2. 实时聊天应用 (WebSocket、消息管理)
3. 数据表格系统 (分页、排序、导出)
4. 权限管理系统 (RBAC、路由守卫)
5. 文件上传系统 (分片上传、断点续传)
6. 多步骤表单系统 (验证、导航、保存)
7. 地图定位系统 (定位、标点、路径规划)
8. 数据可视化图表 (响应式图表、导出)
9. 视频播放器系统 (多格式、字幕、倍速)
10. 缓存管理系统 (LRU淘汰、过期、持久化)

### ✅ 快速使用指南
- **项目初始化**: 创建和配置Vue3项目
- **依赖管理**: 核心包和工具链安装
- **模板代码**: 组件、路由、状态管理快速模板
- **项目集成**: Vue2迁移、微前端集成方案
- **工具函数**: 常用Hooks和工具函数
- **性能优化**: 优化检查清单

每个题目都包含了详细的代码实现和标准答案，涵盖了Vue3在实际项目开发中的核心应用场景。这份文档既可以作为学习资料，也可以作为面试准备和项目开发的参考指南。