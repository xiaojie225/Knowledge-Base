
# Axios 完整知识体系

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
  // 作用：自定义哪些 HTTP 状态码算"成功"。
  
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




