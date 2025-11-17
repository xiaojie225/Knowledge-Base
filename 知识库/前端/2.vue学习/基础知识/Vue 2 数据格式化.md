

## **开发文档：Vue 数据格式化演进史 - 从 Filter 到 Composables**

本文档旨在阐明 Vue 中数据格式化的历史演变，并为 Vue 3 项目提供一套现代化、可维护的最佳实践。

### **一、核心知识学习**

#### **1. Vue 2 的过滤器 (Filter) - 传统方式**

*   **是什么**：一个对传入数据进行处理并返回新数据的函数，常用于文本格式化。它不改变原始数据。
*   **用法**：通过管道符号 `|` 在 `{{ }}` 或 `v-bind` 中使用。
    ```html
    {{ price | currencyFormat }}
    ```
*   **定义**：可以在组件内部（`filters` 选项）或全局（`Vue.filter`）定义。
*   **原理回顾**：Vue 2 的模板编译器会将 `|` 语法解析成 `_f('filterName')(value)` 的函数调用形式。`_f` 负责解析过滤器函数，处理后的结果再通过 `_s` (toString) 渲染到视图。

#### **2. Vue 3 的演进 - 为什么移除 Filter？**

Vue 3 拥抱更简洁、更符合原生 JavaScript 的编程模式，因此移除了 `filter` 语法。主要原因如下：

*   **KISS (保持简单)**: `filter` 是一种特殊的语法糖，其功能完全可以由方法调用或计算属性替代。移除它可以简化 Vue 的核心概念。
*   **SOLID (设计原则)**: 全局过滤器破坏了封装性，造成了不易追踪的全局依赖。在大型项目中，很难确定一个全局 `filter` 被哪些组件使用，给维护带来困难。
*   **性能**: 组件方法可以在模板中被调用，但没有缓存。计算属性（Computed Properties）具有缓存能力，只有当其依赖的响应式数据变化时才会重新计算，性能更优。`filter` 则在每次渲染时都会执行。

#### **3. Vue 3 的现代替代方案**

##### **方案一：组件内的方法或计算属性**

对于仅在特定组件内使用的格式化逻辑，这是最直接的方式。

*   **方法 (Methods)**: 适合每次调用都需要重新计算的场景。
*   **计算属性 (Computed)**: **强烈推荐**。利用其缓存特性，性能更佳，代码更具声明性。

##### **方案二：组合式函数 (Composables) - 最佳实践**

对于需要在多个组件之间共享的格式化逻辑，Composables 是最理想的方案，完美体现了 **DRY** 和 **SRP** 原则。

*   创建一个 `useFormatters.js` 文件，专门负责提供格式化函数。
*   在任何需要格式化的组件中，按需导入并使用。

### **二、用途与应用场景**

数据格式化的场景非常普遍，贯穿于几乎所有前端应用：
*   **电商/金融**: 货币格式化（如 `12345.67` -> `$12,345.67`）。
*   **社交/内容**: 日期时间格式化（如 `2023-10-27T10:00:00Z` -> `2小时前` 或 `2023-10-27`）。
*   **工具类**: 文件大小格式化（如 `10240` -> `10 KB`）。
*   **数据展示**: 文本截断（如 `这是一段很长的文本...`），百分比显示。
*   **安全**: 敏感信息脱敏（如 `13812345678` -> `138****5678`）。

### **三、完整代码示例：演进对比**

我们将创建一个 `DataDisplay.vue` 组件，同时展示传统方式和现代方式。

#### **1. 创建可复用的 Composable (`src/composables/useFormatters.js`)**

```javascript
// src/composables/useFormatters.js
// SRP: 这个文件只负责提供格式化函数
// DRY: 任何组件都可以复用这里的逻辑

import { computed } from 'vue';

export function useFormatters() {
  const currency = (value, symbol = '$', decimals = 2) => {
    if (isNaN(Number(value))) return value;
    const formatted = Number(value).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${symbol}${formatted}`;
  };

  const date = (value, locale = 'zh-CN') => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return { currency, date };
}

// 也可以导出单个函数，更加灵活
export function formatCurrency(value, symbol = '$', decimals = 2) {
    if (isNaN(Number(value))) return value;
    const formatted = Number(value).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${symbol}${formatted}`;
}
```

#### **2. 在组件中使用 (`src/components/DataDisplay.vue`)**

```vue
<!-- src/components/DataDisplay.vue -->
<template>
  <div class="card">
    <h2>数据格式化演进示例</h2>
    <div class="data-item">
      <span>原始数据:</span>
      <p>价格: {{ product.price }}</p>
      <p>上架日期: {{ product.launchDate }}</p>
    </div>

    <hr />

    <h3>1. Vue 3 最佳实践: 使用 Composable</h3>
    <div class="data-item">
      <span>格式化后:</span>
      <p>价格: {{ currency(product.price, '￥') }}</p>
      <p>上架日期: {{ date(product.launchDate) }}</p>
    </div>

    <h3>2. Vue 3 备选: 使用计算属性 (性能好)</h3>
    <div class="data-item">
      <span>格式化后:</span>
      <p>价格: {{ formattedPrice }}</p>
    </div>
  
    <h3>3. Vue 3 备选: 使用方法 (调用灵活)</h3>
    <div class="data-item">
      <span>格式化后:</span>
      <p>价格: {{ formatPriceMethod(product.price) }}</p>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
// 方案1：导入并使用 Composable
import { useFormatters } from '@/composables/useFormatters';

const { currency, date } = useFormatters();

const product = reactive({
  price: 5999.9,
  launchDate: '2023-10-27T12:00:00Z',
});

// 方案2：使用计算属性
const formattedPrice = computed(() => {
  return `￥${product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
});

// 方案3：使用组件内方法
const formatPriceMethod = (value) => {
  return `￥${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
</script>

<style scoped>
.card { padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
.data-item { margin-bottom: 15px; }
hr { margin: 20px 0; }
</style>
```

### **四、面试官考察**

#### **技术知识题 (10题)**

1.  **问题:** Vue 2 中的过滤器是什么？请举例说明其基本用法。
    *   **答案:** 是一个用于文本格式化的函数，通过 `|` 符号在模板中使用，例如 `{{ price | currency }}`。它接收值作为第一个参数，可以串联和接收额外参数。

2.  **问题:** Vue 3 为什么移除了过滤器这个特性？
    *   **答案:** 主要出于三个原因：1. **简化API**：它的功能可被JS原生方法或计算属性完全替代，移除它可以减少Vue的概念。2. **改善作用域和依赖关系**：全局过滤器污染全局命名空间，依赖不明确，不利于维护。3. **性能**：计算属性有缓存，性能优于每次渲染都执行的过滤器。

3.  **问题:** 在 Vue 3 中，如果要格式化一个从后端获取并展示在页面上的价格数据，最佳的实现方式是什么？为什么？
    *   **答案:** 最佳方式是使用**计算属性 (Computed Property)**。因为价格数据是响应式的，计算属性会缓存其结果，只有当原始价格变化时才会重新计算，避免了不必要的重复格式化操作，性能最好。

4.  **问题:** 当你有很多种格式化函数（如货币、日期、百分比）需要在项目的多个组件中复用时，你会如何组织你的代码？
    *   **答案:** 我会创建一个 **Composable (组合式函数)**，例如 `useFormatters.js`。在这个文件中导出所有可复用的格式化函数。需要用的组件只需 `import { currency, date } from '...'` 来按需使用。这遵循了DRY和SRP原则，代码清晰且可维护性高。

5.  **问题:** 在模板中直接调用一个方法来格式化数据，例如 `{{ formatCurrency(item.price) }}`，和使用计算属性相比，有什么潜在的缺点？
    *   **答案:** 主要缺点是**性能**。只要组件发生任何原因的重新渲染，这个方法就会被重新执行，即使 `item.price` 本身没有改变。而计算属性会缓存结果，只有在 `item.price` 变化时才会重新计算。


7.  **问题:** 如何在 Vue 3 中实现一个可以接收参数的格式化函数，并在模板中使用？
    *   **答案:** 和普通的 JavaScript 函数一样。可以在 Composable 或组件方法中定义一个接收多个参数的函数，然后在模板中调用时传递它们。
        ```javascript
        // In script
        const currency = (val, symbol = '$') => `${symbol}${val}`;
        // In template
        <p>{{ currency(price, '€') }}</p>
        ```

8.  **问题:** 假设你在维护一个从 Vue 2 迁移到 Vue 3 的大型项目，里面有大量的全局过滤器。你的迁移策略是什么？
    *   **答案:**
        1.  **盘点**: 全局搜索 `Vue.filter`，列出所有全局过滤器。
        2.  **重构**: 创建一个 `src/utils/formatters.js` 或 `src/composables/useFormatters.js` 文件。
        3.  **迁移**: 将每个全局过滤器的逻辑迁移为该文件中的一个导出函数。
        4.  **替换**: 在使用了这些过滤器的组件中，`import` 对应的格式化函数，并在模板中以方法调用的形式替换原来的 `|` 语法。
        5.  **移除**: 最后，删除 `Vue.filter` 的所有注册代码。

9.  **问题:** 解释一下 `_f` (`resolveFilter`) 和 `_s` (`toString`) 在 Vue 2 过滤器渲染流程中的角色。
    *   **答案:** `_f` 在渲染函数运行时被调用，它的作用是根据过滤器名称（字符串）从组件的选项或全局配置中找到并返回对应的过滤器函数。`_s` 负责将任何值转换成字符串以便在模板中显示，过滤器处理后的结果会经过 `_s` 处理。

10. **问题:** 如果一个格式化逻辑非常复杂，并且依赖于其他响应式状态（例如，根据用户的地区设置来显示不同的货币符号），使用 Vue 3 的哪种方式处理最合适？
    *   **答案:** 毫无疑问是**计算属性 (Computed Property)**。因为计算属性本身就是响应式的，它可以依赖其他的 `ref` 或 `reactive` 对象。当地区设置变化时，计算属性会自动重新计算并返回新的格式化字符串，视图也会自动更新。

#### **业务逻辑题 (10题)**

1.  **场景:** 电商网站的商品列表，价格需要显示为 `¥1,299.00` 格式。请用 Vue 3 的最佳实践来实现。
    *   **答案:** 创建一个 `useFormatters.js` composable，内含一个 `currency` 函数。在商品列表组件中导入并使用它。如果列表是 `v-for` 循环，直接在模板中调用 `{{ currency(item.price, '¥') }}`。

2.  **场景:** 一个社交应用，需要将帖子的发布时间戳转换为相对时间，如“5分钟前”、“3小时前”、“昨天”。如何设计这个功能？
    *   **答案:** 在 `useFormatters.js` 中添加一个 `relativeTime` 函数。这个函数接收一个时间戳，与当前时间进行比较，返回对应的字符串。由于“当前时间”在变，这个格式化结果不适合用 `computed` (因为它会一直变)，直接在模板中作为方法调用是合适的。或者，可以设置一个定时器，每分钟更新一次相对时间。

3.  **场景:** 用户个人资料页面，需要将手机号 `13812345678` 显示为 `138****5678` 以保护隐私。如何实现这个脱敏函数？
    *   **答案:** 在 `useFormatters.js` 中创建一个 `desensitize` 函数，接收字符串和脱敏规则（如保留前三后四）。在模板中直接调用 `{{ desensitize(user.phone) }}`。

4.  **场景:** 一个文件上传系统，需要将文件大小（字节）转换为`KB`, `MB`, `GB` 等易于阅读的格式。你会怎么做？
    *   **答案:** 在 `useFormatters.js` 中创建一个 `fileSize` 函数。该函数接收字节数，通过循环除以1024来确定合适的单位，并格式化数字（例如保留两位小数）。

5.  **场景:** 一个数据报表页面，有一个表格，其中一列是“完成率”，后端返回的是 `0.85` 这样的浮点数，需要显示为 `85.00%`。
    *   **答案:** 在 `useFormatters.js` 中创建一个 `percentage` 函数。它接收一个浮点数，乘以100，用 `toFixed(2)` 保留两位小数，最后拼接上 `%` 符号。

6.  **场景:** 用户可以自定义日期显示格式（如 `YYYY-MM-DD` vs `DD/MM/YYYY`）。你的格式化函数如何支持这种动态性？
    *   **答案:** 格式化函数需要接收第二个参数 `formatString`。函数内部可以使用 `date-fns` 或 `dayjs` 这样的库，它们能根据传入的格式化字符串轻松地输出不同格式的日期。用户的偏好设置可以存在Pinia Store里，格式化函数从Store中读取这个`formatString`。

7.  **场景:** 一个国际化(i18n)应用，价格 `12345.67` 在美国应显示为 `$12,345.67`，在德国应显示为 `12.345,67 €`。如何设计？
    *   **答案:** 使用浏览器原生的 `Intl.NumberFormat` API。创建一个 `currency` 函数，它接收数值和区域代码 (`locale`, 如 `'en-US'` 或 `'de-DE'`)。函数内部使用 `new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' /* 或 EUR */ }).format(value)`。区域代码可以从i18n库的当前设置中获取。

8.  **场景:** 一个长内容展示页面，文章摘要需要截断，最多显示100个字符，并在末尾加上“...”。
    *   **答案:** 在 `useFormatters.js` 中创建一个 `truncate` 函数。它接收字符串和最大长度。如果字符串长度超过最大值，就用 `slice(0, maxLength)` 截取，然后拼接 `...`。

9.  **场景:** 后端接口返回的数据中，`status` 字段是数字（1代表“已发布”，2代表“待审核”，3代表“已驳回”）。前端需要显示对应的文本。
    *   **答案:** 这不是典型的“格式化”，更像是“映射”或“翻译”。最好的方式是在 `composables` 中创建一个 `useStatusMap.js`，导出一个对象或Map `{ 1: '已发布', ... }`。组件中导入这个map，然后通过 `{{ statusMap[item.status] }}` 来显示。将其封装成一个函数 `translateStatus(status)` 也是很好的选择。

10. **场景:** 在一个富文本编辑器中，用户输入的内容需要实时预览，并且预览区需要应用一些格式化（比如将 `[code]...[/code]` 标签转换为高亮代码块）。这个场景适合用我们讨论的格式化函数吗？
    *   **答案:** 不完全适合。这已经超出了简单的文本格式化范畴，涉及到HTML的解析和渲染。虽然可以用一个复杂的函数来处理，但更好的做法是使用 `computed` 属性，其值是经过专门的Markdown或BBCode解析库（如`marked.js`）处理后的HTML字符串，然后使用 `v-html` 指令将其渲染到预览区。

---

### **五、快速上手指南 (给未来的自己)**

嗨，未来的我！要在新 Vue 3 项目中优雅地处理数据格式化，这样做：

1.  **创建 Composable**: 在 `src/composables/` 目录下创建一个 `useFormatters.js` 文件。

2.  **填充函数**: 把所有通用的格式化逻辑，比如 `formatCurrency`, `formatDate` 等，都作为导出函数放在这个文件里。
    ```javascript
    // src/composables/useFormatters.js
    export function formatCurrency(value) { /* ... */ }
    export function formatDate(value) { /* ... */ }
    ```

3.  **在组件中使用**:
    *   在 `<script setup>` 中，从你的 `composable` 导入需要的函数。
        ```javascript
        import { formatCurrency, formatDate } from '@/composables/useFormatters';
        ```
    *   直接在模板 (`<template>`) 中或 `computed` 中像调用普通函数一样使用它们。
        ```html
        <p>价格: {{ formatCurrency(product.price) }}</p>
        <p>日期: {{ formatDate(product.date) }}</p>
        ```

**核心理念回顾**:
*   别再想 Vue 2 的 `filter` 了，那是过去式。
*   **首选 Composables**: 把可复用的格式化逻辑集中管理，实现 **DRY**。
*   **在组件内，首选 `computed`**: 利用缓存，提升性能。
*   这种方式让代码更清晰、依赖更明确、可维护性更高。

[标签: Vue 数据格式化, 计算属性, Composables]