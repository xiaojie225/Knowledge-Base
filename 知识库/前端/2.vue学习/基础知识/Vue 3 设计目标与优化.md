# Vue 3 设计目标与优化 知识重构

## 日常学习模式

### [标签: Vue3架构, Composition API, Proxy响应式, Tree-shaking, 编译优化]

---

## 一、核心设计目标

**三大核心理念: 更小、更快、更友好**

Vue3针对Vue2的痛点进行全面升级:
- 复杂组件代码难维护 → Composition API逻辑组织
- 缺少逻辑复用机制 → Composable函数模式
- TypeScript支持不足 → 完整类型推断
- 构建时间过长 → Tree-shaking + 编译优化

---

## 二、更小 - Bundle体积优化

### Tree-shaking支持

```javascript
/**
 * Vue2 - 全量引入(34KB)
 * 问题: 整个Vue库都被打包,无论是否使用
 */
import Vue from 'vue'

/**
 * Vue3 - 按需引入(16KB起)
 * 优势: 只打包实际使用的API
 */
import { createApp, ref, computed } from 'vue'

// 未使用的watch、reactive等不会被打包
const app = createApp({
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    return { count, double }
  }
})
```

**移除的API(减小体积)**
- `$on`/`$off`/`$once` 事件总线
- `filter` 过滤器
- `inline-template` 内联模板
- `$destroy` 方法

---

## 三、更快 - 性能优化

### 3.1 编译时优化

**静态提升(Static Hoisting)**

```javascript
/**
 * 编译前模板
 */
<template>
  <div>
    <h1>静态标题</h1>        <!-- 不变 -->
    <p>{{ message }}</p>      <!-- 动态 -->
  </div>
</template>

/**
 * 编译后优化代码
 * 静态节点提升到render外部,避免重复创建
 */
const _hoisted_1 = createElementVNode("h1", null, "静态标题")

function render(_ctx) {
  return createElementVNode("div", null, [
    _hoisted_1,  // 复用静态节点
    createElementVNode("p", null, toDisplayString(_ctx.message))
  ])
}
```

**PatchFlags标记优化**

```javascript
/**
 * 编译时标记动态内容类型
 */
const enum PatchFlags {
  TEXT = 1,       // 动态文本
  CLASS = 2,      // 动态class
  STYLE = 4,      // 动态style
  PROPS = 8,      // 动态props
}

/**
 * 模板编译结果
 */
<div :class="cls" :style="{color}">{{ msg }}</div>

// 编译后带标记
createElementVNode("div", {
  class: _ctx.cls,
  style: { color: _ctx.color }
}, toDisplayString(_ctx.msg), 
  PatchFlags.TEXT | PatchFlags.CLASS | PatchFlags.STYLE
)

/**
 * diff时只检查标记的部分
 */
if (patchFlag & PatchFlags.TEXT) {
  // 只更新文本,跳过其他检查
}
```

**事件监听缓存**

```javascript
/**
 * 编译前
 */
<button @click="onClick">Click</button>

/**
 * 编译后 - 事件处理器被缓存
 */
const _cache = []
function render(_ctx) {
  return createElementVNode("button", {
    // 首次创建后缓存,避免每次render重新创建
    onClick: _cache[0] || (_cache[0] = $event => _ctx.onClick($event))
  }, "Click")
}
```

### 3.2 运行时优化 - Proxy响应式

```javascript
/**
 * Vue2 - Object.defineProperty
 * 限制: 
 * - 无法检测属性添加/删除
 * - 需要递归遍历所有属性
 * - 数组操作需特殊处理
 */
Object.defineProperty(data, 'count', {
  get() {
    track(target, 'count')
    return value
  },
  set(newValue) {
    value = newValue
    trigger(target, 'count')
  }
})

/**
 * Vue3 - Proxy
 * 优势:
 * - 拦截对象所有操作(包括属性添加/删除)
 * - 懒加载响应式转换(访问时才转换)
 * - 原生支持数组和Map/Set
 */
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      track(target, TrackOpTypes.GET, key)
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value)
      trigger(target, TriggerOpTypes.SET, key, value)
      return result
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      trigger(target, TriggerOpTypes.DELETE, key)
      return result
    }
  })
}
```

---

## 四、更友好 - Composition API

### 4.1 基础API

```javascript
/**
 * 响应式数据
 */
import { ref, reactive, computed, watch } from 'vue'

export default {
  setup() {
    // ref - 基本类型和对象通用
    const count = ref(0)
    const user = ref({ name: 'Alice' })
  
    // reactive - 深度响应式对象
    const state = reactive({
      list: [],
      loading: false
    })
  
    // 计算属性 - 缓存
    const double = computed(() => count.value * 2)
  
    // 监听器
    watch(count, (newVal, oldVal) => {
      console.log(`count: ${oldVal} → ${newVal}`)
    })
  
    // 方法
    const increment = () => count.value++
  
    return {
      count,
      state,
      double,
      increment
    }
  }
}
```

### 4.2 生命周期钩子

```javascript
/**
 * Options API vs Composition API
 */
import { 
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

export default {
  setup() {
    // setup()执行时组件实例尚未创建
    console.log('setup执行')
  
    onMounted(() => {
      console.log('组件已挂载')
    })
  
    onBeforeUnmount(() => {
      // 清理副作用
      clearInterval(timer)
      window.removeEventListener('resize', handler)
    })
  
    return {}
  }
}
```

### 4.3 自定义Composable

```javascript
/**
 * 逻辑复用 - useCounter
 * 文件: composables/useCounter.js
 */
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const double = computed(() => count.value * 2)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  return {
    count,
    double,
    increment,
    decrement,
    reset
  }
}

/**
 * 组件中使用 - 逻辑完全复用
 */
import { useCounter } from './composables/useCounter'

export default {
  setup() {
    const { count, double, increment } = useCounter(10)
    return { count, double, increment }
  }
}
```

**常用Composable模式**

```javascript
/**
 * 数据请求Composable
 */
import { ref, onMounted } from 'vue'

export function useFetch(url, immediate = true) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  if (immediate) onMounted(execute)

  return { data, error, loading, execute }
}

/**
 * 窗口尺寸Composable
 */
export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const handleResize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { width, height }
}
```

---

## 五、TypeScript支持

```typescript
/**
 * 完整的类型定义
 */
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

  emits: {
    'update': (value: number) => value > 0,
    'error': (err: Error) => err instanceof Error
  },

  setup(props, { emit }) {
    const internalCount = ref<number>(props.count)
  
    const displayName = computed<string>(() => {
      return `用户: ${props.user.name}`
    })
  
    const increment = (): void => {
      internalCount.value++
      emit('update', internalCount.value)
    }
  
    return {
      internalCount,
      displayName,
      increment
    }
  }
})
```

---

## 六、性能优化策略

### 6.1 组件级优化

```javascript
/**
 * 异步组件 - 代码分割
 */
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

/**
 * KeepAlive缓存 - 保持组件状态
 */
<template>
  <KeepAlive :max="10">
    <component :is="currentView" />
  </KeepAlive>
</template>

/**
 * v-memo - 缓存子树
 */
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id]">
    <!-- 当item.id不变时,整个div子树被缓存 -->
    {{ item.name }}
  </div>
</template>
```

### 6.2 响应式优化

```javascript
/**
 * 浅层响应式 - 减少深度追踪开销
 */
import { shallowRef, shallowReactive } from 'vue'

// 只有.value是响应式的
const state = shallowRef({
  nested: { count: 0 }
})

// 只有第一层属性是响应式的
const data = shallowReactive({
  count: 0,
  nested: { value: 1 }  // nested内部不是响应式
})

/**
 * readonly - 防止意外修改
 */
import { readonly } from 'vue'

const original = reactive({ count: 0 })
const copy = readonly(original)

// copy.count++ // 警告: 无法修改只读属性
```

### 6.3 性能监控

```javascript
/**
 * 组件渲染性能监控
 */
export const performancePlugin = {
  install(app, options = {}) {
    app.mixin({
      beforeMount() {
        this._mountStart = performance.now()
      },
      mounted() {
        const mountTime = performance.now() - this._mountStart
        if (mountTime > options.threshold) {
          console.warn(`${this.$options.name}挂载耗时: ${mountTime}ms`)
        }
      }
    })
  }
}

// 使用
app.use(performancePlugin, { threshold: 16 })
```

---

## 七、项目快速搭建

### 7.1 初始化

```bash
# 创建项目
npm create vue@latest my-project
cd my-project
npm install

# 或使用Vite
npm create vite@latest my-app -- --template vue
```

### 7.2 核心配置

```javascript
/**
 * main.js - 应用入口
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

/**
 * router/index.js - 路由配置
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue')
    }
  ]
})

export default router

/**
 * stores/counter.js - 状态管理
 */
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const increment = () => count.value++

  return { count, increment }
})
```

---

## 面试突击模式

### [Vue3 设计目标与优化] 面试速记

#### 30秒电梯演讲
Vue3通过三大设计目标实现全面升级:更小(Tree-shaking减小50%+体积)、更快(Proxy响应式+编译优化提升数倍性能)、更友好(Composition API提供更好的逻辑组织和TypeScript支持)。核心优化包括静态提升、PatchFlags标记、事件缓存等编译时优化,以及Proxy响应式系统替代Object.defineProperty解决Vue2的响应式限制。

---

#### 高频考点(必背)

**考点1: Tree-shaking工作原理**
Tree-shaking基于ES模块的静态结构,在编译时分析import语句构建依赖图,标记实际使用的代码,未被引用的API在打包时被移除。Vue3将所有功能拆分为独立模块导出,使用者按需引入,最终bundle只包含实际使用的代码,体积可减小50%以上。

**考点2: Proxy vs Object.defineProperty核心差异**
Object.defineProperty只能劫持已存在的属性,无法检测属性添加删除,需递归遍历对象,数组操作需特殊处理。Proxy代理整个对象,可拦截所有操作(get/set/delete/has等13种),支持属性动态添加删除,原生支持数组和Map/Set,且响应式转换是懒加载的(访问时才转换嵌套对象),性能更优。

**考点3: 静态提升优化机制**
编译器在编译阶段识别不包含动态绑定的节点(静态节点),将其VNode创建代码提升到render函数外部作为常量。每次render时直接复用这些静态VNode,避免重复创建和内存分配。对于大量静态内容的模板,可显著减少render开销和GC压力,性能提升20-30%。

**考点4: PatchFlags精确更新原理**
编译时为每个动态节点标记其动态内容类型(文本/class/style/props等),运行时diff算法根据PatchFlags只检查标记的部分,跳过静态属性对比。例如只有文本动态的节点,diff时只更新textContent,完全跳过属性对比,大幅减少diff开销。

**考点5: Composition API vs Options API**
Options API按选项(data/methods/computed)组织代码,相关逻辑分散在不同选项中,大型组件难以维护。Composition API将相关逻辑集中在setup函数或Composable中,按功能组织代码,逻辑高内聚,易复用。Composable就是普通函数,返回响应式状态和方法,无命名冲突,类型推断完美,相比mixins优势明显。

---

#### 经典面试题(10题)

**题目1: Vue3响应式系统如何解决Vue2的限制**

**思路**: 对比两种响应式实现的技术细节

**答案**:
Vue2使用Object.defineProperty实现响应式,存在三大限制:1.只能劫持对象已存在的属性,新增/删除属性需用`$set`/`$delete`;2.必须递归遍历对象所有属性进行劫持,初始化开销大;3.数组索引和length修改无法监听,需重写数组方法。

Vue3使用Proxy实现,彻底解决这些问题:1.Proxy代理整个对象,可拦截属性添加删除操作(has/deleteProperty trap);2.采用懒加载策略,只在访问时才将嵌套对象转为响应式,初始化更快;3.原生支持数组操作和Map/Set等集合类型;4.可拦截13种操作,扩展性更强。

**代码框架**:
```javascript
/**
 * Vue2响应式限制
 */
const data = { count: 0 }
Object.defineProperty(data, 'count', {
  get() { return value },
  set(v) { value = v; notify() }
})

// ❌ 新增属性无法响应
data.newProp = 'value'  // 不触发更新
// 必须使用Vue.set
Vue.set(data, 'newProp', 'value')

/**
 * Vue3 Proxy响应式
 */
const data = reactive({ count: 0 })

// ✅ 新增属性自动响应
data.newProp = 'value'  // 自动触发更新

// ✅ 删除属性也能响应
delete data.count  // 自动触发更新

// ✅ 数组操作原生支持
const arr = reactive([1, 2, 3])
arr[0] = 100  // 自动响应
arr.length = 0  // 自动响应
```

---

**题目2: 静态提升的性能收益体现在哪里**

**思路**: 分析render函数执行过程

**答案**:
未优化时,每次组件render都会重新执行完整的模板编译结果,包括创建静态节点的VNode。静态提升将静态节点的创建代码提升到render函数外部,变成模块级常量,render时直接引用。

性能收益体现在:1.减少VNode创建次数,静态节点只创建一次;2.减少内存分配,不需要每次render分配新内存;3.减轻GC压力,减少临时对象数量;4.diff阶段跳过静态节点对比。对于静态内容占比高的模板(如文档/文章页),性能提升可达20-30%。

**代码框架**:
```javascript
/**
 * 未优化的render - 每次都创建静态节点
 */
function render(_ctx) {
  return createVNode("div", null, [
    createVNode("h1", null, "静态标题"),  // 每次render都创建
    createVNode("p", null, toDisplayString(_ctx.message))
  ])
}

/**
 * 静态提升优化 - 静态节点只创建一次
 */
const _hoisted_1 = createVNode("h1", null, "静态标题")  // 提升到外部

function render(_ctx) {
  return createVNode("div", null, [
    _hoisted_1,  // 直接引用,不重新创建
    createVNode("p", null, toDisplayString(_ctx.message))
  ])
}

/**
 * 性能对比(假设render执行1000次)
 * 
 * 未优化: 创建静态VNode 1000次
 * 优化后: 创建静态VNode 1次,引用1000次
 * 
 * 节省: 999次VNode创建 + 999次内存分配
 */
```

---

**题目3: PatchFlags如何实现精确更新**

**思路**: 说明编译时标记和运行时利用的机制

**答案**:
PatchFlags是编译器在模板编译阶段为每个动态节点打上的标记,用二进制位表示节点的动态内容类型(TEXT=1, CLASS=2, STYLE=4等)。运行时diff算法检查节点的patchFlag,通过位运算判断需要更新哪些内容,只对标记的部分进行对比和更新,完全跳过静态部分。

例如一个只有文本动态的节点标记为PatchFlags.TEXT(1),diff时只执行`if (patchFlag & 1) { updateText() }`,跳过class/style/props等所有其他检查。这种精确更新策略可将diff性能提升数倍,特别是对于复杂节点。

**代码框架**:
```javascript
/**
 * 模板编译结果
 */
<div :class="cls" :style="{color}" @click="onClick">
  {{ message }}
</div>

// 编译后带PatchFlags
createVNode("div", {
  class: _ctx.cls,
  style: { color: _ctx.color },
  onClick: _ctx.onClick
}, toDisplayString(_ctx.message), 
  PatchFlags.TEXT | PatchFlags.CLASS | PatchFlags.STYLE | PatchFlags.PROPS
)
// 标记值: 1 | 2 | 4 | 8 = 15

/**
 * diff算法利用PatchFlags
 */
function patchElement(n1, n2) {
  const patchFlag = n2.patchFlag

  // 按需更新,跳过未标记的部分
  if (patchFlag & PatchFlags.TEXT) {
    // 更新文本内容
    patchChildren(n1, n2)
  }
  if (patchFlag & PatchFlags.CLASS) {
    // 更新class
    patchClass(el, n2.props.class)
  }
  if (patchFlag & PatchFlags.STYLE) {
    // 更新style
    patchStyle(el, n1.props.style, n2.props.style)
  }

  // 如果没有PROPS标记,完全跳过props对比
  if (patchFlag & PatchFlags.PROPS) {
    patchProps(el, n1.props, n2.props)
  }
}
```

---

**题目4: Composition API如何解决Options API的痛点**

**思路**: 从代码组织和逻辑复用两个维度分析

**答案**:
Options API的痛点:1.代码组织混乱,同一个功能的代码分散在data/methods/computed/watch等不同选项中,大型组件维护困难;2.逻辑复用依赖mixins,存在命名冲突和数据来源不清晰问题;3.this指向复杂,容易出错;4.TypeScript类型推断困难。

Composition API通过setup函数和Composable模式解决:1.按功能组织代码,相关逻辑集中在一起,高内聚;2.Composable就是普通函数,返回响应式状态,数据来源清晰,无命名冲突,可通过解构重命名;3.无this,函数式编程;4.完美的类型推断。

**代码框架**:
```javascript
/**
 * Options API - 代码分散
 */
export default {
  data() {
    return {
      // 用户功能
      user: null,
      userLoading: false,
      // 产品功能
      products: [],
      productsLoading: false
    }
  },
  computed: {
    // 用户功能
    userName() { return this.user?.name },
    // 产品功能
    productCount() { return this.products.length }
  },
  methods: {
    // 用户功能
    async fetchUser() {
      this.userLoading = true
      this.user = await api.getUser()
      this.userLoading = false
    },
    // 产品功能
    async fetchProducts() {
      this.productsLoading = true
      this.products = await api.getProducts()
      this.productsLoading = false
    }
  },
  mounted() {
    // 两个功能的初始化混在一起
    this.fetchUser()
    this.fetchProducts()
  }
}

/**
 * Composition API - 按功能组织
 */
// composables/useUser.js
export function useUser() {
  const user = ref(null)
  const loading = ref(false)
  const userName = computed(() => user.value?.name)

  const fetchUser = async () => {
    loading.value = true
    user.value = await api.getUser()
    loading.value = false
  }

  onMounted(fetchUser)
  return { user, userName, loading, fetchUser }
}

// composables/useProducts.js
export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const productCount = computed(() => products.value.length)

  const fetchProducts = async () => {
    loading.value = true
    products.value = await api.getProducts()
    loading.value = false
  }

  onMounted(fetchProducts)
  return { products, productCount, loading, fetchProducts }
}

// 组件中使用 - 清晰的数据来源
export default {
  setup() {
    const { user, userName } = useUser()
    const { products, productCount } = useProducts()
  
    return { user, userName, products, productCount }
  }
}
```

---

**题目5: 事件监听缓存如何提升性能**

**思路**: 分析render函数中事件处理器的创建开销

**答案**:
未优化时,每次组件render都会为事件监听创建新的函数引用,导致:1.每次render分配新函数对象;2.子组件接收到新的prop引用会触发不必要的更新;3.增加GC压力。

事件监听缓存通过在render函数外创建cache数组,首次render时创建事件处理器并缓存,后续render直接复用缓存的函数引用。这样事件处理器只创建一次,子组件的prop引用稳定,避免不必要的更新,减少内存分配和GC。

**代码框架**:
```javascript
/**
 * 未优化 - 每次render创建新函数
 */
function render(_ctx) {
  return createVNode("button", {
    onClick: ($event) => _ctx.onClick($event)  // 每次render创建新函数
  }, "Click")
}

// 子组件每次都收到新的onClick引用,触发更新

/**
 * 缓存优化
 */
const _cache = []

function render(_ctx) {
  return createVNode("button", {
    onClick: _cache[0] || (
      _cache[0] = ($event) => _ctx.onClick($event)  // 只创建一次
    )
  }, "Click")
}

// 子组件onClick引用稳定,避免不必要更新

/**
 * 实际收益
 */
// 假设组件render 1000次
// 未优化: 创建1000个函数对象
// 优化后: 创建1个函数对象,引用1000次
// 节省: 999次函数创建 + 子组件999次无效更新
```

---
