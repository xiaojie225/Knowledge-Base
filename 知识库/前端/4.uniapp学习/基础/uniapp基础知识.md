
# UniApp 架构 - 开发文档

## 一、核心概念速览

UniApp 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉/淘宝）、快应用等多个平台。其核心原理是通过编译器将 Vue 代码编译成不同平台的代码，运行时通过统一的 API 抹平平台差异。UniApp 采用条件编译机制处理平台特性，使用 pages.json 管理页面路由和全局配置，通过 manifest.json 配置应用的打包参数。

## 二、完整架构体系

### 2.1 项目结构

```
uni-app-project/
├── pages/                  # 页面文件夹
│   ├── index/
│   │   ├── index.vue      # 页面组件
│   │   └── index.nvue     # 原生渲染页面(可选)
│   └── detail/
│       └── detail.vue
├── components/             # 组件文件夹
│   ├── common/            # 公共组件
│   │   └── nav-bar.vue
│   └── business/          # 业务组件
│       └── goods-card.vue
├── static/                 # 静态资源(不会被编译)
│   ├── images/
│   ├── fonts/
│   └── data/
├── uni_modules/           # uni_modules 插件目录
│   └── plugin-name/
├── store/                 # Vuex 状态管理
│   ├── index.js
│   └── modules/
├── utils/                 # 工具函数
│   ├── request.js        # 网络请求封装
│   ├── storage.js        # 本地存储封装
│   └── common.js         # 通用工具
├── api/                   # API 接口管理
│   ├── user.js
│   └── goods.js
├── mixins/                # 混入
│   └── page-mixin.js
├── filters/               # 过滤器
│   └── index.js
├── App.vue                # 应用配置(生命周期、全局样式)
├── main.js                # 入口文件
├── manifest.json          # 应用配置(App名称、logo、权限等)
├── pages.json             # 页面路由配置
└── uni.scss              # 全局样式变量
```

### 2.2 核心配置文件详解

#### pages.json - 页面路由配置

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      // 页面路径,第一个为首页
      "style": {
        "navigationBarTitleText": "首页",
        // 导航栏标题
        "navigationBarBackgroundColor": "#ffffff",
        // 导航栏背景色
        "navigationBarTextStyle": "black",
        // 导航栏文字颜色(black/white)
        "enablePullDownRefresh": true,
        // 是否开启下拉刷新
        "onReachBottomDistance": 50,
        // 触底加载距离(px)
        "backgroundTextStyle": "dark",
        // 下拉loading样式
        "navigationStyle": "default"
        // custom 自定义导航栏
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationBarTitleText": "详情",
        "app-plus": {
          // App 平台特有配置
          "titleNView": {
            "buttons": [
              {
                "text": "分享",
                "fontSize": "16px"
              }
            ]
          }
        }
      }
    }
  ],
  "globalStyle": {
    // 全局默认窗口样式
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    // 底部导航配置
    "color": "#7A7E83",
    // 未选中文字颜色
    "selectedColor": "#007AFF",
    // 选中文字颜色
    "borderStyle": "black",
    // 边框颜色
    "backgroundColor": "#ffffff",
    // 背景色
    "list": [
      {
        "pagePath": "pages/index/index",
        // 页面路径(必须在pages中定义)
        "iconPath": "static/tab-home.png",
        // 未选中图标
        "selectedIconPath": "static/tab-home-active.png",
        // 选中图标
        "text": "首页"
        // 按钮文字
      },
      {
        "pagePath": "pages/user/user",
        "iconPath": "static/tab-user.png",
        "selectedIconPath": "static/tab-user-active.png",
        "text": "我的"
      }
    ]
  },
  "condition": {
    // 启动模式配置(仅开发期生效)
    "current": 0,
    // 当前激活的模式
    "list": [
      {
        "name": "详情页",
        // 模式名称
        "path": "pages/detail/detail",
        // 启动页面路径
        "query": "id=100"
        // 启动参数
      }
    ]
  },
  "easycom": {
    // 自动引入组件规则
    "autoscan": true,
    // 是否自动扫描组件
    "custom": {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
      // 自定义匹配规则
    }
  }
}
```

#### manifest.json - 应用配置

```json
{
  "name": "应用名称",
  "appid": "__UNI__XXXXXX",
  // 应用标识(创建项目时自动生成)
  "description": "应用描述",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  // 是否转换px为rpx
  
  // App 平台配置
  "app-plus": {
    "usingComponents": true,
    "nvueCompiler": "uni-app",
    // nvue编译模式
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    // 编译器版本
    "splashscreen": {
      // 启动图配置
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    },
    "modules": {
      // 使用的原生插件模块
      "Maps": {},
      "Geolocation": {},
      "Camera": {}
    },
    "distribute": {
      // 打包配置
      "android": {
        "permissions": [
          // 权限配置
          "<uses-permission android:name=\"android.permission.INTERNET\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>"
        ],
        "minSdkVersion": 21,
        // 最低Android版本
        "targetSdkVersion": 30
      },
      "ios": {
        "privacyDescription": {
          // iOS隐私权限描述
          "NSPhotoLibraryUsageDescription": "需要访问相册以选择图片",
          "NSCameraUsageDescription": "需要使用相机拍照"
        }
      },
      "sdkConfigs": {
        // 第三方SDK配置
        "maps": {
          "amap": {
            "appkey_ios": "",
            "appkey_android": ""
          }
        },
        "oauth": {
          "weixin": {
            "appid": "",
            "appsecret": ""
          }
        }
      }
    }
  },
  
  // 微信小程序配置
  "mp-weixin": {
    "appid": "",
    // 小程序appid
    "setting": {
      "urlCheck": true,
      // 是否检查安全域名
      "es6": true,
      // 是否启用ES6转ES5
      "minified": true,
      // 是否压缩代码
      "postcss": true
      // 是否启用postcss
    },
    "usingComponents": true,
    "permission": {
      // 小程序接口权限
      "scope.userLocation": {
        "desc": "获取位置信息用于附近门店展示"
      }
    },
    "requiredPrivateInfos": [
      // 地理位置相关接口
      "getLocation",
      "chooseLocation"
    ]
  },
  
  // H5配置
  "h5": {
    "title": "应用标题",
    "template": "index.html",
    // 自定义HTML模板
    "router": {
      "mode": "hash",
      // 路由模式(hash/history)
      "base": "/"
    },
    "optimization": {
      // 优化配置
      "treeShaking": {
        "enable": true
      }
    },
    "devServer": {
      // 开发服务器配置
      "port": 8080,
      "proxy": {
        "/api": {
          "target": "https://api.example.com",
          "changeOrigin": true,
          "pathRewrite": {
            "^/api": ""
          }
        }
      }
    }
  }
}
```

### 2.3 核心API封装

#### 网络请求封装 (utils/request.js)

```javascript
/**
 * 网络请求封装 - 统一处理请求/响应/错误
 * 
 * 功能:
 * 1. 自动添加token
 * 2. 统一错误处理
 * 3. 请求/响应拦截
 * 4. 加载提示管理
 * 
 * @module utils/request
 */

// 基础配置
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://api.production.com';

const TIMEOUT = 10000; // 超时时间10秒

/**
 * HTTP请求类
 */
class Request {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = TIMEOUT;
    this.requestQueue = new Map(); // 请求队列,用于取消重复请求
  }

  /**
   * 请求拦截器 - 统一处理请求参数
   * @param {Object} config - 请求配置
   * @return {Object} 处理后的配置
   */
  interceptRequest(config) {
    // [Token注入] 从本地存储获取token
    const token = uni.getStorageSync('token');
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      };
    }

    // [通用header] 添加设备信息等
    config.header = {
      ...config.header,
      'Content-Type': 'application/json',
      'platform': this.getPlatform()
    };

    // [去重处理] 取消重复请求
    const requestKey = this.getRequestKey(config);
    if (this.requestQueue.has(requestKey)) {
      const task = this.requestQueue.get(requestKey);
      task.abort(); // 取消之前的请求
    }

    return config;
  }

  /**
   * 响应拦截器 - 统一处理响应数据
   * @param {Object} response - 响应对象
   * @return {Promise} 处理后的数据
   */
  interceptResponse(response) {
    const { statusCode, data } = response;

    // [HTTP状态码处理]
    if (statusCode !== 200) {
      return this.handleHttpError(statusCode, data);
    }

    // [业务状态码处理] 假设后端返回格式 {code, data, message}
    if (data.code !== 0) {
      return this.handleBusinessError(data.code, data.message);
    }

    // [成功返回] 返回业务数据
    return Promise.resolve(data.data);
  }

  /**
   * 统一请求方法
   * @param {Object} options - 请求配置
   * @param {string} options.url - 请求地址
   * @param {string} options.method - 请求方法
   * @param {Object} options.data - 请求参数
   * @param {boolean} options.showLoading - 是否显示loading
   * @return {Promise} 请求结果
   */
  request(options = {}) {
    const {
      url,
      method = 'GET',
      data = {},
      showLoading = true,
      ...rest
    } = options;

    // [Loading管理] 显示加载提示
    if (showLoading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      });
    }

    // [构建完整配置]
    let config = {
      url: this.baseURL + url,
      method,
      data,
      timeout: this.timeout,
      header: {},
      ...rest
    };

    // [请求拦截]
    config = this.interceptRequest(config);

    // [生成请求key]
    const requestKey = this.getRequestKey(config);

    // [发起请求]
    return new Promise((resolve, reject) => {
      const requestTask = uni.request({
        ...config,
        success: (res) => {
          // [响应拦截]
          this.interceptResponse(res)
            .then(data => resolve(data))
            .catch(err => reject(err));
        },
        fail: (err) => {
          // [网络错误处理]
          this.handleNetworkError(err);
          reject(err);
        },
        complete: () => {
          // [清理工作]
          if (showLoading) {
            uni.hideLoading();
          }
          // 从队列中移除
          this.requestQueue.delete(requestKey);
        }
      });

      // [保存请求任务] 用于取消
      this.requestQueue.set(requestKey, requestTask);
    });
  }

  /**
   * HTTP错误处理
   * @param {number} statusCode - HTTP状态码
   * @param {Object} data - 响应数据
   * @return {Promise.reject}
   */
  handleHttpError(statusCode, data) {
    let message = '请求失败';
    
    switch (statusCode) {
      case 401:
        message = '登录已过期,请重新登录';
        // [token过期] 清除本地token,跳转登录页
        uni.removeStorageSync('token');
        uni.reLaunch({
          url: '/pages/login/login'
        });
        break;
      case 403:
        message = '没有权限访问';
        break;
      case 404:
        message = '请求的资源不存在';
        break;
      case 500:
        message = '服务器错误';
        break;
      case 502:
        message = '网关错误';
        break;
      case 503:
        message = '服务不可用';
        break;
      default:
        message = data.message || `请求失败(${statusCode})`;
    }

    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });

    return Promise.reject({ statusCode, message });
  }

  /**
   * 业务错误处理
   * @param {number} code - 业务状态码
   * @param {string} message - 错误信息
   * @return {Promise.reject}
   */
  handleBusinessError(code, message) {
    // [特殊业务码处理]
    switch (code) {
      case 1001:
        // 用户不存在
        message = '用户不存在';
        break;
      case 1002:
        // 密码错误
        message = '密码错误';
        break;
      // 更多业务码...
    }

    uni.showToast({
      title: message || '操作失败',
      icon: 'none',
      duration: 2000
    });

    return Promise.reject({ code, message });
  }

  /**
   * 网络错误处理
   * @param {Object} error - 错误对象
   */
  handleNetworkError(error) {
    let message = '网络连接失败';

    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        message = '请求超时,请检查网络';
      } else if (error.errMsg.includes('abort')) {
        message = '请求已取消';
      }
    }

    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

  /**
   * 生成请求唯一key - 用于去重
   * @param {Object} config - 请求配置
   * @return {string} 请求key
   */
  getRequestKey(config) {
    const { url, method, data } = config;
    return `${method}:${url}:${JSON.stringify(data)}`;
  }

  /**
   * 获取当前平台
   * @return {string} 平台标识
   */
  getPlatform() {
    // #ifdef APP-PLUS
    return 'app';
    // #endif
    // #ifdef MP-WEIXIN
    return 'mp-weixin';
    // #endif
    // #ifdef H5
    return 'h5';
    // #endif
    return 'unknown';
  }

  /**
   * GET请求
   * @param {string} url - 请求地址
   * @param {Object} params - 查询参数
   * @param {Object} options - 其他配置
   * @return {Promise}
   */
  get(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...options
    });
  }

  /**
   * POST请求
   * @param {string} url - 请求地址
   * @param {Object} data - 请求体数据
   * @param {Object} options - 其他配置
   * @return {Promise}
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    });
  }

  /**
   * PUT请求
   * @param {string} url - 请求地址
   * @param {Object} data - 请求体数据
   * @param {Object} options - 其他配置
   * @return {Promise}
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  }

  /**
   * DELETE请求
   * @param {string} url - 请求地址
   * @param {Object} data - 请求体数据
   * @param {Object} options - 其他配置
   * @return {Promise}
   */
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    });
  }

  /**
   * 文件上传
   * @param {string} url - 上传地址
   * @param {string} filePath - 文件路径
   * @param {Object} formData - 额外表单数据
   * @return {Promise}
   */
  upload(url, filePath, formData = {}) {
    uni.showLoading({
      title: '上传中...',
      mask: true
    });

    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token');
      
      uni.uploadFile({
        url: this.baseURL + url,
        filePath,
        name: 'file',
        formData,
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: (res) => {
          // [解析返回数据] uploadFile返回的data是字符串
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data);
          } else {
            this.handleBusinessError(data.code, data.message);
            reject(data);
          }
        },
        fail: (err) => {
          this.handleNetworkError(err);
          reject(err);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    });
  }

  /**
   * 文件下载
   * @param {string} url - 下载地址
   * @param {Object} options - 配置项
   * @return {Promise}
   */
  download(url, options = {}) {
    uni.showLoading({
      title: '下载中...',
      mask: true
    });

    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token');
      
      uni.downloadFile({
        url: this.baseURL + url,
        header: {
          'Authorization': `Bearer ${token}`
        },
        ...options,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          this.handleNetworkError(err);
          reject(err);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    });
  }
}

// 导出单例
export default new Request();
```

#### 本地存储封装 (utils/storage.js)

```javascript
/**
 * 本地存储封装 - 统一管理本地数据
 *
 * 功能:
 * 1. 类型安全(自动序列化/反序列化)
 * 2. 过期时间管理
 * 3. 加密存储(敏感数据)
 * 4. 命名空间隔离
 *
 * @module utils/storage
*/

// 存储key前缀(避免冲突)
const PREFIX = 'UNIAPP_';

// 默认过期时间(毫秒)
const DEFAULT_EXPIRE = 7 * 24 * 60 * 60 * 1000; // 7天

/**
 * 本地存储类
*/
class Storage {
constructor(namespace = '') {
 this.namespace = namespace ? `${PREFIX}${namespace}_` : PREFIX;
}

/**
 * 生成完整的存储key
 * @param {string} key - 原始key
 * @return {string} 带命名空间的key
*/
getFullKey(key) {
 return this.namespace + key;
}

/**
 * 设置数据 - 支持过期时间
 * @param {string} key - 存储键
 * @param {any} value - 存储值(自动序列化)
 * @param {number} expire - 过期时间(毫秒),0表示永久
 * @return {boolean} 是否成功
*/
set(key, value, expire = 0) {
 try {
 const fullKey = this.getFullKey(key);

 // [包装数据] 添加元信息
 const data = {
 value,
 createTime: Date.now(),
 expire: expire || 0
 };

 // [序列化存储]
 uni.setStorageSync(fullKey, JSON.stringify(data));
 return true;
 } catch (error) {
 console.error('Storage set error:', error);
 return false;
 }
}

/**
 * 获取数据 - 自动检查过期
 * @param {string} key - 存储键
 * @param {any} defaultValue - 默认值(不存在或过期时返回)
 * @return {any} 存储的值
*/
get(key, defaultValue = null) {
 try {
 const fullKey = this.getFullKey(key);
 const dataStr = uni.getStorageSync(fullKey);

 // [不存在]
 if (!dataStr) {
 return defaultValue;
 }

 // [反序列化]
 const data = JSON.parse(dataStr);

 // [检查过期] expire为0表示永久
 if (data.expire !== 0) {
 const now = Date.now();
 const isExpired = now - data.createTime > data.expire;

 if (isExpired) {
 // 过期则删除
 this.remove(key);
 return defaultValue;
 }
 }

 return data.value;
 } catch (error) {
 console.error('Storage get error:', error);
 return defaultValue;
 }
}

/**
 * 删除数据
 * @param {string} key - 存储键
 * @return {boolean} 是否成功
*/
remove(key) {
 try {
 const fullKey = this.getFullKey(key);
 uni.removeStorageSync(fullKey);
 return true;
 } catch (error) {
 console.error('Storage remove error:', error);
 return false;
 }
}

/**
 * 清空所有数据(仅清空当前命名空间)
 * @return {boolean} 是否成功
*/
clear() {
 try {
 const info = uni.getStorageInfoSync();
 const keys = info.keys;

 // [批量删除] 只删除当前命名空间的key
 keys.forEach(key => {
 if (key.startsWith(this.namespace)) {
 uni.removeStorageSync(key);
 }
 });

 return true;
 } catch (error) {
 console.error('Storage clear error:', error);
 return false;
 }
}

/**
 * 检查key是否存在且未过期
 * @param {string} key - 存储键
 * @return {boolean}
*/
has(key) {
 const value = this.get(key, undefined);
 return value !== undefined;
}

/**
 * 获取所有存储的key(当前命名空间)
 * @return {Array<string>} key列表
*/
keys() {
 try {
 const info = uni.getStorageInfoSync();
 return info.keys
 .filter(key => key.startsWith(this.namespace))
 .map(key => key.replace(this.namespace, ''));
 } catch (error) {
 console.error('Storage keys error:', error);
 return [];
 }
}

/**
 * 获取存储信息(当前占用空间等)
 * @return {Object} {currentSize, limitSize, keys}
*/
getInfo() {
 try {
 const info = uni.getStorageInfoSync();
 const namespaceKeys = info.keys.filter(key =>
 key.startsWith(this.namespace)
 );

 return {
 currentSize: info.currentSize, // KB
 limitSize: info.limitSize, // KB
 keys: namespaceKeys.length
 };
 } catch (error) {
 console.error('Storage getInfo error:', error);
 return {
 currentSize: 0,
 limitSize: 0,
 keys: 0
 };
 }
}

/**
 * 设置对象(便捷方法)
 * @param {string} key
 * @param {Object} value
 * @param {number} expire
*/
setObject(key, value, expire = 0) {
 return this.set(key, value, expire);
}

/**
 * 获取对象(便捷方法)
 * @param {string} key
 * @param {Object} defaultValue
 * @return {Object}
*/
getObject(key, defaultValue = {}) {
 return this.get(key, defaultValue);
}

/**
 * 设置数组(便捷方法)
 * @param {string} key
 * @param {Array} value
 * @param {number} expire
*/
setArray(key, value, expire = 0) {
 return this.set(key, value, expire);
}

/**
 * 获取数组(便捷方法)
 * @param {string} key
 * @param {Array} defaultValue
 * @return {Array}
*/
getArray(key, defaultValue = []) {
 return this.get(key, defaultValue);
}

/**
 * 追加数组元素
 * @param {string} key
 * @param {any} item
 * @param {number} maxLength - 最大长度(超过则删除最早的)
*/
pushArray(key, item, maxLength = 0) {
 let arr = this.getArray(key);
 arr.push(item);

 // [限制长度]
 if (maxLength > 0 && arr.length > maxLength) {
 arr = arr.slice(-maxLength);
 }

 this.setArray(key, arr);
}

/**
 * 简易加密存储(敏感数据)
 * 注意:这只是简单混淆,不是真正的加密
 * @param {string} key
 * @param {any} value
*/
setSecure(key, value) {
 const encrypted = this.simpleEncrypt(JSON.stringify(value));
 return this.set(key, encrypted);
}

/**
 * 解密获取
 * @param {string} key
 * @param {any} defaultValue
*/
getSecure

---
## 🧑‍💻 User


上一次没生成完，继续生成

---
## 🤖 Assistant


好的,我继续完成 UniApp 架构文档的未完成部分:

```javascript
  /**
   * 解密获取
   * @param {string} key
   * @param {any} defaultValue
   */
  getSecure(key, defaultValue = null) {
    const encrypted = this.get(key);
    if (!encrypted) return defaultValue;
    
    try {
      const decrypted = this.simpleDecrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decrypt error:', error);
      return defaultValue;
    }
  }

  /**
   * 简单加密 - Base64 + 字符偏移
   * @param {string} str
   * @return {string}
   * @private
   */
  simpleEncrypt(str) {
    // [字符偏移] 每个字符ASCII码 +3
    let shifted = '';
    for (let i = 0; i < str.length; i++) {
      shifted += String.fromCharCode(str.charCodeAt(i) + 3);
    }
    // [Base64编码]
    return uni.base64Encode(shifted);
  }

  /**
   * 简单解密
   * @param {string} str
   * @return {string}
   * @private
   */
  simpleDecrypt(str) {
    // [Base64解码]
    const decoded = uni.base64Decode(str);
    // [字符偏移还原]
    let shifted = '';
    for (let i = 0; i < decoded.length; i++) {
      shifted += String.fromCharCode(decoded.charCodeAt(i) - 3);
    }
    return shifted;
  }
}

// 导出实例
export default new Storage();

// 导出带命名空间的实例(用于不同模块隔离)
export const createStorage = (namespace) => new Storage(namespace);

// 预定义的常用存储实例
export const userStorage = new Storage('USER');     // 用户数据
export const configStorage = new Storage('CONFIG'); // 配置数据
export const cacheStorage = new Storage('CACHE');   // 缓存数据
```

### 2.4 条件编译 - 跨平台代码管理

```javascript
/**
 * 条件编译示例 - 针对不同平台编写差异化代码
 * 
 * 语法:
 * // #ifdef PLATFORM
 * 平台特有代码
 * // #endif
 * 
 * // #ifndef PLATFORM
 * 除该平台外的代码
 * // #endif
 */

// ============ JavaScript 条件编译 ============

// [单平台判断]
// #ifdef APP-PLUS
console.log('这段代码只在 App 中执行');
const appVersion = plus.runtime.version;
// #endif

// #ifdef MP-WEIXIN
console.log('这段代码只在微信小程序中执行');
wx.getSystemInfo({
  success(res) {
    console.log(res.platform);
  }
});
// #endif

// #ifdef H5
console.log('这段代码只在 H5 中执行');
document.title = '修改浏览器标题';
// #endif

// [多平台判断 - 或关系]
// #ifdef APP-PLUS || MP-WEIXIN
console.log('App 或 微信小程序');
// #endif

// [排除平台]
// #ifndef H5
console.log('除了 H5 的所有平台');
// #endif

// [实际应用场景] 获取用户信息
function getUserProfile() {
  // #ifdef MP-WEIXIN
  // 微信小程序使用 wx.getUserProfile
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => resolve(res.userInfo),
      fail: reject
    });
  });
  // #endif
  
  // #ifdef APP-PLUS
  // App 使用 plus API
  return new Promise((resolve, reject) => {
    plus.oauth.getServices((services) => {
      const weixinService = services.find(s => s.id === 'weixin');
      weixinService.getUserInfo(
        () => resolve(weixinService.userInfo),
        (err) => reject(err)
      );
    });
  });
  // #endif
  
  // #ifdef H5
  // H5 从后端接口获取
  return request.get('/api/user/profile');
  // #endif
}

// ============ CSS 条件编译 ============

// 在 .vue 文件的 style 中
/*
<style>
/* #ifdef APP-PLUS */
.header {
  /* App 使用状态栏占位 */
  padding-top: var(--status-bar-height);
}
/* #endif */

/* #ifdef MP-WEIXIN */
.header {
  /* 小程序使用固定高度 */
  padding-top: 44px;
}
/* #endif */

/* #ifndef H5 */
/* 除 H5 外的所有平台 */
.container {
  height: 100vh;
}
/* #endif */
</style>
*/

// ============ HTML 条件编译 ============

// 在 .vue 文件的 template 中
/*
<template>
  <view>
    <!-- #ifdef APP-PLUS -->
    <view class="status-bar"></view>
    <!-- #endif -->
    
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="getUserInfo">微信登录</button>
    <!-- #endif -->
    
    <!-- #ifdef H5 -->
    <button @click="webLogin">网页登录</button>
    <!-- #endif -->
  </view>
</template>
*/

// ============ 平台标识列表 ============
/*
APP-PLUS        App
APP-PLUS-NVUE   App nvue 页面
H5              H5
MP-WEIXIN       微信小程序
MP-ALIPAY       支付宝小程序
MP-BAIDU        百度小程序
MP-TOUTIAO      字节跳动小程序
MP-QQ           QQ小程序
MP-KUAISHOU     快手小程序
MP              所有小程序
QUICKAPP-WEBVIEW 快应用通用
*/
```

### 2.5 生命周期系统

#### 应用生命周期 (App.vue)

```javascript
/**
 * App.vue - 应用入口,全局生命周期
 */
export default {
  /**
   * 应用初始化完成时触发(全局只触发一次)
   * 用途: 初始化全局配置、检查更新、加载字体等
   */
  onLaunch(options) {
    console.log('App Launch', options);
    
    // [获取启动参数]
    // options.path: 启动页面路径
    // options.query: 启动页面参数
    // options.scene: 启动场景值(小程序)
    
    // [全局初始化]
    this.initApp();
    
    // #ifdef APP-PLUS
    // App 检查更新
    this.checkUpdate();
    // #endif
  },

  /**
   * 应用显示时触发(从后台切换到前台)
   */
  onShow(options) {
    console.log('App Show', options);
    
    // [刷新token] 检查登录状态
    this.refreshToken();
    
    // [更新数据] 获取最新通知等
    this.fetchNotifications();
  },

  /**
   * 应用隐藏时触发(从前台切换到后台)
   */
  onHide() {
    console.log('App Hide');
    
    // [保存状态] 持久化必要数据
    this.saveAppState();
    
    // [清理资源] 停止音频、视频等
    this.cleanupResources();
  },

  /**
   * 应用报错时触发
   * @param {string} error - 错误信息
   */
  onError(error) {
    console.error('App Error:', error);
    
    // [错误上报] 发送到监控平台
    this.reportError(error);
  },

  /**
   * 页面不存在时触发
   * @param {Object} options - 包含path、query等
   */
  onPageNotFound(options) {
    console.log('Page Not Found:', options);
    
    // [重定向] 跳转到首页或404页面
    uni.reLaunch({
      url: '/pages/index/index'
    });
  },

  /**
   * 系统主题改变时触发(仅App、H5)
   * @param {Object} theme - {theme: 'light' | 'dark'}
   */
  onThemeChange(theme) {
    console.log('Theme Change:', theme);
    
    // [更新主题]
    this.updateTheme(theme.theme);
  },

  methods: {
    /**
     * 初始化应用
     */
    initApp() {
      // [加载全局配置]
      const config = uni.getStorageSync('app_config') || {};
      this.$store.commit('setConfig', config);
      
      // [设置全局属性]
      uni.setStorageSync('app_version', '1.0.0');
      
      // [初始化第三方SDK]
      // #ifdef APP-PLUS
      // 初始化统计SDK
      // #endif
    },

    /**
     * 检查更新
     */
    checkUpdate() {
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, (info) => {
        const currentVersion = info.version;
        
        // 请求后端检查新版本
        request.get('/api/app/version').then(res => {
          if (res.version > currentVersion) {
            uni.showModal({
              title: '发现新版本',
              content: res.description,
              confirmText: '立即更新',
              success: (result) => {
                if (result.confirm) {
                  // 下载并安装新版本
                  this.downloadUpdate(res.downloadUrl);
                }
              }
            });
          }
        });
      });
      // #endif
    },

    /**
     * 刷新token
     */
    refreshToken() {
      const token = uni.getStorageSync('token');
      const refreshToken = uni.getStorageSync('refresh_token');
      
      if (token && refreshToken) {
        // 检查token是否快过期,提前刷新
        request.post('/api/auth/refresh', { refreshToken })
          .then(res => {
            uni.setStorageSync('token', res.token);
          })
          .catch(err => {
            // token刷新失败,清除登录状态
            uni.removeStorageSync('token');
            uni.removeStorageSync('refresh_token');
          });
      }
    },

    /**
     * 错误上报
     */
    reportError(error) {
      // 发送到错误监控平台
      request.post('/api/log/error', {
        error: error.toString(),
        platform: this.getPlatform(),
        version: uni.getStorageSync('app_version'),
        timestamp: Date.now()
      }, { showLoading: false });
    }
  }
};
```

#### 页面生命周期

```javascript
/**
 * 页面生命周期 - 在页面 .vue 文件中使用
 */
export default {
  data() {
    return {
      list: []
    };
  },

  /**
   * 页面加载时触发(一次性)
   * @param {Object} options - 页面参数
   */
  onLoad(options) {
    console.log('Page Load', options);
    
    // [获取页面参数]
    const { id, type } = options;
    
    // [初始化数据]
    this.loadData(id);
    
    // [设置页面标题]
    uni.setNavigationBarTitle({
      title: '详情页'
    });
  },

  /**
   * 页面显示时触发(每次都触发)
   */
  onShow() {
    console.log('Page Show');
    
    // [刷新数据] 从其他页面返回时更新
    this.refreshData();
  },

  /**
   * 页面初次渲染完成时触发(一次性)
   */
  onReady() {
    console.log('Page Ready');
    
    // [操作DOM] 获取节点信息
    this.$nextTick(() => {
      uni.createSelectorQuery()
        .select('#container')
        .boundingClientRect(rect => {
          console.log('容器高度:', rect.height);
        })
        .exec();
    });
  },

  /**
   * 页面隐藏时触发
   */
  onHide() {
    console.log('Page Hide');
    
    // [暂停操作] 停止定时器、音频等
    this.pauseOperations();
  },

  /**
   * 页面卸载时触发
   */
  onUnload() {
    console.log('Page Unload');
    
    // [清理资源] 清除定时器、监听器等
    this.cleanup();
  },

  /**
   * 下拉刷新时触发(需在pages.json中开启)
   */
  onPullDownRefresh() {
    console.log('Pull Down Refresh');
    
    // [刷新数据]
    this.loadData().then(() => {
      // 停止下拉刷新
      uni.stopPullDownRefresh();
    });
  },

  /**
   * 页面滚动到底部时触发
   */
  onReachBottom() {
    console.log('Reach Bottom');
    
    // [加载更多]
    if (!this.loading && this.hasMore) {
      this.loadMore();
    }
  },

  /**
   * 页面滚动时触发
   * @param {Object} event - {scrollTop, scrollLeft}
   */
  onPageScroll(event) {
    // [吸顶效果] 根据滚动位置显示/隐藏元素
    this.showBackTop = event.scrollTop > 200;
    
    // [性能优化] 节流处理,避免频繁触发
  },

  /**
   * 用户点击右上角分享(仅小程序)
   * @return {Object} 分享配置
   */
  onShareAppMessage(options) {
    console.log('Share', options);
    
    // options.from: button(分享按钮) | menu(右上角菜单)
    // options.target: 分享按钮时存在
    
    return {
      title: '分享标题',
      path: '/pages/index/index?id=123',
      imageUrl: '/static/share.png'
    };
  },

  /**
   * 用户点击右上角分享到朋友圈(仅微信小程序)
   * @return {Object} 分享配置
   */
  onShareTimeline() {
    return {
      title: '分享到朋友圈',
      query: 'id=123',
      imageUrl: '/static/share.png'
    };
  },

  /**
   * 用户点击收藏(仅微信小程序)
   * @return {Object} 收藏配置
   */
  onAddToFavorites() {
    return {
      title: '收藏标题',
      imageUrl: '/static/share.png',
      query: 'id=123'
    };
  },

  /**
   * Tab切换时触发(仅tabBar页面)
   * @param {Object} event - {index, pagePath, text}
   */
  onTabItemTap(event) {
    console.log('Tab Item Tap', event);
  },

  /**
   * 窗口尺寸变化时触发
   * @param {Object} size - {windowWidth, windowHeight}
   */
  onResize(size) {
    console.log('Resize', size);
    
    // [响应式布局] 根据尺寸调整布局
    this.updateLayout(size);
  },

  methods: {
    /**
     * 加载数据
     */
    async loadData(id) {
      try {
        const res = await request.get(`/api/detail/${id}`);
        this.list = res.list;
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    },

    /**
     * 加载更多
     */
    async loadMore() {
      this.loading = true;
      try {
        const res = await request.get('/api/list', {
          page: this.page + 1
        });
        this.list.push(...res.list);
        this.page++;
        this.hasMore = res.hasMore;
      } finally {
        this.loading = false;
      }
    }
  }
};
```

## 三、核心功能详解

### 3.1 路由导航

| API方法 | 作用 | 参数 | 页面栈变化 | 使用场景 |
| -------------------- | ---------------------- | -------------------------- | --------------- | ------------------ |
| uni.navigateTo() | 保留当前页面,跳转到应用内某个页面 | url, success, fail等 | 新页面入栈 | 普通页面跳转,可返回 |
| uni.redirectTo() | 关闭当前页面,跳转到应用内某个页面 | url, success, fail等 | 当前页面出栈,新页面入栈 | 登录后跳转首页等 |
| uni.reLaunch() | 关闭所有页面,打开应用内某个页面 | url, success, fail等 | 清空页面栈,新页面入栈 | 切换账号、退出登录等 |
| uni.switchTab() | 跳转到 tabBar 页面,关闭其他非栈页面 | url, success, fail等 | 清空非tabBar页面 | Tab切换 |
| uni.navigateBack() | 关闭当前页面,返回上一页或多级页面 | delta(返回层数,默认1) | 当前页面出栈 | 返回操作 |
| uni.preloadPage() | 预加载页面 | url | 不影响页面栈 | 提前加载下一页,优化体验 |
| uni.unPreloadPage() | 取消预加载页面 | url | 不影响页面栈 | 取消之前的预加载 |
| getCurrentPages() | 获取当前页面栈 | 无 | 不影响页面栈 | 获取页面实例、判断页面层级等 |
| $EventBus | 跨页面通信(需自行实现) | emit(event, data), on等 | 不影响页面栈 | 页面间传递数据(非父子关系) |
| uni.setStorageSync() | 通过本地存储传递数据 | key, value | 不影响页面栈 | 页面间传递大量数据或复杂对象数据 |
| uni.getStorageSync() | 获取本地存储的数据 | key | 不影响页面栈 | 接收其他页面存储的数据 |
| uni.removeTabBarBadge() | 移除 tabBar 某一项右上角的文本 | index, success, fail等 | 不影响页面栈 | 清除tab角标 |
| uni.showTabBarRedDot() | 显示 tabBar 某一项的红点 | index, success, fail等 | 不影响页面栈 | 显示新消息提示 |
| uni.hideTabBarRedDot() | 隐藏 tabBar 某一项的红点 | index, success, fail等 | 不影响页面栈 | 隐藏消息提示 |

**路由传参完整示例:**

```javascript
// ============ 方式1: URL传参(简单数据) ============
// 跳转时传参
uni.navigateTo({
  url: '/pages/detail/detail?id=100&type=product'
});

// 目标页面接收
onLoad(options) {
  console.log(options.id);    // '100'
  console.log(options.type);  // 'product'
  
  // 注意: URL参数都是字符串类型,需要类型转换
  const id = parseInt(options.id);
}

// ============ 方式2: Storage传参(复杂数据) ============
// 跳转前存储
const orderData = {
  orderId: 100,
  goodsList: [{}, {}],
  totalPrice: 299.9
};
uni.setStorageSync('order_temp', orderData);
uni.navigateTo({
  url: '/pages/order/confirm'
});

// 目标页面接收
onLoad() {
  const orderData = uni.getStorageSync('order_temp');
  // 使用完记得清除
  uni.removeStorageSync('order_temp');
}

// ============ 方式3: EventBus传参(跨页面通信) ============
// 需要先实现EventBus
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// 在main.js中挂载
Vue.prototype.$bus = new EventBus();

// 页面A 监听
onLoad() {
  this.$bus.on('refreshData', (data) => {
    this.list = data;
  });
},
onUnload() {
  // 页面卸载时记得移除监听
  this.$bus.off('refreshData');
},

// 页面B 触发
methods: {
  updateData() {
    this.$bus.emit('refreshData', this.newData);
    uni.navigateBack();
  }
}

// ============ 方式4: Vuex状态管理(全局数据) ============
// store/index.js
export default new Vuex.Store({
  state: {
    tempData: null
  },
  mutations: {
    setTempData(state, data) {
      state.tempData = data;
    }
  }
});

// 页面A 存储
this.$store.commit('setTempData', data);
uni.navigateTo({
  url: '/pages/detail/detail'
});

// 页面B 获取
computed: {
  tempData() {
    return this.$store.state.tempData;
  }
}
```

## 四、核心知识点

### 4.1 编译原理

**UniApp的编译流程:**

1. **编译时处理**: 通过 webpack + babel 处理源码
 - 条件编译: 根据`#ifdef`等指令移除不需要的平台代码
 - 组件转换: 将Vue组件转换为各平台的组件格式
 - API转换: 将`uni.`API转换为对应平台的API

2. **运行时适配**: 不同平台加载不同的runtime
 - 小程序: 编译成小程序的WXML/WXSS + JS
 - App: 编译成Weex或nvue渲染
 - H5: 编译成标准Vue应用

### 4.2 渲染机制

**三种渲染方式:**

1. **WebView渲染** (默认)
 - 优点: 开发体验好,支持完整CSS
 - 缺点: 性能略低,复杂动画卡顿

2. **原生渲染** (nvue)
 - 优点: 性能接近原生,流畅度高
 - 缺点: CSS支持有限,部分特性不可用

3. **混合渲染** (推荐)
 - 列表页用nvue保证流畅
 - 详情页用vue灵活布局

### 4.3 最佳实践

**性能优化:**
- 使用`v-if`而不是`v-show`减少首屏渲染
- 长列表使用虚拟滚动
- 图片懒加载
- 分包加载(subPackages)

**代码规范:**
- 统一使用rpx单位(自动适配屏幕)
- 避免使用`*`选择器
- 事件处理函数加上`.stop`防止冒泡
- 异步操作统一用async/await

**安全注意:**
- 敏感信息不要存储在本地
- API请求加上token验证
- 用户输入做XSS过滤

## 五、应用场景

### 5.1 适用场景

- **多端发布需求**: 需要同时覆盖App、小程序、H5的项目
- **快速原型开发**: 利用Vue生态快速搭建MVP
- **内容展示类应用**: 电商、资讯、社交等
- **企业内部应用**: OA、CRM等管理系统

### 5.2 不适用场景

- **高性能游戏**: 需要复杂3D渲染,建议原生开发
- **复杂动画应用**: 需要大量Canvas操作
- **音视频编辑**: 需要底层硬件加速
- **极致性能要求**: 如高频交易、实时竞技类应用

**替代方案**: 对于不适用场景,可以考虑:
- 核心模块原生开发,其他用UniApp
- 使用Flutter等跨平台方案
- 针对主要平台做定制化开发

## 六、实战案例

### 完整电商首页实现

```vue
<template>
<view class="container">
 <!-- 自定义导航栏 -->
 <view class="nav-bar" :style="{paddingTop: statusBarHeight + 'px'}">
 <view class="search-box" @click="goSearch">
 <uni-icons type="search" size="20" color="#999"></uni-icons>
 <text>搜索商品</text>
 </view>
 </view>

 <!-- 轮播图 -->
 <swiper class="banner" indicator-dots :autoplay="true" :interval="3000">
 <swiper-item v-for="(item, index) in bannerList" :key="index">
 <image :src="item.image" mode="aspectFill" @click="goDetail(item.linkUrl)"></image>
 </swiper-item>
 </swiper>

 <!-- 分类入口 -->
 <view class="category-grid">
 <view class="category-item" v-for="item in categoryList" :key="item.id" @click="goCategory(item.id)">
 <image :src="item.icon" mode="aspectFill"></image>
 <text>{{item.name}}</text>
 </view>
 </view>

 <!-- 商品列表 -->
 <view class="goods-list">
 <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
 <image :src="item.image" mode="aspectFill"></image>
 <view class="goods-info">
 <text class="title">{{item.title}}</text>
 <view class="price-box">
 <text class="price">¥{{item.price}}</text>
 <text class="sales">已售{{item.sales}}件</text>
 </view>
 </view>
 </view>
 </view>

 <!-- 加载更多 -->
 <view class="loading-more">
 <text v-if="loading">加载中...</text>
 <text v-else-if="!hasMore">没有更多了</text>
 </view>
</view>
</template>

<script>
import request from '@/utils/request';

export default {
data() {
 return {
 statusBarHeight: 0, // 状态栏高度
 bannerList: [], // 轮播图列表
 categoryList: [], // 分类列表
 goodsList: [], // 商品列表
 page: 1, // 当前页码
 pageSize: 20, // 每页数量
 loading: false, // 加载中
 hasMore: true // 是否还有更多
 };
},

onLoad() {
 // [获取系统信息] 用于适配刘海屏等
 const systemInfo = uni.getSystemInfoSync();
 this.statusBarHeight = systemInfo.statusBarHeight;

 // [初始化数据]
 this.initData();
},

// [下拉刷新]
onPullDownRefresh() {
 this.page = 1;
 this.hasMore = true;
 this.goodsList = [];
 this.initData().then(() => {
 uni.stopPullDownRefresh();
 });
},

// [触底加载]
onReachBottom() {
 if (!this.loading && this.hasMore) {
 this.loadMore();
 }
},

// [分享配置]
onShareAppMessage() {
 return {
 title: '精选好物,低价优惠',

---
## 🧑‍💻 User


上一次没生成完，继续生成

---
## 🤖 Assistant


好的,我继续完成 UniApp 架构文档的未完成部分:

```vue
  // [分享配置]
  onShareAppMessage() {
    return {
      title: '精选好物,低价优惠',
      path: '/pages/index/index',
      imageUrl: '/static/share-banner.png'
    };
  },

  methods: {
    /**
     * 初始化数据 - 并发请求提升性能
     */
    async initData() {
      try {
        // [并发请求] 同时获取轮播图、分类、商品
        const [bannerRes, categoryRes, goodsRes] = await Promise.all([
          request.get('/api/banner/list'),
          request.get('/api/category/list'),
          this.loadGoods()
        ]);

        this.bannerList = bannerRes;
        this.categoryList = categoryRes;
      } catch (error) {
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    },

    /**
     * 加载商品列表
     */
    async loadGoods() {
      this.loading = true;
      try {
        const res = await request.get('/api/goods/list', {
          page: this.page,
          pageSize: this.pageSize
        });

        this.goodsList = res.list;
        this.hasMore = res.hasMore;
        return res;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 加载更多商品
     */
    async loadMore() {
      this.loading = true;
      this.page++;

      try {
        const res = await request.get('/api/goods/list', {
          page: this.page,
          pageSize: this.pageSize
        });

        // [数组合并] 追加新数据
        this.goodsList.push(...res.list);
        this.hasMore = res.hasMore;
      } catch (error) {
        // [加载失败] 恢复页码
        this.page--;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 跳转搜索页
     */
    goSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      });
    },

    /**
     * 跳转分类页
     */
    goCategory(categoryId) {
      uni.navigateTo({
        url: `/pages/category/category?id=${categoryId}`
      });
    },

    /**
     * 跳转商品详情
     */
    goGoodsDetail(goodsId) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${goodsId}`
      });
    },

    /**
     * 处理轮播图点击
     */
    goDetail(url) {
      if (!url) return;

      // [判断链接类型] 内部页面 or 外部链接
      if (url.startsWith('http')) {
        // #ifdef H5
        window.location.href = url;
        // #endif

        // #ifndef H5
        uni.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
        });
        // #endif
      } else {
        uni.navigateTo({ url });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// [自定义导航栏]
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  padding-bottom: 10rpx;

  .search-box {
    margin: 10rpx 20rpx;
    padding: 16rpx 24rpx;
    background-color: #f5f5f5;
    border-radius: 50rpx;
    display: flex;
    align-items: center;

    text {
      margin-left: 16rpx;
      font-size: 28rpx;
      color: #999;
    }
  }
}

// [轮播图]
.banner {
  width: 100%;
  height: 400rpx;
  margin-top: 88rpx; // 导航栏高度

  image {
    width: 100%;
    height: 100%;
  }
}

// [分类网格]
.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20rpx;
  padding: 30rpx 20rpx;
  background-color: #fff;

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
    }

    text {
      margin-top: 16rpx;
      font-size: 24rpx;
      color: #333;
    }
  }
}

// [商品列表]
.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;

  .goods-item {
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 340rpx;
    }

    .goods-info {
      padding: 20rpx;

      .title {
        display: -webkit-box;
        -webkit-line-clamp: 2; // 限制2行
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 28rpx;
        color: #333;
        line-height: 1.4;
      }

      .price-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16rpx;

        .price {
          font-size: 32rpx;
          color: #ff4d4f;
          font-weight: bold;
        }

        .sales {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

// [加载更多]
.loading-more {
  padding: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #999;
}
</style>
```

---

## 七、面试题库

### 7.1 基础概念题(10道)

#### 题目1:UniApp的条件编译是如何工作的?请写出微信小程序和H5平台的条件编译代码

```javascript
// [条件编译语法] 使用特殊注释标记

// 1. 单平台编译
// #ifdef MP-WEIXIN
console.log('这段代码只在微信小程序中执行');
wx.login({
  success() {
    // 微信小程序特有的登录逻辑
  }
});
// #endif

// #ifdef H5
console.log('这段代码只在H5中执行');
// H5特有的浏览器API
document.title = '修改网页标题';
// #endif

// 2. 多平台编译(或关系)
// #ifdef MP-WEIXIN || MP-ALIPAY
console.log('微信或支付宝小程序');
// #endif

// 3. 排除平台
// #ifndef H5
console.log('除H5外的所有平台');
// #endif

// 4. CSS中使用
/*
<style>
/* #ifdef MP-WEIXIN */
.header {
  padding-top: 44px; /* 小程序固定高度 */
}
/* #endif */

/* #ifdef H5 */
.header {
  padding-top: env(safe-area-inset-top); /* H5刘海屏适配 */
}
/* #endif */
</style>
*/

// 5. HTML模板中使用
/*
<template>
  <!-- #ifdef APP-PLUS -->
  <button @click="appLogin">App原生登录</button>
  <!-- #endif -->
  
  <!-- #ifdef MP-WEIXIN -->
  <button open-type="getUserInfo">微信授权登录</button>
  <!-- #endif -->
</template>
*/
```

**标准答案:**
1. **编译时处理**: 条件编译在打包时生效,通过webpack loader识别`#ifdef`等指令
2. **代码移除**: 不符合条件的代码会被完全移除,不会打包到最终产物中
3. **零运行时开销**: 不同于运行时判断`if(platform === 'h5')`,条件编译不影响性能
4. **支持嵌套**: 可以在条件编译块内再嵌套条件编译

**考察点:**
- 是否理解编译时 vs 运行时的区别
- 能否灵活运用条件编译解决平台差异
- 是否了解条件编译对包体积的影响

---

#### 题目2:解释UniApp中 pages.json 和 manifest.json 的区别及各自作用

**标准答案:**

**pages.json - 页面路由配置:**
- **作用**: 管理页面路由、窗口样式、tabBar等
- **核心配置**:
 - `pages`: 页面路径和样式配置(第一个为首页)
 - `globalStyle`: 全局默认窗口样式
 - `tabBar`: 底部导航栏配置
 - `condition`: 启动模式配置(仅开发期)
 - `subPackages`: 分包配置
 - `easycom`: 组件自动引入规则

**manifest.json - 应用配置:**
- **作用**: 配置应用名称、appid、版本号、平台特性等
- **核心配置**:
 - 应用基本信息(name, appid, version)
 - 各平台特有配置(app-plus, mp-weixin, h5等)
 - 权限配置(permissions)
 - SDK配置(地图、支付、分享等)
 - 打包参数

**关键区别:**
1. **职责不同**: pages.json管路由,manifest.json管应用
2. **变更影响**: pages.json变更可热更新,manifest.json需重新打包
3. **优先级**: manifest.json的平台配置会覆盖pages.json的全局配置

**考察点:**
- 是否清楚两个配置文件的职责边界
- 能否根据需求选择正确的配置文件
- 是否了解配置的优先级和覆盖规则

---

#### 题目3:UniApp中的生命周期有哪些?应用生命周期和页面生命周期有什么区别?

```javascript
// ============ 应用生命周期(App.vue) ============
export default {
  // [应用初始化] 全局只触发一次
  onLaunch(options) {
    // 用途: 初始化全局配置、检查更新、加载字体
    console.log('应用启动', options);
  },
  
  // [应用显示] 从后台切到前台时触发
  onShow(options) {
    // 用途: 刷新token、更新数据
    console.log('应用显示', options);
  },
  
  // [应用隐藏] 从前台切到后台时触发
  onHide() {
    // 用途: 保存状态、清理资源
    console.log('应用隐藏');
  },
  
  // [应用报错] 捕获全局错误
  onError(error) {
    // 用途: 错误上报、日志记录
    console.error('应用错误', error);
  }
};

// ============ 页面生命周期(页面.vue) ============
export default {
  // [页面加载] 一次性,获取页面参数
  onLoad(options) {
    // 用途: 接收路由参数、初始化数据
    const { id } = options;
  },
  
  // [页面显示] 每次显示都触发
  onShow() {
    // 用途: 刷新数据(从其他页面返回时)
  },
  
  // [页面初次渲染完成] 一次性
  onReady() {
    // 用途: 操作DOM、获取节点信息
  },
  
  // [页面隐藏] 页面被遮挡或切换
  onHide() {
    // 用途: 暂停定时器、音频等
  },
  
  // [页面卸载] 页面被销毁
  onUnload() {
    // 用途: 清理定时器、监听器
  },
  
  // [下拉刷新] 需在pages.json开启
  onPullDownRefresh() {
    // 用途: 刷新页面数据
  },
  
  // [触底加载]
  onReachBottom() {
    // 用途: 加载更多数据
  },
  
  // [页面滚动]
  onPageScroll(event) {
    // event.scrollTop: 滚动位置
    // 用途: 吸顶效果、显示返回顶部按钮
  },
  
  // [分享] 仅小程序
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index'
    };
  }
};
```

**核心区别:**

| 维度 | 应用生命周期 | 页面生命周期 |
| ------ | ---------------------- | --------------- |
| 定义位置 | App.vue | 页面.vue |
| 触发频率 | 应用级别(切换前后台) | 页面级别(页面显示/隐藏) |
| 作用范围 | 全局(所有页面共享) | 当前页面 |
| 典型用途 | 全局配置、token管理、错误监控 | 数据加载、DOM操作、交互响应 |
| 与Vue关系 | 独立于Vue生命周期 | 可与Vue生命周期混用 |

**考察点:**
- 是否理解应用级和页面级的区别
- 能否在合适的生命周期执行正确的操作
- 是否了解生命周期的触发时机和频率

---

#### 题目4:UniApp中如何实现页面间通信?请列举至少3种方式并说明适用场景

```javascript
// ============ 方式1: URL传参 ============
// 适用场景: 传递简单数据(字符串、数字)

// 发送方
uni.navigateTo({
  url: '/pages/detail/detail?id=100&type=product'
});

// 接收方
onLoad(options) {
  console.log(options.id);   // '100' (注意是字符串)
  console.log(options.type); // 'product'
  
  // 类型转换
  const id = parseInt(options.id);
}

// 缺点: 
// 1. 只能传字符串
// 2. URL长度限制
// 3. 数据暴露在URL中

// ============ 方式2: Storage传参 ============
// 适用场景: 传递复杂对象、大数据量

// 发送方
const orderData = {
  orderId: 100,
  goodsList: [{name: '商品1'}, {name: '商品2'}],
  totalPrice: 299.9
};
uni.setStorageSync('temp_order', orderData);
uni.navigateTo({
  url: '/pages/order/confirm'
});

// 接收方
onLoad() {
  const orderData = uni.getStorageSync('temp_order');
  console.log(orderData.goodsList); // 完整对象
  
  // 使用完记得清除
  uni.removeStorageSync('temp_order');
}

// 缺点:
// 1. 需要手动清理,容易遗漏
// 2. 异步场景可能出现数据覆盖

// ============ 方式3: EventBus事件总线 ============
// 适用场景: 跨页面通信(非父子关系)、回调刷新

// 实现EventBus
class EventBus {
  constructor() {
    this.events = {};
  }
  
  // 订阅事件
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  // 触发事件
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
  
  // 取消订阅
  off(event, callback) {
    if (!this.events[event]) return;
    if (callback) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    } else {
      delete this.events[event];
    }
  }
}

// 在main.js挂载
Vue.prototype.$bus = new EventBus();

// 页面A: 监听事件
onLoad() {
  this.$bus.on('refreshData', (newData) => {
    this.list = newData;
    console.log('数据已更新');
  });
},
onUnload() {
  // 页面卸载时必须取消监听,防止内存泄漏
  this.$bus.off('refreshData');
},

// 页面B: 触发事件
methods: {
  saveData() {
    // 保存成功后通知页面A刷新
    this.$bus.emit('refreshData', this.newData);
    uni.navigateBack();
  }
}

// 优点: 解耦,适合复杂场景
// 缺点: 需注意内存泄漏(必须off)

// ============ 方式4: Vuex状态管理 ============
// 适用场景: 全局共享状态、多页面同步数据

// store/index.js
export default new Vuex.Store({
  state: {
    userInfo: null,
    cartCount: 0
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info;
    },
    updateCartCount(state, count) {
      state.cartCount = count;
    }
  },
  actions: {
    async fetchUserInfo({ commit }) {
      const res = await request.get('/api/user/info');
      commit('setUserInfo', res);
    }
  }
});

// 任意页面使用
computed: {
  userInfo() {
    return this.$store.state.userInfo;
  },
  cartCount() {
    return this.$store.state.cartCount;
  }
},
methods: {
  updateCart() {
    this.$store.commit('updateCartCount', 5);
  }
}

// 优点: 响应式、全局可用
// 缺点: 页面刷新数据丢失(需持久化)

// ============ 方式5: getCurrentPages获取页面实例 ============
// 适用场景: 直接调用上一页的方法

// 页面B: 获取上一页实例
methods: {
  goBack() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 上一页
    
    // 直接调用上一页的方法
    prevPage.$vm.refreshData();
    
    uni.navigateBack();
  }
}

// 页面A: 定义方法
methods: {
  refreshData() {
    console.log('被页面B调用了');
    this.loadData();
  }
}

// 缺点: 耦合度高,不推荐用于复杂场景
```

**方案对比:**

| 方式 | 适用场景 | 优点 | 缺点 |
| ------------ | ------- | ------ | ----------- |
| URL传参 | 简单数据 | 简单直接 | 类型限制、长度限制 |
| Storage传参 | 复杂对象 | 无限制 | 需手动清理、异步问题 |
| EventBus | 跨页面通信 | 解耦 | 需注意内存泄漏 |
| Vuex | 全局状态 | 响应式、统一 | 刷新丢失、学习成本 |
| getCurrentPages | 调用上一页方法 | 直接 | 耦合高、不推荐 |

**考察点:**
- 能否根据场景选择合适的通信方式
- 是否了解各种方式的优缺点
- 能否避免常见陷阱(内存泄漏、数据覆盖)

---

#### 题目5:解释 rpx、px、upx 的区别,以及UniApp中如何做屏幕适配?

```javascript
/**
 * 单位说明
 */

// 1. rpx (responsive pixel) - 响应式像素
// - UniApp默认单位
// - 规定屏幕宽度为 750rpx
// - 自动根据屏幕宽度缩放
// - 1rpx = 屏幕宽度 / 750

// 示例:
// iPhone 6屏幕宽度375px => 1rpx = 0.5px
// iPhone 6 Plus屏幕宽度414px => 1rpx = 0.552px

<style>
.box {
  width: 750rpx;  /* 占满屏幕宽度 */
  height: 200rpx; /* 自动适配 */
}
</style>

// 2. px (pixel) - 逻辑像素
// - CSS标准单位
// - 不会自动缩放
// - 适用于固定尺寸(如1px边框)

<style>
.border {
  border: 1px solid #eee; /* 固定1px,不缩放 */
}
</style>

// 3. upx - UniApp旧版本单位(已废弃)
// - 与rpx完全相同
// - 为了兼容保留,新项目统一用rpx

/**
 * 屏幕适配方案
 */

// ============ 方案1: 使用rpx(推荐) ============
<template>
  <view class="container">
    <view class="box">自动适配</view>
  </view>
</template>

<style>
.container {
  width: 750rpx;  /* 100%屏幕宽度 */
  padding: 30rpx; /* 自动适配内边距 */
}

.box {
  width: 690rpx;  /* 750 - 30*2 */
  height: 200rpx;
  font-size: 28rpx; /* 字体也用rpx */
}
</style>

// ============ 方案2: 动态计算(复杂场景) ============
<script>
export default {
  data() {
    return {
      windowWidth: 375, // 屏幕宽度
      windowHeight: 667 // 屏幕高度
    };
  },
  
  onLoad() {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync();
    this.windowWidth = systemInfo.windowWidth;
    this.windowHeight = systemInfo.windowHeight;
    
    // 动态计算高度(如根据宽高比)
    this.boxHeight = this.windowWidth * 0.5; // 宽高比2:1
  },
  
  computed: {
    // 将px转为rpx
    toRpx() {
      return (px) => {
        return px * 750 / this.windowWidth;
      };
    }
  }
};
</script>

// ============ 方案3: 安全区域适配(刘海屏) ============
<template>
  <view class="page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{height: statusBarHeight + 'px'}"></view>
    
    <!-- 内容区域 -->
    <view class="content">
      内容
    </view>
    
    <!-- 底部安全区域 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0, // 状态栏高度
      safeAreaBottom: 0   // 底部安全区域高度
    };
  },
  
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    
    // 状态栏高度
    this.statusBarHeight = systemInfo.statusBarHeight;
    
    // 底部安全区域(iPhone X及以上)
    // screenHeight - safeArea.bottom
    this.safeAreaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
  }
};
</script>

<style>
.page {
  min-height: 100vh;
}

/* 底部安全区域 */
.safe-bottom {
  /* 使用CSS变量更优雅 */
  height: constant(safe-area-inset-bottom); /* iOS < 11.2 */
  height: env(safe-area-inset-bottom);      /* iOS >= 11.2 */
}

/* 或使用padding */
.bottom-button {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

// ============ 方案4: 横竖屏适配 ============
<script>
export default {
  data() {
    return {
      isLandscape: false // 是否横屏
    };
  },
  
  onLoad() {
    this.checkOrientation();
  },
  
  // 监听窗口尺寸变化
  onResize() {
    this.checkOrientation();
  },
  
  methods: {
    checkOrientation() {
      const systemInfo = uni.getSystemInfoSync();
      this.isLandscape = systemInfo.windowWidth > systemInfo.windowHeight;
    }
  }
};
</script>

<style>
/* 根据横竖屏调整布局 */
.container {
  display: flex;
  flex-direction: column; /* 竖屏默认纵向 */
}

/* 横屏布局 */
@media (orientation: landscape) {
  .container {
    flex-direction: row; /* 横屏改为横向 */
  }
}
</style>
```

**最佳实践:**
1. **布局使用rpx**: 宽度、高度、边距、字体等都用rpx
2. **边框使用px**: 1px边框不缩放,更清晰
3. **固定元素用px**: 如状态栏高度、tabBar高度
4. **设计稿转换**: 设计稿750px宽度,直接使用设计稿数值作为rpx

**考察点:**
- 是否理解rpx的自适应原理
- 能否处理刘海屏等特殊场景
- 是否了解不同单位的适用场景

---

#### 题目6:UniApp的请求封装应该包含哪些功能?请实现一个完整的请求拦截器

这个题目在前面的**2.3 核心API封装**部分已经给出了完整实现,这里补充考察点:

**标准答案:**
请求封装应包含的核心功能:
1. **统一配置**: baseURL、timeout、默认header
2. **请求拦截**: token注入、参数处理、去重
3. **响应拦截**: 统一数据格式、错误处理
4. **Loading管理**: 自动显示/隐藏加载提示
5. **错误分类**: HTTP错误 vs 业务错误
6. **重试机制**: 网络失败自动重试
7. **取消请求**: 避免重复请求
8. **文件上传/下载**: 特殊处理

**考察点:**
- 能否设计完整的请求拦截流程
- 是否考虑了边界情况(超时、取消、重试)
- 能否优雅处理不同类型的错误
- 是否了解请求去重的必要性

---

#### 题目7:什么是nvue?它与vue页面有什么区别?什么场景下应该使用nvue?

```javascript
/**
 * nvue (native vue) - 原生渲染页面
 *
 * 核心特点:
 * 1. 使用原生渲染引擎(Weex)而非WebView
 * 2. 性能接近原生应用
 * 3. CSS支持有限
*/

// ============ vue vs nvue 对比 ============

/*
| 维度 | vue页面 | nvue页面 |
|------------|-------------------|------------------|
| 渲染引擎 | WebView | 原生(Weex) |
| 性能 | 一般 | 接近原生 |
| CSS支持 | 完整 | 有限(Flexbox为主) |
| 动画 | 可能卡顿 | 流畅 |
| 开发难度 | 简单 | 需了解限制 |

---
## 🧑‍💻 User


上一次没生成完，继续生成

---
## 🤖 Assistant


好的,我继续完成 UniApp 架构文档的未完成部分:

```javascript
// ============ vue vs nvue 对比 ============

/*
| 维度       | vue页面            | nvue页面         |
|------------|-------------------|------------------|
| 渲染引擎    | WebView           | 原生(Weex)       |
| 性能       | 一般               | 接近原生          |
| CSS支持    | 完整               | 有限(Flexbox为主) |
| 动画       | 可能卡顿           | 流畅              |
| 开发难度    | 简单               | 需了解限制        |
| 文件大小    | 较小               | 较大              |
| 适用场景    | 常规页面           | 高性能需求页面     |
*/

// ============ nvue的限制 ============

// 1. 只支持 Flexbox 布局
// ❌ 错误: 不支持的CSS
<style>
.box {
  display: grid;        /* 不支持 */
  float: left;          /* 不支持 */
  position: absolute;   /* 不支持 */
}
</style>

// ✅ 正确: 使用 Flexbox
<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

// 2. 不支持百分比单位,必须用固定值
// ❌ 错误
<style>
.box {
  width: 50%;  /* 不支持 */
}
</style>

// ✅ 正确: 动态计算
<template>
  <view :style="{width: boxWidth + 'px'}"></view>
</template>

<script>
export default {
  data() {
    return {
      boxWidth: 0
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.boxWidth = systemInfo.windowWidth * 0.5; // 50%宽度
  }
};
</script>

// 3. 不支持背景图片,需用 <image> 标签
// ❌ 错误
<style>
.header {
  background-image: url('/static/bg.png'); /* 不支持 */
}
</style>

// ✅ 正确
<template>
  <view class="header">
    <image class="bg-image" src="/static/bg.png" mode="aspectFill"></image>
    <view class="content">内容</view>
  </view>
</template>

<style>
.header {
  position: relative;
}
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 300rpx;
}
.content {
  position: relative;
  z-index: 1;
}
</style>

// ============ 适用场景 ============

/**
 * 应该使用 nvue 的场景:
 */

// 1. 长列表页面(商品列表、聊天记录等)
// nvue使用原生的 list 组件,支持上万条数据流畅滚动
<template>
  <list class="list">
    <cell v-for="item in goodsList" :key="item.id">
      <view class="goods-item">
        <image :src="item.image"></image>
        <text>{{item.title}}</text>
      </view>
    </cell>
  </list>
</template>

// 2. 视频播放页面
// nvue的video组件性能更好,层级问题更少
<template>
  <video 
    :src="videoUrl" 
    controls 
    :style="{width: '750rpx', height: '400rpx'}">
  </video>
</template>

// 3. 地图页面
// nvue的map组件使用原生地图,性能更好
<template>
  <map 
    :latitude="latitude" 
    :longitude="longitude" 
    :markers="markers"
    :style="{width: '750rpx', height: '1000rpx'}">
  </map>
</template>

// 4. 复杂动画页面
// nvue支持更流畅的动画效果
<template>
  <view 
    ref="animBox"
    class="anim-box"
    @click="startAnimation">
  </view>
</template>

<script>
const animation = uni.requireNativePlugin('animation');

export default {
  methods: {
    startAnimation() {
      animation.transition(this.$refs.animBox, {
        styles: {
          transform: 'translateX(100px)',
          opacity: 0.5
        },
        duration: 300,
        timingFunction: 'ease-out'
      });
    }
  }
};
</script>

/**
 * 不应该使用 nvue 的场景:
 */

// 1. 表单页面 - vue的表单组件更丰富
// 2. 富文本展示 - nvue不支持rich-text组件
// 3. 复杂布局 - nvue的CSS限制多
// 4. 需要大量DOM操作 - nvue操作DOM性能不如vue
```

**标准答案:**

**nvue(native vue)核心特点:**
1. **渲染引擎**: 使用Weex原生渲染,绕过WebView
2. **性能优势**: 页面初始化快、滚动流畅、动画不卡顿
3. **开发限制**: CSS子集(仅Flexbox)、不支持百分比、无背景图

**使用场景:**
- ✅ **长列表**(商品列表、聊天记录):原生list组件性能极佳
- ✅ **视频页面**:原生video层级问题少
- ✅ **地图应用**:原生map组件流畅度高
- ✅ **复杂动画**:支持BindingX等高性能动画方案
- ❌ **表单页面**:vue组件更丰富
- ❌ **富文本**:nvue不支持
- ❌ **复杂布局**:CSS限制多

**考察点:**
- 是否理解nvue的底层原理(Weex)
- 能否根据场景选择vue还是nvue
- 是否了解nvue的CSS限制
- 能否用nvue实现高性能列表

---

#### 题目8:UniApp如何实现分包加载?分包的好处是什么?

```javascript
/**
 * 分包配置 - pages.json
 */
{
  "pages": [
    // 主包页面(必须包含首页)
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/user/user",
      "style": {
        "navigationBarTitleText": "我的"
      }
    }
  ],
  
  // 分包配置
  "subPackages": [
    {
      "root": "subPkg/goods",  // 分包根目录
      "pages": [
        {
          "path": "list/list",   // 完整路径: subPkg/goods/list/list
          "style": {
            "navigationBarTitleText": "商品列表"
          }
        },
        {
          "path": "detail/detail",
          "style": {
            "navigationBarTitleText": "商品详情"
          }
        }
      ]
    },
    {
      "root": "subPkg/order",
      "pages": [
        {
          "path": "list/list",
          "style": {
            "navigationBarTitleText": "订单列表"
          }
        }
      ]
    }
  ],
  
  // 预下载配置(可选)
  "preloadRule": {
    // 进入首页时预下载商品分包
    "pages/index/index": {
      "network": "all",  // all:不限网络 | wifi:仅wifi
      "packages": ["subPkg/goods"]  // 要预下载的分包
    }
  }
}

/**
 * 文件结构
 */
/*
project/
├── pages/                 # 主包
│   ├── index/
│   │   └── index.vue
│   └── user/
│       └── user.vue
├── subPkg/                # 分包根目录
│   ├── goods/             # 商品分包
│   │   ├── list/
│   │   │   └── list.vue
│   │   └── detail/
│   │       └── detail.vue
│   └── order/             # 订单分包
│       └── list/
│           └── list.vue
└── pages.json
*/

/**
 * 跳转分包页面
 */
// 跳转到分包页面的方式与普通页面一致
uni.navigateTo({
  url: '/subPkg/goods/list/list?categoryId=100'
});

// 分包页面之间互相跳转
uni.navigateTo({
  url: '/subPkg/goods/detail/detail?id=200'
});

// 分包页面跳转主包页面
uni.switchTab({
  url: '/pages/index/index'
});

/**
 * 分包大小限制
 */
// 小程序平台:
// - 整个小程序所有分包大小不超过 20M(主包 + 所有分包)
// - 单个分包/主包大小不能超过 2M

// App平台:
// - 无大小限制

/**
 * 独立分包(仅小程序支持)
 */
{
  "subPackages": [
    {
      "root": "subPkg/activity",
      "pages": [
        {
          "path": "detail/detail",
          "style": {
            "navigationBarTitleText": "活动详情"
          }
        }
      ],
      // 标记为独立分包
      "independent": true
    }
  ]
}

/**
 * 独立分包特点:
 * 1. 可以独立于主包运行
 * 2. 不能依赖主包和其他分包的内容
 * 3. 用于做分享落地页、营销活动页等
 */

// 通过scheme打开独立分包页面(无需下载主包)
// weixin://dl/business/?t=xxx&appid=xxx&path=subPkg/activity/detail/detail

/**
 * 分包预下载策略
 */
{
  "preloadRule": {
    // 首页预下载商品分包
    "pages/index/index": {
      "network": "all",
      "packages": ["subPkg/goods"]
    },
    
    // 进入商品列表时预下载订单分包
    "subPkg/goods/list/list": {
      "network": "wifi",  // 仅wifi预下载
      "packages": ["subPkg/order"]
    }
  }
}

/**
 * 动态判断分包是否加载
 */
// 使用 uni.getSystemInfo 判断
uni.getSystemInfo({
  success(res) {
    // res.platform: 平台信息
    // 小程序环境可通过分包加载接口判断
  }
});

// 小程序专用API(仅微信小程序)
// #ifdef MP-WEIXIN
wx.loadSubpackage({
  name: 'subPkg/goods', // 分包根路径
  success(res) {
    console.log('分包加载成功');
  },
  fail(err) {
    console.error('分包加载失败', err);
  }
});
// #endif
```

**分包的好处:**

1. **提升首屏加载速度**
 - 主包只包含首页等核心功能
 - 其他功能按需加载
 - 小程序冷启动时间减少50%以上

2. **突破包体积限制**
 - 小程序主包限制2M,通过分包可达20M
 - 复杂应用也能在小程序平台运行

3. **优化用户体验**
 - 预下载机制:用户访问前提前加载
 - 独立分包:分享落地页无需下载主包

4. **代码组织更清晰**
 - 按功能模块划分
 - 团队协作时减少冲突

**分包策略建议:**

```javascript
// 按使用频率划分
主包: 首页、用户中心、常用功能
分包1: 商品相关(列表、详情、搜索)
分包2: 订单相关(订单列表、详情、支付)
分包3: 营销活动(秒杀、拼团、优惠券)

// 按业务模块划分
主包: 核心框架、通用组件
分包1: 电商模块
分包2: 社区模块
分包3: 直播模块
```

**考察点:**
- 是否了解分包的配置方式
- 能否根据业务合理规划分包
- 是否知道独立分包的特殊用途
- 能否利用预下载优化体验

---

#### 题目9:UniApp中如何处理跨域问题?H5和小程序的解决方案有何不同?

```javascript
/**
 * 跨域问题分析
 */

// 跨域只存在于H5平台,小程序和App没有跨域限制

// ============ H5平台解决方案 ============

// 方案1: 开发环境 - 配置代理(推荐)
// manifest.json -> h5配置
{
  "h5": {
    "devServer": {
      "port": 8080,
      "proxy": {
        // 拦截 /api 开头的请求
        "/api": {
          "target": "https://api.example.com",  // 目标服务器
          "changeOrigin": true,                  // 改变请求源
          "pathRewrite": {
            "^/api": ""  // 重写路径: /api/user -> /user
          }
        },
        // 多个代理
        "/upload": {
          "target": "https://upload.example.com",
          "changeOrigin": true
        }
      }
    }
  }
}

// 请求时使用相对路径
request.get('/api/user/info');  // 开发环境代理到 https://api.example.com/user/info

// 方案2: 生产环境 - 后端配置CORS
// 后端需添加响应头(Node.js示例)
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // 或指定域名
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
*/

// 方案3: 生产环境 - Nginx反向代理
/*
server {
    listen 80;
    server_name www.example.com;
    
    location / {
        root /www/h5;  # H5静态文件目录
        try_files $uri $uri/ /index.html;
    }
    
    # API请求转发
    location /api/ {
        proxy_pass https://api.example.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
*/

// 方案4: JSONP(仅GET请求,已过时)
// 不推荐使用,有安全隐患

// ============ 小程序平台 ============

// 小程序没有跨域限制,但需要配置合法域名

/**
 * 步骤1: 后台配置服务器域名
 * 
 * 微信小程序:
 * 1. 登录微信公众平台
 * 2. 开发 -> 开发管理 -> 开发设置 -> 服务器域名
 * 3. 添加 request合法域名、uploadFile合法域名等
 * 
 * 注意:
 * - 必须是 https 协议
 * - 域名需备案
 * - 最多配置20个域名
 */

/**
 * 步骤2: 开发环境跳过域名校验
 * 
 * 微信开发者工具:
 * 右上角 详情 -> 本地设置 -> 不校验合法域名
 */

// ============ App平台 ============

// App没有跨域限制,可直接请求任何接口
request.get('https://api.example.com/user/info');

// ============ 统一处理方案 ============

/**
 * 封装请求时根据平台自动处理
 */
class Request {
  constructor() {
    // 根据平台设置baseURL
    this.baseURL = this.getBaseURL();
  }
  
  getBaseURL() {
    // #ifdef H5
    // H5开发环境使用代理,生产环境使用相对路径或同域API
    if (process.env.NODE_ENV === 'development') {
      return '/api';  // 开发环境走代理
    } else {
      return 'https://api.example.com';  // 生产环境
    }
    // #endif
    
    // #ifdef MP-WEIXIN
    // 小程序直接使用完整域名
    return 'https://api.example.com';
    // #endif
    
    // #ifdef APP-PLUS
    // App直接使用完整域名
    return 'https://api.example.com';
    // #endif
  }
}

/**
 * 环境变量配置(推荐)
 */
// 创建 .env.development 文件
/*
VUE_APP_BASE_API=/api
*/

// 创建 .env.production 文件
/*
VUE_APP_BASE_API=https://api.example.com
*/

// 使用环境变量
const BASE_URL = process.env.VUE_APP_BASE_API;

request.get(`${BASE_URL}/user/info`);
```

**平台对比:**

| 平台 | 跨域问题 | 解决方案 | 注意事项 |
| ------- | ------ | --------------------- | ------------- |
| H5 | 有跨域限制 | 代理/CORS/Nginx | 开发/生产环境分别配置 |
| 小程序 | 无跨域,但需配置合法域名 | 后台配置合法域名 | 必须https,需备案 |
| App | 无跨域限制 | 直接请求 | 无限制 |

**标准答案:**

**H5跨域解决方案:**
1. **开发环境**: manifest.json配置devServer代理
2. **生产环境**: 后端配置CORS 或 Nginx反向代理
3. **最佳实践**: 使用环境变量区分开发/生产环境的baseURL

**小程序解决方案:**
1. 小程序没有跨域概念,但需在后台配置合法域名
2. 开发时可在开发者工具中跳过域名校验
3. 域名必须https且已备案

**App解决方案:**
1. App无跨域限制,可直接请求任何域名
2. 注意处理证书验证问题

**考察点:**
- 是否理解跨域的本质(浏览器同源策略)
- 能否根据平台选择正确的解决方案
- 是否了解生产环境和开发环境的不同配置
- 能否封装统一的请求方法适配多端

---

#### 题目10:解释UniApp中的easycom是什么?它解决了什么问题?

```javascript
/**
 * easycom - 组件自动引入
 * 
 * 传统方式使用组件:
 */

// ❌ 繁琐的传统方式
<template>
  <view>
    <my-button>按钮</my-button>
    <my-input v-model="value"></my-input>
  </view>
</template>

<script>
// 每次使用都要导入和注册
import MyButton from '@/components/my-button/my-button.vue';
import MyInput from '@/components/my-input/my-input.vue';

export default {
  components: {
    MyButton,
    MyInput
  },
  data() {
    return {
      value: ''
    };
  }
};
</script>

/**
 * easycom方式(自动引入):
 */

// ✅ 配置easycom规则 - pages.json
{
  "easycom": {
    "autoscan": true,  // 是否自动扫描components目录
    "custom": {
      // 规则: 正则匹配 -> 组件路径
      // ^组件名称$ -> 组件路径
      
      // 匹配 my- 开头的组件
      "^my-(.*)": "@/components/my-$1/my-$1.vue",
      
      // 匹配 uni- 开头的组件(uni-ui)
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
      
      // 匹配 van- 开头的组件(vant-weapp)
      "^van-(.*)": "@/wxcomponents/vant/dist/$1/index"
    }
  }
}

// ✅ 直接使用,无需import和注册
<template>
  <view>
    <!-- 自动识别并引入 @/components/my-button/my-button.vue -->
    <my-button>按钮</my-button>
    
    <!-- 自动识别并引入 @/components/my-input/my-input.vue -->
    <my-input v-model="value"></my-input>
    
    <!-- 自动识别并引入 uni-ui 组件 -->
    <uni-icons type="search" size="20"></uni-icons>
  </view>
</template>

<script>
export default {
  // 无需 import 和 components 注册
  data() {
    return {
      value: ''
    };
  }
};
</script>

/**
 * easycom规则详解
 */

// 1. 默认规则(autoscan: true)
// 自动扫描 components 目录下符合 `组件名称/组件名称.vue` 的组件
/*
components/
├── my-button/
│   └── my-button.vue     ✅ 自动识别
├── my-input/
│   └── my-input.vue      ✅ 自动识别
└── common/
    └── header.vue          ❌ 不符合规则,不自动识别
*/

// 2. 自定义规则
{
  "easycom": {
    "custom": {
      // 规则1: 匹配 my- 开头
      // <my-button> -> @/components/my-button/my-button.vue
      "^my-(.*)": "@/components/my-$1/my-$1.vue",
      
      // 规则2: 匹配特定组件
      // <common-header> -> @/components/common/header.vue
      "^common-header$": "@/components/common/header.vue",
      
      // 规则3: 匹配第三方组件库
      // <uni-icons> -> @dcloudio/uni-ui/lib/uni-icons/uni-icons.vue
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  }
}

/**
 * easycom的优势
 */

// 1. 减少代码量
// 传统方式: 3行import + 3行components注册 = 6行
// easycom: 0行

// 2. 按需编译
// 只有页面中使用的组件才会被打包,未使用的不会打包
// 自动tree-shaking,减小包体积

// 3. 开发体验好
// 无需手动维护import路径
// 组件改名/移动位置时,只需调整easycom规则

/**
 * easycom注意事项
 */

// 1. 命名冲突
// 如果多个规则匹配同一个组件名,后面的规则会覆盖前面的
{
  "easycom": {
    "custom": {
      "^my-button$": "@/components/my-button/my-button.vue",
      "^my-button$": "@/components/other/button.vue"  // 会覆盖上面的
    }
  }
}

// 2. 性能影响
// autoscan会扫描整个components目录,组件很多时可能影响启动速度
// 建议: 组件<100个用autoscan,>100个用custom规则

// 3. 动态组件无效
// easycom是编译时处理,动态组件需要手动import
<component :is="dynamicComponent"></component>  // ❌ easycom无效

// 需要手动import
import ComponentA from '@/components/component-a.vue';

/**
 * 实战案例:配置uni-ui组件库
 */

// 1. 安装uni-ui
// npm install @dcloudio/uni-ui

// 2. 配置easycom
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  }
}

// 3. 直接使用,无需import
<template>
  <view>
    <uni-card title="标题" extra="额外信息">
      <text>卡片内容</text>
    </uni-card>
    
    <uni-list>
      <uni-list-item title="列表项1"></uni-list-item>
      <uni-list-item title="列表项2"></uni-list-item>
    </uni-list>
    
    <uni-icons type="heart" size="30" color="red"></uni-icons>
  </view>
</template>
```

**标准答案:**

**easycom是什么:**
- UniApp的组件自动引入机制
- 无需import和components注册即可使用组件
- 编译时根据模板中的组件名自动引入

**解决的问题:**
1. **减少重复代码**: 不用每个页面都import和注册
2. **按需编译**: 只打包使用的组件,减小包体积
3. **提升开发效率**: 改名/移动组件无需修改每个引用处
4. **统一管理**: 第三方组件库统一配置规则

**工作原理:**
1. 编译时扫描模板中的组件
2. 根据easycom规则匹配组件路径
3. 自动生成import和components代码
4. 未使用的组件不会打包

**考察点:**
- 是否理解easycom的编译时特性
- 能否正确配置自定义规则
- 是否了解easycom与传统组件注册的区别
- 能否利用easycom优化项目结构

---

### 7.2 业务逻辑题(10道)

#### 题目1:在电商项目中,需要实现购物车功能,要求多端数据同步(App、H5、小程序),如何设计数据存储和同步方案?

```javascript
/**
 * 购物车数据同步方案
 *
 * 需求分析:
 * 1. 数据持久化(不能刷新就丢失)
 * 2. 多端同步(App添加,H5也能看到)
 * 3. 离线可用(无网络时也能查看/修改)
 * 4. 冲突处理(同时在不同端修改)
*/

// ============ 方案设计 ============

/**
 * 数据结构设计
*/
// store/modules/cart.js
const state = {
list: [], // 购物车列表
lastSyncTime: 0, // 最后同步时间
version: 0 // 数据版本号(用于冲突检测)
};

const mutations = {
// 设置购物车列表
SET_CART_LIST(state, list) {
 state.list = list;
},

// 添加商品
ADD_GOODS(state, goods) {
 const existItem = state.list.find(item => item.id === goods.id && item.skuId === goods.skuId);

 if (existItem) {
 // 已存在则数量+1
 existItem.num += goods.num || 1;
 } else {
 // 不存在则添加
 state.list.push({
 id: goods.id,
 skuId: goods.

---
## 🧑‍💻 User


上一次没生成完，继续生成

---
## 🤖 Assistant


好的,我继续完成 UniApp 架构文档的**业务逻辑题**部分:

---

#### 题目1:在电商项目中,需要实现购物车功能,要求多端数据同步(App、H5、小程序),如何设计数据存储和同步方案?

```javascript
/**
 * 购物车数据同步方案
 * 
 * 需求分析:
 * 1. 数据持久化(不能刷新就丢失)
 * 2. 多端同步(App添加,H5也能看到)
 * 3. 离线可用(无网络时也能查看/修改)
 * 4. 冲突处理(同时在不同端修改)
 */

// ============ 方案设计 ============

/**
 * 数据结构设计
 */
// store/modules/cart.js
const state = {
  list: [],        // 购物车列表
  lastSyncTime: 0, // 最后同步时间
  version: 0       // 数据版本号(用于冲突检测)
};

const mutations = {
  // 设置购物车列表
  SET_CART_LIST(state, list) {
    state.list = list;
    // 同步更新到本地存储
    uni.setStorageSync('cart_list', list);
  },
  
  // 添加商品
  ADD_GOODS(state, goods) {
    const existItem = state.list.find(
      item => item.goodsId === goods.goodsId && item.skuId === goods.skuId
    );
    
    if (existItem) {
      // 已存在则数量累加
      existItem.num += goods.num || 1;
    } else {
      // 不存在则添加
      state.list.push({
        goodsId: goods.goodsId,
        skuId: goods.skuId,
        title: goods.title,
        image: goods.image,
        price: goods.price,
        num: goods.num || 1,
        checked: true,
        addTime: Date.now() // 添加时间,用于排序
      });
    }
    
    // 保存到本地
    uni.setStorageSync('cart_list', state.list);
  },
  
  // 删除商品
  REMOVE_GOODS(state, { goodsId, skuId }) {
    state.list = state.list.filter(
      item => !(item.goodsId === goodsId && item.skuId === skuId)
    );
    uni.setStorageSync('cart_list', state.list);
  },
  
  // 更新数量
  UPDATE_NUM(state, { goodsId, skuId, num }) {
    const item = state.list.find(
      item => item.goodsId === goodsId && item.skuId === skuId
    );
    if (item) {
      item.num = num;
      uni.setStorageSync('cart_list', state.list);
    }
  },
  
  // 切换选中状态
  TOGGLE_CHECKED(state, { goodsId, skuId }) {
    const item = state.list.find(
      item => item.goodsId === goodsId && item.skuId === skuId
    );
    if (item) {
      item.checked = !item.checked;
      uni.setStorageSync('cart_list', state.list);
    }
  },
  
  // 更新同步时间
  UPDATE_SYNC_TIME(state) {
    state.lastSyncTime = Date.now();
    uni.setStorageSync('cart_sync_time', state.lastSyncTime);
  },
  
  // 更新版本号
  UPDATE_VERSION(state, version) {
    state.version = version;
    uni.setStorageSync('cart_version', version);
  }
};

const actions = {
  /**
   * 初始化购物车(App启动时)
   */
  async initCart({ commit, dispatch }) {
    // [步骤1] 从本地读取缓存
    const localList = uni.getStorageSync('cart_list') || [];
    const localVersion = uni.getStorageSync('cart_version') || 0;
    const localSyncTime = uni.getStorageSync('cart_sync_time') || 0;
    
    commit('SET_CART_LIST', localList);
    commit('UPDATE_VERSION', localVersion);
    commit('UPDATE_SYNC_TIME', localSyncTime);
    
    // [步骤2] 如果已登录,从服务器同步
    const token = uni.getStorageSync('token');
    if (token) {
      await dispatch('syncFromServer');
    }
  },
  
  /**
   * 从服务器同步数据
   */
  async syncFromServer({ state, commit }) {
    try {
      const res = await request.get('/api/cart/list', {
        version: state.version,  // 携带本地版本号
        timestamp: state.lastSyncTime
      });
      
      // [冲突检测] 服务器版本号大于本地,说明服务器有更新
      if (res.version > state.version) {
        // [合并策略] 以服务器为准,但保留本地未同步的修改
        const mergedList = this.mergeCartData(state.list, res.list);
        commit('SET_CART_LIST', mergedList);
        commit('UPDATE_VERSION', res.version);
      }
      
      commit('UPDATE_SYNC_TIME');
      
    } catch (error) {
      console.error('同步失败:', error);
      // 同步失败不影响使用,继续使用本地数据
    }
  },
  
  /**
   * 同步到服务器
   */
  async syncToServer({ state, commit }, { action, data }) {
    try {
      const res = await request.post('/api/cart/sync', {
        action,    // add/remove/update
        data,      // 操作的数据
        version: state.version,
        list: state.list  // 完整列表(用于服务器端校验)
      });
      
      // 更新服务器返回的版本号
      commit('UPDATE_VERSION', res.version);
      commit('UPDATE_SYNC_TIME');
      
    } catch (error) {
      console.error('同步到服务器失败:', error);
      // 失败不影响本地操作,后续会重试
    }
  },
  
  /**
   * 添加商品到购物车
   */
  async addGoods({ commit, dispatch }, goods) {
    // [步骤1] 立即更新本地
    commit('ADD_GOODS', goods);
    
    // [步骤2] 异步同步到服务器(不阻塞用户操作)
    const token = uni.getStorageSync('token');
    if (token) {
      dispatch('syncToServer', {
        action: 'add',
        data: goods
      }).catch(() => {
        // 同步失败,标记为待同步
        this.markPendingSync('add', goods);
      });
    }
  },
  
  /**
   * 删除商品
   */
  async removeGoods({ commit, dispatch }, { goodsId, skuId }) {
    commit('REMOVE_GOODS', { goodsId, skuId });
    
    const token = uni.getStorageSync('token');
    if (token) {
      dispatch('syncToServer', {
        action: 'remove',
        data: { goodsId, skuId }
      });
    }
  },
  
  /**
   * 更新数量
   */
  async updateNum({ commit, dispatch }, { goodsId, skuId, num }) {
    commit('UPDATE_NUM', { goodsId, skuId, num });
    
    const token = uni.getStorageSync('token');
    if (token) {
      // 防抖处理,避免频繁请求
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        dispatch('syncToServer', {
          action: 'update',
          data: { goodsId, skuId, num }
        });
      }, 500);
    }
  },
  
  /**
   * 登录后合并购物车
   */
  async mergeCart({ state, commit }) {
    // 获取服务器购物车
    const res = await request.get('/api/cart/list');
    
    // 合并本地和服务器购物车
    const mergedList = this.mergeCartData(state.list, res.list);
    
    // 提交到服务器
    await request.post('/api/cart/merge', {
      list: mergedList
    });
    
    commit('SET_CART_LIST', mergedList);
  }
};

const getters = {
  // 购物车总数量
  totalNum(state) {
    return state.list.reduce((sum, item) => sum + item.num, 0);
  },
  
  // 选中商品列表
  checkedList(state) {
    return state.list.filter(item => item.checked);
  },
  
  // 选中商品总价
  totalPrice(state, getters) {
    return getters.checkedList.reduce(
      (sum, item) => sum + item.price * item.num,
      0
    ).toFixed(2);
  },
  
  // 是否全选
  isAllChecked(state) {
    return state.list.length > 0 && state.list.every(item => item.checked);
  }
};

/**
 * 数据合并策略
 */
function mergeCartData(localList, serverList) {
  const mergedMap = new Map();
  
  // [步骤1] 先添加服务器数据
  serverList.forEach(item => {
    const key = `${item.goodsId}_${item.skuId}`;
    mergedMap.set(key, item);
  });
  
  // [步骤2] 合并本地数据
  localList.forEach(item => {
    const key = `${item.goodsId}_${item.skuId}`;
    const serverItem = mergedMap.get(key);
    
    if (serverItem) {
      // 已存在,数量取最大值
      serverItem.num = Math.max(serverItem.num, item.num);
    } else {
      // 不存在,添加本地数据
      mergedMap.set(key, item);
    }
  });
  
  return Array.from(mergedMap.values());
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
```

```javascript
/**
 * 后端API设计
 */

// 1. 获取购物车列表
GET /api/cart/list?version=10&timestamp=1234567890
Response: {
  code: 200,
  data: {
    list: [...],
    version: 11  // 服务器当前版本号
  }
}

// 2. 同步操作
POST /api/cart/sync
Body: {
  action: 'add',       // add/remove/update
  data: {...},         // 操作数据
  version: 10,         // 客户端版本号
  list: [...]          // 完整列表(用于校验)
}
Response: {
  code: 200,
  data: {
    version: 11        // 新版本号
  }
}

// 3. 登录后合并购物车
POST /api/cart/merge
Body: {
  list: [...]          // 合并后的完整列表
}
Response: {
  code: 200,
  data: {
    version: 12
  }
}
```

**答案解析:**

**1. 业务分析:**
- 购物车是高频操作,需要响应速度快
- 多端使用,需要数据一致性
- 用户可能在无网络环境使用
- 需处理同时在不同端修改的冲突

**2. 技术方案:**

**本地存储:**
- 使用Vuex管理内存状态
- 使用Storage持久化数据
- 每次修改都同步到Storage

**服务器同步:**
- 乐观更新:本地立即生效,异步同步到服务器
- 版本号机制:检测数据冲突
- 定时同步:App切换到前台时自动同步

**冲突处理:**
- 数量冲突:取最大值
- 删除冲突:以服务器为准
- 版本冲突:服务器版本号>本地时,触发合并

**3. 关键代码:**
- `initCart`: App启动时初始化
- `syncFromServer`: 从服务器拉取最新数据
- `syncToServer`: 推送本地修改到服务器
- `mergeCartData`: 合并本地和服务器数据

**4. 潜在问题:**
- 网络不稳定导致同步失败 → 标记待同步,下次重试
- 频繁修改数量导致请求过多 → 防抖处理
- 本地Storage被清除 → 从服务器恢复

**5. 优化方向:**
- 使用WebSocket实现实时同步
- 增加操作日志,支持回滚
- 压缩存储数据,节省空间

**考察点:**
- 能否设计合理的数据结构
- 能否处理离线场景
- 能否解决数据冲突
- 能否优化用户体验(乐观更新)

---


#### 题目2:实现一个支持下拉刷新和上拉加载的商品列表,需要处理网络异常、空数据、加载状态等场景

```javascript
/**
 * 完整的列表加载方案
 * pages/goods/list.vue
 */

<template>
  <view class="goods-list-page">
    <!-- [空状态] 无数据时显示 -->
    <view v-if="!loading && goodsList.length === 0" class="empty-box">
      <image src="/static/empty.png" mode="aspectFit"></image>
      <text>暂无商品</text>
      <button @click="loadData">重新加载</button>
    </view>

    <!-- [商品列表] -->
    <scroll-view 
      v-else
      scroll-y 
      class="scroll-view"
      @scrolltolower="loadMore"
      :lower-threshold="100">
      
      <view class="goods-grid">
        <view 
          v-for="item in goodsList" 
          :key="item.id"
          class="goods-item"
          @click="goDetail(item.id)">
          <image :src="item.image" mode="aspectFill"></image>
          <view class="info">
            <text class="title">{{item.title}}</text>
            <view class="price-box">
              <text class="price">¥{{item.price}}</text>
              <text class="sales">已售{{item.sales}}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- [加载状态] -->
      <view class="loading-status">
        <text v-if="loadingMore">加载中...</text>
        <text v-else-if="!hasMore">没有更多了</text>
      </view>
    </scroll-view>

    <!-- [返回顶部] 滚动超过一屏后显示 -->
    <view 
      v-if="showBackTop" 
      class="back-top"
      @click="scrollToTop">
      <uni-icons type="arrow-up" size="20" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js';

export default {
  data() {
    return {
      // [列表数据]
      goodsList: [],
      
      // [分页参数]
      page: 1,
      pageSize: 20,
      hasMore: true,  // 是否还有更多数据
      
      // [加载状态]
      loading: false,       // 首次加载
      loadingMore: false,   // 加载更多
      refreshing: false,    // 下拉刷新
      
      // [其他]
      showBackTop: false,   // 是否显示返回顶部
      scrollTop: 0,         // 当前滚动位置
      
      // [请求防抖]
      loadMoreTimer: null
    };
  },

  onLoad(options) {
    // 获取分类ID等参数
    this.categoryId = options.categoryId;
    
    // 加载数据
    this.loadData();
  },

  // [开启下拉刷新]
  onPullDownRefresh() {
    this.refresh();
  },

  // [触底加载(备用方案)]
  onReachBottom() {
    this.loadMore();
  },

  // [页面滚动监听]
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    // 滚动超过一屏显示返回顶部按钮
    const systemInfo = uni.getSystemInfoSync();
    this.showBackTop = e.scrollTop > systemInfo.windowHeight;
  },

  methods: {
    /**
     * 初始加载数据
     */
    async loadData() {
      // [防止重复加载]
      if (this.loading) return;
      
      this.loading = true;
      try {
        const res = await request.get('/api/goods/list', {
          categoryId: this.categoryId,
          page: 1,
          pageSize: this.pageSize
        });

        this.goodsList = res.list || [];
        this.hasMore = res.hasMore;
        this.page = 1;

      } catch (error) {
        // [错误处理]
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 下拉刷新
     */
    async refresh() {
      // [防止重复刷新]
      if (this.refreshing) return;
      
      this.refreshing = true;
      this.page = 1;
      
      try {
        const res = await request.get('/api/goods/list', {
          categoryId: this.categoryId,
          page: 1,
          pageSize: this.pageSize
        });

        // [替换数据,不是追加]
        this.goodsList = res.list || [];
        this.hasMore = res.hasMore;

        uni.showToast({
          title: '刷新成功',
          icon: 'success'
        });

      } catch (error) {
        this.handleError(error);
      } finally {
        this.refreshing = false;
        // [停止下拉刷新动画]
        uni.stopPullDownRefresh();
      }
    },

    /**
     * 加载更多
     */
    async loadMore() {
      // [边界检查]
      if (!this.hasMore) return;           // 没有更多数据
      if (this.loadingMore) return;        // 正在加载中
      if (this.loading) return;            // 首次加载中
      if (this.refreshing) return;         // 刷新中

      // [防抖处理] 防止快速滚动触发多次
      clearTimeout(this.loadMoreTimer);
      this.loadMoreTimer = setTimeout(async () => {
        await this.doLoadMore();
      }, 300);
    },

    /**
     * 实际的加载更多逻辑
     */
    async doLoadMore() {
      this.loadingMore = true;
      this.page++;

      try {
        const res = await request.get('/api/goods/list', {
          categoryId: this.categoryId,
          page: this.page,
          pageSize: this.pageSize
        });

        // [追加数据]
        this.goodsList.push(...(res.list || []));
        this.hasMore = res.hasMore;

        // [数据为空提示]
        if (!res.list || res.list.length === 0) {
          uni.showToast({
            title: '没有更多数据了',
            icon: 'none'
          });
        }

      } catch (error) {
        // [加载失败,回退页码]
        this.page--;
        this.handleError(error);
      } finally {
        this.loadingMore = false;
      }
    },

    /**
     * 错误处理
     */
    handleError(error) {
      console.error('加载失败:', error);
      
      let message = '加载失败';
      
      // [根据错误类型显示不同提示]
      if (error.code === 'NETWORK_ERROR') {
        message = '网络连接失败,请检查网络';
      } else if (error.code === 'TIMEOUT') {
        message = '请求超时,请重试';
      } else if (error.statusCode === 500) {
        message = '服务器错误,请稍后再试';
      }

      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    },

    /**
     * 返回顶部
     */
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },

    /**
     * 跳转详情页
     */
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${id}`
      });
    }
  },

  // [页面卸载时清理定时器]
  onUnload() {
    clearTimeout(this.loadMoreTimer);
  }
};
</script>

<style lang="scss" scoped>
.goods-list-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

// [空状态]
.empty-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;

  image {
    width: 400rpx;
    height: 400rpx;
    margin-bottom: 40rpx;
  }

  text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  button {
    width: 200rpx;
    height: 70rpx;
    line-height: 70rpx;
    background-color: #ff4d4f;
    color: #fff;
    border-radius: 35rpx;
    font-size: 28rpx;
  }
}

// [滚动容器]
.scroll-view {
  flex: 1;
  overflow: hidden;
}

// [商品网格]
.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;

  .goods-item {
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 340rpx;
    }

    .info {
      padding: 20rpx;

      .title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 28rpx;
        color: #333;
        line-height: 1.4;
        min-height: 78rpx;
      }

      .price-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16rpx;

        .price {
          font-size: 32rpx;
          color: #ff4d4f;
          font-weight: bold;
        }

        .sales {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

// [加载状态]
.loading-status {
  padding: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #999;
}

// [返回顶部]
.back-top {
  position: fixed;
  right: 30rpx;
  bottom: 200rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
```

**答案解析:**

**1. 业务分析:**
- 列表是高频场景,需要流畅体验
- 用户会快速滚动,需要防抖
- 网络不稳定时需要友好提示
- 空数据需要引导用户操作

**2. 技术方案:**

**下拉刷新:**
- 使用`onPullDownRefresh`钩子
- 重置页码为1,替换数据
- 完成后调用`uni.stopPullDownRefresh()`

**上拉加载:**
- 使用`scroll-view`的`@scrolltolower`事件
- 设置`lower-threshold`提前触发
- 防抖处理避免重复请求

**状态管理:**
- `loading`:首次加载
- `loadingMore`:加载更多
- `refreshing`:下拉刷新
- `hasMore`:是否还有数据

**3. 关键代码:**
- `loadData()`:初始加载
- `refresh()`:下拉刷新
- `doLoadMore()`:加载更多(防抖后执行)
- `handleError()`:统一错误处理

**4. 潜在问题:**
- 快速滚动触发多次加载 → 防抖+状态锁
- 加载失败后页码错误 → catch中回退页码
- 空数据没有提示 → 空状态组件

**5. 优化方向:**
- 虚拟滚动(数据>1000条)
- 骨架屏替代loading
- 预加载下一页数据

---

#### 题目3:实现图片上传功能,支持多图上传、压缩、进度显示、失败重传

```javascript
/**
 * 图片上传完整方案
 * components/image-uploader/image-uploader.vue
 */

<template>
  <view class="image-uploader">
    <view class="image-list">
      <!-- [已上传的图片] -->
      <view 
        v-for="(item, index) in imageList" 
        :key="index"
        class="image-item">
        <image :src="item.url" mode="aspectFill"></image>
        
        <!-- [上传进度] -->
        <view v-if="item.uploading" class="uploading-mask">
          <view class="progress-circle">
            <text>{{item.progress}}%</text>
          </view>
        </view>
        
        <!-- [上传失败] -->
        <view v-if="item.error" class="error-mask" @click="retryUpload(index)">
          <uni-icons type="refresh" size="30" color="#fff"></uni-icons>
          <text>上传失败,点击重试</text>
        </view>
        
        <!-- [删除按钮] -->
        <view class="delete-btn" @click="deleteImage(index)">
          <uni-icons type="close" size="20" color="#fff"></uni-icons>
        </view>
      </view>

      <!-- [添加按钮] -->
      <view 
        v-if="imageList.length < maxCount"
        class="add-btn"
        @click="chooseImage">
        <uni-icons type="plus" size="40" color="#999"></uni-icons>
        <text>{{imageList.length}}/{{maxCount}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js';

export default {
  props: {
    // 最大上传数量
    maxCount: {
      type: Number,
      default: 9
    },
    // 是否压缩
    compress: {
      type: Boolean,
      default: true
    },
    // 压缩质量(0-100)
    quality: {
      type: Number,
      default: 80
    },
    // 最大文件大小(MB)
    maxSize: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      imageList: []  // { url, uploading, progress, error, uploadTask }
    };
  },

  methods: {
    /**
     * 选择图片
     */
    async chooseImage() {
      try {
        // [计算剩余可选数量]
        const remainCount = this.maxCount - this.imageList.length;
        
        const res = await uni.chooseImage({
          count: remainCount,
          sizeType: this.compress ? ['compressed'] : ['original'],
          sourceType: ['album', 'camera']
        });

        // [批量上传]
        res.tempFilePaths.forEach(filePath => {
          this.uploadImage(filePath);
        });

      } catch (error) {
        console.error('选择图片失败:', error);
      }
    },

    /**
     * 上传单张图片
     */
    async uploadImage(filePath) {
      // [文件大小检查]
      const fileInfo = await this.getFileInfo(filePath);
      if (fileInfo.size > this.maxSize * 1024 * 1024) {
        uni.showToast({
          title: `图片大小不能超过${this.maxSize}MB`,
          icon: 'none'
        });
        return;
      }

      // [添加到列表]
      const imageItem = {
        url: filePath,      // 本地临时路径
        uploading: true,
        progress: 0,
        error: false,
        uploadTask: null
      };
      this.imageList.push(imageItem);
      const index = this.imageList.length - 1;

      // [创建上传任务]
      const uploadTask = uni.uploadFile({
        url: request.baseURL + '/api/upload/image',
        filePath: filePath,
        name: 'file',
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token')
        },
        formData: {
          type: 'goods'  // 上传类型
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data);
            // [上传成功,替换为服务器URL]
            this.imageList[index].url = data.url;
            this.imageList[index].uploading = false;
            
            // [触发change事件]
            this.emitChange();
          } else {
            this.handleUploadError(index, '上传失败');
          }
        },
        fail: (error) => {
          this.handleUploadError(index, error.errMsg || '上传失败');
        }
      });

      // [保存上传任务实例(用于取消)]
      this.imageList[index].uploadTask = uploadTask;

      // [监听上传进度]
      uploadTask.onProgressUpdate((res) => {
        this.imageList[index].progress = res.progress;
      });
    },

    /**
     * 上传失败处理
     */
    handleUploadError(index, message) {
      this.imageList[index].uploading = false;
      this.imageList[index].error = true;
      
      uni.showToast({
        title: message,
        icon: 'none'
      });
    },

    /**
     * 重试上传
     */
    retryUpload(index) {
      const item = this.imageList[index];
      item.error = false;
      item.uploading = true;
      item.progress = 0;
      
      // 重新上传
      this.uploadImage(item.url);
    },

    /**
     * 删除图片
     */
    deleteImage(index) {
      uni.showModal({
        title: '提示',
        content: '确定删除该图片吗?',
        success: (res) => {
          if (res.confirm) {
            const item = this.imageList[index];
            
            // [取消上传任务]
            if (item.uploadTask && item.uploading) {
              item.uploadTask.abort();
            }
            
            // [删除]
            this.imageList.splice(index, 1);
            this.emitChange();
          }
        }
      });
    },

    /**
     * 获取文件信息
     */
    getFileInfo(filePath) {
      return new Promise((resolve) => {
        uni.getFileInfo({
          filePath,
          success: resolve,
          fail: () => resolve({ size: 0 })
        });
      });
    },

    /**
     * 触发change事件
     */
    emitChange() {
      // [只返回已上传成功的图片URL]
      const successList = this.imageList
        .filter(item => !item.uploading && !item.error)
        .map(item => item.url);
      
      this.$emit('change', successList);
    },

    /**
     * 获取已上传的图片列表
     */
    getImages() {
      return this.imageList
        .filter(item => !item.uploading && !item.error)
        .map(item => item.url);
    }
  }
};
</script>

<style lang="scss" scoped>
.image-uploader {
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .image-item,
    .add-btn {
      width: 220rpx;
      height: 220rpx;
      border-radius: 16rpx;
      overflow: hidden;
      position: relative;
    }

    .image-item {
      image {
        width: 100%;
        height: 100%;
      }

      // [上传中遮罩]
      .uploading-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;

        .progress-circle {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          border: 4rpx solid #fff;
          display: flex;
          justify-content: center;
          align-items: center;

          text {
            font-size: 24rpx;
            color: #fff;
          }
        }
      }

      // [失败遮罩]
      .error-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 77, 79, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        text {
          margin-top: 16rpx;
          font-size: 24rpx;
          color: #fff;
        }
      }

      // [删除按钮]
      .delete-btn {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        width: 40rpx;
        height: 40rpx;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    // [添加按钮]
    .add-btn {
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      text {
        margin-top: 16rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>
```

```javascript
/**
 * 使用示例
 * pages/goods/publish.vue
 */

<template>
  <view class="publish-page">
    <view class="form-item">
      <text class="label">商品图片</text>
      <image-uploader 
        ref="uploader"
        :max-count="9"
        :compress="true"
        :quality="80"
        :max-size="5"
        @change="onImageChange">
      </image-uploader>
    </view>

    <button @click="submit">发布商品</button>
  </view>
</template>

<script>
import ImageUploader from '@/components/image-uploader/image-uploader.vue';

export default {
  components: {
    ImageUploader
  },

  data() {
    return {
      imageUrls: []
    };
  },

  methods: {
    onImageChange(urls) {
      this.imageUrls = urls;
      console.log('已上传图片:', urls);
    },

    async submit() {
      // 获取所有已上传的图片
      const images = this.$refs.uploader.getImages();
      
      if (images.length === 0) {
        uni.showToast({
          title: '请上传商品图片',
          icon: 'none'
        });
        return;
      }

      // 提交表单
      await request.post('/api/goods/publish', {
        title: '商品标题',
        images: images
      });

      uni.showToast({
        title: '发布成功',
        icon: 'success'
      });
    }
  }
};
</script>
```

**答案解析:**

**1. 业务分析:**
- 需要支持多图上传
- 大图需要压缩节省流量
- 上传失败需要重试
- 用户需要看到进度

**2. 技术方案:**

**选择图片:**
- `uni.chooseImage`选择
- 限制数量、来源、是否压缩
- 压缩后大小检查

**上传流程:**
- 使用`uni.uploadFile`上传
- 监听进度`onProgressUpdate`
- 支持取消`uploadTask.abort()`

**状态管理:**
- `uploading`:上传中
- `progress`:上传进度
- `error`:上传失败

**3. 关键代码:**
- `chooseImage()`:选择图片
- `uploadImage()`:上传单张
- `retryUpload()`:重试上传
- `getImages()`:获取已上传列表

**4. 潜在问题:**
- 大图上传慢 → 压缩+进度显示
- 网络不稳定 → 失败重试
- 重复上传 → 防抖处理

**5. 优化方向:**
- 客户端压缩(使用canvas)
- 并发上传控制(最多3个)
- 上传队列管理

---

由于篇幅限制,我无法在一次回复中完成所有10道业务题。我已完成:

✅ 题目1:购物车多端同步(完整)
✅ 题目2:下拉刷新+上拉加载(完整)
✅ 题目3:图片上传(完整)

**剩余题目:(4-10)**
- 题目4:支付流程(微信支付+支付宝支付)
- 题目5:分享功能(朋友圈+好友+生成海报)
- 题目6:定位+地图选点
- 题目7:扫码功能(商品扫码+二维码生成)
- 题目8:登录鉴权(多种登录方式)
- 题目9:长列表优化(虚拟滚动)
- 题目10:离线缓存策略

以及**第八章:快速复用指南**和**标签**

您希望我继续生成哪部分?还是当前内容已足够?

---
## 🧑‍💻 User


继续生成剩余题目:(4-10)

---
## 🤖 Assistant


好的,我继续完成剩余的业务逻辑题(4-10):

---

#### 题目4:实现完整的支付流程,支持微信支付和支付宝支付,处理支付回调和订单状态更新

```javascript
/**
 * 支付流程完整方案
 * utils/payment.js
 */

class PaymentManager {
  constructor() {
    this.orderNo = '';  // 订单号
    this.checkTimer = null;  // 轮询定时器
  }

  /**
   * 发起支付
   * @param {Object} order - 订单信息 { orderNo, amount, title }
   * @param {String} payType - 支付方式 'wechat' | 'alipay'
   */
  async pay(order, payType) {
    try {
      this.orderNo = order.orderNo;

      // [步骤1] 创建支付订单,获取支付参数
      const payParams = await this.createPayment(order, payType);

      // [步骤2] 调起支付
      await this.invokePay(payParams, payType);

      // [步骤3] 支付成功后处理
      return await this.handlePaySuccess();

    } catch (error) {
      return this.handlePayError(error);
    }
  }

  /**
   * 创建支付订单
   */
  async createPayment(order, payType) {
    // [获取平台信息]
    const platform = this.getPlatform();

    const res = await request.post('/api/payment/create', {
      orderNo: order.orderNo,
      amount: order.amount,
      title: order.title,
      payType,      // wechat | alipay
      platform,     // app | h5 | mp-weixin | mp-alipay
      // 支付回调地址(H5需要)
      returnUrl: window.location.origin + '/pages/payment/result'
    });

    return res.payParams;
  }

  /**
   * 调起支付
   */
  async invokePay(payParams, payType) {
    // #ifdef APP-PLUS
    return this.invokeAppPay(payParams, payType);
    // #endif

    // #ifdef H5
    return this.invokeH5Pay(payParams, payType);
    // #endif

    // #ifdef MP-WEIXIN
    return this.invokeWechatMiniPay(payParams);
    // #endif

    // #ifdef MP-ALIPAY
    return this.invokeAlipayMiniPay(payParams);
    // #endif
  }

  /**
   * App端支付
   */
  invokeAppPay(payParams, payType) {
    return new Promise((resolve, reject) => {
      // #ifdef APP-PLUS
      if (payType === 'wechat') {
        // 微信支付
        plus.payment.request('wxpay', payParams, resolve, reject);
      } else if (payType === 'alipay') {
        // 支付宝支付
        plus.payment.request('alipay', payParams, resolve, reject);
      }
      // #endif
    });
  }

  /**
   * H5端支付
   */
  invokeH5Pay(payParams, payType) {
    return new Promise((resolve) => {
      // #ifdef H5
      if (payType === 'wechat') {
        // 微信H5支付 - 跳转到微信支付页面
        window.location.href = payParams.mwebUrl;
      } else if (payType === 'alipay') {
        // 支付宝H5支付 - 使用form提交
        const div = document.createElement('div');
        div.innerHTML = payParams.formData;
        document.body.appendChild(div);
        document.forms[0].submit();
      }

      // H5支付需要用户从支付页面返回后手动确认
      // 这里启动轮询检查支付结果
      this.startPolling();
      resolve();
      // #endif
    });
  }

  /**
   * 微信小程序支付
   */
  invokeWechatMiniPay(payParams) {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        success: resolve,
        fail: reject
      });
      // #endif
    });
  }

  /**
   * 支付宝小程序支付
   */
  invokeAlipayMiniPay(payParams) {
    return new Promise((resolve, reject) => {
      // #ifdef MP-ALIPAY
      my.tradePay({
        tradeNO: payParams.tradeNO,
        success: resolve,
        fail: reject
      });
      // #endif
    });
  }

  /**
   * 支付成功处理
   */
  async handlePaySuccess() {
    uni.showLoading({ title: '支付确认中...' });

    try {
      // [查询支付结果]
      const result = await this.checkPaymentStatus();

      uni.hideLoading();

      if (result.success) {
        uni.showToast({
          title: '支付成功',
          icon: 'success'
        });

        // [跳转到支付成功页]
        uni.redirectTo({
          url: `/pages/payment/success?orderNo=${this.orderNo}`
        });

        return { success: true };
      } else {
        throw new Error('支付失败');
      }

    } catch (error) {
      uni.hideLoading();
      throw error;
    }
  }

  /**
   * 支付失败处理
   */
  handlePayError(error) {
    console.error('支付失败:', error);

    let message = '支付失败';

    // [根据错误类型提示]
    if (error.errMsg) {
      if (error.errMsg.includes('cancel')) {
        message = '支付已取消';
      } else if (error.errMsg.includes('timeout')) {
        message = '支付超时';
      }
    }

    uni.showModal({
      title: '支付失败',
      content: message,
      confirmText: '重新支付',
      cancelText: '查看订单',
      success: (res) => {
        if (res.confirm) {
          // 重新支付
          return { success: false, retry: true };
        } else {
          // 查看订单
          uni.navigateTo({
            url: `/pages/order/detail?orderNo=${this.orderNo}`
          });
        }
      }
    });

    return { success: false, retry: false };
  }

  /**
   * 查询支付状态
   */
  async checkPaymentStatus() {
    const res = await request.get('/api/payment/query', {
      orderNo: this.orderNo
    });

    return {
      success: res.status === 'paid',
      status: res.status  // paid | unpaid | closed
    };
  }

  /**
   * 启动轮询(H5使用)
   */
  startPolling() {
    // 每2秒查询一次,最多查询30次(1分钟)
    let count = 0;
    this.checkTimer = setInterval(async () => {
      count++;

      const result = await this.checkPaymentStatus();

      if (result.success || count >= 30) {
        clearInterval(this.checkTimer);

        if (result.success) {
          this.handlePaySuccess();
        }
      }
    }, 2000);
  }

  /**
   * 获取当前平台
   */
  getPlatform() {
    // #ifdef APP-PLUS
    return 'app';
    // #endif

    // #ifdef H5
    return 'h5';
    // #endif

    // #ifdef MP-WEIXIN
    return 'mp-weixin';
    // #endif

    // #ifdef MP-ALIPAY
    return 'mp-alipay';
    // #endif
  }
}

export default new PaymentManager();
```

```javascript
/**
 * 使用示例
 * pages/order/confirm.vue
 */

<template>
  <view class="confirm-page">
    <!-- 订单信息 -->
    <view class="order-info">
      <text class="total">¥{{order.amount}}</text>
    </view>

    <!-- 支付方式选择 -->
    <view class="pay-methods">
      <view 
        class="method-item"
        :class="{active: payType === 'wechat'}"
        @click="payType = 'wechat'">
        <image src="/static/wechat-pay.png"></image>
        <text>微信支付</text>
      </view>

      <view 
        class="method-item"
        :class="{active: payType === 'alipay'}"
        @click="payType = 'alipay'">
        <image src="/static/alipay.png"></image>
        <text>支付宝支付</text>
      </view>
    </view>

    <button class="pay-btn" @click="handlePay">立即支付</button>
  </view>
</template>

<script>
import payment from '@/utils/payment.js';

export default {
  data() {
    return {
      order: {
        orderNo: '',
        amount: 0,
        title: ''
      },
      payType: 'wechat'  // wechat | alipay
    };
  },

  onLoad(options) {
    this.order.orderNo = options.orderNo;
    this.loadOrderDetail();
  },

  methods: {
    async loadOrderDetail() {
      const res = await request.get('/api/order/detail', {
        orderNo: this.order.orderNo
      });

      this.order = res;
    },

    async handlePay() {
      const result = await payment.pay(this.order, this.payType);

      if (result.retry) {
        // 用户选择重新支付
        this.handlePay();
      }
    }
  }
};
</script>
```

```javascript
/**
 * 后端支付回调处理(Node.js示例)
 */

// 微信支付回调
app.post('/api/payment/wechat/notify', async (req, res) => {
  try {
    // [步骤1] 验证签名
    const isValid = verifyWechatSign(req.body);
    if (!isValid) {
      return res.send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
    }

    // [步骤2] 解析回调数据
    const {
      out_trade_no,  // 商户订单号
      transaction_id, // 微信订单号
      total_fee,      // 支付金额(分)
      result_code     // 支付结果
    } = req.body;

    // [步骤3] 更新订单状态
    if (result_code === 'SUCCESS') {
      await updateOrderStatus(out_trade_no, {
        status: 'paid',
        transactionId: transaction_id,
        paidAt: new Date()
      });

      // [步骤4] 业务逻辑处理(发货、积分等)
      await handlePaymentSuccess(out_trade_no);
    }

    // [步骤5] 返回成功响应
    res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>');

  } catch (error) {
    console.error('支付回调处理失败:', error);
    res.send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
  }
});

// 支付宝支付回调
app.post('/api/payment/alipay/notify', async (req, res) => {
  try {
    // [步骤1] 验证签名
    const isValid = verifyAlipaySign(req.body);
    if (!isValid) {
      return res.send('failure');
    }

    // [步骤2] 解析回调数据
    const {
      out_trade_no,   // 商户订单号
      trade_no,       // 支付宝订单号
      total_amount,   // 支付金额
      trade_status    // 交易状态
    } = req.body;

    // [步骤3] 更新订单状态
    if (trade_status === 'TRADE_SUCCESS') {
      await updateOrderStatus(out_trade_no, {
        status: 'paid',
        transactionId: trade_no,
        paidAt: new Date()
      });

      await handlePaymentSuccess(out_trade_no);
    }

    // [步骤4] 返回成功响应
    res.send('success');

  } catch (error) {
    console.error('支付回调处理失败:', error);
    res.send('failure');
  }
});
```

**答案解析:**

**1. 业务分析:**
- 支付是交易核心环节,必须保证可靠性
- 不同平台支付接口不同
- 需要处理支付中断、超时等异常
- 必须防止重复支付

**2. 技术方案:**

**多平台适配:**
- App:使用`plus.payment`
- H5:跳转到支付页面
- 小程序:使用`uni.requestPayment`

**支付流程:**
1. 创建支付订单(后端生成支付参数)
2. 调起支付(不同平台不同方式)
3. 支付回调(后端处理)
4. 查询支付结果(前端确认)

**状态管理:**
- 支付中:显示loading
- 支付成功:跳转成功页
- 支付失败:提示重试或查看订单

**3. 关键代码:**
- `createPayment()`:创建支付订单
- `invokePay()`:调起支付(多平台适配)
- `checkPaymentStatus()`:查询支付结果
- `startPolling()`:H5轮询查询

**4. 潜在问题:**
- 用户取消支付 → 提示重新支付
- 支付超时 → 查询订单状态
- 重复支付 → 后端订单号去重

**5. 优化方向:**
- WebSocket实时推送支付结果
- 支付密码输入防抖
- 支付失败自动重试机制

---

#### 题目5:实现分享功能,支持分享到微信好友/朋友圈,生成分享海报保存相册

```javascript
/**
 * 分享功能完整方案
 * utils/share.js
 */

class ShareManager {
  /**
   * 分享到微信
   * @param {Object} shareData - { title, desc, imageUrl, path }
   * @param {String} scene - 'WXSceneSession'(好友) | 'WXSceneTimeline'(朋友圈)
   */
  async shareToWechat(shareData, scene = 'WXSceneSession') {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      plus.share.getServices((services) => {
        const wechatService = services.find(s => s.id === 'weixin');
        
        if (!wechatService) {
          uni.showToast({
            title: '未安装微信',
            icon: 'none'
          });
          return reject(new Error('未安装微信'));
        }

        wechatService.send({
          type: 'web',
          title: shareData.title,
          content: shareData.desc,
          href: shareData.path,
          thumbs: [shareData.imageUrl],
          extra: {
            scene: scene  // WXSceneSession | WXSceneTimeline
          }
        }, resolve, reject);
      });
    });
    // #endif

    // #ifdef MP-WEIXIN
    // 小程序使用onShareAppMessage钩子,不需要手动调用
    return Promise.resolve();
    // #endif

    // #ifdef H5
    // H5不支持直接分享,提示用户手动分享
    uni.showModal({
      title: '提示',
        content: '请点击右上角分享按钮',
      showCancel: false
    });
    return Promise.reject(new Error('H5不支持'));
    // #endif
  }

  /**
   * 生成分享海报
   * @param {Object} posterData - 海报数据
   */
  async generatePoster(posterData) {
    return new Promise((resolve, reject) => {
      // 创建海报组件实例
      const poster = this.createPosterCanvas(posterData);
      
      poster.draw(false, () => {
        // 延迟获取,确保绘制完成
        setTimeout(() => {
          uni.canvasToTempFilePath({
            canvasId: 'posterCanvas',
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: reject
          });
        }, 500);
      });
    });
  }

  /**
   * 创建海报画布
   */
  createPosterCanvas(data) {
    const ctx = uni.createCanvasContext('posterCanvas');
    const { width, height } = data;

    // [背景]
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, width, height);

    // [商品图片]
    ctx.drawImage(data.goodsImage, 20, 20, width - 40, width - 40);

    // [商品标题]
    ctx.setFontSize(16);
    ctx.setFillStyle('#333333');
    this.drawText(ctx, data.title, 20, width + 20, width - 40, 20);

    // [价格]
    ctx.setFontSize(24);
    ctx.setFillStyle('#ff4d4f');
    ctx.fillText('¥' + data.price, 20, width + 80);

    // [二维码]
    const qrSize = 80;
    ctx.drawImage(
      data.qrCode,
      width - qrSize - 20,
      height - qrSize - 20,
      qrSize,
      qrSize
    );

    // [提示文字]
    ctx.setFontSize(12);
    ctx.setFillStyle('#999999');
    ctx.fillText('长按识别小程序码', 20, height - 30);

    return ctx;
  }

  /**
   * 绘制多行文本
   */
  drawText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  /**
   * 保存图片到相册
   */
  async saveToAlbum(imagePath) {
    try {
      // [申请相册权限]
      const authResult = await this.requestAlbumAuth();
      if (!authResult) {
        throw new Error('未授权访问相册');
      }

      // [保存图片]
      await uni.saveImageToPhotosAlbum({
        filePath: imagePath
      });

      uni.showToast({
        title: '已保存到相册',
        icon: 'success'
      });

      return true;

    } catch (error) {
      console.error('保存失败:', error);
      
      if (error.errMsg && error.errMsg.includes('auth deny')) {
        // 权限被拒绝,引导用户开启
        uni.showModal({
          title: '提示',
          content: '需要您授权保存图片到相册',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting();
            }
          }
        });
      } else {
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }

      return false;
    }
  }

  /**
   * 申请相册权限
   */
  async requestAlbumAuth() {
    // 检查权限
    const authStatus = await uni.getSetting();
    
    if (authStatus.authSetting['scope.writePhotosAlbum'] === false) {
      // 之前拒绝过,需要引导用户手动开启
      return false;
    }

    if (authStatus.authSetting['scope.writePhotosAlbum'] === undefined) {
      // 未请求过权限,发起授权
      try {
        await uni.authorize({
          scope: 'scope.writePhotosAlbum'
        });
        return true;
      } catch (error) {
        return false;
      }
    }

    // 已授权
    return true;
  }
}

export default new ShareManager();
```

```javascript
/**
 * 海报组件
 * components/share-poster/share-poster.vue
 */

<template>
  <view class="share-poster" v-if="visible">
    <view class="mask" @click="close"></view>
    
    <view class="poster-box">
      <!-- [生成中] -->
      <view v-if="generating" class="generating">
        <uni-icons type="spinner-cycle" size="40" color="#fff"></uni-icons>
        <text>海报生成中...</text>
      </view>

      <!-- [海报图片] -->
      <image 
        v-else
        class="poster-image"
        :src="posterPath"
        mode="widthFix"
        @longpress="savePoster">
      </image>

      <view class="tips">
        <text>长按图片保存到相册</text>
      </view>

      <button class="save-btn" @click="savePoster">保存图片</button>
      <button class="close-btn" @click="close">关闭</button>
    </view>

    <!-- [隐藏的canvas] -->
    <canvas 
      canvas-id="posterCanvas"
      :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}"
      class="canvas">
    </canvas>
  </view>
</template>

<script>
import share from '@/utils/share.js';

export default {
  props: {
    visible: Boolean,
    goodsData: Object
  },

  data() {
    return {
      posterPath: '',
      generating: false,
      canvasWidth: 375,
      canvasHeight: 500
    };
  },

  watch: {
    visible(val) {
      if (val && !this.posterPath) {
        this.generate();
      }
    }
  },

  methods: {
    async generate() {
      this.generating = true;

      try {
        // [获取二维码]
        const qrCode = await this.getQRCode();

        // [生成海报]
        const posterPath = await share.generatePoster({
          width: this.canvasWidth,
          height: this.canvasHeight,
          goodsImage: this.goodsData.image,
          title: this.goodsData.title,
          price: this.goodsData.price,
          qrCode: qrCode
        });

        this.posterPath = posterPath;

      } catch (error) {
        console.error('生成海报失败:', error);
        uni.showToast({
          title: '生成失败',
          icon: 'none'
        });
        this.close();
      } finally {
        this.generating = false;
      }
    },

    async getQRCode() {
      // 调用后端接口生成小程序码
      const res = await request.post('/api/qrcode/generate', {
        page: 'pages/goods/detail',
        scene: `id=${this.goodsData.id}`,
        width: 280
      });

      return res.qrCodeUrl;
    },

    async savePoster() {
      await share.saveToAlbum(this.posterPath);
    },

    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.share-poster {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .poster-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx;

    .generating {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 100rpx 0;

      text {
        margin-top: 20rpx;
        color: #999;
      }
    }

    .poster-image {
      width: 100%;
      border-radius: 16rpx;
    }

    .tips {
      text-align: center;
      padding: 20rpx 0;
      font-size: 24rpx;
      color: #999;
    }

    .save-btn,
    .close-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 28rpx;
      margin-top: 20rpx;
    }

    .save-btn {
      background-color: #ff4d4f;
      color: #fff;
    }

    .close-btn {
      background-color: #f5f5f5;
      color: #666;
    }
  }

  .canvas {
    position: fixed;
    left: -9999px;
    top: -9999px;
  }
}
</style>
```

```javascript
/**
 * 使用示例
 * pages/goods/detail.vue
 */

<template>
  <view class="detail-page">
    <!-- 商品信息 -->
    <view class="goods-info">...</view>

    <!-- 分享按钮 -->
    <view class="share-bar">
      <button @click="shareToFriend">分享给好友</button>
      <button @click="shareToTimeline">分享到朋友圈</button>
      <button @click="showPoster">生成海报</button>
    </view>

    <!-- 海报组件 -->
    <share-poster 
      :visible="posterVisible"
      :goods-data="goodsData"
      @close="posterVisible = false">
    </share-poster>
  </view>
</template>

<script>
import share from '@/utils/share.js';
import SharePoster from '@/components/share-poster/share-poster.vue';

export default {
  components: {
    SharePoster
  },

  data() {
    return {
      goodsData: {},
      posterVisible: false
    };
  },

  // [小程序分享配置]
  onShareAppMessage() {
    return {
      title: this.goodsData.title,
      path: `/pages/goods/detail?id=${this.goodsData.id}`,
      imageUrl: this.goodsData.image
    };
  },

  onShareTimeline() {
    return {
      title: this.goodsData.title,
      query: `id=${this.goodsData.id}`,
      imageUrl: this.goodsData.image
    };
  },

  methods: {
    async shareToFriend() {
      await share.shareToWechat({
        title: this.goodsData.title,
        desc: this.goodsData.desc,
        imageUrl: this.goodsData.image,
        path: `/pages/goods/detail?id=${this.goodsData.id}`
      }, 'WXSceneSession');
    },

    async shareToTimeline() {
      await share.shareToWechat({
        title: this.goodsData.title,
        imageUrl: this.goodsData.image,
        path: `/pages/goods/detail?id=${this.goodsData.id}`
      }, 'WXSceneTimeline');
    },

    showPoster() {
      this.posterVisible = true;
    }
  }
};
</script>
```

**答案解析:**

**1. 业务分析:**
- 分享是社交裂变的核心功能
- 不同平台分享方式不同
- 海报需要美观且包含关键信息
- 保存相册需要权限

**2. 技术方案:**

**分享方式:**
- App:使用`plus.share`
- 小程序:使用`onShareAppMessage`钩子
- H5:提示用户手动分享

**海报生成:**
- 使用Canvas绘制
- 包含商品图、标题、价格、二维码
- `canvasToTempFilePath`导出图片

**权限处理:**
- 检查相册权限`getSetting`
- 未授权时请求`authorize`
- 被拒绝时引导用户手动开启

**3. 关键代码:**
- `shareToWechat()`:分享到微信
- `generatePoster()`:生成海报
- `saveToAlbum()`:保存到相册
- `requestAlbumAuth()`:申请权限

**4. 潜在问题:**
- Canvas绘制失败 → 延迟获取,确保绘制完成
- 权限被拒绝 → 引导用户手动开启
- 海报生成慢 → 显示loading

**5.

---
## 🧑‍💻 User


继续生成

---
## 🤖 Assistant


好的,我继续完成剩余的业务逻辑题(5-10):

---

**5. 优化方向:**
- 使用服务端生成海报(更快、效果更好)
- 海报模板化配置
- 分享数据统计(谁分享了、带来多少访问)

---

#### 题目6:实现定位功能和地图选点,获取用户当前位置,支持搜索地址和地图选择

```javascript
/**
 * 定位与地图选点完整方案
 * utils/location.js
 */

class LocationManager {
  /**
   * 获取当前位置
   */
  async getCurrentLocation() {
    try {
      // [步骤1] 检查并申请定位权限
      const hasAuth = await this.requestLocationAuth();
      if (!hasAuth) {
        throw new Error('未授权定位');
      }

      // [步骤2] 获取位置信息
      const location = await uni.getLocation({
        type: 'gcj02',  // 国测局坐标系
        geocode: true   // 返回地址信息
      });

      // [步骤3] 逆地理编码(坐标转地址)
      const address = await this.reverseGeocode(
        location.latitude,
        location.longitude
      );

      return {
        latitude: location.latitude,
        longitude: location.longitude,
        address: address.address,
        province: address.province,
        city: address.city,
        district: address.district
      };

    } catch (error) {
      return this.handleLocationError(error);
    }
  }

  /**
   * 申请定位权限
   */
  async requestLocationAuth() {
    // [检查权限状态]
    const authStatus = await uni.getSetting();
    
    if (authStatus.authSetting['scope.userLocation'] === false) {
      // 之前拒绝过,引导用户手动开启
      return new Promise((resolve) => {
        uni.showModal({
          title: '需要定位权限',
          content: '为了提供更好的服务,需要获取您的位置信息',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (settingRes) => {
                  resolve(settingRes.authSetting['scope.userLocation']);
                }
              });
            } else {
              resolve(false);
            }
          }
        });
      });
    }

    if (authStatus.authSetting['scope.userLocation'] === undefined) {
      // 未请求过,发起授权
      try {
        await uni.authorize({
          scope: 'scope.userLocation'
        });
        return true;
      } catch (error) {
        return false;
      }
    }

    // 已授权
    return true;
  }

  /**
   * 逆地理编码(坐标转地址)
   */
  async reverseGeocode(latitude, longitude) {
    // 使用腾讯地图API
    const res = await request.get('https://apis.map.qq.com/ws/geocoder/v1/', {
      location: `${latitude},${longitude}`,
      key: 'YOUR_TENCENT_MAP_KEY',
      output: 'json'
    });

    if (res.status !== 0) {
      throw new Error('地址解析失败');
    }

    const result = res.result;
    return {
      address: result.address,
      province: result.address_component.province,
      city: result.address_component.city,
      district: result.address_component.district
    };
  }

  /**
   * 地理编码(地址转坐标)
   */
  async geocode(address) {
    const res = await request.get('https://apis.map.qq.com/ws/geocoder/v1/', {
      address: address,
      key: 'YOUR_TENCENT_MAP_KEY',
      output: 'json'
    });

    if (res.status !== 0) {
      throw new Error('地址解析失败');
    }

    return {
      latitude: res.result.location.lat,
      longitude: res.result.location.lng
    };
  }

  /**
   * 搜索地址(POI搜索)
   */
  async searchAddress(keyword, location) {
    const res = await request.get('https://apis.map.qq.com/ws/place/v1/search', {
      keyword: keyword,
      boundary: location 
        ? `nearby(${location.latitude},${location.longitude},5000)` 
        : '',
      key: 'YOUR_TENCENT_MAP_KEY',
      output: 'json'
    });

    if (res.status !== 0) {
      return [];
    }

    return res.data.map(item => ({
      id: item.id,
      title: item.title,
      address: item.address,
      latitude: item.location.lat,
      longitude: item.location.lng,
      distance: item._distance || 0
    }));
  }

  /**
   * 定位错误处理
   */
  handleLocationError(error) {
    console.error('定位失败:', error);

    let message = '定位失败';
    
    if (error.errMsg) {
      if (error.errMsg.includes('auth deny')) {
        message = '定位权限被拒绝';
      } else if (error.errMsg.includes('timeout')) {
        message = '定位超时,请重试';
      } else if (error.errMsg.includes('network')) {
        message = '网络异常,请检查网络';
      }
    }

    uni.showToast({
      title: message,
      icon: 'none'
    });

    throw error;
  }
}

export default new LocationManager();
```

```javascript
/**
 * 地图选点组件
 * components/map-picker/map-picker.vue
 */

<template>
  <view class="map-picker">
    <!-- [搜索框] -->
    <view class="search-bar">
      <input 
        v-model="keyword"
        placeholder="搜索地点"
        @confirm="handleSearch"
        @input="handleInput">
      <button @click="handleSearch">搜索</button>
    </view>

    <!-- [搜索结果] -->
    <view v-if="searchResults.length > 0" class="search-results">
      <scroll-view scroll-y class="result-list">
        <view 
          v-for="item in searchResults"
          :key="item.id"
          class="result-item"
          @click="selectAddress(item)">
          <view class="title">{{item.title}}</view>
          <view class="address">{{item.address}}</view>
          <view class="distance" v-if="item.distance">
            {{(item.distance / 1000).toFixed(1)}}km
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- [地图] -->
    <map 
      id="map"
      :latitude="centerLatitude"
      :longitude="centerLongitude"
      :markers="markers"
      :show-location="true"
      @markertap="onMarkerTap"
      @regionchange="onRegionChange"
      class="map">
      
      <!-- [中心点标记] -->
      <cover-view class="center-marker">
        <cover-image src="/static/marker.png"></cover-image>
      </cover-view>

      <!-- [当前位置按钮] -->
      <cover-view class="location-btn" @click="relocate">
        <cover-image src="/static/location.png"></cover-image>
      </cover-view>
    </map>

    <!-- [地址信息] -->
    <view class="address-info">
      <view class="current-address">
        <text class="label">当前位置:</text>
        <text class="value">{{currentAddress}}</text>
      </view>
      <button class="confirm-btn" @click="confirm">确认选择</button>
    </view>
  </view>
</template>

<script>
import location from '@/utils/location.js';

export default {
  data() {
    return {
      // [地图中心点]
      centerLatitude: 39.908823,
      centerLongitude: 116.397470,
      
      // [当前选中地址]
      currentAddress: '定位中...',
      currentLocation: null,
      
      // [搜索]
      keyword: '',
      searchResults: [],
      searchTimer: null,
      
      // [标记点]
      markers: []
    };
  },

  onLoad() {
    this.init();
  },

  methods: {
    /**
     * 初始化
     */
    async init() {
      try {
        // [获取当前位置]
        const loc = await location.getCurrentLocation();
        
        this.centerLatitude = loc.latitude;
        this.centerLongitude = loc.longitude;
        this.currentAddress = loc.address;
        this.currentLocation = loc;

      } catch (error) {
        // 定位失败,使用默认位置(北京)
        this.currentAddress = '定位失败,请手动选择';
      }
    },

    /**
     * 重新定位
     */
    async relocate() {
      uni.showLoading({ title: '定位中...' });

      try {
        const loc = await location.getCurrentLocation();
        
        this.centerLatitude = loc.latitude;
        this.centerLongitude = loc.longitude;
        this.currentAddress = loc.address;
        this.currentLocation = loc;

        uni.hideLoading();

      } catch (error) {
        uni.hideLoading();
      }
    },

    /**
     * 搜索输入
     */
    handleInput() {
      // [防抖搜索]
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        if (this.keyword) {
          this.handleSearch();
        }
      }, 500);
    },

    /**
     * 执行搜索
     */
    async handleSearch() {
      if (!this.keyword.trim()) return;

      uni.showLoading({ title: '搜索中...' });

      try {
        const results = await location.searchAddress(
          this.keyword,
          this.currentLocation
        );

        this.searchResults = results;

        // [更新地图标记]
        this.markers = results.map((item, index) => ({
          id: index,
          latitude: item.latitude,
          longitude: item.longitude,
          iconPath: '/static/marker-red.png',
          width: 30,
          height: 30,
          callout: {
            content: item.title,
            display: 'BYCLICK'
          }
        }));

        uni.hideLoading();

      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '搜索失败',
          icon: 'none'
        });
      }
    },

    /**
     * 选择地址
     */
    selectAddress(item) {
      this.centerLatitude = item.latitude;
      this.centerLongitude = item.longitude;
      this.currentAddress = item.address;
      this.currentLocation = item;
      
      // [清空搜索]
      this.keyword = '';
      this.searchResults = [];
    },

    /**
     * 地图标记点击
     */
    onMarkerTap(e) {
      const markerId = e.detail.markerId;
      const result = this.searchResults[markerId];
      if (result) {
        this.selectAddress(result);
      }
    },

    /**
     * 地图移动
     */
    async onRegionChange(e) {
      if (e.type === 'end' && e.causedBy === 'drag') {
        // [获取地图中心点坐标]
        const mapCtx = uni.createMapContext('map', this);
        mapCtx.getCenterLocation({
          success: async (res) => {
            // [逆地理编码]
            try {
              const address = await location.reverseGeocode(
                res.latitude,
                res.longitude
              );
              
              this.currentAddress = address.address;
              this.currentLocation = {
                latitude: res.latitude,
                longitude: res.longitude,
                ...address
              };

            } catch (error) {
              console.error('地址解析失败:', error);
            }
          }
        });
      }
    },

    /**
     * 确认选择
     */
    confirm() {
      if (!this.currentLocation) {
        uni.showToast({
          title: '请选择位置',
          icon: 'none'
        });
        return;
      }

      // [返回选中的位置信息]
      uni.$emit('locationSelected', this.currentLocation);
      uni.navigateBack();
    }
  },

  // [页面卸载清理]
  onUnload() {
    clearTimeout(this.searchTimer);
  }
};
</script>

<style lang="scss" scoped>
.map-picker {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

// [搜索框]
.search-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  input {
    flex: 1;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    font-size: 28rpx;
  }

  button {
    width: 120rpx;
    height: 70rpx;
    line-height: 70rpx;
    margin-left: 20rpx;
    background-color: #ff4d4f;
    color: #fff;
    border-radius: 35rpx;
    font-size: 28rpx;
  }
}

// [搜索结果]
.search-results {
  position: absolute;
  top: 110rpx;
  left: 0;
  right: 0;
  bottom: 200rpx;
  z-index: 10;
  background-color: #fff;

  .result-list {
    height: 100%;

    .result-item {
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
      position: relative;

      .title {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 10rpx;
      }

      .address {
        font-size: 26rpx;
        color: #999;
      }

      .distance {
        position: absolute;
        right: 30rpx;
        top: 50%;
        transform: translateY(-50%);
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// [地图]
.map {
  flex: 1;
  width: 100%;

  .center-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    width: 60rpx;
    height: 60rpx;

    cover-image {
      width: 100%;
      height: 100%;
    }
  }

  .location-btn {
    position: absolute;
    right: 30rpx;
    bottom: 250rpx;
    width: 80rpx;
    height: 80rpx;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;

    cover-image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

// [地址信息]
.address-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);

  .current-address {
    margin-bottom: 20rpx;

    .label {
      font-size: 28rpx;
      color: #999;
      margin-right: 10rpx;
    }

    .value {
      font-size: 28rpx;
      color: #333;
    }
  }

  .confirm-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #ff4d4f;
    color: #fff;
    border-radius: 40rpx;
    font-size: 32rpx;
  }
}
</style>
```

**答案解析:**

**1. 业务分析:**
- 定位是O2O场景的基础功能
- 用户需要精确选择位置
- 需要搜索功能辅助定位
- 权限申请需要友好引导

**2. 技术方案:**

**定位方式:**
- 使用`uni.getLocation`获取坐标
- 坐标系统一使用gcj02(国测局)
- 调用地图API进行逆地理编码

**地图选点:**
- 使用`<map>`组件
- 中心点标记固定在屏幕中央
- 地图移动后实时更新地址

**地址搜索:**
- POI搜索(兴趣点搜索)
- 防抖处理避免频繁请求
- 按距离排序结果

**3. 关键代码:**
- `getCurrentLocation()`:获取当前位置
- `reverseGeocode()`:坐标转地址
- `searchAddress()`:搜索地址
- `onRegionChange()`:地图移动监听

**4. 潜在问题:**
- 定位不准确 → 多次定位取平均值
- 室内定位失败 → 提示用户到室外
- 权限被拒绝 → 引导用户手动开启

**5. 优化方向:**
- 缓存常用地址
- 支持收藏地址
- 历史搜索记录

---

#### 题目7:实现扫码功能,扫描商品条形码和二维码,生成小程序码

```javascript
/**
 * 扫码功能完整方案
 * utils/scanner.js
 */

class ScannerManager {
  /**
   * 扫描二维码/条形码
   */
  async scan() {
    try {
      // [申请相机权限]
      const hasAuth = await this.requestCameraAuth();
      if (!hasAuth) {
        throw new Error('未授权相机');
      }

      // [调起扫码]
      const result = await uni.scanCode({
        onlyFromCamera: true,  // 只允许从相机扫码
        scanType: ['qrCode', 'barCode']  // 二维码和条形码
      });

      // [处理扫码结果]
      return await this.handleScanResult(result);

    } catch (error) {
      return this.handleScanError(error);
    }
  }

  /**
   * 申请相机权限
   */
  async requestCameraAuth() {
    const authStatus = await uni.getSetting();
    
    if (authStatus.authSetting['scope.camera'] === false) {
      // 被拒绝过,引导用户手动开启
      return new Promise((resolve) => {
        uni.showModal({
          title: '需要相机权限',
          content: '扫码功能需要使用相机',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (settingRes) => {
                  resolve(settingRes.authSetting['scope.camera']);
                }
              });
            } else {
              resolve(false);
            }
          }
        });
      });
    }

    if (authStatus.authSetting['scope.camera'] === undefined) {
      // 未请求过
      try {
        await uni.authorize({
          scope: 'scope.camera'
        });
        return true;
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  /**
   * 处理扫码结果
   */
  async handleScanResult(result) {
    const { result: content, scanType } = result;

    // [识别扫码类型]
    if (scanType === 'QR_CODE') {
      // 二维码
      return await this.handleQRCode(content);
    } else if (scanType.includes('CODE')) {
      // 条形码
      return await this.handleBarCode(content);
    }

    return { success: false, message: '未识别的码类型' };
  }

  /**
   * 处理二维码
   */
  async handleQRCode(content) {
    // [判断是否是小程序码]
    if (content.includes('weixin://')) {
      // 是小程序码,解析路径
      const path = this.parseWeixinUrl(content);
      return {
        success: true,
        type: 'miniprogram',
        path: path
      };
    }

    // [判断是否是URL]
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return {
        success: true,
        type: 'url',
        url: content
      };
    }

    // [其他文本内容]
    return {
      success: true,
      type: 'text',
      content: content
    };
  }

  /**
   * 处理条形码(商品码)
   */
  async handleBarCode(code) {
    // [查询商品信息]
    try {
      const goodsInfo = await request.get('/api/goods/barcode', {
        code: code
      });

      return {
        success: true,
        type: 'goods',
        goods: goodsInfo
      };

    } catch (error) {
      return {
        success: false,
        message: '未找到该商品'
      };
    }
  }

  /**
   * 解析微信URL
   */
  parseWeixinUrl(url) {
    // weixin://dl/business/?t=xxx&s=yyy
    // 解析出小程序路径
    // 实际项目中需要根据具体格式解析
    return '/pages/index/index';
  }

  /**
   * 扫码错误处理
   */
  handleScanError(error) {
    console.error('扫码失败:', error);

    let message = '扫码失败';
    
    if (error.errMsg) {
      if (error.errMsg.includes('cancel')) {
        message = '已取消扫码';
      } else if (error.errMsg.includes('auth deny')) {
        message = '相机权限被拒绝';
      }
    }

    if (!error.errMsg || !error.errMsg.includes('cancel')) {
      uni.showToast({
        title: message,
        icon: 'none'
      });
    }

    return { success: false, message };
  }

  /**
   * 生成二维码(普通二维码)
   */
  async generateQRCode(content, size = 200) {
    // 使用第三方API生成
    // 或者使用Canvas绘制
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}`;
  }

  /**
   * 生成小程序码
   * 需要在后端调用微信API
   */
  async generateMiniProgramCode(page, scene, width = 280) {
    const res = await request.post('/api/qrcode/generate', {
      page,   // 小程序页面路径
      scene,  // 参数
      width   // 宽度
    });

    return res.qrCodeUrl;
  }
}

export default new ScannerManager();
```

```javascript
/**
 * 后端生成小程序码(Node.js示例)
 */

const axios = require('axios');
const fs = require('fs');

class WechatQRCodeService {
  /**
   * 获取access_token
   */
  async getAccessToken() {
    const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET
      }
    });

    return res.data.access_token;
  }

  /**
   * 生成小程序码(无限量)
   */
  async generateUnlimitedQRCode(page, scene, width = 280) {
    const token = await this.getAccessToken();

    const res = await axios.post(
      `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`,
      {
        page,      // pages/goods/detail
        scene,     // id=123
        width,
        auto_color: false,
        line_color: { r: 0, g: 0, b: 0 }
      },
      {
        responseType: 'arraybuffer'  // 二进制数据
      }
    );

    // [保存到文件]
    const filename = `qrcode_${Date.now()}.jpg`;
    const filepath = `./uploads/${filename}`;
    fs.writeFileSync(filepath, res.data);

    // [上传到OSS(可选)]
    const ossUrl = await this.uploadToOSS(filepath);

    return ossUrl;
  }

  /**
   * 生成小程序码(有限量,带参数)
   */
  async generateQRCode(path, width = 280) {
    const token = await this.getAccessToken();

    const res = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${token}`,
      {
        path,   // pages/goods/detail?id=123
        width
      },
      {
        responseType: 'arraybuffer'
      }
    );

    const filename = `qrcode_${Date.now()}.jpg`;
    const filepath = `./uploads/${filename}`;
    fs.writeFileSync(filepath, res.data);

    const ossUrl = await this.uploadToOSS(filepath);

    return ossUrl;
  }
}
```

```javascript
/**
 * 使用示例
 * pages/scan/index.vue
 */

<template>
  <view class="scan-page">
    <button class="scan-btn" @click="handleScan">
      <uni-icons type="scan" size="40" color="#fff"></uni-icons>
      <text>扫一扫</text>
    </button>

    <!-- 扫码结果 -->
    <view v-if="scanResult" class="result-box">
      <!-- 商品结果 -->
      <view v-if="scanResult.type === 'goods'" class="goods-result">
        <image :src="scanResult.goods.image"></image>
        <view class="info">
          <text class="title">{{scanResult.goods.title}}</text>
          <text class="price">¥{{scanResult.goods.price}}</text>
        </view>
        <button @click="goGoodsDetail">查看详情</button>
      </view>

      <!-- URL结果 -->
      <view v-if="scanResult.type === 'url'" class="url-result">
        <text>扫描到链接:</text>
        <text class="url">{{scanResult.url}}</text>
        <button @click="openUrl">打开链接</button>
      </view>

      <!-- 文本结果 -->
      <view v-if="scanResult.type === 'text'" class="text-result">
        <text>扫描结果:</text>
        <text class="content">{{scanResult.content}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import scanner from '@/utils/scanner.js';

export default {
  data() {
    return {
      scanResult: null
    };
  },

  methods: {
    async handleScan() {
      const result = await scanner.scan();

      if (result.success) {
        this.scanResult = result;

        // [根据类型自动跳转]
        if (result.type === 'miniprogram') {
          // 小程序路径,直接跳转
          uni.navigateTo({
            url: result.path
          });
        } else if (result.type === 'goods') {
          // 商品,跳转详情页
          uni.navigateTo({
            url: `/pages/goods/detail?id=${result.goods.id}`
          });
        }
      }
    },

    goGoodsDetail() {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${this.scanResult.goods.id}`
      });
    },

    openUrl() {
      // #ifdef H5
      window.open(this.scanResult.url);
      // #endif

      // #ifdef APP-PLUS
      plus.runtime.openURL(this.scanResult.url);
      // #endif
    }
  }
};
</script>
```

**答案解析:**

**1. 业务分析:**
- 扫码是连接线上线下的重要入口
- 需要识别多种码类型
- 需要权限申请和错误处理
- 生成小程序码用于推广

**2. 技术方案:**

**扫码:**
- 使用`uni.scanCode`调起扫码
- 支持二维码和条形码
- 需要相机权限

**结果处理:**
- 二维码:可能是URL、小程序路径、文本
- 条形码:查询商品信息

**生成小程序码:**

---
## 🧑‍💻 User


继续生成

---
## 🤖 Assistant


好的,我继续完成剩余的业务逻辑题(7-10)和快速复用指南:

---

**生成小程序码:**
- 调用微信API(需在后端)
- 无限量:`getwxacodeunlimit`
- 有限量:`createwxaqrcode`

**3. 关键代码:**
- `scan()`:调起扫码
- `handleScanResult()`:处理扫码结果
- `handleBarCode()`:处理商品码
- `generateMiniProgramCode()`:生成小程序码

**4. 潜在问题:**
- 光线不足识别失败 → 提示用户调整角度
- 相机权限被拒绝 → 引导用户手动开启
- 扫描非法二维码 → 过滤恶意链接

**5. 优化方向:**
- 支持从相册选择图片识别
- 扫码历史记录
- 扫码音效和震动反馈

---

#### 题目8:实现登录鉴权,支持微信登录、手机号登录、游客登录,处理token管理

```javascript
/**
 * 登录鉴权完整方案
 * utils/auth.js
 */

class AuthManager {
  constructor() {
    this.token = '';
    this.userInfo = null;
  }

  /**
   * 微信登录
   */
  async loginByWechat() {
    try {
      // [步骤1] 获取微信code
      const loginRes = await uni.login({
        provider: 'weixin'
      });

      // [步骤2] 发送code到后端
      const res = await request.post('/api/auth/wechat-login', {
        code: loginRes.code
      });

      // [步骤3] 保存token和用户信息
      await this.saveAuth(res.token, res.userInfo);

      return { success: true, userInfo: res.userInfo };

    } catch (error) {
      console.error('微信登录失败:', error);
      return { success: false, message: '登录失败' };
    }
  }

  /**
   * 手机号登录
   */
  async loginByPhone(phone, code) {
    try {
      const res = await request.post('/api/auth/phone-login', {
        phone,
        code  // 验证码
      });

      await this.saveAuth(res.token, res.userInfo);

      return { success: true, userInfo: res.userInfo };

    } catch (error) {
      console.error('手机号登录失败:', error);
      return { 
        success: false, 
        message: error.message || '登录失败' 
      };
    }
  }

  /**
   * 游客登录
   */
  async loginAsGuest() {
    try {
      // 生成设备唯一标识
      const deviceId = await this.getDeviceId();

      const res = await request.post('/api/auth/guest-login', {
        deviceId
      });

      await this.saveAuth(res.token, res.userInfo);

      return { success: true, userInfo: res.userInfo };

    } catch (error) {
      console.error('游客登录失败:', error);
      return { success: false, message: '登录失败' };
    }
  }

  /**
   * 获取设备唯一标识
   */
  async getDeviceId() {
    // 先从缓存读取
    let deviceId = uni.getStorageSync('deviceId');
    
    if (!deviceId) {
      // 生成新的设备ID
      deviceId = this.generateDeviceId();
      uni.setStorageSync('deviceId', deviceId);
    }

    return deviceId;
  }

  /**
   * 生成设备ID
   */
  generateDeviceId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `device_${timestamp}_${random}`;
  }

  /**
   * 保存认证信息
   */
  async saveAuth(token, userInfo) {
    this.token = token;
    this.userInfo = userInfo;

    // [保存到本地]
    uni.setStorageSync('token', token);
    uni.setStorageSync('userInfo', userInfo);
  }

  /**
   * 获取token
   */
  getToken() {
    if (!this.token) {
      this.token = uni.getStorageSync('token') || '';
    }
    return this.token;
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    if (!this.userInfo) {
      this.userInfo = uni.getStorageSync('userInfo');
    }
    return this.userInfo;
  }

  /**
   * 检查登录状态
   */
  isLoggedIn() {
    const token = this.getToken();
    return !!token;
  }

  /**
   * 检查是否游客
   */
  isGuest() {
    const userInfo = this.getUserInfo();
    return userInfo && userInfo.isGuest;
  }

  /**
   * 退出登录
   */
  async logout() {
    // [清除本地数据]
    this.token = '';
    this.userInfo = null;
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');

    // [通知后端]
    try {
      await request.post('/api/auth/logout');
    } catch (error) {
      console.error('退出登录失败:', error);
    }

    // [跳转到登录页]
    uni.reLaunch({
      url: '/pages/login/index'
    });
  }

  /**
   * 刷新token
   */
  async refreshToken() {
    try {
      const res = await request.post('/api/auth/refresh-token');
      
      await this.saveAuth(res.token, this.userInfo);

      return true;

    } catch (error) {
      console.error('刷新token失败:', error);
      
      // token刷新失败,清除登录状态
      await this.logout();
      
      return false;
    }
  }

  /**
   * 游客转正式用户
   */
  async upgradeFromGuest(phone, code) {
    if (!this.isGuest()) {
      return { success: false, message: '当前不是游客' };
    }

    try {
      const res = await request.post('/api/auth/upgrade', {
        phone,
        code
      });

      await this.saveAuth(res.token, res.userInfo);

      return { success: true, userInfo: res.userInfo };

    } catch (error) {
      console.error('账号升级失败:', error);
      return { 
        success: false, 
        message: error.message || '升级失败' 
      };
    }
  }
}

export default new AuthManager();
```

```javascript
/**
 * 请求拦截器 - 自动携带token
 * utils/request.js
 */

import auth from './auth.js';

class Request {
  constructor() {
    this.baseURL = 'https://api.example.com';
    this.timeout = 30000;
    this.isRefreshing = false;  // 是否正在刷新token
    this.requestQueue = [];     // 等待队列
  }

  /**
   * 通用请求方法
   */
  request(options) {
    return new Promise((resolve, reject) => {
      // [添加token]
      const token = auth.getToken();
      if (token) {
        options.header = {
          ...options.header,
          'Authorization': `Bearer ${token}`
        };
      }

      // [发起请求]
      uni.request({
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data,
        header: options.header,
        timeout: this.timeout,
        success: (res) => {
          // [token过期处理]
          if (res.statusCode === 401) {
            this.handleTokenExpired(options, resolve, reject);
            return;
          }

          // [业务错误]
          if (res.statusCode !== 200 || res.data.code !== 0) {
            reject(res.data);
            return;
          }

          resolve(res.data.data);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * 处理token过期
   */
  async handleTokenExpired(options, resolve, reject) {
    // [已在刷新,加入等待队列]
    if (this.isRefreshing) {
      this.requestQueue.push({ options, resolve, reject });
      return;
    }

    this.isRefreshing = true;

    try {
      // [刷新token]
      const success = await auth.refreshToken();

      if (success) {
        // [重新发起原请求]
        const result = await this.request(options);
        resolve(result);

        // [执行队列中的请求]
        this.requestQueue.forEach(item => {
          this.request(item.options)
            .then(item.resolve)
            .catch(item.reject);
        });
        this.requestQueue = [];

      } else {
        // [刷新失败,跳转登录]
        reject({ code: 401, message: '登录已过期' });
      }

    } catch (error) {
      reject(error);
    } finally {
      this.isRefreshing = false;
    }
  }

  get(url, data, header) {
    return this.request({ url, method: 'GET', data, header });
  }

  post(url, data, header) {
    return this.request({ url, method: 'POST', data, header });
  }
}

export default new Request();
```

```javascript
/**
 * 登录页面
 * pages/login/index.vue
 */

<template>
  <view class="login-page">
    <!-- Logo -->
    <view class="logo-box">
      <image src="/static/logo.png"></image>
      <text>欢迎登录</text>
    </view>

    <!-- 登录方式切换 -->
    <view class="tabs">
      <view 
        class="tab-item"
        :class="{active: loginType === 'wechat'}"
        @click="loginType = 'wechat'">
        微信登录
      </view>
      <view 
        class="tab-item"
        :class="{active: loginType === 'phone'}"
        @click="loginType = 'phone'">
        手机号登录
      </view>
    </view>

    <!-- 微信登录 -->
    <view v-if="loginType === 'wechat'" class="wechat-login">
      <button class="login-btn wechat" @click="handleWechatLogin">
        <uni-icons type="weixin" size="24" color="#fff"></uni-icons>
        <text>微信一键登录</text>
      </button>
    </view>

    <!-- 手机号登录 -->
    <view v-else class="phone-login">
      <view class="input-group">
        <input 
          v-model="phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号">
      </view>

      <view class="input-group">
        <input 
          v-model="code"
          type="number"
          maxlength="6"
          placeholder="请输入验证码">
        <button 
          class="send-code-btn"
          :disabled="codeCountdown > 0"
          @click="sendCode">
          {{codeCountdown > 0 ? `${codeCountdown}s` : '发送验证码'}}
        </button>
      </view>

      <button class="login-btn phone" @click="handlePhoneLogin">
        登录
      </button>
    </view>

    <!-- 游客登录 -->
    <view class="guest-login">
      <text @click="handleGuestLogin">游客登录</text>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <checkbox-group @change="onAgreementChange">
        <checkbox :checked="agreed" color="#ff4d4f"></checkbox>
      </checkbox-group>
      <text>我已阅读并同意</text>
      <text class="link" @click="showAgreement('user')">《用户协议》</text>
      <text>和</text>
      <text class="link" @click="showAgreement('privacy')">《隐私政策》</text>
    </view>
  </view>
</template>

<script>
import auth from '@/utils/auth.js';

export default {
  data() {
    return {
      loginType: 'wechat',  // wechat | phone
      phone: '',
      code: '',
      codeCountdown: 0,
      agreed: false
    };
  },

  methods: {
    /**
     * 微信登录
     */
    async handleWechatLogin() {
      if (!this.checkAgreement()) return;

      uni.showLoading({ title: '登录中...' });

      const result = await auth.loginByWechat();

      uni.hideLoading();

      if (result.success) {
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });

        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }, 1000);
      } else {
        uni.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    },

    /**
     * 手机号登录
     */
    async handlePhoneLogin() {
      if (!this.checkAgreement()) return;

      // [验证手机号]
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }

      // [验证验证码]
      if (!this.code || this.code.length !== 6) {
        uni.showToast({
          title: '请输入6位验证码',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({ title: '登录中...' });

      const result = await auth.loginByPhone(this.phone, this.code);

      uni.hideLoading();

      if (result.success) {
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });

        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }, 1000);
      } else {
        uni.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    },

    /**
     * 游客登录
     */
    async handleGuestLogin() {
      if (!this.checkAgreement()) return;

      uni.showLoading({ title: '登录中...' });

      const result = await auth.loginAsGuest();

      uni.hideLoading();

      if (result.success) {
        uni.switchTab({
          url: '/pages/index/index'
        });
      }
    },

    /**
     * 发送验证码
     */
    async sendCode() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }

      try {
        await request.post('/api/sms/send', {
          phone: this.phone
        });

        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        });

        // [倒计时]
        this.codeCountdown = 60;
        const timer = setInterval(() => {
          this.codeCountdown--;
          if (this.codeCountdown <= 0) {
            clearInterval(timer);
          }
        }, 1000);

      } catch (error) {
        uni.showToast({
          title: error.message || '发送失败',
          icon: 'none'
        });
      }
    },

    /**
     * 检查协议
     */
    checkAgreement() {
      if (!this.agreed) {
        uni.showToast({
          title: '请先阅读并同意用户协议',
          icon: 'none'
        });
        return false;
      }
      return true;
    },

    onAgreementChange(e) {
      this.agreed = e.detail.value.length > 0;
    },

    showAgreement(type) {
      uni.navigateTo({
        url: `/pages/agreement/index?type=${type}`
      });
    }
  }
};
</script>
```

**答案解析:**

**1. 业务分析:**
- 登录是应用的入口,体验要流畅
- 支持多种登录方式满足不同场景
- token管理要安全可靠
- 游客模式降低使用门槛

**2. 技术方案:**

**登录方式:**
- 微信登录:获取code→后端换取token
- 手机号登录:验证码验证
- 游客登录:设备ID标识

**token管理:**
- 请求拦截器自动携带token
- token过期自动刷新
- 刷新期间请求加入队列

**游客升级:**
- 游客可绑定手机号转正式用户
- 保留游客期间的数据

**3. 关键代码:**
- `loginByWechat()`:微信登录
- `loginByPhone()`:手机号登录
- `refreshToken()`:刷新token
- `handleTokenExpired()`:token过期处理

**4. 潜在问题:**
- token泄露 → HTTPS+定期刷新
- 多设备登录冲突 → 后端控制单设备登录
- 游客数据丢失 → 引导绑定手机号

**5. 优化方向:**
- 支持生物识别登录(指纹/Face ID)
- 记住登录状态(自动登录)
- 第三方登录(QQ/微博)

---

由于篇幅限制,我将在下一条消息中继续完成:
- 题目9:长列表优化(虚拟滚动)
- 题目10:离线缓存策略
- 第八章:快速复用指南
- 标签

请输入"继续"让我完成剩余内容。

---
## 🧑‍💻 User


继续第八章:快速复用指南
标签

---
## 🤖 Assistant


好的,我继续完成第八章:快速复用指南和标签部分:

---

## 八、快速复用指南

### 8.1 忘记细节后的快速回忆

**核心要点:**
- **这个功能做什么:** uni-app多平台支付、分享、定位、扫码、登录等核心功能的完整实现
- **最关键的3行代码:**
```javascript
// 1. 条件编译适配平台
// #ifdef APP-PLUS
plus.payment.request('wxpay', payParams, resolve, reject);
// #endif

// 2. 权限申请模式
const authStatus = await uni.getSetting();
if (authStatus.authSetting['scope.xxx'] === false) {
  uni.openSetting(); // 引导用户手动开启
}

// 3. token自动刷新
if (res.statusCode === 401) {
  await auth.refreshToken();
  return this.request(options); // 重新发起原请求
}
```

**常见坑:**
1. **localStorage陷阱:** uni-app使用`uni.setStorageSync`而非`localStorage`
2. **权限二次申请:** 被拒绝后只能通过`uni.openSetting`引导用户手动开启
3. **支付回调:** H5支付需要轮询查询,App/小程序才有回调
4. **Canvas绘制延迟:** `canvasToTempFilePath`必须在`draw`回调中延迟500ms后调用

---

### 8.2 迁移到新项目的步骤

#### Step 1: 环境准备

```bash
# 安装uni-app项目(HBuilderX已集成,无需手动安装)

# 如果使用CLI创建项目
npm install -g @vue/cli
vue create -p dcloudio/uni-preset-vue my-project

# 安装项目依赖(如使用第三方库)
npm install lodash papaparse
```

**配置文件:**
在`manifest.json`中添加:
```json
{
  "app-plus": {
    "modules": {
      "Payment": {
        "description": "支付模块"
      },
      "Share": {
        "description": "分享模块"
      },
      "Maps": {
        "description": "地图模块"
      }
    },
    "distribute": {
      "sdkConfigs": {
        "payment": {
          "weixin": {
            "appid": "YOUR_WECHAT_APPID"
          },
          "alipay": {}
        },
        "share": {
          "weixin": {
            "appid": "YOUR_WECHAT_APPID",
            "UniversalLinks": ""
          }
        },
        "maps": {
          "amap": {
            "appkey_ios": "",
            "appkey_android": ""
          }
        }
      }
    }
  },
  "mp-weixin": {
    "appid": "YOUR_MINIPROGRAM_APPID",
    "permission": {
      "scope.userLocation": {
        "desc": "您的位置信息将用于展示附近门店"
      }
    }
  }
}
```

在`pages.json`中添加:
```json
{
  "pages": [
    {
      "path": "pages/login/index",
      "style": {
        "navigationBarTitleText": "登录"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```

#### Step 2: 文件结构

```
project/
├── pages/                    # 页面
│   ├── index/               # 首页
│   ├── login/               # 登录页
│   ├── goods/               # 商品相关
│   └── order/               # 订单相关
├── components/              # 组件
│   ├── share-poster/        # 分享海报组件
│   └── map-picker/          # 地图选点组件
├── utils/                   # 工具类
│   ├── request.js          # 网络请求
│   ├── auth.js             # 登录鉴权
│   ├── payment.js          # 支付管理
│   ├── share.js            # 分享管理
│   ├── location.js         # 定位管理
│   └── scanner.js          # 扫码管理
├── static/                  # 静态资源
│   ├── logo.png
│   ├── marker.png
│   └── location.png
├── App.vue                  # 应用配置
├── main.js                  # 入口文件
├── manifest.json           # 应用配置
├── pages.json              # 页面配置
└── uni.scss                # 全局样式
```

#### Step 3: 复制粘贴清单

**必需文件:**
- [x] 复制 `utils/request.js` 到项目
- [x] 复制 `utils/auth.js` 到项目
- [x] 复制 `utils/payment.js` 到项目(如需支付功能)
- [x] 复制 `utils/share.js` 到项目(如需分享功能)
- [x] 复制 `utils/location.js` 到项目(如需定位功能)
- [x] 复制 `utils/scanner.js` 到项目(如需扫码功能)

**组件文件:**
- [x] 复制 `components/share-poster/` 到项目(如需分享海报)
- [x] 复制 `components/map-picker/` 到项目(如需地图选点)

**配置文件修改:**
- [x] 在 `main.js` 中全局引入request:
```javascript
import request from './utils/request.js';
Vue.prototype.$request = request;
```

- [x] 在 `App.vue` 中初始化auth:
```javascript
import auth from './utils/auth.js';

export default {
  onLaunch() {
    // 检查登录状态
    if (!auth.isLoggedIn()) {
      uni.reLaunch({
        url: '/pages/login/index'
      });
    }
  }
}
```

- [x] 修改 `utils/request.js` 中的 `baseURL`:
```javascript
this.baseURL = 'https://your-api-domain.com';
```

#### Step 4: 测试验证

**功能测试代码:**

```javascript
// 测试登录
import auth from '@/utils/auth.js';

// 测试微信登录
const result = await auth.loginByWechat();
console.log('登录结果:', result);

// 测试支付
import payment from '@/utils/payment.js';

const payResult = await payment.pay({
  orderNo: 'TEST20250106001',
  amount: 0.01,
  title: '测试商品'
}, 'wechat');
console.log('支付结果:', payResult);

// 测试定位
import location from '@/utils/location.js';

const loc = await location.getCurrentLocation();
console.log('当前位置:', loc);

// 测试扫码
import scanner from '@/utils/scanner.js';

const scanResult = await scanner.scan();
console.log('扫码结果:', scanResult);
```

---

### 8.3 常见问题排查

| 问题现象 | 可能原因 | 解决方案 |
|----------|----------|----------|
| **支付调不起来** | 1. 未配置支付参数<br>2. 包名/Bundle ID不匹配<br>3. 未安装微信/支付宝 | 1. 检查manifest.json配置<br>2. 检查证书配置<br>3. 真机测试 |
| **定位权限申请失败** | 用户拒绝授权 | 使用`uni.openSetting`引导用户手动开启 |
| **分享海报不显示** | Canvas绘制未完成就导出 | 在`draw`回调中延迟500ms后调用`canvasToTempFilePath` |
| **token过期未刷新** | 请求拦截器未正确处理401 | 检查request.js中的`handleTokenExpired`逻辑 |
| **小程序码生成失败** | access_token过期或参数错误 | 后端缓存access_token(有效期2小时),检查参数格式 |
| **条件编译不生效** | 注释格式错误 | 必须使用`// #ifdef`,不能有多余空格 |
| **地图标记点不显示** | 坐标系不匹配 | 统一使用gcj02坐标系 |
| **扫码识别不出来** | 光线不足或二维码损坏 | 提示用户调整角度,支持从相册选择 |

---

### 8.4 性能优化检查清单

**必做优化:**
- [ ] 图片使用CDN,开启懒加载
- [ ] 长列表使用虚拟滚动(如scroll-view)
- [ ] 接口请求加防抖/节流
- [ ] 敏感数据加密存储
- [ ] 大数据使用分页加载
- [ ] Canvas绘制使用离屏Canvas
- [ ] 及时清除定时器和事件监听

**推荐优化:**
- [ ] 使用骨架屏提升体验
- [ ] 接口数据缓存(配合时间戳)
- [ ] 静态资源使用WebP格式
- [ ] 减少setData频率(小程序)
- [ ] 使用uni-app官方组件(性能更好)

---

### 8.5 安全注意事项

**关键安全点:**

1. **敏感数据不存本地明文:**
```javascript
// ❌ 错误做法
uni.setStorageSync('password', '123456');

// ✅ 正确做法
import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
uni.setStorageSync('password', encrypted);
```

2. **token使用HTTPS传输:**
```javascript
// ❌ 错误做法
this.baseURL = 'http://api.example.com';

// ✅ 正确做法
this.baseURL = 'https://api.example.com';
```

3. **支付金额后端验证:**
```javascript
// 前端只传订单号,金额由后端查询
await payment.pay({
  orderNo: 'ORDER123',  // ✅ 只传订单号
  // amount: 0.01,       // ❌ 不要前端传金额
}, 'wechat');
```

4. **防止重复提交:**
```javascript
let isSubmitting = false;

async function submitOrder() {
  if (isSubmitting) return;
  isSubmitting = true;
  
  try {
    await createOrder();
  } finally {
    isSubmitting = false;
  }
}
```

---

## 标签

**[标签: 技术栈]**
uni-app, Vue.js, 微信小程序, 支付宝小程序, App开发, H5, 条件编译, 跨平台开发

**[标签: 功能模块]**
支付集成(微信支付/支付宝支付), 分享功能(朋友圈/好友/海报), 地图定位(高德地图/腾讯地图), 扫码识别(二维码/条形码), 登录鉴权(微信登录/手机号登录/游客模式), Canvas绘图, 权限管理, Token刷新

**[标签: 应用场景]**
电商系统, O2O平台, 社交裂变, 地理位置服务, 移动支付, 用户认证, 数据可视化, 离线缓存

**[标签: 核心知识点]**
条件编译原理, 平台API差异处理, 权限申请流程, 支付回调机制, 地理编码/逆地理编码, JWT认证, Canvas性能优化, 异步队列管理, 设备唯一标识

**[标签: 难度等级]**
中高级 (需要理解多平台差异、异步编程、状态管理、安全机制)

**[标签: 最佳实践]**
权限申请友好引导, token自动刷新, 支付状态轮询, 防抖节流, 错误边界处理, 代码复用封装, 配置化管理

**[标签: 常见问题]**
localStorage兼容性, 权限二次申请, 支付H5回调, Canvas延迟导出, token过期处理, 坐标系转换, 条件编译语法

**[标签: 优化方向]**
虚拟滚动, 图片懒加载, 接口缓存, 骨架屏, WebP格式, 离屏Canvas, 防重复提交

---

## 快速查询索引

**按功能查询:**
- **需要支付?** → 查看"支付流程完整方案"(题目4)
- **需要分享?** → 查看"分享功能完整方案"(题目5)
- **需要定位?** → 查看"定位与地图选点"(题目6)
- **需要扫码?** → 查看"扫码功能完整方案"(题目7)
- **需要登录?** → 查看"登录鉴权完整方案"(题目8)

**按平台查询:**
- **App端** → 使用`plus`API,注意打包配置
- **小程序** → 使用`uni`API,注意权限配置
- **H5端** → 功能受限,需要降级方案

**按问题查询:**
- **支付失败?** → 检查manifest.json配置和证书
- **定位不准?** → 检查权限和坐标系
- **海报空白?** → 延迟获取Canvas结果
- **token失效?** → 检查自动刷新逻辑

---

**文档版本:** v2.0
**最后更新:** 2025-01-06
**适用于:** uni-app 3.x + Vue 2.x/3.x
**作者:** 定制化知识管理专家
