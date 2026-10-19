**样式穿透 - ::v-deep**
```css
/* ::v-deep: 穿透 scoped 样式，修改子组件样式 */
/* 强制覆盖 u-input 在 textarea 模式下的文本颜色 */
.textarea ::v-deep textarea,
.textarea ::v-deep .u-input__textarea {
  color: #ffffff !important;
}

/* 应用场景：
   1. 修改组件库的默认样式
   2. 覆盖子组件的内部样式
   3. 在 scoped 样式中修改第三方组件
*/

/* 其他写法： */
/* Vue 2 写法 */
.textarea /deep/ textarea {
  color: #fff;
}

/* Vue 3 写法 */
.textarea :deep(textarea) {
  color: #fff;
}

/* scoped 的作用：
   1. 样式只作用于当前组件
   2. 不会影响子组件
   3. 不会影响其他组件
   
   ::v-deep 的作用：
   4. 穿透 scoped 限制
   5. 可以修改子组件样式
   6. 常用于修改组件库样式
*/

/* 示例：修改 uView 组件样式 */
.u-input ::v-deep .u-input__input {
  background-color: #f5f5f5;
}

.u-button ::v-deep .u-button__text {
  font-size: 32rpx;
}
```


### **动态样式绑定 - :style 条件样式**
```vue
<!-- 根据条件设置样式 -->
<text :style="region ? 'color:var(--col-1)' : 'color:#ccc'">
  {{ region ? region : '请选择地区' }}
</text>

<!-- 有选中内容时显示主题色，无内容时显示灰色 -->

<!-- 其他条件样式写法 -->
<!-- 方式1：对象语法 -->
<text :style="{ color: region ? 'var(--col-1)' : '#ccc' }">
  {{ region || '请选择地区' }}
</text>

<!-- 方式2：计算属性 -->
<text :style="textStyle">{{ displayRegion }}</text>

<script>
computed: {
  textStyle() {
    return {
      color: this.region ? 'var(--col-1)' : '#ccc'
    };
  },
  displayRegion() {
    return this.region || '请选择地区';
  }
}
</script>

<!-- 方式3：样式对象 -->
<text :style="[baseStyle, region ? activeStyle : placeholderStyle]">
  {{ region || '请选择地区' }}
</text>

<script>
data() {
  return {
    baseStyle: { fontSize: '28rpx' },
    activeStyle: { color: 'var(--col-1)' },
    placeholderStyle: { color: '#ccc' }
  };
}
</script>
```

**1. `<keep-alive>` 的主要作用是什么？**

- **答案**：缓存动态组件。当组件在切换时，不被销毁，从而保持组件的状态（如输入框内容、滚动位置等），避免重复渲染，提升性能。

**2. 被 `<keep-alive>` 包裹的组件会有哪两个新增的生命周期钩子？**

- **答案**：`activated`（组件被激活时调用）和 `deactivated`（组件被停用时调用）。

**3. 在 `<keep-alive>` 内部使用 `v-if` 进行组件切换，为什么切换后原来的组件内容不会丢失？**

- **答案**：因为被 `<keep-alive>` 包裹的组件会被 Vue 缓存，切换时并不会触发组件的销毁（unmount），而是将其隐藏，实例依然存在于内存中。

**4. 如何排除 `<keep-alive>` 中的某个组件不被缓存？**

- **答案**：可以使用 `include` 或 `exclude` 属性。例如 `<keep-alive exclude="KeepAliveStageA">` 会让组件 A 不被缓存。

**5. 说出一个适合使用 `<keep-alive>` 的实际场景。**

- **答案**：在移动端或 Web 后台管理系统中常见的“标签页切换”功能。当用户在不同的 tab（如首页、个人资料、设置）之间频繁切换时，使用 `<keep-alive>` 可以保证用户在回到某个 tab 时，之前的滚动位置和填写的表单内容依然存在。

**1. 什么是 Mixin？它有什么优缺点？**

- **答案**：Mixin 是一种在 Vue 组件间共享逻辑的机制。优点是实现了简单的代码复用；缺点是容易导致**命名冲突**（不清楚属性来源）、**代码难以维护**（组件的功能来源分散，逻辑不透明）、**组件间强耦合**。

**2. 组件与 Mixin 出现命名冲突（如 `data` 或 `methods` 同名）时，谁的优先级更高？**

- **答案**：组件本身的定义优先级更高。`data` 会被合并，同名键由组件属性覆盖；`methods`、`components` 和 `directives` 同名时，组件本身的定义将覆盖 Mixin 的内容。

**3. 如果组件和 Mixin 中都有 `mounted` 钩子，执行顺序是怎样的？**

- **答案**：Mixin 的钩子函数先执行，组件本身的钩子函数后执行。多个 Mixin 按注册顺序依次执行。

**4. 为什么 Vue 3 推荐使用 Composition API（组合式 API）而不是 Mixins？**

- **答案**：Composition API 通过逻辑提取（如 `useXxx` 函数）解决了 Mixins 的缺点：属性来源清晰、没有命名冲突风险、逻辑复用更加灵活和模块化，代码的可读性和可维护性大幅提升。

**5. 描述一个容易导致 Bug 的 Mixin 使用方式。**

- **答案**：在 Mixin 中定义了一个名为 `name` 的 data 属性，而在组件中也定义了 `name`，导致开发者在阅读代码时，不确定某个地方使用的 `this.name` 究竟来自于 Mixin 还是组件本身，这种“来源不透明”是 Mixin 最大的维护隐患