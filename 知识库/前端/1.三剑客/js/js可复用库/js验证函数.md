### **isPositiveInteger** - 判断是否为正整数
```js
/**
 * @description 判断输入值是否为正整数（包括0）。
 * @param {string|number} value - 需要判断的值。
 * @returns {boolean} 如果是正整数返回 `true`，否则返回 `false`。
 * 例子：
 * isPositiveInteger("123") // 返回 true
 * isPositiveInteger("0.5") // 返回 false
 */
isPositiveInteger(value) {
  return /(^[0-9]\d*$)/.test(value);
}
```

### **isPhone** - 匹配手机/电话号
```js
/**
 * @description 验证字符串是否符合手机号或座机号格式。
 * @param {string} str - 需要验证的字符串。
 * @returns {boolean} 如果匹配返回 `true`，否则返回 `false`。
 * 例子：
 * isPhone("13800138000")  // 返回 true
 * isPhone("010-12345678") // 返回 true
 */
isPhone(str) {
  let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
  return reg.test(str);
}
```

### **isEmail** - 匹配 Email 地址
```js
/**
 * @description 验证字符串是否符合 Email 地址格式。
 * @param {string} str - 需要验证的字符串。
 * @returns {boolean} 如果匹配返回 `true`，否则返回 `false`。
 * 例子：
 * isEmail("test@example.com") // 返回 true
 * isEmail("test@")            // 返回 false
 */
isEmail(str) {
  if (str == null || str == "") return false;
  var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
  if (result == null) return false;
  return true;
}
```

## 2. 表单验证工具类封装

```javascript
// 创建 utils/validator.js

class Validator {
  /**
   * 验证邮箱格式
   */
  static checkEmail(email) {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(email);
  }
  
  /**
   * 验证密码强度
   * @param {String} password - 密码
   * @returns {Object} {valid: Boolean, message: String, level: Number}
   */
  static checkPassword(password) {
    // 长度检查
    if (password.length < 6 || password.length > 20) {
      return {
        valid: false,
        message: '密码长度应为6-20位',
        level: 0
      }
    }
    
    // 强度检查
    let level = 0
    if (/[0-9]/.test(password)) level++ // 包含数字
    if (/[a-z]/.test(password)) level++ // 包含小写字母
    if (/[A-Z]/.test(password)) level++ // 包含大写字母
    if (/[^a-zA-Z0-9]/.test(password)) level++ // 包含特殊字符
    
    return {
      valid: true,
      message: ['弱', '中', '强', '很强'][level - 1],
      level: level
    }
  }
  
  /**
   * 验证两次密码是否一致
   */
  static checkPasswordMatch(password, confirmPassword) {
    return password === confirmPassword
  }
}