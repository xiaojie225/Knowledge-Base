# Vue.js 核心知识体系

---

### 1. 核心概念理解

#### Vue.js 的本质定位

**Vue.js 是一个渐进式 JavaScript 框架，专注于视图层，通过数据驱动和组件化系统简化现代 Web 应用开发。**

它解决了三个核心问题：
1.  **视图层开发**：从命令式 DOM 操作到**声明式渲染**。
2.  **代码组织**：从分散的代码到**高内聚的组件化**架构。
3.  **状态与UI同步**：从手动更新到**自动响应式更新**。

```javascript

// ❌ 传统 jQuery 方式（命令式）
$('#message').text('Hello');
$('#input').on('input', function() {
  $('#message').text($(this).val());
});

// ✅ Vue 方式（声明式） 数据变化自动更新视图
const message = ref('Hello');
// 模板中：<h1>{{ message }}</h1>
```

---

### 2. 核心特性深度解析

#### 2.1 数据驱动（MVVM 模式）

**Vue 3 基于 Proxy 的响应式原理流程：**

```vue
<template>
  <!-- View 层：视图 -->
  <div class="user-profile">
    <h1>{{ user.name }}</h1>
    <p>Age: {{ user.age }}</p>
    <input v-model="user.name" placeholder="Edit name">
    <button @click="incrementAge">Birthday</button>

    <!-- Vue 3 可以动态添加属性并保持响应式 -->
    <p v-if="user.isAdmin">Admin Badge 🎖️</p>
    <button @click="toggleAdmin">Toggle Admin</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

/**
 * ViewModel 层：Vue 的响应式系统
 * 
 * Vue 3 使用 Proxy 实现响应式
 * 优势：
 * 1. 性能更好：代理整个对象而非每个属性
 * 2. 功能更强：可监听属性添加/删除、数组索引变化
 * 3. 无需 $set/$delete 等 API
 */

// Model 层：数据模型
const user = reactive({
  name: 'Alice',
  age: 25
});

/**
 * 响应式原理流程
 * 
 * 1. 初始化阶段：
 *    reactive() 将 user 对象包装成 Proxy
 * 
 * 2. 依赖收集（Track）：
 *    当模板读取 user.name 时
 *    → Proxy 拦截 get 操作
 *    → 记录"这个视图依赖 user.name"
 * 
 * 3. 派发更新（Trigger）：
 *    当执行 user.name = 'Bob' 时
 *    → Proxy 拦截 set 操作
 *    → 通知所有依赖 user.name 的视图更新
 * 
 * 4. 重新渲染：
 *    → 生成新的虚拟 DOM（VNode）
 *    → Diff 算法对比新旧 VNode
 *    → 只更新变化的真实 DOM 节点
 */

function incrementAge() {
  user.age++; // 触发响应式更新
}

function toggleAdmin() {
  // Vue 3 支持动态添加属性并保持响应式
  user.isAdmin = !user.isAdmin;
}

<style scoped>
/**
 * scoped 样式隔离原理
 * 编译后会添加唯一属性选择器
 * 例如：.user-profile[data-v-f3f3eg9]
 */
</style>
```


#### 2.3 指令与修饰符

指令是特殊的 HTML 属性，用于将响应式行为应用于 DOM。

**常用指令完整示例：**


```vue
<template>
  
    <!-- v-if/v-else-if/v-else: 条件渲染 -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      <h2>Admin Dashboard</h2>
      <!-- DOM 节点完全不存在 -->
    </div>
    <div v-else-if="userRole === 'user'" class="user-panel">
      <h2>User Dashboard</h2>
    </div>
    <div v-else>
      <h2>Guest View</h2>
    </div>

    <!-- v-show: CSS 显示切换 -->
    <div v-show="isLoading" class="loading">
      Loading... <!-- display: none 隐藏 -->
    </div>

    <!-- v-for: 列表渲染 -->
    <ul>
      <!--key 的重要性：
        1. 帮助 Vue 追踪节点身份
        2. 高效复用和重新排序 DOM
        3. 避免就地复用导致的状态错误
      -->
      <li 
        v-for="(item, index) in items" 
        :key="item.id"
        :class="{ active: item.id === activeId }"
      >
        {{ index + 1 }}. {{ item.name }}
      </li>
    </ul>

    <!-- v-bind (简写 :): 动态绑定属性 -->
    <img 
      :src="imageUrl" 
      :alt="imageAlt"
      :class="imageClasses"
      :style="imageStyles"
    >

    <!-- class 绑定的多种写法 -->
    <div 
      :class="['base-class', { active: isActive, disabled: isDisabled }]"
      :style="{ color: textColor, fontSize: fontSize + 'px' }"
    >
      Styled Element
    </div>

    <!-- v-on (简写 @): 事件监听 -->
    <button @click="handleClick">Click</button>
    <button @click.stop="handleClick">Stop Propagation</button>

    <input 
      @keyup.enter="handleEnter"
      @keyup.esc="handleEsc"
      @input="handleInput"
    >

    <!-- v-model: 双向绑定 -->
    <input v-model="username" placeholder="Username">
    <textarea v-model="bio" rows="3"></textarea>
    <input type="checkbox" v-model="agreed">
    <select v-model="selectedOption">
      <option value="A">Option A</option>
      <option value="B">Option B</option>
    </select>

    <!--
      v-model 原理（语法糖）
      <input v-model="text">
      等价于
      <input 
        :value="text" 
        @input="text = $event.target.value"
      >
    -->

    <!-- v-model 修饰符 -->
    <input v-model.trim="username">      <!-- 自动去除首尾空格 -->
    <input v-model.number="age">         <!-- 自动转换为数字 -->
    <input v-model.lazy="description">   <!-- change 事件触发而非 input -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const userRole = ref('admin');
const isLoading = ref(false);
const activeId = ref(2);

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]);

// 动态属性
const imageUrl = ref('/path/to/image.jpg');
const imageAlt = ref('Description');
const isActive = ref(true);
const isDisabled = ref(false);
const imageSize = ref('medium');

// 动态 class 和 style
const imageClasses = computed(() => ({
  'img-responsive': true,
  'img-large': imageSize.value === 'large'
}));

const imageStyles = computed(() => ({
  borderRadius: '8px',
  maxWidth: '300px'
}));

// 表单数据
const username = ref('');
const bio = ref('');
const agreed = ref(false);
const selectedOption = ref('A');
const age = ref(0);
const description = ref('');
const textColor = ref('black');
const fontSize = ref(16);

// 事件处理
function handleClick(event) {
  console.log('Clicked', event);
}

function handleInput(event) {
  console.log('Input:', event.target.value);
}

</script>
```

---
#### 修饰符详解

```javascript
// 事件修饰符
@事件名.修饰符="处理函数"

// 表单修饰符
v-model.修饰符="数据"

// 修饰符可链式调用
@click.stop.prevent="handler"
```

```vue
<template>
  <!-- 表单修饰符示例 -->
  <input v-model.lazy="username" />

  <!-- 事件修饰符示例 -->
  <button @click.stop="innerClick">点我</button>

  <!-- 阻止链接跳转 -->
  <a href="https://example.com" @click.prevent="handleClick">
    自定义跳转
  </a>

  <!-- 阻止表单提交 -->
  <form @submit.prevent="customSubmit">
    <button type="submit">提交</button>
  </form>

  <!-- 新手引导只显示一次 -->
  <div @mouseenter.once="showTip">
    首次悬停显示提示
  </div>

  <!-- capture - 捕获阶段触发 在事件捕获阶段(从外到内)触发-->
  <div @click.capture="level1">
    Level 1
    <div @click.capture="level2">
      Level 2
      <div @click="level3">
        Level 3 (点我)
      </div>
    </div>
  </div>

  <!-- 键盘组合键 -->
  <input @keyup.ctrl.s="save" placeholder="Ctrl+S保存" />
  <input @keyup.alt.enter="quickSubmit" placeholder="Alt+Enter快速提交" />

  <!-- 原则: 修饰符按从左到右的顺序执行 -->
  <!-- 先阻止默认,再检查是否自身触发 -->
  <div @click.prevent.self="handler1">
    场景1: 所有点击都阻止默认,但只有点击自身才执行
  </div>

  <!-- 先检查是否自身,再阻止默认 -->
  <div @click.self.prevent="handler2">
    场景2: 只有点击自身时才阻止默认并执行
  </div>

  <!-- 阻止冒泡且阻止默认 -->
  <a href="#" @click.stop.prevent="handler3">
    阻止跳转且不触发父元素
  </a>
</template>

<script setup>
// 点击Level 3时,输出顺序: L1 -> L2 -> L3
const level1 = () => console.log('L1 (捕获)')
const level2 = () => console.log('L2 (捕获)')
const level3 = () => console.log('L3 (冒泡)')
</script>
```

**修饰符速查表：**

| 类型 | 修饰符 | 作用 | 使用场景 |
| :--- | :--- | :--- | :--- |
| 表单 | `.lazy` | 失焦/回车时触发更新 | 搜索框、实时计算成本较高场景 |
| 表单 | `.trim` | 去空格 | 用户名、邮箱 |
| 表单 | `.number` | 转数字 | 年龄、价格 |
| 事件 | `.stop` | 阻止冒泡 | 嵌套点击区域，模态框内的按钮 |
| 事件 | `.prevent` | 阻止默认 | 表单、链接 |
| 事件 | `.self` | 仅自身 | 模态框遮罩 |
| 事件 | `.once` | 触发一次 | 优惠券领取 |
| 事件 | `.capture` | 捕获阶段 | 事件拦截 |
| 事件 | `.passive` | 不会调用`preventDefault()`,优化滚动性能 | 滚动事件 |
| 鼠标 | `.left/.right/.middle` | 鼠标按键 | 右键菜单 |
| 键盘 | `.enter/.esc/.delete` | 按键别名 | 快捷键 |
| 键盘 | `.ctrl/.alt/.shift` | 组合键 | Ctrl+S保存 |

**常用键盘别名**:
- `.enter` - 回车键
- `.tab` - Tab键
- `.delete` - 删除键(Delete和Backspace)
- `.esc` - Esc键
- `.space` - 空格键
- `.up/.down/.left/.right` - 方向键
- `.ctrl/.alt/.shift/.meta` - 修饰键

#### 2.4 组件 vs 插件

| 维度 | 组件 | 插件 |
| :--- | :--- | :--- |
| 编写形式 | .vue单文件或JS对象 | 包含install方法的JS对象 |
| 注册方式 | `app.component()`或`components`选项 | `app.use()` |
| 使用目标 | 构建应用业务模块 | 增强Vue框架功能 |
| 作用范围 | 页面UI构建 | 全局功能扩展 |
| 关系 | 插件可提供全局组件 | 插件可增强组件功能 |

```javascript
// ========== 组件 ==========
// 局部注册
import MyComponent from './components/MyComponent.vue'

// 全局注册后,任何组件都可以直接使用<MyComponent/>
app.component('MyComponent', MyComponent)
```

```vue
<!-- 父组件使用 -->
<template>
  <div>
    <MyComponent 
      title="我的标题" 
      message="这是消息" 
      @button-click="handleClick"
    />
  </div>
</template>

<script setup>
import MyComponent from './components/MyComponent.vue'
</script>
```

```javascript
// ========== 插件 ==========
import MyPlugin from './plugins/my-plugin'

// 注册插件,传入配置
app.use(MyPlugin, { 
  apiUrl: 'https://api.example.com',
  timeout: 5000
})
```

```vue
<!-- 组件中使用插件功能 -->
<template>
  <div>
    <!-- 使用插件注册的全局组件 -->
    <PluginComponent />

    <!-- 使用插件注册的指令 -->
    <p v-my-directive="'blue'">蓝色文字</p>

    <!-- 调用插件方法 -->
    <button @click="callPluginMethod">调用插件方法</button>
  </div>
</template>

<script setup>
import { getCurrentInstance, inject } from 'vue'

// 方式1: 通过getCurrentInstance访问全局属性
const instance = getCurrentInstance()

const callPluginMethod = () => {
  instance.proxy.$myMethod('Hello from component!')
}

// 方式2: 通过inject获取插件提供的状态
const pluginState = inject('pluginState')
console.log('插件配置:', pluginState)
</script>
```

---

### 3. Vue 3 Composition API 详解

#### 3.1 核心概念与优势

**Composition API定义**
Vue 3引入的组件逻辑组织方式，通过将相关逻辑代码集中在函数中，替代Options API中分散在不同选项中的代码组织。

**核心优势对比**

| 维度 | Options API | Composition API |
| :--- | :--- | :--- |
| 代码组织 | 按选项分散(data/methods/computed分离) | 按逻辑聚合(相关代码集中) |
| 逻辑复用 | mixins(数据来源混乱、命名冲突) | Composable函数(清晰、无冲突) |
| this指向 | 组件实例(复杂且易出错) | 无需this(函数式编程) |
| TypeScript支持 | 复杂的类型推断 | 天然类型友好 |

#### 3.2 响应式系统：ref 与 reactive

```javascript
/**
 * ref - 用于基本类型和对象的通用响应式包装
 * 特点: 需要.value访问，可用于任何类型
 */
import { ref } from 'vue'

const count = ref(0)           // 基本类型
const user = ref({ name: '' }) // 对象
const arr = ref([1, 2, 3])     // 数组

// 访问需要.value
count.value++
user.value.name = 'Alice'

/**
 * reactive - 用于对象/数组的深度响应式转换
 * 特点: 直接访问属性(无.value)，仅适用于对象
 */
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: { name: 'Alice' }
})

// 直接访问，无需.value
state.count++
state.user.name = 'Bob'

/**
 * 选择指南
 */
// ✅ 基本类型必用ref
const isLoading = ref(false)
const message = ref('')

// ✅ 对象推荐用reactive
const form = reactive({ username: '', password: '' })

// ✅ ref也能包装对象,但访问需.value
const userInfo = ref({ age: 25 })
userInfo.value.age = 26
```

### Props解构响应性

```javascript
/**
 * ❌ 错误 - 直接解构失去响应性
 * 当父组件更新prop时,组件内部变量不会更新
 */
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['message'],
  setup(props) {
    const { message } = props // message是字符串副本,非响应式
    return { message }
  }
})

/**
 * ✅ 正确 - 使用toRefs保持响应性
 */
import { toRefs, toRef } from 'vue'

export default defineComponent({
  props: ['message'],
  setup(props) {
    // 方案1: 转换整个props对象
    const { message } = toRefs(props)

    // 方案2: 转换单个prop
    // const message = toRef(props, 'message')

    return { message }
  }
})
```

#### 3.3 核心 API 详解

### 1. ref和reactive

```javascript
/**
 * ref完整用法
 */
import { ref, isRef, unref } from 'vue'

const count = ref(0)

// 检查是否为ref
if (isRef(count)) {
  console.log('这是一个ref')
}

// 自动解包(仅在模板中)
// 模板: {{ count }} 自动变成 {{ count.value }}

// 手动解包
const value = unref(count) // 如果是ref返回.value,否则返回原值

/**
 * reactive完整用法
 */
import { reactive, isReactive, isProxy } from 'vue'

const state = reactive({
  count: 0,
  nested: { deep: { value: 'test' } }
})

// 深度追踪
state.nested.deep.value = 'changed' // 被追踪

// 检查
console.log(isReactive(state)) // true
console.log(isProxy(state))    // true
```

### 2. computed

```javascript
/**
 * 计算属性 - 缓存特性
 */
import { ref, computed } from 'vue'

const count = ref(0)

// 只读计算属性
const double = computed(() => {
  console.log('计算执行')
  return count.value * 2
})

count.value = 1 // 第一次读取double时打印"计算执行"
console.log(double.value) // 2

count.value = 1 // 值未变,再次读取不执行计算,直接返回缓存
console.log(double.value) // 2 (未打印"计算执行")

// 可写计算属性
const firstName = ref('')
const lastName = ref('')
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

fullName.value = 'John Doe' // 自动更新firstName和lastName
```

### 3. watch

```javascript
/**
 * 基础watch - 监听单个源
 */
import { ref, reactive, watch } from 'vue'

const count = ref(0)
const name = ref('')

// 监听单个ref
watch(count, (newValue, oldValue) => {
  console.log(`count从${oldValue}变为${newValue}`)
})

// 监听多个源(数组)
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('count或name改变了')
})

// 监听对象(需要deep选项)
const state = reactive({ nested: { value: 0 } })
watch(state, (newState) => {
  console.log('state改变了')
}, { deep: true })

/**
 * watchEffect - 自动追踪依赖
 */
import { watchEffect } from 'vue'

const count2 = ref(0)
const name2 = ref('')

watchEffect(() => {
  // 自动追踪count和name
  console.log(`${name2.value}: ${count2.value}`)
})

/**
 * watch vs watchEffect
 */
// watch: 明确指定依赖,可访问新旧值
watch(count, (newVal, oldVal) => {
  if (newVal > 0) console.log('count增加了')
})

// watchEffect: 自动追踪,无旧值,用于副作用
watchEffect(() => {
  if (count.value > 0) console.log('count大于0')
})
```


#### 3.4 Composable 逻辑复用模式

### 基础结构

```javascript
/**
 * 标准Composable函数命名规范
 * 文件: composables/useXxx.js
 * 导出: export function useXxx() { ... }
 */

import { ref, onMounted, onUnmounted } from 'vue'

export function useCounter(initialValue = 0) {
  // 1. 状态定义
  const count = ref(initialValue)

  // 2. 方法定义
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  // 3. 生命周期处理
  onMounted(() => {
    console.log('Counter已初始化')
  })

  onUnmounted(() => {
    console.log('Counter已销毁')
  })

  // 4. 返回暴露的接口
  return {
    count,      // 状态
    increment,  // 方法
    decrement,
    reset
  }
}

/**
 * 组件中使用
 */
import { useCounter } from './composables/useCounter'

export default {
  setup() {
    const { count, increment } = useCounter(0)
    return { count, increment }
  }
}
```

#### 3.5 `<script setup>` 语法糖

```vue
<script setup>
/**
 * script setup是setup()函数的编译时语法糖
 * 优势: 更简洁,自动暴露顶层变量和导入,支持generics
 */

// ❌ setup()函数方式
export default {
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    return { count, increment }
  }
}

// ✅ script setup方式
import { ref } from 'vue'

// 自动暴露,无需手动return
const count = ref(0)
const increment = () => count.value++
</script>

<script setup>
/**
 * script setup特殊API
 */
import { defineProps, defineEmits, defineExpose } from 'vue'

// 定义props
const props = defineProps({
  message: String,
  count: Number
})

// 定义emits
const emit = defineEmits(['update', 'delete'])

const handleClick = () => {
  emit('update', newValue)
}

// 向父组件暴露方法/属性(ref语法)
defineExpose({
  refresh: () => { /* ... */ }
})
</script>
```

#### 3.6 全局状态管理

```javascript
/**
 * 简单全局状态 - 模块级单例
 */
// stores/useTheme.js
import { ref } from 'vue'

// 在模块作用域定义,保证唯一性
const theme = ref('light')

export function useTheme() {
  const toggle = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggle }
}

// 任何组件调用都得到同一个theme实例
const { theme: theme1 } = useTheme()
const { theme: theme2 } = useTheme()
// theme1和theme2指向同一个ref

/**
 * provide/inject - 跨层级共享
 */
// App.vue (根组件)
<script setup>
import { ref, provide } from 'vue'

const user = ref({ name: 'Alice' })
const updateUser = (newUser) => {
  user.value = newUser
}

provide('user', {
  user,
  updateUser
})
</script>

// DeepChild.vue (深层子组件)
<script setup>
import { inject } from 'vue'

const { user, updateUser } = inject('user')
</script>
```


#### 3.8 快速对比总结

### Options API vs Composition API代码示例

```javascript
/**
 * 同一功能的两种实现方式
 * 功能: 获取用户列表,支持搜索和排序
 */

/**
 * Options API
 */
export default {
  data() {
    return {
      users: [],
      loading: true,
      searchQuery: '',
      sortBy: 'name'
    }
  },

  computed: {
    filteredUsers() {
      
    }
  },

  methods: {
    async fetchUsers() {
      this.loading = true
      this.users = await api.getUsers()
      this.loading = false
    },

    updateSearchQuery(q) {
      this.searchQuery = q
    }
  },

  mounted() {
    this.fetchUsers()
  }
}

/**
 * Composition API - 按逻辑组织
 */
// composables/useUsers.js
export function useUsers() {
  const users = ref([])
  const loading = ref(true)

  const fetchUsers = async () => {
    loading.value = true
    users.value = await api.getUsers()
    loading.value = false
  }

  onMounted(fetchUsers)
  return { users, loading, fetchUsers }
}

// composables/useSearch.js
export function useSearch(items) {
  const searchQuery = ref('')

  const filtered = computed(() => {
    
  })

  return { searchQuery, filtered }
}

// Component.vue
<script setup>
import { useUsers } from './composables/useUsers'
import { useSearch } from './composables/useSearch'

const { users, loading } = useUsers()
const { searchQuery, filtered } = useSearch(users)
const sortBy = ref('name')

const sorted = computed(() => {
  return [...filtered.value].sort((a, b) => 
    a[sortBy.value] > b[sortBy.value] ? 1 : -1
  )
})
</script>
```

---

### 4. 组件深入

#### 4.1 组件通信全方案

| 通信方式 | 数据流向 | 核心机制 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **Props** | 父 -> 子 | 属性传递，单向数据流 | 父组件向子组件传递配置和数据 |
| **Emits** | 子 -> 父 | 事件回调 | 子组件通知父组件状态变化 |
| **Ref** | 父 -> 子（直接调用） | `defineExpose` + `ref` | 父组件需直接操作子组件方法 |
| **EventBus** | 任意组件 | 发布/订阅 (推荐 `mitt`) | 兄弟或远亲组件间的简单通信 |
| **`provide/inject`** | 祖先 -> 后代 | 依赖注入 | 跨多层级传递上下文（如主题） |
| **Vuex/Pinia** | 任意组件 | 集中式状态管理 | 中大型应用全局共享数据 |
| **`$attrs`** | 父 -> 深层次子 | 透传未声明的 Props 和事件 | 高阶组件封装，避免逐层传递 |

---

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
```vue
<!-- 父组件 Father.vue -->
<Child :message="message" @update="handleUpdate" />

<!-- 中间组件透传 -->
<DeepChild v-bind="$attrs" />

<script setup>
// 孙组件接收
import { useAttrs } from 'vue'
const attrs = useAttrs() // 包含props和事件
console.log(attrs) // { message: "来自父组件的消息", onUpdate: f }
</script>
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

### 技术选型决策树

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

### Vue2 vs Vue3 核心差异

| 特性 | Vue2 | Vue3 |
| :--- | :--- | :--- |
| Props声明 | props选项 | defineProps() |
| Emit触发 | this.$emit() | defineEmits() |
| Ref暴露 | 自动暴露 | defineExpose() |
| EventBus | new Vue() | mitt库 |
| Provide/Inject | 选项式 | Composition API |
| $attrs | 仅属性 | 属性+事件合并 |

#### 4.2 插槽（Slots）

**核心概念**

**插槽 (Slot) 是什么?**
- **本质**: Vue 的内容分发机制,允许父组件向子组件指定位置传递 UI 片段
- **核心思想**: 占位与填充
  - 子组件用 `<slot>` 定义"坑"(占位符)
  - 父组件填充内容到这些"坑"里
- **价值**: 实现组件结构与内容的解耦,提升复用性和灵活性

### 三种插槽类型

#### 1. 默认插槽 (Default Slot)
最基础的插槽,子组件只有一个匿名 `<slot>`

```html
<!-- 子组件 MyBox.vue -->
<template>
  <div class="box">
    <slot>默认后备内容</slot>
  </div>
</template>

<!-- 父组件使用 -->
<MyBox>
  <p>这段内容会替换掉 slot</p>
</MyBox>
```

**使用场景**: 组件只需一个内容出口时

#### 2. 具名插槽 (Named Slots)
通过 `name` 属性区分多个插槽位置

```html
<!-- 子组件 PageLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot name="content"></slot>
    </main>
    <footer>
      <slot name="footer">默认页脚</slot>
    </footer>
  </div>
</template>

<!-- 父组件使用 -->
<PageLayout>
  <template #header>
    <h1>页面标题</h1>
  </template>

  <template #content>
    <p>主体内容</p>
  </template>

  <!-- footer 使用默认内容,不填充 -->
</PageLayout>
```

**语法简写**: `v-slot:header` → `#header`

**使用场景**: 
- 布局组件 (header/sidebar/main/footer)
- 弹窗/卡片组件 (title/body/actions)

#### 3. 作用域插槽 (Scoped Slots)
子组件向父组件传递数据,父组件基于这些数据定义渲染内容

```html
<!-- 子组件 UserList.vue -->
<template>
  <ul>
    <li v-for="(user, index) in users" :key="user.id">
      <!-- 通过 v-bind 暴露数据给父组件 -->
      <slot :user="user" :index="index">
        <span>{{ user.name }}</span>
      </slot>
    </li>
  </ul>
</template>

<script setup>
/**
 * 用户列表组件
 * @param {Array} users - 用户数据数组
 */
defineProps({
  users: Array
});
</script>

<!-- 父组件使用 -->
<UserList :users="userList">
  <!-- 方式1: 完整语法 -->
  <template #default="slotProps">
    <strong>{{ slotProps.index + 1 }}.</strong>
    <span>{{ slotProps.user.name }}</span>
    <el-tag>{{ slotProps.user.role }}</el-tag>
  </template>

  <!-- 方式2: 解构语法(推荐) -->
  <template #default="{ user, index }">
    <strong>{{ index + 1 }}.</strong>
    <span>{{ user.name }}</span>
    <el-tag>{{ user.role }}</el-tag>
  </template>
</UserList>
```

**使用场景**:
- 数据表格 (自定义列渲染)
- 列表组件 (自定义项渲染)
- 下拉选择 (自定义选项样式)

### 关键知识点

**1. 编译作用域**
- 插槽内容在**父组件作用域**中编译
- 可访问父组件数据,无法直接访问子组件数据
- 作用域插槽通过"函数回调"模式实现数据传递

**2. 后备内容 (Fallback Content)**
```html
<slot>当父组件不提供内容时显示我</slot>
```

**3. Vue 3 统一语法**
- 使用 `v-slot` 指令统一具名插槽和作用域插槽
- 简写: `v-slot:name` → `#name`
- 默认插槽: `v-slot:default` → `#default`

**4. 动态插槽名**
```html
<template v-slot:[dynamicSlotName]>
  内容
</template>
```


### 动态组件 & `<keep-alive>`

`<component>` 是 Vue 的内置"元组件"，用于动态渲染不同的组件或 HTML 标签。

*   **核心属性 `:is`**：这是最重要的属性。它决定了最终渲染成什么。
    *   **传字符串**：可以是原生的 HTML 标签（如 `'div'`, `'a'`, `'button'`）或已注册的组件名。
    *   **传组件对象**：可以直接传入导入的 Vue 组件实例。
*   **渲染逻辑**：当 `:is` 的值改变时，Vue 会卸载旧组件并挂载新组件。

---

根据 `to` 属性的值，自动决定是渲染成普通的超链接 `<a>` 还是 Vue Router 的 `<router-link>`。

#### A. 动态标签切换 (`:is`)
```javascript
const type = computed(() => {
  if (isExt.value) {
    return 'a'           // 外部链接渲染为原生 a 标签
  }
  return 'router-link'   // 内部链接渲染为路由组件
})
```
这里利用 `computed` 计算属性动态返回标签名，实现了一套代码兼容两种跳转方式。

#### B. 动态属性绑定 (`v-bind`)
```html
<component :is="type" v-bind="linkProps()">
```
这是 `<component>` 的高阶用法。因为 `<a>` 标签需要 `href`，而 `<router-link>` 需要 `to`，通过 `v-bind="函数()"` 可以一次性注入一个包含多个属性的对象：
*   如果是外部链接，返回 `{ href: '...', target: '_blank' }`。
*   如果是内部链接，返回 `{ to: '...' }`。
*   **知识点**：`v-bind` 绑定一个对象时，会将对象的所有属性展开并作为 props 传给组件。

#### C. 插槽传递 (`<slot />`)
```html
<component ...>
  <slot />
</component>
```
无论最终渲染成什么，组件内部包裹的内容（如文字、图标）都会通过 `<slot />` 填充到对应的标签中。

---

### `<component>` 的高级知识点

| 特性 | 说明 |
| :--- | :--- |
| **搭配 `<keep-alive>`** | 如果在多个大型组件间切换，可以用 `<keep-alive>` 包裹 `<component>` 以缓存组件状态，避免重复渲染。 |
| **过渡动画 `<transition>`** | 可以用 `<transition>` 包裹动态组件，实现组件切换时的淡入淡出等动画效果。 |
| **处理异步组件** | `:is` 也可以接收一个异步加载的组件（`defineAsyncComponent`）。 |
| **生命周期** | 切换时，旧组件会触发 `unmounted`，新组件触发 `mounted`。 |

---
### Keep-Alive
#### 一、核心概念

**什么是 Keep-Alive**
- Vue 内置的抽象组件,用于缓存非活动组件实例
- 不渲染为真实 DOM,不出现在父子关系链中
- 主要用途:性能优化 + 保留用户状态

**核心配置属性**
```javascript
// include: 缓存白名单(匹配组件name)
// exclude: 缓存黑名单
// max: 最大缓存数量(LRU策略淘汰)
<keep-alive :include="['CompA', 'CompB']" :max="10">
  <component :is="currentComp" />
</keep-alive>
```

**特殊生命周期钩子**
```javascript
// activated: 组件激活时触发(首次挂载+从缓存恢复)
// deactivated: 组件失活时触发(移入缓存)
onActivated(() => {
  console.log('组件被激活');
  fetchData(); // 更新数据
});

onDeactivated(() => {
  console.log('组件失活');
  clearTimer(); // 清理副作用
});
```

### 过渡动画 `<Transition>`

`<Transition>` 是一个内置组件，这意味着它在任意别的组件中都可以被使用，无需注册。它可以将进入和离开动画应用到通过默认插槽传递给它的元素或组件上。进入或离开可以由以下的条件之一触发：

- 由 `v-if` 所触发的切换
- 由 `v-show` 所触发的切换
- 由特殊元素 `<component>` 切换的动态组件
- 改变特殊的 `key` 属性

以下是最基本用法的示例：

```vue
<button @click="show = !show">Toggle</button>
<Transition name="fade">
  <p v-if="show">hello</p>
</Transition>
```

```css
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
/* 加了name="fade"*/
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.5s ease; 
} 
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
```

**过渡 class 说明**:

1. `v-enter-from`：进入动画的起始状态。在元素插入之前添加，在元素插入完成后的下一帧移除。
2. `v-enter-active`：进入动画的生效状态。应用于整个进入动画阶段。在元素被插入之前添加，在过渡或动画完成之后移除。这个 class 可以被用来定义进入动画的持续时间、延迟与速度曲线类型。
3. `v-enter-to`：进入动画的结束状态。在元素插入完成后的下一帧被添加 (也就是 `v-enter-from` 被移除的同时)，在过渡或动画完成之后移除。
4. `v-leave-from`：离开动画的起始状态。在离开过渡效果被触发时立即添加，在一帧后被移除。
5. `v-leave-active`：离开动画的生效状态。应用于整个离开动画阶段。在离开过渡效果被触发时立即添加，在过渡或动画完成之后移除。这个 class 可以被用来定义离开动画的持续时间、延迟与速度曲线类型。
6. `v-leave-to`：离开动画的结束状态。在一个离开动画被触发后的下一帧被添加 (也就是 `v-leave-from` 被移除的同时)，在过渡或动画完成之后移除。

---

### 生命周期钩子

Vue 组件实例从创建到销毁的完整过程，在不同阶段暴露钩子函数。

| 阶段       | Options API                   | Composition API                   | 核心要点                            |
| :------- | :---------------------------- | :-------------------------------- | :------------------------------ |
| **初始化**  | `beforeCreate` / `created`    | `setup()`                         | `setup()` 本身即为逻辑入口，无 `this`。    |
| **挂载**   | `beforeMount` / `mounted`     | `onBeforeMount` / `onMounted`     | **`onMounted` 后可安全访问 DOM**。     |
| **更新**   | `beforeUpdate` / `updated`    | `onBeforeUpdate` / `onUpdated`    | 数据变化导致重绘时调用，避免在 `updated` 中改数据。 |
| **卸载**   | `beforeUnmount` / `unmounted` | `onBeforeUnmount` / `onUnmounted` | **清理定时器、事件监听等副作用的黄金时机**。        |
| **缓存激活** | `activated` / `deactivated`   | `onActivated` / `onDeactivated`   | 配合 `<keep-alive>` 使用，用于恢复/暂停任务。 |
| **错误捕获** | `errorCaptured`               | `onErrorCaptured`                 | 捕获所有子孙组件的错误并处理。                 |

**父子组件生命周期执行顺序示例**：

```javascript
/**
 * 父子组件生命周期执行顺序
 * 
 * === 挂载阶段 ===
 * 1. 父 setup/beforeCreate/created
 * 2. 父 beforeMount
 * 3. 子 setup/beforeCreate/created
 * 4. 子 beforeMount
 * 5. 子 mounted ← 子组件先挂载
 * 6. 父 mounted ← 父组件后挂载
 * 
 * === 更新阶段 (父数据变化影响子组件) ===
 * 1. 父 beforeUpdate
 * 2. 子 beforeUpdate
 * 3. 子 updated
 * 4. 父 updated
 * 
 * === 卸载阶段 ===
 * 1. 父 beforeUnmount
 * 2. 子 beforeUnmount
 * 3. 子 unmounted
 * 4. 父 unmounted
 */
```

---

### 6. 核心工具：`nextTick`

#### 6.2 nextTick

**一句话定义**：`nextTick` 在 Vue 完成 DOM 更新后立即执行回调函数，确保能访问到最新的 DOM 状态。

**为什么需要 nextTick**

**异步更新机制**：
- Vue 不会在数据变化后立即更新 DOM
- 而是将所有数据变更缓冲到异步队列中
- 同一事件循环内的多次数据修改只触发一次 DOM 更新
- 这种批处理机制大幅提升性能，避免无谓的重复渲染

```javascript
// 场景：循环1000次修改数据
for (let i = 0; i < 1000; i++) {
  this.count = i; // 数据修改1000次
}
// 但 DOM 只更新1次！最终显示 999
```

#### 使用场景

#### 场景 1：获取更新后的 DOM 属性

```javascript
/**
 * 获取列表容器高度
 * @example 动态计算可视区域、滚动位置
 */
import { ref, nextTick } from 'vue';

const items = ref(['item1', 'item2']);
const container = ref(null);

async function addItemAndGetHeight() {
  items.value.push('item3'); // 修改数据

  // ❌ 错误：立即获取，DOM 未更新
  console.log(container.value.offsetHeight); // 旧高度

  // ✅ 正确：等待 DOM 更新
  await nextTick();
  console.log(container.value.offsetHeight); // 新高度
}
```

#### 场景 2：操作新创建的 DOM 元素

```javascript
/**
 * 自动聚焦输入框
 * @example 表单动态显示、弹窗打开后聚焦
 */
const showInput = ref(false);
const inputRef = ref(null);

async function displayAndFocus() {
  showInput.value = true; // v-if 创建元素

  // ❌ 此时 inputRef.value 为 null

  await nextTick(); // 等待 DOM 渲染
  inputRef.value?.focus(); // ✅ 元素已存在，可安全操作
}
```

#### 场景 3：集成第三方库

```javascript
/**
 * 初始化 ECharts 图表
 * @example 图表容器依赖异步数据控制显隐
 */
import * as echarts from 'echarts';

const chartVisible = ref(false);
const chartDom = ref(null);

async function showChart() {
  chartVisible.value = true; // 显示容器

  await nextTick(); // 确保 DOM 已挂载

  const myChart = echarts.init(chartDom.value);
  myChart.setOption({
    // ... 配置项
  });
}
```

#### 场景 4：聊天窗口滚动到底部

```javascript
/**
 * 新消息自动滚动
 * @example 聊天室、消息通知列表
 */
const messages = ref([]);
const chatBox = ref(null);

async function sendMessage(msg) {
  messages.value.push(msg); // 添加新消息

  await nextTick(); // 等待新消息渲染

  chatBox.value.scrollTop = chatBox.value.scrollHeight; // 滚动到底
}
```

### nextTick使用方式

#### Vue 3 Composition API

```javascript
import { nextTick } from 'vue';

// 方式 1：回调函数
nextTick(() => {
  console.log('DOM 已更新');
});

// 方式 2：Promise (推荐)
await nextTick();
console.log('DOM 已更新');
```

#### Vue 2 Options API

```javascript
// 方式 1：回调函数
this.$nextTick(() => {
  console.log('DOM 已更新');
});

// 方式 2：Promise
await this.$nextTick();
console.log('DOM 已更新');
```

---

### 7. SPA 性能优化实践

**核心原则：度量驱动优化，先诊断，后下手，再验证。**

```javascript
/**
 * 优化工作流程
 * 1. 使用工具诊断瓶颈
 * 2. 按优先级实施优化
 * 3. 度量优化效果
 * 4. 循环迭代
 */

// 度量工具
const performanceTools = {
  lighthouse: 'Chrome DevTools > Lighthouse', // 综合性能报告
  network: 'Chrome DevTools > Network',       // 资源加载分析
  bundleAnalyzer: 'rollup-plugin-visualizer'  // 打包体积分析
};
```

#### 7.1 基础优化（必做项，ROI最高）

##### 7.1.1 路由懒加载（代码分割）

**核心原理：** 按需加载页面代码，减小主包体积

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

/**
 * 路由懒加载配置
 * 使用动态 import() 实现代码分割
 * 每个路由组件打包成独立 chunk
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    // ✅ 懒加载：访问时才下载
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // 可以为 chunk 命名，方便调试
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

##### 7.1.2 打包体积分析

**安装配置可视化分析器：**

```bash
npm i -D rollup-plugin-visualizer
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * Vite 构建配置
 * visualizer: 生成打包体积分析报告
 */
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,           // 构建后自动打开报告
      gzipSize: true,       // 显示 Gzip 压缩后大小
      brotliSize: true,     // 显示 Brotli 压缩后大小
      filename: 'stats.html' // 报告文件名
    })
  ]
});
```

##### 7.1.3 UI 框架按需加载

**以 Element Plus 为例，自动按需引入：**

```bash
npm i -D unplugin-vue-components unplugin-auto-import
```

```javascript
// vite.config.js
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    /**
     * 自动按需导入组件
     * 无需手动 import，直接在模板使用
     */
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    /**
     * 自动导入 Vue API 和组件库 API
     */
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router']
    })
  ]
});
```

```vue
<!-- 使用示例 - 无需手动导入 -->
<template>
  <div>
    <!-- 插件自动处理导入 -->
    <el-button type="primary">按钮</el-button>
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称" />
    </el-table>
  </div>
</template>

<script setup>
// 无需手动导入 ref
// AutoImport 插件自动处理
const tableData = ref([
  { name: '商品1' },
  { name: '商品2' }
]);
</script>
```

##### 7.1.4 资源压缩（Gzip/Brotli）

```bash
npm i -D vite-plugin-compression
```

```javascript
// vite.config.js
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    vue(),
    /**
     * 生成压缩文件
     * 需要服务器配合开启 Gzip 支持
     */
    viteCompression({
      verbose: true,          // 输出压缩结果
      disable: false,         // 不禁用压缩
      threshold: 10240,       // 超过 10KB 才压缩
      algorithm: 'gzip',      // 压缩算法
      ext: '.gz',             // 文件后缀
      deleteOriginFile: false // 保留原文件
    })
  ]
});
```

**Nginx 服务器配置：**

```nginx
# nginx.conf
http {
  # 开启 Gzip
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_min_length 1000;

  # 优先使用预压缩的 .gz 文件
  gzip_static on;
}
```

##### 7.1.5 图片优化

```vue
<template>
  <div>
    <!-- 方案1: 使用现代格式 WebP，提供降级 -->
    <picture>
      <source srcset="@/assets/hero.webp" type="image/webp">
      <img src="@/assets/hero.png" alt="首页大图">
    </picture>

    <!-- 方案2: 图片懒加载 -->
    <img 
      v-lazy="imageUrl" 
      alt="商品图片"
      class="product-img"
    >
  </div>
</template>

<script setup>
/**
 * 图片优化策略
 * 1. 压缩：使用 tinypng.com 或构建时压缩
 * 2. 现代格式：WebP 比 PNG/JPG 小 25-35%
 * 3. 懒加载：视窗外图片延迟加载
 * 4. 响应式：根据屏幕尺寸加载不同大小
 */
</script>
```

**构建时图片压缩：**

```bash
npm i -D vite-plugin-imagemin
```

```javascript
// vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: true }
        ]
      }
    })
  ]
});
```

#### 7.2 进阶优化

##### 7.2.1 CDN 加速

```javascript
// vite.config.js
export default defineConfig({
  /**
   * 生产环境使用 CDN
   * 所有静态资源 URL 会自动添加 CDN 前缀
   */
  base: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com/' 
    : '/',

  build: {
    rollupOptions: {
      /**
       * 外部化大型依赖库
       * 从 CDN 加载，不打入主包
       */
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
});
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <!-- 从 CDN 加载外部化的库 -->
  <script src="https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-router@4.2.4/dist/vue-router.global.prod.js"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

##### 7.2.2 字体优化

```css
/**
 * 字体优化策略
 * font-display: swap - 先用系统字体显示，避免白屏
 * unicode-range: 只加载需要的字符范围
 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* 关键：防止 FOIT */
  font-weight: 400;
  unicode-range: U+4E00-9FA5; /* 只加载常用汉字 */
}

body {
  font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**字体子集化（减小文件体积）：**

```bash
# 安装字体裁剪工具
npm i -D font-spider
```

```html
<!-- 在 HTML 中使用字体 -->
<style>
@font-face {
  font-family: 'MyFont';
  src: url('./fonts/my-font.ttf');
}
.title { font-family: 'MyFont'; }
</style>

<p class="title">这里是需要自定义字体的文字</p>
```

```bash
# 运行裁剪，只保留 HTML 中用到的字符
font-spider index.html
```

##### 7.2.3 预加载关键资源

```html
<!-- index.html -->
<head>
  <!-- Preload: 立即加载当前页必需的资源 -->
  <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
  <link rel="preload" href="/styles/critical.css" as="style">

  <!-- Prefetch: 空闲时加载未来可能用到的资源 -->
  <link rel="prefetch" href="/js/dashboard.chunk.js">

  <!-- DNS Prefetch: 提前解析域名 -->
  <link rel="dns-prefetch" href="https://api.example.com">
</head>
```

#### 7.4 关键要点

1. **度量驱动优化** - 先用工具找瓶颈，避免盲目优化
2. **路由懒加载** - 最基础、ROI最高的优化
3. **按需加载** - UI库、工具库只打包用到的部分
4. **资源压缩** - Gzip/Brotli 减小传输体积
5. **图片优化** - 压缩、WebP、懒加载三管齐下
6. **CDN加速** - 减少网络延迟
7. **感知优化** - 骨架屏、渐进式加载提升体验
8. **虚拟列表** - 大数据场景必备

---

# Vue 组件报错统一监听机制

## 为什么需要统一监听组件报错

统一监听 Vue 组件报错是考察实际工作经验的重要问题。这个问题反映了开发者是否具备生产环境项目的实战经验。

### 实际项目与练习项目的区别

在基础练习、作业或教程项目中，开发者通常只关注功能实现，完成功能后就认为任务结束。但在实际工作中，开发项目需要形成完整的闭环，包括：

- **功能开发**：这只是最基本的第一步
- **运维监控**：需要监控线上运行状态
- **性能优化**：持续优化系统性能
- **错误监控**：及时发现和处理错误
- **部署更新**：支持持续部署和升级
- **后续维护**：甚至考虑项目的下线

错误监控是实际项目中非常重要的一环。如果没有实际工作经验，可能缺乏这种技术敏感性——无法在提到线上项目时，自然而然地想到需要处理报错、性能统计、运维流程等问题。

---

## Window.onerror 全局监听

`window.onerror` 是最基本的全局 JavaScript 错误监听机制，与 Vue 和 React 都没有关系，是纯 JavaScript 的报错机制。

### 基本实现

在 Vue 项目的根组件（如 `App.vue`）的 `mounted` 生命周期中配置：

```javascript
mounted() {
  window.onerror = (message, source, line, column, error) => {
    console.log('Window.onerror', message, source, line, column, error);
  };
}
```

### 参数说明

- **message**：错误信息（字符串）
- **source**：发生错误的文件路径（字符串）
- **line**：错误发生的行号
- **column**：错误发生的列号
- **error**：错误对象实例

### 使用示例

创建一个测试组件 `ErrorDemo.vue`：

```javascript
export default {
  data() {
    return {
      number: 100
    };
  },
  methods: {
    handleClick() {
      // 故意触发错误：number 是数字不是函数
      this.number();
    }
  }
};
```

点击按钮后，`window.onerror` 会捕获到错误信息，包括完整的文件路径、行列信息和错误对象。

### Try-Catch 的限制

**重要限制**：`try-catch` 包裹的错误无法被 `window.onerror` 监听到。

```javascript
try {
  this.number();
} catch(error) {
  console.log('Catch', error);
}
```

当错误被 `try-catch` 捕获后，就不会继续向上传播到 `window.onerror`，因为异常已经被处理了。

### addEventListener 方式

除了 `window.onerror`，还可以使用事件监听方式：

```javascript
window.addEventListener('error', (event) => {
  console.log('Window error event', event);
});
```

事件对象包含的信息与 `window.onerror` 相同：
- `event.message` - 错误信息
- `event.filename` - 文件名（对应 source）
- `event.lineno` - 行号
- `event.colno` - 列号
- `event.error` - 错误对象

两种方式效果相同，可以根据需要选择使用。

---

## Vue 错误监听机制

虽然 Vue 本质上也是 JavaScript，`window.onerror` 可以监听到错误，但 Vue 经过压缩打包后，`window.onerror` 无法识别出 Vue 组件的具体信息。虽然能监听到错误，但在定位错误原因和解决问题时会遇到困难。

因此，Vue 和 React 都构建了自己的错误监听体系。Vue 内部的错误应该使用 Vue 的机制来监听，`window.onerror` 只用于监听 Vue 监听不到的错误。

### errorCaptured 生命周期钩子

`errorCaptured` 是组件级别的错误监听钩子，可以监听所有下级组件的错误。

#### 关键特性

- **监听范围**：所有下级组件的错误
- **自身组件**：无法监听自身组件的错误
- **阻止传播**：返回 `false` 会阻止错误继续向上传播

#### 实现方式

在父组件（如 `App.vue`）中添加：

```javascript
errorCaptured(error, vm, info) {
  console.log('errorCaptured', error, vm, info);
  // return false; // 返回 false 阻止向上传播
}
```

#### 参数说明

- **error**：错误信息对象
- **vm**：发生错误的组件实例（非常重要）
- **info**：错误信息的字符串描述（如 "native"）

#### 测试效果

无论是点击触发的错误，还是 `mounted` 生命周期中直接触发的错误，`errorCaptured` 都能捕获到，并且能获取到完整的组件实例信息。

#### 阻止传播机制

如果 `errorCaptured` 返回 `false`，错误将不会继续向上传播到 `window.onerror`：

```javascript
errorCaptured(error, vm, info) {
  console.log('errorCaptured', error, vm, info);
  return false; // 阻止传播
}
```

这个特性非常有用，可以避免错误信息重复监听，对信息进行统一规整。

### errorHandler 全局错误处理

`errorHandler` 是 Vue 全局级别的错误监听，所有组件错误都会在这里被捕获（除非被 `errorCaptured` 的 `return false` 阻止）。

#### 配置方式

在 `main.js` 中配置：

```javascript
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.errorHandler = (error, vm, info) => {
  console.log('errorHandler', error, vm, info);
};

app.mount('#app');
```

#### 参数说明

参数与 `errorCaptured` 相同：
- **error**：错误对象
- **vm**：组件实例
- **info**：错误信息描述

#### 与 window.onerror 的互斥关系

当 `errorHandler` 捕获到错误后，**不会再触发 `window.onerror`**。这是合理的设计，因为：
- `errorHandler` 已经是全局监听
- 错误已经被捕获
- 避免信息重复

如果两者都触发，会导致信息重复，失去监控意义。

#### warnHandler

Vue 还提供了 `warnHandler` 用于监听警告信息：

```javascript
app.config.warnHandler = (msg, vm, trace) => {
  console.log('warnHandler', msg, vm, trace);
};
```

不过警告的作用不大，主要还是关注错误监听。

---

## 异步错误的特殊处理

异步错误是一个特殊情况，Vue 的错误监听机制无法捕获异步错误。

### 测试异步错误

在 `ErrorDemo.vue` 组件的 `mounted` 中添加异步错误：

```javascript
mounted() {
  setTimeout(() => {
    this.number(); // 异步错误
  }, 1000);
}
```

刷新页面后，一秒后触发错误。可以观察到：
- `window.onerror` **可以**监听到这个错误
- `errorCaptured` **无法**监听到
- `errorHandler` **无法**监听到

### 重要结论

Vue 的整个监听机制对于异步报错无法处理，不管是 `errorCaptured` 还是 `errorHandler` 都监听不到异步错误。

因此，对于异步错误，必须结合 `window.onerror` 来处理。

### Promise 错误处理

对于 Promise 的错误，需要使用专门的监听机制：

```javascript
window.addEventListener('unhandledrejection', (event) => {
  console.log('Unhandled Promise rejection', event);
});
```

`unhandledrejection` 事件可以监听那些没有被 `.catch()` 处理的 Promise 错误。这不是 Vue 特有的，是 JavaScript 层面的错误处理。

---

## 三种错误监听方式的配合使用

在实际项目中，需要三种方式结合使用：

### 1\. errorCaptured（组件级别）

- **用途**：监听重要的、有风险的组件错误
- **级别**：组件生命周期级别
- **优势**：可以针对特定组件进行重点监控
- **限制**：只能监听下级组件

```javascript
// 在关键组件中使用
errorCaptured(error, vm, info) {
  // 记录或处理特定组件的错误
  return false; // 阻止继续传播
}
```

### 2\. errorHandler（Vue 全局）

- **用途**：全局兜底监听所有 Vue 组件错误
- **级别**：应用级别
- **优势**：统一处理所有 Vue 内部错误
- **限制**：无法监听异步错误

```javascript
// 在 main.js 中配置
app.config.errorHandler = (error, vm, info) => {
  // 统一处理 Vue 错误
};
```

### 3\. window.onerror（全局 JS）

- **用途**：监听 Vue 之外的错误，特别是异步错误
- **级别**：浏览器全局
- **优势**：可以捕获异步错误（如 `setTimeout`）
- **限制**：无法识别 Vue 组件信息

```javascript
// 在根组件 mounted 中配置
window.onerror = (message, source, line, column, error) => {
  // 处理异步错误和其他 JS 错误
};

// 处理 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  // 处理未捕获的 Promise rejection
});
```

### 配合使用策略

1. **以 Vue 为主**：在 Vue 项目中，优先使用 Vue 的错误监听机制
2. **异步错误补充**：使用 `window.onerror` 和 `unhandledrejection` 处理 Vue 无法监听的异步错误
3. **重点监控**：对风险较高的组件使用 `errorCaptured` 进行重点照顾
4. **全局兜底**：使用 `errorHandler` 和 `window.onerror` 进行全局兜底监听


