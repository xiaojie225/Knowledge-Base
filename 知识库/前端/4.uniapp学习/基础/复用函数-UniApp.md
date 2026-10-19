
###  复用组件
#### 艾本备考
流式请求组件：（艾本备考部分）
[sse 客户端组件，支持兼容：v2、v3、安卓、ios、浏览器、微信小程序 - DCloud 插件市场](https://ext.dcloud.net.cn/plugin?id=20971)
<gao-ChatSSEClient 
  @onOpen="openCore" 
  @onError="errorCore" 
  @onMessage="messageCore" 
  @onFinish="finishCore" 
/>
```javascript
// 父组件监听子组件事件
<gao-ChatSSEClient 
  @onOpen="openCore" 
  @onError="errorCore" 
  @onMessage="messageCore" 
  @onFinish="finishCore" 
/>
```

音频播放组件
D:\work\艾本APP\aiben-an\aiben-an-new\pages\study\components\AudioPlayer.vue
```vue
<!-- 音频播放器组件 -->
<audio
    ref="audio
    :src="aud
    :playback-rate="parsedPlayba
    :start-time="currentSentence ? currentSentence.sta
    :end-time="currentSentence ? currentSentence.e
    :enable-limit
    @canplay="onAudioC
    @play="isPlaying 
    @pause="isPlaying =
    @stop="isPlaying =
    @ended="onAudi
    @time-limit-reached="onAudioLimitR
/>
```

###  屏幕亮度
```javascript
/**
 * 屏幕亮度设置
 * @param {boolean} flag - true：保持屏幕亮度；false：取消保持屏幕亮度
*/
setKeepScreenOn(flag){
	uni.setKeepScreenOn({
		keepScreenOn: flag
	});
},
```

### 手机会自动打开系统蓝牙设置界面

```javascript
/**
 * 作用：根据平台跳转到系统设置页面（蓝牙或通用设置）
 * @description 封装了 HTML5+ 的原生调用，支持 Android 和 iOS 平台
 * @returns {void}
 * 例子：openSystemSettings()
 */
function openSystemSettings() {
    const platform = uni.getSystemInfoSync().platform;
    if (platform === 'android') {
		//获取当前活动的主Activity实例
		var main = plus.android.runtimeMainActivity();
		//导入Android的Intent类
		var Intent = plus.android.importClass("android.content.Intent");
		//创建一个意图对象，用于启动蓝牙设置活动
		var mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
		//启动蓝牙设置活动
		main.startActivity(mIntent);
    } else if (platform === 'ios') {
        // iOS 跳转系统设置
        const UIApplication = plus.ios.import("UIApplication");
        const nsurl = plus.ios.import("NSURL");
        const setting = nsurl.URLWithString("App-prefs:root=Bluetooth"); // 或 "app-settings:"
        const application = UIApplication.sharedApplication();
        application.openURL(setting);
        // 记得清理引用
        plus.ios.deleteObject(setting);
        plus.ios.deleteObject(nsurl);
        plus.ios.deleteObject(application);
    }
}
```


### 获取地理位置并更新状态

```javascript
/**
 * 作用：获取当前地理位置（高德坐标系），并执行后续逻辑
 * @description 结合 uni.getLocation 获取经纬度及详细地址，常用于定位打卡或位置记录
 * @returns {void}
 * 例子：getAndUploadLocation()
 */
function getAndUploadLocation() {
    uni.getLocation({
        type: "gcj02", // 返回高德坐标系
        provider: "amap", // 使用高德SDK
        geocode: true, // 是否解析地址
        success: (res) => {
            console.log('获取位置成功：', res);
            // 更新地图中心点
            this.latitude = res.latitude;
            this.longitude = res.longitude;
        },
        fail: (err) => {
            console.error('获取位置失败：', err);
        }
    });
}

<!-- 基础地图显示 -->
<map
    style="width: 100%; height: 300px;"
    :latitude="latitude"
    :longitude="longitude"
    :markers="covers">
</map>

```


### 始化 UniApp 录音管理器并开始录音

```javascript
/**
 * 初始化 UniApp 录音管理器并开始录音。
 * @param {Object} vm - Vue/UniApp 实例上下文（通常为 this）。
 * @param {number} [duration=600000] - 最大录音时长（毫秒）。
 * @param {number} [sampleRate=16000] - 采样率。
 * @param {number} [frameSize=1024] - 帧大小。
 * @param {'mp3'|'aac'|'wav'|'PCM'} [format='wav'] - 录音格式。
 * @param {(res: {tempFilePath: string}) => void} [onStop] - 录音结束回调。
 * @returns {void}
 * @example
 * startRecorder(this, 600000, 16000, 1024, 'wav', (res) => {
 *   console.log('录音文件地址:', res.tempFilePath);
 * });
 */
function startRecorder(vm, duration = 600000, sampleRate = 16000, frameSize = 1024, format = 'wav', onStop) {
  vm.recorderManager = uni.getRecorderManager();
  if (typeof onStop === 'function') {
    vm.recorderManager.onStop(onStop);
  }
  vm.recorderManager.start({ duration, sampleRate, frameSize, format });
}
```

###  WebSocket 连接地址

```javascript
/**
 * 生成语音服务 WebSocket 连接地址（含签名参数）。
 * @param {Object} options - 配置参数。
 * @param {string} options.baseWsUrl - WebSocket 基础地址。
 * @param {string} options.accessKeyId - 访问 Key。
 * @param {string} options.apiSecret - 签名密钥。
 * @param {string} options.appId - 应用 ID。
 * @param {string} options.lang - 语种。
 * @param {string} options.audioEncode - 音频编码格式。
 * @param {string} options.sampleRate - 采样率。
 * @param {string} options.engLanguageName - 语言英文标识。
 * @param {string} options.utc - UTC 时间字符串。
 * @returns {string} 可直接用于连接的 WebSocket URL。
 */
function buildAstWebSocketUrl(options) {
  const signParams = {
    accessKeyId: options.accessKeyId,
    appId: options.appId,
    utc: options.utc,
    audio_encode: options.audioEncode,
    lang: options.lang,
    samplerate: options.sampleRate,
    eng_language_name: options.engLanguageName,
  };

  const baseStr = Object.keys(signParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(signParams[key])}`)
    .join('&');

  const signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(baseStr, options.apiSecret));

  const query = [
    `accessKeyId=${encodeURIComponent(options.accessKeyId)}`,
    `appId=${encodeURIComponent(options.appId)}`,
    `utc=${encodeURIComponent(options.utc)}`,
    `audio_encode=${encodeURIComponent(options.audioEncode)}`,
    `lang=${encodeURIComponent(options.lang)}`,
    `samplerate=${encodeURIComponent(options.sampleRate)}`,
    `eng_language_name=${encodeURIComponent(options.engLanguageName)}`,
    `signature=${signature}`,
  ].join('&');

  return `${options.baseWsUrl}?${query}`;
}
```

### 重置音频输出路由为系统默认路径

```javascript
/**
 * 重置音频输出路由为系统默认路径（兼容 Android / iOS）。
 * @returns {void}
 */
function resetAudioRoute() {
  if (plus.os.name === 'Android') {
    const mainActivity = plus.android.runtimeMainActivity();
    const Context = plus.android.importClass('android.content.Context');
    const AudioManager = plus.android.importClass('android.media.AudioManager');
    const audioManager = mainActivity.getSystemService(Context.AUDIO_SERVICE);
    audioManager.setMode(AudioManager.MODE_NORMAL);
    audioManager.setSpeakerphoneOn(false);
  } else if (plus.os.name === 'iOS') {
    const AVAudioSession = plus.ios.importClass('AVAudioSession');
    const session = AVAudioSession.sharedInstance();
    session.setCategoryWithOptionsError('AVAudioSessionCategoryPlayback', 0);
    session.overrideOutputAudioPortError(0);
  }
}
```



### 设置顶部安全区高度
```javascript
	const systemInfo = uni.getSystemInfoSync();
	// 安全区信息（包含 top, bottom, left, right, width, height）
	const safeArea = systemInfo.safeArea;
	  
	//底部安全区高度（即底部小黑条高度）
	const bottomSafeHeight = safeArea.bottom; 
	// 顶部安全区高度（状态栏 + 刘海区域，仅刘海屏有意义）
	const topSafeHeight = safeArea.top;
	console.log(systemInfo)
	console.log('底部安全区高度：', bottomSafeHeight);
	console.log('顶部安全区高度：', topSafeHeight);
	app.globalData.topSafeHeight = topSafeHeight;

```


### **uploadImage** - 上传图片到服务器
```javascript
/**
 * @description 将本地图片上传到服务器，返回上传后的文件路径
 * @param {string} filePath - 本地图片文件路径（来自uni.chooseImage的tempFilePaths）
 * @param {object} [options] - 可选配置
 * @param {string} [options.url] - 上传地址，默认从utils.common.baseUrl获取
 * @param {string} [options.name='iFile'] - 文件字段名
 * @param {object} [options.formData] - 附加表单数据
 * @returns {Promise} 返回Promise，resolve时返回上传结果的data对象
 *   resolve: { code: 1, data: { file_path: 'https://...' } }
 *   reject: { code: 0, msg: '错误信息' }
 * 
 * 作用：封装图片上传逻辑，自动处理loading显示、token获取等通用操作
 */
function uploadImage(filePath, options = {}) {
  const defaultConfig = {
    url: utils.common.baseUrl + '/api/upload/image',
    name: 'iFile',
    formData: {
      wxapp_id: utils.common.data.wxapp_id || 10001,
      token: uni.getStorageSync('token')
    }
  };

  const config = { ...defaultConfig, ...options };

  return new Promise((resolve, reject) => {
    uni.showLoading({ title: '上传中...' });
  
    uni.uploadFile({
      url: config.url,
      filePath: filePath,
      name: config.name,
      formData: { ...defaultConfig.formData, ...config.formData },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 1) {
            resolve(data);
          } else {
            reject({ code: 0, msg: data.msg || '上传失败' });
          }
        } catch (e) {
          reject({ code: 0, msg: '解析响应失败' });
        }
      },
      fail: (err) => {
        reject({ code: 0, msg: '上传异常', error: err });
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  });
}

/**
 * 使用示例：
 * // 基础使用
 * try {
 *   const result = await uploadImage('file://temp.jpg');
 *   console.log('上传成功，文件路径:', result.data.file_path);
 * } catch (error) {
 *   console.error('上传失败:', error.msg);
 * }
 * 
 * // 自定义参数
 * uploadImage('file://temp.jpg', {
 *   name: 'image',
 *   formData: { type: 'essay' }
 * }).then(res => {
 *   // 处理成功
 * }).catch(err => {
 *   // 处理失败
 * });
 */
```


### **chooseImage** - 选择图片
```javascript
/**
 * @description 从相机或相册选择图片，封装uni.chooseImage
 * @param {object} [options] - 配置项
 * @param {number} [options.count=1] - 最多可选图片数量
 * @param {Array<string>} [options.sourceType] - 图片来源，默认['camera', 'album']
 *   'camera' - 拍照
 *   'album' - 相册
 * @returns {Promise} 返回Promise
 *   resolve: { tempFilePaths: ['file1.jpg'], tempFiles: [...] }
 *   reject: { msg: '取消选择' } 或 错误信息
 * 
 * 作用：统一图片选择逻辑，简化调用
 */
function chooseImage(options = {}) {
  const defaultOptions = {
    count: 1,
    sourceType: ['camera', 'album']
  };

  const config = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: config.count,
      sourceType: config.sourceType,
      success: (res) => {
        resolve({
          tempFilePaths: res.tempFilePaths,
          tempFiles: res.tempFiles
        });
      },
      fail: (err) => {
        if (err.errMsg === 'chooseImage:fail cancel') {
          reject({ msg: '取消选择' });
        } else {
          reject(err);
        }
      }
    });
  });
}

/**
 * 使用示例：
 * // 拍照
 * try {
 *   const res = await chooseImage({ sourceType: ['camera'] });
 *   console.log('照片路径:', res.tempFilePaths[0]);
 * } catch (error) {
 *   if (error.msg === '取消选择') return;
 *   console.error('选择失败:', error);
 * }
 * 
 * // 从相册选择多张
 * try {
 *   const res = await chooseImage({ count: 3, sourceType: ['album'] });
 *   console.log('选择图片数:', res.tempFilePaths.length);
 * } catch (error) {
 *   console.error('选择失败:', error);
 * }
 */
```

