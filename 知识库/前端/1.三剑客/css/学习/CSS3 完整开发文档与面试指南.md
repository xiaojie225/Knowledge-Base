# CSS3 完整开发文档与面试指南

## 📌 核心概念速览（5分钟版）

1. **CSS3 定义**：CSS 的第三代标准，采用模块化设计，新增了圆角、阴影、渐变、动画、弹性布局等强大特性
2. **核心价值**：无需图片和 JS 即可实现复杂视觉效果，提升性能和开发效率
3. **模块化特点**：不同模块独立演进（如 Flexbox、Grid、Animation 各自版本迭代）
4. **浏览器兼容**：需关注前缀（-webkit-、-moz-）和 polyfill 方案
5. **性能优势**：硬件加速、GPU 渲染，比 JS 动画更流畅

---

## 🎯 深度解析

### 一、选择器增强

#### 1. 属性选择器
```css
/* 精确匹配 */
[attr="value"]          /* 属性值完全等于 */
[attr^="value"]         /* 属性值以...开头 */
[attr$="value"]         /* 属性值以...结尾 */
[attr*="value"]         /* 属性值包含... */
[attr~="value"]         /* 属性值包含独立单词 */
[attr|="value"]         /* 属性值以...开头或后跟连字符 */

/* 实战案例 */
a[href^="https"] { color: green; }  /* 外部链接绿色 */
img[src$=".png"] { border: 2px solid; }  /* PNG 图片加边框 */
```

#### 2. 伪类选择器
```css
/* 结构伪类 */
:nth-child(n)           /* 第 n 个子元素 */
:nth-of-type(n)         /* 同类型第 n 个 */
:first-of-type          /* 同类型第一个 */
:last-of-type           /* 同类型最后一个 */
:only-child             /* 唯一子元素 */
:empty                  /* 无子元素 */

/* n 的计算公式 */
:nth-child(2n)          /* 偶数行 = even */
:nth-child(2n+1)        /* 奇数行 = odd */
:nth-child(3n+1)        /* 1,4,7,10... */
:nth-child(-n+3)        /* 前 3 个 */

/* 状态伪类 */
:enabled / :disabled    /* 表单状态 */
:checked                /* 选中的单选/复选框 */
:target                 /* URL 锚点目标 */
:not(selector)          /* 排除选择器 */

/* 实战：斑马纹表格 */
tr:nth-child(even) { background: #f0f0f0; }
```

#### 3. 伪元素
```css
::before / ::after      /* 插入内容（必须有 content 属性）*/
::first-letter          /* 首字母 */
::first-line            /* 首行 */
::selection             /* 选中文本样式 */

/* 实战：清除浮动 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

---

### 二、盒模型与布局

#### 1. Box-sizing
```css
/* 传统盒模型：width = 内容宽度 */
box-sizing: content-box;  /* 默认值 */

/* IE 盒模型：width = 内容 + padding + border */
box-sizing: border-box;   /* 推荐使用 */

/* 全局重置 */
*, *::before, *::after {
  box-sizing: border-box;
}
```

#### 2. Flexbox 弹性布局
```css
/* 容器属性 */
.container {
  display: flex;
  flex-direction: row | column;          /* 主轴方向 */
  flex-wrap: nowrap | wrap;              /* 换行 */
  justify-content: flex-start | center | space-between | space-around;  /* 主轴对齐 */
  align-items: stretch | center | flex-start;  /* 交叉轴对齐 */
  align-content: flex-start;             /* 多行对齐 */
}

/* 子项属性 */
.item {
  flex: 1;                    /* flex-grow flex-shrink flex-basis 简写 */
  flex-grow: 1;               /* 放大比例 */
  flex-shrink: 0;             /* 缩小比例 */
  flex-basis: auto;           /* 初始尺寸 */
  align-self: center;         /* 单独对齐 */
  order: 1;                   /* 排序 */
}

/* 经典布局：水平垂直居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 3. Grid 网格布局
```css
/* 容器属性 */
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;    /* 列宽 */
  grid-template-rows: 100px auto;        /* 行高 */
  gap: 10px;                             /* 间距 */
  grid-template-areas:                   /* 区域命名 */
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

/* 子项属性 */
.item {
  grid-column: 1 / 3;          /* 跨列 */
  grid-row: 2 / 4;             /* 跨行 */
  grid-area: header;           /* 使用命名区域 */
}

/* 响应式 12 列网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
.col-6 {
  grid-column: span 6;  /* 占 6 列 */
}
```

---

### 三、视觉效果

#### 1. 边框与圆角
```css
/* 圆角 */
border-radius: 10px;                    /* 四角 */
border-radius: 10px 20px 30px 40px;    /* 上右下左 */
border-radius: 50%;                     /* 圆形 */

/* 边框图片 */
border-image: url(border.png) 30 round;

/* 多重边框（利用阴影） */
box-shadow: 0 0 0 5px red, 0 0 0 10px blue;
```

#### 2. 阴影效果
```css
/* 盒阴影 */
box-shadow: h-offset v-offset blur spread color inset;
box-shadow: 2px 2px 5px rgba(0,0,0,0.3);     /* 基础阴影 */
box-shadow: 0 10px 30px rgba(0,0,0,0.2);     /* 卡片悬浮效果 */
box-shadow: inset 0 0 10px rgba(0,0,0,0.5);  /* 内阴影 */

/* 文字阴影 */
text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
text-shadow: 0 0 10px #fff, 0 0 20px #fff;   /* 发光效果 */
```

#### 3. 渐变
```css
/* 线性渐变 */
background: linear-gradient(to right, red, blue);
background: linear-gradient(45deg, red 0%, yellow 50%, blue 100%);

/* 径向渐变 */
background: radial-gradient(circle, red, blue);
background: radial-gradient(circle at top left, red, blue);

/* 重复渐变 */
background: repeating-linear-gradient(45deg, #fff 0px, #fff 10px, #000 10px, #000 20px);

/* 实战：条纹背景 */
.stripe {
  background: repeating-linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f0f0f0 50px,
    #e0e0e0 50px,
    #e0e0e0 100px
  );
}
```

#### 4. 背景增强
```css
/* 多背景 */
background: 
  url(logo.png) no-repeat top right,
  linear-gradient(to bottom, #fff, #000);

/* 背景尺寸 */
background-size: cover;      /* 覆盖容器 */
background-size: contain;    /* 完整显示 */
background-size: 100px 50px; /* 固定尺寸 */

/* 背景裁剪 */
background-clip: border-box | padding-box | content-box | text;

/* 发光文字效果 */
.glow-text {
  background: linear-gradient(45deg, red, blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

### 四、变换与动画

#### 1. Transform 变换
```css
/* 2D 变换 */
transform: translate(50px, 100px);    /* 位移 */
transform: rotate(45deg);             /* 旋转 */
transform: scale(1.5);                /* 缩放 */
transform: skew(10deg, 20deg);        /* 倾斜 */

/* 3D 变换 */
transform: translateZ(50px);
transform: rotateX(45deg) rotateY(45deg);
transform: perspective(500px) rotateY(45deg);  /* 透视 */

/* 变换原点 */
transform-origin: center center;      /* 默认 */
transform-origin: top left;           /* 左上角 */

/* 实战：翻转卡片 */
.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card:hover {
  transform: rotateY(180deg);
}

```

#### 2. Transition 过渡
```css
/* 完整写法 */
transition: property duration timing-function delay;

/* 示例 */
transition: all 0.3s ease-in-out;
transition: width 0.5s, height 0.5s 0.5s;  /* 多属性 */

/* 时间函数 */
ease          /* 慢-快-慢（默认）*/
linear        /* 匀速 */
ease-in       /* 慢-快 */
ease-out      /* 快-慢 */
ease-in-out   /* 慢-快-慢 */
cubic-bezier(0.42, 0, 0.58, 1)  /* 自定义贝塞尔曲线 */

/* 实战：按钮悬停 */
.button {
  background: blue;
  transition: background 0.3s, transform 0.2s;
}
.button:hover {
  background: darkblue;
  transform: scale(1.05);
}
```

#### 3. Animation 动画
```css
/* 定义关键帧 */
@keyframes slidein {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* 更复杂的关键帧 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 应用动画 */
.element {
  animation: slidein 2s ease-in-out infinite alternate;
}

/* 完整属性 */
animation-name: slidein;
animation-duration: 2s;
animation-timing-function: ease;
animation-delay: 1s;
animation-iteration-count: infinite;  /* 或具体次数 */
animation-direction: alternate;       /* normal | reverse | alternate */
animation-fill-mode: forwards;        /* none | forwards | backwards | both */
animation-play-state: paused;         /* running | paused */

/* 实战：加载动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loader {
  animation: spin 1s linear infinite;
}
```

---

### 五、响应式设计

#### 1. 媒体查询
```css
/* 基础语法 */
@media (max-width: 768px) {
  /* 移动端样式 */
}

/* 多条件 */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 平板样式 */
}

/* 横屏/竖屏 */
@media (orientation: landscape) {
  /* 横屏样式 */
}

/* 高分辨率屏幕 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  /* Retina 屏幕样式 */
}

/* 移动优先设计 */
/* 基础样式（移动端）*/
.container { width: 100%; }

/* 平板 */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container { width: 980px; }
}
```

#### 2. 单位系统
```css
/* 相对单位 */
em        /* 相对父元素 font-size */
rem       /* 相对根元素 font-size（推荐）*/
vw/vh     /* 视口宽度/高度的 1% */
vmin/vmax /* 视口较小/较大边的 1% */
%         /* 相对父元素 */

/* 实战：响应式字体 */
html { font-size: 16px; }
h1 { font-size: 2rem; }  /* 32px */

@media (max-width: 768px) {
  html { font-size: 14px; }
  /* h1 自动变为 28px */
}

/* 流式布局 */
.container {
  width: 90vw;
  max-width: 1200px;
  margin: 0 auto;
}
```

---

### 六、文本与字体

#### 1. 文本效果
```css
/* 文本溢出 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* 单行省略号 */
}

/* 多行省略 */
.multi-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 文本换行 */
word-wrap: break-word;        /* 强制换行 */
word-break: break-all;        /* 任意位置换行 */
white-space: pre-wrap;        /* 保留空格并换行 */

/* 文本装饰 */
text-decoration: underline wavy red;  /* 波浪下划线 */
text-decoration-skip-ink: auto;       /* 跳过下行字母 */
```

#### 2. Web 字体
```css
/* 引入字体 */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2'),
       url('font.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;  /* 字体加载策略 */
}

/* 使用字体 */
body {
  font-family: 'MyFont', Arial, sans-serif;
}

/* 字体特性 */
font-variant: small-caps;        /* 小型大写字母 */
font-feature-settings: "liga" 1; /* 连字 */
```

---

### 七、高级特性

#### 1. Filter 滤镜
```css
filter: blur(5px);              /* 模糊 */
filter: brightness(1.5);        /* 亮度 */
filter: contrast(200%);         /* 对比度 */
filter: grayscale(100%);        /* 灰度 */
filter: hue-rotate(90deg);      /* 色相旋转 */
filter: invert(100%);           /* 反色 */
filter: saturate(200%);         /* 饱和度 */
filter: sepia(100%);            /* 褐色 */
filter: drop-shadow(2px 2px 5px rgba(0,0,0,0.3));  /* 投影 */

/* 组合滤镜 */
filter: blur(3px) brightness(1.2) contrast(1.5);

/* 实战：毛玻璃效果 */
.blur-bg {
  backdrop-filter: blur(10px) saturate(180%);
  background: rgba(255, 255, 255, 0.5);
}
```

#### 2. Clip-path 裁剪
```css
/* 基础形状 */
clip-path: circle(50%);
clip-path: ellipse(50% 30%);
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);  /* 菱形 */
clip-path: inset(10px 20px 30px 40px round 5px);

/* 实战：六边形头像 */
.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

#### 3. 混合模式
```css
/* 背景混合 */
background-blend-mode: multiply;  /* 正片叠底 */
background-blend-mode: screen;    /* 滤色 */
background-blend-mode: overlay;   /* 叠加 */

/* 元素混合 */
mix-blend-mode: difference;       /* 差值 */
mix-blend-mode: luminosity;       /* 明度 */

/* 实战：彩色图片变灰 */
img {
  filter: grayscale(100%);
  transition: filter 0.3s;
}
img:hover {
  filter: grayscale(0);
}
```

#### 4. 变量（Custom Properties）
```css
/* 定义变量 */
:root {
  --primary-color: #3498db;
  --spacing: 16px;
  --font-size-base: 16px;
}

/* 使用变量 */
.button {
  background: var(--primary-color);
  padding: var(--spacing);
  font-size: var(--font-size-base);
}

/* 带回退值 */
color: var(--text-color, #333);

/* JavaScript 操作 */
document.documentElement.style.setProperty('--primary-color', 'red');

/* 实战：主题切换 */
.dark-theme {
  --bg-color: #1a1a1a;
  --text-color: #fff;
}
body {
  background: var(--bg-color, #fff);
  color: var(--text-color, #000);
}
```

#### 5. Calc() 计算
```css
/* 基础计算 */
width: calc(100% - 50px);
height: calc(100vh - 80px);

/* 复杂计算 */
width: calc((100% - 30px) / 3);
font-size: calc(1rem + 2vw);

/* 实战：等高布局 */
.sidebar { width: 200px; }
.main { width: calc(100% - 200px); }
```

---

## 🎤 常见面试题详解

### 基础概念类

**Q1: CSS3 相比 CSS2 有哪些重要新特性？**

**【标准答案模板】**
```
1. 选择器增强：新增属性选择器（^= $= *=）、伪类（:nth-child）、伪元素（::selection）
2. 视觉效果：圆角、阴影、渐变，无需图片即可实现复杂效果
3. 布局革新：Flexbox 和 Grid，解决传统布局痛点
4. 动画能力：transform、transition、animation，实现流畅动画
5. 响应式：媒体查询、新单位（rem、vw/vh），适配多端屏幕
6. 性能提升：硬件加速、模块化加载，提升渲染效率
```

**Q2: 伪类和伪元素的区别？**

**【3句话版】**
- **伪类**：选择处于特定状态的元素（如 `:hover`），用单冒号
- **伪元素**：创建不存在于 DOM 的元素（如 `::before`），用双冒号
- **本质区别**：伪类是"筛选条件"，伪元素是"创建内容"

**【深入版】**
```css
/* 伪类：选择已有元素的特殊状态 */
a:hover { }        /* 鼠标悬停的链接 */
li:first-child { } /* 第一个 li */

/* 伪元素：插入新内容 */
p::before {
  content: "📌";  /* 必须有 content */
}

/* 记忆技巧 */
伪类 = 类选择器的增强版（:class）
伪元素 = 创造新元素（::element）
```

**追问：`:before` 和 `::before` 哪个正确？**
- CSS3 规范推荐 `::before`（双冒号）
- 浏览器仍支持 `:before`（单冒号）以兼容 CSS2
- 实际开发建议使用双冒号以区分伪类

---

**Q3: `:nth-child()` 和 `:nth-of-type()` 的区别？**

**【实例对比】**
```html
<div>
  <p>段落1</p>
  <span>文本</span>
  <p>段落2</p>
</div>
```

```css
/* :nth-child(2) - 父元素的第2个子元素 */
p:nth-child(2) { }  /* ❌ 不匹配（第2个是span）*/

/* :nth-of-type(2) - 父元素中第2个p元素 */
p:nth-of-type(2) { }  /* ✅ 匹配"段落2" */
```

**【选择建议】**
- 子元素类型单一 → 用 `:nth-child`
- 子元素类型混杂 → 用 `:nth-of-type`

---

### 布局类

**Q4: Flex 布局和 Grid 布局的区别和使用场景？**

**【核心对比表】**

| 特性 | Flexbox | Grid |
|------|---------|------|
| **维度** | 一维（行或列） | 二维（行和列） |
| **适用场景** | 导航栏、工具栏、列表 | 页面整体布局、复杂表格 |
| **子项控制** | 子项可灵活调整顺序和尺寸 | 子项严格按网格定位 |
| **浏览器兼容** | 更好（IE10+） | 较新（IE11 部分支持） |
| **学习曲线** | 较平缓 | 较陡峭 |

**【实战选择】**
```css
/* Flexbox：适合组件级布局 */
.navbar {
  display: flex;
  justify-content: space-between;  /* 两端对齐 */
}

/* Grid：适合页面级布局 */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
```

**追问：能否嵌套使用？**
- ✅ 完全可以！Grid 做整体布局，Flex 做组件布局
- 示例：Grid 定义页面区域，Header 内部用 Flex 排列导航项

---

**Q5: 实现水平垂直居中的方法有哪些？**

**【完整方案集合】**

```css
/* 方法1：Flexbox（推荐）*/
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法2：Grid */
.container {
  display: grid;
  place-items: center;  /* 简写 */
}

/* 方法3：绝对定位 + transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方法4：绝对定位 + margin auto（需知道宽高）*/
.child {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}

/* 方法5：table-cell（老方法，不推荐）*/
.container {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

**【选择建议】**
- 现代项目 → **Flexbox 或 Grid**
- 需要兼容老浏览器 → 绝对定位 + transform
- 单行文本 → `line-height` 等于容器高度

---

**Q6: `flex: 1` 的完整含义是什么？**

**【答案拆解】**
```css
flex: 1;  /* 是以下三个属性的简写 */

/* 等价于 */
flex-grow: 1;      /* 放大比例：占据剩余空间 */
flex-shrink: 1;    /* 缩小比例：空间不足时收缩 */
flex-basis: 0%;    /* 初始尺寸：不考虑内容宽度 */
```

**【实战案例】**
```css
.container {
  display: flex;
}
.item1 { flex: 1; }  /* 占 1 份 */
.item2 { flex: 2; }  /* 占 2 份 */
.item3 { width: 100px; }  /* 固定宽度 */

/* 结果：item1 和 item2 平分剩余空间（1:2 比例）*/
```

**追问：`flex: 1` 和 `flex: auto` 的区别？**
```css
flex: 1;     /* flex: 1 1 0% - 不考虑内容宽度 */
flex: auto;  /* flex: 1 1 auto - 基于内容宽度分配 */
```

---

### 动画与性能类

**Q7: `transition` 和 `animation` 的区别？**

**【核心对比】**

| 特性 | Transition | Animation |
|------|------------|-----------|
| **触发方式** | 需要事件触发（hover、focus） | 自动播放 |
| **关键帧** | 只有开始和结束 | 可定义多个关键帧 |
| **循环控制** | 不支持 | 支持循环、反向播放 |
| **适用场景** | 简单状态切换 | 复杂连续动画 |

**【实战示例】**
```css
/* Transition：按钮悬停变色 */
button {
  background: blue;
  transition: background 0.3s;
}
button:hover {
  background: red;
}

/* Animation：持续旋转的 Loading */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loader {
  animation: spin 1s linear infinite;
}
```

---

**Q8: 如何实现性能更好的动画？**

**【优化原则】**

1. **只对以下属性做动画**（触发 GPU 加速）
   ```css
   transform: translate / rotate / scale
   opacity
   ```

2. **避免触发重排的属性**
   ```css
   /* ❌ 性能差 */
   width, height, margin, padding, left, top
 
   /* ✅ 性能好 */
   transform: translateX(), scale()
   ```

3. **使用 `will-change` 提前优化**
   ```css
   .element {
     will-change: transform;  /* 提前告知浏览器 */
   }
 
   /* 动画结束后移除 */
   .element.animation-done {
     will-change: auto;
   }
   ```

4. **使用 `transform: translate3d(0,0,0)` 开启硬件加速**
   ```css
   .element {
     transform: translate3d(0, 0, 0);  /* 强制 GPU 渲染 */
   }
   ```

**【性能对比】**
```css
/* ❌ 触发重排和重绘（慢）*/
@keyframes bad {
  from { left: 0; }
  to { left: 100px; }
}

/* ✅ 只触发合成（快）*/
@keyframes good {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

---


**Q9: 什么是重排（reflow）和重绘（repaint）？如何避免？**

**【概念区分】**
```
重排（Reflow）：
- 元素几何属性变化（位置、尺寸）
- 触发整个渲染树重新计算
- 性能开销大

重绘（Repaint）：
- 元素外观属性变化（颜色、背景）
- 不影响布局
- 性能开销较小

关系：重排一定引起重绘，重绘不一定引起重排
```

**【触发重排的操作】**
```css
/* 会触发重排的属性 */
width, height, padding, margin, border
left, top, right, bottom
display, position, float
font-size, line-height, text-align

/* 会触发重排的 JS 操作 */
offsetWidth, offsetHeight, offsetTop, offsetLeft
scrollTop, scrollHeight
clientWidth, clientHeight
getComputedStyle()
```

**【避免方案】**
```javascript
// ❌ 多次重排
element.style.left = '10px';
element.style.top = '10px';
element.style.width = '100px';

// ✅ 合并修改（只重排一次）
element.style.cssText = 'left:10px; top:10px; width:100px;';

// ✅ 使用 class
element.className = 'optimized-style';

// ✅ 离线操作 DOM
const fragment = document.createDocumentFragment();
// 批量添加元素到 fragment
document.body.appendChild(fragment);

// ✅ 使用 transform 代替 left/top
element.style.transform = 'translate(10px, 10px)';
```

**【读写分离原则】**
```javascript
// ❌ 读写交替（强制同步布局）
div1.style.width = div2.offsetWidth + 'px';  // 读
div2.style.height = div1.offsetHeight + 'px'; // 读

// ✅ 先读后写
const width = div2.offsetWidth;
const height = div1.offsetHeight;
div1.style.width = width + 'px';
div2.style.height = height + 'px';
```

---

**Q10: CSS 动画的 `timing-function` 有哪些？如何自定义？**

**【预设函数】**
```css
ease           /* 默认：慢-快-慢 cubic-bezier(0.25, 0.1, 0.25, 1) */
linear         /* 匀速 cubic-bezier(0, 0, 1, 1) */
ease-in        /* 慢-快 cubic-bezier(0.42, 0, 1, 1) */
ease-out       /* 快-慢 cubic-bezier(0, 0, 0.58, 1) */
ease-in-out    /* 慢-快-慢 cubic-bezier(0.42, 0, 0.58, 1) */

/* 阶跃函数 */
steps(4, end)  /* 分4步，在每步结束时跳变 */
step-start     /* 等于 steps(1, start) */
step-end       /* 等于 steps(1, end) */
```

**【自定义贝塞尔曲线】**
```css
/* 工具：https://cubic-bezier.com */

/* 弹性效果 */
transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 快速开始 */
transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* 平滑减速 */
transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
```

**【阶跃函数应用】**
```css
/* 打字机效果 */
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}
.typewriter {
  animation: typing 3s steps(20) forwards;
  overflow: hidden;
  white-space: nowrap;
}

/* 帧动画（雪碧图）*/
.sprite {
  animation: play 1s steps(10) infinite;
}
@keyframes play {
  to { background-position: -1000px 0; }
}
```

---

### 响应式与兼容性类

**Q11: 移动端适配方案有哪些？**

**【方案对比】**

| 方案 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| **rem** | 根据根元素 font-size 缩放 | 适配简单 | 需要 JS 计算 |
| **vw/vh** | 视口单位 | 纯 CSS 实现 | 兼容性稍差 |
| **flex 弹性布局** | 自适应伸缩 | 灵活度高 | 不适合精确还原设计稿 |
| **媒体查询** | 断点式适配 | 可精细控制 | 维护成本高 |

**【Rem 方案实现】**
```javascript
// 动态设置根元素 font-size
(function() {
  const baseSize = 16; // 基准大小（设计稿 750px 时）
  const scale = document.documentElement.clientWidth / 375;
  document.documentElement.style.fontSize = baseSize * scale + 'px';
})();

// 监听窗口变化
window.addEventListener('resize', setRem);
```

```css
/* 设计稿 750px，元素宽 100px */
.element {
  width: 6.25rem; /* 100 / 16 = 6.25 */
}
```

**【Vw 方案（推荐）】**
```css
/* 750px 设计稿，100px = 100/750*100vw */
.element {
  width: 13.333vw;
}

/* 配合 postcss-px-to-viewport 自动转换 */
/* 写 CSS 时直接写 px，构建时自动转换 */
```

**【媒体查询断点】**
```css
/* 移动优先 */
/* 基础样式（手机） */
.container { width: 100%; }

/* 平板 */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container { width: 980px; }
}

/* 大屏 */
@media (min-width: 1200px) {
  .container { width: 1170px; }
}
```

---


**Q13: CSS3 新增的颜色格式有哪些？**

**【颜色格式全解】**

```css
/* 1. RGBA（透明度）*/
background: rgba(255, 0, 0, 0.5);  /* 50% 透明的红色 */

/* 2. HSLA（色相/饱和度/亮度/透明度）*/
color: hsla(120, 100%, 50%, 0.8);  /* 绿色系 */
/* 
  H: 0-360（色相，0=红，120=绿，240=蓝）
  S: 0-100%（饱和度，0=灰，100=纯色）
  L: 0-100%（亮度，0=黑，50=正常，100=白）
  A: 0-1（透明度）
*/

/* 3. 渐变色（见前面章节）*/
background: linear-gradient(to right, red, blue);

/* 4. currentColor（继承文本颜色）*/
.icon {
  color: red;
  border: 1px solid currentColor;  /* 边框自动变红 */
}

/* 5. transparent（完全透明）*/
background: transparent;
```

**【HSLA 实战应用】**
```css
/* 同一色系的渐变 */
.light { background: hsl(200, 80%, 80%); }  /* 浅蓝 */
.normal { background: hsl(200, 80%, 50%); } /* 标准蓝 */
.dark { background: hsl(200, 80%, 30%); }   /* 深蓝 */

/* 动态调整饱和度 */
:root {
  --hue: 200;
}
.color {
  background: hsl(var(--hue), 80%, 50%);
}
```

---

### 高级技巧类

**Q15: 如何用纯 CSS 实现三角形？**

**【核心原理】**
```
利用 border 的交界处是斜线的特性
当宽高为 0 时，border 就变成了三角形
```

**【实现代码】**
```css
/* 向上三角 */
.triangle-up {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}

/* 向下三角 */
.triangle-down {
  border-top: 100px solid red;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
}

/* 向左三角 */
.triangle-left {
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-right: 100px solid red;
}

/* 向右三角 */
.triangle-right {
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-left: 100px solid red;
}

/* 等边三角形（高度 = 宽度 * 0.866）*/
.equilateral {
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 86.6px solid red;
}
```

**【实战应用：对话气泡】**
```css
.bubble {
  position: relative;
  background: #fff;
  border-radius: 5px;
  padding: 10px;
}

.bubble::after {
  content: '';
  position: absolute;
  left: -10px;
  top: 10px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #fff;
}
```

---

**Q16: 如何实现多行文本溢出省略？**

**【单行省略（兼容性好）】**
```css
.ellipsis-single {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

**【多行省略（Webkit 内核）】**
```css
.ellipsis-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;  /* 显示 3 行 */
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**【兼容方案（伪元素）】**
```css
.ellipsis-compat {
  position: relative;
  max-height: 4.5em;  /* 行高 * 行数 */
  line-height: 1.5em;
  overflow: hidden;
}

.ellipsis-compat::after {
  content: '...';
  position: absolute;
  right: 0;
  bottom: 0;
  padding-left: 20px;
  background: linear-gradient(to right, transparent, #fff 50%);
}
```

**【JavaScript 精确方案】**
```javascript
function ellipsis(element, maxLines) {
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
  const maxHeight = lineHeight * maxLines;

  while (element.scrollHeight > maxHeight) {
    element.textContent = element.textContent.slice(0, -1);
  }
  element.textContent += '...';
}
```

---

**Q17: 如何实现固定宽高比的容器（如 16:9）？**

**【方案1：padding-top 百分比】**
```css
/* 原理：padding 百分比基于父元素宽度 */
.ratio-box {
  position: relative;
  width: 100%;
  padding-top: 56.25%;  /* 9/16 = 0.5625 */
}

.ratio-box-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

**【方案2：aspect-ratio（现代浏览器）】**
```css
.ratio-box {
  width: 100%;
  aspect-ratio: 16 / 9;  /* 超简洁！ */
}

/* 兼容性：Chrome 88+, Safari 15+ */
```

**【实战：响应式视频】**
```html
<div class="video-wrapper">
  <iframe src="video.mp4"></iframe>
</div>

<style>
.video-wrapper {
  position: relative;
  padding-top: 56.25%;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
```

---

**Q18: 如何实现文字渐变色？**

**【实现方法】**
```css
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;  /* 回退方案 */
}

/* 动画渐变 */
@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient-text {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #ff6b6b);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-animation 3s linear infinite;
}
```

**【注意事项】**
- 必须设置 `color: transparent` 作为回退
- `-webkit-` 前缀必须保留
- 不适用于可选中文本（会显示白色）

---

**Q19: 实现一个加载动画（Loading Spinner）**

**【方案1：边框旋转】**
```css
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**【方案2：多点跳动】**
```css
.dots-loader {
  display: flex;
  gap: 10px;
}

.dots-loader span {
  width: 15px;
  height: 15px;
  background: #3498db;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dots-loader span:nth-child(1) { animation-delay: -0.32s; }
.dots-loader span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

**【方案3：进度条脉冲】**
```css
.progress-loader {
  width: 200px;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.progress-loader::after {
  content: '';
  display: block;
  width: 50%;
  height: 100%;
  background: #3498db;
  animation: progress 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
```

---

**Q20: 如何实现毛玻璃效果（Glassmorphism）？**

**【完整实现】**
```css
.glass-card {
  /* 毛玻璃核心 */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);

  /* 边框光晕 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;

  /* 阴影 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  /* 内容样式 */
  padding: 20px;
  color: #fff;
}

/* 兼容性处理 */
@supports not (backdrop-filter: blur(10px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.8);
  }
}
```

**【实战：登录卡片】**
```html
<div class="glass-container">
  <div class="glass-card">
    <h2>Welcome Back</h2>
    <form>...</form>
  </div>
</div>

<style>
.glass-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 40px;
  width: 400px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}
</style>
```

---

### 性能与优化类

**Q21: CSS 性能优化有哪些方法？**

**【完整优化清单】**

**1. 选择器优化**
```css
/* ❌ 避免通配符 */
* { margin: 0; }

/* ❌ 避免过深嵌套 */
.nav ul li a span { }

/* ✅ 使用类选择器 */
.nav-link { }

/* 性能排序（从快到慢）*/
#id > .class > tag > * > [attr] > :pseudo
```

**2. 减少重排重绘**
```css
/* ✅ 使用 transform 代替 top/left */
.move {
  transform: translate(100px, 100px);
}

/* ✅ 使用 opacity 代替 visibility */
.fade {
  opacity: 0;
}

/* ✅ 合并样式修改 */
element.style.cssText = 'width:100px; height:100px;';
```

**3. 使用硬件加速**
```css
.accelerated {
  transform: translateZ(0);
  /* 或 */
  will-change: transform;
}
```

**4. 避免昂贵属性**
```css
/* 慎用 */
box-shadow: 0 0 50px rgba(0,0,0,0.5);  /* 大模糊半径 */
filter: blur(20px);                     /* 大模糊值 */
text-shadow: 0 0 10px #000;            /* 多个阴影 */
```

**5. 优化动画**
```css
/* ✅ 只对 transform 和 opacity 做动画 */
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

/* ❌ 避免对 width/height 做动画 */
@keyframes bad {
  from { width: 100px; }
  to { width: 200px; }
}
```

**6. 压缩 CSS**
- 移除无用代码（PurgeCSS）
- 合并相同规则
- 使用 CSS 压缩工具（cssnano）

**7. 关键 CSS 内联**
```html
<!-- 首屏关键 CSS 直接内联 -->
<style>
  .header { ... }
  .hero { ... }
</style>

<!-- 其他 CSS 异步加载 -->
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

---

**Q22: `will-change` 的正确使用方式？**

**【核心原理】**
```
will-change 告诉浏览器元素即将发生变化
浏览器会提前做优化（创建合成层）
但过度使用会消耗大量内存
```

**【正确用法】**
```css
/* ✅ 只在需要时添加 */
.element:hover {
  will-change: transform;
}

.element:active {
  transform: scale(1.1);
}

/* ✅ 动画前添加，动画后移除 */
.animate {
  will-change: transform;
}

.animate.done {
  will-change: auto;
}
```

**【错误用法】**
```css
/* ❌ 不要全局使用 */
* {
  will-change: transform;
}

/* ❌ 不要指定过多属性 */
.element {
  will-change: transform, opacity, left, top, width, height;
}

/* ❌ 不要长时间保持 */
.element {
  will-change: transform;  /* 一直存在 → 内存泄漏 */
}
```

**【JavaScript 动态控制】**
```javascript
const element = document.querySelector('.animate');

// 动画开始前
element.style.willChange = 'transform';

// 执行动画
element.classList.add('animating');

// 动画结束后移除
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});
```

---

**Q23: 如何减少 CSS 文件体积？**

**【优化策略】**

**1. 使用 CSS 预处理器**
```scss
// 变量复用
$primary-color: #3498db;

.button {
  background: $primary-color;
}

// Mixin 复用
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  @include flex-center;
}
```

**2. 移除无用 CSS（Critical CSS）**
```bash
# 使用 PurgeCSS
npm install purgecss --save-dev

# 配置文件
module.exports = {
  content: ['./src/**/*.html'],
  css: ['./src/**/*.css']
}
```

**3. 合并重复规则**
```css
/* ❌ 冗余 */
.button-primary { background: blue; }
.button-secondary { background: blue; }

/* ✅ 合并 */
.button-primary,
.button-secondary {
  background: blue;
}
```

**4. 使用简写属性**
```css
/* ❌ 展开 */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 10px;
margin-left: 20px;

/* ✅ 简写 */
margin: 10px 20px;

/* 更多简写 */
background: #fff url(bg.png) no-repeat center/cover;
font: italic bold 16px/1.5 Arial, sans-serif;
border-radius: 10px 20px;
```

**5. 压缩工具**
- **cssnano**：生产环境压缩
- **clean-css**：命令行工具
- **webpack + css-loader**：构建时自动压缩

---

### 浏览器兼容类

**Q24: 如何处理浏览器前缀？**

**【常见前缀】**
```css
-webkit-  /* Chrome, Safari, 新版 Opera */
-moz-     /* Firefox */
-ms-      /* IE, Edge */
-o-       /* 旧版 Opera */
```

**【需要前缀的属性】**
```css
/* Flexbox */
display: -webkit-box;
display: -ms-flexbox;
display: flex;

/* Transform */
-webkit-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);

/* Transition */
-webkit-transition: all 0.3s;
transition: all 0.3s;

/* Animation */
-webkit-animation: slide 1s;
animation: slide 1s;

/* User Select */
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;

/* Backdrop Filter */
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);
```

**【自动化方案：Autoprefixer】**
```bash
npm install autoprefixer --save-dev
```

```javascript
// PostCSS 配置
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 1%']
    })
  ]
}
```

```css
/* 编写时只写标准语法 */
.box {
  display: flex;
  transform: rotate(45deg);
}

/* 自动编译为 */
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
```

---

**Q25: 如何实现 CSS Hack 兼容 IE？**

**【常见 Hack 技巧】**

```css
/* IE 全版本 */
selector {
  property: value\9;
}

/* IE6-7 */
selector {
  *property: value;
  _property: value;
}

/* IE6 */
selector {
  _property: value;
}

/* IE7 */
selector {
  *property: value;
}

/* IE8+ */
selector {
  property: value\0;
}

/* IE9+ */
selector {
  property: value\9\0;
}
```

**【条件注释（IE10-）】**
```html
<!--[if IE]>
  <link rel="stylesheet" href="ie-only.css">
<![endif]-->

<!--[if IE 8]>
  <link rel="stylesheet" href="ie8.css">
<![endif]-->

<!--[if lt IE 9]>
  <script src="html5shiv.js"></script>
  <script src="respond.js"></script>
<![endif]-->
```

**【特性检测（推荐）】**
```css
/* 使用 @supports */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
```

**【Polyfill 方案】**
```html
<!-- Flexbox Polyfill -->
<script src="flexibility.js"></script>

<!-- Grid Polyfill -->
<script src="css-grid-polyfill.js"></script>

<!-- CSS 变量 Polyfill -->
<script src="css-vars-ponyfill.js"></script>
```

---

## 🔥 综合实战面试题

**Q26: 用 CSS 实现一个完整的响应式导航栏（包含汉堡菜单）**

```html
<nav class="navbar">
  <div class="nav-brand">Logo</div>
  <button class="nav-toggle" onclick="toggleMenu()">☰</button>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #333;
  color: #fff;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #3498db;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .nav-toggle {
    display: block;
  }

  .nav-menu {
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    flex-direction: column;
    background: #333;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
  }

  .nav-menu.active {
    max-height: 300px;
  }

  .nav-menu li {
    padding: 1rem 2rem;
    border-top: 1px solid #444;
  }
}
```

```javascript
function toggleMenu() {
  document.querySelector('.nav-menu').classList.toggle('active');
}
```

---

**Q27: 实现一个炫酷的卡片悬停效果（3D 翻转 + 阴影）**

```html
<div class="card-container">
  <div class="card">
    <div class="card-front">
      <h3>Front</h3>
      <p>Hover to flip</p>
    </div>
    <div class="card-back">
      <h3>Back</h3>
      <p>More details here</p>
    </div>
  </div>
</div>
```

```css
.card-container {
  perspective: 1000px;
  width: 300px;
  height: 400px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  cursor: pointer;
}

.card:hover {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.card-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
  transform: rotateY(180deg);
}

/* 添加悬浮阴影 */
.card-container:hover .card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

---
