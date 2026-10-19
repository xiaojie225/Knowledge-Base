# UniApp 完整文档

## 目录

- [一、UniApp 简介与核心概念](#一uniapp-简介与核心概念)
  - [1.1 什么是 UniApp](#11-什么是-uniapp)
  - [1.2 核心架构](#12-核心架构)
  - [1.3 编译原理](#13-编译原理)
  - [1.4 渲染机制](#14-渲染机制)
- [二、环境搭建与项目创建](#二环境搭建与项目创建)
  - [2.1 开发工具下载](#21-开发工具下载)
  - [2.2 创建 UniApp 项目](#22-创建-uniapp-项目)
  - [2.3 项目基本结构](#23-项目基本结构)
  - [2.4 运行与发布](#24-运行与发布)
- [三、核心配置文件详解](#三核心配置文件详解)
  - [3.1 pages.json 页面路由配置](#31-pagesjson-页面路由配置)
  - [3.2 manifest.json 应用配置](#32-manifestjson-应用配置)
  - [3.3 条件编译机制](#33-条件编译机制)
- [四、组件详解](#四组件详解)
  - [4.1 视图容器组件](#41-视图容器组件)
  - [4.2 基础内容组件](#42-基础内容组件)
  - [4.3 表单组件](#43-表单组件)
  - [4.4 媒体组件](#44-媒体组件)
  - [4.5 地图组件](#45-地图组件)
  - [4.6 扩展组件](#46-扩展组件)
- [五、生命周期系统](#五生命周期系统)
  - [5.1 应用生命周期](#51-应用生命周期)
  - [5.2 页面生命周期](#52-页面生命周期)
  - [5.3 组件生命周期](#53-组件生命周期)
- [六、路由导航与页面通信](#六页面通信)
  - [6.1 组件通信](#61-组件通信)
- [七 问题解决](#七-问题解决)
  - [7.1 同步资源失败问题解决](#71-同步资源失败问题解决)

---

## 一、UniApp 简介与核心概念

### 1.1 什么是 UniApp

`uni-app` 是一个使用 Vue.js 开发所有前端应用的框架,开发者编写一套代码,可发布到iOS、Android、Web(响应式)、以及各种小程序(微信/支付宝/百度/头条/QQ/钉钉/淘宝)、快应用等多个平台。

**核心特点:**
- 跨平台开发,一套代码多端运行
- 基于 Vue.js 语法,学习成本低
- 完善的组件和API体系
- 支持原生渲染(nvue)提升性能

### 1.2 核心架构

**项目完整结构:**

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

### 1.3 编译原理

**UniApp 的编译流程:**

1. **编译时处理**: 通过 webpack + babel 处理源码
   - 条件编译: 根据 `#ifdef` 等指令移除不需要的平台代码
   - 组件转换: 将Vue组件转换为各平台的组件格式
   - API转换: 将 `uni.` API转换为对应平台的API

2. **运行时适配**: 不同平台加载不同的runtime
   - 小程序: 编译成小程序的WXML/WXSS + JS
   - App: 编译成Weex或nvue渲染
   - H5: 编译成标准Vue应用

### 1.4 渲染机制

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

---

## 二、环境搭建与项目创建

### 2.1 开发工具下载

#### 2.1.1 HBuilderX
下载地址: https://www.dcloud.io/hbuilderx.html

#### 2.1.2 微信开发者工具
下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html

### 2.2 创建项目

1. 打开 HBuilderX
2. 文件 → 新建 → 项目 → uni-app
3. 填写项目名称和路径
4. 选择模板
5. 点击创建

### 2.3 运行项目

#### 微信小程序
1. 运行 → 运行到小程序模拟器 → 微信开发者工具
2. 配置微信开发者工具路径
3. 在微信开发者工具中开启服务端口

#### 发布小程序
1. 注册小程序获取AppID
2. 在manifest.json中填写AppID
3. 发行 → 小程序-微信
4. 上传代码
5. 提交审核
6. 发布

---

## 三、核心配置文件详解

### 3.1 pages.json 页面路由配置

`pages.json` 是 UniApp 的核心配置文件,用于配置页面路由、窗口样式、tabBar、分包等。

#### 3.1.1 基础配置

```json
{
  "pages": [ // 页面路径列表
    {
      "path": "pages/index/index",  // 页面路径,第一个为首页
      "style": {
        "navigationBarTitleText": "首页",         // 导航栏标题文字
        "navigationBarTextStyle": "black",        // 导航栏文字颜色(black/white)
        "navigationBarBackgroundColor": "#ffffff", // 导航栏背景颜色
        "backgroundColor": "#f8f8f8",             // 窗口背景色
        "enablePullDownRefresh": true,            // 是否开启下拉刷新
        "onReachBottomDistance": 50,              // 页面上拉触底事件触发距离(px)
        "backgroundTextStyle": "dark"             // 下拉loading样式(dark/light)
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationBarTitleText": "详情页",
        "navigationStyle": "custom"  // 自定义导航栏(隐藏原生导航)
      }
    }
  ],
  
  "globalStyle": { // 全局默认窗口样式
    "navigationBarTextStyle": "black",           // 导航栏文字颜色
    "navigationBarTitleText": "uni-app",         // 导航栏标题
    "navigationBarBackgroundColor": "#ffffff",   // 导航栏背景色
    "backgroundColor": "#f8f8f8",                // 窗口背景色
    "backgroundTextStyle": "dark",               // 下拉loading样式
    "enablePullDownRefresh": false,              // 是否开启下拉刷新
    "pageOrientation": "portrait",               // 屏幕旋转方向(portrait竖屏/landscape横屏)
    "rpxCalcMaxDeviceWidth": 960,                // rpx计算的最大设备宽度(px)
    "rpxCalcBaseDeviceWidth": 375                // rpx计算的基准设备宽度(px),默认375
  }
}
```

#### 3.1.2 tabBar 配置

```json
{
  "tabBar": {
    "color": "#999999",              // tab上文字默认颜色(未选中)
    "selectedColor": "#007aff",      // tab上文字选中颜色
    "backgroundColor": "#ffffff",    // tab背景色
    "borderStyle": "black",          // tabBar上边框颜色(black/white)
    "height": "50px",                // tabBar高度(默认50px)
    "fontSize": "10px",              // 文字大小(默认10px)
    "iconWidth": "24px",             // 图标宽度(默认24px)
    "spacing": "3px",                // 图标和文字间距(默认3px)
    "list": [ // tab列表,最少2个,最多5个
      {
        "pagePath": "pages/index/index",           // 页面路径,必须在pages中定义
        "text": "首页",                            // tab按钮文字
        "iconPath": "static/tabbar/home.png",      // 未选中图片路径
        "selectedIconPath": "static/tabbar/home_active.png" // 选中图片路径
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类",
        "iconPath": "static/tabbar/category.png",
        "selectedIconPath": "static/tabbar/category_active.png"
      },
      {
        "pagePath": "pages/cart/cart",
        "text": "购物车",
        "iconPath": "static/tabbar/cart.png",
        "selectedIconPath": "static/tabbar/cart_active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的",
        "iconPath": "static/tabbar/user.png",
        "selectedIconPath": "static/tabbar/user_active.png"
      }
    ],
    "midButton": { // 中间凸起按钮(可选)
      "width": "80px",
      "height": "50px",
      "text": "发布",
      "iconPath": "static/tabbar/add.png",
      "iconWidth": "40px",
      "backgroundImage": "static/tabbar/mid_bg.png"
    }
  }
}
```

#### 3.1.3 分包配置

```json
{
  "subPackages": [ // 分包配置,优化小程序包体积
    {
      "root": "subPkg/goods",        // 分包根目录
      "pages": [                     // 分包页面
        {
          "path": "list/list",       // 完整路径为: subPkg/goods/list/list
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
          "path": "confirm/confirm",
          "style": {
            "navigationBarTitleText": "确认订单"
          }
        }
      ]
    }
  ],
  
  "preloadRule": { // 分包预加载规则
    "pages/index/index": { // 在进入首页时
      "network": "all",    // 在所有网络环境下预加载(all/wifi)
      "packages": ["subPkg/goods"] // 预加载goods分包
    }
  }
}
```

### 3.2 manifest.json 应用配置

`manifest.json` 文件是应用的配置文件,用于指定应用的名称、图标、权限等。

#### 3.2.1 基础配置

```json
{
  "name": "uni-app项目名称",        // 应用名称
  "appid": "__UNI__XXXXXXX",        // 应用标识,云端打包时必填
  "description": "应用描述",         // 应用描述
  "versionName": "1.0.0",           // 版本名称
  "versionCode": "100",             // 版本号(纯数字)
  
  // App端配置
  "app-plus": {
    "splashscreen": { // 启动图配置
      "alwaysShowBeforeRender": true,    // 首页白屏时显示启动图
      "waiting": true,                   // 自动关闭启动图
      "autoclose": true,                 // 是否自动关闭
      "delay": 0                         // 延迟关闭时间(ms)
    },
    "modules": { // 模块配置
      "Geolocation": {},  // 定位
      "Camera": {},       // 相机
      "Gallery": {}       // 相册
    },
    "distribute": { // 打包发行配置
      "android": {
        "permissions": [ // Android权限
          "<uses-permission android:name=\"android.permission.CAMERA\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\"/>"
        ]
      },
      "ios": {}, // iOS配置
      "sdkConfigs": { // SDK配置
        "maps": { // 地图配置
          "amap": { // 高德地图
            "appkey_ios": "ios的appkey",
            "appkey_android": "android的appkey"
          }
        },
        "payment": { // 支付配置
          "weixin": { // 微信支付
            "appid": "微信开放平台appid",
            "UniversalLinks": "iOS通用链接"
          }
        }
      }
    }
  },
  
  // 微信小程序配置
  "mp-weixin": {
    "appid": "wx123456789",          // 微信小程序AppID
    "setting": {
      "urlCheck": false,              // 是否检查安全域名
      "es6": true,                    // 是否启用ES6转ES5
      "postcss": true,                // 上传时是否自动补全样式
      "minified": true                // 上传时是否压缩代码
    },
    "usingComponents": true,          // 是否启用自定义组件模式
    "permission": { // 小程序接口权限
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序定位"
      }
    },
    "requiredPrivateInfos": [ // 地理位置相关接口
      "getLocation",
      "chooseLocation"
    ]
  },
  
  // H5配置
  "h5": {
    "title": "应用标题",               // 页面title
    "template": "index.html",         // 自定义模板路径
    "router": {
      "mode": "hash",                 // 路由模式(hash/history)
      "base": "/"                     // 应用基础路径
    },
    "devServer": { // 开发服务器配置
      "port": 8080,                   // 端口
      "disableHostCheck": true,       // 禁用host检查
      "proxy": { // 代理配置
        "/api": {
          "target": "http://localhost:3000", // 目标服务器
          "changeOrigin": true,              // 是否改变源
          "secure": false,                   // 是否验证SSL证书
          "pathRewrite": {
            "^/api": ""                      // 路径重写
          }
        }
      }
    }
  }
}
```

### 3.3 条件编译机制

条件编译是 UniApp 实现跨平台的核心机制,通过特殊注释实现不同平台代码的差异化处理。

#### 3.3.1 平台标识

```javascript
// 常用平台标识:
// APP-PLUS          - App
// H5                - H5
// MP-WEIXIN         - 微信小程序
// MP-ALIPAY         - 支付宝小程序
// MP-BAIDU          - 百度小程序
// MP-TOUTIAO        - 字节跳动小程序
// MP-QQ             - QQ小程序
// MP                - 所有小程序平台
// QUICKAPP-WEBVIEW  - 快应用(webview)
```

#### 3.3.2 条件编译语法

**在 JavaScript 中:**

```javascript
// #ifdef 平台标识
// 仅在指定平台编译
// #endif

// 示例1: 仅微信小程序执行
// #ifdef MP-WEIXIN
console.log('这是微信小程序');
wx.showToast({ title: '微信小程序专属' }); // 使用微信原生API
// #endif

// 示例2: 仅H5执行
// #ifdef H5
console.log('这是H5');
document.title = 'H5页面标题'; // 使用Web API
// #endif

// 示例3: 仅App执行
// #ifdef APP-PLUS
console.log('这是App');
plus.runtime.version; // 使用5+ API
// #endif

// #ifndef 平台标识
// 除指定平台外都编译
// #endif

// 示例4: 除H5外都执行
// #ifndef H5
console.log('这不是H5');
// #endif

// 示例5: 多个平台(||表示或,&&表示且)
// #ifdef MP-WEIXIN || MP-ALIPAY
console.log('微信或支付宝小程序');
// #endif

// 示例6: 组合条件
// #ifdef APP-PLUS && APP-ANDROID
console.log('安卓App');
// #endif
```

**在 CSS 中:**

```css
/* #ifdef MP-WEIXIN */
/* 仅微信小程序的样式 */
.weixin-only {
  background: green;
  padding: 20rpx;
}
/* #endif */

/* #ifdef H5 */
/* 仅H5的样式 */
.h5-only {
  background: blue;
  padding: 20px; /* H5可以使用px */
}
/* #endif */

/* #ifndef MP */
/* 除所有小程序外的样式 */
.no-mp {
  font-size: 16px;
}
/* #endif */
```

**在 HTML 中:**

```vue
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <!-- 仅微信小程序显示 -->
    <button open-type="share">分享</button>
    <!-- #endif -->
    
    <!-- #ifdef H5 -->
    <!-- 仅H5显示 -->
    <a href="https://uniapp.dcloud.io">跳转外部链接</a>
    <!-- #endif -->
    
    <!-- #ifndef MP -->
    <!-- 除小程序外显示 -->
    <view @click="handleClick">非小程序内容</view>
    <!-- #endif -->
  </view>
</template>
```

#### 3.3.3 实战示例

**示例1: 获取用户信息**

```javascript
// 获取用户信息(不同平台实现不同)
export default {
  methods: {
    async getUserInfo() {
      // #ifdef MP-WEIXIN
      // 微信小程序使用wx.getUserProfile
      const res = await uni.getUserProfile({
        desc: '用于完善用户资料' // 必填,说明获取用户信息的用途
      });
      console.log('微信用户信息:', res.userInfo);
      // #endif
      
      // #ifdef H5
      // H5可以使用OAuth登录
      this.$router.push('/login');
      // #endif
      
      // #ifdef APP-PLUS
      // App使用原生登录
      plus.oauth.getServices((services) => {
        // 使用第三方登录服务
        console.log('可用服务:', services);
      });
      // #endif
    }
  }
}
```

**示例2: 分享功能**

```javascript
export default {
  methods: {
    shareContent() {
      // #ifdef MP-WEIXIN
      // 微信小程序分享(需要onShareAppMessage生命周期)
      // 这里只是触发分享菜单
      // #endif
      
      // #ifdef H5
      // H5使用Web Share API
      if (navigator.share) {
        navigator.share({
          title: '分享标题',
          text: '分享内容',
          url: window.location.href
        });
      }
      // #endif
      
      // #ifdef APP-PLUS
      // App使用原生分享
      plus.share.getServices((services) => {
        // 获取分享服务列表
        services[0].send({
          type: 'text',
          content: '分享内容'
        });
      });
      // #endif
    }
  },
  
  // #ifdef MP-WEIXIN
  // 微信小程序分享配置
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index',
      imageUrl: '/static/share.png'
    };
  }
  // #endif
}
```

**示例3: 请求域名配置**

```javascript
// utils/config.js
// 根据不同平台配置不同的API域名
let baseURL = '';

// #ifdef H5
// H5开发环境可以使用代理
baseURL = process.env.NODE_ENV === 'development'
  ? '/api'  // 开发环境使用代理
  : 'https://api.example.com'; // 生产环境使用真实域名
// #endif

// #ifdef MP
// 小程序必须使用配置好的合法域名
baseURL = 'https://api.example.com';
// #endif

// #ifdef APP-PLUS
// App可以请求任意域名
baseURL = 'https://api.example.com';
// #endif

export default {
  baseURL
};
```

#### 3.3.4 条件编译最佳实践

1. **优先使用 uni API**: 能用 uni 统一API就不用条件编译
2. **平台特有功能才编译**: 只在必须时使用条件编译
3. **抽取平台差异代码**: 将平台差异代码封装成独立模块
4. **注释清晰**: 在条件编译块前后添加说明注释

---

## 四、组件详解

### 4.1 视图容器组件

#### 4.1.1 view - 视图容器

基础容器组件,类似 HTML 的 `<div>`,用于布局和包裹其他组件。

```vue
<template>
  <view class="container">
    <!-- hover-class: 点击时添加的样式类名 -->
    <!-- hover-start-time: 按住多久后出现点击态(单位ms) -->
    <!-- hover-stay-time: 松开后点击态保留时间(单位ms) -->
    <view
      class="box"
      hover-class="box-hover"
      hover-start-time="50"
      hover-stay-time="200"
      @click="handleClick">
      点击我查看效果
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log('view被点击了'); // 点击事件处理
    }
  }
}
</script>

```

#### 4.1.2 scroll-view - 可滚动视图

可滚动的视图区域,用于实现局部滚动效果。
[scroll-view | uni-app官网](https://uniapp.dcloud.net.cn/component/scroll-view.html)

```vue
<template>
  <view>
    <!-- 纵向滚动 -->
    <!-- scroll-y: 允许纵向滚动 -->
    <!-- scroll-top: 设置滚动条位置 -->
    <!-- upper-threshold: 距顶部多远触发scrolltoupper事件(单位px,默认50) -->
    <!-- lower-threshold: 距底部多远触发scrolltolower事件(单位px,默认50) -->
    <!-- enable-flex: 启用flex布局 -->
    <!-- refresher-triggered: 设置当前刷新状态(true显示刷新/false关闭刷新) -->
	<!--scroll-into-view 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 -->
	<!--scroll-with-animation 在设置滚动条位置时使用动画过渡-->
    <scroll-view
      scroll-y
      style="height: 400rpx;"
      :scroll-top="scrollTop"
      :upper-threshold="50"
      :lower-threshold="50"
      @scrolltoupper="handleUpper"
      @scrolltolower="handleLower"
      @scroll="handleScroll"
       enable-flex
       :scroll-into-view="'tab-' + activeIndex" scroll-with-animation
      >
    
      <view v-for="item in 20" :key="item" class="item" :id="'tab-' + idx">
        第 {{item}} 项内容
      </view>
    </scroll-view>
    
  </view>
</template>

```

#### 4.1.3 swiper - 轮播图
[swiper | uni-app官网](https://uniapp.dcloud.net.cn/component/swiper.html#swiper)
滑块视图容器,常用于实现轮播图、banner广告等。

```vue
<template>
  <view>
    <!-- 基础轮播图 -->
    <!-- indicator-dots: 是否显示面板指示点 -->
    <!-- autoplay: 是否自动切换 -->
    <!-- interval: 自动切换时间间隔(单位ms) -->
    <!-- duration: 滑动动画时长(单位ms) -->
    <!-- circular: 是否采用衔接滑动(循环播放) -->
    <!-- indicator-color: 指示点颜色 -->
    <!-- indicator-active-color: 当前选中指示点颜色 -->
    <swiper
      class="swiper"
      @change="onSwiperChange">
      
      <swiper-item v-for="(item, index) in bannerList" :key="index">
        <image
          :src="item.image"
          mode="aspectFill"
          @click="handleBannerClick(item)">
        </image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bannerList: [ // 轮播图数据数组
        { id: 1, image: '/static/banner1.jpg', url: '/pages/detail/detail?id=1' },
      ]
    };
  },
  methods: {
    // 轮播切换时触发
    onSwiperChange(e) {
      // e.detail.current: 当前所在滑块的索引
      // e.detail.source: 触发方式(autoplay自动播放/touch用户滑动)
      console.log('当前页:', e.detail.current);
      console.log('触发方式:', e.detail.source);
    },
  }
}
</script>

```

### 4.2 基础内容组件

#### 4.2.1 text - 文本

文本组件,用于显示文字。

```vue
<template>
  <view>
    <!-- 基础文本 -->
    <text>普通文本内容</text>
    
    <!-- selectable: 长按可选择文本 -->
    <text selectable>可选择的文本(长按试试)</text>
    
    <!-- user-select: 是否可选(与selectable功能相同,优先级更高) -->
    <text user-select>可选择文本</text>
    
    <!-- space: 显示连续空格(ensp中文字符空格/emsp中文字符空格/nbsp根据字体设置) -->
    <text space="ensp">多个  空格  显示</text>
    
    <!-- decode: 是否解码(nbsp空格/ensp中文空格/emsp中文空格/lt小于号/gt大于号/amp&符号/apos单引号/quot双引号) -->
    <text decode>
      &lt;div&gt; HTML标签 &lt;/div&gt;
    </text>
    
    <!-- 嵌套文本(text内只能嵌套text) -->
    <text>
      外层文本
      <text style="color: red;">嵌套红色文本</text>
    </text>
  </view>
</template>
```

#### 4.2.2 progress - 进度条

进度条组件。

```vue
<template>
  <view>
    <!-- percent: 百分比(0-100) -->
    <!-- show-info: 是否显示百分比文字 -->
    <!-- stroke-width: 进度条线的宽度(单位px) -->
    <!-- activeColor: 已选择的进度条颜色 -->
    <!-- backgroundColor: 未选择的进度条颜色 -->
    <!-- active: 进度条从左往右的动画 -->
    <!-- active-mode: 动画模式(backwards从头播放/forwards从当前进度播放) -->
    <progress
      :percent="percent"
      show-info
      stroke-width="4"
      activeColor="#007aff"
      backgroundColor="#eeeeee"
      active
      active-mode="forwards"
      @activeend="onProgressEnd">
    </progress>
    
    <button @click="increaseProgress">增加进度</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      percent: 0 // 当前进度值
    };
  },
  methods: {
    // 增加进度
    increaseProgress() {
      if (this.percent < 100) {
        this.percent += 10; // 每次增加10%
      }
    },
    
    // 进度条动画完成时触发
    onProgressEnd() {
      console.log('进度条动画完成');
    }
  }
}
</script>
```

### 4.3 表单组件

#### 4.3.1 form - 表单容器

表单组件,用于收集用户输入数据。提交时会获取所有带name属性的表单组件的值。

```vue
<template>
  <!-- @submit: 表单提交时触发(点击form-type="submit"的button时) -->
  <!-- @reset: 表单重置时触发(点击form-type="reset"的button时) -->
  <form @submit="formSubmit" @reset="formReset">
    
    <!-- input - 输入框 -->
    <!-- name: 表单项名称,提交时作为key使用 -->
    <!-- type: 输入类型(text文本/number数字/idcard身份证/digit带小数点数字) -->
    <!-- placeholder: 占位符文字 -->
    <!-- maxlength: 最大输入长度(-1表示不限制) -->
    <!-- password: 是否为密码类型 -->
    <!-- disabled: 是否禁用 -->
    <!-- @input: 输入时触发 -->
    <!-- @focus: 获得焦点时触发 -->
    <!-- @blur: 失去焦点时触发 -->
    <input
      name="username"
      type="text"
      placeholder="请输入用户名"
      maxlength="10"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"/>
    
    <!-- checkbox-group - 多选框组 -->
    <!-- name: 表单项名称 -->
    <!-- @change: 选中项改变时触发,e.detail.value为选中项的value数组 -->
    <checkbox-group name="hobby" @change="onHobbyChange">
      <label v-for="item in hobbies" :key="item.value" class="checkbox-item">
        <!-- checkbox: 多选项 -->
        <!-- value: 选项标识符 -->
        <!-- checked: 是否默认选中 -->
        <!-- disabled: 是否禁用该选项 -->
        <!-- color: 选中时的颜色 -->
        <checkbox
          :value="item.value"
          :checked="item.checked"
          :disabled="item.disabled"
          color="#007aff"/>
        <text>{{item.name}}</text>
      </label>
    </checkbox-group>
    
    <!-- radio-group - 单选框组 -->
    <!-- name: 表单项名称 -->
    <!-- @change: 选中项改变时触发,e.detail.value为选中项的value -->
    <radio-group name="gender" @change="onGenderChange">
      <label class="radio-item">
        <!-- radio: 单选项 -->
        <!-- value: 选项标识符 -->
        <!-- checked: 是否默认选中 -->
        <!-- disabled: 是否禁用该选项 -->
        <!-- color: 选中时的颜色 -->
        <radio value="male" checked color="#007aff"/>
        <text>男</text>
      </label>
      <label class="radio-item">
        <radio value="female" color="#007aff"/>
        <text>女</text>
      </label>
    </radio-group>
    
    <!-- picker - 选择器 -->
    <!-- mode: 选择器类型 -->
    <!--   selector: 普通选择器 -->
    <!--   multiSelector: 多列选择器 -->
    <!--   time: 时间选择器 -->
    <!--   date: 日期选择器 -->
    <!--   region: 省市区选择器 -->
    <!-- :range: 选项数组(mode=selector时使用) -->
    <!-- :value: 当前选中的索引 -->
    <!-- @change: 值改变时触发 -->
    <picker
      name="city"
      mode="selector"
      :range="cities"
      :value="cityIndex"
      @change="pickerChange">
      <view class="picker-view">
        当前选择: {{cities[cityIndex]}}
      </view>
    </picker>
    
    <!-- slider - 滑块选择器 -->
    <!-- name: 表单项名称 -->
    <!-- min: 最小值(默认0) -->
    <!-- max: 最大值(默认100) -->
    <!-- step: 步长,每次滑动的最小单位(默认1) -->
    <!-- value: 当前取值 -->
    <!-- show-value: 是否显示当前值 -->
    <!-- activeColor: 已选择的颜色 -->
    <!-- backgroundColor: 背景条的颜色 -->
    <!-- @change: 完成一次拖动后触发 -->
    <!-- @changing: 拖动过程中持续触发 -->
    <slider
      name="volume"
      min="0"
      max="100"
      step="1"
      :value="volume"
      show-value
      activeColor="#007aff"
      backgroundColor="#e9e9e9"
      @change="onSliderChange"
      @changing="onSliderChanging"/>
    
    <!-- switch - 开关选择器 -->
    <!-- name: 表单项名称 -->
    <!-- checked: 是否选中 -->
    <!-- disabled: 是否禁用 -->
    <!-- type: 样式类型(switch开关样式/checkbox复选框样式) -->
    <!-- color: 选中时的颜色 -->
    <!-- @change: 值改变时触发 -->
    <switch
      name="notification"
      :checked="isNotification"
      type="switch"
      color="#007aff"
      @change="onSwitchChange"/>
    
    <!-- textarea - 多行输入框 -->
    <!-- name: 表单项名称 -->
    <!-- placeholder: 占位符文字 -->
    <!-- maxlength: 最大输入长度(-1表示不限制) -->
    <!-- auto-height: 是否自动增高,当内容超出高度时自动增加高度 -->
    <!-- disabled: 是否禁用 -->
    <!-- @input: 输入时触发 -->
    <!-- @focus: 获得焦点时触发 -->
    <!-- @blur: 失去焦点时触发 -->
    <textarea
      name="description"
      placeholder="请输入描述"
      maxlength="200"
      auto-height
      @input="onTextareaInput"/>
    
    <!-- button - 按钮 -->
    <!-- form-type: 表单按钮类型(submit提交表单/reset重置表单) -->
    <!-- type: 按钮样式类型(primary主要按钮/default默认按钮/warn警告按钮) -->
    <button type="primary" form-type="submit">提交表单</button>
    <button type="default" form-type="reset">重置表单</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      hobbies: [ // 爱好选项列表
        { value: 'reading', name: '阅读', checked: false, disabled: false },
        { value: 'music', name: '音乐', checked: true, disabled: false },
        { value: 'sports', name: '运动', checked: false, disabled: false }
      ],
      cities: ['北京', '上海', '广州', '深圳'], // 城市列表
      cityIndex: 0, // 当前选中的城市索引
      volume: 50, // 音量值
      isNotification: true // 是否开启通知
    };
  },
  methods: {
    // 表单提交
    formSubmit(e) {
      // e.detail.value 包含所有带name属性的表单组件的值
      console.log('表单数据:', e.detail.value);
      // 输出示例: { username: '张三', hobby: ['music'], gender: 'male', city: '北京', volume: 50, notification: true, description: '描述内容' }
      
      // 这里可以进行数据验证和提交
      // 验证通过后调用接口提交数据
    },
    
    // 表单重置
    formReset() {
      console.log('表单已重置');
      // 表单重置后会清空所有输入内容
    },
    
    // 输入框输入时触发
    onInput(e) {
      console.log('输入内容:', e.detail.value);
    },
    
    // 输入框获得焦点
    onFocus(e) {
      console.log('输入框获得焦点');
    },
    
    // 输入框失去焦点
    onBlur(e) {
      console.log('输入框失去焦点');
    },
    
    // 多选框改变
    onHobbyChange(e) {
      console.log('选中的爱好:', e.detail.value); // 返回选中项的value数组,例如: ['music', 'sports']
    },
    
    // 单选框改变
    onGenderChange(e) {
      console.log('选中的性别:', e.detail.value); // 返回选中项的value,例如: 'male'
    },
    
    // 选择器改变
    pickerChange(e) {
      this.cityIndex = e.detail.value; // 更新选中的索引
      console.log('选中的城市:', this.cities[this.cityIndex]);
    },
    
    // 滑块改变(拖动结束时触发)
    onSliderChange(e) {
      this.volume = e.detail.value; // 更新音量值
      console.log('最终音量值:', e.detail.value);
    },
    
    // 滑块改变中(拖动过程中持续触发)
    onSliderChanging(e) {
      console.log('拖动中的值:', e.detail.value);
    },
    
    // 开关改变
    onSwitchChange(e) {
      this.isNotification = e.detail.value; // 更新开关状态
      console.log('开关状态:', e.detail.value); // true表示开启,false表示关闭
    },
    
    // 多行文本输入
    onTextareaInput(e) {
      console.log('多行文本:', e.detail.value);
      console.log('当前字数:', e.detail.value.length); // 获取当前输入的字数
    }
  }
}
</script>

<style>
.checkbox-item,
.radio-item {
  display: flex;           /* 显示方式: 弹性布局 */
  align-items: center;     /* 交叉轴对齐: 居中对齐 */
  padding: 20rpx;          /* 内边距: 20rpx */
  border-bottom: 1px solid #eee; /* 底部边框: 1px实线浅灰色 */
}
.checkbox-item text,
.radio-item text {
  margin-left: 20rpx; /* 左外边距: 20rpx */
}
.picker-view {
  padding: 20rpx;          /* 内边距: 20rpx */
  background: #f8f8f8;     /* 背景色: 浅灰色 */
  border-radius: 8rpx;     /* 圆角: 8rpx */
}
</style>
```

### 4.4 媒体组件

#### 4.4.1 image - 图片

图片组件,用于展示图片。

```vue
<template>
  <view>
    <!-- src: 图片资源地址(本地路径或网络地址) -->
    <!-- mode: 图片裁剪、缩放的模式 
      aspectFit: 保持纵横比缩放,完整显示图片(可能有留白)
      aspectFill: 保持纵横比缩放,填满容器(可能裁剪)
      widthFix: 宽度不变,高度自动变化,保持纵横比 
      heightFix: 高度不变,宽度自动变化,保持纵横比 
     -->
    <!-- lazy-load: 图片懒加载 -->
    <!-- @error: 图片加载失败时触发 -->
    <!-- @load: 图片加载完成时触发 -->
  
    <image src="/static/img.jpg" mode="widthFix" style="width: 100%;"></image>
    
    <!-- 懒加载示例 -->
    <image
      src="/static/img.jpg"
      mode="aspectFill"
      lazy-load
      @error="onImageError"
      @load="onImageLoad">
    </image>
  </view>
</template>

<script>
export default {
  methods: {
    // 图片加载失败
    onImageError(e) {
      console.log('图片加载失败:', e.detail); 
    },
    // 图片加载完成
    onImageLoad(e) {
      console.log('图片加载完成:', e.detail); 
    }
  }
}
</script>
```

#### 4.4.2 video - 视频

视频播放组件。

```vue
<template>
  <view>
    <!-- src: 视频资源地址 -->
    <!-- controls: 是否显示默认播放控件 -->
    <!-- autoplay: 是否自动播放 -->
    <!-- loop: 是否循环播放 -->
    <!-- muted: 是否静音播放 -->
    <!-- initial-time: 指定视频初始播放位置(单位秒) -->
    <!-- poster: 视频封面图片地址 -->
    <!-- @play: 开始/继续播放时触发 -->
    <!-- @pause: 暂停播放时触发 -->
    <!-- @ended: 播放到末尾时触发 -->
    <!-- @error: 视频播放出错时触发 -->
    <video
      src="/static/video.mp4"
      controls
      autoplay
      loop
      muted
      poster="/static/poster.jpg"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @error="onError">
    </video>
  </view>
</template>

<script>
export default {
  methods: {
    // 开始/继续播放
    onPlay() {
      console.log('视频开始播放');
    },
    
    // 暂停播放
    onPause() {
      console.log('视频暂停');
    },
    
    // 播放到末尾
    onEnded() {
      console.log('视频播放结束');
    },
    
    // 播放出错
    onError(e) {
      console.log('视频播放错误:', e.detail);
    }
  }
}
</script>
```

### 4.5 地图组件

#### 4.5.1 map - 地图

地图组件,用于展示地图。

```vue
<template>
  <view>
    <!-- latitude: 中心纬度 -->
    <!-- longitude: 中心经度 -->
    <!-- scale: 缩放级别(5-18) -->
    <!-- markers: 标记点数组 -->
    <!-- polyline: 路线数组 -->
    <!-- @markertap: 点击标记点时触发 -->
    <!-- @regionchange: 视野发生变化时触发 -->
    <map
      :latitude="latitude"
      :longitude="longitude"
      :scale="scale"
      :markers="markers"
      :polyline="polyline"
      @markertap="onMarkerTap"
      @regionchange="onRegionChange"
      style="width: 100%; height: 400rpx;">
    </map>
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: 39.909, // 中心纬度(天安门)
      longitude: 116.397, // 中心经度
      scale: 15, // 缩放级别
      markers: [ // 标记点数组
        {
          id: 1, // 标记点id
          latitude: 39.909, // 标记点纬度
          longitude: 116.397, // 标记点经度
          iconPath: '/static/marker.png', // 标记点图标路径
          width: 30, // 标记点图标宽度
          height: 30, // 标记点图标高度
          title: '天安门', // 标记点标题(点击时显示)
          callout: { // 自定义气泡窗口
            content: '北京市东城区', // 气泡内容
            display: 'ALWAYS', // 气泡显示方式(ALWAYS一直显示/BYCLICK点击显示)
            padding: 10, // 气泡内边距
            borderRadius: 5, // 气泡圆角
            bgColor: '#ffffff', // 气泡背景色
            color: '#000000' // 气泡文字颜色
          }
        }
      ],
      polyline: [ // 路线数组
        {
          points: [ // 路线坐标点数组
            { latitude: 39.909, longitude: 116.397 },
            { latitude: 39.910, longitude: 116.398 }
          ],
          color: '#007aff', // 线条颜色
          width: 4, // 线条宽度
          dottedLine: false // 是否虚线
        }
      ]
    };
  },
  methods: {
    // 点击标记点
    onMarkerTap(e) {
      // e.detail.markerId 标记点id
      console.log('点击标记点:', e.detail.markerId);
    },
    
    // 视野发生变化
    onRegionChange(e) {
      // e.type: begin开始移动/end移动结束
      // e.causedBy: gesture用户手势/scale缩放
      console.log('视野变化:', e.type, e.causedBy);
    }
  }
}
</script>
```

---

## 五、生命周期系统

### 5.1 应用生命周期 (App.vue)

```javascript
export default {
  onLaunch(options) {
    // 应用初始化,全局只触发一次
    console.log('应用启动');
  },
  onShow(options) {
    // 应用显示(从后台切到前台)
    console.log('应用显示');
  },
  onHide() {
    // 应用隐藏(从前台切到后台)
    console.log('应用隐藏');
  },
  onError(error) {
    // 应用报错
    console.error('应用错误', error);
  }
}
```

### 5.2 页面生命周期

```javascript
export default {
  onLoad(options) {
    // 页面加载,一次性
    // 获取路由参数
    console.log('页面参数', options);
  },
  onShow() {
    // 页面显示,每次都触发
    console.log('页面显示');
  },
  onReady() {
    // 页面初次渲染完成,一次性
    console.log('页面渲染完成');
  },
  onHide() {
    // 页面隐藏
    console.log('页面隐藏');
  },
  onUnload() {
    // 页面卸载
    console.log('页面卸载');
  },
  //下拉刷新
  onPullDownRefresh() {
	// 在`pages.json`中对目标页面配置`"enablePullDownRefresh": true`
    // 下拉刷新(需在pages.json中开启)
    // 完成后调用 uni.stopPullDownRefresh()
  },
  //上拉加载
  onReachBottom() {
    // 触底加载
    console.log('触底加载');
  },
  onPageScroll(e) {
    // 页面滚动
    // e.scrollTop 滚动距离
  },
  onShareAppMessage() {
    // 分享(仅小程序)
    return {
      title: '分享标题',
      path: '/pages/index/index'
    }
  }
}
```

---

## 六、页面通信

### 6.1 组件通信

#### 父传子
```vue
<!-- 父组件 -->
<template>
  <child-component :title="title"></child-component>
</template>

<script>
export default {
  data() {
    return {
      title: '标题'
    }
  }
}
</script>

<!-- 子组件 -->
<template>
  <view>{{title}}</view>
</template>

<script>
export default {
  props: ['title']
}
</script>
```

#### 子传父
```vue
<!-- 子组件 -->
<template>
  <button @click="sendToParent">发送</button>
</template>

<script>
export default {
  methods: {
    sendToParent() {
      this.$emit('myEvent', '子组件数据');
    }
  }
}
</script>

<!-- 父组件 -->
<template>
  <child-component @myEvent="handleEvent"></child-component>
</template>

<script>
export default {
  methods: {
    handleEvent(data) {
      console.log(data);  // '子组件数据'
    }
  }
}
</script>
```

### **组件通信 - `EventChannel`**
```javascript
// 页面A（发送方）
uni.navigateTo({
    url: '/pages/B',
    success: (res) => {
        res.eventChannel.emit('sendData', { data: 'hello' });
    }
});

// 页面B（接收方，通常在 onLoad 中）
const eventChannel = this.getOpenerEventChannel();
eventChannel.on('sendData', (res) => {
    console.log(res.data); // 'hello'
});
```
**说明**: 用于非 `tabBar` 页面之间的复杂数据传输，尤其是当数据对象较大或需要异步获取时。通过 `eventChannel.emit` 发送，`eventChannel.on` 接收。

### **组件通信 - `$refs`**
```javascript
// 通过 ref 获取子组件实例，直接调用其方法
this.$refs.audioPlayer.play();
this.$refs.wordDetailPopup.init(word);
```
**说明**: 在父组件中，通过 `ref` 属性为子组件指定一个ID，然后使用 `this.$refs.ID` 来直接访问该子组件的属性和方法。



## 七 问题解决
### 7.1 同步资源失败问题解决

[HBuilder真机调试同步资源失败今天在调试项目的时候不小心把调试基座删掉了，然后我重新运行的时候，终端显示安装调试基 - 掘金](https://juejin.cn/post/7205111603464880186)

[真机运行，提示同步资源失败，未得到同步资源的授权，请停止运行后重新运行，并注意手机上的授权提示 - DCloud问答](https://ask.dcloud.net.cn/question/150966)


```js
//查看所有uni-app相关的包名
.\adb shell pm list package | findstr "uni" 
// 查看所有安装的第三方应用包名
.\adb shell pm list package -3 
// 卸载uni-app调试基座
.\adb uninstall uni.UNIG1DD0AAE 

最后自定义基座解决方案
D:\computer\HBuilderX\plugins\launcher\base\android_base.apk 安装到手机重新运行即可
```

**文档版本:** v1.0  
**最后更新:** 2025-12-02  
**适用于:** uni-app 3.x + Vue 2.x/3.x


## movable-view

可移动的视图容器，在页面中可以拖拽滑动或双指缩放。

`movable-view`必须在`movable-area`组件中，并且必须是直接子节点，否则不能移动。
[movable-view | uni-app官网](https://uniapp.dcloud.net.cn/component/movable-view.html#movable-view)