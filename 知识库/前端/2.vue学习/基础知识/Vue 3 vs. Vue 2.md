# Vue 3 vs Vue 2 深度精炼文档

## 日常学习模式

[标签:  Composition API, 性能优化, TypeScript]

### 一、核心差异体系

#### 1. 性能优化三大支柱

**1.1 响应式系统重构: Proxy替代defineProperty**

核心原理对比:
```javascript
// Vue 2: Object.defineProperty (有限监听)
// 缺陷:
// - 需递归遍历所有属性,初始化慢
// - 无法监听动态增删属性
// - 数组索引/length修改需hack

// Vue 3: Proxy (全功能监听)
const state = new Proxy(target, {
  get(target, key) {
    track(target, key); // 依赖收集
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key); // 触发更新
    return true;
  }
});

// 优势:
// - 惰性代理,按需处理
// - 天然支持属性增删
// - 完整数组支持
```

**1.2 编译时优化: 靶向更新机制**

Block Tree + Patch Flags:
```javascript
// 编译前模板
<div>
  <p>静态文本</p>
  <p :class="dynamic">{{ message }}</p>
</div>

// 编译后伪代码
function render() {
  return createBlock('div', null, [
    _hoisted_1, // 静态节点提升,复用
    createVNode('p', 
      { class: _ctx.dynamic }, // Patch Flag: CLASS
      _ctx.message,            // Patch Flag: TEXT
      3 /* CLASS | TEXT */
    )
  ]);
}

// Diff时只对比flag=3的节点,且只对比class和text
```

Patch Flags类型:
- `1 (TEXT)`: 动态文本
- `2 (CLASS)`: 动态class
- `4 (STYLE)`: 动态style
- `8 (PROPS)`: 动态属性(除class/style)
- `16 (FULL_PROPS)`: 有动态key的属性

**1.3 Tree-shaking支持**

模块化导入:
```javascript
// Vue 3按需导入,未使用的不会打包
import { ref, computed } from 'vue';
// transition/keep-alive等内置组件也可tree-shake

// 结果: 核心runtime约10KB(gzip)
```

#### 2. API设计革新: Composition API

**2.1 核心问题与解决方案**

Options API痛点:
```javascript
// Vue 2: 逻辑分散
export default {
  data() {
    return {
      searchText: '',    // 搜索功能
      currentPage: 1     // 分页功能
    };
  },
  computed: {
    filteredList() {}, // 搜索功能
    totalPages() {}    // 分页功能
  },
  methods: {
    handleSearch() {}, // 搜索功能
    nextPage() {}      // 分页功能
  }
};
// 问题: 一个功能的代码分散在多处,难维护
```

Composition API解决方案:
```javascript
// Vue 3: 逻辑聚合
import { ref, computed } from 'vue';

// 搜索功能 - 所有相关逻辑在一起
function useSearch(list) {
  const searchText = ref('');
  const filteredList = computed(() => 
    list.value.filter(item => 
      item.name.includes(searchText.value)
    )
  );
  const handleSearch = () => { /* ... */ };

  return { searchText, filteredList, handleSearch };
}

// 分页功能 - 独立封装
function usePagination(total) {
  const currentPage = ref(1);
  const totalPages = computed(() => Math.ceil(total.value / 10));
  const nextPage = () => { currentPage.value++; };

  return { currentPage, totalPages, nextPage };
}

// 组件中使用
const { searchText, filteredList } = useSearch(rawList);
const { currentPage, totalPages } = usePagination(filteredList);
```

**2.2 Composables vs Mixin**

对比表:

| 特性 | Mixin | Composables |
|------|-------|-------------|
| 数据来源 | 隐式,难追溯 | 显式导入,清晰 |
| 命名冲突 | 易冲突,静默覆盖 | 显式解构,无冲突 |
| 类型推断 | 困难 | 完美支持 |
| 依赖关系 | 不明确 | 函数参数明确 |

实战示例:
```javascript
/**
 * 鼠标位置追踪 Composable
 * @returns {{ x: Ref<number>, y: Ref<number> }}
 */
function useMousePosition() {
  const x = ref(0);
  const y = ref(0);

  const update = (e) => {
    x.value = e.pageX;
    y.value = e.pageY;
  };

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}

// 任意组件中使用
const { x: mouseX, y: mouseY } = useMousePosition();
// 来源清晰,可重命名避免冲突
```

#### 3. TypeScript集成

**3.1 一流类型支持**

完整类型推断:
```typescript
import { ref, computed, PropType } from 'vue';

// ref自动推断类型
const count = ref(0); // Ref<number>
const name = ref(''); // Ref<string>

// Props类型定义
interface User {
  id: number;
  name: string;
}

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  count: Number
});

// computed自动推断返回类型
const displayName = computed(() => {
  return props.user.name.toUpperCase(); // 类型安全
});

// Composable的类型
function useCounter(initial: number) {
  const count = ref(initial);
  const double = computed(() => count.value * 2);
  return { count, double }; // 返回类型自动推断
}
```

**3.2 组件类型定义**
```typescript
// 使用<script setup lang="ts">
<script setup lang="ts">
import { ref } from 'vue';

// 接口定义
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Props with TypeScript
const props = defineProps<{
  todos: Todo[];
  filter?: 'all' | 'active' | 'completed';
}>();

// Emits类型
const emit = defineEmits<{
  (e: 'add', todo: Todo): void;
  (e: 'delete', id: number): void;
}>();

// 响应式状态自动推断
const newTodo = ref<Todo>({
  id: Date.now(),
  text: '',
  done: false
});
</script>
```

#### 4. 新特性详解

**4.1 Fragments (多根节点)**

```vue
<!-- Vue 2: 必须单根 -->
<template>
  <div> <!-- 强制包裹层 -->
    <header>头部</header>
    <main>内容</main>
  </div>
</template>

<!-- Vue 3: 可多根 -->
<template>
  <header>头部</header>
  <main>内容</main>
  <footer>底部</footer>
</template>
```

**4.2 Teleport (传送门)**

典型场景:
```vue
<template>
  <div class="container">
    <button @click="showModal = true">打开弹窗</button>
  
    <!-- 组件内定义,实际渲染到body下 -->
    <teleport to="body">
      <div v-if="showModal" class="modal">
        <p>我在body下,不受父组件样式影响</p>
        <button @click="showModal = false">关闭</button>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showModal = ref(false);
</script>

<style scoped>
.container {
  /* overflow/z-index不会影响modal */
  overflow: hidden;
  position: relative;
  z-index: 1;
}
</style>
```

**4.3 Suspense (实验性)**

异步组件加载:
```vue
<template>
  <Suspense>
    <!-- 异步组件 -->
    <template #default>
      <AsyncComponent />
    </template>
  
    <!-- 加载中显示 -->
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<script setup>
// AsyncComponent内部
const data = await fetch('/api/data'); // setup中可直接await
</script>
```

**4.4 多v-model支持**

```vue
<!-- 父组件 -->
<UserForm 
  v-model:firstName="user.firstName"
  v-model:lastName="user.lastName"
/>

<!-- 子组件 -->
<script setup>
const props = defineProps(['firstName', 'lastName']);
const emit = defineEmits(['update:firstName', 'update:lastName']);

function updateFirst(e) {
  emit('update:firstName', e.target.value);
}
</script>

<template>
  <input :value="firstName" @input="updateFirst" />
  <input :value="lastName" @input="e => emit('update:lastName', e.target.value)" />
</template>
```

#### 5. 重大破坏性变更

**5.1 全局API迁移**

```javascript
// Vue 2: 全局污染
import Vue from 'vue';
Vue.use(VueRouter);
Vue.component('MyComp', MyComp);
Vue.mixin({ ... });

// Vue 3: 应用实例隔离
import { createApp } from 'vue';
const app = createApp(App);
app.use(VueRouter);
app.component('MyComp', MyComp);
app.mixin({ ... });
app.mount('#app');

// 多应用互不影响
const app1 = createApp(App1).mount('#app1');
const app2 = createApp(App2).mount('#app2');
```

**5.2 移除的API及替代**

| 移除的API | 替代方案 |
|-----------|----------|
| `$on/$off/$once` | mitt/tiny-emitter库 或 Pinia |
| `filters` | computed 或 methods |
| `$children` | refs 或 provide/inject |
| `.native修饰符` | 默认透传,无需修饰符 |
| `keyCode` | 直接用键名: `@keyup.enter` |

事件总线替代:
```javascript
// Vue 2: Event Bus
const bus = new Vue();
bus.$on('event', handler);
bus.$emit('event', data);

// Vue 3方案1: mitt库
import mitt from 'mitt';
const emitter = mitt();
emitter.on('event', handler);
emitter.emit('event', data);

// Vue 3方案2: Pinia (推荐)
import { defineStore } from 'pinia';
const useEventStore = defineStore('events', {
  state: () => ({ message: '' }),
  actions: {
    notify(msg) { this.message = msg; }
  }
});
```

**5.3 v-model变更**

```vue
<!-- Vue 2 -->
<CustomInput v-model="text" />
<!-- 等价于 -->
<CustomInput :value="text" @input="text = $event" />

<!-- Vue 3 -->
<CustomInput v-model="text" />
<!-- 等价于 -->
<CustomInput :modelValue="text" @update:modelValue="text = $event" />

<!-- 自定义名称 -->
<CustomInput v-model:title="pageTitle" />
<!-- 等价于 -->
<CustomInput :title="pageTitle" @update:title="pageTitle = $event" />
```

#### 6. ref vs reactive 使用指南

**核心区别**:
```javascript
import { ref, reactive } from 'vue';

// ref: 包装任意类型,通过.value访问
const count = ref(0);
const user = ref({ name: 'Alice' });
count.value++; // 必须用.value
user.value = { name: 'Bob' }; // 可整体替换

// reactive: 仅用于对象,直接访问属性
const state = reactive({
  count: 0,
  user: { name: 'Alice' }
});
state.count++; // 直接访问
// state = {}; // ❌ 整体替换会失去响应性

// reactive解构会失去响应性
const { count } = state; // ❌ count不再是响应式
// 需用toRefs转换
import { toRefs } from 'vue';
const { count } = toRefs(state); // ✅ count是ref
```

**使用原则**:
1. **优先使用ref** - 最灵活,支持所有场景
2. **reactive适用场景** - 组织一组相关状态且不需整体替换
3. **template中自动解包** - ref在模板中无需`.value`

```vue
<script setup>
const count = ref(0); // ref
const state = reactive({ name: '' }); // reactive
</script>

<template>
  <!-- ref自动解包 -->
  <p>{{ count }}</p> 
  <button @click="count++">增加</button>

  <!-- reactive直接访问 -->
  <input v-model="state.name" />
</template>
```

---

## 面试突击模式

### Vue 3 vs Vue 2 面试速记

#### 30秒电梯演讲
Vue 3是一次架构级重构,核心亮点:**Proxy响应式带来初始化性能提升**,**编译时优化实现靶向更新**,**Composition API解决大型组件逻辑组织问题**,**TypeScript重写提供一流类型支持**,同时新增Fragments/Teleport/Suspense等实用特性,整体bundle体积更小且支持tree-shaking。

#### 高频考点(必背)

**考点1: Vue 3性能提升的本质原因**
三大核心优化:(1) Proxy替代defineProperty实现懒代理和完整监听; (2) 编译器静态分析生成Patch Flags,实现靶向更新,性能与模板大小解耦; (3) 模块化设计支持tree-shaking,按需打包。

**考点2: Composition API解决了什么问题**
解决Options API在大型组件中的两大痛点:(1) 逻辑分散 - 同一功能的代码被迫分散在data/methods/computed等不同区块; (2) 复用机制差 - Mixin存在来源不明、命名冲突、类型推断弱等问题。Composition API通过可组合函数实现按功能组织代码和清晰的逻辑复用。

**考点3: Proxy相比defineProperty的核心优势**
四大优势:(1) 监听范围 - 可监听属性增删,无需$set/$delete; (2) 数组支持 - 原生支持索引和length修改; (3) 性能 - 惰性代理,按需处理; (4) API简洁 - 无需额外API补丁。

**考点4: 什么是靶向更新(Patch Flags)**
编译器在编译模板时为动态节点打标记(如CLASS=2, TEXT=1),Diff时只对比有标记的节点且只对比标记类型对应的内容,静态内容直接提升复用。使更新性能只与动态内容数量相关,与模板大小无关。

**考点5: ref和reactive的使用场景**
ref包装任意类型通过.value访问,支持整体替换,适合大部分场景优先使用; reactive仅用于对象直接访问属性,不可整体替换,适合组织相关状态组且不需替换的场景。template中ref自动解包无需.value。

#### 经典面试题(10道)

**题目1: 请实现一个Vue 3的鼠标位置追踪Composable**

思路: 用ref存储坐标,在mounted时监听mousemove,在unmounted时移除监听

答案: 这是Composition API逻辑复用的经典案例,展示了如何将有状态的逻辑封装成可复用函数

代码框架:
```javascript
/**
 * 追踪鼠标位置的可组合函数
 * @returns {{ x: Ref<number>, y: Ref<number> }} 鼠标坐标
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useMousePosition() {
  // 响应式存储坐标
  const x = ref(0);
  const y = ref(0);

  /**
   * 更新坐标的事件处理器
   * @param {MouseEvent} event - 鼠标事件对象
   */
  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  // 组件挂载时添加监听
  onMounted(() => {
    window.addEventListener('mousemove', update);
  });

  // 组件卸载时移除监听(防止内存泄漏)
  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });

  // 返回响应式引用供组件使用
  return { x, y };
}

// 在任意组件中使用:
// const { x, y } = useMousePosition();
// template: <p>鼠标位置: {{ x }}, {{ y }}</p>
```

**题目2: 如何在Vue 3中实现一个支持多个v-model的表单组件**

思路: 使用defineProps接收多个modelValue,使用defineEmits定义对应的update事件

答案: Vue 3的多v-model支持让表单组件设计更灵活,通过命名参数区分不同的绑定值

代码框架:
```vue
<!-- UserForm.vue - 支持firstName和lastName双向绑定 -->
<script setup>
/**
 * Props定义 - 接收两个model值
 * @property {string} firstName - 名字
 * @property {string} lastName - 姓氏
 */
const props = defineProps({
  firstName: String,
  lastName: String
});

/**
 * Emits定义 - 对应的更新事件
 * @event update:firstName - 名字更新事件
 * @event update:lastName - 姓氏更新事件
 */
const emit = defineEmits(['update:firstName', 'update:lastName']);

/**
 * 更新名字
 * @param {Event} event - 输入事件
 */
function updateFirst(event) {
  emit('update:firstName', event.target.value);
}

/**
 * 更新姓氏
 * @param {Event} event - 输入事件
 */
function updateLast(event) {
  emit('update:lastName', event.target.value);
}
</script>

<template>
  <div class="user-form">
    <!-- 绑定firstName -->
    <input 
      :value="props.firstName" 
      @input="updateFirst"
      placeholder="First Name"
    />
  
    <!-- 绑定lastName -->
    <input 
      :value="props.lastName" 
      @input="updateLast"
      placeholder="Last Name"
    />
  </div>
</template>

<!-- 父组件使用:
<UserForm 
  v-model:firstName="user.firstName"
  v-model:lastName="user.lastName"
/>
-->
```

**题目3: 请实现一个带防抖功能的搜索Composable**

思路: 结合ref存储搜索词,用watchEffect监听变化,通过setTimeout实现防抖

答案: 展示如何在Composable中组合多个Vue 3 API实现复杂逻辑

代码框架:
```javascript
/**
 * 防抖搜索可组合函数
 * @param {Function} fetchFn - 搜索API函数
 * @param {number} delay - 防抖延迟(ms)
 * @returns {Object} 搜索状态和方法
 */
import { ref, watch } from 'vue';

export function useDebouncedSearch(fetchFn, delay = 300) {
  // 搜索关键词
  const searchText = ref('');
  // 搜索结果
  const results = ref([]);
  // 加载状态
  const isLoading = ref(false);
  // 防抖定时器ID
  let timeoutId = null;

  /**
   * 执行搜索请求
   * @param {string} query - 搜索词
   */
  async function performSearch(query) {
    if (!query.trim()) {
      results.value = [];
      return;
    }
  
    isLoading.value = true;
    try {
      results.value = await fetchFn(query);
    } catch (error) {
      console.error('Search failed:', error);
      results.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // 监听搜索词变化,实现防抖
  watch(searchText, (newValue) => {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    // 设置新的防抖定时器
    timeoutId = setTimeout(() => {
      performSearch(newValue);
    }, delay);
  });

  return {
    searchText,  // 绑定到输入框
    results,     // 搜索结果列表
    isLoading    // 显示loading状态
  };
}

// 使用示例:
// const { searchText, results, isLoading } = useDebouncedSearch(
//   (query) => fetch(`/api/search?q=${query}`).then(r => r.json())
// );
```

**题目4: Vue 2项目迁移到Vue 3,如何处理全局事件总线**

思路: 移除$on/$off,使用mitt库或Pinia状态管理替代

答案: Vue 3推崇更清晰的状态管理,避免隐式的事件总线模式

代码框架:
```javascript
// 方案1: 使用mitt库(轻量级事件发射器)
// npm install mitt

/**
 * 创建全局事件总线
 */
import mitt from 'mitt';

// 创建事件发射器实例
export const emitter = mitt();

// 组件A: 发送事件
import { emitter } from './eventBus';
emitter.emit('user-logged-in', { userId: 123 });

// 组件B: 监听事件
import { emitter } from './eventBus';
import { onMounted, onUnmounted } from 'vue';

const handler = (data) => {
  console.log('User logged in:', data.userId);
};

onMounted(() => {
  emitter.on('user-logged-in', handler);
});

onUnmounted(() => {
  emitter.off('user-logged-in', handler); // 防止内存泄漏
});

// ===================================

// 方案2: Pinia状态管理(推荐用于复杂应用)
/**
 * 定义通知store
 */
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: '',
    type: 'info', // 'info' | 'success' | 'error'
    visible: false
  }),

  actions: {
    /**
     * 显示通知
     * @param {string} msg - 通知内容
     * @param {string} type - 通知类型
     */
    show(msg, type = 'info') {
      this.message = msg;
      this.type = type;
      this.visible = true;
    
      // 3秒后自动隐藏
      setTimeout(() => {
        this.visible = false;
      }, 3000);
    }
  }
});

// 任意组件中触发通知:
// const notification = useNotificationStore();
// notification.show('登录成功', 'success');
```

**题目5: 实现一个Vue 3的本地存储持久化Composable**

思路: 封装localStorage操作,用ref创建响应式状态,watch监听变化自动保存

答案: 展示如何将浏览器API封装成可复用的Vue 3逻辑

代码框架:
```javascript
/**
 * 带本地存储持久化的状态管理
 * @param {string} key - localStorage的key
 * @param {*} initialValue - 初始值
 * @returns {Ref} 响应式引用
 */
import { ref, watch } from 'vue';

export function useLocalStorage(key, initialValue) {
  /**
   * 从localStorage读取初始值
   * @returns {*} 解析后的值或初始值
   */
  function readFromStorage() {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }

  // 创建响应式状态,初始值从localStorage读取
  const storedValue = ref(readFromStorage());

  /**
   * 写入localStorage
   * @param {*} value - 要保存的值
   */
  function writeToStorage(value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }

  // 监听值的变化,自动持久化到localStorage
  watch(
    storedValue,
    (newValue) => {
      writeToStorage(newValue);
    },
    { deep: true } // 深度监听对象内部变化
  );

  return storedValue;
}

// 使用示例:
// const userSettings = useLocalStorage('user-settings', {
//   theme: 'dark',
//   language: 'zh-CN'
// });
// 
// userSettings.value.theme = 'light'; // 自动保存到localStorage
```

**题目6: 如何在Vue 3中实现一个自定义指令v-focus**

思路: 使用app.directive注册全局指令,在mounted钩子中调用元素的focus方法

答案: 展示Vue 3自定义指令的基本用法和生命周期钩子

代码框架:
```javascript
/**
 * 自动聚焦指令
 * 用法: <input v-focus />
 */

// main.js中注册
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

/**
 * 全局注册v-focus指令
 */
app.directive('focus', {
  /**
   * 元素挂载到DOM后自动聚焦
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   */
  mounted(el, binding) {
    // 如果传了参数且为false,则不聚焦
    if (binding.value === false) return;
  
    // 延迟聚焦确保DOM完全渲染
    el.focus();
  },

  /**
   * 元素更新时的逻辑(可选)
   * @param {HTMLElement} el - DOM元素
   * @param {Object} binding - 绑定对象
   */
  updated(el, binding) {
    // 支持动态控制是否聚焦
    if (binding.value && binding.value !== binding.oldValue) {
      el.focus();
    }
  }
});

app.mount('#app');

// ===================================

// 组件中使用:
// <template>
//   <!-- 自动聚焦 -->
//   <input v-focus />
// 
//   <!-- 条件聚焦 -->
//   <input v-focus="shouldFocus" />
// </template>

// ===================================

// 局部注册指令(在组件中):
// <script setup>
// const vFocus = {
//   mounted: (el) => el.focus()
// };
// </script>
```

