好的，作为一名前端工程师，我非常乐意为您梳理关于SPA（单页应用）的知识，并以一个完整的开发文档、面试官视角以及快速使用指南的形式呈现。

---

### **开发文档：深入理解与实践SPA（单页应用）**

#### **1. 概述 (Summary)**

本文档旨在深入探讨SPA（Single-Page Application，单页应用）的核心概念、实现原理及其与传统MPA（Multi-Page Application，多页应用）的区别。SPA模型的核心在于，它仅在初始时加载一个HTML页面，后续的用户交互和页面切换都通过JavaScript动态重写当前页面内容，而无需从服务器重新加载整个页面。这带来了如桌面应用般流畅的用户体验，并且促进了前后端分离的开发模式。

#### **2. 核心知识点 (Core Concepts)**

-   **用户体验**: SPA的最显著优势是提供了快速、流畅的页面切换体验。由于避免了整页刷新，内容更新几乎是即时的。
-   **前端路由**: 这是实现SPA的关键技术。它并非真正的后端路由，而是前端通过监听URL的变化，在不向服务器发送请求的情况下，匹配并渲染相应的视图组件。
-   **两种实现模式**:
    1.  **Hash模式**: 利用URL中的`#`（hash/锚点）部分。`hash`值的改变不会触发浏览器向服务器发送请求，但会触发`hashchange`事件。我们可以监听此事件来更新页面内容。URL示例：`https://example.com/#/home`。
    2.  **History模式**: 利用HTML5的History API（`pushState`, `replaceState`, `popstate`事件）。它允许我们改变浏览器地址栏的URL而不刷新页面。URL示例：`https://example.com/home`。这种模式的URL更美观，但需要服务器端配置支持，以防止用户直接访问某个路由（如`example.com/home`）时出现404错误。

#### **3. 完整示例 (Complete Example)**

我们将基于原文的简易路由器进行扩展，使其能够真正地渲染UI，并补充Vue 3中使用官方路由库`vue-router`的专业写法。

##### **3.1 原生JS实现 (Vanilla JS Implementation)**

这个例子将展示一个基本的HTML结构和两个JS路由器（Hash和History），通过点击链接切换不同页面的内容。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA 原理演示</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        nav { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        nav a { margin-right: 15px; text-decoration: none; color: #007BFF; font-size: 18px; }
        nav a:hover { text-decoration: underline; }
        #app { padding: 20px; border: 1px solid #eee; border-radius: 5px; min-height: 100px; }
        .active { font-weight: bold; color: #0056b3; }
    </style>
</head>
<body>
    <h1>SPA 原理演示</h1>
  
    <!-- 导航区 -->
    <nav id="navigation">
        <!-- Hash 模式链接 -->
        <!-- <a href="#/">首页</a>
        <a href="#/about">关于我们</a>
        <a href="#/contact">联系我们</a> -->

        <!-- History 模式链接 -->
        <a href="/" onclick="miniRouter.push('/'); return false;">首页</a>
        <a href="/about" onclick="miniRouter.push('/about'); return false;">关于我们</a>
        <a href="/contact" onclick="miniRouter.push('/contact'); return false;">联系我们</a>
    </nav>
  
    <!-- 内容渲染区 -->
    <div id="app"></div>

    <script>
        // --------- 扩展知识点：内容模板 ---------
        const pages = {
            '/': {
                template: `<h2>首页</h2><p>欢迎来到我们的主页！</p>`,
                title: '首页'
            },
            '/about': {
                template: `<h2>关于我们</h2><p>我们是一家充满活力的科技公司。</p>`,
                title: '关于我们'
            },
            '/contact': {
                template: `<h2>联系我们</h2><p>您可以通过邮件 contact@example.com 联系我们。</p>`,
                title: '联系我们'
            }
        };

        const appContainer = document.getElementById('app');
        const navLinks = document.querySelectorAll('#navigation a');

        // 更新UI的公共函数
        function updateUI(path) {
            const content = pages[path] || { template: '<h2>404 - 页面未找到</h2>', title: '404' };
            appContainer.innerHTML = content.template;
            document.title = content.title; // 知识点：更新页面标题

            // 知识点：更新导航链接的激活状态
            navLinks.forEach(link => {
                // 对于history模式，比较pathname；对于hash模式，比较hash
                const linkPath = new URL(link.href).pathname;
                if (linkPath === path) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
      
        // --------- 原有代码基础上补充知识点 ---------

        // --- Hash 模式 Router (适用于 <a href="#/"> 写法) ---
        class HashRouter {
            constructor() {
                this.routes = {};
                // 页面加载时和hash变化时都触发refresh
                window.addEventListener('load', this.refresh.bind(this), false);
                window.addEventListener('hashchange', this.refresh.bind(this), false);
            }
          
            route(path, callback) {
                this.routes[path] = callback;
            }
          
            refresh() {
                // 获取当前hash，默认为'/'
                const currentPath = location.hash.slice(1) || '/';
                if (this.routes[currentPath]) {
                    this.routes[currentPath]();
                } else {
                    // 知识点：处理未定义的路由
                    updateUI('/404');
                }
            }
        }
      
        // --- History 模式 Router (适用于 onclick="miniRouter.push('/')" 写法) ---
        class HistoryRouter {
            constructor() {
                this.routes = {};
                this.listenPopState();
            }

            route(path, callback) {
                this.routes[path] = callback;
            }

            push(path) {
                // 知识点：检查当前路径是否与目标路径相同，避免重复推送
                if (location.pathname === path) return;
                history.pushState({path: path}, null, path);
                this.routes[path] && this.routes[path]();
            }
          
            listenPopState() {
                window.addEventListener('popstate', e => {
                    const path = e.state && e.state.path ? e.state.path : '/';
                    this.routes[path] && this.routes[path]();
                });
            }

            // 知识点：增加一个初始加载的处理函数
            init() {
                const currentPath = location.pathname || '/';
                // 替换当前历史记录，确保刷新时状态正确
                history.replaceState({path: currentPath}, null, currentPath);
                if (this.routes[currentPath]) {
                    this.routes[currentPath]();
                } else {
                    updateUI('/404');
                }
            }
        }
      
        // --- 使用 Router (请根据需要注释掉其中一种模式) ---

        /* --- Hash 模式使用 ---
        // 1. 修改HTML中a标签为 <a href="#/">...</a>
        // 2. 取消下面的注释
        const miniRouter = new HashRouter();
        miniRouter.route('/', () => updateUI('/'));
        miniRouter.route('/about', () => updateUI('/about'));
        miniRouter.route('/contact', () => updateUI('/contact'));
        */

        // --- History 模式使用 ---
        // 1. 确保HTML中a标签使用 onclick 事件
        // 2. 使用下面的代码
        const miniRouter = new HistoryRouter();
        miniRouter.route('/', () => updateUI('/'));
        miniRouter.route('/about', () => updateUI('/about'));
        miniRouter.route('/contact', () => updateUI('/contact'));
        miniRouter.init(); // 初始化
      
    </script>
</body>
</html>
```

##### **3.2 Vue 3 实现 (Vue 3 Implementation)**

在现代前端框架中，我们通常使用官方的路由库，例如`vue-router`。它为我们封装了Hash和History模式的底层细节，并提供了声明式的API。

假设有一个Vue 3项目结构：
```
/src
  ├── components
  │   ├── Home.vue
  │   ├── About.vue
  │   └── Contact.vue
  ├── router
  │   └── index.js
  ├── App.vue
  └── main.js
```

**`src/router/index.js` (路由配置文件)**
```javascript
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import Home from '../components/Home.vue';
import About from '../components/About.vue';
import Contact from '../components/Contact.vue';

// 定义路由规则
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact,
    },
];

// 创建 router 实例
const router = createRouter({
    // 使用 History 模式。若要使用 Hash 模式，请用 createWebHashHistory()
    history: createWebHistory(), 
    routes, // routes: routes 的缩写
    // 知识点：为活动的链接添加class
    linkActiveClass: 'router-link-active',
});

export default router;
```

**`src/main.js` (入口文件)**
```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 引入路由配置

const app = createApp(App);

app.use(router); // 全局注册路由

app.mount('#app');
```

**`src/App.vue` (根组件)**
```vue
<template>
  <div id="app-container">
    <h1>Vue 3 SPA 示例</h1>
    <nav>
      <!-- <router-link> 是 vue-router 提供的组件，用于生成导航链接 -->
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于我们</router-link>
      <router-link to="/contact">联系我们</router-link>
    </nav>
    <main>
      <!-- <router-view> 是一个占位符，用于渲染当前路由匹配到的组件 -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// Vue 3 Composition API 的 <script setup> 语法，无需额外代码
</script>

<style>
#app-container { font-family: Avenir, Helvetica, Arial, sans-serif; padding: 20px; }
nav { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
nav a { margin-right: 15px; text-decoration: none; color: #2c3e50; font-size: 18px; }
/* vue-router 会为当前激活的链接自动添加 'router-link-active' class */
.router-link-active { 
  font-weight: bold; 
  color: #42b983;
}
main { padding: 20px; border: 1px solid #eee; border-radius: 5px; min-height: 100px; }
</style>
```

**`src/components/Home.vue` (组件示例)**
```vue
<template>
  <div>
    <h2>首页</h2>
    <p>欢迎来到我们的主页！这是由Vue组件渲染的内容。</p>
  </div>
</template>
```
(About.vue 和 Contact.vue 结构类似)

#### **4. 用途 (Use Cases)**

SPA架构非常适合：
-   **富交互应用**: 例如在线文档编辑器、数据仪表盘、项目管理工具等，用户需要在单个视图内进行大量操作。
-   **Web App**: 需要提供接近原生App体验的移动端或桌面端网页应用。
-   **前后端分离项目**: SPA天然地将前端视图逻辑与后端API分离，使得团队可以并行开发，职责清晰。

---

### **面试官考察环节**

如果你把这份文档作为学习材料给我看，我会这样考察你是否真正掌握了。

#### **技术知识题 (10题)**

1.  **问题**: 请简述SPA的“单页”体现在哪里？
    **答案**: “单页”体现在整个应用生命周期中，浏览器始终停留在同一个HTML页面上（通常是`index.html`）。页面的切换不是通过URL跳转请求新的HTML文件，而是通过JavaScript动态地改变页面内容和URL，给用户页面切换的“错觉”。

2.  **问题**: 在实现前端路由时，Hash模式和History模式最核心的区别是什么？
    **答案**: 核心区别在于URL的表现形式和对服务器的要求。
    -   **Hash模式**: URL中带有`#`，例如 `example.com/#/user`。`#`后的内容变化不会触发浏览器向服务器发请求，兼容性好，无需服务器特殊配置。
    -   **History模式**: URL更美观，例如 `example.com/user`。它依赖HTML5 History API。但当用户直接访问或刷新这个URL时，浏览器会向服务器请求`/user`这个资源，如果服务器没有配置相应的回退规则（将所有前端路由都指向`index.html`），就会导致404。

3.  **问题**: 为什么说History模式不利于SEO，但又可以通过SSR解决？
    **答案**: 传统的SPA内容由JS动态渲染，搜索引擎爬虫可能无法执行JS或等待JS执行完毕，导致抓取到的HTML是空的或不完整的，因此不利于SEO。SSR（服务端渲染）解决了这个问题，它在服务器端将Vue/React组件渲染成完整的HTML字符串后，再返回给客户端（包括爬虫），这样爬虫就能直接获取到有内容的页面，实现了良好的SEO。

4.  **问题**: 请看这段代码，当用户点击浏览器“后退”按钮时，会发生什么？
    ```javascript
    // (假设当前在 /page2 页面, 是通过 miniRouter.push('/page2') 跳转过来的)
    window.addEventListener('popstate', e => {
        console.log('popstate event triggered!', e.state);
    });
    ```
    **答案**: `popstate`事件会被触发。`e.state`将是上一个页面的状态对象（即`pushState`时传入的第一个参数，例如`{path: '/'}`）。程序可以根据`e.state`中的信息来渲染回上一个页面的内容。

5.  **问题**: 你如何修改上面的原生JS HistoryRouter，使其支持路由参数，例如 `/users/123`？
    **答案**: 这需要引入路由匹配的逻辑。可以将路由定义从简单的键值对`this.routes[path]`改为支持正则表达式或路径模式的数组。
    ```javascript
    // 简易思路代码
    // 原来： this.routes['/about'] = callback;
    // 修改后：
    this.routes.push({ path: '/users/:id', callback: callback });

    // push时需要匹配规则
    const match = this.routes.find(route => {
        const regex = new RegExp(`^${route.path.replace(':id', '(\\w+)')}$`);
        return regex.test(path);
    });
    if (match) {
        const params = path.match(regex).slice(1);
        match.callback(...params); // 将参数传给回调
    }
    ```

6.  **问题**: 在Vue 3中，`<router-link to="/about">`和`<a href="/about">`有什么本质区别？
    **答案**: 本质区别在于`<router-link>`会拦截点击事件，阻止浏览器的默认跳转行为。它会调用`vue-router`实例的`push`或`replace`方法来改变URL，并触发视图更新，而不会导致整个页面重新加载。而`<a href="/about">`会触发浏览器的默认行为，向服务器请求`/about`这个地址，导致整页刷新，破坏了SPA的体验。

7.  **问题**: 如何在Vue 3的`setup`脚本中实现编程式导航（即通过JS代码跳转）？
    **答案**: 可以使用`vue-router`提供的`useRouter` hook。
    ```vue
    <script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

    function navigateToHome() {
        router.push('/');
    }
    </script>
    ```

8.  **问题**: SPA的首屏加载速度为什么可能较慢？有哪些优化手段？
    **答案**: **原因**: SPA需要一次性或按需加载所有必要的JS、CSS资源，JS文件体积可能很大，浏览器需要下载、解析、执行这些脚本后才能渲染出首屏内容。
    **优化手段**:
    -   **代码分割/路由懒加载**: 将不同路由的组件打包成独立的JS块，只有在访问该路由时才加载对应的JS文件。
    -   **资源压缩与合并**: 使用Webpack/Vite等工具压缩JS/CSS/图片。
    -   **使用CDN**: 将静态资源部署到CDN加速访问。
    -   **服务端渲染(SSR)或预渲染(Prerendering)**: 提前生成首屏HTML，加快内容呈现速度。

9.  **问题**: 如果我的项目只需要在几个特定页面实现SPA效果，其他页面仍是传统MPA，这种混合模式可行吗？如何实现？
    **答案**: 完全可行。可以在MPA的某个页面中内嵌一个完整的SPA应用。例如，`example.com/dashboard`是一个由Vue/React构建的SPA，服务器配置Nginx/Apache，将所有对`/dashboard/*`的请求都指向承载这个SPA的`dashboard.html`。而网站的其他部分如`/blog`、`/about`则由传统的后端模板引擎渲染。

10. **问题**: 假设我们使用History模式，Nginx该如何配置来支持它？
    **答案**: 需要配置一个`try_files`规则，当请求的文件或目录不存在时，回退到`index.html`。
    ```nginx
    location / {
      try_files $uri $uri/ /index.html;
    }
    ```
    这样，无论是访问`/`还是`/about`，如果服务器上不存在对应的文件或目录，Nginx都会将请求转发给`index.html`，让前端路由接管。

#### **业务逻辑题 (10题)**

1.  **场景**: 用户在一个复杂的表单页面填写了很多数据，但还没保存。此时他不小心点击了导航栏的“首页”链接。如何防止用户数据丢失？
    **答案**: 使用`vue-router`的导航守卫`beforeRouteLeave`。在该守卫中，可以弹出一个确认框询问用户是否确定离开。如果用户取消，则通过`next(false)`来中断导航。
    ```javascript
    // 在表单组件内
    import { onBeforeRouteLeave } from 'vue-router'
  
    onBeforeRouteLeave((to, from, next) => {
      if (isFormDirty.value) { // isFormDirty是一个ref，表示表单是否被修改
        if (confirm('您有未保存的更改，确定要离开吗？')) {
          next();
        } else {
          next(false);
        }
      } else {
        next();
      }
    })
    ```

2.  **场景**: 我们的应用有部分页面（如用户中心）需要登录后才能访问。如何实现这个权限控制？
    **答案**: 使用`vue-router`的全局前置守卫`beforeEach`。在守卫中检查目标路由是否需要认证（可以在路由元信息`meta`中定义），以及用户是否已登录（例如通过检查token）。如果未登录，则重定向到登录页。
    ```javascript
    // router/index.js
    router.beforeEach((to, from, next) => {
      const requiresAuth = to.meta.requiresAuth;
      const isLoggedIn = !!localStorage.getItem('token'); // 示例检查逻辑
    
      if (requiresAuth && !isLoggedIn) {
        next({ path: '/login' });
      } else {
        next();
      }
    });
    ```

3.  **场景**: 一个电商网站的商品详情页URL是 `/product/123`，我们希望在进入这个页面时，就根据ID `123`去请求商品数据。数据加载完成前，页面显示一个加载中(loading)的状态。如何实现？
    **答案**: 可以在组件的 `onMounted` 生命周期钩子中获取路由参数并发送请求。同时使用一个状态变量控制加载状态。
    ```vue
    // ProductDetail.vue
    <template>
      <div v-if="loading">正在加载...</div>
      <div v-else-if="product">
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
      </div>
      <div v-else>商品不存在</div>
    </template>

    <script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { fetchProductById } from '@/api';

    const route = useRoute();
    const product = ref(null);
    const loading = ref(true);

    onMounted(async () => {
      try {
        const productId = route.params.id;
        product.value = await fetchProductById(productId);
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    });
    </script>
    ```

4.  **场景**: 我们的SPA需要根据不同的路由动态设置页面标题（`document.title`）。在哪里处理最合适？
    **答案**: 最合适的地方是全局后置守卫`afterEach`。因为它在每次导航成功完成后触发，此时目标路由`to`对象是确定的。
    ```javascript
    // router/index.js
    router.afterEach((to, from) => {
      document.title = to.meta.title || '默认标题';
    });
  
    // 在路由定义中添加meta信息
    {
      path: '/about',
      component: About,
      meta: { title: '关于我们' }
    }
    ```

5.  **场景**: 用户从一个列表页进入详情页，操作后返回列表页，我们希望列表页能保持之前的滚动位置。如何实现？
    **答案**: `vue-router`的`createRouter`配置中可以提供一个`scrollBehavior`函数来控制滚动行为。
    ```javascript
    // router/index.js
    const router = createRouter({
      history: createWebHistory(),
      routes,
      scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition; // 如果有保存的位置，则恢复
        } else {
          return { top: 0 }; // 否则滚动到顶部
        }
      },
    });
    ```

6.  **场景**: 某个页面的数据非常大，首次加载很慢。我们希望实现懒加载，只有当用户访问这个路由时才去加载对应的组件代码。如何配置？
    **答案**: 在定义路由时，使用动态导入`import()`语法来引入组件。打包工具（如Webpack/Vite）会自动将其进行代码分割。
    ```javascript
    // router/index.js
    const routes = [
      {
        path: '/heavy',
        name: 'HeavyComponent',
        // 使用动态导入实现懒加载
        component: () => import('../components/HeavyComponent.vue')
      }
    ];
    ```

7.  **场景**: 一个管理后台，左侧是菜单栏，右侧是内容区。点击菜单项时，只更新右侧内容区。这种布局如何用`vue-router`实现？
    **答案**: 使用嵌套路由。根组件`Layout.vue`包含菜单栏和`<router-view>`。菜单对应的路由被定义为`Layout`组件的子路由。
    ```javascript
    // Layout.vue
    <template>
      <div class="layout">
        <SidebarMenu />
        <main>
          <router-view />
        </main>
      </div>
    </template>
  
    // router/index.js
    const routes = [
      {
        path: '/admin',
        component: Layout, // 父路由组件
        children: [ // 子路由
          { path: 'dashboard', component: Dashboard },
          { path: 'users', component: UserManagement }
        ]
      }
    ]
    ```

8.  **场景**: 在一个SPA中，我们有两个独立的视图区域，希望一个路由能同时控制这两个区域显示不同的组件。例如，`/`路由下，主区域显示`Home`组件，侧边栏显示`WelcomeSidebar`组件。
    **答案**: 使用命名视图（named views）。在`<router-view>`上添加`name`属性，并在路由配置中为每个命名视图指定组件。
    ```vue
    // App.vue
    <template>
      <router-view name="main"></router-view>
      <router-view name="sidebar"></router-view>
    </template>

    // router/index.js
    const routes = [
      {
        path: '/',
        components: { // 注意这里是 components (复数)
          main: Home,
          sidebar: WelcomeSidebar
        }
      }
    ];
    ```

9.  **场景**: 用户在地址栏手动输入了一个不存在的路由，例如 `/some-random-page`。我们应该如何优雅地处理，而不是显示一个空白页？
    **答案**: 定义一个“通配符”路由或“404”路由。这个路由应该放在所有路由配置的末尾，它会匹配所有之前没有匹配到的路径。
    ```javascript
    // router/index.js
    const routes = [
      // ...其他路由
      { 
        path: '/:pathMatch(.*)*', // 匹配所有路径
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
      }
    ];
    ```

10. **场景**: 我们希望在页面切换时添加一个过渡动画，比如淡入淡出效果。如何实现？
    **答案**: 使用Vue的`<transition>`组件包裹`<router-view>`。`vue-router`会动态地改变`<router-view>`内部的组件，这正好可以触发`<transition>`的动画。
    ```vue
    // App.vue
    <template>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
  
    <style>
    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
      opacity: 0;
    }
    </style>
    ```

---

### **快速使用指南**

**目标**: 将SPA路由功能快速集成到新项目中。

**假设**: 你有一个新的Vue 3项目，并希望添加页面导航功能。

**步骤**:

1.  **安装 `vue-router`**:
    ```bash
    npm install vue-router@4
    ```

2.  **创建路由配置文件**: 在 `src` 目录下新建 `router/index.js` 文件，并粘贴以下模板：
    ```javascript
    import { createRouter, createWebHistory } from 'vue-router';
    // 1. 在这里导入你的页面组件
    import Home from '../views/Home.vue'; 
    import About from '../views/About.vue';

    const routes = [
        // 2. 在这里配置你的路由规则
        { path: '/', component: Home },
        { path: '/about', component: About },
    ];

    const router = createRouter({
        history: createWebHistory(), // 使用History模式，如果需要Hash模式，用 createWebHashHistory()
        routes,
    });

    export default router;
    ```

3.  **在 `main.js` 中注册路由**:
    ```javascript
    import { createApp } from 'vue';
    import App from './App.vue';
    import router from './router'; // 引入你的路由实例

    createApp(App)
      .use(router) // 使用 .use() 来安装路由
      .mount('#app');
    ```

4.  **在 `App.vue` 中设置导航和内容出口**:
    ```vue
    <template>
      <nav>
        <!-- 使用 <router-link> 创建导航 -->
        <router-link to="/">Go to Home</router-link> |
        <router-link to="/about">Go to About</router-link>
      </nav>
      <main>
        <!-- 使用 <router-view> 显示当前路由的组件 -->
        <router-view></router-view>
      </main>
    </template>
    ```

5.  **创建页面组件**: 在 `src/views` 目录下创建 `Home.vue` 和 `About.vue` 组件。

**完成!** 现在你的Vue应用已经具备了基础的SPA导航功能。

[标签: SPA, 前端路由, hash, history]