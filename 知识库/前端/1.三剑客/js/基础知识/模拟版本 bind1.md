# 日常学习模式

[标签: JavaScript bind实现 this绑定 闭包 函数柯里化]

## 核心概念

**bind方法作用**
- 创建新函数，绑定this到指定对象
- 支持预设参数（柯里化）
- 返回新函数，不立即执行

**关键技术点**
1. **类数组转换**: `Array.prototype.slice.call(arguments)` → 现代写法 `[...arguments]`
2. **apply调用**: `func.apply(thisArg, [argsArray])` 传参数组
3. **闭包保存**: 保存原函数、绑定对象、预设参数
4. **原型链继承**: 支持new调用，通过中介函数连接原型

## 实现逻辑

```javascript
/**
 * bind简化实现
 * @param {Object} context - 绑定的this对象
 * @param {...*} bindArgs - 预设参数
 */
Function.prototype.bind1 = function(context, ...bindArgs) {
    const fn = this;
  
    return function(...callArgs) {
        return fn.apply(context, [...bindArgs, ...callArgs]);
    };
};
```

## 应用场景

**事件处理**
```javascript
class Counter {
    constructor() {
        this.count = 0;
        btn.onclick = this.increment.bind1(this);
    }
    increment() { this.count++; }
}
```

**回调保持this**
```javascript
setInterval(this.tick.bind1(this), 1000);
```

**函数柯里化**
```javascript
const double = multiply.bind1(null, 2);
double(5); // 10
```

---

# 面试突击模式

## [bind实现] 面试速记

### 30秒电梯演讲
bind创建新函数并绑定this，通过闭包保存原函数和预设参数，调用时用apply合并参数执行。

### 高频考点(必背)

**bind作用**: 返回新函数，绑定this和预设参数，不立即执行

**与call/apply区别**: call/apply立即执行，bind返回函数；apply传数组，call传列表

**闭包作用**: 保存原函数、绑定对象、预设参数，使返回函数能访问这些变量

**this绑定优先级**: new > 显式绑定(bind/call/apply) > 隐式绑定 > 默认绑定

**原型链继承**: 通过中介函数连接原型，支持绑定函数作为构造函数使用

### 经典面试题

**题目1: bind返回什么？**
思路: 理解bind不执行原函数
答案: 返回新函数，调用时才执行原函数
```javascript
const fn = function() { console.log(this); };
const bound = fn.bind({x: 1}); // 返回函数，未执行
bound(); // 执行时输出 {x: 1}
```

**题目2: 类数组转数组方法**
思路: arguments不是真数组
答案: `[...arguments]` 或 `Array.from(arguments)`
```javascript
// 旧写法
Array.prototype.slice.call(arguments);
// 新写法
[...arguments]
```

**题目3: apply和call区别**
思路: 参数传递方式不同
答案: apply传数组，call传列表
```javascript
fn.apply(obj, [1, 2]);
fn.call(obj, 1, 2);
```

**题目4: 闭包如何保存变量**
思路: 内部函数访问外部变量
答案: 返回函数形成闭包，保存fn、context、args
```javascript
Function.prototype.bind1 = function(context) {
    const fn = this; // 闭包保存
    return function() { fn.apply(context); };
};
```

**题目5: 链式bind为何无效**
思路: bind只能绑定一次this
答案: 第一次bind已固定this，后续bind无法改变
```javascript
const fn1 = fn.bind({a: 1});
const fn2 = fn1.bind({b: 2}); // this仍是{a: 1}
```

**题目6: 实现简化版bind**
思路: 闭包+apply
答案: 保存函数和参数，返回新函数
```javascript
Function.prototype.myBind = function(ctx, ...args) {
    const fn = this;
    return function(...newArgs) {
        return fn.apply(ctx, [...args, ...newArgs]);
    };
};
```

**题目7: bind如何支持new**
思路: 检测是否new调用
答案: 判断this instanceof，是则用this，否则用绑定对象
```javascript
return function() {
    const context = this instanceof arguments.callee ? this : target;
    return fn.apply(context, args);
};
```

**题目8: 参数合并方式**
思路: 预设参数+调用参数
答案: concat或扩展运算符
```javascript
[...bindArgs, ...callArgs]
// 或
bindArgs.concat(callArgs)
```

**题目9: 为何需要类型检查**
思路: 确保调用者是函数
答案: 非函数调用bind抛TypeError
```javascript
if (typeof this !== 'function') {
    throw new TypeError('不可调用');
}
```

**题目10: 柯里化应用**
思路: 预设部分参数
答案: 创建专用函数
```javascript
const add = (a, b) => a + b;
const add5 = add.bind(null, 5);
add5(3); // 8
```