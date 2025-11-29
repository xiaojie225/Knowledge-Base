# Vue v-if 与 v-for 优先级精华学习资料

---

## 日常学习模式

**[标签: Vue指令 v-if v-for 优先级 计算属性 性能优化]**

### 核心原则

**永远不要将 v-if 和 v-for 用在同一个元素上**

这是 Vue 官方明确指出的反模式，无论 Vue 2 还是 Vue 3 都应避免。

---

### 优先级演变历史

#### Vue 2.x：v-for 优先级更高

```vue
<!-- Vue 2 中的执行顺序 -->
<template>
  <!-- ❌ 反模式：会先循环1000次，再判断1000次 -->
  <div 
    v-for="user in users" 
    v-if="user.isActive" 
    :key="user.id"
  >
    {{ user.name }}
  </div>
</template>

<script>
/**
 * Vue 2 执行流程
 * 1. v-for 先执行：遍历整个 users 数组
 * 2. v-if 后执行：对每个元素进行判断
 * 
 * 问题：即使只有1个活跃用户，也会循环1000次
 * 造成严重的性能浪费
 */
export default {
  data() {
    return {
      users: [/* 1000个用户 */]
    };
  }
};
</script>
```

#### Vue 3.x：v-if 优先级更高

```vue
<!-- Vue 3 中的执行顺序 -->
<template>
  <!-- ❌ 错误：会直接报错 -->
  <div 
    v-for="user in users" 
    v-if="user.isActive" 
    :key="user.id"
  >
    {{ user.name }}
  </div>
  <!-- 
    Error: Property "user" was accessed during render 
    but is not defined on instance.
  -->
</template>

<script setup>
/**
 * Vue 3 执行流程
 * 1. v-if 先执行：尝试访问 user.isActive
 * 2. 此时 v-for 还未执行，user 变量不存在
 * 3. 抛出编译错误
 * 
 * 设计理念：从语法层面阻止错误用法
 */
import { ref } from 'vue';

const users = ref([/* ... */]);
</script>
```

**为什么改变优先级？**

1. **更符合直觉**：先判断条件，再决定是否循环
2. **避免逻辑悖论**：从根本上防止在 v-if 中访问 v-for 变量
3. **KISS 原则**：简化开发者心智模型

---

### 最佳实践模式

#### 模式1：条件性渲染整个列表

**使用场景：** 根据条件决定是否渲染整个列表

```vue
<template>
  <!-- ✅ 正确：v-if 在外层容器 -->
  <div v-if="shouldShowList">
    <ul v-if="users && users.length > 0">
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
    <p v-else>暂无用户数据</p>
  </div>

  <!-- 或使用 template 标签 -->
  <template v-if="shouldShowList">
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </template>
</template>

<script setup>
import { ref } from 'vue';

/**
 * 控制整个列表的显示/隐藏
 */
const shouldShowList = ref(true);
const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);
</script>
```

#### 模式2：过滤列表数据（首选方案）

**使用场景：** 只渲染符合条件的列表项

```vue
<template>
  <!-- ✅ 最佳实践：循环计算属性 -->
  <ul>
    <li v-for="user in activeUsers" :key="user.id">
      {{ user.name }}
      <span class="badge">活跃</span>
    </li>
  </ul>

  <!-- 如果没有数据 -->
  <p v-if="activeUsers.length === 0">
    没有活跃用户
  </p>
</template>

<script setup>
import { ref, computed } from 'vue';

/**
 * 原始数据：所有用户
 */
const allUsers = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Charlie', isActive: true },
  { id: 4, name: 'David', isActive: false }
]);

/**
 * 计算属性：自动过滤活跃用户
 * 
 * 优势：
 * 1. 单一职责：逻辑与视图分离
 * 2. 性能优化：结果被缓存，避免重复计算
 * 3. 可维护性：过滤逻辑集中管理
 * 4. 可测试性：易于编写单元测试
 */
const activeUsers = computed(() => {
  return allUsers.value.filter(user => user.isActive);
});
</script>
```

---

### 计算属性的核心优势

#### 1. 单一职责原则（SRP）

```vue
<template>
  <!-- 模板只负责展示，保持简洁 -->
  <div class="user-list">
    <UserCard 
      v-for="user in filteredUsers" 
      :key="user.id"
      :user="user"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UserCard from './UserCard.vue';

const users = ref([/* ... */]);
const searchText = ref('');
const selectedRole = ref('all');

/**
 * 计算属性负责复杂的过滤逻辑
 * 职责清晰：数据转换与业务逻辑
 */
const filteredUsers = computed(() => {
  let result = users.value;

  // 按角色过滤
  if (selectedRole.value !== 'all') {
    result = result.filter(u => u.role === selectedRole.value);
  }

  // 按搜索词过滤
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(u => 
      u.name.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword)
    );
  }

  return result;
});
</script>
```

#### 2. 缓存机制与性能

```javascript
/**
 * 计算属性的缓存原理
 */
import { ref, computed } from 'vue';

const count = ref(0);
const items = ref([1, 2, 3, 4, 5]);

/**
 * 计算属性：只在依赖变化时重新计算
 */
const expensiveSum = computed(() => {
  console.log('计算属性执行了');
  return items.value.reduce((sum, n) => sum + n * count.value, 0);
});

// 多次访问，只计算一次
console.log(expensiveSum.value); // 输出: "计算属性执行了", 0
console.log(expensiveSum.value); // 直接返回缓存值, 0
console.log(expensiveSum.value); // 直接返回缓存值, 0

// 依赖改变，重新计算
count.value = 2;
console.log(expensiveSum.value); // 输出: "计算属性执行了", 30

/**
 * 普通方法：每次调用都重新计算
 */
const expensiveSumMethod = () => {
  console.log('方法执行了');
  return items.value.reduce((sum, n) => sum + n * count.value, 0);
};

// 每次调用都执行
console.log(expensiveSumMethod()); // 输出: "方法执行了"
console.log(expensiveSumMethod()); // 输出: "方法执行了"
console.log(expensiveSumMethod()); // 输出: "方法执行了"
```

---

### 实战场景方案

#### 场景1：多条件筛选（电商商品列表）

```vue
<template>
  <div class="product-filter">
    <!-- 筛选条件 -->
    <div class="filters">
      <select v-model="filters.category">
        <option value="">全部分类</option>
        <option value="electronics">电子产品</option>
        <option value="clothing">服装</option>
      </select>
    
      <input 
        v-model="filters.priceRange[0]" 
        type="number" 
        placeholder="最低价"
      >
      <input 
        v-model="filters.priceRange[1]" 
        type="number" 
        placeholder="最高价"
      >
    
      <input 
        v-model="filters.keyword" 
        placeholder="搜索商品"
      >
    </div>
  
    <!-- 商品列表 -->
    <div class="product-list">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id"
        :product="product"
      />
    
      <p v-if="filteredProducts.length === 0">
        没有找到符合条件的商品
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from './ProductCard.vue';

/**
 * 原始商品数据
 */
const allProducts = ref([
  { id: 1, name: '笔记本电脑', category: 'electronics', price: 5999 },
  { id: 2, name: 'T恤', category: 'clothing', price: 99 },
  { id: 3, name: '手机', category: 'electronics', price: 3999 },
  { id: 4, name: '牛仔裤', category: 'clothing', price: 299 }
]);

/**
 * 筛选条件
 */
const filters = ref({
  category: '',
  priceRange: [0, 10000],
  keyword: ''
});

/**
 * 多条件过滤计算属性
 * 链式调用 filter，逐步缩小范围
 */
const filteredProducts = computed(() => {
  let result = allProducts.value;

  // 分类过滤
  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category);
  }

  // 价格区间过滤
  const [min, max] = filters.value.priceRange;
  result = result.filter(p => p.price >= min && p.price <= max);

  // 关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(keyword)
    );
  }

  return result;
});
</script>
```

#### 场景2：搜索实时过滤

```vue
<template>
  <div class="search-list">
    <!-- 搜索框 -->
    <input 
      v-model="searchText"
      placeholder="搜索用户..."
      class="search-input"
    >
  
    <!-- 搜索结果 -->
    <ul class="user-list">
      <li 
        v-for="user in searchedUsers" 
        :key="user.id"
        class="user-item"
      >
        <span class="user-name">{{ user.name }}</span>
        <span class="user-email">{{ user.email }}</span>
      </li>
    </ul>
  
    <p v-if="searchedUsers.length === 0 && searchText">
      没有找到 "{{ searchText }}" 相关的用户
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const allUsers = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
]);

/**
 * 搜索关键词
 */
const searchText = ref('');

/**
 * 搜索结果计算属性
 * 依赖 searchText，自动响应变化
 */
const searchedUsers = computed(() => {
  if (!searchText.value) {
    return allUsers.value; // 无搜索词，返回全部
  }

  const keyword = searchText.value.toLowerCase();
  return allUsers.value.filter(user => 
    user.name.toLowerCase().includes(keyword) ||
    user.email.toLowerCase().includes(keyword)
  );
});
</script>
```

#### 场景3：权限过滤列表

```vue
<template>
  <div class="user-management">
    <h2>用户列表</h2>
  
    <!-- 当前用户只能看到权限低于自己的用户 -->
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>权限等级</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in visibleUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.level }}</td>
          <td>
            <!-- 每行的操作按钮也可以有独立判断 -->
            <button v-if="canEdit(user)">编辑</button>
            <button v-if="canDelete(user)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

/**
 * 当前登录用户信息
 */
const currentUser = ref({
  id: 1,
  name: '管理员',
  level: 3 // 权限等级：1=普通, 2=主管, 3=管理员
});

/**
 * 所有用户列表
 */
const allUsers = ref([
  { id: 2, name: '张三', level: 1 },
  { id: 3, name: '李四', level: 2 },
  { id: 4, name: '王五', level: 1 },
  { id: 5, name: '赵六', level: 3 }
]);

/**
 * 可见用户列表
 * 只显示权限等级 <= 当前用户的其他用户
 */
const visibleUsers = computed(() => {
  return allUsers.value.filter(user => 
    user.level <= currentUser.value.level &&
    user.id !== currentUser.value.id // 排除自己
  );
});

/**
 * 权限判断方法
 * 这是 v-if 在循环内部的合理用法
 */
const canEdit = (user) => {
  return user.level < currentUser.value.level;
};

const canDelete = (user) => {
  return user.level < currentUser.value.level;
};
</script>
```

#### 场景4：前端分页

```vue
<template>
  <div class="paginated-list">
    <!-- 数据列表 -->
    <ul>
      <li v-for="item in paginatedData" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  
    <!-- 分页器 -->
    <div class="pagination">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
      >
        上一页
      </button>
    
      <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
    
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

/**
 * 全部数据（假设100条）
 */
const allData = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`
  }))
);

/**
 * 分页参数
 */
const currentPage = ref(1);
const pageSize = ref(10);

/**
 * 总页数
 */
const totalPages = computed(() => 
  Math.ceil(allData.value.length / pageSize.value)
);

/**
 * 当前页数据
 * 使用 slice 截取数组片段
 */
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allData.value.slice(start, end);
});
</script>
```

---

### v-if 在循环内的合理用法

**场景：** 每个列表项有独立的条件判断

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <span>{{ item.name }}</span>
    
      <!-- ✅ 合理：基于当前项的状态判断 -->
      <button v-if="item.canEdit">编辑</button>
      <button v-if="item.canDelete">删除</button>
      <span v-if="item.isNew" class="badge">新</span>
    
      <!-- ✅ 合理：调用方法判断权限 -->
      <button v-if="hasPermission(item, 'approve')">审核</button>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Item 1', canEdit: true, canDelete: false, isNew: true },
  { id: 2, name: 'Item 2', canEdit: false, canDelete: true, isNew: false }
]);

/**
 * 复杂权限判断方法
 * 接收 item 参数，结合用户角色判断
 */
const hasPermission = (item, action) => {
  // 复杂的权限逻辑...
  return true;
};
</script>
```

---

### 性能优化进阶

#### 防抖优化搜索

```vue
<template>
  <input 
    v-model="searchText"
    placeholder="搜索..."
    @input="debouncedSearch"
  >

  <ul>
    <li v-for="item in searchResults" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const allItems = ref([/* 大量数据 */]);
const searchText = ref('');
const debouncedSearchText = ref('');

/**
 * 防抖搜索函数
 * 用户停止输入300ms后才执行搜索
 */
const debouncedSearch = useDebounceFn(() => {
  debouncedSearchText.value = searchText.value;
}, 300);

/**
 * 搜索结果依赖防抖后的值
 * 减少不必要的计算
 */
const searchResults = computed(() => {
  if (!debouncedSearchText.value) return allItems.value;

  const keyword = debouncedSearchText.value.toLowerCase();
  return allItems.value.filter(item => 
    item.name.toLowerCase().includes(keyword)
  );
});
</script>
```

#### 虚拟列表处理大数据

```vue
<template>
  <div 
    ref="containerRef"
    class="virtual-list"
    @scroll="handleScroll"
  >
    <!-- 占位容器 -->
    <div :style="{ height: totalHeight + 'px' }"></div>
  
    <!-- 可见元素 -->
    <div 
      class="visible-items"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div 
        v-for="item in visibleItems" 
        :key="item.id"
        class="list-item"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

/**
 * 虚拟列表：只渲染可见区域
 * 适用于超大列表（10000+ 条）
 */
const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
});

const containerRef = ref(null);
const scrollTop = ref(0);
const containerHeight = ref(0);

// 总高度
const totalHeight = computed(() => 
  props.items.length * props.itemHeight
);

// 可见区域起始索引
const startIndex = computed(() => 
  Math.floor(scrollTop.value / props.itemHeight)
);

// 可见数量
const visibleCount = computed(() => 
  Math.ceil(containerHeight.value / props.itemHeight) + 1
);

// 可见数据
const visibleItems = computed(() => 
  props.items.slice(
    startIndex.value,
    startIndex.value + visibleCount.value
  )
);

// 偏移量
const offsetY = computed(() => 
  startIndex.value * props.itemHeight
);

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop;
};

onMounted(() => {
  containerHeight.value = containerRef.value.clientHeight;
});
</script>
```

---

### 关键要点

1. **禁忌**：永远不要在同一元素上同时使用 v-if 和 v-for
2. **Vue 2**：v-for 优先，导致性能浪费
3. **Vue 3**：v-if 优先，无法访问循环变量会报错
4. **最佳实践**：使用计算属性过滤数据
5. **计算属性优势**：单一职责、缓存优化、可维护性强
6. **合理用法**：v-if 基于当前循环项的判断可以放在循环内
7. **性能优化**：大数据场景使用防抖和虚拟列表

---

## 面试突击模式

### [v-if 与 v-for 优先级] 面试速记

#### 30秒电梯演讲

**Vue 2 中 v-for 优先级更高，导致先循环再判断，造成性能浪费。Vue 3 改为 v-if 优先，从语法层面阻止错误用法。官方强烈建议永远不要在同一元素上同时使用两者。正确做法：用 v-if 包裹外层容器，或用计算属性预先过滤数据。计算属性遵循单一职责原则，带缓存优化，是最佳实践。**

---

### 高频考点（必背）

**考点1：Vue 2 和 Vue 3 优先级差异**
Vue 2 中 v-for 优先级更高，先执行循环再判断条件，性能低下。Vue 3 中 v-if 优先级更高，先判断条件但此时循环变量未定义会报错。两个版本都不应该在同一元素上混用。

**考点2：为什么不能混用**
Vue 2：会遍历整个数组再逐项判断，即使只渲染少数元素也要循环全部数据，浪费性能。Vue 3：v-if 先执行时无法访问 v-for 的循环变量，直接编译报错。两者都违反最佳实践。

**考点3：计算属性的三大优势**
1)单一职责：视图专注展示，逻辑封装在计算属性 2)缓存机制：只在依赖变化时重新计算，多次访问返回缓存值 3)可维护性：过滤逻辑集中管理，易于测试和复用。

**考点4：两种正确模式**
模式1：v-if 包裹整个列表容器，用于控制列表整体显示/隐藏。模式2（首选）：用计算属性过滤原始数据，模板中直接循环过滤后的结果。绝大多数场景用模式2。

**考点5：v-if 在循环内的合理用法**
当判断条件依赖当前循环项的属性时，v-if 可以放在循环内部。例如每行数据有独立的操作权限判断：`v-if="item.canEdit"` 或 `v-if="hasPermission(item)"`。这是基于业务逻辑的必要判断，非反模式。

---

### 经典面试题

#### 题目1：解释下面代码在 Vue 2 和 Vue 3 中的不同表现

```vue
<template>
  <div v-for="user in users" v-if="user.isActive" :key="user.id">
    {{ user.name }}
  </div>
</template>
```

**思路:**
1. 识别指令混用问题
2. 分别说明两个版本的执行顺序
3. 指出各自的问题

**答案:**
Vue 2：v-for 优先级更高，先循环整个 users 数组，然后对每个 user 进行 v-if 判断。即使只有1个活跃用户，也会遍历全部数据并执行多次条件判断，造成严重性能浪费。

Vue 3：v-if 优先级更高，会先尝试执行 `user.isActive` 判断。但此时 v-for 还未执行，user 变量不存在，会抛出编译错误："Property 'user' was accessed during render but is not defined on instance"。

两个版本都证明了这是错误写法，应该避免。

**代码框架:**
```vue
<!-- ❌ 错误写法 -->
<div v-for="user in users" v-if="user.isActive" :key="user.id">
  {{ user.name }}
</div>

<!-- ✅ 正确写法1：外层包裹 -->
<template v-if="users.length > 0">
  <div v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </div>
</template>

<!-- ✅ 正确写法2：计算属性（推荐） -->
<script setup>
import { ref, computed } from 'vue';

const users = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false }
]);

/**
 * 用计算属性预先过滤
 * 模板只负责展示
 */
const activeUsers = computed(() => 
  users.value.filter(u => u.isActive)
);
</script>

<template>
  <div v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </div>
</template>
```

---
