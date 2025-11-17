# CSS 完整知识库与面试宝典

> 🎯 **适用人群**：前端开发者 | **难度覆盖**：基础→进阶→专家级 | **面试题数量**：120+

---

## 📌 核心概念速览（5分钟版）

**CSS的本质**：层叠样式表（Cascading Style Sheets），用于控制网页视觉呈现的语言

**必须掌握的5大核心**：
1. **选择器与优先级** - 决定样式如何生效
2. **盒模型** - 理解元素尺寸计算的基础
3. **布局系统** - Flexbox/Grid/定位的应用场景
4. **层叠与继承** - 样式冲突的解决机制
5. **渲染性能** - 避免重排重绘的优化策略

---

## 第一章：基础语法与核心机制

### 1.1 选择器系统

#### 【核心知识】
CSS选择器是匹配HTML元素的模式，分为7大类：

| 类型 | 示例 | 优先级权重 |
|------|------|-----------|
| ID选择器 | `#header` | 100 |
| 类选择器 | `.btn` | 10 |
| 属性选择器 | `[type="text"]` | 10 |
| 伪类 | `:hover` | 10 |
| 标签选择器 | `div` | 1 |
| 伪元素 | `::before` | 1 |
| 通配符 | `*` | 0 |

**复合选择器**：
```css
/* 后代选择器 */
.container p { color: blue; }

/* 子选择器（直接子元素）*/
.nav > li { display: inline; }

/* 相邻兄弟 */
h1 + p { margin-top: 0; }

/* 通用兄弟 */
h1 ~ p { color: gray; }
```

#### 【面试题1】CSS选择器优先级如何计算？

**标准答案**（3句话版）：
1. **计算规则**：`!important > 内联样式(1000) > ID(100) > 类/属性/伪类(10) > 标签/伪元素(1)`
2. **同级比较**：权重相同时，后定义的覆盖先定义的（层叠性）
3. **特殊情况**：`!important` 最高，但应避免滥用

**深入版**：
```css
/* 权重计算示例 */
#nav .list li          /* 100 + 10 + 1 = 111 */
.header .nav li        /* 10 + 10 + 1 = 21 */
div#content            /* 1 + 100 = 101 */

/* !important 打破规则 */
.text { color: red !important; }  /* 总是生效 */
```

**易错点**：
- ❌ 误以为 `.class.class` 权重是 20（实际还是10，只是更精确匹配）
- ✅ 内联样式 `style=""` 权重是1000，仅次于 `!important`

---

#### 【面试题2】`:nth-child()` 和 `:nth-of-type()` 的区别？

**标准答案**：
- `:nth-child(n)` - 选择父元素的第n个**子元素**（不管类型）
- `:nth-of-type(n)` - 选择父元素的第n个**指定类型**的子元素

```html
<div>
  <p>段落1</p>  <!-- p:nth-child(1) ✅ | p:nth-of-type(1) ✅ -->
  <span>文本</span>
  <p>段落2</p>  <!-- p:nth-child(3) ✅ | p:nth-of-type(2) ✅ -->
</div>
```

```css
/* 选择第2个p标签 */
p:nth-of-type(2) { color: red; }  /* ✅ 选中"段落2" */
p:nth-child(2) { color: blue; }   /* ❌ 无匹配（第2个子元素是span） */
```

---

#### 【面试题3】如何选择第一个子元素和最后一个子元素？

```css
/* 方法1：结构伪类 */
li:first-child { }
li:last-child { }

/* 方法2：nth-child */
li:nth-child(1) { }
li:nth-child(-n+1) { }  /* 第一个 */

/* 选择前3个 */
li:nth-child(-n+3) { }

/* 选择偶数项 */
li:nth-child(even) { }  /* 等同于 2n */

/* 选择奇数项 */
li:nth-child(odd) { }   /* 等同于 2n+1 */
```

---

### 1.2 层叠与继承机制

#### 【核心知识】

**层叠（Cascade）规则**（按优先级排序）：
1. 重要性：`!important` > 正常声明
2. 来源：内联 > 内部/外部样式表 > 浏览器默认
3. 优先级：ID > 类 > 标签
4. 顺序：后定义覆盖先定义

**可继承属性**（记忆口诀：文本相关属性大多可继承）：
- ✅ `color`, `font-*`, `line-height`, `text-*`, `letter-spacing`
- ✅ `visibility`, `cursor`
- ❌ 盒模型属性（`width`, `margin`, `padding`, `border`）
- ❌ 定位属性（`position`, `top`, `left`）

#### 【面试题4】哪些CSS属性可以继承？

**标准答案**：
```
【可继承】文本类 - color, font-family, font-size, line-height, text-align
【可继承】列表类 - list-style
【可继承】光标 - cursor
【不可继承】盒模型 - width, height, margin, padding, border
【不可继承】定位 - position, top, display
【不可继承】背景 - background
```

**实战技巧**：
```css
/* 强制继承 */
.child {
  width: inherit;  /* 继承父元素宽度 */
}

/* 重置继承 */
.reset {
  all: unset;  /* 清除所有样式 */
}
```

---

#### 【面试题5】CSS变量（自定义属性）如何使用？

**标准答案**：
```css
/* 定义全局变量 */
:root {
  --primary-color: #3498db;
  --spacing: 16px;
}

/* 使用变量 */
.button {
  background: var(--primary-color);
  padding: var(--spacing);

  /* 带默认值 */
  color: var(--text-color, #333);
}

/* 局部作用域 */
.dark-theme {
  --primary-color: #2c3e50;  /* 覆盖全局变量 */
}
```

**面试加分项**：
- 支持继承和层叠
- 可以通过JavaScript动态修改：`element.style.setProperty('--color', 'red')`
- 兼容性：IE不支持，现代浏览器全支持

---

## 第二章：盒模型与布局基础

### 2.1 盒模型详解

#### 【核心知识】

**标准盒模型 vs IE盒模型**：

```
【标准盒模型】box-sizing: content-box (默认)
总宽度 = width + padding + border + margin
实际内容区 = width

【IE盒模型】box-sizing: border-box
总宽度 = width + margin
实际内容区 = width - padding - border
```

**推荐实践**：
```css
/* 全局应用 border-box */
*, *::before, *::after {
  box-sizing: border-box;
}
```

#### 【面试题6】如何实现一个宽高比固定的容器？

**方法1：padding百分比技巧**（兼容性最好）
```css
.aspect-box {
  width: 100%;
  padding-top: 56.25%;  /* 16:9 = 9/16 = 0.5625 */
  position: relative;
}

.aspect-box > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

**方法2：aspect-ratio**（现代方案）
```css
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

---

#### 【面试题7】margin塌陷（collapse）是什么？如何解决？

**标准答案**：
垂直方向相邻的margin会合并，取较大值（水平方向不会）

**发生场景**：
1. 父子元素的margin-top
2. 相邻兄弟元素的margin
3. 空元素的margin-top和margin-bottom

```html
<!-- 塌陷示例 -->
<div style="margin-bottom: 20px;">块1</div>
<div style="margin-top: 30px;">块2</div>
<!-- 实际间距是30px，不是50px -->
```

**解决方案**：
```css
/* 方案1：触发BFC */
.parent {
  overflow: hidden;  /* 或 auto */
}

/* 方案2：添加边框/内边距 */
.parent {
  border-top: 1px solid transparent;
  /* 或 padding-top: 1px; */
}

/* 方案3：使用Flexbox（推荐）*/
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;  /* 明确间距 */
}
```

---

#### 【面试题8】什么是BFC？如何触发？

**标准答案**（黄金结构）：

**【是什么】**
BFC（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素的布局不影响外部

**【为什么】**
解决3大问题：margin塌陷、浮动元素高度塌陷、防止文字环绕

**【怎么做】**
触发条件（任一即可）：
```css
overflow: hidden/auto/scroll;  /* 最常用 */
display: inline-block/flex/grid;
position: absolute/fixed;
float: left/right;
```

**【实践】**
```css
/* 清除浮动 */
.clearfix {
  overflow: hidden;  /* 触发BFC */
}

/* 防止margin穿透 */
.container {
  display: flow-root;  /* 现代方案，专门创建BFC */
}
```

---

### 2.2 布局系统：Flexbox

#### 【核心知识】

**Flex容器属性**：
```css
.container {
  display: flex;

  /* 主轴方向 */
  flex-direction: row | column;

  /* 换行 */
  flex-wrap: nowrap | wrap;

  /* 主轴对齐 */
  justify-content: flex-start | center | space-between | space-around;

  /* 交叉轴对齐 */
  align-items: stretch | center | flex-start;

  /* 多行对齐 */
  align-content: flex-start | center | space-between;

  /* 间距（推荐）*/
  gap: 10px;
}
```

**Flex项目属性**：
```css
.item {
  /* 放大比例（默认0不放大）*/
  flex-grow: 1;

  /* 缩小比例（默认1会缩小）*/
  flex-shrink: 0;

  /* 基础尺寸 */
  flex-basis: 200px | auto;

  /* 简写 */
  flex: 1;  /* 等同于 flex: 1 1 0%; */

  /* 单独对齐 */
  align-self: center;

  /* 顺序 */
  order: 1;
}
```

#### 【面试题9】flex: 1 是什么意思？等同于哪些属性？

**标准答案**：
```css
flex: 1;
/* 完整展开为 */
flex-grow: 1;      /* 可以放大 */
flex-shrink: 1;    /* 可以缩小 */
flex-basis: 0%;    /* 基础尺寸为0 */

/* 常见误区 */
flex: 1;  ≠  flex: auto;
flex: auto; /* 等于 1 1 auto，基础尺寸是内容本身 */
```

**实战对比**：
```css
/* 三栏布局 */
.sidebar { flex: 0 0 200px; }  /* 固定200px */
.main { flex: 1; }              /* 占满剩余空间 */
.ad { flex: 0 0 150px; }        /* 固定150px */
```

---

#### 【面试题10】如何用Flex实现水平垂直居中？

```css
/* 方法1：容器居中（推荐）*/
.container {
  display: flex;
  justify-content: center;  /* 水平 */
  align-items: center;      /* 垂直 */
}

/* 方法2：项目自身居中 */
.item {
  margin: auto;  /* 在flex容器中 */
}

/* 方法3：单个项目 */
.container {
  display: flex;
}
.item {
  align-self: center;
  margin: 0 auto;
}
```

---

#### 【面试题11】Flex布局中如何实现等宽列？

```css
/* 方法1：flex简写 */
.item {
  flex: 1;  /* 自动平分 */
}

/* 方法2：flex-basis */
.container {
  display: flex;
}
.item {
  flex: 1 1 0;  /* 从0开始分配 */
}

/* 方法3：固定宽度 + gap */
.container {
  display: flex;
  gap: 10px;
}
.item {
  flex: 1;
  min-width: 0;  /* 防止内容撑开 */
}
```

---

### 2.3 布局系统：Grid

#### 【核心知识】

**Grid容器基础**：
```css
.container {
  display: grid;

  /* 定义列（3种方式）*/
  grid-template-columns: 200px 1fr 200px;  /* 固定-自适应-固定 */
  grid-template-columns: repeat(3, 1fr);   /* 三等分 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  /* 响应式 */

  /* 定义行 */
  grid-template-rows: 100px auto;

  /* 间距 */
  gap: 20px;  /* 行列间距 */
  row-gap: 10px;
  column-gap: 20px;

  /* 对齐 */
  justify-items: center;   /* 单元格内水平对齐 */
  align-items: center;     /* 单元格内垂直对齐 */
  justify-content: center; /* 整体网格水平对齐 */
  align-content: center;   /* 整体网格垂直对齐 */
}
```

**Grid项目定位**：
```css
.item {
  /* 跨越列 */
  grid-column: 1 / 3;  /* 从第1条线到第3条线 */
  grid-column: span 2; /* 跨2列 */

  /* 跨越行 */
  grid-row: 1 / 3;

  /* 命名区域 */
  grid-area: header;
}
```

#### 【面试题12】Grid和Flexbox的区别？如何选择？

**标准答案**：

| 维度 | Flexbox | Grid |
|------|---------|------|
| 布局类型 | 一维（行或列）| 二维（行和列）|
| 适用场景 | 导航栏、卡片排列 | 页面整体布局 |
| 对齐方式 | 沿主轴/交叉轴 | 单元格精确定位 |
| 响应式 | 需配合media query | `auto-fit`自适应 |
| 学习曲线 | 简单 | 稍复杂 |

**选择建议**：
- ✅ **用Flex**：组件内部、一行/一列排列、不确定项目数量
- ✅ **用Grid**：整体页面布局、复杂二维布局、需要精确控制

---

#### 【面试题13】如何用Grid实现响应式布局（不用媒体查询）？

```css
.container {
  display: grid;

  /* 自动填充，最小200px，最大1fr */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* auto-fit vs auto-fill 的区别 */
/* auto-fit：空白轨道会被移除，项目会拉伸 */
/* auto-fill：空白轨道会保留 */
```

**完整示例**：
```css
/* 响应式卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

/* 屏幕够宽：4列
   屏幕变窄：3列 → 2列 → 1列（自动调整）*/
```

---

#### 【面试题14】如何实现圣杯布局（三栏布局）？

**方法1：Grid（最简洁）**
```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  min-height: 100vh;
}
```

**方法2：Flexbox**
```css
.container {
  display: flex;
}
.sidebar { flex: 0 0 200px; }
.main { flex: 1; }
.aside { flex: 0 0 200px; }
```

**方法3：浮动（传统方案）**
```css
.container {
  overflow: hidden;  /* 清除浮动 */
}
.sidebar {
  float: left;
  width: 200px;
}
.aside {
  float: right;
  width: 200px;
}
.main {
  margin: 0 200px;  /* 左右留白 */
}
```

---

### 2.4 定位系统

#### 【核心知识】

**5种定位方式**：

```css
/* 1. 静态定位（默认）*/
position: static;

/* 2. 相对定位 */
position: relative;
top: 10px;  /* 相对于自身原始位置偏移 */

/* 3. 绝对定位 */
position: absolute;
top: 0;     /* 相对于最近的非static祖先元素 */

/* 4. 固定定位 */
position: fixed;
top: 0;     /* 相对于视口固定 */

/* 5. 粘性定位 */
position: sticky;
top: 0;     /* 滚动到阈值后固定 */
```

#### 【面试题15】absolute和relative的区别？

**标准答案**：

| 特性 | relative | absolute |
|------|----------|----------|
| 参照物 | 自身原始位置 | 最近非static祖先 |
| 文档流 | 占据空间 | 脱离文档流 |
| 影响布局 | 不影响其他元素 | 会影响兄弟元素 |
| z-index | 可用 | 可用 |

**经典组合**：
```css
/* 父相子绝 */
.parent {
  position: relative;  /* 建立定位上下文 */
}
.child {
  position: absolute;
  top: 0;
  right: 0;
}
```

---

#### 【面试题16】sticky定位如何使用？为什么不生效？

**标准答案**：
```css
.navbar {
  position: sticky;
  top: 0;  /* 必须指定top/bottom/left/right */
  z-index: 100;
}
```

**不生效的常见原因**：
1. ❌ 父元素设置了 `overflow: hidden/auto`
2. ❌ 没有指定 `top` 等阈值
3. ❌ 父容器高度不足（无滚动空间）
4. ❌ 兼容性问题（IE不支持）

**实战示例**：
```css
/* 吸顶导航 */
.header {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 表格固定表头 */
thead th {
  position: sticky;
  top: 0;
  background: #f5f5f5;
}
```

---

#### 【面试题17】如何实现元素水平垂直居中？（10种方法）

```css
/* 方法1：Flex（推荐）*/
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法2：Grid */
.parent {
  display: grid;
  place-items: center;  /* justify + align 简写 */
}

/* 方法3：绝对定位 + transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方法4：绝对定位 + margin auto */
.child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 200px;   /* 必须有宽高 */
  height: 100px;
}

/* 方法5：绝对定位 + calc */
.child {
  position: absolute;
  top: calc(50% - 50px);  /* 50px是高度的一半 */
  left: calc(50% - 100px);
}

/* 方法6：table-cell */
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

/* 方法7：line-height（单行文本）*/
.parent {
  height: 100px;
  line-height: 100px;
  text-align: center;
}

/* 方法8：writing-mode（不推荐）*/
.parent {
  writing-mode: vertical-lr;
  text-align: center;
}
.child {
  writing-mode: horizontal-tb;
  display: inline-block;
}

/* 方法9：Grid + margin auto */
.parent {
  display: grid;
}
.child {
  margin: auto;
}

/* 方法10：Flex + margin auto */
.parent {
  display: flex;
}
.child {
  margin: auto;
}
```

**面试加分项**：说明各方法的适用场景和兼容性

---

## 第三章：响应式设计

### 3.1 单位系统

#### 【核心知识】

**绝对单位**：
- `px` - 像素（最常用）
- `pt` - 点（印刷单位，1pt = 1/72英寸）
- `cm`, `mm` - 厘米/毫米

**相对单位**：
```css
/* em - 相对于父元素字体大小 */
.parent { font-size: 16px; }
.child { 
  font-size: 2em;      /* 32px */
  padding: 1em;        /* 32px（相对于自己的font-size）*/
}

/* rem - 相对于根元素字体大小 */
html { font-size: 16px; }
.box { 
  width: 10rem;        /* 160px */
  padding: 1rem;       /* 16px */
}

/* % - 相对于父元素 */
width: 50%;            /* 父元素宽度的50% */
padding: 10%;          /* 父元素宽度的10%（注意：上下padding也是相对宽度）*/

/* vw/vh - 视口单位 */
width: 100vw;          /* 视口宽度的100% */
height: 100vh;         /* 视口高度的100% */
font-size: 4vw;        /* 响应式字体 */

/* vmin/vmax */
width: 50vmin;         /* 视口宽高中较小值的50% */
height: 50vmax;        /* 视口宽高中较大值的50% */
```

#### 【面试题18】em和rem的区别？实际开发中如何选择？

**标准答案**：

| 特性 | em | rem |
|------|----|----|
| 参照物 | 父元素font-size | 根元素font-size |
| 嵌套影响 | 会累积计算 | 不受嵌套影响 |
| 适用场景 | 组件内部相对尺寸 | 全局统一尺寸 |

**实战示例**：
```css
/* 推荐做法：rem用于布局，em用于组件内部 */
html {
  font-size: 16px;  /* 基准值 */
}

/* 布局用rem */
.container {
  max-width: 75rem;  /* 1200px */
  padding: 2rem;     /* 32px */
}

/* 组件内部用em */
.button {
  font-size: 1rem;
  padding: 0.5em 1em;  /* 相对于按钮自身字体大小 */
  border-radius: 0.25em;
}

.button-large {
  font-size: 1.25rem;
  /* padding会自动放大，因为用的是em */
}
```

---

#### 【面试题19】如何实现响应式字体？

**方法1：媒体查询**
```css
html {
  font-size: 14px;
}

@media (min-width: 768px) {
  html { font-size: 16px; }
}

@media (min-width: 1200px) {
  html { font-size: 18px; }
}
```

**方法2：vw单位（流动字体）**
```css
html {
  font-size: calc(14px + 0.5vw);  /* 14px到18px之间 */
}

/* 进阶：带最小/最大值 */
html {
  font-size: clamp(14px, 2vw, 20px);
  /* 最小14px，理想2vw，最大20px */
}
```

**方法3：CSS clamp（现代方案）**
```css
.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* 移动端1.5rem，桌面端3rem，中间流动 */
}
```

---

### 3.2 媒体查询

#### 【核心知识】

**基础语法**：
```css
/* 屏幕宽度 */
@media (min-width: 768px) {
  /* 平板及以上 */
}

@media (max-width: 767px) {
  /* 手机 */
}

/* 设备类型 */
@media screen { }          /* 屏幕设备 */
@media print { }           /* 打印 */

/* 方向 */
@media (orientation: portrait) { }   /* 竖屏 */
@media (orientation: landscape) { }  /* 横屏 */

/* 分辨率 */
@media (-webkit-min-device-pixel-ratio: 2) { }  /* Retina屏 */

/* 暗黑模式 */
@media (prefers-color-scheme: dark) { }

/* 减少动画 */
@media (prefers-reduced-motion: reduce) { }

/* 组合条件 */
@media screen and (min-width: 768px) and (max-width: 1024px) { }
```

**常用断点**：
```css
/* 移动优先 */
@media (min-width: 576px) { }   /* 小手机 */
@media (min-width: 768px) { }   /* 平板 */
@media (min-width: 992px) { }   /* 