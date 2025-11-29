
## 日常学习模式

### [标签: Vue 双向绑定原理] [标签: Object.defineProperty] [标签: 发布-订阅模式] [标签: MVVM框架]

### 一、核心概念

Vue 双向数据绑定是 MVVM 框架的核心机制，实现了数据层(Model)与视图层(View)的自动同步。当数据变化时视图自动更新，当用户操作视图时数据自动改变。

### 二、核心组件

#### 1. Observer(观察者)
**作用**: 数据劫持的核心，负责监听数据变化

```javascript
/**
 * 观察者类 - 递归遍历data对象，将所有属性转为响应式
 * @param {Object} value - 需要观察的数据对象
 */
class Observer {
    constructor(value) {
        this.value = value;
        this.walk(value);
    }
  
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
}

/**
 * 定义响应式属性
 * @param {Object} obj - 目标对象
 * @param {String} key - 属性名
 * @param {*} val - 属性值
 */
function defineReactive(obj, key, val) {
    observe(val); // 递归处理嵌套对象
    const dep = new Dep(); // 每个属性配一个依赖管理器
  
    Object.defineProperty(obj, key, {
        get() {
            if (Dep.target) {
                dep.addDep(Dep.target); // 依赖收集
            }
            return val;
        },
        set(newVal) {
            if (newVal === val) return;
            val = newVal;
            observe(newVal); // 新值也需要响应式处理
            dep.notify(); // 通知更新
        }
    });
}
```

**使用场景**: 
- 初始化 Vue 实例时自动对 data 进行响应式处理
- 处理深层嵌套对象的响应式转换

#### 2. Dep(依赖管理器)
**作用**: 管理所有依赖某个数据的 Watcher，负责通知更新

```javascript
/**
 * 依赖管理器 - 收集和通知依赖
 */
class Dep {
    constructor() {
        this.deps = []; // 存储所有Watcher
    }
  
    addDep(watcher) {
        this.deps.push(watcher);
    }
  
    notify() {
        this.deps.forEach(watcher => watcher.update());
    }
}

Dep.target = null; // 全局唯一的Watcher引用
```

**使用场景**:
- 一个数据对应一个 Dep
- 一个 Dep 可以管理多个 Watcher(一个数据被多处使用)

#### 3. Compiler(编译器)
**作用**: 解析模板，识别指令和插值表达式，创建对应的 Watcher

```javascript
/**
 * 模板编译器 - 解析DOM模板
 * @param {String} el - 根元素选择器
 * @param {Object} vm - Vue实例
 */
class Compiler {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);
        if (this.$el) {
            this.compile(this.$el);
        }
    }
  
    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                this.compileElement(node); // 处理 v- 和 @ 指令
            } else if (this.isInterpolation(node)) {
                this.compileText(node); // 处理 {{}} 插值
            }
          
            // 递归处理子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        });
    }
  
    isElement(node) {
        return node.nodeType === 1;
    }
  
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
}
```

**使用场景**:
- 解析 `{{message}}` 插值表达式
- 解析 `v-model`、`v-text` 等指令
- 解析 `@click` 等事件绑定

#### 4. Watcher(订阅者)
**作用**: 连接数据和视图，数据变化时执行更新函数

```javascript
/**
 * 订阅者 - 数据变化时更新视图
 * @param {Object} vm - Vue实例
 * @param {String} key - 依赖的数据路径(支持 a.b.c 格式)
 * @param {Function} updaterFn - 更新函数
 */
class Watcher {
    constructor(vm, key, updaterFn) {
        this.vm = vm;
        this.key = key;
        this.updaterFn = updaterFn;
      
        // 依赖收集: 触发getter将自己添加到Dep
        Dep.target = this;
        this.getValue(vm, key);
        Dep.target = null;
    }
  
    getValue(vm, expr) {
        // 处理嵌套属性 person.age
        return expr.split('.').reduce((data, current) => data[current], vm);
    }
  
    update() {
        const newValue = this.getValue(this.vm, this.key);
        this.updaterFn.call(this.vm, newValue);
    }
}
```

**使用场景**:
- 每个模板依赖创建一个 Watcher
- 一个 Watcher 对应一个更新函数

### 三、完整流程

```javascript
/**
 * 简版Vue - 实现双向数据绑定
 * @param {Object} options - 配置对象
 * @param {String} options.el - 挂载元素
 * @param {Object} options.data - 响应式数据
 * @param {Object} options.methods - 方法
 */
class KVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;
        this.$methods = options.methods;
      
        // 1. 数据响应化
        observe(this.$data);
      
        // 2. 代理data和methods到实例
        proxy(this, this.$data);
        proxy(this, this.$methods);
      
        // 3. 编译模板
        if (options.el) {
            new Compiler(options.el, this);
        }
    }
}

/**
 * 代理函数 - 将对象属性代理到目标对象
 * @param {Object} target - 代理目标(vm实例)
 * @param {Object} source - 数据源(data或methods)
 */
function proxy(target, source) {
    Object.keys(source).forEach(key => {
        Object.defineProperty(target, key, {
            get() {
                return source[key];
            },
            set(newValue) {
                source[key] = newValue;
            }
        });
    });
}
```

**执行流程**:
1. **初始化**: `new KVue()` → `observe(data)` 将数据变为响应式
2. **编译**: `Compiler` 解析模板，遇到依赖创建 `Watcher`
3. **依赖收集**: `Watcher` 创建时触发 `getter`，将自己添加到 `Dep`
4. **数据变化**: 修改数据 → 触发 `setter` → `Dep.notify()` → `Watcher.update()` → 更新视图
5. **视图变化**: 用户输入 → 触发 `input` 事件 → 修改数据 → 触发 `setter`

### 四、v-model 实现

```javascript
/**
 * v-model指令实现
 * @param {Node} node - DOM节点
 * @param {Object} vm - Vue实例
 * @param {String} exp - 表达式(如 'message' 或 'person.age')
 */
model(node, vm, exp) {
    // 数据 → 视图
    this.update(node, vm, exp, 'model');
  
    // 视图 → 数据
    node.addEventListener('input', e => {
        const newValue = e.target.value;
        const keys = exp.split('.');
        let obj = vm;
      
        // 处理嵌套属性赋值
        for(let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = newValue;
    });
}

modelUpdater(node, value) {
    node.value = value;
}
```

### 五、关键技术点

1. **闭包保存数据**: `defineReactive` 中的 `val` 通过闭包保存
2. **递归响应式**: 深层嵌套对象递归调用 `observe`
3. **全局 Dep.target**: 用于在 getter 中获取当前 Watcher
4. **发布-订阅模式**: Dep 作为中介，解耦数据和视图
5. **路径表达式**: 支持 `person.age` 等嵌套属性访问

---

## 面试突击模式

### Vue双向数据绑定 面试速记

#### 30秒电梯演讲
Vue 通过 `Object.defineProperty` 劫持数据的 getter/setter，配合发布-订阅模式实现双向绑定。核心包括:Observer 负责数据劫持，Dep 管理依赖，Compiler 解析模板创建 Watcher，Watcher 连接数据和视图。数据变化触发 setter 通知 Watcher 更新视图，用户输入通过事件监听修改数据形成闭环。

#### 高频考点(必背)

**考点1: Object.defineProperty 的作用和局限**
- 作用: 拦截对象属性的读写操作，实现数据劫持
- 局限: ①无法监听新增/删除属性 ②无法监听数组索引和length变化 ③必须递归遍历处理每个属性，性能开销大 ④Vue3用Proxy替代解决这些问题

**考点2: 依赖收集的时机和原理**
- 时机: Watcher 实例化时主动读取依赖数据
- 原理: 读取触发 getter → Dep.target 指向当前 Watcher → getter 中调用 `dep.addDep(Dep.target)` → 完成收集后清空 Dep.target
- 一个数据可被多个 Watcher 依赖，一个 Watcher 也可依赖多个数据

**考点3: 发布-订阅模式的体现**
- Dep 是发布者(调度中心)，Watcher 是订阅者
- 数据变化时 Dep 通知所有订阅的 Watcher 更新
- 解耦了数据层和视图层，符合开闭原则

**考点4: v-model 本质**
- 语法糖: `:value` + `@input` 的组合
- 数据→视图: 通过 Watcher 监听数据变化更新 DOM
- 视图→数据: 监听 input 事件修改数据

**考点5: 响应式处理流程**
```
初始化 → observe(data) → defineReactive每个属性 
→ Compiler解析模板 → 创建Watcher → 依赖收集
→ 数据变化 → setter触发 → Dep.notify() 
→ Watcher.update() → 更新DOM
```

#### 经典面试题

**技术知识题 (10题)**

**题目1: 手写简版 Observer 实现数据劫持**

**思路**: 递归遍历对象属性，用 `Object.defineProperty` 重写 getter/setter

**答案**: Observer 需要实现:
1. 递归遍历所有属性
2. 对每个属性调用 defineReactive
3. getter 中进行依赖收集
4. setter 中通知更新并递归处理新值

**代码框架**:
```javascript
/**
 * 观察者实现 - 核心是递归和defineProperty
 * @param {Object} value - 待观察的对象
 */
class Observer {
    constructor(value) {
        this.walk(value);
    }
  
    /**
     * 遍历对象所有属性,转为响应式
     * @param {Object} obj - 目标对象
     */
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
}

/**
 * 定义响应式属性 - 闭包保存val,dep
 * @param {Object} obj - 对象
 * @param {String} key - 属性名
 * @param {*} val - 属性值
 */
function defineReactive(obj, key, val) {
    // 递归处理嵌套对象
    observe(val);
  
    // 每个属性一个Dep实例
    const dep = new Dep();
  
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // 依赖收集: Watcher实例化时触发
            if (Dep.target) {
                dep.addDep(Dep.target);
            }
            return val;
        },
        set(newVal) {
            if (newVal === val) return;
            val = newVal;
            // 新值也要响应式化
            observe(newVal);
            // 通知所有依赖更新
            dep.notify();
        }
    });
}

/**
 * 入口函数 - 判断是否为对象
 * @param {*} obj - 待观察的值
 */
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return;
    }
    new Observer(obj);
}
```

---

**题目2: 实现 Dep 依赖管理器**

**思路**: 维护一个订阅者数组，提供添加和通知方法

**答案**: Dep 需要:
1. 维护 subs 数组存储 Watcher
2. addDep 方法添加订阅者
3. notify 方法通知所有订阅者
4. 静态属性 Dep.target 存储当前 Watcher

**代码框架**:
```javascript
/**
 * 依赖管理器 - 发布订阅模式的核心
 */
class Dep {
    constructor() {
        // 存储所有订阅者(Watcher实例)
        this.deps = [];
    }
  
    /**
     * 添加订阅者
     * @param {Watcher} watcher - 订阅者实例
     */
    addDep(watcher) {
        this.deps.push(watcher);
    }
  
    /**
     * 通知所有订阅者更新
     */
    notify() {
        this.deps.forEach(watcher => watcher.update());
    }
}

// 全局唯一,指向当前正在收集依赖的Watcher
Dep.target = null;
```

---

**题目3: 实现 Watcher 订阅者**

**思路**: 创建时收集依赖，提供 update 方法更新视图

**答案**: Watcher 需要:
1. 保存 vm、表达式、更新函数
2. 实例化时触发 getter 完成依赖收集
3. update 方法获取新值并执行更新函数
4. 支持嵌套属性路径解析

**代码框架**:
```javascript
/**
 * 订阅者 - 连接数据和视图的桥梁
 * @param {Object} vm - Vue实例
 * @param {String} key - 依赖的数据路径
 * @param {Function} updaterFn - 更新回调
 */
class Watcher {
    constructor(vm, key, updaterFn) {
        this.vm = vm;
        this.key = key;
        this.updaterFn = updaterFn;
      
        // 依赖收集三步走
        Dep.target = this;           // 1.设置全局target
        this.getValue(vm, key);      // 2.触发getter收集
        Dep.target = null;           // 3.清空target
    }
  
    /**
     * 获取表达式的值 - 支持a.b.c格式
     * @param {Object} vm - Vue实例
     * @param {String} expr - 表达式
     * @returns {*} 表达式的值
     */
    getValue(vm, expr) {
        return expr.split('.').reduce((data, key) => {
            return data[key];
        }, vm);
    }
  
    /**
     * 更新方法 - 数据变化时由Dep调用
     */
    update() {
        const newValue = this.getValue(this.vm, this.key);
        this.updaterFn.call(this.vm, newValue);
    }
}
```

---

**题目4: 实现 v-model 双向绑定**

**思路**: 绑定 value 属性 + 监听 input 事件

**答案**: v-model 实现包括:
1. 数据→视图: 创建 Watcher 监听数据变化
2. 视图→数据: 监听 input 事件修改数据
3. 支持嵌套属性路径

**代码框架**:
```javascript
/**
 * v-model指令处理器
 * @param {Node} node - DOM节点
 * @param {Object} vm - Vue实例
 * @param {String} exp - 表达式(如'message'或'person.name')
 */
model(node, vm, exp) {
    // 1. 数据→视图: 初始化并创建Watcher
    this.update(node, vm, exp, 'model');
  
    // 2. 视图→数据: 监听input事件
    node.addEventListener('input', e => {
        const newValue = e.target.value;
        const keys = exp.split('.');
        let obj = vm;
      
        // 处理嵌套路径: person.name
        for(let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
      
        // 修改数据,触发setter
        obj[keys[keys.length - 1]] = newValue;
    });
}

/**
 * model更新器 - 更新input的value
 * @param {Node} node - input节点
 * @param {*} value - 新值
 */
modelUpdater(node, value) {
    node.value = value;
}

/**
 * 通用update方法 - 初始化视图并创建Watcher
 * @param {Node} node - DOM节点
 * @param {Object} vm - Vue实例
 * @param {String} exp - 表达式
 * @param {String} dir - 指令名
 */
update(node, vm, exp, dir) {
    const updaterFn = this[dir + 'Updater'];
    if (updaterFn) {
        // 初始化视图
        const value = exp.split('.').reduce((data, key) => {
            return data[key];
        }, vm);
        updaterFn(node, value);
      
        // 创建Watcher,后续自动更新
        new Watcher(vm, exp, function(newValue) {
            updaterFn(node, newValue);
        });
    }
}
```

---

**题目5: 如何实现数组响应式?**

**思路**: 重写数组原型方法，手动触发更新

**答案**: Vue2 对数组的处理:
1. `Object.defineProperty` 无法监听数组索引和 length
2. Vue 重写了7个数组变异方法:`push/pop/shift/unshift/splice/sort/reverse`
3. 通过原型链拦截，调用原方法后手动触发 `dep.notify()`
4. Vue3 的 Proxy 原生支持数组监听

**代码框架**:
```javascript
/**
 * 数组响应式处理 - 重写原型方法
 */
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

// 需要重写的方法列表
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
.forEach(method => {
    /**
     * 重写的数组方法
     * @param {...*} args - 方法参数
     */
    arrayMethods[method] = function(...args) {
        // 调用原生方法
        const result = arrayProto[method].apply(this, args);
      
        // 获取Observer实例
        const ob = this.__ob__;
      
        // 处理新增元素(push/unshift/splice)
        let inserted;
        switch(method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
      
        // 对新增元素进行响应式处理
        if (inserted) {
            ob.observeArray(inserted);
        }
      
        // 手动触发更新
        ob.dep.notify();
      
        return result;
    };
});

/**
 * Observer类需要添加数组处理
 */
class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
      
        // 标记已被观察
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false
        });
      
        if (Array.isArray(value)) {
            // 数组: 替换原型
            value.__proto__ = arrayMethods;
            this.observeArray(value);
        } else {
            // 对象: 遍历属性
            this.walk(value);
        }
    }
  
    /**
     * 观察数组每一项
     * @param {Array} items - 数组
     */
    observeArray(items) {
        items.forEach(item => observe(item));
    }
}
```

---

**题目6: Dep.target 的作用是什么?**

**思路**: 全局唯一变量，用于依赖收集时传递 Watcher

**答案**: 
1. Dep.target 是一个静态属性，同一时间只指向一个 Watcher
2. 作用是在 getter 和 Watcher 之间传递引用
3. Watcher 实例化时设置 `Dep.target = this`
4. 读取数据触发 getter，getter 中通过 `Dep.target` 获取 Watcher
5. 收集完成后清空 `Dep.target = null`，避免重复收集

**代码框架**:
```javascript
/**
 * 依赖收集流程示例
 */

// 1. Watcher实例化
class Watcher {
    constructor(vm, key, updaterFn) {
        Dep.target = this;        // 设置全局target
        this.getValue(vm, key);   // 触发getter
        Dep.target = null;        // 清空target
    }
}

// 2. getter中收集依赖
function defineReactive(obj, key, val) {
    const dep = new Dep();
  
    Object.defineProperty(obj, key, {
        get() {
            // Dep.target存在说明正在收集依赖
            if (Dep.target) {
                dep.addDep(Dep.target);  // 收集当前Watcher
            }
            return val;
        }
    });
}

// 3. 完整流程
/**
 * new Watcher(vm, 'message', updateFn)
 * → Dep.target = watcher
 * → 读取 vm.message
 * → 触发 message 的 getter
 * → getter 中 dep.addDep(Dep.target)
 * → watcher 被添加到 message 的 dep 中
 * → Dep.target = null
 */
```

---

**题目7: 如何处理深层嵌套对象的响应式?**

**思路**: 递归调用 observe

**答案**:
1. 在 `defineReactive` 中，对属性值调用 `observe(val)`
2. observe 函数判断是否为对象，是则创建 Observer
3. Observer 遍历对象属性，对每个属性调用 `defineReactive`
4. 形成递归，直到所有层级都处理完毕
5. setter 中对新值也要调用 `observe(newVal)`

**代码框架**:
```javascript
/**
 * 递归响应式处理示例
 */

// 入口函数
function observe(obj) {
    // 终止条件: 非对象或null
    if (typeof obj !== 'object' || obj === null) {
        return;
    }
    new Observer(obj);
}

// 定义响应式
function defineReactive(obj, key, val) {
    // 递归1: 处理初始值
    observe(val);  // val可能是嵌套对象
  
    const dep = new Dep();
  
    Object.defineProperty(obj, key, {
        get() {
            if (Dep.target) {
                dep.addDep(Dep.target);
            }
            return val;
        },
        set(newVal) {
            if (newVal === val) return;
            val = newVal;
          
            // 递归2: 处理新值
            observe(newVal);  // 新值也可能是对象
          
            dep.notify();
        }
    });
}

// 示例数据
const data = {
    user: {
        profile: {
            name: 'Tom',
            age: 18
        }
    }
};

/**
 * 处理流程:
 * observe(data)
 * → Observer遍历user
 * → defineReactive(data, 'user', {...})
 * → observe({profile: {...}})
 * → Observer遍历profile
 * → defineReactive(user, 'profile', {...})
 * → observe({name: 'Tom', age: 18})
 * → Observer遍历name和age
 * → defineReactive处理基本类型,不再递归
 */
```

---

**题目8: Vue3 为什么用 Proxy 替代 Object.defineProperty?**

**思路**: 对比两者优缺点

**答案**: Proxy 的优势:
1. 可以监听对象属性的新增和删除
2. 可以监听数组索引和 length 变化
3. 代理整个对象，无需递归遍历
4. 支持13种拦截操作，功能更强大
5. 性能更好，不需要一开始就递归处理

Object.defineProperty 的局限:
1. 只能监听已存在的属性
2. 无法监听数组变化(需要hack)
3. 必须递归遍历，初始化性能差
4. 深层对象需要一次性全部处理

**代码框架**:
```javascript
/**
 * Proxy实现响应式 - Vue3方式
 * @param {Object} target - 目标对象
 * @param {Object} handler - 拦截处理器
 * @returns {Proxy} 代理对象
 */
function reactive(target) {
    // 缓存已代理对象,避免重复代理
    if (target.__isReactive) {
        return target;
    }
  
    const handler = {
        /**
         * 拦截属性读取
         * @param {Object} target - 目标对象
         * @param {String} key - 属性名
         * @param {Proxy} receiver - 代理对象
         */
        get(target, key, receiver) {
            // 标记为响应式对象
            if (key === '__isReactive') {
                return true;
            }
          
            // 依赖收集
            track(target, key);
          
            const result = Reflect.get(target, key, receiver);
          
            // 懒递归: 访问时才代理子对象
            if (typeof result === 'object' && result !== null) {
                return reactive(result);
            }
          
            return result;
        },
      
        /**
         * 拦截属性设置
         * @param {Object} target - 目标对象
         * @param {String} key - 属性名
         * @param {*} value - 新值
         * @param {