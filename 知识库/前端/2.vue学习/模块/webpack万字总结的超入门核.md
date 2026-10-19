---
created: 2025-11-06T09:29:36 (UTC +08:00)
tags:
  - JSON
  - 前端开发
  - JavaScript
  - 数据格式
  - 开发者
source: https://developer.aliyun.com/article/1613832
author: 想飞的雪糕
---

# 不会webpack的前端可能是捡来的，万字总结webpack的超入门核


**简介：** 该文章提供了Webpack的基础入门指南，涵盖安装配置、基本使用、加载器（Loaders）、插件（Plugins）的应用，以及如何通过Webpack优化前端项目的打包构建流程。

![cover](https://ucc.alicdn.com/tkuc6v2pkzeao/developer-article1613832/20240927/5a4bb8f3aae448d49d637193a4f46624.png?x-oss-process=image/resize,w_1400/format,webp)

## 🎨序言

众所周知，在前端工程化日趋复杂的今天，模块化打包工具在我们的日常开发中起着越来越重要的作用，而其中， `webpack` 已然是前端打包构建的不二选择。

说到 `webpack` ，可能很多小伙伴会觉得既熟悉又陌生，熟悉是因为在我们开发的每一个项目中，都会使用到它。而陌生在于， `webpack` 有着复杂的配置和五花八门的功能而感到陌生。

因此，我们有时候会被这复杂的配置先吓到，从而被劝退学习。

然而，在技术更新迭代这么快的一个大环境下， `webpack` 还是很值得我们去学习的。

在下面的这篇文章中，将讲解 `webpack` 的核心概念。一起来学习吧~🎬

## 📅一、webpack究竟是什么

### 1、写在前面

当我们要写一个网页时，首先我们会先创建一个 `index.html` 文件，之后在可能还会有一些 `js` 文件，那么我们就会在 `html` 文件中，引入这些 `js` 文件。

试想一下，如果 `js` 文件很多，然后我们一个个引入，这样如果遇到报错了呢？会不会就很难定位到是哪个文件错了，这样就会使得开发效率非常低下了。

因此，就有了 `webpack` 。 `webpack` 会将我们所写的代码，进行一个翻译，并将翻译完的内容，进行一个模块化的打包，使得项目变得工程化。

接下来，我们就来讲解， `webpack` 究竟是什么以及怎么安装使用。

### 2、什么是模块打包工具？

`webpack` 有时候会被误认为是一个 `js` 的翻译器，但其实 `webpack` 称不上是一个 `js` 的翻译器。

因为它只认识 `import` 这样类似的语句，而不认识其他的 `js` 高级语法。所以如果称它是一个 `js` 的翻译器，实际上是我们高看了它。

查看官方的定义我们可以发现， `webpack` 是一个**模块打包工具**，同时 `webpack` 也可以支持 `commonjs` 的模块打包规范。

然而，随着时间的推移和技术的不断更新， `webpack` 不再是只会打包 `js` 的**模块打包工具**， `webpack` 现在还支持 `css文件` 、 `jpg` 、 `png` 等各种文件的打包。

## 📐二、如何用Webpack搭建环境

### 1、安装node

`webpack` 是基于 `nodejs` 开发的模块打包工具，本质上是由 `node` 实现的。因此我们要先安装本机的 `node` 环境。[这里附上官方网站的链接，建议大家下载稳定版本](https://nodejs.org/zh-cn/)

之后查询本机的 `node` 和 `npm` 版本，查看是否安装成功。

```bash
node -v
npm -v
```

### 2、创建项目

先创建一个项目，假设命名为 `webpack-demo` 。之后在该项目下**通过以下命令创建一个文件夹：**

```bash
mkdir webpack-demo
```

### 3、初始化项目

进入 `webpack-demo` 文件，初始化项目。**命令行如下：**

```bash
cd webpack-demo
npm init 或 npm init -y //加-y表示默认自动配置项
```

之后一路 `Enter` 回车即可。

大家可以看到项目结构，以上操作就是在 `webpack-demo` 文件下创建了一个 `package.json` 文件，之后我们把 `package.json` 文件的内进行改造。**具体代码如下：**

```json
{
   
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
    //将这个项目设置为私有
  "private":true,
  //"main": "index.js", //去掉入口文件
  "scripts": {
   
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  //写上作者名
  "author": "Monday",
  //保持项目私有
  "license": "ISC"
}
```

### 4、安装webpack

**第一种方式：全局安装**

```bash
npm install webpack webpack-cli -g
```

**第二种方式：当前项目下安装**

```bash
npm install webpack webpack-cli -D
```

在这里的建议是选择第二种方式进行安装。那为什么呢？是因为全局安装 `webpack` 有什么问题吗？

事实上，全局安装只会安装一个版本。

那么假如我们现在要跑两个项目，并且这两个项目出现原先安装的 `webpack` 版本不一样，安装低版本 `webpack` 的项目，就有可能会导致在我们的本机中运行不起来。所以建议是使用第二种方式进行安装。

___

安装完成之后，我们还要来查询当前使用的 `webpack` 版本号，以确保我们是否已经安装成功。**具体命令行如下：**

```bash
npx webpack -v
```

这个时候就有小伙伴会有疑问说，为什么前面还要加个 `npx` 才能查找版本号。

原因在于，我们只在当前项目中安装，所以 `webpack` 这个命令在全局中并没有找到。而 `node` 提供了 `npx` ，这个时候 `npx` 就可以找到我们所运行项目目录下的 `node-module` 中的 `webpack` 安装包，所以这种方式是把我们的 `webpack` 安装在我们的项目内，然后通过 `npx` 去运行 `webpack` 就可以了。

### 5、安装具体版本的webpack

如果我们想要安装具体版本号的 `webpack` ，那么我们先查看 `webpack` 的版本号信息。**命令如下：**

```bash
npm info webpack
```

查到具体版本号以后，使用以下命令进行安装：

```bash
npm install webpack@4.16.5 webpack-cli -D //4.16.5表示版本号
```

## ⚙️三、Webpack的配置文件

### 1、默认配置文件

很多时候，我们还没写配置文件，项目就成功跑起来了。这并不是因为不用写，而是 `webpack` 团队提前帮我们写好了很多**默认的配置文件**，使得我们在运行项目时不用进行过多的配置就可以达到我们的使用需求。那下面，就跟着大家一起来写一个配置文件。

我们先来了解下项目结构，在我们创建完项目时，我们的源代码一般放在 `src` 文件夹下，并且打包后的文件一般放在 `dist` 文件下，同时 `webpack` 的配置文件命名为 `webpack.config.js` ，并且放在项目的根目录下。

```bash
├── dist 放置打包后的文件
├── src 放置项目源代码
├── webpack.config.js webpack配置文件
├── package-lock.json
├── package.json
```

看完项目结构，我们来了解一下 `webpack` 的**配置文件**具体需要怎么配置。**具体代码如下：**

```javascript
//node的核心模块
const path = require('path');

module.exports = {
   
    //设置为development时，代码不会进行压缩；设置为production时，代码会进行压缩。
    mode:'production',
    // 放置入口文件，明确怎么打包，要打包哪一个文件
    entry: './src/index.js',
    //entry: {
   
    //    main: './src/index.js'
    //},
    // 输出，表明webpack应该怎么输出，输出到哪个地方
    output: {
   
        filename: 'bundle.js',
        // 指打包后的文件要放在哪个文件下
        // __dirname表示该项目的根目录
        path: path.resolve(__dirname, 'dist')
    }
}
```

了解完基本配置，此时可能有小伙伴心里有一个疑惑， `webpack` 配置文件的命名一定要命名为 `webpack.config.js` 吗，是否可以命名为其他的呢？

**答案是肯定可以的**，不过我们需要进行一个特殊处理。平常如果我们命名为 `webpack.config.js` 时，可以直接使用 `npm webpack` 来跑我们的项目。如果不用这个命名时，假设命名为 `webpackconfig.js` ，那么我们可以通过以下命令行，来打包我们具体的项目。

```bash
 npx webpack --config webpackconfig.js
```

以上命令行的意思为：指让 `webpack` 来帮我们打包，具体打包哪一个文件呢？以 `webpackconfig.js` 为配置文件，来帮我们打包。

### 2、用npm script来简化我们的打包代码

看完上面的内容，相信小伙伴们对 `webpack` 有了一个基础的认识。

那试想以下，经常要使用 `npx webpack` 来帮我们打包文件，这样是不是会有点略显麻烦呢？

所以，我们来再了解一个内容：使用 `npm script` 来简化我们的打包代码。

再我们的项目根目录下，会有一个 `package.json` 文件，这个文件的**代码如下：**

```json
{
   
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "main": "index.js",
  "scripts": {
   
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Monday",
  "license": "ISC",
  "devDependencies": {
   
    "webpack": "^5.39.1",
    "webpack-cli": "^4.7.2"
  }
}
```

大家定位到scripts部分，接下来，我们把script部分进行一个改造。具体代码如下：

```json
 "scripts": {
   
    /* webpack 会先到node_module下面进行打包*/
    "bundle": "webpack"
  },
```

改造完成以后，我们就相当于在 `package.json` 里面配置了一个 `npm script` ，上面的代码意思为这个 `script` 对应的名字叫做 `bundle` ，之后呢， `bundle` 的底层会帮助我们执行 `webpack` ，并进行打包。

这么编写之后，我们就不再需要使用 `npx webpack` 来做运行 `webpack` ，而是使用 `npm run bundle` 来做命令进行打包。

### 3、浅谈webpack打包输出内容

讲解完上面的内容，我们来对 `webpack` 打包以后控制台的一些输出内容进行归纳总结。

| 输出内容        | 具体含义                          |
| ----------- | ----------------------------- |
| hash        | 代表本次打包对应的唯一哈希值                |
| version     | 代表此次打包使用的webpack的版本           |
| time        | 当前项目整体打包的具体耗时                 |
| assets      | 打包后的文件具体是哪一个，比如：bundle.js     |
| size        | 打包后文件的大小                      |
| chunks      | 放置自己对应文件的id值以及对应文件所引入其他文件的id值 |
| chunk Names | 对应entry配置的main                |

## 🔑四、Loader

### 1、引例阐述

`Webpack` 默认是知道如何打包 `js` 模块的，但是它不知道 `jpg` 这种文件该怎么打包。

这个时候我们需要在 `webpack.config.js` 文件下做配置，配置 `file-loader` 。我们在配置中增加一个新的 `module` 。**具体代码如下：**

```javascript
module:{
   
    rules:[{
   
        test:/\.jpg$/,
        use:{
   
            loader:'file-loader'
        }
    }]
    },
```

接下来我们来正向分析下 `webpack` 是如何打包 `jpg` 这种静态文件的。

首先 `webpack` 会进入`src` 目录， `new` 一个 `index.js` 文件，那么现在我们要对这个文件进行打包。

所以，我在命令行里，运行了 `npm run bundle` 。当你运行 `npm run bundle` 时，实际上在执行的是 `package.json` 里面的 `script` ，这个 `script` 帮我们运行 `webpack` ，然后呢， `webpack` 帮我们做打包。这个时候 `webpack` 就会去找它相对应的配置，根据这个配置帮我们做打包。

那么我们来看一下，如果我们遇到的是 `js` 文件，那么 `webpack` 默认会进行打包。但是呢？如果遇到的是一张 `jpg` 的图片呢？ `webpack` 这个时候就懵了， `webpack` 并不认识 `jpg` 这种格式的代码。

因此，我们就可以引用一个模块module，来帮我们打包。这个模块叫 `file-loader` ，`file-loader` 这个 `loader` 就可以帮助我们完成打包的过程。

那么实际上， `file-loader` 的底层，帮我们做了什么事情呢？

当我们打包 `jpg` 文件时， `webpack` 会把 `jpg` 文件移动到 `dist` 文件下，并且对 `jpg` 文件赋予一个新的名称。然后呢，它会把这个名称作为一个返回值，返回给我们引入模块的变量之中。

这就是 `file-loader` 底层处理打包文件的一个流程。

当然。 `file-loader` 不仅仅可以处理 `jpg` 这样的文件图片。理论上，它还可以处理**很多种类型的静态资源**。

### 2、什么是Loader

阐述了 `file-loader` 之后，相信大家对 `loader` 有了一个基础认识。那么我们现在就来对loader的基础定义进行梳理。**具体如下：**

本身 `webpack` 对于一些文件是不知道如何处理的，但是 `loader` 知道。所以呢，当遇到一些 `非js` 文件时，一般去求助于 `loader` 就可以了。因此我们就需要让 `webpack` 去求助 `loader` 模块，来识别出 `非js` 的文件。

引用 `webpack` 官方中文文档的一句话，文档中说到： `webpack` 只能理解 `JavaScript` 和 `JSON` 文件，这是 `webpack` 开箱可用的自带能力。**loader** 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效模块，以供**应用程序**使用，以及被添加到**依赖图**中。本质上， `loader` 是导出为函数的 `JavaScript` 模块。

### 3、使用Loader打包静态资源（图片篇）

#### （1）自定义命名图片

如果我们现在要对打包后的图片进行自定义命名，那该怎么做呢？

我们在 `webpack.config.js` 文件下的 `module` 再进行改进。**具体代码如下：**

```javascript
module:{
   
    rules:[{
   
        test:/\.jpg$/,
        use:{
   
            loader:'file-loader',
            options: {
   
                //placeholder 占位符
                name: '[name]_[hash].[ext]'
            }
        }
    }]
}
```

通过配置 `options` ，就可以达到图片自定义命名的效果。

#### （2）打包各种类型的图片文件

假设我们现在不局限于打包 `jpg` 文件，还想要打包其他的图片文件。**那么我们可以这样配置：**

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'file-loader',
            options: {
   
                //placeholder 占位符
                name: '[name]_[hash].[ext]'
            }
        }
    }]
}
```


#### （3）打包到image文件下

假设我们现在想要把打包后的文件放到 `image` 文件下，那该怎么做呢？**具体代码如下：**

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'file-loader',
            options: {
   
                //placeholder 占位符
                name: '[name]_[hash].[ext]',
                //将jpg、png和gif图片文件，指定到dist目录下的images文件下
                outputPath: 'images/'
            }
        }
    }]
}
```

#### （4）url-loader

在使用了 `file-loader` 之后，我们再来了解一个知识点： `url-loader` 。 `url-loader` 可以达到几近 `file-loader` 的效果。具体使用方法如下：

```bash
npm i url-loader -D
```

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'url-loader',
            options: {
   
                name: '[name]_[hash].[ext]',
                outputPath: 'images/'
            }
        }
    }]
}
```

我们只要安装上 `url-loader` ，并且在配置中将 `file-loader` 替换为 `url-loader` 即可。

但值得注意的是，使用 `url-loader` 进行打包，会有一些需要注意的事项。

当你去打包一个 `jpg` 文件的时候，与 `file-loader` 不一样的是， `url-loader` 会将图片转换成一个 `base64` 的字符串，然后直接放到我们 `dist` 目录下的 `bundle.js` 里面，而不是单独生成一个图片文件。

好处就是，直接访问，而不用去文件夹下访问，节省了一次 `http` 请求。

而带来的坏处就是，如果这个 `js` 文件特别大，那么打包生成的js文件也将会特别大，随之加载这个 `js` 的时间就会很长。

所以， `url-loader` 的最佳使用方式是什么呢？

如果说我们引入的图片很小，只有 `1~2KB` 等小的体积，那么这个图片以 `base64` 的形式打包到 `js` 文件里，是一个很好的选择，就没有必要让这么小的图片再去发一次 `http` 请求。

但假设这个图片很大的话，那么尽量不要使用 `url-loader` ，而使用 `file-loader` ，把这个图片打包到dist目录下，不要打包到 `bundle.js` 里面。不然会使得 `bundle.js` 文件变得很大，使得加载时间变得很长，不利于维护。

还有一种方法就是，我们可以直接在 `url-loader` 下再加一个配置： `limit` 。**具体代码如下：**

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'url-loader',
            options: {
   
                name: '[name]_[hash].[ext]',
                outputPath: 'images/',
                //20480=>20KB
                limit: 20480
            }
        }
    }]
}
```

通过以上代码我们可以知道，当使用 `url-loader` 时，我们可以给其加一个 `limit` 属性。那么上面代码所要表达的意思就是，当图片文件大小大于 `20KB` 时，我们使用 `url-loader` 打包。当大于 `20KB` 时，就将图片文件放到 `dist` 的 `images` 文件下。

### 4、使用Loader打包静态资源（样式篇）

#### （1）打包css文件

比如说，我们现在想要让一张图片的大小为 `150*150` ，那么我们就需要写下样式来修改这张图片。那 `webpack` 如何打包 `css` 文件呢？

我们可以使用 `css-loader` 和 `style-loader` 来对文件进行打包。**具体配置如下：**

```bash
npm install sass-loader node-sass --save-dev
```

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'file-loader',
            options: {
   
                //placeholder 占位符
                name: '[name]_[hash].[ext]',
                outputPath: 'images/'
            }
        }
    },{
   
        test:/\.css$/,
        use:['style-loader', 'css-loader']
    }]
}
```

`css-loader` 会帮我们分析出，几个 `css` 文件之间的关系，最终把一个 `css` 文件，合并成一个 `css` 。那 `style-loader` 的作用又是是什么呢？

在得到了 `css-loader` 生成的 `css` 文件之后， `style-loader` 会把这段内容挂载到页面的 `head` 部分，并将样式挂载到 `head` 中的 `<style></style>` 里面。

#### （2）打包sass文件

如果是要打包 `sass` 文件呢，则使用 `sass-loader` 、 `style-loader` 和 `css-loader` 这三个 `loader` 来对文件进行打包。**具体配置如下：**

```bash
npm install sass-loader node-sass --save-dev
```

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'file-loader',
            options: {
   
                //placeholder 占位符
                name: '[name]_[hash].[ext]',
                outputPath: 'images/'
            }
        }
    },{
   
        test:/\.scss$/,
        use:[
            'style-loader', 
            'css-loader', 
            'sass-loader'
        ]
    }]
}
```

值得注意的是， `loader` 的执行顺序是**从下到上，从右到左**。

所以当我们去执行一个 `sass` 文件时，首先会执行 `sass-loader` ，之后执行 `css-loader` ，最后才执行 `style-loader` 。

#### （3）兼容性问题

有时候我们如果想要兼容多个浏览器时，那么我们可能会在 `css` 文件里面添加 `-webkit-` 等厂商的前缀。但是呢，要知道 `webpack` 是没办法识别这些前缀的。这个时候我们了解一个新的 `loader` ，就是 `postcss-loader` ，这个loader可以自动地帮我们添加**厂商前缀**的信息。**具体使用方式如下：**

首先我们先安装 `postcss-loader` 这个库，具体代码如下：

```bash
npm i postcss-loader -D
```

安装完成之后，我们在项目根目录下创建一个新的文件，名字叫 `postcss.config.js` ，之后对这个文件进行配置，**代码如下：**

首先安装 `autoprefixer` ：

```bash
npm install autoprefixer -D
```

安装完成之后，现在我们在 `postcss.config.js` 文件下来使用它，**具体代码如下：**

```javascript
module.exports = {
   
    Plugin:[
        require('autoprefixer')
    ]
}
```

接下来我们在 `webpack.config.js` 文件下面，使用 `postcss-loader` 。**具体代码如下：**

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'file-loader',
            options: {
   
                //placeholder 占位符
                name: '[name]_[hash].[ext]',
                outputPath: 'images/'
            }
        }
    },{
   
        test:/\.scss$/,
        use:[
            'style-loader', 
            'css-loader', 
            'sass-loader',
            'postcss-loader'
        ]
    }]
}
```

通过以上方式， `webpack` 就可以在帮我们打包静态文件时，把对应的需要加入厂商前缀的样式给添加上前缀。

### 5、增加配置项

假设我们现在想要给某一个 `loader` 增加配置项，比如说我们要给 `css-loader` 增加配置项，那么我们可以对代码进行如下处理。**具体代码如下：**

```javascript
module:{
   
    rules:[{
   
        test:/\.(jpg|png|gif)$/,
        use:{
   
            loader:'file-loader',
            options: {
   
                //placeholder 占位符
                name: '[name]_[hash].[ext]',
                outputPath: 'images/'
            }
        }
    },{
   
        test:/\.scss$/,
        use:[
            'style-loader', 
            {
   
                loader: 'css-loader',
                options: {
   
                    //表明前面要先走sass-loader和postcss-loader
                    importLoaders: 2
                }
            }, 
            'sass-loader',
            'postcss-loader'
        ]
    }]
}
```

从以上代码中我们可以看到，当我们想要给 `css-loader` 增加配置项时，那么不再使用字符串的形式，我们把字符串转化成一个对象。在对象里面，我们填写相应的 `loader` 和 `options` 配置，这样就达到了我们想要的需求。

___

有时候我们在一个页面上，如果全局引入 `css` ，可能会很容易导致**样式冲突问题**。那这种情况该怎么处理呢？

为此我们可以借助 `css-loader` 中的 `modules` 来实现 `css` 的模块化，旨在让引入的 `css` 文件拥有它独立的模块。那具体该怎么使用呢？

```javascript
module:{
   
        test:/\.scss$/,
        use:[
            'style-loader', 
            {
   
                loader: 'css-loader',
                options: {
   
                    //表明前面要先走sass-loader和postcss-loader
                    importLoaders: 2,
                    modules: true
                }
            },
            'sass-loader',
            'postcss-loader'
        ]
    }]
}
```

从以上代码中我们可以知道，通过 `modules:true` 语句，就可以开启 `css` 的模块化打包。开启之后，我们就可以在各种文件下引入。**引入方式如下：**

```javascript
import style from './index.scss';

var img = new Image(); 
img.src = bug;
img.classList.add(style.bug);
```

从上述代码中我们可以看到，开启 `module` 后，就可以随心所欲的引用该 `css` 中的内容啦！

### 6、如何使用webpack打包字体文件

有时候我们在项目中有可能会遇到想要引入字体的问题，那 `webpack` 如何打包字体呢？**具体代码如下：**

```javascript
module:{
   
        rules:[{
   
            test: /\.(eot|ttf|svg)$/,
            use: {
   
                loader: 'file-loader',
            }

        }]
    },
```

通过以上代码我们可以知道，跟 `webpack` 相关的静态文件格式为 `eot、ttf和svg` 等格式，所以需要需要把这几种类型引入。同时，跟其相关的 `loader` 为 `file-loader` 。

学完关于如何打包静态资源后，建议可以再用官方文档的相关部分来进行复习，[具体链接戳](https://webpack.js.org/guides/asset-management/)~

## 🧲五、使用plugins让打包更便携

### 1、html-webpack-plugin

在学习了如何使用 `loader` 来打包静态文件之后，接下来我们一起来了解在 `webpack` 中，如何使用 `plugins` 让打包更便捷。

我们在打包项目时， `webpack` 总是会把打包后的内容放到 `dist` 目录下。这个时候我们可能还需要自行再去创建一个 `index.html` 来引入核心文件。那这样会不会就显得略有点麻烦了？

因此， `webpack` 给我们提供了 `plugin` 插件来解决这个问题。

首先，我们先来安装 `plugin` ，**具体命令行如下：**

```bash
npm install html-webpack-plugin -D
```

接下来我们将插件引入 `webpack.config.js` 当中，**具体代码如下：**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [new HtmlWebpackPlugin({
   
        //表明要引用哪一个模板
        template: 'src/index.html'
    })]
```

现在，我们来梳理一下 `htmlWebpackPlugin` 如何帮我们完成自动打包。

首先， `htmlWebpackPlugin` 会在打包结束后，自动生成一个 `html` 文件。之后呢，把打包生成的 `js` 文件自动引入到这个 `html` 文件中。

所以，从某种程度上来说就是， `plugin` 可以在 `webpack` 运行到某个时刻的时候，自动地帮你做一些事情。即当我们打包结束的这儿一时刻， `plugin` 会自动帮我们创建 `html` 文件以供我们直接使用。

### 2、clean-webpack-plugin

有时候我们有可能对 `webpack.config.js` 中的output所对应的filename进行修改，这就很容易导致在打包过程中遇到多文件冲突。

那么我们想要实现的就是，在打包时，先清空原来的dist文件夹，然后再生成一个新的dist文件夹。如何处理呢？请看下方。

首先我们先安装依赖 `clean-webpack-plugin` ，**具体命令行如下：**

```bash
npm install clean-webpack-plugin -D
```

接下来我们将插件引入 `webpack.config.js` 当中，**具体代码如下：**

```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin');

plugins: [new HtmlWebpackPlugin({
   
        //表明要引用哪一个模板
        template: 'src/index.html'
    }),new CleanWebpackPlugin(['dist'])]
```

通过以上代码，就可以在我们项目打包时，先删除 `dist` 文件夹，之后再创建一个新的文件夹。

## 🗞️六、Entry和Output

接下来我们再来看 `webpack` 中的 `entry` 和 `output` 中几个比较核心的配置。

```javascript
module.exports = {
   
    mode:'development',
    // 放置入口文件，明确怎么打包
    entry:{
   
        main: './src/index.js',
        sub: './src/index.js'
    },
    plugins: [new HtmlWebpackPlugin({
   
        //表明要引用哪一个模板
        template: 'src/index.html'
    }),new CleanWebpackPlugin(['dist'])],
    // 输出，表明webpack应该怎么输出
    output: {
   
        //如果把资源放在cdn下，则引入cdn
        publicPath: 'http://cdn.com.cn',
        //当entry有多个入口文件时，用[]可以输出多个文件
        filename: '[name].js',
        // 指打包后的文件要放在哪个文件下
        path: path.resolve(__dirname, 'dist')
    }
}
```

## 🗺️七、SourceMap

### 1、引例阐述

有时候，我们在写代码时，总会莫名的出bug。看着控制台那红红的报错，心里总归很不是滋味。同时，如果我们没有配置好 `webpack` 的话，那错误找起来简直是很恐怖的。

比如，在开发模式下，我们默认 `webpack.config.js` 像下面这样配置，**具体代码如下：**

```javascript
module.exports = {
   
    mode:'development',
    devtool: 'none',
    entry:{
   
        //打包到dist目录下的main.js
        main: './src/index.js'
    },
    output: {
   
        //用[]可以生成多个文件
        filename: '[name].js',
        // 指打包后的文件要放在哪个文件下
        path: path.resolve(__dirname, 'dist')
    }
}
```

然后呢，假设我们现在代码里面错把 `console.log` 写成 `consele.log` 。那么现在**控制台的打印效果如下：**

![sourceMap](https://ucc.alicdn.com/tkuc6v2pkzeao/developer-article1613832/20240927/e4c78b207ddf4e6b87fb76fb12f85d4a.png?x-oss-process=image/resize,w_1400/format,webp)

大家可以看到，此时的错误定位到打包后的 `main.js` 文件里面的第**96**行。那试想一下，如果我们的业务代码特别多，报错有可能就是在文件中的上前行了。

这样的场景并不是我们想看到的。我们想做的事情呢就是，希望 `webpack` 打包完成之后就把错误直接抛给我们，并把其对应的具体文件地址显示出来。也就是我们出错的那个代码文件，而不是打包后的文件 `main.js` 。

因此， `webpack` 给我们提供了 `sourceMap` 这个配置，来解决这个问题。

### 2、sourceMap

我们现在把 `devtool` 这个配置，改成 `sourceMap` 。**具体代码如下：**

```javascript
module.exports = {
   
    mode:'development',
    devtool: 'source-map',
    entry:{
   
        //打包到dist目录下的main.js
        main: './src/index.js'
    },
    output: {
   
        //用[]可以生成多个文件
        filename: '[name].js',
        // 指打包后的文件要放在哪个文件下
        path: path.resolve(__dirname, 'dist')
    }
}
```

改完之后呢，我们来看一下**控制台的打印结果：**

![sourceMap](https://ucc.alicdn.com/tkuc6v2pkzeao/developer-article1613832/20240927/df1507713e294617b04f000431ba106d.png?x-oss-process=image/resize,w_1400/format,webp)

现在大家可以看到，改成 `source-map` 的配置之后，报错的定位直接到了我们自己所编写代码的目录下，即 `index.js` 。而不再是大海捞针似的在 `main.js` 里面找。

### 3、sourceMap常见配置

看完上面的例子之后，相信大家对 `SourceMap` 有了一定的了解。接下来我们来看一下 `sourceMap` 的一些常见配置。**具体看看下方：**

|SourceMap|含义|
|---|---|
|inline-source-map|报错时将行和列都显示出来|
|cheap-inline-source-map|报错时只知道哪一行出错了，不知道在哪一列|
|cheap-module-source-map|**生产环境最佳实践**，不仅管自己的业务代码错误，还要管其他的其他的错误，像loader、其他第三方模块的错误等等|
|eval|eval是打包速度最快的一种方式，但如果遇到业务代码比较复杂的情况下，用eval提示出来的效果可能不太全面|
|module-eval-source-map|用module，表明不仅要显示业务错误，还要显示loader、第三方错误等等|
|cheap-module-eval-source-map|开发环境最佳实践|

## 🧱八、使用WebpackDevServer提升开发效率

### 1、–watch

事实上，如果我们不采用 `WebpackDevServer` 的方式来开发的话，那么我们每一次想要查看编译后的运行结果，都需要先命令行编译 `npm run bundle` 命令，之后再打开 `dist` 目录下的 `index.html` 文件才能重新查看。这样一来二往的，难免效率低下。我们期待的结果是什么呢？

我们把 `package.json` 文件里的 `script` 进行一番改造，**具体代码如下：**

```json
"scripts": {
   
    "watch": "webpack --watch",
    "bundle": "webpack"
  },
```

通过以上代码大家可以看到，将 `webpack` 后面加上 `--watch` 字段，然后运行 `npm run watch` ，就可以每次修改完代码后， `webpack` 实现自动监听，而不用像以往那样，每修改一次代码都要对再重新运行命令来对 `webpack` 进行打包。

### 2、webpackDevServer

但是呢，这种方式可能还不够友好，毕竟开发者总是懒惰的，能尽量让程序来干活就不要用手工来干活。

实际上我们想要达到的效果是，当我们运行完 `npm run watch` 这行命令的时候，不仅能自动帮我们实现打包，同时还能帮我们打开控制台，并且模拟一些服务器上的特性。那么我们就可以通过 `webpackDevServer` 来实现我们想要的效果。如何使用 `webpckDevServer` 呢？具体看下方。

#### （1）安装webpackDevServer

我们现在项目中安装webpackDevServer，**具体命令行如下：**

```javascript
npm install webpack-dev-server -D
```

#### （2）配置package.json文件

接下来我们来配置 `package.json` 文件的 `script` 。**具体代码如下：**

```json
"scripts": {
   
    "watch": "webpack --watch",
    "start": "webpack-dev-server"
  },
```

#### （3）配置 webpack文件

接下面我们来配置 `webpack.config.js` 文件，**具体代码如下：**

```javascript
module.exports = {
   
    mode:'development',
    devtool: 'source-map',
    // 放置入口文件，明确怎么打包
    entry:{
   
        main: './src/index.js'
    },
    devServer: {
   
        contentBase: './dist',
        // 当运行完npm run start时，会自动的帮我们打开浏览器
        open: true
    },
    output: {
   
        //用[]可以生成多个文件
        filename: '[name].js',
        // 指打包后的文件要放在哪个文件下
        path: path.resolve(__dirname, 'dist')
    }
}
```

那么现在，我们来看下， `webpackDevServer` 如何做到自动打开浏览器。**详情见下图：**

![webpackDevServer](https://ucc.alicdn.com/tkuc6v2pkzeao/developer-article1613832/20240927/58389a490b8348808cb5fc7eb0d51c53.gif)

大家可以看到，通过 `webpackDevServer` ，它不但会监听到我们的文件发生了改变，重新帮我们进行打包。同时它还会**自动的帮我们重新刷新浏览器**，并且会**自动地帮我们打开浏览器**。所以用它呢，可以**大大提升我们的代码开发效率**。

#### （4）配置端口号

`webpackDevServer` 默认我们服务器的端口号是 `8080` ，如果我们想要修改它为其他的端口号，该怎么做呢？

我们需要在来修改 `webpack.config.js` 文件下的 `DevServer` ，**具体代码如下：**

```javascript
module.exports = {
   
    mode:'development',
    devtool: 'source-map',
    // 放置入口文件，明确怎么打包
    entry:{
   
        main: './src/index.js'
    },
    devServer: {
   
        contentBase: './dist',
        // 当运行完npm run start时，会自动的帮我们打开浏览器
        open: true,
        //修改端口号
        port: 3000
    },
    output: {
   
        //用[]可以生成多个文件
        filename: '[name].js',
        // 指打包后的文件要放在哪个文件下
        path: path.resolve(__dirname, 'dist')
    }
}
```

我们只需要在 `devServer` 里面加上一个 `port` 的配置，即可实现**自定义端口号**。

同时值得注意的是，当我们在用 `webpackDevServer` 帮我们项目做打包时，它不会自动生成 `dist` 目录，那这是为什么呢？用 `webpackDevServer` 打包后的项目会放在我们的**电脑内存**中，这在某种程度下可以有效的提升项目的打包速度，让打包变得更快。

## 🌡️九、Hot Module Replacement 热模块更新

### 1、引例阐述

假设我们现在要实现一个**新增元素**的功能，这个功能所要达到的效果是每点击一次按钮，就新添加一次文本 `item` 。**具体实现代码如下：**

**index.js文件：**

```javascript
import './style.css';

var btn = document.createElement('button');
btn.innerHTML = '新增';
document.body.appendChild(btn);

btn.onclick = function(){
   
    var div = document.createElement('div');
    div.innerHTML = 'item';
    document.body.appendChild(div);
}
```

**style.css文件：**

```css
div:nth-of-type(odd){
   
    background: yellow;
}
```

此时浏览器的显示效果**如下图所示：**

![HMR①](https://ucc.alicdn.com/tkuc6v2pkzeao/developer-article1613832/20240927/94908be439934caa9734b9b35a564eeb.gif)

___

假设我们现在来给css的背景改个颜色，比如说改成紫色。**具体代码如下：**

```css
div:nth-of-type(odd){
   
    background: purple;
}
```

此时我们保存后浏览器会重新进行刷新，之后每一个 `item` 又要重新 `append` 进来。**如下图：**

![HMR②](https://ucc.alicdn.com/tkuc6v2pkzeao/developer-article1613832/20240927/76129c03ae5640888d0abfdb1182fe69.gif)

那这种情况下可能就不是我们想要的结果了。我们希望的是，所有的 `item` 不进行重新刷新，并且当 `css` 样式改变的时候，对应的 `item` 颜色也可以得到改变。那么这就要引出 `webpackDevServer` 中的一个内容：热模块更新 `Hot Module Replacement` 。接下来我们来了解热模块更新相关的配置。

### 2、热模块更新配置

热模块更新，即Hot Module Replacement，简称为 `HMR` 。

接下来我们在 `webpack.config.js` 文件夹下进行配置。**具体代码如下：**

```javascript
//node的核心模块
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
   
    mode:'development',
    devtool: 'source-map',
    // 放置入口文件，明确怎么打包
    entry:{
   
        main: './src/index.js'
    },
    devServer: {
   
        contentBase: './dist',
        // 当运行完npm run start时，会自动的帮我们打开浏览器
        open: true,
        port: 8080,
        // 让我们的webpackDevServer开启hotModuleReplacement这样子的功能
        hot: true,
        // 即便HMR没有生效，也不让浏览器自动刷新
        hotOnly: true
    },
    module:{
   
        rules:[{
   
            test:/\.(jpg|png|gif)$/,
            use:{
   
                loader:'file-loader',
                options: {
   
                    //placeholder 占位符
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images/',
                    limit: 10240
                }
            }
        },{
   
            test:/\.scss$/,
            use:[
                'style-loader', 
                {
   
                    loader: 'css-loader',
                    options: {
   
                        //表明前面要先走sass-loader和postcss-loader
                        importLoaders: 2,
                        modules: true
                    }
                }, 
                'sass-loader',
                'postcss-loader'
            ]
        },{
   
            test:/\.css$/,
            use:[
                'style-loader',
                'css-loader',
                'postcss-loader'
            ]
        }]
    },
    plugins: [new HtmlWebpackPlugin({
   
        //表明要引用哪一个模板
        template: 'src/index.html'
    }),new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin()
    ],
    // 输出，表明webpack应该怎么输出
    output: {
   
        // 下载middle：npm install express webpack-dev-middleware -D
        publicPath: '/',
        //用[]可以生成多个文件
        filename: '[name].js',
        // 指打包后的文件要放在哪个文件下
        path: path.resolve(__dirname, 'dist')
    }
}
```

通过以上代码我们可以知道，配置 `devServer` 下的 `hot` 和 `hotOnly` ，以及 `plugins` 下的 `new webpack.HotModuleReplacementPlugin()` ，来达到热模块更新的效果。

接下来我们来看一下，进行配置之后，浏览器的效果。**详情见下图：**

![HMR③](https://ucc.alicdn.com/tkuc6v2pkzeao/developer-article1613832/20240927/9f8c2056296849309b8b1f6e6d05cc52.gif)

大家可以看到，加上这几个配置之后， `item` 不会再重新刷新了，而是在原来的基础上进行样式修改。

## 📀十、使用Babel处理ES6语法

### 1、ES6语法转换为ES5语法

继续，接下来我们来了解，如何使用webpack和babel，来编写ES6的语法。

大家都知道，ES6的语法规范是2015年才正式出版的。所以有时候，并不是所有的浏览器都支持ES6语法。因此，我们现在想要做的事情就是，在webpack打包时，能够将ES6的语法转换为ES5的语法。这样，项目运行的时候，浏览器就不会报错了。

那怎么实现这样子的打包呢？接下来我们一起来了解一下。

首先我们打开[babel的官方网站](https://babeljs.io/setup#installation)，按照步骤，我们一步步在 `webpack` 中使用 `babel` 。

**第一步：** 安装 `babel-loader` 和 `@babel/core` 这两个库。**具体代码如下：**

```bash
npm install --save-dev babel-loader @babel/core
```

`babel-loader` 是帮助webpack进行打包使用的一个工具，而 `@babel/core` 则是 `babel` 的一个核心库，它能够让 `babel` 去识别 `js` 代码里的内容，然后呢把 `js` 代码转换成 `AST` 抽象语法树，之后再把抽象语法树编译成一些新的语法。

**第二步：** 在 `webpack.config.js` 文件下的配置项里增设规则。**具体代码如下：**

```javascript
module: {
   
    rules: [
        {
   
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
   
                loader: "babel-loader",
                options: {
   
                    presets: ['@babel/preset-env']
                }
            }
        }
    ]
}
```

**第三步：** 安装 `@babel/preset-env` 。**具体代码如下：**

```bash
npm install @babel/preset-env --save-dev
```

为什么要安装这个模块呢？实际上，当我们使用 `babel-loader` 处理文件时，实际上 `babel-loader` 只是 `webpack` 和 `babel` 之间做通信的一个桥梁，它只是帮我们打开了一个通道，但是它并不会帮我们把 `ES6` 的语法转换为 `ES5` 的语法。所以，我们就还需要借助一些其他的模块，来做这项工作。这个模块就是前面我们说的，**preset-env** 。

`babel/preset-env` ，包含了所有 `ES6` 转换为 `ES5` 的语法规则，当使用此模块打包时，就可以把我们所有 `js` 中 `ES6` 的代码转换为 `ES5` 了。具体配置方式见以上**第二步**。

### 2、Babel-polyfill

通过以上的方式，我们可以达到将ES6语法转换为ES5语法的效果。但是呢，我们还要考虑到的一个问题就是，如果遇到像promise这一类新的语法变量，或者时像数组里面map这一类的函数，低版本的浏览器里面，实际上还是不存在的。虽然我们做了语法解释和语法翻译，但也只是翻译了一部分。还有一些对象和函数，在低版本的浏览器还是没有的。

所以呢，这个时候我们不仅要使用 `babel/preset-env` 做语法转换，还要**把这些缺失的变量和函数补充到低版本的浏览器里面**。

那怎么补充呢，这个时候我们就需要借助 `babel-polyfill` 这个工具来进行补充。接下来讲解这个模块的使用操作。

第一步： 定位到[官方文档](https://babeljs.io/docs/en/babel-polyfill)，安装 `babel-polyfill` 。**具体代码如下：**

```bash
npm install --save @babel/polyfill
```

第二步： 引入该模块。**具体代码如下：**

```javascript
import "@babel/polyfill";
```

通常情况下，这段代码放到项目的 `js` 入口文件下。

第三步： 改造 `webpack.cofig.js` 文件下的 `module` ，减少打包大小。**具体代码如下：**

```javascript
module: {
   
    rules: [
        {
   
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
   
                loader: "babel-loader",
                options: {
   
                presets: [['@babel/preset-env'],{
   
                    useBuiltIns: 'usage'
                }]
              }
            }
        }
    ]
}
```

这段代码的意思就是，当用 `babel-polyfill` 填充低版本浏览器特性的时候，不是把是多有的特性都加进来，而是根据我们的业务代码来决定到底到加什么。

同时， `babel-preset` 也有很多其他值得学习的配置属性，这里不再进行讲解。大家可以自行到[官方文档](https://babeljs.io/docs/en/usage)上进行查看~

## 📚十一、结束语

写完这篇文章的时候，突然想起上次面试时的面试官。在最后的反问环节问他关于 `webpack` 的问题，他说 `webpack` 一般会让对公司业务很熟悉的员工来处理，毕竟前端工程化不是儿戏。

当时我还没有很大的感触，但现在学到这里突然就想到了那个场景。确实是这样，我这才学了不到它的冰山一角，就已经感到 `webpack` 的庞大工程了。如果在打包时候，但凡有一个小地方的配置出现问题，就有可能引发整个项目的不可收拾局面。（当然一般情况下不会出现这样的情况，言重了……）

在学习 `webpack` 的过程中，要**明确好自己所使用的webpack版本**。比如周一刚开始迷迷糊糊的，感觉版本4和版本5都差不多。但对于 `webpack` 来说，这完全就是在跟它开玩笑。每一个依赖都有4和5对应的版本，而不是说想用哪个就哪个。如果胡乱使用的话，无形之中可能会报错到怀疑人生……

因此，确定好此时用 `webpack` 打包时所使用的版本，并在使用 `npm` 依赖时也同样要找到对应的版本来进行使用，降低错误的发生。

到这里，关于webpack的超入门知识就讲到这里啦！希望对大家有帮助~

本文代码已上传至公众号，后台回复关键词 `webpack` 即可获取~

## 🐣彩蛋 One More Thing

### 往期推荐

-   [vuejs基础知识系列](https://juejin.cn/column/6976040277068759077)
-   [vuejs原理分析系列](https://juejin.cn/column/6976041758945706015)

### 番外篇

-   关注公众号**星期一研究室**，第一时间关注学习干货，**更多精选专栏待你解锁**~
    
-   如果这篇文章对你有用，记得**留个脚印**再走哦~
    
-   以上就是本文的全部内容！我们下期见！👋👋👋
