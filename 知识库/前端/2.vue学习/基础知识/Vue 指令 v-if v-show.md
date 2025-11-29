# Vue 指令 v-if vs v-show 精华学习资料

## 📚 日常学习模式

**[标签: Vue指令, v-if, v-show, 条件渲染]**

### 核心概念

**v-if** 和 **v-show** 是 Vue 中控制元素显示/隐藏的两个指令，但实现机制完全不同：

- **v-if**: 条件渲染，控制 DOM 节点的创建/销毁
- **v-show**: 样式切换，控制 CSS display 属性

### 实现原理对比

| 特性 | v-if | v-show |
|------|------|--------|
| **DOM操作** | 条件为false时节点不存在 | 节点始终存在，仅改变display |
| **初始渲染** | false时开销低（不渲染） | 始终渲染，开销高 |
| **切换开销** | 高（销毁/重建DOM + 生命周期） | 低（仅修改CSS） |
| **生命周期** | 完整执行mounted/unmounted | 不触发生命周期钩子 |
| **配套指令** | 支持v-else-if/v-else | 无 |
| **template支持** | 支持 | 不支持（无实体DOM） |

### 使用场景

**选择 v-if 的场景：**
1. 条件很少改变（如权限控制、一次性判断）
2. 需要完全卸载组件释放资源（如复杂弹窗、视频播放器）
3. 需要 v-else-if/v-else 逻辑链
4. 懒加载场景（如Tab中的重图表组件）

**选择 v-show 的场景：**
1. 频繁切换显示状态（如折叠面板、FAQ列表）
2. 需要保留组件状态（如多步骤表单）
3. 简单的显示/隐藏切换

### 核心代码示例

```javascript
/**
 * 基础使用对比
 */
// v-if: 条件为false时DOM中不存在
<div v-if="isAdmin">管理员面板</div>

// v-show: 条件为false时添加 style="display: none"
<div v-show="isVisible">可频繁切换的内容</div>

/**
 * 场景1: 频繁切换 - 推荐 v-show
 * 用户可能频繁展开/折叠的侧边栏
 */
<aside v-show="sidebarOpen">
  <input v-model="userInput" placeholder="输入会保留">
</aside>

/**
 * 场景2: 权限控制 - 推荐 v-if
 * 用户权限固定，不需要频繁切换
 */
<nav-item v-if="user.role === 'admin'">系统设置</nav-item>

/**
 * 场景3: 逻辑链 - 必须用 v-if
 */
<div v-if="status === 'loading'">加载中...</div>
<div v-else-if="status === 'success'">成功</div>
<div v-else>失败</div>

/**
 * 场景4: 保留状态 - 必须用 v-show
 * 多步骤表单，切换步骤时保留用户输入
 */
<form-step-1 v-show="currentStep === 1" />
<form-step-2 v-show="currentStep === 2" />

/**
 * Vue 3 Composition API 完整示例
 */
import { ref, onMounted, onUnmounted } from 'vue';

const MyComponent = {
  setup() {
    const isVisible = ref(true);
    const showHeavyComponent = ref(false);
  
    // v-show场景：频繁切换
    const togglePanel = () => {
      isVisible.value = !isVisible.value;
    };
  
    // v-if场景：资源管理
    const loadHeavyComponent = () => {
      showHeavyComponent.value = true;
    };
  
    return { isVisible, showHeavyComponent, togglePanel, loadHeavyComponent };
  }
};
```

### 性能优化要点

```javascript
/**
 * 反例：v-if 和 v-for 同时使用
 * Vue 3中 v-if 优先级高于 v-for，会导致性能问题
 */
// ❌ 不推荐
<li v-for="user in users" v-if="user.isActive">{{ user.name }}</li>

/**
 * 正确做法：先用 computed 过滤
 */
// ✅ 推荐
const activeUsers = computed(() => users.value.filter(u => u.isActive));
<li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li>

/**
 * 资源密集型组件的懒加载
 * 使用 v-if 实现按需加载
 */
<heavy-chart v-if="chartTabActive" @mounted="onChartReady" />
```

### 关键知识点

1. **v-show 不支持 `<template>`**：因为 template 无实体 DOM 节点，无法设置 style
2. **生命周期差异**：v-if 切换时会触发完整的 created/mounted/unmounted，v-show 不会
3. **与 transition 配合**：两者都支持过渡动画，但机制不同（DOM添加/删除 vs CSS类切换）
4. **状态保留**：v-if 重建组件会丢失状态，v-show 保留状态
5. **内存管理**：v-if 隐藏时释放资源（如定时器），v-show 不会

### 快速决策流程图

```
需要条件渲染？
  ↓
是否频繁切换？
  ├─ 是 → 用 v-show
  └─ 否 → 需要保留状态？
          ├─ 是 → 用 v-show
          └─ 否 → 用 v-if
```

---

## ⚡ 面试突击模式

### [Vue 指令 v-if vs v-show] 面试速记

#### 30秒电梯演讲

"v-if 是真正的条件渲染，通过操作 DOM 实现元素的创建和销毁；v-show 是基于 CSS 的切换，元素始终在 DOM 中，只是改变 display 属性。v-if 初始开销低但切换成本高，适合条件很少改变的场景；v-show 初始开销高但切换成本低，适合频繁切换的场景。"

---

### 高频考点（必背）

**考点1: 实现原理的本质区别**
- v-if 控制 DOM 节点的存在与否（结构层面），条件为 false 时节点完全不在 DOM 树中
- v-show 控制 CSS display 属性（样式层面），节点始终存在 DOM 树中
- v-if 切换会触发组件完整生命周期，v-show 不会触发生命周期钩子

**考点2: 性能开销对比**
- v-if 初始渲染开销低（false时不渲染），切换开销高（销毁/重建DOM、执行生命周期）
- v-show 初始渲染开销高（始终渲染），切换开销低（仅修改CSS属性）
- 选择依据：频繁切换用 v-show，条件很少改变用 v-if

**考点3: 使用场景判断**
- v-if：权限控制、一次性条件、需要销毁释放资源、懒加载、逻辑链（v-else-if/v-else）
- v-show：频繁切换、需要保留组件状态、简单的显示隐藏

**考点4: 与 v-for 的配合使用**
- Vue 3 中 v-if 优先级高于 v-for，Vue 2 中 v-for 优先级高于 v-if
- 不推荐在同一元素上同时使用，应先用 computed 过滤数据再循环

**考点5: 生命周期影响**
- v-if 从 false→true: 触发 setup/onBeforeMount/onMounted
- v-if 从 true→false: 触发 onBeforeUnmount/onUnmounted
- v-show: 不触发任何生命周期钩子，组件只在宿主组件挂载时挂载一次

---

### 经典面试题
#### 题目1: 请说明 v-if 和 v-show 在编译阶段的处理差异

**思路**: 从模板编译的角度分析两者的转换结果

**答案**: 在 Vue 的模板编译阶段，v-if 会被转换成一个三元表达式，生成渲染函数时会创建一个注释节点（`<!--v-if-->`）作为占位符。当条件为真时，才会调用渲染函数创建真实 DOM。而 v-show 被编译成普通 DOM 元素，并附加一个指令对象，该指令在运行时根据条件动态修改元素的 `style.display` 属性。本质上 v-if 是编译时的条件分支，v-show 是运行时的样式切换。
#### 题目2: 在频繁切换的场景下，为什么 v-show 性能更好？

**思路**: 从 DOM 操作和浏览器渲染原理分析

**答案**:
v-show 性能更好的原因有三点：1) 只修改 CSS display 属性，不涉及 DOM 节点的创建和销毁；2) 不触发组件的生命周期钩子，避免了额外的 JavaScript 执行开销；3) 浏览器处理 CSS 属性修改的成本远低于 DOM 重排（reflow）和重绘（repaint）。而 v-if 每次切换都需要完整的 DOM 操作、组件实例化/销毁、事件监听器的添加/移除，这些操作的累积开销在频繁切换时会非常明显。

**代码框架**:
```javascript
/**
 * v-show 频繁切换示例
 * 性能分析：只修改CSS，开销极小
 */
import { ref } from 'vue';

const FrequentToggle = {
  setup() {
    const visible = ref(true);
  
    // 每100ms切换一次，v-show 可以轻松处理
    setInterval(() => {
      visible.value = !visible.value;
    }, 100);
  
    return { visible };
  },
  template: `
    <!-- 只修改 style.display，浏览器只需重绘 -->
    <div v-show="visible">频繁切换的内容</div>
  `
};

/**
 * v-if 频繁切换示例（性能问题）
 * 性能分析：每次都要销毁/重建DOM
 */
const FrequentToggleProblem = {
  setup() {
    const visible = ref(true);
  
    // 同样的频率，v-if 会导致性能问题
    setInterval(() => {
      visible.value = !visible.value;
    }, 100);
  
    return { visible };
  },
  template: `
    <!-- 每次切换都要执行完整的挂载/卸载流程 -->
    <heavy-component v-if="visible" />
  `
};
```

---

#### 题目3: 什么情况下即使频繁切换也要用 v-if？

**思路**: 考虑资源消耗和内存管理

**答案**:
当组件非常消耗资源时，即使频繁切换也应该用 v-if。典型场景包括：1) 包含视频/音频播放的组件，隐藏时需要停止播放释放资源；2) 包含大量计算或定时器的组件；3) 初始化需要加载大量数据的组件。这些情况下，v-show 会让组件在后台持续消耗资源（内存、CPU），而 v-if 能在隐藏时彻底销毁组件，释放资源。这时切换的性能损失小于后台资源消耗的代价。

**代码框架**:
```javascript
/**
 * 资源密集型组件场景
 * 即使频繁切换也要用 v-if
 */
import { ref, onMounted, onUnmounted } from 'vue';

const HeavyVideoPlayer = {
  setup() {
    let player = null;
    let dataPolling = null;
  
    onMounted(() => {
      // 初始化视频播放器（占用大量内存）
      player = new VideoPlayer({
        autoplay: true,
        highQuality: true
      });
    
      // 启动数据轮询（持续消耗CPU）
      dataPolling = setInterval(() => {
        fetchPlayerStats();
      }, 1000);
    });
  
    onUnmounted(() => {
      // v-if 切换时会执行这里，释放资源
      player?.destroy();
      clearInterval(dataPolling);
      console.log('资源已释放');
    });
  
    return {};
  }
};

/**
 * 使用示例：弹窗中的视频播放器
 */
const VideoModal = {
  setup() {
    const showModal = ref(false);
  
    return { showModal };
  },
  template: `
    <div>
      <button @click="showModal = true">打开视频</button>
      <!-- 使用 v-if，关闭时彻底销毁播放器 -->
      <modal v-if="showModal" @close="showModal = false">
        <heavy-video-player />
      </modal>
    </div>
  `
};
```

---

#### 题目4: v-if 和 v-for 一起使用有什么问题？如何解决？

**思路**: 理解优先级冲突和性能影响

**答案**:
Vue 3 中 v-if 优先级高于 v-for，导致 v-if 无法访问 v-for 的循环变量；Vue 2 中 v-for 优先级高于 v-if，会先循环再判断，造成不必要的渲染。两者都有性能问题。解决方案有两种：1) 外层包裹一层，将 v-if 移到外层或 template 上；2) 使用 computed 属性先过滤数据，再对过滤后的数据使用 v-for。推荐使用第二种方案，代码更清晰且性能最优。

**代码框架**:
```javascript
/**
 * 问题示例：v-if 和 v-for 在同一元素
 */
// ❌ Vue 3 错误：v-if 无法访问 item
<li v-for="item in items" v-if="item.isActive">
  {{ item.name }}
</li>

// ❌ Vue 2 性能问题：先循环1000次，再过滤
<li v-for="item in items" v-if="item.isActive">
  {{ item.name }}
</li>

/**
 * 解决方案1：分离到不同层级
 */
// ✅ 将 v-if 移到外层
<template v-if="shouldShowList">
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</template>

/**
 * 解决方案2：使用 computed 过滤（推荐）
 */
import { ref, computed } from 'vue';

const ListComponent = {
  setup() {
    const items = ref([
      { id: 1, name: 'Item 1', isActive: true },
      { id: 2, name: 'Item 2', isActive: false },
      { id: 3, name: 'Item 3', isActive: true }
    ]);
  
    // 先过滤，只循环需要的数据
    const activeItems = computed(() => 
      items.value.filter(item => item.isActive)
    );
  
    return { activeItems };
  },
  template: `
    <!-- 只循环已过滤的数据，性能最优 -->
    <li v-for="item in activeItems" :key="item.id">
      {{ item.name }}
    </li>
  `
};

/**
 * 复杂场景：每个 item 有不同的显示条件
 */
const ComplexList = {
  setup() {
    const items = ref([
      { id: 1, name: 'Admin', role: 'admin' },
      { id: 2, name: 'User', role: 'user' },
      { id: 3, name: 'Guest', role: 'guest' }
    ]);
  
    return { items };
  },
  template: `
    <!-- 在内层使用 v-if，外层循环所有数据 -->
    <div v-for="item in items" :key="item.id">
      <admin-panel v-if="item.role === 'admin'" :user="item" />
      <user-panel v-else-if="item.role === 'user'" :user="item" />
      <guest-panel v-else :user="item" />
    </div>
  `
};
```

---

#### 题目5: 为什么 v-show 不支持 `<template>` 元素？

**思路**: 理解 template 的特殊性和 v-show 的实现机制

**答案**:
`<template>` 是 Vue 的虚拟元素，不会被渲染为实际的 DOM 节点，它只是一个逻辑容器，用于包裹多个元素。而 v-show 的实现原理是通过修改 DOM 元素的 `style.display` 属性来控制显示。由于 template 没有对应的实体 DOM 节点，无法对其设置 style 属性，因此 v-show 无法作用于 template。如果需要对一组元素使用 v-show，应该用一个实际的容器元素（如 div 或 span）包裹，或者改用 v-if。

**代码框架**:
```javascript
/**
 * 错误示例：v-show 不支持 template
 */
// ❌ 这样写不会生效，因为 template 不会渲染到 DOM
<template v-show="visible">
  <p>第一段</p>
  <p>第二段</p>
</template>

/**
 * 解决方案1：使用实际DOM元素
 */
// ✅ 用 div 包裹，可以正常使用 v-show
<div v-show="visible">
  <p>第一段</p>
  <p>第二段</p>
</div>

/**
 * 解决方案2：改用 v-if
 */
// ✅ v-if 支持 template，因为它控制的是是否渲染
<template v-if="visible">
  <p>第一段</p>
  <p>第二段</p>
</template>


/**
 * 实际应用：需要包裹多个元素时的选择
 */
const MultiElementToggle = {
  setup() {
    const visible = ref(true);
    return { visible };
  },
  template: `
    <!-- 
      场景1：如果需要频繁切换，用实际元素 + v-show
      缺点：多了一层 div 包裹
    -->
    <div v-show="visible" class="wrapper">
      <header>头部</header>
      <main>内容</main>
      <footer>底部</footer>
    </div>
  
    <!-- 
      场景2：如果不频繁切换，用 template + v-if
      优点：不会渲染多余的包裹元素
    -->
    <template v-if="visible">
      <header>头部</header>
      <main>内容</main>
      <footer>底部</footer>
    </template>
  `
};
```

---

#### 题目6: 如何在多步骤表单中正确保留用户输入状态？

**思路**: 理解组件状态保留的实现方式

**答案**:
多步骤表单需要在切换步骤时保留用户输入，有三种方案：1) 使用 v-show 控制各步骤的显示，组件不销毁，状态自然保留；2) 使用 v-if 配合外部状态管理（如 Pinia/Vuex），将表单数据存储在外部；3) 使用动态组件配合 `<keep-alive>`。最简单高效的是方案1，适合步骤不太多的情况。方案2 适合需要持久化或跨组件共享数据的情况。方案3 适合步骤组件较复杂、需要完整生命周期的情况。

**代码框架**:
```javascript
/**
 * 方案1：使用 v-show（推荐，最简单）
 */
import { ref } from 'vue';

const MultiStepForm = {
  setup() {
    const currentStep = ref(1);
  
    // 所有步骤的组件都会挂载，只是显示/隐藏
    const nextStep = () => currentStep.value++;
    const prevStep = () => currentStep.value--;
  
    return { currentStep, nextStep, prevStep };
  },
  template: `
    <div class="form-container">
      <!-- 各步骤始终存在，用 v-show 控制显示 -->
      <step-one v-show="currentStep === 1" />
      <step-two v-show="currentStep === 2" />
      <step-three v-show="currentStep === 3" />
    
      <div class="buttons">
        <button @click="prevStep" v-if="currentStep > 1">上一步</button>
        <button @click="nextStep" v-if="currentStep < 3">下一步</button>
      </div>
    </div>
  `
};

/**
 * 方案2：使用 v-if + 状态管理（适合复杂场景）
 */
import { defineStore } from 'pinia';

// 在 store 中管理表单数据
const useFormStore = defineStore('form', {
  state: () => ({
    step1Data: { name: '', email: '' },
    step2Data: { address: '', phone: '' },
    step3Data: { preferences: [] }
  }),
  actions: {
    updateStep1(data) {
      this.step1Data = { ...this.step1Data, ...data };
    }
  }
});

const StepOneComponent = {
  setup() {
    const formStore = useFormStore();
  
    // 从 store 读取数据，写入也保存到 store
    const localData = ref({ ...formStore.step1Data });
  
    onBeforeUnmount(() => {
      // 组件销毁前保存数据到 store
      formStore.updateStep1(localData.value);
    });
  
    return { localData };
  },
  template: `
    <div>
      <input v-model="localData.name" placeholder="姓名">
      <input v-model="localData.email" placeholder="邮箱">
    </div>
  `
};

/**
 * 方案3：使用 keep-alive（适合步骤组件复杂的情况）
 */
const KeepAliveForm = {
  setup() {
    const currentStep = ref(1);
    const stepComponents = {
      1: 'step-one',
      2: 'step-two',
      3: 'step-three'
    };
  
    // 动态组件名
    const currentComponent = computed(() => 
      stepComponents[currentStep.value]
    );
  
    return { currentComponent, currentStep };
  },
  template: `
    <div>
      <!-- keep-alive 会缓存组件实例，保留状态 -->
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    
      <button @click="currentStep--">上一步</button>
      <button @click="currentStep++">下一步</button>
    </div>
  `
};

/**
 * 各方案对比
 */
const comparison = `
方案1 (v-show):
  优点：最简单，性能好，状态自动保留
  缺点：所有步骤都会初始渲染（如果步骤很多可能影响首屏）
  适用：3-5个步骤的常规表单

方案2 (v-if + 状态管理):
  优点：灵活，可持久化，可跨组件共享
  缺点：需要额外的状态管理代码
  适用：需要保存到后端、或跨页面共享数据

方案3 (keep-alive):
  优点：保留完整组件状态和生命周期
  缺点：内存占用较大，配置稍复杂
  适用：步骤组件很复杂（如包含图表、地图等）
`;
```

---

#### 题目7: v-if 和 v-show 与 transition 组件配合使用有何不同？

**思路**: 理解过渡动画的触发机制

**答案**:
两者都可以配合 transition 组件实现过渡动画，但触发机制不同。v-if 的过渡是基于 DOM 节点的插入和移除，Vue 会在插入前添加 enter-from 类，插入后添加 enter-to 类；移除时先添加 leave-from，然后添加 leave-to，最后移除节点。v-show 的过渡是基于 display 属性的变化，Vue 内部做了特殊处理，在修改 display 之前会触发过渡类的添加。最终效果相似，但 v-if 有完整的进入/离开流程，v-show 只是显示/隐藏的视觉效果。

