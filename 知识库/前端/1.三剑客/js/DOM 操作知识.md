# DOM 操作核心知识

## 一、DOM 基础概念

DOM（Document Object Model，文档对象模型）是将整个 HTML 文档的每一个标签元素视为一个对象，这个对象下包含了许多的属性和方法，通过操作这些属性或者调用这些方法实现对 HTML 的动态更新，为实现网页特效以及用户交互提供技术支撑。

简言之，DOM 是用来动态修改 HTML 的，其目的是开发网页特效及用户交互。

### DOM 节点类型

节点是文档树的组成部分，**每一个节点都是一个 DOM 对象**，主要分为：

1. **元素节点**：HTML 标签，如 `head`、`div`、`body` 等
2. **属性节点**：HTML 标签中的属性，如 `href`、`class` 属性
3. **文本节点**：HTML 标签的文字内容
4. **根节点**：特指 `html` 标签

### document 对象

`document` 是 JavaScript 内置的专门用于 DOM 的对象，该对象包含了若干的属性和方法，`document` 是学习 DOM 的核心。

```html
<script>
// document 是内置的对象
// console.log(typeof document);

// 1. 通过 document 获取根节点
console.log(document.documentElement); // 对应 html 标签

// 2. 通过 document 获取 body 节点
console.log(document.body); // 对应 body 标签

// 3. 通过 document.write 方法向网页输出内容
document.write('Hello World!');
</script>
```

---

## 二、节点获取方法

| 方法 | 返回值 | 特性 |
|------|--------|------|
| `getElementById('id')` | 单个元素 | 速度最快 |
| `getElementsByTagName('tag')` | HTMLCollection | 动态集合 |
| `getElementsByClassName('class')` | HTMLCollection | 动态集合 |
| `querySelector('selector')` | 单个元素 | CSS选择器 |
| `querySelectorAll('selector')` | NodeList | 静态集合 |

**推荐使用**：
- `querySelector()` - 获取满足条件的第一个元素
- `querySelectorAll()` - 获取满足条件的所有元素（返回伪数组）

```html
<script>
// 节点获取示例
const div = document.getElementById('myDiv');           // 单个元素
const items = document.querySelectorAll('.item');       // 静态 NodeList
const links = document.getElementsByTagName('a');       // 动态 HTMLCollection
</script>
```

---

## 三、Property 与 Attribute

| 类型 | 说明 | 操作方式 |
|------|------|----------|
| Property | JS对象属性 | `el.className`, `el.style.width` |
| Attribute | HTML标签属性 | `getAttribute()`, `setAttribute()` |

**关键区别**：Property 反映当前状态，Attribute 反映 HTML 初始定义。

```html
<script>
// Property vs Attribute 示例
// input 初始值为 "hello"，用户改为 "world"
input.value;                    // "world" (当前状态)
input.getAttribute('value');    // "hello" (初始定义)
</script>
```

---

## 四、DOM 树遍历

```html
<script>
// 遍历关系
el.parentNode;      // 父节点
el.childNodes;      // 所有子节点(含文本、注释节点)
el.children;        // 仅元素子节点(常用)
</script>
```

**注意**：HTML 中的换行和空格会被解析为文本节点，使用 `children` 可避免处理这些干扰。

---

## 五、操作元素内容

通过修改 DOM 的文本内容，动态改变网页的内容。

### 1. innerText

将文本内容添加/更新到任意标签位置，**文本中包含的标签不会被解析。**

```html
<script>
// innerText 将文本内容添加/更新到任意标签位置
const intro = document.querySelector('.intro')
// intro.innerText = '嗨~ 我叫李雷！'
// intro.innerText = '<h4>嗨~ 我叫李雷！</h4>'  // 标签会被当作文本显示
</script>
```

### 2. innerHTML

将文本内容添加/更新到任意标签位置，**文本中包含的标签会被解析。**

```html
<script>
// innerHTML 将文本内容添加/更新到任意标签位置
const intro = document.querySelector('.intro')
intro.innerHTML = '嗨~ 我叫韩梅梅！'
intro.innerHTML = '<h4>嗨~ 我叫韩梅梅！</h4>'  // 标签会被解析
</script>
```

**总结**：如果文本内容中包含 HTML 标签时推荐使用 `innerHTML`，否则建议使用 `innerText` 属性。

---

## 六、操作元素属性

### 1. 常用属性修改

直接通过属性名修改，最简洁的语法：

```html
<script>
// 获取 img 对应的 DOM 元素
const pic = document.querySelector('.pic')
// 修改属性
pic.src = './images/lion.webp'
pic.width = 400;
pic.alt = '图片不见了...'
</script>
```

### 2. 控制样式属性

#### 方式一：通过 style 修改行内样式

通过元素节点获得的 `style` 属性本身的数据类型也是对象，如 `box.style.color`、`box.style.width` 分别用来获取元素节点 CSS 样式的 `color` 和 `width` 的值。

```html
<script>
// 获取 DOM 节点
const box = document.querySelector('.intro')
box.style.color = 'red'
box.style.width = '300px'
// css 属性的 - 连接符与 JavaScript 的 减运算符冲突，所以要改成驼峰法
box.style.backgroundColor = 'pink'
</script>
```

**注意**：CSS 属性中包含字符 `-` 时，要将 `-` 去掉并将其后面的字母改成大写，如 `background-color` 要写成 `box.style.backgroundColor`。

#### 方式二：通过 className 操作类名

如果修改的样式比较多，直接通过 style 属性修改比较繁琐，可以通过 CSS 类名的形式。

```html
<script>
// 获取 DOM 节点
const box = document.querySelector('.intro')
box.className = 'pink'  // 会覆盖原有类名
</script>
```

**注意**：
1. 由于 class 是关键字，所以使用 className 去代替
2. className 是使用新值换旧值，如果需要添加一个类，需要保留之前的类名

#### 方式三：通过 classList 操作类名

为了解决 className 容易覆盖以前的类名，可以通过 classList 方式追加和删除类名。

```html
<script>
// 获取元素
let box = document.querySelector('div')
// add() 添加类
box.classList.add('active')
// remove() 移除类
box.classList.remove('one')
// toggle() 切换类（有则删除，无则添加）
box.classList.toggle('one')
</script>
```

### 3. 操作表单元素属性

表单很多情况也需要修改属性，比如点击眼睛可以看到密码，本质是把表单类型转换为文本框。

- **获取**：`DOM对象.属性名`
- **设置**：`DOM对象.属性名 = 新值`

```html
<script>
// 1. 获取元素
let input = document.querySelector('input')
// 2. 取值或者设置值
input.value = '小米手机'
input.type = 'password'

// 3. 启用按钮
let btn = document.querySelector('button')
btn.disabled = false  // disabled 不可用 = false 可以让按钮启用

// 4. 勾选复选框
let checkbox = document.querySelector('.agree')
checkbox.checked = false
</script>
```

### 4. 自定义属性

**标准属性**：标签天生自带的属性，比如 class、id、title 等，可以直接使用点语法操作，比如：disabled、checked、selected。

**自定义属性**：在 HTML5 中推出了专门的 data-自定义属性

- 在标签上一律以 `data-` 开头
- 在 DOM 对象上一律以 `dataset` 对象方式获取

```html
<script>
// 获取元素 <div data-id="1"> 自定义属性 </div>
let div = document.querySelector('div')
// 获取自定义属性值
console.log(div.dataset.id)
</script>
```

---

## 七、节点操作 CRUD

```html
<script>
// 创建节点
const newEl = document.createElement('div');
newEl.textContent = '新内容';

// 插入节点
// appendChild: 添加到末尾(已存在则移动)
parent.appendChild(newEl);
// insertBefore: 插入到指定节点前
parent.insertBefore(newEl, refNode);

// 删除节点
parent.removeChild(childEl);
// 或 ES6 写法
childEl.remove();

// 移动节点
// appendChild 已存在的节点会执行移动
newParent.appendChild(existingEl);
</script>
```

---

## 八、性能优化：DocumentFragment

**回流(Reflow)**：DOM 结构/几何属性变化，重新计算布局，成本高。

**重绘(Repaint)**：仅外观变化(颜色等)，成本较低。

```html
<script>
// DocumentFragment 批量插入优化
// 原理: fragment 不在 DOM 树中，操作不触发回流
// 最终一次性插入，只触发一次回流
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    const li = document.createElement('li');
    li.textContent = `Item ${i}`;
    fragment.appendChild(li);  // 不触发回流
}

list.appendChild(fragment);    // 仅此处触发一次回流
</script>
```

---

## 九、间歇函数（定时器）

`setInterval` 是 JavaScript 中内置的函数，它的作用是间隔固定的时间自动重复执行另一个函数，也叫定时器函数。

```html
<script>
// 1. 定义一个普通函数
function repeat() {
  console.log('不知疲倦的执行下去....')
}

// 2. 使用 setInterval 调用 repeat 函数
// 间隔 1000 毫秒，重复调用 repeat
setInterval(repeat, 1000)
</script>
```
