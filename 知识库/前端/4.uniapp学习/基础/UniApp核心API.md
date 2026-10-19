
# UniApp

## 📋 目录

### 第一章:UniApp核心API
- [1.1 系统信息相关API](#11-系统信息相关api)
- [1.2 存储相关API](#12-存储相关api)
- [1.3 媒体相关API](#13-媒体相关api)
- [1.4 文件操作API](#14-文件操作api)
- [1.5 界面交互API](#15-界面交互api)
- [1.6 页面路由API](#16-页面路由api)
- [1.7 网络请求API](#17-网络请求api)
- [1.8 设备权限API](#18-设备权限api)
- [1.9 位置服务API](#19-位置服务api)
- [1.10 登录授权API](#110-登录授权api)
- [1.11 国际化API](#111-国际化api)
- [1.12 音频管理API](#112-音频管理api)
- [1.13 事件通信API](#113-事件通信api)

### 第三章:高级应用场景
- [3.1 跨页面通信](#31-跨页面通信)

---

## 第一章:UniApp核心API

### 1.1 系统信息相关API

```javascript
// 获取系统信息
//`var(--status-bar-height)`获取状态栏高度进行占位，
//`env(safe-area-inset-bottom)`处理底部安全区域，避免内容被遮挡。
padding-bottom: calc(30rpx + env(safe-area-inset-bottom));

const systemInfo = uni.getSystemInfoSync();

// 返回信息：
// {
//   brand: 'Apple',              // 设备品牌
//   model: 'iPhone X',           // 设备型号
//   platform: 'ios',             // 平台类型：ios/android/devtools
//   system: 'iOS 13.4',          // 操作系统版本
//   screenWidth: 375,            // 屏幕宽度
//   screenHeight: 812,           // 屏幕高度
//   windowWidth: 375,            // 可使用窗口宽度px
//   windowHeight: 688,           // 可使用窗口高度px
//   statusBarHeight: 44,         // 状态栏高度px
//   pixelRatio: 3,               // 设备像素比
//   safeArea: {...},             // 安全区域
//   version: '13.4',             // 应用版本号
//   SDKVersion: '2.10.0',        // 基础库版本
//   language: 'zh_CN',           // 语言
//   fontSizeSetting: 16,         // 字体大小设置
// }

// 与异步版本 uni.getSystemInfo 的区别：
// uni.getSystemInfoSync(): 同步执行，立即返回结果
// uni.getSystemInfo({ success }): 异步执行，通过回调返回结果

// 打印关键信息
console.log('操作系统:', systemInfo.osName);           // 操作系统名称(ios/android/windows等)


实战用法:
- 页面加载时获取系统信息,根据不同平台调整布局
- 动态设置导航栏标题,根据是否为iOS设备显示不同图标
- 响应式调整内容区域高度,考虑状态栏、导航栏、tabBar等高度
- 根据系统信息调整页面布局,如是否显示返回按钮等
```

### 1.2 存储相关API

```javascript
// 存储数据
uni.setStorageSync('userInfo', {
    id: 10001,              // 用户ID
    name: '张三',           // 用户名
    token: 'abc123xyz'      // 登录令牌
});

// 读取数据
const userInfo = uni.getStorageSync('userInfo');
console.log('用户信息:', userInfo);

// 删除数据
uni.removeStorageSync('userInfo');

// 清空所有数据
uni.clearStorageSync();

实战用法:
- 页面加载时检查是否有用户登录信息,有则自动登录
- 注册时将用户信息存储到本地,登录后从本地读取
- 缓存网络请求数据,避免重复请求
- 存储用户设置(如主题、语言等)
```

### 1.3 媒体相关API

```javascript
// 选择图片
uni.chooseImage({
  count: 6,                      // 最多选择6张
  sizeType: ['compressed'],      // 压缩图，图片来源
  sourceType: ['album', 'camera'],,         // 从相册选择
  success: (res) => {
    console.log(res.tempFilePaths);
    console.log(res.tempFilePaths[0]); // 临时文件路径
  }
});

// 选择视频
uni.chooseVideo({
  sourceType: ['camera', 'album'],
  success: (res) => {
    console.log(res.tempFilePath);
  }
});

// 获取图片信息
uni.getImageInfo({
    src: imagePath,  // 图片路径
    success: (res) => {
        this.imageNaturalWidth = res.width;   // 保存原始宽度
        this.imageNaturalHeight = res.height; // 保存原始高度
        console.log('图片尺寸:', res.width, 'x', res.height);
    },
    fail: (error) => {
        console.error('获取失败:', error);
    }
});

// 保存图片到相册
uni.saveImageToPhotosAlbum({
    filePath: imagePath,
    success: () => {
        uni.showToast({ title: '已保存到相册', icon: 'success', duration: 2000 });
    },
    fail: (err) => {
        uni.showToast({ title: '保存失败', icon: 'none' });
    }
});

```
### 音频上下文对象
[uni.createInnerAudioContext() | uni-app官网](https://uniapp.dcloud.net.cn/api/media/audio-context.html#createinneraudiocontext)

```js
/**
 * 返回一个内音频上下文对象，用于播放音频、调整音量、设置循环播放等操作
 * 比如：start() 方法用于播放音频 ，setVolume() 方法用于设置音量 ，setLoop() 方法用于设置循环播放
 */
// 创建音频上下文实例
const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.src = 'path/to/audio.mp3';
innerAudioContext.play();
// 监听播放结束
innerAudioContext.onEnded(() => {
    console.log('播放结束');
});

// 监听可播放事件
audioContext.onCanplay(() => { /* 音频可播放 */ });
// 监听播放/暂停/停止
audioContext.onPlay(() => { this.isPlaying = true; });

audioContext.onPause(() => { this.isPlaying = false; });

audioContext.onStop(() => { this.isPlaying = false; });

// 监听播放结束
audioContext.onEnded(() => { /* 处理播放结束逻辑 */ });

// 监听进度更新（用于精确区间控制）
audioContext.onTimeUpdate(() => {});

// seek 跳转到指定时间
audioContext.seek(startTime);

// 设置播放倍速
audioContext.playbackRate = 1.5;

// 销毁实例（页面卸载时调用）
audioContext.destroy();


```

录音
[uni.getRecorderManager() | uni-app官网](https://uniapp.dcloud.net.cn/api/media/record-manager.html#getrecordermanager)
```js
initRecorder() {
  this.recorderManager = uni.getRecorderManager();
	this.recorderManager.onStart(() => {
	this.isRecording = true;
	uni.showToast({ title: '正在录音...', icon: 'none' });
  });

  this.recorderManager.onStop((res) => {
      this.isRecording = false;
      const { tempFilePath } = res;
// 将录音路径存入当前句子     
      this.$set(this.paragraphs[this.selectedSentenceIndex], 'recordPath', tempFilePath);
	 uni.showToast({ title: '录音已保存', icon: 'success' });
  });

  this.recorderManager.onError((res) => {
      this.isRecording = false;
      console.error('录音错误', res);
      uni.showToast({ title: '录音失败', icon: 'none' });
  });
},
```
### 1.4 文件操作API

```javascript
// 选择文件
uni.chooseFile({
  count: 1,
  extension: ['.pdf', '.doc'],
  success: (res) => {
    console.log(res.tempFilePaths);
  }
});

// 打开文档
uni.openDocument({
  filePath: res.tempFilePaths[0],
  success: () => {
    console.log('打开成功');
  }
});

// 下载文件
uni.downloadFile({
  url: 'https://example.com/file.pdf',
  success: (res) => {
    console.log(res.tempFilePath);
  }
});
```

### 1.5 界面交互API

```javascript
// 消息提示
uni.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
});

// Loading提示
uni.showLoading({
  title: '加载中',
  mask: true               // 是否显示透明蒙层，防止触摸穿透
});

// 隐藏Loading提示
uni.hideLoading();

// 模态弹窗
uni.showModal({
  title: '提示',                    // 标题（可选）
  content: '确定要切换语言吗？',     // 内容
  showCancel: true,                 // 是否显示取消按钮（默认 true）
  cancelText: '取消',               // 取消按钮文字（默认"取消"）
  confirmText: '确定',              // 确定按钮文字（默认"确定"）
  cancelColor: '#333',              // 取消按钮颜色
  confirmColor: '#ED6A1E',          // 确定按钮颜色
  success: (res) => {
    if(res.confirm) {
      console.log('确认');
    } else {
      console.log('取消');
    }
  },
  fail: (err) => {
    console.log('显示失败', err);
  },
  complete: (res) => {
    console.log('完成', res);
  }
});

// 操作菜单
uni.showActionSheet({
  itemList: ['选项1', '选项2', '选项3'],
  success: (res) => {
    console.log('选中第' + (res.tapIndex + 1) + '项');
  }
});

// 滚动到顶部
//[uni.pageScrollTo(OBJECT) | uni-app官网](https://uniapp.dcloud.net.cn/api/ui/scroll.html#pagescrollto)

uni.pageScrollTo({
  scrollTop: 0,
  duration: 300
});
```

### 1.6 页面路由API

```javascript
// 1. uni.navigateTo - 保留当前页,可返回
uni.navigateTo({
    url: '/pages/detail/index?id=1'
});

// 跳转传参
uni.navigateTo({
  url: '/pages/detail/detail?id=100&name=test'
});

// 接收参数
export default {
  onLoad(options) {
    console.log(options.id);    // '100'
    console.log(options.name);  // 'test'
  }
}

// 2. uni.redirectTo - 关闭当前页,不可返回
uni.redirectTo({
    url: '/pages/result/index'
});

// 3. uni.reLaunch - 关闭所有页面,打开新页面
uni.reLaunch({
    url: '/pages/index/index'
});

// 4. uni.switchTab - 跳转到tabBar页面
uni.switchTab({
    url: '/pages/home/index'
});

// 5. uni.navigateBack - 返回上一页
uni.navigateBack({
    delta: 1  // 返回的页面数,默认1
});

// 6. uni.hideTabBar - 隐藏tabBar
uni.hideTabBar({
    animation: true  // 是否显示动画
});

// 7. uni.setTabBarItem - 设置tabBar项
uni.setTabBarItem({
    index: 0,  // tabBar索引
    text: '首页',  // 新文字
    iconPath: '/static/images/home.png',  // 新图标路径
    selectedIconPath: '/static/images/home-active.png'  // 选中图标路径
    pagePath: "pages/index/index", // 新页面路径
});

// 8. uni.showTabBar - 显示tabBar
uni.showTabBar({
    animation: true  // 是否显示动画
});

```
### 1.7 网络请求API

```javascript
// GET请求
    /**
     * @description uni.request是发起网络请求的核心API。
     * @param {object} options - 请求配置对象。
     * @param {string} options.url - 开发者服务器接口地址。
     * @param {object} [options.data] - 请求的参数。
     * @param {string} [options.method='GET'] - HTTP 请求方法，如 'GET', 'POST'。
     * @param {object} [options.header] - 设置请求的 header。
     * @param {function} options.success - 收到开发者服务成功返回的回调函数。
     * @param {function} [options.fail] - 接口调用失败的回调函数。
     */
    uni.request({
        url: 'https://api.example.com/data',
        data: {
            id: 123
        },
        method: 'GET',
        success: (res) => {
            console.log(res.data); // 服务器返回的数据
        },
        fail: (err) => {
            console.error('请求失败', err);
        }
    });

// POST请求
uni.request({
    url: 'https://api.example.com/login',
    method: 'POST',
    data: {
        username: 'admin',
        password: '123456'
    },
    success: (res) => {
        console.log('登录成功:', res.data);
    }
});


// 上传文件到服务器
uni.uploadFile({
  url: 'https://example.com/upload',
  filePath: '文件路径',
  name: 'file',
  formData: { key: 'value' },
  success: (res) => {
    console.log(JSON.parse(res.data));
  }
});

// 创建 WebSocket 连接
ws = uni.connectSocket({
         url: wssUrl,
         complete: () => {}
})
// 监听连接打开
ws.onOpen(() => {
    ws.send(JSON.stringify({ text: 'hello' }));
});
// 监听消息接收
ws.onMessage((res) => {
    console.log('收到消息：', res.data);
});
ws.onerror = (e) => console.error(e);
ws.onclose = () => console.log('closed');
```

### 1.8 设备权限API

```javascript
// 打开系统设置页面
uni.openSetting({
    success: (res) => {
        console.log('权限状态:', res.authSetting);
        // res.authSetting示例:
        // {
        //   "scope.writePhotosAlbum": true,  // 相册权限
        //   "scope.camera": true,            // 相机权限
        //   "scope.userLocation": false      // 定位权限
        // }
    }
});

// App端:打开系统App的权限设置界面
// 微信小程序:打开系统微信App的权限设置界面
uni.openAppAuthorizeSetting({
    success: (res) => {
        console.log('打开成功');
    },
    fail: (err) => {
        console.log('打开失败:', err);
    }
});

```
### 1.9 位置服务API
```javascript
// 获取当前位置
uni.getLocation({
  type: 'gcj02', //返回可以用于uni.openLocation的经纬度坐标类型
  geocode:true,//是否返回地址信息
  success: (res) => {
    console.log('经度', res.longitude);
    console.log('纬度', res.latitude);
  }
});

// 查看位置
uni.openLocation({
  latitude: 39.909,
  longitude: 116.397,
  name: '天安门',
  address: '北京市东城区'
});
```

### 1.10 登录授权API

```javascript
// 登录授权
uni.login({
    provider: 'weixin',  // 登录服务提供商:weixin/qq/sinaweibo等
    success: (loginRes) => {
        console.log('登录成功:', loginRes.code);
        
        // 获取用户信息
        uni.getUserInfo({
            provider: 'weixin',
            success: (infoRes) => {
                console.log('用户信息:', infoRes.userInfo);
                // 将code和用户信息发送到后端服务器
                uni.request({
                    url: 'https://api.example.com/login',
                    method: 'POST',
                    data: {
                        code: loginRes.code,
                        userInfo: infoRes.userInfo
                    },
                    success: (res) => {
                        // 保存token
                        uni.setStorageSync('token', res.data.token);
                    }
                });
            }
        });
    },
    fail: (err) => {
        console.error('登录失败:', err);
    }
});

实战用法:
- 用户首次进入应用时进行登录授权
- 获取登录凭证code后发送到后端换取token
- 配合uni.getUserInfo获取用户基本信息
- 登录态过期时重新调用登录接口
```

### 1.11 国际化API
[uni-app官网] https://uniapp.dcloud.net.cn/tutorial/i18n.html)

```javascript
 在 script 中使用 this.$t()，在 template 中使用 {{$t()}}
 示例：this.$t('me.prompt') 或 {{$t("ai.disclaimer")}}

import VueI18n from "vue-i18n";
let i18nConfig = {
  //(2)
  locale: uni.getLocale(), //获取系统语言
  messages,
};
const i18n = new VueI18n(i18nConfig);

 uni.setLocale(locale);
 plus.runtime.restart();//重启应用
// 获取当前语言
const locale = uni.getLocale();
console.log('当前语言:', locale);  // 'zh-Hans'(简体中文)/'zh-Hant'(繁体中文)/'en'(英语)等

// 设置语言
uni.setLocale('en');  // 切换到英语

// 返回值：
// 'zh-Hans' - 简体中文
// 'zh-Hant' - 体中文
// 'en' - 英文
// 'ja' - 日文
// 'ko' - 韩文
// 'fr' - 法文
// 'es' - 西班牙文
// 'de' - 德文
// 'pt-BR' - 葡萄牙文（巴西）
// 'ru' - 俄文
// 'ar' - 阿拉伯文


实战用法:
- 根据用户选择切换应用语言
- 页面加载时获取当前语言显示对应文本
- 配合i18n实现多语言国际化
- 保存用户语言偏好设置
```

### **国际化 i18n - $i18n.locale**
```javascript
// Vue i18n 国际化插件
this.$i18n.locale = 'en';  // 设置当前语言

// 与 uni.setLocale 的区别：
// uni.setLocale(): 设置 uni-app 的语言环境
// this.$i18n.locale: 设置 Vue i18n 插件的当前语言

// 通常两者配合使用：
changeLanguage(locale) {
  uni.setLocale(locale);        // 设置 uni-app 语言
  this.$i18n.locale = locale;   // 设置 i18n 语言
  plus.runtime.restart();       // 重启应用
}

// i18n 基础用法：
// 1. 安装：npm install vue-i18n
// 2. 配置语言包
// 3. 使用 $t() 翻译

// 语言包示例：
const messages = {
  'zh-Hans': {
    me: {
      country: '选择国家/地区'
    }
  },
  'en': {
    me: {
      country: 'Select Country/Region'
    }
  }
};

// 使用：
<view>{{ $t('me.country') }}</view>
```


### 1.12 音频管理API

```javascript
// 获取背景音频管理器
const bgAudioManager = uni.getBackgroundAudioManager();

// 设置音频信息
bgAudioManager.title = '歌曲名称';
bgAudioManager.singer = '歌手名';
bgAudioManager.coverImgUrl = 'https://example.com/cover.jpg';
bgAudioManager.src = 'https://example.com/audio.mp3';  // 设置音频源会自动播放

// 播放控制
bgAudioManager.play();   // 播放
bgAudioManager.pause();  // 暂停
bgAudioManager.stop();   // 停止
bgAudioManager.seek(30); // 跳转到30秒位置

// 监听事件
bgAudioManager.onPlay(() => {
    console.log('开始播放');
});

bgAudioManager.onPause(() => {
    console.log('暂停播放');
});

bgAudioManager.onEnded(() => {
    console.log('播放结束');
});

bgAudioManager.onError((err) => {
    console.error('播放错误:', err);
});

实战用法:
- 获取背景音乐播放管理器实例，实现音乐播放器功能
- 支持后台播放(退出应用仍可播放)
- 显示播放进度和控制播放
- 支持锁屏控制和通知栏显示
- 适用于闹钟铃声、音乐播放器等场景
```

### 1.13 事件通信API

```javascript
// uni.$emit - 触发全局自定义事件
uni.$emit('eventName', data);

// uni.$on - 监听全局自定义事件
uni.$on('eventName', (data) => {
    console.log('接收到数据:', data);
});

// uni.$once - 监听一次全局自定义事件
uni.$once('eventName', (data) => {
    console.log('只触发一次:', data);
});

// uni.$off - 移除全局自定义事件监听
uni.$off('eventName');

// 在mounted钩子中监听事件总线
mounted() {
  this.$bus.$on('changeMask', this.onShowMask)
  this.$bus.$on('switchSong', this.onChangeMusic)
}

// 在beforeDestroy钩子中解绑
beforeDestroy() {
  this.$bus.$off('changeMask')
  this.$bus.$off('switchSong')
}

实战用法:
- 跨页面数据同步(购物车、消息数量等)
- 实时更新UI状态(设备列表、订单状态等)
- 登录状态变化通知所有相关页面
- 配置更新后通知各页面刷新
- 注意在页面卸载时移除监听避免内存泄漏
```

### 其他

```javascript
// 仅支持 Android，需在真机运行
let appBaseInfo = uni.getAppBaseInfo();
// 提取包名
let packageName = appBaseInfo.appId;
console.log('当前应用包名：', packageName);

// 隐藏键盘
uni.hideKeyboard();

// 动态 class 绑定
<!-- 对象写法：条件激活 -->
:class="['blank-item', { 'active': activeBlankIndex === item.index, 'review-mode': isReviewMode }]"

<!-- 三元写法 -->
:class="['icon-item', { 'active': showTranslation }]"
```

---

## 第三章:高级应用场景

### **获取页面栈 - getCurrentPages**
```javascript
// 获取当前页面栈
const pages = getCurrentPages();
console.log(pages);  // 页面实例数组

// pages 数组说明：
// pages[pages.length - 1]: 当前页面实例
// pages[pages.length - 2]: 上一个页面实例
// pages[pages.length - 3]: 上上个页面实例

// 应用场景：
// 1. 获取上一页数据
// 2. 修改上一页状态
// 3. 判断页面来源

// 示例1：获取上一页实例并修改数据
const prevPage = pages[pages.length - 2];  // 上一页实例
prevPage.$vm.styleList[1].text = 'English';  // 修改上一页数据

// 示例2：判断是否从特定页面跳转
const currentPage = pages[pages.length - 1];
console.log(currentPage.route);  // 当前页面路径

// 示例3：返回并刷新上一页
if (pages.length > 1) {
  const prevPage = pages[pages.length - 2];
  prevPage.$vm.loadData();  // 调用上一页方法刷新数据
  uni.navigateBack();
}

// 注意：
// 1. $vm 是 Vue 实例，可以访问 data、methods 等
// 2. 不要过度使用，可能导致页面状态混乱
// 3. 页面栈最多 10 层
```
### **renderjs** - 视图层与逻辑层通信

```vue

<!-- renderjs: 运行在视图层（webview）的 JavaScript 可以操作 DOM -->
<script module="image" lang="renderjs">
export default {
  data() {
    return {}
  },
  methods: {
    getimage(value) {
      var _this = this;
      // 获取 DOM 元素
      imageList_btn = document.getElementsByClassName('imageP');
      
      var imageList = [];
      
      for (var i = 0; i < imageList_btn.length; i++) {
        imageList_btn[i].index = i;
        imageList.push(imageList_btn[i].src);
        
        // 为每个图片添加点击事件
        imageList_btn[i].onclick = function() {
          // 调用逻辑层的方法this.$ownerInstance.callMethod('xxx函数',obj);
          _this.$ownerInstance.callMethod('detailImage', {
            index: this.index,
            list: imageList
          });
        }
      }
    }
  },
  mounted() {
    this.getimage();
  }
}
</script>

<!--  特点：
   1. 运行在视图层（webview），可以直接操作 DOM
   2. 可以使用浏览器 API（如 document、window）
   3. 性能更好，适合复杂交互
   4. 通过 $ownerInstance.callMethod 调用逻辑层方法
   
   应用场景：
   1. 操作 DOM 元素
   2. 处理富文本图片点击
   3. 实现复杂动画
   4. 使用第三方库（如 ECharts）
-->

<!-- 在模板中使用 -->
<view :strings="strings" :change:strings="image.getimage">
  <rich-text :nodes="strings"></rich-text>
</view>

<!-- 说明：
   :strings="strings": 绑定数据
   :change:strings="image.getimage": 数据变化时调用 renderjs 的方法
   image: renderjs 的 module 名称
   getimage: renderjs 的方法名称
-->
```

### **页面返回监听 - onBackPress**
```javascript
// 监听页面返回事件（物理返回键或导航栏返回按钮）
onBackPress(e) {
  // e.from: 返回来源
  // - 'backbutton': 物理返回键
  // - 'navigateBack': uni.navigateBack() 调用
  
  console.log('返回来源:', e.from);
  
  // 返回 true 可以阻止返回
  // return true;
  
  // 返回 false 或不返回，正常返回
  // return false;
}

// 应用场景：
// 1. 清理定时器、监听器
// 2. 弹窗确认是否退出
// 3. 阻止返回并执行自定义逻辑
```

### 仅当前页面禁用拖拽
```js
        {
            "path": "pages/sound/soundInfo",
            "style": {
                "navigationBarTitleText": "%pagesTitle.equalizer%",
                "navigationBarTextStyle": "black",
                "navigationBarBackgroundColor": "#f6f6f6",
                "app-plus": {
                    "bounce": "none" // 仅当前页面禁用拖拽，橡皮 
                }
            }
        },
```