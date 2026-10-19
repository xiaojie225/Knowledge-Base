## 未整理

    const app = getApp();
- **getApp()函数：** uniapp获取应用实例的全局函数
  - **作用：** 返回当前应用的App实例
  - **使用时机：** 任何页面都可以调用，用于访问全局数据
  - **为什么需要：** 实现跨页面的数据共享


### 简单题










**Q2: `uni.navigateTo` 和 `uni.redirectTo` 有什么区别？**

> **A:** `navigateTo` 保留当前页，用户可返回；`redirectTo` 关闭当前页后跳转，用户无法返回。页面栈深度限制通常10层，`navigateTo` 受此限制。



**Q6: uni-app 中如何实现页面返回时刷新上一页数据？**

> **A:** 四种方案：① 上一页 `onShow` 重新请求（最简单）；② `uni.$emit`/`uni.$on` 事件总线；③ `getCurrentPages()` 获取上一页实例直接调用方法；④ Vuex/Pinia 全局状态管理。


**Q8: 如何防止用户重复点击按钮？**

> **A:** 防抖（debounce，适合搜索输入）、节流（throttle，适合按钮点击）、标志位（`isLoading` 在请求前后切换）。

**Q9: Vue 中 `scoped` 和 `::v-deep` 的作用？**

> **A:** `scoped` 实现样式隔离，避免污染其他组件；`::v-deep` 穿透 `scoped` 限制，修改子组件内部样式。Vue 3 中用 `:deep()` 替代。


**Q11: 页面栈最多多少层？超过限制怎么办？**

> **A:** 最多 10 层。超过后 `navigateTo` 失败。解决：用 `redirectTo` 替换当前页，或用 `reLaunch` 清空栈重新打开。


**Q13: 防抖和节流的区别及适用场景？**

> **A:** 防抖：连续触发只执行最后一次（搜索输入、resize）；节流：固定间隔执行一次（按钮点击、滚动事件）。



**Q2: Vue 中 `$refs` 的作用是什么？**

**A:** 用于获取 DOM 元素或子组件实例的引用。在模板中给元素添加 `ref="xxx"`，然后在 JS 中通过 `this.$refs.xxx` 访问，可以调用其方法或获取属性。注意：`$refs` 在组件挂载后才可用。

---

**Q3: `$nextTick` 的作用是什么？什么场景使用？**

**A:** 在下次 DOM 更新循环结束后执行回调。当修改数据后需要等待 DOM 更新完成再操作时使用。例如：先清空 `videoUrl`，在 `$nextTick` 中再赋值，可以强制 video 组件重新加载。

---

**Q4: `onHide` 和 `onUnload` 的区别？**

**A:** `onHide`：页面隐藏时触发（切后台、跳转其他页面），页面实例仍在内存中；`onUnload`：页面卸载时触发（返回上一页、`redirectTo`、`reLaunch`），页面实例被销毁。

---

**Q5: CSS 中 `vw` 和 `vh` 单位是什么意思？和 `%` 有什么区别？**

**A:** `vw` = viewport width（视口宽度的 1%），`vh` = viewport height（视口高度的 1%）。`100vw` 始终等于浏览器可视区域宽度。`%` 是相对于父元素，`vw/vh` 是相对于视口，不受父元素限制。

---

### 中等题

**Q6: 为什么视频推荐使用 mp4 (H.264) 格式？H.264 和 H.265 有什么区别？**

**A:** mp4 + H.264 编码兼容性最好，iOS/Android/Web 全平台支持。H.265 压缩率更高（同质量文件小 50%），但浏览器兼容性差、专利费用高，不适合 Web 场景。HLS（m3u8）适合直播和长视频，支持自适应码率。

---

**Q7: 在 App 中如何实现视频进入全屏时自动横屏、退出全屏时恢复竖屏？**

**A:** 监听 `@fullscreenchange` 事件，结合 `plus.screen.lockOrientation()` 


```javascript
onFullscreen(e) {
  if (e.detail.fullScreen) {
    plus.screen.lockOrientation('landscape')   // 锁定横屏
  } else {
    plus.screen.lockOrientation('default')     // 恢复默认
  }
}
```

---

**Q8: video 组件加载失败时如何实现重试机制？**

**A:** 监听 `@error` 事件，使用指数退避重试：

javascript

```javascript
onError(e) {
  this.retryCount++
  if (this.retryCount <= 3) {
    const delay = 1000 * Math.pow(2, this.retryCount - 1)  // 1s, 2s, 4s
    setTimeout(() => {
      const url = this.videoUrl
      this.videoUrl = ''
      this.$nextTick(() => { this.videoUrl = url })
    }, delay)
  }
}
```

---


**Q10: `position: fixed` 的定位基准是什么？和 `position: absolute` 有什么区别？**

**A:** `fixed` 相对于**浏览器视口**定位，滚动页面不会改变位置；`absolute` 相对于**最近的已定位祖先元素**定位，随页面滚动移动。`fixed` 适合"关闭按钮"、"悬浮导航"等需要始终可见的元素。注意：当父元素有 `transform` 时，`fixed` 会降级为相对于该父元素定位。


The user wants me to read the 04-网页浏览页.md document and summarize it, excluding knowledge points already covered in previous summaries (02 and 03).

Let me read the rest of the document.

Now let me identify the NEW knowledge points from 04-webview that weren't covered in 02 and 03:

New knowledge points:
1. **web-view** - the web-view component itself
2. **web-view attributes**: src, @message, @load, @error
3. **web-view 通信机制**: postMessage from web to app, evalJS from app to web
4. **uni.webView.postMessage()** - web sends message to app
5. **@message event** - app receives message from web
6. **$scope.$getAppWebview()** - get app webview instance
7. **evalJS()** - execute JS in webview
8. **UniAppJSBridgeReady** event - web side bridge ready
9. **new URL()** - URL constructor API
10. **URL validation with regex** - URL format validation
11. **try/catch** - error handling
12. **onBackPress** - page back press event
13. **uni.showModal()** - show modal dialog
14. **String.startsWith()** - check string prefix
15. **String.includes()** - check if string contains
16. **String.endsWith()** - check string suffix
17. **Array.some()** - array some method
18. **CORS** - cross-origin resource sharing
19. **webview domain whitelist** - business domain whitelist
20. **webview.reload()** - reload webview
21. **webview.back()** - webview go back
22. **webview.forward()** - webview go forward
23. **transition: width 0.3s** - CSS transition
24. **JSON.stringify()** - serialize to JSON

Reusable functions:
- isValidURL - validate URL format
- isValidHTTPURL - strict URL validation with protocol check
- isAllowedDomain - domain whitelist check
- sendMessageToWebview - send message to webview
- reloadWebview - reload webview
- goBackWebview - webview go back

Styles:
- height: 44px
- background: #fff
- border-bottom: 1px solid #f0f0f0
- height: 3px
- background: #07c160
- transition: width 0.3s

Interview questions:
- Simple: web-view vs iframe, URL constructor, startsWith/includes/endsWith, try/catch, showModal vs showToast
- Medium: webview通信机制, CORS跨域, URL安全校验, onBackPress, 小程序webview白名单, Array.some

Let me write this up now.



### **web-view** - 网页容器组件
```vue
<!-- 在应用内全屏加载网页，自动占满整个页面 -->
<web-view 
  :src="url"           <!-- 网页地址 -->
  @message="onMessage" <!-- 接收网页发来的消息 -->
  @load="onLoad"       <!-- 网页加载完成 -->
  @error="onError">    <!-- 网页加载失败 -->
</web-view>
```

### **web-view 通信：网页 → 应用** - postMessage
```javascript
// --- 网页端 (HTML) ---
// 引入 uni-webview 桥接库
<script src="https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.1.5.2.js"></script>
<script>
  document.addEventListener('UniAppJSBridgeReady', function() {
    uni.webView.postMessage({
      data: { action: 'close', params: { id: 1 } }
    })
  })
</script>

// --- 应用端 ---
methods: {
  onMessage(e) {
    const msg = e.detail.data[0]  // 消息数组第一项
    if (msg.action === 'close') {
      uni.navigateBack()
    }
  }
}
```

### **webview 实例方法** - reload / back / forward
```javascript
const wv = this.$scope.$getAppWebview().children()[0]
wv.reload()   // 重新加载当前网页
wv.back()     // 网页内后退（类似浏览器后退）
wv.forward()  // 网页内前进
```

### **new URL()** - URL 构造函数
```javascript
// 用于解析和校验 URL
const urlObj = new URL('https://example.com:8080/path?key=val#hash')
urlObj.protocol  // 'https:'
urlObj.hostname  // 'example.com'
urlObj.port      // '8080'
urlObj.pathname  // '/path'
urlObj.search    // '?key=val'
urlObj.hash      // '#hash'
```


### **onBackPress** - 页面返回拦截
```javascript
export default {
  onBackPress(e) {
    if (e.from === 'navigateBack') {
      // 用户点击返回按钮
      uni.showModal({
        title: '提示',
        content: '确定要退出吗？',
        success: (res) => {
          if (res.confirm) { uni.navigateBack() }
        }
      })
      return true  // 阻止默认返回行为
    }
    return false  // 允许默认返回
  }
}
```





### **CORS** - 跨域资源共享
```
问题：H5 环境 web-view 受同源策略限制，跨域请求被浏览器拦截

解决：
1. 服务端添加响应头：
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST
   Access-Control-Allow-Headers: Content-Type

2. 开发环境代理：
   devServer.proxy: { '/api': { target: 'https://api.example.com', changeOrigin: true } }

3. 使用 uni.request（不受同源策略限制）
```






### 简单题

**Q1: uni-app 中 `web-view` 组件和 HTML 的 `iframe` 有什么区别？**

**A:** `web-view` 是原生组件，层级最高，会覆盖其他元素，全屏自动铺满；`iframe` 是浏览器元素，受 CSS 布局控制，可与其他元素共存。`web-view` 在小程序中需要配置业务域名白名单，`iframe` 无此限制但受同源策略约束。

---

**Q3: `String.startsWith()`、`String.includes()`、`String.endsWith()` 分别用于什么场景？**

**A:** `startsWith` 检查前缀（如校验协议 `https://`）；`includes` 检查是否包含子串（如黑名单域名匹配）；`endsWith` 检查后缀（如域名白名单匹配 `endsWith('.example.com')`）。三者都返回 boolean，且都支持第二个参数指定起始位置。

---

**Q4: `try/catch` 的作用是什么？什么情况下必须使用？**

**A:** 用于捕获代码块中的异常，防止程序崩溃。`new URL(invalidUrl)` 会抛出 TypeError，`JSON.parse(badJson)` 会抛出 SyntaxError——这些"可能失败"的操作必须用 try/catch 包裹，否则程序会中断。

---




### 中等题

**Q6: uni-app 中 web-view 如何实现应用与网页的双向通信？**

**A:**
- **网页 → 应用**：网页引入 `uni.webview.js`，通过 `uni.webView.postMessage({ data })` 发送；应用通过 `@message` 事件接收 `e.detail.data`。
- **应用 → 网页**：应用通过 `$scope.$getAppWebview().children()[0].evalJS(...)` 执行网页中的 JS 代码；网页需提前定义好接收函数如 `window.receiveAppMessage()`。

---

**Q7: 什么是 CORS？如何解决跨域问题？**

**A:** CORS（跨域资源共享）是浏览器同源策略下的安全机制——不同源的请求默认被拦截。解决方案：
1. 服务端设置 `Access-Control-Allow-Origin` 响应头；
2. 开发环境用 devServer proxy 代理转发；
3. 在 uni-app 中使用 `uni.request`（原生请求不受同源策略限制）；
4. JSONP（仅支持 GET，已过时）。


---

**Q9: `onBackPress` 生命周期的作用和返回值含义？**

**A:** 页面返回前触发，用于拦截返回操作。返回值含义：
- `true`：阻止默认返回行为（需自行处理返回逻辑）；
- `false` 或不返回：允许默认返回。
常见场景：webview 中用户可能想返回网页上一页而非应用上一页，需判断后决定。

---





```javascript


```



```javascript

```


```javascript

```


```javascript

```

```javascript

```





## ------------------------------



