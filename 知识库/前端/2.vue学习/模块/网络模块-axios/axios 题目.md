我会从基础知识、封装实践、异常处理、架构设计等多个维度进行提问。
#### 10个技术知识题目

1.  **问：** 为什么我们推荐使用 `axios.create()` 而不是直接修改全局的 `axios.defaults`？
    **答：** 使用`axios.create()`可以创建多个独立的`axios`实例。这在大型项目中非常有用，比如项目可能需要同时请求多个不同域名、拥有不同超时时间或不同请求头的API服务。每个实例都有自己的配置和拦截器，互不干扰，避免了全局配置被污染的问题，增强了代码的模块化和可维护性。

2.  **问：** 在请求拦截器中，除了添加`Token`，你还能想到哪些常见的应用场景？
    **答：** 1. **开启全局Loading**：在请求开始时显示一个加载动画，提升用户体验。2. **序列化请求数据**：比如对`POST`请求的`data`进行统一的`qs.stringify`处理。3. **添加通用参数**：为所有请求添加如`timestamp`（时间戳）或客户端版本号等通用参数。4. **请求防抖/节流**：对某些频繁触发的请求（如搜索建议）进行控制。

3.  **问：** 响应拦截器 `response.use` 的两个回调函数分别在什么时候触发？如果第一个回调函数 `reject` 了一个 `Promise`，第二个回调函数会执行吗？
    **答：** 第一个回调函数（`onFulfilled`）在HTTP状态码为2xx时触发。第二个回调函数（`onRejected`）在HTTP状态码非2xx（如404、500）或请求本身出错（如网络中断、超时）时触发。如果第一个回调函数中`return Promise.reject(...)`，那么这个`reject`会被`axios`调用链下游的`.catch()`捕获，而不会触发第二个错误处理回调。

4.  **问：** 在代码中，响应拦截器同时处理了HTTP状态码错误和业务状态码（`res.code !== 200`）错误，请解释这两种错误有什么本质区别？
    **答：** **HTTP状态码错误**是传输层协议（HTTP）层面的错误，表示请求本身的过程出现了问题，比如`404 Not Found`（服务器找不到资源）、`500 Internal Server Error`（服务器代码执行出错）。此时，后端服务可能根本没有机会执行业务逻辑。**业务状态码错误**是应用层面的错误，表示HTTP请求成功（状态码为200），服务器成功接收并处理了请求，但在业务逻辑上判定为失败，例如`res.code: 50014`表示“Token已过期”，这是后端业务逻辑的判断结果。

5.  **问：** 对于 `GET` 和 `POST` 请求，传递参数的方式有何不同？在封装中是如何体现的？
    **答：** `GET`请求通常用于获取数据，其参数会附加在URL的查询字符串中（`?key=value&key2=value2`）。在`axios`中，这通过`params`配置项实现。`POST`请求通常用于提交数据，其参数放在请求体（Request Body）中。在`axios`中，这通过`data`配置项实现。在我们的API模块封装中（`src/api/user.js`），`getUserInfo`使用了`params`，而`login`使用了`data`，清晰地体现了这一点。

6.  **问：** 如何实现请求的取消（Cancellation）？在什么场景下会用到？
    **答：** 可以使用`AbortController`。在发起请求前创建一个`controller`实例，并将其`signal`传递给`axios`的配置对象。当需要取消时，调用`controller.abort()`即可。常见场景包括：1. 路由切换时，取消上一个页面还未完成的请求。2. 用户在搜索框中连续快速输入时，取消前一次的搜索请求，只保留最后一次。

7.  **问：** 我们的封装中使用了Vite的环境变量 `import.meta.env`。它和Webpack中的 `process.env` 有什么区别？
    **答：** `import.meta.env`是ES Module规范的一部分，Vite原生支持，它在客户端代码中直接可用。而`process.env`是Node.js环境中的变量，在Webpack项目中，需要通过`DefinePlugin`插件将其注入到浏览器端代码中。Vite的方式更符合现代JavaScript标准，无需额外插件配置。

8.  **问：** 如果一个接口需要特殊的`timeout`或`headers`，如何在使用我们封装的`request`实例时进行覆盖？
    **答：** 在调用`request`函数时，传入的配置对象会与实例的默认配置进行合并。后传入的配置优先级更高。例如：`request({ url: '/special/api', method: 'get', timeout: 30000 })`，这次请求的超时时间就会是30秒，而不是默认的10秒。

9.  **问：** 封装中提到了用`ElLoading`实现全局加载，但这可能会影响用户体验（如快速切换的多个小请求）。你有什么优化方案？
    **答：** 1. **请求合并/延迟显示**：维护一个全局的请求计数器。在请求拦截器中计数加一，响应拦截器中减一。只有当计数器从0变为1时才显示Loading。当计数器减到0时才隐藏Loading。可以再加一个`setTimeout`，如果请求在短时间内（如200ms）就完成了，则不显示Loading，避免闪烁。2. **局部Loading**：提供一个选项，允许在API调用时禁用全局Loading，而在组件内部使用自己的局部Loading状态。

10. **问：** 请解释一下`vite.config.js`中跨域代理`proxy`的`changeOrigin`和`rewrite`配置项的作用。
    **答：** `changeOrigin: true`会将请求头中的`Host`字段从开发服务器的地址（如`localhost:5173`）修改为目标服务器的地址（`target`）。这对于一些基于`Host`头进行验证的后端服务是必需的。`rewrite`则用于重写请求路径。在示例中，前端请求`/dev-api/user/info`，代理会将其重写为`/user/info`再转发给后端，`dev-api`这个前缀只是用于触发代理规则的“暗号”，后端实际上并不需要它。

#### 10道业务逻辑题目

1.  **场景：** 用户在一个表单页面填写信息，但此时他的登录`Token`刚好过期了。当他点击“提交”按钮时，应该发生什么？请描述从前端到后端的完整流程以及用户看到的现象。
    **答：** 1. 用户点击“提交”，`login`或`submitForm`等API函数被调用。2. 请求拦截器为请求加上已过期的`Token`。3. 请求发送到后端。4. 后端验证`Token`，发现已过期，拒绝请求，返回HTTP状态码`200`但业务码为`50014`（Token过期），或者直接返回HTTP状态码`401`。5. 前端响应拦截器捕获到这个错误，根据预设逻辑，弹出“登录已过期，请重新登录”的`ElMessage`提示。6. （可选高级实现）之后自动跳转到登录页，并可能在URL中附带当前页面的路径，以便用户登录后能无缝返回。

2.  **场景：** 网站有一个实时数据看板，每5秒请求一次数据。如果某次请求因为网络问题超过10秒还未返回，而新的请求又被发起了，可能会发生什么问题？如何优化？
    **答：** **问题：** 可能会导致请求堆积，旧的请求返回结果覆盖新的请求结果，造成数据错乱和不一致。同时，会给服务器和客户端带来不必要的负担。**优化方案：** 1. **请求超时取消**：在发起下一次请求之前，先检查上一次请求是否已完成。如果未完成，可以使用`AbortController`取消上一次的请求。2. **轮询锁**：设置一个标志位`isFetching`。在发起请求前检查此标志，如果为`true`则不发起新请求。请求成功或失败后，将标志位设回`false`。

3.  **场景：** 应用需要支持多语言，API返回的错误信息是多语言`key`（如`error.user.password_incorrect`）。你如何在我们封装的基础上，将它转换为用户当前语言的文本？
    **答：** 在响应拦截器中，当捕获到业务错误时（`res.code !== 200`），不要直接`ElMessage.error(res.message)`。而是将`res.message`（即多语言`key`）传递给国际化库（如`vue-i18n`）的翻译函数，例如`ElMessage.error(i18n.t(res.message))`。这样就能根据用户当前的语言环境显示正确的错误信息。

4.  **场景：** 有一个文件上传接口，它需要使用`'Content-Type': 'multipart/form-data'`，并且上传大文件时`timeout`需要更长。如何处理这种情况？
    **答：** 在`api`模块中为这个上传接口单独创建一个函数。在调用`request`时，覆盖默认配置：
    ```javascript
    export function uploadFile(data) {
      return request({
        url: '/file/upload',
        method: 'post',
        data, // data应为FormData对象
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 设置为1分钟超时
      });
    }
    ```
    这样，只有这个接口会使用特殊的`headers`和`timeout`，不影响其他接口。

5.  **场景：** 后端返回的数据结构有时是`{ code: 200, data: { ... } }`，有时是`{ code: 200, data: [ ... ] }`，有时成功时没有`data`字段，只有`{ code: 200, message: '操作成功' }`。如何让我们的拦截器更具兼容性？
    **答：** 在响应拦截器成功处理部分，可以做更灵活的判断。
    ```javascript
    // ...
    if (res.code === 200) {
      // 如果存在data字段则返回data，否则返回整个响应体
      // 这样业务代码可以根据情况解构 `data` 或 `message`
      return res.data !== undefined ? res.data : res; 
    }
    // ...
    ```
    这样既能简化有`data`时的调用，也兼容了没有`data`的成功响应。

6.  **场景：** 某个关键操作（如支付）的API，需要进行请求重试。如果第一次请求失败（比如网络抖动导致超时），系统应该自动尝试再次发送请求，最多3次。如何实现？
    **答：** 这可以通过`axios`的拦截器或适配器实现。一个简单的拦截器实现思路：在响应拦截器的错误处理部分，检查错误类型是否为网络错误或超时，并检查当前请求配置中是否有一个重试计数字段（如`config.retryCount`）。如果满足重试条件且次数未达上限，则递增计数器，并延迟一小段时间后重新发起请求`return service(config)`。

7.  **场景：** 项目中一部分API是提供给普通用户的，另一部分是给管理员的，管理员API的`baseURL`是`'https://admin.api.example.com'`。你如何组织代码？
    **答：** 最好的方式是创建第二个`axios`实例。在`utils`目录下新建一个`adminRequest.js`文件，内容与`request.js`类似，但`baseURL`不同。然后在`api`目录下创建`admin`文件夹，专门存放调用`adminRequest`实例的API模块。这样可以做到物理隔离，非常清晰。

8.  **场景：** 用户在进行一个多步骤的操作，例如“创建订单”，这需要依次调用“检查库存”、“创建订单”、“发起支付”三个接口。如果“创建订单”接口失败了，“发起支付”接口还应该被调用吗？如何优雅地处理这种链式调用？
    **答：** 不应该被调用。使用`async/await`和`try...catch`是处理这种场景的最优雅方式。
    ```javascript
    async function handleCreateOrder() {
      try {
        const stockStatus = await checkStockAPI();
        if (!stockStatus.isAvailable) throw new Error('库存不足');
      
        const orderResult = await createOrderAPI();
      
        const paymentResult = await initiatePaymentAPI({ orderId: orderResult.id });

        showSuccessMessage('订单创建并支付成功！');
      } catch (error) {
        // 任何一步失败都会进入catch块，后续调用被自动中断
        // 全局拦截器已经提示了具体错误，这里可以做一些回滚或提示整合
        console.error('创建订单流程失败', error);
      }
    }
    ```

9.  **场景：** 后端进行了升级，某个接口的返回数据结构从`{ user: { name: 'Tom' } }` 变成了 `{ userInfo: { userName: 'Tom' } }`。这对前端有什么影响？如何在不修改大量组件代码的情况下，平滑地过渡？
    **答：** 这会造成前端组件大面积报错。为了平滑过渡，可以在响应拦截器中增加一个“适配器”或“转换层”。通过检查URL或特定标志，识别出是旧接口的响应，然后将其数据结构转换为新结构再返回给业务代码。这是一种临时的兼容方案，长远来看还是应该推动前后端统一数据结构。

10. **场景：** 为了安全，后端要求所有`POST`和`PUT`请求都需要附加一个动态的CSRF Token，这个Token通过调用一个`/api/csrf-token`接口获取。请描述你会如何实现这个需求。
     **答：** 1. 首先，在应用初始化时（如`App.vue`的`onMounted`），调用一次接口获取初始的CSRF Token并存储起来（如`pinia`或一个全局变量）。2. 修改`axios`请求拦截器，判断请求方法是否为`POST`或`PUT`。如果是，则从存储中读取CSRF Token，并将其添加到请求头（如`X-CSRF-TOKEN`）或请求体中。3. （高级）后端可能会在每次响应中返回一个新的CSRF Token，响应拦截器需要捕获这个新Token并更新本地存储，以供下一次请求使用。

---



