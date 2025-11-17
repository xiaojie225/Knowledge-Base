
# Vue项目跨域问题解决开发文档

## 一、知识点总结

### 1. 跨域是什么
跨域是指浏览器基于同源策略的一种安全限制。同源策略要求协议、主机、端口都相同，否则就会产生跨域问题。跨域是浏览器的限制，实际上服务器已经返回了数据，但浏览器阻止了前端JavaScript获取这些数据。

### 2. 解决跨域的方法
在Vue项目中，常见的跨域解决方案有：

1. **JSONP**：利用script标签没有跨域限制的特性，但只支持GET请求
2. **CORS**：通过设置HTTP响应头告诉浏览器允许跨域
3. **Proxy**：通过代理服务器转发请求，绕过浏览器的同源策略

在Vue项目中，我们主要使用CORS和Proxy两种方案。

## 二、完整代码示例

### 1. Vue3中的CORS解决方案（后端代码）

```javascript
// Koa后端服务器示例
const Koa = require('koa');
const app = new Koa();

// CORS中间件
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080'); // 设置允许的前端域名，而非*
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  // 处理预检请求
  if (ctx.method === 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

// 业务路由
app.use(async (ctx) => {
  if (ctx.path === '/api/data') {
    ctx.body = {
      code: 200,
      message: '获取数据成功',
      data: { name: 'Vue3跨域示例', time: new Date().toISOString() }
    };
  }
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
```

### 2. Vue3中的Proxy解决方案（前端代码）

#### vue.config.js 配置

```javascript
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务器地址
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '' // 重写路径，去掉/api前缀
        }
      }
    }
  }
});
```

#### Vue3 请求示例

```vue
<template>
  <div class="container">
    <h1>Vue3 跨域示例</h1>
    <button @click="fetchData">获取数据</button>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="result" class="result">
      <h3>获取到的数据：</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 使用代理前缀
  timeout: 5000
});

export default {
  name: 'CrossOriginDemo',
  setup() {
    const loading = ref(false);
    const error = ref(null);
    const result = ref(null);

    const fetchData = async () => {
      loading.value = true;
      error.value = null;
    
      try {
        // 使用代理请求
        const response = await api.get('/data');
        result.value = response.data;
      } catch (err) {
        console.error('请求失败:', err);
        error.value = `请求失败: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      result,
      fetchData
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.error {
  color: red;
  margin-top: 10px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>
```

### 3. 使用Nginx代理解决方案

```nginx
server {
    listen    80;
    server_name yourdomain.com;
  
    location / {
        root  /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
  
    location /api {
        proxy_pass  http://backend-server:3000;
        proxy_redirect   off;
        proxy_set_header  Host       $host;
        proxy_set_header  X-Real-IP     $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```

## 三、学习知识

1. **同源策略**：浏览器的一种安全策略，限制从一个源加载的文档或脚本如何与另一个源的资源进行交互。

2. **CORS**：跨域资源共享，是一种机制，它使用额外的HTTP头来告诉浏览器让运行在一个origin上的Web应用被准许访问来自不同源服务器上的指定资源。

3. **代理服务器**：在客户端和服务器之间的服务器，接收客户端的请求，然后转发给服务器，再将服务器的响应转发给客户端。

4. **Vue CLI的devServer代理**：开发环境中通过webpack-dev-server提供的代理功能解决跨域问题。

## 四、用途

1. **开发环境**：在本地开发Vue项目时，通过vue.config.js配置代理，解决本地开发时的跨域问题。

2. **生产环境**：
   - 通过后端配置CORS响应头，允许特定前端域名访问API
   - 通过Nginx等反向代理服务器，将请求转发到后端服务

3. **微前端架构**：在不同子应用之间进行通信时，可能也需要处理跨域问题。

## 五、总结

在Vue项目中，跨域是常见的问题，主要有以下解决方案：

1. **开发环境**：使用vue.config.js中的devServer.proxy配置代理，简单高效。
2. **生产环境**：
   - 后端配置CORS响应头，最标准的解决方案
   - 使用Nginx等反向代理服务器，将/api开头的请求转发到后端服务

开发环境的代理配置是临时的，生产环境需要更加完善的跨域解决方案。

[标签: Vue 跨域解决方案] CORS 或 Proxy

---

# 面试问题与答案

## 10个技术问题

### 1. 什么是跨域？为什么会产生跨域问题？

**答案**：
跨域是指浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是浏览器对JavaScript实施的安全限制。

同源策略是指协议、域名、端口都相同。只要有一个不同，就会产生跨域问题。

```javascript
// 同源判断示例
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

console.log(isSameOrigin('https://example.com:8080', 'https://example.com:8080')); // true
console.log(isSameOrigin('https://example.com:8080', 'http://example.com:8080')); // false (协议不同)
console.log(isSameOrigin('https://example.com:8080', 'https://api.example.com:8080')); // false (域名不同)
console.log(isSameOrigin('https://example.com:8080', 'https://example.com:3030')); // false (端口不同)
```

### 2. 跨域是前端问题还是后端问题？为什么?

**答案**：
跨域本质上是浏览器的一种安全策略，是前端浏览器对JavaScript请求的限制。但解决跨域问题通常需要前后端配合：

- 前端可以通过JSONP、代理等方式绕过浏览器的同源策略限制
- 后端通过设置CORS相关HTTP响应头，告诉浏览器允许特定源的请求

```javascript
// 浏览器端错误示例
fetch('http://different-domain.com/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
// 这会触发CORS错误，浏览器会阻止获取响应
// 在控制台可以看到类似错误：
// Access to fetch at 'http://different-domain.com/api/data' from origin 'http://current-domain.com' has been blocked by CORS policy
```

### 3. 使用Vue CLI代理解决跨域的原理是什么？

**答案**：
Vue CLI代理的原理是利用webpack-dev-server创建一个本地开发服务器，该服务器接收前端请求，然后转发到目标服务器。因为浏览器的请求是发给本地服务器的（同源），而本地服务器到目标服务器的请求是服务器到服务器的请求（不受同源策略限制），从而解决了跨域问题。

```javascript
// vue.config.js示例
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://backend-server.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};

// 工作流程：
// 1. 前端发送请求：axios.get('/api/users')
// 2. 请求实际发送到：http://localhost:8080/api/users (本地服务，同源)
// 3. webpack-dev-server接收到请求，匹配到/api前缀，将请求转发到：
//    http://backend-server.com/users
// 4. 获取响应后，返回给前端
```

### 4. CORS中，简单请求和非简单请求有什么区别？

**答案**：
简单请求和非简单请求在CORS处理上有很大区别：

**简单请求**满足以下条件：
- 请求方法为GET、HEAD或POST
- Content-Type为application/x-www-form-urlencoded、multipart/form-data或text/plain
- 请求中没有自定义请求头

简单请求不会发送预检请求(preflight)，浏览器直接发送请求。

**非简单请求**：
- 不满足简单请求的条件
- 会先发送一个OPTIONS方法的预检请求，询问服务器是否允许该实际请求
- 只有在服务器返回允许的响应后，才会发送实际请求

```javascript
// 简单请求示例
fetch('http://example.com/api', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// 非简单请求示例
fetch('http://example.com/api', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-custom-header': 'value'
  },
  body: JSON.stringify({ data: 'value' })
});
```

### 5. Vue3项目中如何配置axios，使其在不同环境下自动使用不同的baseURL？

**答案**：
在Vue3中，可以通过环境变量和axios实例来配置不同环境下的baseURL。

```javascript
// 创建环境变量文件
// .env.development
VUE_APP_API_BASE_URL=http://localhost:3000/api

// .env.production
VUE_APP_API_BASE_URL=https://api.example.com

// 创建axios实例
// src/utils/request.js
import axios from 'axios';

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // 根据环境变量自动切换
  timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送前做一些处理，如添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

export default service;
```

### 6. Nginx作为反向代理解决跨域的原理是什么？

**答案**：
Nginx作为反向代理解决跨域的原理是，浏览器的请求是发给Nginx服务器的（同源），然后Nginx将请求转发到后端API服务器。由于服务器之间的通信不受同源策略限制，这样就绕过了浏览器的跨域限制。

```nginx
server {
    listen    80;
    server_name frontend.com;
  
    # 前端静态资源
    location / {
        root  /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
  
    # API接口代理
    location /api {
        proxy_pass  http://backend-api-server.com;
        proxy_redirect   off;
      
        # 设置请求头，告诉后端服务器原始请求信息
        proxy_set_header  Host       $host;
        proxy_set_header  X-Real-IP     $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header  X-Forwarded-Proto $scheme;
    }
}
```

### 7. 在Vue项目中，如何同时适配开发环境和生产环境的跨域解决方案？

**答案**：
同时适配开发环境和生产环境的跨域解决方案可以通过环境变量和条件配置来实现。

```javascript
// vue.config.js
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        // 只在开发环境启用代理
        bypass: function (req, res, proxyOptions) {
          if (isProduction) {
            // 生产环境不使用代理
            return false;
          }
        }
      }
    }
  }
};

// 或者完全分离配置
// config/development.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};

// config/production.js
module.exports = {
  // 生产环境的配置，可能不需要代理，而是直接配置CORS
};
```

### 8. 为什么JSONP能解决跨域？它的局限性是什么？

**答案**：
JSONP能解决跨域是因为它利用了HTML标签（如`<script>`、`<img>`、`<iframe>`等）的src属性不受同源策略限制的特点。JSONP通过动态创建script标签，将回调函数名作为参数传递给服务器，服务器返回包含数据的JavaScript函数调用。

```javascript
// JSONP实现示例
function handleResponse(data) {
  console.log('Received data:', data);
}

function jsonpRequest(url, callback) {
  // 创建回调函数名
  const callbackName = `jsonpCallback_${Date.now()}`;

  // 将回调函数添加到window对象
  window[callbackName] = function(data) {
    try {
      callback(data);
    } finally {
      // 清理
      delete window[callbackName];
      document.body.removeChild(script);
    }
  };

  // 创建script标签
  const script = document.createElement('script');
  script.src = `${url}?callback=${callbackName}`;
  script.onerror = function() {
    console.error('JSONP request failed');
    delete window[callbackName];
    document.body.removeChild(script);
  };

  // 添加到文档并触发请求
  document.body.appendChild(script);
}

// 使用示例
jsonpRequest('http://example.com/api/data', handleResponse);
```

**JSONP的局限性**：
1. 只支持GET请求，不支持POST等其他HTTP方法
2. 安全性较差，容易受到XSS攻击
3. 错误处理比较困难，只能通过超时等方式判断失败
4. 服务器端需要支持JSONP格式的响应

### 9. 在Vue3中如何使用Proxy对象解决跨域？

**答案**：
在Vue3中，可以使用ES6的Proxy对象创建一个API客户端，它会在发送请求前判断是否需要代理，但需要注意的是，这里的Proxy对象和HTTP代理是不同的概念。

```javascript
import axios from 'axios';

// 创建API客户端代理
function createApiClient() {
  const apiClient = axios.create({
    baseURL: '/api', // 使用开发环境代理
    timeout: 5000
  });

  // 生产环境API客户端
  const prodApiClient = axios.create({
    baseURL: 'https://api.example.com', // 生产环境直接请求
    timeout: 5000
  });

  // 根据环境选择不同的客户端
  const isProduction = process.env.NODE_ENV === 'production';

  // 返回一个代理对象，根据环境选择不同的客户端
  return new Proxy({}, {
    get(target, prop) {
      const client = isProduction ? prodApiClient : apiClient;
      return client[prop];
    }
  });
}

// 使用
const api = createApiClient();

// 发送请求
api.get('/data').then(response => {
  console.log(response.data);
});
```

### 10. 解释一下CORS中的credentials（凭证）模式，以及如何在Vue项目中配置？

**答案**：
CORS中的credentials模式决定了浏览器是否会在跨域请求中包含凭证信息（如cookies、HTTP认证信息等）。它有三个可能的值：

1. `omit`：不发送凭证（默认值）
2. `same-origin`：仅在同源请求时发送凭证
3. `include`：在所有请求中都发送凭证

在Vue项目中配置credentials：

```javascript
// 创建axios实例时配置
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  withCredentials: true, // 对应credentials: include
  timeout: 5000
});

// 或者单个请求配置
api.post('/login', {
  username: 'user',
  password: 'pass'
}, {
  withCredentials: true // 仅对此请求启用凭证
});

// fetch方式
fetch('http://example.com/api/data', {
  method: 'GET',
  credentials: 'include', // 包含凭证
  headers: {
    'Content-Type': 'application/json'
  }
});

// 后端也需要配合设置
// Koa示例
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  ctx.set('Access-Control-Allow-Credentials', 'true'); // 允许凭证
  ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
  } else {
    await next();
  }
});
```

## 10个业务逻辑问题

### 1. 在一个单页面应用中，前端部署在`https://www.example.com`，API服务部署在`https://api.example.com`，如何解决跨域问题？

**答案**：
这种情况下，最佳的解决方案是使用CORS后端配置，因为这是生产环境，不适用开发环境的代理配置。

```javascript
// 后端Koa服务器配置
const Koa = require('koa');
const app = new Koa();

// CORS中间件
app.use(async (ctx, next) => {
  // 设置允许的源为前端域名，而不是*
  ctx.set('Access-Control-Allow-Origin', 'https://www.example.com');

  // 如果需要支持携带凭证（如 cookies）
  ctx.set('Access-Control-Allow-Credentials', 'true');

  // 允许的请求方法
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // 允许的请求头
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // 预检请求的缓存时间
  ctx.set('Access-Control-Max-Age', '86400'); // 24小时

  // 处理预检请求
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }

  await next();
});

// 业务路由
app.use(async (ctx) => {
  if (ctx.path === '/api/user') {
    ctx.body = { success: true, data: { id: 1, name: '用户1' } };
  }
});

app.listen(3000);
```

同时，前端设置请求时携带凭证：

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true // 如果需要携带cookies
});

// 发送请求
api.get('/api/user')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });
```

### 2. 在开发环境中，Vue前端运行在`http://localhost:8080`，后端API运行在`http://localhost:3000`，如何配置vue.config.js解决跨域问题？

**答案**：
在vue.config.js中配置devServer.proxy，将特定前缀的请求转发到后端服务器。

```javascript
// vue.config.js
const {defineConfig} = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {  // 所有以/api开头的请求都会被代理
        target: 'http://localhost:3000',  // 后端服务器地址
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api': ''  // 重写路径，去掉/api前缀
        },
        // 可以添加自定义代理行为
        onProxyReq: function (proxyReq, req, res) {
          // 可以在这里添加额外的请求头
          proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
        },
        onProxyRes: function (proxyRes, req, res) {
          // 可以在这里处理响应
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        },
        onError: function (err, req, res) {
          // 代理错误处理
          console.error('Proxy Error:', err);
          res.status(500).send('Proxy Error');
        }
      }
    }
  }
});
```

前端请求示例：

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // 使用代理前缀
  timeout: 5000
});

// 请求 /api/user 会被代理到 http://localhost:3000/user
api.get('/user')
  .then(response => {
    console.log(response.data);
  });
```

### 3. 在一个微前端架构中，主应用部署在`https://main.example.com`，子应用部署在`https://sub.example.com`，如何实现它们之间的跨域通信？

**答案**：
在微前端架构中，跨域通信是一个常见问题。可以使用以下几种方法：

1. **使用postMessage API**：

```javascript
// 主应用代码 (main.example.com)
const iframe = document.getElementById('sub-app-iframe');

// 向子应用发送消息
function sendToSubApp(message) {
  iframe.contentWindow.postMessage(message, 'https://sub.example.com');
}

// 接收子应用的消息
window.addEventListener('message', (event) => {
  // 验证消息来源
  if (event.origin === 'https://sub.example.com') {
    console.log('收到子应用消息:', event.data);
  }
});

// 子应用代码 (sub.example.com)
// 向主应用发送消息
window.parent.postMessage({
  type: 'SUB_APP_MESSAGE',
  data: { key: 'value' }
}, 'https://main.example.com');

// 接收主应用的消息
window.addEventListener('message', (event) => {
  if (event.origin === 'https://main.example.com') {
    console.log('收到主应用消息:', event.data);
  }
});
```

2. **使用CustomEvent**：

```javascript
// 主应用
const customEvent = new CustomEvent('sub-app-event', {
  detail: { data: '来自主应用的数据' }
});
window.dispatchEvent(customEvent);

// 子应用
window.addEventListener('sub-app-event', (event) => {
  console.log('子应用接收到事件:', event.detail);
});
```

3. **使用全局状态管理库**，如Redux、Vuex等，结合Proxy模式：

```javascript
// 创建一个可以跨域调用的代理
const createCrossDomainProxy = () => {
  return new Proxy({}, {
    get(target, prop) {
      return (...args) => {
        return new Promise((resolve, reject) => {
          const id = `cross-domain-request-${Date.now()}`;
        
          // 监听响应
          window.addEventListener('message', function handler(event) {
            if (event.origin !== 'https://main.example.com') return;
          
            if (event.data.type === 'cross-domain-response' && event.data.id === id) {
              window.removeEventListener('message', handler);
              if (event.data.error) {
                reject(new Error(event.data.error));
              } else {
                resolve(event.data.result);
              }
            }
          });
        
          // 发送请求
          window.parent.postMessage({
            type: 'cross-domain-request',
            id,
            method: prop,
            args
          }, 'https://main.example.com');
        });
      };
    }
  });
};

// 子应用中使用
const api = createCrossDomainProxy();
api.getUserData().then(data => {
  console.log('获取到数据:', data);
});
```

### 4. 如何在Vue3项目中实现一个认证流程，其中登录和API请求涉及跨域？

**答案**：
在Vue3项目中实现跨域认证流程需要考虑以下几点：
1. 登录请求携带凭证
2. 服务器返回令牌（token）或设置cookies
3. 后续API请求携带认证信息

```vue
<template>
  <div class="auth-container">
    <div v-if="!isAuthenticated">
      <h2>登录</h2>
      <form @submit.prevent="login">
        <div>
          <label>用户名:</label>
          <input v-model="username" type="text" required>
        </div>
        <div>
          <label>密码:</label>
          <input v-model="password" type="password" required>
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
    <div v-else>
      <h2>欢迎, {{ username }}</h2>
      <button @click="fetchProtectedData">获取受保护的数据</button>
      <button @click="logout">登出</button>
      <div v-if="protectedData">
        <h3>受保护的数据:</h3>
        <pre>{{ protectedData }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://api.example.com',
  withCredentials: true, // 携带cookies
  timeout: 5000
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器 - 处理token过期
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('authToken');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default {
  name: 'AuthFlow',
  setup() {
    const username = ref('');
    const password = ref('');
    const isAuthenticated = ref(false);
    const isLoading = ref(false);
    const error = ref(null);
    const protectedData = ref(null);

    const login = async () => {
      isLoading.value = true;
      error.value = null;
    
      try {
        // 发送登录请求
        const response = await api.post('/auth/login', {
          username: username.value,
          password: password.value
        });
      
        // 存储token
        const { token } = response.data;
        localStorage.setItem('authToken', token);
      
        isAuthenticated.value = true;
      } catch (err) {
        console.error('登录失败:', err);
        error.value = err.response?.data?.message || '登录失败，请检查用户名和密码';
      } finally {
        isLoading.value = false;
      }
    };

    const fetchProtectedData = async () => {
      isLoading.value = true;
      error.value = null;
    
      try {
        const response = await api.get('/protected/data');
        protectedData.value = response.data;
      } catch (err) {
        console.error('获取数据失败:', err);
        error.value = err.response?.data?.message || '获取数据失败';
      } finally {
        isLoading.value = false;
      }
    };

    const logout = () => {
      localStorage.removeItem('authToken');
      isAuthenticated.value = false;
      protectedData.value = null;
      username.value = '';
      password.value = '';
    };

    // 初始化时检查是否已经登录
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      isAuthenticated.value = !!token;
    };

    // 在组件挂载时检查认证状态
    checkAuth();

    return {
      username,
      password,
      isAuthenticated,
      isLoading,
      error,
      protectedData,
      login,
      fetchProtectedData,
      logout
    };
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

form div {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
```

### 5. 如何在Vue3项目中实现文件上传功能，并解决跨域问题？

**答案**：
在Vue3中实现跨域文件上传需要注意：
1. 请求的Content-Type设置
2. 文件数据格式处理
3. 服务器CORS配置

```vue
<template>
  <div class="file-upload-container">
    <h2>文件上传</h2>
  
    <div class="upload-area" 
         @dragover.prevent="dragOver = true" 
         @dragleave.prevent="dragOver = false"
         @drop.prevent="handleDrop"
         :class="{ 'drag-over': dragOver }">
      <p>拖放文件到此处，或</p>
      <input type="file" ref="fileInput" @change="handleFileChange" multiple>
      <button @click="$refs.fileInput.click()">选择文件</button>
    </div>
  
    <div v-if="files.length > 0" class="file-list">
      <h3>已选择文件:</h3>
      <ul>
        <li v-for="(file, index) in files" :key="index">
          {{ file.name }} ({{ formatFileSize(file.size) }})
          <button @click="removeFile(index)" class="remove-btn">×</button>
        </li>
      </ul>
    </div>
  
    <button @click="uploadFiles" :disabled="isUploading" class="upload-btn">
      {{ isUploading ? '上传中...' : '开始上传' }}
    </button>
  
    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-container">
      <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
      <span>{{ uploadProgress }}%</span>
    </div>
  
    <div v-if="uploadResults.length > 0" class="upload-results">
      <h3>上传结果:</h3>
      <ul>
        <li v-for="(result, index) in uploadResults" :key="index" :class="result.success ? 'success' : 'error'">
          {{ result.filename }}: {{ result.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

// 创建专用于文件上传的axios实例
const uploadApi = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://api.example.com',
  timeout: 60000, // 文件上传可能需要更长的超时时间
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 请求拦截器 - 添加认证token
uploadApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default {
  name: 'FileUpload',
  setup() {
    const fileInput = ref(null);
    const files = ref([]);
    const dragOver = ref(false);
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const uploadResults = ref([]);

    const handleDrop = (e) => {
      dragOver.value = false;
      addFiles(e.dataTransfer.files);
    };

    const handleFileChange = (e) => {
      addFiles(e.target.files);
    };

    const addFiles = (newFiles) => {
      Array.from(newFiles).forEach(file => {
        files.value.push(file);
      });
    };

    const removeFile = (index) => {
      files.value.splice(index, 1);
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const uploadFiles = async () => {
      if (files.value.length === 0) return;

      isUploading.value = true;
      uploadProgress.value = 0;
      uploadResults.value = [];

      // 创建FormData对象
      const formData = new FormData();
      files.value.forEach(file => {
        formData.append('files', file);
      });

      try {
        const response = await uploadApi.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // 重要：FormData会自动设置正确的Content-Type
          },
          onUploadProgress: (progressEvent) => {
            // 计算上传进度百分比
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        });

        // 处理上传结果
        if (response.data && response.data.results) {
          uploadResults.value = response.data.results;
        } else {
          uploadResults.value = [{
            filename: '所有文件',
            success: true,
            message: '上传成功'
          }];
        }

        // 清空已上传的文件
        files.value = [];
      } catch (error) {
        console.error('上传失败:', error);
      
        // 处理错误结果
        const errorMessage = error.response?.data?.message || error.message || '上传失败';
        uploadResults.value = files.value.map(file => ({
          filename: file.name,
          success: false,
          message: errorMessage
        }));
      } finally {
        isUploading.value = false;
      }
    };

    return {
      fileInput,
      files,
      dragOver,
      isUploading,
      uploadProgress,
      uploadResults,
      handleDrop,
      handleFileChange,
      removeFile,
      formatFileSize,
      uploadFiles
    };
  }
};
</script>

<style scoped>
.file-upload-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.upload-area.drag-over {
  border-color: #42b983;
  background-color: #f0fff4;
}

input[type="file"] {
  display: none;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.file-list ul {
  list-style-type: none;
  padding: 0;
  margin: 15px 0;
}

.file-list li {
  padding: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-btn {
  background-color: #ff5252;
  padding: 2px 8px;
  margin: 0;
}

.upload-btn {
  background-color: #1565c0;
  font-weight: bold;
}

.progress-container {
  margin-top: 20px;
  height: 20px;
  background-color: #f3f3f3;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s;
}

.progress-container span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  line-height: 20px;
  color: white;
  font-size: 12px;
}

.upload-results ul {
  list-style-type: none;
  padding: 0;
  margin: 15px 0;
}

.upload-results li {
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.upload-results li.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.upload-results li.error {
  background-color: #ffebee;
  color: #c62828;
}
</style>
```

### 6. 如何在Vue3项目中实现WebSocket连接并解决跨域问题？

**答案**：
WebSocket本身不受浏览器的同源策略限制，但建立连接前可能会有其他限制（如Cookie传递等）。在Vue3中实现WebSocket连接的跨域处理：

```vue
<template>
  <div class="websocket-container">
    <h2>WebSocket 连接示例</h2>
  
    <div class="connection-controls">
      <button @click="connect" :disabled="isConnected || isConnecting">
        {{ isConnecting ? '连接中...' : '连接' }}
      </button>
      <button @click="disconnect" :disabled="!isConnected">
        断开
      </button>
      <button @click="clearMessages">清除消息</button>
    </div>
  
    <div v-if="error" class="error-message">
      错误: {{ error }}
    </div>
  
    <div class="message-sender">
      <input 
        v-model="messageToSend" 
        type="text" 
        placeholder="输入要发送的消息"
        @keyup.enter="sendMessage"
        :disabled="!isConnected"
      >
      <button @click="sendMessage" :disabled="!isConnected || !messageToSend.trim()">
        发送
      </button>
    </div>
  
    <div class="messages-container">
      <h3>消息记录:</h3>
      <div v-if="messages.length === 0" class="no-messages">
        暂无消息
      </div>
      <ul v-else>
        <li v-for="(msg, index) in messages" :key="index" :class="msg.type">
          <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
          <span class="content">{{ msg.content }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

export default {
  name: 'WebSocketConnection',
  setup() {
    const socket = ref(null);
    const isConnected = ref(false);
    const isConnecting = ref(false);
    const error = ref(null);
    const messages = ref([]);
    const messageToSend = ref('');

    // WebSocket URL - 根据环境配置
    const getWebSocketUrl = () => {
      // 在开发环境中，可能需要通过代理连接
      if (process.env.NODE_ENV === 'development') {
        // 如果WebSocket服务器与API服务器在同一地址，但使用不同端口
        // 在vue.config.js中配置代理
        return 'ws://localhost:8080/ws';
      } else {
        // 生产环境直接连接
        return 'wss://api.example.com/ws';
      }
    };

    // 获取认证token
    const getAuthToken = async () => {
      try {
        // 从localStorage获取token，或从认证接口获取新token
        let token = localStorage.getItem('authToken');
      
        if (!token) {
          // 如果没有token，获取临时token用于WebSocket连接
          const response = await axios.get('/api/ws-token', {
            withCredentials: true
          });
          token = response.data.token;
          localStorage.setItem('wsToken', token);
        }
      
        return token;
      } catch (err) {
        console.error('获取WebSocket认证token失败:', err);
        throw err;
      }
    };

    const connect = async () => {
      if (isConnected.value || isConnecting.value) return;

      isConnecting.value = true;
      error.value = null;

      try {
        // 获取认证token
        const token = await getAuthToken();
      
        // 创建WebSocket连接
        const url = `${getWebSocketUrl()}?token=${encodeURIComponent(token)}`;
        socket.value = new WebSocket(url);
      
        // 连接事件处理
        socket.value.onopen = handleOpen;
        socket.value.onclose = handleClose;
        socket.value.onerror = handleError;
        socket.value.onmessage = handleMessage;
      
        // 设置连接超时
        setTimeout(() => {
          if (!isConnected.value && isConnecting.value) {
            error.value = '连接超时';
            isConnecting.value = false;
            if (socket.value) {
              socket.value.close();
              socket.value = null;
            }
          }
        }, 10000); // 10秒超时
      
      } catch (err) {
        error.value = `连接失败: ${err.message}`;
        isConnecting.value = false;
      }
    };

    const handleOpen = () => {
      isConnected.value = true;
      isConnecting.value = false;
      addMessage('系统', 'WebSocket连接已建立', 'system');
    
      // 可以发送初始消息
      if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify({ type: 'initial', data: '客户端已连接' }));
      }
    };

    const handleClose = (event) => {
      isConnected.value = false;
      isConnecting.value = false;
    
      let closeReason = '连接已关闭';
      if (event.code !== 1000) {
        closeReason += ` (代码: ${event.code}, 原因: ${event.reason || '未知'})`;
      }
    
      addMessage('系统', closeReason, 'system');
    
      // 可以设置为自动重连
      // setTimeout(() => {
      //   if (!isConnected.value) {
      //     connect();
      //   }
      // }, 5000);
    };

    const handleError = (err) => {
      error.value = `WebSocket错误: ${err.message || '未知错误'}`;
      console.error('WebSocket错误:', err);
    };

    const handleMessage = (event) => {
      let data;
    
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        // 如果不是JSON格式，直接作为文本处理
        data = { content: event.data, type: 'text' };
      }
    
      // 处理不同类型的消息
      if (data.type === 'message' || data.type === 'text') {
        addMessage('服务器', data.content || data.message || data, 'received');
      } else if (data.type === 'notification') {
        addMessage('通知', data.message, 'notification');
      } else if (data.type === 'error') {
        addMessage('错误', data.message, 'error');
      }
    };

    const sendMessage = () => {
      if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
        return;
      }
    
      const message = messageToSend.value.trim();
      if (!message) return;
    
      // 发送消息
      socket.value.send(JSON.stringify({
        type: 'message',
        content: message
      }));
    
      // 添加到消息列表
      addMessage('我', message, 'sent');
    
      // 清空输入框
      messageToSend.value = '';
    };

    const disconnect = () => {
      if (socket.value) {
        socket.value.close(1000, '用户断开连接');
        socket.value = null;
      }
    };

    const clearMessages = () => {
      messages.value = [];
    };

    const addMessage = (sender, content, type) => {
      messages.value.push({
        sender,
        content,
        type,
        timestamp: new Date()
      });
    
      // 自动滚动到最新消息
      setTimeout(() => {
        const container = document.querySelector('.messages-container ul');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 0);
    };

    const formatTime = (date) => {
      return date.toLocaleTimeString();
    };

    // 组件卸载时确保关闭WebSocket连接
    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.close();
      }
    });

    // 组件挂载时自动连接
    onMounted(() => {
      // 可以注释掉这行，改为手动连接
      // connect();
    });

    return {
      isConnected,
      isConnecting,
      error,
      messages,
      messageToSend,
      connect,
      disconnect,
      clearMessages,
      sendMessage,
      formatTime
    };
  }
};
</script>

<style scoped>
.websocket-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.connection-controls {
  margin-bottom: 15px;
}

button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  padding: 10px;
  margin: 10px 0;
  background-color: #ffebee;
  border-radius: 4px;
}

.message-sender {
  display: flex;
  margin-bottom: 20px;
}

.message-sender input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.messages-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  height: 400px;
  overflow-y: auto;
}

.messages-container h3 {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.no-messages {
  text-align: center;
  color: #999;
  padding: 20px;
}

.messages-container ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.messages-container li {
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
}

.messages-container li:last-child {
  border-bottom: none;
}

.messages-container li.received {
  background-color: #e8f5e9;
}

.messages-container li.sent {
  background-color: #e3f2fd;
  justify-content: flex-end;
}

.messages-container li.system {
  background-color: #fff8e1;
  font-style: italic;
}

.messages-container li.notification {
  background-color: #f3e5f5;
}

.messages-container li.error {
  background-color: #ffebee;
  color: #c62828;
}

.timestamp {
  font-size: 12px;
  color: #666;
  margin-right: 10px;
  min-width: 50px;
}

.content {
  flex-grow: 1;
}
</style>
```

### 7. 在Vue3项目中，如何实现一个请求拦截器，用于跨域请求的错误处理和token刷新？

**答案**：
在Vue3项目中，可以使用axios的拦截器机制来实现跨域请求的错误处理和token刷新。以下是一个完整的实现示例：

```javascript
// src/utils/http.js
import axios from 'axios';
import { ref } from 'vue';

// 用于避免同时多次刷新token
let isRefreshing = false;
// 存储待重发请求的队列
let subscribers = [];

// 创建axios实例
const http = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://api.example.com',
  withCredentials: true,
  timeout: 10000
});

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('accessToken');
  
    // 如果有token，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 刷新token的方法
const refreshToken = () => {
  // 从localStorage获取refreshToken
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return Promise.reject(new Error('没有刷新token'));
  }

  return http.post('/auth/refresh', {
    refreshToken
  }).then(response => {
    // 保存新token
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
  
    return accessToken;
  });
};

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 如果响应中包含新token，更新本地存储
    if (response.headers['new-access-token']) {
      localStorage.setItem('accessToken', response.headers['new-access-token']);
    }
  
    return response;
  },
  error => {
    const { config, response } = error;
  
    if (!response) {
      console.error('网络错误或服务器未响应');
      return Promise.reject(error);
    }
  
    // 获取错误状态码
    const { status } = response;
  
    // 处理401未授权错误（token过期）
    if (status === 401) {
      // 如果请求本身的标记中表示不再重试，则直接拒绝
      if (config._retry) {
        // 可以在这里执行登出逻辑
        console.error('认证失败，请重新登录');
        return Promise.reject(error);
      }
    
      // 如果没有正在刷新token，则执行刷新
      if (!isRefreshing) {
        isRefreshing = true;
      
        try {
          // 调用刷新token方法
          const newToken = await refreshToken();
        
          isRefreshing = false;
        
          // 执行订阅队列中的请求
          subscribers.forEach(cb => cb(newToken));
          subscribers = [];
        
          // 重试当前请求
          config._retry = true;
          config.headers['Authorization'] = `Bearer ${newToken}`;
        
          return http(config);
        } catch (refreshError) {
          isRefreshing = false;
          subscribers = [];
        
          // 刷新token失败，执行登出逻辑
          console.error('刷新token失败，请重新登录');
        
          // 可以跳转到登录页
          window.location.href = '/login';
        
          return Promise.reject(refreshError);
        }
      }
    
      // 如果正在刷新token，将请求加入队列
      return new Promise(resolve => {
        subscribers.push(token => {
          config._retry = true;
          config.headers['Authorization'] = `Bearer ${token}`;
          resolve(http(config));
        });
      });
    }
  
    // 处理403禁止访问错误
    if (status === 403) {
      console.error('没有权限访问该资源');
    }
  
    // 处理404未找到错误
    if (status === 404) {
      console.error('请求的资源不存在');
    }
  
    // 处理500服务器错误
    if (status >= 500) {
      console.error('服务器错误，请稍后再试');
    }
  
    return Promise.reject(error);
  }
);

// 导出axios实例
export default http;

// 一个组合式API，用于在其他组件中使用
export function useHttp() {
  const isLoading = ref(false);
  const error = ref(null);

  const request = async (config) => {
    isLoading.value = true;
    error.value = null;
  
    try {
      const response = await http(config);
      return response.data;
    } catch (err) {
      error.value = err.message || '请求出错';
      console.error('HTTP请求错误:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    request
  };
}

// 在Vue组件中使用示例
/*
import { ref, onMounted } from 'vue';
import http, { useHttp } from '@/utils/http';

export default {
  setup() {
    const data = ref(null);
    const { isLoading, error, request } = useHttp();
  
    const fetchData = async () => {
      try {
        data.value = await request({
          method: 'get',
          url: '/user/profile'
        });
      } catch (err) {
        // 错误已经在useHttp中处理
      }
    };
  
    onMounted(() => {
      fetchData();
    });
  
    return {
      data,
      isLoading,
      error
    };
  }
};
*/
```

### 8. 在Vue3项目中，如何实现一个适配开发环境和生产环境的CORS解决方案？

**答案**：
在Vue3项目中实现一个适配开发环境和生产环境的CORS解决方案，可以通过环境变量和条件配置来实现。以下是一个完整的实现：

```javascript
// src/utils/env.js
// 环境配置工具

// 获取当前环境
const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// 获取API基础URL
const getApiBaseUrl = () => {
  // 开发环境使用代理，生产环境使用绝对URL
  if (getEnvironment() === 'development') {
    return '/api'; // 代理前缀
  } else {
    return process.env.VUE_APP_API_BASE_URL || 'https://api.example.com';
  }
};

// 获取WebSocket URL
const getWebSocketUrl = () => {
  if (getEnvironment() === 'development') {
    return 'ws://localhost:8080/ws'; // 开发环境代理或本地WebSocket
  } else {
    return process.env.VUE_APP_WS_URL || 'wss://api.example.com/ws';
  }
};

// 判断是否需要使用代理
const shouldUseProxy = () => {
  return getEnvironment() === 'development';
};

export {
  getEnvironment,
  getApiBaseUrl,
  getWebSocketUrl,
  shouldUseProxy
};
```

```javascript
// src/utils/http.js
import axios from 'axios';
import { getApiBaseUrl, shouldUseProxy } from './env';

// 创建axios实例
const http = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 10000
});

// 请求拦截器
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
  
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  
    // 开发环境下，可能需要额外的请求头
    if (shouldUseProxy()) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
  
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
    
      // 处理不同类型的错误
      switch (status) {
        case 401:
          // 未授权，可能是token过期
          handleUnauthorized();
          break;
        case 403:
          // 权限不足
          console.error('权限不足:', data.message);
          break;
        default:
          console.error('请求错误:', data.message || '未知错误');
      }
    } else {
      // 网络错误
      console.error('网络错误，请检查您的网络连接');
    }
  
    return Promise.reject(error);
  }
);

// 处理未授权
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default http;
```

```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const { shouldUseProxy } = require('./src/utils/env');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    open: true,
    // 只在开发环境配置代理
    proxy: shouldUseProxy() ? {
      '/api': {
        target: 'http://localhost:3000', // 后端API服务器地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        onProxyReq: function (proxyReq, req, res) {
          // 可以在这里添加代理请求的逻辑
          console.log('代理请求:', req.url);
        },
        onProxyRes: function (proxyRes, req, res) {
          // 处理代理响应
          if (process.env.DEBUG_PROXY) {
            console.log('代理响应:', proxyRes.statusCode, req.url);
          }
        },
        onError: function (err, req, res) {
          console.error('代理错误:', err);
        }
      },
      '/ws': {
        target: 'ws://localhost:3000', // WebSocket服务器地址
        changeOrigin: true,
        ws: true, // 启用WebSocket代理
        pathRewrite: {
          '^/ws': ''
        }
      }
    } : undefined
  }
});
```

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link> |
      <router-link to="/about">关于</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { getEnvironment } from './utils/env';

export default {
  name: 'App',
  setup() {
    onMounted(() => {
      console.log('当前环境:', getEnvironment());
      console.log('API基础URL:', import.meta.env.VUE_APP_API_BASE_URL);
    });
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
```

环境变量文件：

```bash
# .env.development
VUE_APP_API_BASE_URL=/api
VUE_APP_WS_URL=ws://localhost:8080/ws
```

```bash
# .env.production
VUE_APP_API_BASE_URL=https://api.example.com
VUE_APP_WS_URL=wss://api.example.com/ws
```

### 9. 在Vue3项目中，如何结合Nginx和CORS实现更安全的跨域解决方案？

**答案**：
在Vue3项目中，可以通过Nginx作为反向代理，并结合CORS实现更安全的跨域解决方案。这种方案在开发环境使用vue-cli的代理，在生产环境使用Nginx和CORS。

```javascript
// vue.config.js - 开发环境配置
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://backend-api-server:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        headers: {
          // 可以添加开发环境特定的请求头
          'X-DEV-ENV': 'true'
        }
      },
      '/auth': {
        target: 'http://auth-server:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/auth': ''
        }
      }
    }
  }
});
```

```nginx
# nginx.conf - 生产环境配置
worker_processes 1;
events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
  
    # 定义后端服务
    upstream backend_api {
        server backend-api-server:3000;
    }
  
    upstream auth_service {
        server auth-server:3001;
    }
  
    # 定义前端应用
    server {
        listen    80;
        server_name frontend.example.com;
      
        # 重定向HTTP到HTTPS
        return 301 https://$server_name$request_uri;
    }
  
    server {
        listen    443 ssl;
        server_name frontend.example.com;
      
        # SSL配置
        ssl_certificate            /etc/nginx/ssl/frontend.example.com.crt;
        ssl_certificate_key        /etc/nginx/ssl/frontend.example.com.key;
        ssl_protocols              TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers  on;
        ssl_ciphers                'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
      
        # HSTS增强安全性
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
      
        # 其他安全相关的HTTP头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header X-XSS-Protection "1; mode=block" always;
      
        # 前端静态文件
        location / {
            root  /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
          
            # 静态文件缓存配置
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }
      
        # API请求代理到后端，并添加CORS支持
        location /api {
            # 代理到后端API服务
            proxy_pass  http://backend_api;
            proxy_redirect   off;
          
            # CORS配置
            add_header 'Access-Control-Allow-Origin' 'https://frontend.example.com' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
          
            # 预检请求缓存时间
            add_header 'Access-Control-Max-Age' 1728000;
          
            # 预检请求处理
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' 'https://frontend.example.com';
                add_header 'Access-Control-Allow-Credentials' 'true';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }
          
            # 设置代理请求头
            proxy_set_header  Host       $host;
            proxy_set_header  X-Real-IP     $remote_addr;
            proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header  X-Forwarded-Proto $scheme;
          
            # 设置超时
            proxy_connect_timeout       600;
            proxy_send_timeout          600;
            proxy_read_timeout          600;
            send_timeout                600;
        }
      
        # 认证服务请求代理
        location /auth {
            # 代理到认证服务
            proxy_pass  http://auth_service;
            proxy_redirect   off;
          
            # CORS配置
            add_header 'Access-Control-Allow-Origin' 'https://frontend.example.com' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
          
            # 预检请求
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' 'https://frontend.example.com';
                add_header 'Access-Control-Allow-Credentials' 'true';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With';
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }
          
            # 设置代理请求头
            proxy_set_header  Host       $host;
            proxy_set_header  X-Real-IP     $remote_addr;
            proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header  X-Forwarded-Proto $scheme;
        }
    }
}
```

```javascript
// src/utils/http.js - 前端HTTP请求工具
import axios from 'axios';
import { getEnvironment } from './env';

// 创建axios实例
const http = axios.create({
  baseURL: getEnvironment() === 'development' ? '/api' : 'https://frontend.example.com/api',
  withCredentials: true, // 携带cookies
  timeout: 10000
});

// 请求拦截器
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
  
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  
    // 可以添加其他通用请求头
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
  
    // 如果需要CSRF保护
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken.getAttribute('content');
    }
  
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      const { status } = error.response;
    
      switch (status) {
        case 401:
          // 未授权，跳转到登录页
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('没有权限访问该资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('请求错误:', error.message);
      }
    } else if (error.request) {
      // 请求已发出但没有响应
      console.error('网络错误：没有收到服务器响应');
    } else {
      // 设置请求时发生错误
      console.error('请求设置错误:', error.message);
    }
  
    return Promise.reject(error);
  }
);

// 认证服务专用实例（因为可能在不同的服务器上）
export const authHttp = axios.create({
  baseURL: getEnvironment() === 'development' ? '/auth' : 'https://frontend.example.com/auth',
  withCredentials: true,
  timeout: 10000
});

// 认证服务请求拦截器
authHttp.interceptors.request.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
```

### 10. 在Vue3项目中，如何实现一个可配置的跨域解决方案，以适应不同的第三方API接口？

**答案**：
在Vue3项目中实现一个可配置的跨域解决方案，需要考虑多个第三方API接口的不同跨域要求。以下是一个完整的实现方案：

```javascript
// src/config/api.js
// API配置文件

// 不同API的配置
export const apiConfigs = {
  // 默认API配置
  default: {
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://api.example.com',
    timeout: 10000,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  },

  // 认证服务配置
  auth: {
    baseURL: process.env.NODE_ENV === 'development' ? '/auth' : 'https://auth.example.com',
    timeout: 10000,
    withCredentials: true, // 认证服务可能需要携带cookies
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  },

  // 第三方支付API配置
  payment: {
    baseURL: process.env.NODE_ENV === 'development' ? '/payment' : 'https://payment.thirdparty.com',
    timeout: 15000, // 支付接口可能需要更长时间
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.VUE_APP_PAYMENT_API_KEY // 可能需要API Key
    }
  },

  // 地图服务API配置
  map: {
    baseURL: 'https://maps.googleapis.com/maps/api', // 第三方API通常不需要代理
    timeout: 10000,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// 开发环境代理配置
export const proxyConfigs = {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  },
  '/auth': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/auth': ''
    }
  },
  '/payment': {
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/payment': ''
    }
  }
};
```

```javascript
// src/utils/http.js
import axios from 'axios';
import { apiConfigs } from '@/config/api';

class HttpManager {
  constructor() {
    this.instances = {};
  
    // 初始化所有API实例
    Object.keys(apiConfigs).forEach(key => {
      this.createInstance(key);
    });
  }

  // 创建API实例
  createInstance(apiName) {
    const config = apiConfigs[apiName] || apiConfigs.default;
  
    this.instances[apiName] = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      withCredentials: config.withCredentials,
      headers: config.headers || {}
    });
  
    // 设置请求拦截器
    this.instances[apiName].interceptors.request.use(
      requestConfig => this.handleRequest(requestConfig, apiName),
      error => Promise.reject(error)
    );
  
    // 设置响应拦截器
    this.instances[apiName].interceptors.response.use(
      response => this.handleResponse(response


### 10. 在Vue3项目中，如何实现一个可

配置的跨域解决方案，以适应不同的第三方API接口？（续）

**答案**：
在Vue3项目中实现一个可配置的跨域解决方案，需要考虑多个第三方API接口的不同跨域要求。以下是一个完整的实现方案：

#### 1. 配置文件 (`src/config/api.js`)
创建一个中心化的API配置文件，定义所有需要交互的API。

```javascript
// src/config/api.js

/**
 * API配置文件
 * 定义了项目中所有需要对接的API服务
 */
export const apiConfigs = {
  // 默认API，用于项目核心业务
  default: {
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://api.your-app.com',
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  },

  // 认证服务
  auth: {
    baseURL: process.env.NODE_ENV === 'development' ? '/auth' : 'https://auth.your-app.com',
    timeout: 8000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  },

  // 第三方支付API
  payment: {
    baseURL: process.env.NODE_ENV === 'development' ? '/payment' : 'https://api.payment-gateway.com',
    timeout: 20000,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.VUE_APP_PAYMENT_API_KEY
    }
  },

  // 一个不需要代理的公共API，如天气
  weather: {
      baseURL: 'https://api.open-meteo.com/v1',
      timeout: 5000,
      withCredentials: false,
      headers: {
          'Content-Type': 'application/json'
      }
  }
};

/**
 * 开发环境代理配置
 * key需要与apiConfigs中开发环境的baseURL前缀对应
 */
export const proxyConfigs = {
  '/api': {
    target: 'http://localhost:3000', // 你的本地后端服务
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  },
  '/auth': {
    target: 'http://localhost:3001', // 你的本地认证服务
    changeOrigin: true,
    pathRewrite: {
      '^/auth': ''
    }
  },
  '/payment': {
    target: 'http://localhost:3002', // 模拟的支付网关
    changeOrigin: true,
    pathRewrite: {
      '^/payment': ''
    }
  }
};
```

#### 2. HTTP请求管理器 (`src/utils/http.js`)
创建一个`HttpManager`类来管理所有`axios`实例。这体现了**单一职责原则 (SRP)** 和 **开放/封闭原则 (OCP)**。

```javascript
// src/utils/http.js
import axios from 'axios';
import { apiConfigs } from '@/config/api';

class HttpManager {
  constructor() {
    this.instances = {};
    this.init();
  }

  // 初始化所有API实例
  init() {
    Object.keys(apiConfigs).forEach(key => {
      this.createInstance(key, apiConfigs[key]);
    });
  }

  // 创建一个axios实例
  createInstance(apiName, config) {
    const instance = axios.create(config);

    // 请求拦截器
    instance.interceptors.request.use(
      requestConfig => this.handleRequest(requestConfig, apiName),
      error => Promise.reject(error)
    );

    // 响应拦截器
    instance.interceptors.response.use(
      response => this.handleResponse(response, apiName),
      error => this.handleError(error, apiName)
    );
  
    this.instances[apiName] = instance;
  }

  // 统一请求处理
  handleRequest(config, apiName) {
    // 示例：为 'default' 和 'auth' 服务添加认证Token
    if (apiName === 'default' || apiName === 'auth') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log(`[Request][${apiName}] to ${config.url}`);
    return config;
  }

  // 统一响应处理
  handleResponse(response, apiName) {
    console.log(`[Response][${apiName}] from ${response.config.url}`, response.data);
    // 直接返回data，简化调用
    return response.data;
  }

  // 统一错误处理
  handleError(error, apiName) {
     console.error(`[Error][${apiName}]`, error.response || error.message);
    if (error.response) {
      // 示例：处理401未授权错误
      if (error.response.status === 401 && apiName !== 'auth') {
        // 跳转到登录页或执行token刷新逻辑
        console.error('认证失败，需要重新登录或刷新token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }

  /**
   * 获取一个API实例
   * @param {string} apiName - API的名称，对应api.js中的key
   * @returns {axios.AxiosInstance}
   */
  get(apiName = 'default') {
    if (!this.instances[apiName]) {
      throw new Error(`API instance for "${apiName}" not found.`);
    }
    return this.instances[apiName];
  }
}

// 导出单例
export const httpManager = new HttpManager();
```

#### 3. 开发环境代理配置 (`vue.config.js`)
使用`api.js`中的配置来动态生成代理规则，遵循**杜绝重复 (DRY)** 原则。

```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const { proxyConfigs } = require('./src/config/api');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    open: true,
    // 仅在开发环境启用代理
    proxy: isProduction ? undefined : proxyConfigs
  }
});
```

#### 4. 环境变量配置 (`.env` & `.env.production`)

```bash
# .env (用于开发环境)
VUE_APP_PAYMENT_API_KEY=dev_key_12345
```

```bash
# .env.production (用于生产环境)
VUE_APP_PAYMENT_API_KEY=prod_key_abcdef
```

#### 5. 在Vue组件中使用 (`src/components/ApiDemo.vue`)
展示如何在组件中轻松调用不同的API。

```vue
<template>
  <div class="api-demo">
    <h2>多API跨域解决方案示例</h2>
  
    <div>
      <button @click="fetchDefaultData" :disabled="loading.default">
        {{ loading.default ? '加载中...' : '调用默认API' }}
      </button>
      <pre v-if="results.default">{{ results.default }}</pre>
      <div v-if="errors.default" class="error">{{ errors.default }}</div>
    </div>
  
    <div>
      <button @click="fetchPaymentData" :disabled="loading.payment">
        {{ loading.payment ? '加载中...' : '调用支付API' }}
      </button>
      <pre v-if="results.payment">{{ results.payment }}</pre>
      <div v-if="errors.payment" class="error">{{ errors.payment }}</div>
    </div>

    <div>
      <button @click="fetchWeatherData" :disabled="loading.weather">
        {{ loading.weather ? '加载中...' : '调用天气API (公共)' }}
      </button>
      <pre v-if="results.weather">{{ results.weather }}</pre>
      <div v-if="errors.weather" class="error">{{ errors.weather }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { httpManager } from '@/utils/http';

const loading = reactive({
  default: false,
  payment: false,
  weather: false,
});
const results = reactive({
  default: null,
  payment: null,
  weather: null,
});
const errors = reactive({
  default: null,
  payment: null,
  weather: null,
});

const fetchDefaultData = async () => {
  loading.default = true;
  errors.default = null;
  results.default = null;
  try {
    // 使用 'default' API实例
    results.default = await httpManager.get('default').get('/users/1');
  } catch (err) {
    errors.default = err.message;
  } finally {
    loading.default = false;
  }
};

const fetchPaymentData = async () => {
  loading.payment = true;
  errors.payment = null;
  results.payment = null;
  try {
    // 使用 'payment' API实例
    results.payment = await httpManager.get('payment').post('/charge', { amount: 100 });
  } catch (err) {
    errors.payment = err.message;
  } finally {
    loading.payment = false;
  }
};

const fetchWeatherData = async () => {
  loading.weather = true;
  errors.weather = null;
  results.weather = null;
  try {
    // 使用 'weather' API实例
    results.weather = await httpManager.get('weather').get('/forecast?latitude=52.52&longitude=13.41&current_weather=true');
  } catch (err) {
    errors.weather = err.message;
  } finally {
    loading.weather = false;
  }
};

</script>

<style scoped>
.api-demo > div {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
```

#### 总结
此方案的优点：
- **可配置**: 所有API配置集中在`api.js`，易于管理和扩展。
- **环境隔离**: 通过`.env`文件和`process.env.NODE_ENV`，轻松区分开发和生产环境。
- **职责清晰**: `HttpManager`负责创建和管理请求，组件只负责调用。
- **代码复用**: 拦截器等逻辑在`HttpManager`中统一处理，避免重复。
- **类型安全**: 如果使用TypeScript，可以为`apiConfigs`和`HttpManager`添加类型定义，增强代码健壮性。

---

## 快速复用指南
假设过段时间你忘记了如何使用这个功能，需要将它快速集成到新项目中。

**目标**：在新项目中快速搭建一个支持多API、环境隔离、开发代理的HTTP请求层。

**步骤如下：**

**第一步：复制核心文件**

将以下两个文件复制到新项目的`src`目录下对应位置：
1.  `src/config/api.js`
2.  `src/utils/http.js`

**第二步：安装依赖**

在项目根目录下运行，确保 `axios` 已安装：
```bash
npm install axios
```

**第三步：配置开发环境代理**

将以下代码添加到新项目的 `vue.config.js` 文件中：

```javascript
const { defineConfig } = require('@vue/cli-service');
// 导入你的代理配置
const { proxyConfigs } = require('./src/config/api');

module.exports = defineConfig({
  // ... 其他配置
  devServer: {
    // 仅在开发环境启用代理
    proxy: process.env.NODE_ENV === 'development' ? proxyConfigs : undefined
  }
});
```

**第四步：配置环境变量**

根据 `src/config/api.js` 的需要，在项目根目录创建或修改 `.env` 和 `.env.production` 文件，添加必要的环境变量。
例如，为支付API添加KEY：

```bash
# .env 文件
VUE_APP_PAYMENT_API_KEY=your_dev_key
```

**第五步：在组件中使用**

现在你可以在任何Vue组件中导入并使用 `httpManager`。

```vue
<script setup>
import { httpManager } from '@/utils/http.js';
import { onMounted, ref } from 'vue';

const userData = ref(null);

onMounted(async () => {
  try {
    // 调用默认API
    const user = await httpManager.get('default').get('/users/1');
    userData.value = user;

    // 调用天气API
    const weather = await httpManager.get('weather').get('/forecast?latitude=34.05&longitude=-118.24&current_weather=true');
    console.log('当前天气:', weather.current_weather);

  } catch (error) {
    console.error("请求失败:", error);
  }
});
</script>
```

**快速回顾：**
- **改配置**：去 `src/config/api.js` 修改或添加API。
- **改代理**：在 `src/config/api.js` 中修改 `proxyConfigs`。
- **用请求**：`import { httpManager } from '@/utils/http.js'`，然后通过 `httpManager.get('apiName').get('/path')` 调用。