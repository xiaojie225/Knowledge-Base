# CSS 完整知识库 - 日常学习版

##  知识地图

```
CSS知识体系
├─ 基础语法
│  ├─ 选择器系统（优先级、伪类、伪元素）
│  ├─ 层叠与继承机制
│  └─ CSS变量
├─ 盒模型与布局
│  ├─ 盒模型（标准/IE、BFC）
│  ├─ Flexbox（一维布局）
│  ├─ Grid（二维布局）
│  └─ 定位系统（relative/absolute/fixed/sticky）
├─ 视觉效果
│  ├─ 边框与圆角
│  ├─ 阴影（box-shadow、text-shadow）
│  ├─ 渐变（线性、径向）
│  └─ 滤镜（filter、backdrop-filter）
├─ 变换与动画
│  ├─ Transform（2D/3D变换）
│  ├─ Transition（过渡）
│  └─ Animation（关键帧动画）
├─ 响应式设计
│  ├─ 媒体查询
│  ├─ 单位系统（px/em/rem/vw/vh）
│  └─ 移动端适配方案
└─ 高级特性
   ├─ 混合模式（blend-mode）
   ├─ 裁剪路径（clip-path）
   └─ 性能优化原理
```

---

## 第一部分：基础语法核心

### 1.1 选择器系统 

#### 优先级计算公式
```css
!important > 内联样式(1000) > ID(100) > 类/属性/伪类(10) > 标签/伪元素(1)
```

**权重计算示例**：
```css
#nav .list li          /* 100+10+1 = 111 */
.header .nav li        /* 10+10+1 = 21 */
div#content            /* 1+100 = 101 */
```

#### 属性选择器精确匹配
```css
[attr^="value"]  /* 以...开头 */
[attr$="value"]  /* 以...结尾 */
[attr*="value"]  /* 包含... */
```

**实战案例**：
```css
/* 外部链接添加图标 */
a[href^="https"] { 
  color: green; 
}
```

#### 伪类核心用法
```css
/* 结构伪类 */
:nth-child(n)         /* 第n个子元素（所有类型） */
:nth-of-type(n)       /* 第n个指定类型元素 */
:nth-child(2n)        /* 偶数 = even */
:nth-child(2n+1)      /* 奇数 = odd */
:nth-child(-n+3)      /* 前3个 */

/* 区别示例 */
p:nth-child(2)        /* 第2个子元素是p才匹配 */
p:nth-of-type(2)      /* 第2个p元素（忽略其他类型）*/
```

#### 伪元素创建内容
```css
::before / ::after    /* 插入内容（必须有content属性）*/
::first-letter        /* 首字母 */
::selection           /* 选中文本样式 */

/* 清除浮动经典应用 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

---

### 1.2 层叠与继承 

#### 层叠规则优先级
```
1. 重要性：!important > 正常声明
2. 来源：内联 > 内部/外部样式表 > 浏览器默认
3. 优先级：ID > 类 > 标签
4. 顺序：后定义覆盖先定义
```

#### 可继承属性口诀
**"文本相关属性大多可继承"**
- ✅ `color`、`font-*`、`line-height`、`text-*`
- ❌ 盒模型（`width`、`margin`、`padding`、`border`）
- ❌ 定位（`position`、`top`、`display`）

#### 继承控制关键字
```css
/* 强制继承 */
.child { width: inherit; }

/* 重置继承 */
.reset { all: unset; }
```

---

### 1.3 CSS变量 

#### 定义与使用
```css
/* 全局变量 */
:root {
  --primary-color: #3498db;
  --spacing: 16px;
}

/* 使用变量 */
.button {
  background: var(--primary-color);
  padding: var(--spacing);
}

/* 带默认值 */
color: var(--text-color, #333);
```

#### 局部作用域
```css
.dark-theme {
  --primary-color: #2c3e50;  /* 覆盖全局变量 */
}
```

#### JavaScript动态修改
```javascript
document.documentElement.style.setProperty('--primary-color', 'red');
```

---

## 第二部分：盒模型与布局

### 2.1 盒模型 

#### 标准盒模型 vs IE盒模型
```css
/* 标准盒模型（默认）*/
box-sizing: content-box;
/* 总宽度 = width + padding + border */

/* IE盒模型（推荐）*/
box-sizing: border-box;
/* 总宽度 = width（包含padding和border）*/
```

**全局重置最佳实践**：
```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

#### Margin塌陷现象
**发生场景**：
1. 父子元素的margin-top
2. 相邻兄弟元素的margin
3. 空元素的margin-top和margin-bottom

**解决方案**：
```css
/* 方案1：触发BFC */
.parent { overflow: hidden; }

/* 方案2：Flexbox（推荐）*/
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;  /* 明确间距 */
}
```

---

### 2.2 BFC（块级格式化上下文）

#### 核心概念
**独立的渲染区域，内部布局不影响外部**

#### 解决的3大问题
1. Margin塌陷
2. 浮动元素高度塌陷
3. 防止文字环绕

#### 触发条件
```css
overflow: hidden/auto/scroll;  /* 最常用 */
display: inline-block/flex/grid;
position: absolute/fixed;
float: left/right;
display: flow-root;  /* 现代方案，专门创建BFC */
```

---

### 2.3 Flexbox布局 

#### 容器属性核心
```css
.container {
  display: flex;

  /* 主轴方向 */
  flex-direction: row | column;

  /* 换行 */
  flex-wrap: nowrap | wrap;

  /* 主轴对齐 */
  justify-content: flex-start | center | space-between;

  /* 交叉轴对齐 */
  align-items: stretch | center | flex-start;

  /* 间距（推荐）*/
  gap: 10px;
}
```

#### 项目属性核心
```css
.item {
  /* flex简写：grow shrink basis */
  flex: 1;  /* 等于 1 1 0% */

  flex-grow: 1;      /* 放大比例（默认0不放大）*/
  flex-shrink: 0;    /* 缩小比例（默认1会缩小）*/
  flex-basis: 200px; /* 初始尺寸 */

  /* 单独对齐 */
  align-self: center;
}
```

#### flex: 1 vs flex: auto
```css
flex: 1;     /* 等于 1 1 0% - 不考虑内容宽度 */
flex: auto;  /* 等于 1 1 auto - 基于内容宽度分配 */
```

#### 水平垂直居中
```css
.container {
  display: flex;
  justify-content: center;  /* 水平 */
  align-items: center;      /* 垂直 */
}
```

---

### 2.4 Grid布局 

#### 容器属性核心
```css
.container {
  display: grid;

  /* 定义列 */
  grid-template-columns: 200px 1fr 200px;  /* 固定-自适应-固定 */
  grid-template-columns: repeat(3, 1fr);   /* 三等分 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  /* 响应式 */

  /* 间距 */
  gap: 20px;

  /* 对齐 */
  justify-items: center;   /* 单元格内水平 */
  align-items: center;     /* 单元格内垂直 */
  place-items: center;     /* 简写 */
}
```

#### 项目定位
```css
.item {
  /* 跨列 */
  grid-column: 1 / 3;  /* 从第1条线到第3条线 */
  grid-column: span 2; /* 跨2列 */

  /* 跨行 */
  grid-row: 1 / 3;
}
```

#### 响应式自适应布局
```css
.container {
  display: grid;
  /* 自动填充，最小200px，最大1fr */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
/* 无需媒体查询，自动响应！ */
```

#### Flex vs Grid 选择指南
| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维（行或列）| 二维（行和列）|
| 适用 | 导航栏、卡片排列 | 页面整体布局 |
| 选择 | 组件内部布局 | 复杂二维布局 |

---

### 2.5 定位系统 

#### 5种定位方式
```css
position: static;    /* 默认，正常文档流 */
position: relative;  /* 相对自身原始位置偏移 */
position: absolute;  /* 相对最近非static祖先定位 */
position: fixed;     /* 相对视口固定 */
position: sticky;    /* 粘性定位，滚动到阈值后固定 */
```

#### 父相子绝经典组合
```css
.parent {
  position: relative;  /* 建立定位上下文 */
}
.child {
  position: absolute;
  top: 0;
  right: 0;
}
```

#### Sticky定位注意事项
**不生效的常见原因**：
1. ❌ 父元素设置了`overflow: hidden`
2. ❌ 没有指定`top/bottom`等阈值
3. ❌ 父容器高度不足
4. ❌ IE不支持

---

## 第三部分：视觉效果

### 3.1 边框与圆角 

```css
/* 圆角 */
border-radius: 10px;                 /* 四角 */
border-radius: 50%;                  /* 圆形 */

/* 多重边框（利用阴影）*/
box-shadow: 0 0 0 5px red, 0 0 0 10px blue;
```

---

### 3.2 阴影效果 

```css
/* 盒阴影 */
box-shadow: h-offset v-offset blur spread color inset;
box-shadow: 2px 2px 5px rgba(0,0,0,0.3);     /* 基础 */
box-shadow: 0 10px 30px rgba(0,0,0,0.2);     /* 悬浮 */
box-shadow: inset 0 0 10px rgba(0,0,0,0.5);  /* 内阴影 */

/* 文字阴影 */
text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
text-shadow: 0 0 10px #fff;  /* 发光效果 */
```

---

### 3.3 渐变 

```css
/* 线性渐变 */
background: linear-gradient(to right, red, blue);
background: linear-gradient(45deg, red 0%, yellow 50%, blue 100%);

/* 径向渐变 */
background: radial-gradient(circle, red, blue);

/* 重复渐变（条纹背景）*/
background: repeating-linear-gradient(
  90deg,
  #f0f0f0 0px,
  #f0f0f0 50px,
  #e0e0e0 50px,
  #e0e0e0 100px
);
```

---

### 3.4 滤镜 

```css
filter: blur(5px);           /* 模糊 */
filter: brightness(1.5);     /* 亮度 */
filter: grayscale(100%);     /* 灰度 */
filter: drop-shadow(2px 2px 5px rgba(0,0,0,0.3));  /* 投影 */

/* 毛玻璃效果 */
backdrop-filter: blur(10px) saturate(180%);
background: rgba(255, 255, 255, 0.5);
```

---

## 第四部分：变换与动画

### 4.1 Transform变换 

#### 2D变换
```css
transform: translate(50px, 100px);  /* 位移 */
transform: rotate(45deg);           /* 旋转 */
transform: scale(1.5);              /* 缩放 */
transform: skew(10deg, 20deg);      /* 倾斜 */
```

#### 3D变换
```css
transform: translateZ(50px);
transform: rotateX(45deg) rotateY(45deg);
transform: perspective(500px) rotateY(45deg);  /* 透视 */

/* 3D翻转卡片 */
.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card:hover {
  transform: rotateY(180deg);
}
```

---

### 4.2 Transition过渡 

```css
/* 完整语法 */
transition: property duration timing-function delay;

/* 示例 */
transition: all 0.3s ease-in-out;

/* 时间函数 */
ease          /* 慢-快-慢（默认）*/
linear        /* 匀速 */
ease-in       /* 慢-快 */
ease-out      /* 快-慢 */
cubic-bezier(0.42, 0, 0.58, 1)  /* 自定义 */
```

**按钮悬停效果**：
```css
.button {
  transition: background 0.3s, transform 0.2s;
}
.button:hover {
  background: darkblue;
  transform: scale(1.05);
}
```

---

### 4.3 Animation动画 

```css
/* 定义关键帧 */
@keyframes slidein {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
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
animation-iteration-count: infinite;  /* 或次数 */
animation-direction: alternate;       /* 往返 */
animation-fill-mode: forwards;        /* 保持结束状态 */
animation-play-state: paused;         /* 暂停 */
```

**Loading旋转动画**：
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loader {
  animation: spin 1s linear infinite;
}
```

---

## 第五部分：响应式设计

### 5.1 媒体查询 

```css
/* 基础语法 */
@media (max-width: 768px) {
  /* 移动端样式 */
}

/* 多条件 */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 平板样式 */
}

/* 横竖屏 */
@media (orientation: landscape) { }

/* 暗黑模式 */
@media (prefers-color-scheme: dark) { }

/* Retina屏幕 */
@media (-webkit-min-device-pixel-ratio: 2) { }
```

**移动优先设计**：
```css
/* 基础（手机）*/
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

---

### 5.2 单位系统 

```css
em        /* 相对父元素font-size */
rem       /* 相对根元素font-size（推荐）*/
vw/vh     /* 视口宽度/高度的1% */
%         /* 相对父元素 */

/* 响应式字体 */
html { font-size: 16px; }
h1 { font-size: 2rem; }  /* 32px */

@media (max-width: 768px) {
  html { font-size: 14px; }
  /* h1自动变为28px */
}
```

#### em vs rem
| 特性  | em   | rem  |
| --- | ---- | ---- |
| 参照  | 父元素  | 根元素  |
| 嵌套  | 会累积  | 不受影响 |
| 用途  | 组件内部 | 全局布局 |
|     |      |      |

---

### 5.3 移动端适配方案 

#### Rem方案
```javascript
// 动态设置根元素font-size
function setRem() {
  const baseSize = 16;
  const scale = document.documentElement.clientWidth / 375;
  document.documentElement.style.fontSize = baseSize * scale + 'px';
}
window.addEventListener('resize', setRem);
```

#### Vw方案（推荐）
```css
/* 750px设计稿，100px = 13.333vw */
.element { width: 13.333vw; }

/* 配合postcss-px-to-viewport自动转换 */
```

---

## 第六部分：高级特性

### 6.1 混合模式 

```css
background-blend-mode: multiply;  /* 正片叠底 */
mix-blend-mode: difference;       /* 差值 */
```

---

### 6.2 裁剪路径 

```css
clip-path: circle(50%);           /* 圆形 */
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);  /* 菱形 */
```

---

### 6.3 性能优化核心原理 

#### 只对以下属性做动画
```css
/* ✅ 触发GPU加速（性能好）*/
transform: translate / rotate / scale
opacity

/* ❌ 触发重排（性能差）*/
width, height, margin, padding, left, top
```

#### 重排与重绘
```
重排（Reflow）：元素几何属性变化，性能开销大
重绘（Repaint）：元素外观变化，性能开销小
关系：重排一定引起重绘，重绘不一定引起重排
```

**避免方案**：
```css
/* ❌ 性能差 */
@keyframes bad {
  from { left: 0; }
  to { left: 100px; }
}

/* ✅ 性能好 */
@keyframes good {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

#### Will-change提前优化
```css
.element {
  will-change: transform;  /* 动画前添加 */
}

.element.done {
  will-change: auto;  /* 动画后移除 */
}
```

---

## 第七部分：实用技巧

### 7.1 水平垂直居中（5种方法） 

```css
/* 方法1：Flex（推荐）*/
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法2：Grid */
.container {
  display: grid;
  place-items: center;
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

/* 方法5：单行文本 */
.parent {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```

---

### 7.2 文本溢出省略 

```css
/* 单行省略 */
.ellipsis-single {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 多行省略（Webkit）*/
.ellipsis-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;  /* 显示3行 */
  overflow: hidden;
}
```

---

### 7.3 固定宽高比容器 

```css
/* 方法1：padding-top百分比 */
.ratio-box {
  position: relative;
  width: 100%;
  padding-top: 56.25%;  /* 16:9 */
}

.ratio-box-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 方法2：aspect-ratio（现代）*/
.ratio-box {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

---

### 7.4 纯CSS三角形 

```css
/* 原理：利用border交界处是斜线 */
.triangle-up {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}
```

---

### 7.5 文字渐变色 

```css
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;  /* 回退 */
}
```

---

##  核心记忆口诀

```
【选择器】ID百类十标签一
【盒模型】IE盒子更好用（border-box）
【布局】Flex一维Grid二维
【动画】transform + opacity性能好
【响应式】rem全局em组件
【优化】避免重排用transform
```



# CSS 面试突击速记宝典

> ⚡ **30分钟速记** | **高频考点100%覆盖** | **经典题型精选** | **代码模板即用**

---

##  30秒电梯演讲

**面试官问："简单介绍一下CSS"**

**标准回答（背诵版）**：
```
CSS是层叠样式表，用于控制网页视觉呈现。
核心机制包括：
1. 选择器系统（优先级计算）
2. 盒模型（标准/IE、BFC）
3. 布局系统（Flexbox一维、Grid二维）
4. 视觉效果（圆角、阴影、渐变）
5. 动画系统（transform、transition、animation）
6. 响应式设计（媒体查询、rem/vw单位）

CSS3采用模块化设计，新增硬件加速、GPU渲染等性能优化。
```

---

## ⭐ 高频考点（必背）

### 考点1：CSS选择器优先级如何计算？⭐⭐⭐
**出现频率**：极高

**核心答案（3句话）**：
1. **计算公式**：`!important > 内联(1000) > ID(100) > 类/属性/伪类(10) > 标签/伪元素(1)`
2. **同级比较**：权重相同时，后定义的覆盖先定义的（层叠性）
3. **特殊情况**：`!important`最高但应避免滥用

**代码示例**：
```css
/* 权重：100+10+1 = 111 */
#nav .list li { color: red; }

/* 权重：10+10+1 = 21 */
.header .nav li { color: blue; }

/* red生效（111 > 21）*/
```

---

### 考点2：盒模型有哪两种？区别是什么？⭐⭐⭐
**出现频率**：极高

**核心答案**：
```
【标准盒模型】box-sizing: content-box（默认）
总宽度 = width + padding + border

【IE盒模型】box-sizing: border-box（推荐）
总宽度 = width（包含padding和border）

推荐全局设置：
*, *::before, *::after { box-sizing: border-box; }
```

---

### 考点3：什么是BFC？如何触发？作用是什么？⭐⭐⭐
**出现频率**：极高

**标准答案模板（是什么→触发条件→作用）**：
```
【是什么】
BFC（块级格式化上下文）是一个独立的渲染区域，
内部元素的布局不影响外部元素。

【如何触发】
overflow: hidden/auto/scroll（最常用）
display: flex/grid/inline-block
position: absolute/fixed
float: left/right
display: flow-root（现代方案）

【作用】
1. 解决margin塌陷
2. 清除浮动（解决高度塌陷）
3. 防止文字环绕
```

---

### 考点4：Flex布局中`flex: 1`是什么意思？⭐⭐⭐
**出现频率**：极高

**核心答案**：
```css
flex: 1;  /* 是以下三个属性的简写 */

/* 完整展开 */
flex-grow: 1;      /* 放大比例：占据剩余空间 */
flex-shrink: 1;    /* 缩小比例：空间不足时收缩 */
flex-basis: 0%;    /* 初始尺寸：不考虑内容宽度 */

/* 对比 */
flex: 1;     /* = 1 1 0% - 平均分配空间 */
flex: auto;  /* = 1 1 auto - 基于内容宽度分配 */
```

---

### 考点5：Flexbox和Grid的区别？如何选择？⭐⭐⭐
**出现频率**：高

**快速对比表**：

| 维度 | Flexbox | Grid |
|------|---------|------|
| 布局类型 | 一维（行或列）| 二维（行和列）|
| 适用场景 | 导航栏、列表、组件内部 | 页面整体布局 |
| 学习难度 | 简单 | 稍复杂 |

**选择口诀**：
```
组件内部 → Flexbox
页面布局 → Grid
不确定项目数量 → Flexbox
精确二维控制 → Grid
```

---

### 考点6：`position`有哪些值？区别是什么？⭐⭐⭐
**出现频率**：高

**核心答案**：
```css
static    /* 默认，正常文档流 */
relative  /* 相对自身原始位置偏移，占据原空间 */
absolute  /* 相对最近非static祖先，脱离文档流 */
fixed     /* 相对视口固定，脱离文档流 */
sticky    /* 粘性定位，滚动到阈值后固定 */
```

**经典组合：父相子绝**
```css
.parent { position: relative; }
.child { position: absolute; top: 0; right: 0; }
```

---

### 考点7：如何实现水平垂直居中？⭐⭐⭐
**出现频率**：极高

**必背3种方法**：
```css
/* 方法1：Flex（推荐，现代项目首选）*/
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法2：Grid */
.container {
  display: grid;
  place-items: center;
}

/* 方法3：绝对定位 + transform（兼容老浏览器）*/
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

---

### 考点8：重排（Reflow）和重绘（Repaint）的区别？⭐⭐⭐
**出现频率**：高

**核心答案（3句话）**：
```
1. 重排：元素几何属性变化（位置、尺寸），触发整个渲染树重新计算，性能开销大
2. 重绘：元素外观变化（颜色、背景），不影响布局，性能开销小
3. 关系：重排一定引起重绘，重绘不一定引起重排

【避免方案】
使用transform代替left/top
使用opacity代替visibility
合并样式修改（cssText）
```

---

### 考点9：CSS动画性能优化原则？⭐⭐⭐
**出现频率**：高

**核心答案（必背）**：
```
【黄金原则】只对以下属性做动画

✅ transform（translate、rotate、scale）
✅ opacity

❌ width、height、margin、padding、left、top

【原因】
transform和opacity只触发合成（Composite），走GPU加速
其他属性触发重排（Reflow）或重绘（Repaint），走CPU，性能差

【代码对比】
❌ animation: left 1s;  /* 每帧重排，卡顿 */
✅ animation: translateX 1s;  /* GPU加速，流畅 */
```

---

### 考点10：伪类和伪元素的区别？⭐⭐⭐
**出现频率**：中

**核心答案（3句话）**：
```
1. 伪类：选择处于特定状态的元素（如:hover），用单冒号
2. 伪元素：创建不存在于DOM的元素（如::before），用双冒号
3. 本质区别：伪类是"筛选条件"，伪元素是"创建内容"

【代码示例】
a:hover { }        /* 伪类：悬停状态的链接 */
p::before { }      /* 伪元素：在p前插入内容 */
```

---

### 考点11：媒体查询的常用断点？⭐⭐
**出现频率**：中

**移动优先断点（必背）**：
```css
/* 基础样式（手机，< 576px）*/
.container { width: 100%; }

/* 小型设备（≥ 576px）*/
@media (min-width: 576px) { }

/* 平板（≥ 768px）*/
@media (min-width: 768px) { }

/* 桌面（≥ 1024px）*/
@media (min-width: 1024px) { }

/* 大屏（≥ 1200px）*/
@media (min-width: 1200px) { }
```

---

### 考点12：em和rem的区别？⭐⭐
**出现频率**：中

**快速对比**：

| 特性  | em           | rem          |
| --- | ------------ | ------------ |
| 参照  | 父元素font-size | 根元素font-size |
| 嵌套  | 会累积计算        | 不受影响         |
| 用途  | 组件内部相对尺寸     | 全局统一布局       |

**使用建议**：
```css
/* rem用于布局 */
.container { max-width: 75rem; }

/* em用于组件内部 */
.button {
  font-size: 1rem;
  padding: 0.5em 1em;  /* 相对按钮自身字体 */
}
```

---

### 考点13：如何实现响应式字体？⭐⭐
**出现频率**：中

**现代方案（必背）**：
```css
/* 使用clamp()函数 */
.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* 最小1.5rem，理想4vw，最大3rem */
}

/* 传统方案 */
html { font-size: 16px; }
@media (max-width: 768px) {
  html { font-size: 14px; }
}
```

---

### 考点14：CSS变量如何使用？⭐⭐
**出现频率**：中

**核心用法**：
```css
/* 定义 */
:root {
  --primary-color: #3498db;
}

/* 使用 */
.button {
  background: var(--primary-color);
  /* 带默认值 */
  color: var(--text-color, #333);
}

/* JavaScript操作 */
document.documentElement.style
  .setProperty('--primary-color', 'red');
```

---

### 考点15：`:nth-child()`和`:nth-of-type()`的区别？⭐⭐
**出现频率**：中

**实例对比**：
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

/* :nth-of-type(2) - 第2个p元素 */
p:nth-of-type(2) { }  /* ✅ 匹配"段落2" */
```

---

##  经典面试题（10道精选）

### 题目1：实现三栏布局（固定-自适应-固定）⭐⭐⭐

**思路**：左右固定宽度，中间自适应占满剩余空间

**方案1：Flexbox（推荐）**
```css
.container {
  display: flex;
}
.left { flex: 0 0 200px; }   /* 固定200px */
.main { flex: 1; }            /* 自适应 */
.right { flex: 0 0 150px; }   /* 固定150px */
```

**方案2：Grid**
```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 150px;
}
```

**方案3：浮动（传统）**
```css
.left { float: left; width: 200px; }
.right { float: right; width: 150px; }
.main { margin: 0 150px 0 200px; }
```

---

### 题目2：如何实现单行/多行文本溢出省略？⭐⭐⭐

**单行省略（兼容性好）**：
```css
.ellipsis-single {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

**多行省略（Webkit内核）**：
```css
.ellipsis-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;  /* 显示3行 */
  overflow: hidden;
}
```

---

### 题目3：用纯CSS实现三角形⭐⭐

**思路**：利用border交界处是斜线的特性

**答案**：
```css
.triangle-up {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}

/* 其他方向 */
.triangle-down {
  border-top: 100px solid red;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
}
```

---

### 题目4：实现固定宽高比的容器（如16:9）⭐⭐

**方案1：padding-top百分比（兼容性好）**
```css
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

**方案2：aspect-ratio（现代浏览器）**
```css
.ratio-box {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

---

### 题目5：如何清除浮动？⭐⭐

**方案1：伪元素（推荐）**
```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

**方案2：触发BFC**
```css
.container {
  overflow: hidden;  /* 或 auto */
}
```

**方案3：Flexbox（现代方案）**
```css
.container {
  display: flex;  /* 自动清除浮动 */
}
```

---

### 题目6：实现一个Loading旋转动画⭐⭐

**思路**：使用@keyframes定义旋转动画，animation应用

**答案**：
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

---

### 题目7：实现文字渐变色效果⭐⭐

**思路**：使用background-clip: text裁剪背景

**答案**：
```css
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;  /* 回退方案 */
}
```

---

### 题目8：实现毛玻璃效果（Glassmorphism）⭐⭐

**思路**：使用backdrop-filter模糊背景

**答案**：
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

### 题目9：移动端适配方案有哪些？⭐⭐

**思路**：rem/vw/媒体查询/Flexbox

**答案（3种方案对比）**：

**方案1：Rem + JS动态计算**
```javascript
function setRem() {
  const baseSize = 16;
  const scale = document.documentElement.clientWidth / 375;
  document.documentElement.style.fontSize = baseSize * scale + 'px';
}
window.addEventListener('resize', setRem);
```

**方案2：Vw单位（推荐）**
```css
/* 750px设计稿，100px = 13.333vw */
.element { width: 13.333vw; }
```

**方案3：媒体查询断点**
```css
@media (min-width: 768px) { /* 平板 */ }
@media (min-width: 1024px) { /* 桌面 */ }
```

---

### 题目10：如何优化CSS性能？⭐⭐

**答案（5个维度）**：

**1. 选择器优化**
```css
/* ❌ 避免 */
* { }  /* 通配符 */
.nav ul li a span { }  /* 过深嵌套 */

/* ✅ 推荐 */
.nav-link { }  /* 类选择器 */
```

**2. 减少重排重绘**
```css
/* ✅ 使用transform代替left/top */
.move { transform: translateX(100px); }
```

**3. 硬件加速**
```css
.accelerated {
  transform: translateZ(0);
  will-change: transform;
}
```

**4. 避免昂贵属性**
```css
/* 慎用大模糊半径 */
box-shadow: 0 0 50px rgba(0,0,0,0.5);
filter: blur(20px);
```

**5. 压缩CSS**
- 移除无用代码（PurgeCSS）
- 合并相同规则
- 使用cssnano压缩

---

## 核心代码模板（直接背诵）

### 模板1：Flex水平垂直居中
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 模板2：Grid响应式布局
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

### 模板3：清除浮动
```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### 模板4：单行省略号
```css
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

### 模板5：多行省略号
```css
.ellipsis-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

### 模板6：固定宽高比
```css
.ratio-16-9 {
  aspect-ratio: 16 / 9;  /* 现代 */
  /* 或 */
  padding-top: 56.25%;  /* 兼容 */
}
```

### 模板7：旋转Loading
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loader {
  animation: spin 1s linear infinite;
}
```

### 模板8：媒体查询断点
```css
/* 移动优先 */
@media (min-width: 768px) { /* 平板 */ }
@media (min-width: 1024px) { /* 桌面 */ }
```

---

## 面试终极秘籍

### 回答技巧

**标准答题框架（STAR法则）**：
```
S（Situation）- 是什么
T（Task）- 为什么用
A（Action）- 怎么实现
R（Result）- 优缺点
```

**示例：面试官问"什么是BFC"**
```
S：BFC是块级格式化上下文，一个独立的渲染区域
T：用于解决margin塌陷、清除浮动、防止文字环绕
A：通过overflow: hidden、display: flex等触发
R：优点是简单有效，缺点是可能产生副作用（如隐藏溢出内容）
```

---

### 加分项

**提到这些会让面试官眼前一亮**：
- ✅ 性能优化：transform优于left/top
- ✅ 现代特性：Grid、aspect-ratio、clamp()
- ✅ 工程化：PostCSS、PurgeCSS、CSS Modules
- ✅ 实战经验：解决过的兼容性问题、优化过的性能瓶颈

---

### 高频追问清单

**当你回答完一个问题，面试官可能会追问**：

1. 讲完Flex → 追问："Flex和Grid的区别？"
2. 讲完BFC → 追问："如何触发BFC？有什么副作用？"
3. 讲完position → 追问："sticky不生效的原因？"
4. 讲完动画 → 追问："如何优化动画性能？"
5. 讲完居中 → 追问："还有其他方法吗？各有什么优缺点？"

**应对策略**：主动提前说明相关知识点，展示知识广度

---

## ⚡ 考前30分钟速记清单

```
【必背公式】
优先级：!important > 内联1000 > ID100 > 类10 > 标签1

【必背概念】
BFC：独立渲染区域，解决margin塌陷、清除浮动

【必背区别】
Flex一维 vs Grid二维
em父元素 vs rem根元素
重排改几何 vs 重绘改外观

【必背性能】
只对transform和opacity做动画

【必背布局】
Flex居中：justify-content + align-items
Grid居中：place-items: center

【必背技巧】
单行省略：nowrap + overflow + ellipsis
多行省略：-webkit-box + line-clamp
```

---

## 面试心态调整

1. **不要慌**：不会的题目直接说"这个我了解不深，但我知道相关的XXX"
2. **主动引导**：把话题引到你擅长的领域
3. **举例说明**：每个概念都配上实际项目经验
4. **承认不足**：诚实地说"这个我还需要学习"比瞎编强100倍

---

**最后的话**：面试不是背题，而是展示你的学习能力和解决问题的思路。保持自信，祝你成功！
