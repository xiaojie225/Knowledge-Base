
### Vue项目结构与组件划分开发文档

#### 简述

本文档旨在为Vue开发者提供一套关于项目结构组织与组件划分的最佳实践。一个清晰、可扩展的目录结构是大型项目成功的基石，它能显著提升开发效率、降低维护成本，并促进团队协作。我们将遵循原文中提到的核心原则——如语义一致性、单一出入口、就近原则等——并在此基础上，结合Vue 3的特性和业界主流的大型项目组织方案，提供一个更现代化、更具扩展性的结构范例。

---

#### 一、 完整代码（结构示例）与知识点补充

原文提供了几种目录结构的范例，它们很好地体现了按“类型”划分（如`components`, `apis`, `store`）的思路。对于大型项目，我们更推荐一种**“按功能/领域（Feature-Driven）”和“按类型”混合的模式**。这种模式将与特定业务功能紧密相关的代码（组件、API调用、状态、路由）聚合在一起，同时保留全局共享的部分。

下面是一个推荐的、适用于大型Vue 3项目的目录结构，它融合了原文的优点并加入了新思想。

##### 推荐的大型项目结构 (Vue 3 + TypeScript + Pinia)

```plaintext
my-large-vue-project/
├── public/                 # 静态资源，不会被Webpack处理
│   └── index.html
├── src/
│   ├── assets/             # 全局静态资源 (图片, 字体, etc.)
│   ├── components/         # 全局通用组件 (原子组件)
│   │   ├── base/           # 基础组件 (BaseButton, BaseInput, etc.)
│   │   ├── layout/         # 布局组件 (Header, Sidebar, PageLayout, etc.)
│   │   └── common/         # 业务无关的通用组件 (Icon, Avatar, etc.)
│   ├── composables/        # 全局响应式逻辑/Hooks (useUser, useTheme, etc.)
│   ├── config/             # 项目配置 (环境变量, 主题配置, etc.)
│   ├── features/           # **核心：按业务功能/领域划分模块**
│   │   ├── products/
│   │   │   ├── api/        # 商品相关的API (index.ts, useProductApi.ts)
│   │   │   ├── components/ # 只在商品模块内使用的组件 (ProductCard, ProductFilter)
│   │   │   ├── routes/     # 商品相关的路由配置 (index.ts)
│   │   │   ├── store/      # 商品相关的Pinia store (productStore.ts)
│   │   │   ├── types/      # 商品相关的TS类型 (index.ts)
│   │   │   └── views/      # 商品模块的页面级组件 (ProductList.vue, ProductDetail.vue)
│   │   ├── cart/           # 购物车模块 (结构同products)
│   │   └── ...             # 其他业务模块
│   ├── lib/                # 第三方库的封装或配置 (axios.ts, i18n.ts)
│   ├── router/             # 路由主配置 (index.ts)
│   ├── store/              # 全局Pinia store配置 (index.ts)
│   ├── styles/             # 全局样式 (variables.scss, reset.scss, etc.)
│   ├── types/              # 全局TypeScript类型定义
│   ├── utils/              # 全局工具函数 (formatDate, validators, etc.)
│   └── main.ts             # 应用主入口
├── .env.development        # 环境变量
├── .eslintrc.js
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

#### 二、 学习知识

1.  **分层思想 (Layering)**：
    *   **全局层 (`components`, `composables`, `utils`等)**：存放与具体业务完全无关、可在任何地方复用的代码。这部分代码应该具有最高的稳定性和通用性。
    *   **功能/领域层 (`features`)**：这是大型项目划分的核心。每个子文件夹（如`products`, `cart`）代表一个独立的业务领域。这种“高内聚、低耦合”的设计使得：
        *   **关注点分离**：开发某个功能时，大部分工作都在一个文件夹内完成，减少心智负担。
        *   **可维护性**：修改或重构一个功能时，影响范围被限制在模块内部。
        *   **团队协作**：不同团队可以并行负责不同的feature模块，减少代码冲突。
    *   **应用整合层 (`main.ts`, `router/index.ts`, `store/index.ts`)**：负责将所有全局和功能模块组装成一个完整的Vue应用。

2.  **Vue 3 特性应用**
    *   **`composables/`**：专门用于存放Composition API的可组合函数（Hooks）。例如，`useUserData.ts`可以封装获取和管理用户信息的逻辑，任何组件都可以通过`import { useUserData } from '@/composables'`来使用，极大地提高了逻辑复用性。
    *   **Pinia 状态管理**：`features/products/store/` 目录体现了Pinia的天然优势。每个功能模块可以拥有自己独立的Store，逻辑清晰，并且Pinia支持在需要时才动态引入模块，有利于代码分割。

3.  **组件划分策略 (Component Scoping)**
    *   **全局基础组件 (`src/components/base/`)**：这些是UI库的基石，如`BaseButton.vue`, `BaseInput.vue`。它们不包含任何业务逻辑，只负责样式和最基本的交互。通常会全局注册。
    *   **全局布局/通用组件 (`src/components/layout/`, `src/components/common/`)**：如页面骨架、页头、侧边栏等。它们定义了应用的整体结构和外观。
    *   **功能性组件 (`src/features/*/components/`)**：这些组件与特定业务紧密相关，只在对应的feature模块内部使用。例如，`ProductCard.vue`只用于展示商品信息，放在其他地方没有意义。
    *   **页面/视图组件 (`src/features/*/views/`)**：作为路由的直接渲染对象，它们是“容器组件”，负责组织页面布局、获取数据、并将数据传递给下属的展示性组件。

4.  **单一出口原则 (Barrel Files)**:
    原文中提到的“单一入口/出口”非常重要。在每个模块文件夹下创建一个`index.ts`文件来导出所有公共接口，可以简化外部导入。
    ```typescript
    // features/products/components/index.ts
    export { default as ProductCard } from './ProductCard.vue';
    export { default as ProductFilter } from './ProductFilter.vue';

    // 外部使用时
    // 简化前: import ProductCard from '@/features/products/components/ProductCard.vue';
    // 简化后: import { ProductCard } from '@/features/products/components';
    ```

---

#### 三、 用途（用在那个地方）

*   **小型项目/个人项目**：可以直接使用`vue-cli`或`create-vite`生成的默认结构，或者一个扁平化的按类型划分的结构（`views`, `components`, `store`, `router`都在`src`根目录）。
*   **中型项目 (5-10个页面/功能模块)**：可以开始引入模块化思想，在`views`和`components`内部按功能创建子文件夹，例如`views/user/Profile.vue`。
*   **大型/企业级项目 (数十个功能模块，多人协作)**：强烈推荐采用上述的“**功能驱动 (Feature-Driven)**”结构。这种结构的可扩展性和可维护性远超传统的按类型划分，是应对复杂业务需求的最佳实践。尤其适用于微前端架构下的子应用开发，每个`feature`都可以视为一个潜在的微应用。

---
[标签: 前端, Vue, 项目架构, 组件设计, 工程化]
---

#### 四、面试官考察

如果你是面试官，你会怎么考察这个文件里的内容？

##### 10个技术题目

1.  **问题**：在你刚才介绍的“功能驱动(Feature-Driven)”目录结构中，`src/components` 和 `src/features/some-feature/components` 这两个目录存放的组件有什么本质区别？请举例说明。
    **答案**：
    *   **本质区别**在于**业务耦合度**和**复用范围**。
    *   `src/components` 存放的是**全局、业务无关**的组件。它们是应用的UI基础，可以在任何功能模块中使用。例如，一个`BaseButton.vue`，它只定义了按钮的样式、尺寸、点击事件，但不知道这个按钮是用来“购买”还是“提交”的。
    *   `src/features/some-feature/components` 存放的是**与特定业务领域强耦合**的组件，其复用范围仅限于该`feature`内部。例如，`src/features/products/components/ProductCard.vue`，它内部的DOM结构、数据 prop (如`productName`, `price`, `imageUrl`) 都是为“展示商品”这个特定业务场景服务的。把它放到用户中心模块里是毫无意义的。

2.  **问题**：为什么推荐将API请求的逻辑（如Axios实例封装、拦截器配置）放在 `src/lib` 或 `src/api` 目录，而不是在组件中直接使用`axios`？
    **答案**：
    这是为了**分层和解耦**。
    1.  **统一管理**：将所有API相关配置（如`baseURL`、`timeout`、请求/响应拦截器）集中在一个地方，便于统一修改和维护。例如，添加统一的loading状态或错误处理。
    2.  **逻辑复用**：可以封装出多个针对不同服务的`api`实例，或创建通用的请求函数。
    3.  **组件纯粹性**：让Vue组件更专注于UI展示和用户交互，而不是网络请求的实现细节。这使得组件更容易测试和复用。
    ```typescript
    // src/lib/axios.ts - 逻辑层
    import axios from 'axios';
    const apiClient = axios.create({ baseURL: '/api' });
    apiClient.interceptors.request.use(/* ... */);
    export default apiClient;
  
    // SomeComponent.vue - 视图层
    import apiClient from '@/lib/axios';
    apiClient.get('/users/1'); // 组件只关心调用，不关心实现
    ```

3.  **问题**：在大型项目中，如何管理路由配置才能避免`router/index.ts`文件变得异常庞大和难以维护？
    **答案**：
    采用**路由模块化**。在我推荐的结构中，每个`feature`都有自己的`routes/index.ts`文件。
    1.  在`src/features/products/routes/index.ts`中定义所有与商品相关的路由。
    ```typescript
    // src/features/products/routes/index.ts
    import type { RouteRecordRaw } from 'vue-router';
    const productRoutes: Array<RouteRecordRaw> = [
      { path: '/products', component: () => import('../views/ProductList.vue') },
      { path: '/products/:id', component: () => import('../views/ProductDetail.vue') }
    ];
    export default productRoutes;
    ```
    2.  在主路由文件`src/router/index.ts`中，导入并展开这些模块化路由。
    ```typescript
    // src/router/index.ts
    import { createRouter, createWebHistory } from 'vue-router';
    import productRoutes from '@/features/products/routes';
    import cartRoutes from '@/features/cart/routes';
  
    const router = createRouter({
      history: createWebHistory(),
      routes: [...productRoutes, ...cartRoutes /*, ... other feature routes */]
    });
    export default router;
    ```
    这样做使得路由配置与功能模块内聚，查找和修改特定功能的路由变得非常容易。

4.  **问题**：`composables`目录是Vue 3推荐的做法，它解决了什么问题？请你现场写一个简单的`useCounter`的例子。
    **答案**：
    `composables`（可组合函数）主要解决了**Vue 2中 Mixins 的缺陷**，并提供了一种更灵活、更清晰的逻辑复用方式。
    *   **解决了**：
        1.  **来源不明确**：Mixin中的数据和方法被混入组件后，在组件中看不出它们来自哪个Mixin。
        2.  **命名冲突**：多个Mixin可能定义同名的数据或方法，导致覆盖和冲突。
        3.  **类型推断不佳**：在TypeScript中，Mixin的类型支持很差。
    *   **`useCounter` 示例**：
    ```typescript
    // src/composables/useCounter.ts
    import { ref, readonly } from 'vue';

    export function useCounter(initialValue = 0) {
      const count = ref(initialValue);
      const increment = () => count.value++;
      const decrement = () => count.value--;

      // 返回响应式状态和方法
      // 使用readonly可以防止外部直接修改count
      return {
        count: readonly(count),
        increment,
        decrement
      };
    }
  
    // In SomeComponent.vue
    // <script setup>
    // import { useCounter } from '@/composables/useCounter';
    // const { count, increment } = useCounter(10);
    // </script>
    ```
    优点是：数据来源清晰（从`useCounter`解构而来），无命名冲突风险，且具备完美的TypeScript类型推断。

5.  **问题**：请解释一下“原子组件(Atomic Components)”的概念，并说明它在你设计的目录结构中对应哪个位置？
    **答案**：
    *   **原子组件**是**原子设计（Atomic Design）**理论中的最小单位。它们是构成UI的最基础、不可再分的元素，比如按钮、输入框、标签、图标。它们本身不具备业务上下文，是纯粹的UI构建块。
    *   在我的目录结构中，它们主要对应`src/components/base/`目录。例如，`BaseButton.vue`、`BaseInput.vue`、`BaseModal.vue`都是原子组件。它们封装了最底层的样式和行为，为上层组件的组合提供了稳定可靠的基础。

6.  **问题**：在你的项目结构中，全局CSS变量（如主题色、字体大小）应该放在哪里？为什么？
    **答案**：
    应该放在`src/styles/variables.scss`（或`.less`, `.css`）文件中。
    *   **为什么**：
        1.  **单一数据源 (Single Source of Truth)**：所有设计规范相关的变量都集中在一个地方，方便全局查找和修改。当需要更换主题或调整基础设计时，只需要修改这一个文件。
        2.  **可维护性**：避免将颜色、字号等硬编码在各个组件的样式中，这种做法称为“魔术数字”，会给后期维护带来巨大困难。
        3.  **全局注入**：通常会在`vite.config.ts`或`vue.config.js`中配置，将这个变量文件自动注入到每个SFC的`<style>`块中，这样每个组件都可以直接使用这些变量，而无需手动`@import`。

7.  **问题**：如果一个工具函数（例如`formatDate`）只在一个`feature`模块（比如订单模块）中使用，你会把它放在`src/utils`还是`src/features/orders/utils`？
    **答案**：
    我会毫不犹豫地将它放在`src/features/orders/utils`目录下。
    *   **遵循就近原则和高内聚原则**。如果一个函数当前只服务于一个特定的业务模块，那么它就是该模块的一部分。将它放在模块内部，可以增强模块的独立性和完整性。
    *   **未来的可扩展性**：如果将来另一个模块也需要用到`formatDate`，届时再考虑**将它重构并提升(promote)到全局的 `src/utils` 目录**。过早地将其放入全局是一种“过度设计”，可能会让全局`utils`目录变得臃肿，包含很多实际上很少被复用的函数。

8.  **问题**：谈谈你对`.env`系列文件的理解，它们在项目中的作用是什么？
    **答案**：
    `.env`文件是用来管理**环境变量**的。它们允许我们为不同的部署环境（如开发、测试、生产）配置不同的变量值，而无需修改代码。
    *   `.env.development`：开发环境 (`npm run dev`) 使用的变量。
    *   `.env.production`：生产环境 (`npm run build`) 使用的变量。
    *   `.env`：所有环境下都会加载的默认变量，优先级最低。
    *   **作用**：主要用来存放敏感信息（如API密钥）或环境特定的配置（如API服务器地址）。例如，在`.env.development`中`VITE_API_BASE_URL = 'http://localhost:3000/api'`，而在`.env.production`中`VITE_API_BASE_URL = 'https://api.myapp.com'`。代码中通过`import.meta.env.VITE_API_BASE_URL`来使用，Vue CLI则是`process.env.VUE_APP_*`。

9.  **问题**：假设你的项目需要适配多语言（i18n），你会如何组织相关的文件和配置？
    **答案**： 我会创建一个`src/locales`或`src/i18n`目录来统一管理。
    ```
    src/
    ├── locales/
    │   ├── en.json
    │   ├── zh-CN.json
    │   └── index.ts  # i18n实例初始化
    └── main.ts       # 引入并use i18n实例
    ```
    *   `en.json`, `zh-CN.json`等文件存放不同语言的文案键值对。
    *   `index.ts`负责创建和配置`vue-i18n`实例，导出`i18n`对象。
    *   `main.ts`中导入`i18n`实例并`app.use(i18n)`。
    *   **对于大型项目**，我还会考虑按`feature`拆分语言包，在`features/products/locales/en.json`中只放商品相关的文案，然后通过脚本将它们合并成最终的语言文件，以提高可维护性。

10. **问题**：如果让你设计一个可换肤（主题切换）的功能，你会如何利用这个目录结构来实现？
    **答案**：
    1.  **定义主题变量**：在`src/styles/themes/`目录下创建主题文件，比如`dark.scss`和`light.scss`。每个文件都定义一套完整的CSS自定义属性（CSS Variables）。
        ```scss
        // light.scss
        :root {
          --bg-color: #fff;
          --text-color: #333;
        }
        // dark.scss
        [data-theme='dark'] {
          --bg-color: #1a1a1a;
          --text-color: #eee;
        }
        ```
    2.  **加载主题样式**：在`src/styles/index.scss`中导入所有主题文件。
    3.  **状态管理**：在`src/store/`创建一个`themeStore.ts`（或者在`composables`里创建`useTheme.ts`），用来管理当前的主题状态（`'light'`或`'dark'`）。
    4.  **动态切换**：当用户切换主题时，调用store中的action，这个action会修改状态，并通过`document.documentElement.setAttribute('data-theme', newTheme)`来改变`<html>`标签上的`data-theme`属性。
    5.  **组件使用**：所有组件的样式都应该使用这些CSS变量（`background-color: var(--bg-color);`），而不是硬编码颜色值。这样，当`<html>`的`data-theme`属性改变时，由于CSS级联，所有组件的颜色都会立即自动更新。

##### 10道业务逻辑题目

1.  **场景**：你正在开发一个电商平台的“订单列表”页面，这个页面非常复杂，包含多种订单状态（待支付、待发货、已完成、已取消），并且每种状态下卡片的按钮和显示信息都不同。你会如何组织这个页面的组件？
    **答案**：
    我会采用**组合和策略模式**。
    1.  **创建一个基础的`OrderCard.vue`组件** (`features/orders/components/OrderCard.vue`)。这个组件负责展示所有订单共有的信息，如订单号、商品列表、总价。它会通过`props`接收订单数据。
    2.  **为不同状态创建策略组件**：例如`OrderStatusActionsPendingPayment.vue`，`OrderStatusActionsShipped.vue`等。每个组件负责渲染特定状态下的操作按钮（如“去支付”，“确认收货”）。
    3.  **在`OrderCard.vue`中使用动态组件 `<component :is="...">`**。根据传入的订单状态，动态地渲染对应的操作组件。
    ```vue
    <!-- OrderCard.vue -->
    <template>
      <!-- ... shared order info ... -->
      <component :is="actionComponent" :order="order" />
    </template>
    <script setup>
    import { computed } from 'vue';
    // ... import all action components
    const props = defineProps(['order']);
    const actionComponent = computed(() => {
      switch (props.order.status) {
        case 'pending_payment': return 'OrderStatusActionsPendingPayment';
        // ... other cases
        default: return null;
      }
    });
    </script>
    ```
    这样做使得`OrderCard`主组件逻辑清晰，并且新增或修改某个订单状态的逻辑时，只需要关注对应的策略组件，符合开闭原则。

2.  **场景**：项目需要一个全局搜索框，它可以在任何页面调用，搜索结果会跳转到专门的搜索结果页。搜索框本身还需要有历史记录和热门搜索的下拉推荐。如何设计这个组件？
    **答案**：
    1.  **组件位置**：这是一个典型的全局通用组件，我会把它放在`src/components/common/GlobalSearch.vue`。
    2.  **状态管理**：搜索相关的状态（如历史记录、热门搜索词）需要持久化，并且可能在其他地方也需要访问。因此，我会创建一个`src/features/search/store/searchStore.ts`来管理这些状态，并使用`pinia-plugin-persistedstate`进行本地存储。
    3.  **API调用**：搜索建议的API调用逻辑会封装在`src/features/search/api/index.ts`中。
    4.  **组件实现**：`GlobalSearch.vue`组件会从`searchStore`中获取历史和热门词，监听输入框的`input`事件并调用API获取搜索建议。当用户提交搜索时，它会使用`vue-router`进行编程式导航，`router.push({ path: '/search', query: { q: searchTerm } })`。

3.  **场景**：在一个管理后台中，有“用户管理”、“角色管理”、“权限管理”三个功能模块。其中，给角色分配权限的弹窗，在角色管理页面需要；查看用户拥有哪些权限的详情页，在用户管理页面需要。这个“权限树”组件应该放在哪里？
    **答案**：
    这是一个跨`feature`的业务组件。最佳实践是**创建一个新的`feature`模块，名为`permissions`**。
    1.  `src/features/permissions/components/PermissionTree.vue`：创建这个核心的权限树组件。
    2.  `src/features/permissions/api/`：封装获取权限列表的API。
    3.  `src/features/permissions/store/`：可能会有一个store来缓存权限树数据。
    4.  在`roles`和`users`模块中，直接`import { PermissionTree } from '@/features/permissions/components'`来使用它。
    **理由**：“权限”本身就是一个独立的业务领域。将它抽取成一个独立的`feature`，而不是随意地放在`users`或`roles`里，可以清晰地反映出业务领域的划分，避免模块间的循环依赖，也使得“权限”相关的逻辑（未来可能还有更多）有了明确的归属。

4.  **场景**：表单页面非常多，且大部分表单都需要做非空、邮箱格式、手机号格式等校验。如何优雅地复用这些校验逻辑？
    **答案**：
    我会将校验逻辑封装到`src/utils/validators.ts`中。
    1.  **创建校验函数**：
    ```typescript
    // src/utils/validators.ts
    export const required = (val) => !!val || 'This field is required.';
    export const isEmail = (val) => /.+@.+\..+/.test(val) || 'Invalid email format.';
    export const isMobile = (val) => /^1\d{10}$/.test(val) || 'Invalid mobile number.';
    ```
    2.  **结合UI库使用**：大多数UI库（如Element Plus, Vant）的表单组件都支持传入一个校验规则数组。
    ```vue
    <template>
      <el-form :model="form" :rules="rules">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
    </template>
    <script setup>
    import { required, isEmail } from '@/utils/validators';
    const rules = {
      email: [required, isEmail], // 直接复用
    };
    </script>
    ```
    对于更复杂的、需要组合的校验逻辑，还可以创建一个`composables`函数，如`useFormValidation.ts`，来进一步封装。

5.  **场景**：应用需要一个全局的加载指示器（loading bar），在每次路由跳转或发起主要API请求时显示。你会如何实现？
    **答案**：
    1.  **组件**：创建一个`src/components/common/LoadingBar.vue`组件。
    2.  **状态管理**：在全局`store`（例如`src/store/appStore.ts`）中定义一个`isLoading`的状态。
    3.  **路由拦截**：在`src/router/index.ts`中设置全局导航守卫。
        ```typescript
        router.beforeEach((to, from, next) => {
          appStore.setLoading(true);
          next();
        });
        router.afterEach(() => {
          appStore.setLoading(false);
        });
        ```
    4.  **API拦截**：在`src/lib/axios.ts`的请求/响应拦截器中控制loading状态。
        ```typescript
        // 请求拦截器
        apiClient.interceptors.request.use(config => {
          appStore.setLoading(true);
          return config;
        });
        // 响应拦截器
        apiClient.interceptors.response.use(response => {
          appStore.setLoading(false);
          return response;
        }, error => {
          appStore.setLoading(false);
          return Promise.reject(error);
        });
        ```
    5.  **在`App.vue`中使用**：在`App.vue`的模板中，根据`appStore.isLoading`的值来决定是否显示`LoadingBar`组件。为了避免API请求和路由跳转的冲突，可以把`isLoading`改成一个计数器，`loadingCount`，每次请求/跳转时+1，结束后-1，只有当`loadingCount`>0时才显示加载条。

6.  **场景**：一个社交应用，用户Feed流页面需要实现无限滚动加载。如何设计这个功能？
    **答案**：
    1.  **API设计**：后端API需要支持分页，例如`/api/feed?page=1&limit=10`。
    2.  **状态管理**：在`features/feed/store/feedStore.ts`中管理Feed列表数据`posts`，当前页码`currentPage`，以及一个加载状态`isLoading`和是否还有更多数据`hasMore`。
    3.  **封装加载逻辑**：在`feedStore`中创建一个`fetchNextPage`的action。这个action会检查`isLoading`和`hasMore`，如果可以加载，则将`isLoading`设为`true`，请求下一页数据，然后将新数据追加到`posts`数组，更新`currentPage`和`hasMore`，最后将`isLoading`设为`false`。
    4.  **UI实现**：在`FeedList.vue`页面中，我会创建一个`composables`函数`useInfiniteScroll.ts`，它接收一个DOM元素和一个加载回调函数。它会使用`IntersectionObserver`来监听一个放置在列表底部的“哨兵”元素。当哨兵元素进入视口时，就调用传入的加载回调（即`feedStore.fetchNextPage`）。
    ```vue
    <!-- FeedList.vue -->
    <div v-for="post in posts" :key="post.id">...</div>
    <div ref="sentinel"></div> <!-- 哨兵元素 -->
  
    <script setup>
    // ...
    import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
    const sentinel = ref(null);
    useInfiniteScroll(sentinel, feedStore.fetchNextPage);
    </script>
    ```

7.  **场景**：一个CRM系统，客户列表页需要非常复杂的筛选功能，包括客户名称搜索（输入框）、客户等级（下拉框）、创建日期范围（日期选择器）等10多个筛选项。如何管理这些筛选条件的状态和逻辑？
    **答案**：
    1.  **组件拆分**：将整个筛选区域封装成一个独立的组件`CustomerFilter.vue` (`features/customers/components/`)。
    2.  **状态管理**：推荐使用一个独立的Pinia store `customerFilterStore.ts`来管理所有的筛选条件对象。这样做的好处是，筛选条件可以被持久化，并且当用户离开列表页再返回时，可以恢复之前的筛选状态。
    3.  **URL同步**：将筛选条件与URL的查询参数（query params）进行同步。当筛选条件改变时，使用`router.push({ query: newFilters })`更新URL；当页面加载时，从URL的`route.query`中读取参数来初始化`customerFilterStore`。这使得筛选状态可以被分享和收藏。
    4.  **API调用**：列表页面监听`customerFilterStore`的变化（或者`route.query`的变化），当变化时，重新调用获取客户列表的API，并将筛选条件作为参数传入。

8.  **场景**：开发一个在线问卷应用，问卷由多种题型组成（单选、多选、填空）。在问卷编辑器中，用户可以动态添加、删除、排序这些不同题型的题目。你会如何设计这个编辑器？
    **答案**：
    这是一个典型的动态表单/列表场景。
    1.  **数据驱动**：定义一个数组来表示问卷结构，例如`const questions = ref([{ type: 'single-choice', title: '...', options: [...] }, { type: 'text-input', title: '...' }])`。
    2.  **策略组件**：为每种题型创建一个组件，如`SingleChoiceEditor.vue`、`TextInputEditor.vue`。
    3.  **主编辑器**：使用`v-for`遍历`questions`数组。在循环内部，使用动态组件`<component :is="...">`根据`question.type`来渲染对应的题型编辑器组件，并双向绑定数据。
    4.  **拖拽排序**：使用`vuedraggable`库来包裹`v-for`循环，可以轻松实现题目的拖拽排序，它会自动更新`questions`数组的顺序。
    5.  **增删操作**：提供“添加题目”按钮，点击后向`questions`数组`push`一个新的题目对象。每个题目编辑器内部提供“删除”按钮，点击后通过`emit`事件通知父组件，从数组中`splice`掉对应的题目。

9.  **场景**：一个项目需要接入第三方JS-SDK，比如地图SDK。这个SDK很大，且只在某个特定的页面使用。如何优化它的加载？
    **答案**：
    1.  **异步加载SDK**：我不会在`public/index.html`中用`<script>`标签同步加载它。而是会封装一个`useMapSDK.ts`的composable函数。
    ```typescript
    // src/composables/useMapSDK.ts
    import { ref } from 'vue';

    let sdkPromise = null;
    export function useMapSDK() {
      const isLoaded = ref(false);
      if (!sdkPromise) {
        sdkPromise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://some-map-sdk-url.js';
          script.onload = () => {
            isLoaded.value = true;
            resolve(window.MapSDK); // 假设SDK加载后会挂载到window
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      return { isLoaded, sdkPromise };
    }
    ```
    2.  **在组件中使用**：在需要地图的页面组件（`MapView.vue`）的`onMounted`钩子中调用这个hook。
    ```vue
    // MapView.vue
    import { onMounted } from 'vue';
    import { useMapSDK } from '@/composables/useMapSDK';

    onMounted(async () => {
      const { sdkPromise } = useMapSDK();
      const MapSDK = await sdkPromise;
      // 只有在这里，SDK才加载完毕，可以安全地初始化地图
      new MapSDK.Map(...);
    });
    ```
    这样就实现了SDK的按需、异步加载，不会影响首屏性能。

10. **场景**：项目中有多个地方需要上传图片，并显示上传进度和预览。如何设计一个可复用的图片上传组件？
    **答案**：
    1.  **组件位置**：这是一个全局业务组件，可以放在`src/components/common/ImageUploader.vue`。
    2.  **Props 设计**：设计灵活的`props`，如`action` (上传地址), `max-size`, `accept` (文件类型), `v-model:fileList` (支持双向绑定已上传文件列表)。
    3.  **Slots 设计**：使用作用域插槽（scoped slots）来提供最大程度的自定义能力。
        ```vue
        <ImageUploader v-model:fileList="files">
          <template #default="{ upload, progress, previewUrl }">
            <button @click="upload">选择文件</button>
            <div v-if="progress > 0">进度: {{ progress }}%</div>
            <img v-if="previewUrl" :src="previewUrl" />
          </template>
        </ImageUploader>
        ```
    4.  **内部逻辑 (`<script setup>`)**：组件内部封装`input[type=file]`的交互、文件读取（`FileReader`用于预览）、使用`XMLHttpRequest`或`axios`的`onUploadProgress`事件来计算和更新上传进度、处理上传成功和失败的状态。通过`defineExpose`暴露`upload`等方法，并通过作用域插槽将内部状态（`progress`, `previewUrl`）和方法传递给父组件，让父组件来决定UI的具体展现形式。

---

#### 五、快速上手指南（给未来的你）

嘿，未来的我！要启动一个新项目并搭建一个牛逼的、可扩展的结构吗？别再从零开始了，按这个清单来：

**1. 初始化项目**
```bash
# 使用Vite，现代前端的选择
npm create vite@latest my-awesome-project --template vue-ts
cd my-awesome-project
npm install
```

**2. 创建核心目录**
在`src`文件夹里，删掉默认的`components`，然后创建下面这些：
```
src/
├── assets/
├── components/
│   ├── base/
│   └── layout/
├── composables/
├── features/
├── lib/
├── router/
├── store/
├── styles/
├── utils/
```
**3. 按功能开工**
接到第一个需求，比如“用户登录注册”。
*   在`features`里建个`auth`目录：`src/features/auth`。
*   需要登录页？在`auth`里建`views/Login.vue`。
*   需要登录API？在`auth`里建`api/index.ts`。
*   需要管理用户状态？在`auth`里建`store/userStore.ts`。
*   需要登录页的路由？在`auth`里建`routes/index.ts`。

**4. 思考组件的归属**
*   做一个按钮？问自己：“这个按钮除了登录，别的地方用吗？”
    *   **用** -> 扔到 `src/components/base/BaseButton.vue`。
    *   **不用，只在登录表单里用** -> 留在 `src/features/auth/components/LoginForm.vue`。

**5. 优先使用`composables`**
*   有个跨组件的复杂逻辑（比如倒计时）？别用Mixin！写个`useTimer.ts`放到`src/composables/`里。

**秘诀：从`features`开始思考，让代码跟着业务走。全局的东西是慢慢从`features`里“提炼”出来的，而不是一开始就过度设计。**

好了，开干吧！这个结构能撑住你的下一个独角兽项目。