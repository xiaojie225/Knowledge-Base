# Vue Slot (插槽) 内容分发 - 精华学习资料

## 📚日常学习模式

[标签: Vue 组件化, Slot 插槽, 内容分发, 组件通信]

### 核心概念

**插槽 (Slot) 是什么?**
- **本质**: Vue 的内容分发机制,允许父组件向子组件指定位置传递 UI 片段
- **核心思想**: 占位与填充
  - 子组件用 `<slot>` 定义"坑"(占位符)
  - 父组件填充内容到这些"坑"里
- **价值**: 实现组件结构与内容的解耦,提升复用性和灵活性

### 三种插槽类型

#### 1. 默认插槽 (Default Slot)
最基础的插槽,子组件只有一个匿名 `<slot>`

```html
<!-- 子组件 MyBox.vue -->
<template>
  <div class="box">
    <slot>默认后备内容</slot>
  </div>
</template>

<!-- 父组件使用 -->
<MyBox>
  <p>这段内容会替换掉 slot</p>
</MyBox>
```

**使用场景**: 组件只需一个内容出口时

#### 2. 具名插槽 (Named Slots)
通过 `name` 属性区分多个插槽位置

```html
<!-- 子组件 PageLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot name="content"></slot>
    </main>
    <footer>
      <slot name="footer">默认页脚</slot>
    </footer>
  </div>
</template>

<!-- 父组件使用 -->
<PageLayout>
  <template #header>
    <h1>页面标题</h1>
  </template>

  <template #content>
    <p>主体内容</p>
  </template>

  <!-- footer 使用默认内容,不填充 -->
</PageLayout>
```

**语法简写**: `v-slot:header` → `#header`

**使用场景**: 
- 布局组件 (header/sidebar/main/footer)
- 弹窗/卡片组件 (title/body/actions)

#### 3. 作用域插槽 (Scoped Slots)
子组件向父组件传递数据,父组件基于这些数据定义渲染内容

```html
<!-- 子组件 UserList.vue -->
<template>
  <ul>
    <li v-for="(user, index) in users" :key="user.id">
      <!-- 通过 v-bind 暴露数据给父组件 -->
      <slot :user="user" :index="index">
        <span>{{ user.name }}</span>
      </slot>
    </li>
  </ul>
</template>

<script setup>
/**
 * 用户列表组件
 * @param {Array} users - 用户数据数组
 */
defineProps({
  users: Array
});
</script>

<!-- 父组件使用 -->
<UserList :users="userList">
  <!-- 方式1: 完整语法 -->
  <template #default="slotProps">
    <strong>{{ slotProps.index + 1 }}.</strong>
    <span>{{ slotProps.user.name }}</span>
    <el-tag>{{ slotProps.user.role }}</el-tag>
  </template>

  <!-- 方式2: 解构语法(推荐) -->
  <template #default="{ user, index }">
    <strong>{{ index + 1 }}.</strong>
    <span>{{ user.name }}</span>
    <el-tag>{{ user.role }}</el-tag>
  </template>
</UserList>
```

**使用场景**:
- 数据表格 (自定义列渲染)
- 列表组件 (自定义项渲染)
- 下拉选择 (自定义选项样式)

### 关键知识点

**1. 编译作用域**
- 插槽内容在**父组件作用域**中编译
- 可访问父组件数据,无法直接访问子组件数据
- 作用域插槽通过"函数回调"模式实现数据传递

**2. 后备内容 (Fallback Content)**
```html
<slot>当父组件不提供内容时显示我</slot>
```

**3. Vue 3 统一语法**
- 使用 `v-slot` 指令统一具名插槽和作用域插槽
- 简写: `v-slot:name` → `#name`
- 默认插槽: `v-slot:default` → `#default`

**4. 动态插槽名**
```html
<template v-slot:[dynamicSlotName]>
  内容
</template>
```

### 完整示例

```html
<!-- FancyList.vue - 综合示例 -->
<template>
  <div class="fancy-list">
    <!-- 具名插槽: header -->
    <header>
      <slot name="header">
        <h2>默认标题</h2>
      </slot>
    </header>

    <!-- 作用域插槽: 列表项 -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        <slot :item="item" :index="index">
          <span>{{ item.text }}</span>
        </slot>
      </li>
    </ul>

    <!-- 具名插槽: footer -->
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup>
/**
 * 通用列表组件
 * @param {Array} items - 列表数据
 */
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<!-- 父组件使用 -->
<template>
  <FancyList :items="todoList">
    <!-- 自定义标题 -->
    <template #header>
      <h1>我的待办事项 📝</h1>
    </template>

    <!-- 自定义列表项渲染 -->
    <template #default="{ item, index }">
      <div class="todo-item">
        <span>{{ index + 1 }}. {{ item.text }}</span>
        <el-tag v-if="item.urgent" type="danger">紧急</el-tag>
        <el-button @click="removeItem(item.id)">删除</el-button>
      </div>
    </template>

    <!-- 自定义页脚 -->
    <template #footer>
      <p>共 {{ todoList.length }} 项任务</p>
    </template>
  </FancyList>
</template>

<script setup>
import { ref } from 'vue';

const todoList = ref([
  { id: 1, text: '学习 Vue', urgent: true },
  { id: 2, text: '掌握 Slot', urgent: false }
]);

/**
 * 删除待办事项
 * @param {number} id - 待办事项ID
 */
function removeItem(id) {
  todoList.value = todoList.value.filter(item => item.id !== id);
}
</script>
```

### Slot vs Props 对比

| 特性 | Slot | Props |
|------|------|-------|
| 传递内容 | HTML/组件/UI片段 | 数据(基本类型/对象/数组) |
| 主要用途 | 定义组件外观和结构 | 配置组件行为和状态 |
| 灵活性 | 高(可传递复杂UI) | 低(仅数据) |
| 使用场景 | 布局、卡片、弹窗、表格列 | 标题、颜色、尺寸、配置项 |

---

## ⚡面试突击模式

### [Vue Slot 插槽] 面试速记

#### 30秒电梯演讲
Slot 是 Vue 的内容分发机制,允许父组件向子组件传递 UI 片段。分为默认插槽、具名插槽和作用域插槽三种。插槽内容在父组件作用域编译,作用域插槽通过子组件传递数据实现父组件对子组件数据的访问,核心价值是实现组件结构与内容解耦,提升复用性。

#### 高频考点(必背)

**考点1: Slot 本质与解决的问题**
插槽本质是内容分发机制,是父子组件间传递 UI 片段的通道。解决组件复用性问题:将组件通用结构与可变内容分离,使同一组件可承载不同业务内容而无需修改代码,例如同一个弹窗组件可通过插槽显示不同的表单。

**考点2: 插槽编译作用域规则**
插槽内容在父组件作用域中编译,可访问父组件数据但不能直接访问子组件数据。这是 Vue 模板编译的基本规则,插槽内的变量引用遵循词法作用域原则。

**考点3: 作用域插槽实现原理**
作用域插槽通过函数回调模式实现。子组件渲染时调用插槽函数并传入数据作为参数,父组件通过 `v-slot="slotProps"` 定义接收参数的函数体,从而在父组件中访问子组件数据。本质是子组件调用父组件提供的渲染函数。

**考点4: Vue 3 统一语法**
Vue 3 使用 `v-slot` 指令统一具名插槽和作用域插槽,可简写为 `#`。所有插槽(包括默认插槽)都存在 `$slots` 对象中作为函数,取消了 Vue 2 的 `$scopedSlots`。

**考点5: Slot vs Props 区别**
Props 传递数据(配置/状态),Slot 传递 UI 片段(外观/结构)。Props 决定组件行为,Slot 决定组件显示内容。选择原则:传数据用 Props,传 HTML/组件用 Slot。


#### 10个技术原理题目

1.  **问题**：请用你自己的话解释一下 Vue 插槽的本质是什么？它解决了什么问题？
    *   **答案**：插槽的本质是一种**内容分发机制**，是父组件向子组件指定位置传递 UI 片段的一种方式。它解决了**组件复用性和灵活性**的核心问题。通过插槽，我们可以将组件的通用结构和可变内容分离开，让一个通用组件（如弹窗、卡片）能承载不同的、由父组件定义的业务内容，而无需修改组件自身代码。

2.  **问题**：当父组件的模板被编译时，插槽内容是在父组件作用域中编译还是在子组件作用域中编译？请举例说明。
    *   **答案**：插槽内容是在**父组件作用域**中编译的。这意味着插槽内容可以访问父组件的 `data`、`computed` 属性和方法，但不能直接访问子组件的数据。
    *   *举例*：
        ```html
        <!-- 父组件 -->
        <template>
          <MyComponent>{{ parentMessage }}</MyComponent>
        </template>
        <script>export default { data: () => ({ parentMessage: 'Hello' }) };</script>

        <!-- MyComponent.vue -->
        <template><slot></slot></template>
        ```
        这里的 `{{ parentMessage }}` 能够被正确渲染，因为它是在父组件的作用域中解析的。

3.  **问题**：既然插槽内容在父组件作用域中编译，那作用域插槽是如何实现让父组件访问到子组件数据的？
    *   **答案**：作用域插槽是一种巧妙的设计。虽然插槽内容的*模板*是在父级编译，但它的*渲染*是由子组件触发的。在子组件的渲染函数中，当它渲染 `<slot>` 时，会调用一个函数，并**将子组件的数据作为参数传递给这个函数**。父组件通过 `v-slot="slotProps"` 语法，实际上是定义了一个接收这些参数的函数，然后在函数体内定义的模板就可以使用 `slotProps` 了。本质上是一种**函数回调**的模式，子组件调用函数，父组件提供函数体。

4.  **问题**：在Vue 3中，`v-slot`指令的语法有哪些简写形式？
    *   **答案**：
        1.  具名插槽 `v-slot:header` 可以简写为 `#header`。
        2.  默认插槽 `v-slot:default` 可以简写为 `#default`。
        3.  如果一个组件只接收默认插槽，`v-slot` 可以直接用在组件标签上，例如 `<MyComponent v-slot="props">...`。但在 Vue 3 中，更推荐始终使用 `<template>` 包装。

5.  **问题**：如果子组件的 `<slot>` 标签内部有内容，这些内容在什么情况下会显示？它叫什么？
    *   **答案**：这些内容叫做**后备内容 (Fallback Content)**。它只会在父组件**没有**为这个插槽提供任何内容时才会显示。如果父组件提供了内容（即使是一个空的`<template #slotname></template>`），后备内容也不会被渲染。

6.  **问题**：`$slots` 和 `$scopedSlots` (Vue 2) 的区别是什么？在 Vue 3 中它们是怎样的？
    *   **答案**：在 Vue 2 中，`$slots` 是一个对象，包含了所有**非作用域插槽**的 VNode 数组。`$scopedSlots` 是一个函数对象，包含了所有插槽（包括作用域和非作用域），它们的值是返回 VNode 的函数。在 Vue 2.6+，`$scopedSlots` 统一了两者。
    *   在 **Vue 3** 中，情况更简单：**只有 `$slots`**。它是一个对象，所有的插槽，无论是普通插槽还是作用域插槽，都作为函数存在于 `$slots` 对象上。调用 `this.$slots.default()` 即可渲染默认插槽。

7.  **问题**：在 `render` 函数或 JSX 中，你将如何使用插槽？
    *   **答案**：在 `render` 函数 (Vue 3) 中，可以通过 `this.$slots` 访问插槽函数。
        ```javascript
        import { h } from 'vue';
        export default {
          render() {
            return h('div', [
              // 渲染 header 插槽，如果不存在则不渲染
              this.$slots.header ? this.$slots.header() : null,
              // 渲染默认插槽，并传入作用域数据
              this.$slots.default ? this.$slots.default({ msg: 'from child' }) : null
            ]);
          }
        }
        ```
        在 JSX 中，语法类似 `this.$slots.default({ msg: 'hi' })`。

8.  **问题**：动态插槽名是如何实现的？
    *   **答案**：可以使用 `v-slot` 的动态参数语法。
        ```html
        <template v-slot:[dynamicSlotName]>
          ...
        </template>
        ```
        这里的 `dynamicSlotName` 是一个在父组件 `data` 或 `setup` 中定义的变量，它的值决定了内容会被分发到哪个插槽。

9.  **问题**：当一个插槽被多次提供内容时（例如，多个 `<template #header>`），Vue会如何处理？
    *   **答案**：Vue 会发出警告，并且通常只会渲染**最后一次**提供的插槽内容。插槽名应该是唯一的。

10. **问题**：`slot` 和 `props` 都可以实现父子组件通信，请谈谈它们的区别和适用场景。
    *   **答案**：
        *   **`props`**: 主要用于**数据传递**。父组件向子组件传递基本类型、对象、数组等数据。它决定了子组件的“配置”和“状态”。
        *   **`slot`**: 主要用于**内容/UI结构传递**。父组件向子组件传递 DOM 片段和组件。它决定了子组件的“外观”和“填充物”。
        *   **适用场景**: 如果你想传递数据来控制子组件的行为（如 `title="My Title"`），用 `props`。如果你想在子组件的某个区域自定义显示复杂的 HTML 结构，甚至另一个组件，用 `slot`。作用域插槽是两者的结合，子组件提供数据，父组件基于这些数据提供 UI。


#### 经典面试题

**题目1: 如何实现一个带图标的按钮组件,图标位置可配置?**

**思路**: 使用具名插槽 `icon` 和默认插槽 `text`,通过 flex 布局控制顺序

**答案**: 
设计具名插槽 `icon` 接收图标组件,默认插槽接收文本。通过 CSS flex 的 `flex-direction` 或条件渲染控制图标在左侧/右侧。提供 `iconPosition` prop 配置位置。

**代码框架**:
```html
<!-- IconButton.vue -->
<template>
  <button class="icon-btn" :class="positionClass">
    <span v-if="iconPosition === 'left'" class="icon-wrapper">
      <slot name="icon"></slot>
    </span>
    <span class="text-wrapper">
      <slot></slot>
    </span>
    <span v-if="iconPosition === 'right'" class="icon-wrapper">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<script setup>
/**
 * 带图标的按钮组件
 * @param {string} iconPosition - 图标位置 'left' | 'right'
 */
defineProps({
  iconPosition: {
    type: String,
    default: 'left',
    validator: (val) => ['left', 'right'].includes(val)
  }
});
</script>

<!-- 使用示例 -->
<IconButton icon-position="left">
  <template #icon>
    <SearchIcon />
  </template>
  搜索
</IconButton>
```

**题目2: Element UI 表格如何自定义列显示不同颜色的状态标签?**

**思路**: 使用 `el-table-column` 的作用域插槽接收行数据,根据状态值条件渲染不同标签

**答案**:
`el-table-column` 提供默认作用域插槽,通过 `#default="{ row }"` 接收当前行数据,根据 `row.status` 值使用 `v-if` 渲染不同 `el-tag` 组件。

**代码框架**:
```html
<el-table :data="tableData">
  <!-- 普通列 -->
  <el-table-column prop="name" label="姓名"></el-table-column>

  <!-- 自定义状态列 -->
  <el-table-column label="状态">
    <template #default="{ row }">
      <!-- 根据状态码显示不同标签 -->
      <el-tag v-if="row.status === 0" type="info">待审核</el-tag>
      <el-tag v-else-if="row.status === 1" type="success">已通过</el-tag>
      <el-tag v-else-if="row.status === 2" type="danger">已驳回</el-tag>
    </template>
  </el-table-column>

  <!-- 操作列 -->
  <el-table-column label="操作">
    <template #default="{ row }">
      <el-button @click="handleEdit(row)">编辑</el-button>
      <el-button @click="handleDelete(row.id)" type="danger">删除</el-button>
    </template>
  </el-table-column>
</el-table>

<script setup>
import { ref } from 'vue';

/**
 * 表格数据
 * @type {Array<{id: number, name: string, status: number}>}
 */
const tableData = ref([
  { id: 1, name: '张三', status: 0 },
  { id: 2, name: '李四', status: 1 },
  { id: 3, name: '王五', status: 2 }
]);

/**
 * 编辑行数据
 * @param {Object} row - 当前行数据
 */
function handleEdit(row) {
  console.log('编辑', row);
}

/**
 * 删除行数据
 * @param {number} id - 行ID
 */
function handleDelete(id) {
  tableData.value = tableData.value.filter(item => item.id !== id);
}
</script>
```

**题目3: 设计一个通用的 Modal 弹窗组件**

**思路**: 使用 `header`/`body`/`footer` 三个具名插槽,支持完全自定义各部分内容

**答案**:
定义三个具名插槽分别对应弹窗三部分,提供默认后备内容。暴露 `visible` prop 控制显示,暴露 `close` 事件供父组件关闭。

**代码框架**:
```html
<!-- Modal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-mask" @click.self="handleClose">
        <div class="modal-container">
          <!-- 头部插槽 -->
          <header class="modal-header">
            <slot name="header">
              <h3>默认标题</h3>
            </slot>
            <button class="close-btn" @click="handleClose">✕</button>
          </header>

          <!-- 内容插槽 -->
          <main class="modal-body">
            <slot>
              <p>默认内容</p>
            </slot>
          </main>

          <!-- 底部插槽 -->
          <footer class="modal-footer">
            <slot name="footer">
              <button @click="handleClose">取消</button>
              <button @click="handleConfirm">确定</button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * 通用弹窗组件
 * @param {boolean} visible - 控制弹窗显示
 */
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'confirm']);

/**
 * 关闭弹窗
 */
function handleClose() {
  emit('update:visible', false);
}

/**
 * 确认操作
 */
function handleConfirm() {
  emit('confirm');
  handleClose();
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  background: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
}
/* 过渡动画省略 */
</style>

<!-- 使用示例 -->
<template>
  <Modal v-model:visible="showModal" @confirm="handleSubmit">
    <template #header>
      <h2>用户注册</h2>
    </template>

    <template #default>
      <el-form :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button @click="showModal = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">注册</el-button>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const form = ref({
  username: '',
  password: ''
});

function handleSubmit() {
  console.log('提交表单', form.value);
  showModal.value = false;
}
</script>
```

**题目4: 如何实现一个可复用的列表组件,不同页面列表项样式完全不同?**

**思路**: 使用作用域插槽,组件负责数据获取和循环,父组件定义每项的渲染方式

**答案**:
组件内部管理数据请求、分页、加载状态,在 `v-for` 循环中通过作用域插槽将 `item` 和 `index` 暴露给父组件,父组件基于这些数据自定义渲染。

**代码框架**:
```html
<!-- DataList.vue -->
<template>
  <div class="data-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 列表项 -->
    <div v-else-if="list.length" class="list-items">
      <div v-for="(item, index) in list" :key="item.id" class="list-item">
        <!-- 作用域插槽:暴露 item 和 index -->
        <slot :item="item" :index="index" :refresh="fetchData">
          <!-- 默认渲染 -->
          <div>{{ item.name }}</div>
        </slot>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty">暂无数据</div>

    <!-- 分页 -->
    <el-pagination
      v-if="total > pageSize"
      v-model:current-page="currentPage"
      :total="total"
      :page-size="pageSize"
      @current-change="fetchData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

/**
 * 通用数据列表组件
 * @param {Function} fetchFunction - 数据获取函数
 * @param {number} pageSize - 每页条数
 */
const props = defineProps({
  fetchFunction: {
    type: Function,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  }
});

const list = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const total = ref(0);

/**
 * 获取列表数据
 */
async function fetchData() {
  loading.value = true;
  try {
    const res = await props.fetchFunction({
      page: currentPage.value,
      pageSize: props.pageSize
    });
    list.value = res.data;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<!-- A页面:卡片样式 -->
<template>
  <DataList :fetch-function="getUserList">
    <template #default="{ item, index }">
      <el-card class="user-card">
        <img :src="item.avatar" alt="avatar" />
        <h3>{{ index + 1 }}. {{ item.name }}</h3>
        <p>{{ item.email }}</p>
        <el-tag>{{ item.role }}</el-tag>
      </el-card>
    </template>
  </DataList>
</template>

<!-- B页面:表格行样式 -->
<template>
  <DataList :fetch-function="getProductList">
    <template #default="{ item, refresh }">
      <div class="product-row">
        <img :src="item.image" width="50" />
        <span>{{ item.name }}</span>
        <span>¥{{ item.price }}</span>
        <el-button @click="buyProduct(item.id, refresh)">购买</el-button>
      </div>
    </template>
  </DataList>
</template>

<script setup>
/**
 * 获取用户列表
 * @param {Object} params - 分页参数
 * @returns {Promise<{data: Array, total: number}>}
 */
async function getUserList(params) {
  const res = await fetch(`/api/users?page=${params.page}`);
  return res.json();
}

/**
 * 获取商品列表
 * @param {Object} params - 分页参数
 * @returns {Promise<{data: Array, total: number}>}
 */
async function getProductList(params) {
  const res = await fetch(`/api/products?page=${params.page}`);
  return res.json();
}

/**
 * 购买商品
 * @param {number} id - 商品ID
 * @param {Function} refresh - 刷新列表函数
 */
async function buyProduct(id, refresh) {
  await fetch(`/api/buy/${id}`, { method: 'POST' });
  refresh(); // 刷新列表
}
</script>
```

**题目5: 实现一个 Tabs 标签页组件,支持图标+文字的标签头**

**思路**: `TabPane` 组件提供 `label` 具名插槽用于自定义标签头,默认插槽放内容

**答案**:
`Tabs` 组件维护 `activeTab` 状态,`TabPane` 通过 `name` prop 标识。使用 `label` 插槽允许父组件自定义标签头样式。

**代码框架**:
```html
<!-- Tabs.vue -->
<template>
  <div class="tabs">
    <!-- 标签头 -->
    <div class="tabs-nav">
      <div
        v-for="pane in panes"
        :key="pane.name"
        class="tab-item"
        :class="{ active: activeTab === pane.name }"
        @click="activeTab = pane.name"
      >
        <!-- 渲染 label 插槽 -->
        <component :is="pane.labelSlot || (() => pane.label)" />
      </div>
    </div>

    <!-- 内容区 -->
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';

/**
 * 标签页组件
 * @param {string} modelValue - 当前激活的标签页
 */
const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);

const activeTab = ref(props.modelValue);
const panes = ref([]);

/**
 * 注册子标签页
 * @param {Object} pane - 标签页配置
 */
function registerPane(pane) {
  panes.value.push(pane);
}

provide('tabs', {
  activeTab,
  registerPane
});

// 监听激活标签变化
watch(activeTab, (val) => {
  emit('update:modelValue', val);
});
</script>

<!-- TabPane.vue -->
<template>
  <div v-show="tabs.activeTab.value === name" class="tab-pane">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject, onMounted, useSlots } from 'vue';

/**
 * 标签页面板
 * @param {string} name - 唯一标识
 * @param {string} label - 默认标签文本
 */
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: String
});

const tabs = inject('tabs');
const slots = useSlots();

onMounted(() => {
  // 注册到父组件
  tabs.registerPane({
    name: props.name,
    label: props.label,
    labelSlot: slots.label // 传递 label 插槽
  });
});
</script>

<!-- 使用示例 -->
<template>
  <Tabs v-model="activeTab">
    <!-- 纯文字标签 -->
    <TabPane name="home" label="首页">
      <h2>首页内容</h2>
    </TabPane>

    <!-- 图标+文字标签 -->
    <TabPane name="user">
      <template #label>
        <UserIcon />
        <span>用户中心</span>
      </template>
      <h2>用户中心内容</h2>
    </TabPane>

    <!-- 带徽章的标签 -->
    <TabPane name="message">
      <template #label>
        <MessageIcon />
        <span>消息</span>
        <el-badge :value="5" />
      </template>
      <h2>消息列表</h2>
    </TabPane>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('home');
</script>
```

