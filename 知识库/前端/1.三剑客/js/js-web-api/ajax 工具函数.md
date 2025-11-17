
### AJAX 是什么？

**AJAX** 的全称是 **A**synchronous **J**avaScript **A**nd **X**ML（异步的 JavaScript 和 XML）。

简单来说，**AJAX 是一种在不重新加载整个网页的情况下，与服务器交换数据并更新部分网页内容的技术。**

为了更好地理解，我们可以对比一下 “传统网页” 和 “使用了 AJAX 的网页”：

| 传统网页（同步）                                             | 使用 AJAX 的网页（异步）                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1. 用户点击一个链接或提交一个表单。                          | 1. 用户在页面上进行某个操作（比如点击按钮、输入文字）。        |
| 2. 浏览器向服务器发送一个完整的请求。                        | 2. 页面中的 JavaScript 代码在**后台**向服务器发送一个请求。     |
| 3. **浏览器显示一个空白页或加载动画，等待服务器响应。**        | 3. **用户可以继续与页面交互，完全不受影响。**                  |
| 4. 服务器处理完请求后，返回一个**全新的 HTML 页面**。        | 4. 服务器处理完请求后，只返回**需要的数据**（通常是 JSON 格式）。 |
| 5. 浏览器接收并完整地渲染这个新页面，用户才看到更新。        | 5. JavaScript 接收到数据后，**只更新页面上需要变化的部分**。   |

**核心思想：**

*   **异步 (Asynchronous)**：这是 AJAX 最关键的特性。就像你发短信（异步）而不是打电话（同步）。发完短信后你可以继续做别的事，等对方回复了再看。AJAX 向服务器发送请求后，不会傻等在那里，用户可以继续浏览和操作页面。
*   **只更新局部**：不再需要服务器返回整个 HTML 页面，只需要返回必要的数据，然后用 JavaScript 来动态更新 DOM，这大大减少了数据传输量，提升了速度和用户体验。

**一个生活中的例子**:
当你在B站看视频，一边看视频，一边下拉滚动评论区，新的评论会自动加载出来，但你的视频播放并没有中断。这就是 AJAX 在起作用：它在后台请求新的评论数据，拿到后动态地插入到评论区，而不需要刷新整个视频页面。

> **注意**：虽然名字里有 XML，但现在几乎所有场景都使用 **JSON (JavaScript Object Notation)** 来传输数据，因为它更轻量，并且在 JavaScript 中处理起来更方便。但 AJAX 这个名字已经约定俗成了。

### 实现 AJAX 的“函数”有哪些？

“函数”这个词在这里可以理解为“实现 AJAX 功能的方式或 API”。主要有以下三种：

---

#### 1. 原生的 `XMLHttpRequest` (XHR) 对象

这是实现 AJAX 最原始、最经典的方式。它不是一个简单的函数，而是一个浏览器提供的 **API 对象**，你需要创建它的实例并调用其方法。

**特点**：
*   功能强大，兼容性好（所有浏览器都支持）。
*   API 写法比较繁琐，配置项多。

**核心步骤：**
1.  **创建** XHR 实例：`const xhr = new XMLHttpRequest();`
2.  **打开** 连接：`xhr.open('GET', 'your-api-url');`
3.  **设置** 状态监听函数：`xhr.onreadystatechange = function() { ... }`，用于处理响应。
4.  **发送** 请求：`xhr.send();`

**代码示例**：
```javascript
// 1. 创建 XMLHttpRequest 对象
const xhr = new XMLHttpRequest();

// 2. 配置请求：使用 GET 方法请求一个 API 地址
xhr.open('GET', 'https://api.github.com/users/octocat');

// 3. 设置回调函数来处理服务器的响应
xhr.onreadystatechange = function() {
    // readyState === 4 表示请求已完成
    // status === 200 表示请求成功 ("OK")
    if (xhr.readyState === 4 && xhr.status === 200) {
        // xhr.responseText 包含服务器返回的文本数据（通常是 JSON 字符串）
        const userData = JSON.parse(xhr.responseText);
        console.log(userData.name); // 打印用户名
        document.body.innerHTML = `<h1>${userData.name}</h1>`; // 更新页面
    } else if (xhr.readyState === 4) {
        // 请求完成但失败了
        console.error('请求失败，状态码:', xhr.status);
    }
};

// 4. 发送请求
xhr.send();
```

---

#### 2. Fetch API

这是现代浏览器中推荐使用的**新一代**网络请求 API。它不是 XHR 的升级版，而是一套全新的标准。

**特点**:
*   **语法更简洁、更现代化**，基于 `Promise`，可以很方便地使用 `async/await`。
*   API 设计更合理，更强大。
*   老旧浏览器（如 IE）不支持。

**核心步骤：**
`fetch()` 是一个真正的函数，它返回一个 Promise 对象。

```javascript
fetch('https://api.github.com/users/octocat')
    .then(response => {
        // 第一步：检查响应是否成功
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        // response.json() 也是一个异步操作，返回一个 Promise
        return response.json();
    })
    .then(userData => {
        // 第二步：成功获取并解析 JSON 数据
        console.log(userData.name);
        document.body.innerHTML = `<h1>${userData.name}</h1>`;
    })
    .catch(error => {
        // 捕获任何在请求过程中发生的错误
        console.error('Fetch 操作失败:', error);
    });
```
使用 `async/await` 可以让代码看起来更像同步代码，更易读：

```javascript
async function fetchUser() {
    try {
        const response = await fetch('https://api.github.com/users/octocat');
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        const userData = await response.json();
        console.log(userData.name);
        document.body.innerHTML = `<h1>${userData.name}</h1>`;
    } catch (error) {
        console.error('Fetch 操作失败:', error);
    }
}

fetchUser();
```

---

#### 3. 第三方库（如 jQuery, Axios）

在 `Fetch API` 普及之前，因为 `XMLHttpRequest` 写法繁琐，很多开发者会使用第三方库来简化 AJAX 操作。

##### a) jQuery 的 `$.ajax`

**特点**:
*   **非常简单易用**，一行代码就能发起请求。
*   **兼容性极好**，它在内部封装了 `XMLHttpRequest` 并处理了所有浏览器兼容性问题。
*   现在如果你的项目没有使用 jQuery，不建议为了 AJAX 单独引入它。

**代码示例**:
```javascript
$.ajax({
    url: 'https://api.github.com/users/octocat',
    method: 'GET',
    success: function(userData) {
        // 请求成功的回调
        console.log(userData.name);
        $('body').html(`<h1>${userData.name}</h1>`);
    },
    error: function(xhr, status, error) {
        // 请求失败的回调
        console.error('请求失败:', error);
    }
});
```

##### b) Axios

**特点**:
*   一个**专门用于网络请求**的现代库，轻量且强大。
*   可以在浏览器和 Node.js 中使用（同构）。
*   API 基于 Promise，支持 `async/await`。
*   提供了许多便利功能，如请求/响应拦截器、自动转换 JSON 数据、取消请求等。

**代码示例**:
```javascript
// 需要先通过 <script> 标签或 npm/yarn 引入 Axios
axios.get('https://api.github.com/users/octocat')
    .then(function (response) {
        // 请求成功
        const userData = response.data;
        console.log(userData.name);
        document.body.innerHTML = `<h1>${userData.name}</h1>`;
    })
    .catch(function (error) {
        // 请求失败
        console.error('Axios 请求失败:', error);
    });
```

### 总结

| 方法                 | 优点                                             | 缺点                                       | 适用场景                               |
| -------------------- | ------------------------------------------------ | ------------------------------------------ | -------------------------------------- |
| **XMLHttpRequest**   | 无需任何库，兼容所有浏览器                       | 写法繁琐，基于回调函数，容易产生“回调地狱” | 需要兼容古老浏览器的项目或底层库封装。 |
| **Fetch API**        | **现代标准**，基于 Promise，语法简洁，功能强大     | IE 等老浏览器不支持，部分高级功能需自己封装 | **现代 Web 开发的首选**。                |
| **jQuery.ajax**      | 简单易用，兼容性极好                             | 需要引入整个 jQuery 库，有点“重”           | 仍在使用 jQuery 的老项目中。           |
| **Axios**            | 功能丰富，API友好，支持拦截器等高级功能，可同构 | 需要引入一个额外的库                       | 复杂项目，特别是需要统一前后端请求方式 |




### **基于 Promise 封装 XMLHttpRequest 的 AJAX 工具函数开发文档**

#### **一、总结**

原始代码的核心思想是**将原生、基于回调的 `XMLHttpRequest` (XHR) 对象封装成一个现代化的、基于 `Promise` 的异步函数 `ajax()`**。

这样做的好处是：

1.  **告别回调地狱（Callback Hell）**：使用 `.then().catch()` 的链式调用，使异步代码的逻辑更清晰、更易于阅读和维护。
2.  **统一的错误处理**：通过 `.catch()` 方法可以集中捕获请求过程中（如网络错误、服务器错误）抛出的任何异常。
3.  **更好的组合性**：Promise 可以轻松地与 `Promise.all`、`Promise.race` 等方法组合，处理复杂的并发请求场景。

原始代码实现了一个基础的 `GET` 请求封装，我们将在此基础上进行扩展，使其支持更丰富的功能。

#### **二、完整代码示例 (在现有代码基础上补充知识点)**

为了构成一个完整的、可运行的示例，我们需要一个 HTML 文件、一个 JavaScript 文件以及一些模拟的 JSON 数据。

**项目结构:**

```
/my-ajax-project
|-- index.html         # 前端页面
|-- main.js            # 我们的JS代码
|-- /data
|   |-- user.json      # 模拟用户数据
|   |-- config.json    # 模拟配置数据
```

**1. `data/user.json` (模拟数据)**

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com"
}
```

**2. `data/config.json` (模拟数据)**

```json
{
  "version": "1.0.0",
  "theme": "dark"
}
```

**3. `index.html` (承载页面)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJAX Promise Example</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .result-box { border: 1px solid #ccc; padding: 10px; margin-top: 10px; background-color: #f9f9f9; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body>
    <h1>AJAX with Promise Demo</h1>

    <button id="btnGetUser">获取用户数据 (GET)</button>
    <div id="userResult" class="result-box"></div>

    <button id="btnPostData">提交新用户 (POST)</button>
    <div id="postResult" class="result-box"></div>

    <button id="btnGetAll">同时获取用户和配置 (Promise.all)</button>
    <div id="allResult" class="result-box"></div>

    <button id="btn404">测试404错误</button>
    <div id="errorResult" class="result-box"></div>

    <script src="main.js"></script>
</body>
</html>
```

**4. `main.js` (核心代码与用法演示)**

```javascript
/**
 * 基于 Promise 封装的通用 AJAX 函数
 * @param {object} options - 请求配置对象
 * @param {string} options.url - 请求的 URL (必须)
 * @param {string} [options.method='GET'] - 请求方法 (GET, POST, PUT, DELETE 等)
 * @param {object|string|null} [options.data=null] - 需要发送的数据 (对于 POST/PUT 请求)
 * @param {object} [options.headers={}] - 自定义请求头
 * @returns {Promise<any>} - 返回一个 Promise 对象，成功时 resolve 数据，失败时 reject 错误
 */
function ajax(options) {
    // 解构参数并提供默认值
    const {
        url,
        method = 'GET',
        data = null,
        headers = {}
    } = options;

    const p = new Promise((resolve, reject) => {
        // 1. 创建 XHR 对象
        const xhr = new XMLHttpRequest();

        // 2. 初始化请求 (open)
        // 第三个参数 `true` 表示异步请求，这是现代Web开发的标准实践
        xhr.open(method.toUpperCase(), url, true);

        // 3. 设置请求头 (setRequestHeader)
        // 必须在 open() 之后, send() 之前调用
        // 设置一个通用的 JSON 内容类型头，实际应用中可能需要更多
        Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });
      
        // 如果是POST请求且数据是对象，则默认设置为JSON格式
        if (method.toUpperCase() === 'POST' && typeof data === 'object' && data !== null) {
            // 确保没有被用户重写
            if (!headers['Content-Type']) {
              xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            }
        }

        // 4. 监听状态变化 (onreadystatechange)
        xhr.onreadystatechange = function () {
            // readyState === 4 表示请求已完成
            if (xhr.readyState === 4) {
                // status 200-299 表示成功
                if (xhr.status >= 200 && xhr.status < 300) {
                    // 尝试解析JSON，如果失败则返回原始文本
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        resolve(xhr.responseText); // 如果后端返回的不是JSON，则直接返回文本
                    }
                } else {
                    // 其他状态码 (如 404, 500) 表示失败
                    reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
                }
            }
        };

        // 5. 设置错误处理器 (onerror) - 处理网络层面错误
        xhr.onerror = function() {
            reject(new Error('Network error occurred.'));
        };

        // 6. 发送请求 (send)
        let body = null;
        if (data) {
            // 如果数据是对象，将其序列化为JSON字符串
            if (typeof data === 'object') {
                body = JSON.stringify(data);
            } else {
                body = data; // 保持原样 (如字符串)
            }
        }
        xhr.send(body);
    });
  
    return p;
}

// ---- 用法演示 ----

// 辅助函数，用于在页面上显示结果
function displayResult(elementId, data) {
    const el = document.getElementById(elementId);
    el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

function displayError(elementId, error) {
    const el = document.getElementById(elementId);
    el.innerHTML = `<pre style="color: red;">${error.message}</pre>`;
}

// 示例1: GET 请求
document.getElementById('btnGetUser').addEventListener('click', () => {
    ajax({ url: '/data/user.json', method: 'GET' })
        .then(res => {
            console.log('GET Success:', res);
            displayResult('userResult', res);
        })
        .catch(err => {
            console.error('GET Error:', err);
            displayError('userResult', err);
        });
});

// 示例2: POST 请求 (模拟)
document.getElementById('btnPostData').addEventListener('click', () => {
    const newUser = { name: 'Bob', job: 'Developer' };
  
    // 实际项目中，URL应该是后端API接口，如 '/api/users'
    // 这里我们用一个存在的json文件来模拟，虽然它不会处理POST，但请求会成功发送
    ajax({
        url: 'https://jsonplaceholder.typicode.com/posts', // 使用一个公共的测试API
        method: 'POST',
        data: newUser,
        headers: {
            'X-Custom-Header': 'MyAjaxTest'
        }
    })
    .then(res => {
        console.log('POST Success:', res);
        displayResult('postResult', res);
    })
    .catch(err => {
        console.error('POST Error:', err);
        displayError('postResult', err);
    });
});

// 示例3: 使用 Promise.all 并发请求
document.getElementById('btnGetAll').addEventListener('click', () => {
    const p1 = ajax({ url: '/data/user.json' });
    const p2 = ajax({ url: '/data/config.json' });

    Promise.all([p1, p2])
        .then(([userData, configData]) => {
            const combinedData = { user: userData, config: configData };
            console.log('Promise.all Success:', combinedData);
            displayResult('allResult', combinedData);
        })
        .catch(err => {
            console.error('Promise.all Error:', err);
            displayError('allResult', err);
        });
});

// 示例4: 测试错误处理 (请求一个不存在的URL)
document.getElementById('btn404').addEventListener('click', () => {
    ajax({ url: '/data/non-existent-file.json' })
        .then(res => {
            displayResult('errorResult', res);
        })
        .catch(err => {
            console.error('404 Error Caught:', err);
            displayError('errorResult', err);
        });
});
```

#### **三、学习知识**

1.  **XMLHttpRequest (XHR)**
    *   **`new XMLHttpRequest()`**: 创建一个 XHR 实例，它是浏览器提供的用于与服务器进行交互的 API。
    *   **`open(method, url, async)`**: 初始化一个请求。
        *   `method`: 请求方法，如 'GET', 'POST', 'PUT' 等。
        *   `url`: 请求的地址。
        *   `async`: `true` 表示异步，`false` 表示同步。**强烈推荐始终使用异步**，否则会阻塞浏览器 UI。
    *   **`send(body)`**: 发送请求。对于 `GET` 请求，`body` 通常为 `null` 或省略。对于 `POST` 请求，`body` 是要发送的数据。
    *   **`onreadystatechange`**: 一个事件处理器，当 `readyState` 属性改变时触发。
    *   **`readyState`**: 存有 XHR 的状态，从 0 到 4。
        *   `0`: (Unsent) `open()` 尚未调用。
        *   `1`: (Opened) `open()` 已调用。
        *   `2`: (Headers Received) `send()` 已调用，并且头部和状态可用。
        *   `3`: (Loading) 正在下载响应，`responseText` 属性可能已有部分数据。
        *   `4`: (Done) 操作完成。
    *   **`status`**: HTTP 状态码（如 `200`, `404`, `500`）。只有在 `readyState` 为 `3` 或 `4` 时才可用。
    *   **`responseText`**: 服务器响应的文本内容。
    *   **`setRequestHeader(key, value)`**: 设置请求头信息，必须在 `open()` 之后、`send()` 之前调用。
    *   **`onerror`**: 在请求发生网络错误时（如DNS查询失败、网络不通）触发。

2.  **Promise**
    *   **`new Promise((resolve, reject) => { ... })`**: 创建一个 Promise 实例。构造函数接受一个 "executor" 函数，这个函数立即执行，并带有 `resolve` 和 `reject` 两个参数。
        *   `resolve(value)`: 当异步操作成功时调用，将 Promise 的状态从 `pending` 变为 `fulfilled`，并将 `value` 传递给 `.then()`。
        *   `reject(error)`: 当异步操作失败时调用，将 Promise 的状态从 `pending` 变为 `rejected`，并将 `error` 传递给 `.catch()`。
    *   **`.then(onFulfilled, onRejected)`**: 用于处理 Promise 成功（`onFulfilled`）或失败（`onRejected`）的结果，并返回一个新的 Promise，从而实现链式调用。
    *   **`.catch(onRejected)`**: `.then(null, onRejected)` 的语法糖，专门用于捕获错误。
    *   **`Promise.all(iterable)`**: 接收一个 Promise 数组，当所有 Promise 都成功时，它才会成功，并返回一个包含所有结果的数组。如果其中任何一个失败，它会立即失败，并返回第一个失败 Promise 的原因。

3.  **JSON (JavaScript Object Notation)**
    *   **`JSON.stringify(object)`**: 将 JavaScript 对象或值转换为 JSON 字符串。在发送 `POST` 请求时，通常需要将对象数据序列化。
    *   **`JSON.parse(string)`**: 将 JSON 格式的字符串解析为 JavaScript 对象或值。在接收到服务器响应时常用。

#### **四、用途（用在那个地方）**

这个 `ajax` 工具函数是所有需要前后端数据交互场景的基础。具体用途包括：

1.  **动态加载页面数据**：进入页面后，通过 AJAX 获取文章列表、商品信息、用户信息等，并渲染到页面上，实现动态内容展示。
2.  **表单提交**：用户填写注册、登录或发布内容的表单后，通过 AJAX 将数据以 `POST` 方式发送到服务器，无需刷新整个页面即可获得成功或失败的反馈。
3.  **无限滚动/懒加载**：当用户滚动到页面底部时，自动发起 AJAX 请求获取下一页数据并追加到当前列表末尾。
4.  **实时搜索提示**：在搜索框中，用户每输入一个字符，就通过 AJAX 向服务器发送请求，获取相关的搜索建议并显示出来。
5.  **数据看板和图表**：定时或按需通过 AJAX 从服务器获取最新数据，刷新 ECharts、D3.js 等图表库的展示。
6.  **单页面应用 (SPA)**：在 Vue, React, Angular 等框架中，页面切换和数据获取几乎完全依赖 AJAX 技术。这个封装好的函数可以被整合到框架的网络请求层中。

[标签: JavaScript, AJAX, Promise, XMLHttpRequest]

***

### **面试官考察**

如果你是面试官，你会怎么考察这个文件里的内容？

#### **基础技术题 (10道)**

1.  **问题**：请解释一下 `XMLHttpRequest` 的 `readyState` 属性的 5 个值分别代表什么意思？为什么我们主要关心 `readyState === 4`？
    **答案**：`0` (未初始化), `1` (已打开), `2` (已发送), `3` (接收中), `4` (完成)。我们关心 `4` 是因为它代表整个HTTP请求-响应周期已经结束，此时我们才能安全地获取完整的响应数据 (`responseText`) 和最终的HTTP状态码 (`status`)。

2.  **问题**：在这段代码中，`xhr.open()` 的第三个参数 `true` 有什么作用？如果把它设为 `false` 会发生什么？
    **答案**：`true` 表示这是一个异步请求，这是标准用法。它意味着 `xhr.send()` 执行后，代码会继续往下走，不会等待服务器响应。如果设为 `false`，则变为同步请求，JavaScript主线程会被阻塞，直到服务器返回响应为止，期间浏览器页面会冻结，用户无法进行任何操作，用户体验极差，因此应极力避免。



4.  **问题**: 为什么在封装的 `ajax` 函数中要返回一个 `Promise` 对象，而不是直接使用回调函数？
    **答案**: 为了解决“回调地狱”问题。返回 `Promise` 可以利用 `.then()` 进行链式调用，使异步代码写法更接近同步代码，逻辑更清晰。同时，`.catch()` 提供了统一的错误处理机制，并且 `Promise` 可以与 `async/await` 语法糖无缝结合，进一步提升代码可读性。

5.  **问题**：`xhr.onerror` 和在 `onreadystatechange` 中检查 `status` code 有什么区别？
    **答案**：`xhr.onerror` 主要处理网络层面的错误，比如请求无法发出、DNS解析失败、跨域策略阻止等，此时请求根本没有成功到达服务器或无法接收响应。而在 `onreadystatechange` 中检查 `status` code（如 404, 500）处理的是应用层面的错误，即请求已成功完成，但服务器因为某些原因（如资源不存在、内部错误）返回了一个表示失败的HTTP状态。

6.  **问题**：现在有 `fetch` API，为什么我们可能还需要了解或使用 `XMLHttpRequest`？
    **答案**：`fetch` 是更现代、基于 `Promise` 的原生API，是未来的趋势。但了解 XHR 有几个原因：1) 需要维护旧项目或兼容不支持 `fetch` 的老旧浏览器。2) XHR 提供了 `fetch` 默认不具备的一些功能，如监控上传/下载进度（通过 `xhr.upload.onprogress` 事件），这在文件上传等场景中非常重要。3) 深入理解 XHR 有助于更好地理解底层网络请求的机制。

7.  **问题**：在 `POST` 请求中，`Content-Type` 请求头通常设置成什么？这段代码中是如何处理的？
    **答案**：如果发送的是 JSON 数据，通常设置为 `application/json;charset=UTF-8`。代码中做了自动判断：如果方法是 `POST` 且传入的 `data` 是一个对象，它会自动设置这个请求头，并将 `data` 对象用 `JSON.stringify()` 序列化成字符串再发送。

8.  **问题**：当服务器返回的响应不是一个有效的 JSON 字符串时，我们封装的 `ajax` 函数会发生什么？是如何处理的？
    **答案**：`JSON.parse(xhr.responseText)` 会抛出一个语法错误。代码中使用了 `try...catch` 块来捕获这个错误。如果解析失败，它会在 `catch` 块中直接 `resolve(xhr.responseText)`，即将原始的文本内容作为成功的结果返回，而不是让整个 Promise 失败。这增强了函数的健壮性。

9.  **问题**：`Promise.all` 的使用场景是什么？如果其中一个 Promise 失败了会怎么样？
    **答案**：`Promise.all` 用于处理多个互不依赖的异步操作，并希望在所有操作都完成后再进行下一步处理。例如，同时获取用户信息和系统配置。如果其中任何一个 Promise 变为 `rejected` 状态，`Promise.all` 会立即变为 `rejected` 状态，并返回第一个失败的 Promise 的错误原因，其他未完成的 Promise 会继续执行，但它们的结果会被忽略。

10. **问题**：如果我想给所有通过这个 `ajax` 函数发出的请求都统一添加一个认证 `token` 到请求头，你会如何修改这个函数？
    **答案**：直接在 `ajax` 函数内部修改。在 `Object.entries(headers).forEach` 循环之前或之后，硬编码添加 `token`。更好的方式是从 `localStorage` 或某个全局状态管理中读取 `token`，然后设置它：`const token = localStorage.getItem('authToken'); if (token) { xhr.setRequestHeader('Authorization', `Bearer ${token}`); }`。这样所有调用 `ajax` 的地方都会自动带上认证信息。


#### **业务逻辑题 (基于原始代码) (5道)**

1.  **场景**：页面需要先获取当前登录用户的信息 (`/api/user`)，然后根据返回的用户 ID，再去获取该用户的文章列表 (`/api/posts?userId=...`)。请用 `ajax` 函数实现这个串行请求。
    **答案**：这考察的是 Promise 的链式调用。第二个请求依赖于第一个请求的结果，所以必须写在第一个 `.then()` 的回调函数中，并返回新的 Promise。

    ```javascript
    ajax('/api/user')
      .then(user => {
        console.log('用户信息获取成功:', user);
        // 基于第一个请求的结果，发起第二个请求
        // 必须 return 这个新的 Promise，才能继续 .then()
        return ajax(`/api/posts?userId=${user.id}`);
      })
      .then(posts => {
        console.log('用户文章获取成功:', posts);
        // 在这里渲染文章列表
      })
      .catch(err => {
        console.error('请求过程中发生错误:', err);
        // 统一处理 user 或 posts 请求的失败
      });
    ```

2.  **场景**：一个点赞按钮。点击后，按钮应变为“禁用”状态并显示“点赞中...”，同时发送一个点赞请求。请求结束后（无论成功或失败），按钮都应恢复为可用状态。成功则提示“点赞成功”，失败则提示“点赞失败，请重试”。
    **答案**：这考察的是如何利用 Promise 管理 UI 状态，特别是使用 `.finally()` (或在 `.then()` 和 `.catch()` 中都执行相同操作) 来处理请求结束后的清理工作。

    ```javascript
    const likeButton = document.getElementById('likeBtn');

    likeButton.addEventListener('click', () => {
        // 1. 禁用按钮，更新文本
        likeButton.disabled = true;
        likeButton.textContent = '点赞中...';

        ajax('/api/like')
          .then(response => {
            alert('点赞成功！');
          })
          .catch(error => {
            alert('点赞失败，请重试。');
          })
          .finally(() => { // 无论成功失败，都会执行
            // 2. 恢复按钮状态
            likeButton.disabled = false;
            likeButton.textContent = '点赞';
          });
    });
    ```

3.  **场景**：页面加载时需要同时请求“热门文章”(`api/hot-articles`)和“最新评论”(`api/latest-comments`)两个互不依赖的数据。你希望在两个请求都成功返回后，才将它们组合起来渲染页面，以避免页面内容一部分一部分地出现。
    **答案**：这是一个典型的 `Promise.all` 应用场景，用于处理并发的、互不依赖的异步请求。

    ```javascript
    function renderPage() {
        const p1 = ajax('/api/hot-articles');
        const p2 = ajax('/api/latest-comments');

        Promise.all([p1, p2])
          .then(([articles, comments]) => {
            // 两个请求都成功了，articles 和 comments 分别是它们的结果
            console.log('热门文章:', articles);
            console.log('最新评论:', comments);
            // 在这里同时渲染两部分内容
          })
          .catch(err => {
            console.error('加载页面数据失败:', err);
            // 显示一个全局的错误提示
          });
    }

    renderPage();
    ```


4.  **场景**：有一个数据接口，它有 50% 的几率会因为服务器不稳定而请求失败（例如返回 500 错误）。请编写一个函数 `ajaxWithRetry`，它使用我们封装的 `ajax` 函数，在请求失败时自动重试，最多重试3次。如果3次后仍然失败，才最终抛出错误。
    **答案**：这考察的是利用 Promise 递归和链式调用来实现复杂的异步流程控制，是面试中常见的高阶题目。

    ```javascript
    /**
     * 带重试功能的 AJAX 请求
     * @param {object} options - ajax 函数的配置对象
     * @param {number} retries - 剩余重试次数
     * @returns {Promise<any>}
     */
    function ajaxWithRetry(options, retries = 3) {
      return new Promise((resolve, reject) => {
        ajax(options)
          .then(resolve) // 如果成功，直接 resolve
          .catch(error => {
            console.log(`Request failed, ${retries} retries left.`);
            if (retries > 0) {
              // 如果还有重试次数，则再次调用自身，并减少次数
              ajaxWithRetry(options, retries - 1)
                .then(resolve) // 后续重试成功，则 resolve
                .catch(reject); // 后续重试全部失败，则 reject
            } else {
              // 重试次数用尽，最终 reject
              reject(error);
            }
          });
      });
    }

    // 用法
    ajaxWithRetry({ url: '/api/unstable-data' })
      .then(data => console.log('Data fetched successfully:', data))
      .catch(err => console.error('Failed to fetch data after multiple retries:', err));
    ```

5.  **场景**：我们的 `ajax` 函数目前没有处理请求超时。请修改 `ajax` 函数或对其进行包装，实现一个超时功能：如果一个请求在5秒内没有完成，就自动以一个“Timeout Error”为原因 reject 这个 Promise。
    **答案**：这考察的是如何组合多个 Promise 来实现更复杂的异步逻辑，`Promise.race` 是这个问题的标准解决方案。

    ```javascript
    function ajaxWithTimeout(options, timeout = 5000) {
      // 创建一个超时 Promise，它会在指定时间后 reject
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timed out after ${timeout}ms`));
        }, timeout);
      });

      // 使用 Promise.race，让 ajax 请求和超时 Promise 赛跑
      // 哪个先完成（ajax resolve 或 timeout reject），就采用哪个的结果
      return Promise.race([
        ajax(options),
        timeoutPromise
      ]);
    }

    // 用法
    ajaxWithTimeout({ url: '/api/slow-request' }, 5000)
      .then(data => console.log('Received data:', data))
      .catch(err => console.error(err.message)); // 会输出 'Request timed out after 5000ms'
    ```



### **快速使用指南**

假设过段时间你忘记了怎么使用这个组件，这里是一份能让你快速上手的指南。

#### **目标：将 `ajax` 功能集成到新项目中**

**步骤 1: 复制函数**

将下面这个最终版本的 `ajax` 函数代码复制到你项目的一个公共文件里，例如 `src/utils/request.js`。

```javascript
/**
 * 基于 Promise 封装的通用 AJAX 函数
 * @param {object} options - 请求配置对象
 * @param {string} options.url - 请求的 URL (必须)
 * @param {string} [options.method='GET'] - 请求方法 (GET, POST, PUT, DELETE 等)
 * @param {object|string|null} [options.data=null] - 需要发送的数据 (对于 POST/PUT 请求)
 * @param {object} [options.headers={}] - 自定义请求头
 * @returns {Promise<any>} - 返回一个 Promise 对象，成功时 resolve 数据，失败时 reject 错误
 */
function ajax(options) {
    const { url, method = 'GET', data = null, headers = {} } = options;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url, true);

        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
        if (method.toUpperCase() === 'POST' && typeof data === 'object' && data !== null) {
            if (!headers['Content-Type']) {
              xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            }
        }
      
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
                }
            }
        };

        xhr.onerror = function() {
            reject(new Error('Network error occurred.'));
        };
      
        let body = (method.toUpperCase() !== 'GET' && data) 
                        ? (typeof data === 'object' ? JSON.stringify(data) : data) 
                        : null;
        xhr.send(body);
    });
}
```

**步骤 2: 在你的代码中使用**

在需要发起网络请求的文件中，引入并调用 `ajax` 函数。

**示例 1: 发送 GET 请求获取数据**

```javascript
// 假设 ajax 函数在同一个文件或已被引入

ajax({ url: '/api/users/1' })
  .then(user => {
    console.log('获取到的用户数据:', user);
    // document.getElementById('username').textContent = user.name;
  })
  .catch(error => {
    console.error('获取失败:', error);
    // alert('加载用户数据失败！');
  });
```

**示例 2: 发送 POST 请求提交表单数据**

```javascript
const userData = {
  name: 'Charlie',
  email: 'charlie@example.com'
};

ajax({
  method: 'POST',
  url: '/api/users',
  data: userData, // Function will automatically stringify this object
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE' // 添加自定义请求头
  }
})
.then(response => {
  console.log('用户创建成功:', response);
  // alert('注册成功！');
})
.catch(error => {
  console.error('创建失败:', error);
  // alert('注册失败，请稍后再试。');
});
```

**示例 3: 在 `async/await` 中使用（推荐）**

这是更现代、更简洁的写法。

```javascript
async function fetchAndDisplayUser() {
  try {
    console.log('正在获取用户...');
    const user = await ajax({ url: '/api/users/1' });
    console.log('获取成功:', user);
    // ...更新 UI
  } catch (error) {
    console.error('在 async 函数中捕获到错误:', error);
    // ...显示错误信息
  }
}

fetchAndDisplayUser();
```