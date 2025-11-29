# Flexbox 骰子布局 

## 日常学习模式

### 一、核心原理

**Flexbox 布局机制**
- 将容器设为弹性盒子(`display: flex`)，子元素自动成为弹性项目
- 主轴(默认水平)和交叉轴(垂直)控制元素分布
- 容器属性控制整体布局，项目属性控制单个元素

**骰子3点布局原理**
```
┌─────────────┐
│ ●           │  ← 第1个点(默认位置)
│      ●      │  ← 第2个点(align-self: center)
│           ● │  ← 第3个点(align-self: flex-end)
└─────────────┘
```

### 二、关键属性详解

**容器属性**
- `display: flex` - 启用弹性布局
- `justify-content: space-between` - 主轴首尾对齐，中间均分空间
- `flex-direction` - 主轴方向(默认row)

**项目属性**
- `align-self: center` - 单个项目在交叉轴居中
- `align-self: flex-end` - 单个项目在交叉轴末尾
- 优先级高于容器的`align-items`

### 三、核心代码示例

```javascript
/**
 * 骰子布局核心实现
 * @description 使用Flexbox实现经典三点骰子布局
 */

// HTML结构
const diceHTML = `
<div class="box">
  <span class="item"></span>
  <span class="item"></span>
  <span class="item"></span>
</div>
`;

// 核心CSS
const diceStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between', // 水平分布
    width: '200px',
    height: '200px',
  },
  dot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  // 通过伪代码表示nth-child选择器
  secondDot: {
    alignSelf: 'center', // 垂直居中
  },
  thirdDot: {
    alignSelf: 'flex-end', // 垂直底部
  }
};

/**
 * 扩展:实现不同点数的骰子
 * @param {number} dots - 骰子点数(1-6)
 * @returns {string} 对应的CSS类名
 */
function getDiceLayout(dots) {
  const layouts = {
    1: 'center-single',
    2: 'diagonal-two',
    3: 'diagonal-three', // 当前实现
    4: 'corners-four',
    5: 'center-plus-four',
    6: 'two-columns'
  };
  return layouts[dots];
}
```

### 四、使用场景

**直接应用**
- 游戏UI(骰子、麻将、棋牌)
- 状态指示器(3级评分)
- 图标设计(特定点位分布)

**扩展应用**
- 响应式网格布局基础
- 组件库布局模式
- 数据可视化散点图

### 五、实用技巧

**响应式适配**
```css
.box {
  width: min(200px, 80vw);  /* 移动端自适应 */
  height: min(200px, 80vw);
}
```

**主题定制**
```css
.box {
  --dot-color: #666;
  --border-color: #ccc;
}
.item {
  background-color: var(--dot-color);
}
```

**性能优化**
```css
.box {
  contain: layout style paint;  /* 隔离渲染 */
}
```

---

## ⚡ 面试突击模式

### [Flexbox骰子布局] 面试速记

**30秒电梯演讲**
Flexbox骰子布局通过`display: flex`和`justify-content: space-between`实现水平分布,再用`align-self`属性控制每个点的垂直位置,形成左上-中心-右下的对角线分布。核心优势是代码简洁、响应式强、易维护,相比定位布局更符合现代CSS理念。

### 高频考点(必背)

**考点1: justify-content: space-between原理**
在主轴上分布flex项目:首项贴起始边,末项贴结束边,中间项均分剩余空间。骰子中实现左-中-右水平分布。

**考点2: align-self作用**
覆盖容器align-items设置,控制单个项目在交叉轴的对齐。第2个点`center`垂直居中,第3个点`flex-end`置底,形成对角线。

**考点3: Flexbox vs Position定位**
Flex优势:响应式适配、代码简洁、维护性强、语义化好。Position优势:精确控制、脱离文档流。布局选Flex,特殊定位选Position。

**考点4: 一维vs二维布局**
Flexbox擅长一维布局(单行/列),Grid擅长二维布局(行列同时控制)。骰子3点用Flex更简洁,6点规则排列用Grid更合适。

**考点5: 响应式最佳实践**
用`min(固定值, 视窗单位)`确保移动端适配,如`width: min(200px, 80vw)`,结合CSS变量实现主题切换。

### 经典面试题

**题目1: 实现骰子5点布局**
```javascript
/**
 * 骰子5点布局实现
 * 思路: 四角4个点 + 中心1个点
 */
const fiveDotsCSS = `
.box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
}
.item:nth-child(3) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
`;
```

**题目2: 相比position定位的优势**
- 响应式:自动适应容器尺寸
- 维护性:逻辑清晰,改动简单
- 兼容性:现代浏览器全支持
- 灵活性:间距对齐易调整

**题目3: 移动端适配方案**
```css
/* 使用视窗单位 + min函数 */
.box {
  width: min(200px, 80vw);
  height: min(200px, 80vw);
}
.item {
  width: min(40px, 8vw);
  height: min(40px, 8vw);
}
```

**题目4: 主题色彩定制**
```javascript
/**
 * 使用CSS自定义属性
 */
const themeCSS = `
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
`;
```

**题目5: 3D翻转动画效果**
```javascript
/**
 * 纯CSS 3D翻转
 * 思路: perspective + transform-style + transition
 */
const animation3D = `
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
`;
```

**题目6: Grid实现方案对比**
```javascript
/**
 * Grid实现骰子3点
 * 思路: 3x3网格,精确指定位置
 */
const gridVersion = `
.box {
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
}
.item:nth-child(1) { grid-area: 1 / 1; }
.item:nth-child(2) { grid-area: 2 / 2; }
.item:nth-child(3) { grid-area: 3 / 3; }
`;

// 区别:Grid精确控制二维,Flex灵活适应一维
```

**题目7: 性能优化方案**
```javascript
/**
 * 大量渲染优化
 * 思路: contain隔离 + will-change提示 + 公共类复用
 */
const optimization = `
.box {
  contain: layout style paint;
  will-change: transform;
}
`;
```

**题目8: 实现6点布局**
```javascript
/**
 * 骰子6点:两列各3个点
 * 思路: flex-direction: column + 嵌套flex
 */
const sixDotsLayout = `
.box {
  display: flex;
  justify-content: space-between;
}
.column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
`;
```

**题目9: align-self默认值问题**
```javascript
/**
 * 为什么需要显式设置align-self?
 * 答案: 容器未设置align-items时,默认为stretch(拉伸)
 * 通过align-self覆盖默认行为,实现不同垂直位置
 */
```

**题目10: 动态生成骰子组件**
```javascript
/**
 * 动态骰子生成器
 * @param {number} dots - 点数(1-6)
 * @returns {HTMLElement} 骰子DOM元素
 */
function createDice(dots) {
  const box = document.createElement('div');
  box.className = 'box';

  const layouts = {
    1: [5], // 中心位置
    2: [1, 9], // 对角
    3: [1, 5, 9], // 对角+中心
    4: [1, 3, 7, 9], // 四角
    5: [1, 3, 5, 7, 9], // 四角+中心
    6: [1, 3, 4, 6, 7, 9] // 两列
  };

  for (let i = 1; i <= 9; i++) {
    if (layouts[dots].includes(i)) {
      const dot = document.createElement('span');
      dot.className = 'item';
      box.appendChild(dot);
    }
  }

  return box;
}
```

---

**关键记忆口诀**
- Flex布局记三点: 容器flex,主轴justify,交叉align
- 骰子布局记核心: space-between横分布,align-self纵定位
- 面试答题记结构: 原理→代码→优势→场景