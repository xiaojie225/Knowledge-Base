# Promise 和 async/await 精华学习资料

## 日常学习模式

[标签: JavaScript Promise, async/await, 异步编程, ES6+]

### 核心概念

**Promise 是什么**
Promise 是 JavaScript 中处理异步操作的对象，代表一个未来才会完成的操作结果。它有三种状态：
- `pending`（进行中）：初始状态
- `fulfilled`（已成功）：操作成功完成
- `rejected`（已失败）：操作失败

状态转换规则：只能从 pending 变为 fulfilled 或 rejected，且状态一旦改变就永久保持。

**async/await 是什么**
ES2017 引入的语法糖，让异步代码看起来像同步代码：
- `async` 函数自动返回 Promise
- `await` 暂停函数执行，等待 Promise 完成
- 错误处理使用标准的 `try...catch`

### 基础语法

**创建 Promise**
```javascript
/**
 * 创建一个 Promise 实例
 * @param {string} src - 资源地址
 * @returns {Promise<HTMLImageElement>} 返回加载的图片元素
 */
function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
      
        // 成功回调
        img.onload = () => resolve(img);
      
        // 失败回调
        img.onerror = () => reject(new Error(`加载失败: ${src}`));
      
        // 触发加载（必须在设置监听器之后）
        img.src = src;
    });
}
```

**消费 Promise**
```javascript
// 方式1: .then/.catch 链式调用
loadImg('image.jpg')
    .then(img => {
        console.log('成功', img.width);
        return img; // 传递给下一个 .then
    })
    .catch(err => {
        console.error('失败', err);
    });

// 方式2: async/await 
async function load() {
    try {
        const img = await loadImg('image.jpg');
        console.log('成功', img.width);
    } catch (err) {
        console.error('失败', err);
    }
}
```

### 核心方法

**Promise 链式调用**
```javascript
/**
 * 串行加载多张图片
 * 每张图片依次加载，前一张完成后才加载下一张
 */
loadImg('img1.jpg')
    .then(img1 => {
        document.body.appendChild(img1);
        // 返回 Promise 会让链条等待
        return loadImg('img2.jpg');
    })
    .then(img2 => {
        document.body.appendChild(img2);
        // 返回普通值会立即传递给下一个 .then
        return 'done';
    })
    .then(result => {
        console.log(result); // 'done'
    })
    .catch(err => {
        // 捕获链条中任何环节的错误
        console.error(err);
    });
```

**Promise.all() - 并行等待全部完成**
```javascript
/**
 * 并行加载多张图片，全部成功才算成功
 * 任意一张失败则立即失败
 */
const urls = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
const promises = urls.map(url => loadImg(url));

Promise.all(promises)
    .then(images => {
        // images 是按顺序的结果数组 [img1, img2, img3]
        images.forEach(img => document.body.appendChild(img));
    })
    .catch(err => {
        // 第一个失败的错误
        console.error('有图片加载失败', err);
    });
```

**Promise.race() - 竞速，取最快的结果**
```javascript
/**
 * 哪张图片先加载完就用哪张
 */
Promise.race([
    loadImg('fast.jpg'),
    loadImg('slow.jpg')
])
.then(fastestImg => {
    console.log('最快加载的图片', fastestImg);
});
```

**Promise.allSettled() - 等待全部完成，不管成功失败**
```javascript
/**
 * 获取所有图片的最终状态
 * 适合需要知道每张图片结果的场景
 */
Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`图片${index}成功`, result.value);
            } else {
                console.log(`图片${index}失败`, result.reason);
            }
        });
    });
```

### 使用场景

**场景1: 资源预加载**
```javascript
/**
 * 游戏启动前预加载所有资源
 */
async function preloadGameAssets() {
    const assets = [
        'background.jpg',
        'character.png',
        'enemy.png'
    ];
  
    try {
        const images = await Promise.all(assets.map(loadImg));
        console.log('所有资源加载完成，游戏可以开始');
        return images;
    } catch (err) {
        console.error('资源加载失败，无法启动游戏', err);
        throw err;
    }
}
```

**场景2: 依赖加载（串行）**
```javascript
/**
 * 背景图加载完后才加载内容图
 */
async function loadWithDependency() {
    try {
        // 第一步：加载背景
        const bg = await loadImg('background.jpg');
        document.body.style.backgroundImage = `url(${bg.src})`;
      
        // 第二步：背景加载完后才加载内容
        const content = await loadImg('content.jpg');
        document.querySelector('.container').appendChild(content);
    } catch (err) {
        console.error('加载出错', err);
    }
}
```

**场景3: 超时控制**
```javascript
/**
 * 如果图片5秒内没加载完就超时
 */
function loadWithTimeout(url, timeout = 5000) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('加载超时')), timeout);
    });
  
    return Promise.race([
        loadImg(url),
        timeoutPromise
    ]);
}

// 使用
loadWithTimeout('large-image.jpg')
    .then(img => console.log('加载成功'))
    .catch(err => console.error(err.message)); // '加载超时' 或加载错误
```

**场景4: 并行但用 async/await**
```javascript
/**
 * 同时发起多个请求，但用 await 语法等待
 * 比串行快，比 Promise.all 更灵活
 */
async function parallelWithAwait() {
    // 同时发起请求（不要立即 await）
    const promise1 = loadImg('img1.jpg');
    const promise2 = loadImg('img2.jpg');
  
    // 一起等待它们完成
    const [img1, img2] = await Promise.all([promise1, promise2]);
  
    document.body.appendChild(img1);
    document.body.appendChild(img2);
}
```

### 关键注意事项

1. **事件监听顺序**：必须先设置 `onload`/`onerror`，再设置 `src`，避免竞态条件

2. **错误处理必须有**：未捕获的 Promise rejection 会在控制台报错，务必加 `.catch()` 或 `try/catch`

3. **Promise 状态不可逆**：一旦从 pending 变为 fulfilled/rejected，就永久定型

4. **微任务优先级**：`.then` 回调在微任务队列，优先于 `setTimeout` 等宏任务

5. **返回值的区别**：
   - `.then()` 中返回普通值 → 立即传递给下一个 `.then`
   - `.then()` 中返回 Promise → 链条等待这个 Promise 完成

---

## 面试突击模式

### Promise 和 async/await 面试速记

#### 30秒电梯演讲
Promise 是 JS 处理异步操作的对象，有三种状态（pending/fulfilled/rejected），通过 `.then/.catch` 链式调用避免回调地狱。async/await 是 ES2017 的语法糖，让异步代码像同步代码一样易读，本质还是 Promise，错误用 try/catch 捕获。

#### 高频考点（必背）

**考点1: Promise 的三种状态及转换规则**
Promise 有 pending（进行中）、fulfilled（成功）、rejected（失败）三种状态。状态只能从 pending 单向转换为 fulfilled 或 rejected，且一旦改变就不可逆，这保证了回调只执行一次。

**考点2: Promise 解决了什么问题**
解决回调地狱（多层嵌套导致横向代码）和控制反转问题（将异步控制权从第三方代码拿回自己手中），通过链式调用让代码纵向发展，更易维护。

**考点3: .then 返回值的两种情况**
返回普通值时，会被包装成 fulfilled 的 Promise 立即传递给下一个 .then；返回 Promise 时，链条会等待这个 Promise 完成，实现串行异步操作。

**考点4: Promise.all vs Promise.race**
`Promise.all` 等待所有 Promise 成功，任一失败则整体失败，返回结果数组；`Promise.race` 返回最先完成的 Promise 结果，不管成功失败。

**考点5: async/await 的本质**
async 函数返回 Promise，await 暂停函数执行等待 Promise 完成。本质是 Promise 的语法糖，错误处理用 try/catch，比 .then 链更符合同步思维习惯。

**考点6: 微任务和宏任务**
Promise 的 .then 回调进入微任务队列，在当前宏任务的所有同步代码执行完后立即执行，优先级高于 setTimeout 等宏任务。执行顺序：同步代码 → 微任务队列 → 宏任务队列。

#### 经典面试题

**题目1: 实现一个带超时的图片加载函数**
```javascript
/**
 * 实现图片加载，超过指定时间则超时失败
 * @param {string} url - 图片地址
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<HTMLImageElement>}
 */
function loadImgWithTimeout(url, timeout = 5000) {
    // 创建加载 Promise
    const loadPromise = new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = url;
    });
  
    // 创建超时 Promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('加载超时')), timeout);
    });
  
    // 竞速：哪个先完成用哪个
    return Promise.race([loadPromise, timeoutPromise]);
}

// 使用示例
loadImgWithTimeout('large.jpg', 3000)
    .then(img => console.log('成功', img))
    .catch(err => console.error(err.message));
```

**思路**: 用 `Promise.race` 让加载和超时计时器竞争，谁先完成就采用谁的结果。

---

**题目2: 实现 Promise.all（手写）**
```javascript
/**
 * 手写 Promise.all
 * @param {Array<Promise>} promises - Promise 数组
 * @returns {Promise<Array>} 所有结果的数组
 */
function myPromiseAll(promises) {
    return new Promise((resolve, reject) => {
        // 边界处理
        if (!Array.isArray(promises)) {
            return reject(new TypeError('参数必须是数组'));
        }
      
        const results = []; // 存储结果
        let completedCount = 0; // 已完成的数量
        const total = promises.length;
      
        // 空数组直接成功
        if (total === 0) {
            return resolve(results);
        }
      
        // 遍历每个 Promise
        promises.forEach((promise, index) => {
            // 确保是 Promise（兼容普通值）
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value; // 保持顺序
                    completedCount++;
                  
                    // 全部完成才 resolve
                    if (completedCount === total) {
                        resolve(results);
                    }
                })
                .catch(err => {
                    // 任意一个失败立即 reject
                    reject(err);
                });
        });
    });
}

// 测试
myPromiseAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
])
.then(results => console.log(results)); // [1, 2, 3]
```

**思路**: 用计数器跟踪完成数量，任一失败立即 reject，全部成功才 resolve。

---

**题目3: 串行执行 Promise 数组**
```javascript
/**
 * 按顺序依次执行 Promise，前一个完成才执行下一个
 * @param {Array<Function>} tasks - 返回 Promise 的函数数组
 * @returns {Promise<Array>} 所有结果的数组
 */
function runSequential(tasks) {
    return tasks.reduce((promiseChain, currentTask) => {
        return promiseChain.then(results => {
            // 执行当前任务
            return currentTask().then(result => {
                // 把结果加入数组
                return [...results, result];
            });
        });
    }, Promise.resolve([])); // 初始值是已 resolve 的空数组
}

// 使用示例
const tasks = [
    () => loadImg('img1.jpg'),
    () => loadImg('img2.jpg'),
    () => loadImg('img3.jpg')
];

runSequential(tasks)
    .then(images => console.log('全部串行加载完成', images));
```

**思路**: 用 `reduce` 把 Promise 链起来，每次返回新的 Promise 等待当前任务完成。

---

**题目4: 实现一个请求重试函数**
```javascript
/**
 * 请求失败时自动重试
 * @param {Function} fn - 返回 Promise 的函数
 * @param {number} maxRetries - 最大重试次数
 * @returns {Promise}
 */
async function retryRequest(fn, maxRetries = 3) {
    for (let i = 0; i <= maxRetries; i++) {
        try {
            // 尝试执行
            const result = await fn();
            return result; // 成功则直接返回
        } catch (err) {
            // 最后一次失败，抛出错误
            if (i === maxRetries) {
                throw new Error(`重试${maxRetries}次后仍失败: ${err.message}`);
            }
            // 否则继续下一轮
            console.log(`第${i + 1}次失败，准备重试...`);
        }
    }
}

// 使用示例
retryRequest(() => loadImg('unstable.jpg'), 3)
    .then(img => console.log('加载成功'))
    .catch(err => console.error(err.message));
```

**思路**: 用循环 + try/catch，成功则返回，失败则继续循环，直到达到最大次数。

---

**题目5: 并发控制（限制同时执行的 Promise 数量）**
```javascript
/**
 * 限制并发数量的 Promise 调度器
 * @param {Array<Function>} tasks - 任务函数数组
 * @param {number} limit - 最大并发数
 */
async function concurrentControl(tasks, limit = 2) {
    const results = []; // 存储结果
    const executing = []; // 正在执行的 Promise
  
    for (const [index, task] of tasks.entries()) {
        // 创建 Promise
        const p = Promise.resolve().then(() => task());
        results[index] = p; // 保存到结果数组
      
        // 如果达到并发上限，等待最快的一个完成
        if (tasks.length >= limit) {
            const e = p.then(() => {
                // 完成后从执行队列中移除
                executing.splice(executing.indexOf(e), 1);
            });
            executing.push(e);
          
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }
  
    // 等待所有任务完成
    return Promise.all(results);
}

// 使用示例
const tasks = [
    () => loadImg('1.jpg'),
    () => loadImg('2.jpg'),
    () => loadImg('3.jpg'),
    () => loadImg('4.jpg'),
    () => loadImg('5.jpg')
];

concurrentControl(tasks, 2).then(results => {
    console.log('全部完成，最多同时2个并发');
});
```

**思路**: 用队列维护正在执行的 Promise，达到上限时用 `Promise.race` 等待最快的完成。

---

**题目6: Promise 链式调用输出顺序**
```javascript
/**
 * 问：以下代码的输出顺序是什么？
 */
console.log('1');

Promise.resolve()
    .then(() => {
        console.log('2');
        return Promise.resolve('3');
    })
    .then(res => {
        console.log(res);
    });

console.log('4');

// 输出顺序：1 → 4 → 2 → 3
```

**答案**: 1 → 4 → 2 → 3

**思路**: 同步代码先执行（1, 4），Promise 的 .then 是微任务，等同步代码执行完才执行（2），返回的 Promise 再次进入微任务队列（3）。

---

**题目7: async/await 错误处理**
```javascript
/**
 * 用 async/await 实现多个请求，其中一个失败不影响其他
 * @param {Array<string>} urls - 图片地址数组
 */
async function loadAllWithErrorHandling(urls) {
    const results = [];
  
    for (const url of urls) {
        try {
            const img = await loadImg(url);
            results.push({ status: 'success', value: img });
        } catch (err) {
            // 单个失败不影响后续
            results.push({ status: 'error', reason: err.message });
        }
    }
  
    return results;
}

// 使用
loadAllWithErrorHandling(['a.jpg', 'bad.jpg', 'c.jpg'])
    .then(results => {
        results.forEach((result, i) => {
            if (result.status === 'success') {
                console.log(`图片${i}成功`);
            } else {
                console.log(`图片${i}失败: ${result.reason}`);
            }
        });
    });
```

**思路**: 给每个 await 单独包 try/catch，失败时记录错误但继续执行。

---

**题目8: 实现 Promise.race（手写）**
```javascript
/**
 * 手写 Promise.race
 * @param {Array<Promise>} promises
 * @returns {Promise} 最先完成的结果
 */
function myPromiseRace(promises) {
    return new Promise((resolve, reject) => {
        // 边界检查
        if (!Array.isArray(promises)) {
            return reject(new TypeError('参数必须是数组'));
        }
      
        // 空数组永远 pending
        if (promises.length === 0) {
            return;
        }
      
        // 遍历所有 Promise
        promises.forEach(promise => {
            // 确保是 Promise
            Promise.resolve(promise)
                .then(resolve)  // 任一成功立即 resolve
                .catch(reject); // 任一失败立即 reject
        });
    });
}

// 测试
myPromiseRace([
    new Promise(resolve => setTimeout(() => resolve('慢'), 2000)),
    new Promise(resolve => setTimeout(() => resolve('快'), 1000))
])
.then(result => console.log(result)); // '快'
```

**思路**: 给每个 Promise 都注册回调，第一个完成的直接 resolve/reject。

---

**题目9: 红绿灯问题（Promise 实现）**
```javascript
/**
 * 实现红绿灯：红灯3秒 → 绿灯2秒 → 黄灯1秒，循环
 */
function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

async function trafficLight() {
    while (true) {
        console.log('红灯');
        await sleep(3000);
      
        console.log('绿灯');
        await sleep(2000);
      
        console.log('黄灯');
        await sleep(1000);
    }
}

trafficLight(); // 启动
```

**思路**: 用 `async/await` + 延时 Promise 实现循环等待。

---

**题目10: 实现 Promise.allSettled（手写）**
```javascript
/**
 * 手写 Promise.allSettled
 * 等待所有 Promise 完成，返回每个的状态和结果
 */
function myPromiseAllSettled(promises) {
    return new Promise((resolve) => {
        const results = [];
        let completedCount = 0;
        const total = promises.length;
      
        if (total === 0) {
            return resolve(results);
        }
      
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = {
                        status: 'fulfilled',
                        value
                    };
                })
                .catch(reason => {
                    results[index] = {
                        status: 'rejected',
                        reason
                    };
                })
                .finally(() => {
                    completedCount++;
                    if (completedCount === total) {
                        resolve(results);
                    }
                });
        });
    });
}

// 测试
myPromiseAllSettled([
    Promise.resolve(1),
    Promise.reject('错误'),
    Promise.resolve(3)
])
.then(results => console.log(results));
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: '错误' },
//   { status: 'fulfilled', value: 3 }
// ]
```

**思路**: 给每个 Promise 都加 .then 和 .catch，记录状态，全部完成才 resolve，永远不 reject。