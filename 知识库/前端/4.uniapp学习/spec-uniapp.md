
#  Vue3 + uni-app 新增组件编码规则

## 一、 文件结构与语法规范

1. **脚本语法**
   - **强制**使用 `<script setup>` + Composition API（如 `ref`、`reactive`、`defineProps`、`defineEmits` 等）。
   - **严禁**使用 Options API 语法（即 `export default {}`）。

2. **样式语法**
   - 统一使用 `<style lang="scss" scoped>`。
   - **必须**添加 `scoped` 属性，防止样式全局污染。
   - 有用UI组件(比如：uview1.0)用内置样式减少自己写
   - **嵌套写样式

3. **UI 组件选用**
   - **优先**使用 `uni-` 开头的跨端组件，**少用**原生 HTML 标签以保证多端兼容性。
   - 扩展组件库：如果有则使用 **uview1.0-UI**

---

## 二、 命名规范（核心）

| 类别         | 命名规则         | 示例                        | 说明                            |
| :--------- | :----------- | :------------------------ | :---------------------------- |
| **组件名**    | **大驼峰**      | `CustomHeader.vue`        | 文件名及模板中使用均需大驼峰                |
| **变量名**    | **小驼峰**      | `audioPath`               | 普通变量                          |
| **布尔变量**   | **前缀**       | `isVisible`, `showModal`  | 状态明确用 `is/show` 开头            |
| **函数名**    | **小驼峰+动词前缀** | `toDetailPage`, `isLogin` | 跳转用 `goTo` 或者to前缀，判断用 `is` 前缀 |
| **CSS 类名** | **短横线**      | `.online-dictation-page`  | 全部小写，单词间用 `-` 连接              |
|            |              |                           |                               |

---

## 三、 编码与 ES6+ 特性规范

1. **API 请求与异步处理**
   - 接口必须**统一封装**调用，禁止在组件内直接写原生 `uni.request`。
   - 必须使用 `async/await` 配合 `try/catch` 进行异步流控制和错误捕获。
   - 接口成功后打印
   - 参考：`console.log("专项训练 /api/specialized/index 成功",返回的数据 )`
 
2. **页面跳转**
   - 统一使用 `uni.navigateTo`（进栈） 或 `uni.navigateBack`（回退）。
   - **参数传递**：传递复杂或特殊字符参数时，**必须**使用 `encodeURIComponent` 编码，接收时使用 `decodeURIComponent` 解码。

3. **字符串拼接**
   - **强制**使用模板字符串（反引号 `` ` `` + `${}`），替代传统的 `+` 号拼接。

4. **可选链操作符（`?.`）**
   - 访问深层对象属性时，**必须**使用可选链操作符 `?.` 防止空引用报错（如 `user?.info?.name`）。

5. **解构赋值**
   - 优先使用解构赋值提取对象或数组中的值（如 API 返回值、Props 等），简化代码并提高可读性。

---

## 四、 调试与日志规范

1. **生命周期日志**
   - 进入页面时，需打印路径日志以便于排查页面栈和生命周期问题。
   - **规范格式**：
   
console.log("进入页面, 路径: /study/readFun/listenWrite/online.vue")
console.log("my.vue页面点击了，准备跳转的路径",item)
console.log('/api/device.category/list成功', res);
 console.error('/api/device.category/list失败', res);


# 通用样式


```css
/* 全局设置（推荐） */
* {
  box-sizing: border-box;
}


```

优先使用UI组件的内置样式
## 1. **颜色系统**

- 主色调（品牌色）
- 辅助色/强调色
- 文本颜色层级（深、中、浅）
- 背景色（白色、灰色等）
- 状态色（成功、警告、错误）

## 2. **字体系统**

- 字体大小（从小到大多个层级）
- 字体粗细（正常、加粗）
### **CSS 变量 - var()**
```css

/* 定义 CSS 变量（通常在 :root 或全局样式中） */
:root {
  --bg-color1: #ED6A1E;    /* 主色 */
  --bg-color2: #FFFFFF;    /* 辅色 */
  
}

/* CSS 变量：使用 var() 函数引用变量 */
.btn {
  color: var(--bg-color2);           /* 使用变量设置文字颜色 */
  border: var(--bg-color1);          /* 使用变量设置边框 */
  background-color: var(--bg-color1); /* 使用变量设置背景色 */
  border-radius: 14rpx;
}

page {

/* -------- 基础调色板（品牌色/功能色） -------- */
--color-primary: #ED6A1E; /* 主色：按钮、主要操作（橙色） */
--color-primary-hover: #D45A13; /* 主色悬停/按下态 */
--color-primary-light: #FFD0B0; /* 主色浅色版（用于背景或边框） */
--color-secondary: #010001; /* 次要色：卡片背景、次要按钮（黑色） */
--color-accent: #b3b3b3; /* 强调色：AI 区域或提示图标（灰色） */

/* -------- 文本颜色 -------- */
--color-text-primary: #ffffff; /* 主要文本（浅色背景上的文字） */
--color-text-secondary: #010001; /* 次要文本（在白色背景上的深色文字） */
--color-text-muted: #999999; /* 辅助/占位文本 */
--color-text-disabled: #666666; /* 禁用状态文本 */
--color-text-highlight: #f3f3f3; /* 高亮/选中文本 */

/* -------- 背景颜色 -------- */
--bg-page: #1D1D20; /* 页面整体背景（深色） */
--bg-card: #333333; /* 卡片/容器背景 */
--bg-surface: #b7b7b7; /* 表面背景（模态框、下拉菜单等） */
--bg-overlay: rgba(0,0,0,0.5); /* 遮罩层背景 */

/* -------- 边框颜色 -------- */
--border-color: #666666; /* 常规边框 */
--border-color-light: #d9d9d9; /* 轻量分隔线边框 */

/* -------- 阴影 -------- */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.2); /* 小阴影 */
--shadow-md: 0 4px 6px rgba(0,0,0,0.3); /* 中等阴影 */
--shadow-lg: 0 10px 15px rgba(0,0,0,0.4); /* 大阴影 */

/* -------- 圆角 -------- */

--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 16px;
--border-radius-circle: 50%;

}


```
# 推荐写法

### **`v-if / v-else / v-else-if`** - 条件渲染
```javascript
// 根据表达式的值，条件性地渲染元素
// v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
<block v-if="false">
  <!-- 条件为真时渲染 -->
</block>
<block v-else>
  <!-- 条件为假时渲染 -->
</block>
```

### **GET/POST 请求方式**
```javascript
// POST 请求示例
utils.request({
  url: '/api/user.device/dellog',
  method: 'POST',  // 注意是 method 而不是 methods
  data: {
    platform: app.platform
  }
}).then((res) => {
  console.log('/api/user.device/dellog 请求成功', res);
}).catch((err) => {
  console.error('/api/user.device/dellog请求失败', err);
});

// GET 请求对比
utils.request({
  url: '/api/user.device/log',
  method: 'GET',  // GET 请求
  data: {
    id: 123
  }
}).then((res) => {
  console.log('请求成功', res);
}).catch((err) => {
  console.log('请求失败', err);
});;
```
### **block 标签 - 无渲染包裹元素**
```vue
<!-- block 标签：包裹多个元素，但不渲染为实际 DOM 元素 -->
<block v-for="(item, index) in feedbackList" :key="index">
  <view class="lb">
    <view class="top">{{ item.nickName }}</view>
    <view class="text">{{ item.content }}</view>
  </view>
</block>

<!-- 渲染结果：没有 block 元素，只有内部的 view 元素 -->
<!-- <view class="lb">...</view> -->
<!-- <view class="lb">...</view> -->

<!-- 与 template 的区别：
   block: Vue 特有，不渲染为 DOM，支持 v-for、v-if
   template: 标准 HTML5，不渲染为 DOM，不支持 v-for
   
   与 view 的区别：
   view: 渲染为实际 DOM 元素，占用节点
   block: 不渲染，节省 DOM 节点
-->
```


### **async/await 异步处理**
```javascript

// Promise.then 写法：
getOrders() {
  utils.request({
    url: '/api/user.order/lists'
  }).then((res) => {
    console.log(res);
    this.ordersList = res.data.list.data;
  }).catch((err) => {
    console.log(err);
  });
}

// async/await 写法（更简洁）：
async getOrders() {
  try {
    var res = await utils.request({
      url: '/api/user.order/lists'
    });
    this.ordersList = res.data.list.data;
  } catch (err) {
    console.log(err);
  }
}

// 多个异步请求顺序执行：
async getData() {
  const res1 = await utils.request({ url: '/api/1' });
  const res2 = await utils.request({ url: '/api/2' });
  const res3 = await utils.request({ url: '/api/3' });
  
  // 按顺序执行，等待每个请求完成
}

// 多个异步请求并行执行：
async getData() {
  const [res1, res2, res3] = await Promise.all([
    utils.request({ url: '/api/1' }),
    utils.request({ url: '/api/2' }),
    utils.request({ url: '/api/3' })
  ]);
  
  // 同时发起，等待全部完成
}

// 注意事项：
// 1. async 函数返回 Promise
// 2. await 只能在 async 函数中使用
// 3. await 后面是 Promise 对象
// 4. 建议使用 try-catch 处理错误
```


### **动态类绑定 - 三元表达式**
```vue
<!-- 方式1：对象语法 -->
<view :class="date_list_select==index ? 'item select' : 'item'">
</view>

<!-- 方式2：数组语法 -->
<view :class="['item', date_list_select==index ? 'select' : '']">
</view>

<!-- 方式3：对象语法（推荐） -->
<view :class="{ 'item': true, 'select': date_list_select==index }">
</view>
```