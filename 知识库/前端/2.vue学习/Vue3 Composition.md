# Vue Composition API 知识重构

## 日常学习模式

### [标签: Composition API, Vue3, 逻辑复用, setup语法]

---

## 一、核心概念

**Composition API定义**
Vue 3引入的组件逻辑组织方式，通过将相关逻辑代码集中在函数中，替代Options API中分散在不同选项中的代码组织。

**核心优势对比**

| 维度 | Options API | Composition API |
| --- | --- | --- |
| 代码组织 | 按选项分散(data/methods/computed分离) | 按逻辑聚合(相关代码集中) |
| 逻辑复用 | mixins(数据来源混乱、命名冲突) | Composable函数(清晰、无冲突) |
| this指向 | 组件实例(复杂且易出错) | 无需this(函数式编程) |
| TypeScript支持 | 复杂的类型推断 | 天然类型友好 |

---

## 二、响应式系统

### ref vs reactive

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

---

## 三、核心API

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
import { watch, ref } from 'vue'

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

const count = ref(0)
const name = ref('')

watchEffect(() => {
  // 自动追踪count和name
  console.log(`${name.value}: ${count.value}`)
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

### 4. 生命周期钩子

```javascript
/**
 * Composition API生命周期对应关系
 */
import {
  onBeforeMount,  // setup执行之后,组件挂载前
  onMounted,      // 组件挂载后,可访问DOM
  onBeforeUpdate, // 响应式数据变化,组件更新前
  onUpdated,      // 组件更新后
  onBeforeUnmount,// 组件卸载前
  onUnmounted,    // 组件卸载后
} from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })

    onBeforeUnmount(() => {
      // 清理副作用(清除定时器、移除事件监听等)
      clearInterval(timer)
    })

    return {}
  }
}
```

---

## 四、Composable模式

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

### 常用Composable示例

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
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      data.value = await response.json()
      error.value = null
    } catch (e) {
      error.value = e
      data.value = null
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

/**
 * 本地存储同步Composable
 */
import { watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return value
}

/**
 * 防抖输入Composable
 */
export function useDebouncedInput(delay = 500) {
  const input = ref('')
  const debouncedValue = ref('')
  let timeout

  watch(input, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return { input, debouncedValue }
}
```

---

## 五、script setup语法糖

```javascript
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
<script setup>
import { ref } from 'vue'

// 自动暴露,无需手动return
const count = ref(0)
const increment = () => count.value++
</script>

/**
 * script setup特殊API
 */
<script setup>
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

---

## 六、全局状态管理

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

---

## 七、常见陷阱与解决方案

### 陷阱1: 定时器内存泄漏

```javascript
/**
 * ❌ 错误 - 定时器不清理
 */
export function useCounter() {
  const count = ref(0)
  setInterval(() => {
    count.value++
  }, 1000)
  return { count }
}
// 组件卸载后定时器仍运行,导致内存泄漏

/**
 * ✅ 正确 - onUnmounted清理
 */
import { onUnmounted } from 'vue'

export function useCounter() {
  const count = ref(0)
  const timer = setInterval(() => {
    count.value++
  }, 1000)

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { count }
}
```

### 陷阱2: watch死循环

```javascript
/**
 * ❌ 易形成死循环
 */
const count = ref(0)
watch(count, () => {
  count.value++ // 修改被监听的值
})

/**
 * ✅ 使用flush:'post'或避免循环修改
 */
watch(count, (newVal) => {
  if (newVal > 100) count.value = 100 // 只在特定条件下修改
}, { deep: true })
```

### 陷阱3: 对象引用问题

```javascript
/**
 * ❌ 错误 - ref包装的对象直接赋值丢失响应性
 */
const state = ref({ count: 0 })
state = { count: 0 } // ❌ 错误,会覆盖ref本身

/**
 * ✅ 正确做法
 */
const state = ref({ count: 0 })
state.value = { count: 0 } // ✅ 修改.value
```

---

## 八、快速对比总结

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
      return this.users
        .filter(u => u.name.includes(this.searchQuery))
        .sort((a, b) => a[this.sortBy] > b[this.sortBy] ? 1 : -1)
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
    return items.value.filter(item => 
      item.name.includes(searchQuery.value)
    )
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

## 面试突击模式

### [Vue Composition API] 面试速记

#### 30秒电梯演讲
Composition API通过将相关逻辑代码集中在函数中替代Options API的分散组织,提供更好的代码内聚性和逻辑复用能力。核心API包括响应式系统(ref/reactive)、计算属性(computed)、监听器(watch)和生命周期钩子,支持按功能组织代码为Composable函数,天然支持TypeScript类型推断。

---

#### 高频考点(必背)

**考点1: ref vs reactive核心区别**
ref通过.value访问,用于基本类型和对象的通用响应式包装。reactive用于对象直接转换为深度响应式,无需.value但仅支持对象类型。实践中:基本类型必用ref,对象可用reactive(推荐)或ref都可以,选择取决于是否需要重新赋值整个对象。

**考点2: Props解构为何失去响应性**
直接解构props获得的是值副本而非响应式引用,父组件更新prop时子组件内部变量不会更新。解决方案是使用toRefs或toRef将prop转换为ref,保持与父组件的响应式链接。

**考点3: Composable函数如何实现逻辑复用**
Composable就是标准的JavaScript函数,内部定义响应式状态和方法,返回暴露的接口。每次调用都创建独立的状态实例,但复用相同的逻辑实现。对比mixins,Composable的优势是:数据来源清晰(显式import和解构),无命名冲突(可重命名),类型推断完美。

**考点4: computed的缓存机制**
computed创建基于其他响应式数据派生的计算属性,具有缓存特性:仅当依赖项改变时才重新执行计算,多次访问相同结果直接返回缓存。与普通函数的区别是避免不必要的重复计算,提升性能,特别是计算复杂度高时效果显著。

**考点5: watch和watchEffect的区别**
watch明确指定依赖源并可同时访问新旧值,适合在依赖改变时执行特定业务逻辑。watchEffect自动追踪函数内访问的响应式数据作为依赖,无法访问旧值,适合执行副作用(如API调用)。选择原则:需要控制依赖和访问旧值用watch,只需追踪副作用用watchEffect。

---

#### 经典面试题(10题)

**题目1: 说明ref和reactive的实现原理差异**

**思路**: 从响应式系统底层分析两种API的工作方式

**答案**:
ref通过包装对象实现响应式,内部创建一个对象`{ value: rawValue }`,通过getter/setter拦截value属性的访问来追踪和触发更新。这样可以包装任意类型,包括基本类型。

reactive使用Proxy直接拦截目标对象的属性访问和修改操作,返回代理对象。属性访问时自动追踪,修改时自动触发更新。因为Proxy只能代理对象,所以reactive只支持对象类型。

ref本质上也调用了reactive来实现对象的响应式,所以ref({ count: 0 })内部最终也是通过reactive实现的。

**代码框架**:
```javascript
/**
 * ref简化实现原理
 */
class Ref {
  constructor(value) {
    this.value = value
  }

  get value() {
    track(this, 'value')        // 追踪访问
    return this._value
  }

  set value(newValue) {
    this._value = newValue
    trigger(this, 'value')      // 触发更新
  }
}

/**
 * reactive简化实现原理
 */
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      track(target, key)        // 追踪访问
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)      // 触发更新
      return true
    }
  })
}
```

---

**题目2: 为什么在script setup中导入的组件可以直接使用,无需显式注册**

**思路**: 解释编译时处理机制

**答案**:
script setup是Vue SFC编译器的语法糖,编译器在编译阶段分析`<script setup>`块中的代码。当检测到顶层的导入变量时,编译器会自动将其视为组件并添加到该组件的components选项中,相当于自动执行了`components: { MyComponent }`这个操作。

这是编译时的处理,不是运行时的JavaScript逻辑,所以不需要开发者手动注册。类似的自动注册还包括用`defineProps`定义的props、用`defineEmits`定义的emits等。

**代码框架**:
```javascript
/**
 * 我们写的代码
 */
<script setup>
import MyButton from './MyButton.vue'
import { defineProps } from 'vue'

defineProps(['title'])

const handleClick = () => {}
</script>

/**
 * 编译后等价的代码(简化版)
 */
export default {
  components: {
    MyButton  // 自动注册
  },
  props: ['title'],
  setup() {
    const handleClick = () => {}
    return { handleClick, MyButton }
  }
}
```

---

**题目3: 如何避免在Composable中创建的事件监听器导致内存泄漏**

**思路**: 强调onUnmounted的重要性和模式

**答案**:
关键是在onUnmounted生命周期钩子中进行清理。每个使用Composable的组件实例都有独立的onUnmounted钩子,当组件卸载时会自动调用这个钩子,从而移除该实例的事件监听器。

这样可以保证没有孤立的事件监听器残留在内存中。同时要注意的是,在setup中创建的任何副作用(定时器、事件监听、订阅等)都应该在onUnmounted中清理。

**代码框架**:
```javascript
/**
 * 完整的事件监听Composable示例
 */
import { onMounted, onUnmounted } from 'vue'

export function useMouseMove() {
  let x = 0, y = 0

  const handleMouseMove = (event) => {
    x = event.clientX
    y = event.clientY
  }

  onMounted(() => {
    // 组件挂载时添加监听
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    // ✅ 组件卸载时移除监听
    window.removeEventListener('mousemove', handleMouseMove)
  })

  return { get x() { return x }, get y() { return y } }
}

/**
 * ❌ 错误做法 - 无清理
 */
export function useMouseMoveBad() {
  window.addEventListener('mousemove', (e) => {
    // 事件监听器永远不会被移除
  })
}
```

---

**题目4: 解释computed的缓存是如何工作的,为什么它比普通函数更高效**

**思路**: 对比缓存机制和性能差异

**答案**:
computed内部维护一个缓存值和一个依赖追踪系统。首次访问时执行计算函数并缓存结果。后续访问时检查依赖是否改变:如果依赖未变,直接返回缓存;如果依赖改变,才重新执行计算并更新缓存。

相比普通函数每次调用都需要完整执行,computed避免了重复计算。在计算复杂度高的场景(如数组遍历排序、复杂算法计算)效能提升明显。同时,如果多个地方依赖同一个computed属性,也只需计算一次。

**代码框架**:
```javascript
/**
 * computed缓存演示
 */
import { ref, computed } from 'vue'

const count = ref(0)
let computationCount = 0

const double = computed(() => {
  computationCount++
  console.log(`执行了第${computationCount}次计算`)
  return count.value * 2
})

console.log(double.value)  // "执行了第1次计算", 输出: 0
console.log(double.value)  // 无新日志, 直接返回缓存的0
console.log(double.value)  // 无新日志, 直接返回缓存的0

count.value = 5            // 改变依赖

console.log(double.value)  // "执行了第2次计算", 输出: 10
console.log(double.value)  // 无新日志, 直接返回缓存的10

/**
 * 对比普通函数
 */
function doubleFn() {
  console.log('普通函数执行')
  return count.value * 2
}

doubleFn()  // "普通函数执行"
doubleFn()  // "普通函数执行" - 每次都执行
doubleFn()  // "普通函数执行" - 每次都执行
```

---

