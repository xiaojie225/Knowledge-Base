# Vue Diff 算法深度解析

## 日常学习模式

### [标签: Vue Diff 算法核心原理]

#### 一、基础概念

**什么是 Diff 算法**
- Virtual DOM 的核心机制：将新旧虚拟 DOM 树进行对比，计算出最小差异
- 目标：以最少的 DOM 操作完成视图更新
- 时间复杂度：O(n) 级别

**为什么需要 Diff**
```javascript
// 状态变化时的两种更新方式对比
// ❌ 暴力方式：销毁重建整个 DOM 树
container.innerHTML = newHTML; // 性能极差

// ✅ Diff 方式：只更新变化的部分
diff(oldVNode, newVNode); // 精准高效
patch(realDOM, changes);
```

#### 二、核心策略

**策略一：同层比较**
- 只在相同层级进行节点对比
- 不跨层级比较（跨层级复杂度为 O(n³)）
- 如果节点跨层移动，会销毁旧节点，创建新节点

```javascript
/**
 * 同层比较示意
 * 旧树:        新树:
 *   A           A
 *  / \         / \
 * B   C       D   E
 * 
 * 只会比较: A vs A, B vs D, C vs E
 * 不会比较: B vs E (不同层级)
 */
```

**策略二：sameVnode 判断**
```javascript
/**
 * 判断两个节点是否为同一节点
 * @param {VNode} a - 旧节点
 * @param {VNode} b - 新节点
 * @returns {boolean}
 */
function sameVnode(a, b) {
  return (
    a.key === b.key &&  // key 必须相同
    a.tag === b.tag &&  // 标签类型必须相同
    a.isComment === b.isComment &&  // 注释节点状态相同
    isDef(a.data) === isDef(b.data) &&  // 都有或都无 data
    sameInputType(a, b)  // input 标签的 type 相同
  );
}
```

### [标签: Vue2 双端比较算法]

#### Vue 2 Diff 实现

**四指针双端比较策略**
```javascript
/**
 * Vue 2 双端 Diff 核心逻辑
 * 使用四个指针从两端向中间逼近
 */
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0;           // 旧列表头指针
  let oldEndIdx = oldCh.length - 1;  // 旧列表尾指针
  let newStartIdx = 0;           // 新列表头指针
  let newEndIdx = newCh.length - 1;  // 新列表尾指针

  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 跳过已处理的节点
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    }
  
    // 四种快捷比较
    else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 情况1: 旧头 vs 新头
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } 
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 情况2: 旧尾 vs 新尾
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } 
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 情况3: 旧头 vs 新尾 (节点右移)
      patchVnode(oldStartVnode, newEndVnode);
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, 
                          nodeOps.nextSibling(oldEndVnode.elm));
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } 
    else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 情况4: 旧尾 vs 新头 (节点左移)
      patchVnode(oldEndVnode, newStartVnode);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } 
    else {
      // 四种情况都不匹配，通过 key 查找
      const idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      if (!idxInOld) {
        // 新节点，创建并插入
        createElm(newStartVnode, parentElm, oldStartVnode.elm);
      } else {
        // 找到可复用节点，移动位置
        const vnodeToMove = oldCh[idxInOld];
        patchVnode(vnodeToMove, newStartVnode);
        oldCh[idxInOld] = undefined;
        nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }

  // 处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 旧节点已遍历完，新节点还有剩余，批量添加
    addVnodes(parentElm, newCh, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    // 新节点已遍历完,旧节点还有剩余，批量删除
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
}
```

**实战案例分析**
```javascript
/**
 * 场景: 列表更新 旧: [A, B, C, D] → 新: [D, A, B, C]
 * 
 * 初始状态:
 * 旧: [A, B, C, D]
 *      ↑       ↑
 *   oldStart oldEnd
 * 新: [D, A, B, C]
 *      ↑       ↑
 *   newStart newEnd
 * 
 * 第一轮: 新头(D) vs 旧尾(D) 匹配 → D 移到最前面
 * 旧: [A, B, C, _]  新: [_, A, B, C]
 *      ↑    ↑           ↑       ↑
 * 
 * 第二轮: 新头(A) vs 旧头(A) 匹配 → A 保持不动
 * 旧: [_, B, C, _]  新: [_, _, B, C]
 *         ↑  ↑              ↑    ↑
 * 
 * 第三轮: 新头(B) vs 旧头(B) 匹配 → B 保持不动
 * 第四轮: 新尾(C) vs 旧尾(C) 匹配 → C 保持不动
 * 
 * 结果: 只移动了 D,其他节点复用
 */
```

### [标签: Vue3 最长递增子序列算法]

#### Vue 3 Diff 优化

**核心改进：LIS (Longest Increasing Subsequence)**
```javascript
/**
 * Vue 3 Diff 主流程
 * @param {VNode} n1 - 旧节点
 * @param {VNode} n2 - 新节点
 */
function patchKeyedChildren(c1, c2, container) {
  let i = 0;
  const l2 = c2.length;
  let e1 = c1.length - 1; // 旧列表尾指针
  let e2 = l2 - 1;        // 新列表尾指针

  // 1. 从头开始同步 (相同前缀)
  while (i <= e1 && i <= e2) {
    const n1 = c1[i];
    const n2 = c2[i];
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container);
      i++;
    } else {
      break;
    }
  }

  // 2. 从尾开始同步 (相同后缀)
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1];
    const n2 = c2[e2];
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container);
      e1--;
      e2--;
    } else {
      break;
    }
  }

  // 3. 只有新增节点
  if (i > e1) {
    if (i <= e2) {
      while (i <= e2) {
        patch(null, c2[i], container);
        i++;
      }
    }
  }
  // 4. 只有删除节点
  else if (i > e2) {
    while (i <= e1) {
      unmount(c1[i]);
      i++;
    }
  }
  // 5. 中间乱序部分 (核心优化)
  else {
    const s1 = i;
    const s2 = i;
  
    // 5.1 为新子节点构建 key:index 映射
    const keyToNewIndexMap = new Map();
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i);
      }
    }
  
    // 5.2 遍历旧子节点,判断可复用性
    const toBePatched = e2 - s2 + 1; // 需要处理的新节点数量
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0);
    let moved = false;
    let maxNewIndexSoFar = 0;
  
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      const newIndex = keyToNewIndexMap.get(prevChild.key);
    
      if (newIndex === undefined) {
        // 旧节点在新列表中不存在,删除
        unmount(prevChild);
      } else {
        // 记录新旧节点的索引关系
        newIndexToOldIndexMap[newIndex - s2] = i + 1;
      
        // 判断是否需要移动
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex;
        } else {
          moved = true;
        }
      
        patch(prevChild, c2[newIndex], container);
      }
    }
  
    // 5.3 计算最长递增子序列
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : [];
  
    let j = increasingNewIndexSequence.length - 1;
  
    // 5.4 倒序遍历,移动和挂载节点
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i;
      const nextChild = c2[nextIndex];
      const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
    
      if (newIndexToOldIndexMap[i] === 0) {
        // 新节点,挂载
        patch(null, nextChild, container, anchor);
      } else if (moved) {
        // 需要移动
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
          move(nextChild, container, anchor);
        } else {
          j--;
        }
      }
    }
  }
}

/**
 * 计算最长递增子序列 (贪心 + 二分查找)
 * @param {number[]} arr - 索引数组
 * @returns {number[]} - 最长递增子序列的索引
 */
function getSequence(arr) {
  const len = arr.length;
  const result = [0]; // 存储最长递增子序列的索引
  const p = arr.slice(); // 用于回溯的数组

  for (let i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      const j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
    
      // 二分查找
      let left = 0;
      let right = result.length - 1;
      while (left < right) {
        const mid = (left + right) >> 1;
        if (arr[result[mid]] < arrI) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
    
      if (arrI < arr[result[left]]) {
        if (left > 0) {
          p[i] = result[left - 1];
        }
        result[left] = i;
      }
    }
  }

  // 回溯构建完整序列
  let len2 = result.length;
  let idx = result[len2 - 1];
  while (len2-- > 0) {
    result[len2] = idx;
    idx = p[idx];
  }

  return result;
}
```

**算法优势对比**
```javascript
/**
 * 场景: 乱序更新 旧: [A, B, C, D] → 新: [D, C, B, A]
 * 
 * Vue 2 双端比较:
 * - 会进行多次 DOM 移动操作
 * - 时间复杂度依然是 O(n),但常数较大
 * 
 * Vue 3 LIS 优化:
 * - 找到不需要移动的节点序列 (如 [C, B] 相对位置不变)
 * - 只移动必须移动的节点
 * - 减少 DOM 操作次数,性能更优
 * 
 * 示例: newIndexToOldIndexMap = [4, 3, 2, 1]
 * LIS = [1] (索引3的相对顺序不变)
 * 只需移动 D, C, B,保持 A 不动
 */
```

### [标签: Vue Key 属性深度解析]

#### Key 的核心作用

**为什么必须使用稳定的 Key**
```javascript
/**
 * ❌ 错误示例: 使用 index 作为 key
 */
const BadList = {
  data() {
    return {
      items: ['Apple', 'Banana', 'Cherry']
    };
  },
  template: `
    <div v-for="(item, index) in items" :key="index">
      <input type="text" :placeholder="item">
      <span>{{ item }}</span>
    </div>
  `
};

/**
 * 问题演示:
 * 1. 初始渲染: [Apple(0), Banana(1), Cherry(2)]
 * 2. 在头部插入 'Orange': ['Orange', 'Apple', 'Banana', 'Cherry']
 * 3. Diff 认为:
 *    - key=0: Apple → Orange (更新文本)
 *    - key=1: Banana → Apple (更新文本)
 *    - key=2: Cherry → Banana (更新文本)
 *    - key=3: 新增 Cherry
 * 4. 结果: 所有输入框内容错位,性能浪费
 */

/**
 * ✅ 正确示例: 使用唯一 ID 作为 key
 */
const GoodList = {
  data() {
    return {
      items: [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Banana' },
        { id: 3, name: 'Cherry' }
      ]
    };
  },
  template: `
    <div v-for="item in items" :key="item.id">
      <input type="text" :placeholder="item.name">
      <span>{{ item.name }}</span>
    </div>
  `
};

/**
 * 优化效果:
 * 1. 在头部插入 { id: 4, name: 'Orange' }
 * 2. Diff 识别:
 *    - key=4: 新增 Orange (创建新节点)
 *    - key=1,2,3: 保持不动
 * 3. 结果: 只创建一个新节点,其他节点完全复用
 */
```

**Key 与组件状态保持**
```javascript
/**
 * 实战案例: 表单组件复用
 */
const FormList = {
  template: `
    <div>
      <user-form 
        v-for="user in users" 
        :key="user.id"
        :user="user"
      />
    </div>
  `
};

/**
 * 如果没有 key 或使用 index:
 * - 删除中间某个用户时
 * - 后续表单组件会被就地复用
 * - 导致表单内部状态(输入值、验证状态)错乱
 * 
 * 使用稳定 key 后:
 * - 删除操作会销毁对应组件
 * - 其他组件保持独立,状态不受影响
 */
```

### [标签: Vue Diff 性能优化实战]

#### 使用场景与优化技巧

**场景1: 长列表优化**
```javascript
/**
 * 虚拟滚动优化大列表性能
 */
import { ref, computed } from 'vue';

const VirtualList = {
  setup() {
    const items = ref(Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      text: `Item ${i}`
    })));
  
    const scrollTop = ref(0);
    const itemHeight = 50;
    const visibleCount = 20;
  
    // 只渲染可见区域的项
    const visibleItems = computed(() => {
      const startIndex = Math.floor(scrollTop.value / itemHeight);
      const endIndex = startIndex + visibleCount;
      return items.value.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        top: (startIndex + index) * itemHeight
      }));
    });
  
    const handleScroll = (e) => {
      scrollTop.value = e.target.scrollTop;
    };
  
    return { visibleItems, handleScroll, itemHeight };
  },
  template: `
    <div class="virtual-list" @scroll="handleScroll" style="height: 1000px; overflow-y: auto;">
      <div :style="{ height: items.length * itemHeight + 'px', position: 'relative' }">
        <div 
          v-for="item in visibleItems" 
          :key="item.id"
          :style="{ position: 'absolute', top: item.top + 'px', height: itemHeight + 'px' }"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  `
};

/**
 * 优化效果:
 * - 原本需要 Diff 10000 个节点
 * - 优化后只 Diff 20 个可见节点
 * - 性能提升 500 倍
 */
```

**场景2: 条件渲染优化**
```javascript
/**
 * v-if vs v-show 的选择策略
 */
const ConditionalRender = {
  data() {
    return {
      isHeavyComponentVisible: false,
      isFrequentToggle: false
    };
  },
  template: `
    <div>
      <!-- 重组件,不频繁切换,使用 v-if -->
      <heavy-component v-if="isHeavyComponentVisible" />
    
      <!-- 轻量组件,频繁切换,使用 v-show -->
      <light-component v-show="isFrequentToggle" />
    </div>
  `
};

/**
 * 原因:
 * - v-if: 会触发完整的销毁和创建,Diff 开销大
 * - v-show: 只切换 display,Diff 只比较 style 属性
 * 
 * 选择原则:
 * - 初始渲染成本高 + 很少切换 → v-if
 * - 频繁切换 + 切换成本低 → v-show
 */
```

**场景3: 静态内容优化**
```javascript
/**
 * 使用 v-once 和静态标记
 */
const StaticContent = {
  template: `
    <div>
      <!-- v-once: 只渲染一次,之后跳过 Diff -->
      <header v-once>
        <h1>{{ title }}</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
    
      <!-- 动态内容正常 Diff -->
      <main>
        <article v-for="post in posts" :key="post.id">
          {{ post.content }}
        </article>
      </main>
    </div>
  `
};

/**
 * Vue 3 编译器优化:
 * - 静态节点会被标记为 HOISTED
 * - Diff 时直接跳过这些节点
 * - 减少 VNode 创建和比较开销
 */
```

---

## 面试突击模式

### Vue Diff 算法 面试速记

#### 30秒电梯演讲
"Vue 的 Diff 算法是虚拟 DOM 更新的核心,通过同层比较策略将复杂度降至 O(n)。Vue 2 使用双端比较优化头尾操作,Vue 3 引入最长递增子序列优化乱序场景。Key 属性是 Diff 的身份标识,必须稳定唯一,否则会导致性能问题和状态错乱。"

#### 高频考点(必背)

**考点1: Diff 算法的核心思想是什么?**
Diff 算法通过比较新旧虚拟 DOM 树找出最小差异,只在同层级进行节点比较,使用 `sameVnode` 判断节点是否可复用。核心目标是最小化 DOM 操作,将 O(n³) 的树比较复杂度优化到 O(n)。

**考点2: Vue 2 和 Vue 3 的 Diff 算法有什么区别?**
Vue 2 使用双端比较,通过四个指针从两端向中间逼近,优化头尾增删操作。Vue 3 在处理完相同前后缀后,对中间乱序部分使用最长递增子序列算法,找出不需要移动的稳定节点,只移动必要节点,减少 DOM 操作。

**考点3: 为什么 v-for 必须加 key,且不能用 index?**
Key 是节点的唯一标识,帮助 Diff 算法准确追踪节点。使用 index 作 key 时,列表顺序变化会导致 key 与节点错位,Diff 会误判为所有节点都变化,造成不必要的 DOM 操作和组件状态丢失。必须使用稳定唯一的 ID 作为 key。

**考点4: sameVnode 的判断条件有哪些?**
判断两个节点是否为同一节点需要满足:key 相同、标签名相同、注释节点状态相同、data 存在性相同、input 标签的 type 相同。只有这些条件全部满足,Diff 才会复用节点并进行更新,否则会销毁旧节点创建新节点。

**考点5: Vue 的更新是同步还是异步的,与 nextTick 什么关系?**
Diff 算法执行是同步的,但更新流程是异步的。数据变更后 Watcher 被推入异步队列,在下一个 tick 统一执行 Diff 和 patch。这样可以合并同一 tick 内的多次数据变更,减少 DOM 操作。`nextTick` 用于在 DOM 更新完成后执行回调。

