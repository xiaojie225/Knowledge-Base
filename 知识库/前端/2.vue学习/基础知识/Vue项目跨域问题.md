# Vue项目跨域问题 - 精华学习资料

## 日常学习模式

### [标签: 跨域基础概念]

**核心定义**
跨域是浏览器基于同源策略的安全限制。同源要求：协议、域名、端口三者完全相同。

**关键理解**
- 跨域是浏览器行为，服务器实际已返回数据
- 浏览器阻止JavaScript获取跨域响应
- 服务器间通信不受同源策略限制

**同源判断示例**
```javascript
/**
 * 判断两个URL是否同源
 * @param {string} url1 - 第一个URL
 * @param {string} url2 - 第二个URL
 * @returns {boolean} 是否同源
 */
function isSameOrigin(url1, url2) {
  const parseUrl = (url) => {
    const a = document.createElement('a');
    a.href = url;
    return {
      protocol: a.protocol,
      hostname: a.hostname,
      port: a.port
    };
  };

  const o1 = parseUrl(url1);
  const o2 = parseUrl(url2);

  return o1.protocol === o2.protocol && 
         o1.hostname === o2.hostname && 
         o1.port === o2.port;
}

// 同源：true
isSameOrigin('https://example.com:8080', 'https://example.com:8080');
// 协议不同：false
isSameOrigin('https://example.com', 'http://example.com');
// 域名不同：false
isSameOrigin('https://example.com', 'https://api.example.com');
// 端口不同：false
isSameOrigin('https://example.com:8080', 'https://example.com:3000');
```

---

### [标签: Vue开发环境代理 Proxy]

**适用场景**
开发环境下，前端(localhost:8080)访问后端(localhost:3000)

**核心原理**
webpack-dev-server作为中间层，将浏览器请求转发到目标服务器，绕过同源策略。

**配置示例**
```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 后端地址
        changeOrigin: true,               // 修改请求头中的host
        pathRewrite: {
          '^/api': ''                     // 移除/api前缀
        }
      }
    }
  }
});
```

**请求流程**
```javascript
// 前端代码
axios.get('/api/users')

// 实际流程：
// 1. 浏览器请求: http://localhost:8080/api/users (同源)
// 2. dev-server转发: http://localhost:3000/users
// 3. 返回响应给浏览器
```

**完整Vue3组件示例**
```vue
<template>
  <div class="container">
    <button @click="fetchData" :disabled="loading">
      {{ loading ? '加载中...' : '获取数据' }}
    </button>
    <div v-if="error" class="error">{{ error }}</div>
    <pre v-if="result">{{ result }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',  // 使用代理前缀
  timeout: 5000
});

const loading = ref(false);
const error = ref(null);
const result = ref(null);

/**
 * 获取数据
 */
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get('/data');
    result.value = response.data;
  } catch (err) {
    error.value = `请求失败: ${err.message}`;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.error { color: red; margin-top: 10px; }
pre { 
  background: #f5f5f5; 
  padding: 15px; 
  border-radius: 4px; 
}
</style>
```

---

### [标签: 生产环境CORS解决方案]

**适用场景**
生产环境，前端(www.example.com)访问API(api.example.com)

**核心原理**
服务器设置HTTP响应头，告诉浏览器允许跨域访问。

**后端配置(Koa示例)**
```javascript
const Koa = require('koa');
const app = new Koa();

/**
 * CORS中间件
 */
app.use(async (ctx, next) => {
  // 指定允许的源(不要使用*)
  ctx.set('Access-Control-Allow-Origin', 'https://www.example.com');

  // 允许携带凭证(cookies)
  ctx.set('Access-Control-Allow-Credentials', 'true');

  // 允许的请求方法
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // 允许的请求头
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 预检请求缓存时间(24小时)
  ctx.set('Access-Control-Max-Age', '86400');

  // 处理预检请求
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }

  await next();
});

app.listen(3000);
```

**前端配置**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true  // 携带cookies
});

// 发送请求
api.get('/user')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

---

### [标签: 简单请求vs预检请求]

**简单请求条件**
- 请求方法: GET、HEAD、POST
- Content-Type: application/x-www-form-urlencoded、multipart/form-data、text/plain
- 无自定义请求头

**简单请求流程**
```javascript
// 直接发送请求，无预检
fetch('http://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
```

**非简单请求(需预检)**
```javascript
// 先发送OPTIONS预检请求
fetch('http://api.example.com/data', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  },
  body: JSON.stringify({ data: 'value' })
});

// 预检请求流程：
// 1. 浏览器发送OPTIONS请求询问权限
// 2. 服务器返回允许的方法和头
// 3. 浏览器发送实际请求
```

---

### [标签: Nginx反向代理方案]

**适用场景**
生产环境，统一入口，前端和API部署在同一域名下。

**核心原理**
Nginx作为反向代理，将/api开头的请求转发到后端服务器。

**配置示例**
```nginx
server {
    listen 80;
    server_name example.com;
  
    # 前端静态资源
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
  
    # API代理
    location /api {
        proxy_pass http://backend-server:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**请求流程**
```
用户 → https://example.com/api/users
     ↓
Nginx → http://backend-server:3000/api/users
     ↓
返回 → 用户
```

---

### [标签: 环境隔离配置方案]

**目标**
开发环境用代理，生产环境用CORS或Nginx。

**环境变量配置**
```bash
# .env.development
VUE_APP_API_BASE_URL=/api

# .env.production
VUE_APP_API_BASE_URL=https://api.example.com
```

**axios实例配置**
```javascript
import axios from 'axios';

/**
 * 创建axios实例
 */
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 5000,
  withCredentials: true
});

/**
 * 请求拦截器 - 添加token
 */
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * 响应拦截器 - 处理错误
 */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // token过期处理
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### [标签: 文件上传跨域处理]

**核心要点**
- 使用FormData封装文件
- Content-Type自动设置为multipart/form-data
- 监听上传进度

**完整示例**
```vue
<template>
  <div class="upload-container">
    <input type="file" ref="fileInput" @change="handleFileChange" multiple>
    <button @click="uploadFiles" :disabled="isUploading">
      {{ isUploading ? `上传中 ${uploadProgress}%` : '开始上传' }}
    </button>
    <div v-if="uploadProgress > 0" class="progress-bar">
      <div class="progress" :style="{ width: uploadProgress + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const fileInput = ref(null);
const files = ref([]);
const isUploading = ref(false);
const uploadProgress = ref(0);

const uploadApi = axios.create({
  baseURL: '/api',
  timeout: 60000,  // 文件上传超时时间更长
  withCredentials: true
});

/**
 * 处理文件选择
 */
const handleFileChange = (e) => {
  files.value = Array.from(e.target.files);
};

/**
 * 上传文件
 */
const uploadFiles = async () => {
  if (files.value.length === 0) return;

  isUploading.value = true;
  uploadProgress.value = 0;

  const formData = new FormData();
  files.value.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await uploadApi.post('/upload', formData, {
      headers: {
        // FormData会自动设置Content-Type
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      }
    });
  
    console.log('上传成功:', response.data);
    files.value = [];
  } catch (error) {
    console.error('上传失败:', error);
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
.progress-bar {
  height: 20px;
  background: #f3f3f3;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}
.progress {
  height: 100%;
  background: #42b983;
  transition: width 0.3s;
}
</style>
```

---

### [标签: WebSocket跨域连接]

**核心要点**
- WebSocket不受同源策略严格限制
- 需要在连接URL中传递认证信息
- 处理连接、断开、重连逻辑

**完整示例**
```vue
<template>
  <div class="websocket-container">
    <button @click="connect" :disabled="isConnected">连接</button>
    <button @click="disconnect" :disabled="!isConnected">断开</button>
  
    <input 
      v-model="messageToSend" 
      @keyup.enter="sendMessage"
      :disabled="!isConnected"
      placeholder="输入消息"
    >
    <button @click="sendMessage" :disabled="!isConnected">发送</button>
  
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="msg.type">
        {{ msg.timestamp.toLocaleTimeString() }} - {{ msg.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const socket = ref(null);
const isConnected = ref(false);
const messages = ref([]);
const messageToSend = ref('');

/**
 * 获取WebSocket URL
 */
const getWebSocketUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'ws://localhost:8080/ws';
  }
  return 'wss://api.example.com/ws';
};

/**
 * 连接WebSocket
 */
const connect = async () => {
  const token = localStorage.getItem('token');
  const url = `${getWebSocketUrl()}?token=${encodeURIComponent(token)}`;

  socket.value = new WebSocket(url);

  socket.value.onopen = () => {
    isConnected.value = true;
    addMessage('系统', '连接成功', 'system');
  };

  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    addMessage('服务器', data.content, 'received');
  };

  socket.value.onclose = () => {
    isConnected.value = false;
    addMessage('系统', '连接断开', 'system');
  };

  socket.value.onerror = (error) => {
    console.error('WebSocket错误:', error);
  };
};

/**
 * 断开连接
 */
const disconnect = () => {
  if (socket.value) {
    socket.value.close();
    socket.value = null;
  }
};

/**
 * 发送消息
 */
const sendMessage = () => {
  if (!socket.value || !messageToSend.value.trim()) return;

  socket.value.send(JSON.stringify({
    type: 'message',
    content: messageToSend.value
  }));

  addMessage('我', messageToSend.value, 'sent');
  messageToSend.value = '';
};

/**
 * 添加消息到列表
 */
const addMessage = (sender, content, type) => {
  messages.value.push({
    sender,
    content,
    type,
    timestamp: new Date()
  });
};
</script>

<style scoped>
.messages { 
  max-height: 400px; 
  overflow-y: auto; 
  border: 1px solid #ddd; 
  padding: 10px; 
}
.received { background: #e8f5e9; }
.sent { background: #e3f2fd; text-align: right; }
.system { background: #fff8e1; font-style: italic; }
</style>
```

---

### [标签: 多API统一管理方案]

**目标**
项目中对接多个API，统一管理配置和请求。

**配置文件**
```javascript
// src/config/api.js

/**
 * API配置
 */
export const apiConfigs = {
  // 默认业务API
  default: {
    baseURL: process.env.NODE_ENV === 'development' 
      ? '/api' 
      : 'https://api.example.com',
    timeout: 10000,
    withCredentials: true
  },

  // 认证服务
  auth: {
    baseURL: process.env.NODE_ENV === 'development' 
      ? '/auth' 
      : 'https://auth.example.com',
    timeout: 8000,
    withCredentials: true
  },

  // 第三方支付API
  payment: {
    baseURL: process.env.NODE_ENV === 'development' 
      ? '/payment' 
      : 'https://api.payment.com',
    timeout: 20000,
    headers: {
      'X-API-Key': process.env.VUE_APP_PAYMENT_KEY
    }
  }
};

/**
 * 开发环境代理配置
 */
export const proxyConfigs = {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  },
  '/auth': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/auth': '' }
  },
  '/payment': {
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/payment': '' }
  }
};
```

**HTTP管理器**
```javascript
// src/utils/http.js
import axios from 'axios';
import { apiConfigs } from '@/config/api';

/**
 * HTTP管理器类
 */
class HttpManager {
  constructor() {
    this.instances = {};
    this.init();
  }

  /**
   * 初始化所有API实例
   */
  init() {
    Object.keys(apiConfigs).forEach(key => {
      this.createInstance(key, apiConfigs[key]);
    });
  }

  /**
   * 创建单个axios实例
   */
  createInstance(apiName, config) {
    const instance = axios.create(config);
  
    // 请求拦截器
    instance.interceptors.request.use(
      config => {
        // 为需要认证的API添加token
        if (apiName === 'default' || apiName === 'auth') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      error => Promise.reject(error)
    );
  
    // 响应拦截器
    instance.interceptors.response.use(
      response => response.data,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  
    this.instances[apiName] = instance;
  }

  /**
   * 获取指定API实例
   */
  get(apiName = 'default') {
    if (!this.instances[apiName]) {
      throw new Error(`API "${apiName}" not found`);
    }
    return this.instances[apiName];
  }
}

export const httpManager = new HttpManager();
```

**使用示例**
```vue
<script setup>
import { ref, onMounted } from 'vue';
import { httpManager } from '@/utils/http';

const userData = ref(null);
const paymentResult = ref(null);

onMounted(async () => {
  // 调用默认API
  userData.value = await httpManager.get('default').get('/users/1');

  // 调用支付API
  paymentResult.value = await httpManager.get('payment').post('/charge', {
    amount: 100
  });
});
</script>
```

---

## 面试突击模式

### Vue跨域问题 面试速记

#### 30秒电梯演讲
跨域是浏览器同源策略导致的安全限制。开发环境用webpack-dev-server代理，生产环境用CORS或Nginx反向代理。关键是理解：跨域是浏览器行为，服务器已返回数据，只是浏览器阻止JS获取。

---

#### 高频考点(必背)

**考点1: 什么是跨域？同源策略是什么？**
跨域是指协议、域名、端口任一不同导致的浏览器安全限制。同源策略要求这三者完全相同才能正常交互。跨域发生在浏览器端，服务器实际已返回数据，但浏览器阻止JavaScript获取响应内容。

**考点2: Vue开发环境如何解决跨域？**
使用vue.config.js配置devServer.proxy，通过webpack-dev-server作为中间代理转发请求。浏览器请求同源的dev-server，dev-server再转发到目标服务器，绕过浏览器同源策略。

**考点3: 生产环境跨域解决方案有哪些？**
两种主流方案：1) CORS - 后端设置Access-Control-Allow-Origin等响应头允许跨域；2) Nginx反向代理 - 前端和API部署在同域下，Nginx将/api请求转发到后端服务器。

**考点4: 简单请求和预检请求的区别？**
简单请求：GET/HEAD/POST且Content-Type为特定值，浏览器直接发送。预检请求：使用PUT/DELETE或自定义头时，浏览器先发OPTIONS请求询问权限，服务器允许后再发送实际请求。

**考点5: CORS的credentials模式是什么？**
控制是否在跨域请求中携带凭证(cookies等)。前端设置withCredentials:true，后端需同时设置Access-Control-Allow-Credentials:true和明确的Allow-Origin(不能用*)。

---

#### 经典面试题

**技术知识题**

**题目1: 请解释跨域的产生原因并手写同源判断函数**

**思路**: 
- 理解同源策略的三要素
- 使用DOM API解析URL
- 比较协议、域名、端口

**答案**:
跨域是浏览器基于安全考虑实施的同源策略限制。同源要求协议、域名、端口完全相同。这个策略防止恶意网站窃取其他网站的数据。

**代码框架**:
```javascript
/**
 * 判断两个URL是否同源
 * @param {string} url1 - 第一个URL
 * @param {string} url2 - 第二个URL
 * @returns {boolean} 是否同源
 */
function isSameOrigin(url1, url2) {
  // 创建临时a标签解析URL
  const parseUrl = (url) => {
    const a = document.createElement('a');
    a.href = url;
    return {
      protocol: a.protocol,  // 协议 http: 或 https:
      hostname: a.hostname,  // 域名
      port: a.port          // 端口
    };
  };

  const o1 = parseUrl(url1);
  const o2 = parseUrl(url2);

  // 三要素全部相同才是同源
  return o1.protocol === o2.protocol && 
         o1.hostname === o2.hostname && 
         o1.port === o2.port;
}

// 测试
console.log(isSameOrigin(
  'https://example.com:8080', 
  'https://example.com:8080'
)); // true

console.log(isSameOrigin(
  'http://example.com', 
  'https://example.com'
)); // false - 协议不同

console.log(isSameOrigin(
  'https://example.com', 
  'https://api.example.com'
)); // false - 域名不同
```

---

**题目2: 在vue.config.js中配置开发环境代理，支持多个后端服务**

**思路**:
- 理解proxy配置结构
- 不同路径前缀对应不同后端
- 配置pathRewrite去除前缀

**答案**:
开发环境代理通过webpack-dev-server实现，可以配置多个代理规则，将不同路径的请求转发到不同的后端服务。

**代码框架**:
```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    port: 8080,
    proxy: {
      // 业务API代理
      '/api': {
        target: 'http://localhost:3000',  // 业务API服务器
        changeOrigin: true,               // 修改请求头host
        pathRewrite: {
          '^/api': ''                     // 去除/api前缀
        }
      },
    
      // 认证服务代理
      '/auth': {
        target: 'http://localhost:3001',  // 认证服务器
        changeOrigin: true,
        pathRewrite: {
          '^/auth': ''
        }
      },
    
      // WebSocket代理
      '/ws': {
        target: 'ws://localhost:3002',
        changeOrigin: true,
        ws: true,  // 启用WebSocket代理
        pathRewrite: {
          '^/ws': ''
        }
      }
    }
  }
});

/**
 * 使用示例
 */
// 前端请求
axios.get('/api/users')
// → 实际请求: http://localhost:3000/users

axios.post('/auth/login', data)
// → 实际请求: http://localhost:3001/login
```

---

