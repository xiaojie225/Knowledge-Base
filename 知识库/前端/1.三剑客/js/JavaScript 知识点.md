# JavaScript 知识点整理

## 一、基础语法

### 1.1 变量声明

JavaScript 使用 `let`、`var` 和 `const` 来声明变量。

#### let 的使用规则

1. 允许声明和赋值同时进行
2. 不允许重复声明
3. 允许同时声明多个变量并赋值
4. JavaScript 中内置的关键字不能被当做变量名

#### var 的使用规则

1. 允许声明和赋值同时进行
2. 允许重复声明（这是与 let 的主要区别）
3. 允许同时声明多个变量并赋值

**推荐使用 `let`**，因为它更严谨，且具备块级作用域。

### 1.2 运算符

#### 比较运算符

```javascript
console.log(3 > 5) // false
console.log(3 >= 3) // true
console.log(2 == 2) // true

// == 双等号：只判断值，有隐式转换
console.log(2 == '2')  // true

// === 全等：判断值和数据类型
console.log(2 === '2') // false

// NaN 不等于任何值，包括它自己
console.log(NaN === NaN) // false

// 不等于运算符
console.log(2 !== '2')  // true
console.log(2 != '2')   // false

// 字符串比较（按字典序）
console.log('a' < 'b')    // true
console.log('aa' < 'ab')  // true
console.log('aa' < 'aac') // true
```

**注意**：
- 优先使用 `===` 而不是 `==` 进行相等判断。
- `==` 会进行类型转换，而 `===` 不会。
```js
//如果任一操作数是布尔值，则将其转换为数值再比较是否相等
let result1 = (true == 1); // true

//如果一个操作数是字符串，另一个操作数是数值，则尝试将字符串转换为数值，再比较是否相等
let result1 = ("55" == 55); // true

//如果一个操作数是对象，另一个操作数不是，则调用对象的 `valueOf() `方法取得其原始值，再根据前面的规则进行比较
let obj = {valueOf:function(){return 1}}
let result1 = (obj == 1); // true

// `null `和` undefined `相等
let result1 = (null == undefined ); // true

//如果有任一操作数是 `NaN` ，则相等操作符返回 `false`
let result1 = (NaN == NaN ); // false

//如果两个操作数都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回` true `
let obj1 = {name:"xxx"}
let obj2 = {name:"xxx"}
let result1 = (obj1 == obj2 ); // false

下面进一步做个小结：
- 两个都为简单类型，字符串和布尔值都会转换成数值，再比较
- 简单类型与引用类型比较，对象转化成其原始类型的值，再比较
- 两个都为引用类型，则比较它们是否指向同一个对象
- null 和 undefined 相等
- 存在 NaN 则返回 false
```

  ## `==`与 === 区别

```js
//相等操作符（==）会做类型转换，再进行值的比较，全等运算符不会做类型转换
let result1 = ("55" === 55); // false，不相等，因为数据类型不同
let result2 = (55 === 55); // true，相等，因为数据类型相同值也相同

let result1 = (null == undefined ); // true
let result2 = (null  === undefined); // false

```

#### 小结
相等运算符隐藏的类型转换，会带来一些违反直觉的结果

```js
'' == '0' // false
0 == '' // true
0 == '0' // true
false == 'false' // false
false == '0' // true
false == undefined // false
false == null // false
null == undefined // true
' \t\r\n' == 0 // true
```

但在比较`null`的情况的时候，我们一般使用相等操作符`==`
```js
const obj = {};
if(obj.x == null){
  console.log("1");  //执行
}
```
等同于下面写法
```js
if(obj.x === null || obj.x === undefined) {
    ...
}
```

使用相等操作符`（==）`的写法明显更加简洁了
所以，除了在比较对象属性为`null`或者`undefined`的情况下，我们可以使用相等操作符`（==）`，其他情况建议一律使用全等操作符`（===）`


#### 逻辑运算符优先级

```
! > && > ||
```

# ：说说JavaScript中的数据类型？存储上的差别？

## 前言

在`JavaScript`中，我们可以分成两种类型：

- 基本类型
- 复杂类型

两种类型的区别是：存储位置不同
## 一、基本类型

基本类型主要为以下6种：

- Number
- String
- Boolean
- Undefined
- null
- symbol
### Number

数值最常见的整数类型格式则为十进制，还可以设置八进制（零开头）、十六进制（0x开头）

```js
let intNum = 55 // 10进制的55
let num1 = 070 // 8进制的56
let hexNum1 = 0xA //16进制的10


Number(324) // 324

// 字符串：如果可以被解析为数值，则转换为相应的数值
Number('324') // 324

// 字符串：如果不可以被解析为数值，返回 NaN
Number('324abc') // NaN

// 空字符串转为0
Number('') // 0

// 布尔值：true 转成 1，false 转成 0
Number(true) // 1
Number(false) // 0

// undefined：转成 NaN
Number(undefined) // NaN

// null：转成0
Number(null) // 0

// 对象：通常转换成NaN(除了只包含单个数值的数组)
Number({a: 1}) // NaN
Number([1, 2, 3]) // NaN
Number([5]) // 5

`parseInt`相比`Number`，就没那么严格了，`parseInt`函数逐个解析字符，遇到不能转换的字符就停下来
parseInt('32a3') //32
```

浮点类型则在数值汇总必须包含小数点，还可通过科学计数法表示

```js
let floatNum1 = 1.1;
let floatNum2 = 0.1;
let floatNum3 = .1; // 有效，但不推荐
let floatNum = 3.125e7; // 等于 31250000
```

在数值类型中，存在一个特殊数值`NaN`，意为“不是数值”，用于表示本来要返回数值的操作失败了（而不是抛出错误）

```js
console.log(0/0); // NaN
console.log(-0/+0); // NaN
```

### Undefined

`Undefined` 类型只有一个值，就是特殊值 `undefined`。当使用 `var `或 `let `声明了变量但没有初始化时，就相当于给变量赋予了 `undefined `值

```js
let message;
console.log(message == undefined); // true
```

包含` undefined` 值的变量跟未定义变量是有区别的

```js
let message; // 这个变量被声明了，只是值为 undefined

console.log(message); // "undefined"
console.log(age); // 没有声明过这个变量，报错
```
### String

字符串可以使用双引号（"）、单引号（'）或反引号（`）标示

```js
let firstName = "John";
let lastName = 'Jacob';
let lastName = `Jingleheimerschmidt`


```

字符串是不可变的，意思是一旦创建，它们的值就不能变了

```js
let lang = "Java";
lang = lang + "Script";  // 先销毁再创建

// 数值：转为相应的字符串
String(1) // "1"

//字符串：转换后还是原来的值
String("a") // "a"

//布尔值：true转为字符串"true"，false转为字符串"false"
String(true) // "true"

//undefined：转为字符串"undefined"
String(undefined) // "undefined"

//null：转为字符串"null"
String(null) // "null"

//对象
String({a: 1}) // "[object Object]"
String([1, 2, 3]) // "1,2,3"
```

### Null

`Null `类型同样只有一个值，即特殊值 `null`

逻辑上讲， null 值表示一个空对象指针，这也是给`typeof `传一个 `null` 会返回 `"object"` 的原因

```js
let car = null;
console.log(typeof car); // "object"
```

`undefined` 值是由 `null `值派生而来

```js
console.log(null == undefined); // true
```

只要变量要保存对象，而当时又没有那个对象可保存，就可用 `null `来填充该变量

### Boolean

`Boolean `（布尔值）类型有两个字面值： `true` 和` false`

通过`Boolean`可以将其他类型的数据转化成布尔值

```js
Boolean(undefined) // false

Boolean(null) // false

Boolean(0) // false

Boolean(NaN) // false

Boolean('') // false

Boolean({}) // true

Boolean([]) // true

Boolean(new Boolean(false)) // true
```

规则如下：

```js

数据类型           转换为 true 的值                    转换为 false 的值

 String           非空字符串                          ""

 Number           非零数值（包括无穷值）                0 、 NaN

 Object           任意对象                            null

Undefined          N/A （不存在）                     undefined

```

### Symbol

Symbol （符号）是原始值，且符号实例是唯一、不可变的。符号的用途是确保对象属性使用唯一标识符，不会发生属性冲突的危险

```js
let genericSymbol = Symbol();
let otherGenericSymbol = Symbol();
console.log(genericSymbol == otherGenericSymbol); // false

let fooSymbol = Symbol('foo');
let otherFooSymbol = Symbol('foo');
console.log(fooSymbol == otherFooSymbol); // false
```

## 二、引用类型

复杂类型统称为`Object`，我们这里主要讲述下面三种：

- Object
- Array
- Function

### Object

创建`object`常用方式为对象字面量表示法，属性名可以是字符串或数值

```js
let person = {
    name: "Nicholas",
    "age": 29,
    5: true
};
```

### Array

`JavaScript`数组是一组有序的数据，但跟其他语言不同的是，数组中每个槽位可以存储任意类型的数据。并且，数组也是动态大小的，会随着数据添加而自动增长

```js
let colors = ["red", 2, {age: 20 }]
colors.push(2)
```

### Function 

函数实际上是对象，每个函数都是 `Function`类型的实例，而 `Function `也有属性和方法，跟其他引用类型一样

函数存在三种常见的表达方式：

- 函数声明

```js
// 函数声明
function sum (num1, num2) {
    return num1 + num2;
}
```

- 函数表达式

```js
let sum = function(num1, num2) {
    return num1 + num2;
};
```

- 箭头函数

函数声明和函数表达式两种方式

```js
let sum = (num1, num2) => {
    return num1 + num2;
};
```

### 其他引用类型

除了上述说的三种之外，还包括`Date`、`RegExp`、`Map`、`Set`等......



### 1.3 循环与条件

#### while 循环示例

```javascript
let money = 100

while (true) {
  let re = +prompt(`
请您选择操作：
1.存钱
2.取钱
3.查看余额
4.退出
`)

  if (re === 4) {
    break
  }

  switch (re) {
    case 1:
      let cun = +prompt('请输入存款金额')
      money = money + cun
      break
    case 2:
      let qu = +prompt('请输入取款金额')
      money = money - qu
      break
    case 3:
      alert(`您的银行卡余额是${money}`)
      break
  }
}
```

### 1.4 遍历方法

#### for...in 和 for...of

```javascript
// for...in - 遍历键名（索引 / 属性名）
const arr = [10, 20, 30]
for (let index in arr) {
  console.log(index) // 输出: "0", "1", "2"
}

// for...of - 遍历键值
for (let value of arr) {
  console.log(value) // 输出: 10, 20, 30
}

// 遍历对象属性 (对象不能使用 for...of 遍历，因为没有迭代器接口)
const params = { type: 'A', status: 1 }
for (let key in params) {
  console.log(key)         // 输出键名: type, status
  console.log(params[key]) // 输出值: 'A', 1
}

// 遍历字符串
const str = "ABC"
for (let char of str) {
  console.log(char) // 输出: A, B, C
}
```

---

## 二、函数

### 2.1 函数声明方式

#### 普通函数

```javascript
function fn() {
  console.log('普通函数')
}
fn()
```

#### 函数表达式

```javascript
let fn = function() {
  console.log('函数表达式')
}
fn()
```

#### 箭头函数

```javascript
// 基本语法
const fn = () => {
  console.log(123)
}

// 单个参数可省略小括号
const fn = x => {
  console.log(x)
}

// 单行代码可省略大括号
const fn = x => console.log(x)

// 单行代码自动返回
const fn = x => x + x
console.log(fn(1)) // 2

// 返回对象需要用小括号包裹
const fn = (uname) => ({ uname: uname })
console.log(fn('刘德华')) // { uname: '刘德华' }
```

**箭头函数特点**：
1. 属于表达式函数，不存在函数提升。
2. 只有一个参数时可省略 `()`。
3. 函数体只有一行代码时可省略 `{}`，并自动作为返回值返回结果。
4. 没有 `arguments`，使用 `...` 获取剩余参数。
5. **没有自己的 `this`**，其 `this` 指向声明时的上层作用域。

#### 立即执行函数

```javascript
// 写法一
(function(){ 
  console.log('立即执行')
})();

// 写法二
(function(){
  console.log('立即执行')
}());
```

**注意**：多个立即执行函数之间必须用分号 `;` 隔开，否则可能导致解析错误。

### 2.2 函数参数

#### 动态参数 - arguments

```javascript
function sum() {
  let s = 0
  for(let i = 0; i < arguments.length; i++) {
    s += arguments[i]
  }
  console.log(s)
}

sum(5, 10)    // 15
sum(1, 2, 4)  // 7
```

**特点**：
- `arguments` 是一个**类数组（伪数组）**。
- 可动态获取函数调用时传入的所有实参。

#### 剩余参数 - ...

```javascript
const getSum = (...arr) => {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]
  }
  return sum
}

const result = getSum(2, 3, 4)
console.log(result) // 9
```

**优势**：由于箭头函数中没有 `arguments`，必须使用剩余参数获取实参。

### 2.3 this 指向

#### 普通函数的 this

```javascript
// 全局环境
console.log(this) // window

// 普通函数
function fn() {
  console.log(this) // window
}

// 对象方法
const obj = {
  name: 'andy',
  sayHi: function () {
    console.log(this) // obj
  }
}
obj.sayHi()
```

**规则**：**谁调用函数，`this` 就指向谁**。

#### 箭头函数的 this

```javascript
const obj = {
  uname: 'pink老师',
  sayHi: function () {
    console.log(this) // obj

    const count = () => {
      console.log(this) // obj（继承外层 sayHi 方法中的 this）
    }
    count()
  }
}
obj.sayHi()
```

**规则**：箭头函数没有自己的 `this`，它会**沿用外层作用域中的 `this`**。

**不推荐使用箭头函数的场景**：
1. DOM 事件回调函数（无法直接通过 `this` 指向绑定的 DOM 元素）
2. 对象方法
3. 原型方法

```javascript
// ❌ DOM 事件中使用箭头函数
btn.addEventListener('click', () => {
  console.log(this) // window，而非当前的 btn 元素
})

// ✅ 使用普通函数
btn.addEventListener('click', function() {
  console.log(this) // btn
})
```

#### 改变 this 指向

##### call() - 立即执行，参数列表传递

```javascript
function sayHi() {
  console.log(this)
}

let user = { name: '小明' }

// 调用函数并指定 this
sayHi.call(user) // this 指向 user

// 传递参数
function counter(x, y) {
  return x + y
}
let result = counter.call(null, 5, 10)
console.log(result) // 15
```

##### apply() - 立即执行，参数数组传递

```javascript
function counter(x, y) {
  return x + y
}

// 参数以数组形式传递
let result = counter.apply(null, [5, 10])
console.log(result) // 15
```

##### bind() - 返回新函数（不立即执行）

```javascript
function sayHi() {
  console.log(this)
}

let user = { name: '小明' }

// 创建绑定了 this 的新函数
let sayHello = sayHi.bind(user)
sayHello() // this 指向 user
```

**三者对比**：
- `call`：立即执行，参数通过列表一个个传递。
- `apply`：立即执行，参数打包在数组中传递。
- `bind`：不立即执行，返回一个绑定了指定 `this` 的新函数。

## 一、作用

`call `、`apply `、`bind `作用是改变函数执行时的上下文，简而言之就是改变函数运行时的`this`指向

那么什么情况下需要改变`this`的指向呢？下面举个例子

```js
var name = "lucy";
var obj = {
    name: "martin",
    say: function () {
        console.log(this.name);
    }
};
obj.say(); // martin，this 指向 obj 对象
setTimeout(obj.say,0); // lucy，this 指向 window 对象
```

从上面可以看到，正常情况`say`方法输出`martin`

但是我们把`say`放在`setTimeout`方法中，在定时器中是作为回调函数来执行的，因此回到主栈执行时是在全局执行上下文的环境中执行的，这时候`this`指向`window`，所以输出`lucy`

我们实际需要的是`this`指向`obj`对象，这时候就需要该改变`this`指向了

```js
setTimeout(obj.say.bind(obj),0); //martin，this指向obj对象
```

## 二、区别

下面再来看看`apply`、`call`、`bind`的使用

### apply

`apply`接受两个参数，第一个参数是`this`的指向，第二个参数是函数接受的参数，以数组的形式传入

改变`this`指向后原函数会立即执行，且此方法只是临时改变`this`指向一次

```js
function fn(...args){
    console.log(this,args);
}
let obj = {
    myname:"张三"
}

fn.apply(obj,[1,2]); // this会变成传入的obj，传入的参数必须是一个数组；
fn(1,2) // this指向window
```

当第一个参数为`null`、`undefined`的时候，默认指向`window`(在浏览器中)

```js
fn.apply(null,[1,2]); // this指向window
fn.apply(undefined,[1,2]); // this指向window
```

### call

`call`方法的第一个参数也是`this`的指向，后面传入的是一个参数列表

跟`apply`一样，改变`this`指向后原函数会立即执行，且此方法只是临时改变`this`指向一次

```js
function fn(...args){
    console.log(this,args);
}
let obj = {
    myname:"张三"
}

fn.call(obj,1,2); // this会变成传入的obj，传入的参数必须是一个数组；
fn(1,2) // this指向window
```

同样的，当第一个参数为`null`、`undefined`的时候，默认指向`window`(在浏览器中)

```js
fn.call(null,[1,2]); // this指向window
fn.call(undefined,[1,2]); // this指向window
```

### bind

bind方法和call很相似，第一参数也是`this`的指向，后面传入的也是一个参数列表(但是这个参数列表可以分多次传入)

改变`this`指向后不会立即执行，而是返回一个永久改变`this`指向的函数

```js
function fn(...args){
    console.log(this,args);
}
let obj = {
    myname:"张三"
}

const bindFn = fn.bind(obj); // this 也会变成传入的obj ，bind不是立即执行需要执行一次
bindFn(1,2) // this指向obj
fn(1,2) // this指向window
```

### 小结

从上面可以看到，`apply`、`call`、`bind`三者的区别在于：

- 三者都可以改变函数的`this`对象指向
- 三者第一个参数都是`this`要指向的对象，如果如果没有这个参数或参数为`undefined`或`null`，则默认指向全局`window`
- 三者都可以传参，但是`apply`是数组，而`call`是参数列表，且`apply`和`call`是一次性传入参数，而`bind`可以分为多次传入
- `bind `是返回绑定this之后的函数，`apply `、`call` 则是立即执行 

## 三、作用域与闭包

### 3.1 作用域类型

#### 全局作用域

在整个 script 标签中，或独立的 `.js` 外部文件中声明的变量。

#### 局部作用域

##### 函数作用域
```javascript
function fn() {
  let num = 10
  console.log(num)
}
// console.log(num) // 报错：num is not defined
```

##### 块作用域
```javascript
{
  let x = 1
  const y = 2
}
// console.log(x) // 报错

// var 声明的变量不产生块作用域
{
  var z = 3
}
console.log(z) // 3
```

**注意**：`let` 和 `const` 拥有块级作用域，而 `var` 没有。

### 3.2 闭包

**概念**：闭包 = 内层函数 + 外层函数的变量引用。

```javascript
function outer() {
  let count = 1

  function fn() {
    count++
    console.log(`函数被调用${count}次`)
  }

  return fn
}

const re = outer()
re() // 函数被调用2次
re() // 函数被调用3次
```

**闭包的作用**：
1. 封闭数据，实现私有变量。
2. 外部可以间接访问函数内部的变量。
3. 延长变量的生命周期（变量不会在函数执行完毕后被立即回收）。

**闭包的潜在问题**：
- 若使用不当，可能导致**内存泄漏**（因为相关变量常驻内存，无法被垃圾回收机制自动回收）。

---

## 四、对象与构造函数

### 4.1 对象基础

```javascript
let person = {
  name: '小红',
  age: 18,
  singing: function () {
    console.log('唱歌...')
  },
  run: function () {
    console.log('跑步...')
  }
}

person.singing()
```

### 4.2 构造函数

```javascript
function Person(name, age) {
  this.name = name
  this.age = age
}

const p1 = new Person('小明', 18)
const p2 = new Person('小红', 20)
```

**特点**：
1. 必须使用 `new` 关键字调用。
2. 命名习惯首字母大写。
3. 内部不需要写 `return`，默认返回创建的实例对象。
4. 若实例化时没有参数，可以省略括号 `()`。

### 4.3 原型与原型链

```javascript
function Person() {}

// 在原型对象上挂载公共方法，节省内存空间
Person.prototype.walk = function() {
  console.log('人都要走路...')
}

const p1 = new Person()
p1.walk()
```

#### 原型链查找机制

1. 访问对象属性或方法时，首先在对象**自身属性**中查找。
2. 若未找到，则沿着 `__proto__` 属性去查找创建它的**原型对象**。
3. 若仍未找到，继续通过原型的 `__proto__` 向上查找，直到 `Object.prototype`。
4. 最终查找到最顶层 `null`，仍找不到则返回 `undefined`。

#### instanceof 运算符

用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上：

```javascript
function Person() {}
const p = new Person()

console.log(p instanceof Person) // true
console.log(p instanceof Object) // true
console.log([] instanceof Array) // true
```

---

## 五、异步编程与事件循环

### 5.1 同步 vs 异步

- **同步（Synchronous）**：代码按照编写的顺序依次执行。上一行代码没有执行完，后续的代码就必须处于等待状态（会产生**阻塞**）。
- **异步（Asynchronous）**：不等待当前的异步任务完成，而是立即继续执行后面的代码。当异步任务完成后，通过**回调函数**或**事件机制**处理其结果（**非阻塞**）。

### 5.2 事件循环机制（Event Loop）

JavaScript 是一门**单线程**语言，为了在不阻塞主线程的情况下处理网络请求、定时器等任务，它通过**事件循环机制**来实现异步。

#### 核心模块组成

*   **调用栈（Call Stack）**：执行同步代码，代码执行完毕后出栈。
*   **微任务队列（Microtask Queue）**：存放高优先级的异步回调。主要包括：
    *   `Promise.then` / `catch` / `finally`
    *   `queueMicrotask()`
    *   `MutationObserver`
*   **宏任务队列（Macrotask Queue / Callback Queue）**：存放常规的异步任务回调。主要包括：
    *   `setTimeout` / `setInterval`
    *   `I/O` 操作
    *   `UI 渲染`

#### 执行顺序规则

1. 执行调用栈中的**同步代码**（这本身是第一个宏任务）。
2. 执行过程中，如果遇到异步任务，将其分发给对应的微任务/宏任务队列。
3. 同步代码执行完毕，调用栈清空。
4. **清空微任务队列**：将微任务队列中所有的微任务依次取出执行，直到该队列为空。
5. 取出**一个**宏任务执行，执行完毕后，再次**清空所有的微任务**。
6. 重复步骤 5-6 的循环过程（微任务优先级始终高于下一个宏任务）。

---

### 5.3 Promise 详解

#### 1. 什么是 Promise
Promise 是 JavaScript 中处理异步操作的对象，代表一个在未来才会完成的操作结果。它提供了统一的接口，使异步链式调用成为可能。

#### 2. Promise 的三种状态
- `pending`（进行中）：初始状态，既没有被兑现，也没有被拒绝。
- `fulfilled`（已成功）：意味着操作成功完成，返回结果。
- `rejected`（已失败）：意味着操作失败，返回错误原因。

**状态转换规则**：状态只能从 `pending` 变为 `fulfilled`，或者从 `pending` 变为 `rejected`。一旦状态改变，就会**永久保持**该结果，无法二次更改。

#### 3. 创建与消费 Promise

```javascript
/**
 * 示例：创建一个加载图片的 Promise 实例
 * @param {string} src - 资源地址
 * @returns {Promise<HTMLImageElement>} 返回加载的图片元素
 */
function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
    
        // 成功回调：执行 resolve 并传递数据
        img.onload = () => resolve(img);
    
        // 失败回调：执行 reject 并传递错误对象
        img.onerror = () => reject(new Error(`加载失败: ${src}`));
    
        // 触发加载（必须在设置监听器之后）
        img.src = src;
    });
}
```

```javascript
// 消费 Promise 方式1: .then/.catch 链式调用
loadImg('image.jpg')
    .then(img => {
        console.log('成功', img.width);
        return img; // 传递给下一个 .then
    })
    .catch(err => {
        console.error('失败', err);
    });

// 消费 Promise 方式2: async/await 优雅消费
async function load() {
    try {
        const img = await loadImg('image.jpg');
        console.log('成功', img.width);
    } catch (err) {
        console.error('失败', err);
    }
}
```

#### 4. 核心静态方法与链式调用

##### 链式调用（串行）
```javascript
/**
 * 串行加载多张图片：每张图片依次加载，前一张完成后才加载下一张
 */
loadImg('img1.jpg')
    .then(img1 => {
        document.body.appendChild(img1);
        // 返回一个全新的 Promise 会让链条等待其状态改变
        return loadImg('img2.jpg');
    })
    .then(img2 => {
        document.body.appendChild(img2);
        // 返回普通值会立即被包装成成功的 Promise，并传递给下一个 .then
        return 'done';
    })
    .then(result => {
        console.log(result); // 输出: 'done'
    })
    .catch(err => {
        // 捕获链条中任何一个环节发生的错误
        console.error(err);
    });
```

##### Promise.all() — 并行等待全部完成
```javascript
/**
 * 并行加载多张图片，全部成功才算成功，任意一张失败则立即失败
 */
const urls = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
const promises = urls.map(url => loadImg(url));

Promise.all(promises)
    .then(images => {
        // images 是按顺序对应的结果数组 [img1, img2, img3]
        images.forEach(img => document.body.appendChild(img));
    })
    .catch(err => {
        // 捕获到第一个失败的错误
        console.error('有图片加载失败', err);
    });
```

##### Promise.race() — 竞速，取最快的结果
```javascript
/**
 * 哪张图片先加载完，就采用哪张，后续的其他加载结果会被忽略
 */
Promise.race([
    loadImg('fast.jpg'),
    loadImg('slow.jpg')
])
.then(fastestImg => {
    console.log('最快加载完的图片是：', fastestImg);
});
```

##### Promise.allSettled() — 等待全部完成，不论成功失败
```javascript
/**
 * 获取所有图片的最终状态，适用于相互独立、需要得知每个具体结果的场景
 */
Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`图片 ${index} 加载成功:`, result.value);
            } else {
                console.log(`图片 ${index} 加载失败:`, result.reason);
            }
        });
    });
```

---

### 5.4 async / await 模式

#### 1. 什么是 async/await
`async/await` 是 ES2017 引入的语法糖，它基于 Promise 封装，能够**让异步代码的结构和阅读体验变得像同步代码一样**，彻底摆脱 Promise 的链式回调。

#### 2. 核心特性
- **`async` 关键字**：用于声明异步函数。`async` 函数**自动返回一个 Promise 对象**。若函数内部返回一个普通值，会被包装为 `Promise.resolve(值)`。
- **`await` 关键字**：**只能在 `async` 函数内部使用**。它会暂停 `async` 函数的执行，等待右侧的 Promise 解析完成，并将 `resolve` 的结果作为返回值返回。
- **微任务性质**：`await` 之后的后续代码，会被引擎自动包装在类似于 `Promise.then` 的回调（微任务）中执行。
- **错误捕获**：可以直接使用标准的 `try...catch` 结构进行同步和异步错误的统一捕获。

#### 3. 实际开发场景应用

##### Fetch 接口请求
```javascript
/**
 * 获取用户数据并转换为 JSON
 */
async function fetchData() {
    try {
        const response = await fetch('/api/data')
        const data = await response.json() // 暂停等待 JSON 转换完成
        return data
    } catch (error) {
        console.error('网络请求或解析失败:', error)
    }
}
```

##### Promise 链式 vs async/await 对比
```javascript
// Promise 链式写法
fetch('/api/user')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))

// async/await 对应写法
async function getUser() {
    try {
        const res = await fetch('/api/user')
        const data = await res.json()
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}
```

---

## 六、字符串方法

### 6.1 查找和截取

#### charAt() - 获取指定索引字符

```javascript
const str = "Hello World"
const firstChar = str.charAt(0)
console.log(firstChar) // "H"
```

#### substring() - 截取字符串

```javascript
const str = "Hello World"
const result = str.substring(0, 5) // [0, 5) 包含头不包含尾
console.log(result) // "Hello"
```

#### substr() - 从指定位置截取指定长度

```javascript
const str = "Mozilla"
console.log(str.substr(1, 2))  // "oz"
console.log(str.substr(-3))    // "lla"（倒数第3个开始，截取到末尾）
```

**注意**：`substr()` 已被遗弃（Deprecated），建议使用标准的 `substring()` 或 `slice()` 代替。

### 6.2 分割和拼接

#### split() - 分割字符串为数组

```javascript
const search = "order_no=20251129"
const arr = search.split('order_no=')
console.log(arr) // ["", "20251129"]

const value = arr[1] // "20251129"
```

### 6.3 替换和判断

#### replace() - 替换内容

```javascript
const str = "Hello World"

// 1. 默认替换第一个匹配项
const result = str.replace('o', '0')
console.log(result) // "Hell0 World"

// 2. 使用正则表达式全局替换
const result2 = str.replace(/o/g, '0')
console.log(result2) // "Hell0 W0rld"
```

#### endsWith() - 判断是否以指定内容结尾

```javascript
const str = "Hello world"
console.log(str.endsWith("world")) // true
console.log(str.endsWith("Hello")) // false
```

### 6.4 格式化

#### padStart() / padEnd() - 开头或结尾填充字符至指定长度

```javascript
const num = '5'
const padded = num.padStart(2, '0')
console.log(padded) // '05'

// 常用于日期格式化补零
const month = String(new Date().getMonth() + 1).padStart(2, '0')
console.log(month) // '01' ~ '12'
```

### 6.5 编码转换

#### String.fromCharCode() - 编码值转为字符

```javascript
console.log(String.fromCharCode(65, 66, 67)) // 'ABC'
```

### 6.5  字符串转小写
```javascript
let os_name = _this.system_info.osName.toLowerCase();
```
---

## 七、深浅拷贝

### 7.1 浅拷贝

**特点**：只拷贝对象的第一层。如果属性值是基本类型，拷贝的是值；如果属性值是引用类型（对象或数组），拷贝的是内存地址，修改新对象会影响原对象。

#### 拷贝对象
```javascript
const obj = { name: 'Tom', age: 18 }

// 方法1：Object.assign()
const newObj1 = Object.assign({}, obj)

const obj1 = { a: 1, b: 2 }
const obj2 = { b: 3, c: 4 }
// 将 obj1 与 obj2 合并到新对象中（同名属性会被后边的覆盖）
const result = Object.assign({}, obj1, obj2)
console.log(result) // { a: 1, b: 3, c: 4 }

// 方法2：展开运算符
const newObj2 = { ...obj }

const a = [1, 2];
const b = [3, 4];
const combined = [...a, ...b]; // [1, 2, 3, 4]
```

#### 拷贝数组
```javascript
const arr = [1, 2, 3]

// 方法1：concat()
const newArr1 = [].concat(arr)

// 方法2：展开运算符
const newArr2 = [...arr]

// 方法3：slice()
const newArr3 = arr.slice()
```

### 7.2 深拷贝

**特点**：不论有多少个层级，递归拷贝所有属性。新老对象在内存上完全独立，互不影响。

#### 方法1：递归手动实现
```javascript
function deepCopy(newObj, oldObj) {
  for (let k in oldObj) {
    // 1. 优先处理数组（Array 也是 Object，需先判断）
    if (oldObj[k] instanceof Array) {
      newObj[k] = []
      deepCopy(newObj[k], oldObj[k])
    } 
    // 2. 处理对象
    else if (oldObj[k] instanceof Object) {
      newObj[k] = {}
      deepCopy(newObj[k], oldObj[k])
    } 
    // 3. 基本类型直接赋值
    else {
      newObj[k] = oldObj[k]
    }
  }
}

const obj = {
  name: 'pink',
  hobby: ['乒乓球', '足球'],
  family: { baby: '小pink' }
}

const o = {}
deepCopy(o, obj)
```

#### 方法2：lodash 工具库的 `_.cloneDeep`
```javascript
// 需要提前引入 lodash.js 库
const obj = {
  name: 'pink',
  hobby: ['乒乓球', '足球']
}

const o = _.cloneDeep(obj)
```

#### 方法3：JSON 序列化方式
```javascript
const obj = {
  name: 'pink',
  hobby: ['乒乓球', '足球']
}

const o = JSON.parse(JSON.stringify(obj))
```

**JSON 深拷贝的局限性**：
- 无法处理函数、`undefined`、`Symbol` 以及 `RegExp` 等特殊类型。在转换时，它们会被直接忽略或转为 `null`。

---

## 八、异常处理

### 8.1 throw - 抛出自定义异常

```javascript
function counter(x, y) {
  if(!x || !y) {
    // 抛出错误对象并会终止代码向下执行
    throw new Error('参数不能为空!')
  }
  return x + y
}

counter() 
```

### 8.2 try...catch - 捕获异常

```javascript
function foo() {
  try {
    // try 块中放置可能产生报错的代码
    const p = document.querySelector('.p')
    p.style.color = 'red'
  } catch (error) {
    // 捕获并输出错误信息，程序不会因此中断
    console.log(error.message)
    return
  } finally {
    // 无论 try/catch 结果如何，finally 块中的内容必定会执行
    console.log('无论是否出错都会执行')
  }

  console.log('如果前面 catch 执行并 return 了，这句不会执行')
}

foo()
```

### 8.3 debugger - 断点调试

```javascript
function test() {
  debugger // 浏览器控制台开启时，代码运行至此会自动暂停，进入调试模式
  console.log('继续执行')
}
```

---

## 九、防抖和节流

### 9.1 防抖 (debounce)

**概念**：触发高频事件后，在 $n$ 秒内函数只执行一次；如果 $n$ 秒内该高频事件再次被触发，则重新开始计时。

**应用场景**：搜索框输入查询（减少接口请求）、窗口大小调整（`resize` 触发逻辑）。

```javascript
function debounce(fn, delay) {
  let timer = null

  return function() {
    // 清除上一次的定时器，重新开始计时
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

// 示例应用
const handleInput = debounce(function() {
  console.log('发送搜索请求:', this.value)
}, 500)

input.addEventListener('input', handleInput)
```

### 9.2 节流 (throttle)

**概念**：高频事件触发，但在指定的 $n$ 秒内只有第一次触发能执行，起到稀释执行频率的作用。

**应用场景**：页面滚动监听（`scroll`）、抢购按钮点击（防连续暴击）、视频播放进度更新。

```javascript
function throttle(fn, delay) {
  let timer = null

  return function() {
    // 如果定时器已存在，则静默拒绝，直到定时器走完
    if (timer) return

    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null // 释放定时器引用，准备下一次执行
    }, delay)
  }
}

// 示例应用
const handleScroll = throttle(function() {
  console.log('触发滚动事件逻辑处理')
}, 200)

window.addEventListener('scroll', handleScroll)
```

---

## 十、其他重要知识点

### 10.1 可选链操作符 (?.)

```javascript
const user = { profile: { name: 'Alice' } }

// 1. 安全访问深层嵌套属性，不会因为中间节点缺失而导致报错中止
const zipCode = user.address?.zipCode
console.log(zipCode) // undefined (正常输出，不报错)

// 2. 安全调用可能未定义的方法
const result = obj.method?.()
```

### 10.2 数据类型转换与安全防护

#### parseInt() / isNaN()
```javascript
const pageParam = '10'
const page = parseInt(pageParam)

// 如果转换结果是无效数字 (NaN)，则降级采用默认值 1
const currentPage = isNaN(page) ? 1 : page
```

#### JSON 格式转换
```javascript
// 对象转为 JSON 字符串
const obj = { name: 'Tom', age: 18 }
const json = JSON.stringify(obj)
console.log(json) // '{"name":"Tom","age":18}'

// JSON 字符串还原为对象
const newObj = JSON.parse(json)
console.log(newObj) // { name: 'Tom', age: 18 }
```

### 10.4 日期处理 (Date)

```javascript
const now = new Date()

// 获取年月日
const year = now.getFullYear()
const month = now.getMonth() + 1  // 月份区间是 0~11，所以要加 1
const day = now.getDate()

// 获取时分秒
const hours = now.getHours()
const minutes = now.getMinutes()
const seconds = now.getSeconds()

// 获取当前时间戳
const timestamp = Date.now()
```

---

## 其他

### **解构赋值交换变量** - ES6交换写法
```js

// 不借助中间变量交换两个值
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// 数组元素交换
[arr[i], arr[j]] = [arr[j], arr[i]];
```

### **图片懒加载** - 滚动到可视区再加载图片以提升首屏性能

```js
// 1. HTML中将真实图片路径存放在 data-src 自定义属性中，src 属性留空或给一个占位图
// <img src="" data-src="./imgs/06.jpg">

// 2. JS中判定图片是否进入可视区，并将 data-src 赋值给 src
function lazyLoad() {
    // 获取屏幕可视窗口高度
    var windowH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var aImg = document.querySelectorAll('img');
    
    for (var i = 0; i < aImg.length; i++) {
        // getBoundingClientRect().top/bottom 获取元素到浏览器窗口边缘的距离
        var clientT = aImg[i].getBoundingClientRect().top;
        var clientB = aImg[i].getBoundingClientRect().bottom;
        
        // 判断图片的上边缘或下边缘是否在屏幕可视窗口范围内
        if ((clientT > 0 && clientT < windowH) || (clientB > 0 && clientB < windowH)) {
            aImg[i].src = aImg[i].dataset.src; // 替换真实的src路径
        }
    }
}

// 3. 页面加载、窗口缩放、页面滚动时触发懒加载检测
window.onload = window.onresize = window.onscroll = lazyLoad;

```


## `[idx]` 的作用：计算属性名

```javascript
const idx = 2;
const val = "用户输入的内容";

// ❌ 不加方括号
const obj1 = { idx: val };
// 结果：{ idx: "用户输入的内容" }
// 属性名是字面量字符串 "idx"

// ✅ 加方括号
const obj2 = { [idx]: val };
// 结果：{ 2: "用户输入的内容" }
// 属性名是变量 idx 的值（数字 2）
```


# ：ajax原理是什么？如何实现？

## 一、是什么

`AJAX `全称(Async Javascript and XML)

即异步的` JavaScript` 和` XML`，是一种创建交互式网页应用的网页开发技术，可以在不重新加载整个网页的情况下，与服务器交换数据，并且更新部分网页

`Ajax`的原理简单来说通过`XmlHttpRequest`对象来向服务器发异步请求，从服务器获得数据，然后用`JavaScript`来操作`DOM`而更新页面

下面举个例子：

领导想找小李汇报一下工作，就委托秘书去叫小李，自己就接着做其他事情，直到秘书告诉他小李已经到了，最后小李跟领导汇报工作

`Ajax`请求数据流程与“领导想找小李汇报一下工作”类似，上述秘书就相当于`XMLHttpRequest`对象，领导相当于浏览器，响应数据相当于小李

浏览器可以发送`HTTP`请求后，接着做其他事情，等收到`XHR`返回来的数据再进行操作

## 二、实现过程

实现 `Ajax `异步交互需要服务器逻辑进行配合，需要完成以下步骤：

- 创建 `Ajax `的核心对象 `XMLHttpRequest `对象

- 通过 `XMLHttpRequest` 对象的 `open()` 方法与服务端建立连接

- 构建请求所需的数据内容，并通过` XMLHttpRequest` 对象的 `send()` 方法发送给服务器端

- 通过 `XMLHttpRequest` 对象提供的 `onreadystatechange` 事件监听服务器端你的通信状态

- 接受并处理服务端向客户端响应的数据结果

- 将处理结果更新到 `HTML `页面中

### 创建XMLHttpRequest对象

通过`XMLHttpRequest()` 构造函数用于初始化一个 `XMLHttpRequest` 实例对象

```js
const xhr = new XMLHttpRequest();
```

### 与服务器建立连接

通过 `XMLHttpRequest` 对象的 `open()` 方法与服务器建立连接

```js
xhr.open(method, url, [async][, user][, password])
```

参数说明：
- `method`：表示当前的请求方式，常见的有`GET`、`POST`
- `url`：服务端地址
- `async`：布尔值，表示是否异步执行操作，默认为`true`
-  `user`: 可选的用户名用于认证用途；默认为`null
- `password`: 可选的密码用于认证用途，默认为`null

### 给服务端发送数据

通过 `XMLHttpRequest` 对象的 `send()` 方法，将客户端页面的数据发送给服务端

```js
xhr.send([body])
```

`body`: 在 `XHR` 请求中要发送的数据体，如果不传递数据则为 `null`
如果使用`GET`请求发送数据的时候，需要注意如下：

- 将请求数据添加到`open()`方法中的`url`地址中
- 发送请求数据中的`send()`方法中参数设置为`null`

### 绑定onreadystatechange事件

`onreadystatechange` 事件用于监听服务器端的通信状态，主要监听的属性为`XMLHttpRequest.readyState` ,

关于`XMLHttpRequest.readyState`属性有五个状态，如下图显示

只要 `readyState `属性值一变化，就会触发一次 `readystatechange` 事件

`XMLHttpRequest.responseText`属性用于接收服务器端的响应结果

举个例子：

```js
const request = new XMLHttpRequest()
request.onreadystatechange = function(e){
    if(request.readyState === 4){ // 整个请求过程完毕
        if(request.status >= 200 && request.status <= 300){
            console.log(request.responseText) // 服务端返回的结果
        }else if(request.status >=400){
            console.log("错误信息：" + request.status)
        }
    }
}
request.open('POST','http://xxxx')
request.send()
```

## 三、封装

通过上面对`XMLHttpRequest `对象的了解，下面来封装一个简单的`ajax`请求

```js
//封装一个ajax请求
function ajax(options) {
    //创建XMLHttpRequest对象
    const xhr = new XMLHttpRequest()


    //初始化参数的内容
    options = options || {}
    options.type = (options.type || 'GET').toUpperCase()
    options.dataType = options.dataType || 'json'
    const params = options.data

    //发送请求
    if (options.type === 'GET') {
        xhr.open('GET', options.url + '?' + params, true)
        xhr.send(null)
    } else if (options.type === 'POST') {
        xhr.open('POST', options.url, true)
        xhr.send(params)

    //接收请求
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let status = xhr.status
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML)
            } else {
                options.fail && options.fail(status)
            }
        }
    }
}
```

使用方式如下

```js
ajax({
    type: 'post',
    dataType: 'json',
    data: {},
    url: 'https://xxxx',
    success: function(text,xml){//请求成功后的回调函数
        console.log(text)
    },
    fail: function(status){////请求失败后的回调函数
        console.log(status)
    }
})
```

### 简单题
1. **题目：什么是 AJAX？它的全称是什么？**
   * **答案：** AJAX 全称是 Async Javascript and XML（异步的 JavaScript 和 XML）。它是一种在不重新加载整个网页的情况下，与服务器交换数据并更新部分网页的技术。

2. **题目：AJAX 的核心原理是什么？**
   * **答案：** 通过 `XMLHttpRequest` 对象向服务器发送异步请求，从服务器获得数据，然后使用 JavaScript 操作 DOM 更新页面。

3. **题目：在 XMLHttpRequest 中，用于建立与服务器连接的方法是什么？**
   * **答案：** 是 `open()` 方法。

4. **题目：如何监听服务器端的通信状态变化？**
   * **答案：** 通过绑定 `XMLHttpRequest` 对象的 `onreadystatechange` 事件。

5. **题目：在发送 AJAX 请求时，如何区分 GET 和 POST 请求中发送数据的方式？**
   * **答案：** GET 请求通常将数据添加到 `open()` 的 URL 地址中，并调用 `send(null)`；POST 请求则将数据通过 `send()` 方法的参数发送。

### 中等题
1. **题目：`XMLHttpRequest.readyState` 属性的五个状态分别代表什么？其中哪一个状态代表请求完成？**
   * **答案：** 0（未初始化）、1（open 方法已调用）、2（发送请求，接收到 header）、3（正在接收响应数据）、4（请求完成）。状态 4 代表整个请求过程完毕。

2. **题目：简述 AJAX 异步交互的基本步骤。**
   * **答案：**
     1. 创建 `XMLHttpRequest` 核心对象。
     2. 使用 `open()` 方法与服务器建立连接。
     3. 构建请求内容，并通过 `send()` 方法发送。
     4. 绑定 `onreadystatechange` 事件监听通信状态。
     5. 接收并处理服务器响应结果，最后更新 HTML 页面。


# ：大文件上传如何做断点续传？

## 一、是什么

不管怎样简单的需求，在量级达到一定层次时，都会变得异常复杂

文件上传简单，文件变大就复杂

上传大文件时，以下几个变量会影响我们的用户体验

- 服务器处理数据的能力
- 请求超时
- 网络波动

上传时间会变长，高频次文件上传失败，失败后又需要重新上传等等

为了解决上述问题，我们需要对大文件上传单独处理

这里涉及到分片上传及断点续传两个概念

#### 分片上传

分片上传，就是将所要上传的文件，按照一定的大小，将整个文件分隔成多个数据块（Part）来进行分片上传

上传完之后再由服务端对所有上传的文件进行汇总整合成原始的文件

大致流程如下：
1. 将需要上传的文件按照一定的分割规则，分割成相同大小的数据块；
2. 初始化一个分片上传任务，返回本次分片上传唯一标识；
3. 按照一定的策略（串行或并行）发送各个分片数据块；
4. 发送完成后，服务端根据判断数据上传是否完整，如果完整，则进行数据块合成得到原始文件

#### 断点续传
断点续传指的是在下载或上传时，将下载或上传任务人为的划分为几个部分

每一个部分采用一个线程进行上传或下载，如果碰到网络故障，可以从已经上传或下载的部分开始继续上传下载未完成的部分，而没有必要从头开始上传下载。用户可以节省时间，提高速度

一般实现方式有两种：

- 服务器端返回，告知从哪开始
- 浏览器端自行处理

上传过程中将文件在服务器写为临时文件，等全部写完了（文件上传完），将此临时文件重命名为正式文件即可

如果中途上传中断过，下次上传的时候根据当前临时文件大小，作为在客户端读取文件的偏移量，从此位置继续读取文件数据块，上传到服务器从此偏移量继续写入文件即可

## 二、实现思路

整体思路比较简单，拿到文件，保存文件唯一性标识，切割文件，分段上传，每次上传一段，根据唯一性标识判断文件上传进度，直到文件的全部片段上传完毕

下面的内容都是伪代码

读取文件内容：

```js
const input = document.querySelector('input');
input.addEventListener('change', function() {
    var file = this.files[0];
});
```

可以使用`md5`实现文件的唯一性

```js
const md5code = md5(file);
```

然后开始对文件进行分割

```js
var reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.addEventListener("load", function(e) {
    //每10M切割一段,这里只做一个切割演示，实际切割需要循环切割，
    var slice = e.target.result.slice(0, 10*1024*1024);
});
```

h5上传一个（一片）

```js
const formdata = new FormData();
formdata.append('0', slice);
//这里是有一个坑的，部分设备无法获取文件名称，和文件类型，这个在最后给出解决方案
formdata.append('filename', file.filename);
var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function() {
    //xhr.responseText
});
xhr.open('POST', '');
xhr.send(formdata);
xhr.addEventListener('progress', updateProgress);
xhr.upload.addEventListener('progress', updateProgress);

function updateProgress(event) {
    if (event.lengthComputable) {
        //进度条
    }
}
```

这里给出常见的图片和视频的文件类型判断

```js
function checkFileType(type, file, back) {
/**
* type png jpg mp4 ...
* file input.change=> this.files[0]
* back callback(boolean)
*/
    var args = arguments;
    if (args.length != 3) {
        back(0);
    }
    var type = args[0]; // type = '(png|jpg)' , 'png'
    var file = args[1];
    var back = typeof args[2] == 'function' ? args[2] : function() {};
    if (file.type == '') {
        // 如果系统无法获取文件类型，则读取二进制流，对二进制进行解析文件类型
        var imgType = [
            'ff d8 ff', //jpg
            '89 50 4e', //png

            '0 0 0 14 66 74 79 70 69 73 6F 6D', //mp4
            '0 0 0 18 66 74 79 70 33 67 70 35', //mp4
            '0 0 0 0 66 74 79 70 33 67 70 35', //mp4
            '0 0 0 0 66 74 79 70 4D 53 4E 56', //mp4
            '0 0 0 0 66 74 79 70 69 73 6F 6D', //mp4

            '0 0 0 18 66 74 79 70 6D 70 34 32', //m4v
            '0 0 0 0 66 74 79 70 6D 70 34 32', //m4v

            '0 0 0 14 66 74 79 70 71 74 20 20', //mov
            '0 0 0 0 66 74 79 70 71 74 20 20', //mov
            '0 0 0 0 6D 6F 6F 76', //mov

            '4F 67 67 53 0 02', //ogg
            '1A 45 DF A3', //ogg

            '52 49 46 46 x x x x 41 56 49 20', //avi (RIFF fileSize fileType LIST)(52 49 46 46,DC 6C 57 09,41 56 49 20,4C 49 53 54)
        ];
        var typeName = [
            'jpg',
            'png',
            'mp4',
            'mp4',
            'mp4',
            'mp4',
            'mp4',
            'm4v',
            'm4v',
            'mov',
            'mov',
            'mov',
            'ogg',
            'ogg',
            'avi',
        ];
        var sliceSize = /png|jpg|jpeg/.test(type) ? 3 : 12;
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.addEventListener("load", function(e) {
            var slice = e.target.result.slice(0, sliceSize);
            reader = null;
            if (slice && slice.byteLength == sliceSize) {
                var view = new Uint8Array(slice);
                var arr = [];
                view.forEach(function(v) {
                    arr.push(v.toString(16));
                });
                view = null;
                var idx = arr.join(' ').indexOf(imgType);
                if (idx > -1) {
                    back(typeName[idx]);
                } else {
                    arr = arr.map(function(v) {
                        if (i > 3 && i < 8) {
                            return 'x';
                        }
                        return v;
                    });
                    var idx = arr.join(' ').indexOf(imgType);
                    if (idx > -1) {
                        back(typeName[idx]);
                    } else {
                        back(false);
                    }

                }
            } else {
                back(false);
            }

        });
    } else {
        var type = file.name.match(/\.(\w+)$/)[1];
        back(type);
    }
}
```

调用方法如下

```js
checkFileType('(mov|mp4|avi)',file,function(fileType){
    // fileType = mp4,
    // 如果file的类型不在枚举之列，则返回false
});
```

上面上传文件的一步，可以改成：

```js
formdata.append('filename', md5code+'.'+fileType);
```

有了切割上传后，也就有了文件唯一标识信息，断点续传变成了后台的一个小小的逻辑判断

后端主要做的内容为：根据前端传给后台的`md5`值，到服务器磁盘查找是否有之前未完成的文件合并信息（也就是未完成的半成品文件切片），取到之后根据上传切片的数量，返回数据告诉前端开始从第几节上传

如果想要暂停切片的上传，可以使用`XMLHttpRequest `的 `abort `方法


## 三、使用场景

- 大文件加速上传：当文件大小超过预期大小时，使用分片上传可实现并行上传多个 Part， 以加快上传速度
- 网络环境较差：建议使用分片上传。当出现上传失败的时候，仅需重传失败的Part
- 流式上传：可以在需要上传的文件大小还不确定的情况下开始上传。这种场景在视频监控等行业应用中比较常见

## 小结
当前的伪代码，只是提供一个简单的思路，想要把事情做到极致，我们还需要考虑到更多场景，比如

- 切片上传失败怎么办
- 上传过程中刷新页面怎么办
- 如何进行并行上传
- 切片什么时候按数量切，什么时候按大小切
- 如何结合 Web Worker 处理大文件上传
- 如何实现秒传



# ：typeof 与 instanceof 区别
## 一、typeof

`typeof` 操作符返回一个字符串，表示未经计算的操作数的类型

使用方法如下：

```js
typeof operand
typeof(operand)
```

`operand`表示对象或原始值的表达式，其类型将被返回

举个例子

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof null // 'object'
typeof [] // 'object'
typeof {} // 'object'
typeof console // 'object'
typeof console.log // 'function'
```

从上面例子，前6个都是基础数据类型。虽然`typeof null`为`object`，但这只是` JavaScript` 存在的一个悠久 `Bug`，不代表`null `就是引用数据类型，并且`null `本身也不是对象

所以，`null `在 `typeof `之后返回的是有问题的结果，不能作为判断` null `的方法。如果你需要在 `if` 语句中判断是否为 `null`，直接通过`===null`来判断就好

同时，可以发现引用类型数据，用`typeof`来判断的话，除了`function`会被识别出来之外，其余的都输出`object`

如果我们想要判断一个变量是否存在，可以使用`typeof`：(不能使用`if(a)`， 若`a`未声明，则报错)

```js
if(typeof a != 'undefined'){
    //变量存在
}
```

## 二、instanceof

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

使用如下：

```js
object instanceof constructor
```

`object`为实例对象，`constructor`为构造函数

构造函数通过`new`可以实例对象，`instanceof `能判断这个对象是否是之前那个构造函数生成的对象

```js
// 定义构建函数
let Car = function() {}
let benz = new Car()
benz instanceof Car // true
let car = new String('xxx')
car instanceof String // true
let str = 'xxx'
str instanceof String // false
```


## 三、区别

`typeof`与`instanceof`都是判断数据类型的方法，区别如下：

- `typeof`会返回一个变量的基本类型，`instanceof`返回的是一个布尔值

- `instanceof` 可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型
- 而` typeof` 也存在弊端，它虽然可以判断基础数据类型（`null` 除外），但是引用数据类型中，除了` function` 类型以外，其他的也无法判断

可以看到，上述两种方法都有弊端，并不能满足所有场景的需求

如果需要通用检测数据类型，可以采用`Object.prototype.toString`，调用该方法，统一返回格式`“[object Xxx]” `的字符串

如下

```js
Object.prototype.toString({})       // "[object Object]"
Object.prototype.toString.call({})  // 同上结果，加上call也ok
Object.prototype.toString.call(1)    // "[object Number]"
Object.prototype.toString.call('1')  // "[object String]"
Object.prototype.toString.call(true)  // "[object Boolean]"
Object.prototype.toString.call(function(){})  // "[object Function]"
Object.prototype.toString.call(null)   //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(/123/g)    //"[object RegExp]"
Object.prototype.toString.call(new Date()) //"[object Date]"
Object.prototype.toString.call([])       //"[object Array]"
Object.prototype.toString.call(document)  //"[object HTMLDocument]"
Object.prototype.toString.call(window)   //"[object Window]"
```

了解了`toString`的基本用法，下面就实现一个全局通用的数据类型判断方法

```js
function getType(obj){
  let type  = typeof obj;
  if (type !== "object") {    // 先进行typeof判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1'); 
}
```

使用如下

```js
getType([])     // "Array" typeof []是object，因此toString返回
getType('123')  // "string" typeof 直接返回
getType(window) // "Window" toString返回
getType(null)   // "Null"首字母大写，typeof null是object，需toString来判断
getType(undefined)   // "undefined" typeof 直接返回
getType()            // "undefined" typeof 直接返回
getType(function(){}) // "function" typeof能判断，因此首字母小写
getType(/123/g)      //"RegExp" toString返回
```



