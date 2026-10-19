# 浏览器 API

## 一、 URL 与浏览器导航

### 1.1 URLSearchParams
* **作用**：解析、读取、修改和删除 URL 中的查询字符串（Query String）。
* **场景**：专门处理 `?page=1&type=xxx` 这类参数，通常配合 `window.location.search` 使用。

```javascript
// 解析当前页面 URL 中的查询参数
const urlParams = new URLSearchParams(window.location.search);

// 获取参数（如果不存在返回 null）
const page = urlParams.get('page');

// 设置参数
urlParams.set('key', 'value');

// 删除参数
urlParams.delete('page');
```

---

### 1.2 URL 对象
* **作用**：用于构建、解析和修改完整的 URL。
* **说明**：比传统的字符串拼接更安全，尤其适合操作复杂的路径与查询参数。

```javascript
// 基于当前页面 URL 构建 URL 对象
const currentUrl = new URL(window.location.href);

// 结合 searchParams 修改参数
currentUrl.searchParams.set('page', '2');

// 转换为字符串用于页面跳转
console.log(currentUrl.toString());
```

---

### 1.3 decodeURIComponent()
* **作用**：对 URL 编码后的内容进行解码。
* **场景**：常用于处理 URL 中的中文参数、空格或特殊字符。
```javascript
// 对参数进行URL编码，防止特殊字符导致问题，它将特殊字符（如 `&`, `?`, `#` 等）转换为 UTF-8 编码的转义序列，确保 URL 参数安全传输
const url = 'https://example.com?name=张三&age=18';
const encoded = encodeURIComponent(url);
// 'https%3A%2F%2Fexample.com%3Fname%3D%E5%BC%A0%E4%B8%89%26age%3D18'


// 场景：URL 中包含 title=%E6%A0%87%E9%A2%98
const raw = "title=%E6%A0%87%E9%A2%98";
const val = decodeURIComponent(raw); // 返回 "title=标题"
```

---

### 1.4 location 对象
`location` 对象拆分并保存了 URL 地址的各个组成部分。

#### 核心属性与方法

| 属性/方法 | 说明 |
| :--- | :--- |
| `href` | **属性**，获取完整的 URL 地址；对其赋值时会触发页面跳转 |
| `search` | **属性**，获取地址中携带的参数（即 `?` 后面的部分） |
| `hash` | **属性**，获取地址中的哈希值（即 `#` 后面的部分） |
| `reload()` | **方法**，刷新当前页面。传入 `true` 时表示强制刷新（从服务器重新加载） |

#### 实际应用示例

```html
<body>
  <form>
    <input type="text" name="search"> 
    <button>搜索</button>
  </form>
  <a href="#/music">音乐</a>
  <a href="#/download">下载</a>

  <button class="reload">刷新页面</button>

  <script>
    // 1. 获取并修改 href 实现跳转
    console.log(location.href);
    // location.href = 'https://example.com';

    // 2. 获取 search 和 hash 属性
    console.log(location.search); // 示例："?search=笔记本"
    console.log(location.hash);   // 示例："#/music"

    // 3. reload 方法刷新页面
    const btn = document.querySelector('.reload');
    btn.addEventListener('click', function () {
      location.reload(true); // 传入 true 表示强制刷新 (Ctrl + F5)
    });
  </script>
</body>
```

---

### 1.5 navigator 对象
`navigator` 对象记录了浏览器自身的相关信息，最常用的是通过 `userAgent` 检测浏览器的版本及运行平台。

```javascript
// 检测 userAgent 并在移动端设备上自动跳转到移动版网站
(function () {
  const userAgent = navigator.userAgent;
  // 验证是否为 Android 或 iPhone
  const isAndroid = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/);
  const isIphone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/);

  if (isAndroid || isIphone) {
    location.href = 'http://m.example.com'; // 跳转到移动端站点
  }
})();
```

---

### 1.6 history 对象
`history` 对象主要管理浏览器历史记录，与浏览器地址栏的前进、后退按钮相对应。常见于 OA 办公系统或后台管理系统的内部导航。

```html
<body>
  <button class="back">← 后退</button>
  <button class="forward">前进 →</button>

  <script>
    // 1. 前进
    const forward = document.querySelector('.forward');
    forward.addEventListener('click', function () {
      history.go(1); // 等同于 history.forward()
    });

    // 2. 后退
    const back = document.querySelector('.back');
    back.addEventListener('click', function () {
      history.go(-1); // 等同于 history.back()
    });
  </script>
</body>
```

### 其他

```html

```


---

## 二、 本地存储 (Web Storage)

### 2.1 localStorage 与 sessionStorage 对比

| 特性 | localStorage | sessionStorage |
| :--- | :--- | :--- |
| **生命周期** | 永久保存（除非手动或通过代码清除） | 仅在当前会话（浏览器窗口/标签页）有效，关闭即失效 |
| **存储容量** | 约 5MB | 约 5MB |
| **数据共享** | 同源的多个窗口间共享 | 仅在当前标签页内共享 |
| **常用 API** | `setItem` / `getItem` / `removeItem` | `setItem` / `getItem` / `removeItem` |

```javascript
// sessionStorage 使用示例
sessionStorage.setItem('sessionKey', 'sessionValue');
console.log(sessionStorage.getItem('sessionKey'));
sessionStorage.removeItem('sessionKey');
```

## ：Javascript本地存储的方式有哪些？区别及应用场景？
### 一、方式

`javaScript`本地缓存的方法我们主要讲述以下四种：

- cookie
- sessionStorage
- localStorage
- indexedDB

### cookie

`Cookie`，类型为「小型文本文件」，指某些网站为了辨别用户身份而储存在用户本地终端上的数据。是为了解决 `HTTP `无状态导致的问题

作为一段一般不超过 4KB 的小型文本数据，它由一个名称（Name）、一个值（Value）和其它几个用于控制 `cookie `有效期、安全性、使用范围的可选属性组成

但是`cookie`在每次请求中都会被发送，如果不使用 `HTTPS `并对其加密，其保存的信息很容易被窃取，导致安全风险。举个例子，在一些使用 `cookie `保持登录态的网站上，如果 `cookie `被窃取，他人很容易利用你的 `cookie `来假扮成你登录网站

关于`cookie`常用的属性如下：

- Expires 用于设置 Cookie 的过期时间

```js
Expires=Wed, 21 Oct 2015 07:28:00 GMT
```

- Max-Age 用于设置在 Cookie 失效之前需要经过的秒数（优先级比`Expires`高）

```js
Max-Age=604800
```

- `Domain `指定了 `Cookie` 可以送达的主机名
- `Path `指定了一个 `URL `路径，这个路径必须出现在要请求的资源的路径中才可以发送 `Cookie` 首部

```js
Path=/docs   # /docs/Web/ 下的资源会带 Cookie 首部
```

- 标记为 `Secure `的 `Cookie `只应通过被`HTTPS`协议加密过的请求发送给服务端

通过上述，我们可以看到`cookie`又开始的作用并不是为了缓存而设计出来，只是借用了`cookie`的特性实现缓存

关于`cookie`的使用如下：

```js
document.cookie = '名字=值';
```

关于`cookie`的修改，首先要确定`domain`和`path`属性都是相同的才可以，其中有一个不同得时候都会创建出一个新的`cookie`

```js
Set-Cookie:name=aa; domain=aa.net; path=/  # 服务端设置
document.cookie =name=bb; domain=aa.net; path=/  # 客户端设置
```

最后`cookie`的删除，最常用的方法就是给`cookie`设置一个过期的事件，这样`cookie`过期后会被浏览器删除



### localStorage

`HTML5`新方法，IE8及以上浏览器都兼容

### 特点

- 生命周期：持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的
- 存储的信息在同一域中是共享的
- 当本页操作（新增、修改、删除）了`localStorage`的时候，本页面不会触发`storage`事件,但是别的页面会触发`storage`事件。
- 大小：5M（跟浏览器厂商有关系）
- `localStorage`本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡
- 受同源策略的限制

下面再看看关于`localStorage`的使用

设置

```js
localStorage.setItem('username','cfangxu');
```

获取

```js
localStorage.getItem('username')
```

获取键名

```js
localStorage.key(0) //获取第一个键名
```

删除

```js
localStorage.removeItem('username')
```

一次性清除所有存储

```js
localStorage.clear()
```

`localStorage` 也不是完美的，它有两个缺点：

- 无法像` Cookie `一样设置过期时间
- 只能存入字符串，无法直接存对象

```js
localStorage.setItem('key', {name: 'value'});
console.log(localStorage.getItem('key')); // '[object, Object]'
```

### sessionStorage

`sessionStorage `和 `localStorage `使用方法基本一致，唯一不同的是生命周期，一旦页面（会话）关闭，`sessionStorage` 将会删除数据



### 扩展的前端存储方式

`indexedDB `是一种低级API，用于客户端存储大量结构化数据(包括, 文件/ blobs)。该API使用索引来实现对该数据的高性能搜索

虽然 `Web Storage `对于存储较少量的数据很有用，但对于存储更大量的结构化数据来说，这种方法不太有用。`IndexedDB`提供了一个解决方案

#### 优点：

- 储存量理论上没有上限
- 所有操作都是异步的，相比 `LocalStorage` 同步操作性能更高，尤其是数据量较大时
- 原生支持储存` JS `的对象
- 是个正经的数据库，意味着数据库能干的事它都能干

#### 缺点：

- 操作非常繁琐
- 本身有一定门槛

关于`indexedDB`的使用基本使用步骤如下：

- 打开数据库并且开始一个事务

- 创建一个 `object store`
- 构建一个请求来执行一些数据库操作，像增加或提取数据等。
- 通过监听正确类型的 `DOM` 事件以等待操作完成。
- 在操作结果上进行一些操作（可以在 `request `对象中找到）

关于使用`indexdb`的使用会比较繁琐，大家可以通过使用`Godb.js`库进行缓存，最大化的降低操作难度




## 二、区别

关于`cookie`、`sessionStorage`、`localStorage`三者的区别主要如下：

- 存储大小：` cookie`数据大小不能超过`4k`，`sessionStorage`和`localStorage `虽然也有存储大小的限制，但比`cookie`大得多，可以达到5M或更大

- 有效时间：` localStorage   `存储持久数据，浏览器关闭后数据不丢失除非主动删除数据； `sessionStorage  `数据在当前浏览器窗口关闭后自动删除；` cookie `设置的`cookie`过期时间之前一直有效，即使窗口或浏览器关闭

- 数据与服务器之间的交互方式，`  cookie`的数据会自动的传递到服务器，服务器端也可以写`cookie`到客户端； `sessionStorage`和`localStorage`不会自动把数据发给服务器，仅在本地保存



## 三、应用场景

在了解了上述的前端的缓存方式后，我们可以看看针对不对场景的使用选择：

- 标记用户与跟踪用户行为的情况，推荐使用`cookie`
- 适合长期保存在本地的数据（令牌），推荐使用`localStorage`
- 敏感账号一次性登录，推荐使用`sessionStorage`
- 存储大量数据的情况、在线文档（富文本编辑器）保存编辑历史的情况，推荐使用`indexedDB`



## 相关连接

- https://mp.weixin.qq.com/s/mROjtpoXarN--UDfEMqwhQ
- https://github.com/chenstarx/GoDB.js
---

### 2.2 存储复杂数据类型
> **关键限制**：本地存储（Local/Session Storage）**只能存储字符串**。若要存储对象或数组，必须先将其转换为 JSON 字符串。

#### 转换方法
1. **写入时**：使用 `JSON.stringify(obj)` 将对象转换为 JSON 字符串。
2. **读取时**：使用 `JSON.parse(str)` 将 JSON 字符串还原为 JavaScript 对象。

```html
<body>
  <script>
    const goods = {
      name: '小米',
      price: 1999
    };

    // 1. 存储复杂数据类型：先转换为 JSON 字符串
    localStorage.setItem('goods', JSON.stringify(goods));

    // 2. 获取并还原复杂数据类型：转换为 JS 对象
    const localGoods = localStorage.getItem('goods');
    const goodsObj = JSON.parse(localGoods);
  
    console.log(goodsObj.name); // 输出: "小米"
  </script>
</body>
```

---

## 三、 DOM 事件系统

### 3.1 事件监听
**事件**是用来描述程序行为或状态改变的术语。**一旦行为或状态发生改变，便立即调用绑定的回调函数。**

`addEventListener` 是 DOM 对象添加事件监听的标准方法：
* **参数 1**：事件类型（如 `'click'`）
* **参数 2**：事件触发时的回调函数

```html
<body>
  <h3>事件监听</h3>
  <p id="text">点击下方按钮改变文字颜色。</p>
  <button id="btn">点击变红</button>

  <script>
    const btn = document.querySelector('#btn');

    btn.addEventListener('click', function (e) {
      console.log('事件被触发，事件对象为：', e);
      const text = document.getElementById('text');
      text.style.color = 'red';
    });
  </script>
</body>
```

---

### 3.2 常见事件类型

#### ① 鼠标事件
* `click`：鼠标单击
* `dblclick`：鼠标双击
* `mouseenter`：鼠标移入 DOM 元素
* `mouseleave`：鼠标移出 DOM 元素

#### ② 键盘事件
* `keydown`：键盘按键被按下
* `keyup`：键盘按键被抬起

#### ③ 焦点事件
* `focus`：元素（如输入框）获得焦点
* `blur`：元素失去焦点

#### ④ 文本框输入事件
* `input`：在 `<input>` 或 `<textarea>` 元素的值改变时即时触发

---

### 3.3 事件对象 (Event Object)
当事件被触发时，与之相关的详细信息会被系统封装成一个对象传入回调函数，这个对象就是**事件对象**（常简写为 `e`、`ev` 或 `event`）。

```javascript
const box = document.querySelector('.box');

box.addEventListener('click', function (e) {
  // e 即为事件对象
  console.log(e.type);      // 当前事件的类型 (如 "click")
  console.log(e.clientX);   // 光标相对于浏览器可视窗口的 X 坐标
  console.log(e.clientY);   // 光标相对于浏览器可视窗口的 Y 坐标
  console.log(e.offsetX);   // 光标相对于当前目标元素的 X 偏移量
  console.log(e.offsetY);   // 光标相对于当前目标元素的 Y 偏移量
});
```
> **注**：在事件回调函数内部，也可以直接通过全局变量 `window.event` 获取当前的事件对象。

---

### 3.4 事件流：捕获与冒泡
事件流描述的是事件在页面元素之间传播的顺序。一个完整的事件流会经历两个阶段：
1. **捕获阶段**：自顶向下（从父到子）。
2. **冒泡阶段**：自底向上（从子到父）。默认情况下，所有常规事件都处于**冒泡模式**。

```
     捕获阶段 (Capture)          冒泡阶段 (Bubble)
     Window                      Window
       │                           ▲
       ▼                           │
   Document                    Document
       │                           ▲
       ▼                           │
  HTML <body>                 HTML <body>
       │                           ▲
       ▼                           │
   Target Element ─────────────► Target Element
```

---

### 3.5 阻止冒泡
为了防止子元素的事件触发导致父元素相同事件的连锁响应，需要断开事件流的向上传播。
* **方法**：调用事件对象的 `e.stopPropagation()` 方法。

```javascript
const child = document.querySelector('.child');

child.addEventListener('click', function (e) {
  alert('子元素被点击');
  e.stopPropagation(); // 阻止事件向上冒泡，父级点击事件将不会被触发
});
```

---

### 3.6 事件委托 (Event Delegation)
* **原理**：利用事件冒泡机制，将子元素的事件监听器绑定在其共同的父级（祖先）元素上。
* **优势**：减少事件注册数量，极大地节省内存开销，并能自动支持动态新增的子元素。

```html
<!-- 假设 table 中有 10000 个 button -->
<table>
  <tr><td><button>操作 1</button></td></tr>
  <tr><td><button>操作 2</button></td></tr>
  <!-- ... -->
</table>

<script>
  const table = document.querySelector('table');

  // 仅在父级 table 上绑定一次点击事件
  table.addEventListener('click', function (e) {
    // e.target 指向真正触发点击的那个子元素
    if (e.target.tagName === 'BUTTON') {
      console.log('被点击的按钮文本是:', e.target.textContent);
    }
  });
</script>
```

---

### 3.7 其他核心事件

#### ① 页面加载事件 (`load`)
等待页面所有资源（包括 HTML、CSS、JS、图片及外联资源）全部下载完毕后触发。
```javascript
window.addEventListener('load', function() {
  console.log('页面所有资源加载完毕！');
});
```

#### ② 元素滚动事件 (`scroll`)
当页面或某个可滚动元素发生滚动时持续触发。
```javascript
window.addEventListener('scroll', function() {
  console.log('页面正在滚动，当前滚动距离：', window.scrollY);
});
```

#### ③ 页面尺寸改变事件 (`resize`)
当浏览器窗口大小发生改变时触发。
```javascript
window.addEventListener('resize', function() {
  console.log('当前视口宽度：', window.innerWidth);
});
```

---

## 四、 环境对象与函数基础

### 4.1 环境对象 `this`
环境对象指函数内部的特殊变量 `this`，它代表**当前函数执行时所处的环境**。

> **核心判定规则**：【谁调用该函数，`this` 就指向谁】。

```javascript
function sayHi() {
  console.log(this);
}

const user = {
  name: '张三',
  sayHi: sayHi
};

const person = {
  name: '李四',
  sayHi: sayHi
};

// 1. 全局直接调用：相当于 window.sayHi()，this 指向 window
sayHi(); 

// 2. 作为对象方法调用：this 指向调用它的对象 user
user.sayHi(); // 指向 user

// 3. 作为另一个对象的方法调用：this 指向 person
person.sayHi(); // 指向 person
```

---

### 4.2 回调函数 (Callback)
如果将 **函数 A** 作为参数传递给 **函数 B**，那么 **函数 A** 就是**回调函数**。

```javascript
// 1. 普通回调机制
function foo(arg) {
  if (typeof arg === 'function') {
    arg(); // 执行传入的回调函数
  }
}

function bar() {
  console.log('我是回调函数 bar，我被执行了。');
}

foo(bar); // 传递函数作为参数

// 2. 经典应用：定时器与匿名回调函数
setInterval(function () {
  console.log('每隔1秒执行一次的匿名回调函数');
}, 1000);
```

---

## 五、 常用内置对象与方法

### 5.1 日期对象 (Date)

#### ① 实例化日期对象
```javascript
const defaultDate = new Date(); // 获取当前系统时间
const customDate = new Date('2020-05-01'); // 获取指定时间
```

#### ② 常用实例方法
| 方法名 | 作用 | 返回值范围 |
| :--- | :--- | :--- |
| `getFullYear()` | 获取四位年份 | 4位数字 |
| `getMonth()` | 获取月份 | **0 ~ 11**（使用时需 `+1`）|
| `getDate()` | 获取日（一月中的第几天） | 1 ~ 31 |
| `getDay()` | 获取星期 | 0（周日）~ 6（周六） |
| `getHours()` | 获取小时 | 0 ~ 23 |
| `getMinutes()` | 获取分钟 | 0 ~ 59 |
| `getSeconds()` | 获取秒 | 0 ~ 59 |
| `toLocaleDateString(locale)`| 转换为本地日期字符串 | 视语言环境而定，如 `"2023/12/15"` |

```javascript
const now = new Date();
const dateStr = now.toLocaleDateString('zh-CN'); // 输出格式: "2023/12/15"
```

#### ③ 获取时间戳
时间戳是指自 1970 年 01 月 01 日 00 时 00 分 00 秒起至当前的**毫秒数**。
```javascript
const t1 = new Date().getTime();
const t2 = +new Date(); // 最常用的快速获取方式
const t3 = Date.now();  // HTML5 新增方法
```

---

### 5.2 常用数学方法 (`Math`)
```javascript
// 生成 100 到 1100 之间的随机整数
// Math.random() 生成 [0, 1) 之间的随机小数
// Math.floor() 执行向下取整
Math.floor(seconds / 60); // 向下取整（计算分钟）
Math.round((correct / total) * 100); // 四舍五入（计算得分）
Math.max(0, time - 2); // 取最大值（防止时间为负）

const randomNum = Math.floor(Math.random() * 1000) + 100;
```

---

### 5.3 元素尺寸与位置属性
获取元素自身的实际高宽，其值包含 `width/height` + `padding` + `border`：
* `offsetWidth`：获取元素的实际可视宽度（数值型，不带单位 `px`）
* `offsetHeight`：获取元素的实际可视高度

> **安全提示**：若目标元素当前处于隐藏状态（如 `display: none`），获取到的高宽值将为 `0`。

---

## 六、 正则表达式 (Regular Expression)

### 6.1 基本使用
1. **定义匹配规则**：使用正则字面量 `/表达式/`。
2. **执行匹配检测**：使用 `test()` 方法，若匹配成功返回 `true`，反之返回 `false`。

```javascript
const str = 'web前端开发';
const reg = /web/;

console.log(reg.test(str));        // true
console.log(reg.test('Java开发')); // false
```

---
### 6.2 元字符

#### ① 边界符
用来限定字符出现的位置。

| 边界符 | 说明 |
| :--- | :--- |
| `^` | 表示匹配行首（以特定字符开始） |
| `$` | 表示匹配行尾（以特定字符结束） |
| `^$` | **组合使用**，表示必须精确匹配整个字符串 |

```javascript
const reg = /^web$/; // 精确匹配 "web" 这一单词

console.log(reg.test('web前端')); // false
console.log(reg.test('前端web')); // false
console.log(reg.test('web'));     // true
```

#### ② 量词
用来设定某个模式的重复次数。**注意：逗号左右两侧千万不能写空格！**

| 量词 | 含义 |
| :--- | :--- |
| `*` | 重复 $\ge 0$ 次 |
| `+` | 重复 $\ge 1$ 次 |
| `?` | 重复 $0$ 次或 $1$ 次 |
| `{n}` | 只能精确重复 $n$ 次 |
| `{n,}` | 重复 $\ge n$ 次 |
| `{n,m}` | 重复次数在 $n$ 到 $m$ 次之间（含 $n$ 和 $m$） |

```javascript
const reg = /^w{2,4}$/; // 仅匹配包含 2 到 4 个 "w" 的字符串

console.log(reg.test('w'));     // false
console.log(reg.test('ww'));    // true
console.log(reg.test('www'));   // true
console.log(reg.test('wwwww')); // false
```

#### ③ 字符范围 `[]`
用于限定单个字符的取值范围。

```javascript
const reg1 = /^[abc]$/;     // 匹配 a、b 或 c 中的任意单个字符
const reg2 = /^[a-z]$/;     // 匹配任意单个小写英文字母
const reg3 = /^[a-zA-Z0-9]$/; // 匹配任意单个数字、大小写英文字母

// 用户名注册规范示例：必须是英文字母、数字或下划线，且长度在 6 到 16 位之间
const usernameReg = /^[a-zA-Z0-9_]{6,16}$/;
console.log(usernameReg.test('user_123')); // true

// 取反符号 [^] ：表示不匹配括号内的任何字符
const notLetters = /^[^a-z]$/; // 匹配非小写字母的任意单个字符
console.log(notLetters.test('A')); // true
```

#### ④ 字符类简写
* `\d`：匹配任意数字，等价于 `[0-9]`
* `\D`：匹配任意非数字字符，等价于 `[^0-9]`
* `\w`：匹配任意字母、数字或下划线，等价于 `[a-zA-Z0-9_]`
* `\W`：匹配除字母、数字、下划线之外的字符
* `\s`：匹配空格（包括制表符、换页符等）

---

### 6.3 替换与修饰符
使用 `String.prototype.replace(reg, replacement)` 方法可以高效完成敏感词过滤或文本替换。

#### 修饰符
* `i` (ignore)：匹配时忽略大小写。
* `g` (global)：全局匹配，不只匹配第一个符合条件的项。

```javascript
const text = '欢迎大家学习前端，相信大家一定能学好前端，都成为前端大神';

// 需求：将所有的“前端”一词替换为“web”
// 使用全局修饰符 g 进行全局替换
const result = text.replace(/前端/g, 'web');

console.log(result); 
// 输出: "欢迎大家学习web，相信大家一定能学好web，都成为web大神"

//match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配
var str="The rain in SPAIN stays mainly in the plain"; 
var n=str.match(/ain/g);
console.log(n) // ain,ain,ain
```

### 6.4 正则表达式例子
```javascript
// 1. 创建正则匹配手机号
const phoneRegex = /^1[3-9]\d{9}$/

```

常见的校验规则如下：

| 规则        | 描述                                                  |
| ----------- | ----------------------------------------------------- |
| \           | 转义                                                  |
| ^           | 匹配输入的开始                                        |
| $           | 匹配输入的结束                                        |
| *           | 匹配前一个表达式 0 次或多次                           |
| +           | 匹配前面一个表达式 1 次或者多次。等价于 `{1,}`        |
| ?           | 匹配前面一个表达式 0 次或者 1 次。等价于`{0,1}`       |
| .           | 默认匹配除换行符之外的任何单个字符                    |
| x(?=y)      | 匹配'x'仅仅当'x'后面跟着'y'。这种叫做先行断言         |
| (?<=y)x     | 匹配'x'仅当'x'前面是'y'.这种叫做后行断言              |
| x(?!y)      | 仅仅当'x'后面不跟着'y'时匹配'x'，这被称为正向否定查找 |
| (?<!*y*)*x* | 仅仅当'x'前面不是'y'时匹配'x'，这被称为反向否定查找   |
| x\|y        | 匹配‘x’或者‘y’                                        |
| {n}         | n 是一个正整数，匹配了前面一个字符刚好出现了 n 次     |
| {n,}        | n是一个正整数，匹配前一个字符至少出现了n次            |
| {n,m}       | n 和 m 都是整数。匹配前面的字符至少n次，最多m次       |
| [xyz\]      | 一个字符集合。匹配方括号中的任意字符                  |
| [^xyz\]     | 匹配任何没有包含在方括号中的字符                      |
| \b          | 匹配一个词的边界，例如在字母和空格之间                |
| \B          | 匹配一个非单词边界                                    |
| \d          | 匹配一个数字                                          |
| \D          | 匹配一个非数字字符                                    |
| \f          | 匹配一个换页符                                        |
| \n          | 匹配一个换行符                                        |
| \r          | 匹配一个回车符                                        |
| \s          | 匹配一个空白字符，包括空格、制表符、换页符和换行符    |
| \S          | 匹配一个非空白字符                                    |
| \w          | 匹配一个单字字符（字母、数字或者下划线）              |
| \W          | 匹配一个非单字字符                                    |

### 正则表达式标记

| 标志  | 描述                                  |
| :-- | :---------------------------------- |
| `g` | 全局搜索。                               |
| `i` | 不区分大小写搜索。                           |
| `m` | 多行搜索。                               |
| `s` | 允许 `.` 匹配换行符。                       |
| `u` | 使用`unicode`码的模式进行匹配。                |
| `y` | 执行“粘性(`sticky`)”搜索,匹配从目标字符串的当前位置开始。 |
## 三、匹配方法

正则表达式常被用于某些方法，我们可以分成两类：

- 字符串（str）方法：`match`、`matchAll`、`search`、`replace`、`split`
- 正则对象下（regexp）的方法：`test`、`exec`

| 方法     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| exec     | 一个在字符串中执行查找匹配的RegExp方法，它返回一个数组（未匹配到则返回 null）。 |
| test     | 一个在字符串中测试是否匹配的RegExp方法，它返回 true 或 false。 |
| match    | 一个在字符串中执行查找匹配的String方法，它返回一个数组，在未匹配到时会返回 null。 |
| matchAll | 一个在字符串中执行查找所有匹配的String方法，它返回一个迭代器（iterator）。 |
| search   | 一个在字符串中测试匹配的String方法，它返回匹配到的位置索引，或者在失败时返回-1。 |
| replace  | 一个在字符串中执行查找匹配的String方法，并且使用替换字符串替换掉匹配到的子字符串。 |
| split    | 一个使用正则表达式或者一个固定字符串分隔一个字符串，并将分隔后的子字符串存储到数组中的 `String` 方法。 |

### str.match(regexp)

`str.match(regexp)` 方法在字符串 `str` 中找到匹配 `regexp` 的字符

如果 `regexp` 不带有 `g` 标记，则它以数组的形式返回第一个匹配项，其中包含分组和属性 `index`（匹配项的位置）、`input`（输入字符串，等于 `str`）

```js
let str = "I love JavaScript";

let result = str.match(/Java(Script)/);

console.log( result[0] );     // JavaScript（完全匹配）
console.log( result[1] );     // Script（第一个分组）
console.log( result.length ); // 2

// 其他信息：
console.log( result.index );  // 7（匹配位置）
console.log( result.input );  // I love JavaScript（源字符串）
```

如果 `regexp` 带有 `g` 标记，则它将所有匹配项的数组作为字符串返回，而不包含分组和其他详细信息

```js
let str = "I love JavaScript";

let result = str.match(/Java(Script)/g);

console.log( result[0] ); // JavaScript
console.log( result.length ); // 1
```

如果没有匹配项，则无论是否带有标记 `g` ，都将返回 `null`

```js
let str = "I love JavaScript";

let result = str.match(/HTML/);

console.log(result); // null
```

### str.matchAll(regexp)
返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器

```js
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];

console.log(array[0]);
// expected output: Array ["test1", "e", "st1", "1"]

console.log(array[1]);
// expected output: Array ["test2", "e", "st2", "2"]
```

### str.search(regexp)

返回第一个匹配项的位置，如果未找到，则返回 `-1`

```js
let str = "A drop of ink may make a million think";

console.log( str.search( /ink/i ) ); // 10（第一个匹配位置）
```

这里需要注意的是，`search` 仅查找第一个匹配项

## str.replace(regexp)

替换与正则表达式匹配的子串，并返回替换后的字符串。在不设置全局匹配`g`的时候，只替换第一个匹配成功的字符串片段

```js
const reg1=/javascript/i;
const reg2=/javascript/ig;
console.log('hello Javascript Javascript Javascript'.replace(reg1,'js'));
//hello js Javascript Javascript
console.log('hello Javascript Javascript Javascript'.replace(reg2,'js'));
//hello js js js
```
### str.split(regexp)

使用正则表达式（或子字符串）作为分隔符来分割字符串

```js
console.log('12, 34, 56'.split(/,\s*/)) // 数组 ['12', '34', '56']
```

### regexp.exec(str)

`regexp.exec(str)` 方法返回字符串 `str` 中的 `regexp` 匹配项，与以前的方法不同，它是在正则表达式而不是字符串上调用的

根据正则表达式是否带有标志 `g`，它的行为有所不同

如果没有 `g`，那么 `regexp.exec(str)` 返回的第一个匹配与 `str.match(regexp)` 完全相同

如果有标记 `g`，调用 `regexp.exec(str)` 会返回第一个匹配项，并将紧随其后的位置保存在属性`regexp.lastIndex` 中。 下一次同样的调用会从位置 `regexp.lastIndex` 开始搜索，返回下一个匹配项，并将其后的位置保存在 `regexp.lastIndex` 中

```js
let str = 'More about JavaScript at https://javascript.info';
let regexp = /javascript/ig;

let result;

while (result = regexp.exec(str)) {
  console.log( `Found ${result[0]} at position ${result.index}` );
  // Found JavaScript at position 11
  // Found javascript at position 33
}
```

### regexp.test(str)

查找匹配项，然后返回 `true/false` 表示是否存在

```js
let str = "I love JavaScript";

// 这两个测试相同
console.log( /love/i.test(str) ); // true
```

---
## 七、文件处理

### readFileAsText()
作用：异步读取文件文本内容。

```javascript
/**
 * 异步读取文件内容
 * @param {File} file - 要读取的文件对象
 * @param {string} [encoding='utf-8'] - 字符编码
 * @returns {Promise<string>} 返回文件文本内容
 * @throws {Error} 文件读取失败时抛出错误
 * @example
 * const content = await readFileAsText(file);
 * console.log(content);
 */
function readFileAsText(file, encoding = 'utf-8') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file, encoding);
  });
}
```

### downloadTextFile()
作用：将文本内容下载为本地文件。

```javascript
/**
 * 下载文本内容为文件
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} [mimeType='text/plain'] - MIME 类型
 * @example
 * downloadTextFile('Hello World', 'output.txt');
 */
function downloadTextFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```



### revokePreviewUrls()
作用：统一释放文件预览地址，避免内存泄漏。

```javascript
/**
 * 释放文件项中的预览地址
 * @param {Array<Object>} items - 文件项数组
 */
function revokePreviewUrls(items = []) {
  items.forEach((item) => {
    if (item && item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
}
```


# ：说说你对BOM的理解，常见的BOM对象你了解哪些？

## 一、是什么

`BOM` (Browser Object Model)，浏览器对象模型，提供了独立于内容与浏览器窗口进行交互的对象

其作用就是跟浏览器做一些交互效果,比如如何进行页面的后退，前进，刷新，浏览器的窗口发生变化，滚动条的滚动，以及获取客户的一些信息如：浏览器品牌版本，屏幕分辨率

浏览器的全部内容可以看成`DOM`，整个浏览器可以看成`BOM`。区别如下：

## 二、window

`Bom`的核心对象是`window`，它表示浏览器的一个实例

在浏览器中，`window`对象有双重角色，即是浏览器窗口的一个接口，又是全局对象

因此所有在全局作用域中声明的变量、函数都会变成`window`对象的属性和方法

```js
var name = 'js每日一题';
function lookName(){
  alert(this.name);
}

console.log(window.name);  //js每日一题
lookName();                //js每日一题
window.lookName();         //js每日一题
```

关于窗口控制方法如下：

- `moveBy(x,y)`：从当前位置水平移动窗体x个像素，垂直移动窗体y个像素，x为负数，将向左移动窗体，y为负数，将向上移动窗体
- `moveTo(x,y)`：移动窗体左上角到相对于屏幕左上角的(x,y)点
- `resizeBy(w,h)`：相对窗体当前的大小，宽度调整w个像素，高度调整h个像素。如果参数为负值，将缩小窗体，反之扩大窗体
- `resizeTo(w,h)`：把窗体宽度调整为w个像素，高度调整为h个像素
- `scrollTo(x,y)`：如果有滚动条，将横向滚动条移动到相对于窗体宽度为x个像素的位置，将纵向滚动条移动到相对于窗体高度为y个像素的位置
- `scrollBy(x,y)`： 如果有滚动条，将横向滚动条向左移动x个像素，将纵向滚动条向下移动y个像素

 `window.open()` 既可以导航到一个特定的`url`，也可以打开一个新的浏览器窗口

如果 `window.open()` 传递了第二个参数，且该参数是已有窗口或者框架的名称，那么就会在目标窗口加载第一个参数指定的URL

```js
window.open('htttp://www.vue3js.cn','topFrame')
==> < a href=" " target="topFrame"></ a>
```

`window.open()` 会返回新窗口的引用，也就是新窗口的 `window` 对象

```js
const myWin = window.open('http://www.vue3js.cn','myWin')
```

`window.close()` 仅用于通过 `window.open()` 打开的窗口

新创建的 `window` 对象有一个 `opener` 属性，该属性指向打开他的原始窗口对象

## 三、location

`url`地址如下：

```js
http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents
```

`location`属性描述如下：

| 属性名      | 例子                                                     | 说明                  |
| -------- | ------------------------------------------------------ | ------------------- |
| hash     | "#contents"                                            | utl中#后面的字符，没有则返回空串  |
| host     | www.wrox.com:80                                        | 服务器名称和端口号           |
| hostname | www.wrox.com                                           | 域名，不带端口号            |
| href     | http://www.wrox.com:80/WileyCDA/?q=javascript#contents | 完整url               |
| pathname | "/WileyCDA/"                                           | 服务器下面的文件路径          |
| port     | 80                                                     | url的端口号，没有则为空       |
| protocol | http:                                                  | 使用的协议               |
| search   | ?q=javascript                                          | url的查询字符串，通常为？后面的内容 |

除了 `hash `之外，只要修改` location `的一个属性，就会导致页面重新加载新` URL`

`location.reload()`，此方法可以重新刷新当前页面。这个方法会根据最有效的方式刷新页面，如果页面自上一次请求以来没有改变过，页面就会从浏览器缓存中重新加载

如果要强制从服务器中重新加载，传递一个参数`true`即可


## 四、navigator

`navigator` 对象主要用来获取浏览器的属性，区分浏览器类型。属性较多，且兼容性比较复杂

下表列出了`navigator`对象接口定义的属性和方法：


## 五、screen

保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像素高度


## 六、history

`history`对象主要用来操作浏览器`URL`的历史记录，可以通过参数向前，向后，或者向指定`URL`跳转

常用的属性如下：

- `history.go()`

接收一个整数数字或者字符串参数：向最近的一个记录中包含指定字符串的页面跳转，

```js
history.go('maixaofei.com')
```

当参数为整数数字的时候，正数表示向前跳转指定的页面，负数为向后跳转指定的页面

```js
history.go(3) //向前跳转三个记录
history.go(-1) //向后跳转一个记录
```

- `history.forward()`：向前跳转一个页面
- `history.back()`：向后跳转一个页面
- `history.length`：获取历史记录数









