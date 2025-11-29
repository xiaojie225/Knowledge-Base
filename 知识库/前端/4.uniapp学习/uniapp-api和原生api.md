# uniapp的api
## `uni.getSystemInfoSync()获取系统信息
## `uni.getBackgroundAudioManager() 背景音频管理器

```
const systemInfo = uni.getSystemInfoSync();
const bgAudioManager = uni.getBackgroundAudioManager();
```
- **uni.getSystemInfoSync()：** uniapp同步获取系统信息API
    
    - **作用：** 获取设备的操作系统、版本、屏幕等信息
    - **同步特性：** 会阻塞代码执行直到获取完成
    - **为什么用同步：** 系统信息是后续逻辑的基础，必须先获取到
    - **返回值：** 包含osName、platform、windowWidth等属性的对象

- **uni.getBackgroundAudioManager()：** 背景音频管理器
    
    - **作用：** 获取用于播放背景音乐的管理器实例
    - **特点：** 支持应用切换到后台时继续播放
    - **使用场景：** 闹钟铃声播放，需要后台持续播放能力



## `uni.getStorageSync()获取本地存储

```
if (uni.getStorageSync('agree') == 1) {
    if (uni.getStorageSync('token')) {
        _this.getUserClockList();
        _this.resetUserDeviceLinkStatus();
        _this.getUserDeviceList(true);
    }
}
```

- **uni.getStorageSync()：** 同步获取本地存储
    
    - **作用：** 从本地存储中读取数据
    - **存储位置：** 应用沙盒目录，应用卸载后会清除
    - **同步特性：** 阻塞执行，直到读取完成
    - **为什么用同步：** 权限验证是后续操作的前提，必须立即得到结果
- **嵌套if判断：** 双重权限验证
    
    - **第一层：** 检查用户是否同意协议（agree == 1）
    - **第二层：** 检查是否有登录token
    - **为什么嵌套：** 确保用户既同意了协议又已登录，才能访问个人数据

```
async getHistory() {
    try {
        const filePath = plus.io.convertLocalFileSystemURL('_doc/historyData.json');
      
        const fileContent = await new Promise((resolve, reject) => {
            plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
                entry.file((file) => {
                    const reader = new plus.io.FileReader();
                    reader.onloadend = (e) => {
                        resolve(e.target.result);
                    };
                    reader.readAsText(file);
                });
            }, (e) => {
                // 文件不存在时创建
                plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
                    fs.root.getFile('historyData.json', {create: true}, 
                        (fileEntry) => resolve('[]'));
                });
            });
        });
      
        this.history = JSON.parse(fileContent || '[]');
    } catch (e) {
        this.history = [];
    }
}
```



## `uni.chooseImage相册中选择

1.  **打开相册**：调用`uni.chooseImage`方法，允许用户从相册中选择一张图片。
2.  **获取图片路径**：成功选择图片后，获取图片的临时路径。
3.  **跳转页面**：将图片路径传递到另一个页面（`photo-editor`），并跳转到该页面。
* * *
### 代码逐行解析

    openPhotoAlbum() {
        uni.chooseImage({
            count: 1, // 限制选择1张图片
            sizeType: ['original', 'compressed'], // 允许选择原图或压缩图
            sourceType: ['album'], // 仅从相册中选择
            success: (res) => {
                const imagePath = res.tempFilePaths[0]; // 获取图片的临时路径
                // 跳转到编辑页面
                console.log(imagePath); // 打印图片路径到控制台
                uni.navigateTo({
                    url: `/pages/aiacoustics/photo-translation/photo-editor?imagePath=${encodeURIComponent(imagePath)}`
                    // 跳转到编辑页面，并将图片路径作为参数传递
                });
            },
            fail: (error) => {
                console.error('选择图片失败:', error); // 如果选择图片失败，打印错误信息
            }
        });
    }
    

* * *

### 关键API说明

1.  **`uni.chooseImage`**
    
    *   **功能**：从本地相册选择图片或使用相机拍摄。
    *   **参数说明**：
        *   `count`：最多可以选择的图片数量。
        *   `sizeType`：图片尺寸类型，支持`original`（原图）和`compressed`（压缩图）。
        *   `sourceType`：图片来源，支持`album`（相册）和`camera`（相机）。
        *   `success`：选择图片成功后的回调函数。
        *   `fail`：选择图片失败后的回调函数。
2.  **`uni.navigateTo`**
    
    *   **功能**：跳转到应用内的其他页面。
    *   **参数说明**：
        *   `url`：目标页面的路径，可以携带参数。
3.  **`encodeURIComponent`**
    
    *   **功能**：对字符串进行URL编码，确保图片路径中的特殊字符不会导致问题。

* * *

### 使用场景

*   这段代码通常用于需要用户上传图片的小程序功能，例如图片编辑、图像识别、头像上传等。
*   通过跳转到`photo-editor`页面，可以进一步处理图片（如裁剪、滤镜、翻译等）。

* * *

### 注意事项

1.  **路径编码**：使用`encodeURIComponent`对图片路径进行编码，避免路径中包含特殊字符导致跳转失败。
2.  **页面路径限制**：确保目标页面`/pages/aiacoustics/photo-translation/photo-editor`在小程序的页面配置中已定义。
3.  **权限问题**：在某些平台上，可能需要申请相册访问权限。

* * *

### 示例输出

假设用户选择了一张图片，路径为`/storage/emulated/0/Pictures/example.jpg`，控制台会输出：

    /storage/emulated/0/Pictures/example.jpg
    

然后跳转到：

    /pages/aiacoustics/photo-translation/photo-editor?imagePath=%2Fstorage%2Femulated%2F0%2FPictures%2Fexample.jpg









## `uni.saveImageToPhotosAlbum图片保存系统相册
## `uni.hideLoading()隐藏加载提示框
## `uni.openSetting()用于打开应用设置页面

`saveToAlbum` 方法是一个用于将图片保存到系统相册的函数，适用于 uni-app 环境。以下是对该方法的详细解析、潜在问题分析以及优化建议：
### 一、代码解析
------
    // 保存图片到系统相册
    saveToAlbum() {
        if (!this.imagePath) return;
    
        uni.showLoading({ title: '保存中...' });
    
        uni.saveImageToPhotosAlbum({
            filePath: this.imagePath,
            success: () => {
                uni.hideLoading();
                uni.showToast({
                    title: '已保存到相册',
                    icon: 'success',
                    duration: 2000
                });
            },
            fail: (err) => {
                uni.hideLoading();
                // iOS/Android 权限拒绝处理
                if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
                    uni.showModal({
                        title: '保存失败',
                        content: '需要相册权限，请在设置中允许访问相册',
                        success: (res) => {
                            if (res.confirm) {
                                uni.openSetting(); //引导用户去设置
                            }
                        }
                    });
                } else {
                    uni.showToast({
                        title: '保存失败',
                        icon: 'none'
                    });
                }
            }
        });
    }
    
#### 功能说明：

*   检查 `imagePath` 是否存在，若不存在则直接返回。
*   显示加载提示。
*   调用 `uni.saveImageToPhotosAlbum` 将图片保存到系统相册。
*   成功时显示成功提示。
*   失败时根据错误信息判断是否为权限问题，并给出相应提示。

* * *
### 二、潜在问题与注意事项
-----------
#### 1\. **权限问题**

*   在 Android 和 iOS 上，调用 `saveImageToPhotosAlbum` 需要用户授权。
*   如果用户未授予相册权限，会触发 `fail` 回调。
*   当前逻辑中使用了 `err.errMsg.includes('auth deny')` 判断权限被拒绝，但实际中可能需要更精确的判断方式。

#### 2\. **uni.openSetting() 的兼容性**

*   `uni.openSetting()` 是 uni-app 提供的 API，用于打开应用设置页面。
*   但在部分平台（如 H5）上可能不支持，需注意兼容性。

#### 3\. **uni.saveImageToPhotosAlbum 的限制**

*   仅支持保存本地路径（`filePath`）的图片，不能直接保存网络图片。
*   需要先通过 `uni.downloadFile` 下载图片到本地，再调用 `saveImageToPhotosAlbum`。

#### 4\. **uni.showToast 的使用**

*   `uni.showToast` 在 uni-app 中是通用的提示组件，但在某些平台上（如小程序）可能无法自定义样式或持续时间。

* * *




##  `uni.openAppAuthorizeSetting()跳转系统授权

跳转系统授权管理页

- App端 打开系统App的权限设置界面
- 微信小程序 打开系统微信App的权限设置界面


# 原生api

## **plus.io.convertLocalFileSystemURL()

- **plus.io.convertLocalFileSystemURL()：** 5+ App文件系统API
    
    - **作用：** 将相对路径转换为标准文件系统URL
    - **参数：** '_doc/historyData.json' - 应用私有文档目录下的文件
    - **为什么需要转换：** plus.io需要标准URL格式才能操作文件
- **Promise封装回调：** 将回调式API转换为Promise
    
    - **原因：** plus.io原生API是回调形式，使用Promise支持async/await
    - **resolve()/reject()：** Promise的成功和失败回调
    - **为什么封装：** 避免回调地狱，使异步代码更像同步代码

## plus.io.FileReader

- **plus.io.FileReader：** 文件读取器
    
    - **作用：** 读取文件内容
    - **onloadend事件：** 文件读取完成时触发
    - **readAsText()方法：** 将文件内容读取为文本字符串
    - **为什么用FileReader：** 标准的文件读取API，跨平台兼容性好





