# Flexbox 骰子布局开发文档

[【CSS3】flex布局实践篇 | 骰子flex布局的出现解决了CSS长期以来缺乏的布局机制。 本期我们就来使用flex - 掘金](https://juejin.cn/post/7211420858212139068)
## 完整代码
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>flex 画骰子</title>
    <style type="text/css">
        .box {
            width: 200px;
            height: 200px;
            border: 2px solid #ccc;
            border-radius: 10px;
            padding: 20px;

            display: flex;
            justify-content: space-between;
        }
        .item {
            display: block;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #666;
        }
        .item:nth-child(2) {
            align-self: center;
        }
        .item:nth-child(3) {
            align-self: flex-end;
        }

    </style>
</head>
<body>
    <div class="box">
        <span class="item"></span>
        <span class="item"></span>
        <span class="item"></span>
    </div>
</body>
</html>
```
## 知识点总结

### 核心技术
- **Flexbox 布局**: 现代 CSS 布局方案，提供强大的对齐和分布控制
- **align-self 属性**: 允许单个 flex 项目覆盖容器的 align-items 设置
- **justify-content**: 控制主轴上 flex 项目的分布方式
- **CSS 选择器**: 使用 nth-child() 精确控制特定元素样式

### 关键属性解析

1. **display: flex**: 将容器设为 flex 容器
2. **justify-content: space-between**: 主轴上首尾对齐，中间平均分布
3. **align-self: center**: 第二个点在交叉轴居中
4. **align-self: flex-end**: 第三个点在交叉轴末尾对齐

### 布局原理
- 容器设置 `justify-content: space-between` 实现水平分布
- 通过 `align-self` 属性控制每个点的垂直位置
- 形成经典骰子"3点"布局：左上、中心、右下

## 用途场景

### 适用场景
- **游戏界面**: 骰子、棋盘游戏 UI 设计
- **图标设计**: 需要特定点位分布的图标
- **数据可视化**: 散点图、状态指示器
- **UI 组件**: 评分系统、进度指示器
- **响应式布局**: 不同屏幕尺寸下的自适应分布

### 扩展应用
- 可修改点的数量实现不同骰子面
- 结合 CSS 动画制作滚动效果
- 作为组件库中的基础布局模式

## 面试题目（作为面试官）

### 基础题目

**题目1**: 解释这个骰子布局中 `justify-content: space-between` 的作用原理？
**答案**: `justify-content: space-between` 在主轴（水平轴）上分布 flex 项目，第一个项目贴近起始边，最后一个项目贴近结束边，中间的项目平均分布剩余空间。在这个三点骰子中，实现了左、中、右的水平分布。

**题目2**: 为什么第二个和第三个 `.item` 需要使用 `align-self` 属性？
**答案**: `align-self` 允许单个 flex 项目覆盖容器的 `align-items` 默认值。由于容器没有设置 `align-items`，默认是 `stretch`。通过 `align-self: center` 和 `align-self: flex-end` 分别将第二个点垂直居中、第三个点置于底部，形成对角线分布。

**题目3**: 如果要实现骰子"5点"布局，需要如何修改代码？
**答案**: 需要添加两个点并修改布局：
```css
.box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
}
.item:nth-child(2), .item:nth-child(4) {
    align-self: flex-end;
}
.item:nth-child(3) {
    align-self: center;
    margin: auto;
}
```

**题目4**: 这种布局方式相比传统的 position 定位有什么优势？
**答案**: 
- **响应式**: 自动适应容器尺寸变化
- **维护性**: 代码更简洁，逻辑更清晰
- **灵活性**: 容易调整间距和对齐方式
- **兼容性**: 现代浏览器支持良好
- **语义化**: 更符合现代 CSS 布局理念

**题目5**: 如何让这个骰子布局在移动端也能良好显示？
**答案**: 
```css
.box {
    width: min(200px, 80vw);
    height: min(200px, 80vw);
    /* 其他属性保持不变 */
}
.item {
    width: min(40px, 8vw);
    height: min(40px, 8vw);
}
```
使用 `min()` 函数结合视窗单位，确保在小屏设备上合适显示。

### 进阶题目

**题目6**: 如何用纯 CSS 实现骰子的 3D 翻转动画效果？
**答案**: 使用 CSS 3D 变换：
```css
.dice-container {
    perspective: 1000px;
}
.box {
    transform-style: preserve-3d;
    transition: transform 1s;
}
.box:hover {
    transform: rotateX(90deg) rotateY(90deg);
}
```

**题目8**: 如何优化这个组件在大量渲染时的性能？
**答案**: 
- 使用 CSS `contain` 属性进行渲染优化
- 避免重复的样式计算，提取公共类
- 使用 `will-change` 提示浏览器优化
- 考虑虚拟滚动减少 DOM 节点

**题目9**: 如何让骰子点支持不同的主题色彩？
**答案**: 使用 CSS 自定义属性：
```css
.box {
    --dot-color: #666;
    --border-color: #ccc;
}
.item {
    background-color: var(--dot-color);
}
.box {
    border-color: var(--border-color);
}
```

**题目10**: 这个布局在 CSS Grid 中如何实现，两种方案的区别是什么？
**答案**: 
Grid 方案：
```css
.box {
    display: grid;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
}
.item:nth-child(1) { grid-area: 1 / 1; }
.item:nth-child(2) { grid-area: 2 / 2; }
.item:nth-child(3) { grid-area: 3 / 3; }
```
区别：Grid 更适合二维布局，Flexbox 更适合一维布局；Grid 提供精确的网格控制，Flexbox 更灵活适应内容。

[标签: Flexbox 骰子布局] display: flex, justify-content: space-between, align-self
