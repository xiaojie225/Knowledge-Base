# AJAX 工具函数知识精华

[标签: JavaScript, AJAX, Promise, XMLHttpRequest, 异步编程, 网络请求]

---

## 日常学习模式

### 一、核心概念

#### 1. AJAX 定义
**Asynchronous JavaScript And XML** —— 在不刷新整个页面的情况下，与服务器交换数据并更新局部内容的技术。

**核心特性**：
- **异步**：发送请求后不阻塞，用户可继续操作
- **局部更新**：只更新需要变化的部分，不重载整页

#### 2. 实现方式对比

| 方式 | 特点 | 适用场景 |
|------|------|----------|
| XMLHttpRequest | 原生API，兼容性好，写法繁琐 | 底层封装、需兼容老浏览器 |
| Fetch API | 基于Promise，语法简洁，IE不支持 | **现代开发首选** |
| Axios | 功能丰富，支持拦截器，可同构 | 复杂项目、需统一请求处理 |

---

### 二、XMLHttpRequest 核心知识

#### 1. readyState 状态值
```
0 - Unsent: open()未调用
1 - Opened: open()已调用
2 - Headers Received: send()已调用，响应头可用
3 - Loading: 正在下载响应
4 - Done: 请求完成 ← 我们主要关心这个
```

#### 2. 核心方法
```javascript
xhr.open(method, url, async)  // 初始化请求，async=true为异步
xhr.setRequestHeader(key, value)  // 设置请求头，在open后send前调用
xhr.send(body)  // 发送请求，GET时body为null
```

#### 3. 关键属性
```javascript
xhr.readyState    // 请求状态 0-4
xhr.status        // HTTP状态码 200/404/500等
xhr.responseText  // 响应文本内容
```

---

### 三、Promise 封装 AJAX 完整实现

```javascript
/**
 * 基于Promise封装的通用AJAX函数
 * @param {Object} options - 配置对象
 * @param {string} options.url - 请求URL（必须）
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object|string|null} [options.data=null] - 发送数据
 * @param {Object} [options.headers={}] - 自定义请求头
 * @returns {Promise<any>}
 */
function ajax(options) {
    const { url, method = 'GET', data = null, headers = {} } = options;
  
    return new Promise((resolve, reject) => {
        // 1. 创建XHR对象
        const xhr = new XMLHttpRequest();
      
        // 2. 初始化请求（true表示异步）
        xhr.open(method.toUpperCase(), url, true);
      
        // 3. 设置请求头
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
        if (method.toUpperCase() === 'POST' && typeof data === 'object') {
            if (!headers['Content-Type']) {
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            }
        }
      
        // 4. 监听状态变化
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        resolve(xhr.responseText);  // 非JSON直接返回文本
                    }
                } else {
                    reject(new Error(`Request failed: ${xhr.status}`));
                }
            }
        };
      
        // 5. 网络错误处理
        xhr.onerror = () => reject(new Error('Network error'));
      
        // 6. 发送请求
        const body = data && typeof data === 'object' 
            ? JSON.stringify(data) 
            : data;
        xhr.send(body);
    });
}
```

---

### 四、使用场景

#### 1. GET 请求
```javascript
ajax({ url: '/api/users/1' })
    .then(user => console.log(user))
    .catch(err => console.error(err));
    
```

#### 2. POST 请求
```javascript
ajax({
    method: 'POST',
    url: '/api/users',
    data: { name: 'Alice', email: 'alice@test.com' },
    headers: { 'Authorization': 'Bearer token123' }
})
.then(res => console.log('创建成功', res))
.catch(err => console.error('创建失败', err));
```

#### 3. async/await 写法
```javascript
async function fetchUser() {
    try {
        const user = await ajax({ url: '/api/users/1' });
        console.log(user);
    } catch (err) {
        console.error(err);
    }
}
```

#### 4. 并发请求（Promise.all）
```javascript
const p1 = ajax({ url: '/api/user' });
const p2 = ajax({ url: '/api/config' });

Promise.all([p1, p2])
    .then(([user, config]) => {
        console.log('用户:', user, '配置:', config);
    })
    .catch(err => console.error('某个请求失败', err));
```

#### 5. 串行请求（依赖关系）
```javascript
ajax({ url: '/api/user' })
    .then(user => ajax({ url: `/api/posts?userId=${user.id}` }))
    .then(posts => console.log('用户文章:', posts))
    .catch(err => console.error(err));
```

---

### 五、进阶封装

#### 1. 带重试功能
```javascript
function ajaxWithRetry(options, retries = 3) {
    return ajax(options).catch(err => {
        if (retries > 0) {
            console.log(`重试中，剩余${retries}次`);
            return ajaxWithRetry(options, retries - 1);
        }
        throw err;
    });
}
```

#### 2. 带超时功能
```javascript
function ajaxWithTimeout(options, timeout = 5000) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), timeout);
    });
    return Promise.race([ajax(options), timeoutPromise]);
}
```

---

## 面试突击模式

### [AJAX Promise封装] 面试速记

#### 30秒电梯演讲
AJAX是一种异步请求技术，实现不刷新页面更新局部内容。原生XMLHttpRequest写法繁琐且基于回调，通过Promise封装可实现链式调用、统一错误处理，配合async/await代码更简洁。核心是将XHR的onreadystatechange回调转换为Promise的resolve/reject。

---

#### 高频考点（必背）

**考点1：readyState的5个状态**
0未初始化、1已打开、2已发送、3接收中、4完成。只有4才表示请求完整结束，此时才能安全获取responseText和status。

**考点2：为什么用Promise封装XHR**
解决回调地狱，支持链式调用，统一错误处理通过catch捕获，可与async/await结合，代码更接近同步写法。

**考点3：onerror与status检查的区别**
onerror处理网络层错误（DNS失败、网络不通），请求根本没完成；status检查处理应用层错误（404/500），请求已完成但服务器返回错误状态。

**考点4：open第三个参数true的作用**
表示异步请求，send后代码继续执行不阻塞。设为false则同步，会冻结页面直到响应返回，严重影响体验。

**考点5：POST请求的Content-Type**
发送JSON数据时设为`application/json;charset=UTF-8`，需在open后send前调用setRequestHeader设置。

---

#### 经典面试题（10道）

**题目1：手写Promise封装的ajax函数**

思路：创建XHR → open初始化 → 设置请求头 → onreadystatechange监听 → onerror处理网络错误 → send发送

答案：见上方"三、Promise封装AJAX完整实现"代码

---

**题目2：如何实现串行请求（第二个请求依赖第一个结果）**

思路：在第一个.then()中return第二个ajax调用

```javascript
/**
 * 串行请求示例
 * 先获取用户信息，再根据用户ID获取文章列表
 */
ajax({ url: '/api/user' })
    .then(user => {
        // 必须return，才能继续链式调用
        return ajax({ url: `/api/posts?userId=${user.id}` });
    })
    .then(posts => {
        console.log('用户文章:', posts);
    })
    .catch(err => {
        // 统一处理两个请求的错误
        console.error(err);
    });
```

---

**题目3：如何实现并发请求（多个请求同时发起）**

思路：使用Promise.all，所有请求成功才成功，任一失败则失败

```javascript
/**
 * 并发请求示例
 * 同时获取用户和配置，都完成后再处理
 */
Promise.all([
    ajax({ url: '/api/user' }),
    ajax({ url: '/api/config' })
])
.then(([user, config]) => {
    // 解构获取各自结果
    console.log('用户:', user);
    console.log('配置:', config);
})
.catch(err => {
    // 任一请求失败都会进入这里
    console.error(err);
});
```

---

**题目4：实现请求超时功能**

思路：用Promise.race让ajax和定时器赛跑

```javascript
/**
 * 带超时的ajax请求
 * @param {Object} options - ajax配置
 * @param {number} timeout - 超时时间(ms)
 */
function ajaxWithTimeout(options, timeout = 5000) {
    // 超时Promise，到时间就reject
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`请求超时: ${timeout}ms`));
        }, timeout);
    });
  
    // race: 谁先完成用谁的结果
    return Promise.race([ajax(options), timeoutPromise]);
}
```

---

**题目5：实现请求自动重试**

思路：catch中递归调用，retries减到0才最终reject

```javascript
/**
 * 带重试的ajax请求
 * @param {Object} options - ajax配置
 * @param {number} retries - 重试次数
 */
function ajaxWithRetry(options, retries = 3) {
    return ajax(options).catch(err => {
        console.log(`请求失败，剩余重试: ${retries}次`);
        if (retries > 0) {
            // 递归重试
            return ajaxWithRetry(options, retries - 1);
        }
        // 重试用尽，抛出错误
        throw err;
    });
}
```

---

**题目6：按钮点击发请求，如何处理loading状态**

思路：点击时禁用按钮，finally中恢复状态

```javascript
/**
 * 点赞按钮请求处理
 * 请求期间禁用按钮，结束后恢复
 */
btn.addEventListener('click', () => {
    // 禁用并更新文案
    btn.disabled = true;
    btn.textContent = '点赞中...';
  
    ajax({ url: '/api/like', method: 'POST' })
        .then(() => alert('点赞成功'))
        .catch(() => alert('点赞失败'))
        .finally(() => {
            // 无论成功失败都恢复按钮
            btn.disabled = false;
            btn.textContent = '点赞';
        });
});
```

---

**题目7：XHR和Fetch的区别**

答案：
1. XHR基于回调，Fetch基于Promise，语法更简洁
2. Fetch不支持IE，XHR兼容性好
3. XHR支持上传/下载进度监控（onprogress），Fetch默认不支持
4. Fetch的response.ok需手动检查，非2xx不会reject
5. Fetch请求默认不带cookie，需设置credentials

---

**题目8：如何给所有请求统一添加token**

思路：在ajax函数内部读取token并设置Authorization头

```javascript
/**
 * 在ajax函数内部统一添加token
 * 修改setRequestHeader部分
 */
// 从localStorage读取token
const token = localStorage.getItem('authToken');
if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
}
```

---

**题目9：服务器返回非JSON时如何处理**

答案：用try-catch包裹JSON.parse，解析失败则直接返回原始文本

```javascript
/**
 * 响应处理：兼容JSON和纯文本
 */
if (xhr.status >= 200 && xhr.status < 300) {
    try {
        // 尝试解析JSON
        resolve(JSON.parse(xhr.responseText));
    } catch (e) {
        // 非JSON直接返回文本
        resolve(xhr.responseText);
    }
}
```

---

**题目10：Promise.all和Promise.race的区别**

答案：
- **Promise.all**：所有Promise都成功才成功，返回结果数组；任一失败则立即失败
- **Promise.race**：谁先完成用谁的结果，不管成功还是失败

```javascript
// all: 等所有完成，适合并发请求
Promise.all([p1, p2, p3]).then(([r1, r2, r3]) => {});

// race: 取最快的，适合超时控制
Promise.race([ajax(options), timeoutPromise]);
```