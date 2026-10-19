## 一、核心概念速览

jQuery是一个快速、小巧的JavaScript库,通过简洁的API让HTML文档遍历、DOM操作、事件处理、动画和Ajax变得极其简单。核心理念:**Write Less, Do More**

### 快速引入
```html
<!-- CDN方式 -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

---

## 二、核心语法深度解析

### 2.1 选择器系统 (5分钟掌握)

jQuery选择器基于CSS选择器,让DOM查找变得优雅:

```javascript
// 基础选择器
$('#id')              // ID选择器
$('.class')           // 类选择器
$('div')              // 标签选择器
$('*')                // 全选择器
$('div, p, span')     // 多选择器

// 层级选择器
$('div p')            // 后代选择器(所有后代)
$('div > p')          // 子选择器(直接子元素)
$('div + p')          // 相邻兄弟(紧接着的下一个)
$('div ~ p')          // 通用兄弟(之后所有兄弟)

// 过滤选择器
$('li:first')         // 第一个
$('li:last')          // 最后一个
$('li:eq(2)')         // 索引为2的元素
$('li:odd')           // 奇数索引
$('li:even')          // 偶数索引
$('div:not(.active)') // 排除某个类

// 属性选择器
$('[href]')                  // 有href属性
$('[href="#"]')              // href等于#
$('[href^="https"]')         // href以https开头
$('[href$=".pdf"]')          // href以.pdf结尾
$('[href*="jquery"]')        // href包含jquery

// 表单选择器
$(':input')           // 所有input/textarea/select/button
$(':text')            // type="text"
$(':checked')         // 被选中的checkbox/radio
$(':selected')        // 被选中的option
var province = $('#province option:selected').text();
$(':disabled')        // 禁用元素

$('.parent').children('.child');// 获取直接子元素
选择器可以链式调用: - 缓存选择器结果提升性能: var $menu = $('#menu');
$('div').find('p').filter('.active')
var $input = $(layero).find('.product[data-id="' + productId + '"]');
```

### 2.2 DOM操作 (7分钟掌握)

#### 内容操作
```javascript
// 读取/设置HTML内容
$('#box').html()                    // 获取
$('#box').html('<p>新内容</p>')     // 设置

// 读取/设置文本内容(自动转义HTML)
$('#box').text()                    // 获取
$('#box').text('纯文本')            // 设置

// 读取/设置表单值
$('input').val()                    // 获取
$('input').val('新值')              // 设置

var $form = $btn.closest('form');  //获取最近的form
$(this).data('id'); //获取自定义值data-id
```

#### 属性操作
```javascript
// attr: 操作HTML属性
$('img').attr('src')                      // 获取
$('img').attr('src', 'new.jpg')           // 设置单个
$('img').attr({                           // 设置多个
  src: 'new.jpg',
  alt: '图片描述'
})
$('img').removeAttr('title')              // 移除属性

// prop: 操作DOM属性(推荐用于checked/selected/disabled)
$(':checkbox').prop('checked')            // 获取
$(':checkbox').prop('checked', true)      // 设置
```

**关键区别**: `attr`操作HTML标记中的属性,`prop`操作DOM对象的属性。对于布尔值属性(如checked),优先使用`prop`。

#### 样式操作
```javascript
// CSS操作
$('div').css('color')                     // 获取
$('div').css('color', 'red')              // 设置单个
$('div').css({                            // 设置多个
  color: 'red',
  fontSize: '16px',
  'background-color': '#fff'
})

// 类操作
$('div').addClass('active')               // 添加类
$('div').removeClass('active')            // 移除类
$('div').toggleClass('active')            // 切换类
$('div').hasClass('active')               // 检查类
```

#### 节点操作
```javascript
// 插入内容
$('#box').append('<p>追加到末尾</p>')     // 内部末尾
$('#box').prepend('<p>插入到开头</p>')    // 内部开头
$('#box').after('<div>插入到后面</div>')  // 外部后面
$('#box').before('<div>插入到前面</div>') // 外部前面

// 包裹
$('p').wrap('<div></div>')                // 每个p外包裹div
$('p').wrapAll('<div></div>')             // 所有p外包裹一个div
$('p').wrapInner('<span></span>')         // p内容外包裹span

// 替换和删除
$('p').replaceWith('<div>新元素</div>')   // 替换
$('p').empty()                             // 清空子元素
$('p').remove()                            // 删除元素(包括事件)
$('p').detach()                            // 删除元素(保留事件)

// 克隆
$('div').clone()                           // 浅克隆
$('div').clone(true)                       // 深克隆(包括事件)
```

### 2.3 事件处理 (8分钟掌握)

#### 基础事件绑定
```javascript
// on方法 - 推荐的标准写法
$('#btn').on('click', function() {
  console.log('点击了按钮');
});

// 多事件绑定
$('#btn').on('mouseenter mouseleave', function(e) {
  console.log(e.type);  // mouseenter 或 mouseleave
});

// 命名空间(便于解绑特定事件)
$('#btn').on('click.myapp', handler);
$('#btn').off('click.myapp');  // 只解绑.myapp命名空间的事件

// 事件委托(性能优化关键!)
$('#list').on('click', 'li', function() {});
// 优势:动态添加的li也能响应事件

// 解绑事件
$('#btn').off('click');                    // 解绑所有click
$('#btn').off('click', handler);           // 解绑特定处理函数
$('#btn').off();                           // 解绑所有事件
```

#### 常用事件
```javascript
// 鼠标事件
$('#btn').click(handler)          // 点击
$('#btn').dblclick(handler)       // 双击
$('#btn').mouseenter(handler)     // 鼠标进入
$('#btn').mouseleave(handler)     // 鼠标离开
$('#btn').hover(enterFn, leaveFn) // 进入/离开

// 键盘事件
$('input').keydown(handler)       // 按下
$('input').keyup(handler)         // 释放
$('input').keypress(handler)      // 按键

// 表单事件
$('input').focus(handler)         // 获得焦点
$('input').blur(handler)          // 失去焦点
$('input').change(handler)        // 值改变
$('form').submit(handler)         // 表单提交

// 文档事件
$(window).resize(handler)         // 窗口大小改变
$(window).scroll(handler)         // 滚动
```

#### 事件对象
```javascript
$('#btn').on('click', function(e) {
  e.preventDefault();              // 阻止默认行为
  e.stopPropagation();            // 阻止冒泡

  console.log(e.type);            // 事件类型
  console.log(e.target);          // 触发事件的元素
  console.log(e.currentTarget);   // 绑定事件的元素
  console.log(e.pageX, e.pageY);  // 鼠标坐标
  console.log(e.which);           // 按键代码
});
```

**性能最佳实践**:
- 使用事件委托减少事件监听器数量
- 及时解绑不需要的事件
- 避免匿名函数,便于调试和解绑

### 2.4 动画效果 (5分钟掌握)

#### 显示/隐藏
```javascript
$('#box').show()                   // 显示
$('#box').show(1000)               // 1秒动画显示
$('#box').hide(1000)               // 1秒动画隐藏
$('#box').toggle(1000)             // 切换显示/隐藏
```

#### 滑动效果
```javascript
$('#box').slideDown(500)           // 向下滑动展开
$('#box').slideUp(500)             // 向上滑动收起
$('#box').slideToggle(500)         // 切换滑动
```

#### 淡入淡出
```javascript
$('#box').fadeIn(1000)             // 淡入
$('#box').fadeOut(1000)            // 淡出
$('#box').fadeToggle(1000)         // 切换淡入淡出
$('#box').fadeTo(1000, 0.5)        // 淡化到指定透明度
```

#### 自定义动画
```javascript
$('#box').animate({
  left: '250px',
  height: '+=50px'    // 相对值
}, {
  duration: 1000,     // 持续时间
  easing: 'swing',    // 缓动函数
  complete: function() {
    console.log('动画完成');
  }
});

// 链式动画
$('#box')
  .slideUp(500)
  .delay(1000)        // 延迟
  .fadeIn(500);

// 停止动画
$('#box').stop()                   // 停止当前动画
$('#box').stop(true, true)         // 清空队列,跳到结束状态
```

### 2.5 Ajax请求 (5分钟掌握)

#### 快捷方法
```javascript
// GET请求
$.get('api/users', function(data) {
  console.log(data);
});

// POST请求
$.post('api/users', { name: 'John' }, function(data) {
  console.log(data);
});

// 获取JSON
$.getJSON('api/users.json', function(data) {
  console.log(data);
});

// 加载HTML片段
$('#content').load('page.html #fragment');
```

#### 完整Ajax配置
```javascript
$.ajax({
  url: 'api/users',
  type: 'POST',              // 或 'GET', 'PUT', 'DELETE'
  data: { name: 'John' },
  dataType: 'json',
  timeout: 5000,

  beforeSend: function(xhr) {
    // 发送前
    xhr.setRequestHeader('Token', 'xxx');
  },

  success: function(data, status, xhr) {
    // 成功
    console.log(data);
  },

  error: function(xhr, status, error) {
    // 失败
    console.error(error);
  },

  complete: function(xhr, status) {
    // 完成(无论成功失败)
    console.log('请求完成');
  }
});
```

#### 全局Ajax设置
```javascript
// 全局配置
$.ajaxSetup({
  timeout: 5000,
  headers: { 'Token': 'xxx' }
});

```

---

## 三、实战技巧与最佳实践

### 3.1 链式调用
```javascript
$('#menu')
  .find('li')
  .addClass('item')
  .filter(':even')
  .css('color', 'red')
  .end()              // 返回上一级
  .eq(0)
  .addClass('first');
  
$(`tr[data-goods-id="${item.goods_id}"][data-goods-sku-id="${item.goods_sku_id}"]`).remove();
                                    
```


### 3.3 常用工具方法
```javascript
// 遍历
$.each([1, 2, 3], function(index, value) {
  console.log(index, value);
});

$('li').each(function(index) {
  $(this).text('Item ' + index);
});

// 数组处理
var arr = $.map([1, 2, 3], function(n) {
  return n * 2;  // [2, 4, 6]
});

var filtered = $.grep([1, 2, 3, 4], function(n) {
  return n > 2;  // [3, 4]
});

// 类型检测
$.isArray([])              // true
$.isFunction(function(){}) // true
$.isNumeric('123')         // true
$.isEmptyObject({})        // true
var isRemember= $('#remember-password').is(':checked');//是否打勾

// 对象扩展
var obj = $.extend({}, defaults, options);
```

### 3.4 文档就绪
```javascript
// 标准写法
$(document).ready(function() {
  // DOM加载完成后执行
});

// 简写
$(function() {
  // DOM加载完成后执行
});
```

---

## 四、快速上手实战案例

### 案例2: 表单验证
```javascript
$('#form').on('submit', function(e) {
  e.preventDefault();

  var name = $('#name').val().trim();
  var email = $('#email').val().trim();

  if (!name) {
    alert('请输入姓名');
    return false;
  }

  if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) {
    alert('邮箱格式不正确');
    return false;
  }

  // Ajax提交
  $.post('/api/submit', $(this).serialize(), function(res) {
    alert('提交成功');
  });
});
```

### 案例3: 无限滚动加载
```javascript
$(window).on('scroll', function() {
  if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
    loadMore();
  }
});

function loadMore() {
  $.get('/api/data?page=' + currentPage, function(data) {
    $('#list').append(data.html);
    currentPage++;
  });
}
```

---

## 五、关键要点总结

### 核心特性
1. **选择器**: 基于CSS,支持复杂筛选
2. **链式调用**: 优雅的API设计
3. **跨浏览器**: 自动处理兼容性问题
4. **丰富插件**: 庞大的生态系统

### 使用建议
- 现代项目优先考虑原生JavaScript或现代框架(Vue/React)
- jQuery适合快速开发和维护老项目
- 注意性能优化:缓存选择器、事件委托、减少DOM操作
- 避免过度依赖,理解底层JavaScript原理

### 版本选择
- **3.x**: 现代浏览器,体积小,性能好
- **1.x**: 需要支持IE 6/7/8时使用

## 六、快速查询表

| 功能 | 语法 | 说明 |
|------|------|------|
| 选择 | `$('selector')` | 选择元素 |
| 内容 | `.html()` `.text()` `.val()` | 获取/设置内容 |
| 属性 | `.attr()` `.prop()` | 操作属性 |
| 样式 | `.css()` `.addClass()` | 修改样式 |
| 事件 | `.on()` `.off()` | 绑定/解绑事件 |
| 动画 | `.animate()` `.fadeIn()` | 动画效果 |
| Ajax | `$.ajax()` `$.get()` | 异步请求 |
| 遍历 | `.each()` `.map()` | 遍历元素 |

---

**持续学习资源**:
- 官方文档: https://api.jquery.com/
- 中文文档: https://www.jquery123.com/
- 在线练习: https://jsfiddle.net/

