# 原生API 完全指南

## 📋 目录
### 第二章:原生Plus API
- [2.1 文件系统API](#21-文件系统api)
- [2.2 音频播放API](#22-音频播放api)
- [2.3 设备信息API](#23-设备信息api)
- [2.4 地理定位API](#24-地理定位api)
- [2.5 二维码扫描API](#25-二维码扫描api)
- [2.6 系统通知API](#26-系统通知api)
- [2.7 加速度传感器API](#27-加速度传感器api)
- [2.8 导航栏管理API](#28-导航栏管理api)

## [实际案例](#实际案例)

## 第二章:原生Plus API

### 2.1 文件系统API

#### plus.io.convertLocalFileSystemURL() - 路径转换

**功能说明:**
- 将相对路径转换为标准文件系统URL
- 5+ App文件系统专用API
- 用于后续文件操作

```javascript
// 将相对路径转换为标准URL
const filePath = plus.io.convertLocalFileSystemURL('_doc/historyData.json');
console.log('标准URL:', filePath);
// '_doc': 应用私有文档目录
```

#### 完整的文件读取流程

**实战案例 - 读取JSON文件:**

```javascript
export default {
    data() {
        return {
            history: []  // 历史记录数组
        };
    },
    methods: {
        // 读取历史记录
        async getHistory() {
            try {
                // 1. 转换文件路径
                const filePath = plus.io.convertLocalFileSystemURL('_doc/historyData.json');
                
                // 2. 使用Promise封装文件读取
                const fileContent = await new Promise((resolve, reject) => {
                    // 3. 解析文件系统URL
                    plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
                        // 4. 获取文件对象
                        entry.file((file) => {
                            // 5. 创建文件读取器
                            const reader = new plus.io.FileReader();
                            
                            // 6. 读取完成事件
                            reader.onloadend = (e) => {
                                resolve(e.target.result);  // 返回文件内容
                            };
                            
                            // 7. 读取文件为文本
                            reader.readAsText(file);
                        });
                    }, (e) => {
                        // 文件不存在时创建
                        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
                            fs.root.getFile('historyData.json', {create: true}, 
                                (fileEntry) => resolve('[]'));  // 返回空数组
                        });
                    });
                });
                
                // 8. 解析JSON数据
                this.history = JSON.parse(fileContent || '[]');
                console.log('历史记录:', this.history);
            } catch (e) {
                console.error('读取失败:', e);
                this.history = [];
            }
        }
    }
};
```

---

### 2.2 音频播放API





### 2.3 设备信息API

#### plus.device - 获取设备信息

**功能说明:**
- 获取设备的唯一标识、型号、系统版本等信息
- 常用于统计、用户唯一性识别等场景
- 可获取IMEI、UUID、型号等信息

**实战案例 - 获取设备信息:**

```javascript
export default {
    data() {
        return {
            deviceInfo: {}  // 设备信息对象
        };
    },
    onLoad() {
        this.getDeviceInfo();
    },
    methods: {
        // 获取设备信息
        getDeviceInfo() {
            // 需要在 #ifdef APP-PLUS 条件编译中使用
            // #ifdef APP-PLUS
            this.deviceInfo = {
                uuid: plus.device.uuid,              // 设备唯一标识
                model: plus.device.model,            // 设备型号
                vendor: plus.device.vendor,          // 设备厂商
                imei: plus.device.imei,              // 国际移动设备识别码
                imsi: plus.device.imsi,              // 国际移动用户识别码
                osname: plus.os.name,                // 系统名称
                osversion: plus.os.version           // 系统版本
            };
            console.log('设备信息:', this.deviceInfo);
            // #endif
        }
    }
};
```


#### **plus.device.getVolume()** - 获取设备音量
```javascript
// 获取当前设备的系统音量（HTML5+ API）
const volume = plus.device.getVolume();
console.log("当前音量：", volume);
```



---

### 2.4 地理定位API

#### plus.geolocation - 地理定位

**功能说明:**
- 获取当前设备的地理位置信息
- 支持GPS、WiFi、基站等多种定位方式
- 可实时监听位置变化

**实战案例 - 获取当前位置:**

```javascript
export default {
    data() {
        return {
            latitude: 0,    // 纬度
            longitude: 0,   // 经度
            address: '',    // 地址信息
            watchId: null   // 监听ID
        };
    },
    methods: {
        // 获取当前位置(单次)
        getCurrentLocation() {
            // #ifdef APP-PLUS
            plus.geolocation.getCurrentPosition(
                (position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.address = position.address;
                    
                    console.log('当前位置:', {
                        纬度: this.latitude,
                        经度: this.longitude,
                        地址: this.address
                    });
                    
                },
                (error) => {
                    console.error('定位失败:', error.message);
                },
                {
                    provider: 'system',      // 定位服务提供商:system/baidu/amap
                    coordsType: 'gcj02',     // 坐标系类型:wgs84/gcj02
                    geocode: true,           // 是否解析地址信息
                    timeout: 10000           // 超时时间(毫秒)
                }
            );
            // #endif
        },
        
        // 持续监听位置变化
        watchPosition() {
            // #ifdef APP-PLUS
            this.watchId = plus.geolocation.watchPosition(
                (position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.address = position.address;
                    console.log('位置更新:', position);
                },
                (error) => {
                    console.error('定位错误:', error.message);
                },
                {
                    provider: 'system',
                    coordsType: 'gcj02'
                }
            );
            // #endif
        },
        
        // 停止监听位置
        clearWatch() {
            // #ifdef APP-PLUS
            if (this.watchId) {
                plus.geolocation.clearWatch(this.watchId);
                this.watchId = null;
                console.log('已停止位置监听');
            }
            // #endif
        }
    },
    onUnload() {
        // 页面卸载时停止监听
        this.clearWatch();
    }
};
```

---

### 2.5 二维码扫描API

#### plus.barcode - 二维码/条形码扫描

**功能说明:**
- 调用摄像头扫描二维码、条形码
- 支持多种码制:QR_CODE、EAN_13、CODE_128等
- 支持相册选图识别

**实战案例 - 二维码扫描:**

```javascript
    // 打开扫码界面
    scanBarcode() {
        // #ifdef APP-PLUS
        const scan = new plus.barcode.Barcode('bcid');
    
        // 设置扫码区域
        scan.start({
            conserve: false,  // 是否保存扫码成功的图片
            filename: '_doc/barcode/',    // 保存路径
            vibrate: true,                // 扫码成功是否震动
            sound: 'system',              // 扫码成功提示音
        
            // 限制识别的码制类型
            filters: [
                plus.barcode.QR,          // QR二维码
                plus.barcode.EAN13,       // EAN13条形码
                plus.barcode.EAN8         // EAN8条形码
            ]
        });
            
        // 监听扫码成功事件
        scan.onmarked = (type, result, file) => {
            this.scanResult = result;
            console.log('扫码成功:', {
                类型: type,
                结果: result,
                图片: file
            });
            
            scan.close();
            this.handleScanResult(result);
        };
        
        // 监听扫码失败事件
        scan.onerror = (error) => {
            console.error('扫码失败:', error);
            scan.close();
            uni.showToast({
                title: '扫码失败',
                icon: 'none'
            });
        };
        // #endif
    },
        
    // 从相册选择二维码图片识别
    scanFromAlbum() {
        uni.chooseImage({
            count: 1,
            sourceType: ['album'],
            success: (res) => {
                const imagePath = res.tempFilePaths[0];
                
                // #ifdef APP-PLUS
                plus.barcode.scan(
                    imagePath,
                    (type, result) => {
                        this.scanResult = result;
                        this.handleScanResult(result);
                    },
                    (error) => {
                        uni.showToast({
                            title: '识别失败',
                            icon: 'none'
                        });
                    }
                );
                // #endif
            }
        });
    },
```

---

### 2.6 系统通知API

#### plus.push - 消息推送

**功能说明:**
- 创建本地通知消息
- 接收远程推送消息
- 管理通知权限

**实战案例 - 本地通知:**

```javascript
export default {
    data() {
        return {
            clientInfo: null  // 推送客户端信息
        };
    },
    onLoad() {
        this.initPush();
    },
    methods: {
        // 初始化推送服务
        initPush() {
            // #ifdef APP-PLUS
            plus.push.getClientInfo().then(info => {
                this.clientInfo = {
                    id: info.id,           // 客户端标识
                    token: info.token,     // 设备令牌
                    appid: info.appid,     // 应用标识
                    appkey: info.appkey    // 应用密钥
                };
                console.log('推送客户端信息:', this.clientInfo);
            });
            
            // 监听点击推送消息事件
            plus.push.addEventListener('click', (message) => {
                console.log('点击推送消息:', message);
                this.handlePushMessage(message);
            }, false);
            
            // 监听接收推送消息事件
            plus.push.addEventListener('receive', (message) => {
                console.log('接收推送消息:', message);
            }, false);
            // #endif
        },
        
        // 创建本地通知
        createLocalNotification() {
            // #ifdef APP-PLUS
            const options = {
                cover: false,                      // 是否覆盖之前的通知
                title: '提醒标题',                  // 通知标题
                content: '这是一条本地通知消息',     // 通知内容
                payload: { custom: 'data' },        // 自定义数据
                when: new Date().getTime() + 5000   // 5秒后显示
            };
            
            plus.push.createMessage(
                options.content,
                options.payload,
                options
            );
            
            uni.showToast({
                title: '通知已创建',
                icon: 'success'
            });
            // #endif
        },
        
        // 清除所有通知
        clearAllNotifications() {
            // #ifdef APP-PLUS
            plus.push.clear();
            console.log('已清除所有通知');
            // #endif
        },
        
        // 处理推送消息
        handlePushMessage(message) {
            
        }
    }
};
```

---

### 2.7 加速度传感器API

#### plus.accelerometer - 加速度传感器

**功能说明:**
- 监听设备的加速度变化
- 可用于摇一摇、计步器等功能
- 返回x、y、z三个方向的加速度值

**实战案例 - 摇一摇功能:**

```javascript
export default {
    data() {
        return {
            lastX: 0,
            lastY: 0,
            lastZ: 0,
            lastTime: 0,
            shakeThreshold: 3000,  // 摇一摇阈值
            watchId: null
        };
    },
    methods: {
        // 开始监听加速度
        startWatch() {
            // #ifdef APP-PLUS
            this.watchId = plus.accelerometer.watchAcceleration(
                (acceleration) => {
                    const currentTime = new Date().getTime();
                    const x = acceleration.xAxis;
                    const y = acceleration.yAxis;
                    const z = acceleration.zAxis;
                    
                    // 检测是否摇一摇
                    if (currentTime - this.lastTime > 100) {
                        const diffTime = currentTime - this.lastTime;
                        this.lastTime = currentTime;
                        
                        const deltaX = x - this.lastX;
                        const deltaY = y - this.lastY;
                        const deltaZ = z - this.lastZ;
                        
                        const speed = (Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaZ)) / diffTime * 10000;
                        
                        // 超过阈值,触发摇一摇
                        if (speed > this.shakeThreshold) {
                            this.onShake();
                        }
                        
                        this.lastX = x;
                        this.lastY = y;
                        this.lastZ = z;
                    }
                },
                (error) => {
                    console.error('加速度传感器错误:', error.message);
                },
                {
                    frequency: 100  // 更新频率(毫秒)
                }
            );
            // #endif
        },
        
        // 停止监听
        stopWatch() {
            // #ifdef APP-PLUS
            if (this.watchId) {
                plus.accelerometer.clearWatch(this.watchId);
                this.watchId = null;
            }
            // #endif
        },
        
        // 摇一摇触发事件
        onShake() {
            console.log('检测到摇一摇');
                  
            uni.showToast({
                title: '摇一摇成功!',
                icon: 'success'
            });
            
            // 执行摇一摇业务逻辑
            this.handleShakeAction();
        },
        
        // 摇一摇业务处理
        handleShakeAction() {
            // 例如:随机抽奖、刷新列表等
            console.log('执行摇一摇业务');
        }
    },
    onLoad() {
        this.startWatch();
    },
    onUnload() {
        this.stopWatch();
    }
};
```

---
#### plus.device.vibrate 震动   
    plus.device.vibrate(200);  // 震动200毫秒


### 2.8 导航栏管理API

#### plus.navigator - 导航栏管理

**功能说明:**
- 管理应用启动画面
- 检查系统权限
- 判断设备特性(如刘海屏)
- 隐藏系统导航栏

**实战案例 - 导航栏管理:**

```javascript
export default {
    data() {
        return {
            hasNotch: false,        // 是否刘海屏
            hasSplash: false,       // 启动页是否存在
            permissions: {}         // 权限状态
        };
    },
    onLaunch() {
        this.initNavigator();
    },
    methods: {
        // 初始化导航管理
        initNavigator() {
            // #ifdef APP-PLUS
            // 延迟关闭启动页(3秒后)
            setTimeout(() => {
                plus.navigator.closeSplashscreen();
                console.log('启动页已关闭');
            }, 3000);
            
            // 检查是否刘海屏
            this.hasNotch = plus.navigator.hasNotchInScreen();
            console.log('是否刘海屏:', this.hasNotch);
            
            // 查询启动页状态
            this.hasSplash = plus.navigator.hasSplashscreen();
            console.log('启动页状态:', this.hasSplash);
            // #endif
        },
        
        // 检查定位权限
        checkLocationPermission() {
            // #ifdef APP-PLUS
            const permission = plus.navigator.checkPermission('LOCATION');
            
            switch (permission) {
                case 'authorized':
                    console.log('已授权定位权限');
                    this.permissions.location = true;
                    break;
                case 'denied':
                    console.log('已拒绝定位权限');
                    this.permissions.location = false;
                    this.showPermissionTip();
                    break;
                case 'undetermined':
                    console.log('未确定定位权限');
                    this.permissions.location = null;
                    break;
                default:
                    console.log('无法查询定位权限');
            }
            
            return this.permissions.location;
            // #endif
        },
        
        // 检查相机权限
        checkCameraPermission() {
            // #ifdef APP-PLUS
            const permission = plus.navigator.checkPermission('CAMERA');
            this.permissions.camera = permission === 'authorized';
            return this.permissions.camera;
            // #endif
        },
        
        // 检查相册权限
        checkPhotoPermission() {
            // #ifdef APP-PLUS
            const permission = plus.navigator.checkPermission('WRITE_PHOTOS');
            this.permissions.photo = permission === 'authorized';
            return this.permissions.photo;
            // #endif
        },
        
        // 权限被拒提示
        showPermissionTip() {
            uni.showModal({
                title: '权限不足',
                content: '需要相关权限才能使用此功能,请前往设置开启',
                confirmText: '去设置',
                success: (res) => {
                    if (res.confirm) {
                        // 打开系统设置
                        // #ifdef APP-PLUS
                        plus.runtime.openSetting();
                        // #endif
                    }
                }
            });
        },
        
        // 隐藏系统导航栏(全屏模式)
        hideSystemNavigation() {
            // #ifdef APP-PLUS
            plus.navigator.hideSystemNavigation();
            console.log('已隐藏系统导航栏');
            // #endif
        },
        
        // 创建桌面快捷方式
        createShortcut() {
            // #ifdef APP-PLUS
            plus.navigator.createShortcut({
                name: '应用名称',
                icon: 'icon.png',
                extra: { data: 'shortcut' }
            }, () => {
                uni.showToast({
                    title: '快捷方式已创建',
                    icon: 'success'
                });
            }, (error) => {
                console.error('创建失败:', error);
            });
            // #endif
        }
    }
};
        // 停止播放
        stopAudio() {
            this.bgAudioManager.stop();
        }
    }
};
```

---

### **重启应用 - plus.runtime.restart**
```javascript
// 重启应用（5+ App 环境）
plus.runtime.restart();

// 应用场景：
// 1. 语言切换后重启应用
// 2. 重要配置更新后重启
// 3. 清除缓存后重启

// 注意：
// 1. 只在 5+ App 环境有效（uni-app 打包的 App）
// 2. 小程序和 H5 不支持
// 3. 会完全重启应用，清除当前状态

// 示例：语言切换后重启
changeLanguage() {
  uni.setLocale(this.currentLocale);
  this.$i18n.locale = this.currentLocale;
  plus.runtime.restart();
}
```
## 实际案例

### 判断微信是否安装

```javascript
    /**
     * 判断微信是否安装
     * 原理: 调用plus.runtime.isApplicationExist()方法判断微信是否安装     * 
     * @param {string} pname - 应用包名
     * @param {string} action - 应用启动动作
     */
	// #ifdef  APP-PLUS
	if (plus.runtime.isApplicationExist({
			pname: 'com.tencent.mm',
			action: 'weixin://'
		})) {
		//安装微信后的逻辑
		this.wechat = true
		console.log('微信已安装');
	} else {
		this.wechat = false
		console.log('微信未安装');
	}
	// #endif
```
### 缓存相关
```javascript
    /**
     * 清除缓存
     * @returns {void}
     * 原理: 调用plus.cache.clear()方法清除缓存
     */
	clear() {
		let os = plus.os.name; // 获取当前操作系统名称
		if (os == 'Android') {
			let main = plus.android.runtimeMainActivity();// 获取当前活动实例
			let sdRoot = main.getCacheDir(); // 获取应用缓存目录
			let files = plus.android.invoke(sdRoot, "listFiles");// 获取缓存目录下的所有文件
			let len = files.length;
			for (let i = 0; i < len; i++) {
				let filePath = '' + files[i];
				plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
					if (entry.isDirectory) {
						entry.removeRecursively((entry) => {
							uni.showToast({
								title: this.$t('me.completed'),
								duration: 2000,
								icon: 'none'
							});
							this.formatSize();
						}, (e) => {
							console.log(e.message)
						});
					} else {
						entry.remove();
					}
				}, (e) => {
					console.log('文件路径读取失败')
				});
			}
		} else { // ios  
			plus.cache.clear(() => {
				uni.showToast({
					title: this.$t('me.completed'),
					duration: 2000,
					icon: 'none'
				});
				this.formatSize();
			});
		}

	},
    /**
     * 格式化缓存大小
     * @returns {void}
     * 原理: 调用plus.cache.calculate()方法获取缓存大小，根据大小格式化显示
     */
	formatSize() {
		plus.cache.calculate((size) => {
			let sizeCache = parseInt(size);
			if (sizeCache == 0) {
				this.fileSizeString = "0B";
			} else if (sizeCache < 1024) {
				this.fileSizeString = sizeCache + "B";
			} else if (sizeCache < 1048576) {
				this.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
			} else if (sizeCache < 1073741824) {
				this.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
			} else {
				this.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
			}
			this.styleList[2].text = this.fileSizeString
		});
	},
```
### 打开应用权限设置
```javascript
	/**
	 * 打开应用权限设置
	 * @returns {void}
	 * 原理: 调用plus.android.runtimeMainActivity().startActivity()方法打开应用权限设置页面
	 */
	part() {
		var Intent = plus.android.importClass("android.content.Intent");// 导入Intent类
		var Settings = plus.android.importClass("android.provider.Settings");// 导入Settings类
		var Uri = plus.android.importClass("android.net.Uri");// 导入Uri类
		var mainActivity = plus.android.runtimeMainActivity();// 获取当前活动实例
		var intent = new Intent();// 创建Intent实例
		intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
		var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
		intent.setData(uri);
		mainActivity.startActivity(intent);
	},
```
### 切换回系统默认音频路由
```javascript

	/**
	 * 切换回系统默认音频路由
	 * @returns {void}
	 * 原理: 调用plus.android.runtimeMainActivity().getSystemService()方法获取AudioManager实例，调用setMode()方法设置音频模式为MODE_NORMAL，调用setSpeakerphoneOn()方法关闭强制扬声器
	 */ 
	// 切换回系统默认音频路由（自动选择蓝牙或扬声器）
	resetAudioRoute() {
		if (plus.os.name === 'Android') {
			const mainActivity = plus.android.runtimeMainActivity();
			const Context = plus.android.importClass('android.content.Context');
			const AudioManager = plus.android.importClass('android.media.AudioManager');
			
			const audioManager = mainActivity.getSystemService(Context.AUDIO_SERVICE);
			audioManager.setMode(AudioManager.MODE_NORMAL); // 恢复默认模式
			audioManager.setSpeakerphoneOn(false); // 关闭强制扬声器
		} else if (plus.os.name === 'iOS') {
			const AVAudioSession = plus.ios.importClass('AVAudioSession');
			const session = AVAudioSession.sharedInstance();
			
			// 恢复默认音频会话配置
			session.setCategoryWithOptionsError('AVAudioSessionCategoryPlayback', 0); 
			session.overrideOutputAudioPortError(0); // 0 表示取消覆盖，恢复默认
		}
	},
```
### 检查麦克风权限，录音
```javascript
start() {
	// 是否获取到麦克风权限
	// 检查权限状态
	plus.android.requestPermissions(
	["android.permission.RECORD_AUDIO"],
		(result) => {
			if (result.granted!='') {
	            console.log('权限已获取');				
			} else {
				uni.showToast({
					title:'此功能需要获取麦克风权限',
					icon:'none'
				})
	            console.log('权限被拒绝');
			}
		}
	);
},
```


### 跳转到 Android 系统设置

**题目**：请写出跳转到 Android 系统设置的代码片段并加上注释。

**答案**：

```javascript

onConnectBluetooth() {
    // 1. 获取主 Activity
    var main = plus.android.runtimeMainActivity();
    // 2. 导入意图类
    var Intent = plus.android.importClass("android.content.Intent");
    // 3. 创建跳转到蓝牙设置的意图
    var mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
    // 4. 执行跳转
    main.startActivity(mIntent);
}
```



# web API 完全指南

### **Web Audio API (AudioContext)** - 高级音频处理

```javascript

// 创建音频环境
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const splitter = audioContext.createChannelSplitter(2);// 创建声道分离器
const merger = audioContext.createChannelMerger(2);// 创建声道合并器
const gainLeft = audioContext.createGain();    // 创建增益节点

// 将左声道导向输出左侧
splitter.connect(gainLeft, 0);
gainLeft.connect(merger, 0, 0);
merger.connect(ctx.destination);

```

### **Uint8Array / ArrayBuffer** - 二进制数据处理

```javascript
// 创建指定长度的二进制缓冲区
const result = new Uint8Array(totalLength);
// 将 buffer 数据设置到指定偏移量
result.set(new Uint8Array(buffer), offset);
```



# 未整理

### 7. **plus.io** - 文件系统操作

```javascript

// HTML5+ 提供的本地文件系统访问接口

plus.io.resolveLocalFileSystemURL('_doc/data.json', (entry) => {

    entry.file((file) => {

        // 读取文件内容

    });

}, (error) => {

    // 处理错误或创建文件

});

```

# 可复用函数


### **requestAndroidPermission** - 安卓系统动态权限请求 (App端)
```javascript
/**
 * @description 用于在 5+ App 环境下动态请求安卓系统权限（如麦克风、定位等）。
 * @param {string|Array} permissionType - 需要请求的权限枚举，如 "android.permission.RECORD_AUDIO"
 * @returns {Promise<boolean>} 返回布尔值，true 代表已授权，false 代表拒绝
 * 
 * @example
 * const isGranted = await requestAndroidPermission("android.permission.ACCESS_FINE_LOCATION");
 */
function requestAndroidPermission(permissionType) {
    return new Promise((resolve) => {
        // 检查当前环境是否为 APP-PLUS
        if (typeof plus === 'undefined') {
            return resolve(false);
        }
        plus.android.requestPermissions(
            [].concat(permissionType),
            (result) => {
                // granted 数组存在内容则说明授权成功
                if (result.granted && result.granted.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            (err) => {
                console.error("权限请求失败", err);
                resolve(false);
            }
        );
    });
}
```