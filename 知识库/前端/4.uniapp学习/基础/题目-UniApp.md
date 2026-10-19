### Q1：为什么模板根节点有 `:change:original="audio.windowAudio"` 这种写法？这不是 Vue 的语法吧？

```js
<view class="content"
  :original="audio_option"
  :change:original="audio.windowAudio"
>
```

**A：这是 UniApp 的 renderjs 通信语法。** 逻辑层把数据通过 `:original="audio_option"` 传给 renderjs；当 `original` 这个“传入值”变化时，会触发 renderjs 模块 `audio` 里的 `windowAudio(newValue, oldValue)`。


###  Q2：为什么扬声器模式要 `uni.uploadFile` 上传音频，然后 renderjs 再用 `fetch(url)` 播放？不能直接播放本地 `path` 吗？

**A：因为 renderjs 用的是 Web Audio API 的 `fetch(url)`，它更容易消费 HTTP(S) URL。** 本地 `file://` 路径在不同端（Android/iOS、WebView 安全策略）可能不允许 fetch，或跨域/权限更麻烦。上传后得到一个可访问 URL，renderjs 用 `fetch` 就稳定。


带注释片段（逻辑层 get_audio 扬声器分支）：

```js

// 扬声器播放：先上传本地音频文件，拿到一个可 fetch 的 URL

uni.uploadFile({

  url: utils.common.baseUrl + `/api/upload/files&wxapp_id=${wxapp_id}&token=${token}`,

  filePath: path,     // 本地音频文件路径

  name: 'iFile',

  success: (res) => {

    const data = JSON.parse(res.data)

    if (data.code == 1) {

      // 改变 audio_option.src 会触发 renderjs 的 windowAudio(newValue)

      that.audio_option.src = data.data

    }

  }

})

```



13. **题目**: Uni-app 的应用生命周期钩子有哪些？分别在什么时候触发？
    **思路**: 列举并解释 `App.vue` 中的生命周期函数。
    **答案**: 主要有四个：`onLaunch` 在应用首次启动时触发，全局只触发一次；`onShow` 在应用启动或从后台切到前台时触发；`onHide` 在应用从前台切到后台时触发；`onError` 在应用发生脚本错误或 API 调用失败时触发。


15. **题目**: Uni-app 中的组件生命周期和 Vue 的标准生命周期一样吗？
    **思路**: 确认其一致性。
    **答案**: 是的，Uni-app 的组件生命周期与 Vue 的标准组件生命周期完全相同，包括 `beforeCreate`, `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeDestroy`, `destroyed` 等钩子函数。
16. 


**20. UniApp的路由跳转API有哪些，区别是什么？**
*   **答案:**
    *   `uni.navigateTo`: 保留当前页，跳转到新页面，可返回。
    *   `uni.redirectTo`: 关闭当前页，跳转到新页面，不可返回。
    *   `uni.reLaunch`: 关闭所有页面，打开到指定页面，通常用于返回首页或登录页。
    *   `uni.switchTab`: 跳转到tabBar页面，并关闭其他所有非tabBar页面。
    *   `uni.navigateBack`: 关闭当前页，返回上一页或多级页面。

**23. 什么是`renderjs`？它有什么应用场景？**
*   **答案:** `renderjs`是UniApp提供的一种运行在视图层的机制，可以让开发者在App和H5端操作DOM、使用浏览器专有的库（如ECharts、Three.js）。它通过一个独立的JS脚本运行在WebView中，与逻辑层通过消息传递通信，主要用于解决逻辑层无法操作DOM的问题。
