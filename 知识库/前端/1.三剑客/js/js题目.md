**题目4：如何高效批量添加 1000 个列表项？**

思路：使用 DocumentFragment 减少回流

答案：创建 fragment，循环中将元素添加到 fragment，最后一次性插入 DOM。

```javascript
/**
 * 高效批量添加元素
 * @param {HTMLElement} parent - 父容器
 * @param {number} count - 添加数量
 */
function batchAppend(parent, count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const li = document.createElement('li');
        li.textContent = `Item ${i}`;
        fragment.appendChild(li);  // 不触发回流
    }
    parent.appendChild(fragment);  // 仅一次回流
}
```

**题目5：事件委托如何实现？**

思路：父元素监听，通过 event.target 判断实际触发元素

答案：将事件绑定到父元素，利用事件冒泡，通过 event.target 或 closest() 找到目标元素。

```javascript
/**
 * 事件委托示例 - 删除列表项
 * @param {string} listId - 列表容器ID
 */
function setupDelegation(listId) {
    const list = document.getElementById(listId);
    list.addEventListener('click', (e) => {
        // 判断点击的是否是删除按钮
        if (e.target.classList.contains('delete-btn')) {
            // 找到对应的 li 并删除
            const li = e.target.closest('li');
            li.remove();
        }
    });
}
```

**题目10：封装一个高效批量插入函数**

思路：封装 DocumentFragment 最佳实践

答案：接收父元素和子元素数组，内部使用 fragment 优化。

```javascript
/**
 * 高效批量插入子元素
 * @param {HTMLElement} parent - 父元素
 * @param {HTMLElement[]} children - 子元素数组
 */
function appendEfficiently(parent, children) {
    const fragment = document.createDocumentFragment();
    children.forEach(child => fragment.appendChild(child));
    parent.appendChild(fragment);
}

// 使用示例
const items = ['A', 'B', 'C'].map(text => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
});
appendEfficiently(document.getElementById('list'), items);
```

**题目1: 实现一个带超时的图片加载函数**
```javascript
/**
 * 实现图片加载，超过指定时间则超时失败
 * @param {string} url - 图片地址
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<HTMLImageElement>}
 */
function loadImgWithTimeout(url, timeout = 5000) {
    // 创建加载 Promise
    const loadPromise = new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = url;
    });
  
    // 创建超时 Promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('加载超时')), timeout);
    });
  
    // 竞速：哪个先完成用哪个
    return Promise.race([loadPromise, timeoutPromise]);
}

// 使用示例
loadImgWithTimeout('large.jpg', 3000)
    .then(img => console.log('成功', img))
    .catch(err => console.error(err.message));
```

**思路**: 用 `Promise.race` 让加载和超时计时器竞争，谁先完成就采用谁的结果。

**题目9: 红绿灯问题（Promise 实现）**
```javascript
/**
 * 实现红绿灯：红灯3秒 → 绿灯2秒 → 黄灯1秒，循环
 */
function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

async function trafficLight() {
    while (true) {
        console.log('红灯');
        await sleep(3000);
      
        console.log('绿灯');
        await sleep(2000);
      
        console.log('黄灯');
        await sleep(1000);
    }
}

trafficLight(); // 启动
```


### toggleArrayItem()
作用：切换数组中的某一项，存在则删除，不存在则添加。

```javascript
/**
 * 切换数组中的项
 * @param {Array} array - 原数组
 * @param {*} item - 要切换的项
 * @returns {Array} 切换后的新数组
 * @example
 * toggleArrayItem([1, 2, 3], 2); // [1, 3]
 * toggleArrayItem([1, 2, 3], 4); // [1, 2, 3, 4]
 */
 
function toggleArrayItem(array, item) {
  return array.includes(item)
    ? array.filter((current) => current !== item)
    : [...array, item];
}
```

### countOccurrences()
作用：统计数组中每项出现的次数。

```javascript
/**
 * 统计数组中各项的出现次数
 * @param {Array} array - 要统计的数组
 * @returns {Object} 键为数组项，值为出现次数
 * @example
 * countOccurrences(['a', 'b', 'a', 'c', 'b', 'a']);
 * // { a: 3, b: 2, c: 1 }
 */
  
function countOccurrences(array) {
	let arry1 = {}
	array.map(item =>{
		arry1[item] =  (arry1[item] || 0) +1 
	})
	retrun arry1
}
 
function countOccurrences(array) {
  return array.reduce((accumulator, item) => {
    accumulator[item] = (accumulator[item] || 0) + 1;
    return accumulator;
  }, {});
}
```

### **urlEncode** - 对象转 URL 参数
```js
/**
 * @description 将一个 JavaScript 对象转换为 URL 查询参数字符串。
 * @param {object} data - 需要转换的对象，支持数组值。
 * @returns {string} URL 查询参数字符串。
 * 例子：
 * urlEncode({ name: "test", ids: [1, 2] }) // 返回 "name=test&ids=1&ids=2"
 */
urlEncode(data) {
  var _result = [];
  for (var key in data) {
    var value = data[key];
    if (value.constructor == Array) {
      value.forEach(_value => {
        _result.push(key + "=" + _value);
      });
    } else {
      _result.push(key + '=' + value);
    }
  }
  return _result.join('&');
}
```

### **inArray** - 检查元素是否在数组内
```js
/**
 * @description 检查一个值是否存在于数组中。
 * @param {*} search - 要查找的值。
 * @param {Array} array - 被查找的数组。
 * @returns {boolean} 如果找到返回 `true`，否则返回 `false`。
 * 例子：
 * inArray(3, [1, 2, 3]) // 返回 true
 * inArray(4, [1, 2, 3]) // 返回 false
 */
inArray(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}
```


### 二分查找

```js


        /**

         * 二分查找（循环）

         * @param arr 数组

         * @param target 目标值

         * @returns index

         */

        function binarySearch1(arr, target) {

            const length = arr.length

            if (length === 0) return -1

  

            let startIndex = 0 // 开始位置

            let endIndex = length - 1 // 结束位置

  

            while (startIndex <= endIndex) {

                const midIndex = Math.floor((startIndex + endIndex) / 2) // 中间位置

                const midValue = arr[midIndex]

                if (target < midValue) {

                    // 目标值较小，则继续在左侧查找

                    endIndex = midIndex - 1

                } else if (target > midValue) {

                    // 目标值较大，则继续在右侧查找

                    startIndex = midIndex + 1

                } else {

                    // 相等，则返回

                    return midIndex

                }

            }

  

            return -1 // 未找到

        }

  

        /**

         * 二叉查找（递归）

         * @param arr 数组

         * @param target 目标值

         * @param startIndex startIndex

         * @param endIndex endIndex

         */

        function binarySearch2(arr, target, startIndex, endIndex) {

            const length = arr.length

            if (length === 0) return -1

  

            // 开始和结束的范围

            if (startIndex == null) startIndex = 0

            if (endIndex == null) endIndex = length - 1

  

            // 开始和结束相遇，则结束

            if (startIndex === endIndex) return -1

  

            // 中间位置

            const midIndex = Math.floor((startIndex + endIndex) / 2)

            const midValue = arr[midIndex]

  

            if (target < midValue) {

                // 目标值较小，则从左侧寻找

                return binarySearch2(arr, target, startIndex, midIndex - 1)

            } else if (target > midValue) {

                // 目标值较大，则从右侧查找

                return binarySearch2(arr, target, midIndex + 1, endIndex)

            } else {

                // 相等，则返回

                return midIndex

            }

        }

  

        // 功能测试

        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]

        const target = 2

        console.log(binarySearch1(arr, target))

        console.log(binarySearch2(arr, target))

```

### 合并两个递增数组

```js
        const arr1 = [1, 3, 5, 7, 9]

        const arr2 = [2, 4, 6, 8]

  

        // // 1. 直接用 concat + sort —— 时间复杂度高，因为有排序，复杂度至少是 O(n*logn)

        // const res = arr1.concat(arr2).sort((a, b) => a - b)

        // console.log(res)

  

        // 2. 双指针 - 时间复杂度 O(m + n)

        const res = []

        let i = 0

        let j = 0

  

        while(arr1[i] != null || arr2[j] != null) {

            // 只要 arr1 或 arr2 还有值，就继续循环

  

            const v1 = arr1[i]

            const v2 = arr2[j]

            // console.log('index', i, j)

  

            if (v1 == null && v2 == null) {

                // arr1 和 arr2 都没有值了，则停止

                break

            }

            if (v1 < v2 || v2 == null) {

                // v1 较小，则只拼接 v1

                res.push(v1)

                i++

            }

            if (v1 > v2 || v1 == null) {

                // v2 较小，则只拼接 v2

                res.push(v2)

                j++

            }

            if (v1 === v2) {

                // v1 v2 相等，则都拼接

                res.push(v1)

                i++

                res.push(v2)

                j++

            }

        }

        console.log(res)
```

### 动态规划
```js
        function getPaths(m, n) {

            // m * n 二维数组，模拟网格

            const map = new Array(m)

            for (let i = 0; i < m; i++) {

                map[i] = new Array(n)

            }

  

            // 如果只走第一行，就只有一条路径。所以第一行所有 item 都填充 1

            map[0].fill(1)

  

            // 如果只走第一列，也只有一条路径。所以第一列所有 item 都填充 1

            for (let i = 0; i < m; i++) {

                map[i][0] = 1

            }

  

            // 其他 item ，根据这个公式 map[i][j] = map[i - 1][j] + map[i][j - 1]

            // 如走到 [5, 4] 的路径数，就是 [4, 4] 和 [5, 3] 路径数的总和 —— 动态规划的思想

            // 注意：i 和 j 都从 1 开始 ！！！ 因为 0 位置已经被上文赋值为了

            for (let i = 1; i < m; i++) {

                for (let j = 1; j < n; j++) {

                    map[i][j] = map[i - 1][j] + map[i][j - 1]

                }

            }

  

            // 返回 finish 节点的路径数

            return map[m - 1][n - 1]

        }

  

        console.log('paths', getPaths(5, 4))

```


### 队列

```js
        // 实现队列的：入队、出队、长度

        // PS：要用链表来实现，用数组性能较低

  

        class MyQueue {

            constructor() {

                this.length = 0 // 长度

                this.head = null

                this.tail = null

            }

            // 从 tail 入队

            add(value) {

                const newNode = { value }

  

                if (this.length === 0) {

                    // 长度是 0

                    this.head = newNode

                    this.tail = newNode

                } else {

                    // 长度 > 0 ，把 newNode 拼接到 tail 位置

                    this.tail.next = newNode

                    this.tail = newNode

                }

  

                this.length++ // 累加长度

            }

            // 从 head 出队

            delete() {

                if (this.length <= 0) return null

  

                let value = null

                if (this.length === 1) {

                    // 长度是 1 ，只有一个元素了

                    value = this.head.value // 先找到结果

                    // 重置 head tail

                    this.head = null

                    this.tail = null

                } else {

                    // 长度 > 1 ，多个元素

                    value = this.head.value // 先找到结果

                    this.head = this.head.next // 重置 head

                }

  

                // 减少长度，返回结果

                this.length--

                return value

            }

        }

  

        // 功能测试

        const queue = new MyQueue()

        queue.add(100)

        console.log('length1', queue.length) // 1

        queue.add(200)

        console.log('length2', queue.length) // 2

        console.log('delete1', queue.delete()) // 100

        queue.add(300)

        console.log('length3', queue.length) // 2

        console.log('delete2', queue.delete()) // 200

        console.log('length4', queue.length) // 1

        console.log('delete3', queue.delete()) // 300

        console.log('length5', queue.length) // 0

        console.log('delete4', queue.delete()) // null
```

### 快速排序

```js

        // 功能测试

        const arr1 = [2, 1, 9, 7, 8, 6, 3, 5]

        console.log(quickSort1(arr1))

        const arr2 = [2, 1, 9, 7, 8, 6, 3, 5]

        console.log(quickSort2(arr2))
        /**

         * 快速排序（使用 splice）

         * @param arr 原数组

         * @returns 排序的数组

         */

        function quickSort1(arr) {

            let length = arr.length

            if (length <= 1) return arr

  

            const midIndex = Math.floor(length / 2) // 中间的 index

            const midValue = arr.splice(midIndex, 1)[0] // 中间的值。splice 会修改数组

            const left = []

            const right = []

  

            // 注意这里使用 arr.length ，arr 被修改了

            for (let i = 0; i < arr.length; i++) {

                const n = arr[i]

                if (n < midValue) {

                    // 小于 midValue ，则放在左侧

                    left.push(n)

                } else {

                    // 大于等于 midValue ，则放在右侧

                    right.push(n)

                }

            }

  

            return quickSort1(left).concat(

                [midValue],

                quickSort1(right)

            )

        }

  

        /**

         * 快速排序（使用 slice）

         * @param arr 原数组

         * @returns 排序的数组

         */

        function quickSort2(arr) {

            const length = arr.length

            if (length <= 1) return arr

  

            const midIndex = Math.floor(length / 2) // 中间的 index

            const midValue = arr.slice(midIndex, midIndex + 1)[0] // 中间的值。注意，使用 slice，原数组没有改动

  

            const left = []

            const right = []

  

            for (let i = 0; i < length; i++) {

                if (i !== midIndex) {

                    const n = arr[i]

                    if (n < midValue) {

                        // 小于 midValue ，则放在左侧

                        left.push(n)

                    } else {

                        // 大于等于 midValue ，则放在右侧

                        right.push(n)

                    }

                }

            }

  

            return quickSort2(left).concat(

                [midValue],

                quickSort2(right)

            )

        }

  

```

### 并集 交集

```js
        const arr1 = [1, 3, 4, 6, 7]

        const arr2 = [2, 5, 3, 6, 1]

  

        // 交集

        function getIntersection(arr1, arr2) {

            const res = new Set()

            const set2 = new Set(arr2)

            for (let item of arr1) {

                if (set2.has(item)) { // 注意，这里要用 Set has 方法，比数组的 includes 快很多

                    res.add(item)

                }

            }

            return Array.from(res)

        }

  

        // 并集

        function getUnion(arr1, arr2) {

            const res = new Set(arr1)

            for (let item of arr2) {

                res.add(item) // 利用 Set 自动去重的特性

            }

            return Array.from(res)

        }

  

        // 测试

        console.log('交集', getIntersection(arr1, arr2))

        console.log('并集', getUnion(arr1, arr2))
```


### `for...await...of` 与 `Promise.all` 有什么本质区别？

**答案**：

- **执行顺序与特性**:
    - `Promise.all` 是并发执行的。它接收一个 Promise 数组，并返回一个新的 Promise，当所有输入 Promise 都 resolve 时，它才会 resolve。如果其中任何一个 reject，`Promise.all` 就会立即 reject。
    - `for...await...of` 是按顺序执行的（串行）。它会等待当前迭代的 Promise 完成后，才会进行下一次迭代。
- **使用场景**: 如果任务之间没有依赖关系且需要追求速度，使用 `Promise.all`；如果任务需要严格按顺序执行（例如上一个任务的结果是下一个任务的参数），则使用 `for...await...of`。

### 如果在 `for...await...of` 循环中，其中一个 Promise 失败（reject）了会发生什么？

**答案**： 当 `for...await...of` 遍历到的某个 Promise 被 reject 时，循环会立即终止（停止迭代），并抛出异常。如果需要处理该错误，必须在 `async` 函数内部使用 `try...catch` 语句块包裹该循环，或者对迭代数组中的每个 Promise 进行单独的错误处理（如 `.catch()`）。

#### 2. 闭包为什么会导致内存泄漏？

**答案**：闭包使得函数内的局部变量一直处于存活状态。若闭包长时间持有这些变量且不使用，或该函数被长期挂载在全局作用域上，这些内存就无法被 GC 回收。


#### 5. 列举三种常见的 JS 内存泄漏场景。

**答案**：

1. **全局变量意外声明**：未定义的变量直接赋值，自动挂载到 `window`。
2. **未解绑的事件监听器**：未清理 DOM 上的事件处理器，导致其引用的组件无法被销毁。
3. **闭包或定时器不当使用**：如 `setInterval` 未调用 `clearInterval`，或闭包中持有庞大的数据对象且长时间未置空。

#### 5. 除了闭包，还有哪些开发习惯容易导致内存泄漏？

**答案**：

- **全局变量滥用**：在 `window` 上挂载大型数据。
- **定时器未清除**：`setInterval` 若未及时 `clearInterval`，其回调逻辑会一直运行。
- **DOM 引用未清理**：虽然 DOM 节点被从页面中移除，但 JS 代码中仍保留了对该 DOM 节点的引用，导致整个节点树无法被回收


### 获取1-10000之前所有的对称数（回文数）

```typescript
function findPalindrome1(max: number) {
  const numbers = [];
  
  // 边界情况处理
  if (max <= 0) return numbers;
  
  // 从1遍历到max
  for (let i = 1; i <= max; i++) {
    // 转换为字符串
    const s = i.toString();
    
    // 转换成数组，反转，再拼接
    const reversed = s.split('').reverse().join('');
    
    // 比较原字符串和反转后的字符串
    if (s === reversed) {
      numbers.push(i);
    }
  }
  
  return numbers;
}
```

字符串首尾比较法

```typescript
function findPalindrome2(max: number) {
  const numbers = [];
  
  if (max <= 0) return numbers;
  
  for (let i = 1; i <= max; i++) {
    const s = i.toString();
    
    // 字符串首尾比较
    let flag = true;  // 标记是否为回文
    let startIndex = 0;  // 字符串开始位置
    let endIndex = s.length - 1;  // 字符串结束位置
    
    while (startIndex < endIndex) {
      if (s[startIndex] !== s[endIndex]) {
        flag = false;
        break;
      }
      startIndex++;
      endIndex--;
    }
    
    if (flag) {
      numbers.push(i);
    }
  }
  
  return numbers;
}
```

### **isObjectEqual** - 对象深度比较
```js
/**
 * @description 深度比较两个对象是否相等
 * @param {Object} obj1 - 第一个对象
 * @param {Object} obj2 - 第二个对象
 * @returns {boolean} 如果所有属性都相同返回true，否则返回false
 * @example
 * const obj1 = { a: 1, b: 2 }
 * const obj2 = { a: 1, b: 2 }
 * const isEqual = isObjectEqual(obj1, obj2)
 * // 结果: true
 */
function isObjectEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  
  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      return false
    }
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }
  
  return true
}
```

# `==`（相等）和 `===`（全等）
### 简单题
1. **题目：`==`（相等）和 `===`（全等）运算符的主要区别是什么？**
   * **答案：** `==` 在进行比较前会进行隐式类型转换，而 `===` 不会转换类型，要求类型和值必须完全相同。

2. **题目：`null == undefined` 的结果是什么？为什么？**
   * **答案：** 结果为 `true`。根据 JavaScript 规范，`null` 和 `undefined` 在相等运算符下是相等的。

3. **题目：`NaN == NaN` 的结果是什么？**
   * **答案：** 结果为 `false`。根据规则，只要操作数中存在 `NaN`，`==` 运算符就会返回 `false`。

4. **题目：在 JavaScript 中，`'55' == 55` 的结果是多少？**
   * **答案：** `true`。因为 `==` 运算符会将字符串 `'55'` 尝试转换为数值 `55`，再进行比较。

5. **题目：为什么开发中推荐优先使用 `===`？**
   * **答案：** `==` 运算符的隐式类型转换机制可能会导致一些违反直觉的结果（如 `0 == ''` 为 `true`），使用 `===` 可以避免这种不确定性，代码逻辑更清晰。

### 中等题
1. **题目：请写出以下代码的执行结果，并解释原因：**
   ```js
   console.log(false == '0');
   console.log(false == 'false');
   ```
   * **答案：**
     * `false == '0'` 为 `true`。因为在比较布尔值和字符串时，两者都会转换为数值，`false` 转为 `0`，`'0'` 转为 `0`，故相等。
     * `false == 'false'` 为 `false`。因为字符串 `'false'` 转换为数值时为 `NaN`，`0 == NaN` 为 `false`。

2. **题目：在什么情况下建议使用 `==` 而不是 `===`？**
   * **答案：** 当需要判断一个对象属性（可能为 `null` 或 `undefined`）是否“不存在”时，可以使用 `obj.x == null`。这是一种简洁的写法，等同于 `obj.x === null || obj.x === undefined`，能同时捕获 `null` 和 `undefined`。

# `call`、`apply` 和 `bind`
根据 `docs/JavaScript/bind_call_apply.md` 的内容，整理如下面试题：
### 简单题
1. **题目：`call`、`apply` 和 `bind` 的主要作用是什么？**
   * **答案：** 它们的作用都是改变函数执行时的上下文（即改变函数内部 `this` 的指向）。

2. **题目：`call` 和 `apply` 在传参方式上有什么区别？**
   * **答案：** `call` 接收的是参数列表；而 `apply` 接收的是一个包含参数的数组。

3. **题目：`call`、`apply` 和 `bind` 在执行时机上有什么本质区别？**
   * **答案：** `call` 和 `apply` 在改变 `this` 指向的同时会立即执行函数；而 `bind` 不会立即执行，而是返回一个改变了 `this` 指向的新函数。

4. **题目：如果 `call`、`apply` 或 `bind` 的第一个参数传入 `null` 或 `undefined`，`this` 会指向哪里？**
   * **答案：** 在浏览器环境下，`this` 会默认指向全局对象 `window`。

5. **题目：如何实现函数参数的分步传入？**
   * **答案：** 可以使用 `bind` 方法，因为 `bind` 支持在绑定时传入部分参数，并在返回的新函数调用时传入剩余参数。

### 中等题
1. **题目：为什么在定时器（如 `setTimeout`）中直接使用对象的方法会导致 `this` 指向改变？**
   * **答案：** 因为定时器中的回调函数在执行时，其所处的执行上下文为全局环境，因此其中的 `this` 默认指向了 `window` 对象，而不是原对象。

2. **题目：在实现 `bind` 时，为什么要考虑 `new` 关键字的情况？**
   * **答案：** 因为通过 `bind` 返回的函数可能被当作构造函数使用（即通过 `new` 调用）。在这种情况下，绑定时的 `context` 应当失效，`this` 应该指向 `new` 创建的实例对象，因此需要通过 `this instanceof Fn` 进行判断。

# `cookie`、`localStorage`、`sessionStorage`
根据 `docs/JavaScript/cache.md` 的内容，整理如下面试题：

### 简单题
1. **题目：JavaScript 中常见的本地存储方式有哪些？**
   * **答案：** 主要有四种：`cookie`、`localStorage`、`sessionStorage` 和 `indexedDB`。

2. **题目：`localStorage` 和 `sessionStorage` 在生命周期上有何不同？**
   * **答案：** `localStorage` 是持久化存储，除非主动删除否则永不过期；`sessionStorage` 的数据仅在当前浏览器窗口（会话）关闭后自动删除。

3. **题目：`cookie` 的存储大小限制是多少？**
   * **答案：** `cookie` 的大小一般不超过 4KB。

4. **题目：为什么说 `cookie` 不适合大量数据存储？**
   * **答案：** 因为 `cookie` 的存储空间极其有限（4KB），并且在每次 HTTP 请求中都会自动发送给服务器，会增加不必要的流量开销。

5. **题目：`localStorage` 存储数据时有什么需要注意的局限性？**
   * **答案：** 它只能存入字符串，不能直接存储 JavaScript 对象（存对象时会自动转为 `[object Object]`）；且由于本质是同步读取字符串，大量数据时可能导致页面卡顿。

### 中等题
1. **题目：简述 `localStorage`、`sessionStorage` 和 `cookie` 在数据交互上的区别。**
   * **答案：** `cookie` 的数据会在每次 HTTP 请求中自动传递给服务器，服务器也可以读写 `cookie`；而 `localStorage` 和 `sessionStorage` 仅在本地保存，不会自动与服务器交互。

2. **题目：相比于 `Web Storage` (localStorage/sessionStorage)，使用 `indexedDB` 的优缺点是什么？**
   * **答案：**
     * **优点：** 存储量几乎无上限，支持存储结构化数据，所有操作均为异步（性能更好），且支持存 JS 对象。
     * **缺点：** API 操作非常繁琐，使用门槛较高。推荐使用封装库（如 `Godb.js`）来降低操作难度。
# 闭包
根据 `docs/JavaScript/closure.md` 的内容，整理如下面试题：
### 简单题
1. **题目：什么是闭包（Closure）？**
   * **答案：** 闭包是指一个函数与对其周围状态（词法环境）的引用捆绑在一起的组合。简而言之，它允许内层函数访问外层函数的作用域。

2. **题目：闭包使用场景中，核心的两点是什么？**
   * **答案：** 创建私有变量 和 延长变量的生命周期。

3. **题目：为什么说闭包可以延长变量的生命周期？**
   * **答案：** 因为闭包会保存对创建时所在词法环境的引用。即便外层函数执行完毕，其执行上下文被销毁，但由于闭包的存在，该词法环境依然被保留在内存中。

4. **题目：JavaScript 中如何使用闭包模拟私有变量？**
   * **答案：** 通过函数立即执行（IIFE）返回一个包含公共方法的对象，这些方法可以访问函数内部定义的变量，从而实现外部无法直接修改私有变量，只能通过公共接口操作。

5. **题目：为什么频繁使用闭包可能会导致性能问题？**
   * **答案：** 因为闭包会导致相关变量无法被垃圾回收机制正常清理，从而增加内存消耗，在处理速度和内存管理方面对脚本性能有潜在负面影响。

### 中等题
1. **题目：什么是函数柯里化（Currying）？闭包在其中起到了什么作用？**
   * **答案：** 柯里化是指将一个接收多个参数的函数转化为接收部分参数并返回一个新函数的方法。闭包在其中起到了“记住”并“重用”已传入参数的作用，避免了频繁调用具有相同参数的函数。

2. **题目：为什么在创建类的方法时，推荐将方法定义在原型（prototype）上，而不是定义在构造器内？**
   * **答案：** 因为定义在构造器内，每个对象实例被创建时，方法都会被重新赋值，这浪费了内存且没利用到闭包的好处。定义在原型上可以实现所有实例共享同一方法，减少了内存开销。
# 大文件上传
根据 `docs/JavaScript/continue_to_upload.md` 的内容，整理如下面试题：
### 简单题
1. **题目：什么是分片上传？它的主要作用是什么？**
   * **答案：** 将大文件按照一定的大小切割成多个较小的数据块（Part）分别进行上传。主要作用是解决服务器处理能力限制、请求超时及网络波动导致的大文件上传失败问题，提升用户体验。

2. **题目：什么是断点续传？**
   * **答案：** 指在上传或下载任务中断后，能够从已完成的部分继续进行，而无需从头开始。

3. **题目：在实现分片上传时，如何保证文件的唯一性？**
   * **答案：** 通常使用文件的 `md5` 编码作为唯一性标识。

4. **题目：如何暂停正在进行中的分片上传？**
   * **答案：** 可以使用 `XMLHttpRequest` 对象的 `abort()` 方法来取消正在进行的请求。

5. **题目：分片上传后，服务端如何处理？**
   * **答案：** 服务端在接收到所有数据块后，会判断数据是否完整，若完整，则将所有分片按照顺序整合成原始的完整文件。

### 中等题
1. **题目：请简述实现断点续传的后端逻辑思路。**
   * **答案：** 前端上传时通过 MD5 标识文件。后端在接收时，根据 MD5 值检查服务器磁盘上是否存在未完成的“半成品”文件。若存在，后端根据已保存的切片数量，告知前端应从第几个分片开始上传。

2. **题目：如果在前端无法直接获取文件类型（如某些设备），该如何处理？**
   * **答案：** 可以通过读取文件的二进制流，解析其文件头信息（如文件起始的字节序列）来匹配常见文件格式（如 PNG、JPG、MP4 等）的十六进制签名，从而判断文件类型。

# 浅拷贝 深拷贝
根据 `docs/JavaScript/copy.md` 的内容，整理如下面试题：
### 简单题
1. **题目：什么是浅拷贝？**
   * **答案：** 浅拷贝只拷贝一层，如果属性是基本类型，拷贝的是值；如果属性是引用类型，拷贝的是内存地址，因此新旧对象会共享同一块内存，修改一个会影响另一个。

2. **题目：什么是深拷贝？**
   * **答案：** 深拷贝会递归拷贝深层次的对象，在新内存中开辟一个新的栈空间，使得新对象与原对象完全独立，修改新对象不会改变原对象。

3. **题目：JavaScript 中常见的浅拷贝方式有哪些？**
   * **答案：** `Object.assign()`、`Array.prototype.slice()`、`Array.prototype.concat()` 以及使用扩展运算符（`...`）。

4. **题目：使用 `JSON.stringify()` 进行深拷贝有什么明显的弊端？**
   * **答案：** 它会忽略 `undefined`、`symbol` 和 `函数` 这些类型，拷贝时会导致这些数据丢失。

5. **题目：为什么在 JavaScript 中需要区分深拷贝和浅拷贝？**
   * **答案：** 因为引用类型数据存放在堆内存中，变量存储的是指向堆内存的地址。直接赋值或浅拷贝会导致多个变量指向同一个对象，操作时容易产生副作用，而深拷贝能确保数据的独立性。

### 中等题
1. **题目：在手写递归深拷贝时，为什么要使用 `WeakMap`（或 `hash` 表）？**
   * **答案：** 为了解决对象中可能存在的“循环引用”问题。如果不使用 `WeakMap` 存储已经遍历过的对象，递归过程中遇到循环引用会导致栈溢出；使用 `WeakMap` 可以缓存已拷贝的对象，直接返回该引用。

2. **题目：如何理解浅拷贝中的“共享内存地址”？**
   * **答案：** 指的是对象内的引用类型属性（如数组、对象），浅拷贝只会复制该属性的引用指针，而不是重新创建一个新的对象。因此，新旧对象通过该引用指针指向了堆内存中的同一个实际对象，任何一方通过该指针修改数据，都会反映在另一方中。


1. **题目：为什么在 JavaScript 中 `0.1 + 0.2 === 0.3` 的结果为 `false`？**
    
    - **答案：** 因为 JavaScript 中的数字采用 IEEE754 双精度浮点数编码。0.1 和 0.2 在转换为二进制存储时是无限循环小数，由于精度限制（52 位尾数），计算机只能存储其近似值，导致运算结果产生微小误差。



# `typeof instanceof
根据 `docs/JavaScript/typeof_instanceof.md` 的内容，整理如下面试题：

### 简单题
1. **题目：`typeof` 操作符的返回值是什么？它主要用于什么目的？**
   * **答案：** `typeof` 返回一个表示数据类型的字符串。主要用于判断基本数据类型（如 number、string、boolean 等）以及函数（function）。

2. **题目：`typeof null` 的结果是什么？这是一个正确的设计吗？**
   * **答案：** 结果是 `'object'`。这不是正确的设计，它是 JavaScript 早期版本遗留下来的一个悠久的 Bug，并不代表 `null` 是对象。

3. **题目：`instanceof` 运算符的作用是什么？**
   * **答案：** 用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

4. **题目：`typeof` 对于判断引用类型数据有什么局限性？**
   * **答案：** 除了 `function` 类型能被正确识别外，其余所有的引用类型（如对象、数组等）用 `typeof` 判断都会返回 `'object'`。

5. **题目：如何判断一个变量是否已声明（且不报错）？**
   * **答案：** 可以使用 `typeof variable !== 'undefined'` 进行判断，即使变量未声明，这样写也不会抛出 ReferenceError。

### 中等题
1. **题目：简述 `instanceof` 的实现原理。**
   * **答案：** 其核心是顺着实例对象的原型链（`__proto__`）向上查找，看能否在原型链中找到与构造函数的 `prototype` 属性相等的对象。如果找到则返回 `true`，否则直到原型链顶端（null）仍未找到，则返回 `false`。

2. **题目：为什么说 `Object.prototype.toString.call()` 是比 `typeof` 和 `instanceof` 更通用的类型检测方案？**
   * **答案：** `typeof` 无法区分复杂的对象类型（数组、正则等），`instanceof` 无法处理跨 iframe 或原型链被篡改的情况且无法判断基本类型。而 `Object.prototype.toString.call()` 可以统一返回 `"[object Type]"` 格式的字符串，能够精准区分所有基础类型和标准内置引用类型。

### 并集 交集

```js

```

### 并集 交集

```js

```

### 并集 交集

```js

```

### 并集 交集

```js

```

### 并集 交集

```js

```