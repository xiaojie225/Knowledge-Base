# Vue 修饰符 - 完整知识体系

## 📚 日常学习模式

### [标签: Vue修饰符, 事件处理, 表单绑定, v-on, v-model]

---

## 一、核心概念

**定义**: Vue修饰符是附加在指令末尾的特殊后缀(以`.`开头),用于为指令添加特殊行为,简化DOM事件处理和数据绑定。

**语法结构**:
```javascript
// 事件修饰符
@事件名.修饰符="处理函数"

// 表单修饰符
v-model.修饰符="数据"

// 修饰符可链式调用
@click.stop.prevent="handler"
```

---

## 二、表单修饰符(v-model)

### 2.1 .lazy - 延迟更新
**作用**: 将数据同步时机从`input`事件改为`change`事件(失焦/回车时触发)

```vue
<template>
  <!-- 失焦后才更新username -->
  <input v-model.lazy="username" />
  <p>当前值: {{ username }}</p>
</template>

<script setup>
import { ref } from 'vue'
const username = ref('')
</script>
```

**使用场景**:
- 搜索框(避免每次输入都触发请求)
- 表单验证(等用户输入完成后再验证)
- 实时计算成本较高的场景

---

### 2.2 .trim - 去除空格
**作用**: 自动过滤输入内容首尾的空白字符

```vue
<template>
  <input v-model.trim="email" placeholder="输入邮箱" />
  <p>实际值: "{{ email }}"</p>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
</script>
```

**使用场景**:
- 用户名/密码输入(防止误输空格)
- 邮箱地址输入
- 任何不允许前后空格的字段

---

### 2.3 .number - 类型转换
**作用**: 通过`parseFloat()`将输入值转为数字类型

```vue
<template>
  <input v-model.number="age" type="number" />
  <p>值: {{ age }}, 类型: {{ typeof age }}</p>
</template>

<script setup>
import { ref } from 'vue'
const age = ref(0)
</script>
```

**使用场景**:
- 年龄/数量/价格等数值输入
- 与后端API交互(需要数字类型)
- 数学计算场景

**注意事项**:
- 无法转换时返回原字符串
- 建议配合`type="number"`使用

---

## 三、事件修饰符(v-on)

### 3.1 .stop - 阻止冒泡
**作用**: 调用`event.stopPropagation()`,阻止事件向父元素传播

```vue
<template>
  <div @click="outerClick" class="outer">
    外层容器
    <!-- 点击按钮不会触发外层div的事件 -->
    <button @click.stop="innerClick">点我</button>
  </div>
</template>

<script setup>
const outerClick = () => console.log('外层点击')
const innerClick = () => console.log('内层点击')
</script>
```

**使用场景**:
- 列表项中的删除按钮
- 模态框内的按钮
- 嵌套可点击区域

---

### 3.2 .prevent - 阻止默认行为
**作用**: 调用`event.preventDefault()`,阻止元素的默认行为

```vue
<template>
  <!-- 阻止链接跳转 -->
  <a href="https://example.com" @click.prevent="handleClick">
    自定义跳转
  </a>

  <!-- 阻止表单提交 -->
  <form @submit.prevent="customSubmit">
    <button type="submit">提交</button>
  </form>
</template>

<script setup>
const handleClick = () => {
  console.log('自定义逻辑')
}

const customSubmit = () => {
  console.log('自定义提交逻辑')
}
</script>
```

**使用场景**:
- 表单验证后手动提交
- 自定义链接跳转行为
- 阻止右键菜单(`@contextmenu.prevent`)

---

### 3.3 .self - 仅自身触发
**作用**: 只有当`event.target`是当前元素自身时才触发

```vue
<template>
  <!-- 点击遮罩层关闭,点击内容区不关闭 -->
  <div class="modal-mask" @click.self="closeModal">
    <div class="modal-content">
      <p>模态框内容</p>
      <button @click="closeModal">关闭</button>
    </div>
  </div>
</template>

<script setup>
const closeModal = () => {
  console.log('关闭模态框')
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

**使用场景**:
- 模态框遮罩点击关闭
- 容器点击选中,内部元素点击不选中
- 区分直接点击和冒泡点击

**与.stop区别**:
- `.self`: 不阻止冒泡,但有条件执行
- `.stop`: 完全阻止冒泡

---

### 3.4 .once - 仅触发一次
**作用**: 事件监听器最多触发一次,触发后自动移除

```vue
<template>
  <!-- 优惠券只能领取一次 -->
  <button @click.once="claimCoupon">
    领取优惠券
  </button>

  <!-- 新手引导只显示一次 -->
  <div @mouseenter.once="showTip">
    首次悬停显示提示
  </div>
</template>

<script setup>
const claimCoupon = () => {
  console.log('优惠券已领取')
}

const showTip = () => {
  console.log('显示新手提示')
}
</script>
```

**使用场景**:
- 一次性优惠券/活动
- 新手引导提示
- 防止重复提交

---

### 3.5 .capture - 捕获阶段触发
**作用**: 在事件捕获阶段(从外到内)触发,而非默认的冒泡阶段

```vue
<template>
  <div @click.capture="level1">
    Level 1
    <div @click.capture="level2">
      Level 2
      <div @click="level3">
        Level 3 (点我)
      </div>
    </div>
  </div>
</template>

<script setup>
// 点击Level 3时,输出顺序: L1 -> L2 -> L3
const level1 = () => console.log('L1 (捕获)')
const level2 = () => console.log('L2 (捕获)')
const level3 = () => console.log('L3 (冒泡)')
</script>
```

**使用场景**:
- 全局事件拦截
- 权限控制(在子元素处理前拦截)
- 事件代理优化

---

### 3.6 .passive - 性能优化
**作用**: 告知浏览器不会调用`preventDefault()`,优化滚动性能

```vue
<template>
  <!-- 移动端滚动优化 -->
  <div 
    @touchstart.passive="handleTouch"
    @wheel.passive="handleWheel"
    class="scroll-container"
  >
    长内容...
  </div>
</template>

<script setup>
const handleTouch = (e) => {
  // 不能使用 e.preventDefault()
  console.log('触摸开始')
}

const handleWheel = (e) => {
  console.log('滚动中')
}
</script>
```

**使用场景**:
- 移动端触摸/滚动事件
- 高频触发的事件(`mousemove`, `wheel`)
- 性能优化场景

**注意事项**:
- 不能与`.prevent`同时使用
- 违反承诺会产生控制台警告

---

## 四、鼠标修饰符

```vue
<template>
  <div class="mouse-area"
    @click.left="leftClick"
    @click.right.prevent="rightClick"
    @click.middle="middleClick"
  >
    尝试不同鼠标按键
  </div>
</template>

<script setup>
const leftClick = () => console.log('左键点击')
const rightClick = () => console.log('右键点击(阻止菜单)')
const middleClick = () => console.log('中键点击')
</script>
```

**可用修饰符**:
- `.left` - 鼠标左键
- `.right` - 鼠标右键
- `.middle` - 鼠标中键

---

## 五、键盘修饰符

### 5.1 按键别名

```vue
<template>
  <!-- 单个按键 -->
  <input @keyup.enter="submit" placeholder="按Enter提交" />
  <input @keyup.delete="clear" placeholder="按Delete清空" />
  <input @keyup.esc="cancel" placeholder="按Esc取消" />

  <!-- 组合按键 -->
  <input @keyup.ctrl.s="save" placeholder="Ctrl+S保存" />
  <input @keyup.alt.enter="quickSubmit" placeholder="Alt+Enter快速提交" />
</template>

<script setup>
const submit = () => console.log('提交')
const clear = () => console.log('清空')
const cancel = () => console.log('取消')
const save = (e) => {
  e.preventDefault() // 阻止浏览器保存
  console.log('保存')
}
const quickSubmit = () => console.log('快速提交')
</script>
```

**常用别名**:
- `.enter` - 回车键
- `.tab` - Tab键
- `.delete` - 删除键(Delete和Backspace)
- `.esc` - Esc键
- `.space` - 空格键
- `.up/.down/.left/.right` - 方向键
- `.ctrl/.alt/.shift/.meta` - 修饰键

### 5.2 系统修饰键

```vue
<template>
  <!-- 精确修饰符:必须只按指定的键 -->
  <button @click.ctrl.exact="onCtrlClick">
    仅Ctrl+点击触发
  </button>

  <!-- 非修饰键点击 -->
  <button @click.exact="onExactClick">
    不按任何修饰键时触发
  </button>
</template>

<script setup>
const onCtrlClick = () => console.log('Ctrl+点击')
const onExactClick = () => console.log('纯点击')
</script>
```

---

## 六、v-model参数(Vue 3)

**作用**: 替代Vue 2的`.sync`修饰符,实现多个数据的双向绑定

### 6.1 基础用法

```vue
<!-- 父组件 ParentComponent.vue -->
<template>
  <ChildComponent 
    v-model:title="pageTitle"
    v-model:content="pageContent"
  />
  <p>标题: {{ pageTitle }}</p>
  <p>内容: {{ pageContent }}</p>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const pageTitle = ref('默认标题')
const pageContent = ref('默认内容')
</script>
```

```vue
<!-- 子组件 ChildComponent.vue -->
<template>
  <div>
    <input 
      :value="title"
      @input="$emit('update:title', $event.target.value)"
      placeholder="编辑标题"
    />
    <textarea
      :value="content"
      @input="$emit('update:content', $event.target.value)"
      placeholder="编辑内容"
    />
  </div>
</template>

<script setup>
/**
 * 定义props - 接收父组件传递的数据
 */
defineProps({
  title: String,
  content: String
})

/**
 * 定义emits - 声明要触发的事件
 */
defineEmits(['update:title', 'update:content'])
</script>
```

### 6.2 与Vue 2的对比

```javascript
// Vue 2写法
<Child :title.sync="pageTitle" />

// Vue 3写法(推荐)
<Child v-model:title="pageTitle" />
```

---

## 七、修饰符组合使用

### 7.1 链式调用顺序

```vue
<template>
  <!-- 先阻止默认,再检查是否自身触发 -->
  <div @click.prevent.self="handler1">
    场景1: 所有点击都阻止默认,但只有点击自身才执行
  </div>

  <!-- 先检查是否自身,再阻止默认 -->
  <div @click.self.prevent="handler2">
    场景2: 只有点击自身时才阻止默认并执行
  </div>

  <!-- 阻止冒泡且阻止默认 -->
  <a href="#" @click.stop.prevent="handler3">
    阻止跳转且不触发父元素
  </a>
</template>

<script setup>
const handler1 = () => console.log('场景1触发')
const handler2 = () => console.log('场景2触发')
const handler3 = () => console.log('场景3触发')
</script>
```

**原则**: 修饰符按从左到右的顺序执行

---

## 八、实战示例

### 8.1 防抖搜索框

```vue
<template>
  <div>
    <input 
      v-model.lazy.trim="searchQuery"
      @input="handleSearch"
      placeholder="输入后500ms自动搜索"
    />
    <p>搜索: {{ searchQuery }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'

const searchQuery = ref('')

/**
 * 防抖搜索函数
 * @param {string} query - 搜索关键词
 */
const performSearch = debounce((query) => {
  if (query) {
    console.log(`搜索: ${query}`)
    // 调用API...
  }
}, 500)

// 监听搜索词变化
watch(searchQuery, (newVal) => {
  performSearch(newVal)
})

// 或直接在input事件中使用
const handleSearch = debounce(() => {
  console.log('搜索中...')
}, 500)
</script>
```

### 8.2 模态框组件

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="visible"
        class="modal-mask"
        @click.self="closeModal"
      >
        <div class="modal-content">
          <header>
            <slot name="header">标题</slot>
            <button @click.stop="closeModal">×</button>
          </header>
          <main>
            <slot>内容</slot>
          </main>
          <footer>
            <button @click="closeModal">取消</button>
            <button @click.once="confirm">确认</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

/**
 * 打开模态框
 */
const openModal = () => {
  visible.value = true
}

/**
 * 关闭模态框
 */
const closeModal = () => {
  visible.value = false
}

/**
 * 确认操作
 */
const confirm = () => {
  console.log('已确认')
  closeModal()
}

defineExpose({ openModal, closeModal })
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
```

---

## 九、注意事项

1. **修饰符顺序**: 链式调用时顺序很重要
2. **冲突修饰符**: `.passive`和`.prevent`不能同时使用
3. **性能考虑**: 高频事件使用`.passive`优化
4. **Vue 3变化**: 
   - 移除`.native`修饰符
   - 移除`Vue.config.keyCodes`自定义别名
   - `.sync`改为`v-model`参数
5. **浏览器兼容**: 部分修饰符依赖现代浏览器特性

---

## 十、快速查询表

| 类型 | 修饰符 | 作用 | 使用场景 |
|------|--------|------|----------|
| 表单 | `.lazy` | 失焦更新 | 搜索框、验证 |
| 表单 | `.trim` | 去空格 | 用户名、邮箱 |
| 表单 | `.number` | 转数字 | 年龄、价格 |
| 事件 | `.stop` | 阻止冒泡 | 嵌套点击 |
| 事件 | `.prevent` | 阻止默认 | 表单、链接 |
| 事件 | `.self` | 仅自身 | 模态框遮罩 |
| 事件 | `.once` | 触发一次 | 优惠券领取 |
| 事件 | `.capture` | 捕获阶段 | 事件拦截 |
| 事件 | `.passive` | 性能优化 | 滚动事件 |
| 鼠标 | `.left/.right/.middle` | 鼠标按键 | 右键菜单 |
| 键盘 | `.enter/.esc/.delete` | 按键别名 | 快捷键 |
| 键盘 | `.ctrl/.alt/.shift` | 组合键 | Ctrl+S保存 |

---

# 🎯 面试突击模式

## [Vue修饰符] 面试速记

### 30秒电梯演讲
Vue修饰符是指令的特殊后缀,以`.`开头,用于简化DOM事件处理和数据绑定。分为三大类:表单修饰符(`.lazy/.trim/.number`)控制输入行为,事件修饰符(`.stop/.prevent/.self/.once`)管理事件传播,键盘鼠标修饰符(`.enter/.ctrl`)处理用户交互。Vue 3用`v-model:prop`替代了`.sync`,实现多数据双向绑定。

---

## 高频考点(必背)

**考点1: .stop和.self的区别**
- `.stop`: 调用`stopPropagation()`,完全阻止事件向父元素冒泡
- `.self`: 不阻止冒泡,但仅当`event.target`是元素自身时才执行处理函数
- 使用场景:`.stop`用于防止触发父元素事件,`.self`用于区分直接点击和冒泡触发

**考点2: .lazy的作用**
将`v-model`数据同步从`input`事件改为`change`事件,失焦或回车时才更新数据。适用于搜索框(避免频繁请求)和表单验证(等用户输入完成)。

**考点3: .passive和.prevent的冲突**
`.passive`告知浏览器不会调用`preventDefault()`,用于优化滚动性能。与`.prevent`同时使用会违反承诺,导致`.prevent`失效并产生警告。

**考点4: Vue 3中.sync的替代方案**
Vue 3移除`.sync`,改用`v-model`参数:`v-model:title="pageTitle"`。子组件需emit `update:title`事件。这是对多数据双向绑定的正式化。

**考点5: 修饰符链式调用顺序**
修饰符按从左到右顺序执行。`@click.prevent.self`先阻止所有默认行为再检查是否自身;`@click.self.prevent`仅对自身点击阻止默认行为。

---

## 经典面试题

### 题目1: 如何实现点击模态框遮罩关闭,点击内容区不关闭?

**思路**: 
利用`.self`修饰符判断点击目标是否为遮罩层自身,而非冒泡上来的子元素

**答案**: 
在遮罩层使用`@click.self`绑定关闭函数。点击遮罩层时`event.target`是遮罩层本身,触发关闭;点击内容区时`event.target`是内容区,事件虽然冒泡但不触发处理函数。

**代码框架**:
```vue
<template>
  <div class="modal-mask" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 内容区 -->
      <p>点击我不会关闭弹窗</p>
      <button @click="closeModal">关闭</button>
    </div>
  </div>
</template>

<script setup>
/**
 * 关闭模态框
 * 只有点击遮罩层自身时才会触发
 */
const closeModal = () => {
  console.log('模态框已关闭')
  // 实际项目中更新visible状态
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

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
```

---

### 题目2: 实现一个支持防抖的搜索框组件

**思路**: 
结合`.lazy`延迟更新和`watch`+`debounce`函数,在用户停止输入一段时间后才触发搜索

**答案**: 
使用`v-model.lazy.trim`自动去空格并延迟更新,通过`watch`监听搜索词变化,用`lodash`的`debounce`函数包装API调用,实现500ms防抖。

**代码框架**:
```vue
<template>
  <div class="search-box">
    <!-- .trim去除空格, .lazy减少更新频率 -->
    <input 
      v-model.lazy.trim="searchQuery"
      placeholder="输入关键词搜索..."
      @keyup.enter="immediateSearch"
    />
    <p v-if="loading">搜索中...</p>
    <ul v-else>
      <li v-for="item in results" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'

const searchQuery = ref('')
const results = ref([])
const loading = ref(false)

/**
 * 执行搜索API调用
 * @param {string} query - 搜索关键词
 */
const performSearch = async (query) => {
  if (!query) {
    results.value = []
    return
  }

  loading.value = true
  try {
    // 模拟API调用
    const response = await fetch(`/api/search?q=${query}`)
    results.value = await response.json()
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 防抖搜索函数 - 500ms延迟
 */
const debouncedSearch = debounce(performSearch, 500)

/**
 * 监听搜索词变化,触发防抖搜索
 */
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

/**
 * 按Enter键立即搜索(不防抖)
 */
const immediateSearch = () => {
  debouncedSearch.cancel() // 取消防抖延迟
  performSearch(searchQuery.value)
}
</script>
```

---

