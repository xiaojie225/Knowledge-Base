# Vue 项目架构精华学习资料

## 日常学习模式

### [标签: Vue项目架构, 目录结构, 组件设计, Feature-Driven]

---

## 一、核心架构理念

### 1.1 分层思想 (Layering)

**三层架构模型：**

```
全局层 (Global Layer)
├── 纯UI组件 (components/base)
├── 通用逻辑 (composables)
└── 工具函数 (utils)

功能层 (Feature Layer)  ⭐ 核心
├── 业务模块独立管理
├── 高内聚低耦合
└── 团队并行开发

应用层 (Application Layer)
├── 路由整合 (router)
├── 状态整合 (store)
└── 应用入口 (main.ts)
```

**原则：**
- **全局层**：零业务依赖，最高复用性
- **功能层**：按业务领域划分，独立完整
- **应用层**：组装所有模块

---

### 1.2 Feature-Driven 架构

**推荐目录结构：**

```
src/
├── assets/              # 全局静态资源
├── components/          # 全局组件
│   ├── base/           # 原子组件 (BaseButton)
│   ├── layout/         # 布局组件 (Header)
│   └── common/         # 通用组件 (Icon)
├── composables/        # 全局Hooks
├── features/           # ⭐ 按业务功能划分
│   ├── products/
│   │   ├── api/       # 商品API
│   │   ├── components/ # 商品组件
│   │   ├── routes/    # 商品路由
│   │   ├── store/     # 商品状态
│   │   ├── types/     # 商品类型
│   │   └── views/     # 商品页面
│   └── cart/          # 购物车模块
├── lib/               # 第三方库封装
├── router/            # 路由主配置
├── store/             # 全局状态
├── styles/            # 全局样式
├── utils/             # 全局工具
└── main.ts
```

**伪代码示例：**

```typescript
/**
 * Feature模块标准结构
 * @example features/products/
 */

// 1. API层 (api/index.ts)
import apiClient from '@/lib/axios';

export const productApi = {
  /** 获取商品列表 */
  getList: (params) => apiClient.get('/products', { params }),
  /** 获取商品详情 */
  getDetail: (id) => apiClient.get(`/products/${id}`)
};

// 2. Store层 (store/productStore.ts)
import { defineStore } from 'pinia';
import { productApi } from '../api';

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [],
    loading: false
  }),
  actions: {
    async fetchList() {
      this.loading = true;
      try {
        const { data } = await productApi.getList();
        this.list = data;
      } finally {
        this.loading = false;
      }
    }
  }
});

// 3. 路由层 (routes/index.ts)
export default [
  {
    path: '/products',
    component: () => import('../views/ProductList.vue')
  },
  {
    path: '/products/:id',
    component: () => import('../views/ProductDetail.vue')
  }
];

// 4. 主路由整合 (router/index.ts)
import productRoutes from '@/features/products/routes';
import cartRoutes from '@/features/cart/routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...productRoutes,
    ...cartRoutes
  ]
});
```

---

## 二、组件划分策略

### 2.1 组件分类体系

```
原子组件 (Atomic)
└── 最小UI单元，无业务逻辑
    └── BaseButton, BaseInput

布局组件 (Layout)
└── 定义页面结构
    └── Header, Sidebar, PageLayout

功能组件 (Feature-Specific)
└── 业务强耦合，限feature内使用
    └── ProductCard, OrderStatus

页面组件 (View/Container)
└── 路由入口，组织页面逻辑
    └── ProductList, UserProfile
```

**组件归属判断流程：**

```typescript
/**
 * 组件归属决策树
 * @param component 待分类的组件
 */
function decideComponentLocation(component) {
  // 1. 无业务逻辑 + 全局复用?
  if (component.isUIOnly && component.isGlobalReusable) {
    return 'src/components/base/';
  }

  // 2. 业务强耦合 + 单feature使用?
  if (component.isBusinessCoupled && component.isSingleFeature) {
    return 'src/features/{feature}/components/';
  }

  // 3. 跨feature复用的业务组件?
  if (component.isBusinessCoupled && component.isMultiFeature) {
    // 创建独立feature
    return 'src/features/{shared-domain}/components/';
  }

  // 4. 定义页面结构?
  if (component.isLayout) {
    return 'src/components/layout/';
  }
}
```

**示例对比：**

```vue
<!-- ❌ 错误：业务组件放全局 -->
<!-- src/components/ProductCard.vue -->
<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <p>¥{{ product.price }}</p>
  </div>
</template>

<!-- ✅ 正确：业务组件放feature -->
<!-- src/features/products/components/ProductCard.vue -->
<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <p>¥{{ product.price }}</p>
  </div>
</template>
```

---

### 2.2 单一出口原则 (Barrel Files)

**目的：** 简化导入路径，统一模块接口

```typescript
/**
 * Barrel文件示例
 * @file features/products/components/index.ts
 */

// 导出所有组件
export { default as ProductCard } from './ProductCard.vue';
export { default as ProductFilter } from './ProductFilter.vue';
export { default as ProductSort } from './ProductSort.vue';

// 使用时
// 简化前:
import ProductCard from '@/features/products/components/ProductCard.vue';
import ProductFilter from '@/features/products/components/ProductFilter.vue';

// 简化后:
import { ProductCard, ProductFilter } from '@/features/products/components';
```

---

## 三、状态管理与逻辑复用

### 3.1 Composables (组合式函数)

**解决问题：** Vue2 Mixins的缺陷（来源不明、命名冲突、类型差）

```typescript
/**
 * 计数器Hook
 * @file src/composables/useCounter.ts
 * @example 
 * const { count, increment } = useCounter(10);
 */
import { ref, readonly, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => count.value = initialValue;

  // 计算属性
  const doubled = computed(() => count.value * 2);

  return {
    count: readonly(count), // 防止外部直接修改
    doubled,
    increment,
    decrement,
    reset
  };
}

/**
 * 使用示例
 */
// SomeComponent.vue
<script setup>
import { useCounter } from '@/composables/useCounter';

const { count, doubled, increment } = useCounter(5);
</script>

<template>
  <div>
    <p>Count: {{ count }} (Doubled: {{ doubled }})</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

---

### 3.2 Pinia 模块化

```typescript
/**
 * Feature级Store
 * @file features/products/store/productStore.ts
 */
import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    currentProduct: null,
    filters: {
      category: '',
      priceRange: [0, 1000]
    }
  }),

  getters: {
    /** 过滤后的商品列表 */
    filteredProducts: (state) => {
      return state.products.filter(p => {
        const inCategory = !state.filters.category || 
                          p.category === state.filters.category;
        const inPriceRange = p.price >= state.filters.priceRange[0] &&
                            p.price <= state.filters.priceRange[1];
        return inCategory && inPriceRange;
      });
    }
  },

  actions: {
    async fetchProducts() {
      const { data } = await productApi.getList();
      this.products = data;
    },
  
    setFilter(key, value) {
      this.filters[key] = value;
    }
  }
});
```

---

## 四、关键配置管理

### 4.1 环境变量

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=My App (Dev)

# .env.production
VITE_API_BASE_URL=https://api.production.com
VITE_APP_TITLE=My App
```

```typescript
/**
 * 使用环境变量
 * @file lib/axios.ts
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Vite方式
  // baseURL: process.env.VUE_APP_API_URL, // Vue CLI方式
  timeout: 10000
});

export default apiClient;
```

---

### 4.2 全局样式管理

```scss
/**
 * CSS变量定义
 * @file styles/variables.scss
 */
:root {
  /* 主题色 */
  --color-primary: #409eff;
  --color-success: #67c23a;
  --color-warning: #e6a23c;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;

  /* 字体 */
  --font-size-base: 14px;
  --font-size-lg: 16px;
}

/* Dark主题 */
[data-theme='dark'] {
  --color-bg: #1a1a1a;
  --color-text: #eee;
}

/**
 * 组件中使用
 */
.my-button {
  background: var(--color-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}
```

---

## 五、实战场景方案

### 5.1 路由模块化

```typescript
/**
 * Feature路由
 * @file features/products/routes/index.ts
 */
import type { RouteRecordRaw } from 'vue-router';

const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    component: () => import('../views/ProductList.vue'),
    meta: { title: '商品列表' }
  },
  {
    path: '/products/:id',
    component: () => import('../views/ProductDetail.vue'),
    meta: { title: '商品详情' }
  }
];

export default productRoutes;

/**
 * 主路由整合
 * @file router/index.ts
 */
import { createRouter } from 'vue-router';
import productRoutes from '@/features/products/routes';
import orderRoutes from '@/features/orders/routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...productRoutes,
    ...orderRoutes,
    // 其他路由
  ]
});
```

---

### 5.2 跨Feature组件

**场景：** 权限树组件在用户和角色模块都需要使用

```
src/features/
├── permissions/          # ⭐ 独立领域
│   ├── components/
│   │   └── PermissionTree.vue
│   ├── api/
│   └── store/
├── users/
│   └── views/
│       └── UserDetail.vue  # 使用PermissionTree
└── roles/
    └── views/
        └── RoleEdit.vue    # 使用PermissionTree
```

```vue
<!-- features/users/views/UserDetail.vue -->
<script setup>
import { PermissionTree } from '@/features/permissions/components';
</script>

<template>
  <PermissionTree :user-id="userId" />
</template>
```

---

### 5.3 表单校验复用

```typescript
/**
 * 全局校验器
 * @file utils/validators.ts
 */

/** 必填校验 */
export const required = (message = '此字段必填') => 
  (value) => !!value || message;

/** 邮箱校验 */
export const isEmail = (message = '邮箱格式错误') =>
  (value) => /.+@.+\..+/.test(value) || message;

/** 手机号校验 */
export const isMobile = (message = '手机号格式错误') =>
  (value) => /^1\d{10}$/.test(value) || message;

/** 长度范围校验 */
export const lengthRange = (min, max) =>
  (value) => {
    const len = value?.length || 0;
    return (len >= min && len <= max) || `长度需在${min}-${max}之间`;
  };

/**
 * 使用示例
 */
// LoginForm.vue
<script setup>
import { required, isEmail } from '@/utils/validators';

const rules = {
  email: [required(), isEmail()],
  password: [required(), lengthRange(6, 20)]
};
</script>
```

---

## 六、项目规模适配

### 6.1 小型项目 (1-5个页面)

```
src/
├── components/
├── views/
├── router/
├── store/
└── utils/
```

**特点：** 扁平结构，按类型划分

---

### 6.2 中型项目 (5-15个页面)

```
src/
├── components/
│   ├── common/
│   └── layout/
├── views/
│   ├── user/
│   │   ├── Profile.vue
│   │   └── Settings.vue
│   └── product/
├── store/
│   ├── user.ts
│   └── product.ts
└── ...
```

**特点：** views内部按功能分组

---

### 6.3 大型项目 (15+个页面)

**采用本文推荐的Feature-Driven架构**

```
src/
├── features/
│   ├── auth/
│   ├── products/
│   ├── orders/
│   └── ...
└── ...
```

**优势：**
- 团队并行开发无冲突
- 模块独立易维护
- 支持微前端演进

---

## 七、最佳实践清单

### ✅ 必须遵守

1. **就近原则**：功能相关的文件放在一起
2. **单一出口**：每个模块用index.ts导出
3. **语义命名**：文件/文件夹名见名知义
4. **避免深层嵌套**：目录层级不超过4层
5. **先业务后抽象**：先在feature实现，确认复用再提升到全局

### ⚠️ 常见误区

1. ❌ 过早抽象：一开始就建大量全局组件
2. ❌ 滥用全局状态：所有数据都放vuex/pinia
3. ❌ 组件职责不清：业务组件混入UI组件目录
4. ❌ 循环依赖：feature之间直接互相导入

---

## 八、快速启动模板

```bash
# 1. 创建项目
npm create vite@latest my-project -- --template vue-ts

# 2. 安装依赖
cd my-project
npm install pinia vue-router

# 3. 创建核心目录
mkdir -p src/{assets,components/{base,layout,common},composables,features,lib,router,store,styles,utils}

# 4. 开始第一个Feature
mkdir -p src/features/auth/{api,components,routes,store,views}
```

**第一个Feature示例：**

```typescript
// features/auth/api/index.ts
export const authApi = {
  login: (data) => apiClient.post('/auth/login', data)
};

// features/auth/store/userStore.ts
export const useUserStore = defineStore('user', {
  state: () => ({ token: '', userInfo: null }),
  actions: {
    async login(credentials) {
      const { data } = await authApi.login(credentials);
      this.token = data.token;
    }
  }
});

// features/auth/routes/index.ts
export default [
  { path: '/login', component: () => import('../views/Login.vue') }
];
```

---

## 九、决策树参考

```
需要创建组件?
├─ 无业务逻辑?
│  └─ Yes → components/base/
├─ 跨多个页面复用?
│  ├─ 业务无关? → components/common/
│  └─ 业务相关?
│     ├─ 跨feature? → 创建独立feature
│     └─ 单feature? → features/{name}/components/
└─ 页面级组件? → features/{name}/views/

需要写工具函数?
├─ 只在一个feature用? → features/{name}/utils/
├─ 多个feature用? → src/utils/
└─ 业务无关? → src/utils/

需要状态管理?
├─ 全局状态(用户、主题)? → store/
└─ 功能状态? → features/{name}/store/
```

---

# 📖 面试突击模式

## [Vue项目架构] 面试速记

### 30秒电梯演讲

大型Vue项目推荐Feature-Driven架构：按业务功能而非技术类型划分目录，每个feature包含api/components/store/routes/views等完整资源。全局层存放零业务依赖的基础组件、工具和hooks。这种结构实现高内聚低耦合，支持团队并行开发，易于维护和扩展。

---

### 高频考点(必背)

**考点1：Feature-Driven vs 传统结构的核心区别**
传统结构按技术类型分(components/views/store)，大项目会导致文件分散、查找困难。Feature-Driven按业务领域分，将一个功能的所有资源聚合，开发时关注点集中在单个目录，修改影响范围可控，支持独立部署和微前端演进。

**考点2：组件归属判断原则**
三条规则：(1)无业务逻辑+全局复用→components/base/；(2)业务耦合+单feature→features/*/components/；(3)跨feature业务组件→创建独立feature。关键是问"这个组件的存在理由是什么业务场景"。

**考点3：Composables优于Mixins的原因**
Mixins三大问题：数据来源不明、命名易冲突、TypeScript支持差。Composables通过显式导入和解构，数据来源清晰，天然避免冲突，完美类型推断，且逻辑可以任意组合。

**考点4：单一出口原则(Barrel Files)**
每个模块创建index.ts统一导出公共接口，简化导入路径。例如`import { ProductCard } from '@/features/products/components'`优于`import ProductCard from '@/features/products/components/ProductCard.vue'`，降低路径耦合。

**考点5：路由模块化方案**
每个feature维护自己的routes/index.ts，主路由文件通过扩展运算符合并所有feature路由。优势：路由配置与业务内聚，避免主路由文件膨胀，新增功能时路由自包含。

---

### 经典面试题

#### 题目1: 给定一个电商项目,包含商品、订单、用户、购物车模块,请设计目录结构

**思路：**
1. 识别独立业务领域：products、orders、users、cart
2. 每个领域创建独立feature
3. 提取全局共享部分

**答案：**
采用Feature-Driven架构，每个业务模块独立管理资源，全局层只放零业务依赖的内容。

**代码框架：**

```typescript
/**
 * 电商项目目录结构
 */
src/
├── components/
│   ├── base/              // 原子组件
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── BaseCard.vue
│   ├── layout/            // 布局组件
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   └── common/            // 通用组件
│       ├── Icon.vue
│       └── Loading.vue
├── features/
│   ├── products/          // 商品模块
│   │   ├── api/
│   │   │   └── index.ts  // productApi.getList/getDetail
│   │   ├── components/
│   │   │   ├── ProductCard.vue
│   │   │   ├── ProductFilter.vue
│   │   │   └── index.ts  // 统一导出
│   │   ├── store/
│   │   │   └── productStore.ts
│   │   ├── routes/
│   │   │   └── index.ts  // [{ path: '/products', ... }]
│   │   └── views/
│   │       ├── ProductList.vue
│   │       └── ProductDetail.vue
│   ├── orders/            // 订单模块(同products结构)
│   ├── users/             // 用户模块(同products结构)
│   └── cart/              // 购物车模块(同products结构)
├── composables/           // 全局hooks
│   ├── useAuth.ts
│   └── useDebounce.ts
├── lib/                   // 第三方库封装
│   └── axios.ts
├── router/
│   └── index.ts          // 整合所有feature路由
├── store/
│   └── index.ts          // 全局store配置
├── styles/
│   ├── variables.scss    // CSS变量
│   └── reset.scss
├── utils/
│   ├── validators.ts     // 表单校验
│   └── formatters.ts
└── main.ts
```

---

#### 题目2: 如何设计一个可复用的表单校验系统

**思路：**
1. 封装纯函数校验器
2. 支持链式组合
3. 提供常用校验规则

**答案：**
在utils/validators.ts创建高阶函数,返回符合UI库规范的校验函数,支持自定义错误信息。

**代码框架：**

```typescript
/**
 * 表单校验工具集
 * @file utils/validators.ts
 * @example 
 * const rules = { email: [required(), isEmail()] }
 */

/**
 * 必填校验
 * @param message 错误提示
 */
export const required = (message = '此字段必填') => {
  return (value: any) => {
    // 处理0、false等falsy值
    return (value !== null && value !== undefined && value !== '') 
      || message;
  };
};

/**
 * 邮箱格式校验
 * @param message 错误提示
 */
export const isEmail = (message = '邮箱格式不正确') => {
  return (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !value || pattern.test(value) || message;
  };
};

/**
 * 手机号校验(中国大陆)
 * @param message 错误提示
 */
export const isMobile = (message = '手机号格式不正确') => {
  return (value: string) => {
    const pattern = /^1[3-9]\d{9}$/;
    return !value || pattern.test(value) || message;
  };
};

/**
 * 长度范围校验
 * @param min 最小长度
 * @param max 最大长度
 */
export const lengthRange = (min: number, max: number) => {
  return (value: string) => {
    const len = value?.length || 0;
    return (len >= min && len <= max) 
      || `长度需在${min}-${max}个字符之间`;
  };
};

/**
 * 数值范围校验
 * @param min 最小值
 * @param max 最大值
 */
export const numberRange = (min: number, max: number) => {
  return (value: number) => {
    return (value >= min && value <= max) 
      || `数值需在${min}-${max}之间`;
  };
};

/**
 * 自定义正则校验
 * @param pattern 正则表达式
 * @param message 错误提示
 */
export const pattern = (pattern: RegExp, message: string) => {
  return (value: string) => {
    return !value || pattern.test(value) || message;
  };
};

/**
 * 使用示例 - Element Plus
 */
/*
<script setup>
import { required, isEmail, lengthRange } from '@/utils/validators';

const formRules = {
  username: [
    required('用户名不能为空'),
    lengthRange(3, 20)
  ],
  email: [
    required(),
    isEmail()
  ],
  password: [
    required('密码不能为空'),
    lengthRange(6, 16)
  ]
};
</script>

<template>
  <el-form :model="form" :rules="formRules">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
  </el-form>
</template>
*/
```

---
