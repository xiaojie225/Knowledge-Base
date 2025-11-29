# JavaScript 数组操作精华手册

## 日常学习模式

### [标签: JavaScript 数组方法 - 纯函数与副作用]

#### 核心概念

**纯函数 vs 非纯函数（Mutating Methods）**
- **纯函数**：不改变原数组，返回新数组（无副作用）
- **非纯函数**：直接修改原数组（有副作用）
- **重要性**：现代框架（React/Vue）推荐使用纯函数，遵循不可变性原则，使状态变更可预测、易调试

---

## 一、非纯函数（会改变原数组）

### 1. **push()** - 尾部添加
```javascript
// 在数组末尾添加元素，返回新长度
const arr = [1, 2, 3];
const len = arr.push(4, 5); // 返回 5
console.log(arr); // [1, 2, 3, 4, 5]
```

### 2. **pop()** - 尾部删除
```javascript
// 删除并返回数组最后一个元素
const arr = [1, 2, 3];
const last = arr.pop(); // 返回 3
console.log(arr); // [1, 2]
```

### 3. **unshift()** - 头部添加
```javascript
// 在数组开头添加元素，返回新长度
const arr = [3, 4];
const len = arr.unshift(1, 2); // 返回 4
console.log(arr); // [1, 2, 3, 4]
```

### 4. **shift()** - 头部删除
```javascript
// 删除并返回数组第一个元素
const arr = [1, 2, 3];
const first = arr.shift(); // 返回 1
console.log(arr); // [2, 3]
```

### 5. **splice()** - 万能修改器
```javascript
// 在任意位置增删改元素
// 语法：splice(start, deleteCount, item1, item2, ...)
const arr = [1, 2, 3, 4, 5];
const deleted = arr.splice(2, 2, 'a', 'b'); // 返回 [3, 4]
console.log(arr); // [1, 2, 'a', 'b', 5]

// splice从后往前删除，避免索引错乱
for (let i = arr.length - 1; i >= 0; i--) {
  if (arr[i] > 2) arr.splice(i, 1);
}
```

### 6. **sort()** - 排序
```javascript
// 注意：默认按字符串排序！需提供比较函数
const arr = [10, 2, 5, 1];

// ❌ 错误：[1, 10, 2, 5]（字符串排序）
arr.sort();

// ✅ 正确：升序
arr.sort((a, b) => a - b); // [1, 2, 5, 10]

// ✅ 正确：降序
arr.sort((a, b) => b - a); // [10, 5, 2, 1]

// 复杂对象排序
const users = [{name: 'B', age: 25}, {name: 'A', age: 30}];
users.sort((a, b) => a.age - b.age); // 按年龄升序
```

### 7. **reverse()** - 反向
```javascript
// 反转数组顺序
const arr = [1, 2, 3];
arr.reverse();
console.log(arr); // [3, 2, 1]
```

### 8. **fill()** - 填充
```javascript
// 用指定值填充数组
const arr = new Array(5);
arr.fill(0); // [0, 0, 0, 0, 0]
arr.fill(1, 2, 4); // [0, 0, 1, 1, 0] (从索引2到4，不包括4)
```

---

## 二、纯函数（不改变原数组）

### 1. **concat()** - 合并数组
```javascript
// 合并多个数组或值，返回新数组
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = arr1.concat(arr2, 5, [6]); // [1, 2, 3, 4, 5, 6]
console.log(arr1); // 原数组不变 [1, 2]
```

### 2. **slice()** - 截取数组
```javascript
// 浅拷贝数组的一部分，返回新数组
const arr = [1, 2, 3, 4, 5];
const sliced = arr.slice(1, 4); // [2, 3, 4]
const copy = arr.slice(); // 完整浅拷贝 [1, 2, 3, 4, 5]
const last2 = arr.slice(-2); // [4, 5] 最后两个
```

### 3. **map()** - 映射转换
```javascript
// 对每个元素执行函数，返回新数组（长度不变）
const arr = [1, 2, 3];
const doubled = arr.map(num => num * 2); // [2, 4, 6]

// 提取对象属性
const users = [{id: 1, name: 'A'}, {id: 2, name: 'B'}];
const names = users.map(u => u.name); // ['A', 'B']

// 注意 parseInt 陷阱
// ❌ [1, 2, 3].map(parseInt) // [1, NaN, NaN]
// ✅ [1, 2, 3].map(x => parseInt(x, 10)) // [1, 2, 3]
```

### 4. **filter()** - 筛选过滤
```javascript
// 筛选符合条件的元素，返回新数组
const arr = [1, 2, 3, 4, 5];
const evens = arr.filter(num => num % 2 === 0); // [2, 4]

// 多条件筛选
const products = [{price: 100}, {price: 200}, {price: 50}];
const affordable = products.filter(p => p.price >= 100 && p.price <= 150);
```

### 5. **reduce()** - 累积计算
```javascript
// 将数组累积为单个值
// 语法：reduce((accumulator, current, index, array) => ..., initialValue)
const arr = [1, 2, 3, 4];
const sum = arr.reduce((acc, cur) => acc + cur, 0); // 10

// 求最大值
const max = arr.reduce((a, b) => Math.max(a, b), -Infinity); // 4

// 对象转换
const votes = ['A', 'B', 'A', 'C', 'B', 'A'];
const count = votes.reduce((acc, vote) => {
  acc[vote] = (acc[vote] || 0) + 1;
  return acc;
}, {}); // { A: 3, B: 2, C: 1 }
```

### 6. **find()** - 查找单个元素
```javascript
// 返回第一个符合条件的元素（元素本身或 undefined）
const users = [{id: 1, name: 'A'}, {id: 2, name: 'B'}];
const user = users.find(u => u.id === 2); // { id: 2, name: 'B' }
const notFound = users.find(u => u.id === 99); // undefined
```

### 7. **findIndex()** - 查找索引
```javascript
// 返回第一个符合条件的元素的索引
const arr = ['a', 'b', 'c'];
const index = arr.findIndex(x => x === 'b'); // 1
```

### 8. **some()** - 部分测试
```javascript
// 测试是否至少有一个元素通过测试（逻辑或）
const arr = [1, 2, 3];
arr.some(num => num > 2); // true
arr.some(num => num < 0); // false
```

### 9. **every()** - 全部测试
```javascript
// 测试是否所有元素都通过测试（逻辑与）
const arr = [1, 2, 3];
arr.every(num => num > 0); // true
arr.every(num => num > 2); // false
```

### 10. **includes()** - 包含检查
```javascript
// 检查数组是否包含某个元素
const arr = [1, 2, 3, NaN];
arr.includes(2); // true
arr.includes(4); // false
arr.includes(NaN); // true (比 indexOf 更准)
```

### 11. **indexOf() / lastIndexOf()** - 查找位置
```javascript
// 返回元素首次/最后一次出现的索引
const arr = [1, 2, 3, 2];
arr.indexOf(2); // 1
arr.lastIndexOf(2); // 3
arr.indexOf(5); // -1 (不存在)
```

### 12. **join()** - 转字符串
```javascript
// 将数组元素用分隔符连接成字符串
const arr = ['a', 'b', 'c'];
arr.join(); // 'a,b,c' (默认逗号)
arr.join('-'); // 'a-b-c'
arr.join(''); // 'abc'
```

### 13. **flat()** - 数组扁平化
```javascript
// 将嵌套数组展开成一维数组
const nested = [1, [2, [3, [4]]]];
nested.flat(); // [1, 2, [3, [4]]] (默认深度1)
nested.flat(2); // [1, 2, 3, [4]]
nested.flat(Infinity); // [1, 2, 3, 4] (完全扁平化)

// 注意：flat() 会移除空位
const arr = [1, , 3];
arr.flat(); // [1, 3]
```

### 14. **flatMap()** - 映射+扁平化
```javascript
// 先map后flat，相当于map()+flat(1)
const arr = [1, 2, 3];
const result = arr.flatMap(x => [x, x * 2]);
// [1, 2, 2, 4, 3, 6]

// 实际场景：展开标签
const users = [
  {name: 'A', tags: ['js', 'react']},
  {name: 'B', tags: ['python']}
];
const allTags = users.flatMap(u => u.tags);
// ['js', 'react', 'python']
```

### 15. **forEach()** - 遍历
```javascript
// 遍历数组，对每个元素执行操作（无返回值）
const arr = [1, 2, 3];

// 基础遍历
arr.forEach((item, index, arr) => {
  console.log(`${index}: ${item}`);
});

// 注意：不能中断（不能用break）
// 如果需要中断，用 for 循环或 some/every
```

---

## 三、静态方法（Object 相关）

### **Object.keys()** - 获取键数组
```javascript
// 返回对象自身可枚举属性键的数组
const obj = { name: 'Alice', age: 25 };
Object.keys(obj); // ['name', 'age']

// 实际应用：遍历对象
Object.keys(obj).forEach(key => {
  console.log(`${key}: ${obj[key]}`);
});
```

### **Object.values()** - 获取值数组
```javascript
// 返回对象自身可枚举属性值的数组
const obj = { foo: 'bar', baz: 42 };
Object.values(obj); // ['bar', 42]
```

### **Object.entries()** - 获取键值对数组
```javascript
// 返回 [key, value] 对的数组
const obj = { a: 1, b: 2 };
Object.entries(obj); // [['a', 1], ['b', 2]]

// 转对象为数组
const data = { 'user-1': {name: 'A'}, 'user-2': {name: 'B'} };
const userArray = Object.entries(data).map(([id, user]) => ({
  id,
  ...user
}));
```

### **Object.fromEntries()** - 数组转对象
```javascript
// 将 [key, value] 对的数组转为对象
const entries = [['name', 'Alice'], ['age', 25]];
const obj = Object.fromEntries(entries);
// { name: 'Alice', age: 25 }

// 反向操作
const original = { a: 1, b: 2 };
const back = Object.fromEntries(Object.entries(original));
```

---

## 四、Array 静态方法

### **Array.from()** - 转换为数组
```javascript
// 从类数组或可迭代对象创建数组
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
Array.from({length: 5}); // [undefined, undefined, undefined, undefined, undefined]

// 结合映射函数
Array.from({length: 5}, (_, i) => i * 2); // [0, 2, 4, 6, 8]

// DOM NodeList 转数组
const divs = Array.from(document.querySelectorAll('div'));

// 去重
const unique = [...new Set(arr)]; // 或 Array.from(new Set(arr))
```

### **Array.isArray()** - 类型检查
```javascript
// 检查是否为数组
Array.isArray([1, 2]); // true
Array.isArray('123'); // false
Array.isArray({length: 0}); // false
```

### **Array.of()** - 创建数组
```javascript
// 创建包含给定元素的数组
Array.of(1, 2, 3); // [1, 2, 3]

// 与 Array() 的区别
new Array(3); // [empty × 3]
Array.of(3); // [3]
```

---

## 五、关键区别速记

| 方法 | 纯度 | 功能 | 返回值 |
|------|------|------|--------|
| **slice** | 纯函数 | 截取/复制 | 新数组 |
| **splice** | 非纯 | 增删改 | 被删元素数组 |
| **map** | 纯函数 | 转换 | 新数组（长度不变） |
| **filter** | 纯函数 | 筛选 | 新数组（长度可变） |
| **flat** | 纯函数 | 扁平化 | 新数组 |
| **forEach** | - | 遍历 | undefined |
| **find** | 纯函数 | 查找元素 | 元素或 undefined |
| **indexOf** | 纯函数 | 查找位置 | 索引或 -1 |
| **some** | 纯函数 | 部分测试 | boolean |
| **every** | 纯函数 | 全部测试 | boolean |

---

## 六、使用场景

**1. 数据转换（API数据处理）**
```javascript
const users = [{id: 1, firstName: 'John', lastName: 'Doe'}];
const names = users.map(u => `${u.firstName} ${u.lastName}`);
```

**2. 状态管理（React/Vue）**
```javascript
// ❌ 错误
this.state.items.push(newItem);

// ✅ 正确
this.setState({ items: [...this.state.items, newItem] });
```

**3. 链式操作**
```javascript
const result = data
  .filter(item => item.active)
  .map(item => item.name)
  .sort()
  .slice(0, 10);
```

**4. 复杂数据处理**
```javascript
const allTags = users
  .flatMap(u => u.tags)
  .filter((tag, i, arr) => arr.indexOf(tag) === i); // 去重
```

---

## 面试突击模式

### [JavaScript 数组操作] 面试速记

#### 30秒电梯演讲
JavaScript数组方法分为两类：纯函数（map/filter/slice）返回新数组不改原数组，适合React/Vue状态管理；非纯函数（push/splice）直接修改原数组。核心是掌握返回值和副作用，在不同场景选择正确方法。flat()用于展开嵌套数组。

---

#### 高频考点（必背）

**考点1：slice vs splice 区别**
- **slice**：纯函数，截取返回新数组，`array.slice(start, end)`
- **splice**：非纯函数，增删改原数组，`array.splice(start, deleteCount, ...items)`
- **记忆**：slice是"切片"，splice是"剪接"

**考点2：为什么React/Vue推荐纯函数**
框架通过引用比较检测状态变化。纯函数返回新数组，引用变化触发更新；非纯函数修改原数组，引用不变，框架无法检测导致视图不更新。

**考点3：map vs forEach**
- **map**：有返回值，返回新数组，用于数据转换
- **forEach**：无返回值（undefined），仅用于遍历执行副作用

**考点4：reduce 本质**
累加器函数，将数组"缩减"为单个值。可实现求和、统计、分组、格式转换等。核心是理解accumulator和initialValue。

**考点5：flat() 用途**
展开嵌套数组。`arr.flat(depth)`，depth默认为1。flat(Infinity)完全扁平化。flatMap()相当于map()后flat(1)。

**考点6：数组去重最佳实践**
`[...new Set(arr)]` - 利用Set自动去重，扩展运算符转回数组。时间复杂度O(n)。

---

#### 经典面试题（10道）

**题目1：`[10, 20, 30].map(parseInt)` 输出什么？为什么？**

**思路**：map回调接收`(element, index, array)`，parseInt接收`(string, radix)`，index被误当作radix

**答案**：输出 `[10, NaN, NaN]`

**代码框架**：
```javascript
/**
 * 解析过程：
 * parseInt('10', 0) -> 10 (radix为0默认十进制)
 * parseInt('20', 1) -> NaN (radix=1无效)
 * parseInt('30', 2) -> NaN ('3'不是有效二进制)
 */

// 正确写法
const arr = ['10', '20', '30'];
const result = arr.map(num => parseInt(num, 10)); // [10, 20, 30]
// 或使用 Number 构造函数
const result2 = arr.map(Number); // [10, 20, 30]
```

---

**题目2：实现数组扁平化（3种方法）**

**思路**：递归、reduce、使用flat()

**答案**：
```javascript
// 方法1：reduce递归
function flatten1(arr) {
  return arr.reduce((acc, cur) => 
    acc.concat(Array.isArray(cur) ? flatten1(cur) : cur), 
  []);
}

// 方法2：递归遍历
function flatten2(arr) {
  const result = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      result.push(...flatten2(item));
    } else {
      result.push(item);
    }
  });
  return result;
}

// 方法3：直接使用 flat（推荐）
function flatten3(arr) {
  return arr.flat(Infinity);
}

// 测试
const nested = [1, [2, [3, [4]], 5]];
console.log(flatten1(nested)); // [1, 2, 3, 4, 5]
```

---

**题目3：用reduce实现map功能**

**思路**：累加器用数组，每次迭代push处理后的值

**答案**：
```javascript
/**
 * 使用reduce模拟map
 * @param {Array} arr
 * @param {Function} fn
 * @returns {Array}
 */
function myMap(arr, fn) {
  return arr.reduce((acc, cur, index) => {
    acc.push(fn(cur, index, arr));
    return acc;
  }, []);
}

// 测试
const nums = [1, 2, 3];
console.log(myMap(nums, x => x * 2)); // [2, 4, 6]
```

---

**题目4：对数字数组正确排序**

**思路**：sort默认字符串排序，需提供比较函数

**答案**：
```javascript
const arr = [10, 2, 5, 1];

// 升序
arr.sort((a, b) => a - b); // [1, 2, 5, 10]

// 降序
arr.sort((a, b) => b - a); // [10, 5, 2, 1]

// 对象排序
const users = [{name: 'B', age: 25}, {name: 'A', age: 30}];
users.sort((a, b) => a.age - b.age); // 按年龄升序
```

---

**题目5：some vs every**

**思路**：some是"或"逻辑（找到就停止），every是"且"逻辑（遇到不满足就停止）

**答案**：
```javascript
const arr = [1, 2, 3, 4, 5];

// some - 是否有偶数？
arr.some(num => num % 2 === 0); // true (找到2就返回)

// every - 是否全是正数？
arr.every(num => num > 0); // true

// 使用场景
const perms = ['read', 'write'];
perms.some(p => p === 'admin'); // 权限检查

const fields = [{valid: true}, {valid: true}];
fields.every(f => f.valid); // 表单验证
```

---

**题目6：从数组中删除特定元素**

**思路**：从后往前splice或使用filter

**答案**：
```javascript
// ❌ 错误：从前往后（索引错乱）
for (let i = 0; i < arr.length; i++) {
  if (arr[i] % 2 === 0) arr.splice(i, 1);
}

// ✅ 方法1：从后往前splice
function removeEvens1(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] % 2 === 0) {
      arr.splice(i, 1);
    }
  }
}

// ✅ 方法2：filter（推荐）
const removeEvens2 = (arr) => arr.filter(num => num % 2 !== 0);

const nums = [1, 2, 3, 4, 5, 6];
console.log(removeEvens2(nums)); // [1, 3, 5]
```

---

**题目7：find vs filter**

**思路**：find返回元素，filter返回数组

**答案**：
```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

// find - 返回元素或 undefined
const user = users.find(u => u.id === 2); // { id: 2, name: 'Bob' }

// filter - 返回数组（可能为空）
const admins = users.filter(u => u.role === 'admin'); // []

// 使用场景
// find: 主键查询、查找配置项
// filter: 搜索列表、多条件筛选
```

---

**题目8：用reduce实现groupBy分组**

**思路**：累加器用对象，key为分组依据

**答案**：
```javascript
/**
 * 数组分组函数
 * @param {Array} arr
 * @param {Function} keyFn
 * @returns {Object}
 */
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

// 测试
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];

const grouped = groupBy(people, p => p.age);
/**
 * {
 *   25: [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
 *   30: [{ name: 'Bob', age: 30 }]
 * }
 */
```

---

**题目9：数组去重（多种方法）**

**思路**：Set、filter+indexOf、reduce

**答案**：
```javascript
const arr = [1, 2, 2, 3, 3, 4];

// 方法1：Set（推荐，O(n)）
const unique1 = [...new Set(arr)]; // [1, 2, 3, 4]

// 方法2：filter + indexOf（O(n²)）
const unique2 = arr.filter((item, index) => 
  arr.indexOf(item) === index
); // [1, 2, 3, 4]

// 方法3：reduce
const unique3 = arr.reduce((acc, cur) => 
  acc.includes(cur) ? acc : [...acc, cur], []
); // [1, 2, 3, 4]

// 对象数组去重（按id）
const users = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 1, name: 'A' }
];
const uniqueUsers = [...new Map(
  users.map(u => [u.id, u])
).values()]; // [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
```

---

**题目10：flat() 和 flatMap() 的用途**

**思路**：flat展开嵌套，flatMap先map后flat

**答案**：
```javascript
// flat() 展开嵌套数组
const nested = [1, [2, [3, [4]]]];
nested.flat(); // [1, 2, [3, [4]]] (深度1)
nested.flat(2); // [1, 2, 3, [4]] (深度2)
nested.flat(Infinity); // [1, 2, 3, 4] (完全扁平)

// flatMap() = map() + flat(1)
const arr = [1, 2, 3];
arr.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]

// 实际应用：提取所有标签
const users = [
  { name: 'Alice', tags: ['js', 'react'] },
  { name: 'Bob', tags: ['python'] }
];
const allTags = users.flatMap(u => u.tags);
// ['js', 'react', 'python']

// 与 flat 的对比
// 情况1：map后嵌套一层
const result1 = users.map(u => u.tags); // [['js', 'react'], ['python']]
result1.flat(); // ['js', 'react', 'python']

// 情况2：用 flatMap 一步到位
const result2 = users.flatMap(u => u.tags); // ['js', 'react', 'python']
```

---

#### 业务逻辑题（5道）

**题目1：购物车总价计算**

**场景**：购物车数据结构 `[{name, price, quantity}]`，计算总价

**代码框架**：
```javascript
/**
 * 计算购物车总价
 * @param {Array} cart - 购物车数组
 * @returns {number} 总价
 */
function calcTotal(cart) {
  return cart.reduce((total, item) => 
    total + item.price * item.quantity, 0
  );
}

// 测试
const cart = [
  { name: '商品A', price: 100, quantity: 2 },
  { name: '商品B', price: 200, quantity: 1 }
];
console.log(calcTotal(cart)); // 400
```

---

**题目2：筛选未禁用用户**

**场景**：用户列表包含 disabled 字段，筛选激活用户

**代码框架**：
```javascript
/**
 * 筛选激活用户
 * @param {Array} users - 用户列表
 * @returns {Array} 激活用户数组
 */
function getActiveUsers(users) {
  return users.filter(user => !user.disabled);
}

// 测试
const users = [
  { id: 1, name: 'Alice', disabled: false },
  { id: 2, name: 'Bob', disabled: true },
  { id: 3, name: 'Charlie', disabled: false }
];
console.log(getActiveUsers(users)); 
// [{ id: 1, ...}, { id: 3, ...}]
```

---

**题目3：生成API请求URL列表**

**场景**：根据ID数组生成API URL

**代码框架**：
```javascript
/**
 * 生成API URL数组
 * @param {Array<number>} ids - ID数组
 * @param {string} baseUrl - 基础URL
 * @returns {Array<string>} URL数组
 */
function generateUrls(ids, baseUrl = 'https://api.example.com/articles') {
  return ids.map(id => `${baseUrl}/${id}`);
}

// 测试
const articleIds = [101, 102, 103];
console.log(generateUrls(articleIds));
/**
 * [
 *   'https://api.example.com/articles/101',
 *   'https://api.example.com/articles/102',
 *   'https://api.example.com/articles/103'
 * ]
 */
```

---

**题目4：批量删除选中项**

**场景**：根据ID数组从列表中删除多项（直接修改原数组）

**代码框架**：
```javascript
/**
 * 批量删除（修改原数组）
 * @param {Array} allItems - 完整列表
 * @param {Array<number>} selectedIds - 要删除的ID数组
 */
function batchDelete(allItems, selectedIds) {
  // 从后往前遍历，避免索引错乱
  for (let i = allItems.length - 1; i >= 0; i--) {
    if (selectedIds.includes(allItems[i].id)) {
      allItems.splice(i, 1);
    }
  }
}

// 测试
const items = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 5, name: 'C' }
];
batchDelete(items, [2, 5]);
console.log(items); // [{ id: 1, name: 'A' }]
```

---

**题目5：权限检查**

**场景**：判断用户是否拥有特定权限

**代码框架**：
```javascript
/**
 * 权限检查函数
 * @param {Array<string>} userPermissions - 用户权限数组
 * @param {string} requiredPermission - 需要的权限
 * @returns {boolean}
 */
function hasPermission(userPermissions, requiredPermission) {
  return userPermissions.includes(requiredPermission);
  // 或使用 some
  // return userPermissions.some(p => p === requiredPermission);
}

// 测试
const permissions = ['read', 'write', 'comment'];
console.log(hasPermission(permissions, 'publish')); // false
console.log(hasPermission(permissions, 'write'));   // true
```

---

### 快速记忆口诀

```
纯函数记三宝：map filter slice
非纯函数记四组：push/pop  unshift/shift  splice  sort
React状态必用纯，引用改变才更新
reduce最万能，累加转换都能行
```