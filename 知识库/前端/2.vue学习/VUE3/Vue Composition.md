
### Vue Composition API 开发文档

#### 核心思想总结

`Composition API` 是 Vue 3 引入的一种新的组件逻辑组织方式，旨在解决 `Options API` 在大型、复杂组件中遇到的可维护性、可读性和逻辑复用性问题。

- **Options API（选项式 API）**：通过 `data`、`methods`、`computed` 等选项来组织代码。这种方式将一个逻辑功能（如“用户数据获取”）的代码分散在文件的不同部分，导致组件变大时难以维护。其逻辑复用主要依赖 `mixins`，但 `mixins` 存在数据来源不清晰和命名冲突的风险。

- **Composition API（组合式 API）**：允许我们将与同一逻辑功能相关的代码（如响应式状态、方法、计算属性、生命周期钩子等）组织在一起，通常放在一个独立的函数中（称为 “Composable” 或 “Hook”）。这使得代码高内聚、低耦合，极大地提升了可读性和可维护性。逻辑复用通过纯粹的 JavaScript 函数实现，数据来源清晰，且没有命名冲突的风险。

#### 完整示例：产品列表筛选与排序

为了全面展示两种 API 的差异，我们创建一个包含“获取产品列表”、“关键词搜索过滤”和“价格排序”三个逻辑关注点的组件。

##### 1. Options API 实现 (`ProductListOptions.vue`)

```vue
<template>
  <div>
    <h2>产品列表 (Options API)</h2>
    <input v-model="searchQuery" placeholder="搜索产品..." />
    <button @click="toggleSortOrder">
      按价格排序 ({{ sortOrder === 'asc' ? '升序' : '降序' }})
    </button>
    <div v-if="loading">加载中...</div>
    <ul v-else-if="products.length">
      <li v-for="product in filteredAndSortedProducts" :key="product.id">
        {{ product.name }} - ¥{{ product.price }}
      </li>
    </ul>
    <div v-else>没有产品数据。</div>
  </div>
</template>

<script>
// 模拟API调用
const fetchProductsAPI = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '笔记本电脑', price: 5999 },
        { id: 2, name: '智能手机', price: 3999 },
        { id: 3, name: '无线耳机', price: 799 },
        { id: 4, name: '机械键盘', price: 899 },
      ]);
    }, 1000);
  });
};

export default {
  name: 'ProductListOptions',
  data() {
    return {
      // 产品数据逻辑
      products: [],
      loading: true,
      // 搜索逻辑
      searchQuery: '',
      // 排序逻辑
      sortOrder: 'asc', // 'asc' 或 'desc'
    };
  },
  computed: {
    // 组合搜索和排序逻辑
    filteredAndSortedProducts() {
      let products = [...this.products];

      // 1. 搜索过滤
      if (this.searchQuery) {
        products = products.filter(p =>
          p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // 2. 价格排序
      products.sort((a, b) => {
        return this.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      });

      return products;
    },
  },
  methods: {
    // 产品数据逻辑
    async fetchProducts() {
      this.loading = true;
      try {
        this.products = await fetchProductsAPI();
      } catch (error) {
        console.error('获取产品失败:', error);
      } finally {
        this.loading = false;
      }
    },
    // 排序逻辑
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
  mounted() {
    // 产品数据逻辑
    this.fetchProducts();
  },
};
</script>
```

##### 2. Composition API 实现

首先，我们将逻辑拆分成可复用的 `Composable` 函数。

**`composables/useProducts.js` (产品数据逻辑)**
```javascript
import { ref, onMounted } from 'vue';

// 模拟API调用
const fetchProductsAPI = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '笔记本电脑', price: 5999 },
        { id: 2, name: '智能手机', price: 3999 },
        { id: 3, name: '无线耳机', price: 799 },
        { id: 4, name: '机械键盘', price: 899 },
      ]);
    }, 1000);
  });
};

export function useProducts() {
  const products = ref([]);
  const loading = ref(true);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      products.value = await fetchProductsAPI();
    } catch (error) {
      console.error('获取产品失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 组件挂载时自动获取数据
  onMounted(fetchProducts);

  // 暴露状态和方法
  return { products, loading, fetchProducts };
}
```

**`ProductListComposition.vue` (组件)**
```vue
<template>
  <div>
    <h2>产品列表 (Composition API)</h2>
    <input v-model="searchQuery" placeholder="搜索产品..." />
    <button @click="toggleSortOrder">
      按价格排序 ({{ sortOrder === 'asc' ? '升序' : '降序' }})
    </button>
    <div v-if="loading">加载中...</div>
    <ul v-else-if="products.length">
      <li v-for="product in finalProducts" :key="product.id">
        {{ product.name }} - ¥{{ product.price }}
      </li>
    </ul>
    <div v-else>没有产品数据。</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProducts } from './composables/useProducts';

// 1. 产品数据逻辑
const { products, loading } = useProducts();

// 2. 搜索逻辑
const searchQuery = ref('');

// 3. 排序逻辑
const sortOrder = ref('asc');
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

// 4. 组合搜索和排序的计算属性
const finalProducts = computed(() => {
  let productsToShow = [...products.value];

  // 搜索过滤
  if (searchQuery.value) {
    productsToShow = productsToShow.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 价格排序
  productsToShow.sort((a, b) => {
    return sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price;
  });

  return productsToShow;
});
</script>
```

#### 学习知识

1.  **逻辑组织方式**：
    *   **Options API**：在 `ProductListOptions.vue` 中，与“产品数据”相关的 `products` 和 `loading` 在 `data` 选项，`fetchProducts` 在 `methods` 选项，调用时机在 `mounted` 钩子。代码被Vue的选项结构强制分割。
    *   **Composition API**：在 `ProductListComposition.vue` 和 `useProducts.js` 中，所有与“产品数据”相关的状态（`products`, `loading`）、方法（`fetchProducts`）和生命周期（`onMounted`）都封装在 `useProducts` 函数中，实现了高度内聚。

2.  **逻辑复用能力**：
    *   `useProducts.js` 是一个标准的 `Composable` 函数，它可以被任何其他需要获取产品列表的组件复用，只需一行 `const { products, loading } = useProducts();`
    *   如果使用 Options API 复用此逻辑，我们需要创建一个 `mixin`，但这会引入命名冲突和数据来源不明确的问题。

3.  **响应式系统**：
    *   Composition API 使用 `ref` 和 `reactive` 来创建响应式数据。`ref` 用于基本类型和对象，通过 `.value` 访问；`reactive` 用于对象。
    *   `computed` 函数用于创建基于其他响应式数据派生出的新数据。

4.  **TypeScript 友好性**：
    *   Composition API 主要由普通函数和变量构成，天然对 TypeScript 的类型推导更加友好。`useProducts` 返回的对象可以轻松地被推断出类型。

5.  **`this` 的问题**：
    *   在 Composition API（尤其是在 `setup` 语法糖中）几乎不需要使用 `this`，避免了 `this` 指向混乱的问题。

#### 用途（用在那个地方）

-   **大型复杂组件**：当一个组件需要处理多个独立的业务逻辑（如数据获取、表单处理、图表渲染等）时，Composition API 可以让每个逻辑块的代码聚合在一起，使组件结构更清晰。
-   **可复用的业务逻辑**：当你发现多个组件都需要相同的一套逻辑（如：跟踪鼠标位置、管理API请求状态、处理本地存储等）时，可以将其抽离成一个 `Composable` 函数（如 `useMousePosition`、`useRequest`、`useLocalStorage`），在不同组件中方便地复用。
-   **与外部库集成**：将第三方库（如 D3.js, Chart.js）的逻辑封装成 `Composable`，可以更好地管理其状态和生命周期。
-   **拥抱 TypeScript 的项目**：Composition API 提供了卓越的类型推断支持，是使用 TypeScript 开发 Vue 应用的首选。

[标签: Vue Composition API, Vue Options API]

---

### 面试官视角：考察内容

你好，我是本次面试的前端技术官。我们看到你的简历上对 Vue 3 和 Composition API 有深入的了解，现在我们来探讨一些相关的技术和业务问题。

#### 技术基础题（10题）

**1. `ref` 和 `reactive` 有什么核心区别？在下面的场景中，你会选择哪一个，为什么？**
```javascript
// 场景A: 存储一个用户的加载状态 (true/false)
let isLoading = ?(false);

// 场景B: 存储一个用户的详细信息对象
let userInfo = ?({ name: 'Alice', age: 25 });
```
**答案**:
-   **核心区别**: `ref` 通常用于处理基本数据类型（如 `string`, `number`, `boolean`），它通过 `.value` 属性来访问和修改值。它也可以用于对象，但其内部实现依然是调用 `reactive`。`reactive` 专门用于将一个对象（或数组）转化为深度响应式对象，访问属性时不需要 `.value`。`reactive` 不能用于基本数据类型。
-   **场景选择**:
    -   **场景A**: `let isLoading = ref(false);` 应该使用 `ref`，因为 `false` 是一个布尔值（基本类型）。
    -   **场景B**: `let userInfo = reactive({ name: 'Alice', age: 25 });` 推荐使用 `reactive`，因为它专为对象设计，访问 `userInfo.name` 比 `userInfo.value.name` 更直观。当然，使用 `ref` 也可以，但 `reactive` 在此场景下更符合其设计初衷。

**2. 在下面的 `setup` 函数中，直接解构 `props` 会有什么问题？应该如何正确地让解构出的变量保持响应性？**
```javascript
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  props: {
    message: String
  },

  setup(props) {
    // 这样做有什么问题？
    let { message } = props; 
  
    // 如何修复？
    // ?
  
    return { renderedMessage: message };
  }
});
```
**答案**:
-   **问题**: 直接使用 `let { message } = props;` 会导致 `message` 变量失去与 `props` 的响应式链接。当父组件更新 `message` prop 时，组件内部的 `message` 变量不会随之更新，因为它只是一个普通的字符串副本。
-   **修复**: 使用 `toRefs` 或 `toRef` 来创建对 `props` 属性的响应式引用。
    ```javascript
    // 推荐方式
    const { message } = toRefs(props);
    // 现在 message 是一个 ref, 在模板中可以直接使用，在JS中需要 .value
  
    // 或者只转换单个prop
    // import { toRef } from 'vue';
    // const message = toRef(props, 'message');
    ```

**3. 下面这个 `useCounter` composable 有什么潜在的内存泄漏风险？如何修复它？**
```javascript
import { ref } from 'vue';

export function useCounter() {
    const count = ref(0);
    setInterval(() => {
        count.value++;
    }, 1000);
    return { count };
}
```
**答案**:
-   **风险**: `setInterval` 创建了一个全局的定时器，它会一直运行，即使使用了 `useCounter` 的组件已经被销毁。这会导致组件实例无法被垃圾回收，造成内存泄漏。
-   **修复**: 使用 `onUnmounted`生命周期钩子，在组件卸载时清除定时器。
    ```javascript
    import { ref, onUnmounted } from 'vue';

    export function useCounter() {
        const count = ref(0);
        const timer = setInterval(() => {
            count.value++;
        }, 1000);

        onUnmounted(() => {
            clearInterval(timer);
        });

        return { count };
    }
    ```

**4. 在 `<script setup>` 中，为什么 `defineProps` 和 `defineEmits` 不需要 `import` 就可以直接使用？**
**答案**:
`defineProps` 和 `defineEmits` 是**编译时宏 (Compiler Macros)**。这意味着它们不是在运行时执行的 JavaScript 函数，而是在 Vue SFC (Single File Component) 编译阶段被处理和转换的。编译器会分析 `<script setup>` 块，并将这些宏转换为等效的 `props` 和 `emits` 选项代码。因为它们是编译器层面的特殊指令，所以 Vue 设计为全局可用，无需从 `'vue'` 中导入。

**5. `computed` 和 `watch` 的应用场景有什么不同？请根据下面的需求选择合适的 API。**
```javascript
// 需求A: 当用户的姓(firstName)和名(lastName)改变时，自动更新全名(fullName)。
// 需求B: 当用户ID(userId)改变时，需要向服务器发送一个异步请求获取新用户的数据。
```
**答案**:
-   **不同点**: `computed` 主要用于**同步派生**或计算状态，它会返回一个值，并且具有缓存特性，只有当依赖项改变时才会重新计算。`watch` 用于**观察**数据的变化并执行**副作用**（Side Effects），比如发起网络请求、操作DOM、调用第三方API等。它不返回值。
-   **选择**:
    -   **需求A**: 使用 `computed`。因为它是一个同步的、衍生的值。
        ```javascript
        const fullName = computed(() => `${firstName.value} ${lastName.value}`);
        ```
    -   **需求B**: 使用 `watch`。因为获取数据是一个异步的副作用操作。
        ```javascript
        watch(userId, async (newId) => {
            userData.value = await fetchUser(newId);
        });
        ```

**6. Options API 中的 `this` 和 Composition API `setup()` 中的 `this` 有什么区别？**
**答案**:
-   **Options API**: `this` 指向组件实例。你可以通过 `this.dataProperty`、`this.methodName()` 等方式访问组件的 `data`, `methods`, `computed` 等。Vue 内部做了代理，使得 `this` 的指向符合直觉。
-   **Composition API (`setup()`中)**: 在 `setup()` 函数执行时，组件实例**尚未被创建**。因此，`setup()` 中的 `this` 是 `undefined`。这也是为什么所有状态和方法都需在 `setup` 内部定义并显式返回的原因。这个设计强制开发者避免依赖 `this`，从而写出更清晰、更独立的逻辑单元。

**7. 解释一下 `onMounted` 在 Composition API 中是如何工作的，它和 Options API 的 `mounted` 钩子有什么关系？**
**答案**:
-   **工作原理**: `onMounted` 是一个接收回调函数作为参数的函数。当你在一个组件的 `setup` 或 `Composable` 函数中调用它时，它会将这个回调函数注册到一个内部的钩子队列中，该队列与当前组件实例相关联。当该组件挂载到 DOM 后，Vue 会遍历并执行这个队列中的所有回调。
-   **关系**: `onMounted` 的功能等同于 Options API 的 `mounted`生命周期钩子。它们都在组件挂flutter到 DOM 节点后被调用。Composition API 提供了 `onMounted`, `onUpdated`, `onUnmounted` 等一系列函数来替代 Options API 中的生命周期选项。

**8. 如何在 Composition API 的 composable 函数中获取组件的 props 和 emits？**
**答案**:
Composable 函数自身是无法直接访问组件的 props 或 emits 的，因为它们是与组件实例绑定的。正确的做法是将 props 或 emits 作为参数传递给 composable 函数。
```javascript
// composable
import { computed } from 'vue';
export function useFormattedMessage(props) {
  const formatted = computed(() => `[INFO]: ${props.message}`);
  return { formatted };
}

// component
import { useFormattedMessage } from './composables/useFormattedMessage';
export default {
  props: ['message'],
  setup(props) {
    const { formatted } = useFormattedMessage(props);
    return { formatted };
  }
}
```

**9. 请问下面代码中的 `double` 是否具有缓存特性？为什么？**
```javascript
import { ref } from 'vue';

const count = ref(1);

// A
const double = computed(() => {
    console.log('Calculating...');
    return count.value * 2;
});

// B
function getDouble() {
    console.log('Calculating...');
    return count.value * 2;
}
```
**答案**:
-   **A (`computed`)**: `double` **具有缓存特性**。`console.log` 只会在 `count` 的值首次被读取或发生变化后再次被读取时执行一次。只要 `count.value` 不变，多次访问 `double.value` 会直接返回上一次缓存的结果，不会重新执行计算函数。
-   **B (function)**: `getDouble` **不具有缓存特性**。每次调用 `getDouble()` 函数，它内部的代码都会被完整地执行一次，包括 `console.log`。这只是一个普通的函数调用。

**10. 从逻辑复用的角度看，Composition API 的 Composable 函数相比 Mixins 有哪些优势？**
**答案**:
1.  **数据来源清晰**：使用 Composable 时，组件中用到的状态和方法都是从 `useMyComposable()` 的返回值中显式解构出来的，来源一目了然。而 Mixins 会将属性和方法“隐式”地合并到组件实例上，当混入多个 Mixin 时，很难追溯某个属性或方法究竟来自哪里。
2.  **没有命名冲突**：Composable 返回的是一个普通对象，如果多个 Composable 返回了同名属性，开发者可以在解构时重命名，如 `const { data: userData } = useUser(); const { data: postData } = usePosts();`。而 Mixins 若存在同名选项，会根据合并策略进行覆盖，容易产生意料之外的行为。
3.  **更好的类型支持**：Composable 就是普通的 TypeScript/JavaScript 函数，其输入参数和返回值的类型可以被静态分析工具完美推断。而 Mixins 的类型推断则复杂得多，且支持不佳。

#### 业务逻辑题（10题）

**1. 假设你要开发一个通用的数据请求 Composable `useFetch`，它需要处理加载状态、错误状态和返回数据。请写出这个 Composable 的基本结构。**
```javascript
// useFetch.js
import { ref } from 'vue';

export function useFetch(url) {
    // 请补充代码
}

// 在组件中使用:
// const { data, error, loading } = useFetch('https://api.example.com/data');
```
**答案**:
```javascript
import { ref, onMounted } from 'vue';

export function useFetch(url) {
    const data = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const fetchData = async () => {
        loading.value = true;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data.value = await response.json();
            error.value = null; // 成功后清空错误
        } catch (e) {
            error.value = e;
            data.value = null; // 出错后清空数据
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchData);

    return { data, error, loading, refetch: fetchData }; // 也可暴露一个 refetch 方法
}
```

**2. 在一个表单组件中，我们希望当用户输入内容时，实现一个防抖（debounce）效果的搜索功能。请使用 Composition API 实现一个 `useDebouncedSearch` Composable。**
```javascript
// useDebouncedSearch.js
// ...

// 组件中使用
// const { searchQuery, debouncedQuery } = useDebouncedSearch(500); // 500ms延迟
// watch(debouncedQuery, (newValue) => { /* 发送搜索请求 */ });
```
**答案**:
```javascript
import { ref, customRef } from 'vue';

function useDebounce(value, delay = 200) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}

// 在你的场景中，可以这样封装 useDebouncedSearch
export function useDebouncedSearch(delay = 500) {
    const searchQuery = ref('');
    const debouncedQuery = useDebounce(searchQuery, delay);
    return { searchQuery, debouncedQuery };
}
```
*面试官可能会追问 `customRef` 的用法和原理，这是一个很好的深度考察点。*

**3. 我们需要一个跟踪窗口大小变化的 Composable `useWindowResize`。当窗口大小改变时，它能提供最新的宽度和高度。**
**答案**:
```javascript
import { ref, onMounted, onUnmounted } from 'vue';

export function useWindowResize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return { width, height };
}
```

**4. 业务场景：一个电商网站的购物车。我们需要一个 Composable `useShoppingCart` 来管理购物车的状态（商品列表、总价）。请实现添加商品和计算总价的逻辑。**
**答案**:
```javascript
import { ref, computed } from 'vue';

export function useShoppingCart() {
  // items: [{ id, name, price, quantity }]
  const items = ref([]);

  const addItem = (product) => {
    const existingItem = items.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  };

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  return { items, addItem, totalPrice };
}
```

**5. 页面上有一个模态框（Modal），它的显示/隐藏状态需要在多个不相关的组件之间共享和控制。你会如何设计一个 `useModal` Composable 来实现这个全局状态管理？**
**答案**:
通过在 Composable 外部定义状态，使其成为一个单例（Singleton）。
```javascript
// composables/useModal.js
import { ref } from 'vue';

// 在模块作用域内定义状态，这样它就是全局唯一的
const isVisible = ref(false);

export function useModal() {
  const open = () => {
    isVisible.value = true;
  };

  const close = () => {
    isVisible.value = false;
  };

  return {
    isVisible, // 直接暴露响应式状态
    open,
    close
  };
}
```
*任何组件调用 `useModal()` 都会访问到同一个 `isVisible` ref，从而实现全局状态共享。*

**6. 根据上一个 `useFetch` 的例子，我们现在希望它能支持手动触发请求，而不是只在 `onMounted` 时自动触发。请修改 `useFetch`。**
**答案**:
我们将请求逻辑提取到一个独立的函数中，并选择性地在 `onMounted` 中调用它，同时将这个函数暴露出去。
```javascript
import { ref } from 'vue';

export function useFetch(url, immediate = true) { // 添加一个控制立即执行的参数
    const data = ref(null);
    const error = ref(null);
    const loading = ref(false); // 初始值改为false

    const execute = async () => {
        loading.value = true;
        try {
            // ... (同问题1中的fetch逻辑)
            const response = await fetch(url);
            data.value = await response.json();
            error.value = null;
        } catch (e) {
            error.value = e;
        } finally {
            loading.value = false;
        }
    };

    if (immediate) {
      // 兼容之前的 onMounted 行为
      onMounted(execute);
    }
  
    return { data, error, loading, execute };
}

// 组件中使用
// const { data, execute } = useFetch('/api/data', false); // 不立即执行
// onButtonClick(execute); // 点击按钮时再执行
```

**7. 一个常见的业务需求是本地化存储，比如记住用户的偏好设置。请创建一个 `useLocalStorage` Composable，它能将一个 ref 的值与 `localStorage` 同步。**
**答案**:
```javascript
import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue);

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true }); // 使用 deep watch 来监听对象内部的变化

  return value;
}

// 组件中使用
// const theme = useLocalStorage('theme', 'light');
// theme.value = 'dark'; // 会自动存入localStorage
```

**8. 假设一个页面上有多个独立的计数器组件，但我们希望它们能共享同一个计数逻辑，同时各自维护自己的状态。Composition API 是如何优雅地解决这个问题的？**
```javascript
// Counter.vue
// <template><button @click="increment">{{ count }}</button></template>
```
**答案**:
这正是 Composable 函数的核心优势。`useCounter` 定义了逻辑，但每次调用它都会创建一套**全新的、独立的状态**。
```javascript
// useCounter.js
import { ref } from 'vue';
export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const increment = () => count.value++;
  return { count, increment };
}

// Counter.vue
<script setup>
import { useCounter } from './useCounter';
const { count, increment } = useCounter(); // 创建独立的 count 和 increment
</script>
```
*在父组件中多次使用 `<Counter />`，每个 `<Counter />` 内部都会调用 `useCounter()`，从而获得自己独立的 `count` 状态，但它们复用了相同的 `increment` 逻辑。*

**9. 我们的应用需要支持主题切换（如“白天模式”和“黑夜模式”）。这个状态需要在整个应用中共享。请结合 `provide/inject` 和 Composition API 设计一个方案。**
**答案**:
使用 `provide` 在根组件提供主题状态和切换方法，任何后代组件都可以通过 `inject` 来消费它们。
```javascript
// App.vue (根组件)
<script setup>
import { ref, provide } from 'vue';

const theme = ref('light');
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

provide('theme', {
  currentTheme: theme,
  toggleTheme,
});
</script>

// Settings.vue (任何深层子组件)
<script setup>
import { inject } from 'vue';

const { currentTheme, toggleTheme } = inject('theme');
</script>
<template>
  <button @click="toggleTheme">
    切换到 {{ currentTheme === 'light' ? '黑夜' : '白天' }} 模式
  </button>
</template>
```

**10. 在一个复杂的仪表盘页面，有多个图表组件。每个图表都需要根据一个全局的日期范围（`dateRange`）来重新获取数据。你会如何组织这个逻辑？**
**答案**:
我会创建一个全局的日期范围状态 Composable，并让每个图表组件 `watch` 这个状态的变化。
1.  **创建全局日期状态 Composable (`useDateRange.js`)**:
    ```javascript
    import { reactive } from 'vue';
    // 使用 reactive 并将其定义在模块作用域，使其成为全局单例
    const dateRange = reactive({ start: new Date(), end: new Date() });
  
    export function useDateRange() {
      const setDateRange = (start, end) => {
        dateRange.start = start;
        dateRange.end = end;
      };
    
      return { dateRange, setDateRange };
    }
    ```
2.  **在图表组件中使用**:
    ```javascript
    // ChartComponent.vue
    <script setup>
    import { watch } from 'vue';
    import { useDateRange } from './useDateRange';
    import { useFetch } from './useFetch'; // 假设有数据获取hook
  
    const { dateRange } = useDateRange();
  
    const { data, execute } = useFetch(/* API_ENDPOINT */, false);
  
    // 监听全局日期范围的变化，并重新获取数据
    watch(dateRange, () => {
      // 可以在这里构建新的API URL，或者将dateRange作为参数传给execute
      console.log('日期范围变化，重新获取图表数据');
      execute(); 
    }, { immediate: true, deep: true }); // immediate: 首次加载也执行
    </script>
    ```
*这样，当顶部的日期选择器调用 `setDateRange` 时，所有依赖 `dateRange` 的图表组件都会自动响应并更新。*

---

### 快速上手指南：如何将 Composable 应用到新项目

假设过了一段时间，你忘记了细节，但需要快速将上面例子中的 `useProducts.js` 应用到一个新项目中。

**(1) 复制 Composable 文件**

将 `useProducts.js` 文件复制到你新项目的 `src/composables/` 目录下。

```javascript
// src/composables/useProducts.js
import { ref, onMounted } from 'vue';

// 模拟API调用 (你可能需要替换成真实的API)
const fetchProductsAPI = () => { /* ... */ };

export function useProducts() {
  const products = ref([]);
  const loading = ref(true);

  const fetchProducts = async () => { /* ... */ };

  onMounted(fetchProducts);

  return { products, loading, fetchProducts };
}
```

**(2) 在组件中导入并使用**

在任何需要产品列表的 Vue 组件中（确保是 Vue 3项目，并使用 `<script setup>`），只需两步：

**步骤一：`import`**
在你的组件文件顶部，导入刚才的 `useProducts` 函数。

```vue
<script setup>
import { useProducts } from '@/composables/useProducts';
</script>
```

**步骤二：调用并解构**
在 `script` 内部调用它，并用 `const` 把你需要的数据和方法解构出来。

```vue
<script setup>
import { useProducts } from '@/composables/useProducts';

// 调用函数，拿到响应式的数据
const { products, loading } = useProducts();
</script>
```

**(3) 在模板中使用**

现在，`products` 和 `loading` 就像你用 `ref` 定义的普通响应式变量一样，可以直接在 `<template>` 中使用。

```vue
<template>
  <div>
    <h2>新项目的产品列表</h2>
    <div v-if="loading">正在拼命加载中...</div>
    <ul v-else>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ¥{{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useProducts } from '@/composables/useProducts';

const { products, loading } = useProducts();
</script>
```

**核心记忆点：** `Import` -> `Call` -> `Use`（导入、调用、使用）。就这么简单！