

### ：数组去重算法

```javascript
uniqueFunc(arr, key) {
    const res = new Map();
    return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1));
}
```

**知识点详解：**

- **Map数据结构：** ES6键值对集合
  - **作用：** 存储键值对，键可以是任意类型
  - **性能：** 查找和插入操作时间复杂度O(1)
  - **与Object区别：** Map的键有序，性能更好，API更丰富

- **逻辑与运算符(&&)的巧妙用法：**
  - **`!res.has(item[key])`：** 检查Map中是否不存在该键
  - **`res.set(item[key], 1)`：** 设置键值对，返回Map实例（truthy值）
  - **短路求值：** 如果左侧为false，右侧不执行；如果左侧为true，执行右侧
  - **为什么这样写：** 一行代码同时完成"检查不存在"和"添加到Map"两个操作


### 3. 时间处理技巧

**时间戳获取**：

```javascript

// 方式1：

new Date().getTime()

  

// 方式2：

Date.now()

```

  

**时间格式化**：

```javascript

// 补零函数

addTimes(m) {

  return m < 10 ? '0' + m : m

}

  

// 使用

this.addTimes(5)   // '05'

this.addTimes(12)  // '12'

```

### **对象深度比较** - 判断两个对象是否完全相等
```js
/**
 * @description 浅层比较两个对象的属性名和属性值是否完全一致
 * @param {Object} obj1 - 第一个对象
 * @param {Object} obj2 - 第二个对象
 * @returns {boolean} 是否完全相等
 * @example
 *   isObjectEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 *   isObjectEqual({ a: 1, b: 2 }, { a: 1, b: 3 }); // false
 *   isObjectEqual({ a: 1 }, { a: 1, b: 2 });        // false
 */
function isObjectEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (let key in obj1) {
     // hasOwnProperty() 判断对象自身是否包含指定属性（不含原型链）
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
```

      //   17. 写出布尔类型的值为false 的值哪些
        // 0
        // ''
        // null
        // undefined
        // false
        // NaN


```js

```

```js

```

```js

```

```js

```

```js

```


```js

```

```js

```









