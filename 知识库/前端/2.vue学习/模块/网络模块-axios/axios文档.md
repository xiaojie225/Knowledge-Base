
# Axios 完整知识体系与面试宝典

## 📌 核心概念速览（3分钟版）

**Axios 是什么？**
基于 Promise 的 HTTP 客户端，可在浏览器和 Node.js 中使用，提供统一的 API 进行网络请求。

**核心价值：**
1. **同构支持** - 浏览器用 XMLHttpRequest，Node.js 用 http 模块
2. **拦截器机制** - 请求/响应可全局处理（认证、日志、错误）
3. **自动转换** - JSON 数据自动序列化/反序列化
4. **取消请求** - 支持 AbortController 和旧版 CancelToken
5. **防御机制** - 自动防护 XSRF，超时控制

---

## 🎯 深度解析

### 1. 基础使用

#### 1.1 安装与引入
```bash
npm install axios
# 或
yarn add axios
```

```javascript
// ES6 模块
import axios from 'axios';

// CommonJS
const axios = require('axios');

// CDN（浏览器）
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

#### 1.2 发起请求的方式

**方式一：直接调用**
```javascript
// GET 请求
axios.get('/api/users?id=123')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// POST 请求
axios.post('/api/users', { name: 'John', age: 30 })
  .then(res => console.log(res.data));
```

**方式二：配置对象**
```javascript
axios({
  method: 'post',
  url: '/api/users',
  data: { name: 'John' },
  headers: { 'X-Custom-Header': 'value' },
  timeout: 5000
});
```

**方式三：便捷方法**
```javascript
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```

---

### 2. 核心配置项

#### 2.1 完整配置清单
```javascript
{
  // 请求地址（必填）
  url: '/api/users',
  
  // 请求方法（默认 GET）
  method: 'get',
  
  // 基础 URL（会自动拼接到 url 前）
  baseURL: 'https://api.example.com',
  
  // 请求头
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  
  // URL 参数（会自动序列化）
  params: { id: 123, sort: 'desc' },
  
  // 请求体数据（POST/PUT/PATCH）
  data: { name: 'John' },
  
  // 超时时间（毫秒）
  timeout: 5000,
  
  // 跨域请求是否携带凭证（Cookie）
  withCredentials: false,
  
  // 响应数据类型
  responseType: 'json', // 'arraybuffer' | 'blob' | 'document' | 'text' | 'stream'
  
  // 响应编码
  responseEncoding: 'utf8',
  
  // XSRF 防护
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  
  // 上传进度回调
  onUploadProgress: (progressEvent) => {
    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    console.log(`上传进度：${percent}%`);
  },
  
  // 下载进度回调
  onDownloadProgress: (progressEvent) => {},
  
  // 最大内容长度（字节）
  maxContentLength: 2000,
  maxBodyLength: 2000,
  
  // HTTP 状态码验证函数
  validateStatus: (status) => status >= 200 && status < 300,
  
  // 最大重定向次数（Node.js）
  maxRedirects: 5,
  
  // 代理配置（Node.js）
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 9000,
    auth: { username: 'user', password: 'pass' }
  },
  
  // 取消请求信号
  signal: new AbortController().signal,
  
  // 自定义参数序列化器
  paramsSerializer: (params) => {
    return Qs.stringify(params, { arrayFormat: 'brackets' });
  }
}
```

---

### 3. 实例化与默认配置

#### 3.1 创建实例
```javascript
// 创建自定义实例
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 使用实例
apiClient.get('/users').then(res => console.log(res.data));
```

#### 3.2 默认配置的优先级
```javascript
// 全局默认配置（优先级最低）
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = 'Bearer token';

// 实例默认配置（中等优先级）
const instance = axios.create({
  timeout: 5000
});

// 请求配置（优先级最高）
instance.get('/users', {
  timeout: 3000 // 会覆盖实例的 5000
});
```

**优先级规则：** 请求配置 > 实例配置 > 全局默认配置

---

### 4. 拦截器机制 ⭐⭐⭐

#### 4.1 请求拦截器
```javascript
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 请求发送前处理
    // 1. 添加 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 2. 显示 Loading
    showLoading();
    
    // 3. 日志记录
    console.log('请求配置:', config);
    
    return config; // 必须返回 config
  },
  error => {
    // 请求错误处理
    return Promise.reject(error);
  }
);
```

#### 4.2 响应拦截器
```javascript
// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // HTTP 状态码 2xx 时触发
    hideLoading();
    
    // 统一处理业务错误码
    const { code, data, message } = response.data;
    if (code !== 200) {
      showError(message);
      return Promise.reject(new Error(message));
    }
    
    return data; // 直接返回业务数据
  },
  error => {
    // HTTP 状态码非 2xx 时触发
    hideLoading();
    
    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          // Token 过期，跳转登录
          router.push('/login');
          break;
        case 403:
          showError('无权限访问');
          break;
        case 404:
          showError('请求资源不存在');
          break;
        case 500:
          showError('服务器错误');
          break;
      }
    } else if (error.request) {
      // 请求已发出但未收到响应（网络问题）
      showError('网络连接失败');
    } else {
      // 请求配置出错
      showError('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);
```

#### 4.3 移除拦截器
```javascript
// 保存拦截器 ID
const myInterceptor = axios.interceptors.request.use(config => config);

// 移除拦截器
axios.interceptors.request.eject(myInterceptor);
```

#### 4.4 实例级拦截器
```javascript
const instance = axios.create();
instance.interceptors.request.use(config => config);
// 只对该实例生效
```

---

### 5. 错误处理

#### 5.1 错误对象结构
```javascript
axios.get('/api/users').catch(error => {
  if (error.response) {
    // 服务器返回状态码不在 2xx 范围
    console.log(error.response.data);    // 响应体
    console.log(error.response.status);  // 状态码 404/500
    console.log(error.response.headers); // 响应头
  } else if (error.request) {
    // 请求已发出但没有收到响应
    console.log(error.request);
  } else {
    // 请求配置错误
    console.log('Error', error.message);
  }
  console.log(error.config); // 原始请求配置
});
```

#### 5.2 自定义错误状态码范围
```javascript
axios.get('/api/users', {
  validateStatus: (status) => {
    return status >= 200 && status < 500; // 500+ 才算错误
  }
});
```

#### 5.3 统一错误处理器
```javascript
// 封装错误处理
const handleError = (error) => {
  const { response, request, message } = error;
  
  if (response) {
    const errorMap = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    };
    const msg = errorMap[response.status] || `错误：${response.status}`;
    Message.error(msg);
  } else if (request) {
    Message.error('网络请求失败，请检查网络连接');
  } else {
    Message.error(`请求配置错误：${message}`);
  }
  
  return Promise.reject(error);
};

// 在拦截器中使用
axios.interceptors.response.use(res => res, handleError);
```

---

### 6. 取消请求 ⭐⭐

#### 6.1 使用 AbortController（推荐）
```javascript
const controller = new AbortController();

axios.get('/api/users', {
  signal: controller.signal
}).catch(err => {
  if (axios.isCancel(err)) {
    console.log('请求已取消:', err.message);
  }
});

// 取消请求
controller.abort();
```

#### 6.2 取消重复请求（实战场景）
```javascript
// 创建请求映射表
const pendingRequests = new Map();

// 生成请求唯一 key
const generateRequestKey = (config) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};

// 请求拦截器：取消重复请求
axios.interceptors.request.use(config => {
  const requestKey = generateRequestKey(config);
  
  // 如果已有相同请求，取消之前的
  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey);
    controller.abort();
  }
  
  // 添加新的 AbortController
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(requestKey, controller);
  
  return config;
});

// 响应拦截器：清除已完成的请求
axios.interceptors.response.use(
  response => {
    const requestKey = generateRequestKey(response.config);
    pendingRequests.delete(requestKey);
    return response;
  },
  error => {
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }
    return Promise.reject(error);
  }
);
```

#### 6.3 旧版 CancelToken（已废弃）
```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/users', {
  cancelToken: source.token
});

source.cancel('操作被用户取消'); // 取消请求
```

---

### 7. 请求/响应转换器

#### 7.1 请求数据转换
```javascript
axios.defaults.transformRequest = [
  function (data, headers) {
    // 自动将对象转为 FormData
    if (data instanceof Object && !(data instanceof FormData)) {
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

#### 7.2 响应数据转换
```javascript
axios.defaults.transformResponse = [
  function (data) {
    // 自动解析 JSON
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }
    
    // 统一响应结构
    return {
      success: data.code === 200,
      data: data.data,
      message: data.message
    };
  }
];
```

---

### 8. 并发请求

#### 8.1 Promise.all 方式
```javascript
Promise.all([
  axios.get('/api/users'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
])
.then(([users, posts, comments]) => {
  console.log('用户:', users.data);
  console.log('文章:', posts.data);
  console.log('评论:', comments.data);
});
```

#### 8.2 axios.all（已废弃，等同于 Promise.all）
```javascript
axios.all([
  axios.get('/api/users'),
  axios.get('/api/posts')
])
.then(axios.spread((users, posts) => {
  console.log(users.data, posts.data);
}));
```

---

### 9. 文件上传与下载

#### 9.1 文件上传
```javascript
// 单文件上传
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
      console.log(`上传进度：${percent}%`);
    }
  });
};

// 多文件上传
const uploadMultiple = (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  return axios.post('/api/upload/multiple', formData);
};
```

#### 9.2 文件下载
```javascript
// 下载文件并保存
const downloadFile = async (url, filename) => {
  const response = await axios.get(url, {
    responseType: 'blob', // 重要！
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
  window.URL.revokeObjectURL(link.href);
};

// 使用
downloadFile('/api/download/report.pdf', 'report.pdf');
```

---

### 10. 高级特性

#### 10.1 请求重试机制
```javascript
// 封装重试逻辑
axios.interceptors.response.use(null, async (error) => {
  const config = error.config;
  
  // 未设置重试或已达最大次数
  if (!config || !config.retry || config.__retryCount >= config.retry) {
    return Promise.reject(error);
  }
  
  // 记录重试次数
  config.__retryCount = config.__retryCount || 0;
  config.__retryCount += 1;
  
  // 延迟后重试
  const delay = config.retryDelay || 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return axios(config);
});

// 使用
axios.get('/api/users', {
  retry: 3,       // 重试 3 次
  retryDelay: 1000 // 每次延迟 1 秒
});
```

#### 10.2 请求缓存（简易版）
```javascript
const cache = new Map();

axios.interceptors.request.use(config => {
  if (config.method === 'get' && config.cache) {
    const key = config.url + JSON.stringify(config.params);
    if (cache.has(key)) {
      // 返回缓存数据（需要包装成 Promise）
      config.adapter = () => Promise.resolve({
        data: cache.get(key),
        status: 200,
        statusText: 'OK (from cache)',
        headers: {},
        config
      });
    }
  }
  return config;
});

axios.interceptors.response.use(response => {
  if (response.config.method === 'get' && response.config.cache) {
    const key = response.config.url + JSON.stringify(response.config.params);
    cache.set(key, response.data);
  }
  return response;
});

// 使用
axios.get('/api/users', { cache: true });
```

#### 10.3 Token 自动刷新
```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 等待 Token 刷新完成
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const { data } = await axios.post('/api/refresh-token');
        const newToken = data.token;
        localStorage.setItem('token', newToken);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // 跳转登录
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
```

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
<details>
<summary>标准答案</summary>

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
</details>

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

**Q18: validateStatus 的作用是什么？**
<details>
<summary>标准答案</summary>

**作用：** 自定义哪些 HTTP 状态码算"成功"。

**默认行为：**
```javascript
// 默认：2xx 算成功，其他算失败
validateStatus: (status) => status >= 200 && status < 300
```

**自定义场景：**
```javascript
// 场景 1：404 也视为成功（资源不存在时返回空数据）
axios.get('/api/user/123', {
  validateStatus: (status) => {
    return status === 404 || (status >= 200 && status < 300);
  }
}).then(res => {
  if (res.status === 404) {
    console.log('用户不存在');
  }
});

// 场景 2：500 也不算错误（由业务代码处理）
axios.get('/api/data', {
  validateStatus: () => true // 所有状态码都算成功
}).then(res => {
  if (res.status >= 500) {
    handleServerError(res);
  }
});
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

**Q27: transformRequest 和 transformResponse 的作用？**
<details>
<summary>标准答案</summary>

**transformRequest：** 请求数据发送前的转换。

```javascript
axios.defaults.transformRequest = [
  function (data, headers) {
    // 将驼峰转为下划线
    if (data && typeof data === 'object') {
      return Object.keys(data).reduce((acc, key) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        acc[snakeKey] = data[key];
        return acc;
      }, {});
    }
    return data;
  },
  ...axios.defaults.transformRequest // 保留默认转换
];
```

**transformResponse：** 响应数据处理前的转换。

```javascript
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse, // 先执行默认转换（JSON 解析）
  function (data) {
    // 统一响应格式
    return {
      success: data.code === 200,
      result: data.data,
      message: data.msg
    };
  }
];
```

**执行时机：**
- `transformRequest` → 拦截器 → 发送请求
- 收到响应 → `transformResponse` → 拦截器
</details>

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

**Q44: Axios 的源码实现原理？**
<details>
<summary>标准答案</summary>

**核心架构（简化版）：**
```javascript
class Axios {
constructor(config) {
 this.defaults = config;
 this.interceptors = {
 request: new InterceptorManager(),
 response: new InterceptorManager()
 };
}

request(config) {
 config = Object.assign({}, this.defaults, config);

 // 1. 构建请求拦截器链
 const chain = [dispatchRequest, undefined];

 // 请求拦截器（倒序）
 this.interceptors.request.forEach(interceptor => {
 chain.unshift(interceptor.fulfilled, interceptor.rejected);
 });

 // 响应拦截器（正序）
 this.interceptors.response.forEach(interceptor => {
 chain.push(interceptor.fulfilled, interceptor.rejected);
 });

 // 2. 执行拦截器链
 let promise = Promise.resolve(config);
 while (chain.length) {
 promise = promise.then(chain.shift(), chain.shift());
 }

 return promise;
}
}

// 发送请求的核心函数
function dispatchRequest(config) {
// 浏览器环境：使用 XMLHttpRequest
if (typeof XMLHttpRequest !== 'undefined') {
 return xhrAdapter(config);
}
// Node.js 环境：使用 http 模块
else if (typeof process !== 'undefined') {
 return httpAdapter(config);
}
}
```

**拦截器管理器：**
```javascript
class InterceptorManager {
constructor() {
 this.handlers = [];
}

use(fulfilled, rejected) {
 this.handlers.push({ fulfilled, rejected });
 return this.handlers.length - 1; // 返回 ID
}

eject(id) {
 if (this.handlers[id]) {
 this.handlers[id] = null;
 }
}

forEach(fn) {
 this.handlers.forEach(h => h && fn(h));
}
}
```
</details>

---

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

## 📚 实战最佳实践

### 1. 项目结构建议
```
src/
├── api/
│ ├── request.js # Axios 实例
│ ├── user.js # 用户相关接口
│ ├── product.js # 商品相关接口
│ └── interceptors/
│ ├── auth.js # 认证拦截器
│ ├── error.js # 错误处理拦截器
│ └── logger.js # 日志拦截器
├── utils/
│ ├── cache.js # 请求缓存工具
│ └── retry.js # 重试工具
└── config/
 └── api.config.js # API 配置
```

### 2. 命名规范
- **方法命名：** `get{Resource}`, `create{Resource}`, `update{Resource}`, `delete{Resource}`
- **参数命名：** `params`（URL 参数）、`data`（请求体）
- **配置命名：** 使用驼峰命名（`baseURL`、`withCredentials`）

### 3. 错误处理原则
1. **拦截器统一处理** HTTP 错误
2. **业务代码处理** 业务逻辑错误
3. **用户友好** 的错误提示
4. **开发环境** 详细日志，**生产环境** 简洁提示

### 4. 性能优化清单
- ✅ 使用请求缓存
- ✅ 限制并发请求数
- ✅ 取消重复/过期请求
- ✅ 启用 HTTP/2
✅ 合并请求减少数量
- ✅ 压缩请求体

### 5. 安全检查清单
- ✅ Token 放在请求头而非 URL
- ✅ 启用 XSRF 防护
- ✅ 使用 HTTPS
- ✅ 敏感信息不打印日志
- ✅ 设置合理的超时时间
- ✅ 验证响应数据结构

---

## 💡 易错点与注意事项

### 1. 拦截器相关
**❌ 错误：** 请求拦截器忘记返回 `config`
```javascript
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer token';
  // ❌ 没有返回 config，请求会失败
});
```

**✅ 正确：**
```javascript
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer token';
  return config; // 必须返回
});
```

### 2. 错误处理
**❌ 错误：** 假设错误一定有 `response`
```javascript
axios.get('/api/users').catch(error => {
  console.log(error.response.status); // ❌ 可能是 undefined
});
```

**✅ 正确：**
```javascript
axios.get('/api/users').catch(error => {
  if (error.response) {
    console.log(error.response.status);
  } else if (error.request) {
    console.log('网络错误');
  } else {
    console.log('配置错误');
  }
});
```

### 3. 请求取消
**❌ 错误：** 多次使用同一个 AbortController
```javascript
const controller = new AbortController();

axios.get('/api/users', { signal: controller.signal });
axios.get('/api/posts', { signal: controller.signal });

controller.abort(); // ❌ 会取消两个请求
```

**✅ 正确：**
```javascript
const controller1 = new AbortController();
const controller2 = new AbortController();

axios.get('/api/users', { signal: controller1.signal });
axios.get('/api/posts', { signal: controller2.signal });

controller1.abort(); // 只取消用户请求
```

### 4. 配置优先级
**❌ 误解：** 以为实例配置会覆盖全局配置
```javascript
axios.defaults.timeout = 10000;

const instance = axios.create({ timeout: 5000 });

// ✅ 实际生效的是 5000（实例配置优先级更高）
```

### 5. POST 请求参数
**❌ 错误：** 混淆 `params` 和 `data`
```javascript
// ❌ params 会拼接到 URL，不是请求体
axios.post('/api/users', { params: { name: 'John' } });
```

**✅ 正确：**
```javascript
// data 才是请求体
axios.post('/api/users', { name: 'John' });

// params 用于 URL 参数
axios.post('/api/users', { name: 'John' }, {
  params: { version: 'v2' }
});
// 请求：POST /api/users?version=v2
```

### 6. 响应数据结构
**❌ 错误：** 直接返回 `response`
```javascript
axios.interceptors.response.use(response => {
  return response; // ❌ 业务代码需要 response.data.data
});
```

**✅ 正确：**
```javascript
axios.interceptors.response.use(response => {
  return response.data; // 或 response.data.data
});
```

### 7. 文件上传
**❌ 错误：** 忘记设置 `Content-Type`
```javascript
const formData = new FormData();
formData.append('file', file);

axios.post('/api/upload', formData);
// ❌ Content-Type 可能不正确
```

**✅ 正确：**
```javascript
axios.post('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

---

## 🔗 扩展阅读

### 相关概念
- **XMLHttpRequest** - Axios 在浏览器中的底层实现
- **Promise** - Axios 的异步基础
- **HTTP 协议** - 理解请求/响应结构
- **CORS** - 跨域资源共享
- **Web Security** - XSS、XSRF 攻击与防护

### 进阶方向
1. **Axios 源码阅读** - 深入理解拦截器链、适配器模式
2. **HTTP/2 & HTTP/3** - 新协议的特性与优化
3. **GraphQL Client** - Apollo Client 与 Axios 的对比
4. **Service Worker** - 离线缓存与请求拦截
5. **WebSocket** - 实时通信替代方案

### 官方资源
- 📖 [Axios 官方文档](https://axios-http.com/docs/intro)
- 💻 [Axios GitHub](https://github.com/axios/axios)
- 📝 [Axios 更新日志](https://github.com/axios/axios/blob/master/CHANGELOG.md)

---

## 🎯 学习路径建议

**初级（1-2 周）**
1. 掌握基础 GET/POST 请求
2. 理解配置项（baseURL、timeout、headers）
3. 学会错误处理

**中级（2-3 周）**
1. 熟练使用拦截器
2. 实现 Token 认证
3. 处理文件上传/下载
4. 请求取消与防抖

**高级（1 个月+）**
1. 企业级封装
2. 性能优化（缓存、并发控制、重试）
3. SSR 适配
4. 阅读源码

---

## ✅ 面试准备清单

**必须掌握（⭐⭐⭐）**
- [ ] Axios 基本使用和配置
- [ ] 拦截器的作用和实现
- [ ] 错误处理的三种类型
- [ ] 请求取消（AbortController）
- [ ] 与 Fetch 的区别

**重点掌握（⭐⭐）**
- [ ] Token 自动刷新机制
- [ ] 请求去重实现
- [ ] 文件上传/下载
- [ ] XSRF 防护原理
- [ ] 并发请求控制

**了解即可（⭐）**
- [ ] Axios 源码架构
- [ ] 自定义 Adapter
- [ ] SSR 适配方案
- [ ] 性能优化技巧

---

## 🎤 模拟面试（综合题）

**面试官：设计一个企业级的 Axios 封装方案，需要包含认证、错误处理、重试、日志等功能。**

<details>
<summary>参考答案</summary>

```javascript
// api/request.js
import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';

// 创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
});

// ========== 请求拦截器 ==========
service.interceptors.request.use(
  config => {
    // 1. 添加 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 2. 请求日志
    console.log(`[${config.method.toUpperCase()}] ${config.url}`);
    
    // 3. 添加时间戳（防缓存）
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    
    // 4. 记录请求开始时间
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  error => Promise.reject(error)
);

// ========== 响应拦截器 ==========
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

service.interceptors.response.use(
  response => {
    // 响应日志
    const duration = Date.now() - response.config.metadata.startTime;
    console.log(`[响应] ${response.config.url} (${duration}ms)`);
    
    // 统一业务处理
    const { code, data, message } = response.data;
    if (code === 200) {
      return data;
    }
    
    Message.error(message || '请求失败');
    return Promise.reject(new Error(message));
  },
  async error => {
    const { config, response } = error;
    
    // Token 自动刷新
    if (response?.status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers.Authorization = `Bearer ${token}`;
          return service(config);
        });
      }
      
      config._retry = true;
      isRefreshing = true;
      
      try {
        const { data } = await axios.post('/api/refresh-token');
        const newToken = data.token;
        localStorage.setItem('token', newToken);
        
        service.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        
        return service(config);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        router.push('/login');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    // 统一错误提示
    const errorMap = {
      400: '请求参数错误',
      403: '无权限访问',
      404: '请求资源不存在',
      500: '服务器错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    };
    
    const message = response?.data?.message || 
                   errorMap[response?.status] || 
                   '请求失败';
    
    Message.error(message);
    
    return Promise.reject(error);
  }
);

// ========== 请求重试 ==========
service.interceptors.response.use(null, async error => {
  const config = error.config;
  
  if (config?.retry && config.__retryCount < config.retry) {
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;
    
    const delay = Math.pow(2, config.__retryCount - 1) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return service(config);
  }
  
  return Promise.reject(error);
});

export default service;
```

**答题要点：**
1. 创建独立实例，配置 baseURL 和 timeout
2. 请求拦截器：添加 Token、日志、时间戳
3. 响应拦截器：统一错误处理、Token 刷新
4. 请求重试：指数退避策略
5. 日志记录：包含耗时统计
</details>

---

这份文档涵盖了 **Axios 的所有核心知识点和 60+ 道面试题**，从基础使用到高级特性，从原理解析到实战应用，帮助你全面掌握 Axios 并应对各类面试场景！

**建议学习顺序：**
1. 先通读"核心概念速览"
2. 深入学习"深度解析"中的每个章节
3. 重点掌握拦截器、错误处理、请求取消
4. 练习面试题（尤其是⭐⭐⭐标记的）
5. 参考"实战最佳实践"进行项目封装
6. 查看"易错点"避免常见陷阱

