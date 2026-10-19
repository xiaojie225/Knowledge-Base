# JavaScript 数组操作精华手册

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
const copy = arr.slice(); //  [1, 2, 3, 4, 5]
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
arr.includes(NaN); // true 
```

### 11. **indexOf() / lastIndexOf()** - 查找位置
```javascript
// 返回元素首次/最后一次出现的索引
const arr = [1, 2, 3, 2];
arr.indexOf(2); // 1
arr.lastIndexOf(2); // 3
arr.indexOf(5); // -1 (不存在)
index = str.indexOf(char, index + 1)// 从当前索引的下一个字符开始查找,避免重复计数
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

let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

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



## 突击


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

// 对象数组-去重（按id）
const users = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 1, name: 'A' }
];
const uniqueUsers = [...new Map(
  users.map(u => [u.id, u])
).values()]; // [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]

// Map 是一种键值对集合，每个键只能出现一次。 .has() 方法用于检查 Map 中是否存在指定的键。 .set() 方法用于设置键值对。
uniqueFunc(arr, key) {
    const res = new Map(); // 用于存储已存在的设备地址
    return arr.filter(
    (item) => !res.has(item[key]) && res.set(item[key], 1)
    );
},



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


