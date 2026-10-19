**题目: 为什么在script setup中导入的组件可以直接使用,无需显式注册**

**思路**: 解释编译时处理机制

**答案**:
script setup是Vue SFC编译器的语法糖,编译器在编译阶段分析`<script setup>`块中的代码。当检测到顶层的导入变量时,编译器会自动将其视为组件并添加到该组件的components选项中,相当于自动执行了`components: { MyComponent }`这个操作。

这是编译时的处理,不是运行时的JavaScript逻辑,所以不需要开发者手动注册。类似的自动注册还包括用`defineProps`定义的props、用`defineEmits`定义的emits等。

**题目: v-if和v-show的区别**

| 特性             | v-if                  | v-show            |
| -------------- | --------------------- | ----------------- |
| **DOM操作**      | 条件为false时节点不存在        | 节点始终存在，仅改变display |
| **初始渲染**       | false时开销低（不渲染）        | 始终渲染，开销高          |
| **切换开销**       | 高（销毁/重建DOM + 生命周期）    | 低（仅修改CSS）         |
| **生命周期**       | 完整执行mounted/unmounted | 不触发生命周期钩子         |
| **配套指令**       | 支持v-else-if/v-else    | 无                 |
| **template支持** | 支持                    | 不支持（无实体DOM）       |
|                |                       |                   |
**选择 v-if 的场景：**
1. 条件很少改变（如权限控制、一次性判断）
2. 需要完全卸载组件释放资源（如复杂弹窗、视频播放器）
3. 需要 v-else-if/v-else 逻辑链
4. 懒加载场景（如Tab中的重图表组件）

**选择 v-show 的场景：**
1. 频繁切换显示状态（如折叠面板、FAQ列表）
2. 需要保留组件状态（如多步骤表单）
3. 简单的显示/隐藏切换


**1. `toRef` 和 `ref` 的主要区别是什么？**

- **答案**：`ref` 是将一个普通值转换为响应式对象（包装成 `RefImpl`），它是独立的；而 `toRef` 是基于一个响应式对象的属性创建引用，它与源对象的属性保持“引用连接”，修改一方会影响另一方。

**2. 为什么在 `setup` 中直接对 `reactive` 对象进行解构（如 `const { age } = state`）会失去响应式？**

- **答案**：因为解构赋值是浅拷贝，将 `state` 中的值提取出来赋给了普通变量。普通变量不具备 Vue 的响应式拦截（Proxy），所以脱离了响应式系统的追踪。

**3. 如果将 `toRef` 用于一个普通的非响应式对象，结果会怎样？**

- **答案**：结果不具备响应式。因为 `toRef` 依赖于源对象具备响应式代理能力，如果源对象是普通对象，修改 `ref.value` 或原对象属性都不会触发视图更新。

**4. `toRef` 与 `toRefs` 有什么区别？**

- **答案**：`toRef` 针对单个属性；`toRefs` 是将一个响应式对象的所有属性全部转换为 `ref` 对象，返回一个包含所有属性的 `ref` 映射对象，常用于解构 `reactive` 数据并保持响应式。

**5. 在 `toRef` 的场景下，修改 `ref.value` 会发生什么？**

- **答案**：修改 `ref.value` 会直接同步修改源响应式对象中对应属性的值，进而触发 Vue 的依赖更新机制，更新相关的视图。

**1. Vue 3 的 `setup` 函数对应 Vue 2 中的哪些生命周期？**

- **答案**：`setup` 涵盖了 Vue 2 中的 `beforeCreate` 和 `created` 阶段。在 `setup` 中执行的代码逻辑，就相当于在 `created` 中执行。

**2. 在 Vue 3 中，生命周期钩子（如 `onMounted`）必须在什么地方调用？**

- **答案**：必须在 `setup()` 函数内部（或 `<script setup>` 顶层）同步调用。因为 Vue 需要在 setup 运行期间确定当前正在初始化的组件实例，以便将钩子绑定到该实例上。

**3. Vue 3 中 `beforeDestroy` 和 `destroyed` 生命周期钩子改成了什么？**

- **答案**：分别改为了 `onBeforeUnmount` 和 `onUnmounted`。

**4. 为什么 Vue 3 推荐在 `setup` 中使用组合式生命周期钩子，而不是在 Options API 中使用？**

- **答案**：为了实现逻辑复用和代码组织。使用组合式 API 可以让相关联的业务逻辑（包括对应的生命周期事件）写在一起，增强代码的可读性和可维护性，避免了 Options API 中按选项分类导致逻辑割裂的问题。

**5. 如果在异步函数中调用 `onMounted`，会发生什么？**

- **答案**：通常无法正确注册。因为 `onMounted` 必须在同步执行的 `setup` 阶段被调用，此时 Vue 才能建立上下文绑定。在异步回调中调用时，Vue 已经丢失了当前的组件上下文，导致钩子无法绑定到预期的组件实例。


```vue
<template>
    <p ref="elemRef">我是一行文字</p>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {

    name: 'RefTemplate',

    setup() {

       const elemRef = ref(null)
      onMounted(() => {

      console.log('ref template', elemRef.value.innerHTML, elemRef.value)
        })
        return {
            elemRef
        }
    }

}

</script>
```

**2. 如何确保在 Vue 3 中能够安全地访问到 DOM 节点？**

- **答案**：必须在 `onMounted` 生命周期钩子（或之后）通过 `ref.value` 进行访问。

**3. 在模板引用中，`ref="elemRef"` 和 `setup` 中 `const elemRef = ref(null)` 的名称必须一致吗？为什么？**

- **答案**：必须一致。Vue 框架通过变量名作为桥梁，自动将模板中的引用绑定到 `setup` 返回的对应变量上。如果不一致，Vue 无法知道该将 DOM 引用赋值给哪个 `ref`。
```js
function useFeatureX() {

    const state = reactive({

        x: 1,

        y: 2

    })

  

    return toRefs(state)

}

        const { x, y } = useFeatureX()
```

**2. 在自定义组合式函数（如 `useFeatureX`）中，为什么要返回 `toRefs(state)` 而不是直接返回 `state`？**

- **答案**：为了让调用者能够通过解构赋值（如 `const { x, y } = useFeatureX()`）安全地使用状态。如果返回 `state`（`reactive` 对象），直接解构会失去响应式，返回 `toRefs` 则保证了属性都是 `Ref`，保留了响应式连接。

**5. 描述一下你理解的 Vue 3 的响应式数据流。**

- **答案**：Vue 3 的响应式基于 Proxy 代理对象（`reactive`）和 `Ref`（封装了 `.value` 访问器）。组件逻辑在 `setup` 中注册这些数据，当数据源变化时，触发 Proxy/Ref 的依赖追踪机制（Effect），进而通知模板进行局部重新渲染（Patch）。

```vue
<template>

    <p>get instance</p>

</template>

  

<script>

import { onMounted, getCurrentInstance } from 'vue'

  

export default {

    name: 'GetInstance',

    data() {

        return {

            x: 1,

            y: 2

        }

    },

    setup() {

        console.log('this1', this)

  

        onMounted(() => {

            console.log('this in onMounted', this)

            console.log('x', instance.data.x)

        })

  

        const instance = getCurrentInstance()

        console.log('instance', instance)

    },

    mounted() {

        console.log('this2', this)

        console.log('y', this.y)

    }

}

</script>
```

**1. 在 `setup()` 函数中，为什么 `this` 是 `undefined`？**

- **答案**：因为 `setup` 函数执行时，组件实例尚未完全创建，且为了强制开发者脱离对 `this`（组件实例上下文）的依赖，防止 `this` 指向混乱带来的维护问题，Vue 明确将其设置为 `undefined`。

**2. 如何在 `setup` 中获取组件的 `data` 或 `props`？**

- **答案**：可以通过 `getCurrentInstance()` 获取实例，然后通过 `instance.data` 或 `instance.props` 访问。但通常建议直接使用 `reactive` 或 `props` 参数传递，尽量避免通过 `getCurrentInstance` 访问内部数据。

**3. `getCurrentInstance` 通常被推荐用于业务开发吗？**

- **答案**：不推荐。它主要用于工具类开发、插件编写或在调试时查看组件内部状态。在正常的业务逻辑中，应优先使用 Composition API（如 `ref`, `reactive`, `computed`）来管理状态。

**4. `this` 在 `mounted()` 钩子中和在 `setup()` 中有什么不同？**

- **答案**：在 `mounted()` 等选项式 API 中，`this` 指向当前组件实例，可以正常访问 `data`、`methods` 等。在 `setup()` 中，`this` 为 `undefined`，因为其运行在组件初始化阶段之前，不与任何实例绑定。

**5. 为什么说使用 `getCurrentInstance()` 获取数据是一种“反模式”？**

- **答案**：因为这样做打破了组合式 API 的设计初衷——解耦逻辑与实例。依赖 `instance.data` 会导致代码与组件的具体实现细节耦合过紧，降低了组合式逻辑的可复用性和可测试性。

**1. `watch` 和 `watchEffect` 的主要区别是什么？**

- **答案**：
    - `watch` 是**懒执行**的（只有数据变化才执行），需要显式指定监听源，可以获取新旧值。
    - `watchEffect` 是**立即执行**的，不需要指定监听源（自动收集依赖），无法获取新旧值，更适合副作用简单的场景。

**2. 为什么说 `watchEffect` 更加“智能化”？**

- **答案**：因为它不需要开发者显式声明监听的对象。它在执行一次代码块的过程中，自动感知内部用到了哪些响应式数据，并与这些数据建立自动的更新订阅。

**3. 如何在 `watch` 中实现深度监听（监听对象内部属性的变化）？**

- **答案**：需要将第三个参数配置为 `{ deep: true }`。

**4. 在什么场景下你会选择使用 `watch` 而不是 `watchEffect`？**

- **答案**：当需要比较数据的旧值与新值进行逻辑判断，或者只想在特定属性变化时才触发回调，或者希望避免初始化时立即执行回调函数时。

**5. 如果在 `watchEffect` 内部使用了 `setTimeout` 异步操作，该如何停止监听？**

- **答案**：`watchEffect` 会返回一个停止句柄函数（`stop`），直接执行该函数即可显式停止该监听逻辑。示例：`const stop = watchEffect(...)` -> `stop()`。
