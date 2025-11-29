# DOM 操作核心知识精华

[标签: DOM 操作 节点查询 节点操作 性能优化 DocumentFragment]

---

## 日常学习模式

### 一、节点获取方法

| 方法 | 返回值 | 特性 |
|------|--------|------|
| `getElementById('id')` | 单个元素 | 速度最快 |
| `getElementsByTagName('tag')` | HTMLCollection | 动态集合 |
| `getElementsByClassName('class')` | HTMLCollection | 动态集合 |
| `querySelector('selector')` | 单个元素 | CSS选择器 |
| `querySelectorAll('selector')` | NodeList | 静态集合 |

**动态 vs 静态集合**：HTMLCollection 会随 DOM 变化自动更新；NodeList 是查询时刻的快照，之后 DOM 变化不影响它。

```javascript
/**
 * 节点获取示例
 */
const div = document.getElementById('myDiv');           // 单个元素
const items = document.querySelectorAll('.item');       // 静态 NodeList
const links = document.getElementsByTagName('a');       // 动态 HTMLCollection
```

---

### 二、Property 与 Attribute

| 类型 | 说明 | 操作方式 |
|------|------|----------|
| Property | JS对象属性 | `el.className`, `el.style.width` |
| Attribute | HTML标签属性 | `getAttribute()`, `setAttribute()` |

**关键区别**：Property 反映当前状态，Attribute 反映 HTML 初始定义。

```javascript
/**
 * Property vs Attribute 示例
 * input 初始值为 "hello"，用户改为 "world"
 */
input.value;                    // "world" (当前状态)
input.getAttribute('value');    // "hello" (初始定义)
```

---

### 三、DOM 树遍历

```javascript
/**
 * 遍历关系
 */
el.parentNode;      // 父节点
el.childNodes;      // 所有子节点(含文本、注释节点)
el.children;        // 仅元素子节点(常用)
```

**注意**：HTML 中的换行和空格会被解析为文本节点，使用 `children` 可避免处理这些干扰。

---

### 四、节点操作 CRUD

```javascript
/**
 * 创建节点
 */
const newEl = document.createElement('div');
newEl.textContent = '新内容';

/**
 * 插入节点
 * appendChild: 添加到末尾(已存在则移动)
 * insertBefore: 插入到指定节点前
 */
parent.appendChild(newEl);
parent.insertBefore(newEl, refNode);

/**
 * 删除节点
 */
parent.removeChild(childEl);
// 或 ES6 写法
childEl.remove();

/**
 * 移动节点
 * appendChild 已存在的节点会执行移动
 */
newParent.appendChild(existingEl);
```

---

### 五、性能优化：DocumentFragment

**回流(Reflow)**：DOM 结构/几何属性变化，重新计算布局，成本高。

**重绘(Repaint)**：仅外观变化(颜色等)，成本较低。

```javascript
/**
 * DocumentFragment 批量插入优化
 * 原理: fragment 不在 DOM 树中，操作不触发回流
 * 最终一次性插入，只触发一次回流
 */
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    const li = document.createElement('li');
    li.textContent = `Item ${i}`;
    fragment.appendChild(li);  // 不触发回流
}

list.appendChild(fragment);    // 仅此处触发一次回流
```

---

### 六、类数组转真数组

```javascript
/**
 * HTMLCollection/NodeList 转数组
 */
Array.from(nodeList);           // ES6 推荐
[...nodeList];                  // 展开语法
Array.prototype.slice.call(nodeList);  // ES5
```

---

### 七、使用场景

1. **动态内容渲染**：API 数据渲染为列表/表格
2. **用户交互响应**：购物车增减、待办事项操作
3. **UI 组件实现**：模态框、下拉菜单、选项卡
4. **事件委托**：父元素监听，通过 `event.target` 处理子元素事件

---

## 面试突击模式

### [DOM 操作] 面试速记

#### 30秒电梯演讲

DOM 操作是前端基础，核心包括：节点查询(getElementById/querySelector)、节点 CRUD(createElement/appendChild/removeChild)、属性操作(Property/Attribute)。性能优化关键是减少回流，使用 DocumentFragment 批量插入。

---

#### 高频考点(必背)

**考点1 - 动态集合 vs 静态集合**：`getElementsBy*` 返回动态 HTMLCollection，DOM 变化会自动更新；`querySelectorAll` 返回静态 NodeList，是查询时刻的快照。

**考点2 - Property vs Attribute**：Property 是 JS 对象属性，反映当前状态；Attribute 是 HTML 标签属性，反映初始定义。input.value(Property) 会随用户输入变化，getAttribute('value') 始终是初始值。

**考点3 - childNodes vs children**：childNodes 包含所有节点类型(元素、文本、注释)，children 只包含元素节点。HTML 换行空格会产生文本节点，优先用 children。

**考点4 - appendChild 移动特性**：appendChild 一个已存在的 DOM 节点会执行移动操作而非复制，节点只能存在于一个位置。

**考点5 - DocumentFragment 优化**：批量插入时先添加到 fragment(内存中，不触发回流)，最后一次性插入真实 DOM，将 N 次回流优化为 1 次。

---

#### 经典面试题

**题目1：如何删除一个只知道引用的元素？**

思路：节点只能被父节点删除，通过 parentNode 获取父节点

答案：通过 `el.parentNode.removeChild(el)` 删除，或使用 ES6 的 `el.remove()` 方法。

```javascript
/**
 * 删除指定元素
 * @param {HTMLElement} el - 要删除的元素
 */
function removeElement(el) {
    // 方法1: 通过父节点删除
    el.parentNode.removeChild(el);
    // 方法2: ES6 简写
    // el.remove();
}
```

---

**题目2：innerHTML vs createElement 哪个更好？**

思路：从性能和安全两方面分析

答案：createElement + appendChild 更推荐。innerHTML 有 XSS 风险(用户输入可能注入恶意脚本)，且会销毁内部元素的事件监听器。createElement 配合 textContent 赋值是安全的。

```javascript
/**
 * 安全创建元素示例
 * @param {string} userInput - 用户输入内容
 */
function safeCreate(userInput) {
    const p = document.createElement('p');
    // textContent 会转义特殊字符，防止 XSS
    p.textContent = userInput;
    return p;
}
```

---

**题目3：如何在指定元素前插入新元素？**

思路：使用 insertBefore API

答案：`parentNode.insertBefore(newNode, refNode)`

```javascript
/**
 * 在参考节点前插入新节点
 * @param {HTMLElement} newNode - 新节点
 * @param {HTMLElement} refNode - 参考节点
 */
function insertBefore(newNode, refNode) {
    refNode.parentNode.insertBefore(newNode, refNode);
}
```

---

**题目4：如何高效批量添加 1000 个列表项？**

思路：使用 DocumentFragment 减少回流

答案：创建 fragment，循环中将元素添加到 fragment，最后一次性插入 DOM。

```javascript
/**
 * 高效批量添加元素
 * @param {HTMLElement} parent - 父容器
 * @param {number} count - 添加数量
 */
function batchAppend(parent, count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const li = document.createElement('li');
        li.textContent = `Item ${i}`;
        fragment.appendChild(li);  // 不触发回流
    }
    parent.appendChild(fragment);  // 仅一次回流
}
```

---

**题目5：事件委托如何实现？**

思路：父元素监听，通过 event.target 判断实际触发元素

答案：将事件绑定到父元素，利用事件冒泡，通过 event.target 或 closest() 找到目标元素。

```javascript
/**
 * 事件委托示例 - 删除列表项
 * @param {string} listId - 列表容器ID
 */
function setupDelegation(listId) {
    const list = document.getElementById(listId);
    list.addEventListener('click', (e) => {
        // 判断点击的是否是删除按钮
        if (e.target.classList.contains('delete-btn')) {
            // 找到对应的 li 并删除
            const li = e.target.closest('li');
            li.remove();
        }
    });
}
```

---

**题目6：HTMLCollection/NodeList 如何使用 map/filter？**

思路：类数组没有数组方法，需先转换

答案：使用 `Array.from()` 或展开语法 `[...]` 转为真数组。

```javascript
/**
 * 类数组转换并使用数组方法
 */
const items = document.querySelectorAll('.item');
// 转换后使用 filter
const activeItems = Array.from(items).filter(
    item => item.classList.contains('active')
);
```

---

**题目7：document.readyState 有什么用？**

思路：描述文档加载状态

答案：三个值：`loading`(加载中)、`interactive`(DOM 解析完成，可操作 DOM)、`complete`(所有资源加载完成)。可用于判断 DOM 是否可安全操作。

```javascript
/**
 * 检查 DOM 是否就绪
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();  // DOM 已就绪，直接执行
}
```

---

**题目8：移动节点后事件监听器还有效吗？**

思路：appendChild 移动保留所有附加数据

答案：有效。appendChild 移动节点时，节点的属性、事件监听器等都会完整保留。

---

**题目9：如何实现元素在两个容器间切换？**

思路：判断当前父节点，appendChild 到另一个容器

答案：检查 parentNode，使用 appendChild 移动到目标容器。

```javascript
/**
 * 元素在两容器间切换
 * @param {HTMLElement} el - 要切换的元素
 * @param {HTMLElement} container1 - 容器1
 * @param {HTMLElement} container2 - 容器2
 */
function toggleContainer(el, container1, container2) {
    if (el.parentNode === container1) {
        container2.appendChild(el);
    } else {
        container1.appendChild(el);
    }
}
```

---

**题目10：封装一个高效批量插入函数**

思路：封装 DocumentFragment 最佳实践

答案：接收父元素和子元素数组，内部使用 fragment 优化。

```javascript
/**
 * 高效批量插入子元素
 * @param {HTMLElement} parent - 父元素
 * @param {HTMLElement[]} children - 子元素数组
 */
function appendEfficiently(parent, children) {
    const fragment = document.createDocumentFragment();
    children.forEach(child => fragment.appendChild(child));
    parent.appendChild(fragment);
}

// 使用示例
const items = ['A', 'B', 'C'].map(text => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
});
appendEfficiently(document.getElementById('list'), items);
```