我会从基础知识、封装实践、异常处理、架构设计等多个维度进行提问。
#### 10个技术知识题目

1.  **问：** 为什么我们推荐使用 `axios.create()` 而不是直接修改全局的 `axios.defaults`？
    **答：** 使用`axios.create()`可以创建多个独立的`axios`实例。这在大型项目中非常有用，比如项目可能需要同时请求多个不同域名、拥有不同超时时间或不同请求头的API服务。每个实例都有自己的配置和拦截器，互不干扰，避免了全局配置被污染的问题，增强了代码的模块化和可维护性。

2.  **问：** 在请求拦截器中，除了添加`Token`，你还能想到哪些常见的应用场景？
    **答：** 1. **开启全局Loading**：在请求开始时显示一个加载动画，提升用户体验。2. **序列化请求数据**：比如对`POST`请求的`data`进行统一的`qs.stringify`处理。3. **添加通用参数**：为所有请求添加如`timestamp`（时间戳）或客户端版本号等通用参数。4. **请求防抖/节流**：对某些频繁触发的请求（如搜索建议）进行控制。

3.  **问：** 响应拦截器 `response.use` 的两个回调函数分别在什么时候触发？如果第一个回调函数 `reject` 了一个 `Promise`，第二个回调函数会执行吗？
    **答：** 第一个回调函数（`onFulfilled`）在HTTP状态码为2xx时触发。第二个回调函数（`onRejected`）在HTTP状态码非2xx（如404、500）或请求本身出错（如网络中断、超时）时触发。如果第一个回调函数中`return Promise.reject(...)`，那么这个`reject`会被`axios`调用链下游的`.catch()`捕获，而不会触发第二个错误处理回调。

4.  **问：** 在代码中，响应拦截器同时处理了HTTP状态码错误和业务状态码（`res.code !== 200`）错误，请解释这两种错误有什么本质区别？
    **答：** **HTTP状态码错误**是传输层协议（HTTP）层面的错误，表示请求本身的过程出现了问题，比如`404 Not Found`（服务器找不到资源）、`500 Internal Server Error`（服务器代码执行出错）。此时，后端服务可能根本没有机会执行业务逻辑。**业务状态码错误**是应用层面的错误，表示HTTP请求成功（状态码为200），服务器成功接收并处理了请求，但在业务逻辑上判定为失败，例如`res.code: 50014`表示“Token已过期”，这是后端业务逻辑的判断结果。

5.  **问：** 对于 `GET` 和 `POST` 请求，传递参数的方式有何不同？在封装中是如何体现的？
    **答：** `GET`请求通常用于获取数据，其参数会附加在URL的查询字符串中（`?key=value&key2=value2`）。在`axios`中，这通过`params`配置项实现。`POST`请求通常用于提交数据，其参数放在请求体（Request Body）中。在`axios`中，这通过`data`配置项实现。在我们的API模块封装中（`src/api/user.js`），`getUserInfo`使用了`params`，而`login`使用了`data`，清晰地体现了这一点。

6.  **问：** 如何实现请求的取消（Cancellation）？在什么场景下会用到？
    **答：** 可以使用`AbortController`。在发起请求前创建一个`controller`实例，并将其`signal`传递给`axios`的配置对象。当需要取消时，调用`controller.abort()`即可。常见场景包括：1. 路由切换时，取消上一个页面还未完成的请求。2. 用户在搜索框中连续快速输入时，取消前一次的搜索请求，只保留最后一次。

7.  **问：** 我们的封装中使用了Vite的环境变量 `import.meta.env`。它和Webpack中的 `process.env` 有什么区别？
    **答：** `import.meta.env`是ES Module规范的一部分，Vite原生支持，它在客户端代码中直接可用。而`process.env`是Node.js环境中的变量，在Webpack项目中，需要通过`DefinePlugin`插件将其注入到浏览器端代码中。Vite的方式更符合现代JavaScript标准，无需额外插件配置。

8.  **问：** 如果一个接口需要特殊的`timeout`或`headers`，如何在使用我们封装的`request`实例时进行覆盖？
    **答：** 在调用`request`函数时，传入的配置对象会与实例的默认配置进行合并。后传入的配置优先级更高。例如：`request({ url: '/special/api', method: 'get', timeout: 30000 })`，这次请求的超时时间就会是30秒，而不是默认的10秒。

9.  **问：** 封装中提到了用`ElLoading`实现全局加载，但这可能会影响用户体验（如快速切换的多个小请求）。你有什么优化方案？
    **答：** 1. **请求合并/延迟显示**：维护一个全局的请求计数器。在请求拦截器中计数加一，响应拦截器中减一。只有当计数器从0变为1时才显示Loading。当计数器减到0时才隐藏Loading。可以再加一个`setTimeout`，如果请求在短时间内（如200ms）就完成了，则不显示Loading，避免闪烁。2. **局部Loading**：提供一个选项，允许在API调用时禁用全局Loading，而在组件内部使用自己的局部Loading状态。

10. **问：** 请解释一下`vite.config.js`中跨域代理`proxy`的`changeOrigin`和`rewrite`配置项的作用。
    **答：** `changeOrigin: true`会将请求头中的`Host`字段从开发服务器的地址（如`localhost:5173`）修改为目标服务器的地址（`target`）。这对于一些基于`Host`头进行验证的后端服务是必需的。`rewrite`则用于重写请求路径。在示例中，前端请求`/dev-api/user/info`，代理会将其重写为`/user/info`再转发给后端，`dev-api`这个前缀只是用于触发代理规则的“暗号”，后端实际上并不需要它。

#### 10道业务逻辑题目

1.  **场景：** 用户在一个表单页面填写信息，但此时他的登录`Token`刚好过期了。当他点击“提交”按钮时，应该发生什么？请描述从前端到后端的完整流程以及用户看到的现象。
    **答：** 1. 用户点击“提交”，`login`或`submitForm`等API函数被调用。2. 请求拦截器为请求加上已过期的`Token`。3. 请求发送到后端。4. 后端验证`Token`，发现已过期，拒绝请求，返回HTTP状态码`200`但业务码为`50014`（Token过期），或者直接返回HTTP状态码`401`。5. 前端响应拦截器捕获到这个错误，根据预设逻辑，弹出“登录已过期，请重新登录”的`ElMessage`提示。6. （可选高级实现）之后自动跳转到登录页，并可能在URL中附带当前页面的路径，以便用户登录后能无缝返回。

2.  **场景：** 网站有一个实时数据看板，每5秒请求一次数据。如果某次请求因为网络问题超过10秒还未返回，而新的请求又被发起了，可能会发生什么问题？如何优化？
    **答：** **问题：** 可能会导致请求堆积，旧的请求返回结果覆盖新的请求结果，造成数据错乱和不一致。同时，会给服务器和客户端带来不必要的负担。**优化方案：** 1. **请求超时取消**：在发起下一次请求之前，先检查上一次请求是否已完成。如果未完成，可以使用`AbortController`取消上一次的请求。2. **轮询锁**：设置一个标志位`isFetching`。在发起请求前检查此标志，如果为`true`则不发起新请求。请求成功或失败后，将标志位设回`false`。

3.  **场景：** 应用需要支持多语言，API返回的错误信息是多语言`key`（如`error.user.password_incorrect`）。你如何在我们封装的基础上，将它转换为用户当前语言的文本？
    **答：** 在响应拦截器中，当捕获到业务错误时（`res.code !== 200`），不要直接`ElMessage.error(res.message)`。而是将`res.message`（即多语言`key`）传递给国际化库（如`vue-i18n`）的翻译函数，例如`ElMessage.error(i18n.t(res.message))`。这样就能根据用户当前的语言环境显示正确的错误信息。

4.  **场景：** 有一个文件上传接口，它需要使用`'Content-Type': 'multipart/form-data'`，并且上传大文件时`timeout`需要更长。如何处理这种情况？
    **答：** 在`api`模块中为这个上传接口单独创建一个函数。在调用`request`时，覆盖默认配置：
    ```javascript
    export function uploadFile(data) {
      return request({
        url: '/file/upload',
        method: 'post',
        data, // data应为FormData对象
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 设置为1分钟超时
      });
    }
    ```
    这样，只有这个接口会使用特殊的`headers`和`timeout`，不影响其他接口。

5.  **场景：** 后端返回的数据结构有时是`{ code: 200, data: { ... } }`，有时是`{ code: 200, data: [ ... ] }`，有时成功时没有`data`字段，只有`{ code: 200, message: '操作成功' }`。如何让我们的拦截器更具兼容性？
    **答：** 在响应拦截器成功处理部分，可以做更灵活的判断。
    ```javascript
    // ...
    if (res.code === 200) {
      // 如果存在data字段则返回data，否则返回整个响应体
      // 这样业务代码可以根据情况解构 `data` 或 `message`
      return res.data !== undefined ? res.data : res; 
    }
    // ...
    ```
    这样既能简化有`data`时的调用，也兼容了没有`data`的成功响应。

6.  **场景：** 某个关键操作（如支付）的API，需要进行请求重试。如果第一次请求失败（比如网络抖动导致超时），系统应该自动尝试再次发送请求，最多3次。如何实现？
    **答：** 这可以通过`axios`的拦截器或适配器实现。一个简单的拦截器实现思路：在响应拦截器的错误处理部分，检查错误类型是否为网络错误或超时，并检查当前请求配置中是否有一个重试计数字段（如`config.retryCount`）。如果满足重试条件且次数未达上限，则递增计数器，并延迟一小段时间后重新发起请求`return service(config)`。

7.  **场景：** 项目中一部分API是提供给普通用户的，另一部分是给管理员的，管理员API的`baseURL`是`'https://admin.api.example.com'`。你如何组织代码？
    **答：** 最好的方式是创建第二个`axios`实例。在`utils`目录下新建一个`adminRequest.js`文件，内容与`request.js`类似，但`baseURL`不同。然后在`api`目录下创建`admin`文件夹，专门存放调用`adminRequest`实例的API模块。这样可以做到物理隔离，非常清晰。

8.  **场景：** 用户在进行一个多步骤的操作，例如“创建订单”，这需要依次调用“检查库存”、“创建订单”、“发起支付”三个接口。如果“创建订单”接口失败了，“发起支付”接口还应该被调用吗？如何优雅地处理这种链式调用？
    **答：** 不应该被调用。使用`async/await`和`try...catch`是处理这种场景的最优雅方式。
    ```javascript
    async function handleCreateOrder() {
      try {
        const stockStatus = await checkStockAPI();
        if (!stockStatus.isAvailable) throw new Error('库存不足');
      
        const orderResult = await createOrderAPI();
      
        const paymentResult = await initiatePaymentAPI({ orderId: orderResult.id });

        showSuccessMessage('订单创建并支付成功！');
      } catch (error) {
        // 任何一步失败都会进入catch块，后续调用被自动中断
        // 全局拦截器已经提示了具体错误，这里可以做一些回滚或提示整合
        console.error('创建订单流程失败', error);
      }
    }
    ```

9.  **场景：** 后端进行了升级，某个接口的返回数据结构从`{ user: { name: 'Tom' } }` 变成了 `{ userInfo: { userName: 'Tom' } }`。这对前端有什么影响？如何在不修改大量组件代码的情况下，平滑地过渡？
    **答：** 这会造成前端组件大面积报错。为了平滑过渡，可以在响应拦截器中增加一个“适配器”或“转换层”。通过检查URL或特定标志，识别出是旧接口的响应，然后将其数据结构转换为新结构再返回给业务代码。这是一种临时的兼容方案，长远来看还是应该推动前后端统一数据结构。

10. **场景：** 为了安全，后端要求所有`POST`和`PUT`请求都需要附加一个动态的CSRF Token，这个Token通过调用一个`/api/csrf-token`接口获取。请描述你会如何实现这个需求。
     **答：** 1. 首先，在应用初始化时（如`App.vue`的`onMounted`），调用一次接口获取初始的CSRF Token并存储起来（如`pinia`或一个全局变量）。2. 修改`axios`请求拦截器，判断请求方法是否为`POST`或`PUT`。如果是，则从存储中读取CSRF Token，并将其添加到请求头（如`X-CSRF-TOKEN`）或请求体中。3. （高级）后端可能会在每次响应中返回一个新的CSRF Token，响应拦截器需要捕获这个新Token并更新本地存储，以供下一次请求使用。

---


## 🔥 常见面试题全集（60+）

### 基础概念题

**Q1: Axios 是什么？与原生 fetch 有何区别？**
<details>
<summary>标准答案</summary>

**是什么：** Axios 是基于 Promise 的 HTTP 客户端，支持浏览器和 Node.js。

**核心区别：**

| 特性 | Axios | Fetch |
|-----|-------|-------|
| 浏览器兼容性 | 支持 IE11+ | 不支持 IE |
| 超时控制 | 原生支持 `timeout` | 需配合 AbortController |
| 请求取消 | 原生支持 | 需 AbortController |
| 拦截器 | 内置拦截器 | 需手动封装 |
| 进度监控 | 支持上传/下载进度 | 不支持 |
| JSON 转换 | 自动转换 | 需手动 `res.json()` |
| 错误处理 | HTTP 错误自动 reject | 仅网络错误 reject |
| XSRF 防护 | 内置支持 | 需手动实现 |

**选择建议：**
- 企业项目、需完善错误处理 → Axios
- 现代浏览器、追求原生 API → Fetch
</details>

---

**Q2: Axios 的核心优势是什么？**
<details>
<summary>标准答案</summary>

1. **同构支持** - 一套代码在浏览器和 Node.js 运行
2. **拦截器机制** - 统一处理认证、日志、错误
3. **自动转换** - JSON 自动序列化/反序列化
4. **请求取消** - 防止重复请求和内存泄漏
5. **防御机制** - XSRF 防护、超时控制
6. **实例化** - 创建多个独立配置的实例
</details>

---

**Q3: Axios 支持哪些请求方法？**
<details>
<summary>标准答案</summary>

- **常用方法：** `get`、`post`、`put`、`patch`、`delete`
- **其他方法：** `head`、`options`、`request`

**示例：**
```javascript
axios.get(url, config)
axios.post(url, data, config)
axios.put(url, data, config)
axios.delete(url, config)
axios.request({ method: 'post', url, data })
```
</details>

---

### 配置与实例题

**Q4: 如何创建 Axios 实例？为什么要用实例？**
<details>
<summary>标准答案</summary>

**创建实例：**
```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});
```

**使用场景：**
1. **多环境配置** - 开发/测试/生产不同 baseURL
2. **多后端服务** - 不同微服务有不同域名和认证方式
3. **隔离拦截器** - 不同实例有独立的拦截器
4. **避免污染** - 不影响全局 axios 配置

**示例：**
```javascript
// 用户服务
const userAPI = axios.create({ baseURL: '/api/user' });

// 订单服务
const orderAPI = axios.create({ baseURL: '/api/order' });
```
</details>

---

**Q5: Axios 配置的优先级是怎样的？**
<details>
<summary>标准答案</summary>

**优先级（从高到低）：**
1. 请求配置（`axios.get(url, config)`）
2. 实例配置（`axios.create(config)`）
3. 全局默认配置（`axios.defaults`）

**示例：**
```javascript
// 全局默认
axios.defaults.timeout = 10000;

// 实例配置
const instance = axios.create({ timeout: 5000 });

// 请求配置（最终生效 3000）
instance.get('/users', { timeout: 3000 });
```

**合并规则：** 配置项会深度合并，但请求配置优先级最高。
</details>

---

**Q6: baseURL 的作用和最佳实践？**
<details>
<summary>标准答案</summary>

**作用：** 自动拼接到相对路径 URL 前面。

**最佳实践：**
```javascript
// 环境变量管理
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL // 从环境变量读取
});

// 开发环境：http://localhost:3000
// 生产环境：https://api.production.com
```

**注意事项：**
- 相对路径会拼接：`/users` → `https://api.com/users`
- 绝对路径不拼接：`https://other.com/users` 保持不变
</details>

---

**Q7: 如何设置请求超时？超时后会发生什么？**
<details>
<summary>标准答案</summary>

**设置超时：**
```javascript
axios.get('/api/users', { timeout: 5000 }); // 5 秒超时
```

**超时后：**
1. 请求被中断，触发 `error.code === 'ECONNABORTED'`
2. 进入响应拦截器的错误处理
3. 抛出错误：`"timeout of 5000ms exceeded"`

**实战处理：**
```javascript
axios.interceptors.response.use(null, error => {
  if (error.code === 'ECONNABORTED') {
    Message.error('请求超时，请稍后重试');
  }
  return Promise.reject(error);
});
```
</details>

---

### 拦截器题（高频⭐）

**Q8: 什么是拦截器？有哪些类型？**
<details>
<summary>标准答案</summary>

**定义：** 在请求发送前或响应返回后统一处理逻辑的钩子函数。

**类型：**
1. **请求拦截器** - 请求发送前执行（添加 Token、Loading）
2. **响应拦截器** - 响应返回后执行（错误处理、数据转换）

**执行顺序：**
```
请求拦截器 → 发送请求 → 响应拦截器
     ↓              ↓              ↓
  添加 Token     等待响应      统一错误处理
```
</details>

---

**Q9: 请求拦截器的常见应用场景？**
<details>
<summary>标准答案</summary>

1. **添加认证信息**
```javascript
config.headers.Authorization = `Bearer ${token}`;
```

2. **显示全局 Loading**
```javascript
store.commit('setLoading', true);
```

3. **修改请求参数**
```javascript
config.params = { ...config.params, timestamp: Date.now() };
```

4. **请求日志记录**
```javascript
console.log('[Request]', config.method, config.url);
```

5. **环境标识**
```javascript
config.headers['X-Environment'] = process.env.NODE_ENV;
```
</details>

---

**Q10: 响应拦截器如何统一处理业务错误码？**
<details>
<summary>标准答案</summary>

```javascript
axios.interceptors.response.use(
  response => {
    const { code, data, message } = response.data;
    
    // 业务成功
    if (code === 200) {
      return data; // 直接返回业务数据
    }
    
    // 业务失败
    const errorMap = {
      1001: '用户未登录',
      1002: 'Token 已过期',
      1003: '无权限访问',
      2001: '参数错误',
      5000: '服务器内部错误'
    };
    
    const errorMsg = errorMap[code] || message || '请求失败';
    Message.error(errorMsg);
    
    return Promise.reject(new Error(errorMsg));
  },
  error => {
    // HTTP 错误处理
    return Promise.reject(error);
  }
);
```
</details>

---

**Q11: 如何在拦截器中实现 Token 自动刷新？**
<details>
<summary>标准答案</summary>

**核心思路：**
1. 401 时触发刷新逻辑
2. 使用标志位防止并发刷新
3. 将失败请求加入队列，刷新完成后重试

**完整实现：**
```javascript
let isRefreshing = false;
let failedQueue = [];

axios.interceptors.response.use(null, async error => {
const originalRequest = error.config;

if (error.response?.status === 401 && !originalRequest._retry) {
 if (isRefreshing) {
 // 正在刷新，加入队列
 return new Promise((resolve, reject) => {
 failedQueue.push({ resolve, reject });
 }).then(token => {
 originalRequest.headers.Authorization = `Bearer ${token}`;
 return axios(original

        return axios(originalRequest);
      });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // 调用刷新接口
      const { data } = await axios.post('/api/refresh-token', {
        refreshToken: localStorage.getItem('refreshToken')
      });
      
      const newToken = data.token;
      localStorage.setItem('token', newToken);
      
      // 更新请求头
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // 重试队列中的请求
      failedQueue.forEach(prom => {
        prom.resolve(newToken);
      });
      failedQueue = [];
      
      // 重试原请求
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axios(originalRequest);
      
    } catch (refreshError) {
      // 刷新失败，清空队列并跳转登录
      failedQueue.forEach(prom => {
        prom.reject(refreshError);
      });
      failedQueue = [];
      
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(refreshError);
      
    } finally {
      isRefreshing = false;
    }
  }
  
  return Promise.reject(error);
});
```

**关键点：**
- `isRefreshing` 标志位防止并发刷新
- `failedQueue` 存储待重试的请求
- `_retry` 防止无限递归
</details>

---

**Q12: 拦截器的执行顺序是怎样的？**
<details>
<summary>标准答案</summary>

**请求拦截器：** 后添加先执行（栈结构）
```javascript
axios.interceptors.request.use(config => {
  console.log('拦截器 1');
  return config;
});

axios.interceptors.request.use(config => {
  console.log('拦截器 2');
  return config;
});

// 输出：拦截器 2 → 拦截器 1
```

**响应拦截器：** 先添加先执行（队列结构）
```javascript
axios.interceptors.response.use(res => {
  console.log('拦截器 1');
  return res;
});

axios.interceptors.response.use(res => {
  console.log('拦截器 2');
  return res;
});

// 输出：拦截器 1 → 拦截器 2
```

**完整流程：**
```
请求拦截器 2 → 请求拦截器 1 → 发送请求 → 响应拦截器 1 → 响应拦截器 2
```
</details>

---

**Q13: 如何移除拦截器？应用场景是什么？**
<details>
<summary>标准答案</summary>

**移除方法：**
```javascript
// 保存拦截器 ID
const requestInterceptor = axios.interceptors.request.use(config => config);
const responseInterceptor = axios.interceptors.response.use(res => res);

// 移除拦截器
axios.interceptors.request.eject(requestInterceptor);
axios.interceptors.response.eject(responseInterceptor);
```

**应用场景：**
1. **组件卸载时** - 避免内存泄漏
```javascript
// Vue 组件
mounted() {
  this.interceptor = axios.interceptors.request.use(...);
},
beforeUnmount() {
  axios.interceptors.request.eject(this.interceptor);
}
```

2. **条件性拦截** - 特定页面才需要的拦截逻辑
3. **动态切换** - 登录前后不同的拦截器
</details>

---

**Q14: 拦截器中可以修改请求配置吗？**


**可以！** 请求拦截器必须返回修改后的 `config`。

**常见修改：**
```javascript
axios.interceptors.request.use(config => {
  // 1. 修改 URL
  config.url = config.url.replace('/v1/', '/v2/');
  
  // 2. 添加参数
  config.params = { ...config.params, timestamp: Date.now() };
  
  // 3. 修改请求头
  config.headers['X-Custom-Header'] = 'value';
  
  // 4. 修改请求方法
  if (config.method === 'get') {
    config.method = 'post';
  }
  
  // 5. 修改超时时间
  config.timeout = 10000;
  
  return config; // 必须返回！
});
```

**注意：** 如果不返回 `config`，请求会失败。


---

### 错误处理题

**Q15: Axios 的错误对象结构是怎样的？**
<details>
<summary>标准答案</summary>

```javascript
{
  message: '错误信息',
  name: 'AxiosError',
  code: 'ERR_BAD_REQUEST', // 错误代码
  config: { /* 原始请求配置 */ },
  request: { /* 原始请求对象 */ },
  response: {
    data: { /* 响应体 */ },
    status: 404,
    statusText: 'Not Found',
    headers: { /* 响应头 */ }
  }
}
```

**三种错误类型：**
1. **有 response** - 服务器返回错误状态码（4xx、5xx）
2. **有 request** - 请求发出但未收到响应（网络问题）
3. **无 request** - 请求配置错误（代码问题）
</details>

---

**Q16: 如何区分网络错误、超时错误和业务错误？**
<details>
<summary>标准答案</summary>

```javascript
axios.get('/api/users').catch(error => {
  if (error.response) {
    // 1. 服务器返回错误状态码
    console.log('业务错误，状态码:', error.response.status);
    
    // 细分 HTTP 错误
    if (error.response.status >= 500) {
      console.log('服务器错误');
    } else if (error.response.status >= 400) {
      console.log('客户端错误');
    }
    
  } else if (error.request) {
    // 2. 请求已发出但未收到响应
    
    if (error.code === 'ECONNABORTED') {
      console.log('请求超时');
    } else if (error.message === 'Network Error') {
      console.log('网络连接失败');
    } else {
      console.log('请求失败（未知原因）');
    }
    
  } else {
    // 3. 请求配置错误
    console.log('请求配置错误:', error.message);
  }
});
```
</details>

---

**Q17: 如何实现全局统一的错误提示？**
<details>
<summary>标准答案</summary>

```javascript
// 错误提示映射表
const ERROR_MESSAGES = {
  400: '请求参数错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求资源不存在',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂不可用',
  504: '网关超时'
};

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    let message = '请求失败';
    
    if (error.response) {
      // HTTP 错误
      const status = error.response.status;
      message = ERROR_MESSAGES[status] || `请求失败（${status}）`;
      
      // 特殊处理 401
      if (status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
    } else if (error.request) {
      // 网络错误
      if (error.code === 'ECONNABORTED') {
        message = '请求超时，请稍后重试';
      } else {
        message = '网络连接失败，请检查网络';
      }
    } else {
      message = error.message || '请求配置错误';
    }
    
    // 显示错误提示（使用 UI 库）
    Message.error(message);
    
    return Promise.reject(error);
  }
);
```
</details>

---

### 请求取消题

**Q19: 为什么需要取消请求？有哪些场景？**
<details>
<summary>标准答案</summary>

**为什么需要：**
1. **防止重复提交** - 用户快速点击按钮
2. **避免资源浪费** - 页面已跳转但请求还在进行
3. **防止竞态条件** - 搜索框快速输入时旧请求覆盖新结果
4. **提升性能** - 取消不必要的请求释放资源

**典型场景：**
1. **搜索防抖** - 输入变化时取消上次搜索
2. **分页切换** - 切换页码时取消旧页请求
3. **组件卸载** - 离开页面时取消所有请求
4. **重复点击** - 表单提交时禁止重复点击
</details>

---

**Q20: AbortController 和 CancelToken 有什么区别？**
<details>
<summary>标准答案</summary>

| 特性 | AbortController | CancelToken |
|-----|----------------|-------------|
| 状态 | **推荐使用** | 已废弃 |
| 浏览器支持 | 现代浏览器原生支持 | Axios 自定义实现 |
| 标准 | Web 标准 API | Axios 独有 |
| 可取消性 | 可取消多个请求 | 一次只能取消一个 |

**AbortController 用法：**
```javascript
const controller = new AbortController();

axios.get('/api/users', {
  signal: controller.signal
});

controller.abort(); // 取消请求
```

**CancelToken 用法（已废弃）：**
```javascript
const source = axios.CancelToken.source();

axios.get('/api/users', {
  cancelToken: source.token
});

source.cancel('取消原因');
```

**建议：** 新项目使用 AbortController。
</details>

---

**Q21: 如何实现搜索防抖并取消上次请求？**
<details>
<summary>标准答案</summary>

```javascript
let controller = null;

// 搜索函数
const searchUsers = async (keyword) => {
  // 取消上次请求
  if (controller) {
    controller.abort();
  }
  
  // 创建新的控制器
  controller = new AbortController();
  
  try {
    const response = await axios.get('/api/users/search', {
      params: { keyword },
      signal: controller.signal
    });
    
    // 处理结果
    console.log(response.data);
    
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('请求已取消');
    } else {
      console.error('搜索失败:', error);
    }
  }
};

// 配合防抖使用
const debouncedSearch = debounce(searchUsers, 300);

// 输入框绑定
<input @input="debouncedSearch($event.target.value)" />
```
</details>

---

**Q22: 如何在组件卸载时取消所有请求？**
<details>
<summary>标准答案</summary>

**Vue 3 示例：**
```javascript
import { onUnmounted } from 'vue';

export default {
  setup() {
    const controller = new AbortController();
    
    // 发起请求
    const fetchData = () => {
      axios.get('/api/users', {
        signal: controller.signal
      });
    };
    
    // 组件卸载时取消
    onUnmounted(() => {
      controller.abort();
    });
    
    return { fetchData };
  }
};
```

**React 示例：**
```javascript
useEffect(() => {
  const controller = new AbortController();
  
  axios.get('/api/users', {
    signal: controller.signal
  });
  
  // 清理函数
  return () => {
    controller.abort();
  };
}, []);
```
</details>

---

**Q23: 如何防止重复请求？**
<details>
<summary>标准答案</summary>

**方法一：使用 Map 存储待处理请求**
```javascript
const pendingRequests = new Map();

// 生成唯一键
const generateKey = (config) => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params)}`;
};

// 请求拦截器
axios.interceptors.request.use(config => {
  const key = generateKey(config);
  
  // 如果有相同请求，取消旧的
  if (pendingRequests.has(key)) {
    pendingRequests.get(key).abort();
  }
  
  // 添加新请求
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(key, controller);
  
  return config;
});

// 响应拦截器
axios.interceptors.response.use(
  response => {
    const key = generateKey(response.config);
    pendingRequests.delete(key);
    return response;
  },
  error => {
    if (error.config) {
      const key = generateKey(error.config);
      pendingRequests.delete(key);
    }
    return Promise.reject(error);
  }
);
```

**方法二：按钮防重复点击**
```javascript
let isSubmitting = false;

const handleSubmit = async () => {
  if (isSubmitting) {
    Message.warning('请勿重复提交');
    return;
  }
  
  isSubmitting = true;
  
  try {
    await axios.post('/api/submit', formData);
    Message.success('提交成功');
  } finally {
    isSubmitting = false;
  }
};
```
</details>

---

### 数据处理题

**Q24: Axios 如何自动转换 JSON？**
<details>
<summary>标准答案</summary>

**自动序列化（请求）：**
```javascript
// 对象会自动转为 JSON 字符串
axios.post('/api/users', {
  name: 'John',
  age: 30
});
// 实际发送：{"name":"John","age":30}
// Content-Type 自动设为 application/json
```

**自动反序列化（响应）：**
```javascript
// 响应的 JSON 字符串自动解析为对象
axios.get('/api/users').then(res => {
  console.log(res.data); // 直接是对象，不需要 JSON.parse()
});
```

**禁用自动转换：**
```javascript
axios.post('/api/users', data, {
  transformRequest: [(data) => data], // 不转换
  transformResponse: [(data) => data]  // 不转换
});
```
</details>

---

**Q25: 如何发送 FormData 格式的请求？**
<details>
<summary>标准答案</summary>

```javascript
// 手动创建 FormData
const formData = new FormData();
formData.append('username', 'john');
formData.append('avatar', fileInput.files[0]);

axios.post('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  onUploadProgress: (event) => {
    const percent = Math.round((event.loaded * 100) / event.total);
    console.log(`上传进度：${percent}%`);
  }
});
```

**自动转换对象为 FormData：**
```javascript
// 自定义转换器
axios.defaults.transformRequest = [
  function (data, headers) {
    if (headers['Content-Type'] === 'multipart/form-data') {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      return formData;
    }
    return data;
  }
];
```
</details>

---

**Q26: 如何处理 URL 参数？**
<details>
<summary>标准答案</summary>

**方式一：params 配置（推荐）**
```javascript
axios.get('/api/users', {
  params: {
    page: 1,
    size: 10,
    keywords: 'john'
  }
});
// 实际请求：/api/users?page=1&size=10&keywords=john
```

**方式二：手动拼接**
```javascript
axios.get('/api/users?page=1&size=10');
```

**处理数组参数：**
```javascript
// 默认：ids=1&ids=2&ids=3
axios.get('/api/users', {
  params: { ids: [1, 2, 3] }
});

// 自定义序列化：ids[]=1&ids[]=2
axios.get('/api/users', {
  params: { ids: [1, 2, 3] },
  paramsSerializer: (params) => {
    return Qs.stringify(params, { arrayFormat: 'brackets' });
  }
});
```
</details>

---

---

### 文件上传/下载题

**Q28: 如何实现文件上传并显示进度？**
<details>
<summary>标准答案</summary>

```javascript
const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      
      // 更新 UI 进度条
      updateProgressBar(percent);
      
      console.log(`上传进度：${percent}%`);
    }
  });
};

// 使用
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  uploadFile(file).then(res => {
    console.log('上传成功:', res.data);
  });
});
```
</details>

---

**Q29: 如何实现大文件分片上传？**
<details>
<summary>标准答案</summary>

```javascript
const uploadLargeFile = async (file) => {
  const chunkSize = 2 * 1024 * 1024; // 2MB 每片
  const chunks = Math.ceil(file.size / chunkSize);
  const fileName = file.name;
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('fileName', fileName);
    formData.append('chunkIndex', i);
    formData.append('totalChunks', chunks);
    
    await axios.post('/api/upload/chunk', formData, {
      onUploadProgress: (event) => {
        const chunkPercent = (event.loaded / event.total) * 100;
        const totalPercent = ((i + chunkPercent / 100) / chunks) * 100;
        console.log(`总进度：${totalPercent.toFixed(2)}%`);
      }
    });
  }
  
  // 所有分片上传完成，通知后端合并
  await axios.post('/api/upload/merge', { fileName, totalChunks: chunks });
};
```
</details>

---

**Q30: 如何实现文件下载？**
<details>
<summary>标准答案</summary>

```javascript
const downloadFile = async (url, filename) => {
  const response = await axios.get(url, {
    responseType: 'blob', // 关键！
    onDownloadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`下载进度：${percent}%`);
    }
  });
  
  // 创建下载链接
  const blob = new Blob([response.data]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  
  // 释放内存
  window.URL.revokeObjectURL(link.href);
};

// 使用
downloadFile('/api/files/report.pdf', 'report.pdf');
```

**处理文件名（从响应头获取）：**
```javascript
const getFilenameFromHeader = (headers) => {
  const disposition = headers['content-disposition'];
  if (disposition) {
    const match = disposition.match(/filename="(.+)"/);
    return match ? decodeURIComponent(match[1]) : 'download';
  }
  return 'download';
};

// 使用
const response = await axios.get('/api/download', { responseType: 'blob' });
const filename = getFilenameFromHeader(response.headers);
```
</details>

---

### 并发与性能题

**Q31: 如何同时发起多个请求？**
<details>
<summary>标准答案</summary>

**方式一：Promise.all（全部成功才返回）**
```javascript
Promise.all([
  axios.get('/api/users'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
])
.then(([usersRes, postsRes, commentsRes]) => {
  console.log('用户:', usersRes.data);
  console.log('文章:', postsRes.data);
  console.log('评论:', commentsRes.data);
})
.catch(error => {
  // 任一请求失败都会进入这里
  console.error('请求失败:', error);
});
```

**方式二：Promise.allSettled（不管成败都返回）**
```javascript
Promise.allSettled([
  axios.get('/api/users'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
])
.then(results => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`请求 ${index} 成功:`, result.value.data);
    } else {
      console.log(`请求 ${index} 失败:`, result.reason);
    }
  });
});
```

**方式三：Promise.race（最快返回的）**
```javascript
Promise.race([
  axios.get('/api/server1/data'),
  axios.get('/api/server2/data')
])
.then(fastestResponse => {
  console.log('最快的响应:', fastestResponse.data);
});
```
</details>

---

**Q32: 如何限制并发请求数量？**
<details>
<summary>标准答案</summary>

```javascript
class RequestQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent; // 最大并发数
    this.currentCount = 0;              // 当前并发数
    this.queue = [];                    // 等待队列
  }
  
  async request(requestFn) {
    // 如果达到最大并发，加入队列等待
    if (this.currentCount >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.currentCount++;
    
    try {
      const result = await requestFn();
      return result;
    } finally {
      this.currentCount--;
      
      // 从队列中取出下一个请求
      if (this.queue.length > 0) {
        const resolve = this.queue.shift();
        resolve();
      }
    }
  }
}

// 使用
const queue = new RequestQueue(3); // 最多3个并发

const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const requests = userIds.map(id => 
  queue.request(() => axios.get(`/api/users/${id}`))
);

Promise.all(requests).then(responses => {
  console.log('所有请求完成');
});
```
</details>

---

**Q33: 如何实现请求缓存？**
<details>
<summary>标准答案</summary>

```javascript
const cache = new Map();

// 生成缓存键
const getCacheKey = (config) => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params)}`;
};

// 请求拦截器
axios.interceptors.request.use(config => {
  // 仅对 GET 请求缓存
  if (config.method === 'get' && config.cache) {
    const key = getCacheKey(config);
    
    if (cache.has(key)) {
      const cached = cache.get(key);
      
      // 检查是否过期
      if (Date.now() < cached.expiry) {
        console.log('使用缓存');
        
        // 返回缓存数据
        config.adapter = () => Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: 'OK (from cache)',
          headers: {},
          config,
          request: {}
        });
      } else {
        // 过期则删除
        cache.delete(key);
      }
    }
  }
  
  return config;
});

// 响应拦截器
axios.interceptors.response.use(response => {
  const config = response.config;
  
  if (config.method === 'get' && config.cache) {
    const key = getCacheKey(config);
    const expiry = Date.now() + (config.cacheTime || 60000); // 默认缓存 1 分钟
    
    cache.set(key, {
      data: response.data,
      expiry
    });
  }
  
  return response;
});

// 使用
axios.get('/api/users', {
  cache: true,
  cacheTime: 300000 // 缓存 5 分钟
});
```
</details>

---

**Q34: 如何实现请求重试？**
<details>
<summary>标准答案</summary>

```javascript
axios.interceptors.response.use(null, async (error) => {
const config = error.config;

// 没有配置重试或已达最大次数
if (!config || !config.retry || config.__retryCount >= config.retry) {
 return Promise.reject(error);
}

//


记录重试次数
config.__retryCount = config.__retryCount || 0;
config.__retryCount += 1;

console.log(`重试第 ${config.__retryCount} 次`);

// 延迟后重试
const delay = config.retryDelay || 1000;
await new Promise(resolve => setTimeout(resolve, delay));

return axios(config);
});

// 使用
axios.get('/api/users', {
retry: 3, // 最多重试 3 次
retryDelay: 1000 // 每次延迟 1 秒
}).catch(error => {
console.log('重试失败');
});
```

**指数退避策略（更优雅）：**
```javascript
axios.interceptors.response.use(null, async (error) => {
const config = error.config;

if (!config || !config.retry || config.__retryCount >= config.retry) {
 return Promise.reject(error);
}

config.__retryCount = config.__retryCount || 0;
config.__retryCount += 1;

// 指数退避：1s, 2s, 4s, 8s...
const delay = Math.pow(2, config.__retryCount - 1) * 1000;

console.log(`${delay}ms 后重试`);

await new Promise(resolve => setTimeout(resolve, delay));

return axios(config);
});
```
</details>

---

### 安全性题

**Q35: Axios 如何防护 XSRF 攻击？**
<details>
<summary>标准答案</summary>

**XSRF（跨站请求伪造）原理：** 攻击者诱导用户访问恶意网站，该网站利用用户的登录凭证（Cookie）向目标网站发起请求。

**Axios 防护机制：**
1. 从 Cookie 中读取 XSRF Token
2. 将 Token 放入请求头发送给服务器
3. 服务器验证 Token 是否匹配

**默认配置：**
```javascript
{
xsrfCookieName: 'XSRF-TOKEN', // Cookie 名称
xsrfHeaderName: 'X-XSRF-TOKEN' // 请求头名称
}
```

**工作流程：**
```
1. 用户登录后，服务器设置 Cookie: XSRF-TOKEN=abc123
2. Axios 自动读取该 Cookie
3. 发请求时自动添加请求头: X-XSRF-TOKEN: abc123
4. 服务器验证 Cookie 和 Header 中的 Token 是否一致
```

**自定义配置：**
```javascript
axios.defaults.xsrfCookieName = 'MY-XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-MY-XSRF-TOKEN';
```

**注意：** 仅在浏览器环境且跨域请求携带凭证时生效。
</details>

---

**Q36: withCredentials 的作用是什么？**
<details>
<summary>标准答案</summary>

**作用：** 控制跨域请求是否携带 Cookie、HTTP 认证信息。

**默认值：** `false`（不携带）

**启用方式：**
```javascript
axios.defaults.withCredentials = true;

// 或单个请求
axios.get('/api/users', {
withCredentials: true
});
```

**服务器端配置（必须）：**
```javascript
// Express
app.use(cors({
origin: 'https://example.com', // 不能是 *
credentials: true // 允许携带凭证
}));

// 响应头
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

**应用场景：**
- 单点登录（SSO）
- 跨域携带身份信息
- 第三方 API 认证

**安全提示：** 启用后容易受 XSRF 攻击，务必配合 XSRF 防护。
</details>

---

**Q37: 如何防止敏感信息泄露？**
<details>
<summary>标准答案</summary>

**1. 避免在请求中暴露敏感信息**
```javascript
// ❌ 错误：Token 放在 URL 中
axios.get(`/api/users?token=${token}`);

// ✅ 正确：Token 放在请求头
axios.get('/api/users', {
headers: {
 'Authorization': `Bearer ${token}`
}
});
```

**2. 拦截器中移除敏感日志**
```javascript
axios.interceptors.request.use(config => {
// 不打印完整配置（避免泄露 Token）
console.log('请求 URL:', config.url);
// ❌ console.log('请求配置:', config);

return config;
});
```

**3. 错误处理时隐藏敏感信息**
```javascript
axios.interceptors.response.use(null, error => {
// 不返回原始错误（可能包含敏感数据）
const safeError = {
 message: '请求失败',
 status: error.response?.status
 // 不返回 error.config 和 error.response.data
};

return Promise.reject(safeError);
});
```

**4. 使用环境变量管理敏感配置**
```javascript
// .env
VUE_APP_API_KEY=your-secret-key

// 代码中
axios.defaults.headers.common['X-API-Key'] = process.env.VUE_APP_API_KEY;
```
</details>

---

### 实战场景题

**Q38: 如何封装一个企业级的 Axios 实例？**
<details>
<summary>标准答案</summary>

```javascript
// api/request.js
import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';

// 创建实例
const service = axios.create({
baseURL: process.env.VUE_APP_BASE_API,
timeout: 10000,
headers: {
 'Content-Type': 'application/json'
}
});

// 请求拦截器
service.interceptors.request.use(
config => {
 // 1. 添加 Token
 const token = localStorage.getItem('token');
 if (token) {
 config.headers.Authorization = `Bearer ${token}`;
 }

 // 2. 显示 Loading（可选）
 if (config.loading !== false) {
 // showLoading();
 }

 // 3. 添加时间戳防止缓存
 if (config.method === 'get') {
 config.params = {
 ...config.params,
 _t: Date.now()
 };
 }

 return config;
},
error => {
 console.error('请求配置错误:', error);
 return Promise.reject(error);
}
);

// 响应拦截器
service.interceptors.response.use(
response => {
 // hideLoading();

 const { code, data, message } = response.data;

 // 业务成功
 if (code === 200) {
 return data;
 }

 // 业务失败
 Message.error(message || '请求失败');
 return Promise.reject(new Error(message));
},
error => {
 // hideLoading();

 if (error.response) {
 const { status, data } = error.response;

 switch (status) {
 case 401:
 Message.error('登录已过期，请重新登录');
 localStorage.clear();
 router.push('/login');
 break;
 case 403:
 Message.error('无权限访问');
 break;
 case 404:
 Message.error('请求资源不存在');
 break;
 case 500:
 Message.error('服务器错误');
 break;
 default:
 Message.error(data?.message || '请求失败');
 }
 } else if (error.request) {
 if (error.code === 'ECONNABORTED') {
 Message.error('请求超时');
 } else {
 Message.error('网络连接失败');
 }
 } else {
 Message.error('请求配置错误');
 }

 return Promise.reject(error);
}
);

export default service;
```

**使用：**
```javascript
// api/user.js
import request from './request';

export const getUserList = (params) => {
return request({
 url: '/users',
 method: 'get',
 params
});
};

export const createUser = (data) => {
return request({
 url: '/users',
 method: 'post',
 data
});
};
```
</details>

---

**Q39: 如何处理多个后端服务（微服务架构）？**
<details>
<summary>标准答案</summary>

```javascript
// api/services.js
import axios from 'axios';

// 用户服务
export const userService = axios.create({
baseURL: 'https://api.example.com/user',
timeout: 5000
});

// 订单服务
export const orderService = axios.create({
baseURL: 'https://api.example.com/order',
timeout: 5000
});

// 商品服务
export const productService = axios.create({
baseURL: 'https://api.example.com/product',
timeout: 5000
});

// 统一添加拦截器
const setupInterceptors = (service) => {
service.interceptors.request.use(config => {
 const token = localStorage.getItem('token');
 if (token) {
 config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});

service.interceptors.response.use(
 res => res.data,
 error => {
 console.error('请求失败:', error);
 return Promise.reject(error);
 }
);
};

[userService, orderService, productService].forEach(setupInterceptors);
```

**使用：**
```javascript
import { userService, orderService } from '@/api/services';

// 用户相关
userService.get('/profile');

// 订单相关
orderService.get('/list');
```
</details>

---

**Q40: 如何实现请求/响应日志记录？**
<details>
<summary>标准答案</summary>

```javascript
// 请求日志
axios.interceptors.request.use(config => {
const logData = {
 type: 'REQUEST',
 timestamp: new Date().toISOString(),
 method: config.method.toUpperCase(),
 url: config.url,
 params: config.params,
 data: config.data
};

console.log('[API Request]', logData);

// 可以发送到日志服务器
// sendToLogServer(logData);

return config;
});

// 响应日志
axios.interceptors.response.use(
response => {
 const logData = {
 type: 'RESPONSE',
 timestamp: new Date().toISOString(),
 method: response.config.method.toUpperCase(),
 url: response.config.url,
 status: response.status,
 duration: Date.now() - response.config.metadata?.startTime
 };

 console.log('[API Response]', logData);

 return response;
},
error => {
 const logData = {
 type: 'ERROR',
 timestamp: new Date().toISOString(),
 method: error.config?.method?.toUpperCase(),
 url: error.config?.url,
 status: error.response?.status,
 message: error.message
 };

 console.error('[API Error]', logData);

 return Promise.reject(error);
}
);

// 记录请求开始时间
axios.interceptors.request.use(config => {
config.metadata = { startTime: Date.now() };
return config;
});
```
</details>

---

**Q41: 如何实现接口 Mock（前后端分离开发）？**
<details>
<summary>标准答案</summary>

**方式一：使用 adapter 拦截请求**
```javascript
import mockData from './mockData';

axios.defaults.adapter = (config) => {
// 判断是否需要 Mock
if (process.env.NODE_ENV === 'development' && config.mock) {
 return new Promise((resolve) => {
 setTimeout(() => {
 resolve({
 data: mockData[config.url],
 status: 200,
 statusText: 'OK',
 headers: {},
 config,
 request: {}
 });
 }, 500); // 模拟网络延迟
 });
}

// 真实请求
return axios.defaults.adapter(config);
};

// 使用
axios.get('/api/users', { mock: true });
```

**方式二：条件性替换 baseURL**
```javascript
const service = axios.create({
baseURL: process.env.VUE_APP_MOCK_API || process.env.VUE_APP_BASE_API
});
```

**方式三：使用 Mock.js + axios-mock-adapter**
```javascript
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 500 });

mock.onGet('/api/users').reply(200, {
code: 200,
data: [
 { id: 1, name: 'John' },
 { id: 2, name: 'Jane' }
]
});

mock.onPost('/api/login').reply(config => {
const { username, password } = JSON.parse(config.data);
if (username === 'admin' && password === '123456') {
 return [200, { token: 'mock-token' }];
}
return [401, { message: '用户名或密码错误' }];
});
```
</details>

---

### 对比题

**Q42: Axios vs Fetch 详细对比**
<details>
<summary>标准答案</summary>

| 特性 | Axios | Fetch |
|-----|-------|-------|
| **基础** |||
| 类型 | 第三方库 | 原生 API |
| 浏览器支持 | IE11+ | 现代浏览器（不支持 IE） |
| Promise | 是 | 是 |
| 包体积 | ~13KB（gzip 后 5KB） | 0（原生） |
| **请求** |||
| 超时控制 | `timeout: 5000` | 需 AbortController |
| 请求取消 | 内置支持 | AbortController |
| 进度监控 | `onUploadProgress` | 不支持 |
| 拦截器 | 内置 | 需手动封装 |
| **响应** |||
| JSON 转换 | 自动 | 需 `res.json()` |
| 错误处理 | HTTP 错误自动 reject | 仅网络错误 reject |
| 响应类型 | `responseType` | 多种方法（`.blob()`, `.text()`） |
| **安全** |||
| XSRF 防护 | 内置 | 需手动实现 |
| Cookie | `withCredentials` | `credentials: 'include'` |
| **其他** |||
| 同构支持 | 是（浏览器 + Node.js） | 浏览器 |
| 默认 Content-Type | `application/json` | `text/plain` |

**选择建议：**
- **大型项目、需完善错误处理** → Axios
- **小型项目、现代浏览器** → Fetch
- **Node.js 环境** → Axios
</details>

---

**Q43: Axios vs jQuery.ajax 对比**
<details>
<summary>标准答案</summary>

| 特性 | Axios | jQuery.ajax |
|-----|-------|-------------|
| 依赖 | 独立库 | 需整个 jQuery |
| Promise | 是 | 可选（默认使用 Deferred） |
| 体积 | ~13KB | ~80KB（整个 jQuery） |
| 拦截器 | 内置 | 无 |
| 取消请求 | 支持 | 通过 jqXHR.abort() |
| 进度监控 | 支持 | 支持 |
| JSONP | 需插件 | 原生支持 |

**迁移建议：**
```javascript
// jQuery
$.ajax({
url: '/api/users',
type: 'GET',
dataType: 'json',
success: (data) => {},
error: (xhr) => {}
});

// Axios
axios.get('/api/users')
.then(res => res.data)
.catch(error => {});
```
</details>

---

### 进阶题

**Q45: 如何自定义 Adapter？**
<details>
<summary>标准答案</summary>

**Adapter 作用：** 定义如何发送请求（浏览器用 XMLHttpRequest，Node.js 用 http 模块）。

**自定义示例（使用 WebSocket）：**
```javascript
const webSocketAdapter = (config) => {
return new Promise((resolve, reject) => {
 const ws = new WebSocket(config.url);

 ws.onopen = () => {
 ws.send(JSON.stringify(config.data));
 };

 ws.onmessage = (event) => {
 resolve({
 data: JSON.parse(event.data),
 status: 200,
 statusText: 'OK',
 headers: {},
 config,
 request: ws
 });
 ws.close();
 };

 ws.onerror = (error) => {
 reject(error);
 ws.close();
 };

 // 超时处理
 if (config.timeout) {
 setTimeout(() => {
 ws.close();
 reject(new Error('WebSocket timeout'));
 }, config.timeout);
 }
});
};

// 使用
axios.get('ws://localhost:8080', {
adapter: webSocketAdapter
});
```
</details>

---

**Q46: 如何实现请求去重（防止重复请求）？**
<details>
<summary>标准答案</summary>

**完整实现（生产级）：**
```javascript
// 存储待处理请求
const pendingRequests = new Map();

// 生成请求唯一标识
const generateRequestKey = (config) => {
const { method, url, params, data } = config;
return [
 method,
 url,
 JSON.stringify(params),
 JSON.stringify(data)
].join('&');
};

// 添加请求
const addPendingRequest = (config) => {
const key = generateRequestKey(config);
const controller = new AbortController();

config.signal = controller.signal;
pendingRequests.set(key, controller);
};

// 移除请求
const removePendingRequest = (config) => {
const key = generateRequestKey(config);
pendingRequests.delete(key);
};

// 取消重复请求
const cancelDuplicateRequest = (config) => {
const key = generateRequestKey(config);

if (pendingRequests.has(key)) {
 const controller = pendingRequests.get(key);
 controller.abort('Duplicate request canceled');
}
};

// 请求拦截器
axios.interceptors.request.use(config => {
// 取消重复请求
cancelDuplicateRequest(config);

// 添加新请求
addPendingRequest(config);

return config;
});

// 响应拦截器
axios.interceptors.response.use(
response => {
 removePendingRequest(response.config);
 return response;
},
error => {
 if (error.config) {
 removePendingRequest(error.config);
 }
 return Promise.reject(error);
}
);
```
</details>

---

**Q47: 如何处理跨域问题？**
<details>
<summary>标准答案</summary>

**跨域不是 Axios 的问题，而是浏览器安全策略。**

**解决方案：**

**1. 后端配置 CORS（推荐）**
```javascript
// Express
app.use(cors({
origin: 'https://example.com',
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE'],
allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**2. 开发环境代理（Vue/React）**
```javascript
// vue.config.js
module.exports = {
devServer: {
 proxy: {
 '/api': {
 target: 'https://api.example.com',
 changeOrigin: true,
 pathRewrite: {
 '^/api': ''
 }
 }
 }
}
};

// Axios 配置
axios.defaults.baseURL = '/api';
```

**3. JSONP（仅支持 GET，已过时）**
```javascript
// 不推荐，Axios 不原生支持
```

**注意：** 携带凭证时需同时配置 `withCredentials` 和后端 CORS。
</details>

---

**Q48: 如何优化 Axios 性能？**
<details>
<summary>标准答案</summary>

**1. 请求合并（减少请求数）**
```javascript
// 使用 Promise.all 合并多个请求
Promise.all([
axios.get('/api/user'),
axios.get('/api/config')
]);
```

**2. 请求缓存（避免重复请求）**
```javascript
// 见 Q33 的缓存实现
```

**3. 限制并发数（避免浏览器阻塞）**
```javascript
// 见 Q32 的并发控制
```

**4. 使用 HTTP/2（多路复用）**
```javascript
// 后端配置 HTTP/2，Axios 自动支持
```

**5. 压缩请求体**
```javascript
import pako from 'pako';

axios.defaults.transformRequest = [
(data) => {
 const compressed = pako.gzip(JSON.stringify(data));
 return compressed;
}
];
```

**6. 取消不必要的请求**
```javascript
// 见 Q21 的请求取消
```

**7. 使用 CDN 加速**
```javascript
axios.defaults.baseURL = 'https://cdn.example.com';
```
</details>

---

**Q49: 如何调试 Axios 请求？**
<details>
<summary>标准答案</summary>

**1. 浏览器 Network 面板**
- 最直观的方式，查看所有请求细节

**2. Axios 日志拦截器**
```javascript
axios.interceptors.request.use(config => {
console.group(`[${config.method.toUpperCase()}] ${config.url}`);
console.log('请求参数:', config.params);
console.log('请求体:', config.data);
console.log('请求头:', config.headers);
console.groupEnd();
return config;
});

axios.interceptors.response.use(
response => {
 console.group(`[响应] ${response.config.url}`);
 console.log('状态码:', response.status);
 console.log('响应数据:', response.data);
 console.groupEnd();
 return response;
},
error => {
 console.group(`[错误] ${error.config?.url}`);
 console.error('错误信息:', error.message);
 console.error('响应:', error.response);
 console.groupEnd();
 return Promise.reject(error);
}
);
```

**3. 使用 axios-debug-log**
```javascript
import axios from 'axios';
import debug from 'axios-debug-log';

debug(axios);
```

**4. Charles/Fiddler 抓包工具**
- 查看加密请求、HTTPS 请求

**5. 配置代理查看原始请求**
```javascript
axios.defaults.proxy = {
host: '127.0.0.1',
port: 8888
};
```
</details>

---

**Q50: Axios 在 SSR（服务端渲染）中的注意事项？**
<details>
<summary>标准答案</summary>

**问题：** 服务端没有浏览器环境，Cookie、LocalStorage 不可用。

**解决方案：**

**1. 创建独立实例**
```javascript
// 服务端
export const createAPIClient = (context) => {
return axios.create({
 baseURL: process.env.API_BASE_URL,
 headers: {
 // 从 context 中获取 Cookie
 Cookie: context.req.headers.cookie || ''
 }
});
};

// 使用
export default {
asyncData({ $axios, req }) {
 const api = createAPIClient({ req });
 return api.get('/api/data');
}
};
```

**2. 统一处理认证**
```javascript
// Nuxt.js 插件
export default function ({ $axios, req, redirect }) {
$axios.onRequest(config => {
 if (process.server && req.headers.cookie) {
 config.headers.Cookie = req.headers.cookie;
 }
 return config;
});
}
```

**3. 避免内存泄漏**
```javascript
// 每次请求创建新实例，避免状态污染
const createInstance = () => {
return axios.create({ /* config */ });
};
```
</details>

---


