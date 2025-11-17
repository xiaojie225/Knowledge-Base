# Vue组件通信开发文档

## 完整代码

### 1. Props传递数据

**Vue 2写法：**

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children :name="name" :age="age" />
  </div>
</template>

<script>
import Children from './Children.vue'

export default {
  components: {
    Children
  },
  data() {
    return {
      name: 'jack',
      age: 18
    }
  }
}
</script>
```

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <p>姓名: {{ name }}</p>
    <p>年龄: {{ age }}</p>
  </div>
</template>

<script>
export default {
  props: {
    // 字符串形式
    name: String,
    // 对象形式
    age: {
      type: Number,
      default: 18,
      required: true
    }

  }
}
</script>
```

**Vue 3写法：**

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children :name="name" :age="age" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Children from './Children.vue'

const name = ref('jack')
const age = ref(18)
</script>
```

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <p>姓名: {{ name }}</p>
    <p>年龄: {{ age }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  // 字符串形式
  name: String,
  // 对象形式
  age: {
    type: Number,
    default: 18,
    required: true
  }
})
</script>
```

### 2. $emit 触发自定义事件

**Vue 2写法：**

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <button @click="addToCart">添加到购物车</button>
  </div>
</template>

<script>
export default {
  methods: {
    addToCart() {
      const good = { id: 1, name: '商品', price: 100 }
      this.$emit('add', good)
    }
  }
}
</script>
```

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children @add="cartAdd" />
    <p>购物车商品: {{ cartItem.name }}</p>
  </div>
</template>

<script>
import Children from './Children.vue'

export default {
  components: {
    Children
  },
  data() {
    return {
      cartItem: {}
    }
  },
  methods: {
    cartAdd(item) {
      this.cartItem = item
    }
  }
}
</script>
```

**Vue 3写法：**

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <button @click="addToCart">添加到购物车</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['add'])

const addToCart = () => {
  const good = { id: 1, name: '商品', price: 100 }
  emit('add', good)
}
</script>
```

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children @add="cartAdd" />
    <p>购物车商品: {{ cartItem.name }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Children from './Children.vue'

const cartItem = ref({})

const cartAdd = (item) => {
  cartItem.value = item
}
</script>
```

### 3. 使用ref

**Vue 2写法：**

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children ref="child" />
    <button @click="getChildData">获取子组件数据</button>
  </div>
</template>

<script>
import Children from './Children.vue'

export default {
  components: {
    Children
  },
  methods: {
    getChildData() {
      // 访问子组件的数据和方法
      console.log(this.$refs.child.message)
      this.$refs.child.sayHello()
    }
  }
}
</script>
```

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '来自子组件的消息'
    }
  },
  methods: {
    sayHello() {
      console.log('子组件方法被调用')
    }
  }
}
</script>
```

**Vue 3写法：**

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children ref="child" />
    <button @click="getChildData">获取子组件数据</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Children from './Children.vue'

const child = ref(null)

const getChildData = () => {
  // 访问子组件的数据和方法
  console.log(child.value.message)
  child.value.sayHello()
}
</script>
```

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('来自子组件的消息')

const sayHello = () => {
  console.log('子组件方法被调用')
}

// 需要显式暴露给父组件
defineExpose({
  message,
  sayHello
})
</script>
```

### 4. EventBus

**Vue 2写法：**

```js
// bus.js
import Vue from 'vue'
export const EventBus = new Vue()
```

```vue
<!-- 组件A.vue -->
<template>
  <div>
    <button @click="sendMessage">发送消息</button>
  </div>
</template>

<script>
import { EventBus } from './bus.js'

export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message-from-a', '来自A组件的消息')
    }
  }
}
</script>
```

```vue
<!-- 组件B.vue -->
<template>
  <div>
    <p>收到的消息: {{ message }}</p>
  </div>
</template>

<script>
import { EventBus } from './bus.js'

export default {
  data() {
    return {
      message: ''
    }
  },
  created() {
    EventBus.$on('message-from-a', (message) => {
      this.message = message
    })
  },
  beforeDestroy() {
    // 别忘了在组件销毁前解绑事件
    EventBus.$off('message-from-a')
  }
}
</script>
```

**Vue 3写法：**

Vue 3中移除了`$on`、`$off`等方法，所以EventBus需要使用第三方库或者自定义实现。这里使用mitt库作为替代方案。

```bash
npm install mitt
```

```js
// bus.js
import mitt from 'mitt'
export const EventBus = mitt()
```

```vue
<!-- 组件A.vue -->
<template>
  <div>
    <button @click="sendMessage">发送消息</button>
  </div>
</template>

<script setup>
import { EventBus } from './bus.js'

const sendMessage = () => {
  EventBus.emit('message-from-a', '来自A组件的消息')
}
</script>
```

```vue
<!-- 组件B.vue -->
<template>
  <div>
    <p>收到的消息: {{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { EventBus } from './bus.js'

const message = ref('')

const handleMessage = (msg) => {
  message.value = msg
}

onMounted(() => {
  EventBus.on('message-from-a', handleMessage)
})

onUnmounted(() => {
  EventBus.off('message-from-a', handleMessage)
})
</script>
```

### 5. $parent 或 $root

**Vue 2写法：**

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children />
    <p>来自子组件的消息: {{ messageFromChild }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageFromChild: ''
    }
  },
  created() {
    // 父组件监听事件
    this.$on('message-from-child', (message) => {
      this.messageFromChild = message
    })
  }
}
</script>
```

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <button @click="sendMessage">发送消息</button>
  </div>
</template>

<script>
export default {
  methods: {
    sendMessage() {
      // 通过$parent触发父组件事件
      this.$parent.$emit('message-from-child', '我是子组件')
    }
  }
}
</script>
```

**Vue 3写法：**

Vue 3中没有`$parent`和`$root`的直接替代，但可以通过`getCurrentInstance`来获取父组件实例。

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Children />
    <p>来自子组件的消息: {{ messageFromChild }}</p>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const messageFromChild = ref('')

// 提供一个方法给子组件调用
const receiveMessage = (message) => {
  messageFromChild.value = message
}

provide('receiveMessage', receiveMessage)
</script>
```

```vue
<!-- 子组件 Children.vue -->
<template>
  <div>
    <button @click="sendMessage">发送消息</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 注入父组件提供的方法
const receiveMessage = inject('receiveMessage')

const sendMessage = () => {
  // 调用父组件提供的方法
  receiveMessage('我是子组件')
}
</script>
```

### 6. $attrs 与 $listeners

**Vue 2写法：**

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Child :message="message" @update="handleUpdate" />
  </div>
</template>

<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  data() {
    return {
      message: '来自父组件的消息'
    }
  },
  methods: {
    handleUpdate(newMessage) {
      this.message = newMessage
    }
  }
}
</script>
```

```vue
<!-- 中间组件 Child.vue -->
<template>
  <div>
    <Grandchild v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
import Grandchild from './Grandchild.vue'

export default {
  components: {
    Grandchild
  },
  // 不在props中声明的属性会进入$attrs
  props: ['notMessage'] 
}
</script>
```

```vue
<!-- 孙组件 Grandchild.vue -->
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="updateMessage">更新消息</button>
  </div>
</template>

<script>
export default {
  // 继承非props属性
  inheritAttrs: false,
  created() {
    console.log(this.$attrs) // { message: "来自父组件的消息" }
    console.log(this.$listeners) // { update: f }
  },
  methods: {
    updateMessage() {
      this.$emit('update', '更新后的消息')
    }
  }
}
</script>
```

**Vue 3写法：**

Vue 3中`$listeners`已被合并到`$attrs`中，所以只需要使用`v-bind="$attrs"`即可。

```vue
<!-- 父组件 Father.vue -->
<template>
  <div>
    <Child :message="message" @update="handleUpdate" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const message = ref('来自父组件的消息')

const handleUpdate = (newMessage) => {
  message.value = newMessage
}
</script>
```

```vue
<!-- 中间组件 Child.vue -->
<template>
  <div>
    <Grandchild v-bind="$attrs" />
  </div>
</template>

<script setup>
import Grandchild from './Grandchild.vue'

// 不在props中声明的属性会进入$attrs
defineProps(['notMessage'])
</script>
```

```vue
<!-- 孙组件 Grandchild.vue -->
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="updateMessage">更新消息</button>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'

// 获取$attrs
const attrs = useAttrs()

console.log(attrs) // { message: "来自父组件的消息", onUpdate: f }

// 从attrs中解构出props
const props = defineProps({
  // 继承非props属性
  message: String
})

const emit = defineEmits(['update'])

const updateMessage = () => {
  emit('update', '更新后的消息')
}
</script>
```

### 7. Provide 与 Inject

**Vue 2写法：**

```vue
<!-- 祖先组件 Ancestor.vue -->
<template>
  <div>
    <Child />
  </div>
</template>

<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  provide() {
    return {
      // 提供一个响应式对象
      sharedData: this.sharedData,
      // 提供一个方法
      updateData: this.updateData
    }
  },
  data() {
    return {
      sharedData: {
        message: '来自祖先组件的消息'
      }
    }
  },
  methods: {
    updateData(newMessage) {
      this.sharedData.message = newMessage
    }
  }
}
</script>
```

```vue
<!-- 后代组件 Descendant.vue -->
<template>
  <div>
    <p>{{ sharedData.message }}</p>
    <button @click="changeMessage">更改消息</button>
  </div>
</template>

<script>
export default {
  inject: ['sharedData', 'updateData'],
  methods: {
    changeMessage() {
      this.updateData('更新后的消息')
    }
  }
}
</script>
```

**Vue 3写法：**

```vue
<!-- 祖先组件 Ancestor.vue -->
<template>
  <div>
    <Child />
  </div>
</template>

<script setup>
import { ref, provide, reactive } from 'vue'
import Child from './Child.vue'

// 提供响应式数据
const sharedData = reactive({
  message: '来自祖先组件的消息'
})

// 提供更新方法
const updateData = (newMessage) => {
  sharedData.message = newMessage
}

// 提供数据
provide('sharedData', sharedData)
provide('updateData', updateData)
</script>
```

```vue
<!-- 后代组件 Descendant.vue -->
<template>
  <div>
    <p>{{ sharedData.message }}</p>
    <button @click="changeMessage">更改消息</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 注入数据
const sharedData = inject('sharedData')
const updateData = inject('updateData')

const changeMessage = () => {
  updateData('更新后的消息')
}
</script>
```

### 8. Vuex

**Vue 2写法：**

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: '来自Vuex的消息'
  },
  getters: {
    reversedMessage: state => {
      return state.message.split('').reverse().join('')
    }
  },
  mutations: {
    updateMessage(state, newMessage) {
      state.message = newMessage
    }
  },
  actions: {
    asyncUpdateMessage({ commit }, newMessage) {
      setTimeout(() => {
        commit('updateMessage', newMessage)
      }, 1000)
    }
  }
})
```

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import store from './store'

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
```

```vue
<!-- 组件A.vue -->
<template>
  <div>
    <p>{{ message }}</p>
    <p>反转消息: {{ reversedMessage }}</p>
    <button @click="changeMessage">更改消息</button>
    <button @click="asyncChangeMessage">异步更改消息</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['message']),
    ...mapGetters(['reversedMessage'])
  },
  methods: {
    ...mapMutations({
      changeMessage: 'updateMessage'
    }),
    ...mapActions(['asyncUpdateMessage']),
    asyncChangeMessage() {
      this.asyncUpdateMessage('异步更新后的消息')
    }
  }
}
</script>
```

**Vue 3写法：**

```js
// store.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    message: '来自Vuex的消息'
  },
  getters: {
    reversedMessage: state => {
      return state.message.split('').reverse().join('')
    }
  },
  mutations: {
    updateMessage(state, newMessage) {
      state.message = newMessage
    }
  },
  actions: {
    asyncUpdateMessage({ commit }, newMessage) {
      setTimeout(() => {
        commit('updateMessage', newMessage)
      }, 1000)
    }
  }
})
```

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

createApp(App).use(store).mount('#app')
```

```vue
<!-- 组件A.vue -->
<template>
  <div>
    <p>{{ message }}</p>
    <p>反转消息: {{ reversedMessage }}</p>
    <button @click="changeMessage">更改消息</button>
    <button @click="asyncChangeMessage">异步更改消息</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 直接访问state
const message = computed(() => store.state.message)

// 通过getter访问
const reversedMessage = computed(() => store.getters.reversedMessage)

// 提交mutation
const changeMessage = () => {
  store.commit('updateMessage', '更新后的消息')
}

// 分发action
const asyncChangeMessage = () => {
  store.dispatch('asyncUpdateMessage', '异步更新后的消息')
}
</script>
```

## 学习知识

1. **Props传递数据**：
   - 父组件向子组件传递数据的基本方式
   - 可以传递各种类型的值，包括静态值和动态值
   - 支持类型检查、默认值和必填验证
   - Vue 3中使用`defineProps`声明props

2. **$emit触发自定义事件**：
   - 子组件向父组件传递数据的主要方式
   - 通过自定义事件和参数传递数据
   - 父组件监听事件并处理
   - Vue 3中使用`defineEmits`声明可触发的事件

3. **使用ref**：
   - 直接访问子组件实例的方法
   - 可以调用子组件的方法和访问子组件的数据
   - Vue 3中需要使用`defineExpose`显式暴露属性和方法

4. **EventBus**：
   - 兄弟组件之间通信的解决方案
   - 创建一个中央事件总线，实现组件间的发布订阅
   - Vue 3中需要使用第三方库如mitt替代EventBus

5. **$parent或$root**：
   - 通过访问父组件或根组件实现通信
   - 适用于组件层级不深的情况
   - Vue 3中可以使用`provide`和`inject`替代

6. **$attrs与$listeners**：
   - 实现跨级组件通信
   - 可以将父组件的属性和事件传递给深层子组件
   - Vue 3中将$listeners合并到$attrs中

7. **Provide与Inject**：
   - 祖先组件与后代组件通信的方式
   - 提供数据和方法给后代组件注入使用
   - 在Vue 3中更加强大，支持响应式数据

8. **Vuex**：
   - 集中式状态管理方案
   - 适用于复杂关系的组件数据共享
   - 包含state、getters、mutations和actions
   - Vue 3中使用方式有所改变，但核心概念相同

## 用途

1. **Props传递数据**：
   - 用于父子组件之间的数据传递
   - 适用于表单组件、展示型组件等场景
   - 例如：父组件传递列表数据给表格组件展示

2. **$emit触发自定义事件**：
   - 用于子组件向父组件传递事件和数据
   - 适用于交互型组件，如按钮、表单等
   - 例如：子组件表单提交后通知父组件刷新数据

3. **使用ref**：
   - 用于父组件需要直接操作子组件的场景
   - 适用于需要调用子组件方法或访问子组件数据的情况
   - 例如：父组件调用子组件的表单验证方法

4. **EventBus**：
   - 用于任意组件之间的通信，特别是兄弟组件
   - 适用于不相关的组件需要通信的场景
   - 例如：侧边栏组件与主内容区域组件的通信

5. **$parent或$root**：
   - 用于访问父组件或根组件的属性和方法
   - 适用于简单的组件层级结构
   - 例如：子组件需要访问父组件的共享方法

6. **$attrs与$listeners**：
   - 用于跨级组件通信，特别是多层嵌套组件
   - 适用于高阶组件的场景
   - 例如：将父组件的属性和事件透传给深层子组件

7. **Provide与Inject**：
   - 用于祖先组件向后代组件提供数据和方法
   - 适用于深层嵌套组件之间的通信
   - 例如：主题配置、用户信息等全局数据的传递

8. **Vuex**：
   - 用于大型应用的状态管理
   - 适用于复杂关系的组件数据共享
   - 例如：电商应用中的购物车、用户信息等全局状态

[标签: Vue 组件通信]

## 面试题目

### 10个概念题目

1. Vue中组件通信有哪些方式？各自适用于什么场景？
2. Props与$emit有什么区别？它们如何配合使用？
3. 在Vue中，如何在子组件中修改父组件传递下来的props？
4. EventBus是什么？它的实现原理是什么？有什么缺点？
5. $attrs和$listeners在Vue 3中发生了什么变化？为什么会有这种变化？
6. provide和inject如何实现响应式数据传递？在Vue 2和Vue 3中有什么区别？
7. Vuex中的state、getters、mutations和actions各有什么作用？它们之间如何协同工作？
8. 在Vue 3中，如何使用ref访问子组件的属性和方法？与Vue 2有什么区别？
9. 非父子组件之间通信有哪些方式？各有什么优缺点？
10. 在大型项目中，如何选择合适的组件通信方式？

### 10道业务逻辑题目

1. 假设你有一个父组件和一个子组件，父组件需要接收子组件传递的数据并在页面上显示。请使用$emit实现这个功能，并提供完整的代码示例。
   ```vue
   <!-- 父组件 -->
   <template>
     <div>
       <ChildComponent @send-data="receiveData" />
       <p>接收到的数据: {{ receivedData }}</p>
     </div>
   </template>
 
   <script>
   export default {
     data() {
       return {
         receivedData: ''
       }
     },
     methods: {
       receiveData(data) {
         this.receivedData = data
       }
     }
   }
   </script>
 
   <!-- 子组件 -->
   <template>
     <div>
       <button @click="sendData">发送数据</button>
     </div>
   </template>
 
   <script>
   export default {
     methods: {
       sendData() {
         this.$emit('send-data', '这是来自子组件的数据')
       }
     }
   }
   </script>
   ```

2. 如果你需要在兄弟组件A和B之间通信，组件A发送数据，组件B接收并显示数据。请使用EventBus实现这个功能，并提供完整的代码示例。
   ```js
   // eventBus.js
   import Vue from 'vue'
   export const EventBus = new Vue()
 
   <!-- 组件A -->
   <template>
     <div>
       <button @click="sendMessage">发送消息</button>
     </div>
   </template>
 
   <script>
   import { EventBus } from './eventBus.js'
 
   export default {
     methods: {
       sendMessage() {
         EventBus.$emit('message-from-a', '来自A组件的消息')
       }
     }
   }
   </script>
 
   <!-- 组件B -->
   <template>
     <div>
       <p>接收到的消息: {{ message }}</p>
     </div>
   </template>
 
   <script>
   import { EventBus } from './eventBus.js'
 
   export default {
     data() {
       return {
         message: ''
       }
     },
     created() {
       EventBus.$on('message-from-a', message => {
         this.message = message
       })
     },
     beforeDestroy() {
       EventBus.$off('message-from-a')
     }
   }
   </script>
   ```

3. 假设你有一个祖先组件和一个后代组件，需要将祖先组件的数据传递给后代组件，并保持响应式。请使用provide和inject实现这个功能，并提供完整的代码示例。
   ```vue
   <!-- 祖先组件 -->
   <template>
     <div>
       <input v-model="sharedData.message" />
       <ChildComponent />
     </div>
   </template>
 
   <script>
   import ChildComponent from './ChildComponent.vue'
 
   export default {
     components: {
       ChildComponent
     },
     provide() {
       return {
         sharedData: this.sharedData
       }
     },
     data() {
       return {
         sharedData: {
           message: '祖先组件的消息'
         }
       }
     }
   }
   </script>
 
   <!-- 后代组件 -->
   <template>
     <div>
       <p>接收到的消息: {{ sharedData.message }}</p>
     </div>
   </template>
 
   <script>
   export default {
     inject: ['sharedData']
   }
   </script>
   ```

4. 如果你需要在父组件中访问子组件的方法，请使用ref实现这个功能，并提供完整的代码示例。
   ```vue
   <!-- 父组件 -->
   <template>
     <div>
       <ChildComponent ref="child" />
       <button @click="callChildMethod">调用子组件方法</button>
     </div>
   </template>
 
   <script>
   import ChildComponent from './ChildComponent.vue'
 
   export default {
     components: {
       ChildComponent
     },
     methods: {
       callChildMethod() {
         this.$refs.child.childMethod()
       }
     }
   }
   </script>
 
   <!-- 子组件 -->
   <template>
     <div>
       <p>我是子组件</p>
     </div>
   </template>
 
   <script>
   export default {
     methods: {
       childMethod() {
         console.log('子组件方法被调用')
       }
     }
   }
   </script>
   ```

5. 假设你有一个多层嵌套的组件结构，需要将父组件的属性和事件传递给深层子组件。请使用$attrs和$listeners（Vue 2）或仅$attrs（Vue 3）实现这个功能，并提供完整的代码示例。
   ```vue
   <!-- 父组件 -->
   <template>
     <div>
       <IntermediateComponent
         :message="message"
         @update="handleUpdate"
       />
     </div>
   </template>
 
   <script>
   import IntermediateComponent from './IntermediateComponent.vue'
 
   export default {
     components: {
       IntermediateComponent
     },
     data() {
       return {
         message: '来自父组件的消息'
       }
     },
     methods: {
       handleUpdate(newMessage) {
         this.message = newMessage
       }
     }
   }
   </script>
 
   <!-- 中间组件 (Vue 2) -->
   <template>
     <div>
       <DeepComponent v-bind="$attrs" v-on="$listeners" />
     </div>
   </template>
 
   <script>
   import DeepComponent from './DeepComponent.vue'
 
   export default {
     components: {
       DeepComponent
     }
   }
   </script>
 
   <!-- 中间组件 (Vue 3) -->
   <template>
     <div>
       <DeepComponent v-bind="$attrs" />
     </div>
   </template>
 
   <script setup>
   import DeepComponent from './DeepComponent.vue'
   </script>
 
   <!-- 深层子组件 -->
   <template>
     <div>
       <p>{{ message }}</p>
       <button @click="updateMessage">更新消息</button>
     </div>
   </template>
 
   <script>
   export default {
     props: ['message'],
     methods: {
       updateMessage() {
         this.$emit('update', '更新后的消息')
       }
     }
   }
   </script>
   ```

6. 如果你需要在多个不相关的组件之间共享状态，请使用Vuex实现这个功能，并提供完整的代码示例。
   ```js
   // store.js
   import Vue from 'vue'
   import Vuex from 'vuex'
 
   Vue.use(Vuex)
 
   export default new Vuex.Store({
     state: {
       count: 0
     },
     mutations: {
       increment(state) {
         state.count++
       }
     },
     actions: {
       asyncIncrement({ commit }) {
         setTimeout(() => {
           commit('increment')
         }, 1000)
       }
     },
     getters: {
       doubleCount: state => state.count * 2
     }
   })
 
   <!-- 组件A -->
   <template>
     <div>
       <p>计数: {{ count }}</p>
       <button @click="increment">增加计数</button>
     </div>
   </template>
 
   <script>
   import { mapState, mapMutations } from 'vuex'
 
   export default {
     computed: {
       ...mapState(['count'])
     },
     methods: {
       ...mapMutations(['increment'])
     }
   }
   </script>
 
   <!-- 组件B -->
   <template>
     <div>
       <p>双倍计数: {{ doubleCount }}</p>
       <button @click="asyncIncrement">异步增加计数</button>
     </div>
   </template>
 
   <script>
   import { mapGetters, mapActions } from 'vuex'
 
   export default {
     computed: {
       ...mapGetters(['doubleCount'])
     },
     methods: {
       ...mapActions(['asyncIncrement'])
     }
   }
   </script>
   ```

7. 在Vue 3中，如何使用Composition API实现provide和inject？请提供一个完整的示例。
   ```vue
   <!-- 祖先组件 -->
   <template>
     <div>
       <input v-model="message" />
       <ChildComponent />
     </div>
   </template>
 
   <script setup>
   import { ref, provide } from 'vue'
   import ChildComponent from './ChildComponent.vue'
 
   const message = ref('祖先组件的消息')
 
   // 提供响应式数据
   provide('message', message)
 
   // 提供更新方法
   const updateMessage = (newMessage) => {
     message.value = newMessage
   }
   provide('updateMessage', updateMessage)
   </script>
 
   <!-- 后代组件 -->
   <template>
     <div>
       <p>接收到的消息: {{ message }}</p>
       <button @click="changeMessage">更改消息</button>
     </div>
   </template>
 
   <script setup>
   import { inject } from 'vue'
 
   // 注入提供的数据和方法
   const message = inject('message')
   const updateMessage = inject('updateMessage')
 
   const changeMessage = () => {
     updateMessage('更新后的消息')
   }
   </script>
   ```

8. 如果你需要在Vue 3中实现类似EventBus的功能，请使用第三方库mitt提供一个完整的示例。
   ```bash
   npm install mitt
   ```
 
   ```js
   // eventBus.js
   import mitt from 'mitt'
   export const emitter = mitt()
 
   <!-- 组件A -->
   <template>
     <div>
       <button @click="sendMessage">发送消息</button>
     </div>
   </template>
 
   <script setup>
   import { emitter } from './eventBus.js'
 
   const sendMessage = () => {
     emitter.emit('message-from-a', '来自A组件的消息')
   }
   </script>
 
   <!-- 组件B -->
   <template>
     <div>
       <p>接收到的消息: {{ message }}</p>
     </div>
   </template>
 
   <script setup>
   import { ref, onMounted, onUnmounted } from 'vue'
   import { emitter } from './eventBus.js'
 
   const message = ref('')
 
   const handleMessage = (msg) => {
     message.value = msg
   }
 
   onMounted(() => {
     emitter.on('message-from-a', handleMessage)
   })
 
   onUnmounted(() => {
     emitter.off('message-from-a', handleMessage)
   })
   </script>
   ```

9. 在Vue 3中，如何在子组件中暴露特定的属性和方法给父组件？请提供一个完整的示例。
   ```vue
   <!-- 父组件 -->
   <template>
     <div>
       <ChildComponent ref="child" />
       <button @click="accessChild">访问子组件</button>
     </div>
   </template>
 
   <script setup>
   import { ref } from 'vue'
   import ChildComponent from './ChildComponent.vue'
 
   const child = ref(null)
 
   const accessChild = () => {
     // 访问子组件暴露的属性和方法
     console.log(child.value.exposedMessage)
     child.value.exposedMethod()
   }
   </script>
 
   <!-- 子组件 -->
   <template>
     <div>
       <p>我是子组件</p>
     </div>
   </template>
 
   <script setup>
   import { ref } from 'vue'
 
   const exposedMessage = ref('这是子组件暴露的消息')
 
   const exposedMethod = () => {
     console.log('子组件暴露的方法被调用')
   }
 
   // 显式暴露给父组件
   defineExpose({
     exposedMessage,
     exposedMethod
   })
   </script>
   ```

10. 如果你需要在Vue应用中实现一个全局的状态管理，请使用Vuex 4（Vue 3版本）提供一个完整的示例。
    ```js
    // store.js
    import { createStore } from 'vuex'
  
    export default createStore({
      state() {
        return {
          count: 0,
          user: null
        }
      },
      mutations: {
        increment(state) {
          state.count++
        },
        setUser(state, user) {
          state.user = user
        }
      },
      actions: {
        async fetchUser({ commit }) {
          // 模拟API调用
          setTimeout(() => {
            const user = {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com'
            }
            commit('setUser', user)
          }, 1000)
        }
      },
      getters: {
        doubleCount: state => state.count * 2,
        isLoggedIn: state => state.user !== null
      }
    })
  
    <!-- 组件A -->
    <template>
      <div>
        <p>计数: {{ count }}</p>
        <button @click="increment">增加计数</button>
      </div>
    </template>
  
    <script setup>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
  
    const store = useStore()
  
    const count = computed(() => store.state.count)
  
    const increment = () => {
      store.commit('increment')
    }
    </script>
  
    <!-- 组件B -->
    <template>
      <div>
        <p v-if="!user">加载中...</p>
        <div v-else>
          <p>用户名: {{ user.name }}</p>
          <p>邮箱: {{ user.email }}</p>
        </div>
        <button @click="fetchUser">获取用户</button>
        <p>双倍计数: {{ doubleCount }}</p>
        <p>是否登录: {{ isLoggedIn ? '是' : '否' }}</p>
      </div>
    </template>
  
    <script setup>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
  
    const store = useStore()
  
    const user = computed(() => store.state.user)
    const doubleCount = computed(() => store.getters.doubleCount)
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
  
    const fetchUser = () => {
      store.dispatch('fetchUser')
    }
    </script>
    ```

## 快速使用指南

如果你忘记了如何使用Vue组件通信功能，可以按照以下步骤快速应用到其他项目：

### 1. 父子组件通信（Props和$emit）

#### 父组件向子组件传递数据：
```vue
<!-- 父组件 -->
<template>
  <ChildComponent :message="parentMessage" />
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const parentMessage = ref('来自父组件的消息')
</script>
```

```vue
<!-- 子组件 -->
<template>
  <div>{{ message }}</div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>
```

#### 子组件向父组件传递数据：
```vue
<!-- 子组件 -->
<template>
  <button @click="sendToParent">发送给父组件</button>
</template>

<script setup>
const emit = defineEmits(['update'])

const sendToParent = () => {
  emit('update', '来自子组件的消息')
}
</script>
```

```vue
<!-- 父组件 -->
<template>
  <ChildComponent @update="handleUpdate" />
  <p>{{ childMessage }}</p>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childMessage = ref('')

const handleUpdate = (message) => {
  childMessage.value = message
}
</script>
```

### 2. 任意组件通信（EventBus）

```js
// eventBus.js
import mitt from 'mitt'
export const emitter = mitt()
```

```vue
<!-- 发送组件 -->
<template>
  <button @click="send">发送消息</button>
</template>

<script setup>
import { emitter } from './eventBus.js'

const send = () => {
  emitter.emit('event-name', '消息内容')
}
</script>
```

```vue
<!-- 接收组件 -->
<template>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { emitter } from './eventBus.js'

const message = ref('')

const handleMessage = (data) => {
  message.value = data
}

onMounted(() => {
  emitter.on('event-name', handleMessage)
})

onUnmounted(() => {
  emitter.off('event-name', handleMessage)
})
</script>
```

### 3. 跨层级组件通信（provide和inject）

```vue
<!-- 祖先组件 -->
<template>
  <div>
    <ChildComponent />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import ChildComponent from './ChildComponent.vue'

const sharedData = ref('祖先组件的数据')
const updateData = (newData) => {
  sharedData.value = newData
}

provide('sharedData', sharedData)
provide('updateData', updateData)
</script>
```

```vue
<!-- 后代组件 -->
<template>
  <div>
    <p>{{ sharedData }}</p>
    <button @click="changeData">更改数据</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const sharedData = inject('sharedData')
const updateData = inject('updateData')

const changeData = () => {
  updateData('更新后的数据')
}
</script>
```

### 4. 全局状态管理（Vuex）

```js
// store.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    asyncIncrement({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
})
```

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

createApp(App).use(store).mount('#app')
```

```vue
<!-- 组件中 -->
<template>
  <div>
    <p>计数: {{ count }}</p>
    <p>双倍计数: {{ doubleCount }}</p>
    <button @click="increment">增加计数</button>
    <button @click="asyncIncrement">异步增加计数</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const count = computed(() => store.state.count)
const doubleCount = computed(() => store.getters.doubleCount)

const increment = () => {
  store.commit('increment')
}

const asyncIncrement = () => {
  store.dispatch('asyncIncrement')
}
</script>
```

[标签: Vue 组件通信]