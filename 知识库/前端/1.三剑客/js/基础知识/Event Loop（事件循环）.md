# Event Loop（事件循环）精华学习资料

## 日常学习模式

**[标签: JavaScript Event Loop、异步编程、宏任务微任务、并发模型]**

### 核心概念

**Event Loop** 是 JavaScript 实现非阻塞异步编程的核心机制。尽管 JS 是单线程语言，但通过事件循环可以高效处理异步操作。

#### 关键组件

1. **调用栈 (Call Stack)**
   - LIFO（后进先出）结构
   - 存放当前执行的函数上下文
   - 所有同步代码在此执行

2. **Web APIs**
   - 浏览器提供的异步能力（setTimeout、DOM事件、fetch等）
   - 处理完成后将回调推入任务队列

3. **任务队列**
   - **宏任务队列**：setTimeout、setInterval、DOM事件、I/O
   - **微任务队列**：Promise.then/catch/finally、async/await、MutationObserver

#### 执行机制

```javascript
/**
 * Event Loop 执行流程伪代码
 */
while (true) {
  // 1. 执行所有同步代码（清空调用栈）
  executeAllSyncCode();

  // 2. 清空所有微任务（一次性全部执行）
  while (microtaskQueue.length > 0) {
    const microtask = microtaskQueue.shift();
    execute(microtask);
  }

  // 3. 执行一个宏任务
  if (macrotaskQueue.length > 0) {
    const macrotask = macrotaskQueue.shift();
    execute(macrotask);
  }

  // 4. 可能进行 UI 渲染
  renderIfNeeded();
}
```

**关键规则**：
- 每执行完一个宏任务 → 立即清空所有微任务 → 再执行下一个宏任务
- 微任务优先级高于宏任务
- 微任务执行中产生的新微任务会在本轮循环中执行完

### 核心代码模式

#### 1. Promise（微任务）

```javascript
/**
 * Promise 基础用法
 * 构造函数同步执行，.then 回调异步执行（微任务）
 */
console.log('1: 同步开始');

new Promise((resolve) => {
  console.log('2: Promise 构造函数（同步）');
  resolve();
}).then(() => {
  console.log('4: Promise.then（微任务）');
});

console.log('3: 同步结束');

// 输出顺序：1 → 2 → 3 → 4
```

#### 2. async/await（Promise 语法糖）

```javascript
/**
 * async/await 模式
 * await 后的代码会被包装成微任务
 */
async function fetchData() {
  console.log('1: async 函数开始（同步）');

  // await 暂停函数执行，等待 Promise 完成
  // await 之后的代码作为微任务执行
  await Promise.resolve();

  console.log('3: await 之后（微任务）');
}

fetchData();
console.log('2: 主线程继续（同步）');

// 输出：1 → 2 → 3
```

#### 3. setTimeout（宏任务）

```javascript
/**
 * setTimeout 延迟执行
 * 即使设置为 0ms，也会进入宏任务队列
 */
console.log('1: 同步代码');

setTimeout(() => {
  console.log('4: setTimeout 0ms（宏任务）');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise.then（微任务）');
});

console.log('2: 同步代码结束');

// 输出：1 → 2 → 3 → 4
// 微任务总是优先于宏任务执行
```

#### 4. DOM 事件处理

```javascript
/**
 * DOM 事件回调属于宏任务
 * 事件触发时，回调进入宏任务队列
 */
const button = document.getElementById('btn');

button.addEventListener('click', () => {
  console.log('1: 点击事件（宏任务）');

  // 事件处理中的微任务
  Promise.resolve().then(() => {
    console.log('2: 事件内的 Promise（微任务）');
  });

  // 事件处理中的宏任务
  setTimeout(() => {
    console.log('3: 事件内的 setTimeout（宏任务）');
  }, 0);
});

// 点击后输出：1 → 2 → 3
```

### 实战场景

#### 场景1：大数据处理（避免页面卡顿）

```javascript
/**
 * 分片处理大量数据，避免阻塞主线程
 * @param {Array} data - 待处理数据
 * @param {number} chunkSize - 每批处理数量
 */
async function processLargeData(data, chunkSize = 1000) {
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
  
    // 处理当前批次
    processChunk(chunk);
  
    // 使用 setTimeout 让出主线程，给 UI 渲染机会
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

#### 场景2：按顺序请求多个 API

```javascript
/**
 * 串行请求：必须等前一个完成才能请求下一个
 */
async function fetchSequentially() {
  try {
    const dataA = await fetch('/api/a').then(r => r.json());
    const dataB = await fetch(`/api/b?id=${dataA.id}`).then(r => r.json());
    const dataC = await fetch('/api/c').then(r => r.json());
  
    return { dataA, dataB, dataC };
  } catch (error) {
    console.error('请求失败:', error);
  }
}

/**
 * 并行请求：同时发起多个请求，等待全部完成
 */
async function fetchParallel() {
  try {
    const [dataA, dataB, dataC] = await Promise.all([
      fetch('/api/a').then(r => r.json()),
      fetch('/api/b').then(r => r.json()),
      fetch('/api/c').then(r => r.json())
    ]);
  
    return { dataA, dataB, dataC };
  } catch (error) {
    console.error('至少一个请求失败:', error);
  }
}
```

#### 场景3：输入防抖（debounce）

```javascript
/**
 * 防抖函数：延迟执行，频繁触发则重新计时
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（ms）
 */
function debounce(fn, delay = 300) {
  let timer = null;

  return function(...args) {
    // 清除之前的宏任务
    clearTimeout(timer);
  
    // 设置新的宏任务
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用示例：搜索框实时搜索
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((keyword) => {
  fetch(`/api/search?q=${keyword}`);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

#### 场景4：确保 UI 立即更新

```javascript
/**
 * 保证 DOM 修改后立即渲染
 */
async function handleButtonClick() {
  const button = document.getElementById('submit');

  // 修改 UI 状态（同步）
  button.disabled = true;
  button.textContent = '处理中...';

  // 方式1：使用微任务（推荐）
  await Promise.resolve(); // 让出执行权，浏览器渲染

  // 方式2：使用宏任务（更保险）
  // await new Promise(resolve => setTimeout(resolve, 0));

  // 执行耗时操作
  try {
    await fetchData();
    button.textContent = '提交成功';
  } catch (error) {
    button.textContent = '提交失败';
  } finally {
    button.disabled = false;
  }
}
```

---

## 面试突击模式

### 30秒电梯演讲

**Event Loop 是 JavaScript 处理异步的核心机制**。JS 单线程通过调用栈执行同步代码，遇到异步操作（如 setTimeout、Promise）交给 Web APIs 处理，完成后回调进入任务队列。事件循环不断检查：先清空所有微任务（Promise.then、async/await），再执行一个宏任务（setTimeout、DOM事件），然后可能渲染 UI。微任务优先级高于宏任务，这保证了非阻塞的异步编程。

---

### 高频考点（必背）

**考点1：宏任务和微任务的区别及优先级**
- **宏任务**：setTimeout、setInterval、DOM事件、I/O，每次事件循环执行一个
- **微任务**：Promise.then/catch/finally、async/await、MutationObserver，每次全部清空
- **优先级**：同步代码 > 微任务 > 宏任务；每个宏任务后必清空所有微任务

**考点2：Promise 构造函数和 .then 的执行时机**
- 构造函数内代码**同步执行**，立即运行
- .then/.catch/.finally 回调**异步执行**，进入微任务队列
- 即使 Promise.resolve() 立即完成，.then 也是异步的

**考点3：async/await 的本质和执行顺序**
- async 函数返回 Promise，await 暂停函数执行等待 Promise 完成
- await 后的代码被包装成微任务，相当于 Promise.then
- 等价转换：`await x` ≈ `Promise.resolve(x).then(() => { 后续代码 })`

**考点4：setTimeout(fn, 0) 的作用**
- 不会立即执行，进入宏任务队列末尾
- 用于改变代码执行顺序、分片处理大任务、让出主线程给渲染
- 实际延迟 ≥ 4ms（浏览器限制）

**考点5：浏览器渲染时机**
- 发生在执行完一个宏任务后、下一个宏任务前
- 微任务执行期间不会渲染，全部执行完才渲染
- 大量微任务操作 DOM 会合并成一次渲染

---

### 经典面试题

#### 题目1：代码输出顺序（基础）
```javascript
/**
 * 考察：同步代码、宏任务、微任务的执行顺序
 */
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');

// 问：输出顺序是什么？
```

**思路**：
1. 识别同步代码：A 和 D
2. 识别微任务：Promise.then → C
3. 识别宏任务：setTimeout → B
4. 执行顺序：同步 → 微任务 → 宏任务

**答案**：`A → D → C → B`

---

#### 题目2：Promise 构造函数执行时机
```javascript
/**
 * 考察：Promise 构造函数是同步还是异步
 */
const promise = new Promise((resolve) => {
  console.log('1');
  resolve();
  console.log('2');
});

promise.then(() => console.log('3'));

console.log('4');

// 问：输出顺序？
```

**思路**：
1. Promise 构造函数**同步执行**：输出 1 → 2
2. .then 回调是微任务：3 进入微任务队列
3. 主线程继续执行：输出 4
4. 清空微任务：输出 3

**答案**：`1 → 2 → 4 → 3`

---

#### 题目3：async/await 执行顺序
```javascript
/**
 * 考察：async/await 的执行时机
 */
async function async1() {
  console.log('A');
  await async2();
  console.log('B'); // await 后的代码 = 微任务
}

async function async2() {
  console.log('C');
}

console.log('D');
async1();
console.log('E');

// 问：输出顺序？
```

**思路**：
1. 同步执行：D
2. 调用 async1，同步执行：A
3. 调用 async2，同步执行：C
4. await 后的代码（B）进入微任务队列
5. 主线程继续：E
6. 清空微任务：B

**答案**：`D → A → C → E → B`

---

#### 题目4：嵌套 Promise 和 setTimeout
```javascript
/**
 * 考察：宏任务和微任务混合嵌套
 */
setTimeout(() => {
  console.log('1');
  Promise.resolve().then(() => console.log('2'));
}, 0);

Promise.resolve().then(() => {
  console.log('3');
  setTimeout(() => console.log('4'), 0);
});

// 问：输出顺序？
```

**思路**：
1. 第一轮事件循环：
   - 宏任务：第一个 setTimeout 进队列
   - 微任务：第一个 Promise.then（输出3，第二个setTimeout进队列）
2. 第二轮事件循环：
   - 宏任务：第一个 setTimeout（输出1，产生微任务2）
   - 微任务：输出2
3. 第三轮事件循环：
   - 宏任务：第二个 setTimeout（输出4）

**答案**：`3 → 1 → 2 → 4`

---

#### 题目5：微任务产生新微任务
```javascript
/**
 * 考察：微任务队列的清空机制
 */
Promise.resolve().then(() => {
  console.log('1');
  Promise.resolve().then(() => console.log('2'));
});

Promise.resolve().then(() => console.log('3'));

// 问：输出顺序？
```

**思路**：
1. 初始微任务队列：[任务A(输出1), 任务B(输出3)]
2. 执行任务A：输出1，产生新微任务C(输出2)，加入队列末尾
3. 微任务队列：[任务B, 任务C]
4. 执行任务B：输出3
5. 执行任务C：输出2

**答案**：`1 → 3 → 2`
**关键点**：微任务执行中产生的新微任务会在本轮循环中执行完

---

#### 题目6：DOM 事件与任务队列
```javascript
/**
 * 考察：DOM 事件属于什么任务类型
 */
const button = document.getElementById('btn');

button.addEventListener('click', () => {
  console.log('1');

  Promise.resolve().then(() => console.log('2'));

  setTimeout(() => console.log('3'), 0);
});

button.addEventListener('click', () => {
  console.log('4');

  Promise.resolve().then(() => console.log('5'));
});

// 问：点击按钮后的输出顺序？
```

**思路**：
1. 点击事件触发，两个回调作为宏任务依次执行
2. 第一个宏任务：输出1，产生微任务2和宏任务3
3. 清空微任务：输出2
4. 第二个宏任务：输出4，产生微任务5
5. 清空微任务：输出5
6. 第三个宏任务：输出3

**答案**：`1 → 2 → 4 → 5 → 3`

---

#### 题目7：实现按顺序请求多个接口
```javascript
/**
 * 题目：有3个API接口，B依赖A的结果，C独立。
 * 要求：先请求A，用A的结果请求B，同时C可以并行请求。
 * 实现最优方案。
 */

// 答案：
async function fetchOptimized() {
  try {
    // A 必须先完成
    const dataA = await fetch('/api/a').then(r => r.json());
  
    // B 依赖 A，C 独立，可以并行
    const [dataB, dataC] = await Promise.all([
      fetch(`/api/b?id=${dataA.id}`).then(r => r.json()),
      fetch('/api/c').then(r => r.json())
    ]);
  
    return { dataA, dataB, dataC };
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}
```

**思路**：
- A 必须先完成：单独 await
- B 和 C 可以并行：Promise.all
- 整体最快：A完成后，B和C同时请求

---

#### 题目8：实现一个任务队列控制器
```javascript
/**
 * 题目：实现一个任务调度器，限制并发数量
 * 例如：有10个异步任务，但最多同时执行3个
 */

/**
 * @param {Array<Function>} tasks - 任务数组，每个任务返回 Promise
 * @param {number} limit - 最大并发数
 */
async function taskScheduler(tasks, limit = 3) {
  const results = []; // 存储结果
  const executing = []; // 正在执行的任务

  for (const [index, task] of tasks.entries()) {
    // 创建任务 Promise
    const promise = Promise.resolve().then(() => task());
  
    results[index] = promise;
  
    if (limit <= tasks.length) {
      // 任务完成后从 executing 中移除
      const e = promise.then(() => 
        executing.splice(executing.indexOf(e), 1)
      );
      executing.push(e);
    
      // 达到并发上限，等待任意一个完成
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  // 等待所有任务完成
  return Promise.all(results);
}

// 使用示例
const tasks = Array.from({ length: 10 }, (_, i) => 
  () => new Promise(resolve => 
    setTimeout(() => {
      console.log(`任务${i}完成`);
      resolve(i);
    }, 1000)
  )
);

taskScheduler(tasks, 3);
```

**思路**：
- 维护正在执行的任务数组
- 达到并发上限时，用 Promise.race 等待任意一个完成
- 任务完成后从执行数组中移除，继续添加新任务

---

#### 题目9：实现一个支持取消的防抖函数
```javascript
/**
 * 题目：实现一个防抖函数，支持立即执行和取消功能
 */

function debounce(fn, delay = 300, immediate = false) {
  let timer = null;

  function debounced(...args) {
    // 是否立即执行
    const callNow = immediate && !timer;
  
    // 清除之前的定时器
    clearTimeout(timer);
  
    // 设置新的定时器
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delay);
  
    // 立即执行模式
    if (callNow) {
      fn.apply(this, args);
    }
  }

  // 取消功能
  debounced.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

// 使用示例
const search = debounce((keyword) => {
  console.log('搜索:', keyword);
}, 500);

const input = document.getElementById('search');
input.addEventListener('input', (e) => search(e.target.value));

// 取消搜索
document.getElementById('cancel').addEventListener('click', () => {
  search.cancel();
});
```

---

#### 题目10：解释并修复常见的闭包陷阱
```javascript
/**
 * 题目：以下代码有什么问题？如何修复？
 */

// 错误代码
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 全部输出 5
  }, 1000);
}

/**
 * 问题分析：
 * 1. var 是函数作用域，循环结束后 i = 5
 * 2. setTimeout 是宏任务，在所有同步代码执行完后才执行
 * 3. 所有回调访问的是同一个 i
 */

// 修复方案1：使用 let（块级作用域）
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 输出 0, 1, 2, 3, 4
  }, 1000);
}

// 修复方案2：IIFE 创建闭包
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(() => {
      console.log(j); // 输出 0, 1, 2, 3, 4
    }, 1000);
  })(i);
}

// 修复方案3：setTimeout 传参
for (var i = 0; i < 5; i++) {
  setTimeout((j) => {
    console.log(j); // 输出 0, 1, 2, 3, 4
  }, 1000, i);
}
```

**答案**：
- **问题本质**：var 作用域 + 异步回调访问外部变量
- **最佳方案**：使用 let（ES6推荐）
- **原理**：每次循环创建新的块级作用域，保存当前 i 值

---

### 快速记忆口诀

```
同步先行栈中跑，
微任务紧随其后到。
宏任务排队慢慢来，
一宏一微渲染好。

Promise构造同步跑，
then/catch微任务找。
await相当then包装，
后续代码微任务藏。

setTimeout虽说零，
也得宏任务队列等。
事件回调宏任务类,
防抖节流靠它起。
```