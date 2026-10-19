##### 骨架屏

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


##### 虚拟列表（处理大数据）

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