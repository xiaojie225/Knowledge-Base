好的，我们来详细解析这段关于 `Promise` 和异步图片加载的代码。

### 代码总结

这段代码定义了一个名为 `loadImg` 的函数，它的核心作用是将一个传统的、基于事件回调（`onload`, `onerror`）的异步操作——图片加载——封装成一个现代的、基于 `Promise` 的异步任务。

1.  **封装**：函数接收一个图片 `src` 地址，并立即返回一个 `Promise` 对象。
2.  **异步逻辑**：在 `Promise` 的执行器函数内部，它创建了一个 `<img>` 元素。
3.  **状态转换**：
    *   当图片成功加载时，`img.onload` 事件被触发，函数调用 `resolve(img)`，将 `Promise` 的状态变为 `fulfilled`（成功），并将加载好的 `img` DOM 元素作为结果向后传递。
    *   当图片加载失败时，`img.onerror` 事件被触发，函数调用 `reject(err)`，将 `Promise` 的状态变为 `rejected`（失败），并将一个包含错误信息的 `Error` 对象向后传递。
4.  **Promise 链**：示例代码展示了如何使用 `.then()` 和 `.catch()` 来消费这个 `Promise`。特别地，它演示了 `Promise` 链的一个关键特性：`.then()` 回调函数中，如果返回一个普通值，它会立即被传递给下一个 `.then()`; 如果返回一个新的 `Promise`，整个链条会等待这个新的 `Promise` 完成后，才继续执行下一个 `.then()`。

总而言之，这是一个将回调模式转换为 `Promise` 模式的经典范例，极大地改善了异步代码的可读性和可维护性，避免了“回调地狱”。

---

### 开发文档

#### 1. 简介

**`loadImg` - 基于 Promise 的图片预加载器**

`loadImg` 是一个轻量级、零依赖的 JavaScript 工具函数，用于异步加载图片。它将浏览器原生的图片加载事件封装在 `Promise` API 中，使得开发者可以用更优雅、更强大的链式调用和 `async/await` 语法来处理图片加载成功或失败的场景，有效管理复杂的异步依赖关系。

#### 2. 学习知识

*   **Promise 基础**：`new Promise((resolve, reject) => { ... })` 是创建 `Promise` 实例的標準方式。执行器函数会立即执行，它包含异步操作的逻辑。`resolve` 是一个函数，用于在异步操作成功时调用，将 `Promise` 状态置为 `fulfilled`；`reject` 则是操作失败时调用，将状态置为 `rejected`。
*   **Promise 状态机**：一个 `Promise` 只能从 `pending`（进行中）变为 `fulfilled`（已成功）或 `rejected`（已失败），且状态一旦改变，就不能再更改。
*   **`.then(onFulfilled, onRejected)`**：用于注册 `Promise` 状态变为 `fulfilled` 或 `rejected` 之后的回调函数。`loadImg('...').then(img => { ... })` 就是注册了成功状态的回调。
*   **`.catch(onRejected)`**：是 `.then(null, onRejected)` 的语法糖，专门用于捕获链条中任何一个环节发生的 `rejected` 状态。它能捕获其前面所有 `.then()` 中发生的错误或 `reject` 调用。
*   **Promise 链式调用**：`.then()` 方法本身也会返回一个新的 `Promise`，这使得我们可以无限链接下去。
    *   **传递值**：当 `.then` 的回调函数返回一个非 `Promise` 值时（如 `return img1`），这个值会作为成功的结果，被包装成一个新的 `fulfilled` 状态的 `Promise`，并传递给下一个 `.then()`。
    *   **传递 Promise**：当 `.then` 的回调函数返回一个 `Promise` 实例时（如 `return loadImg(url2)`），整个链条会“暂停”，等待这个新的 `Promise` 状态落定。如果新 `Promise` 成功，其结果会传递给下一个 `.then()`；如果失败，则会跳过后续的 `.then()`，直接进入 `.catch()`。这是实现**串行异步任务**的核心。
*   **`Promise.all(iterable)`**：接收一个 `Promise` 数组，返回一个新的 `Promise`。当数组中所有 `Promise` 都成功时，它才会成功，并且结果是一个包含所有 `Promise` 结果的数组（按顺序）。如果其中任何一个 `Promise` 失败，它会立即失败，并返回第一个失败 `Promise` 的原因。适用于**并行加载**多个互不依赖的资源。
*   **`async/await`**：ES2017 引入的语法糖，让异步代码看起来像同步代码。`async` 函数隐式返回一个 `Promise`。`await` 关键字只能在 `async` 函数中使用，它会暂停函数的执行，等待它后面的 `Promise` 完成，然后返回 `Promise` 的结果。错误处理则使用标准的 `try...catch` 语句。

#### 3. 用途 (用在那个地方)

*   **图片预加载**：在显示图片轮播、相册或游戏资源前，提前加载图片到浏览器缓存，以提升用户体验，避免图片在显示时才开始加载造成的闪烁或空白。
*   **依赖加载**：确保一张关键图片（如背景图）加载完成后，再执行后续的 DOM 操作或动画，保证视觉效果的正确性。
*   **获取图片尺寸**：在图片被插入 DOM 之前，安全地获取其原始 `width` 和 `height`，用于布局计算。
*   **Canvas 绘图**：在将图片绘制到 `<canvas>` 上之前，必须确保图片已经完全加载。`loadImg` 可以完美解决这个问题。
*   **批量加载管理**：结合 `Promise.all`，可以轻松实现多个图片全部加载完成后再显示页面的功能，并统一处理加载进度或失败情况。

#### 4. 完整代码示例

我们在现有代码基础上，补充了 `Promise.all` 和 `async/await` 的使用场景。

**HTML (`index.html`)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promise Image Loader Demo</title>
    <style>
        body { font-family: sans-serif; }
        #container { border: 2px solid #ccc; padding: 10px; min-height: 200px; }
        img { max-width: 150px; margin: 5px; border: 1px solid #ddd; }
        .status { margin-top: 10px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Promise Image Loader Demo</h1>
    <div id="container"></div>
    <div id="status" class="status"></div>

    <button onclick="runSequentialDemo()">加载串行图片</button>
    <button onclick="runParallelDemo()">加载并行图片 (Promise.all)</button>
    <button onclick="runAsyncAwaitDemo()">加载串行图片 (async/await)</button>
    <button onclick="runFailDemo()">测试加载失败</button>
  
    <script src="loader.js"></script>
</body>
</html>
```

**JavaScript (`loader.js`)**

```javascript
/* --- 核心函数 --- */
function loadImg(src) {
    const p = new Promise(
        (resolve, reject) => {
            const img = document.createElement('img');
            // 关键：必须先设置事件监听，再设置 src
            img.onload = () => {
                resolve(img);
            };
            img.onerror = () => {
                const err = new Error(`图片加载失败: ${src}`);
                reject(err);
            };
            img.src = src;
        }
    );
    return p;
}

// 准备一些图片 URL
const url1 = 'https://img.mukewang.com/5a9fc8070001a82402060220-140-140.jpg';
const url2 = 'https://img3.mukewang.com/5a9fc8070001a82402060220-100-100.jpg';
const url3 = 'https://img.imooc.com/static/img/index/logo.png';
const invalidUrl = 'https://example.com/non-existent-image.jpg'; // 一个无效的URL

const container = document.getElementById('container');
const statusDiv = document.getElementById('status');

function clearContainer() {
    container.innerHTML = '';
    statusDiv.textContent = '准备加载...';
}

/* --- 1. 串行加载示例 (Sequential .then chain) --- */
function runSequentialDemo() {
    clearContainer();
    statusDiv.textContent = '开始串行加载...';
  
    loadImg(url1).then(img1 => {
        statusDiv.textContent = '第一张图加载成功，正在加载第二张...';
        console.log('Image 1 width:', img1.width);
        container.appendChild(img1);
        return loadImg(url2); // 返回新的 Promise
    }).then(img2 => {
        statusDiv.textContent = '第二张图加载成功！';
        console.log('Image 2 width:', img2.width);
        container.appendChild(img2);
    }).catch(ex => {
        statusDiv.textContent = `加载失败: ${ex.message}`;
        console.error(ex);
    });
}

/* --- 2. 并行加载示例 (Promise.all) --- */
function runParallelDemo() {
    clearContainer();
    statusDiv.textContent = '开始并行加载...';
  
    const urls = [url1, url2, url3];
    const promises = urls.map(url => loadImg(url));

    Promise.all(promises).then(images => {
        statusDiv.textContent = '所有图片并行加载成功！';
        console.log('All images loaded:', images);
        images.forEach(img => container.appendChild(img));
    }).catch(ex => {
        statusDiv.textContent = `并行加载失败: ${ex.message}`;
        console.error(ex);
    });
}

/* --- 3. Async/Await 示例 --- */
async function runAsyncAwaitDemo() {
    clearContainer();
    statusDiv.textContent = '开始使用 async/await 加载...';

    try {
        const img1 = await loadImg(url1);
        statusDiv.textContent = '第一张图加载成功 (await)...';
        console.log('Image 1 width:', img1.width);
        container.appendChild(img1);

        const img2 = await loadImg(url2);
        statusDiv.textContent = '第二张图加载成功 (await)!';
        console.log('Image 2 width:', img2.width);
        container.appendChild(img2);
    } catch (ex) {
        statusDiv.textContent = `加载失败 (await): ${ex.message}`;
        console.error(ex);
    }
}

/* --- 4. 失败处理示例 --- */
function runFailDemo() {
    clearContainer();
    statusDiv.textContent = '正在尝试加载一个无效的图片...';
  
    loadImg(invalidUrl).then(img => {
        // 这部分代码不会执行
        container.appendChild(img);
    }).catch(ex => {
        statusDiv.textContent = `捕获到错误: ${ex.message}`;
        console.error('成功捕获了预期的错误:', ex);
    });
}
```

[标签: JavaScript, Promise, 异步, ES6]

---

### 面试官考察

如果你是面试官，基于这个文件，你可以提出以下问题。

#### 针对核心代码的10个问题

1.  **问：** `loadImg` 函数为什么不直接返回 `img` 元素，而是返回一个 `Promise`？
    **答：** 因为图片加载是一个**异步**操作。在调用 `loadImg` 并设置 `img.src` 后，代码会立即继续执行，此时图片还没有加载完成。返回 `Promise` 是为了提供一个占位符，代表这个未来才会完成的操作。调用者可以通过 `.then()` 来注册当操作完成时需要执行的代码，从而正确地处理异步流程。

2.  **问：** 在 `loadImg` 函数中，如果我把 `img.src = src` 这一行移到 `img.onload` 和 `img.onerror` 定义之前，可能会发生什么问题？
    **答：** 可能会发生 **race condition（竞态条件）**。如果图片非常小或已经被浏览器缓存，加载可能会瞬间完成。如果 `img.src` 在事件监听器被设置**之前**赋值，`load` 事件可能在监听器绑定前就已经触发了，导致 `onload` 回调永远不会被执行，`Promise` 也将永远停留在 `pending` 状态，不会 `resolve`。因此，正确的顺序是先设置好所有事件监听器，再通过设置 `src` 来触发加载。

3.  **问：** 请解释一下在第二个 `.then` 链示例中，`return img1` 和 `return loadImg(url2)` 对 `Promise` 链的行为有什么本质不同？
    **答：**
    *   `return img1`：返回的是一个**普通对象**。`Promise` 链会立即将这个对象包装成一个 `fulfilled` 状态的 `Promise`，并将其作为结果传递给下一个 `.then()`。
    *   `return loadImg(url2)`：返回的是一个**新的 `Promise` 实例**。`Promise` 链会识别到这一点，并会**等待**这个新的 `Promise` 解决（`resolve` 或 `reject`）。只有当 `loadImg(url2)` 返回的 `Promise` 完成后，链条才会继续，并将新 `Promise` 的结果传递给下一个 `.then()`。这就是实现异步任务串行执行的关键。

4.  **问：** 如果一个 `Promise` 链中没有 `.catch()`，而其中一个 `Promise` 被 `reject` 了，会发生什么？
    **答：** 会产生一个 "Uncaught (in promise)" 错误，这个未捕获的 `Promise` rejection 会在浏览器控制台中报告。这是一种应该避免的情况，因为它意味着程序中存在未处理的潜在错误。最佳实践是总是在 `Promise` 链的末尾加上一个 `.catch()` 来统一处理所有可能的错误。

5.  **问：** `Promise` 解决了传统回调函数的什么主要问题？
    **答：** 主要解决了两个问题：
    1.  **回调地狱（Callback Hell）**：多层嵌套的回调函数导致代码横向发展，难以阅读和维护。`Promise` 的链式调用 `.then()` 将其变成了纵向的、线性的代码流。
    2.  **信任问题和控制反转**：在回调模式中，我们将后续操作的控制权（即回调函数）交给了第三方异步函数。而 `Promise` 将控制权保留在了我们自己手中，我们可以自己决定何时通过 `.then()` 附加后续操作，并且 `Promise` 的状态一旦改变就不可逆，保证了回调只会被调用一次。

6.  **问：** 一个 `Promise` 的状态有几种？它们之间是如何转换的？
    **答：** 有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）。状态只能从 `pending` 转换到 `fulfilled` 或 `rejected`，并且这个过程是单向的、不可逆的。一旦 `Promise` 的状态改变，它就会永远保持那个状态。

7.  **问：** 你能解释一下 `Promise` 和事件循环（Event Loop）中的微任务（Microtask）有什么关系吗？
    **答：** `.then()`, `.catch()`, `.finally()` 中注册的回调函数会被放入**微任务队列（Microtask Queue）**。在一个事件循环的 tick 中，当主线程的同步代码执行完毕后，引擎会立即清空微任务队列中的所有任务，然后才会去处理宏任务队列（Macrotask Queue，如 `setTimeout`, `setInterval`, I/O 操作）中的下一个任务。这意味着 `Promise` 的回调比 `setTimeout` 的回调有更高的执行优先级。

8.  **问：** `Promise.resolve(value)` 和 `new Promise(resolve => resolve(value))` 有什么区别？
    **答：** 在大多数情况下，它们的效果是等价的，都创建一个已 `resolve` 的 `Promise`。但有一个细微区别：如果 `value` 本身就是一个 `Promise`，`Promise.resolve(value)` 会直接返回这个 `value`（即同一个 `Promise` 实例），而 `new Promise(...)` 总是会创建一个全新的 `Promise` 实例来包装它。`Promise.resolve()` 是一个更简洁、更常用的方式来创建已解决的 `Promise`。

9.  **问：** 如果我需要加载10张图片，但只要有任意一张加载失败，我就需要立即执行一个失败处理逻辑，我应该用什么 `Promise` 的静态方法？
    **答：** 应该使用 `Promise.all()`。它接收一个 `Promise` 数组，如果其中任何一个 `Promise` 变为 `rejected`，`Promise.all` 返回的新 `Promise` 也会立即变为 `rejected`，并携带第一个失败 `Promise` 的错误原因，这完全符合需求。

10. **问：** `reject(new Error('...'))` 和 `reject('...')` 之间有什么好坏之分？
    **答：** 强烈推荐使用 `reject(new Error('...'))`。虽然 `reject` 可以接受任何值，但传递一个 `Error` 对象是最佳实践。因为 `Error` 对象包含了`stack trace`（堆栈跟踪信息），这在调试时非常宝贵，可以帮助快速定位错误发生的位置。如果只传递一个字符串，调试信息会少很多。

#### 针对补充例子的5个问题

1.  **问：** 在 `runParallelDemo` 中，我们使用了 `urls.map(url => loadImg(url))`。请问 `map` 函数执行完毕后，图片开始加载了吗？为什么？
    **答：** 是的，已经开始加载了。`loadImg(url)` 函数的定义是，一旦被调用，它内部的 `Promise` 执行器就会立即执行，即创建 `<img>` 元素并设置 `src` 属性。`map` 方法会遍历 `urls` 数组并**立即调用** `loadImg` 函数，所以所有图片的加载请求几乎是同时发出的。`map` 的返回值是一个由这些正在 `pending` 的 `Promise` 组成的数组。

2.  **问：** 请对比 `runSequentialDemo` 的 `.then` 链和 `runAsyncAwaitDemo` 的 `try...catch` 块。你认为 `async/await` 在代码可读性和错误处理方面带来了哪些优势？
    **答：**
    *   **可读性**：`async/await` 让异步代码的结构看起来和同步代码几乎一样，是线性的、从上到下的执行流程，非常直观。相比之下，`.then` 链虽然也是线性的，但需要理解回调函数和闭包的概念。
    *   **错误处理**：`async/await` 可以使用标准的 `try...catch` 结构来捕获异步操作的错误，这与同步代码的错误处理方式完全一致，非常自然。而 `.then` 链需要一个专门的 `.catch()` 方法，并且对于复杂的逻辑，错误处理的范围可能不如 `try...catch` 那样清晰。

3.  **问：** 如果我需要加载10张图片，并且无论成功还是失败，我都想知道每一张图片的结果，我应该使用什么 `Promise` 的静态方法？
    **答：** 应该使用 `Promise.allSettled()`。它接收一个 `Promise` 数组，并返回一个新的 `Promise`。这个新 `Promise` 永远不会 `reject`，它总是在所有输入的 `Promise` 都 settle（即 `fulfilled` 或 `rejected`）后才 `fulfilled`。它的结果是一个对象数组，每个对象描述了对应 `Promise` 的最终状态（`status: 'fulfilled'` 或 `status: 'rejected'`）和结果/原因。

4.  **问：** 假设我想同时请求两张图片，但只关心哪一张**最先**加载完成，并用它做一些事，我该怎么实现？
    **答：** 应该使用 `Promise.race()`。它接收一个 `Promise` 数组，返回一个新的 `Promise`。这个新 `Promise` 的状态会与输入数组中第一个 settle（`fulfilled` 或 `rejected`）的 `Promise` 的状态保持一致。所以 `Promise.race([loadImg(urlA), loadImg(urlB)])` 会在 `urlA` 和 `urlB` 中最快加载完成的那一个 `resolve` 时也跟着 `resolve`。

5.  **问：** 在 `runAsyncAwaitDemo` 函数中，如果我把 `await loadImg(url1)` 和 `await loadImg(url2)` 分别赋值，这两张图片是并行加载还是串行加载的？如果我希望它们并行加载但仍然使用 `async/await`，该如何修改代码？
    **答：** 是**串行加载**的。因为 `await` 会暂停函数的执行，直到 `loadImg(url1)` 完成后，才会继续执行并开始调用 `loadImg(url2)`。
    要实现并行加载，可以先同时触发两个加载任务，然后用 `Promise.all` 来统一等待它们的结果。修改如下：
    ```javascript
    async function runParallelAsyncAwaitDemo() {
        try {
            // 1. 同时发起两个加载请求，获得两个 Promise
            const promise1 = loadImg(url1);
            const promise2 = loadImg(url2);

            // 2. 使用 Promise.all 并行等待它们全部完成
            const [img1, img2] = await Promise.all([promise1, promise2]);
          
            // 3. 都加载完后再操作
            container.appendChild(img1);
            container.appendChild(img2);
            statusDiv.textContent = '两张图已通过 await + Promise.all 并行加载完成！';
        } catch(ex) {
            // ... 错误处理
        }
    }
    ```

---

### 快速使用指南

当你忘记如何使用时，参考这里快速上手：

**目标：** 在你的项目里用 `loadImg` 函数加载一张或多张图片。

**步骤 1：复制核心函数**
把 `loadImg` 函数的代码复制到你的 JavaScript 文件中。

```javascript
function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`图片加载失败 ${src}`));
        img.src = src;
    });
}
```

**步骤 2：选择你的使用方式**

**A) 加载单张图片 (最常用)**
```javascript
const imageUrl = 'path/to/your/image.jpg';

loadImg(imageUrl)
    .then(loadedImage => {
        // 成功了！loadedImage 是一个 <img> DOM 元素
        console.log(`图片加载成功，尺寸: ${loadedImage.width}x${loadedImage.height}`);
        document.body.appendChild(loadedImage); //把它显示在页面上
    })
    .catch(error => {
        // 失败了！
        console.error('加载出错了:', error);
    });
```

**B) 并行加载多张图片，全部成功后再执行操作**
```javascript
const urls = ['image1.png', 'image2.png', 'image3.png'];

// 1. 把 url 数组变成 Promise 数组
const promises = urls.map(loadImg);

// 2. 用 Promise.all 等待全部完成
Promise.all(promises)
    .then(images => {
        // 成功了！images 是一个 [img1, img2, img3] 数组
        images.forEach(img => document.body.appendChild(img));
    })
    .catch(error => {
        // 只要有一个失败了，就会进到这里
        console.error('批量加载时有图片失败了:', error);
    });
```

**C) 使用现代的 `async/await` 语法 (推荐在 async 函数中使用)**
```javascript
async function displayImages() {
    try {
        const img1 = await loadImg('image1.png');
        document.body.appendChild(img1);
      
        const img2 = await loadImg('image2.png');
        document.body.appendChild(img2);
    } catch (error) {
        console.error('在 async 函数中加载图片失败:', error);
    }
}

// 调用这个 async 函数
displayImages();
```