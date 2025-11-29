# Vue 错误处理精华学习资料

## 📚 日常学习模式

**[标签: Vue错误处理, errorHandler, onErrorCaptured, 异常监控]**

### 核心概念

Vue 项目中的错误分为两大类：
- **后端接口错误**：API请求失败、网络异常、服务器错误
- **前端逻辑错误**：组件渲染错误、业务逻辑异常、第三方库错误

**错误处理的三层防御体系：**
1. **全局捕获层**：app.config.errorHandler（Vue组件错误） + window事件（Promise/全局错误）
2. **局部隔离层**：ErrorBoundary组件（错误边界）
3. **业务处理层**：try-catch + API拦截器

### 核心API对比

| API | 作用范围 | 使用场景 | 错误传播 |
|-----|---------|---------|---------|
| **app.config.errorHandler** | 全局应用级 | 最后防线，捕获所有未处理的组件错误 | 所有错误最终到达这里 |
| **onErrorCaptured** | 组件级（子孙组件） | 局部错误隔离，实现错误边界 | 返回false阻止向上传播 |
| **window.onerror** | 全局JS错误 | 捕获非Vue代码的运行时错误 | 浏览器默认行为 |
| **unhandledrejection** | 全局Promise | 捕获未处理的Promise rejection | 浏览器默认行为 |

### 实现架构

```javascript
/**
 * 错误处理架构
 * 
 * 层次1: 全局捕获（main.js）
 *   ├─ app.config.errorHandler → Vue组件错误
 *   ├─ window.unhandledrejection → Promise异常
 *   └─ window.onerror → 全局JS错误
 * 
 * 层次2: 局部隔离（ErrorBoundary.vue）
 *   └─ onErrorCaptured → 子组件错误边界
 * 
 * 层次3: 业务处理
 *   ├─ axios拦截器 → API错误统一处理
 *   └─ try-catch → 业务逻辑错误
 */

/**
 * 1. 错误上报服务（单一职责）
 * 文件：src/services/errorLogService.js
 */
export function logErrorToServer(err, info, vm = null) {
  // 提取关键信息
  const errorLog = {
    message: err.message,
    stack: err.stack,
    info,  // Vue特定信息（如生命周期钩子名）
    componentName: vm?.$options?.name,
    timestamp: new Date().toISOString(),
    // 环境信息
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.group('%c[错误上报]', 'color: red; font-weight: bold;');
  console.error('错误信息:', err);
  console.log('Vue信息:', info);
  console.log('组件实例:', vm);
  console.groupEnd();

  // 实际项目中发送到监控服务
  // fetch('/api/log-error', {
  //   method: 'POST',
  //   body: JSON.stringify(errorLog)
  // });
}

/**
 * 2. 全局错误处理配置
 * 文件：src/main.js
 */
import { createApp } from 'vue';
import { logErrorToServer } from './services/errorLogService';

const app = createApp(App);

// Vue组件错误全局处理器
app.config.errorHandler = (err, instance, info) => {
  console.error('[全局errorHandler]捕获到错误');
  logErrorToServer(err, info, instance);

  // 可选：显示全局错误提示
  // showGlobalToast('系统发生错误，请稍后重试');
};

// Promise未处理的rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandledrejection]捕获Promise错误');
  const error = event.reason instanceof Error 
    ? event.reason 
    : new Error(String(event.reason));
  logErrorToServer(error, 'Unhandled Promise Rejection');
  event.preventDefault(); // 阻止浏览器默认行为
});

// 全局JS错误（可选，作为补充）
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[window.onerror]捕获全局错误');
  if (error) {
    logErrorToServer(error, `Global Error at ${source}:${lineno}:${colno}`);
  }
  return true; // 阻止浏览器默认错误提示
};

app.mount('#app');

/**
 * 3. 错误边界组件
 * 文件：src/components/ErrorBoundary.vue
 */
// <template>
//   <div v-if="hasError" class="error-boundary">
//     <h3>⚠️ 组件出现问题</h3>
//     <p>{{ errorMessage }}</p>
//     <button @click="resetError">重试</button>
//     <button @click="reportError">报告问题</button>
//   </div>
//   <slot v-else></slot>
// </template>

import { ref, onErrorCaptured } from 'vue';
import { logErrorToServer } from '@/services/errorLogService';

const hasError = ref(false);
const errorMessage = ref('');
let capturedError = null;

// 捕获子孙组件的错误
onErrorCaptured((err, instance, info) => {
  console.error('[ErrorBoundary]捕获子组件错误');

  hasError.value = true;
  errorMessage.value = err.message;
  capturedError = err;

  // 上报错误
  logErrorToServer(err, info, instance);

  // 返回false阻止错误继续向上传播
  return false;
});

const resetError = () => {
  hasError.value = false;
  errorMessage.value = '';
  capturedError = null;
};

const reportError = () => {
  if (capturedError) {
    // 可以打开反馈表单等
    alert('错误已报告，感谢您的反馈');
  }
};

/**
 * 4. Axios统一错误处理
 * 文件：src/utils/request.js
 */
import axios from 'axios';
import { logErrorToServer } from '@/services/errorLogService';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(
  config => config,
  error => {
    logErrorToServer(error, 'Request Error');
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    // 统一处理HTTP错误
    const status = error.response?.status;
    const errorMap = {
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用'
    };
  
    const message = errorMap[status] || '网络请求失败';
  
    // 上报错误
    logErrorToServer(
      error,
      `API Error: ${error.config?.url} - ${status}`
    );
  
    // 显示用户友好提示
    // showToast(message);
  
    return Promise.reject(error);
  }
);

export default request;

/**
 * 5. 可复用的安全请求Hook
 * 文件：src/composables/useSafeRequest.js
 */
import { logErrorToServer } from '@/services/errorLogService';

export function useSafeRequest(asyncFn, fallbackValue = null) {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      // 记录错误但不中断流程
      logErrorToServer(
        error,
        `useSafeRequest: ${asyncFn.name || 'anonymous'}`
      );
    
      // 返回降级值
      return fallbackValue;
    }
  };
}

// 使用示例
import { useSafeRequest } from '@/composables/useSafeRequest';

const fetchUserData = async (userId) => {
  const res = await request.get(`/users/${userId}`);
  return res.data;
};

// 包装为安全请求，失败时返回空对象
const safeFetchUser = useSafeRequest(fetchUserData, {});

// 在组件中使用
const userData = await safeFetchUser(123);
```

### 使用场景最佳实践

**场景1：关键业务模块保护**
```vue
<!-- 支付表单，出错不应影响其他功能 -->
<ErrorBoundary>
  <PaymentForm />
</ErrorBoundary>

<!-- 商品列表，出错不应影响导航栏 -->
<ErrorBoundary>
  <ProductList />
</ErrorBoundary>
```

**场景2：异步数据加载**
```javascript
import { ref, onMounted } from 'vue';
import { useSafeRequest } from '@/composables/useSafeRequest';

const loading = ref(false);
const error = ref(null);
const data = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    data.value = await request.get('/data');
  } catch (err) {
    error.value = err.message;
    // 错误已被axios拦截器上报
  } finally {
    loading.value = false;
  }
};

// 提供重试功能
const retry = () => fetchData();

onMounted(fetchData);
```

**场景3：第三方脚本隔离**
```javascript
// 加载第三方SDK时捕获错误
const loadThirdPartySDK = async () => {
  try {
    await import('third-party-sdk');
  } catch (error) {
    logErrorToServer(
      error,
      'Third Party SDK Load Failed'
    );
    // 使用降级方案
    return mockSDK;
  }
};
```

### 关键知识点

1. **错误传播链**：
   - 子组件 → onErrorCaptured(返回false停止) → 父组件onErrorCaptured → ... → app.config.errorHandler

2. **Promise错误独立处理**：
   - async/await中的错误不会被errorHandler捕获
   - 必须监听unhandledrejection事件

3. **错误边界返回值**：
   - onErrorCaptured返回false：错误不再向上传播
   - 不返回或返回其他值：错误继续冒泡

4. **Source Map的重要性**：
   - 生产环境的压缩代码难以定位
   - 配置source map上传到监控平台实现源码定位

5. **用户体验优先原则**：
   - 错误提示要清晰友好（避免技术术语）
   - 提供明确的操作指引（重试/返回/联系客服）
   - 保留用户已输入的数据

---

## ⚡ 面试突击模式

### [Vue 错误处理] 面试速记

#### 30秒电梯演讲

"Vue错误处理采用三层防御：全局层通过app.config.errorHandler和window事件捕获所有未处理异常；局部层使用ErrorBoundary组件实现错误隔离和优雅降级；业务层通过axios拦截器和try-catch处理具体场景。核心是错误冒泡机制：子组件错误会向上传播，onErrorCaptured可以中断传播，最终未处理的错误到达全局处理器。"

---

### 高频考点（必背）

**考点1: errorHandler vs onErrorCaptured**
- errorHandler是应用级全局处理器，捕获所有未处理的组件错误
- onErrorCaptured是组件级钩子，只捕获子孙组件错误，返回false可阻止向上传播
- 错误从子组件向上冒泡：子组件 → 各层onErrorCaptured → errorHandler

**考点2: Promise异常为何需要单独处理**
- errorHandler只捕获Vue组件同步错误和生命周期错误
- async/await中的异常是Promise rejection，不会触发errorHandler
- 必须监听window.unhandledrejection事件捕获未处理的Promise异常

**考点3: 错误边界的设计原则**
- 隔离关键业务模块，防止局部错误导致整体崩溃
- 提供降级UI，保证核心功能可用
- 实现方式：父组件用onErrorCaptured捕获子组件错误，返回false停止传播

**考点4: 错误上报的架构设计**
- 单一职责：错误上报封装为独立service，便于切换监控服务
- 关键信息：错误堆栈、组件信息、用户信息、环境信息
- 上报时机：errorHandler、onErrorCaptured、axios拦截器、window事件

**考点5: 生产环境错误定位**
- 代码压缩后错误堆栈难以阅读
- 配置source map映射到源代码
- 监控平台（Sentry等）自动解析source map还原错误位置

---

### 经典面试题

#### 题目1: 请说明Vue中错误的完整传播路径

**思路**: 从错误发生到最终处理的完整生命周期

**答案**:
当Vue组件中发生错误时，传播路径如下：
1. 错误首先在发生错误的组件内部抛出
2. 向上冒泡到父组件的onErrorCaptured钩子（如果存在）
3. 继续向上传播到祖父组件的onErrorCaptured（如果父组件的钩子未返回false）
4. 依次向上，直到根组件
5. 如果所有onErrorCaptured都未返回false，最终到达app.config.errorHandler
6. 如果errorHandler也未处理，错误会被浏览器默认处理（控制台报错）

关键点：任何一层的onErrorCaptured返回false，传播链立即中断。

**代码框架**:
```javascript
/**
 * 错误传播演示
 * 组件层级：GrandParent > Parent > Child
 */

// 子组件：错误发生源
const Child = {
  setup() {
    const triggerError = () => {
      throw new Error('Child组件故意的错误');
    };
    return { triggerError };
  },
  template: '<button @click="triggerError">触发错误</button>'
};

// 父组件：第一层错误捕获
const Parent = {
  setup() {
    onErrorCaptured((err, instance, info) => {
      console.log('[Parent] 捕获到子组件错误:', err.message);
    
      // 决策点：是否继续向上传播
      // return false; // 返回false阻止传播
      // 不返回或返回其他值，错误继续向上
    });
    return {};
  },
  components: { Child },
  template: '<div><h3>Parent</h3><Child /></div>'
};

// 祖父组件：第二层错误捕获
const GrandParent = {
  setup() {
    onErrorCaptured((err, instance, info) => {
      console.log('[GrandParent] 捕获到错误:', err.message);
      // 如果Parent未返回false，这里会执行
      return false; // 在这里阻止传播
    });
    return {};
  },
  components: { Parent },
  template: '<div><h2>GrandParent</h2><Parent /></div>'
};

// 全局配置：最终防线
app.config.errorHandler = (err, instance, info) => {
  console.log('[Global] 全局捕获:', err.message);
  // 如果所有组件的onErrorCaptured都未返回false，这里会执行
};

/**
 * 传播路径可视化：
 * 
 * Child组件抛出错误
 *   ↓
 * Parent.onErrorCaptured (第一层)
 *   ↓ (如果未返回false)
 * GrandParent.onErrorCaptured (第二层)
 *   ↓ (如果未返回false)
 * app.config.errorHandler (全局层)
 *   ↓ (如果未处理)
 * 浏览器默认错误处理
 */
```

---

#### 题目2: 为什么需要同时监听errorHandler和unhandledrejection？

**思路**: 理解Vue错误处理的局限性

**答案**:
这是因为JavaScript中有两种不同的错误传播机制：

1. **同步错误和Vue组件错误**：通过try-catch或Vue的错误钩子捕获，会被errorHandler处理
2. **Promise异常**：通过Promise的rejection机制传播，不会触发errorHandler

async/await本质上是Promise的语法糖，await抛出的异常是Promise rejection，如果没有被catch捕获，会变成unhandled rejection。errorHandler无法捕获这类错误，必须监听unhandledrejection事件。

**代码框架**:
```javascript
/**
 * 演示errorHandler无法捕获Promise异常
 */

// 场景1：同步错误 - errorHandler可以捕获
const Component1 = {
  setup() {
    onMounted(() => {
      // 同步抛出错误
      throw new Error('同步错误');
      // ✅ 会被 app.config.errorHandler 捕获
    });
  }
};

// 场景2：async函数中的异常 - errorHandler无法捕获
const Component2 = {
  setup() {
    onMounted(async () => {
      // async函数中抛出错误
      throw new Error('async函数中的错误');
      // ❌ 不会被 errorHandler 捕获
      // ✅ 会触发 unhandledrejection 事件
    });
  }
};

// 场景3：Promise链中的异常
const Component3 = {
  setup() {
    onMounted(() => {
      fetch('/api/data')
        .then(res => res.json())
        .then(data => {
          throw new Error('Promise链中的错误');
          // ❌ 不会被 errorHandler 捕获
          // ✅ 会触发 unhandledrejection 事件
        });
      // 如果没有 .catch()，错误无法被捕获
    });
  }
};

/**
 * 正确的配置：两者都要监听
 */
// main.js
import { createApp } from 'vue';
import { logErrorToServer } from './services/errorLogService';

const app = createApp(App);

// 1. Vue组件错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('[errorHandler] Vue组件错误:', err);
  logErrorToServer(err, info, instance);
};

// 2. Promise未处理的rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandledrejection] Promise异常:', event.reason);

  // 规范化错误对象
  const error = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason));

  logErrorToServer(error, 'Unhandled Promise Rejection');

  // 阻止浏览器默认行为（在控制台显示警告）
  event.preventDefault();
});

// 3. 全局JS错误（可选，作为补充）
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[onerror] 全局JS错误');
  if (error) {
    logErrorToServer(error, `Global Error at ${source}:${lineno}`);
  }
  return true; // 阻止浏览器默认错误提示
};

/**
 * 最佳实践：在async函数中主动捕获
 */
const BestPracticeComponent = {
  setup() {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();
        return data;
      } catch (error) {
        // 主动捕获并处理
        logErrorToServer(error, 'fetchData Error');
        // 显示用户友好提示
        showToast('数据加载失败，请稍后重试');
        return null; // 返回降级值
      }
    };
  
    onMounted(fetchData);
  }
};

/**
 * 错误类型总结：
 * 
 * ✅ errorHandler 可以捕获：
 * - 组件渲染错误
 * - 生命周期钩子中的同步错误
 * - 事件处理器中的同步错误
 * - v-on指令绑定的方法错误
 * 
 * ❌ errorHandler 无法捕获：
 * - async/await中未被catch的异常
 * - Promise链中未被catch的rejection
 * - setTimeout/setInterval中的错误
 * - 事件监听器中的异步错误
 * 
 * ✅ unhandledrejection 可以捕获：
 * - 所有未被catch的Promise rejection
 * - async函数中抛出的未捕获异常
 */
```

---

#### 题目3: 如何设计一个健壮的API请求错误处理机制？

**思路**: 从拦截器、重试、降级、用户提示多个维度考虑

**答案**:
一个完善的API错误处理机制应包含以下层次：

1. **请求拦截器**：添加token、处理请求前错误
2. **响应拦截器**：统一处理HTTP状态码错误（401/403/500等）
3. **自动重试**：网络波动时自动重试，避免用户手动刷新
4. **降级策略**：使用缓存数据或默认值保证功能可用
5. **用户提示**：根据错误类型显示友好的提示信息
6. **错误上报**：记录详细信息到监控平台

**代码框架**:
```javascript
/**
 * 完整的API错误处理方案
 * 文件：src/utils/request.js
 */
import axios from 'axios';
import { logErrorToServer } from '@/services/errorLogService';

/**
 * 创建axios实例
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

/**
 * 1. 请求拦截器
 */
request.interceptors.request.use(
  config => {
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    // 添加请求ID用于追踪
    config.headers['X-Request-ID'] = generateRequestId();
  
    return config;
  },
  error => {
    // 请求配置错误
    logErrorToServer(error, 'Request Config Error');
    return Promise.reject(error);
  }
);

/**
 * 2. 响应拦截器（核心错误处理）
 */
request.interceptors.response.use(
  response => {
    // 成功响应，直接返回数据
    return response.data;
  },
  async error => {
    const { config, response } = error;
  
    // 2.1 网络错误（无response）
    if (!response) {
      const errorMsg = '网络连接失败，请检查网络设置';
      showToast(errorMsg, 'error');
      logErrorToServer(error, 'Network Error');
      return Promise.reject(new Error(errorMsg));
    }
  
    // 2.2 HTTP状态码错误处理
    const { status, data } = response;
  
    // 错误信息映射
    const errorHandlers = {
      400: () => {
        showToast(data.message || '请求参数错误');
        return Promise.reject(error);
      },
    
      401: async () => {
        // 未授权，清除token并跳转登录
        localStorage.removeItem('token');
        router.push('/login');
        showToast('登录已过期，请重新登录');
        return Promise.reject(new Error('Unauthorized'));
      },
    
      403: () => {
        showToast('无权限访问该资源');
        return Promise.reject(error);
      },
    
      404: () => {
        showToast('请求的资源不存在');
        logErrorToServer(error, `404 Not Found: ${config.url}`);
        return Promise.reject(error);
      },
    
      500: () => {
        showToast('服务器内部错误，请稍后重试');
        logErrorToServer(error, `500 Server Error: ${config.url}`);
        return Promise.reject(error);
      },
    
      502: () => {
        showToast('网关错误');
        return Promise.reject(error);
      },
    
      503: () => {
        showToast('服务暂时不可用');
        return Promise.reject(error);
      }
    };
  
    // 执行对应的错误处理
    const handler = errorHandlers[status];
    if (handler) {
      return handler();
    }
  
    // 2.3 其他未知错误
    const errorMsg = data.message || '请求失败，请稍后重试';
    showToast(errorMsg, 'error');
    logErrorToServer(error, `HTTP ${status}: ${config.url}`);
  
    return Promise.reject(error);
  }
);

/**
 * 3. 自动重试机制
 */
const MAX_RETRY = 3;
const RETRY_DELAY = 1000; // 1秒

request.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;
  
    // 初始化重试计数
    config.__retryCount = config.__retryCount || 0;
  
    // 判断是否应该重试
    const shouldRetry = (
      config.__retryCount < MAX_RETRY &&
      !error.response && // 只对网络错误重试
      !config.__isRetry // 避免死循环
    );
  
    if (shouldRetry) {
      config.__retryCount++;
      config.__isRetry = true;
    
      console.log(`[Retry] 第${config.__retryCount}次重试:`, config.url);
    
      // 延迟后重试
      await new Promise(resolve => 
        setTimeout(resolve, RETRY_DELAY * config.__retryCount)
      );
    
      return request(config);
    }
  
    return Promise.reject(error);
  }
);

/**
 * 4. 封装带降级的请求方法
 */
export async function requestWithFallback(
  requestFn,
  fallbackData = null,
  cacheKey = null
) {
  try {
    const data = await requestFn();
  
    // 成功后缓存数据（可选）
    if (cacheKey) {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    }
  
    return { data, error: null };
  } catch (error) {
    // 失败时尝试使用缓存
    if (cacheKey) {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        console.warn('[Fallback] 使用缓存数据');
        showToast('网络异常，使用离线数据', 'warning');
        return { 
          data: JSON.parse(cachedData), 
          error, 
          fromCache: true 
        };
      }
    }
  
    // 使用默认降级数据
    console.error('[Fallback] 使用默认数据');
    return { data: fallbackData, error };
  }
}

/**
 * 5. 使用示例
 */
// 场景1：基础请求
export const getUserInfo = (userId) => {
  return request.get(`/users/${userId}`);
};

// 场景2：带降级的请求
import { requestWithFallback } from '@/utils/request';

const { data, error, fromCache } = await requestWithFallback(
  () => request.get('/user/profile'),
  { name: '访客', avatar: '/default-avatar.png' }, // 降级数据
  'user_profile_cache' // 缓存key
);

if (fromCache) {
  console.log('使用的是缓存数据');
}