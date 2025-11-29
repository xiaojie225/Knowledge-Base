# Vue 权限管理精华学习资料

## 日常学习模式

### [标签: Vue 权限管理 | 动态路由 | 自定义指令]

---

## 一、核心概念体系

### 1.1 权限管理四层架构

**本质**: 前端权限是 UI 层面的访问控制,真正安全防线在后端。

```
┌─────────────────────────────────────────┐
│ 1. 接口权限 (最核心)                      │
│    - 后端验证 token                       │
│    - 返回 401/403 拦截非法请求            │
├─────────────────────────────────────────┤
│ 2. 路由权限 (页面级)                      │
│    - 控制用户可访问的 URL                 │
│    - 静态路由 vs 动态路由                 │
├─────────────────────────────────────────┤
│ 3. 菜单权限 (导航级)                      │
│    - 后端返回菜单数据                     │
│    - 只显示有权访问的菜单项               │
├─────────────────────────────────────────┤
│ 4. 按钮权限 (操作级)                      │
│    - 自定义指令 v-permission              │
│    - 控制增删改查等操作按钮               │
└─────────────────────────────────────────┘
```

### 1.2 动态路由核心流程

```javascript
/**
 * 动态路由实现原理
 * 1. 用户登录后获取角色/权限
 * 2. 根据权限过滤路由表
 * 3. 动态添加到路由实例
 * 4. 用户登出时清除动态路由
 */

// 第一步: 定义路由结构
const asyncRoutes = [
  {
    path: '/admin',
    component: () => import('@/views/AdminPage.vue'),
    meta: { 
      roles: ['admin'],  // 声明所需角色
      title: 'Admin Only' 
    }
  }
];

// 第二步: 过滤路由函数
function filterAsyncRoutes(routes, userRoles) {
  return routes.filter(route => {
    // 如果没有角色限制,或用户角色匹配,则保留
    if (!route.meta?.roles || 
        route.meta.roles.some(role => userRoles.includes(role))) {
      // 递归处理子路由
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, userRoles);
      }
      return true;
    }
    return false;
  });
}

// 第三步: 导航守卫中动态添加
router.beforeEach(async (to, from, next) => {
  if (hasToken && !hasRoles) {
    // 获取用户权限
    const { roles } = await userStore.getInfo();
    // 过滤路由
    const accessRoutes = filterAsyncRoutes(asyncRoutes, roles);
    // 动态添加
    accessRoutes.forEach(route => router.addRoute(route));
    // 重新导航以激活新路由
    next({ ...to, replace: true });
  }
});
```

---

## 二、自定义指令实现按钮权限

### 2.1 指令核心代码

```javascript
/**
 * v-permission 指令
 * 用法: <button v-permission="['user:add']">添加</button>
 * 
 * @param {Array} value - 所需权限标识数组
 * 
 * 工作原理:
 * 1. mounted 钩子中获取用户所有权限
 * 2. 检查是否包含所需权限
 * 3. 无权限则移除 DOM 元素
 */
import { userStore } from '@/store/user';

export default {
  mounted(el, binding) {
    const { value: requiredPermissions } = binding;
    const userPermissions = userStore.permissions;
  
    // 校验指令参数
    if (!Array.isArray(requiredPermissions) || !requiredPermissions.length) {
      throw new Error('v-permission requires array value');
    }
  
    // 权限检查: 用户权限中是否包含任一所需权限
    const hasPermission = userPermissions.some(p => 
      requiredPermissions.includes(p)
    );
  
    // 无权限则移除元素
    if (!hasPermission) {
      el.parentNode?.removeChild(el);
    }
  }
};
```

### 2.2 使用场景对比

```html
<!-- 场景1: 简单权限判断 (推荐 v-if) -->
<button v-if="userStore.permissions.includes('user:add')">
  添加用户
</button>

<!-- 场景2: 复杂权限组合 (推荐自定义指令) -->
<button v-permission="['user:add', 'user:create']">
  添加用户 (有任一权限即可)
</button>

<!-- 场景3: 权限 + 数据状态联合判断 -->
<button 
  v-if="item.status === 'draft'" 
  v-permission="['post:edit']">
  编辑草稿
</button>
```

---

## 三、完整实现架构

### 3.1 状态管理 (userStore)

```javascript
/**
 * 用户状态管理
 * 职责: 存储 token、角色、权限,提供登录/登出方法
 */
import { reactive } from 'vue';

export const userStore = reactive({
  token: localStorage.getItem('token') || '',
  roles: [],         // ['admin', 'editor']
  permissions: [],   // ['user:add', 'user:edit']

  // 登录: 保存认证信息
  async login(username) {
    const { token, roles, permissions } = await api.login(username);
    this.token = token;
    this.roles = roles;
    this.permissions = permissions;
    localStorage.setItem('token', token);
  },

  // 获取用户信息: 通常在导航守卫中调用
  async getInfo() {
    const { roles, permissions } = await api.getUserInfo(this.token);
    this.roles = roles;
    this.permissions = permissions;
    return { roles, permissions };
  },

  // 登出: 清除状态并刷新页面
  logout() {
    this.token = '';
    this.roles = [];
    this.permissions = [];
    localStorage.removeItem('token');
    // 刷新页面清除动态路由
    window.location.reload();
  }
});
```

### 3.2 路由配置结构

```javascript
/**
 * 路由分层设计
 * constantRoutes: 公共路由,所有人可访问
 * asyncRoutes: 异步路由,按权限动态加载
 */

// 公共路由
export const constantRoutes = [
  { 
    path: '/login', 
    component: () => import('@/views/Login.vue'),
    meta: { hidden: true }  // 不在菜单显示
  },
  { 
    path: '/', 
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: 'Dashboard' }
  }
];

// 权限路由
export const asyncRoutes = [
  {
    path: '/admin',
    component: () => import('@/views/AdminPage.vue'),
    meta: {
      title: 'Admin Panel',
      roles: ['admin'],              // 角色要求
      permissions: ['admin:view']    // 权限要求 (可选)
    }
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: 'User Mgmt' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/UserList.vue'),
        meta: { 
          roles: ['admin', 'editor'],  // 多角色或关系
          title: 'User List' 
        }
      }
    ]
  }
];
```

### 3.3 导航守卫完整逻辑

```javascript
/**
 * 全局前置守卫
 * 核心职责:
 * 1. 未登录重定向登录页
 * 2. 已登录但无角色信息时获取权限并动态添加路由
 * 3. 白名单路径直接放行
 */
router.beforeEach(async (to, from, next) => {
  const hasToken = userStore.token;
  const whiteList = ['/login', '/403', '/404'];

  if (hasToken) {
    // 已登录
    if (to.path === '/login') {
      next('/');  // 重定向到首页
    } else {
      const hasRoles = userStore.roles?.length > 0;
    
      if (hasRoles) {
        next();  // 已有权限,直接放行
      } else {
        try {
          // 获取用户权限
          const { roles } = await userStore.getInfo();
        
          // 过滤路由
          const accessRoutes = filterAsyncRoutes(asyncRoutes, roles);
        
          // 动态添加路由
          accessRoutes.forEach(route => router.addRoute(route));
        
          // 重新导航以激活新路由
          next({ ...to, replace: true });
        } catch (error) {
          // 获取权限失败,清除登录状态
          userStore.logout();
          next('/login');
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next();  // 白名单直接放行
    } else {
      next('/login');  // 重定向登录页
    }
  }
});
```

---

## 四、关键技术要点

### 4.1 为什么需要 `next({ ...to, replace: true })`

```javascript
/**
 * addRoute 后的导航问题
 * 
 * 问题: addRoute 是异步操作,执行后当前导航尚未结束,
 *       路由系统可能还不知道新路由存在,直接 next() 会 404
 * 
 * 解决: 使用 replace: true 触发新导航,此时新路由已生效
 */

// ❌ 错误写法
accessRoutes.forEach(route => router.addRoute(route));
next();  // 可能白屏或 404

// ✅ 正确写法
accessRoutes.forEach(route => router.addRoute(route));
next({ ...to, replace: true });  // 重新导航
```

### 4.2 登出时必须清除动态路由

```javascript
/**
 * 为什么要 reload?
 * 
 * 问题: addRoute 添加的路由会永久存在,无法批量删除
 * 影响: 新用户登录时仍能访问旧用户的路由,造成权限混乱
 * 
 * 解决方案:
 * 1. 刷新页面 (简单粗暴,推荐)
 * 2. 逐个 removeRoute (Vue Router 4+)
 */

// 方案1: 刷新页面 (推荐)
logout() {
  this.clearState();
  window.location.reload();  // 重新初始化路由实例
}

// 方案2: 手动移除 (复杂)
const removeRouteFns = [];
accessRoutes.forEach(route => {
  const remove = router.addRoute(route);
  removeRouteFns.push(remove);  // 保存移除函数
});

// 登出时调用
removeRouteFns.forEach(fn => fn());
```

### 4.3 组件映射表 (后端返回路由时必需)

```javascript
/**
 * 组件名到组件实例的映射
 * 用于将后端返回的字符串转为真实组件
 */
const componentMap = {
  'Layout': () => import('@/layout/index.vue'),
  'Dashboard': () => import('@/views/Dashboard.vue'),
  'AdminPage': () => import('@/views/AdminPage.vue'),
};

/**
 * 递归转换路由数据
 * @param {Array} backendRoutes - 后端返回的路由配置
 */
function transformRoutes(backendRoutes) {
  return backendRoutes.map(route => ({
    ...route,
    // 将组件名字符串转为实际组件
    component: componentMap[route.component],
    // 递归处理子路由
    children: route.children ? transformRoutes(route.children) : []
  }));
}

// 使用
const routes = transformRoutes(backendData);
routes.forEach(route => router.addRoute(route));
```

---

## 五、最佳实践总结

### 5.1 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 路由权限 | 动态路由 | 按需加载,安全性高,灵活 |
| 菜单权限 | 后端返回 | 保证菜单与路由一致性 |
| 按钮权限 | 自定义指令 | 代码简洁,逻辑复用 |
| 权限存储 | Pinia/Vuex | 响应式,全局共享 |

### 5.2 常见问题排查

```javascript
/**
 * 问题1: 动态添加路由后访问 404
 * 原因: 没有 next({ ...to, replace: true })
 * 解决: 参考 4.1 节
 */

/**
 * 问题2: 登出后新用户能访问旧路由
 * 原因: 动态路由未清除
 * 解决: 参考 4.2 节
 */

/**
 * 问题3: v-permission 指令不生效
 * 排查清单:
 * - 是否全局注册? app.directive('permission', ...)
 * - userStore.permissions 是否已初始化?
 * - 权限标识字符串是否一致? (大小写敏感)
 */

/**
 * 问题4: 刷新页面后 404
 * 原因: 动态路由丢失
 * 解决: 在导航守卫中判断 hasRoles,false 时重新加载路由
 */
```

---

## 面试突击模式

### [Vue 权限管理] 面试速记

#### 30秒电梯演讲

前端权限管理分四层:接口用 token 验证,路由用动态添加控制页面访问,菜单由后端返回保证一致性,按钮用自定义指令精确控制操作。核心是动态路由+自定义指令,前端只做 UI 控制,真正安全靠后端。

---

#### 高频考点(必背)

**考点1: 前端权限控制的四个层次及核心原理**

接口权限(后端 token 校验)是根本防线;路由权限通过 `router.addRoute` 动态添加实现按需加载;菜单权限由后端返回确保准确性;按钮权限用 `v-permission` 指令移除无权元素。前端权限本质是 UI 控制,无法防止 API 直接调用,必须配合后端校验。

**考点2: 静态路由 vs 动态路由的区别与选择**

静态路由前端定义全部路由,导航守卫中用 `meta.roles` 判断拦截,优点是简单,缺点是所有路由暴露且首屏加载慢。动态路由登录后根据权限用 `addRoute` 添加,优点是按需加载、安全性高,缺点是实现复杂。企业项目强烈推荐动态路由。

**考点3: 自定义指令实现按钮权限的原理**

在 `mounted` 钩子获取用户所有权限数组,与指令绑定的所需权限对比,用 `Array.some` 判断是否包含。无权限时通过 `el.parentNode.removeChild(el)` 直接移除 DOM 元素。相比 `v-if`,指令封装了判断逻辑,模板更简洁易维护。

**考点4: 为什么 addRoute 后需要 `next({ ...to, replace: true })`**

`addRoute` 是异步操作,执行时当前导航未结束,路由系统不知道新路由存在,直接 `next()` 会导致 404 或白屏。使用 `replace: true` 触发新导航,确保新路由已生效可正确匹配。这是动态路由的核心技巧。

**考点5: 用户登出时如何处理动态路由**

`addRoute` 添加的路由永久存在无法批量删除,不清除会导致新用户访问旧路由造成权限混乱。最简单方案是 `window.location.reload()` 重新初始化应用。Vue Router 4+ 可用 `removeRoute`,但需保存每个 `addRoute` 返回的删除函数逐个调用。

---

#### 经典面试题

**题目1: 实现一个支持角色和权限双重校验的路由过滤函数**

**思路**: 优先检查 `meta.roles`,满足则放行;不满足或不存在时检查 `meta.permissions`,判断用户权限是否包含所需权限。递归处理子路由。

**答案**: 实现灵活的权限过滤,支持粗粒度(角色)和细粒度(权限点)两种控制方式,满足复杂业务场景。

**代码框架**:

```javascript
/**
 * 过滤异步路由
 * @param {Array} routes - 待过滤路由数组
 * @param {Array} userRoles - 用户角色数组 ['admin', 'editor']
 * @param {Array} userPermissions - 用户权限数组 ['user:add', 'user:edit']
 * @returns {Array} 过滤后的路由数组
 */
function filterAsyncRoutes(routes, userRoles, userPermissions) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    let hasAccess = false;
  
    // 优先检查角色
    if (tmp.meta?.roles) {
      hasAccess = tmp.meta.roles.some(role => userRoles.includes(role));
    } 
    // 角色不满足或不存在,检查权限点
    else if (tmp.meta?.permissions) {
      hasAccess = tmp.meta.permissions.some(perm => 
        userPermissions.includes(perm)
      );
    } 
    // 无限制,直接放行
    else {
      hasAccess = true;
    }
  
    if (hasAccess) {
      // 递归处理子路由
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(
          tmp.children, 
          userRoles, 
          userPermissions
        );
      }
      res.push(tmp);
    }
  });

  return res;
}

// 使用示例
const accessRoutes = filterAsyncRoutes(
  asyncRoutes,
  userStore.roles,        // ['admin']
  userStore.permissions   // ['user:add', 'user:delete']
);
```

---

**题目2: 编写完整的全局导航守卫实现动态路由**

**思路**: 判断 token 存在→检查角色信息→未获取则调 API 获取权限→过滤路由→动态添加→重新导航。处理未登录重定向和错误清理。

**答案**: 导航守卫是权限控制的入口,负责身份验证、权限获取、路由动态加载全流程,需细致处理各种边界情况。

**代码框架**:

```javascript
/**
 * 全局前置守卫
 * 职责: 身份验证、权限获取、动态路由添加
 */
import router from './router';
import { userStore } from '@/store/user';
import { filterAsyncRoutes } from './utils';
import { asyncRoutes } from './routes';

// 白名单: 无需登录即可访问
const whiteList = ['/login', '/403', '/404'];

router.beforeEach(async (to, from, next) => {
  const hasToken = !!userStore.token;

  if (hasToken) {
    // ========== 已登录分支 ==========
    if (to.path === '/login') {
      // 已登录访问登录页,重定向到首页
      next({ path: '/' });
    } else {
      const hasRoles = userStore.roles && userStore.roles.length > 0;
    
      if (hasRoles) {
        // 已有角色信息,直接放行
        next();
      } else {
        // 无角色信息,需要获取
        try {
          // 调用 API 获取用户权限
          const { roles, permissions } = await userStore.getInfo();
        
          // 根据权限过滤路由
          const accessRoutes = filterAsyncRoutes(
            asyncRoutes, 
            roles, 
            permissions
          );
        
          // 动态添加路由到路由实例
          accessRoutes.forEach(route => {
            router.addRoute(route);
          });
        
          // 重新导航以激活新添加的路由
          // replace: true 避免留下历史记录
          next({ ...to, replace: true });
        } catch (error) {
          // 获取权限失败(token过期等),清除登录状态
          console.error('Get user info failed:', error);
          userStore.logout();
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    // ========== 未登录分支 ==========
    if (whiteList.includes(to.path)) {
      // 白名单路径直接放行
      next();
    } else {
      // 重定向到登录页,记录目标路径
      next(`/login?redirect=${to.path}`);
    }
  }
});

// 全局后置钩子: 修改页面标题
router.afterEach((to) => {
  document.title = to.meta?.title || 'Admin System';
});
```

---

**题目3: 实现一个增强版的 v-permission 指令支持权限组合**

**思路**: 扩展指令支持与(`&`)或(`|`)逻辑,参数格式如 `['user:add', '&', 'user:edit']` 表示同时需要两个权限。解析表达式并计算结果。

**答案**: 增强指令灵活性,满足"同时拥有多个权限"或"拥有任一权限"等复杂场景,提升代码可读性。

**代码框架**:

```javascript
/**
 * 增强版 v-permission 指令
 * 支持与或逻辑
 * 
 * 用法:
 * v-permission="['user:add']"                  // 单个权限
 * v-permission="['user:add', 'user:edit']"     // 或关系(默认)
 * v-permission="['user:add', '&', 'user:edit']" // 与关系
 * 
 * @param {HTMLElement} el - 绑定的 DOM 元素
 * @param {Object} binding - 指令绑定对象
 */
import { userStore } from '@/store/user';

export default {
  mounted(el, binding) {
    const { value: expression } = binding;
    const userPermissions = userStore.permissions;
  
    // 参数校验
    if (!Array.isArray(expression) || expression.length === 0) {
      throw new Error('v-permission requires a non-empty array');
    }
  
    let hasPermission = false;
  
    // 检查是否包含逻辑操作符
    if (expression.includes('&')) {
      // 与逻辑: 所有权限都必须拥有
      hasPermission = expression
        .filter(item => item !== '&')  // 移除操作符
        .every(perm => userPermissions.includes(perm));
    } else if (expression.includes('|')) {
      // 或逻辑: 拥有任一权限即可
      hasPermission = expression
        .filter(item => item !== '|')
        .some(perm => userPermissions.includes(perm));
    } else {
      // 默认或逻辑
      hasPermission = expression.some(perm => 
        userPermissions.includes(perm)
      );
    }
  
    // 无权限则移除元素
    if (!hasPermission) {
      el.parentNode?.removeChild(el);
    }
  }
};

/**
 * 使用示例
 * 
 * <!-- 拥有 user:add 或 user:create 任一权限即可 -->
 * <button v-permission="['user:add', 'user:create']">添加用户</button>
 * 
 * <!-- 必须同时拥有 user:edit 和 user:delete 权限 -->
 * <button v-permission="['user:edit', '&', 'user:delete']">编辑并删除</button>
 * 
 * <!-- 显式或逻辑 -->
 * <button v-permission="['admin:view', '|', 'super:view']">查看</button>
 */
```

---

**题目4: 如何实现菜单权限与路由权限的联动**

**思路**: 后端返回菜单树和路由配置,前端统一数据结构,菜单的 `path` 字段对应路由的 `path`。渲染菜单时检查对应路由是否存在。

**答案**: 菜单和路由使用相同的权限判断逻辑,确保菜单显示的页面用户一定能访问,避免点击菜单后 404 的尴尬。

**代码框架**:

```javascript
/**
 * 菜单与路由联动方案
 * 核心思想: 菜单数据基于已添加的路由生成
 */

// ========== 第一步: 后端返回统一数据结构 ==========
const backendData = {
  routes: [
    {
      path: '/user',
      component: 'Layout',
      meta: { title: 'User Mgmt', icon: 'user', roles: ['admin'] },
      children: [
        {
          path: 'list',
          component: 'UserList',
          meta: { title: 'User List', roles: ['admin', 'editor'] }
        }
      ]
    }
  ]
};

// ========== 第二步: 生成菜单数据 ==========
/**
 * 从路由配置生成菜单树
 * @param {Array} routes - 路由配置数组
 * @returns {Array} 菜单树数据
 */
function generateMenus(routes) {
  const menus = [];

  routes.forEach(route => {
    // 过滤隐藏路由
    if (route.meta?.hidden) return;
  
    const menu = {
      path: route.path,
      title: route.meta?.title || 'Untitled',
      icon: route.meta?.icon,
      children: []
    };
  
    // 递归处理子路由
    if (route.children && route.children.length) {
      menu.children = generateMenus(route.children);
    }
  
    menus.push(menu);
  });

  return menus;
}

// ========== 第三步: 在导航守卫中统一处理 ==========
router.beforeEach(async (to, from, next) => {
  if (hasToken && !hasRoles) {
    const { roles } = await userStore.getInfo();
  
    // 过滤路由
    const accessRoutes = filterAsyncRoutes(asyncRoutes, roles);
  
    // 动态添加路由
    accessRoutes.forEach(route => router.addRoute(route));
  
    // 生成菜单
    const menus = generateMenus(accessRoutes);
    userStore.setMenus(menus);  // 保存到状态管理
  
    next({ ...to, replace: true });
  }
});

// ========== 第四步: 菜单组件渲染 ==========
/**
 * Sidebar.vue - 侧边栏菜单组件
 */
import { computed } from 'vue';
import { userStore } from '@/store/user';

export default {
  setup() {
    // 从 store 获取菜单数据
    const menuList = computed(() => userStore.menus);
  
    return { menuList };
  }
};

/**
 * 模板部分
 * 
 * <template>
 *   <el-menu>
 *     <menu-item 
 *       v-for="menu in menuList" 
 *       :key="menu.path" 
 *