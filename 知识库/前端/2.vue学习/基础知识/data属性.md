# Vue 组件 data 属性精华学习资料

---

## 日常学习模式

**[标签: data函数 状态隔离 实例独立]**

### 核心原则

**组件的 `data` 必须是函数，根实例的 `data` 可以是对象**

```javascript
// ✅ 组件中正确写法
export default {
  data() {
    return {
      count: 0,
      isActive: false
    }
  }
}

// ❌ 组件中错误写法
export default {
  data: {
    count: 0,
    isActive: false
  }
}

// ✅ 根实例可以用对象
new Vue({
  data: {
    count: 0
  }
})
```

### 原理机制

**JavaScript 引用类型导致的状态共享问题**

当 `data` 是对象时，所有组件实例共享同一个内存引用：

```javascript
/**
 * 模拟错误场景：data 作为对象
 */
function Component() {}
Component.prototype.data = { count: 0 }; // 所有实例共享此对象

const componentA = new Component();
const componentB = new Component();

componentA.data.count = 5;
console.log(componentB.data.count); // 输出 5，状态污染！

/**
 * 模拟正确场景：data 作为函数
 */
function CorrectComponent() {
  this.data = this.dataFactory(); // 每个实例调用工厂函数
}
CorrectComponent.prototype.dataFactory = function() {
  return { count: 0 }; // 返回新对象
};

const correctA = new CorrectComponent();
const correctB = new CorrectComponent();

correctA.data.count = 5;
console.log(correctB.data.count); // 输出 0，状态隔离！
```

### 实战场景

#### 场景1: 列表渲染中的独立状态

```vue
<!-- ProductCard.vue - 商品卡片组件 -->
<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <button @click="addToCart" :disabled="isLoading">
      {{ isLoading ? '加载中...' : '加入购物车' }}
    </button>
  </div>
</template>

<script>
export default {
  props: ['product'],
  /**
   * data 必须是函数
   * 确保每个商品卡片有独立的 isLoading 状态
   */
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async addToCart() {
      this.isLoading = true; // 只影响当前卡片
      try {
        await api.addToCart(this.product.id);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<!-- App.vue - 使用场景 -->
<template>
  <div>
    <!-- 每个卡片都有独立的 isLoading 状态 -->
    <ProductCard 
      v-for="item in products" 
      :key="item.id" 
      :product="item" 
    />
  </div>
</template>
```

#### 场景2: 表格行的独立操作

```vue
<!-- TableRow.vue - 表格行组件 -->
<template>
  <tr>
    <td>{{ rowData.name }}</td>
    <td>
      <button @click="showConfirm">删除</button>
      <!-- 只为当前行显示确认对话框 -->
      <div v-if="isConfirmingDelete" class="modal">
        <p>确定删除吗?</p>
        <button @click="handleDelete">确定</button>
        <button @click="isConfirmingDelete = false">取消</button>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['rowData'],
  /**
   * 每行有独立的确认对话框状态
   */
  data() {
    return {
      isConfirmingDelete: false,
      isDeleting: false
    }
  },
  methods: {
    showConfirm() {
      this.isConfirmingDelete = true; // 只影响当前行
    },
    async handleDelete() {
      this.isDeleting = true;
      await api.deleteRow(this.rowData.id);
      this.$emit('deleted');
    }
  }
}
</script>
```

### Vue 3 组合式 API

在 Vue 3 中，`setup()` 函数天然提供实例级作用域：

```vue
<template>
  <button @click="increment">
    点击了 {{ count }} 次
  </button>
</template>

<script>
import { ref } from 'vue';

export default {
  /**
   * setup 为每个实例执行一次
   * 天然实现状态隔离，无需记忆特殊规则
   */
  setup() {
    const count = ref(0); // 每个实例独立的响应式变量
  
    const increment = () => {
      count.value++;
    };
  
    return { count, increment };
  }
}
</script>
```

### Props 默认值的类似规则

对象/数组类型的 prop 默认值也需要工厂函数：

```javascript
export default {
  props: {
    // ❌ 错误：所有实例共享同一个数组
    tags: {
      type: Array,
      default: []
    },
  
    // ✅ 正确：每个实例获得独立数组
    tags: {
      type: Array,
      default: () => []
    },
  
    // ✅ 对象同理
    config: {
      type: Object,
      default: () => ({
        theme: 'light',
        pageSize: 10
      })
    }
  }
}
```

### 共享状态的正确方式

如果确实需要跨组件共享状态，使用外部状态管理：

```javascript
// store.js - 共享状态模块
import { reactive } from 'vue';

/**
 * 创建全局共享状态
 * 这是明确的、可预测的共享方式
 */
export const sharedState = reactive({
  user: null,
  cartCount: 0
});

// ComponentA.vue
import { sharedState } from './store.js';

export default {
  setup() {
    // 多个组件共享同一个 sharedState
    return { sharedState };
  }
}

// ComponentB.vue
import { sharedState } from './store.js';

export default {
  setup() {
    // 与 ComponentA 共享状态
    return { sharedState };
  }
}
```

### 关键要点

1. **组件 data 必须是函数** - 确保实例独立性
2. **根实例 data 可以是对象** - 因为只有一个根实例
3. **原因是 JavaScript 引用类型** - 对象通过引用共享
4. **函数是工厂模式** - 每次调用返回新对象
5. **Vue 3 setup 天然隔离** - 函数作用域自动实现
6. **Props 默认值同理** - 对象/数组需要工厂函数
7. **共享状态用外部 store** - 不要滥用对象共享特性

---

## 面试突击模式

### [Vue data 函数] 面试速记

#### 30秒电梯演讲

**组件的 data 必须是函数，因为组件是可复用的。如果 data 是对象，所有实例会共享同一个对象引用，导致状态污染。函数作为工厂，为每个实例返回独立的数据对象，确保状态隔离。根实例可以用对象，因为它只有一个。**

---

### 高频考点（必背）

**考点1: 为什么组件 data 必须是函数？**
因为组件是可复用的蓝图，可能在页面上创建多个实例。如果 data 是对象，由于 JavaScript 对象是引用类型，所有实例会共享同一个内存对象。函数作为工厂模式，每次创建实例时调用并返回新对象，确保各实例状态独立。

**考点2: 根实例的 data 为什么可以是对象？**
根实例通过 `new Vue()` 创建，在整个应用中只有一个，不存在复用和多实例问题，因此不会发生状态共享冲突。可以直接使用对象作为 data，但也可以用函数。

**考点3: data 函数内部能访问 this 吗？**
不能。data 函数在组件实例完全创建之前调用，此时 this 是 undefined。因此无法在 data 函数内访问 props、methods 或计算属性。

**考点4: Vue 3 组合式 API 如何解决这个问题？**
setup() 函数为每个组件实例执行一次，其内部声明的响应式状态（ref/reactive）天然具有实例级作用域，自动实现状态隔离，不需要开发者记忆特殊规则。

**考点5: Props 默认值有类似规则吗？**
有。对象或数组类型的 prop 默认值也必须从工厂函数返回，否则所有未传递该 prop 的实例会共享同一个默认对象，原因与 data 相同。

---

### 经典面试题

#### 题目1: 解释为什么下面的代码会导致 Bug

```javascript
// 错误示例
Vue.component('counter-button', {
  data: {
    count: 0
  },
  template: '<button @click="count++">{{ count }}</button>'
});
```

**思路:** 
1. 识别 data 是对象而非函数
2. 分析引用类型共享问题
3. 说明多实例场景的影响

**答案:**
这段代码违反了组件 data 必须是函数的规则。当页面上渲染多个 `<counter-button>` 时，所有实例会共享同一个 `{ count: 0 }` 对象引用。点击任意一个按钮，所有按钮的 count 都会同步增加，因为它们都在修改同一个对象的 count 属性。

**代码框架:**
```javascript
/**
 * 正确写法
 */
Vue.component('counter-button', {
  data() {
    return {
      count: 0 // 每个实例获得独立的 count
    };
  },
  template: '<button @click="count++">{{ count }}</button>'
});
```

---

#### 题目2: 用原生 JavaScript 模拟这个问题

**思路:**
1. 用构造函数模拟组件
2. 展示对象引用共享
3. 对比函数工厂模式

**答案:**
问题的本质是 JavaScript 引用类型的共享特性。当多个实例的属性指向同一个对象时，修改会相互影响。

**代码框架:**
```javascript
/**
 * 模拟错误场景：共享对象
 */
function BadComponent() {}
BadComponent.prototype.data = { count: 0 }; // 所有实例共享

const bad1 = new BadComponent();
const bad2 = new BadComponent();

bad1.data.count = 10;
console.log(bad2.data.count); // 输出 10，状态污染

/**
 * 模拟正确场景：工厂函数
 */
function GoodComponent() {
  // 每个实例调用工厂函数获取新对象
  this.data = this.createData();
}
GoodComponent.prototype.createData = function() {
  return { count: 0 }; // 返回新对象
};

const good1 = new GoodComponent();
const good2 = new GoodComponent();

good1.data.count = 10;
console.log(good2.data.count); // 输出 0，状态隔离
```

---

#### 题目3: 实现一个商品列表，每个商品有独立的"加载中"状态

**思路:**
1. 创建商品卡片组件
2. 在 data 中定义 isLoading
3. 确保点击时只影响当前卡片

**答案:**
需要在组件的 data 函数中返回独立的 isLoading 状态，使每个卡片实例拥有自己的加载状态。

**代码框架:**
```vue
<!-- ProductCard.vue -->
<template>
  <div class="card">
    <h3>{{ product.name }}</h3>
    <p>价格: ¥{{ product.price }}</p>
    <button 
      @click="addToCart" 
      :disabled="isLoading"
      :class="{ loading: isLoading }"
    >
      {{ isLoading ? '添加中...' : '加入购物车' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  /**
   * data 必须是函数
   * 确保每个商品卡片有独立的 isLoading 状态
   */
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    /**
     * 添加到购物车
     * 只修改当前实例的 isLoading
     */
    async addToCart() {
      this.isLoading = true;
      try {
        await this.$api.addToCart({
          productId: this.product.id,
          quantity: 1
        });
        this.$message.success('添加成功');
      } catch (error) {
        this.$message.error('添加失败');
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<!-- 使用示例 -->
<template>
  <div class="product-list">
    <!-- 每个卡片都有独立的 isLoading 状态 -->
    <ProductCard
      v-for="item in products"
      :key="item.id"
      :product="item"
    />
  </div>
</template>
```

---

#### 题目4: Props 默认值为什么也需要工厂函数？

**思路:**
1. 类比 data 的问题
2. 说明对象/数组的引用共享
3. 给出正确写法

**答案:**
原因与 data 完全相同。如果 prop 的默认值是对象或数组的字面量，所有未传递该 prop 的组件实例会共享同一个默认值对象。一个实例修改默认值会影响其他实例。

**代码框架:**
```javascript
export default {
  props: {
    // ❌ 错误：所有实例共享同一个空数组
    tags: {
      type: Array,
      default: []
    },
  
    // ✅ 正确：每个实例获得独立数组
    tags: {
      type: Array,
      default() {
        return [];
      }
      // 或简写： default: () => []
    },
  
    // ❌ 错误：共享配置对象
    options: {
      type: Object,
      default: { theme: 'light' }
    },
  
    // ✅ 正确：独立配置对象
    options: {
      type: Object,
      default() {
        return {
          theme: 'light',
          pageSize: 10
        };
      }
    }
  }
};
```

---

#### 题目5: Vue 3 setup 如何避免这个问题？

**思路:**
1. 说明 setup 的执行时机
2. 解释函数作用域特性
3. 对比与 Vue 2 的差异

**答案:**
Vue 3 的 setup() 函数在每个组件实例创建时执行一次，内部声明的变量天然具有函数作用域。使用 ref 或 reactive 创建的响应式状态都是该实例独有的，自动实现状态隔离，无需额外记忆规则。

**代码框架:**
```vue
<template>
  <button @click="increment">
    点击了 {{ count }} 次
  </button>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Counter',
  /**
   * setup 为每个实例执行一次
   * 内部变量自动隔离，无需工厂函数
   */
  setup() {
    // 每个实例都有独立的 count
    const count = ref(0);
  
    const increment = () => {
      count.value++;
    };
  
    // 返回的数据和方法供模板使用
    return {
      count,
      increment
    };
  }
};
</script>
```

---

#### 题目6: 如何在组件间正确共享状态？

**思路:**
1. 说明不应滥用对象共享
2. 介绍外部状态管理方案
3. 给出简单示例

**答案:**
虽然可以通过对象共享实现，但这是反模式。正确方式是使用外部状态管理：简单场景用响应式对象，复杂场景用 Pinia/Vuex。这使共享意图明确、可维护。

**代码框架:**
```javascript
// store.js - 简单的共享状态
import { reactive } from 'vue';

/**
 * 创建全局共享状态
 * 明确的、可预测的共享方式
 */
export const globalStore = reactive({
  user: null,
  cartCount: 0,

  /**
   * 更新购物车数量
   */
  updateCartCount(count) {
    this.cartCount = count;
  }
});

// ComponentA.vue
import { globalStore } from './store';

export default {
  setup() {
    const addToCart = () => {
      globalStore.updateCartCount(globalStore.cartCount + 1);
    };
  
    return {
      cartCount: globalStore.cartCount,
      addToCart
    };
  }
};

// ComponentB.vue
import { globalStore } from './store';

export default {
  setup() {
    // 与 ComponentA 共享同一个 cartCount
    return {
      cartCount: globalStore.cartCount
    };
  }
};
```

---

#### 题目7: 实现一个表格，每行有独立的编辑状态

**思路:**
1. 创建表格行组件
2. 在 data 中维护编辑状态
3. 确保编辑互不干扰

**答案:**
在表格行组件中用 data 函数返回独立的编辑状态，使每行可以独立进入/退出编辑模式。

**代码框架:**
```vue
<!-- TableRow.vue -->
<template>
  <tr>
    <!-- 展示模式 -->
    <td v-if="!isEditing">{{ rowData.name }}</td>
    <td v-if="!isEditing">{{ rowData.email }}</td>
  
    <!-- 编辑模式 -->
    <td v-if="isEditing">
      <input v-model="editForm.name" />
    </td>
    <td v-if="isEditing">
      <input v-model="editForm.email" />
    </td>
  
    <td>
      <!-- 编辑/保存切换 -->
      <button v-if="!isEditing" @click="startEdit">
        编辑
      </button>
      <template v-else>
        <button @click="saveEdit" :disabled="isSaving">
          {{ isSaving ? '保存中...' : '保存' }}
        </button>
        <button @click="cancelEdit">取消</button>
      </template>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TableRow',
  props: {
    rowData: {
      type: Object,
      required: true
    }
  },
  /**
   * 每行有独立的编辑状态
   * isEditing: 是否处于编辑模式
   * editForm: 编辑表单数据
   * isSaving: 是否正在保存
   */
  data() {
    return {
      isEditing: false,
      editForm: {},
      isSaving: false
    };
  },
  methods: {
    /**
     * 进入编辑模式
     * 复制原数据到编辑表单
     */
    startEdit() {
      this.isEditing = true;
      this.editForm = { ...this.rowData };
    },
  
    /**
     * 保存编辑
     */
    async saveEdit() {
      this.isSaving = true;
      try {
        await this.$api.updateRow(this.editForm);
        Object.assign(this.rowData, this.editForm);
        this.isEditing = false;
        this.$message.success('保存成功');
      } catch (error) {
        this.$message.error('保存失败');
      } finally {
        this.isSaving = false;
      }
    },
  
    /**
     * 取消编辑
     */
    cancelEdit() {
      this.isEditing = false;
      this.editForm = {};
    }
  }
};
</script>
```

---

#### 题目8: 对比 Vue 2 Options API 和 Vue 3 Composition API 的差异

**思路:**
1. 说明 Vue 2 需要记忆规则
2. 说明 Vue 3 天然隔离
3. 总结设计哲学变化

**答案:**
Vue 2 需要开发者记住"data 必须是函数"这一规则，违反会导致 Bug。Vue 3 通过 setup() 的函数作用域天然实现状态隔离，符合直觉，降低心智负担。

**代码框架:**
```javascript
/**
 * Vue 2 Options API
 * 需要记忆：组件 data 必须是函数
 */
export default {
  data() {
    // 必须返回新对象
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};

/**
 * Vue 3 Composition API
 * setup 函数作用域自动隔离，无需记忆规则
 */
import { ref } from 'vue';

export default {
  setup() {
    // 函数作用域，天然隔离
    const count = ref(0);
  
    const increment = () => {
      count.value++;
    };
  
    return { count, increment };
  }
};
```

---

#### 题目9: 实现一个模态框组件，支持同时打开多个实例

**思路:**
1. 创建模态框组件
2. 用 data 维护显示状态
3. 确保各实例独立控制

**答案:**
每个模态框实例需要独立的显示状态，通过 data 函数返回 isVisible 确保互不干扰。

**代码框架:**
```vue
<!-- Modal.vue -->
<template>
  <teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
          <button class="close-btn" @click="close">×</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button @click="close">关闭</button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    }
  },
  /**
   * 每个模态框实例有独立的显示状态
   */
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    /**
     * 打开模态框
     */
    open() {
      this.isVisible = true;
      this.$emit('open');
    },
  
    /**
     * 关闭模态框
     */
    close() {
      this.isVisible = false;
      this.$emit('close');
    },
  
    /**
     * 点击遮罩层处理
     */
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.close();
      }
    }
  }
};
</script>

<!-- 使用示例：同时使用多个模态框 -->
<template>
  <div>
    <button @click="$refs.modal1.open()">打开模态框1</button>
    <button @click="$refs.modal2.open()">打开模态框2</button>
  
    <!-- 两个模态框实例独立控制 -->
    <Modal ref="modal1" title="模态框1">
      <p>这是第一个模态框的内容</p>
    </Modal>
  
    <Modal ref="modal2" title="模态框2">
      <p>这是第二个模态框的内容</p>
    </Modal>
  </div>
</template>
```

---

#### 题目10: 解释 Vue 源码中如何检测和警告错误用法

**思路:**
1. 说明检测发生在初始化阶段
2. 解释 mergeOptions 过程
3. 说明警告时机

**答案:**
Vue 在组件初始化的 mergeOptions 阶段检测 data 类型。如果在组件上下文中发现 data 是对象而非函数，会在开发环境发出警告。这发生在实例完全创建之前的选项合并过程中。

**代码框架:**
```javascript
/**
 * Vue 2 源码简化示例
 * 实际代码位于 src/core/instance/state.js
 */

/**
 * 初始化 data
 * @param {Component} vm - 组件实例
 */
function initData(vm) {
  let data = vm.$options.data;

  /**
   * 检测 data 类型
   * 组件中必须是函数
   */
  if (typeof data !== 'function') {
    // 开发环境发出警告
    warn(
      'The "data" option should be a function ' +
      'that returns a per-instance value in component ' +
      'definitions.',
      vm
    );
  }

  /**
   * 调用 data 函数获取数据对象
   * 如果是函数，调用并传入 vm 作为 this
   * 如果是对象（根实例），直接使用
   */
  data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};

  // ... 后续处理：observe、proxy 等
}

/**
 * 安全调用 data 函数
 * @param {Function} data - data 函数
 * @param {Component} vm - 组件实例
 */
function getData(data, vm) {
  try {
    // 调用 data 函数，this 指向 undefined
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, 'data()');
    return {};
  }
}
```

---

## 速查手册

### 问题：为什么我的组件会共享状态？

**症状：** 修改一个组件实例，其他实例也跟着变化

**原因：** 99% 是因为 data 写成了对象

**解决：**
```javascript
// ❌ 错误
data: { count: 0 }

// ✅ 正确
data() {
  return { count: 0 }
}
```

**记忆口诀：** 组件 data 函数返，根实例对象可；引用共享是祸根，工厂模式保独立。