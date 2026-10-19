
### **半透明背景 - hsla 和 rgba**
```css
/* hsla: 色相、饱和度、亮度、透明度 */
background: hsla(0, 0%, 100%, .85);
/* hsla(色相, 饱和度, 亮度, 透明度)
   色相: 0（红色）
   饱和度: 0%（无饱和，灰色）
   亮度: 100%（最亮，白色）
   透明度: 0.85（85% 不透明）
   
   结果：半透明白色
*/

/* rgba: 红、绿、蓝、透明度 */
background: rgba(255, 255, 255, 0.85);
/* rgba(红, 绿, 蓝, 透明度)
   红: 255
   绿: 255
   蓝: 255
   透明度: 0.85
   
   结果：半透明白色（与 hsla(0,0%,100%,.85) 相同）
*/

/* 其他半透明颜色示例 */
/* 半透明黑色 */
background: rgba(0, 0, 0, 0.5);
background: hsla(0, 0%, 0%, 0.5);

/* 半透明橙色 */
background: rgba(237, 106, 30, 0.7);

/* 半透明灰色 */
background: rgba(128, 128, 128, 0.3);

/* 应用场景：
   1. 底部操作栏背景
   2. 遮罩层背景
   3. 悬浮卡片背景
   4. 模糊效果背景
*/
```


英文翻译文本通常比中文更长，导致 `.content` 容器撑大，从而压缩了同行的图片容器。通过在 `.service-item .content` 中添加 `flex: 1` 和 `min-width: 0`，强制内容区在溢出时进行收缩或截断，避免其挤压同行的图片容器，从而解决了图片变小的问题。

#### 1. 为什么要使用 `rem` 做移动端适配？

**答案**：`rem` 单位相对于根元素，通过动态修改根元素的 `font-size`，可以轻松实现页面整体布局的等比缩放，适应手机屏幕的多样化尺寸，避免使用 `px` 导致的大屏显示过小、小屏显示过大的布局失调问题。

#### 2. 代码中的 `html { font-size: 100px }` 是什么设计目的？

**答案**：这是为了方便换算。将基准值设为 100px 后，`1rem` 就等于 `100px`。那么在设计稿中量出的 `16px` 大小，直接写成 `.16rem` 即可，极大降低了手动换算计算成本。

#### 3. 现在的开发环境中，还有比 `rem` 更好的移动端适配方案吗？

**答案**：有。现代移动端适配主流倾向于使用 **`vw/vh` 单位**。`vw` 是相对于视口宽度的百分比，无需通过 CSS 媒体查询动态调整根元素大小，代码更简洁，适配度更精准。

#### 4. 什么是“视口（Viewport）”，它对响应式适配有什么影响？

**答案**：视口是浏览器中可见页面的区域。移动端适配必须设置 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`，否则浏览器会模拟桌面端宽度渲染网页，导致适配失效。它是实现所有响应式适配的基础。

## 二、两栏布局

两栏布局非常常见，往往是以一个定宽栏和一个自适应的栏并排展示存在
实现思路也非常的简单：

### flex弹性布局


```html

<style>

    .box{

        display: flex;

    }

    .left {

        width: 100px;

    }

    .right {

        flex: 1;

    }

</style>

<div class="box">

    <div class="left">左边</div>

    <div class="right">右边</div>

</div>

```

  

`flex`可以说是最好的方案了，代码少，使用简单

注意的是，`flex`容器的一个默认属性值:`align-items: stretch;`


这个属性导致了列等高的效果。 为了让两个盒子高度自动，需要设置: `align-items: flex-start`


## 三、三栏布局

  

### 使用flex实现

  

利用`flex`弹性布局，可以简单实现中间自适应

  

代码如下：

  

```html

  

<style type="text/css">

    .wrap {

        display: flex;

        justify-content: space-between;

    }

  

    .left,

    .right,

    .middle {

        height: 100px;

    }

  

    .left {

        width: 200px;

        background: coral;

    }

  

    .right {

        width: 120px;

        background: lightblue;

    }

  

    .middle {

        background: #555;

        width: 100%;

        margin: 0 20px;

    }

</style>

<div class="wrap">

    <div class="left">左侧</div>

    <div class="middle">中间</div>

    <div class="right">右侧</div>

</div>

```

  

实现过程：

  

- 仅需将容器设置为`display:flex;`，

- 盒内元素两端对其，将中间元素设置为`100%`宽度，或者设为`flex:1`，即可填充空白

- 盒内元素的高度撑开容器的高度

  

优点：

  

- 结构简单直观

- 可以结合 flex的其他功能实现更多效果，例如使用 order属性调整显示顺序，让主体内容优先加载，但展示在中间

  
  

### grid网格布局

  

代码如下：

  

```html

<style>

    .wrap {

        display: grid;

        width: 100%;

        grid-template-columns: 300px auto 300px;

    }

  

    .left,

    .right,

    .middle {

        height: 100px;

    }

  

    .left {

        background: coral;

    }

  

    .right {

        background: lightblue;

    }

  

    .middle {

        background: #555;

    }

</style>

<div class="wrap">

    <div class="left">左侧</div>

    <div class="middle">中间</div>

    <div class="right">右侧</div>

</div>

```


### 文本内容只显示2行
```css
 // 确保rich-text内部的样式不会撑开容器
  /deep/ * {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  
  //1行
  {
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;  
  }


                
```