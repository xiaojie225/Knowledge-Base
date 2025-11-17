
---

### JavaScript 数组常用方法开发文档

本文档旨在详细阐述 JavaScript 中常用的数组操作方法，并根据其是否修改原数组（副作用）进行分类，以便开发者在不同场景下做出最优选择。

#### 一、 完整代码示例（已补充知识点）

```javascript
// =================================================================
// 核心概念：纯函数 vs 非纯函数（是否改变原数组）
// 纯函数：不改变源数组（无副作用），总是返回一个新数组。
// 非纯函数（Mutating Methods）：会直接修改调用该方法的原数组。
// =================================================================

// -------------------
// 1. 非纯函数 (会改变原数组)
// -------------------
console.log('--- 1. 非纯函数示例 ---');
const mutableArr = [10, 20, 30, 40];
console.log('原始数组:', mutableArr);

// pop: 删除数组最后一个元素，并返回被删除的元素
const popRes = mutableArr.pop();
console.log(`pop() 后: 返回值=${popRes}, 数组变为:`, mutableArr); // 返回值=40, 数组变为: [10, 20, 30]

// shift: 删除数组第一个元素，并返回被删除的元素
const shiftRes = mutableArr.shift();
console.log(`shift() 后: 返回值=${shiftRes}, 数组变为:`, mutableArr); // 返回值=10, 数组变为: [20, 30]

// push: 在数组末尾添加一个或多个元素，并返回数组的新长度
const pushRes = mutableArr.push(50, 60);
console.log(`push(50, 60) 后: 返回值=${pushRes}, 数组变为:`, mutableArr); // 返回值=4, 数组变为: [20, 30, 50, 60]

// unshift: 在数组开头添加一个或多个元素，并返回数组的新长度
const unshiftRes = mutableArr.unshift(5, 15);
console.log(`unshift(5, 15) 后: 返回值=${unshiftRes}, 数组变为:`, mutableArr); // 返回值=6, 数组变为: [5, 15, 20, 30, 50, 60]

// splice: T通过删除或替换现有元素或者原地添加新的元素来修改数组，并以数组形式返回被修改的内容
// 语法: array.splice(start, deleteCount, item1, item2, ...)
console.log('splice() 前的数组:', mutableArr);
const spliceRes = mutableArr.splice(2, 2, 'a', 'b', 'c'); // 从索引2开始，删除2个元素，并在此位置插入'a','b','c'
console.log(`splice(2, 2, 'a', 'b', 'c') 后: 返回值=${JSON.stringify(spliceRes)}, 数组变为:`, mutableArr); // 返回值=[20,30], 数组变为: [5, 15, 'a', 'b', 'c', 50, 60]

// forEach: 遍历数组，对每个元素执行提供的函数，无返回值(undefined)。(技术上不返回新数组，但会执行有副作用的操作)
console.log('forEach 遍历:');
mutableArr.forEach(item => console.log(item * 2)); // 注意：这里只是打印，没有改变原数组。但可以在回调函数内执行有副作用的操作。


// -------------------
// 2. 纯函数 (不改变原数组，返回新数组)
// -------------------
console.log('\n--- 2. 纯函数示例 ---');
const immutableArr = [10, 20, 30, 40, 50];
console.log('原始数组:', immutableArr);

// concat: 合并两个或多个数组，返回一个新数组
const concatArr = immutableArr.concat([60, 70]);
console.log('concat([60, 70]) 后:', concatArr);
console.log('原数组未变:', immutableArr);

// map: 创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
const mapArr = immutableArr.map(num => num * 10);
console.log('map(num => num * 10) 后:', mapArr);
console.log('原数组未变:', immutableArr);

// filter: 创建一个新数组, 其包含通过所提供函数实现的测试的所有元素
const filterArr = immutableArr.filter(num => num > 25);
console.log('filter(num => num > 25) 后:', filterArr);
console.log('原数组未变:', immutableArr);

// slice: 返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包前不包后）
const sliceArr1 = immutableArr.slice();      // 完整浅拷贝
const sliceArr2 = immutableArr.slice(1, 4);  // 从索引1到4(不含4)
const sliceArr3 = immutableArr.slice(-2);    // 最后两个元素
console.log('slice(1, 4) 后:', sliceArr2);
console.log('原数组未变:', immutableArr);

// reduce: 对数组中的每个元素执行一个reducer函数(升序执行)，将其结果汇总为单个返回值
// 语法: arr.reduce(callback(accumulator, currentValue, currentIndex, array), initialValue)
const sum = immutableArr.reduce((acc, cur) => acc + cur, 0); // acc是累加器, cur是当前值, 0是初始值
console.log('reduce 计算总和:', sum);
console.log('原数组未变:', immutableArr);


// -------------------
// 3. 经典面试题解析：[10, 20, 30].map(parseInt)
// -------------------
console.log('\n--- 3. 经典面试题 ---');
const res = [10, 20, 30].map(parseInt);
console.log('[10, 20, 30].map(parseInt) 的结果是:', res); // [10, NaN, NaN]

// 详细拆解：
// map 回调函数接收三个参数: (element, index, array)
// parseInt 函数接收两个参数: (string, radix)
//
// 实际执行过程如下:
// 1. parseInt(10, 0);  // radix为0时，默认按十进制处理，结果为 10
// 2. parseInt(20, 1);  // radix为1，radix必须在2-36之间，无效，结果为 NaN
// 3. parseInt(30, 2);  // 按二进制解析'30'，但'3'不是有效二进制数字，结果为 NaN

// 正确写法，如果想将字符串数组转为数字数组:
const strArr = ['10', '20', '30'];
const numArr = strArr.map(num => parseInt(num, 10)); // 始终指定基数为10
// 或者更简洁的写法:
const numArrSimple = strArr.map(Number); // Number构造函数作为回调，行为符合预期
console.log("正确转换:", numArrSimple); // [10, 20, 30]

```
#### 二、 学习知识

1.  **纯函数 vs 非纯函数 (Pure vs. Impure/Mutating)**
    *   **核心区别**: 非纯函数（如 `push`, `pop`, `splice`）会直接修改**原数组**。纯函数（如 `map`, `filter`, `slice`, `concat`）则**不会**修改原数组，而是返回一个全新的数组。
    *   **重要性**: 在现代前端开发（如React, Vue）中，推荐使用纯函数来处理数据。这遵循了“不可变性”原则，使得状态变更可预测、易于追踪和调试，避免了不必要的副作用。

2.  **常用方法详解**
    *   **增/删（非纯）**: `push`/`pop` (操作尾部)，`unshift`/`shift` (操作头部)，`splice` (在任意位置增/删/改)。
    *   **转换/筛选（纯）**:
        *   `map`: 将数组每个元素按规则**映射**成新数组的元素（长度不变）。
        *   `filter`: 根据条件**过滤**元素，返回符合条件的新数组（长度可能变小）。
        *   `reduce`: 将数组**累积**成单个值（如求和、求最值、对象转换等）。
    *   **截取/合并（纯）**: `slice` (截取数组一部分)，`concat` (合并数组)。
    *   **遍历**: `forEach` 用于遍历数组执行操作，但它没有返回值。

3.  **`slice` vs `splice` 的区别**
    *   **纯度**: `slice` 是纯函数，`splice` 是非纯函数。
    *   **功能**: `slice` 用于“切片”或“复制”，不改变原数组。`splice` 用于“剪接”，会直接从原数组中删除、替换或添加元素。
    *   **返回值**: `slice` 返回截取的新数组。`splice` 返回被删除元素的数组。

4.  **`map` 与 `parseInt` 的陷阱**
    *   `map`的回调函数会接收`value`, `index`, `array`三个参数。
    *   `parseInt`函数会接收`string`, `radix`（基数）两个参数。
    *   当`parseInt`直接作为`map`的回调时，`index`会被误当作`radix`传入，导致非预期的`NaN`结果。正确做法是使用箭头函数包裹，并显式指定基数：`arr.map(num => parseInt(num, 10))`。

#### 三、 用途（用在那个地方）

*   **数据处理与转换**: 从后端API获取原始数据列表后，经常需要用 `map` 将其转换为前端UI所需的格式。例如，将包含过多信息的用户对象数组，映射为只包含`id`和`name`的新数组。
*   **列表筛选与搜索**: 在一个商品列表中，根据用户输入的搜索词或选择的筛选条件（如价格区间、分类），使用 `filter` 动态展示符合条件的商品。
*   **状态管理（React/Vue）**: 当更新组件状态中的一个数组时，严禁直接使用`push`, `splice`等方法。必须使用 `map`, `filter`, `concat` 或扩展运算符 (`...`) 创建一个新数组来替换旧状态，以触发视图更新并保持数据流的可预测性。
*   **购物车/表单计算**: 使用 `reduce` 计算购物车中所有商品的总价，或对表单中多个数值项进行求和。
*   **实现队列/栈结构**: `push` 和 `pop` 组合可以实现一个后进先出（LIFO）的**栈**结构。`push` 和 `shift` 组合可以实现一个先进先出（FIFO）的**队列**结构。

[标签: JavaScript 数组方法] 纯函数与非纯函数，map, filter, reduce, slice, splice

---

### 如果我是面试官...

#### 10个技术题目 + 答案

1.  **问题**: `slice` 和 `splice` 有什么主要区别？请分别说明它们的使用场景。
    *   **答案**:
        *   **纯度**: `slice`是纯函数，不改变原数组，返回新数组；`splice`是非纯函数，会改变原数组。
        *   **功能**: `slice`用于截取或复制数组的一部分；`splice`用于在数组中添加、删除或替换元素。
        *   **返回值**: `slice`返回截取到的新数组；`splice`返回一个包含被删除元素的数组。
        *   **场景**: 在React/Vue中更新状态时用`slice`；需要直接在原数组上做“手术”式修改时（如删除某个特定项）用`splice`。

2.  **问题**: 为什么在React或Vue中，我们推荐使用`map`, `filter`而不是`push`, `splice`来更新数组状态？
    *   **答案**: 这与这些框架的“响应式原理”和“不可变性”原则有关。框架通过比较新旧状态的引用来决定是否更新UI。`push`, `splice`修改的是原数组，其内存地址不变，框架可能无法检测到变化。而`map`, `filter`返回一个全新的数组，引用地址发生改变，能稳定触发UI更新。这使得状态变更可预测，便于调试。

3.  **问题**: `forEach` 和 `map` 的区别是什么？
    *   **答案**: 主要区别在于**返回值**。`map`会返回一个新数组，新数组的每个元素是回调函数处理后的结果。`forEach`没有返回值（返回`undefined`），它仅仅是用来遍历数组，对每个元素执行某些操作（如打印、DOM操作等副作用）。

4.  **问题**: 请解释 `[1, 2, 3].map(parseInt)` 的结果为什么是 `[1, NaN, NaN]`？
    *   **答案**: 因为`map`的回调函数接收`(value, index)`两个参数，而`parseInt`接收`(string, radix)`两个参数。执行时，`index`被当作`radix`（基数）传入。
        *   `parseInt('1', 0)` -> 1 (基数为0，按十进制)
        *   `parseInt('2', 1)` -> NaN (基数1无效)
        *   `parseInt('3', 2)` -> NaN ('3'不是有效的二进制数)

5.  **问题**: 如何用一行代码实现数组去重？
    *   **答案**: `const uniqueArr = [...new Set(arr)];`

6.  **问题**: `arr.pop()` 和 `arr.slice(0, -1)` 都能移除数组最后一个元素，它们有什么本质不同？
    *   **答案**: `arr.pop()` 是一个非纯函数，它会直接修改`arr`本身，并返回被移除的那个元素。而 `arr.slice(0, -1)` 是一个纯函数，它不会修改`arr`，而是返回一个不包含最后一个元素的新数组。

7.  **问题**: `some` 和 `every` 方法有什么区别？
    *   **答案**: 它们都用于测试数组元素，并返回布尔值。`some`是测试数组中**是否有至少一个**元素通过了测试（类似逻辑或 ||），一旦找到符合的就会立即返回`true`。`every`是测试数组中**是否所有**元素都通过了测试（类似逻辑与 &&），一旦找到不符合的就会立即返回`false`。

8.  **问题**: 如何理解 `reduce` 方法？请用它实现一个 `map` 的功能。
    *   **答案**: `reduce`是一个“累加器”，它遍历数组，将上一次回调的返回值（累加值）作为下一次回调的输入，最终将整个数组“缩减”为一个单一的值。
    *   用 `reduce` 实现 `map`:
        ```javascript
        const arr = [1, 2, 3];
        const map_by_reduce = arr.reduce((acc, cur) => {
            acc.push(cur * 2);
            return acc;
        }, []); // 初始值是一个空数组
        // map_by_reduce is [2, 4, 6]
        ```

9.  **问题**: 以下代码的输出是什么？
    `const arr = [10, 20]; const res = arr.push(30); console.log(res);`
    *   **答案**: 输出 `3`。因为 `push` 方法返回的是数组的新长度。

10. **问题**: 以下代码的输出是什么？
    `const arr = [10, 20]; const res = arr.unshift(5); console.log(res);`
    *   **答案**: 输出 `3`。因为 `unshift` 方法返回的是数组的新长度。

#### 5道业务逻辑题 + 答案

1.  **场景**: 一个电商网站的购物车数据是一个对象数组 `cart = [{id: 1, name: '商品A', price: 100, quantity: 2}, {id: 2, name: '商品B', price: 200, quantity: 1}]`。请计算购物车的总价。
    *   **答案**:
        ```javascript
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        console.log(totalPrice); // 400
        ```

2.  **场景**: 后端返回一个用户列表，其中包含已禁用的用户 `users = [{id: 1, name: 'Alice', disabled: false}, {id: 2, name: 'Bob', disabled: true}, {id: 3, name: 'Charlie', disabled: false}]`。请筛选出所有未被禁用的用户。
    *   **答案**:
        ```javascript
        const activeUsers = users.filter(user => !user.disabled);
        console.log(activeUsers); // [{id: 1, ...}, {id: 3, ...}]
        ```

3.  **场景**: 我们有一个文章ID列表 `articleIds = [101, 102, 103]`，现在需要为每个ID生成一个API请求URL，格式为 `https://api.example.com/articles/{id}`。请生成一个URL数组。
    *   **答案**:
        ```javascript
        const urls = articleIds.map(id => `https://api.example.com/articles/${id}`);
        console.log(urls); // ['https://...', 'https://...', 'https://...']
        ```

4.  **场景**: 用户在一个多选列表中选择了一些项目的ID，保存在数组 `selectedIds = [2, 5, 8]` 中。现在有一个包含所有项目信息的数组 `allItems = [{id: 1, ...}, {id: 2, ...}]`。请根据`selectedIds`从`allItems`中删除这些选中的项目。注意，要求直接在`allItems`上修改。
    *   **答案**: 使用 `splice`，但需要注意数组塌陷问题，从后往前遍历是安全的做法。
        ```javascript
        for (let i = allItems.length - 1; i >= 0; i--) {
            if (selectedIds.includes(allItems[i].id)) {
                allItems.splice(i, 1);
            }
        }
        ```

5.  **场景**: 一个权限系统中，用户的权限用一个字符串数组表示 `userPermissions = ['read', 'comment']`。现在需要判断用户是否拥有“发布” (`publish`) 权限。请写一个函数。
    *   **答案**:
        ```javascript
        function hasPublishPermission(permissions) {
            return permissions.includes('publish');
        }
        // 或者用 some
        // function hasPublishPermission(permissions) {
        //     return permissions.some(p => p === 'publish');
        // }
        console.log(hasPublishPermission(userPermissions)); // false
        ```

#### 再加5道例子的面试题 + 5道业务逻辑

##### 5道补充技术面试题

1.  **问题**: 如何在不使用 `concat` 或扩展运算符的情况下，合并两个数组 `a` 和 `b`，并返回一个新数组？
    *   **答案**: 可以使用 `slice` 创建 `a` 的副本，然后用`forEach`和`push`添加`b`的元素。
        ```javascript
        const a = [1, 2], b = [3, 4];
        const c = a.slice(); // 创建副本
        b.forEach(item => c.push(item));
        ```

2.  **问题**: 请解释 JavaScript 数组的 `sort` 方法。为什么 `[1, 10, 2, 5].sort()` 的结果是 `[1, 10, 2, 5]`？如何正确地对数字数组进行排序？
    *   **答案**: `sort` 方法默认会将元素转换为字符串，然后按UTF-16码元值顺序进行排序。所以'10'会排在'2'前面。要正确排序数字，必须提供一个比较函数 `(a, b) => a - b` (升序) 或 `(a, b) => b - a` (降序)。`[1, 10, 2, 5].sort((a,b) => a - b)` 结果才是 `[1, 2, 5, 10]`。另外，`sort` 是一个非纯函数，它会修改原数组。

3.  **问题**: 如何使用 `reduce` 方法找到数组中的最大值？
    *   **答案**:
        ```javascript
        const arr = [10, 50, 20, 30];
        const max = arr.reduce((acc, cur) => cur > acc ? cur : acc, -Infinity);
        // 或者更简单地
        const max_simple = arr.reduce((a, b) => Math.max(a, b));
        ```

4.  **问题**: `Array.from()` 有什么用途？请举例说明。
    *   **答案**: `Array.from()` 可以从一个类似数组或可迭代对象创建一个新的、浅拷贝的数组实例。
        *   **示例1**: 将字符串转为字符数组：`Array.from('hello')` -> `['h', 'e', 'l', 'l', 'o']`
        *   **示例2**: 将DOM集合 `NodeList` 转为真数组以使用`map`, `filter`等方法：`const divs = Array.from(document.querySelectorAll('div'));`
        *   **示例3**: 结合第二个参数（映射函数）创建数组：`Array.from({length: 5}, (v, i) => i * 2)` -> `[0, 2, 4, 6, 8]`

5.  **问题**: `find` 和 `filter` 方法有何不同？
    *   **答案**: `find` 返回第一个满足条件的**元素本身**，如果找不到则返回 `undefined`。`filter` 返回一个包含所有满足条件的元素的**新数组**，如果找不到则返回空数组 `[]`。

##### 5道补充业务逻辑题

1.  **场景**: 后端返回的数据 `data = { 'user-1': {name: 'A'}, 'user-2': {name: 'B'} }` 是一个以ID为键的对象。前端需要将其转换成一个数组 `[{id: 'user-1', name: 'A'}, {id: 'user-2', name: 'B'}]` 以便渲染列表。
    *   **答案**:
        ```javascript
        const userArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
        ```

2.  **场景**: 一个订单系统有多个步骤（'created', 'paid', 'shipped', 'delivered'）。给定一个当前订单状态 `currentStatus = 'paid'`，你需要高亮显示包括当前状态在内的所有之前的步骤。
    *   **答案**:
        ```javascript
        const allSteps = ['created', 'paid', 'shipped', 'delivered'];
        const currentStatus = 'paid';
        const activeSteps = allSteps.slice(0, allSteps.indexOf(currentStatus) + 1);
        console.log(activeSteps); // ['created', 'paid']
        // 在UI中，可以遍历allSteps，如果step在activeSteps里，就添加高亮class
        ```

3.  **场景**: 在一个产品列表中，每个产品都有一个`tags`数组，如 `products = [{name: 'A', tags: ['tech', 'new']}, {name: 'B', tags: ['life', 'hot']}]`。你需要收集整个产品列表中所有出现过的、不重复的标签。
    *   **答案**:
        ```javascript
        const allTags = products.reduce((acc, product) => {
            return acc.concat(product.tags);
        }, []);
        const uniqueTags = [...new Set(allTags)];
        // 或者一步到位
        // const uniqueTags = [...new Set(products.flatMap(p => p.tags))];
        console.log(uniqueTags); // ['tech', 'new', 'life', 'hot']
        ```

4.  **场景**: 一个投票应用，投票结果存储在一个数组中 `votes = ['A', 'B', 'A', 'C', 'B', 'A']`。请统计每个选项的得票数，输出一个对象 `{'A': 3, 'B': 2, 'C': 1}`。
    *   **答案**:
        ```javascript
        const voteCount = votes.reduce((acc, vote) => {
            acc[vote] = (acc[vote] || 0) + 1;
            return acc;
        }, {});
        console.log(voteCount);
        ```

5.  **场景**: 有一个二维数组，代表一个表格数据 `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`。现在需要校验表格中是否所有数字都大于0。
    *   **答案**:
        ```javascript
        const allPositive = matrix.every(row => row.every(num => num > 0));
        console.log(allPositive); // true
        ```

---

### 如果我忘记了，如何快速使用？

(假设你正在一个React项目中，需要处理一个从API获取的`userList`数组)

**目标1：我想从`userList`里筛选出所有年龄大于18岁的用户，并只显示他们的名字。**

```jsx
// 1. 从API获取了 userList
const userList = [
    { id: 1, name: '张三', age: 17 },
    { id: 2, name: '李四', age: 20 },
    { id: 3, name: '王五', age: 22 }
];

// 2. 链式调用：先 filter 筛选，再 map 转换
const adultUserNames = userList
    .filter(user => user.age > 18) // 得到 [{...李四...}, {...王五...}]
    .map(user => user.name);        // 得到 ['李四', '王五']

// 3. 在JSX中使用
return (
    <ul>
        {adultUserNames.map((name, index) => <li key={index}>{name}</li>)}
    </ul>
);
```

**目标2：用户点击了“删除”按钮，需要从状态 `items` 中移除ID为 `itemIdToRemove` 的一项。**

```jsx
// 原始状态
const [items, setItems] = useState([
    { id: 1, text: '任务A' },
    { id: 2, text: '任务B' },
    { id: 3, text: '任务C' }
]);

const itemIdToRemove = 2;

// 使用 filter 创建一个不包含该项的新数组来更新状态 (推荐)
const handleRemove = (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
};
```

**目标3：我想在列表`items`的末尾添加一个新项`newItem`。**

```jsx
const newItem = { id: 4, text: '任务D' };

// 使用扩展运算符 `...` 创建新数组 (推荐)
const handleAdd = (itemToAdd) => {
    const newItems = [...items, itemToAdd];
    setItems(newItems);
};
```

**核心速记**:
*   **要修改/筛选/转换数组？** -> 优先用`filter`, `map`, `reduce`。它们返回新数组，安全。
*   **在React/Vue里更新数组状态？** -> 绝对不要用`push`, `pop`, `splice`直接改。用扩展运算符`[...]`或`slice()`, `concat()`创建副本再操作。
*   **计算总和/统计/转换格式？** -> `reduce`是你的瑞士军刀。
*   **只是遍历做点事，不要新数组？** -> 用`forEach`。