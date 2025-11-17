
# JavaScript 中将图片转换为 Base64 的两种常用方法

### 前言

在 Web 开发中，我们经常需要将图片转换为 Base64 格式。这样做的好处是可以将图片数据直接嵌入到 HTML、CSS 或 JavaScript 文件中，从而减少 HTTP 请求，避免因图片路径问题导致的加载失败。在这篇文章中，我将向您展示如何使用 JavaScript 通过 `FileReader` 和 `Canvas` 两种主流方式将图片转换为 Base64 格式。

## 1. FileReader 方式

`FileReader` 是 HTML5 File API 中的一个对象，允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容。这种方法非常适合处理用户通过 `<input type="file">` 标签选择的本地图片。

首先，我们需要创建一个 `FileReader` 对象，然后监听其 `load` 事件。当文件读取完成时，该事件会触发，我们可以在事件对象 `e.target.result` 中获取到图片的 Base64 编码。

#### 示例代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image to Base64 via FileReader</title>
</head>
<body>
    <p>请选择一张本地图片：</p>
    <input type="file" id="inputImage" accept="image/*" />
    <hr>
    <p>Base64 输出 (见控制台):</p>

    <script>
        const inputImage = document.getElementById('inputImage');

        inputImage.addEventListener('change', function(event) {
            // 获取用户选择的文件
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            // 创建一个 FileReader 对象
            const reader = new FileReader();

            // 监听 load 事件，当文件读取完成后触发
            reader.onload = function(e) {
                const base64 = e.target.result;
                console.log("FileReader 转换结果：");
                console.log(base64); // 输出图片的 Base64 编码
            };

            // 以 Data URL 的格式读取文件内容
            reader.readAsDataURL(file);
        });
    </script>
</body>
</html>
```

> **专业点评：**
> - **优点**：API 设计直观，代码简单，非常适合读取用户本地上传的文件。转换过程是异步的，不会阻塞 UI。
> - **缺点**：只能用于处理 `File` 或 `Blob` 对象，无法直接转换一个已知的图片 URL。

## 2. Canvas 方式

我们也可以利用 HTML5 的 `<canvas>` 元素作为“中间人”，将图片绘制到画布上，然后通过 `canvas.toDataURL()` 方法导出 Base64 字符串。这种方式非常灵活，既可以处理本地图片，也可以处理网络图片（需注意跨域问题）。

以下是核心步骤：

1.  创建一个 `<canvas>` 元素。
2.  创建一个新的 `Image` 对象，并将其 `src` 指向目标图片的 URL。
3.  在 `Image` 对象的 `onload` 事件触发后（即图片加载完成），将其绘制到 `canvas` 上。
4.  调用 `canvas.toDataURL()` 方法将画布内容转换为 Base64 格式的字符串。

#### 示例代码：

```javascript
/**
 * 将一个 Image 对象转换为 Base64 字符串
 * @param {HTMLImageElement} image - 已加载完成的 Image 对象
 * @returns {string} 图片的 Base64 编码
 */
function imageToBase64(image) {
    // 创建一个 canvas 元素
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    // 获取 canvas 的 2d 上下文
    const context = canvas.getContext("2d");
  
    // 将图片绘制到 canvas 上
    context.drawImage(image, 0, 0, image.width, image.height);

    // 将 canvas 的内容转换为 Base64 编码的字符串
    // 'image/png' 是默认格式，也可以指定为 'image/jpeg' 等
    const base64 = canvas.toDataURL("image/png");

    return base64;
}

// --- 如何使用 ---

// 1. 创建一个新的 Image 对象
const img = new Image();

// 2. 设置图片源 (替换为你的图片 URL)
// 注意：如果图片来自不同域名，需要服务器设置 CORS 策略，否则会触发安全错误
img.crossOrigin = 'Anonymous'; // 尝试解决跨域问题
img.src = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'; // 示例网络图片

// 3. 当图片加载完成后，执行转换
img.onload = function() {
    const base64String = imageToBase64(img);
    console.log("Canvas 转换结果：");
    console.log(base64String);
};

// 4. 处理图片加载失败的情况
img.onerror = function() {
    console.error("图片加载失败，请检查 URL 或跨域策略！");
};
```

> **专业点评：**
> - **优点**：功能强大，不仅能转换图片，还能在转换前对图片进行编辑，如裁剪、缩放、添加滤镜等。可以处理来自任意 URL 的图片（只要解决了跨域问题）。
> - **缺点**：代码相对复杂一些。当处理网络图片时，如果图片服务器没有配置正确的 `Access-Control-Allow-Origin` (CORS) 头，浏览器会出于安全策略阻止 `toDataURL` 操作，导致画布“被污染”(tainted)。

---

> **版权声明**：本文为博主原创文章，遵循 [CC 4.0 BY-SA](https://creativecommons.org/licenses/by-sa/4.0/) 版权协议，转载请附上原文出处链接和本声明。
>
> **原文链接**：<https://blog.csdn.net/olderandyanger/article/details/122893574>