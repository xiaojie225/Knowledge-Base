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



**简单介绍一下CSS"**
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

## 题目
### 考点1：CSS选择器优先级如何计算？⭐⭐⭐

**核心答案（3句话）**：
1. **计算公式**：`!important > 内联(1000) > ID(100) > 类/属性/伪类(10) > 标签/伪元素(1)`
2. **同级比较**：权重相同时，后定义的覆盖先定义的（层叠性）
3. **特殊情况**：`!important`最高但应避免滥用


### 考点2：盒模型有哪两种？区别是什么？⭐⭐⭐

**核心答案**：
```
【标准盒模型】box-sizing: content-box（默认）
总宽度 = width + padding + border

【IE盒模型】box-sizing: border-box（推荐）
总宽度 = width（包含padding和border）

推荐全局设置：
*, *::before, *::after { box-sizing: border-box; }
```


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
考点4：Flex布局中`flex: 1`是什么意思？⭐⭐⭐

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

### 1. `width: auto` 与 `width: 100%` 的区别是什么？
**答案**：
- `width: auto`：元素宽度根据内容和上下文自适应，不会超出父容器
- `width: 100%`：元素宽度始终等于父容器的内容宽度，可能因padding/border导致溢出
- `auto` 更智能，会考虑margin、border、padding的影响
### 2. `box-sizing: border-box` 与 `content-box` 的本质区别？
**答案**：
- **content-box**：width只包含内容，总宽度 = width + padding + border
- **border-box**：width包含内容+内边距+边框，总宽度 = width

### 4. offsetWidth、clientWidth、scrollWidth的区别？
**答案**：
- **offsetWidth** = border + padding + content
- **clientWidth** = padding + content（不含border）
- **scrollWidth** = 完整内容宽度（含滚动隐藏部分）


### 题目1：实现移动端rem适配

**要求**：设计稿750px，实现iPhone5(320px)、iPhone6(375px)、iPhone6 Plus(414px)的适配

**思路**：
1. 设置viewport
2. 计算各设备的HTML基准(宽度/7.5)
3. 使用媒体查询设置断点
4. 所有尺寸用rem单位

**代码框架**：
```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* 断点设置 */
        @media (max-width: 374px) {
            html { font-size: 86px; }  /* 320/7.5*2 */
        }
        @media (min-width: 375px) and (max-width: 413px) {
            html { font-size: 100px; } /* 375/7.5*2 */
        }
        @media (min-width: 414px) {
            html { font-size: 110px; } /* 414/7.5*2 */
        }
      
        * { box-sizing: border-box; }
        body { font-size: 0.16rem; }
        .title { font-size: 0.32rem; }
    </style>
</head>
</html>
```


### 题目2：设计稿转rem

**要求**：设计稿750px，HTML基准100px，转换以下尺寸
- 标题32px
- 按钮宽300px，高80px
- 内边距20px

**答案**：
```css
html { font-size: 100px; }

.title {
    font-size: 0.32rem;  /* 32 / 100 */
}
.button {
    width: 3rem;         /* 300 / 100 */
    height: 0.8rem;      /* 80 / 100 */
    padding: 0.2rem;     /* 20 / 100 */
}
```


---

# ：css3动画有哪些？

## 一、是什么

CSS动画（CSS Animations）是为层叠样式表建议的允许可扩展标记语言（XML）元素使用CSS的动画的模块

即指元素从一种样式逐渐过渡为另一种样式的过程

常见的动画效果有很多，如平移、旋转、缩放等等，复杂动画则是多个简单动画的组合

`css`实现动画的方式，有如下几种：

- transition 实现渐变动画
- transform 转变动画
- animation 实现自定义动画


## 二、实现方式

### transition 实现渐变动画

`transition`的属性如下：

- property:填写需要变化的css属性
- duration:完成过渡效果需要的时间单位(s或者ms)
- timing-function:完成效果的速度曲线
- delay: 动画效果的延迟触发时间

其中`timing-function`的值有如下：

| 值                            | 描述                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| linear                        | 匀速（等于 cubic-bezier(0,0,1,1)）                           |
| ease                          | 从慢到快再到慢（cubic-bezier(0.25,0.1,0.25,1)）              |
| ease-in                       | 慢慢变快（等于 cubic-bezier(0.42,0,1,1)）                    |
| ease-out                      | 慢慢变慢（等于 cubic-bezier(0,0,0.58,1)）                    |
| ease-in-out                   | 先变快再到慢（等于 cubic-bezier(0.42,0,0.58,1)），渐显渐隐效果 |
| cubic-bezier(*n*,*n*,*n*,*n*) | 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值 |

注意：并不是所有的属性都能使用过渡的，如`display:none<->display:block`

举个例子，实现鼠标移动上去发生变化动画效果

```html
<style>
       .base {
            width: 100px;
            height: 100px;
            display: inline-block;
            background-color: #0EA9FF;
            border-width: 5px;
            border-style: solid;
            border-color: #5daf34;
            transition-property: width, height, background-color, border-width;
            transition-duration: 2s;
            transition-timing-function: ease-in;
            transition-delay: 500ms;
        }

        /*简写*/
        /*transition: all 2s ease-in 500ms;*/
        .base:hover {
            width: 200px;
            height: 200px;
            background-color: #5daf34;
            border-width: 10px;
            border-color: #3a8ee6;
        }
</style>
<div class="base"></div>
```

### transform 转变动画

包含四个常用的功能：

- translate：位移
- scale：缩放
- rotate：旋转
- skew：倾斜

一般配合`transition`过度使用

注意的是，`transform`不支持`inline`元素，使用前把它变成`block`

举个例子

```html
<style>
    .base {
        width: 100px;
        height: 100px;
        display: inline-block;
        background-color: #0EA9FF;
        border-width: 5px;
        border-style: solid;
        border-color: #5daf34;
        transition-property: width, height, background-color, border-width;
        transition-duration: 2s;
        transition-timing-function: ease-in;
        transition-delay: 500ms;
    }
    .base2 {
        transform: none;
        transition-property: transform;
        transition-delay: 5ms;
    }

    .base2:hover {
        transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
    }
</style>
 <div class="base base2"></div>
```

可以看到盒子发生了旋转，倾斜，平移，放大



### animation 实现自定义动画

`animation`是由 8 个属性的简写，分别如下：

| 属性                                   | 描述                                                         | 属性值                                        |
| -------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| animation-duration                     | 指定动画完成一个周期所需要时间，单位秒（s）或毫秒（ms），默认是 0 |                                               |
| animation-timing-function              | 指定动画计时函数，即动画的速度曲线，默认是 "ease"            | linear、ease、ease-in、ease-out、ease-in-out  |
| animation-delay                        | 指定动画延迟时间，即动画何时开始，默认是 0                   |                                               |
| animation-iteration-count              | 指定动画播放的次数，默认是 1                                 |                                               |
| animation-direction 指定动画播放的方向 | 默认是 normal                                                | normal、reverse、alternate、alternate-reverse |
| animation-fill-mode                    | 指定动画填充模式。默认是 none                                | forwards、backwards、both                     |
| animation-play-state                   | 指定动画播放状态，正在运行或暂停。默认是 running             | running、pauser                               |
| animation-name                         | 指定 @keyframes 动画的名称                                   |                                               |

`CSS` 动画只需要定义一些关键的帧，而其余的帧，浏览器会根据计时函数插值计算出来，

通过 `@keyframes` 来定义关键帧

因此，如果我们想要让元素旋转一圈，只需要定义开始和结束两帧即可：

```css
@keyframes rotate{
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
}
```

`from` 表示最开始的那一帧，`to` 表示结束时的那一帧

也可以使用百分比刻画生命周期

```css
@keyframes rotate{
    0%{
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(180deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
```

定义好了关键帧后，下来就可以直接用它了：

```css
animation: rotate 2s;
```





## 三、总结

| 属性               | 含义                                                         |
| ------------------ | ------------------------------------------------------------ |
| transition（过度） | 用于设置元素的样式过度，和animation有着类似的效果，但细节上有很大的不同 |
| transform（变形）  | 用于元素进行旋转、缩放、移动或倾斜，和设置样式的动画并没有什么关系，就相当于color一样用来设置元素的“外表” |
| translate（移动）  | 只是transform的一个属性值，即移动                            |
| animation（动画）  | 用于设置动画属性，他是一个简写的属性，包含6个属性            |


