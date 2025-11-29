# Vue 虚拟DOM 精华学习资料

---

## 📚 日常学习模式

[标签:  虚拟DOM, VNode, Diff算法, 前端性能优化]

### 一、核心概念

#### 1.1 虚拟DOM是什么
虚拟DOM是用JavaScript对象描述真实DOM结构的轻量级表示，是UI在内存中的映射。

```javascript
/**
 * VNode 基础结构示例
 * @typedef {Object} VNode
 * @property {string} tag - 标签名
 * @property {Object} props - 属性对象
 * @property {Array|string} children - 子节点
 */
const vnode = {
  tag: 'div',
  props: { id: 'app', class: 'container' },
  children: [
    { tag: 'h1', props: {}, children: 'Hello World' },
    { tag: 'p', props: {}, children: 'Virtual DOM' }
  ]
}
```

#### 1.2 解决的核心问题
- **性能优化**：通过批量处理和Diff算法减少DOM操作
- **开发体验**：声明式编程，无需手动操作DOM
- **跨平台能力**：抽象层可渲染到不同平台（浏览器/原生/SSR）

---

### 二、核心机制

#### 2.1 VNode创建 - h函数

```javascript
/**
 * 创建虚拟节点
 * @param {string} tag - 标签名
 * @param {Object} props - 属性
 * @param {Array|string} children - 子节点
 * @returns {VNode}
 */
function h(tag, props, children) {
  return {
    tag,
    props: props || {},
    children: Array.isArray(children) ? children : [children],
    el: null // 保存对应的真实DOM引用
  }
}

// 使用示例
const vnode = h('div', { class: 'box' }, [
  h('span', {}, 'Text content')
])
```

#### 2.2 挂载过程 - mount

```javascript
/**
 * 将VNode挂载为真实DOM
 * @param {VNode} vnode - 虚拟节点
 * @param {HTMLElement} container - 挂载容器
 */
function mount(vnode, container) {
  // 1. 创建真实元素
  const el = document.createElement(vnode.tag)
  vnode.el = el // 保存引用

  // 2. 设置属性
  if (vnode.props) {
    for (const key in vnode.props) {
      el.setAttribute(key, vnode.props[key])
    }
  }

  // 3. 处理子节点
  if (vnode.children) {
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children
    } else {
      vnode.children.forEach(child => mount(child, el))
    }
  }

  // 4. 挂载到容器
  container.appendChild(el)
}
```

#### 2.3 更新过程 - patch

```javascript
/**
 * 对比并更新VNode
 * @param {VNode} n1 - 旧VNode
 * @param {VNode} n2 - 新VNode
 */
function patch(n1, n2) {
  const el = n2.el = n1.el

  // 标签不同 → 直接替换
  if (n1.tag !== n2.tag) {
    const parent = el.parentElement
    parent.removeChild(el)
    mount(n2, parent)
    return
  }

  // 更新属性
  const oldProps = n1.props || {}
  const newProps = n2.props || {}

  // 添加/更新新属性
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      el.setAttribute(key, newProps[key])
    }
  }

  // 移除旧属性
  for (const key in oldProps) {
    if (!(key in newProps)) {
      el.removeAttribute(key)
    }
  }

  // 更新子节点
  const oldChildren = n1.children
  const newChildren = n2.children

  if (typeof newChildren === 'string') {
    if (newChildren !== oldChildren) {
      el.textContent = newChildren
    }
  } else {
    if (typeof oldChildren === 'string') {
      el.innerHTML = ''
      newChildren.forEach(child => mount(child, el))
    } else {
      // 子节点都是数组 - 简化处理
      const commonLength = Math.min(oldChildren.length, newChildren.length)
      for (let i = 0; i < commonLength; i++) {
        patch(oldChildren[i], newChildren[i])
      }
    
      if (newChildren.length > oldChildren.length) {
        newChildren.slice(oldChildren.length).forEach(child => mount(child, el))
      } else if (oldChildren.length > newChildren.length) {
        oldChildren.slice(newChildren.length).forEach(child => el.removeChild(child.el))
      }
    }
  }
}
```

---

### 三、Diff算法策略

#### 3.1 核心原则
- **同层比较**：只比较同一层级节点，不跨层级
- **类型判断**：tag或key不同直接替换，不继续比较子节点
- **key优化**：通过key识别节点身份，实现高效移动/复用

#### 3.2 双端比较流程
```javascript
/**
 * 双端Diff简化示例（Vue 2策略）
 * 同时从新旧列表两端开始比较
 */
function patchChildren(oldChildren, newChildren, parent) {
  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 1. 头头比较
    if (sameVNode(oldChildren[oldStartIdx], newChildren[newStartIdx])) {
      patch(oldChildren[oldStartIdx], newChildren[newStartIdx])
      oldStartIdx++
      newStartIdx++
    }
    // 2. 尾尾比较
    else if (sameVNode(oldChildren[oldEndIdx], newChildren[newEndIdx])) {
      patch(oldChildren[oldEndIdx], newChildren[newEndIdx])
      oldEndIdx--
      newEndIdx--
    }
    // 3. 头尾比较
    else if (sameVNode(oldChildren[oldStartIdx], newChildren[newEndIdx])) {
      patch(oldChildren[oldStartIdx], newChildren[newEndIdx])
      // 移动DOM到末尾
      parent.insertBefore(oldChildren[oldStartIdx].el, oldChildren[oldEndIdx].el.nextSibling)
      oldStartIdx++
      newEndIdx--
    }
    // 4. 尾头比较
    else if (sameVNode(oldChildren[oldEndIdx], newChildren[newStartIdx])) {
      patch(oldChildren[oldEndIdx], newChildren[newStartIdx])
      // 移动DOM到开头
      parent.insertBefore(oldChildren[oldEndIdx].el, oldChildren[oldStartIdx].el)
      oldEndIdx--
      newStartIdx++
    }
    // 5. 乱序处理 - 通过key查找
    else {
      // 创建key到index的映射
      // 查找可复用节点或创建新节点
    }
  }

  // 处理剩余节点
}
```

---

### 四、实际应用场景

#### 4.1 Vue 3 使用方式

```javascript
import { h, render } from 'vue'

// 创建VNode
const vnode = h('div', { class: 'app' }, [
  h('h1', {}, 'Title'),
  h('p', { style: 'color: red' }, 'Content')
])

// 渲染到DOM
const container = document.querySelector('#app')
render(vnode, container)

// 更新
const newVNode = h('div', { class: 'app active' }, [
  h('h1', {}, 'New Title'),
  h('ul', {}, [
    h('li', {}, 'Item 1'),
    h('li', {}, 'Item 2')
  ])
])
render(newVNode, container) // 自动执行patch
```

#### 4.2 列表渲染最佳实践

```vue
<template>
  <!-- ✅ 正确：使用唯一稳定的key -->
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>

  <!-- ❌ 错误：使用index作为key -->
  <div v-for="(item, index) in list" :key="index">
    {{ item.name }}
  </div>
</template>

<script setup>
/**
 * key的作用：
 * 1. 帮助Diff算法识别节点身份
 * 2. 列表顺序变化时复用DOM而非重建
 * 3. 避免就地更新导致的状态错误
 */
const list = ref([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' }
])
</script>
```

#### 4.3 动态组件渲染

```javascript
/**
 * 根据配置动态生成表单
 */
import { h, resolveComponent } from 'vue'

const formConfig = [
  { type: 'input', props: { placeholder: 'Name' } },
  { type: 'select', props: { options: ['A', 'B'] } }
]

const componentMap = {
  input: 'el-input',
  select: 'el-select'
}

function renderForm() {
  return h('form', {}, formConfig.map(field => {
    const Component = resolveComponent(componentMap[field.type])
    return h(Component, field.props)
  }))
}
```

---

### 五、性能优化要点

#### 5.1 Vue 3的优化特性
- **Patch Flags**：编译时标记动态内容，靶向更新
- **Block Tree**：收集动态节点，跳过静态内容
- **静态提升**：静态VNode只创建一次

```javascript
// 编译前
<div>
  <p>Static text</p>
  <p>{{ dynamic }}</p>
</div>

// 编译后伪代码
const hoisted = h('p', {}, 'Static text') // 静态提升

function render() {
  return h('div', {}, [
    hoisted, // 复用
    h('p', { patchFlag: 1 /* TEXT */ }, ctx.dynamic) // 标记
  ])
}
```

#### 5.2 v-if vs v-show的差异
```vue
<!-- v-if: 条件为false时不创建VNode -->
<div v-if="show">Content</div>

<!-- v-show: 始终创建VNode，通过display控制 -->
<div v-show="show">Content</div>
```

**使用建议**：
- 频繁切换 → `v-show`（切换开销小）
- 很少切换 → `v-if`（初始渲染开销小）

---

### 六、跨平台能力

```javascript
/**
 * 渲染器设计模式
 * 通过不同的渲染器将VNode渲染到不同平台
 */

// 浏览器渲染器
const browserRenderer = {
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent) {
    parent.appendChild(el)
  }
}

// SSR渲染器
const ssrRenderer = {
  createElement(tag) {
    return { tag, children: [] }
  },
  setElementText(el, text) {
    el.children.push(text)
  },
  insert(el, parent) {
    parent.children.push(el)
  },
  serialize(vnode) {
    return `<${vnode.tag}>${vnode.children.join('')}</${vnode.tag}>`
  }
}
```

---

## 🚀 面试突击模式

### 30秒电梯演讲
虚拟DOM是用轻量级JavaScript对象描述UI结构的技术。通过在内存中对比新旧虚拟DOM树（Diff算法），计算出最小DOM操作集并批量更新，从而提升性能。它提供了性能下限保证、跨平台能力和更好的开发体验。

---

### 高频考点（必背）

**考点1：虚拟DOM的本质和优势**
虚拟DOM本质是UI的JavaScript对象表示。优势：①通过Diff+Patch减少DOM操作提供性能下限保证；②抽象层使跨平台渲染成为可能；③声明式编程提升开发效率。但并非绝对比手动操作快，优势在于大规模更新场景下的稳定性能。

**考点2：Diff算法核心策略**
采用同层比较策略，时间复杂度O(n)。核心流程：①树级别比对（tag/key不同直接替换）；②元素级别比对（更新props）；③列表级别比对（通过key识别节点复用/移动/新增/删除）。Vue 2使用双端比较，Vue 3引入最长递增子序列优化。

**考点3：key的作用机制**
key为列表节点提供唯一身份标识。作用：①帮助Diff算法精确识别节点对应关系；②节点位置变化时复用DOM元素而非销毁重建；③避免就地更新导致的状态错乱。必须使用稳定唯一的值（如id），不能用index。

**考点4：Vue 3的虚拟DOM优化**
引入Patch Flags（编译时标记动态内容）和Block Tree（收集动态节点）。编译器分析模板后为VNode打标记，运行时只diff标记的动态部分，跳过静态内容。相比Vue 2全量递归diff，实现了靶向更新，性能大幅提升。

**考点5：mount和patch的区别**
mount是首次渲染，将VNode递归转换为真实DOM并插入页面。patch是更新渲染，对比新旧VNode差异，执行最小化DOM操作。mount创建全新DOM树，patch复用已有DOM并修改。

---

### 经典面试题

#### 题目1: 什么是虚拟DOM？它解决了什么问题？

**思路**：从定义、问题、优势三个层面回答

**答案**：
虚拟DOM是用JavaScript对象描述真实DOM结构的技术方案。它包含tag、props、children等关键信息，是真实DOM的轻量级内存表示。

解决的核心问题：
1. **性能问题**：频繁直接操作DOM代价高昂，会触发重排重绘。虚拟DOM通过Diff算法批量计算最小变更集，减少DOM操作次数
2. **开发效率**：从命令式DOM操作转向声明式UI编程，开发者只需关注状态变化
3. **跨平台能力**：抽象的JS对象可渲染到不同目标（浏览器/SSR/Native）

需要注意，虚拟DOM并非绝对比原生DOM快，它的价值在于提供性能下限保证和更好的工程化能力。

**代码示例**：
```javascript
/**
 * 虚拟DOM基本结构
 */
const vnode = {
  tag: 'div',              // 标签名
  props: { class: 'box' }, // 属性
  children: [              // 子节点
    { tag: 'span', props: {}, children: 'Hello' }
  ],
  el: null                 // 对应的真实DOM引用
}
```

---


#### 题目3: 列表渲染为什么需要key？不使用key会有什么问题?

**思路**：从Diff算法原理和具体场景说明key的必要性

**答案**：
key为列表节点提供唯一身份标识，是Diff算法高效比对的关键。

**作用机制**：
1. 无key时采用"就地复用"策略，按顺序比对新旧节点
2. 有key时通过key映射关系，精确识别节点的新增/删除/移动

**不使用key的问题**：
1. 节点位置变化时无法识别，导致不必要的DOM销毁重建
2. 带状态的组件（如input）可能出现状态混乱
3. 列表更新性能差，无法复用已有DOM

**代码示例**：
```javascript
/**
 * 场景：列表反转
 * 旧: [A, B, C]
 * 新: [C, B, A]
 */

// ❌ 无key - 就地更新,修改所有内容
// diff认为: 第一个节点内容从A改成C,第三个从C改成A
// 结果: 更新所有3个节点的内容

// ✅ 有key - 识别移动,复用DOM
// diff通过key识别: key=C的节点移到前面, key=A的节点移到后面
// 结果: 只执行2次DOM移动操作,内容无需改动

/**
 * Vue模板示例
 */
// ❌ 错误示例
<div v-for="(item, index) in list" :key="index">
  {{ item.name }}
</div>
// 问题: 列表顺序变化时index会变,导致key对应节点错误

// ✅ 正确示例
<div v-for="item in list" :key="item.id">
  {{ item.name }}
</div>
// 使用稳定唯一的id作为key

/**
 * 简化的Diff伪代码
 */
function patchKeyedChildren(oldChildren, newChildren) {
  // 创建旧节点key到index的映射
  const oldKeyMap = new Map()
  oldChildren.forEach((child, i) => {
    if (child.key) oldKeyMap.set(child.key, i)
  })

  // 遍历新节点
  newChildren.forEach((newChild, i) => {
    if (newChild.key && oldKeyMap.has(newChild.key)) {
      // 找到可复用节点
      const oldIndex = oldKeyMap.get(newChild.key)
      patch(oldChildren[oldIndex], newChild)
      // 移动DOM到正确位置
    } else {
      // 新增节点
      mount(newChild, container)
    }
  })
}
```

---

#### 题目5: Diff算法的核心策略是什么?

**思路**：同层比较、类型判断、key优化三个层面

**答案**：
Diff算法采用**同层比较**策略,时间复杂度降至O(n)。

**核心策略**：
1. **树级别**：只比较同一层级节点,不跨层级比对
2. **节点级别**：tag或key不同直接替换,相同则继续比对
3. **列表级别**：通过key建立新旧节点映射,识别移动/新增/删除

**Vue 2的双端比较**：
- 同时从列表两端开始比较
- 四种情况：头头、尾尾、头尾、尾头
- 处理常见场景如反转、头尾添加等

**Vue 3的优化**：
- 预处理首尾相同节点
- 中间乱序部分用最长递增子序列算法
- 找出需要移动的最少节点数

**代码示例**：
```javascript
/**
 * 双端比较伪代码
 */
function patchChildren(oldCh, newCh, parent) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newStartIdx = 0
  let newEndIdx = newCh.length - 1

  let oldStartVNode = oldCh[0]
  let oldEndVNode = oldCh[oldEndIdx]
  let newStartVNode = newCh[0]
  let newEndVNode = newCh[newEndIdx]

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 1. 旧头新头比较
    if (sameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode)
      oldStartVNode = oldCh[++oldStartIdx]
      newStartVNode = newCh[++newStartIdx]
    }
    // 2. 旧尾新尾比较
    else if (sameVNode(oldEndVNode, newEndVNode)) {
      patch(oldEndVNode, newEndVNode)
      oldEndVNode = oldCh[--oldEndIdx]
      newEndVNode = newCh[--newEndIdx]
    }
    // 3. 旧头新尾比较 - 节点右移
    else if (sameVNode(oldStartVNode, newEndVNode)) {
      patch(oldStartVNode, newEndVNode)
      parent.insertBefore(
        oldStartVNode.el, 
        oldEndVNode.el.nextSibling
      )
      oldStartVNode = oldCh[++oldStartIdx]
      newEndVNode = newCh[--newEndIdx]
    }
    // 4. 旧尾新头比较 - 节点左移
    else if (sameVNode(oldEndVNode, newStartVNode)) {
      patch(oldEndVNode, newStartVNode)
      parent.insertBefore(
        oldEndVNode.el,
        oldStartVNode.el
      )
      oldEndVNode = oldCh[--oldEndIdx]
      newStartVNode = newCh[++newStartIdx]
    }
    // 5. 乱序处理
    else {
      // 通过key查找可复用节点
    }
  }

  // 处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 新节点有剩余,批量添加
  } else {
    // 旧节点有剩余,批量删除
  }
}
```

---

#### 题目6: v-if和v-show在虚拟DOM层面有什么区别?

**思路**：从VNode创建、DOM操作、性能影响三个角度对比

**答案**：
两者在虚拟DOM层面的处理机制完全不同。

**v-if（条件渲染）**：
- false时不创建VNode,DOM树中无此节点
- true时完整执行VNode创建、mount、生命周期
- 切换开销高,初始渲染开销低
- 适合很少切换的场景

**v-show（条件展示）**：
- 始终创建VNode和DOM节点
- 仅通过修改`display`样式控制显示
- 切换开销低,初始渲染开销高
- 适合频繁切换的场景

