好的，我们来一步步拆解和完善这个任务。

### 一、总结与知识点补充

#### 1. 现有代码总结

您提供的代码实现了一个名为 `isEqual` 的函数，用于**深度比较**两个 JavaScript 变量（主要是对象或数组）是否值相等。它通过递归地遍历对象的每一个属性，对比它们的值，最终判断两个对象是否在结构和值上完全一致。

- `isObject` 是一个辅助函数，用来判断一个变量是否是对象或数组，并且排除了 `null` 这个特殊情况。
- `isEqual` 是核心函数，它首先处理非对象情况，然后检查引用是否相同，再比较属性数量，最后递归比较每个属性的值。

#### 2. 问题与知识点补充

现有代码存在一些问题和可以优化的点，这正是学习的关键：

1.  **循环引用**：如果一个对象的属性直接或间接引用了它自身，递归会陷入死循环，导致栈溢出。例如 `const a = {}; a.self = a; isEqual(a, a);`。
2.  **数组处理不严谨**：代码将数组和对象同等对待，通过 `Object.keys()` 比较。虽然在多数情况下可行，但它不是处理数组的标准方式，并且如果数组带有额外的自定义属性，可能会导致误判。
3.  **特殊对象类型**：`Date`、`RegExp` 等内置对象，如果仅比较它们的属性，结果可能不是我们想要的。我们通常希望比较它们实际的值（如日期的时间戳，正则表达式的模式和标志）。
4.  **性能**：可以通过缓存已比较过的对象对，来优化循环引用的检查并提升性能。

### 二、开发文档

---

### **功能名称：`deepEqual` - 深度相等判断工具**

#### 一、功能概述

`deepEqual` 是一个高效且健壮的工具函数，用于判断两个 JavaScript 变量是否在值层面完全相等。它能够处理原始类型、对象、数组，并能正确处理循环引用、`Date` 和 `RegExp` 等特殊对象类型。

#### 二、完整代码（增强版）

```javascript
/**
 * @description 判断是否是对象或数组，排除 null
 * @param {any} value 待检查的值
 * @returns {boolean}
 */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

/**
 * @description 深度比较两个变量是否相等
 * @param {any} obj1 变量1
 * @param {any} obj2 变量2
 * @param {Map} [cache=new Map()] 用于处理循环引用的缓存，外部调用时无需传递
 * @returns {boolean}
 */
function deepEqual(obj1, obj2, cache = new Map()) {
    // 1. 如果不是对象或数组，直接使用 === 比较 (处理原始类型和函数)
    if (!isObject(obj1) || !isObject(obj2)) {
        return obj1 === obj2;
    }

    // 2. 如果两个变量引用了同一个内存地址，则它们必然相等
    if (obj1 === obj2) {
        return true;
    }

    // 3. 检查循环引用：如果之前已经比较过这对对象，则直接返回true
    // 如果 cache.get(obj1) === obj2，说明在本次递归中，obj1 和 obj2 的组合已经出现过了
    if (cache.has(obj1) && cache.get(obj1) === obj2) {
        return true;
    }

    // 4. 将当前比较的对象对存入缓存
    cache.set(obj1, obj2);

    // 5. 特殊对象处理：Date 和 RegExp
    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }
    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
        return obj1.source === obj2.source && obj1.flags === obj2.flags;
    }

    // 6. 数组处理：如果其中一个是数组，要求另一个也必须是数组
    const isArray1 = Array.isArray(obj1);
    const isArray2 = Array.isArray(obj2);
    if (isArray1 !== isArray2) {
        return false;
    }
  
    // 如果都是数组
    if (isArray1) {
        if (obj1.length !== obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
            // 递归比较数组的每一项
            if (!deepEqual(obj1[i], obj2[i], cache)) {
                return false;
            }
        }
        return true;
    }
  
    // 7. 对象处理
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 比较属性数量
    if (keys1.length !== keys2.length) {
        return false;
    }

    // 遍历属性，递归比较
    for (const key of keys1) {
        // 确保 obj2 也有这个 key
        if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
            return false;
        }
        // 递归比较属性值
        if (!deepEqual(obj1[key], obj2[key], cache)) {
            return false;
        }
    }

    // 8. 所有检查通过，对象相等
    return true;
}


// --- 补充的测试用例 ---

// 1. 基本对象和数组
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
console.log('基本对象:', deepEqual(obj1, obj2)); // true

const arr1 = [1, [2, 3]];
const arr2 = [1, [2, 3]];
const arr3 = [1, [2, 4]];
console.log('基本数组:', deepEqual(arr1, arr2)); // true
console.log('不同数组:', deepEqual(arr1, arr3)); // false

// 2. 循环引用
const circular1 = {};
circular1.self = circular1;
const circular2 = {};
circular2.self = circular2;

const circular3 = { a: circular1 };
const circular4 = { a: circular2 };
console.log('循环引用:', deepEqual(circular3, circular4)); // true

// 3. 特殊对象类型
const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
console.log('日期对象:', deepEqual(date1, date2)); // true

const regexp1 = /ab+c/i;
const regexp2 = new RegExp('ab+c', 'i');
console.log('正则对象:', deepEqual(regexp1, regexp2)); // true

// 4. 混合类型
const mixed1 = { a: 1, b: arr1, c: date1 };
const mixed2 = { a: 1, b: arr2, c: date2 };
console.log('混合类型:', deepEqual(mixed1, mixed2)); // true

// 5. 属性顺序不同
const order1 = { a: 1, b: 2 };
const order2 = { b: 2, a: 1 };
console.log('属性顺序不同:', deepEqual(order1, order2)); // true

```

#### 三、核心知识点学习

1.  **递归思想**：函数通过调用自身来处理嵌套的数据结构（如对象中的对象，数组中的数组），这是处理树状或层级结构的标准模式。
2.  **JS 类型判断**：
    *   `typeof`：用于区分原始类型，但 `typeof null` 是 `'object'`，`typeof []` 也是 `'object'`，功能有限。
    *   `instanceof`：用于判断一个对象是否是某个构造函数的实例，适合判断 `Date`, `RegExp` 等。
    *   `Array.isArray()`：是判断一个变量是否为数组的最可靠方法。
3.  **循环引用处理**：
    *   **问题**：递归调用时，如果遇到 `a.b = a` 这样的结构，会无限循环 `deepEqual(a, ...)` -> `deepEqual(a.b, ...)` -> `deepEqual(a, ...)`。
    *   **解决方案**：使用 `Map` 作为缓存（`cache`）。在每次比较两个对象前，将这对对象（`obj1`, `obj2`）存入 `Map`。在递归的开始，检查当前要比较的 `(obj1, obj2)` 是否已存在于缓存中。如果存在，说明遇到了循环，并且因为它们之前已经被比较过（能递归到这一步说明之前的比较都是通过的），所以直接返回 `true`，中断无限递归。
4.  **`Object.keys()` vs `for...in`**：
    *   `Object.keys(obj)`：返回一个数组，包含对象自身（不含继承）的所有**可枚举**属性的键名。
    *   `for...in`：会遍历对象自身及其原型链上的所有可枚举属性。通常需要配合 `hasOwnProperty` 使用以避免遍历到原型链上的属性。`Object.keys()` 更直接和安全。
5.  **引用 vs 值**：`obj1 === obj2` 比较的是两个变量是否指向内存中的同一个对象（引用相等），而 `deepEqual` 追求的是它们的内容是否相同（值相等）。

#### 四、用途（使用场景）

此函数在需要精确判断数据是否变化的场景中非常有用，可以避免不必要的计算和渲染。

1.  **前端框架性能优化**：
    *   在 React 中，可以在 `React.memo` 的第二个参数（比较函数）或 `shouldComponentUpdate` 生命周期函数中使用，以防止因父组件重新渲染而导致的不必要的子组件渲染。
    *   在 Vue 中，可以用在 `watch` 的 `deep: true` 场景下，手动进行更精细的控制，或者在组合式 API 中用于 `watchEffect` 的依赖追踪优化。
2.  **状态管理**：在 Redux、Vuex 等状态管理库中，判断新的 state 是否与旧的 state 真正发生了变化，从而决定是否通知组件更新。
3.  **单元测试**：在测试框架（如 Jest, Mocha）中，断言两个复杂的对象或数组是否符合预期结果，例如 `assert.deepStrictEqual` 的底层实现就类似此函数。
4.  **数据缓存/记忆化（Memoization）**：对于一个接受复杂对象作为参数的计算密集型函数，可以将参数和计算结果缓存起来。下次调用时，使用 `deepEqual` 判断参数是否与缓存中的相同，如果相同则直接返回缓存结果。
5.  **表单数据**：判断用户是否修改了表单的初始数据，以决定“保存”按钮是否可用，或在用户离开页面时是否弹出“未保存”提示。

[标签: JavaScript 深度比较] 递归, 循环引用处理

---

### 四、面试官考察

#### 如果我是面试官，我会这样考察（基于原始代码）：

**10 道技术题**

1.  `isObject` 函数为什么要加 `obj !== null` 的判断？ `typeof null` 的结果是什么？
    *   **答案**: 因为 `typeof null` 在 JavaScript 中历史遗留问题导致其结果是 `'object'`。如果不加这个判断，`null` 会被当作对象处理，在后续的 `Object.keys(null)` 中会直接抛出错误。
2.  请解释一下 `isEqual` 函数中递归是如何发生的。
    *   **答案**: 当函数遍历到 `obj1` 的某个属性 `key` 时，它会用 `obj1[key]` 和 `obj2[key]` 作为新的参数再次调用 `isEqual` 函数自身。这个过程会一直持续，直到遇到非对象的值或者比较出结果，然后逐层返回。
3.  如果 `obj1 = {a: 1, b: 2}` 而 `obj2 = {b: 2, a: 1}`，这个函数会返回 `true` 还是 `false`？为什么？
    *   **答案**: 会返回 `true`。因为 `Object.keys()` 在现代 JavaScript 引擎中虽然通常会按属性创建顺序返回键，但 `isEqual` 的逻辑并不依赖于键的顺序。它遍历 `obj1` 的键，然后在 `obj2` 中查找对应的值进行比较，只要所有键值对都能对应上且属性数量相同，就判定为相等。
4.  这个 `isEqual` 实现有什么严重的潜在问题？请举例说明。
    *   **答案**: 最大的问题是无法处理**循环引用**。例如 `const a = {}; a.self = a; const b = {}; b.self = b; isEqual(a, b);` 会导致无限递归，最终栈溢出（Maximum call stack size exceeded）。
5.  这个函数如何处理数组的比较？你认为这种处理方式有什么优缺点？
    *   **答案**: 它将数组当作普通对象处理，通过 `Object.keys()` 获取索引（字符串形式的 '0', '1', '2'），然后比较对应索引的值。优点是代码逻辑统一。缺点是不够严谨，例如它无法区分 `[1, 2]` 和 `{ '0': 1, '1': 2 }`，并且如果一个数组有额外的非索引属性，可能会导致与另一个纯数组比较时出错。
6.  `if (obj1 === obj2)` 这个判断有什么作用？为什么它要放在最前面？
    *   **答案**: 这是一个重要的性能优化。如果两个变量指向内存中的同一个对象，那么它们必然是深度相等的。将其放在前面可以立即返回 `true`，避免了后续耗时的大量递归比较。
7.  如果对象的某个属性值是 `NaN`，`isEqual({a: NaN}, {a: NaN})` 会返回什么？
    *   **答案**: 会返回 `false`。因为递归到最后一层会执行 `NaN === NaN`，而这个表达式的结果是 `false`。一个更完善的深度比较函数通常会特殊处理 `NaN`，认为 `NaN` 和 `NaN` 是相等的。
8.  如果对象的属性值是一个函数，比较结果会是什么？
    *   **答案**: 函数会被当作值类型处理（因为 `isObject` 对函数返回 `false`）。比较会变成 `func1 === func2`，只有当它们是同一个函数（引用相同）时才返回 `true`。这通常是期望的行为。
9.  `obj1Keys.length !== obj2Keys.length` 这个检查为什么是必要的？
    *   **答案**: 这是另一个性能优化。如果两个对象的属性数量不同，它们肯定不相等。这个检查可以提前终止比较，避免不必要的 `for...in` 循环和递归。
10. `for...in` 循环和 `Object.keys()` 遍历有什么区别？这里为什么用 `Object.keys()` 更好？
    *   **答案**: `for...in` 会遍历对象自身及其原型链上的所有可枚举属性。而 `Object.keys()` 只返回对象自身的可枚举属性键名。在这里使用 `Object.keys()` 更好，因为它避免了意外比较到原型链上的属性，更安全和精确。

**5 道业务逻辑题**

1.  在一个 React 应用中，有一个传递复杂 `props` 的子组件。为了性能优化，你使用了 `React.memo`。但发现组件还是会不必要地重渲染，你猜测是 `props` 比较出了问题。你会如何利用 `isEqual` 这样的函数来解决？
    *   **答案**: `React.memo` 默认进行的是浅比较。当 `props` 是一个对象或数组时，即使内容没变，只要引用变了，浅比较就会认为是 `false`。我会将 `isEqual` (或`deepEqual`) 作为 `React.memo` 的第二个参数传入：`React.memo(MyComponent, deepEqual)`。这样 React 就会使用深度比较来判断 `props` 是否真的改变，从而精确地控制组件的重渲染。
2.  一个用户个人资料页面，数据从后端获取后填充到表单里。如何使用 `isEqual` 函数来判断用户是否做出了修改，从而决定“保存”按钮是否可点击？
    *   **答案**: 在组件加载时，将从后端获取的初始数据深拷贝一份，存为 `initialProfile`。将表单当前的数据绑定到另一个状态变量 `currentProfile`。在表单的任何输入变化时，都调用 `deepEqual(initialProfile, currentProfile)`。如果返回 `false`，说明数据已被修改，可以激活“保存”按钮；如果返回 `true`，则禁用它。
3.  我们有一个数据同步服务，客户端会定期向服务器报告其本地数据。为了节省带宽，我们只希望在数据真正变化时才发送请求。你会如何设计这个逻辑？
    *   **答案**: 在客户端维护一个 `lastSyncedData` 的变量，存储上次成功同步到服务器的数据。当需要进行同步检查时，获取当前的本地数据 `currentData`。调用 `deepEqual(lastSyncedData, currentData)`。只有当结果为 `false` 时，才向服务器发起同步请求，并在成功后更新 `lastSyncedData = deepCopy(currentData)`。
4.  一个在线图表库，用户可以通过一个复杂的配置对象来定制图表样式。每次配置更新，我们都需要重绘整个图表，这是一个昂贵的操作。如何优化？
    *   **答案**: 当用户更改配置并触发更新时，不要立即重绘。而是将新的配置对象 `newConfig` 与当前的配置对象 `currentConfig` 进行 `deepEqual` 比较。如果 `deepEqual(newConfig, currentConfig)` 返回 `true`，说明用户的操作并未改变最终的配置（比如输入一个值又删掉），此时就跳过重绘操作。
5.  在 Redux 中，reducer 必须是纯函数并返回一个新的 state 对象。为什么即使我们遵循了这个规则，有时也需要 `deepEqual` 这样的工具？
    *   **答案**: 虽然 reducer 返回了新的 state 对象（引用变了），但新 state 的深层内容可能与旧 state 完全一样。在某些选择器（selector）或中间件中，我们可能想知道“值”是否真的变了。例如，一个用于缓存的 selector，如果输入的 state 片段经过 `deepEqual` 比较后发现没有变化，就可以直接返回上一次的计算结果，避免了复杂的派生数据计算。这与 Reselect 库的思想类似。

---

#### 针对补充后的完整例子的额外面试题：

**5 道技术追问**

1.  在新版的 `deepEqual` 中，`cache` 参数的作用是什么？为什么它是一个 `Map` 而不是一个普通对象或者 `Set`？
    *   **答案**: `cache` 用于解决循环引用的问题。它是一个 `Map`，键是 `obj1`，值是 `obj2`。`Map` 的优势在于它的键可以是任意类型，包括对象，而普通对象的键只能是字符串或 Symbol。我们不能用 `Set`，因为我们需要存储比较过的**对象对** (`obj1` 和 `obj2`)，而 `Set` 只能存储单个值。用 `cache.has(obj1) && cache.get(obj1) === obj2` 可以精确判断 `obj1` 和 `obj2` 这一对组合是否在当前的递归路径中出现过。
2.  请解释为什么对 `Date` 和 `RegExp` 对象需要进行特殊处理。
    *   **答案**: 如果不特殊处理，`Date` 和 `RegExp` 对象会被当作普通对象比较。对于两个值相同的 `Date` 对象 (`new Date('2023-01-01')`)，它们的内部属性可能因 JavaScript 引擎实现而异，或者没有可枚举的公共属性，导致比较失败。我们关心的是它们的实际时间值，所以通过 `getTime()` 比较时间戳是正确的。同理，对于正则表达式，我们关心的是它的模式 (`source`) 和标志 (`flags`)，而不是它的内部属性。
3.  处理数组的逻辑和处理对象的逻辑分开了，这样做的好处是什么？
    *   **答案**: 好处是更严谨和明确。首先，通过 `Array.isArray()` 确保了只有数组和数组才能互相比较，避免了数组和类数组对象（如 `{ '0': 1, '1': 2 }`）被错误地判为相等。其次，通过 `length` 属性和索引 `for` 循环来比较，这是处理数组的标准范式，比 `Object.keys()` 更具可读性和意图性。
4.  `if (isArray1 !== isArray2) return false;` 这行代码的意义是什么？
    *   **答案**: 这行代码确保了比较的两个值的类型一致性。如果一个是数组而另一个不是（但它们都是 `isObject` 返回 `true` 的类型，比如一个普通对象），那么它们肯定不相等。这避免了将数组和对象进行后续的错误比较。
5.  如何扩展这个 `deepEqual` 函数以支持 `Map` 和 `Set` 对象的比较？
    *   **答案**:
        *   **对于 `Set`**: 先判断 `instanceof Set`，然后比较 `size`。如果 `size` 相等，可以将一个 `Set` 转为数组，然后遍历这个数组，检查每一个元素是否存在于另一个 `Set` 中。
        *   **对于 `Map`**: 先判断 `instanceof Map`，然后比较 `size`。如果 `size` 相等，遍历一个 `Map` 的 `[key, value]` 对。对于每个 `key`，首先检查另一个 `Map` 中是否存在这个 `key`（`map2.has(key)`），然后递归调用 `deepEqual` 比较它们对应的 `value`。

**5 道业务逻辑追问**

1.  在一个协同编辑应用中（如 Google Docs），服务器会向客户端推送文档状态的 diff（差异）补丁。客户端应用补丁后，如何确保客户端的状态和服务器的预期状态一致？
    *   **答案**: 这
是一个非常好的验证场景。服务器在生成补丁的同时，也可以计算出应用补丁后的最终文档状态 `serverExpectedState`。当客户端应用完补丁后，得到自己的新状态 `clientNewState`。此时，客户端可以用 `deepEqual(clientNewState, serverExpectedState)` 来进行一次“断言”。如果返回 `false`，说明客户端的应用逻辑可能有误或存在状态不一致，此时可以触发一个全量同步请求，以服务器的状态为准进行覆盖，并上报错误日志。
2.  我们正在做一个 "undo/redo" 功能。每次用户操作后，我们都会将当前的 state 推入一个历史记录栈。如果用户快速连续进行了一些无效操作（例如，将文本加粗，然后立刻取消加粗），历史记录栈会变得臃肿。如何优化？
    *   **答案**: 在用户每次操作后，准备将新状态 `newState` 推入历史栈之前，先获取历史栈顶部的状态 `prevState`。调用 `deepEqual(newState, prevState)`。如果返回 `true`，说明这次操作是一个无效操作，最终状态没有改变，此时我们就不需要将 `newState` 推入栈中，从而保持历史记录的干净和高效。
3.  一个电商网站的购物车，用户可以修改商品数量。如果用户将商品 A 的数量从 2 改为 3，然后又改回 2，此时我们是否应该向后端发送更新请求？
    *   **答案**: 这取决于业务需求。但从技术上，我们可以利用 `deepEqual` 实现精准控制。将用户进入购物车时的初始状态 `initialCart` 深拷贝保存。当用户准备离开或结算时，将当前购物车状态 `currentCart` 与 `initialCart` 进行 `deepEqual` 比较。只有当 `deepEqual` 返回 `false` 时，才认为购物车有实际变更，触发后端更新请求。这样可以避免用户来回修改造成的无效网络请求。
4.  假设你正在构建一个可视化流程图编辑器，每个节点和连线都是一个对象，整个流程图是一个大的嵌套对象。当保存流程图时，如何只提交增量变化而不是整个大对象？
    *   **答案**: `deepEqual` 本身不直接产生增量，但它是实现增量计算的基础。保存时，我们可以将当前流程图对象 `currentState` 和上次保存的状态 `savedState` 进行比较。我们可以写一个 `diff(obj1, obj2)` 函数，该函数内部递归地使用 `deepEqual`。当 `deepEqual` 在某个层级返回 `false` 时，我们就记录下这个路径和变化的值，生成一个描述变化的"补丁"对象。最终只将这个“补丁”对象提交给后端。后端根据补丁来更新存储。
5.  在 A/B 测试系统中，我们会从云端拉取一份 JSON 配置来决定用户看到哪个版本的页面。为了避免每次页面加载都去请求，我们把配置缓存在本地。这个缓存的更新策略应该如何设计？
    *   **答案**: 可以在应用启动或特定时机异步去获取最新的云端配置 `remoteConfig`。获取后，与本地缓存的配置 `localConfig` 进行 `deepEqual` 比较。如果 `deepEqual(remoteConfig, localConfig)` 返回 `false`，说明配置有更新，此时才用新配置覆盖本地缓存，并可能需要刷新页面或提示用户以应用新配置。如果返回 `true`，则什么都不做，继续使用现有缓存，这样既保证了配置的及时更新，又避免了不必要的缓存读写和应用刷新。

---

### 五、快速使用指南（给未来的自己）

嘿，未来的我！如果你忘记了怎么用这个 `deepEqual` 函数，按下面三步走就行：

#### **第一步：复制代码**

把下面这份完整的、健壮的代码复制到你的项目里，通常放在一个工具文件里，比如 `src/utils/comparison.js`。

```javascript
// src/utils/comparison.js

/**
 * @description 判断是否是对象或数组，排除 null
 */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

/**
 * @description 深度比较两个变量是否相等，能处理循环引用
 */
export function deepEqual(obj1, obj2, cache = new Map()) {
    if (!isObject(obj1) || !isObject(obj2)) {
        return obj1 === obj2;
    }
    if (obj1 === obj2) {
        return true;
    }
    if (cache.has(obj1) && cache.get(obj1) === obj2) {
        return true;
    }
    cache.set(obj1, obj2);

    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }
    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
        return obj1.source === obj2.source && obj1.flags === obj2.flags;
    }

    const isArray1 = Array.isArray(obj1);
    const isArray2 = Array.isArray(obj2);
    if (isArray1 !== isArray2) {
        return false;
    }
  
    if (isArray1) {
        if (obj1.length !== obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
            if (!deepEqual(obj1[i], obj2[i], cache)) return false;
        }
        return true;
    }
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (!Object.prototype.hasOwnProperty.call(obj2, key) || !deepEqual(obj1[key], obj2[key], cache)) {
            return false;
        }
    }
    return true;
}
```

#### **第二步：导入函数**

在需要使用的地方，用 ES6 模块语法导入它。

```javascript
import { deepEqual } from './utils/comparison.js';
```

#### **第三步：直接使用**

把你想比较的两个变量传给它就行了，它会返回 `true` 或 `false`。

**示例：在 React 组件中防止不必要的计算**

假设你有一个昂贵的计算，只有当 `userData` 或 `config` 真正改变时才需要重新计算。

```jsx
import React, { useMemo, useState, useEffect } from 'react';
import { deepEqual } from './utils/comparison.js';

// 自定义一个 useDeepCompareMemo hook
const useDeepCompareMemo = (factory, deps) => {
    const ref = React.useRef();
    if (!ref.current || !deepEqual(deps, ref.current.deps)) {
        ref.current = { deps, value: factory() };
    }
    return ref.current.value;
};


function UserProfile({ userId }) {
    const [userData, setUserData] = useState({ name: '', details: {} });
  
    // 假设这是一个复杂的配置对象
    const config = { theme: 'dark', permissions: ['read', 'write'] };

    // useEffect(() => { ... fetch userData ... }, [userId]);

    // 使用我们自定义的 hook 来进行深度比较
    const processedData = useDeepCompareMemo(() => {
        // 这是一个非常昂贵的计算...
        console.log('正在进行昂贵的计算...');
        return `${userData.name} - ${JSON.stringify(userData.details)} - ${config.theme}`;
    }, [userData, config]); // 依赖项是复杂对象

    return <div>{processedData}</div>;
}
```

**简单总结：**

1.  **复制代码**到 `utils` 目录。
2.  **`import { deepEqual } from './utils/...'`**。
3.  **`deepEqual(val1, val2)`** -> `true` 或 `false`。

就是这么简单，去用吧！