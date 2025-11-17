
### **开发文档：手撕一个简版Vue双向数据绑定**

#### **一、这玩意儿有啥用？（用途）**

你个憨批听好了，这玩意儿是Vue这类MVVM框架的裤衩子，是它的核心。搞懂了它，你才知道数据是怎么从`JavaScript`对象（`Model`）跑到页面（`View`）上，又是怎么从页面的输入框（`View`）再滚回到你的`JS`对象（`Model`）里的。面试的时候，你除了会用`v-model`，还能跟面试官吹吹`Object.defineProperty`的数据劫持、发布-订阅模式，瞬间就跟那些只会调API的菜鸡拉开差距了。平时调试什么数据不更新的SB问题，也能从根上找原因，而不是抓瞎一样乱`console.log`。所以说，这玩意儿是地基，地基不牢，你盖再高的楼也得塌！

#### **二、核心知识点（学习知识）**

别看那破文章写得天花乱坠，核心就这几样东西，给老王我记死了：

1.  **`Observer`（观察者/监听器）**：这个B是核心中的核心，它的任务就是“劫持”你的数据。它会递归地遍历你传入的`data`对象，用`Object.defineProperty()`把每个属性的`getter`和`setter`都给重写了。这样一来，谁敢读这个数据（触发`get`），或者谁敢改这个数据（触发`set`），`Observer`都能第一时间知道。乖乖，跟在我家门口装了个摄像头一样。

2.  **`Dep`（Dependency，依赖管理器）**：每个被劫持的数据属性，都TM配一个`Dep`实例，把它想象成一个管家。这个管家的花名册（一个数组`subs`）上记着所有依赖这个数据的“人”（也就是`Watcher`）。当数据变化时，`Observer`就喊一嗓子：“管家，来活了！” `Dep`就负责通知它花名册上所有的`Watcher`：“都给老子起来干活，数据变了，赶紧更新！”

3.  **`Compiler`（编译器/解析器）**：这家伙是个“装修工”，负责扫描HTML模板（带`v-`指令和`{{}}`插值语法的那些）。它看到`{{message}}`，就知道这里要显示`data`里的`message`数据；看到`v-model="name"`，就知道这个输入框的值要和`data`里的`name`双向绑定。它在解析的时候，会为每个依赖创建 一个`Watcher`实例。

4.  **`Watcher`（订阅者）**：这B就是具体干活的。一个`Watcher`对应一个数据依赖。当`Compiler`创建一个`Watcher`时，这个`Watcher`会把自己注册到对应数据的`Dep`管家那里（通过触发一次`getter`实现）。同时，`Watcher`手里拿着一个更新函数，一旦`Dep`通知它更新，它就执行这个函数去更新DOM。

**总结一下这个SB流程**：`Compiler`解析模板，发现一个依赖，就`new`一个`Watcher`。`Watcher`被创建时会去读一次数据，触发`getter`，把自己添加到这个数据对应的`Dep`管家那里。以后数据一变，触发`setter`，`Dep`管家就通知名下所有`Watcher`去更新视图。用户在输入框里打了字，`Compiler`会监听`input`事件，直接修改`data`里的数据，又触发了`setter`，形成一个完美的闭环。这就是发布-订阅模式的典型应用，艹，简单明了！

#### **三、能跑的完整代码**

给老子看好了，这才是人写的代码！一个HTML文件，一个JS文件，清清楚楚。

**`index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>老王手撕Vue双向绑定</title>
</head>
<body>

    <div id="app">
        <h2>测试数据劫持和插值表达式</h2>
        <p>{{ message }}</p>
        <p>崽芽子的年龄: {{ person.age }}</p>
      
        <h2>测试v-model双向绑定</h2>
        <input type="text" v-model="message">
        <hr>
        <input type="text" v-model="person.age">
        <button @click="changeAge">给崽芽子加一岁</button>
    </div>

    <script src="./kvue.js"></script>
    <script>
        const vm = new KVue({
            el: '#app',
            data: {
                message: 'Hello, 你个憨批!',
                person: {
                    name: '崽芽子',
                    age: 10
                }
            },
            methods: {
                changeAge() {
                    // 这个SB函数用来给崽芽子加一岁，别tm乱用
                    this.person.age++;
                }
            }
        });
    </script>

</body>
</html>
```

**`kvue.js`**

```javascript
// 艹，这个文件就是我们简版的Vue，老王我把它命名为KVue
class KVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;
        this.$methods = options.methods;

        // 1. 数据响应化处理，这个最tm关键
        observe(this.$data);

        // 2. 代理data和methods到vm实例上，这样才能用this.message访问
        proxy(this, this.$data);
        proxy(this, this.$methods);

        // 3. 开始编译模板
        if (options.el) {
            new Compiler(options.el, this);
        }
    }
}

// 数据响应化的入口函数
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        // 不是对象或者是个null，滚蛋
        return;
    }
    new Observer(obj);
}

// 真正的观察者类
class Observer {
    constructor(value) {
        this.value = value;
        // 递归遍历所有子属性，一个都别想跑
        this.walk(value);
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
}

// 核心：定义响应式数据
function defineReactive(obj, key, val) {
    // 如果val还是个对象，继续给它observe，往死里整
    observe(val);

    const dep = new Dep(); // 每个属性都配一个管家Dep

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // Dep.target是在Watcher实例化时设置的，只有那个时候才有值
            if (Dep.target) {
                dep.addDep(Dep.target); // 依赖收集，把Watcher加到管家的花名册里
            }
            return val;
        },
        set(newVal) {
            if (newVal === val) {
                // 新旧值一样，改个锤子
                return;
            }
            val = newVal;
            // 新值也可能是对象，也得给它安排上响应式
            observe(newVal);
            // 通知所有依赖更新，搞快点！
            dep.notify();
        }
    });
}

// 依赖管理器Dep
class Dep {
    constructor() {
        this.deps = []; // 存放所有Watcher实例
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        // 挨个通知，一个都不能少
        this.deps.forEach(dep => dep.update());
    }
}
Dep.target = null; // 静态属性，全局唯一

// 订阅者Watcher
class Watcher {
    constructor(vm, key, updaterFn) {
        this.vm = vm;
        this.key = key;
        this.updaterFn = updaterFn;

        // 创建实例时，把自己设置到Dep.target上
        Dep.target = this;
        // 读一下key的值，触发getter，把自己添加到Dep里
        this.getValue(vm, key);
        // 添加完就置空，免得影响其他watcher
        Dep.target = null;
    }

    getValue(vm, expr) {
        // 处理 person.age 这种嵌套情况
        return expr.split('.').reduce((data, current) => data[current], vm);
    }

    update() {
        const newValue = this.getValue(this.vm, this.key);
        this.updaterFn.call(this.vm, newValue);
    }
}

// 模板编译器Compiler
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
                // 是元素节点，解析指令 v- 、 @
                this.compileElement(node);
            } else if (this.isInterpolation(node)) {
                // 是插值文本 {{xxx}}
                this.compileText(node);
            }

            // 递归遍历子节点，一个都别放过
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        });
    }
  
    // 判断是不是元素节点
    isElement(node) {
        return node.nodeType === 1;
    }

    // 判断是不是插值表达式 {{}}
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    compileElement(node) {
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
            const attrName = attr.name;
            const exp = attr.value;
            if (attrName.startsWith('v-')) {
                // v-model, v-text, etc.
                const dir = attrName.substring(2);
                this[dir] && this[dir](node, this.$vm, exp);
            } else if (attrName.startsWith('@')) {
                // @click, @submit
                const eventName = attrName.substring(1);
                 // 这个SB函数处理事件，别tm乱传参数
                this.eventHandler(node, this.$vm, exp, eventName);
            }
        });
    }
  
    compileText(node) {
        // RegExp.$1 能获取到 {{}} 中间的内容
        this.update(node, this.$vm, RegExp.$1, 'text');
    }

    // 更新函数，负责将数据绑定到视图
    update(node, vm, exp, dir) {
        const updaterFn = this[dir + 'Updater'];
        if (updaterFn) {
            // 首次初始化视图
            const value = exp.split('.').reduce((data, current) => data[current], vm);
            updaterFn(node, value);

            // 创建Watcher实例，后续数据更新时会自动调用updaterFn
            new Watcher(vm, exp, function(newValue) {
                updaterFn(node, newValue);
            });
        }
    }
  
    // v-model指令处理
    model(node, vm, exp) {
        // update负责数据到视图
        this.update(node, vm, exp, 'model');

        // 事件监听负责视图到数据
        node.addEventListener('input', e => {
            const newValue = e.target.value;
            // 嵌套属性赋值，这块写得有点SB，但是能用
            const keys = exp.split('.');
            let obj = vm;
            for(let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = newValue;
        });
    }
  
    modelUpdater(node, value) {
        node.value = value;
    }
  
    textUpdater(node, value) {
        node.textContent = value;
    }

    // 事件处理
    eventHandler(node, vm, exp, eventName) {
        const fn = vm.$methods && vm.$methods[exp];
        if (eventName && fn) {
            node.addEventListener(eventName, fn.bind(vm));
        }
    }
}

// 代理函数，把data上的属性代理到vm实例上
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

[标签: Vue响应式原理] Object.defineProperty 数据劫持 发布-订阅模式
```

---

### **如果你是面试官，你会怎么考察？**

#### **10个技术原理题**

1.  **问**：`Object.defineProperty`有什么缺点？Vue 3为什么用`Proxy`替代它？
    **答**：这SB玩意儿一次只能劫持一个属性，你得递归遍历，性能开销大。而且，它没法监控到对象属性的新增和删除，也监控不到数组通过索引修改或`length`改变。`Proxy`就不一样了，它代理的是整个对象，天生就能解决这些问题，代码还简洁，性能更好。

2.  **问**：在`defineReactive`里，`Dep`实例是什么时候创建的？和`Watcher`是什么关系？
    **答**：在`defineReactive`函数内部，给每个属性做`defineProperty`之前，就会`new Dep()`。它跟属性是一对一的。`Watcher`是跟模板里的依赖是一对一的。一个`Dep`可以管理多个`Watcher`（比如页面上多处用到了同一个数据），一个`Watcher`也可以对应多个`Dep`（比如计算属性）。

3.  **问**：依赖收集（`dep.addDep(Dep.target)`）具体是在哪个环节、因为什么操作触发的？
    **答**：在`Watcher`的构造函数里。`new Watcher`时，会先把`Watcher`实例赋给全局的`Dep.target`，然后主动去读一次它所依赖的数据的值。这一读，就触发了对应数据的`getter`，`getter`函数里一看`Dep.target`有值，就把这个`Watcher`给收进自己的`Dep`管家了。读完之后马上把`Dep.target`清空，免得误伤。

4.  **问**：如果我的`data`里有个深层嵌套的对象，比如`person: { info: { age: 10 } }`，你是怎么保证`age`变化的响应式的？
    **答**：在`Observer`的`walk`方法里，会对对象的每个`key`执行`defineReactive`。而在`defineReactive`函数内部，会先对`val`（也就是属性值）递归调用`observe(val)`，如果`val`是对象，就继续把它变成响应式的。这样一层层扒下去，直到所有子属性都被`Object.defineProperty`安排上。

5.  **问**：`Compiler`在编译模板时，如果遇到一个节点既有`v-model`又有`{{}}`，它的处理顺序是怎样的？
    **答**：在上面的简版实现里，是遍历属性（`compileElement`）和遍历子节点（`compile`的递归调用）来处理。它会先处理元素节点的属性，比如解析`v-model`，然后递归进入子节点。如果`{{}}`是该节点的文本子节点，那就在递归中被`isInterpolation`捕获并处理。顺序是先父节点属性，再子节点。

6.  **问**：Vue的`nextTick`是干嘛的？在我这份简版实现里，缺少了什么机制导致可能会有性能问题？
    **答**：`nextTick`是为了解决频繁数据更新导致的DOM重复渲染问题。Vue会把同一次事件循环中的所有数据更新（`setter`触发的`notify`）推进一个异步队列里，到下一个tick才统一执行更新。我这个SB版本缺少这个异步更新队列，数据一变就直接`dep.notify()`同步更新DOM，如果一个函数里连续改100次数据，DOM就跟着傻乎乎地更新100次，性能直接爆炸。

7.  **问**：`v-model`本质上是个什么？是“语法糖”吗？
    **答**：对，就是个语法糖。它相当于绑定了`value`属性和监听了`input`事件。`:value="message"`负责数据到视图，`@input="message = $event.target.value"`负责视图到数据。

8.  **问**：`Dep.target`这个静态属性起到了什么关键作用？为什么必须是全局唯一的？
    **答**：它是个桥梁，用来在`Watcher`和`Dep`之间传递`Watcher`实例。在同一时间，只能有一个`Watcher`在进行依赖收集，所以它必须是全局唯一的静态属性。这样`getter`在触发时，才能准确知道是哪个`Watcher`依赖了它。

9.  **问**：如果我通过`vm.person = { age: 20 }`这样整个替换掉一个对象，响应式会失效吗？为什么？
    **答**：在我这个实现里，会保持响应式。因为在`set`函数里，对`newVal`执行了`observe(newVal)`，新的对象`{ age: 20 }`会被整个拿去重新做响应式处理。所以没问题。

10. **问**：请解释一下发布-订阅模式和观察者模式在这段代码里的体现，它们有啥区别？
    **答**：`Dep`和`Watcher`就是典型的发布-订阅模式。`Dep`是调度中心（发布者），`Watcher`是订阅者，两者解耦。`Observer`和`Watcher`之间，更像是观察者模式，`Observer`作为被观察者，直接持有`Watcher`的引用（通过`Dep`间接持有）。主要区别是发布-订阅模式有个中心的调度者（`Dep`），而观察者模式通常是目标直接通知观察者。在这个场景下，两种模式思想是相通的。

#### **10个业务逻辑/场景题**

1.  **问**：我有一个表单，用户输入姓名后，页面上5个不同的地方都要实时显示这个姓名。用你这个框架怎么实现？
    **答**：在`data`里定义一个`name`属性，比如`name: ''`。在`input`上用`v-model="name"`。在其他5个地方用`{{name}}`。`Compiler`会自动为这6个依赖（1个`v-model`，5个插值）创建`Watcher`，都注册到`name`属性的`Dep`里。输入框一改，`set`触发，`Dep`通知所有`Watcher`，6个地方就一起更新了。

2.  **问**：一个按钮`@click="addUser"`，`addUser`方法里连续两次修改了同一个数据，`this.count++`和`this.count++`，视图会更新几次？
    **答**：在我这个简版实现里，会更新两次，因为是同步更新。在真正的Vue里，由于`nextTick`异步队列机制，只会更新一次，只渲染最后的结果。

3.  **问**：如果我的`data`有个数组`list: [1, 2, 3]`，我通过`vm.list.push(4)`，页面会更新吗？为什么？
    **答**：在我这个简版代码里，不会。因为`Object.defineProperty`没法监听到数组的`push`、`pop`等变异方法。真正的Vue为了解决这个SB问题，重写了数组的这几个原型方法，在调用这些方法时，手动去触发`dep.notify()`来通知更新。

4.  **问**：我想实现一个计算属性，比如`fullName`，它依赖`firstName`和`lastName`。在你这个框架基础上，怎么扩展？
    **答**：需要引入一个`computedWatcher`。当`fullName`被访问时，这个`Watcher`去收集`firstName`和`lastName`的依赖。当`firstName`或`lastName`变化时，通知`fullName`的`Watcher`重新计算，并通知所有依赖`fullName`的`Watcher`去更新视图。这比普通`Watcher`复杂，需要有缓存（`dirty`标志）和依赖收集的能力。

5.  **问**：我有个`v-if`指令，当数据显示时，里面的`v-model`才生效。如何实现这个逻辑？
    **答**：`v-if`的实现需要`Compiler`在解析时，根据表达式的真假来决定是否把DOM片段插入或移除文档。当插入时，才对里面的子节点进行`compile`，创建`Watcher`；移除时，需要把相关的`Watcher`也销毁掉，释放内存。

6.  **问**：用户在输入框里输入的内容，我需要做一个防抖处理，每隔500ms才更新`data`。怎么改？
    **答**：不能直接用`v-model`。应该把`v-model`拆开，用`:value="message"`绑定数据，然后用`@input="handleInput"`监听事件。在`methods`里定义`handleInput`方法，在方法内部实现一个防抖函数，延迟500ms后才执行`this.message = ...`的赋值操作。

7.  **问**：如果`v-model`绑定的是一个深层对象属性，比如`v-model="form.user.name"`，我的实现能支持吗？
    **答**：能。`Watcher`在取值和更新时，我都用了`split('.')`和`reduce`来处理路径表达式，完全支持。在`input`事件里更新数据时，也做了循环找到最后一层对象进行赋值，所以也没毛病。

8.  **问**：表单重置功能，点击按钮把所有`data`里的表单字段恢复到初始状态，如何最高效地实现？
    **答**：在`new Vue`之前，先深拷贝一份初始`data`存起来，比如`initialData`。点击重置按钮时，执行一个`reset`方法，方法里用`Object.assign(this.data, initialData)`或者循环赋值的方式，把`data`恢复到初始状态。这样会触发每个属性的`set`，自动更新视图。

9.  **问**：我的页面上有一个巨大的列表，用`v-for`渲染，如果我只是修改了其中一条数据的某个字段，你这个框架会把整个列表都重新渲染一遍吗？
    **答**：不会。因为响应式的粒度是到数据属性级别的。你只改了某条数据的某个字段，只会触发这个字段的`setter`，然后`Dep`只会通知依赖了这个字段的那些`Watcher`去更新对应的DOM节点，而不是整个列表重新渲染。这TM就是数据驱动的牛逼之处。

10. **问**：如果有一个只显示一次的变量，之后它的变化不再需要更新视图，怎么优化？
    **答**：可以用类似`v-once`的指令。`Compiler`在解析到`v-once`时，正常进行首次渲染，但不为它创建`Watcher`。这样，后续对应的数据再怎么变，没有`Watcher`去更新DOM，就实现了“一次性”渲染，节省了创建`Watcher`的开销和后续的更新计算。

---

### **快速上手指南（给忘了怎么用的老王自己）**

艹，万一哪天喝断片了，按下面这几步来，保准不出错。

1.  **第一步：复制`kvue.js`文件**
    把上面那个写得跟诗一样的`kvue.js`文件，直接复制到你的新项目里。

2.  **第二步：创建HTML文件**
    新建一个`index.html`，把下面这段最基本的骨架代码粘进去。

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>新项目 - 老王出品</title>
    </head>
    <body>

        <div id="my-app">
            <!-- 在这里写你的HTML，用{{}}和v-model -->
            <p>{{ greeting }}</p>
            <input type="text" v-model="greeting">
            <button @click="sayHi">骂人</button>
        </div>

        <!-- 必须先引入kvue.js -->
        <script src="./kvue.js"></script>
        <script>
            // 然后再new一个实例
            new KVue({
                el: '#my-app',
                data: {
                    greeting: '你好，崽芽子'
                },
                methods: {
                    sayHi() {
                        alert(this.greeting + ', 艹!');
                    }
                }
            });
        </script>

    </body>
    </html>
    ```

3.  **第三步：改就完事了**
    *   `el: '#my-app'`：改成你HTML里根元素的ID。
    *   `data: { ... }`：把你所有需要响应式的数据都扔到这里。
    *   `methods: { ... }`：把你所有的方法都扔到这里，在HTML里用`@click`之类的调用。
    *   在`div#my-app`里面，用`{{}}`显示数据，用`v-model`搞双向绑定。

搞定！就这么简单，比我那婆娘讲道理还简单。

---
### **README.md 更新日志**

**`## [YYYY-MM-DD] - 重构并完善了Vue双向绑定核心原理实现`**

- **`feat`**: 艹，把网上那篇讲得稀烂的双向绑定文章给重构了，整合成一个完整的、可运行的`KVue.js`模块。
- **`docs`**: 编写了一份人能看懂的开发文档，详细解释了`Observer`, `Compiler`, `Dep`, `Watcher`这几个憨批是怎么协同工作的。
- **`test`**: 补充了大量的面试题和场景题，包括技术原理和业务逻辑，以后哪个崽芽子再来面试，就用这个盘他。
- **`refactor`**: 修复了原代码片段中逻辑不连贯、缺失关键实现（如`proxy`，事件处理，`v-model`的完整双向逻辑）的SB问题。现在代码结构清晰，注释到位，老子自己都觉得优雅。
- **`chore`**: 添加了快速上手指南，防止老子哪天脑子瓦特了忘了怎么用。