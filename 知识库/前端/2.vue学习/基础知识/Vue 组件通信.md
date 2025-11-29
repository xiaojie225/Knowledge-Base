# Vue组件通信精华学习资料

## 📚 日常学习模式

[标签: Vue组件通信、Props、Emit、EventBus、Provide/Inject]

### 一、核心概念体系

#### 1. Props - 父传子单向数据流

**核心机制**: 父组件通过属性向下传递数据，子组件只读接收

**Vue3关键代码**:
```javascript
// 父组件传递
<Child :user="userData" :count="10" />

// 子组件接收
const props = defineProps({
  user: Object,
  count: {
    type: Number,
    default: 0,
    required: true
  }
})
```

**使用场景**: 
- 列表组件接收数据源
- 表单组件接收初始值
- 展示型组件接收配置项

**注意要点**:
- Props为只读，子组件不可直接修改
- 对象/数组Props变更会影响父组件（引用类型）
- 需修改时通过emit通知父组件

---

#### 2. Emit - 子传父事件机制

**核心机制**: 子组件触发自定义事件，携带数据通知父组件

**Vue3关键代码**:
```javascript
// 子组件触发
const emit = defineEmits(['update', 'delete'])
emit('update', newValue)

// 父组件监听
<Child @update="handleUpdate" @delete="handleDelete" />
```

**使用场景**:
- 表单组件提交数据
- 按钮组件触发操作
- 列表项通知父组件刷新

**注意要点**:
- 事件名推荐kebab-case格式
- 可传递多个参数
- Vue3需用defineEmits声明

---

#### 3. Ref - 父访问子实例

**核心机制**: 父组件通过ref直接访问子组件实例的方法和数据

**Vue3关键代码**:
```javascript
// 父组件访问
<Children ref="child" />

const child = ref(null)
child.value.sayHello()

// 子组件暴露
defineExpose({
  message,
  sayHello
})
```

**使用场景**:
- 调用子组件表单验证
- 控制子组件视频播放
- 获取子组件内部状态

**注意要点**:
- Vue3必须用defineExpose显式暴露
- 破坏组件封装性，谨慎使用
- 在DOM渲染后才能访问

---

#### 4. EventBus - 任意组件通信

**核心机制**: 创建全局事件中心实现发布订阅模式

**Vue3关键代码（mitt库）**:
```javascript
// bus.js
import mitt from 'mitt'
export const bus = mitt()

// 发送方
bus.emit('eventName', data)

// 接收方
onMounted(() => bus.on('eventName', handler))
onUnmounted(() => bus.off('eventName', handler))
```

**使用场景**:
- 兄弟组件通信
- 跨层级组件通信
- 全局消息通知

**注意要点**:
- 必须在组件销毁时解绑事件
- Vue3官方移除$on/$emit，需第三方库
- 大规模使用会导致维护困难

---

#### 5. Provide/Inject - 跨层级依赖注入

**核心机制**: 祖先组件提供数据，后代组件按需注入

**Vue3关键代码**:
```javascript
// 祖先组件提供
const theme = ref('dark')
provide('theme', theme)
provide('updateTheme', (val) => theme.value = val)

// 后代组件注入
const theme = inject('theme')
const updateTheme = inject('updateTheme')
```

**使用场景**:
- 主题配置传递
- 用户权限注入
- 多语言上下文

**注意要点**:
- 提供响应式对象才能双向绑定
- 不建议后代直接修改注入值
- Symbol作为key避免命名冲突

---

#### 6. Vuex - 集中式状态管理

**核心机制**: 单一状态树管理全局共享数据

**关键概念**:
```javascript
// State: 数据源
state: { count: 0 }

// Getters: 计算属性
getters: { double: state => state.count * 2 }

// Mutations: 同步修改(唯一方式)
mutations: { 
  increment(state) { state.count++ } 
}

// Actions: 异步操作
actions: { 
  asyncIncrement({commit}) {
    setTimeout(() => commit('increment'), 1000)
  }
}
```

**使用场景**:
- 用户登录状态
- 购物车数据
- 全局配置项
- 多组件共享数据

**注意要点**:
- 只能通过mutation修改state
- action处理异步，mutation处理同步
- 大型应用必备，小型应用可能过度

---

#### 7. $attrs - 属性透传

**核心机制**: 自动将父组件未声明的props和事件传递给子组件

**Vue3关键代码**:
```javascript
<!-- 父组件 Father.vue -->
<Child :message="message" @update="handleUpdate" />
// 中间组件透传
<DeepChild v-bind="$attrs" />

// 孙组件接收
const attrs = useAttrs() // 包含props和事件
console.log(attrs) // { message: "来自父组件的消息", onUpdate: f }
```

**使用场景**:
- 高阶组件封装
- 多层组件属性传递
- 组件库开发

**注意要点**:
- Vue3中$listeners已合并到$attrs
- 未声明的props自动进入$attrs
- 设置inheritAttrs: false阻止自动绑定

---

### 二、技术选型决策树

```
├── 父子组件通信
│   ├── 父→子: Props
│   ├── 子→父: Emit
│   └── 父调用子: Ref (谨慎使用)
│
├── 兄弟/远亲组件通信
│   ├── 简单场景: EventBus
│   └── 复杂场景: Vuex
│
├── 跨层级组件通信
│   ├── 配置型数据: Provide/Inject
│   ├── 多级透传: $attrs
│   └── 复杂共享: Vuex
│
└── 全局状态管理
    └── Vuex/Pinia (Vue3推荐Pinia)
```

---

### 三、Vue2 vs Vue3 核心差异

| 特性 | Vue2 | Vue3 |
|------|------|------|
| Props声明 | props选项 | defineProps() |
| Emit触发 | this.$emit() | defineEmits() |
| Ref暴露 | 自动暴露 | defineExpose() |
| EventBus | new Vue() | mitt库 |
| Provide/Inject | 选项式 | Composition API |
| $attrs | 仅属性 | 属性+事件合并 |

---

## ⚡ 面试突击模式

### 30秒电梯演讲

Vue组件通信有8种核心方式：**父子通信用Props/Emit**，**父访问子用Ref**，**兄弟组件用EventBus**，**跨层级用Provide/Inject或
$attrs透传**，**全局状态用Vuex**。Vue3废弃了$listeners和EventBus原生支持，强制使用defineProps/defineEmits/defineExpose显式声明，推荐mitt库实现事件总线。

---

### 高频考点(必背)

**考点1: Props单向数据流原则**
Props数据只能从父组件流向子组件，子组件不能直接修改props。若需修改需emit事件通知父组件更新。对象/数组类型props因引用传递，内部属性变更会影响父组件，违反单向数据流。

**考点2: Vue3 Composition API通信方式**
- `defineProps()`声明props（无需导入）
- `defineEmits()`声明事件（返回emit函数）
- `defineExpose()`暴露给父组件的属性/方法
- 使用mitt库替代EventBus
- provide/inject支持响应式

**考点3: Vuex核心流程**
组件dispatch触发action → action异步操作后commit触发mutation → mutation同步修改state → state变更触发视图更新。严格模式下直接修改state会报错。

**考点4: Provide/Inject响应式实现**
Vue2需传递Vue.observable()包装的对象，Vue3直接传递ref/reactive对象即可响应式。后代组件不应直接修改注入值，应提供修改方法。

**考点5: $attrs使用场景**
用于封装高阶组件时透传未声明的props和事件。Vue3将$listeners合并到$attrs中，通过v-bind="$attrs"一次性透传所有属性和事件。

---

### 经典面试题

#### 技术知识题

**题目1: 解释Vue组件通信的所有方式及适用场景**

**答案**: 
1. **Props/Emit**: 父子组件通信标准方案，Props向下传递，Emit向上通知
2. **Ref**: 父组件直接访问子组件实例，适合调用子组件方法
3. **EventBus**: 任意组件通信，Vue3需mitt库，适合兄弟组件
4. **Provide/Inject**: 祖先向后代注入数据，适合主题、权限等配置
5. **$attrs**: 多层组件属性透传，适合组件库封装
6. **Vuex**: 全局状态管理，适合复杂应用的共享状态
7. **$parent/$root**: 直接访问父/根实例（不推荐，耦合度高）

---

**题目2: Vue3中为什么废弃EventBus，如何替代？**

**答案**: 
Vue3移除$on/$off/$once方法是为了减少API表面积、降低包体积，鼓励使用更明确的通信方式。替代方案：
1. **mitt/tiny-emitter**: 轻量级事件库
2. **Provide/Inject**: 跨层级通信
3. **Vuex/Pinia**: 全局状态管理
4. **Props drilling**: 显式传递（增加可维护性）

---

**题目3: 子组件能否直接修改Props？如何正确处理？**

**答案**: 
**不能直接修改**。Props是单向数据流，子组件修改会导致：
1. 违反单向数据流原则
2. 父组件重新渲染时会覆盖修改
3. 多个子组件修改同一props造成混乱

**正确处理方式**:
```javascript
// 方式1: 本地拷贝(基本类型)
const localValue = ref(props.value)

// 方式2: 计算属性(需要转换)
const displayValue = computed(() => props.value.toUpperCase())

// 方式3: Emit通知父组件修改
const emit = defineEmits(['update:value'])
emit('update:value', newValue)
```

---

**题目4: Vuex中Mutation和Action的区别是什么？**

**答案**:

| 维度 | Mutation | Action |
|------|----------|--------|
| **操作类型** | 同步修改state | 异步操作或复杂逻辑 |
| **调用方式** | commit('mutationName') | dispatch('actionName') |
| **参数** | (state, payload) | (context, payload) |
| **是否可调用异步** | 否，必须同步 | 是，可包含任意异步 |
| **devtools追踪** | 可追踪每次变更 | 不直接追踪 |

**关键**: Mutation是修改state的唯一途径，Action通过commit调用Mutation。

---

**题目5: Provide/Inject如何实现响应式数据传递？**

**答案**:
```javascript
// ✅ 正确 - Vue3传递响应式对象
const count = ref(0)
provide('count', count) // 后代可响应式访问

// ✅ 正确 - 提供修改方法
provide('updateCount', (val) => count.value = val)

// ❌ 错误 - 传递基本类型值
provide('count', count.value) // 后代获得的是静态值

// ✅ 正确 - 使用readonly防止后代修改
import { readonly } from 'vue'
provide('count', readonly(count))
```

---

**题目6: Vue3中如何用Ref访问子组件数据？**

**答案**:
```javascript
/**
 * 父组件访问子组件
 */
// 父组件
const childRef = ref(null)

const callChild = () => {
  // 访问子组件暴露的数据和方法
  console.log(childRef.value.count)
  childRef.value.increment()
}

/**
 * 子组件必须显式暴露
 */
// 子组件
const count = ref(0)
const increment = () => count.value++

// ⚠️ 关键：必须用defineExpose暴露
defineExpose({
  count,
  increment
})
```

---

**题目9: Vuex中为什么不能直接修改state？**

**思路**: 设计原则 + 调试追踪 + 严格模式

**答案**:

**核心原因**:
1. **状态追踪**: devtools需要记录每次state变更，直接修改无法追踪
2. **时间旅行**: 通过mutation记录可以回溯状态
3. **规范性**: 统一修改入口，便于代码维护
4. **调试便利**: 可以打断点、日志记录

**错误示例**:
```javascript
// ❌ 错误：直接修改state
store.state.count++

// ❌ 错误：在组件中修改
const { state } = useStore()
state.count++
```

**正确示例**:
```javascript
// ✅ 正确：通过mutation修改
store.commit('INCREMENT')

// ✅ 正确：异步操作用action
store.dispatch('asyncIncrement')

// mutations
mutations: {
  INCREMENT(state) {
    state.count++  // 唯一可以直接修改的地方
  }
}
```

**严格模式检测**:
```javascript
// 开启严格模式
const store = createStore({
  strict: true,  // 开发环境检测非法修改
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// 直接修改会抛出错误
store.state.count++  // Error: [vuex] do not mutate vuex store state
```

---

**题目10: provide/inject与Vuex如何选择？**

**思路**: 对比维度 + 适用场景

**答案**:

**对比分析**:

| 维度 | provide/inject | Vuex |
|------|----------------|------|
| **作用范围** | 组件树局部 | 全局共享 |
| **使用复杂度** | 简单，无需配置 | 需要配置store |
| **调试工具** | 无devtools支持 | 有完整devtools |
| **状态持久化** | 无内置支持 | 可配合插件持久化 |
| **类型提示** | TypeScript支持一般 | 有完整类型定义 |
| **适用数据量** | 少量配置数据 | 大量复杂状态 |

**选择建议**:

```javascript
/**
 * 使用provide/inject的场景
 */
// 1. 主题配置
const theme = ref('dark')
provide('theme', theme)

// 2. 用户权限
provide('permissions', readonly(permissions))

// 3. 国际化配置
provide('i18n', { locale, t })

/**
 * 使用Vuex的场景
 */
// 1. 用户登录状态(需持久化)
state: {
  user: null,
  token: ''
}

// 2. 购物车(复杂操作)
actions: {
  addToCart({ state, commit }, product) {
    // 复杂业务逻辑
  }
}

// 3. 全局通知(需跨页面)
state: {
  notifications: []
}
```

**混合使用示例**:
```javascript
/**
 * Vuex管理核心状态，provide传递工具方法
 */
// App.vue
<script setup>
import { useStore } from 'vuex'
import { provide, computed } from 'vue'

const store = useStore()

// Vuex管理用户状态
const user = computed(() => store.state.user)

// provide传递权限检查方法
provide('hasPermission', (perm) => {
  return user.value?.permissions?.includes(perm)
})
</script>
```

---

#### 业务逻辑题 (5题)

---

**题目11: 实现一个父组件通过ref调用子组件表单验证**

**思路**: 
1. 子组件封装验证逻辑
2. 使用defineExpose暴露验证方法
3. 父组件ref调用

**答案**:

```javascript
/**
 * 子组件 - UserForm.vue
 * 封装表单验证逻辑
 */
<template>
  <form>
    <input v-model="formData.username" placeholder="用户名" />
    <input v-model="formData.email" placeholder="邮箱" />
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = reactive({
  username: '',
  email: ''
})

const errors = ref([])

/**
 * 表单验证方法
 * @returns {boolean} 是否验证通过
 */
const validate = () => {
  errors.value = []

  // 用户名验证
  if (!formData.username) {
    errors.value.push('用户名不能为空')
  } else if (formData.username.length < 3) {
    errors.value.push('用户名至少3个字符')
  }

  // 邮箱验证
  if (!formData.email) {
    errors.value.push('邮箱不能为空')
  } else if (!/^[\w-]+@[\w-]+\.\w+$/.test(formData.email)) {
    errors.value.push('邮箱格式不正确')
  }

  return errors.value.length === 0
}

/**
 * 重置表单
 */
const reset = () => {
  formData.username = ''
  formData.email = ''
  errors.value = []
}

/**
 * 获取表单数据
 * @returns {Object} 表单数据
 */
const getFormData = () => {
  return { ...formData }
}

// 暴露给父组件的接口
defineExpose({
  validate,
  reset,
  getFormData,
  errors
})
</script>

/**
 * 父组件 - ParentPage.vue
 * 调用子组件验证方法
 */
<template>
  <div>
    <UserForm ref="formRef" />
  
    <!-- 显示错误信息 -->
    <div v-if="formRef?.errors.length" class="errors">
      <p v-for="err in formRef.errors" :key="err">{{ err }}</p>
    </div>
  
    <button @click="handleSubmit">提交</button>
    <button @click="handleReset">重置</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserForm from './UserForm.vue'

const formRef = ref(null)

/**
 * 提交表单
 * 先验证，再获取数据
 */
const handleSubmit = async () => {
  // 调用子组件验证方法
  if (!formRef.value.validate()) {
    console.log('验证失败')
    return
  }

  // 获取表单数据
  const data = formRef.value.getFormData()
  console.log('提交数据:', data)

  // 发送请求
  try {
    await api.submitForm(data)
    alert('提交成功')
    formRef.value.reset()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

/**
 * 重置表单
 */
const handleReset = () => {
  formRef.value.reset()
}
</script>
```

**代码关键点**:
1. 子组件用`defineExpose`显式暴露接口
2. 父组件通过`ref.value`调用子组件方法
3. 验证逻辑封装在子组件，保持单一职责
4. 使用JSDoc注释增强代码可读性

---

**题目12: 用EventBus实现跨组件的全局消息通知系统**

**思路**:
1. 创建事件总线
2. 封装消息管理Store
3. 实现消息组件
4. 自动清理机制

**答案**:

```javascript
/**
 * eventBus.js
 * 创建类型安全的事件总线
 */
import mitt from 'mitt'

// 定义事件类型
export const EVENTS = {
  SHOW_MESSAGE: 'message:show',
  CLEAR_MESSAGE: 'message:clear'
}

export const bus = mitt()

/**
 * useNotification.js
 * 封装消息通知Hook
 */
import { ref, onUnmounted } from 'vue'
import { bus, EVENTS } from './eventBus'

export function useNotification() {
  const messages = ref([])
  let messageId = 0

  /**
   * 显示消息
   * @param {string} text - 消息内容
   * @param {string} type - 消息类型: success/error/warning/info
   * @param {number} duration - 持续时间(ms)
   */
  const showMessage = (text, type = 'info', duration = 3000) => {
    const id = ++messageId
    const message = {
      id,
      text,
      type,
      timestamp: Date.now()
    }
  
    // 添加到消息列表
    messages.value.push(message)
  
    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id)
      }, duration)
    }
  
    return id
  }

  /**
   * 移除消息
   * @param {number} id - 消息ID
   */
  const removeMessage = (id) => {
    const index = messages.value.findIndex(m => m.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  /**
   * 清空所有消息
   */
  const clearAll = () => {
    messages.value = []
  }

  // 监听全局消息事件
  const handleShowMessage = (payload) => {
    showMessage(payload.text, payload.type, payload.duration)
  }

  const handleClearMessage = () => {
    clearAll()
  }

  bus.on(EVENTS.SHOW_MESSAGE, handleShowMessage)
  bus.on(EVENTS.CLEAR_MESSAGE, handleClearMessage)

  // 组件卸载时自动解绑
  onUnmounted(() => {
    bus.off(EVENTS.SHOW_MESSAGE, handleShowMessage)
    bus.off(EVENTS.CLEAR_MESSAGE, handleClearMessage)
  })

  return {
    messages,
    showMessage,
    removeMessage,
    clearAll
  }
}

/**
 * 全局API封装
 */
export const notification = {
  /**
   * 成功消息
   */
  success(text, duration) {
    bus.emit(EVENTS.SHOW_MESSAGE, { text, type: 'success', duration })
  },

  /**
   * 错误消息
   */
  error(text, duration) {
    bus.emit(EVENTS.SHOW_MESSAGE, { text, type: 'error', duration })
  },

  /**
   * 警告消息
   */
  warning(text, duration) {
    bus.emit(EVENTS.SHOW_MESSAGE, { text, type: 'warning', duration })
  },

  /**
   * 信息消息
   */
  info(text, duration) {
    bus.emit(EVENTS.SHOW_MESSAGE, { text, type: 'info', duration })
  },

  /**
   * 清空所有消息
   */
  clear() {
    bus.emit(EVENTS.CLEAR_MESSAGE)
  }
}

/**
 * NotificationContainer.vue
 * 消息展示组件
 */
<template>
  <div class="notification-container">
    <transition-group name="message">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', `message-${msg.type}`]"
        @click="removeMessage(msg.id)"
      >
        {{ msg.text }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotification } from './useNotification'

const { messages, removeMessage } = useNotification()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.message {
  padding: 12px 20px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;
  min-width: 200px;
}

.message-success { background: #67C23A; color: white; }
.message-error { background: #F56C6C; color: white; }
.message-warning { background: #E6A23C; color: white; }
.message-info { background: #909399; color: white; }

.message-enter-active, .message-leave-active {
  transition: all 0.3s;
}

.message-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

/**
 * App.vue
 * 在根组件挂载消息容器
 */
<template>
  <div id="app">
    <NotificationContainer />
    <router-view />
  </div>
</template>

<script setup>
import NotificationContainer from './components/NotificationContainer.vue'
</script>

/**
 * 组件A.vue
 * 任意组件中使用
 */
<template>
  <button @click="showSuccess">显示成功消息</button>
  <button @click="showError">显示错误消息</button>
</template>

<script setup>
import { notification } from './useNotification'

const showSuccess = () => {
  notification.success('操作成功!', 3000)
}

const showError = () => {
  notification.error('操作失败!', 5000)
}
</script>

/**
 * 组件B.vue
 * 另一个组件也可以触发消息
 */
<script setup>
import { notification } from './useNotification'

const handleDelete = async () => {
  try {
    await api.delete()
    notification.success('删除成功')
  } catch (error) {
    notification.error('删除失败: ' + error.message)
  }
}
</script>
```

**代码关键点**:
1. 使用mitt库实现类型安全的事件总线
2. 封装useNotification Hook自动清理事件
3. 提供全局API简化调用
4. 支持自动移除和手动关闭
5. Transition动画增强用户体验

---

**题目13: 使用provide/inject实现主题切换功能**

**思路**:
1. 根组件provide主题状态
2. 子组件inject使用
3. 支持动态切换和持久化

**答案**:

```javascript
/**
 * useTheme.js
 * 主题管理Hook
 */
import { ref, watch, provide, inject, readonly } from 'vue'

const THEME_KEY = Symbol('theme')
const STORAGE_KEY = 'app-theme'

/**
 * 创建主题管理器(在根组件调用)
 */
export function createTheme() {
  // 从localStorage读取保存的主题
  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'light'
  const theme = ref(savedTheme)

  /**
   * 切换主题
   * @param {string} newTheme - 主题名称: light/dark
   */
  const setTheme = (newTheme) => {
    theme.value = newTheme
    // 更新HTML根元素class
    document.documentElement.className = `theme-${newTheme}`
    // 持久化到localStorage
    localStorage.setItem(STORAGE_KEY, newTheme)
  }

  /**
   * 切换主题(light <-> dark)
   */
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // 初始化HTML class
  setTheme(theme.value)

  // 提供给后代组件
  provide(THEME_KEY, {
    theme: readonly(theme),  // 只读,防止后代直接修改
    setTheme,
    toggleTheme
  })

  return {
    theme,
    setTheme,
    toggleTheme
  }
}

/**
 * 使用主题(在子组件调用)
 * @returns {Object} 主题对象
 */
export function useTheme() {
  const themeContext = inject(THEME_KEY)

  if (!themeContext) {
    throw new Error('useTheme must be used within a theme provider')
  }

  return themeContext
}

/**
 * App.vue
 * 根组件创建主题
 */
<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import { createTheme } from './useTheme'
import Header from './components/Header.vue'

// 创建并提供主题
const { theme } = createTheme()

console.log('当前主题:', theme.value)
</script>

<style>
/* 定义主题变量 */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
}

.theme-dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #404040;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
</style>

/**
 * Header.vue
 * 使用主题的子组件
 */
<template>
  <header :class="['header', `header-${theme}`]">
    <h1>我的应用</h1>
  
    <!-- 主题切换按钮 -->
    <button @click="toggleTheme" class="theme-btn">
      <span v-if="theme === 'light'">🌙 暗色模式</span>
      <span v-else>☀️ 亮色模式</span>
    </button>
  
    <!-- 显示当前主题 -->
    <span class="theme-label">
      当前: {{ theme === 'light' ? '亮色' : '暗色' }}
    </span>
  </header>
</template>

<script setup>
import { useTheme } from '../useTheme'

// 注入主题
const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.theme-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.theme-btn:hover {
  opacity: 0.8;
}
</style>

/**
 * UserProfile.vue
 * 深层子组件也可以使用主题
 */
<template>
  <div :class="['profile', `profile-${theme}`]">
    <img :src="avatar" alt="avatar" />
    <div class="info">
      <h3>{{ username }}</h3>
      <p>{{ email }}</p>
    </div>
  
    <!-- 显示主题相关的样式 -->
    <div class="theme-demo">
      <p>当前主题样式演示</p>
      <div class="color-box" :style="{ background: themeColor }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../useTheme'

const { theme } = useTheme()

// 根据主题计算颜色
const themeColor = computed(() => {
  return theme.value === 'light' ? '#409EFF' : '#67C23A'
})

const username = 'John Doe'
const email = 'john@example.com'
const avatar = '/avatar.jpg'
</script>

<style scoped>
.profile {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.theme-demo {
  margin-top: 1rem;
}

.color-box {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  margin-top: 0.5rem;
}
</style>

/**
 * Settings.vue
 * 另一个组件使用主题切换
 */
<template>
  <div class="settings">
    <h2>设置</h2>
  
    <!-- 主题选择器 -->
    <div class="setting-item">
      <label>主题模式</label>
      <select :value="theme" @change="handleThemeChange">
        <option value="light">亮色模式</option>
        <option value="dark">暗色模式</option>
      </select>
    </div>
  
    <!-- 显示主题信息 -->
    <div class="theme-info">
      <p>当前主题: {{ theme }}</p>
      <p>背景色: {{ getCSSVariable('--bg-color') }}</p>
      <p>文字色: {{ getCSSVariable('--text-color') }}</p>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../useTheme'

const { theme, setTheme } = useTheme()

/**
 * 处理主题切换
 */
const handleThemeChange = (e) => {
  setTheme(e.target.value)
}

/**
 * 获取CSS变量值
 */
const getCSSVariable = (name) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}
</script>
```

**代码关键点**:
1. 使用Symbol作为provide/inject的key避免冲突
2. provide只读的theme防止后代组件直接修改
3. localStorage持久化主题设置
4. CSS变量实现主题样式切换
5. 所有子组件都可以inject使用主题

---

