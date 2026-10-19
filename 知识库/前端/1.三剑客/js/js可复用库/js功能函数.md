# js写法模板

```js
	$(function() {
	    // 当DOM加载完成后，初始化订单详情模块
	    OrderDetailModule.init();
	});
	/**
	 * rderDetailModule是一个封装了订单详情页面所有逻辑的单例对象。
	 * @namespace OrderDetailModule
	 */
	const OrderDetailModule = {
	    // 存储数据
	    orderData: null,
	     // @description 初始化模块，是整个功能的入口点。
	    init: function() {
	        // 假设 `detail` 是从服务器获取的数据
	        this.orderData = detail; 
	        // 调用内部方法，开始执行各个部分的渲染和事件绑定
	        this.bindEvents();
	        // ... 其他函数
	    },
	 
	    // @description 绑定页面中所有需要的DOM事件。
	    bindEvents: function() {
	        var self = this; // 缓存 this 的指向
	        // 监听“新增订单”按钮的点击事件
	        $('.btn-primary').on('click', function(e) {
	            e.preventDefault(); // 阻止默认行为

	        });
	        
	        // ... 其他事件绑定
	    },    
	    // ... 其他方法
	};
	
```
## 验证码倒计时

```js
  /**
  * 验证码倒计时通用函数
  * @param {jQuery} $btn - 按钮jQuery对象
  * @param {number} seconds - 倒计时秒数,默认60秒
  * @param {string} originalText - 按钮原始文本
  */
  function startCountdown($btn, seconds, originalText){
     var countdown =  seconds || 60;
     $btn.attr('disabled',true).text(countdown+'秒后试');
     var timer = setInterval(function() {
         countdown--;
         if (countdown > 0) {
             $btn.text(countdown + '秒后重试');
         } else {
             clearInterval(timer);
	         $btn.attr('disabled',false).text(originalText);
         }
     }, 1000);
   }
```

## 图片转换为Base64

### FileReader API

**描述**: FileReader 是 Web API，用于异步读取用户上传的文件内容。它可以将文件读取为不同格式（文本、DataURL、ArrayBuffer 等）。

**主要方法**:
- `readAsArrayBuffer(file)`: 将文件读取为 ArrayBuffer（二进制数据）
- `readAsText(file)`: 将文件读取为文本
- `readAsDataURL(file)`: 将文件读取为 Data URL（Base64 编码）

**主要事件**:
- `onload`: 读取成功时触发
- `onerror`: 读取失败时触发
- `onprogress`: 读取过程中触发（可用于显示进度）

**代码示例**:

```javascript
/**
 * 读取文件为 ArrayBuffer
 * @param {File} file - 用户选择的文件对象
 * @returns {Promise<ArrayBuffer>} 返回文件的二进制内容
 */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
      
        // 读取成功的回调
        reader.onload = function(e) {
            // e.target.result 包含读取的内容
            resolve(e.target.result);
        };
      
        // 读取失败的回调
        reader.onerror = function(e) {
            reject(new Error(`文件读取失败: ${e.target.error}`));

        };
      
        // 开始读取文件（异步操作）
        reader.readAsArrayBuffer(file);

    });
}

/**
 * 读取图片文件为 Data URL（用于预览）
 * @param {File} imageFile - 图片文件
 * @returns {Promise<string>} 返回 Data URL 字符串
 */
function readImageAsDataURL(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Data URL 格式: data:image/png;base64,iVBORw0KG...
            resolve(e.target.result);
        };  
        reader.onerror = reject;
        // 读取为 Data URL
        reader.readAsDataURL(imageFile);
    });
}
```



## 日期处理

### normalizeTimestamp()
作用：将秒级或毫秒级时间戳统一转换为毫秒时间戳。

```javascript
/**
 * 统一时间戳单位为毫秒
 * @param {number|string} timestamp - 秒级或毫秒级时间戳
 * @returns {number} 毫秒时间戳
 */
function normalizeTimestamp(timestamp) {
  const numericValue = Number(timestamp);
  if (!Number.isFinite(numericValue)) return NaN;
  return numericValue < 10000000000 ? numericValue * 1000 : numericValue;
}
```

### formatDateTime() 
作用：将时间戳格式化为 `yyyy-MM-dd HH:mm:ss`。

```javascript
/**
 * 格式化时间戳为日期时间字符串
 * @param {number|string} timestamp - 时间戳（秒或毫秒）
 * @returns {string} 格式化后的日期时间字符串
 * @example
 * formatDateTime(1694502400); // "2023-09-12 10:13:20"
 */
function formatDateTime(timestamp) {
  if (timestamp === null || timestamp === undefined || timestamp === '') return '';

  const normalized = normalizeTimestamp(timestamp);
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return String(timestamp);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
```

### formatRelativeTime()
作用：返回“刚刚 / x 秒前 / x 分钟前 / x 小时前 / x 天前”这类相对时间。

说明：原来的 `caluTimeStr` 命名不够直观，这里改成更通用的命名。

```javascript
/**
 * 格式化相对时间
 * @param {number|string} targetTimestamp - 目标时间戳（秒或毫秒）
 * @param {number} [now=Date.now()] - 当前时间戳（毫秒）
 * @returns {string} 相对时间描述
 * @example
 * formatRelativeTime(Date.now() - 5 * 60 * 1000); // "5分钟前"
 */
function formatRelativeTime(targetTimestamp, now = Date.now()) {
  const target = normalizeTimestamp(targetTimestamp);
  const diffSeconds = Math.floor(Math.abs(now - target) / 1000);

  if (diffSeconds < 5) return '刚刚';
  if (diffSeconds < 60) return `${diffSeconds}秒前`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}分钟前`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}小时前`;
  return `${Math.floor(diffSeconds / 86400)}天前`;
}
```

##  **Fisher-Yates 洗牌算法** - 数组随机打乱

```js
// 从后往前遍历，每次随机选一个位置与当前位置交换
// 时间复杂度 O(n)，保证每种排列概率相等（真正的随机）
const arr = [1, 2, 3, 4, 5];
for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 解构赋值交换
}
```


## 其他
### **generateUniqueFileName** - 生成唯一文件名
```js
/**
 * 作用：生成带时间戳的唯一文件名
 * @description 使用时间戳和可选前缀生成唯一的文件名，避免文件名冲突
 * @param {string} [prefix='file'] - (可选) 文件名前缀，默认为 'file'
 * @param {string} [extension=''] - (可选) 文件扩展名，如 '.mp4'
 * @returns {string} 返回生成的文件名
 * 
 * 例子：
 * const fileName1 = generateUniqueFileName('video', '.mp4');
 * // 返回: video_1704067200000.mp4
 * 
 */
function generateUniqueFileName(prefix = 'file', extension = '') {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${randomNum}${extension}`;
}
```

### 实现文件大小自动单位转换
**思路**：循环除以1024确定单位 → 保留两位小数 → 拼接单位
**答案**：从字节开始，每次除以1024直到小于1024，记录除法次数对应单位数组索引（B/KB/MB/GB）

```javascript
/**
 * 文件大小格式化
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数，默认 2
 * @returns {string} 带单位的文件大小
 */
function fileSize(bytes, decimals = 2) {
  // 边界处理
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  // 计算单位索引：log₁₀₂₄(bytes)
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // 转换为对应单位并保留小数
  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${units[i]}`;
}

// 测试用例
console.log(fileSize(1024));      // '1.00 KB'
console.log(fileSize(1048576));   // '1.00 MB'
console.log(fileSize(1234567890)); // '1.15 GB'
```

### 2. **startTimer / stopTimer** - 启动/停止计时器

```js
/**
 * 启动秒级计时器
 * @description 每隔 1 秒自增 seconds，用于记录用户学习时长
 * @returns {void}
 * 例子：startTimer() 启动后每秒 this.seconds++
 */
function startTimer() {
  this.startTime = Date.now();
  this.timer = setInterval(() => {
    this.seconds++;
  }, 1000);
}

/**
 * 停止并清除计时器
 * @description 防止内存泄漏，页面卸载或提交时调用
 * @returns {void}
 * 例子：stopTimer() 清除 setInterval
 */
function stopTimer() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
}
```

### 实现手机号脱敏中间4位
**思路**：正则捕获前3位和后4位 → 中间替换为星号
**答案**：使用正则分组 `(\d{3})\d{4}(\d{4})`，替换为 `$1****$2`

```javascript
/**
 * 手机号脱敏
 * @param {string} phone - 11位手机号
 * @returns {string} 脱敏后的手机号
 */
function desensitizePhone(phone) {
  // 参数校验
  if (!/^1\d{10}$/.test(phone)) {
    return phone; // 非法格式直接返回
  }

  // 正则替换：保留前3位和后4位，中间替换为4个星号
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

// 测试用例
console.log(desensitizePhone('13812345678')); // '138****5678'
console.log(desensitizePhone('19988776655')); // '199****6655'
```

## 实现文本截断，超出长度显示省略号
**思路**：判断长度 → 截取字符串 → 拼接省略号
**答案**：使用 `slice()` 截取，注意中英文字符宽度差异可用 `substring()`

```javascript
/**
 * 文本截断
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀，默认 '...'
 * @returns {string} 截断后的文本
 */
function truncate(text, maxLength = 50, suffix = '...') {
  // 边界处理
  if (!text || text.length <= maxLength) return text;

  // 截取并添加后缀
  return text.slice(0, maxLength) + suffix;
}

// 测试用例
const longText = '这是一段非常长的文本内容，需要进行截断处理';
console.log(truncate(longText, 10)); // '这是一段非常长的文本...'
```

## 实现数字状态码映射为中文描述
**思路**：创建映射对象 → 通过键查找值
**答案**：可扩展为函数，支持默认值处理

```javascript
/**
 * 状态码映射
 * @param {number} status - 状态码
 * @returns {string} 中文描述
 */
function translateStatus(status) {
  // 状态码映射表
  const statusMap = {
    1: '已发布',
    2: '待审核',
    3: '已驳回',
    4: '草稿'
  };
  // 返回映射值，未找到返回默认提示
  return statusMap[status] || '未知状态';
}

// 使用示例
console.log(translateStatus(1)); // '已发布'
console.log(translateStatus(99)); // '未知状态'
```


### 防抖
2秒内不重复点击，避免状态抖动和重复建连
```js
  if (!this.stopBtn) return;

  this.stopBtn = false;

  setTimeout(() => { this.stopBtn = true; }, 2000);
```

### 二进制数据转 base64 字符串
```js
/**
 * 作用：二进制数据转 base64 字符串
 * @description 常用于音频帧、图片片段在前端跨线程或文本通道传输
 * @param {ArrayBuffer} buffer - 二进制缓冲区
 * @returns {string} base64 字符串
 * @example
 * const b64 = toBase64(buffer);
 */
function toBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

```

### 手动停止的倒计时。
```javascript
/**
 * 创建可手动停止的倒计时。
 * @param {number} totalSeconds - 总秒数。
 * @param {(leftSeconds: number) => void} [onTick] - 每秒回调。
 * @param {() => void} [onDone] - 倒计时结束回调。
 * @returns {() => void} stop - 调用后可停止倒计时。
 * @example
 * const stop = createCountdown(10, (s) => console.log(s), () => console.log('done'));
 */
function createCountdown(totalSeconds, onTick, onDone) {
  let seconds = totalSeconds;
  const timer = setInterval(() => {
    seconds -= 1;
    if (seconds <= 0) {
      clearInterval(timer);
      onDone && onDone();
      return;
    }
    onTick && onTick(seconds);
  }, 1000);

  return () => clearInterval(timer);
}
```

### **formatToHtml** - 将Markdown格式文本转换为HTML
```javascript
/**
 * @description 将Markdown格式的文本转换为HTML富文本，支持加粗、标题、列表、换行处理
 * @param {string} str - 需要转换的Markdown格式文本
 * @returns {string} 转换后的HTML字符串，包含<strong>、<br/>等标签
 * 
 * 作用：将AI返回的评分文本中的Markdown标记转换为HTML，便于在rich-text组件中渲染
 * 支持：
 *   - **加粗** → <strong>加粗</strong>
 *   - # 标题 → <strong class="title-h1">标题</strong>
 *   - 数字列表 → 自动添加<br/>换行
 *   - 普通换行 → <br/>
 *   - --- 分隔线 → 移除
 */
function formatToHtml(str) {
  if (!str) return '';

  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\s*\*\s+/gm, '')
    .replace(/^(#{1,6})\s+(.+?)(?:\s+#+)?$/gm, (match, hashes, title) => {
      const level = hashes.length;
      const text = title.trim();
      return `<strong class="title-h${level}">${text}</strong>`;
    })
    .replace(/(\d+\.)/g, '<br/>$1')
    .replace(/\n/g, '<br/>')
    .replace(/---/g, '');
}

```


### **** HTML 实体解码 ****

```javascript
  /**
   * HTML 实体解码，防止后端没有处理
   */
  htmlDecode(str) {
    if (!str) return '';
    // 针对可能存在的多重转义或直接转义进行兼容处理
    let decoded = str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#39;/g, "'")
      .replace(/'/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/"/g, '"');
    return decoded;
  },
```


### **btoa() / atob()** - Base64 编码与解码
```javascript
/**
 * @description
 * btoa(): 将字符串或二进制数据转换为 Base64 编码。
 * atob(): 将 Base64 编码转换回原始字符串。
 * 结合 Uint8Array 可用于处理复杂的加密 Token 流转换。
 */
const str = "Hello World";
const encoded = btoa(str); // "SGVsbG8gV29ybGQ="
const decoded = atob(encoded); // "Hello World"
```

### **generateToken** - 生成加密鉴权 Token
```javascript
/**
 * @description 根据用户ID、有效时间和密钥生成用于即时通讯(如Zego/RTC)的鉴权 Token。涉及 AES 加密与二进制数据(Uint8Array)的拼接转换。
 * @param {string|number} userID - 用户唯一标识
 * @param {number} seconds - Token 的有效时长（秒）
 * @param {string} appId - 平台申请的 AppID
 * @param {string} serverSecret - 平台申请的 ServerSecret
 * @returns {string} 生成的 Base64 格式 Token 字符串
 * 
 * @example
 * const token = generateToken('user123', 86400, 12345678, 'secret_key');
 */
function generateToken(userID, seconds, appId, serverSecret) {
    if (!userID) return '';
    const CryptoJS = require("crypto-js"); // 依赖 crypto-js

    const time = (Date.now() / 1000) | 0;
    const body = {
        app_id: appId,
        user_id: userID,
        nonce: (Math.random() * 2147483647) | 0,
        ctime: time,
        expire: time + (seconds || 7200), 
    };

    const key = CryptoJS.enc.Utf8.parse(serverSecret);
    let iv = Math.random().toString().substring(2, 18);
    if (iv.length < 16) iv += iv.substring(0, 16 - iv.length);
  
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(body), key, { iv: CryptoJS.enc.Utf8.parse(iv) }).toString();
    const ciphert = new Uint8Array(Array.from(atob(ciphertext)).map((val) => val.charCodeAt(0)));
    const len_ciphert = ciphert.length;

    const uint8 = new Uint8Array(8 + 2 + 16 + 2 + len_ciphert);
    uint8.set([0, 0, 0, 0]);
    uint8.set(new Uint8Array(new Int32Array([body.expire]).buffer).reverse(), 4);
    uint8[8] = iv.length >> 8;
    uint8[9] = iv.length - (uint8[8] << 8);
    uint8.set(new Uint8Array(Array.from(iv).map((val) => val.charCodeAt(0))), 10);
    uint8[26] = len_ciphert >> 8;
    uint8[27] = len_ciphert - (uint8[26] << 8);
    uint8.set(ciphert, 28);

    return `04${btoa(String.fromCharCode(...Array.from(uint8)))}`;
}
```