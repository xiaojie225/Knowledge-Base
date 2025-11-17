我将对这个API封装工具进行详细分析并创建完整的开发文档。
```text/markdown
# API 封装工具开发文档

## 概述

这是一个基于 Axios 的 HTTP 请求封装工具，提供了统一的 API 调用接口、错误处理、重试机制、认证管理等功能。适用于前端项目中所有的 HTTP 请求场景。

## 完整代码

``` javascript
import axios from 'axios';

// API配置常量
const API_CONFIG = {
    BASE_URL: 'https://api.yourgame.com',
    TIMEOUT: 10000, // 10秒超时
    RETRY_COUNT: 3, // 重试次数
    RETRY_DELAY: 1000, // 重试延迟
    // 新增配置项
    MAX_CONCURRENT_REQUESTS: 5, // 最大并发请求数
    CACHE_DURATION: 5 * 60 * 1000, // 缓存持续时间 5分钟
    DEBOUNCE_DELAY: 300, // 防抖延迟
};

// 请求缓存Map
const requestCache = new Map();
// 请求计数器
let activeRequests = 0;
// 请求队列
const requestQueue = [];

// 创建axios实例
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 添加认证token（如果存在）
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
      
        // 添加请求ID用于追踪
        config.requestId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
        // 添加时间戳防止缓存
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now()
            };
        }
      
        // 添加设备信息
        config.headers['X-Device-Info'] = JSON.stringify({
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
        });
      
        console.log(`�� API请求 [${config.method?.toUpperCase()}] ${config.url}`, {
            requestId: config.requestId,
            data: config.data,
            params: config.params
        });
      
        return config;
    },
    (error) => {
        console.error('❌ 请求拦截器错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API响应成功 [${response.status}] ${response.config.url}`, {
            requestId: response.config.requestId,
            data: response.data,
            duration: Date.now() - parseInt(response.config.requestId.split('_')[0])
        });
      
        // 统一处理响应数据格式
        if (response.data && typeof response.data === 'object') {
            return response.data;
        }
      
        return response;
    },
    (error) => {
        const { config, response } = error;
      
        console.error(`❌ API响应错误 [${response?.status || 'Network'}] ${config?.url}`, {
            requestId: config?.requestId,
            message: error.message,
            data: response?.data,
            status: response?.status
        });
      
        // 统一错误处理
        const errorInfo = {
            success: false,
            message: '请求失败',
            status: response?.status,
            data: response?.data,
            requestId: config?.requestId
        };
      
        // 根据状态码处理不同错误
        switch (response?.status) {
            case 400:
                errorInfo.message = response.data?.message || '请求参数错误';
                break;
            case 401:
                errorInfo.message = '认证失败，请重新登录';
                localStorage.removeItem('authToken');
                // 触发全局登录事件
                window.dispatchEvent(new CustomEvent('auth-expired'));
                break;
            case 403:
                errorInfo.message = '没有权限访问';
                break;
            case 404:
                errorInfo.message = '请求的资源不存在';
                break;
            case 422:
                errorInfo.message = response.data?.message || '数据验证失败';
                break;
            case 429:
                errorInfo.message = '请求过于频繁，请稍后再试';
                break;
            case 500:
                errorInfo.message = '服务器内部错误';
                break;
            case 502:
            case 503:
            case 504:
                errorInfo.message = '服务器暂时无法访问，请稍后再试';
                break;
            default:
                if (!response) {
                    errorInfo.message = '网络连接失败，请检查网络';
                } else {
                    errorInfo.message = response.data?.message || '未知错误';
                }
        }
      
        return Promise.reject(errorInfo);
    }
);

// 并发控制函数
const controlConcurrency = async (requestFunc) => {
    return new Promise((resolve, reject) => {
        const executeRequest = async () => {
            activeRequests++;
            try {
                const result = await requestFunc();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                activeRequests--;
                // 处理队列中的下一个请求
                if (requestQueue.length > 0) {
                    const nextRequest = requestQueue.shift();
                    nextRequest();
                }
            }
        };

        if (activeRequests < API_CONFIG.MAX_CONCURRENT_REQUESTS) {
            executeRequest();
        } else {
            requestQueue.push(executeRequest);
        }
    });
};

// 缓存管理
const getCacheKey = (url, params = {}, data = {}) => {
    return JSON.stringify({ url, params, data });
};

const getFromCache = (cacheKey) => {
    const cached = requestCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < API_CONFIG.CACHE_DURATION) {
        console.log('�� 从缓存获取数据:', cacheKey);
        return cached.data;
    }
    return null;
};

const setToCache = (cacheKey, data) => {
    requestCache.set(cacheKey, {
        data,
        timestamp: Date.now()
    });
};

// 防抖函数
const debounceMap = new Map();
const debounce = (key, func, delay = API_CONFIG.DEBOUNCE_DELAY) => {
    return new Promise((resolve, reject) => {
        // 清除之前的定时器
        if (debounceMap.has(key)) {
            clearTimeout(debounceMap.get(key));
        }
      
        // 设置新的定时器
        const timeoutId = setTimeout(async () => {
            try {
                const result = await func();
                resolve(result);
            } catch (error) {
                reject(error);
            }
            debounceMap.delete(key);
        }, delay);
      
        debounceMap.set(key, timeoutId);
    });
};

// 带重试机制的请求函数
const requestWithRetry = async (requestFunc, retryCount = API_CONFIG.RETRY_COUNT) => {
    for (let i = 0; i < retryCount; i++) {
        try {
            return await controlConcurrency(requestFunc);
        } catch (error) {
            console.warn(`⚠️ 请求失败，第${i + 1}次重试:`, error.message);
          
            // 最后一次重试失败，抛出错误
            if (i === retryCount - 1) {
                throw error;
            }
          
            // 某些错误不需要重试（如401、400等）
            if (error.status && error.status >= 400 && error.status < 500) {
                throw error;
            }
          
            // 等待一段时间后重试（递增延迟）
            await new Promise(resolve => 
                setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1))
            );
        }
    }
};

// 封装的请求方法
const api = {
    // GET请求（支持缓存）
    get: (url, params = {}, config = {}) => {
        const cacheKey = getCacheKey(url, params);
      
        // 检查缓存
        if (config.useCache !== false) {
            const cached = getFromCache(cacheKey);
            if (cached) {
                return Promise.resolve(cached);
            }
        }
      
        const requestFunc = async () => {
            const response = await apiClient.get(url, { params, ...config });
            // 缓存GET请求结果
            if (config.useCache !== false) {
                setToCache(cacheKey, response);
            }
            return response;
        };
      
        // 支持防抖
        if (config.debounce) {
            const debounceKey = `GET_${url}_${JSON.stringify(params)}`;
            return debounce(debounceKey, () => requestWithRetry(requestFunc));
        }
      
        return requestWithRetry(requestFunc);
    },
  
    // POST请求
    post: (url, data = {}, config = {}) => {
        const requestFunc = () => apiClient.post(url, data, config);
      
        // 支持防抖
        if (config.debounce) {
            const debounceKey = `POST_${url}_${JSON.stringify(data)}`;
            return debounce(debounceKey, () => requestWithRetry(requestFunc));
        }
      
        return requestWithRetry(requestFunc);
    },
  
    // PUT请求
    put: (url, data = {}, config = {}) => {
        return requestWithRetry(() => apiClient.put(url, data, config));
    },
  
    // DELETE请求
    delete: (url, config = {}) => {
        return requestWithRetry(() => apiClient.delete(url, config));
    },
  
    // PATCH请求
    patch: (url, data = {}, config = {}) => {
        return requestWithRetry(() => apiClient.patch(url, data, config));
    },
  
    // 文件上传
    upload: (url, formData, config = {}) => {
        const uploadConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
            // 上传进度回调
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`上传进度: ${percentCompleted}%`);
                if (config.onUploadProgress) {
                    config.onUploadProgress(percentCompleted, progressEvent);
                }
            }
        };
      
        return requestWithRetry(() => apiClient.post(url, formData, uploadConfig));
    },
  
    // 并发请求
    all: (requests) => {
        return Promise.all(requests);
    },
  
    // 竞态请求（返回最快的结果）
    race: (requests) => {
        return Promise.race(requests);
    },
  
    // 批量请求
    batch: async (requests, batchSize = 3) => {
        const results = [];
        for (let i = 0; i < requests.length; i += batchSize) {
            const batch = requests.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch);
            results.push(...batchResults);
        }
        return results;
    },
  
    // 不重试的请求（用于某些特殊场景）
    directRequest: {
        get: (url, params = {}, config = {}) => controlConcurrency(() => apiClient.get(url, { params, ...config })),
        post: (url, data = {}, config = {}) => controlConcurrency(() => apiClient.post(url, data, config)),
        put: (url, data = {}, config = {}) => controlConcurrency(() => apiClient.put(url, data, config)),
        delete: (url, config = {}) => controlConcurrency(() => apiClient.delete(url, config)),
    }
};

// 设置认证token的工具函数
const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('authToken', token);
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        console.log('�� 设置认证token成功');
    } else {
        localStorage.removeItem('authToken');
        delete apiClient.defaults.headers.Authorization;
        console.log('�� 清除认证token');
    }
};

// 获取当前认证token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// 检查token是否存在
const isAuthenticated = () => {
    return !!getAuthToken();
};

// 清除所有缓存
const clearCache = () => {
    requestCache.clear();
    console.log('��️ 清除所有请求缓存');
};

// 获取请求统计信息
const getRequestStats = () => {
    return {
        activeRequests,
        queueLength: requestQueue.length,
        cacheSize: requestCache.size,
    };
};

// 健康检查
const healthCheck = async () => {
    try {
        const response = await api.directRequest.get('/health');
        return { status: 'healthy', response };
    } catch (error) {
        return { status: 'unhealthy', error };
    }
};

// 导出API相关功能
export {
    api,
    apiClient,
    API_CONFIG,
    setAuthToken,
    getAuthToken,
    isAuthenticated,
    requestWithRetry,
    clearCache,
    getRequestStats,
    healthCheck
};

export default api;
```

## 学习知识点

### 1. Axios 基础配置
- **实例创建**: 使用 `axios.create()` 创建独立实例
- **默认配置**: 设置 baseURL、timeout、headers
- **拦截器**: 请求和响应拦截器的使用

### 2. 拦截器模式
```javascript
// 请求拦截器 - 在请求发送前执行
apiClient.interceptors.request.use(successHandler, errorHandler);

// 响应拦截器 - 在响应返回后执行
apiClient.interceptors.response.use(successHandler, errorHandler);
```

### 3. 错误处理策略
- **状态码分类处理**: 4xx 客户端错误，5xx 服务器错误
- **网络错误处理**: 超时、断网等情况
- **业务错误处理**: 根据响应数据判断业务逻辑错误

### 4. 重试机制
```javascript
// 指数退避重试
await new Promise(resolve => 
    setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1))
);
```

### 5. 并发控制
- **并发限制**: 限制同时发送的请求数量
- **请求队列**: 超出限制的请求进入队列等待

### 6. 缓存策略
- **内存缓存**: 使用 Map 存储请求结果
- **缓存过期**: 基于时间戳的缓存失效机制
- **缓存键生成**: 基于 URL、参数、数据生成唯一键

### 7. 防抖技术
```javascript
// 防止重复请求
const debounce = (key, func, delay) => { /* ... */ };
```

### 8. 认证管理
- **Token 存储**: localStorage 持久化
- **自动添加认证头**: 拦截器自动添加 Authorization
- **认证失效处理**: 401 状态码自动清除过期 token

## 用途说明

### 1. 项目中的使用场景
- **登录认证系统**: 用户登录、注册、token 管理
- **数据获取**: 列表查询、详情获取、搜索功能
- **数据提交**: 表单提交、文件上传、数据更新
- **错误处理**: 统一错误提示、重试机制
- **性能优化**: 请求缓存、防抖、并发控制

### 2. 具体应用位置
```javascript
// 在组件中使用
import api from '@/utils/api';

// 获取用户列表
const users = await api.get('/users', { page: 1, size: 10 });

// 创建用户
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });

// 上传头像
const avatar = await api.upload('/upload/avatar', formData, {
    onUploadProgress: (progress) => setUploadProgress(progress)
});
```

### 3. 在不同框架中的集成
- **Vue.js**: 通过 provide/inject 或 Vuex 集成
- **React**: 通过 Context API 或自定义 hooks 集成
- **Angular**: 通过依赖注入服务集成

## 使用示例

### 基础用法
```javascript
// GET 请求
const userData = await api.get('/user/profile');

// POST 请求
const result = await api.post('/user/update', {
    name: 'John Doe',
    email: 'john@example.com'
});
```

### 高级用法
```javascript
// 带缓存的请求
const cachedData = await api.get('/expensive-data', {}, { useCache: true });

// 防抖请求
const searchResults = await api.get('/search', { keyword: 'test' }, { debounce: true });

// 并发请求
const [users, orders, products] = await api.all([
    api.get('/users'),
    api.get('/orders'),
    api.get('/products')
]);
```

### 认证管理
```javascript
// 设置认证token
setAuthToken('your-jwt-token');

// 检查认证状态
if (isAuthenticated()) {
    // 执行需要认证的操作
}

// 清除认证
setAuthToken(null);
```

## 面试考察题目

### 基础知识题目（10题）

**1. 解释 Axios 拦截器的工作原理和执行顺序**

*答案*: Axios 拦截器分为请求拦截器和响应拦截器。执行顺序为：
- 请求拦截器：后添加的先执行（类似栈结构）
- 响应拦截器：先添加的先执行（类似队列结构）

```javascript
// 执行顺序示例
axios.interceptors.request.use(config1); // 第二个执行
axios.interceptors.request.use(config2); // 第一个执行

axios.interceptors.response.use(response1); // 第一个执行
axios.interceptors.response.use(response2); // 第二个执行
```

**2. 如何实现请求重试机制？需要注意哪些问题？**

*答案*: 重试机制需要考虑：
- 重试次数限制
- 指数退避延迟
- 错误类型判断（4xx 错误通常不重试）
- 幂等性检查

```javascript
const requestWithRetry = async (requestFunc, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFunc();
        } catch (error) {
            if (i === maxRetries - 1 || error.status < 500) {
                throw error;
            }
            await new Promise(resolve => 
                setTimeout(resolve, 1000 * Math.pow(2, i))
            );
        }
    }
};
```

**3. 解释 HTTP 状态码 401、403、422 的区别和处理方式**

*答案*:
- **401 Unauthorized**: 未认证，需要重新登录
- **403 Forbidden**: 已认证但无权限访问
- **422 Unprocessable Entity**: 请求格式正确但语义错误

```javascript
switch (response.status) {
    case 401:
        // 清除token，跳转登录页
        localStorage.removeItem('authToken');
        router.push('/login');
        break;
    case 403:
        // 显示权限不足提示
        showMessage('权限不足');
        break;
    case 422:
        // 显示表单验证错误
        handleValidationErrors(response.data.errors);
        break;
}
```

**4. 什么是并发控制？为什么需要限制并发请求数？**

*答案*: 并发控制是限制同时发送的请求数量。原因：
- 避免浏览器连接限制
- 防止服务器过载
- 提高用户体验

```javascript
class ConcurrencyController {
    constructor(maxConcurrent = 6) {
        this.maxConcurrent = maxConcurrent;
        this.active = 0;
        this.queue = [];
    }
  
    async add(requestFunc) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFunc, resolve, reject });
            this.process();
        });
    }
  
    async process() {
        if (this.active >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }
      
        const { requestFunc, resolve, reject } = this.queue.shift();
        this.active++;
      
        try {
            const result = await requestFunc();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.active--;
            this.process();
        }
    }
}
```

**5. 如何实现请求缓存？需要考虑哪些因素？**

*答案*: 请求缓存需要考虑：
- 缓存键生成策略
- 缓存过期时间
- 缓存失效条件
- 内存占用控制

```javascript
class RequestCache {
    constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }
  
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
      
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
      
        return item.data;
    }
  
    set(key, data) {
        // LRU 清理
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
      
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}
```

**6. 防抖在 API 请求中的作用和实现原理**

*答案*: 防抖用于防止短时间内重复发送相同请求，特别是在搜索、自动保存等场景。

```javascript
class RequestDebouncer {
    constructor(delay = 300) {
        this.delay = delay;
        this.timers = new Map();
    }
  
    debounce(key, requestFunc) {
        return new Promise((resolve, reject) => {
            // 清除之前的定时器
            if (this.timers.has(key)) {
                clearTimeout(this.timers.get(key));
            }
          
            // 设置新的定时器
            const timerId = setTimeout(async () => {
                try {
                    const result = await requestFunc();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
                this.timers.delete(key);
            }, this.delay);
          
            this.timers.set(key, timerId);
        });
    }
}
```

**7. FormData 和普通 JSON 数据提交的区别**

*答案*:
- **FormData**: 用于文件上传和表单数据，Content-Type 为 multipart/form-data
- **JSON**: 用于结构化数据，Content-Type 为 application/json

```javascript
// FormData 示例
const formData = new FormData();
formData.append('file', file);
formData.append('name', 'John');

await api.upload('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// JSON 示例
await api.post('/user', {
    name: 'John',
    email: 'john@example.com'
}, {
    headers: { 'Content-Type': 'application/json' }
});
```

**8. 如何处理文件上传进度？**

*答案*: 使用 Axios 的 onUploadProgress 回调：

```javascript
const uploadFile = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
  
    return await api.upload('/upload', formData, {
        onUploadProgress: (progressEvent) => {
            const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
        }
    });
};

// 使用示例
uploadFile(file, (progress) => {
    setUploadProgress(progress);
    if (progress === 100) {
        setUploadStatus('上传完成');
    }
});
```

**9. 什么是请求取消？如何实现？**

*答案*: 请求取消用于中止正在进行的请求，避免资源浪费：

```javascript
class RequestCanceller {
    constructor() {
        this.cancelTokens = new Map();
    }
  
    createCancelToken(key) {
        // 取消之前的请求
        if (this.cancelTokens.has(key)) {
            this.cancelTokens.get(key).cancel('Request cancelled');
        }
      
        const source = axios.CancelToken.source();
        this.cancelTokens.set(key, source);
        return source.token;
    }
  
    cancel(key, message = 'Request cancelled') {
        if (this.cancelTokens.has(key)) {
            this.cancelTokens.get(key).cancel(message);
            this.cancelTokens.delete(key);
        }
    }
}

// 使用示例
const canceller = new RequestCanceller();

const searchUsers = async (keyword) => {
    const cancelToken = canceller.createCancelToken('search');
  
    try {
        return await api.get('/search', { keyword }, { cancelToken });
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('请求已取消');
        } else {
            throw error;
        }
    }
};
```

**10. 如何实现 API 的健康检查和熔断机制？**

*答案*: 健康检查监控 API 状态，熔断机制在故障时临时停止请求：

```javascript
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000) {
        this.threshold = threshold;
        this.timeout = timeout;
        this.failures = 0;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.nextAttempt = Date.now();
    }
  
    async call(requestFunc) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttempt) {
                throw new Error('Circuit breaker is OPEN');
            }
            this.state = 'HALF_OPEN';
        }
      
        try {
            const result = await requestFunc();
            this.reset();
            return result;
        } catch (error) {
            this.recordFailure();
            throw error;
        }
    }
  
    recordFailure() {
        this.failures++;
        if (this.failures >= this.threshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.timeout;
        }
    }
  
    reset() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
}
```

### 业务逻辑题目（10题）

继续完成业务逻辑题目：

**1. 实现一个购物车商品数量更新的防抖 API 调用**

*答案*:
```javascript
class CartManager {
    constructor() {
        this.updateTimers = new Map();
        this.pendingUpdates = new Map();
    }
  
    async updateQuantity(itemId, quantity, delay = 500) {
        const key = `cart_${itemId}`;
      
        // 清除之前的定时器
        if (this.updateTimers.has(key)) {
            clearTimeout(this.updateTimers.get(key));
        }
      
        // 立即更新 UI
        this.updateUIQuantity(itemId, quantity);
      
        // 记录待更新数据
        this.pendingUpdates.set(itemId, quantity);
      
        // 延迟同步到服务器
        const timer = setTimeout(async () => {
            try {
                await api.post('/cart/update', {
                    itemId,
                    quantity: this.pendingUpdates.get(itemId)
                }, { debounce: false });
              
                this.pendingUpdates.delete(itemId);
                console.log(`商品 ${itemId} 数量已同步到服务器`);
            } catch (error) {
                // 同步失败，恢复之前的数量
                this.handleUpdateError(itemId, error);
            }
            this.updateTimers.delete(key);
        }, delay);
      
        this.updateTimers.set(key, timer);
    }
  
    updateUIQuantity(itemId, quantity) {
        const element = document.querySelector(`[data-item-id="${itemId}"] .quantity`);
        if (element) {
            element.textContent = quantity;
        }
    }
  
    handleUpdateError(itemId, error) {
        console.error('购物车更新失败:', error);
        // 可以显示错误提示，或者恢复之前的状态
        showNotification('购物车更新失败，请重试');
    }
}

// 使用示例
const cartManager = new CartManager();
cartManager.updateQuantity('item123', 5);
```

**2. 设计一个支持重试的订单支付接口调用**

*答案*:
```javascript
class PaymentService {
    constructor() {
        this.paymentRetryConfig = {
            maxRetries: 3,
            retryDelay: 2000,
            retryableErrors: [408, 429, 500, 502, 503, 504]
        };
    }
  
    async processPayment(orderData) {
        const { orderId, amount, paymentMethod } = orderData;
      
        return await this.retryPayment(async () => {
            // 创建支付请求
            const paymentRequest = {
                orderId,
                amount,
                paymentMethod,
                timestamp: Date.now(),
                nonce: this.generateNonce()
            };
          
            const response = await api.post('/payment/process', paymentRequest);
          
            // 验证支付结果
            if (response.status === 'pending') {
                // 轮询支付状态
                return await this.pollPaymentStatus(response.transactionId);
            }
          
            return response;
        });
    }
  
    async retryPayment(paymentFunc) {
        let lastError;
      
        for (let i = 0; i <= this.paymentRetryConfig.maxRetries; i++) {
            try {
                return await paymentFunc();
            } catch (error) {
                lastError = error;
              
                // 最后一次尝试失败
                if (i === this.paymentRetryConfig.maxRetries) {
                    throw new Error(`支付失败: ${error.message}`);
                }
              
                // 检查是否为可重试错误
                if (!this.isRetryableError(error)) {
                    throw error;
                }
              
                // 等待后重试
                await this.delay(this.paymentRetryConfig.retryDelay * (i + 1));
                console.log(`支付重试 ${i + 1}/${this.paymentRetryConfig.maxRetries}`);
            }
        }
    }
  
    async pollPaymentStatus(transactionId, maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            await this.delay(3000); // 等待3秒
          
            const status = await api.get(`/payment/status/${transactionId}`);
          
            if (status.state === 'completed') {
                return status;
            } else if (status.state === 'failed') {
                throw new Error(`支付失败: ${status.message}`);
            }
        }
      
        throw new Error('支付超时，请联系客服');
    }
  
    isRetryableError(error) {
        return this.paymentRetryConfig.retryableErrors.includes(error.status);
    }
  
    generateNonce() {
        return Date.now().toString() + Math.random().toString(36).substr(2);
    }
  
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

**3. 实现用户搜索的智能缓存和防抖功能**

*答案*:
```javascript
class SmartSearchService {
    constructor() {
        this.searchCache = new Map();
        this.searchHistory = new Set();
        this.popularSearches = new Map();
        this.debounceTimer = null;
        this.currentRequest = null;
    }
  
    async search(keyword, options = {}) {
        const {
            debounceDelay = 300,
            useCache = true,
            saveToHistory = true
        } = options;
      
        // 防抖处理
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
      
        return new Promise((resolve, reject) => {
            this.debounceTimer = setTimeout(async () => {
                try {
                    // 取消之前的请求
                    if (this.currentRequest) {
                        this.currentRequest.cancel('New search initiated');
                    }
                  
                    // 检查缓存
                    const cacheKey = this.generateCacheKey(keyword);
                    if (useCache && this.searchCache.has(cacheKey)) {
                        const cached = this.searchCache.get(cacheKey);
                        if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
                            resolve(cached.data);
                            return;
                        }
                    }
                  
                    // 创建可取消的请求
                    const source = axios.CancelToken.source();
                    this.currentRequest = source;
                  
                    // 发起搜索请求
                    const searchData = await api.get('/search', {
                        q: keyword,
                        timestamp: Date.now()
                    }, {
                        cancelToken: source.token
                    });
                  
                    // 缓存结果
                    if (useCache) {
                        this.cacheSearchResult(cacheKey, searchData);
                    }
                  
                    // 保存搜索历史
                    if (saveToHistory && keyword.trim()) {
                        this.addToHistory(keyword);
                        this.updatePopularSearches(keyword);
                    }
                  
                    resolve(searchData);
                } catch (error) {
                    if (!axios.isCancel(error)) {
                        reject(error);
                    }
                } finally {
                    this.currentRequest = null;
                }
            }, debounceDelay);
        });
    }
  
    generateCacheKey(keyword) {
        return `search_${keyword.toLowerCase().trim()}`;
    }
  
    cacheSearchResult(key, data) {
        // 限制缓存大小
        if (this.searchCache.size >= 50) {
            const firstKey = this.searchCache.keys().next().value;
            this.searchCache.delete(firstKey);
        }
      
        this.searchCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
  
    addToHistory(keyword) {
        this.searchHistory.add(keyword);
      
        // 限制历史记录数量
        if (this.searchHistory.size > 20) {
            const firstItem = this.searchHistory.values().next().value;
            this.searchHistory.delete(firstItem);
        }
      
        // 保存到本地存储
        localStorage.setItem('searchHistory', 
            JSON.stringify([...this.searchHistory])
        );
    }
  
    updatePopularSearches(keyword) {
        const count = this.popularSearches.get(keyword) || 0;
        this.popularSearches.set(keyword, count + 1);
    }
  
    getSearchSuggestions(partial) {
        const suggestions = [...this.searchHistory]
            .filter(term => term.toLowerCase().includes(partial.toLowerCase()))
            .slice(0, 5);
          
        return suggestions;
    }
  
    clearCache() {
        this.searchCache.clear();
    }
  
    clearHistory() {
        this.searchHistory.clear();
        localStorage.removeItem('searchHistory');
    }
}
```

**4. 实现文件批量上传的进度管理和错误恢复**

*答案*:
```javascript
class BatchUploadManager {
    constructor(options = {}) {
        this.options = {
            maxConcurrent: 3,
            chunkSize: 1024 * 1024, // 1MB chunks
            maxRetries: 3,
            ...options
        };
      
        this.uploadQueue = [];
        this.activeUploads = new Map();
        this.uploadResults = new Map();
        this.totalProgress = 0;
    }
  
    async uploadFiles(files, onProgress, onComplete) {
        const uploadTasks = files.map(file => ({
            id: this.generateFileId(file),
            file,
            status: 'pending',
            progress: 0,
            retries: 0,
            chunks: this.createChunks(file)
        }));
      
        this.uploadQueue.push(...uploadTasks);
        this.processUploadQueue(onProgress, onComplete);
      
        return uploadTasks.map(task => task.id);
    }
  
    async processUploadQueue(onProgress, onComplete) {
        while (this.uploadQueue.length > 0 || this.activeUploads.size > 0) {
            // 启动新的上传任务
            while (this.activeUploads.size < this.options.maxConcurrent && this.uploadQueue.length > 0) {
                const task = this.uploadQueue.shift();
                this.startUpload(task, onProgress);
            }
          
            // 等待一个任务完成
            if (this.activeUploads.size > 0) {
                await Promise.race([...this.activeUploads.values()]);
            }
        }
      
        if (onComplete) {
            onComplete(this.getUploadSummary());
        }
    }
  
    async startUpload(task, onProgress) {
        this.activeUploads.set(task.id, this.uploadFile(task, onProgress));
      
        try {
            const result = await this.activeUploads.get(task.id);
            this.uploadResults.set(task.id, { success: true, data: result });
        } catch (error) {
            this.uploadResults.set(task.id, { success: false, error });
          
            // 重试逻辑
            if (task.retries < this.options.maxRetries) {
                task.retries++;
                task.status = 'pending';
                this.uploadQueue.push(task);
                console.log(`文件 ${task.file.name} 上传失败，准备重试 ${task.retries}/${this.options.maxRetries}`);
            }
        } finally {
            this.activeUploads.delete(task.id);
        }
    }
  
    async uploadFile(task, onProgress) {
        task.status = 'uploading';
      
        // 分片上传
        const uploadPromises = task.chunks.map(async (chunk, index) => {
            const formData = new FormData();
            formData.append('file', chunk.blob);
            formData.append('fileName', task.file.name);
            formData.append('chunkIndex', index);
            formData.append('totalChunks', task.chunks.length);
            formData.append('fileId', task.id);
          
            return await api.upload('/upload/chunk', formData, {
                onUploadProgress: (progressEvent) => {
                    chunk.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    this.updateTaskProgress(task, onProgress);
                }
            });
        });
      
        // 等待所有分片上传完成
        const chunkResults = await Promise.all(uploadPromises);
      
        // 合并文件
        const mergeResult = await api.post('/upload/merge', {
            fileId: task.id,
            fileName: task.file.name,
            totalChunks: task.chunks.length,
            chunkResults
        });
      
        task.status = 'completed';
        task.progress = 100;
        this.updateTaskProgress(task, onProgress);
      
        return mergeResult;
    }
  
    createChunks(file) {
        const chunks = [];
        const chunkCount = Math.ceil(file.size / this.options.chunkSize);
      
        for (let i = 0; i < chunkCount; i++) {
            const start = i * this.options.chunkSize;
            const end = Math.min(start + this.options.chunkSize, file.size);
          
            chunks.push({
                index: i,
                blob: file.slice(start, end),
                progress: 0
            });
        }
      
        return chunks;
    }
  
    updateTaskProgress(task, onProgress) {
        // 计算任务进度
        const chunksProgress = task.chunks.reduce((sum, chunk) => sum + chunk.progress, 0);
        task.progress = Math.round(chunksProgress / task.chunks.length);
      
        // 计算总体进度
        this.calculateTotalProgress();
      
        if (onProgress) {
            onProgress({
                taskId: task.id,
                fileName: task.file.name,
                taskProgress: task.progress,
                totalProgress: this.totalProgress,
                status: task.status
            });
        }
    }
  
    calculateTotalProgress() {
        const allTasks = [...this.activeUploads.keys(), ...this.uploadResults.keys()];
        if (allTasks.length === 0) return;
      
        let totalProgress = 0;
        allTasks.forEach(taskId => {
            const result = this.uploadResults.get(taskId);
            if (result) {
                totalProgress += result.success ? 100 : 0;
            } else {
                // 活动任务的进度需要从activeUploads中获取
                // 这里简化处理，实际实现需要更详细的进度跟踪
                totalProgress += 50; // 假设正在上传的任务完成了50%
            }
        });
      
        this.totalProgress = Math.round(totalProgress / allTasks.length);
    }
  
    generateFileId(file) {
        return `${Date.now()}_${file.name}_${file.size}`.replace(/[^a-zA-Z0-9_]/g, '_');
    }
  
    getUploadSummary() {
        const summary = {
            total: this.uploadResults.size,
            successful: 0,
            failed: 0,
            results: []
        };
      
        this.uploadResults.forEach((result, taskId) => {
            if (result.success) {
                summary.successful++;
            } else {
                summary.failed++;
            }
            summary.results.push({ taskId, ...result });
        });
      
        return summary;
    }
  
    pauseUpload(taskId) {
        // 实现上传暂停逻辑
        if (this.activeUploads.has(taskId)) {
            // 取消当前上传请求
            // 保存已上传的分片信息
        }
    }
  
    resumeUpload(taskId) {
        // 实现上传恢复逻辑
        // 从已上传的分片继续
    }
}
```

**5. 设计一个用户会话管理系统**

*答案*:
```javascript
class SessionManager {
    constructor() {
        this.sessionCheckInterval = 5 * 60 * 1000; // 5分钟检查一次
        this.refreshThreshold = 10 * 60 * 1000; // token过期前10分钟刷新
        this.sessionTimer = null;
        this.refreshPromise = null;
      
        this.startSessionMonitoring();
        this.setupEventListeners();
    }
  
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
          
            if (response.success) {
                const { token, refreshToken, expiresIn, user } = response.data;
              
                // 存储认证信息
                this.setSession({
                    token,
                    refreshToken,
                    expiresAt: Date.now() + (expiresIn * 1000),
                    user
                });
              
                // 设置API认证头
                setAuthToken(token);
              
                // 开始会话监控
                this.startSessionMonitoring();
              
                // 触发登录成功事件
                this.dispatchEvent('session:login', user);
              
                return { success: true, user };
            }
        } catch (error) {
            console.error('登录失败:', error);
            return { success: false, error: error.message };
        }
    }
  
    async logout() {
        try {
            // 通知服务器登出
            if (this.isAuthenticated()) {
                await api.post('/auth/logout');
            }
        } catch (error) {
            console.error('登出请求失败:', error);
        } finally {
            this.clearSession();
            this.dispatchEvent('session:logout');
        }
    }
  
    async refreshSession() {
        // 防止并发刷新
        if (this.refreshPromise) {
            return this.refreshPromise;
        }
      
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            this.logout();
            return false;
        }
      
        this.refreshPromise = this.performTokenRefresh(refreshToken);
      
        try {
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.refreshPromise = null;
        }
    }
  
    async performTokenRefresh(refreshToken) {
        try {
            const response = await api.post('/auth/refresh', { refreshToken });
          
            if (response.success) {
                const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
              
                // 更新会话信息
                const currentSession = this.getSession();
                this.setSession({
                    ...currentSession,
                    token,
                    refreshToken: newRefreshToken,
                    expiresAt: Date.now() + (expiresIn * 1000)
                });
              
                // 更新API认证头
                setAuthToken(token);
              
                console.log('会话已刷新');
                this.dispatchEvent('session:refreshed');
              
                return true;
            }
        } catch (error) {
            console.error('刷新token失败:', error);
            this.logout();
            return false;
        }
    }
  
    startSessionMonitoring() {
        this.stopSessionMonitoring();
      
        this.sessionTimer = setInterval(() => {
            this.checkSessionStatus();
        }, this.sessionCheckInterval);
    }
  
    stopSessionMonitoring() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
    }
  
    checkSessionStatus() {
        if (!this.isAuthenticated()) {
            this.stopSessionMonitoring();
            return;
        }
      
        const session = this.getSession();
        const now = Date.now();
        const timeUntilExpiry = session.expiresAt - now;
      
        // token即将过期，刷新会话
        if (timeUntilExpiry < this.refreshThreshold) {
            console.log('会话即将过期，正在刷新...');
            this.refreshSession();
        }
      
        // 检查用户活跃度
        this.checkUserActivity();
    }
  
    checkUserActivity() {
        const lastActivity = localStorage.getItem('lastActivity');
        const inactiveTime = Date.now() - (lastActivity ? parseInt(lastActivity) : 0);
      
        // 30分钟无活动自动登出
        if (inactiveTime > 30 * 60 * 1000) {
            console.log('用户长时间无活动，自动登出');
            this.logout();
        }
    }
  
    updateActivity() {
        localStorage.setItem('lastActivity', Date.now().toString());
    }
  
    setupEventListeners() {
        // 监听用户活动
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => this.updateActivity(), true);
        });
      
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkSessionStatus();
            }
        });
      
        // 监听存储变化（多标签页同步）
        window.addEventListener('storage', (e) => {
            if (e.key === 'authSession') {
                if (!e.newValue) {
                    // 其他标签页登出了
                    this.handleRemoteLogout();
                } else {
                    // 其他标签页更新了会话
                    this.syncSessionFromStorage();
                }
            }
        });
      
        // 监听认证过期事件
        window.addEventListener('auth-expired', () => {
            this.logout();
        });
    }
  
    setSession(sessionData) {
        localStorage.setItem('authSession', JSON.stringify(sessionData));
    }
  
    getSession() {
        const session = localStorage.getItem('authSession');
        return session ? JSON.parse(session) : null;
    }
  
    clearSession() {
        localStorage.removeItem('authSession');
        localStorage.removeItem('lastActivity');
        setAuthToken(null);
        this.stopSessionMonitoring();
    }
  
    isAuthenticated() {
        const session = this.getSession();
        return session && session.token && Date.now() < session.expiresAt;
    }
  
    getUser() {
        const session = this.getSession();
        return session ? session.user : null;
    }
  
    getRefreshToken() {
        const session = this.getSession();
        return session ? session.refreshToken : null;
    }
  
    syncSessionFromStorage() {
        const session = this.getSession();
        if (session && session.token) {
            setAuthToken(session.token);
        }
    }
  
    handleRemoteLogout() {
        this.clearSession();
        this.dispatchEvent('session:remote-logout');
    }
  
    dispatchEvent(eventName, data = null) {
        window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
}

// 使用示例
const sessionManager = new SessionManager();

// 监听会话事件
window.addEventListener('session:login', (e) => {
    console.log('用户已登录:', e.detail);
    // 跳转到主页或更新UI
});

window.addEventListener('session:logout', () => {
    console.log('用户已登出');
    // 跳转到登录页
    window.location.href = '/login';
});

window.addEventListener('session:remote-logout', () => {
    console.log('其他标签页已登出');
    // 显示提示信息
});
```

### 快速使用指南

当你忘记如何使用这个API封装工具时，以下是快速上手指南：
```text/markdown
# API封装工具快速使用指南

## 1. 安装和基本设置

```bash
npm install axios
```

```javascript
// 在你的项目中引入
import api, { setAuthToken, isAuthenticated } from './utils/api.js';
```

## 2. 基础用法

### GET 请求
```javascript
// 简单GET请求
const users = await api.get('/users');

// 带参数的GET请求
const filteredUsers = await api.get('/users', {
    page: 1,
    size: 10,
    status: 'active'
});

// 带缓存的GET请求
const cachedData = await api.get('/expensive-data', {}, { useCache: true });
```

### POST 请求
```javascript
// 创建用户
const newUser = await api.post('/users', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});

// 防抖POST请求
const result = await api.post('/search', { keyword: 'test' }, { debounce: true });
```

### 文件上传
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('description', '头像上传');

const uploadResult = await api.upload('/upload/avatar', formData, {
    onUploadProgress: (progress) => {
        console.log(`上传进度: ${progress}%`);
        setUploadProgress(progress);
    }
});
```

## 3. 认证管理

```javascript
// 登录后设置token
const loginResponse = await api.post('/auth/login', { username, password });
if (loginResponse.success) {
    setAuthToken(loginResponse.data.token);
}

// 检查认证状态
if (isAuthenticated()) {
    // 执行需要认证的操作
    const profile = await api.get('/user/profile');
}

// 登出时清除token
setAuthToken(null);
```

## 4. 错误处理

```javascript
try {
    const data = await api.get('/sensitive-data');
    console.log('获取数据成功:', data);
} catch (error) {
    console.error('请求失败:', error.message);
  
    // 根据错误状态码处理
    switch (error.status) {
        case 401:
            // 未认证，跳转到登录页
            redirectToLogin();
            break;
        case 403:
            // 无权限
            showErrorMessage('权限不足');
            break;
        case 429:
            // 请求过于频繁
            showErrorMessage('请求过于频繁，请稍后再试');
            break;
        default:
            showErrorMessage(error.message || '请求失败');
    }
}
```

## 5. 高级功能

### 并发请求
```javascript
// 同时发送多个请求
const [users, orders, products] = await api.all([
    api.get('/users'),
    api.get('/orders'),
    api.get('/products')
]);

// 批量请求（分批处理）
const requests = Array.from({length: 50}, (_, i) => 
    () => api.get(`/item/${i}`)
);
const results = await api.batch(requests, 5); // 每批5个请求
```

### 请求统计
```javascript
import { getRequestStats, clearCache } from './utils/api.js';

// 获取当前请求统计
const stats = getRequestStats();
console.log('活跃请求数:', stats.activeRequests);
console.log('队列长度:', stats.queueLength);
console.log('缓存大小:', stats.cacheSize);

// 清除缓存
clearCache();
```

## 6. 在不同框架中的集成

### Vue.js 集成
```javascript
// main.js
import { createApp } from 'vue';
import api from './utils/api.js';

const app = createApp(App);
app.config.globalProperties.$api = api;

// 组件中使用
export default {
    async created() {
        try {
            this.users = await this.$api.get('/users');
        } catch (error) {
            this.$message.error(error.message);
        }
    }
}
```

### React 集成
```javascript
// hooks/useApi.js
import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data, config) => {
        setLoading(true);
        setError(null);
      
        try {
            const response = await api[method](url, data, config);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { request, loading, error };
};

// 组件中使用
function UserList() {
    const { request, loading, error } = useApi();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await request('get', '/users');
                setUsers(data);
            } catch (error) {
                console.error('获取用户失败:', error);
            }
        };

        fetchUsers();
    }, [request]);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error.message}</div>;

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li