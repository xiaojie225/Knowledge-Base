
### SSR (服务端渲染) 开发实践文档

#### 简述

本文档旨在对服务端渲染（SSR）技术进行全面总结。它始于对传统服务端渲染（如PHP、JSP）、客户端渲染（SPA）和服务端渲染（SSR for SPA）演进的阐述，明确了现代SSR技术的核心目标：**解决SPA应用普遍存在的首屏加载慢和SEO不佳两大痛点**。通过在服务器端预先执行前端框架代码，生成包含内容的完整HTML字符串，并将其直接返回给浏览器，从而实现极快的首屏内容呈现（First Contentful Paint, FCP），并为搜索引擎爬虫提供丰富的页面内容。

---

#### 一、 完整代码示例

原始文档提供了Vue 2的实现思路和代码片段。在此基础上，我们将其整理成一个完整的Vue 2项目结构，并提供一个更现代、更简洁的Vue 3 + Vite实现方案，以覆盖所有知识点。

##### 1. Vue 2 + Webpack (基于原文代码的完整版)

原文中的代码片段已经很清晰地展示了基于Vue CLI和Webpack的SSR配置，核心在于创建两个入口文件 (`entry-client.js`, `entry-server.js`) 和相应的Webpack配置，通过 `vue-server-renderer` 来实现。这里不再赘述重复的配置，而是直接展示关键文件的完整代码。

**`src/main.js` (通用入口工厂)**
```javascript
import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';

// 导出一个工厂函数，用于为每个请求创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const router = createRouter();
  const store = createStore();

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, router, store };
}
```

**`src/entry-server.js` (服务端入口)**
```javascript
import { createApp } from './main';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    // 设置服务器端 router 的位置
    router.push(context.url);

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();

      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }
    
      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          });
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // state 将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state;
        resolve(app);
      }).catch(reject);
    }, reject);
  });
};
```

**`src/entry-client.js` (客户端入口)**
```javascript
import { createApp } from './main';

const { app, router, store } = createApp();

// 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态
// 自动嵌入到最终的 HTML 中。在客户端挂载到应用程序之前，store 就应该获取到状态：
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  // 客户端特定逻辑...
  // 挂载 app, 这会激活整个应用
  app.$mount('#app');
});
```

##### 2. Vue 3 + Vite (推荐的现代写法)

Vite内置了对SSR的强大支持，极大地简化了配置过程。

**项目结构:**
```
.
├── index.html
├── package.json
├── server.js               # Node.js 生产服务器
├── src
│   ├── main.js             # 通用入口，导出 createApp
│   ├── entry-client.js     # 客户端入口
│   ├── entry-server.js     # 服务端入口
│   ├── App.vue
│   ├── pages
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── router
│   │   └── index.js
│   └── store
│       └── index.js        # Pinia store
└── vite.config.js
```

**`vite.config.js`**
```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});
```

**`src/main.js`**
```javascript
import { createSSRApp } from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createPinia } from 'pinia';

// SSR要求每个请求都创建一个新的app实例，避免状态污染
export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const router = createRouter();
  app.use(pinia);
  app.use(router);
  return { app, router, pinia };
}
```

**`src/entry-client.js`**
```javascript
import { createApp } from './main';

const { app, router, pinia } = createApp();

// 从 window 对象中恢复 Pinia 的 state
if (window.__INITIAL_STATE__) {
  pinia.state.value = JSON.parse(window.__INITIAL_STATE__);
}

router.isReady().then(() => {
  app.mount('#app'); // 激活应用
});
```

**`src/pages/Home.vue` (使用Composition API 和 `onServerPrefetch`)**
```vue
<template>
  <div>
    <h1>Home Page</h1>
    <p>Message from server: {{ store.message }}</p>
    <button @click="store.fetchMessage">Fetch New Message</button>
  </div>
</template>

<script setup>
import { onServerPrefetch } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();

// onServerPrefetch 是一个特殊的生命周期钩子，只会在服务端运行
onServerPrefetch(async () => {
  // 在服务端预取数据，填充store
  await store.fetchMessage();
});
</script>
```

**`src/store/index.js` (使用Pinia)**
```javascript
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    message: 'Initial message',
  }),
  actions: {
    async fetchMessage() {
      // 模拟API调用
      const res = await new Promise(resolve => 
        setTimeout(() => resolve({ data: `Hello from SSR! Timestamp: ${Date.now()}` }), 500)
      );
      this.message = res.data;
    },
  },
});
```

**`server.js` (Express服务器)**
```javascript
const fs = require('fs');
const path = require('path');
const express = require('express');
const { createServer: createViteServer } = require('vite');

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
    
      const { render } = await vite.ssrLoadModule('/src/entry-server.js');
      const { appHtml, piniaState } = await render(url);
    
      // 替换占位符
      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`'<!--pinia-state-->'`, piniaState);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173, () => console.log('Server is running at http://localhost:5173'));
}

createServer();
```

**`index.html`**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Vue 3 SSR with Vite</title>
  </head>
  <body>
    <div id="app"><!--ssr-outlet--></div>
    <script>
      // 将服务端状态注入到 window
      window.__INITIAL_STATE__ = '<!--pinia-state-->';
    </script>
    <script type="module" src="/src/entry-client.js"></script>
  </body>
</html>
```

---

#### 二、学习知识

1.  **同构 (Isomorphic) / 通用 (Universal) 代码**：一套代码（主要是Vue组件、路由、状态管理）既能在Node.js服务端运行，也能在浏览器客户端运行。这是实现SSR的基础。

2.  **入口分离 (Entry Points)**：项目必须有两个入口文件：
    *   `entry-server.js`: 服务端入口，负责创建Vue实例，根据请求URL匹配路由，预取数据，并最终将Vue实例渲染成HTML字符串。
    *   `entry-client.js`: 客户端入口，负责在浏览器端“激活”(Hydrate)由服务端发送过来的静态HTML，使其变为可交互的单页应用。

3.  **应用实例工厂函数 (Factory Function)**：为避免在多次服务器请求之间交叉污染状态（例如，A用户的状态泄露给B用户），必须使用工厂函数 (`createApp`, `createRouter`, `createStore`/`createPinia`) 来为每个请求创建全新的应用实例、路由实例和状态管理实例。

4.  **数据预取 (Data Pre-fetching)**：
    *   **Vue 2**: 通常约定一个自定义选项 `asyncData`，在`entry-server.js`中遍历匹配到的组件，并调用其 `asyncData` 方法来填充Vuex Store。
    *   **Vue 3**: 推荐使用 `onServerPrefetch` 钩子。它仅在服务端执行，可以直接在组件的 `setup` 函数中调用，代码组织更内聚。

5.  **状态同步 (State Hydration)**：服务端预取的数据必须同步到客户端。标准做法是：
    1.  服务端将最终的Store状态序列化成JSON字符串。
    2.  将其注入到HTML的一个 `script` 标签中（如 `window.__INITIAL_STATE__ = ...`）。
    3.  客户端在创建Store时，使用这个全局变量来初始化/替换其初始状态。

6.  **客户端激活 (Client-Side Hydration)**：Vue在客户端`mount`时，会检查`#app`容器内是否已有服务端渲染的DOM。如果有，它不会销毁并重新创建，而是会接管这些静态DOM，并为其附加事件监听器和响应式数据，这个过程称为“激活”。

---

#### 三、用途（用在那个地方）

SSR 主要应用于以下场景：

1.  **SEO要求高的网站**：如企业官网、博客、新闻门户、电商商品详情页。搜索引擎爬虫可以直接抓取到包含丰富内容的HTML，极大地提升了网站的搜索引擎排名。

2.  **追求极致首屏性能的应用**：如大型电商平台的首页、活动页。用户可以立即看到页面内容，无需等待JS包下载和执行，显著改善了用户体验，降低了跳出率。

3.  **内容驱动的公开网站**：任何需要被公开访问和索引的内容型网站，都适合使用SSR。

**不适合的场景**：
*   **管理后台/内部系统**：这类应用不关心SEO，且用户对少量首屏延迟容忍度较高，使用纯粹的SPA开发更简单高效。
*   **重度交互、Web App形态的应用**：如在线文档编辑器、图形工具等，这类应用的核心价值在于交互而非内容展示，SSR带来的优势有限，但增加了复杂性。

---
[标签: 前端, SSR, Vue, Node.js, 同构渲染]
---

#### 四、面试官考察

如果你是面试官，你会怎么考察这个文件里的内容？

##### 10个技术题目

1.  **问题**：请解释一下什么是“同构(Isomorphic)”应用，以及为什么在SSR中需要使用“工厂函数”来创建App、Router和Store实例？
    **答案**：
    *   **同构**：指的是同一套代码可以不经修改地同时运行在服务端和客户端环境中。在Vue SSR中，我们的Vue组件、路由配置和状态管理逻辑就是同构的。
    *   **工厂函数**：在服务端环境中，服务器是单进程的，会处理来自多个用户的并发请求。如果不使用工厂函数，那么所有请求都会共享同一个App、Router和Store实例。这会导致状态污染，比如A用户登录后的信息可能会被B用户看到。工厂函数确保每个请求都拥有独立的、隔离的实例，从而避免了交叉请求状态污染。

2.  **问题**：什么是客户端“激活”(Hydration)？如果服务端的HTML结构与客户端预期生成的DOM结构不匹配，会发生什么？
    **答案**：
    *   **激活**：是客户端Vue接管由服务端渲染的静态HTML的过程。Vue会遍历服务端生成的DOM树，将其与客户端虚拟DOM树进行对比，并为已存在的DOM元素添加事件监听器和数据绑定，使其成为一个完全可交互的动态应用。这个过程是“激活”而不是“重新渲染”，因此性能更高。
    *   **不匹配**：如果服务端和客户端的DOM结构不匹配（Hydration Mismatch），Vue在开发模式下会在控制台给出警告。在生产模式下，Vue会放弃激活，销毁服务端渲染的DOM，然后完全在客户端重新渲染一遍。这会导致性能下降，失去了SSR的部分优势，并可能引起页面内容的闪烁。

3.  **问题**：在Vue 3中，`onServerPrefetch` 钩子相比于Vue 2的 `asyncData` 方案有什么优势？
    **答案**：
    `onServerPrefetch` 的主要优势在于**代码内聚性**和**更好的TypeScript支持**。
    *   **代码内聚**：`onServerPrefetch`可以直接写在组件的`setup`函数内部，与组件的其它逻辑（如`data`, `methods`）放在一起。而`asyncData`是一个组件选项，与组件的实例`this`是解耦的，逻辑上较为分离。
    *   **类型支持**：在`setup`函数中，可以充分利用TypeScript的类型推断，`onServerPrefetch`内部访问的响应式状态和方法都有很好的类型提示。`asyncData`是一个静态方法，无法直接访问`this`，其参数也需要手动定义类型。

4.  **问题**：如何处理在SSR项目中仅限客户端使用的代码或库（例如，一个依赖`window`对象的图表库）？
    **答案**：
    有几种常用方法：
    1.  **生命周期钩子**：将依赖客户端API的代码放在`onMounted` (Vue 3) 或 `mounted` (Vue 2) 钩子中执行，因为这些钩子只在客户端运行。
    2.  **环境判断**：使用 `typeof window !== 'undefined'` 或 `import.meta.env.SSR` (Vite) 来包裹客户端代码。
    3.  **动态导入**：使用 `import()` 在`onMounted`中动态导入客户端库，这样该库的代码就不会被打包到服务端bundle中。
    4.  **`<ClientOnly>` 组件**：封装一个`<ClientOnly>`组件，它在服务端渲染一个占位符，而在客户端渲染其插槽内的实际内容。
    ```vue
    <!-- ClientOnly.vue -->
    <template>
      <div v-if="isMounted">
        <slot />
      </div>
    </template>
    <script setup>
    import { ref, onMounted } from 'vue';
    const isMounted = ref(false);
    onMounted(() => {
      isMounted.value = true;
    });
    </script>
    ```

5.  **问题**：假如你的SSR应用首屏需要调用3个API才能渲染，如何优化数据预取过程以提高服务端响应速度？
    **答案**：
    关键在于**并行化**API请求。不要串行地`await`每个请求，而应该使用`Promise.all`。
    ```javascript
    // 在 onServerPrefetch 或 asyncData 中
    async function fetchData({ store }) {
      // 错误示范：串行请求，总耗时 = t1 + t2 + t3
      // await store.dispatch('fetchApi1');
      // await store.dispatch('fetchApi2');
      // await store.dispatch('fetchApi3');

      // 正确示范：并行请求，总耗时 = max(t1, t2, t3)
      await Promise.all([
        store.dispatch('fetchApi1'),
        store.dispatch('fetchApi2'),
        store.dispatch('fetchApi3')
      ]);
    }
    ```
    此外，还可以考虑在服务端增加缓存层（如Redis），对于不经常变化的数据，直接从缓存读取，避免重复的API调用。

6.  **问题**：请说明 `vue-ssr-server-bundle.json` 和 `vue-ssr-client-manifest.json` 这两个文件在Vue 2的SSR流程中分别起什么作用？
    **答案**：
    *   **`vue-ssr-server-bundle.json`**：这是服务端打包的产物。它不是可执行的JS代码，而是一个特殊的JSON文件，包含了服务端渲染应用所需的所有信息。`vue-server-renderer`的`createBundleRenderer`函数会读取这个文件来创建一个`renderer`实例，这个实例知道如何渲染应用的特定路由。
    *   **`vue-ssr-client-manifest.json`**：这是客户端打包的产物。它包含了客户端应用构建的详细信息，比如所有模块的依赖关系、异步chunk的文件名等。服务端`renderer`会利用这个清单：
        1.  **自动推断并注入资源**：自动在渲染出的HTML中插入`<script>`和`<link>`标签，包括入口文件、vendor chunks和异步路由组件的JS/CSS文件。
        2.  **预加载和预读取**：可以智能地为页面所需资源生成`<link rel="preload">`和`<link rel="prefetch">`，优化加载性能。

7.  **问题**：在SSR中，Cookie和认证状态（如Token）是如何在服务端和客户端之间传递和同步的？
    **答案**：
    1.  **客户端到服务端**：浏览器在发起请求时会自动将当前域下的Cookie附加在HTTP请求头中。Node.js服务器（如Express）可以通过`req.headers.cookie`接收到这些Cookie。
    2.  **服务端处理**：在`entry-server.js`接收的`context`对象中，可以传入从`req`中解析出的Cookie。服务端在进行API请求时，需要将这些Cookie（特别是认证Token）手动附加到API请求的header中，以便API服务器能识别用户身份。
    ```javascript
    // server.js
    const context = { url: req.url, cookies: req.cookies };
    const html = await renderer.renderToString(context);

    // entry-server.js
    export default context => {
      // 在这里可以通过 context.cookies 获取cookie
      // 然后在 asyncData 中发起API请求时带上
    }
    ```
    3.  **服务端到客户端**：如果服务端在处理过程中需要设置或更新Cookie（例如登录成功后），可以通过`res.cookie()`之类的方法设置HTTP响应头，浏览器收到后会自动更新Cookie。这样，后续的客户端API请求就会自动带上最新的认证信息。

8.  **问题**：SSR会增加服务器负载，请谈谈几种常见的SSR性能优化或服务降级策略。
    **答案**：
    1.  **缓存**：这是最重要的策略。
        *   **页面级缓存**：对于不常变化的页面（如首页、文章详情页），可以将渲染好的HTML整个缓存起来（如使用Redis或Varnish），后续请求直接返回缓存内容。
        *   **组件级缓存**：`vue-server-renderer`支持组件级别的缓存。对于纯展示且数据不变的组件，可以开启缓存，避免重复渲染。
        *   **API数据缓存**：在服务端缓存API请求的结果。
    2.  **服务降级**：设置一个监控阈值，当服务器CPU或内存负载过高时，暂时禁用SSR，直接返回一个SPA的空HTML壳，将渲染任务交还给客户端。这是一种优雅的服务降级方案，保证了服务的可用性。
    3.  **流式渲染 (Streaming)**：对于复杂的页面，不一次性渲染完整个HTML再发送，而是边渲染边发送（`renderToStream`），可以让用户更快看到页面头部内容。

9.  **问题**：为什么在Vite SSR配置中，我们需要用`vite.ssrLoadModule`来加载`entry-server.js`，而不是直接`require('/src/entry-server.js')`？
    **答案**：
    这主要和Vite的开发模式工作原理有关。
    *   **模块转换**：在开发模式下，Vite是按需编译模块的，它不会像Webpack那样预先打包。浏览器或Node.js直接请求的是原始的`.js`、`.vue`文件。`vite.ssrLoadModule`是Vite提供的API，它能正确处理ESM模块的解析、应用Vite插件（如编译Vue文件）、以及热更新（HMR）。
    *   **HMR**：如果使用`require`，Node会缓存模块。当你修改了`entry-server.js`或其依赖，`require`会返回缓存的旧版本。而`vite.ssrLoadModule`集成了Vite的热更新机制，每次请求都会加载最新的模块代码，实现了服务端代码的HMR。

10. **问题**：在Vue 3的SSR实现中，Pinia的状态是如何注入和恢复的？请描述一下`pinia.state.value`在这个过程中的作用。
    **答案**：
    1.  **服务端注入**：在 `entry-server.js` 中，当数据预取完成后，Pinia store中已经包含了所有需要的数据。`pinia.state.value` 是一个ref对象，它包含了所有store的当前状态。我们将这个对象序列化为JSON字符串。
    ```javascript
    // entry-server.js
    const piniaState = JSON.stringify(pinia.state.value);
    // 然后将 piniaState 注入到 HTML 的 script 标签
    ```
    2.  **客户端恢复**：在 `entry-client.js` 中，客户端在挂载Vue应用之前，从 `window.__INITIAL_STATE__` 中读取这个JSON字符串，并将其解析回对象。然后，直接将这个对象赋值给客户端新创建的Pinia实例的 `pinia.state.value`。
    ```javascript
    // entry-client.js
    if (window.__INITIAL_STATE__) {
      pinia.state.value = JSON.parse(window.__INITIAL_STATE__);
    }
    ```
    `pinia.state.value` 充当了整个Pinia状态树的快照。通过在服务端捕获这个快照并把它恢复到客户端，我们就完成了状态的同步，保证了客户端激活时的数据一致性。

##### 10道业务逻辑题目

1.  **场景**：一个电商网站的商品详情页(PDP)采用SSR。这个页面非常复杂，包含商品信息、用户评论、推荐商品三个独立部分，分别由三个不同的微服务API提供数据。如何设计这个页面的SSR数据获取策略？
    **答案**：
    *   **首要策略：并行获取数据**。使用`Promise.all`并行调用获取商品信息、用户评论、推荐商品的API，以缩短服务端等待时间。
    *   **关键内容优先**：商品核心信息（名称、价格、图片）是用户最关心的，必须在SSR时获取。
    *   **非关键内容延迟加载**：用户评论和推荐商品可以考虑做客户端渲染。即SSR时只渲染商品核心信息，并渲染评论和推荐区域的骨架屏（Skeleton）。然后在客户端`onMounted`钩子中再去请求这两个API的数据并填充。这会极大加快服务器响应速度，提升TTFB（Time to First Byte）。
    ```vue
    <template>
      <ProductInfo :product="product_data" />
      <ClientOnly>
        <ProductComments />
        <RecommendedProducts />
        <template #fallback>
          <CommentSkeleton />
          <RecommendSkeleton />
        </template>
      </ClientOnly>
    </template>
    <script setup>
    // 在 onServerPrefetch 中只获取商品核心信息
    const product_data = await fetchProductInfo();
    </script>
    ```

2.  **场景**：一个新闻网站，文章页面是SSR的。运营人员希望能够实时预览草稿文章的SSR效果，而草稿文章是不能被公开访问的。该如何实现这个预览功能？
    **答案**：
    *   **通过URL参数或Token进行认证**。预览链接可以带一个特殊的查询参数，如`?preview_token=xxx`。
    *   **服务端逻辑判断**：在Node服务器层，检查请求中是否存在有效的`preview_token`。如果存在，就调用获取草稿文章内容的API；如果不存在或无效，则走正常的已发布文章API逻辑。
    *   **API层配合**：文章数据API需要支持通过草稿ID和Token来获取未发布的内容。
    *   **禁止搜索引擎索引**：对于预览页面，需要在HTML的`<head>`中添加`<meta name="robots" content="noindex, nofollow">`，防止搜索引擎意外索引到草稿内容。

3.  **场景**：开发一个多语言的SSR博客网站。用户可以通过 `/:lang/post/:slug` 访问不同语言的文章。如何优雅地在SSR中处理语言状态？
    **答案**：
    *   **从URL中解析语言**：在Node服务器中，从请求URL (`req.url`)中解析出语言代码（`:lang`）。
    *   **通过Context传递**：将解析出的语言代码放入传递给Vue应用的`context`对象中，如`context.lang = 'en'`。
    *   **初始化状态**：在`entry-server.js`中，使用`context.lang`来初始化i18n库（如`vue-i18n`）的状态或一个全局的Pinia store。
    *   **数据预取**：在`onServerPrefetch`中获取数据时，将语言代码作为参数传递给API，`fetchPost(slug, context.lang)`，以获取对应语言的文章内容。
    *   **状态同步**：i18n的状态和其他业务状态一样，需要序列化并注入到HTML中，客户端进行恢复。

4.  **场景**：一个SSR应用的首页，需要展示一个根据用户地理位置推荐的“附近门店”列表。如何实现这个个性化内容的服务端渲染？
    **答案**：
    这是一个典型的需要个性化内容的SSR场景，不能使用静态缓存。
    1.  **获取用户IP**：在Node服务器中，从请求`req`对象中获取用户IP地址。
    2.  **IP转地理位置**：调用第三方IP地理位置查询服务（如MaxMind GeoIP），将IP解析成城市信息。
    3.  **个性化数据预取**：在`onServerPrefetch`中，将城市信息作为参数调用“附近门店”API。
    4.  **处理Cookie**：如果用户手动选择了城市，应将该城市信息保存在Cookie中。服务器应优先读取Cookie中的城市信息，如果Cookie不存在，再 fallback 到IP定位。这样既尊重了用户选择，也避免了每次都调用IP定位服务。

5.  **场景**：你的SSR应用部署后，发现某个特定页面在服务端渲染时偶尔会抛出异常，导致整个页面500错误。你如何提高系统的容错性，避免单个页面的错误影响整个服务？
    **答案**：
    1.  **在服务端渲染函数中添加`try...catch`**：在`server.js`调用`renderer.renderToString(context)`时，用`try...catch`包裹。
    2.  **实现降级逻辑**：在`catch`块中，捕获到渲染错误后，**不要直接返回500**。而是返回一个降级版的、不包含动态内容的SPA空HTML壳。
    ```javascript
    // server.js
    app.get('*', async (req, res) => {
      try {
        const context = { url: req.url };
        const html = await renderer.renderToString(context);
        res.send(html);
      } catch (error) {
        console.error(`SSR Error on ${req.url}:`, error);
        // 降级到客户端渲染
        res.sendFile(path.resolve(__dirname, 'dist/client/index.html'));
      }
    });
    ```
    3.  **错误监控与告警**：在`catch`块中，将详细的错误信息（包括请求URL、错误堆栈）上报到监控系统（如Sentry），并设置告警，以便开发者能及时发现并修复问题。

6.  **场景**：一个用户生成内容（UGC）的社区，帖子详情页是SSR的。帖子内容支持Markdown，并可以嵌入用户自定义的HTML。这在SSR时有什么安全风险？如何防范？
    **答案**：
    *   **主要风险是XSS（跨站脚本攻击）**。如果用户在帖子内容中嵌入了恶意的`<script>`标签，服务端直接将其渲染到HTML中，其他用户访问时就会执行恶意脚本，可能导致Cookie被盗等问题。
    *   **防范措施**：
        1.  **HTML转义**：对所有用户输入的内容，在渲染前进行严格的HTML转义，将`<`、`>`等特殊字符转换为实体，如`&lt;`、`&gt;`。Vue默认就会对 Mustache 插值 `{{ }}` 中的内容进行转义。
        2.  **使用白名单过滤**：如果需要支持部分安全的HTML标签（如`<b>`, `<img>`），不能用`v-html`直接渲染。必须使用一个可靠的HTML过滤器库（如`DOMPurify`），配置一个安全的标签和属性白名单，对用户输入进行过滤后，再使用`v-html`渲染。这个过滤操作必须在服务端完成。

7.  **场景**：一个SSR博客，为了SEO，希望在每个文章页面的HTML `<head>`中动态设置不同的`title`、`meta description`和`keywords`。如何实现？
    **答案**：
    *   **利用Context传递元信息**：在组件数据预取完成后，将页面的`title`和`meta`信息存入`context`对象。
    ```javascript
    // Article.vue onServerPrefetch
    onServerPrefetch(async () => {
      const article = await fetchArticle();
      // 假设context被传入了预取钩子
      context.meta = {
        title: article.title,
        description: article.summary,
      };
    });
    ```
    *   **在HTML模板中使用插值**：`vue-server-renderer`或Vite SSR都支持在HTML模板中使用插值。
    ```html
    <!-- index.html -->
    <html lang="en">
      <head>
        <title>{{ title }}</title>
        <meta name="description" content="{{ description }}">
      </head>
      ...
    </html>
    ```
    *   **服务端注入`context`**：在`server.js`中，当`renderToString`完成后，`context`对象上会附加有组件设置的`meta`信息。将这些信息传递给模板引擎或手动替换HTML模板中的占位符。许多SSR框架（如Nuxt）提供了现成的`head`管理功能，原理类似。

8.  **场景**：应用首页有一个轮播图组件，它在`mounted`钩子中初始化一个第三方JS库。在SSR环境中，这个组件会出什么问题？如何修复？
    **答案**：
    *   **问题**：服务端没有`mounted`钩子，更没有`window`或`document`对象，第三方库的初始化代码会直接报错，导致服务端渲染失败。
    *   **修复**：使用`<ClientOnly>`组件包裹轮播图。
    ```vue
    <template>
      <div>
        <h1>Welcome</h1>
        <ClientOnly>
          <CarouselComponent />
          <!-- 可以提供一个SSR时的占位符或骨架屏 -->
          <template #fallback>
            <div class="carousel-placeholder"></div>
          </template>
        </ClientOnly>
      </div>
    </template>
    ```
    `ClientOnly`组件的原理是，它在服务端只渲染`fallback`插槽的内容（或什么都不渲染），在客户端挂载后，才渲染其默认插槽的内容（即`CarouselComponent`）。这样，轮播图组件及其初始化逻辑就只会在客户端环境中执行。

9.  **场景**：你的SSR应用需要路由懒加载来减小首屏JS体积。这对SSR流程有什么影响？ build产物会是什么样的？
    **答案**：
    *   **影响**：
        1.  **服务端**：当请求一个懒加载的路由时，服务端必须能够解析并加载这个异步组件的chunk，然后才能渲染它。Webpack的`server-bundle`或Vite的`ssrLoadModule`都内置了处理这个问题的能力。
        2.  **客户端清单**：`client-manifest.json`的作用变得至关重要。它记录了哪个路由对应哪个JS chunk文件。
        3.  **HTML注入**：服务端`renderer`会读取`client-manifest.json`，分析当前渲染的页面用到了哪些异步组件，并智能地在生成的HTML中插入`<link rel="preload">`标签来预加载这些异步chunk的JS文件。
    *   **Build产物**：`dist/client`目录中，除了入口JS文件，还会出现多个被分割出来的chunk文件（如`1.js`, `2.js`），对应不同的懒加载路由。`client-manifest.json`会包含这些chunk文件的信息。

10. **场景**：你接手了一个老的Vue 2 + SSR项目，发现它的`store`（Vuex）设计非常臃肿，所有页面的数据都放在一个全局`state`里，导致每次SSR都需要序列化一个巨大的`__INITIAL_STATE__`对象，拖慢了HTML传输。你会如何进行重构优化？
    **答案**：
    *   **核心思路：模块化动态注册**。将Vuex store按照业务或页面拆分成多个模块(module)。
    *   **按需加载Store模块**：在路由组件的`asyncData`或`onServerPrefetch`中，除了获取数据，还动态注册当前页面所需的Vuex模块。
        ```javascript
        // ProductDetailPage.vue
        export default {
          async asyncData({ store }) {
            // 动态注册 'product' 模块
            if (!store.state.product) {
              store.registerModule('product', productStoreModule);
            }
            return store.dispatch('product/fetchProduct');
          }
        }
        ```
    *   **服务端渲染的影响**：服务端在`render`时，只有被访问页面的相关模块被注册了，因此`store.state`会小得多。
    *   **客户端激活**：客户端也需要同样的逻辑。可以在路由导航守卫 `beforeResolve` 中检查目标组件，并动态注册其所需的Vuex模块，然后再进行数据同步和挂载。
    *   **最终效果**：`window.__INITIAL_STATE__`只包含当前页面必需的模块状态，大大减小了HTML体积，提升了传输效率。这个重构也使得Store的管理更加清晰和可维护。

---

#### 五、快速上手指南（给未来的你）

嘿，未来的我！想把这个酷炫的SSR功能用到新项目里吗？别慌，跟着这几步走，超简单。

**目标**：用现代化的 **Vue 3 + Vite** 快速搭建一个SSR项目。

**1. 初始化项目**
```bash
npm create vite@latest my-ssr-app --template vue
cd my-ssr-app
npm install express pinia vue-router
```

**2. 调整项目结构**
*   在`src`下创建 `entry-client.js` 和 `entry-server.js`。
*   改造 `src/main.js`，让它导出一个 `createApp` 工厂函数。
*   在项目根目录创建 `server.js`。

**3. 核心代码粘贴板 (直接复制)**

*   **`src/main.js`**:
    ```javascript
    import { createSSRApp } from 'vue';
    import App from './App.vue';
    import { createRouter } from './router'; // 你需要自己创建 router/index.js
    import { createPinia } from 'pinia';

    export function createApp() {
      const app = createSSRApp(App);
      const pinia = createPinia();
      const router = createRouter();
      app.use(pinia).use(router);
      return { app, router, pinia };
    }
    ```

*   **`src/entry-client.js`**:
    ```javascript
    import { createApp } from './main';
    const { app, router, pinia } = createApp();

    if (window.__INITIAL_STATE__) {
      pinia.state.value = JSON.parse(window.__INITIAL_STATE__);
    }

    router.isReady().then(() => app.mount('#app'));
    ```

*   **`src/entry-server.js`**:
    ```javascript
    import { createApp } from './main';
    import { renderToString } from '@vue/server-renderer';

    export async function render(url) {
      const { app, router, pinia } = createApp();
      await router.push(url);
      await router.isReady();

      const appHtml = await renderToString(app);
      const piniaState = JSON.stringify(pinia.state.value);
    
      return { appHtml, piniaState };
    }
    ```

*   **根目录 `server.js`**: (这是开发服务器，生产环境需要做相应修改)
    ```javascript
    const fs = require('fs');
    const path = require('path');
    const express = require('express');
    const { createServer: createViteServer } = require('vite');

    async function createServer() {
      const app = express();
      const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
      app.use(vite.middlewares);

      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        try {
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
        
          const { render } = await vite.ssrLoadModule('/src/entry-server.js');
          const { appHtml, piniaState } = await render(url);
        
          const html = template.replace(`<!--ssr-outlet-->`, appHtml).replace(`'<!--pinia-state-->'`, piniaState);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      });
      app.listen(5173, () => console.log('SSR Server running at http://localhost:5173'));
    }
    createServer();
    ```

**4. 修改 `index.html`**
```html
<div id="app"><!--ssr-outlet--></div>
<script>
  window.__INITIAL_STATE__ = '<!--pinia-state-->';
</script>
<script type="module" src="/src/entry-client.js"></script>
```

**5. 添加启动脚本到 `package.json`**
```json
"scripts": {
  "dev": "node server.js"
}
```

**6. 搞定！**
现在 `npm run dev` 启动项目，你就有了一个可以工作的SSR应用了。接下来就是在你的组件里用 `onServerPrefetch` 和 Pinia 去获取数据了。祝你编码愉快！