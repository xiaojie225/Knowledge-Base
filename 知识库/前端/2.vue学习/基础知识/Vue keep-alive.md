# Vue Keep-Alive 学习资料

## 日常学习模式

### [标签:  Keep-Alive 组件缓存]

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

---

#### 二、与 Vue Router 集成(推荐方案)

**路由配置**
```javascript
// router/index.js
const routes = [
  {
    path: '/list',
    name: 'ItemList', // 组件name用于include匹配
    component: () => import('@/views/ItemList.vue'),
    meta: { keepAlive: true } // 标记缓存策略
  },
  {
    path: '/detail/:id',
    name: 'ItemDetail',
    component: () => import('@/views/ItemDetail.vue'),
    meta: { keepAlive: false }
  }
];
```

**App.vue 实现(方案一:静态缓存)**
```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component 
        :is="Component" 
        v-if="route.meta.keepAlive"
        :key="route.name" 
      />
    </keep-alive>
    <component 
      :is="Component" 
      v-if="!route.meta.keepAlive"
      :key="route.name" 
    />
  </router-view>
</template>
```

**方案二:动态缓存(多标签页系统)**
```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cacheStore.cachedViews">
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { useCacheStore } from '@/stores/cacheStore';
const cacheStore = useCacheStore();
</script>
```

**状态管理(Pinia Store)**
```javascript
// stores/cacheStore.js
import { defineStore } from 'pinia';

export const useCacheStore = defineStore('cache', {
  state: () => ({
    cachedViews: ['Dashboard'] // 缓存的组件名列表
  }),

  actions: {
    /**
     * 添加缓存组件
     * @param {string} viewName - 组件名
     */
    addCachedView(viewName) {
      if (!this.cachedViews.includes(viewName)) {
        this.cachedViews.push(viewName);
      }
    },
  
    /**
     * 移除缓存组件
     * @param {string} viewName - 组件名
     */
    removeCachedView(viewName) {
      const index = this.cachedViews.indexOf(viewName);
      if (index > -1) {
        this.cachedViews.splice(index, 1);
      }
    }
  }
});
```

**路由守卫集成**
```javascript
// router/index.js
import { useCacheStore } from '@/stores/cacheStore';

router.afterEach((to) => {
  const cacheStore = useCacheStore();
  // 根据路由meta自动添加缓存
  if (to.meta.keepAlive) {
    cacheStore.addCachedView(to.name);
  }
});
```

---

#### 三、数据更新策略

**核心原则**: 缓存的组件 `created`/`mounted` 不会再触发

**方案一: activated 钩子(首选)**
```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

const fetchData = async () => {
  // 获取最新数据
};

onActivated(() => {
  // 每次激活时执行
  fetchData();
});

onDeactivated(() => {
  // 失活时清理资源
});
</script>
```

**方案二: 路由守卫**
```javascript
// 在组件中
beforeRouteEnter(to, from, next) {
  next(vm => {
    vm.fetchData(); // 访问组件实例
  });
}
```

---

#### 四、常见使用场景

**场景1: 列表详情页**
```vue
<!-- 列表页保持滚动位置和筛选条件 -->
<script setup>
import { onActivated, onBeforeRouteLeave } from 'vue';

// 从详情页返回时保持状态
onBeforeRouteLeave((to) => {
  if (to.name !== 'ItemDetail') {
    // 非详情页返回,重置数据
    resetListData();
  }
});
</script>
```

**场景2: 多Tab页签**
```vue
<template>
  <keep-alive>
    <component :is="tabs[currentTab].component" />
  </keep-alive>
</template>
```

**场景3: 动态路由参数变化**
```vue
<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  fetchDetailData(newId);
});
</script>
```

**场景4: 定时器管理**
```vue
<script setup>
import { ref, onActivated, onDeactivated } from 'vue';

const timerId = ref(null);

onActivated(() => {
  // 启动定时器
  timerId.value = setInterval(() => {
    updateData();
  }, 1000);
});

onDeactivated(() => {
  // 清理定时器
  if (timerId.value) {
    clearInterval(timerId.value);
    timerId.value = null;
  }
});
</script>
```

**场景5: WebSocket 连接管理**
```vue
<script setup>
import { ref, onActivated, onDeactivated } from 'vue';

const ws = ref(null);

onActivated(() => {
  // 激活时连接
  ws.value = new WebSocket('ws://example.com');
});

onDeactivated(() => {
  // 失活时断开
  if (ws.value) {
    ws.value.close();
    ws.value = null;
  }
});
</script>
```

---

#### 五、注意事项

1. **组件必须有 name**: `include`/`exclude` 通过组件 `name` 匹配
2. **Key 的重要性**: 动态路由必须设置 `:key="$route.name"` 避免状态混乱
3. **资源清理**: 在 `deactivated` 中清理定时器、WebSocket 等副作用
4. **LRU 策略**: 超出 `max` 时,最久未使用的组件会被销毁
5. **SSR 限制**: `activated`/`deactivated` 不会在服务端渲染时触发

---

## 面试突击模式

### [Vue Keep-Alive] 面试速记

#### 30秒电梯演讲
Keep-Alive 是 Vue 的内置抽象组件,通过缓存非活动组件实例来优化性能和保留状态。它提供 include/exclude/max 三个属性控制缓存策略,使用 LRU 算法淘汰过期缓存,并为缓存组件提供 activated/deactivated 两个专属生命周期钩子。

---

#### 高频考点(必背)

**考点1: 核心作用与原理**
Keep-Alive 通过内部维护的 Map 对象缓存组件实例。首次渲染时将 VNode 存入缓存,再次访问时直接从缓存取出,跳过组件的创建和挂载过程,显著提升性能并保留用户状态。

**考点2: 生命周期钩子差异**
`mounted` 只在首次创建时触发一次,而 `activated` 在首次挂载和每次从缓存激活时都会触发。缓存组件需要在 `activated` 中更新数据,在 `deactivated` 中清理副作用。

**考点3: Include/Exclude 匹配规则**
优先匹配组件的 `name` 选项,若无 `name` 则匹配局部注册名。支持字符串(逗号分隔)、正则表达式、数组三种格式。匿名组件无法被匹配。

**考点4: Max 与 LRU 策略**
当缓存数量超过 `max` 时,采用最近最少使用(LRU)算法:销毁最久未被访问的组件实例,调用其 `$destroy` 方法,并从缓存 Map 中移除。

**考点5: 动态路由参数问题**
相同路由组件(如 `/detail/1` 和 `/detail/2`)会复用实例。需通过 `watch $route.params` 或 `onBeforeRouteUpdate` 监听参数变化并更新数据,避免内容不刷新。

---

#### 经典面试题

##### 技术知识题

**题目1: Keep-Alive 是什么类型的组件?它有什么特殊性?**

**答案**: 
Keep-Alive 是抽象组件(abstract component),具有以下特性:
- 不会渲染为真实的 DOM 元素
- 不会出现在组件的 `$parent` 父子关系链中
- 只作为功能型包装器存在,负责缓存子组件实例
- 通过 `abstract: true` 属性标识其抽象性质

---

**题目2: 如何在 Vue 3 + Router 4 中实现按需缓存路由组件?**

**思路**: 
1. 在路由 meta 中标记缓存策略
2. 使用 RouterView 的 v-slot API
3. 动态绑定 include 属性

**答案**:
```javascript
// 1. 路由配置
const routes = [
  {
    path: '/list',
    name: 'ItemList',
    component: () => import('@/views/ItemList.vue'),
    meta: { keepAlive: true }
  }
];

// 2. App.vue 实现
```
```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * 动态计算需要缓存的组件名列表
 * @returns {string[]} 组件名数组
 */
const cachedViews = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta.keepAlive)
    .map(route => route.name);
});
</script>
```

---

**题目3: activated 和 mounted 的执行时机有何区别?**

**答案**:

| 钩子 | 首次渲染 | 从缓存激活 | 用途 |
|------|---------|-----------|------|
| mounted | ✅ 执行 | ❌ 不执行 | 初始化DOM操作 |
| activated | ✅ 执行 | ✅ 每次执行 | 更新数据、恢复状态 |

**代码示例**:
```vue
<script setup>
import { onMounted, onActivated } from 'vue';

onMounted(() => {
  console.log('只执行一次'); // 初始化配置
});

onActivated(() => {
  console.log('每次激活都执行'); // 刷新数据
  fetchLatestData();
});
</script>
```

---

**题目4: Max 属性的缓存淘汰策略是什么?如何实现?**

**答案**:
采用 **LRU (Least Recently Used)** 最近最少使用算法:

**实现原理**:
1. 维护一个访问时间戳队列
2. 每次访问缓存组件时,将其移到队列末尾
3. 当缓存数量超过 max 时:
   - 从队列头部取出最久未访问的组件
   - 调用其 `$destroy()` 方法销毁实例
   - 从缓存 Map 中删除对应记录

**伪代码**:
```javascript
// Keep-Alive 内部简化逻辑
class KeepAliveCache {
  constructor(max) {
    this.cache = new Map(); // 缓存存储
    this.keys = [];         // LRU 队列
    this.max = max;
  }

  /**
   * 获取缓存组件
   * @param {string} key - 组件唯一标识
   */
  get(key) {
    if (this.cache.has(key)) {
      // 移到队列末尾(标记为最近使用)
      this.keys.splice(this.keys.indexOf(key), 1);
      this.keys.push(key);
      return this.cache.get(key);
    }
  }

  /**
   * 设置缓存组件
   * @param {string} key - 组件唯一标识
   * @param {Object} value - 组件实例
   */
  set(key, value) {
    if (this.cache.has(key)) {
      // 更新位置
      this.keys.splice(this.keys.indexOf(key), 1);
    } else if (this.keys.length >= this.max) {
      // 淘汰最旧的
      const oldestKey = this.keys.shift();
      const oldComponent = this.cache.get(oldestKey);
      oldComponent.$destroy(); // 销毁组件
      this.cache.delete(oldestKey);
    }
    this.keys.push(key);
    this.cache.set(key, value);
  }
}
```

---

**题目5: Include/Exclude 的匹配优先级和规则是什么?**

**答案**:
**匹配顺序**:
1. 组件的 `name` 选项(最高优先级)
2. 局部注册时的名称
3. 匿名组件无法匹配

**支持格式**:
```javascript
// 1. 字符串(逗号分隔)
<keep-alive include="CompA,CompB">

// 2. 正则表达式
<keep-alive :include="/^Comp/">

// 3. 数组
<keep-alive :include="['CompA', 'CompB']">
```

**注意事项**:
- Exclude 优先级高于 Include
- 必须给组件显式定义 `name` 属性
- 动态组件需要通过 `:is` 绑定

---

**题目6: 被缓存的组件何时会触发 beforeDestroy/onBeforeUnmount?**

**答案**:
正常情况下 **不会触发**,只在以下两种场景触发:

1. **缓存淘汰**: 超出 `max` 限制被 LRU 算法移除
2. **Keep-Alive 销毁**: 父组件销毁导致所有缓存被清空

**代码验证**:
```vue
<script setup>
import { onBeforeUnmount, onDeactivated } from 'vue';

onDeactivated(() => {
  console.log('失活,进入缓存'); // ✅ 每次失活都触发
});

onBeforeUnmount(() => {
  console.log('组件销毁'); // ❌ 正常缓存时不触发
});
</script>
```

---

**题目7: 多标签页系统如何动态管理缓存?**

**思路**:
使用 Pinia Store 集中管理缓存列表,通过 Actions 动态增删组件名

**答案**:
```javascript
// stores/tabStore.js
import { defineStore } from 'pinia';

export const useTabStore = defineStore('tab', {
  state: () => ({
    openTabs: [], // 打开的标签页
    cachedViews: [] // 缓存的组件名
  }),

  actions: {
    /**
     * 打开新标签页
     * @param {Object} tab - 标签页信息 {name, title, route}
     */
    addTab(tab) {
      if (!this.openTabs.find(t => t.name === tab.name)) {
        this.openTabs.push(tab);
        this.cachedViews.push(tab.name);
      }
    },
  
    /**
     * 关闭标签页
     * @param {string} tabName - 组件名
     */
    closeTab(tabName) {
      // 从标签列表移除
      const index = this.openTabs.findIndex(t => t.name === tabName);
      if (index > -1) {
        this.openTabs.splice(index, 1);
      }
    
      // 从缓存移除
      const cacheIndex = this.cachedViews.indexOf(tabName);
      if (cacheIndex > -1) {
        this.cachedViews.splice(cacheIndex, 1);
      }
    }
  }
});
```

```vue
<!-- App.vue -->
<template>
  <div class="tabs">
    <div 
      v-for="tab in tabStore.openTabs" 
      :key="tab.name"
      @click="router.push(tab.route)"
    >
      {{ tab.title }}
      <button @click.stop="tabStore.closeTab(tab.name)">×</button>
    </div>
  </div>

  <router-view v-slot="{ Component }">
    <keep-alive :include="tabStore.cachedViews">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { useTabStore } from '@/stores/tabStore';
import { useRouter } from 'vue-router';

const tabStore = useTabStore();
const router = useRouter();
</script>
```

---

**题目8: 为什么给 Keep-Alive 包裹的组件设置 Key 很重要?**

**答案**:
**核心原因**: 确保 Vue 能正确识别和复用组件实例

**问题场景**:
```javascript
// 动态路由: /user/1 和 /user/2 使用同一组件
{ path: '/user/:id', component: UserDetail }
```

**不设置 Key 的问题**:
- Vue 会复用同一组件实例
- 组件内部状态混乱(显示错误的用户数据)
- Keep-Alive 无法区分不同路由

**正确做法**:
```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <!-- 方案1: 用路由名称作为key -->
      <component :is="Component" :key="route.name" />
    
      <!-- 方案2: 用完整路径作为key(更精确) -->
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>
```

---

**题目9: 如何在缓存组件中正确管理定时器?**

**答案**:
**原则**: activated 启动, deactivated 清理

**错误示例** (会导致内存泄漏):
```vue
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // ❌ 组件缓存后定时器仍在运行
  setInterval(() => {
    console.log('执行中...');
  }, 1000);
});
</script>
```

**正确示例**:
```vue
<script setup>
import { ref, onActivated, onDeactivated } from 'vue';

const timerId = ref(null);

/**
 * 启动定时器
 */
function startTimer() {
  if (timerId.value) return; // 防止重复创建

  timerId.value = setInterval(() => {
    console.log('执行中...');
  }, 1000);
}

/**
 * 停止定时器
 */
function stopTimer() {
  if (timerId.value) {
    clearInterval(timerId.value);
    timerId.value = null;
  }
}

onActivated(() => {
  startTimer(); // 激活时启动
});

onDeactivated(() => {
  stopTimer(); // 失活时清理
});
</script>
```

---

**题目10: 动态路由参数变化时,缓存组件如何更新数据?**

**答案**:
**问题**: 从 `/product/1` 跳转到 `/product/2` 时,组件实例被复用,数据不更新

**解决方案**:

**方案1: Watch 监听路由参数(推荐)**
```vue
<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * 获取产品详情
 * @param {string} id - 产品ID
 */
async function fetchProductDetail(id) {
  const res = await api.getProduct(id);
  // 更新数据...
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchProductDetail(newId);
    }
  },
  { immediate: true } // 立即执行一次
);
</script>
```

**方案2: 路由守卫**
```vue
<script>
export default {
  name: 'ProductDetail',

  /**
   * 路由更新前触发(同一组件不同参数)
   * @param {Object} to - 目标路由
   * @param {Object} from - 来源路由
   * @param {Function} next - 继续导航
   */
  beforeRouteUpdate(to, from, next) {
    // 参数变化时重新获取数据
    this.fetchProductDetail(to.params.id);
    next();
  }
};
</script>
```

**方案3: 强制刷新(不推荐,失去缓存意义)**
```vue
<!-- 这样会导致组件完全重建,失去缓存效果 -->
<component :is="Component" :key="$route.fullPath" />
```

---

##### 业务逻辑题

**题目1: 多Tab列表页,切换Tab时保留各自的滚动位置**

**场景**: 商品列表页有"全部"、"热销"、"新品"三个Tab

**思路**:
1. 每个Tab对应一个独立组件
2. 使用 Keep-Alive 缓存所有Tab组件
3. 各组件自动保存滚动位置

**代码框架**:
```vue
<template>
  <div class="tabs">
    <button 
      v-for="tab in tabs" 
      :key="tab.name"
      @click="currentTab = tab.name"
    >
      {{ tab.label }}
    </button>
  </div>

  <!-- 缓存所有Tab组件 -->
  <keep-alive>
    <component :is="currentTab" />
  </keep-alive>
</template>

<script setup>
import { ref } from 'vue';
import AllProducts from './AllProducts.vue';
import HotProducts from './HotProducts.vue';
import NewProducts from './NewProducts.vue';

const tabs = [
  { name: 'AllProducts', label: '全部' },
  { name: 'HotProducts', label: '热销' },
  { name: 'NewProducts', label: '新品' }
];

const currentTab = ref('AllProducts');
</script>
```

```vue
<!-- AllProducts.vue (各Tab组件示例) -->
<script setup>
import { ref, onActivated } from 'vue';

const scrollTop = ref(0);
const containerRef = ref(null);

/**
 * 恢复滚动位置
 */
onActivated(() => {
  if (containerRef.value) {
    containerRef.value.scrollTop = scrollTop.value;
  }
});

/**
 * 保存滚动位置
 */
function handleScroll(e) {
  scrollTop.value = e.target.scrollTop;
}
</script>

<template>
  <div ref="containerRef" @scroll="handleScroll">
    <!-- 列表内容 -->
  </div>
</template>
```

---

**题目2: 多步骤表单,返回上一步时保留已填写内容**

**场景**: 在线申请表单,用户在第二步想返回第一步修改信息

**思路**:
1. 每个步骤独立组件
2. Keep-Alive 缓存所有步骤
3. 表单数据存储在各组件内部

**代码框架**:
```vue
<template>
  <div class="form-wizard">
    <div class="steps">
      <span 
        v-for="(step, index) in steps" 
        :key="index"
        :class="{ active: currentStep === index }"
      >
        {{ step.title }}
      </span>
    </div>
  
    <!-- 缓存所有步骤组件 -->
    <keep-alive>
      <component 
        :is="steps[currentStep].component" 
        @next="handleNext"
        @prev="handlePrev"
      />
    </keep-alive>
  
    <div class="actions">
      <button v-if="currentStep > 0" @click="handlePrev">
        上一步
      </button>
      <button v-if="currentStep < steps.length - 1" @click="handleNext">
        下一步
      </button>
      <button v-else @click="handleSubmit">
        提交
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StepOne from './StepOne.vue';
import StepTwo from './StepTwo.vue';
import StepThree from './StepThree.vue';

const steps = [
  { title: '基本信息', component: StepOne },
  { title: '详细资料', component: StepTwo },
  { title: '确认提交', component: StepThree }
];

const currentStep = ref(0);

/**
 * 下一步
 */
function handleNext() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
}

/**
 * 上一步
 */
function handlePrev() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

/**
 * 提交表单
 */
function handleSubmit() {
  // 收集所有步骤数据并提交
}
</script>
```

```vue
<!-- StepOne.vue (步骤组件示例) -->
<script setup>
import { ref } from 'vue';

// 表单数据保存在组件内,切换步骤时不会丢失
const formData = ref({
  name: '',
  email: '',
  phone: ''
});
</script>

<template>
  <div class="step-form">
    <input v-model="formData.name" placeholder="姓名" />
    <input v-model="formData.email" placeholder="邮箱" />
    <input v-model="formData.phone" placeholder="电话" />
  </div>
</template>
```

---

