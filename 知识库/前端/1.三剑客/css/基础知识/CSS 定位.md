# CSS Position 定位 - 精华学习资料

## 日常学习模式

### 一、核心定位类型

#### 1. static（静态定位）
- **默认值**，按正常文档流排列
- 忽略 top/right/bottom/left/z-index
- 不创建层叠上下文
- **应用**：重置定位属性

#### 2. relative（相对定位）
- 相对于**自身原始位置**定位
- **仍占据原始空间**，不影响其他元素
- 创建定位上下文（z-index ≠ auto 时）
- **应用**：微调位置、作为 absolute 的参考容器

```css
.relative-box {
  position: relative;
  top: 20px;    /* 向下偏移 */
  left: 50px;   /* 向右偏移 */
  z-index: 1;
}
```

#### 3. absolute（绝对定位）
- 相对于**最近的 positioned 祖先**定位（position ≠ static）
- 无 positioned 祖先时，相对于初始包含块（body）
- **脱离文档流**，不占空间
- **应用**：悬浮元素、工具提示、下拉菜单、模态框

```css
/* 居中定位 */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 四角定位 */
.corner {
  position: absolute;
  top: 10px;
  right: 10px;
}
```

#### 4. fixed（固定定位）
- 相对于**视口**定位
- 脱离文档流，滚动时位置不变
- **应用**：固定导航栏、悬浮按钮、广告横幅

```css
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
```

#### 5. sticky（粘性定位）
- **relative + fixed 混合体**
- 滚动到阈值前为 relative，达到阈值后为 fixed
- **必须**指定 top/right/bottom/left 之一
- **应用**：智能导航、表格标题、侧边目录

```css
.sticky-header {
  position: sticky;
  top: 0;  /* 必需：粘住的位置 */
  z-index: 100;
}
```

### 二、关键概念

#### 包含块（Containing Block）
不同定位的参考系：

| 定位类型            | 包含块                    |
| --------------- | ---------------------- |
| static/relative | 最近块级祖先的内容区域            |
| absolute        | 最近 positioned 祖先的内边距边界 |
| fixed           | 视口                     |
| sticky          | 最近滚动祖先                 |

#### 层叠上下文（Stacking Context）
创建条件：
- position 为 absolute/relative/fixed/sticky 且 z-index ≠ auto
- opacity < 1
- transform ≠ none
- filter ≠ none

### 三、定位技巧

#### 1. 响应式定位
```css
.responsive {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 20vw;      /* 视口单位 */
  min-width: 100px; /* 最小值限制 */
}

@media (max-width: 768px) {
  .responsive {
    top: 5%;
    width: 30vw;
  }
}
```

#### 2. 多层嵌套定位
```css
.parent {
  position: relative; /* 创建定位上下文 */
}

.child {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
```

#### 3. 负值定位（溢出效果）
```css
.badge {
  position: absolute;
  top: -10px;
  right: -10px;
}
```

### 四、常见场景

#### 电商网站
- 促销标签：absolute
- 购物车图标：fixed
- 商品分类：sticky
- 对比浮层：absolute

#### 管理后台
- 侧边栏菜单：fixed
- 表格操作按钮：absolute
- 筛选面板：absolute
- 状态提示：fixed

---

## 面试突击模式

### [CSS Position] 面试速记

#### 30秒电梯演讲
CSS Position 控制元素定位方式，包含 5 种值：static 默认文档流、relative 相对自身偏移但仍占空间、absolute 相对 positioned 祖先脱离文档流、fixed 相对视口固定、sticky 滚动时智能粘住。核心是理解包含块、层叠上下文和文档流的关系。

---

### 高频考点（必背）

**考点1：五种定位类型的区别**
- static：默认值，忽略定位属性，按正常流排列
- relative：相对原位置偏移，仍占空间，可作定位上下文
- absolute：相对最近 positioned 祖先，脱离文档流
- fixed：相对视口，脱离文档流，滚动不变
- sticky：滚动阈值前 relative，阈值后 fixed

**考点2：包含块的判定规则**
static/relative 看最近块级祖先内容区，absolute 看最近 positioned 祖先内边距边界，fixed 看视口，sticky 看最近滚动祖先。决定了百分比和定位的计算参考。

**考点3：层叠上下文的创建条件**
position 非 static 且 z-index 非 auto、opacity < 1、transform/filter 非 none、flex/grid 子项且 z-index 非 auto、根元素等。子元素 z-index 只在同一层叠上下文内比较。

**考点4：relative 不影响布局的原因**
相对定位元素仍占据原始文档流空间，偏移只是视觉位置改变，不会导致其他元素重排，这是与 absolute 的本质区别。

**考点5：z-index 失效的场景**
元素 position 为 static、未创建层叠上下文、在不同层叠上下文中比较（父元素 z-index 更重要）、某些浏览器的 flex/grid 容器特殊处理。

---

### 经典面试题

#### 题目1：实现元素水平垂直居中（绝对定位方案）
**思路**：使用 absolute + transform 或 absolute + margin

```css
/**
 * 方法1：transform（推荐，无需知道宽高）
 */
.center-transform {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/**
 * 方法2：已知宽高时用 margin
 */
.center-margin {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 100px;
  margin: -50px 0 0 -100px; /* 负宽高的一半 */
}

/**
 * 方法3：现代布局（适合父容器为 flex/grid）
 */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

#### 题目2：实现固定顶部导航栏
**思路**：使用 fixed 定位，注意遮挡内容需加 padding

```css
/**
 * 固定导航栏
 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1000; /* 确保在最上层 */
}

/**
 * 为内容区域留出空间
 */
.main-content {
  padding-top: 60px; /* 与导航栏高度一致 */
}
```

---

#### 题目3：创建响应式绝对定位元素
**思路**：结合 vw/vh、百分比、媒体查询

```css
/**
 * 响应式绝对定位
 */
.responsive-box {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 20vw;
  height: 10vh;
  min-width: 100px;  /* 防止过小 */
  min-height: 50px;
}

/**
 * 移动端适配
 */
@media (max-width: 768px) {
  .responsive-box {
    top: 5%;
    right: 2%;
    width: 30vw;
    min-width: 80px;
  }
}
```

---

#### 题目4：实现粘性导航栏（sticky）
**思路**：sticky 需设置阈值，注意父容器 overflow 影响

```css
/**
 * 粘性导航
 */
.sticky-nav {
  position: sticky;
  top: 0; /* 必需：粘住位置的阈值 */
  background: #fff;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/**
 * 注意事项：
 * 1. 父容器不能设置 overflow: hidden/auto/scroll
 * 2. 需要有足够的滚动空间
 * 3. iOS Safari 可能需要 -webkit-sticky
 */
```

---

#### 题目5：实现多层嵌套定位
**思路**：子元素 absolute 参考最近的 positioned 祖先

```css
/**
 * 父容器创建定位上下文
 */
.card {
  position: relative;
  width: 300px;
  height: 200px;
}

/**
 * 子元素相对父容器定位
 */
.card-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  background: red;
  border-radius: 50%;
}

/**
 * 嵌套的孙元素
 */
.badge-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

---

#### 题目6：实现工具提示（Tooltip）
**思路**：使用 absolute 定位，配合伪元素实现箭头

```css
/**
 * 触发元素
 */
.tooltip-trigger {
  position: relative;
  display: inline-block;
}

/**
 * 提示框
 */
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: #333;
  color: #fff;
  border-radius: 4px;
  white-space: nowrap;
  margin-bottom: 8px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s;
}

/**
 * 箭头（伪元素）
 */
.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
}

/**
 * 悬停显示
 */
.tooltip-trigger:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
```

---

#### 题目7：实现模态框遮罩层
**思路**：fixed 全屏遮罩 + absolute 居中内容

```css
/**
 * 遮罩层
 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/**
 * 模态框内容
 */
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  z-index: 1001;
}
```

---

#### 题目8：管理 z-index 层级系统
**思路**：建立层级规范，动态计算嵌套层级

```javascript
/**
 * z-index 层级管理系统
 * @description 避免 z-index 混乱的最佳实践
 */

// CSS 层级规范
/*
.z-base { z-index: 1; }        // 基础内容
.z-dropdown { z-index: 100; }  // 下拉菜单
.z-sticky { z-index: 200; }    // 粘性元素
.z-fixed { z-index: 300; }     // 固定元素
.z-modal { z-index: 1000; }    // 模态框
.z-tooltip { z-index: 1100; }  // 工具提示
.z-toast { z-index: 1200; }    // 通知提示
*/

// JavaScript 动态管理嵌套模态框
let modalZIndex = 1000;

function openModal(element) {
  const backdrop = element.querySelector('.modal-backdrop');
  const content = element.querySelector('.modal-content');

  backdrop.style.zIndex = modalZIndex++;
  content.style.zIndex = modalZIndex++;
}
```

---

#### 题目9：解决 sticky 定位兼容性问题
**思路**：检测支持 + polyfill + 规避常见陷阱

```css
/**
 * 粘性定位最佳实践
 */
.sticky-element {
  position: -webkit-sticky; /* Safari 兼容 */
  position: sticky;
  top: 0;
}

/* 确保父容器没有 overflow 属性 */
.sticky-container {
  /* overflow: hidden; /* ❌ 会导致 sticky 失效 */
  height: auto; /* 确保有足够高度 */
}
```

```javascript
/**
 * 检测 sticky 支持并降级
 * @returns {boolean} 是否支持 sticky
 */
function checkStickySupport() {
  if (CSS.supports('position', 'sticky')) {
    return true;
  }

  // 降级方案：使用 fixed + IntersectionObserver
  const element = document.querySelector('.sticky-element');

  window.addEventListener('scroll', () => {
    const rect = element.getBoundingClientRect();
    if (rect.top <= 0) {
      element.classList.add('is-fixed');
    } else {
      element.classList.remove('is-fixed');
    }
  });
}
```

---

#### 题目10：性能优化的定位方案
**思路**：减少重排重绘，使用 transform 替代 top/left

```css
/**
 * ❌ 性能差：触发重排
 */
.bad-animation {
  position: absolute;
  animation: move 1s;
}

@keyframes move {
  from { top: 0; left: 0; }
  to { top: 100px; left: 100px; }
}

/**
 * ✅ 性能好：只触发合成
 */
.good-animation {
  position: absolute;
  animation: move-transform 1s;
  will-change: transform; /* 提升到独立图层 */
}

@keyframes move-transform {
  from { transform: translate(0, 0); }
  to { transform: translate(100px, 100px); }
}

/**
 * 虚拟滚动列表优化
 */
.list-item {
  contain: layout style paint; /* 限制重排范围 */
}

.action-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%); /* 使用 transform */
  will-change: transform;
}
```

---

### 关键要点总结

1. **定位参考系**：relative 看自己，absolute 看祖先，fixed 看视口，sticky 看滚动
2. **文档流影响**：只有 static 和 relative 占据空间
3. **层叠顺序**：z-index 只在同一层叠上下文内有效
4. **性能优化**：使用 transform 代替 top/left，启用 will-change
5. **响应式适配**：百分比、vw/vh、媒体查询、min/max 限制
6. **常见陷阱**：sticky 的 overflow 冲突、absolute 找不到参考、z-index 失效