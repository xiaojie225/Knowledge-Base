# CSS 完整知识库 

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
[attr^="value"]  /* 以...开头 */ a[href^="https"]{color: green;} 
[attr$="value"]  /* 以...结尾 */ a[href$=".com"]{color: red;}
[attr*="value"]  /* 包含... */ a[href*="example"]{color: blue;}
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

  /* 主轴方向 row是水平，column是垂直 */
  flex-direction: row | column; 

  /* 换行 nowrap是不换行，wrap是换行 */
  flex-wrap: nowrap | wrap;

  /* 主轴对齐 flex-start是左对齐，flex-end是右对齐，center是居中对齐，space-between是平均分布对齐 */
  justify-content: flex-start | center | space-between;

  /* 交叉轴对齐 stretch是拉伸对齐，center是居中对齐，flex-start是左对齐，flex-end是右对齐 */
  align-items: stretch | center | flex-start;

  /* 间距（推荐）*/
  gap: 10px;
}
```

#### 项目属性核心
```css
.item {
  /* flex简写：grow shrink basis  1是放大比例，0是缩小比例，200px是初始尺寸 */
  flex: 1; 

  flex-grow: 1;      /* 放大比例（默认0不放大）*/
  flex-shrink: 0;    /* 即使空间不足，也不会缩小 */
/* flex-shrink: 1 - 默认值，元素可收缩 */
/* flex-shrink: 2 - 收缩比例为 2 */
 
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


---

### 2.4 Grid布局 

#### 容器属性核心
```css
.container {
  display: grid;

  /* 定义列 */
  grid-template-columns: 200px 1fr 200px;  /* 固定-自适应-固定 */
  grid-template-columns: repeat(3, 1fr);   /* 三等分 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  /* 无需媒体查询 响应式 */

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
border-top-left-radius: 40px;     /* 左上角角径 */
border-top-right-radius: 40px;    /* 右上角角径 */
```
---

### 3.2 阴影效果 

```css
/* 盒阴影 */
box-shadow: h-offset v-offset blur spread color inset;
/*第1个是水平偏移 第2个是垂直偏移 第3个是模糊半径 第4个是扩展半径 第5个是颜色 rgba(红,绿,蓝,透明度) */
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
/* 线性渐变 从右到左，红色到蓝色，50%黄色到100%蓝色，100%透明 */
background: linear-gradient(to right, red, blue);
/* degree 角度 45度 */
background: linear-gradient(45deg, red 0%, yellow 50%, blue 100%);

/* 径向渐变 conic是圆形 */
background: radial-gradient(circle, red, blue);

/* 对角线渐变 */
background: linear-gradient(to bottom right, #FF6B4A, #FF8F6B);

/* 多色渐变 */
background: linear-gradient(to right, #FF6B4A, #FF8F6B, #FFA07A);

/* 重复渐变（条纹背景）*/
background: repeating-linear-gradient(
  90deg,
  #f0f0f0 0px,
  #f0f0f0 50px,
  #e0e0e0 50px,
  #e0e0e0 100px
);

/* 背景图片相对于视口固定，页面滚动时背景图不会随之滚动。*/
background-attachment: fixed 
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
transform: translateZ(50px);        /* 位移 Z轴 */
transform: rotateX(45deg) rotateY(45deg); /* 旋转 X轴 Y轴 */
transform: perspective(500px) rotateY(45deg);  /* 透视 Y轴 45度 */

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
/* 完整语法 property是属性名 duration是时间间隔 timing-function是时间函数, delay是延迟时间 */
transition: property duration timing-function delay;

/* 示例 所有属性 3秒  ease-in-out 0延迟 */
transition: all 0.3s ease-in-out;

/* 时间函数 */
ease          /* 慢-快-慢（默认）*/
linear        /* 匀速 */
ease-in       /* 慢-快 */
ease-out      /* 快-慢 */
cubic-bezier(0.42, 0, 0.58, 1)  /* 自定义 */
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
animation-name: slidein;             /* 动画名称 */
animation-duration: 2s;             /* 动画时间 */
animation-timing-function: ease;     /* 时间函数 */
animation-delay: 1s;                 /* 延迟时间 */
animation-iteration-count: infinite;  /* 或次数 */
animation-direction: alternate;       /* 往返 */
animation-fill-mode: forwards;        /* 保持结束状态 */
animation-play-state: paused;         /* 暂停 */
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


---

## 第七部分：实用技巧（核心代码模板（直接背诵））

### 水平垂直居中（5种方法） 

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

### 文本溢出省略 

```css
/* 单行省略 */
.ellipsis-single {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; /*显示省略号*/
}

/* 多行省略（Webkit）*/
.ellipsis-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;  /* 显示3行 */
  overflow: hidden;
}
```

### Grid响应式布局
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

### 清除浮动
```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### 垂直对齐
**核心原理**：将元素的 `line-height` 设置为与父容器高度相等的值，利用行高等于容器高的特性使单行文本垂直居中。
**适用场景**：单行文本、按钮内文字等
```css
.container {
     height: 200px;
     line-height: 200px;
 }
```

*   **单行文本**：优先使用 `line-height`。
*   **未知尺寸元素**：首选 **Flexbox** 或 **绝对定位 + `transform`**。
*   **多行文本**：首选 **Flexbox**，备选 `table-cell`（兼容旧浏览器）。
*   **现代项目/响应式布局**：强烈推荐 **Flexbox** 或 **Grid**，它们最灵活且易于维护。
*   **固定尺寸弹窗**：`绝对定位 + 负外边距` 或 `绝对定位 + margin: auto` 均可。



### 2.2 文本处理核心

**word-wrap / overflow-wrap**
```css
word-wrap: break-word;        /* 旧属性(兼容) */
overflow-wrap: break-word;    /* 标准属性(推荐) */
```
- 功能:允许长单词在边界处断行
- 应用:处理长URL、长英文单词

**white-space**
```css
normal    /* 默认:合并空白,自动换行 */
nowrap    /* 不换行,单行显示 */
pre       /* 保留所有空白和换行 */
pre-wrap  /* 保留空白,允许换行 */
pre-line  /* 合并空白,保留换行 */
```

**word-break**
```css
normal      /* 按语言规则断行 */
break-all   /* 任意位置断行(适合中文) */
keep-all    /* 只在空格处断行 */
break-word; /* 按单词换行 */
```
### 3.3 长内容处理策略
如何解决长URL或长单词破坏布局的问题
```css
.break-long-content {
    /* 方案1:强制断行 */
    word-wrap: break-word; 
    overflow-wrap: break-word;
    word-break: break-all;
  
    /* 方案2:隐藏溢出 */
    overflow: hidden; 
    text-overflow: ellipsis; /*  在文本溢出容器时显示省略号（… ）*/
  
    /* 方案3:滚动显示 */
    overflow-x: auto;
    white-space: nowrap;
}
```

```css
/* 全局推荐设置 */
* {
    box-sizing: border-box;
}
```


### 1. 六大水平居中方法对比

| 方法               | 适用元素类型 | 核心代码                                           | 优势     | 劣势           |
| ---------------- | ------ | ---------------------------------------------- | ------ | ------------ |
| **text-align**   | 内联/内联块 | `text-align: center`                           | 简单直观   | 影响所有内联内容     |
| **margin auto**  | 块级元素   | `margin: 0 auto` + `width`                     | 兼容性好   | 需明确宽度        |
| **绝对定位**         | 任意元素   | `left: 50%` + `transform: translateX(-50%)`    | 精确定位   | 需父元素relative |
| **Flexbox**      | 任意元素   | `display: flex` + `justify-content: center`    | 简洁强大   | IE10+支持      |
| **Grid**         | 任意元素   | `display: grid` + `place-items: center`        | 二维布局   | IE不支持        |
| **inline-block** | 块级元素   | `display: inline-block` + `text-align: center` | 保留内联特性 | 需父容器配合       |

### 2. 决策流程图

```
需要水平居中？
├─ 内联元素(文本/图片) → text-align: center
├─ 块级元素
│  ├─ 已知宽度 → margin: 0 auto
│  ├─ 未知宽度
│  │  ├─ 需要精确定位 → absolute + transform
│  │  ├─ 一维布局 → Flexbox
│  │  └─ 二维布局 → Grid
│  └─ 需要保持内联特性 → inline-block + text-align
└─ 多元素同时居中 → Flexbox/Grid
```

### 1. 视口单位定义
#### （1）视口概念
- **定义**：浏览器显示网页的可见区域
- **不包含**：工具栏、滚动条、地址栏
- **JavaScript获取**：`window.innerWidth` / `window.innerHeight`
- **移动端关键**：`<meta name="viewport" content="width=device-width, initial-scale=1.0">`

| 单位       | 含义               | 计算基准        | 核心特点       |
| -------- | ---------------- | ----------- | ---------- |
| **vw**   | Viewport Width   | 视口宽度的1%     | 随浏览器宽度等比缩放 |
| **vh**   | Viewport Height  | 视口高度的1%     | 随浏览器高度等比缩放 |
| **vmin** | Viewport Minimum | 视口宽高中较小值的1% | 保证元素不溢出    |
| **vmax** | Viewport Maximum | 视口宽高中较大值的1% | 确保视觉冲击力    |

### 2. 计算示例
```
视口尺寸：1000px(宽) × 800px(高)

1vw = 10px      (1000 ÷ 100)
1vh = 8px       (800 ÷ 100)
1vmin = 8px     (min(1000,800) ÷ 100)
1vmax = 10px    (max(1000,800) ÷ 100)
```

### 3. 与百分比的本质区别

| 对比项 | 百分比(%) | 视口单位(vw/vh) |
|--------|----------|----------------|
| 参照对象 | **父元素**尺寸 | **浏览器视口**尺寸 |
| 嵌套影响 | 受父级影响 | 不受父级影响 |
| 响应式 | 间接响应 | 直接响应视口 |

#### clamp()函数（最现代）
**clamp()语法**：`clamp(最小值, 理想值, 最大值)` 限制字体范围
```css
html {
    /* 语法：clamp(最小值, 理想值, 最大值) */
    font-size: clamp(86px, 26.67vw, 110px);
    /*
    - 最小86px (iPhone5)
    - 理想26.67vw (375px设备时100px)
    - 最大110px (iPhone6 Plus)
    */
}

/* 组件级别也可使用clamp */
.title {
    font-size: clamp(0.24rem, 0.32rem, 0.4rem);
    /* 最小24px，理想32px，最大40px */
}
```

| 单位        | 使用场景      | 典型案例           |
| --------- | --------- | -------------- |
| **px**    | 固定尺寸，不需缩放 | 边框、小图标、阴影      |
| **rem**   | 主体文本，全局缩放 | body字体、模块尺寸、间距 |
| **em**    | 组件内部相对缩放  | 按钮padding、图标大小 |
| **%**     | 基于父容器流式布局 | 网格列宽、图片宽度      |
| **vw/vh** | 视口关联，流体缩放 | 大标题、全屏区块       |
| **vmin**  | 保持宽高比不溢出  | 头像、移动端图标       |
| **vmax**  | 最大视觉冲击力   | 背景装饰、大型图案      |
#### （1）rem vs px vs em 核心区别

```css
html { font-size: 100px; }
.parent { font-size: 20px; }

.child-rem { font-size: 1rem; }   /* 100px - 基于html */
.child-em { font-size: 1em; }     /* 20px - 基于parent */
.child-px { font-size: 16px; }    /* 16px - 绝对值 */
```

#### （3）rem适配原理

**设计稿到实际设备的转换逻辑**：

```css
设计稿：750px宽
目标设备：iPhone6 (375px)
倍率：750 / 375 = 2倍图

设计稿元素32px → 实际显示 32 / 2 = 16px
```
**rem基准设置策略**：

```css
/* 策略1：基准100px（推荐，易计算） */
html { font-size: 100px; }
/* 设计稿750px，基准750/7.5=100px */
/* 设计稿32px → 32/100 = 0.32rem */

/* 策略2：基准10px（精确度高） */
html { font-size: 10px; }
/* 设计稿32px → 32/10 = 3.2rem */

/* 策略3：基准62.5%（兼容浏览器默认16px） */
html { font-size: 62.5%; }  /* 16px * 0.625 = 10px */
```

#### （2）常见设备断点参考

```css
/* 移动端主流断点 */
@media (max-width: 320px)  { /* iPhone5/SE */ }
@media (max-width: 375px)  { /* iPhone6/7/8/X */ }
@media (max-width: 414px)  { /* iPhone6 Plus */ }
@media (max-width: 768px)  { /* iPad竖屏 */ }
@media (max-width: 1024px) { /* iPad横屏 */ }
```

scrollbar-gutter: stable;预留滚动条位置
overflow-y: scroll; 显示滚轮条

# 其他

<style lang="scss"></style>
1. **SCSS 是什么？**
    
    - **SCSS (Sassy CSS)** 是 **Sass** 的一种语法格式。
    - 它本质上是 CSS 的“超集”。这意味着**所有的标准 CSS 代码在 SCSS 中都是合法的**，同时它增加了 CSS 原生不支持的强大功能。
2. **为什么要用它？**
    
    - CSS 本身非常简单，但缺乏逻辑。SCSS 允许你像写编程语言一样写样式：
        - **变量 (Variables)**：可以定义颜色、字体大小，全站统一修改（例如：`$primary-color: #007bff;`）。
        - **嵌套 (Nesting)**：CSS 选择器可以层级嵌套，结构更清晰（例如：`.header { .nav { color: red; } }`）。
        - **混合宏 (Mixins)**：可以将一段复杂的样式封装成一个函数，在多处重复使用。
        - **运算**：支持简单的数学运算。

### **透明度 - opacity**
```css
/* opacity: 设置元素透明度，0-1 之间 */
.blueykes {
  width: 70rpx;
  opacity: 0;      /* 完全透明（不可见） */
}

/* 其他值：
   opacity: 0.5;   半透明
   opacity: 1;     完全不透明（默认值）
   opacity: 0.3;   30% 不透明度
*/

/* 与 visibility 和 display 的区别：
   opacity: 0;       隐藏但占位，可点击
   visibility: hidden;  隐藏但占位，不可点击
   display: none;    隐藏且不占位
*/
```

### **层级控制 - z-index**
```css
/* z-index: 设置元素堆叠顺序，数值越大越在上层 */
.mask_layer {
  background: #0000006a;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;  /* 层级 999，显示在最上层 */
}

/* 注意事项：
   1. 必须配合 position 使用（relative/absolute/fixed）
   2. 父元素的 z-index 会影响子元素
   3. 数值越大，层级越高
   4. 常用层级规划：
      - 普通元素: 1-99
      - 弹窗遮罩: 100-999
      - 模态框: 1000-9999
      - 通知消息: 10000+
*/
```

### **颜色十六进制透明度**
```css
/* 十六进制颜色 + 透明度 */
.mask_layer {
  background: #0000006a;  /* 黑色 + 透明度 */
}

/* 格式：#RRGGBBAA
   RR: 红色值 (00-FF)
   GG: 绿色值 (00-FF)
   BB: 蓝色值 (00-FF)
   AA: 透明度 (00-FF)
   
   透明度对照：
   00 = 0%   完全透明
   3D = 25%
   6A = 42%
   80 = 50%
   BD = 75%
   FF = 100% 完全不透明
*/

/* 其他写法：
   rgba(0, 0, 0, 0.42)  等价于 #0000006a
   rgba(255, 255, 255, 0.5)  半透明白色
*/
```


### **删除线样式 - text-decoration**

```css
/* text-decoration: line-through - 删除线（原价样式） */
.old_price {
  text-decoration: line-through;  /* 添加删除线 */
  color: #ccc;                    /* 灰色文字 */
}

/* text-decoration 值：
   none: 无装饰（默认）
   underline: 下划线
   overline: 上划线
   line-through: 删除线
   
   应用场景：
   1. 原价显示（折扣价对比）
   2. 已完成的任务
   3. 已删除的内容
   4. 无效的选项
*/
```