# Vue 生命周期 - 精华学习资料

## 日常学习模式

[标签: Vue生命周期]

### 核心概念

**生命周期定义**：Vue实例从创建到销毁的完整过程，通过钩子函数在特定阶段执行代码。

**两种API对比**：
- **Options API** (Vue 2)：配置对象形式，钩子作为对象属性
- **Composition API** (Vue 3)：函数式组合，钩子需导入使用

### 完整生命周期阶段

#### 1. 创建阶段 (Initialization)

**Options API**
```javascript
// beforeCreate: 实例初始化后，数据观测前
beforeCreate() {
  console.log(this.message); // undefined
  // 无法访问 data、computed、methods
}

// created: 实例创建完成，数据观测已配置
created() {
  console.log(this.message); // 可访问
  // ✅ 可访问响应式数据
  // ✅ 可调用方法
  // ❌ 无法访问 DOM ($el 为 undefined)
}
```

**Composition API**
```javascript
import { ref, onBeforeMount } from 'vue';

/**
 * setup 函数替代 beforeCreate 和 created
 * 执行时机：beforeCreate 之前
 * 特点：无 this，返回值暴露给模板
 */
setup() {
  // 相当于 beforeCreate + created
  const message = ref('Hello');

  // 同步逻辑在此执行
  console.log('初始化阶段');

  return { message };
}
```

#### 2. 挂载阶段 (Mounting)

**Options API**
```javascript
// beforeMount: 模板编译完成，DOM未生成
beforeMount() {
  console.log(this.$el); // null 或挂载点空壳
  // ❌ 不可操作 DOM
}

// mounted: DOM已挂载到页面
mounted() {
  console.log(this.$el); // 真实DOM元素
  // ✅ 可操作 DOM
  // ✅ 初始化第三方库
  // ✅ 发起数据请求
}
```

**Composition API**
```javascript
import { ref, onBeforeMount, onMounted } from 'vue';

setup() {
  const rootElement = ref(null);

  /**
   * onBeforeMount: 挂载开始前调用
   */
  onBeforeMount(() => {
    console.log(rootElement.value); // null
  });

  /**
   * onMounted: 挂载完成后调用
   * 使用场景：
   * - 初始化需要DOM的第三方库(ECharts, Swiper)
   * - 获取元素尺寸/位置
   * - 注册全局事件监听
   */
  onMounted(() => {
    console.log(rootElement.value); // <div>...</div>
    // 示例：初始化图表
    // const chart = echarts.init(rootElement.value);
  });

  return { rootElement };
}
```

#### 3. 更新阶段 (Updating)

**Options API**
```javascript
// beforeUpdate: 数据变化，DOM更新前
beforeUpdate() {
  // 此时 data 已更新，但 DOM 未更新
  console.log('数据:', this.message);
  console.log('DOM:', this.$el.textContent); // 旧值
}

// updated: DOM更新完成
updated() {
  // 数据和 DOM 都已更新
  console.log('数据:', this.message);
  console.log('DOM:', this.$el.textContent); // 新值
  // ⚠️ 避免在此修改数据，可能导致无限循环
}
```

**Composition API**
```javascript
import { ref, onBeforeUpdate, onUpdated } from 'vue';

setup() {
  const count = ref(0);

  /**
   * onBeforeUpdate: 响应式数据变化，DOM重新渲染前
   * 使用场景：访问更新前的 DOM 状态
   */
  onBeforeUpdate(() => {
    console.log('更新前 count:', count.value);
  });

  /**
   * onUpdated: DOM更新完成
   * 使用场景：
   * - 依赖更新后 DOM 的操作
   * - 第三方库的数据同步
   * 注意：避免在此修改响应式数据
   */
  onUpdated(() => {
    console.log('更新后 count:', count.value);
    // 需要访问最新DOM时使用
  });

  return { count };
}
```

#### 4. 卸载阶段 (Unmounting)

**Options API**
```javascript
// beforeUnmount (Vue3) / beforeDestroy (Vue2)
beforeUnmount() {
  // ✅ 实例仍完全可用
  // ✅ 最佳清理时机
  clearInterval(this.timerId);
  window.removeEventListener('resize', this.handleResize);
}

// unmounted (Vue3) / destroyed (Vue2)
unmounted() {
  // 实例已卸载，避免复杂操作
  console.log('组件已销毁');
}
```

**Composition API**
```javascript
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';

setup() {
  let timerId = null;

  onMounted(() => {
    // 启动定时器
    timerId = setInterval(() => {
      console.log('tick');
    }, 1000);
  });

  /**
   * onBeforeUnmount: 组件卸载前调用
   * 使用场景(重要)：
   * - 清除定时器 (setInterval, setTimeout)
   * - 移除事件监听器 (window, document)
   * - 取消网络请求
   * - 销毁第三方库实例
   * - 断开 WebSocket 连接
   */
  onBeforeUnmount(() => {
    clearInterval(timerId);
    console.log('清理定时器');
  });

  /**
   * onUnmounted: 组件完全卸载后
   * 使用场景：日志记录、分析统计
   */
  onUnmounted(() => {
    console.log('组件已完全卸载');
  });
}
```

#### 5. 缓存激活 (Keep-alive特有)

**Options API**
```javascript
// activated: 被 keep-alive 缓存的组件激活时
activated() {
  // 组件从缓存切入时触发
  // 适合刷新数据、恢复状态
  this.fetchLatestData();
}

// deactivated: 被 keep-alive 缓存的组件停用时
deactivated() {
  // 组件切出时触发
  // 适合暂停操作、保存状态
  this.pauseVideo();
}
```

**Composition API**
```javascript
import { ref, onActivated, onDeactivated } from 'vue';

setup() {
  const scrollPosition = ref(0);
  const listContainer = ref(null);

  /**
   * onActivated: 缓存组件激活
   * 使用场景：
   * - 刷新列表数据
   * - 恢复滚动位置
   * - 重新启动轮询
   */
  onActivated(() => {
    // 恢复滚动位置
    if (listContainer.value) {
      listContainer.value.scrollTop = scrollPosition.value;
    }
  });

  /**
   * onDeactivated: 缓存组件停用
   * 使用场景：
   * - 保存滚动位置
   * - 暂停视频/音频
   * - 停止轮询
   */
  onDeactivated(() => {
    // 保存滚动位置
    if (listContainer.value) {
      scrollPosition.value = listContainer.value.scrollTop;
    }
  });

  return { listContainer };
}
```

#### 6. 错误捕获

**Options API**
```javascript
/**
 * errorCaptured: 捕获子孙组件错误
 * @param {Error} err - 错误对象
 * @param {Component} instance - 出错组件实例
 * @param {String} info - 错误来源信息
 * @returns {Boolean} - false阻止错误传播
 */
errorCaptured(err, instance, info) {
  console.error('捕获错误:', err.message);
  console.log('出错组件:', instance.$options.name);
  console.log('错误来源:', info);

  // 上报错误日志
  // reportError({ err, info });

  // 返回 false 阻止错误继续向上传播
  return false;
}
```

**Composition API**
```javascript
import { onErrorCaptured } from 'vue';

/**
 * onErrorCaptured: 捕获后代组件错误
 * 使用场景：
 * - 统一错误处理
 * - 错误日志上报
 * - 降级UI渲染
 */
setup() {
  onErrorCaptured((err, instance, info) => {
    console.error('子组件错误:', {
      message: err.message,
      componentName: instance?.$options?.name,
      errorInfo: info
    });
  
    // 阻止错误传播到全局处理器
    return false;
  });
}
```

### 完整执行顺序示例

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

### 实用工具 API

```javascript
import { nextTick } from 'vue';

/**
 * nextTick: 等待下次 DOM 更新完成
 * 使用场景：
 * - 修改数据后立即操作更新后的 DOM
 * - 获取渲染后的元素尺寸
 */
async function updateAndReadDOM() {
  this.message = 'New Value';

  // ❌ 此时 DOM 未更新
  console.log(this.$el.textContent); // 旧值

  // ✅ 等待 DOM 更新
  await nextTick();
  console.log(this.$el.textContent); // 新值
}

// Composition API 写法
import { ref, nextTick } from 'vue';

setup() {
  const message = ref('Hello');
  const container = ref(null);

  async function update() {
    message.value = 'Updated';
    await nextTick();
    // 现在可以安全访问更新后的 DOM
    console.log(container.value.offsetHeight);
  }

  return { message, container, update };
}
```

### 关键注意事项

1. **setup 无 this**：Composition API 中不能使用 `this`，所有状态通过闭包访问
2. **DOM 操作时机**：必须在 `mounted` 后才能确保 DOM 存在
3. **资源清理**：定时器、监听器必须在 `beforeUnmount` 清理，防止内存泄漏
4. **避免 updated 修改数据**：可能触发无限更新循环
5. **v-if vs v-show**：`v-if` 切换触发完整生命周期，`v-show` 只切换显示
6. **keep-alive 缓存**：使用 `activated/deactivated` 而非 `mounted/unmounted`

---

## ⚡ 面试突击模式

### Vue 生命周期 面试速记

#### 30秒电梯演讲
Vue 生命周期分为创建、挂载、更新、卸载四个阶段。Vue 3 推荐 Composition API，在 `setup` 中用 `onMounted`、`onUnmounted` 等钩子函数管理组件状态。关键点：DOM 操作在 `mounted`，资源清理在 `beforeUnmount`，父子组件挂载顺序是"父创建→子创建→子挂载→父挂载"。

#### 高频考点(必背)

**考点1：setup 和 created 的区别**
`setup` 是 Composition API 入口，在 `beforeCreate` 之前执行，无 `this`，返回值暴露给模板。`created` 是 Options API 钩子，在实例创建后执行，可访问 `this`。setup 适合组合逻辑、处理异步，created 适合简单数据初始化。

**考点2：为什么 DOM 操作要在 mounted**
因为 `created` 时模板已编译但 DOM 未渲染，`$el` 为 `undefined`。只有 `mounted` 后组件的真实 DOM 才挂载到页面，此时可通过 `ref` 或 `$el` 访问元素，初始化第三方库如 ECharts。

**考点3：父子组件生命周期执行顺序**
挂载：父创建→父准备挂载→子创建→子挂载→父挂载（子先完成）。更新：父准备更新→子更新→子完成→父完成。卸载：父准备卸载→子卸载→子完成→父完成。核心是"子组件先完成"原则。

**考点4：beforeUnmount 清理什么资源**
必须清理：定时器(setInterval/setTimeout)、全局事件监听(window/document)、第三方库实例、WebSocket连接、取消未完成的网络请求。不清理会导致内存泄漏和意外行为。

**考点5：v-if 和 v-show 对生命周期的影响**
`v-if` 是条件渲染，false 时组件完全销毁，true 时重新创建，触发完整生命周期。`v-show` 只切换 CSS display，组件始终存在，只挂载一次，不触发销毁/创建钩子。需要频繁切换用 `v-show`。

**考点6：keep-alive 缓存组件的生命周期**
被 `<keep-alive>` 包裹的组件，切换时不销毁，使用 `activated` 和 `deactivated` 钩子。`activated` 在组件激活时调用，适合刷新数据；`deactivated` 在组件停用时调用，适合暂停操作。不会触发 `mounted/unmounted`。

**考点7：nextTick 的作用和使用场景**
`nextTick` 在下次 DOM 更新循环结束后执行回调。Vue 的 DOM 更新是异步的，修改数据后不会立即更新 DOM。使用 `await nextTick()` 可在数据改变后立即获取更新后的 DOM 状态，如获取元素尺寸、滚动位置。

**考点8：errorCaptured 的作用**
捕获所有后代组件的错误，接收三个参数：错误对象、出错实例、错误来源。返回 `false` 可阻止错误向上传播。用于统一错误处理、日志上报、降级 UI。不会捕获自身错误，只捕获子孙组件错误。

---

### 经典面试题

#### 题目1: 首次渲染时，Composition API 和 Options API 的钩子执行顺序是什么?

**思路**：setup 优先级最高 → Options API 按标准顺序 → Composition API 钩子先于同名 Options API 钩子

**答案**：
组件首次加载时执行顺序：
1. `setup` (Composition API 入口)
2. `beforeCreate` (Options API)
3. `created` (Options API)
4. `onBeforeMount` (Composition API)
5. `beforeMount` (Options API)
6. `onMounted` (Composition API)
7. `mounted` (Options API)

原因：setup 在实例初始化最早期执行，Composition API 的钩子内部优先注册，因此同阶段会先于 Options API 触发。

**代码框架**：
```javascript
import { ref, onBeforeMount, onMounted } from 'vue';

export default {
  name: 'LifecycleOrder',

  // Vue 3 Composition API (最先执行)
  setup() {
    console.log('1. setup'); // 第一个执行
  
    const message = ref('Hello');
  
    onBeforeMount(() => {
      console.log('4. onBeforeMount'); // 先于 Options API 的 beforeMount
    });
  
    onMounted(() => {
      console.log('6. onMounted'); // 先于 Options API 的 mounted
    });
  
    return { message };
  },

  // Vue 2 Options API
  beforeCreate() {
    console.log('2. beforeCreate'); // setup 之后
  },

  created() {
    console.log('3. created');
  },

  beforeMount() {
    console.log('5. beforeMount'); // 晚于 onBeforeMount
  },

  mounted() {
    console.log('7. mounted'); // 晚于 onMounted
  }
};
```

---

#### 题目2: 如何在 created 和 mounted 中正确发起数据请求？各有什么优缺点？

**思路**：created 更早但无 DOM → mounted 有 DOM 但稍晚 → 根据业务需求选择

**答案**：
两种方式都可行，选择取决于具体场景：

**在 created 中请求**：
- 优点：请求更早发起，可能更快获取数据
- 缺点：如果依赖 DOM(如获取容器尺寸)，需要在 mounted 中处理
- 适用：纯数据请求，不涉及 DOM 操作

**在 mounted 中请求**：
- 优点：DOM 已就绪，可同时处理 UI 和数据
- 缺点：比 created 稍晚一点
- 适用：需要 DOM 配合的场景(如图表初始化)

**推荐**：Composition API 中在 `onMounted` 请求，代码更清晰；如果确定不需要 DOM，可在 `setup` 中使用 `async/await`。

**代码框架**：
```javascript
import { ref, onMounted } from 'vue';
import axios from 'axios';

/**
 * 数据请求的两种时机对比
 */
export default {
  setup() {
    const userData = ref(null);
    const loading = ref(false);
    const chartContainer = ref(null);
  
    // ===== 方案1: 在 setup 中请求(相当于 created) =====
    // 适合：纯数据获取，不依赖 DOM
    /*
    (async () => {
      loading.value = true;
      try {
        const response = await axios.get('/api/user');
        userData.value = response.data;
      } finally {
        loading.value = false;
      }
    })();
    */
  
    // ===== 方案2: 在 onMounted 中请求(推荐) =====
    // 适合：需要 DOM 配合的场景
    onMounted(async () => {
      loading.value = true;
      try {
        // 先获取数据
        const response = await axios.get('/api/chart-data');
        userData.value = response.data;
      
        // 再初始化图表(需要 DOM)
        if (chartContainer.value) {
          // initChart(chartContainer.value, userData.value);
        }
      } finally {
        loading.value = false;
      }
    });
  
    return { userData, loading, chartContainer };
  },

  // Options API 对比
  data() {
    return {
      userData: null,
      loading: false
    };
  },

  // 在 created 请求
  async created() {
    this.loading = true;
    try {
      const response = await axios.get('/api/user');
      this.userData = response.data;
    } finally {
      this.loading = false;
    }
  },

  // 或在 mounted 请求
  async mounted() {
    // 同时处理数据和 DOM
  }
};
```

---

#### 题目3: 实现一个倒计时组件，要求组件销毁时自动清理定时器

**思路**：onMounted 启动定时器 → 保存 timerId → onBeforeUnmount 清除

**答案**：
核心要点：
1. 在 `onMounted` 中用 `setInterval` 启动定时器
2. 将 timerId 保存在 `setup` 作用域的变量中
3. 在 `onBeforeUnmount` 中用 `clearInterval` 清除
4. 确保组件卸载时定时器不再运行，防止内存泄漏

**代码框架**：
```javascript
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

/**
 * 倒计时组件 - 演示定时器的正确清理
 * @example <Countdown :seconds="60" @finish="handleFinish" />
 */
export default {
  name: 'Countdown',

  props: {
    // 初始秒数
    seconds: {
      type: Number,
      required: true,
      validator: (val) => val > 0
    }
  },

  emits: ['finish'], // Vue 3 推荐声明事件

  setup(props, { emit }) {
    // 响应式数据
    const remaining = ref(props.seconds);
  
    // 定时器 ID (非响应式)
    let timerId = null;
  
    // 格式化时间显示: "01:30"
    const displayTime = computed(() => {
      const mins = Math.floor(remaining.value / 60);
      const secs = remaining.value % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    });
  
    /**
     * 启动倒计时
     * 在组件挂载后开始计时
     */
    const startCountdown = () => {
      timerId = setInterval(() => {
        remaining.value--;
      
        // 倒计时结束
        if (remaining.value <= 0) {
          clearInterval(timerId); // 清除定时器
          emit('finish'); // 触发完成事件
          console.log('倒计时结束');
        }
      }, 1000);
    };
  
    /**
     * 生命周期：挂载后启动定时器
     */
    onMounted(() => {
      console.log('组件挂载，启动倒计时');
      startCountdown();
    });
  
    /**
     * 生命周期：卸载前清理定时器
     * 重要：必须清理，否则组件销毁后定时器仍在运行
     */
    onBeforeUnmount(() => {
      if (timerId) {
        clearInterval(timerId);
        console.log('组件卸载，清除定时器');
      }
    });
  
    // 手动重置功能(可选)
    const reset = () => {
      if (timerId) {
        clearInterval(timerId);
      }
      remaining.value = props.seconds;
      startCountdown();
    };
  
    return {
      remaining,
      displayTime,
      reset
    };
  }
};
```

**Options API 版本对比**：
```javascript
export default {
  name: 'CountdownOptionsAPI',

  props: {
    seconds: { type: Number, required: true }
  },

  data() {
    return {
      remaining: this.seconds,
      timerId: null // ⚠️ 注意：需要存在 data 中以便访问 this.timerId
    };
  },

  computed: {
    displayTime() {
      const mins = Math.floor(this.remaining / 60);
      const secs = this.remaining % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  },

  mounted() {
    this.startCountdown();
  },

  beforeUnmount() { // Vue 3 名称
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  },

  methods: {
    startCountdown() {
      this.timerId = setInterval(() => {
        this.remaining--;
        if (this.remaining <= 0) {
          clearInterval(this.timerId);
          this.$emit('finish');
        }
      }, 1000);
    }
  }
};
```

---

#### 题目4: 父组件有数据 A 传给子组件，父组件修改 A 后，子组件会触发哪些生命周期钩子？

**思路**：响应式对象共享引用 → 父修改触发子组件 re-render → 触发 beforeUpdate 和 updated

**答案**：
会触发子组件的 `beforeUpdate` 和 `updated` 钩子。

原因：
1. Vue 的响应式是基于引用的
2. 父组件修改对象属性时，子组件持有的是同一个响应式对象的引用
3. 响应式系统侦测到变化，触发子组件重新渲染
4. 渲染前调用 `beforeUpdate`，渲染后调用 `updated`

注意：如果父组件替换整个对象(而非修改属性)，也会触发更新。

**代码框架**：
```javascript
// ===== 父组件 ParentComponent.vue =====
import { ref, reactive } from 'vue';
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  setup() {
    /**
     * 响应式对象，传递给子组件
     * 注意：使用 reactive，子组件接收的是引用
     */
    const userInfo = reactive({
      name: 'Alice',
      age: 25,
      address: {
        city: 'Beijing'
      }
    });
  
    /**
     * 修改对象属性
     * 会触发子组件的 beforeUpdate 和 updated
     */
    const updateUserName = () => {
      // 直接修改属性
      userInfo.name = 'Bob';
      console.log('父组件修改了 userInfo.name');
    };
  
    /**
     * 修改嵌套对象
     * 同样会触发子组件更新
     */
    const updateCity = () => {
      userInfo.address.city = 'Shanghai';
    };
  
    /**
     * 替换整个对象 (如果使用 ref)
     * 也会触发子组件更新
     */
    const userInfoRef = ref({ name: 'Alice', age: 25 });
    const replaceUser = () => {
      userInfoRef.value = { name: 'Charlie', age: 30 };
    };
  
    return {
      userInfo,
      updateUserName,
      updateCity
    };
  }
};

// ===== 子组件 ChildComponent.vue =====
import { onBeforeUpdate, onUpdated } from 'vue';

export default {
  name: 'ChildComponent',

  /**
   * 接收父组件传递的响应式对象
   */
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    /**
     * 当父组件修改 userInfo 的属性时触发
     * 此时 props.userInfo 已是新值，但 DOM 未更新
     */
    onBeforeUpdate(() => {
      console.log('子组件 beforeUpdate');
      console.log('  - props.userInfo.name:', props.userInfo.name); // 新值
      console.log('  - DOM 中的值:', '(此时 DOM 还未更新)');
    });
  
    /**
     *续接题目4代码框架：
```javascript
    /**
     * DOM 更新完成后触发
     * 此时 props.userInfo 和 DOM 都已更新
     */
    onUpdated(() => {
      console.log('子组件 updated');
      console.log('  - props.userInfo.name:', props.userInfo.name); // 新值
      console.log('  - DOM 已更新为最新值');
    });
  
    return {};
  }
};

// ===== Options API 对比写法 =====
export default {
  name: 'ChildComponentOptionsAPI',

  props: {
    userInfo: { type: Object, required: true }
  },

  beforeUpdate() {
    console.log('子组件 beforeUpdate (Options API)');
    console.log('  - this.userInfo.name:', this.userInfo.name);
  },

  updated() {
    console.log('子组件 updated (Options API)');
    console.log('  - DOM 已同步更新');
  }
};
```

---

#### 题目5: 如何在 keep-alive 缓存的列表组件中，保存和恢复滚动位置？

**思路**：deactivated 保存滚动位置 → activated 恢复滚动位置 → 使用 ref 访问容器

**答案**：
核心步骤：
1. 使用 `ref` 获取滚动容器的 DOM 引用
2. 在 `onDeactivated` 中保存 `scrollTop` 到响应式变量
3. 在 `onActivated` 中将保存的值恢复到容器的 `scrollTop`
4. 确保 `<keep-alive>` 正确包裹组件

**代码框架**：
```javascript
// ===== ListPage.vue (被 keep-alive 缓存的列表页) =====
import { ref, onActivated, onDeactivated, onMounted } from 'vue';

/**
 * 列表页组件 - 演示滚动位置的保存与恢复
 * 使用场景：用户从列表进入详情，返回时恢复到之前的浏览位置
 */
export default {
  name: 'ListPage',

  setup() {
    // 滚动容器的 DOM 引用
    const listContainer = ref(null);
  
    // 保存的滚动位置(像素值)
    const scrollPosition = ref(0);
  
    // 列表数据
    const items = ref(Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`
    })));
  
    /**
     * 组件激活时(从其他页面返回)
     * 恢复之前保存的滚动位置
     */
    onActivated(() => {
      console.log('列表页激活，恢复滚动位置:', scrollPosition.value);
    
      // 使用 nextTick 确保 DOM 已完全渲染
      // 在某些情况下，DOM 可能还在恢复中
      if (listContainer.value) {
        // 直接恢复可能不够，建议使用 nextTick
        requestAnimationFrame(() => {
          listContainer.value.scrollTop = scrollPosition.value;
        });
      }
    });
  
    /**
     * 组件停用时(切换到其他页面)
     * 保存当前的滚动位置
     */
    onDeactivated(() => {
      if (listContainer.value) {
        scrollPosition.value = listContainer.value.scrollTop;
        console.log('列表页停用，保存滚动位置:', scrollPosition.value);
      }
    });
  
    /**
     * 首次挂载时(可选)
     * 如果需要在首次加载时就设置初始滚动位置
     */
    onMounted(() => {
      console.log('列表页首次挂载');
      // 如果有从 localStorage 或 Vuex 恢复的位置
      // listContainer.value.scrollTop = savedPosition;
    });
  
    // 跳转到详情页
    const goToDetail = (id) => {
      // 注意：离开前会自动触发 onDeactivated 保存位置
      // this.$router.push(`/detail/${id}`);
    };
  
    return {
      listContainer,
      items,
      goToDetail
    };
  }
};

// ===== 模板部分 =====
/*
<template>
  <div 
    ref="listContainer" 
    class="list-container"
    style="height: 100vh; overflow-y: auto;"
  >
    <div 
      v-for="item in items" 
      :key="item.id"
      @click="goToDetail(item.id)"
      class="list-item"
    >
      {{ item.title }}
    </div>
  </div>
</template>
*/

// ===== 路由配置 (App.vue 或 Router) =====
/*
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
*/
```

**Options API 版本对比**：
```javascript
export default {
  name: 'ListPageOptionsAPI',

  data() {
    return {
      scrollPosition: 0,
      items: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`
      }))
    };
  },

  /**
   * 组件激活时恢复滚动位置
   */
  activated() {
    this.$nextTick(() => {
      const container = this.$refs.listContainer;
      if (container) {
        container.scrollTop = this.scrollPosition;
      }
    });
  },

  /**
   * 组件停用时保存滚动位置
   */
  deactivated() {
    const container = this.$refs.listContainer;
    if (container) {
      this.scrollPosition = container.scrollTop;
    }
  },

  methods: {
    goToDetail(id) {
      this.$router.push(`/detail/${id}`);
    }
  }
};
```

**进阶优化**：
```javascript
import { ref, onActivated, onDeactivated, watch } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 更健壮的滚动位置管理
 * 支持多个列表页、持久化存储
 */
export default {
  setup() {
    const route = useRoute();
    const listContainer = ref(null);
  
    // 使用路由路径作为 key，支持多个页面
    const scrollKey = `scroll_${route.path}`;
  
    // 从 sessionStorage 恢复位置(刷新页面后仍有效)
    const scrollPosition = ref(() => {
      const saved = sessionStorage.getItem(scrollKey);
      return saved ? Number(saved) : 0;
    });
  
    onActivated(() => {
      // 延迟恢复，确保列表数据已加载
      setTimeout(() => {
        if (listContainer.value) {
          listContainer.value.scrollTop = scrollPosition.value;
        }
      }, 0);
    });
  
    onDeactivated(() => {
      if (listContainer.value) {
        scrollPosition.value = listContainer.value.scrollTop;
        // 持久化到 sessionStorage
        sessionStorage.setItem(scrollKey, String(scrollPosition.value));
      }
    });
  
    return { listContainer };
  }
};
```

---

#### 题目6: 实现一个 Modal 组件，要求打开时禁止背景页面滚动，关闭时恢复

**思路**：watch 监听显示状态 → 打开时给 body 添加样式 → 关闭时移除 → beforeUnmount 确保清理

**答案**：
核心要点：
1. 使用 `watch` 监听 Modal 的显示状态(props 或内部状态)
2. 打开时给 `document.body` 添加 `overflow: hidden` 样式
3. 关闭时移除该样式，恢复滚动
4. 在 `onBeforeUnmount` 中确保组件销毁时清理副作用

**代码框架**：
```javascript
// ===== Modal.vue =====
import { ref, watch, onBeforeUnmount } from 'vue';

/**
 * 模态框组件 - 演示副作用的管理
 * @example 
 * <Modal v-model:visible="showModal">
 *   <p>Modal Content</p>
 * </Modal>
 */
export default {
  name: 'Modal',

  props: {
    // v-model:visible 双向绑定
    visible: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:visible'], // Vue 3 推荐显式声明

  setup(props, { emit }) {
    // 内部状态管理
    const isOpen = ref(props.visible);
  
    // CSS class 名称
    const LOCK_CLASS = 'modal-open';
  
    /**
     * 锁定页面滚动
     * 添加 CSS class 到 body
     */
    const lockScroll = () => {
      document.body.classList.add(LOCK_CLASS);
      // 或直接设置样式
      // document.body.style.overflow = 'hidden';
      console.log('页面滚动已锁定');
    };
  
    /**
     * 解锁页面滚动
     * 移除 CSS class
     */
    const unlockScroll = () => {
      document.body.classList.remove(LOCK_CLASS);
      // document.body.style.overflow = '';
      console.log('页面滚动已恢复');
    };
  
    /**
     * 监听 props.visible 变化
     * 根据状态锁定/解锁滚动
     */
    watch(
      () => props.visible,
      (newValue) => {
        isOpen.value = newValue;
      
        if (newValue) {
          lockScroll();
        } else {
          unlockScroll();
        }
      },
      { immediate: true } // 初始化时立即执行
    );
  
    /**
     * 组件卸载前清理
     * 重要：确保组件销毁时解锁滚动
     */
    onBeforeUnmount(() => {
      unlockScroll();
      console.log('Modal 组件卸载，确保滚动已解锁');
    });
  
    /**
     * 关闭 Modal
     */
    const close = () => {
      emit('update:visible', false);
    };
  
    /**
     * 点击遮罩层关闭
     */
    const handleMaskClick = () => {
      close();
    };
  
    return {
      isOpen,
      close,
      handleMaskClick
    };
  }
};

// ===== 配套样式 =====
/*
<style>
/* 全局样式：锁定滚动 */
body.modal-open {
  overflow: hidden;
  /* 防止页面抖动(滚动条消失导致) */
  padding-right: 17px; /* 滚动条宽度,需根据实际调整 */
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 1001;
}
</style>
*/

// ===== 模板部分 =====
/*
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-mask" @click="handleMaskClick">
        <div class="modal-container" @click.stop>
          <button @click="close" class="close-btn">×</button>
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
*/
```

**Options API 版本**：
```javascript
export default {
  name: 'ModalOptionsAPI',

  props: {
    visible: { type: Boolean, default: false }
  },

  watch: {
    /**
     * 监听 visible 变化
     */
    visible: {
      handler(newValue) {
        if (newValue) {
          document.body.classList.add('modal-open');
        } else {
          document.body.classList.remove('modal-open');
        }
      },
      immediate: true
    }
  },

  /**
   * 组件卸载前确保清理
   */
  beforeUnmount() {
    document.body.classList.remove('modal-open');
  },

  methods: {
    close() {
      this.$emit('update:visible', false);
    }
  }
};
```

**进阶：支持嵌套 Modal**：
```javascript
/**
 * 支持多个 Modal 同时打开
 * 使用计数器管理锁定状态
 */
let lockCount = 0; // 全局计数器

export default {
  setup(props) {
    watch(
      () => props.visible,
      (newValue) => {
        if (newValue) {
          lockCount++;
          if (lockCount === 1) {
            // 只在第一个 Modal 打开时锁定
            document.body.classList.add('modal-open');
          }
        } else {
          lockCount--;
          if (lockCount === 0) {
            // 所有 Modal 都关闭后才解锁
            document.body.classList.remove('modal-open');
          }
        }
      },
      { immediate: true }
    );
  
    onBeforeUnmount(() => {
      if (props.visible) {
        lockCount--;
        if (lockCount === 0) {
          document.body.classList.remove('modal-open');
        }
      }
    });
  }
};
```

---

#### 题目7: 如何捕获子组件中的错误并进行统一处理？

**思路**：errorCaptured 捕获后代组件错误 → 返回 false 阻止传播 → 统一日志上报

**答案**：
使用 `errorCaptured` / `onErrorCaptured` 钩子：
1. 在父组件或顶层组件中定义 `errorCaptured`
2. 接收三个参数：错误对象、出错实例、错误来源信息
3. 返回 `false` 阻止错误继续向上传播
4. 在钩子中统一处理：日志上报、用户提示、降级 UI

**代码框架**：
```javascript
// ===== ErrorBoundary.vue (错误边界组件) =====
import { ref, onErrorCaptured } from 'vue';

/**
 * 错误边界组件 - 捕获并处理子组件错误
 * @example
 * <ErrorBoundary>
 *   <RiskyComponent />
 * </ErrorBoundary>
 */
export default {
  name: 'ErrorBoundary',

  setup() {
    // 是否发生错误
    const hasError = ref(false);
  
    // 错误详情
    const errorInfo = ref({
      message: '',
      componentName: '',
      errorDetail: ''
    });
  
    /**
     * 捕获所有后代组件的错误
     * @param {Error} err - 错误对象
     * @param {ComponentPublicInstance} instance - 出错的组件实例
     * @param {string} info - 错误来源信息，如 'render function' 或生命周期名
     * @returns {boolean} - 返回 false 阻止错误传播
     */
    onErrorCaptured((err, instance, info) => {
      console.error('=== 捕获到子组件错误 ===');
      console.error('错误信息:', err.message);
      console.error('错误栈:', err.stack);
      console.error('出错组件:', instance?.$options?.name || 'Unknown');
      console.error('错误来源:', info);
    
      // 保存错误信息用于 UI 展示
      hasError.value = true;
      errorInfo.value = {
        message: err.message,
        componentName: instance?.$options?.name || 'Unknown Component',
        errorDetail: info
      };
    
      // === 统一错误处理 ===
    
      // 1. 上报错误到监控服务
      reportErrorToService({
        message: err.message,
        stack: err.stack,
        componentName: instance?.$options?.name,
        route: window.location.href,
        timestamp: new Date().toISOString()
      });
    
      // 2. 显示用户友好的错误提示
      // showToast('抱歉,页面出现了一些问题');
    
      // 3. 降级处理：显示备用 UI
      // (通过 hasError 状态在模板中展示降级内容)
    
      // 返回 false 阻止错误继续向上传播到全局错误处理器
      // 返回 true 或不返回则错误会继续传播
      return false;
    });
  
    /**
     * 模拟的错误上报函数
     */
    function reportErrorToService(errorData) {
      // 实际项目中替换为真实的错误上报逻辑
      console.log('上报错误到服务:', errorData);
    
      // 示例：使用 fetch 发送到后端
      /*
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      });
      */
    }
  
    /**
     * 重置错误状态(允许用户重试)
     */
    const resetError = () => {
      hasError.value = false;
      errorInfo.value = {
        message: '',
        componentName: '',
        errorDetail: ''
      };
    };
  
    return {
      hasError,
      errorInfo,
      resetError
    };
  }
};

// ===== 模板部分 =====
/*
<template>
  <div class="error-boundary">
    <!-- 发生错误时显示降级 UI -->
    <div v-if="hasError" class="error-fallback">
      <h2>⚠️ 页面出现了问题</h2>
      <p>错误信息: {{ errorInfo.message }}</p>
      <p>出错组件: {{ errorInfo.componentName }}</p>
      <p>错误来源: {{ errorInfo.errorDetail }}</p>
      <button @click="resetError">重试</button>
    </div>
  
    <!-- 正常渲染子组件 -->
    <slot v-else></slot>
  </div>
</template>
*/

// ===== Options API 版本 =====
export default {
  name: 'ErrorBoundaryOptionsAPI',

  data() {
    return {
      hasError: false,
      errorInfo: {}
    };
  },

  /**
   * Options API 的 errorCaptured 钩子
   */
  errorCaptured(err, instance, info) {
    console.error('捕获错误:', err.message);
  
    this.hasError = true;
    this.errorInfo = {
      message: err.message,
      componentName: instance.$options.name,
      errorDetail: info
    };
  
    // 错误上报
    this.reportError(err, instance, info);
  
    // 阻止传播
    return false;
  },

  methods: {
    reportError(err, instance, info) {
      // 错误上报逻辑
      console.log('上报错误:', { err, instance, info });
    },
  
    resetError() {
      this.hasError = false;
      this.errorInfo = {};
    }
  }
};
```

**使用示例**：
```javascript
// ===== App.vue (顶层使用错误边界) =====
import ErrorBoundary from './components/ErrorBoundary.vue';
import HomePage from './views/HomePage.vue';

export default {
  components: { ErrorBoundary, HomePage },

  template: `
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  `
};

// ===== RiskyComponent.vue (可能出错的子组件) =====
export default {
  setup() {
    const triggerError = () => {
      // 模拟运行时错误
      throw new Error('Something went wrong!');
    };
  
    return { triggerError };
  },

  template: `
    <div>
      <button @click="triggerError">触发错误</button>
    </div>
  `
};
```

**全局错误处理 vs errorCaptured**：
```javascript
// ===== main.js (全局错误处理) =====
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

/**
 * 全局错误处理器
 * 捕获所有未被 errorCaptured 阻止的错误
 */
app.config.errorHandler = (err, instance, info) => {
  console.error('=== 全局错误处理器 ===');
  console.error('错误:', err);
  console.error('组件:', instance);
  console.error('来源:', info);

  // 全局统一上报
  // reportToMonitoring(err);
};

app.mount('#app');

/**
 * 区别：
 * - errorCaptured: 组件级别，可在特定组件树中处理错误
 * - errorHandler: 全局级别，兜底所有未处理的错误
 * - 推荐：errorCaptured 处理局部错误 + errorHandler 全局兜底
 */
```

---

#### 题目8: 实现一个 WebSocket 连接组件，要求连接在组件挂载时建立，卸载时断开

**思路**：onMounted 建立连接 → 保存连接实例 → onBeforeUnmount 断开连接

**答案**：
核心要点：
1. 在 `onMounted` 中建立 WebSocket 连接
2. 保存连接实例到 `setup` 作用域
3. 监听消息、错误、关闭事件
4. 在 `onBeforeUnmount` 中调用 `close()` 断开连接，释放资源

**代码框架**：
```javascript
// ===== WebSocketChat.vue =====
import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * WebSocket 聊天组件 - 演示连接的生命周期管理
 */
export default {
  name: 'WebSocketChat',

  setup() {
    // WebSocket 连接实例 (非响应式)
    let ws = null;
  
    // 响应式数据
    const messages = ref([]); // 消息列表
    const isConnected = ref(false); // 连接状态
    const inputMessage = ref(''); // 输入框内容
  
    /**
     * 建立 WebSocket 连接
     */
    const connect = () => {
      // WebSocket 服务器地址
      const wsUrl = 'ws://localhost:8080/chat';
    
      ws = new WebSocket(wsUrl);
    
      /**
       * 连接打开时触发
       */
      ws.onopen = () => {
        console.log('WebSocket 连接已建立');
        isConnected.value = true;
      
        // 发送认证消息(示例)
        // ws.send(JSON.stringify({ type: 'auth', token: 'xxx' }));
      };
    
      /**
       * 接收到消息时触发
       */
      ws.onmessage = (event) => {
        console.log('收到消息:', event.data);
      
        try {
          const data = JSON.parse(event.data);
          messages.value.push({
            id: Date.now(),
            text: data.text,
            sender: data.sender,
            timestamp: new Date().toLocaleTimeString()
          });
        } catch (err) {
          console.error('解析消息失败:', err);
        }
      };
    
      /**
       * 连接错误时触发
       */
      ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        isConnected.value = false;
      };
    
      /**
       * 连接关闭时触发
       */
      ws.onclose = (event) => {
        console.log('WebSocket 连接已关闭', event.code, event.reason);
        isConnected.value = false;
      
        // 可选：自动重连逻辑
        // if (!event.wasClean) {
        //   setTimeout(connect, 3000);
        // }
      };
    };
  
    /**
     * 断开 WebSocket 连接
     */
    const disconnect = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(1000, '用户主动断开'); // 1000 表示正常关闭
        console.log('WebSocket 连接已主动断开');
      }
    };
  
    /**
     * 发送消息
     */
    const sendMessage = () => {
      if (!inputMessage.value.trim()) return;
    
      if (ws && ws.readyState === WebSocket.OPEN) {
        const message = {
          type: 'message',
          text: inputMessage.value,
          timestamp: Date.now()
        };
      
        ws.send(JSON.stringify(message));
        console.log('发送消息:', message);
      
        // 清空输入框
        inputMessage.value = '';
      } else {
        console.warn('WebSocket 未连接');
      }
    };
  
    /**
     * 生命周期：挂载后建立连接
     */
    onMounted(() => {
      console.log('组件挂载，建立 WebSocket 连接');
      connect();
    });
  
    /**
     * 生命周期：卸载前断开连接
     * 重要：必须断开，否则连接会泄漏
     */
    onBeforeUnmount(() => {
      console.log('组件卸载，断开 WebSocket 连接');
      disconnect();
    });
  
    return {
      messages,
      isConnected,
      inputMessage,
      sendMessage,
      disconnect
    };
  }
};

// ===== 模板部分 =====
/*
<template>
  <div class="websocket-chat">
    <div class="status">
      连接状态: 
      <span :class="{ connected: isConnected, disconnected: !isConnected }">
        {{ isConnected ? '已连接' : '未连接' }}
      </span>
    </div>
  
    <div class="messages">
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="message"
      >
        <span class="time">{{ msg.timestamp }}</span>
        <span class="sender">{{ msg.sender }}:</span>
        <span class="text">{{ msg.text }}</span>
      </div>
    </div>
  
    <div class="input-area">
      <input 
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        :disabled="!isConnected"
      />
      <button 
        @click="sendMessage"
        :disabled="!isConnected"
      >
        发送
      </button>
    </div>
  </div>
</template>
*/
```

**Options API 版本**：
```javascript
export default {
  name: 'WebSocketChatOptionsAPI',

  data() {
    return {
      ws: null,
      messages: [],
      isConnected: false,
      inputMessage: ''
    };
  },

  mounted() {
    this.connect();
  },

  beforeUnmount() {
    this.disconnect();
  },

  methods: {
    connect() {
      this.ws = new WebSocket('ws://localhost:8080/chat');
    
      this.ws.onopen = () => {
        this.isConnected = true;
      };
    
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messages.push(data);
      };
    
      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
      };
    
      this.ws.onclose = () => {
        this.isConnected = false;
      };
    },
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
      }
    },
  
    sendMessage() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          text: this.inputMessage,
          timestamp: Date.now()
        }));
        this.inputMessage = '';
      }
    }
  }
};
```

