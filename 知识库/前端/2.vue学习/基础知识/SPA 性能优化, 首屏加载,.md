# Vue SPA 首屏性能优化精华学习资料

---

## 日常学习模式

**[标签: SPA性能优化 首屏加载 Vite构建优化 代码分割 资源压缩]**

### 核心优化理念

**优化始于度量 - 先诊断，后优化，再验证**

```javascript
/**
 * 优化工作流程
 * 1. 使用工具诊断瓶颈
 * 2. 按优先级实施优化
 * 3. 度量优化效果
 * 4. 循环迭代
 */

// 度量工具
const performanceTools = {
  lighthouse: 'Chrome DevTools > Lighthouse', // 综合性能报告
  network: 'Chrome DevTools > Network',       // 资源加载分析
  bundleAnalyzer: 'rollup-plugin-visualizer'  // 打包体积分析
};
```

---

### 优化方案金字塔

#### 第一层：基础优化（必做项，ROI最高）

##### 1. 路由懒加载（代码分割）

**核心原理：** 按需加载页面代码，减小主包体积

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

/**
 * 路由懒加载配置
 * 使用动态 import() 实现代码分割
 * 每个路由组件打包成独立 chunk
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    // ✅ 懒加载：访问时才下载
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // 可以为 chunk 命名，方便调试
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

##### 2. 打包体积分析

**安装配置可视化分析器：**

```bash
npm i -D rollup-plugin-visualizer
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * Vite 构建配置
 * visualizer: 生成打包体积分析报告
 */
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,           // 构建后自动打开报告
      gzipSize: true,       // 显示 Gzip 压缩后大小
      brotliSize: true,     // 显示 Brotli 压缩后大小
      filename: 'stats.html' // 报告文件名
    })
  ]
});
```

##### 3. UI 框架按需加载

**以 Element Plus 为例，自动按需引入：**

```bash
npm i -D unplugin-vue-components unplugin-auto-import
```

```javascript
// vite.config.js
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    /**
     * 自动按需导入组件
     * 无需手动 import，直接在模板使用
     */
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    /**
     * 自动导入 Vue API 和组件库 API
     */
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router']
    })
  ]
});
```

```vue
<!-- 使用示例 - 无需手动导入 -->
<template>
  <div>
    <!-- 插件自动处理导入 -->
    <el-button type="primary">按钮</el-button>
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称" />
    </el-table>
  </div>
</template>

<script setup>
// 无需手动导入 ref
// AutoImport 插件自动处理
const tableData = ref([
  { name: '商品1' },
  { name: '商品2' }
]);
</script>
```

##### 4. 资源压缩（Gzip/Brotli）

```bash
npm i -D vite-plugin-compression
```

```javascript
// vite.config.js
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    vue(),
    /**
     * 生成压缩文件
     * 需要服务器配合开启 Gzip 支持
     */
    viteCompression({
      verbose: true,          // 输出压缩结果
      disable: false,         // 不禁用压缩
      threshold: 10240,       // 超过 10KB 才压缩
      algorithm: 'gzip',      // 压缩算法
      ext: '.gz',             // 文件后缀
      deleteOriginFile: false // 保留原文件
    })
  ]
});
```

**Nginx 服务器配置：**

```nginx
# nginx.conf
http {
  # 开启 Gzip
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_min_length 1000;

  # 优先使用预压缩的 .gz 文件
  gzip_static on;
}
```

##### 5. 图片优化

```vue
<template>
  <div>
    <!-- 方案1: 使用现代格式 WebP，提供降级 -->
    <picture>
      <source srcset="@/assets/hero.webp" type="image/webp">
      <img src="@/assets/hero.png" alt="首页大图">
    </picture>
  
    <!-- 方案2: 图片懒加载 -->
    <img 
      v-lazy="imageUrl" 
      alt="商品图片"
      class="product-img"
    >
  </div>
</template>

<script setup>
/**
 * 图片优化策略
 * 1. 压缩：使用 tinypng.com 或构建时压缩
 * 2. 现代格式：WebP 比 PNG/JPG 小 25-35%
 * 3. 懒加载：视窗外图片延迟加载
 * 4. 响应式：根据屏幕尺寸加载不同大小
 */
</script>
```

**构建时图片压缩：**

```bash
npm i -D vite-plugin-imagemin
```

```javascript
// vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: true }
        ]
      }
    })
  ]
});
```

---

#### 第二层：进阶优化

##### 1. CDN 加速

```javascript
// vite.config.js
export default defineConfig({
  /**
   * 生产环境使用 CDN
   * 所有静态资源 URL 会自动添加 CDN 前缀
   */
  base: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com/' 
    : '/',

  build: {
    rollupOptions: {
      /**
       * 外部化大型依赖库
       * 从 CDN 加载，不打入主包
       */
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
});
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <!-- 从 CDN 加载外部化的库 -->
  <script src="https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-router@4.2.4/dist/vue-router.global.prod.js"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

##### 2. 字体优化

```css
/**
 * 字体优化策略
 * font-display: swap - 先用系统字体显示，避免白屏
 * unicode-range: 只加载需要的字符范围
 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* 关键：防止 FOIT */
  font-weight: 400;
  unicode-range: U+4E00-9FA5; /* 只加载常用汉字 */
}

body {
  font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**字体子集化（减小文件体积）：**

```bash
# 安装字体裁剪工具
npm i -D font-spider
```

```html
<!-- 在 HTML 中使用字体 -->
<style>
@font-face {
  font-family: 'MyFont';
  src: url('./fonts/my-font.ttf');
}
.title { font-family: 'MyFont'; }
</style>

<p class="title">这里是需要自定义字体的文字</p>
```

```bash
# 运行裁剪，只保留 HTML 中用到的字符
font-spider index.html
```

##### 3. 预加载关键资源

```html
<!-- index.html -->
<head>
  <!-- Preload: 立即加载当前页必需的资源 -->
  <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
  <link rel="preload" href="/styles/critical.css" as="style">

  <!-- Prefetch: 空闲时加载未来可能用到的资源 -->
  <link rel="prefetch" href="/js/dashboard.chunk.js">

  <!-- DNS Prefetch: 提前解析域名 -->
  <link rel="dns-prefetch" href="https://api.example.com">
</head>
```

---

#### 第三层：感知优化（让用户感觉更快）

##### 1. 骨架屏

```vue
<!-- Skeleton.vue - 骨架屏组件 -->
<template>
  <div class="skeleton">
    <div class="skeleton-header"></div>
    <div class="skeleton-content">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  </div>
</template>

<style scoped>
/**
 * 骨架屏样式
 * 使用动画模拟加载效果
 */
.skeleton-line {
  height: 16px;
  margin: 8px 0;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

```vue
<!-- ArticleDetail.vue - 使用骨架屏 -->
<template>
  <div>
    <!-- 加载中显示骨架屏 -->
    <Skeleton v-if="loading" />
  
    <!-- 数据加载完成显示真实内容 -->
    <article v-else>
      <h1>{{ article.title }}</h1>
      <div v-html="article.content"></div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Skeleton from './Skeleton.vue';

const loading = ref(true);
const article = ref({});

/**
 * 组件挂载后获取数据
 * 显示骨架屏替代加载动画
 */
onMounted(async () => {
  loading.value = true;
  try {
    article.value = await fetchArticle();
  } finally {
    loading.value = false;
  }
});
</script>
```

##### 2. 虚拟列表（处理大数据）

```vue
<!-- VirtualList.vue -->
<template>
  <div 
    class="virtual-list-container" 
    @scroll="handleScroll"
    ref="containerRef"
  >
    <!-- 占位容器，撑起总高度 -->
    <div :style="{ height: totalHeight + 'px' }"></div>
  
    <!-- 可见区域的真实 DOM -->
    <div 
      class="visible-items"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div 
        v-for="item in visibleItems" 
        :key="item.id"
        class="list-item"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  items: Array,      // 全部数据
  itemHeight: Number // 每项高度
});

/**
 * 虚拟列表核心逻辑
 * 只渲染可见区域的 DOM
 */
const containerRef = ref(null);
const scrollTop = ref(0);
const containerHeight = ref(0);

// 总高度 = 数据量 * 单项高度
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

/**
 * 滚动事件处理
 */
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop;
};

onMounted(() => {
  containerHeight.value = containerRef.value.clientHeight;
});
</script>
```

---

### 业务场景优化方案

#### 场景1: 电商首页优化

```vue
<!-- HomePage.vue -->
<template>
  <div class="home-page">
    <!-- 首屏关键内容 -->
    <BannerCarousel :images="bannerImages" />
  
    <!-- 首屏商品列表 -->
    <ProductList :products="firstScreenProducts" />
  
    <!-- 懒加载组件：离开视窗后才加载 -->
    <LazyComponent>
      <RecommendSection />
    </LazyComponent>
  
    <LazyComponent>
      <FooterSection />
    </LazyComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BannerCarousel from './components/BannerCarousel.vue';
import ProductList from './components/ProductList.vue';

// 懒加载包装器组件
import LazyComponent from './components/LazyComponent.vue';

// 异步加载非关键组件
const RecommendSection = defineAsyncComponent(() =>
  import('./components/RecommendSection.vue')
);

const FooterSection = defineAsyncComponent(() =>
  import('./components/FooterSection.vue')
);

/**
 * 优化策略
 * 1. 轮播图第2-N张懒加载
 * 2. 首屏外商品懒加载
 * 3. 页脚等非关键模块异步加载
 * 4. 骨架屏占位
 */
const bannerImages = ref([]);
const firstScreenProducts = ref([]);

onMounted(async () => {
  // 优先加载首屏数据
  const [banners, products] = await Promise.all([
    fetchBanners(),
    fetchProducts({ page: 1, limit: 10 })
  ]);

  bannerImages.value = banners;
  firstScreenProducts.value = products;
});
</script>
```

#### 场景2: 后台管理系统（动态路由）

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

/**
 * 静态路由：登录等公共页面
 */
const staticRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
});

/**
 * 动态添加路由
 * 登录后根据权限动态加载菜单路由
 */
export function addDynamicRoutes(menuList) {
  menuList.forEach(menu => {
    router.addRoute({
      path: menu.path,
      name: menu.name,
      // 动态路由也支持懒加载
      component: () => import(`@/views/${menu.component}.vue`),
      meta: menu.meta
    });
  });
}

export default router;
```

```javascript
// store/user.js
import { addDynamicRoutes } from '@/router';

/**
 * 用户登录后初始化路由
 */
export async function initUserRoutes() {
  // 获取用户菜单权限
  const menuList = await fetchUserMenu();

  // 动态添加路由
  addDynamicRoutes(menuList);
}
```

#### 场景3: 图片懒加载指令

```javascript
// directives/lazy.js
/**
 * 图片懒加载指令
 * 使用 Intersection Observer API
 */
export const lazyLoad = {
  mounted(el, binding) {
    const imageSrc = binding.value;
    const placeholder = el.dataset.placeholder || '/placeholder.png';
  
    // 先显示占位图
    el.src = placeholder;
  
    // 创建观察器
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 进入视窗，加载真实图片
          const img = entry.target;
          img.src = imageSrc;
        
          // 加载成功后移除观察
          img.onload = () => {
            observer.unobserve(img);
          };
        }
      });
    }, {
      rootMargin: '50px' // 提前 50px 开始加载
    });
  
    observer.observe(el);
  
    // 保存 observer 实例，用于卸载时清理
    el._observer = observer;
  },

  unmounted(el) {
    // 组件卸载时清理观察器
    if (el._observer) {
      el._observer.disconnect();
      delete el._observer;
    }
  }
};
```

```javascript
// main.js
import { createApp } from 'vue';
import { lazyLoad } from './directives/lazy';

const app = createApp(App);

// 注册全局指令
app.directive('lazy', lazyLoad);
```

```vue
<!-- 使用懒加载指令 -->
<template>
  <div class="product-list">
    <img 
      v-for="item in products"
      :key="item.id"
      v-lazy="item.imageUrl"
      data-placeholder="/loading.gif"
      :alt="item.name"
    >
  </div>
</template>
```

---

### 关键要点

1. **度量驱动优化** - 先用工具找瓶颈，避免盲目优化
2. **路由懒加载** - 最基础、ROI最高的优化
3. **按需加载** - UI库、工具库只打包用到的部分
4. **资源压缩** - Gzip/Brotli 减小传输体积
5. **图片优化** - 压缩、WebP、懒加载三管齐下
6. **CDN加速** - 减少网络延迟
7. **感知优化** - 骨架屏、渐进式加载提升体验
8. **虚拟列表** - 大数据场景必备

---

## 面试突击模式

### [SPA 首屏性能优化] 面试速记

#### 30秒电梯演讲

**首屏优化核心是减少首次加载资源体积和数量。主要手段：路由懒加载实现代码分割、UI框架按需加载、Gzip压缩传输体积、图片压缩和懒加载、CDN加速。配合打包分析工具定位瓶颈，优先优化ROI高的项。最后用骨架屏等感知优化提升体验。**

---

### 高频考点（必背）

**考点1: 代码分割的原理和实现方式**
代码分割是将应用拆分成多个bundle，按需加载。实现方式：路由懒加载用`() => import()`动态导入，Webpack/Vite会自动将其打包成独立chunk。访问时才下载对应chunk，减小主包体积，加快首屏加载。

**考点2: Tree Shaking 是什么，如何生效**
Tree Shaking是打包时移除未引用代码的机制。前提是代码使用ESM模块（`import/export`）。打包工具分析依赖图，标记未使用的导出，最终删除。能大幅减小bundle体积，尤其对工具库效果明显。

**考点3: Gzip压缩的原理和配置**
Gzip基于DEFLATE算法，通过查找重复字符串用短标识替换实现压缩。文本文件压缩率高达70%。配置：构建时用插件生成`.gz`文件，服务器（如Nginx）开启`gzip_static on`优先返回压缩文件。

**考点4: 图片优化的完整方案**
1)压缩：用tinypng或构建插件减小文件体积 2)现代格式：WebP比PNG/JPG小25-35%，用`<picture>`提供降级 3)懒加载：视窗外图片用Intersection Observer延迟加载 4)响应式：根据屏幕大小加载不同尺寸。

**考点5: 虚拟列表的核心原理**
只渲染可见区域的DOM元素，非可见部分用空白div占位。核心计算：根据滚动位置计算可见区域的起始索引和数量，动态渲染对应数据。通过减少DOM数量（成千上万降到几十个）提升渲染性能。

---

### 经典面试题

#### 题目1: 如何分析和定位首屏加载慢的原因？

**思路:**
1. 使用 Lighthouse 获取性能报告
2. 查看 Network 面板分析资源加载
3. 使用打包分析工具检查bundle体积
4. 逐项排查常见瓶颈

**答案:**
首先用Chrome DevTools的Lighthouse生成性能报告，关注FCP（首次内容绘制）和LCP（最大内容绘制）指标。然后打开Network面板，禁用缓存模拟首次访问，观察：1)是否有阻塞渲染的大文件 2)资源数量是否过多 3)TTFB（首字节时间）是否过长。接着使用rollup-plugin-visualizer分析打包产物，找出体积大的依赖库。根据分析结果针对性优化：代码分割、按需加载、资源压缩等。

**代码框架:**
```javascript
/**
 * 打包分析配置
 * 可视化展示各模块体积占比
 */
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,        // 构建后自动打开
      gzipSize: true,    // 显示Gzip大小
      brotliSize: true,  // 显示Brotli大小
      filename: 'dist/stats.html'
    })
  ]
});

/**
 * 性能度量关键指标
 */
const performanceMetrics = {
  FCP: 'First Contentful Paint',  // 首次内容绘制
  LCP: 'Largest Contentful Paint', // 最大内容绘制
  TTI: 'Time to Interactive',      // 可交互时间
  TBT: 'Total Blocking Time',      // 总阻塞时间
  CLS: 'Cumulative Layout Shift'   // 累积布局偏移
};
```

---

#### 题目2: 实现一个自动按需加载UI组件库的方案

**思路:**
1. 使用 unplugin-vue-components 插件
2. 配置对应UI库的 resolver
3. 无需手动导入即可使用

**答案:**
使用unplugin-vue-components插件可以实现组件的自动按需导入。插件会扫描模板中使用的组件标签，自动生成对应的import语句并注册组件。配合UI库的resolver（如ElementPlusResolver），还能自动导入样式。这种方式完全自动化，开发者无需关心导入细节，代码更简洁。

**代码框架:**
```javascript
/**
 * 自动按需导入配置
 * 以 Element Plus 为例
 */
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    /**
     * 自动导入组件
     * 扫描模板中的组件使用，自动生成导入代码
     */
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass' // 自动导入样式
        })
      ],
      dts: 'src/components.d.ts' // 生成类型声明文件
    }),
  
    /**
     * 自动导入 API
     * ref, computed 等无需手动导入
     */
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ],
      dts: 'src/auto-imports.d.ts'
    })
  ]
});
```

```vue
<!-- 使用示例 - 完全不需要导入 -->
<template>
  <div>
    <!-- 组件自动按需导入 -->
    <el-button type="primary" @click="handleClick">
      点击次数: {{ count }}
    </el-button>
  
    <el-table :data="tableData">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
    </el-table>
  </div>
</template>

<script setup>
/**
 * API 自动导入，无需手动 import
 * ref, computed, watch 等直接使用
 */
const count = ref(0);

const tableData = computed(() => [
  { name: '张三', age: 18 },
  { name: '李四', age: 22 }
]);

const handleClick = () => {
  count.value++;
};
</script>
```

---

