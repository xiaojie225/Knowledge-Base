# Vue3 Modal组件完整开发文档

## 概述

Modal（模态框）组件是一个通用的弹窗组件，用于在当前页面上方显示对话框，主要用于确认操作、展示内容、表单输入等场景。

## 完整代码实现

### 1. 项目结构
```
src/
├── components/
│   └── Modal/
│       ├── Modal.vue          // 主组件
│       ├── Content.tsx        // 内容组件
│       ├── config.ts          // 默认配置
│       ├── index.ts           // 入口文件
│       ├── types.ts           // TypeScript类型定义
│       └── locale/            // 国际化
│           ├── index.ts
│           └── lang/
│               ├── zh-CN.ts
│               └── en-US.ts
```

### 2. Modal.vue 主组件

```vue
<template>
  <Teleport to="body" :disabled="!teleport">
    <Transition name="modal" appear>
      <div v-if="modelValue" class="modal-overlay" @click="handleMaskClick">
        <div class="modal" @click.stop>
          <!-- 标题栏 -->
          <div class="modal__header">
            <h4 class="modal__title">{{ title || t('title') }}</h4>
            <button 
              v-if="closable" 
              class="modal__close" 
              @click="handleCancel"
              :disabled="loading"
            >
              ×
            </button>
          </div>
          
          <!-- 内容区域 -->
          <div class="modal__body">
            <Content v-if="typeof content === 'function'" :render="content" />
            <slot v-else>{{ content }}</slot>
          </div>
          
          <!-- 底部按钮 -->
          <div class="modal__footer" v-if="showFooter">
            <button 
              class="btn btn--primary"
              :disabled="loading" 
              @click="handleConfirm"
            >
              <span v-if="loading" class="loading-icon">⟳</span>
              {{ confirmText || t('confirm') }}
            </button>
            <button 
              class="btn btn--default" 
              @click="handleCancel"
              :disabled="loading"
            >
              {{ cancelText || t('cancel') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, onBeforeMount } from 'vue'
import { useLocale } from './locale'
import Content from './Content'
import type { ModalProps } from './types'

const props = withDefaults(defineProps<ModalProps>(), {
  teleport: true,
  closable: true,
  maskClosable: true,
  showFooter: true,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const { t } = useLocale()
const instance = getCurrentInstance()

// 事件处理hub
onBeforeMount(() => {
  if (instance) {
    instance._hub = {
      'on-cancel': () => {},
      'on-confirm': () => {}
    }
  }
})

const handleConfirm = async () => {
  emit('confirm')
  if (instance?._hub?.['on-confirm']) {
    await instance._hub['on-confirm']()
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
  if (instance?._hub?.['on-cancel']) {
    instance._hub['on-cancel']()
  }
}

const handleMaskClick = () => {
  if (props.maskClosable && !props.loading) {
    handleCancel()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal__header {
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.modal__close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__body {
  padding: 24px;
  min-height: 100px;
}

.modal__footer {
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn--primary {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}

.btn--default {
  background: white;
  color: #666;
}

.loading-icon {
  animation: spin 1s linear infinite;
  margin-right: 4px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 过渡动画 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
```

### 3. Content.tsx 内容组件

```tsx
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Content',
  props: {
    render: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    return () => props.render()
  }
})
```

### 4. types.ts 类型定义

```typescript
import { VNode } from 'vue'

export interface ModalProps {
  modelValue: boolean
  title?: string
  content?: string | (() => VNode)
  confirmText?: string
  cancelText?: string
  teleport?: boolean
  closable?: boolean
  maskClosable?: boolean
  showFooter?: boolean
  loading?: boolean
}

export interface ModalOptions {
  title?: string
  content?: string | (() => VNode)
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}
```

### 5. index.ts 入口文件

```typescript
import { createVNode, render, App } from 'vue'
import Modal from './Modal.vue'
import type { ModalOptions } from './types'

const createModal = (options: ModalOptions) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  
  const props = {
    modelValue: true,
    ...options
  }
  
  const vnode = createVNode(Modal, props)
  render(vnode, container)
  const instance = vnode.component
  
  const closeModal = () => {
    render(null, container)
    document.body.removeChild(container)
  }
  
  // 绑定事件处理
  if (instance) {
    Object.assign(instance._hub, {
      async 'on-confirm'() {
        if (options.onConfirm) {
          const result = options.onConfirm()
          if (result instanceof Promise) {
            try {
              instance.props.loading = true
              await result
              closeModal()
            } catch (error) {
              console.error(error)
            } finally {
              instance.props.loading = false
            }
          } else {
            closeModal()
          }
        } else {
          closeModal()
        }
      },
      'on-cancel'() {
        options.onCancel?.()
        closeModal()
      }
    })
  }
}

const ModalPlugin = {
  install(app: App) {
    app.component('Modal', Modal)
    app.config.globalProperties.$modal = {
      show: createModal
    }
  }
}

export default ModalPlugin
```

### 6. 使用示例

```vue
<template>
  <div>
    <!-- 组件形式使用 -->
    <Modal 
      v-model="showModal" 
      title="确认删除"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <p>确定要删除这条数据吗？</p>
    </Modal>
    
    <button @click="showModal = true">显示Modal</button>
    <button @click="showApiModal">API调用</button>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'

const showModal = ref(false)
const instance = getCurrentInstance()

const handleConfirm = () => {
  console.log('确认操作')
}

const handleCancel = () => {
  console.log('取消操作')
}

// API形式调用
const showApiModal = () => {
  instance?.appContext.config.globalProperties.$modal.show({
    title: 'API调用示例',
    content: '这是通过API调用的Modal',
    onConfirm: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('异步确认完成')
    },
    onCancel: () => {
      console.log('取消操作')
    }
  })
}
</script>
```

## 核心知识点

### 1. Teleport传送门
[`Teleport`](Modal.vue:1) 将Modal内容渲染到body元素下，避免层级问题。

### 2. Composition API
使用 [`setup`](Modal.vue:46) 语法糖，配合响应式API。

### 3. 动态内容渲染
支持字符串、插槽和函数三种内容类型。

### 4. 事件系统
双重事件处理机制：传统emit和_hub属性。

### 5. 异步处理
支持异步确认操作，自动显示loading状态。

### 6. TypeScript支持
完整的类型定义，提供良好的开发体验。

## 适用场景

1. **确认对话框**：删除、提交等危险操作的二次确认
2. **信息展示**：通知、帮助信息等内容展示
3. **表单弹窗**：新增、编辑等表单操作
4. **图片预览**：大图展示、轮播等
5. **复杂交互**：多步骤向导、设置面板等

---

## 面试题目及答案

### 基础理论题目（10题）

**1. Vue3中Teleport的作用是什么？与Vue2相比有什么优势？**

**答案：**
```javascript
// Vue3 Teleport用法
<Teleport to="body">
  <div class="modal">Modal内容</div>
</Teleport>
```
Teleport可以将组件的DOM结构渲染到指定的DOM节点中，解决层级问题。相比Vue2需要手动操作DOM或使用第三方库，Vue3的Teleport是官方内置解决方案，更加可靠和优雅。

**2. 组件中的_hub属性是如何实现事件通信的？**

**答案：**
```javascript
// 在组件实例上添加事件hub
onBeforeMount(() => {
  instance._hub = {
    'on-cancel': () => {},
    'on-confirm': () => {}
  };
});

// API调用时动态绑定处理函数
Object.assign(_hub, {
  'on-confirm': async () => {
    if (onConfirm) {
      await onConfirm();
    }
  }
});
```
_hub作为组件实例的自定义属性，存储事件处理函数，实现了API调用与组件内部的通信桥梁。

**3. createVNode和render在Modal实现中的作用是什么？**

**答案：**
```javascript
import { createVNode, render } from 'vue'

const container = document.createElement('div')
const vnode = createVNode(Modal, props)
render(vnode, container)
document.body.appendChild(container)
```
- `createVNode`：创建虚拟节点，相当于Vue2的Vue.extend
- `render`：将虚拟节点渲染到真实DOM容器中

**4. 如何处理Modal中的异步confirm操作？**

**答案：**
```javascript
async 'on-confirm'() {
  if (onConfirm) {
    const fn = onConfirm();
    if (fn && fn.then) {  // 判断是否为Promise
      try {
        props.loading = true;
        await fn;
        _closeModal();
      } catch (err) {
        console.error(err);
        props.loading = false;  // 错误时不关闭弹窗
      }
    } else {
      _closeModal();
    }
  }
}
```
通过判断返回值是否为Promise来区分同步和异步操作，异步时显示loading状态。

**5. Vue3组件如何实现插件化安装？**

**答案：**
```javascript
const ModalPlugin = {
  install(app) {
    // 注册全局组件
    app.component('Modal', Modal)
    // 挂载全局属性
    app.config.globalProperties.$modal = {
      show: createModal
    }
  }
}

// 使用
app.use(ModalPlugin)
```
通过install方法实现插件化，可以注册全局组件和全局属性。

**6. Modal组件如何支持多种内容类型？**

**答案：**
```html
<div class="modal__content">
  <Content v-if="typeof content === 'function'" :render="content" />
  <slot v-else>{{ content }}</slot>
</div>
```
通过类型判断支持：字符串直接显示、函数使用Content组件渲染、插槽使用默认插槽。

**7. 如何实现Modal的动画效果？**

**答案：**
```vue
<Transition name="modal" appear>
  <div v-if="modelValue" class="modal-overlay">
    <!-- Modal内容 -->
  </div>
</Transition>

<style>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
```
使用Vue3的Transition组件配合CSS过渡实现进出场动画。

**8. getCurrentInstance在Modal中的作用是什么？**

**答案：**
```javascript
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
// 获取当前组件实例，用于添加自定义属性_hub
instance._hub = { /* 事件处理器 */ }
```
获取当前组件实例的引用，用于添加自定义属性或方法，实现组件内外的通信。

**9. 如何防止Modal的重复点击问题？**

**答案：**
```javascript
const handleConfirm = async () => {
  if (loading.value) return;  // 防止重复点击
  
  loading.value = true;
  try {
    await onConfirm();
  } finally {
    loading.value = false;
  }
}
```
通过loading状态来控制按钮的可点击性，防止重复提交。

**10. 如何实现Modal的键盘事件支持？**

**答案：**
```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && closable) {
      handleCancel()
    }
  }
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
```
通过监听全局键盘事件实现ESC键关闭等功能。

### 业务逻辑题目（10题）

**1. 实现一个支持多级确认的Modal**

**答案：**
```javascript
const createMultiStepModal = (steps) => {
  let currentStep = 0;
  
  const showStep = () => {
    if (currentStep >= steps.length) return;
    
    const step = steps[currentStep];
    $modal.show({
      title: step.title,
      content: step.content,
      confirmText: currentStep === steps.length - 1 ? '完成' : '下一步',
      onConfirm: () => {
        step.onConfirm?.();
        currentStep++;
        showStep();
      },
      onCancel: () => {
        currentStep = 0;
      }
    });
  };
  
  showStep();
};
```

**2. 实现Modal的队列管理系统**

**答案：**
```javascript
class ModalQueue {
  constructor() {
    this.queue = [];
    this.isShowing = false;
  }
  
  add(options) {
    this.queue.push(options);
    if (!this.isShowing) {
      this.showNext();
    }
  }
  
  showNext() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }
    
    this.isShowing = true;
    const options = this.queue.shift();
    
    $modal.show({
      ...options,
      onConfirm: () => {
        options.onConfirm?.();
        this.showNext();
      },
      onCancel: () => {
        options.onCancel?.();
        this.showNext();
      }
    });
  }
}
```

**3. 实现带表单验证的Modal**

**答案：**
```javascript
const showFormModal = (formConfig) => {
  const validateForm = (formData) => {
    const errors = {};
    for (const [field, rules] of Object.entries(formConfig.validation)) {
      const value = formData[field];
      for (const rule of rules) {
        if (!rule.validator(value)) {
          errors[field] = rule.message;
          break;
        }
      }
    }
    return errors;
  };

  $modal.show({
    title: formConfig.title,
    content: () => h(FormComponent, {
      config: formConfig,
      onSubmit: async (formData) => {
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
          throw new Error('表单验证失败');
        }
        await formConfig.onSubmit(formData);
      }
    })
  });
};
```

**4. 实现Modal的权限控制系统**

**答案：**
```javascript
class ModalPermissionManager {
  constructor() {
    this.permissions = new Map();
  }
  
  setPermission(modalId, permission) {
    this.permissions.set(modalId, permission);
  }
  
  checkPermission(modalId, userRole) {
    const permission = this.permissions.get(modalId);
    return !permission || permission.includes(userRole);
  }
  
  showWithPermission(modalId, options, userRole) {
    if (!this.checkPermission(modalId, userRole)) {
      $modal.show({
        title: '权限不足',
        content: '您没有权限执行此操作',
        showFooter: false
      });
      return;
    }
    
    $modal.show(options);
  }
}
```

**5. 实现Modal的数据缓存机制**

**答案：**
```javascript
class ModalDataManager {
  constructor() {
    this.cache = new Map();
  }
  
  saveData(modalId, data) {
    this.cache.set(modalId, JSON.stringify(data));
  }
  
  loadData(modalId) {
    const cached = this.cache.get(modalId);
    return cached ? JSON.parse(cached) : null;
  }
  
  createModalWithCache(modalId, options) {
    const cachedData = this.loadData(modalId);
    
    return $modal.show({
      ...options,
      content: () => h(FormComponent, { 
        initialData: cachedData,
        onDataChange: (data) => this.saveData(modalId, data)
      }),
      onConfirm: () => {
        this.clearData(modalId);
      }
    });
  }
}
```

**6. 实现Modal的批量操作确认**

**答案：**
```javascript
const showBatchConfirmModal = (selectedItems, operation) => {
  const itemCount = selectedItems.length;
  const operationText = {
    delete: '删除',
    export: '导出',
    archive: '归档'
  };
  
  $modal.show({
    title: `批量${operationText[operation]}`,
    content: () => h('div', [
      h('p', `确认要${operationText[operation]}以下${itemCount}个项目吗？`),
      h('ul', { class: 'item-list' }, 
        selectedItems.slice(0, 5).map(item => h('li', item.name))
      ),
      itemCount > 5 && h('p', `还有${itemCount - 5}个项目...`)
    ]),
    onConfirm: async () => {
      for (const item of selectedItems) {
        await performOperation(operation, item);
      }
    }
  });
};
```

**7. 实现Modal的拖拽功能**

**答案：**
```vue
<script setup>
import { ref, reactive, onMounted } from 'vue'

const modalRef = ref(null)
const position = reactive({ x: 0, y: 0 })
const isDragging = ref(false)

const startDrag = (event) => {
  if (!event.target.closest('.modal__header')) return
  
  isDragging.value = true
  const startX = event.clientX - position.x
  const startY = event.clientY - position.y
  
  const onMouseMove = (e) => {
    if (!isDragging.value) return
    position.x = e.clientX - startX
    position.y = e.clientY - startY
  }
  
  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>
```

**8. 实现Modal的全屏切换功能**

**答案：**
```javascript
const createFullscreenModal = (options) => {
  const isFullscreen = ref(false);
  
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
  };
  
  $modal.show({
    ...options,
    content: () => h('div', {
      class: ['modal-content', { 'fullscreen': isFullscreen.value }]
    }, [
      h('button', { onClick: toggleFullscreen }, 
        isFullscreen.value ? '退出全屏' : '全屏'
      ),
      h('div', options.content)
    ])
  });
};
```

**9. 实现Modal的自动关闭定时器**

**答案：**
```javascript
const createAutoCloseModal = (options, timeout = 5000) => {
  let timer = null;
  
  const modal = $modal.show({
    ...options,
    onConfirm: () => {
      clearTimeout(timer);
      options.onConfirm?.();
    },
    onCancel: () => {
      clearTimeout(timer);
      options.onCancel?.();
    }
  });
  
  timer = setTimeout(() => {
    modal.close();
    options.onTimeout?.();
  }, timeout);
  
  return modal;
};
```

**10. 实现Modal的嵌套处理**

**答案：**
```javascript
class ModalStack {
  constructor() {
    this.stack = [];
    this.zIndexBase = 1000;
  }
  
  push(modal) {
    this.stack.push(modal);
    modal.setZIndex(this.zIndexBase + this.stack.length * 10);
  }
  
  pop() {
    return this.stack.pop();
  }
  
  closeTop() {
    const topModal = this.pop();
    if (topModal) {
      topModal.close();
    }
  }
  
  closeAll() {
    while (this.stack.length > 0) {
      this.closeTop();
    }
  }
}

const modalStack = new ModalStack();

const createNestedModal = (options) => {
  const modal = $modal.show({
    ...options,
    onOpen: () => {
      modalStack.push(modal);
      options.onOpen?.();
    },
    onClose: () => {
      modalStack.pop();
      options.onClose?.();
    }
  });
  
  return modal;
};
```

---

## 快速使用指南

### 1. 安装和配置

```bash
# 安装Vue3项目
npm create vue@latest my-project
cd my-project
npm install
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import ModalPlugin from './components/Modal'

const app = createApp(App)
app.use(ModalPlugin)
app.mount('#app')
```

### 2. 基础使用

```vue
<template>
  <!-- 组件形式 -->
  <Modal v-model="show" title="提示">
    <p>这是Modal内容</p>
  </Modal>
  
  <button @click="show = true">显示Modal</button>
  <button @click="showApi">API调用</button>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const show = ref(false)
const { proxy } = getCurrentInstance()

const showApi = () => {
  proxy.$modal.show({
    title: 'API调用',
    content: '确认执行操作？',
    onConfirm: () => {
      console.log('确认')
    }
  })
}
</script>
```

### 3. 高级功能

```javascript
// 异步操作
proxy.$modal.show({
  title: '保存数据',
  content: '正在保存...',
  onConfirm: async () => {
    await saveData()  // 自动显示loading
  }
})

// 自定义内容
proxy.$modal.show({
  title: '自定义内容',
  content: () => h('div', [
    h('p', '自定义HTML'),
    h('input', { placeholder: '输入内容' })
  ])
})

// JSX语法
proxy.$modal.show({
  title: 'JSX内容',
  content: () => (
    <div>
      <p>JSX语法支持</p>
      <button onClick={() => console.log('clicked')}>
        点击
      </button>
    </div>
  )
})
```

[标签: Vue3 Modal组件 弹窗对话框] Teleport传送门 + Composition API + TypeScript