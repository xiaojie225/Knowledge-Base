
## 一、介绍 

`uni-app` 是一个使用 [Vue.js][] 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

本次章节也是博主从零开始搭建uniapp项目，在此过程进行记录，帮助后续查询同时为读者提供讲解，如有异议，欢迎留言。

更多详情可查看uni-app官网：[uni-app官网][uni-app]

## 二、环境搭建 

### 2.1.需要下载的软件 

#### 2.1.1 HBuilderX 

下载地址：[HBuilderX-高效极客技巧][HBuilderX-]

#### 2.1.2 下载微信开发者工具 

下载地址：[微信开发者工具（稳定版 Stable Build）下载地址与更新日志 | 微信开放文档][Stable Build_ _]

最好下载稳定版。


### 2.2 创建uniapp项目 

#### 2.2.1 新建项目 

打开HBuilderX,点击文件——>新建——>项目——>选择uni-app——>填写项目名，项目地址，选择模板——>点击创建。

#### 2.2.2 项目基本结构 

创建完成后，项目会生成默认的目录结构，如图所示：

![](https://i-blog.csdnimg.cn/direct/ae4e8319188d421ea53d85945448294f.png)

详情见[工程简介 | uni-app官网][_ uni-app]

#### 2.2.3 在微信开发者工具上运行 

![](https://i-blog.csdnimg.cn/blog_migrate/7d521335ad4a7c9d79079ba382a22b27.png)

![](https://i-blog.csdnimg.cn/blog_migrate/5eaa67a8616e7c59f621fc91625b230e.png)

![](https://i-blog.csdnimg.cn/blog_migrate/9d14d2552874fe327e97c4b9bb21c553.png)

然后启动测试一下，发现失败了。经过检查它报错的这两项，也没问题啊。

那么问题可能是出在微信开发者，我们需要进入微信开发者工具->设置->安全，然后把服务的端口号打开。

![](https://i-blog.csdnimg.cn/blog_migrate/3a5da2f8fdcd2d7a6a46193b32067370.png)

接着重新运行即可。

![](https://i-blog.csdnimg.cn/blog_migrate/eb4cc6cdbcfe556c7adbec35b2da82c5.png)

#### 2.2.4 发布微信小程序 

1.在浏览器中打开[微信公众平台][Link 10]，注册信息，填写小程序相关信息，在“开发管理”模块中有AppID(小程序ID),将AppID填写在uniapp项目中。

![](https://i-blog.csdnimg.cn/direct/e9686ee2b5924edab830f0ee06bfef1a.png)

![](https://i-blog.csdnimg.cn/direct/f1a5611f6c674cd2a5875b804d074ca7.png)

2.点击“真机调试”，会显示二维码，手机扫码即可查看。

3.点击“上传”，输入版本号和项目备注，点击【上传】 。

4.在微信开发者工具中上传了小程序代码之后。  
登录小程序管理后台（链接： 微信公众平台）；  
点击【版本管理】 -> 【开发版本】， 找到提交上传的版本；  
点击【提交审核】 ，根据提示填写信息，即可提交审核。

![](https://i-blog.csdnimg.cn/direct/d4c42bc367bb4efe90c0a53c204d4219.png)

5.发布

审核通过之后，管理员的微信中会收到小程序通过审核的通知。  
此时登录小程序管理后台，在审核版本中可以看到通过审核的版本。  
点击【发布】，即可发布小程序。

![](https://i-blog.csdnimg.cn/direct/d56864acda8f4c1e9282ec50b1dbb888.png)

## 三、pages.json 页面路由 

`pages.json` 文件用来对 uni-app 进行全局配置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生tabbar 等。

配置项列表

<table> 
 <thead> 
  <tr> 
   <th>属性</th> 
   <th>类型</th> 
   <th>必填</th> 
   <th>描述</th> 
   <th>平台兼容</th> 
  </tr> 
 </thead> 
 <tbody> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#globalstyle" title="globalStyle">globalStyle</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>设置默认页面的窗口表现</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#pages" title="pages">pages</a></td> 
   <td>Object Array</td> 
   <td>是</td> 
   <td>设置页面路径及窗口表现</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#easycom" title="easycom">easycom</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>组件自动引入规则</td> 
   <td>2.5.5+</td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#tabbar" title="tabBar">tabBar</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>设置底部 tab 的表现</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#condition" title="condition">condition</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>启动模式配置</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#subPackages" title="subPackages">subPackages</a></td> 
   <td>Object Array</td> 
   <td>否</td> 
   <td>分包加载配置</td> 
   <td>H5 不支持</td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#preloadrule" title="preloadRule">preloadRule</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>分包预下载规则</td> 
   <td>微信小程序</td> 
  </tr> 
  <tr> 
   <td><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/workers.html" title="workers">workers</a></td> 
   <td>String</td> 
   <td>否</td> 
   <td><code>Worker</code>&nbsp;代码放置的目录</td> 
   <td>微信小程序</td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#leftwindow" title="leftWindow">leftWindow</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>大屏左侧窗口</td> 
   <td>H5</td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#topwindow" title="topWindow">topWindow</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>大屏顶部窗口</td> 
   <td>H5</td> 
  </tr> 
  <tr> 
   <td><a href="https://uniapp.dcloud.net.cn/collocation/pages#rightwindow" title="rightWindow">rightWindow</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>大屏右侧窗口</td> 
   <td>H5</td> 
  </tr> 
  <tr> 
   <td><a href="https://doc.dcloud.net.cn/uniCloud/uni-id/summary.html#uni-id-router" title="uniIdRouter">uniIdRouter</a></td> 
   <td>Object</td> 
   <td>否</td> 
   <td>自动跳转相关配置，新增于HBuilderX 3.5.0</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>entryPagePath</td> 
   <td>String</td> 
   <td>否</td> 
   <td>默认启动首页，新增于HBuilderX 3.7.0</td> 
   <td>微信小程序、支付宝小程序</td> 
  </tr> 
 </tbody> 
</table>

下面的page.json是个简单的 示例，标记了每个配置项的用法。

```java
{
	"pages": [
		/* 主页面 */
		{
			"path": "pages/index/index",
			"style": {
				// 导航栏标题文字内容
				"navigationBarTitleText": "首页"
				// 是否开启下拉刷新
				// "enablePullDownRefresh": true
			}
		}
		
	],
	//分包
	"subPackages": [
		/* 子页面 */
		{
			"root": "pages/practice/demo",
			"pages": [
				{
					"path": "introduce",
					"style": {
						"navigationBarTitleText": "页面介绍", //设置页面标题文字
						"enablePullDownRefresh": true //开启下拉刷新
					}
				}
			]
		}
	],
	// 全局样式
	"globalStyle": {
		// 导航栏标题颜色及状态栏前景颜色，仅支持 black/white
		"navigationBarTextStyle": "black",
		"enablePullDownRefresh": false,
		// 定义页面底部的触发距离
		"onReachBottomDistance": 50,
		// 导航栏标题文字内容
		"navigationBarTitleText": "uni-app",
		// 导航栏背景颜色（同状态栏背景色）
		"navigationBarBackgroundColor": "#F8F8F8",
		"backgroundColor": "#F8F8F8"
	},
	
	/* 	设置底部 tab 的表现 */
	"tabBar": {
		// 字体颜色
		"color": "#cdcdcd",
		// 选中字体颜色
		"selectedColor": "#83b343",
		"borderStyle": "black",
		"backgroundColor": "#fff",
		"fontSize": "16px",
		"iconWidth": "18px",
		"list": [{
				"pagePath": "pages/index/index",
				"text": "农事记录",
				// 图标路径
				"iconPath": "static/iconimg/icon_note.png",
				// 选中图标路径
				"selectedIconPath": "static/iconimg/icon_noteOp.png"
			}
		],
		/* 这里设置的底部导航栏，中间图标凸起的效果 */。
		//注意：目前仅在app,h5中显示，微信小程序不支持
		"midButton":{
			"iconPath": "static/iconimg/icon_tong.png",
			"iconWidth":"70px",
			// "text":"练习",
			"width":"70px",
			"height":"70px"
		}
	}
}
```

![](https://i-blog.csdnimg.cn/direct/45f51ef0a4414ae788a81217c698f847.png)![](https://i-blog.csdnimg.cn/direct/3d25935ee2324fa2a3bde9002e28c003.png)

注意：

每新增一个页面，都要在page.json中配置，不然找不到。

![](https://i-blog.csdnimg.cn/direct/b4fbe56b760d4d78a21811195fcab7f0.png)

或者分包，分包主要是因为有时候项目过大会影响打包，分包后减少内存。

## 四、组件 

### 4.1 视图容器 

所有的视图组件，包括view、swiper等，本身不显示任何可视化元素。它们的用途都是为了包裹其他真正显示的组件。

#### 4.1.1 view：视图容器 

类似于传统html中的div，用于包裹各种元素内容。

#### 4.1.2 scroll-view：可滚动视图 

用于区域滚动。

需注意在webview渲染的页面中，区域滚动的性能不及页面滚动。

使用竖向滚动时，需要给 `<scroll-view>` 一个固定高度，通过 css 设置 height；使用横向滚动时，需要给`<scroll-view>`添加`white-space: nowrap;`样式。

代码示例：

```java
<view>
		<!-- 纵向滚动 -->
		<view class="area" style="border: 1rpx solid #000000;">
			<scroll-view style="height: 200rpx;" scroll-y="true">
				<view style="margin: 40px 0;">冯绍峰</view>
				<view style="margin: 40px 0;">冯绍峰</view>
				<view style="margin: 40px 0;">冯绍峰</view>
				<view style="margin: 40px 0;">冯绍峰</view>
			</scroll-view>
		</view>

		<!-- 横向滚动 -->
		<view class="area" style="border: 1rpx solid #000000;">
			<scroll-view scroll-x="true" style="width: 100%;height: 50px;white-space: nowrap;" @scroll="scroll"
				scroll-left="120">
				<view style="height: 50px;display: inline-block;width: 100%;">冯绍峰</view>
				<view style="height: 50px;display: inline-block;width: 100%;">冯绍峰</view>
			</scroll-view>
		</view>
</view>
```

运行结果：

![](https://i-blog.csdnimg.cn/direct/eaddddbedbe341168d045d72d7fbe1b3.png)

#### 4.1.3 swiper:滑块视图容器 

一般用于左右滑动或上下滑动，比如banner轮播图。

注意滑动切换和滚动的区别，滑动切换是一屏一屏的切换。swiper下的每个swiper-item是一个滑动切换区域，不能停留在2个滑动区域之间。

```

<swiper class="swiper detail" autoplay interval="5000" circular                   @change="onChangeSwiper">
	<swiper-item v-for="(item,index) in detailObj.image">
				<view class="swiper-item"  
					@click="previewImage(index)">
					<image :src="item.file_path" 
					mode="heightFix"></image>
				</view>
					
	</swiper-item>
				
</swiper>

```

 `class="swiper detail"`：为该 Swiper 组件添加 CSS 类名，用于样式控制。
- `autoplay`：设置自动播放功能。
- `interval="5000"`：设置轮播间隔时间为 5000 毫秒（即 5 秒）。
- `circular`：设置为循环模式，即当到达最后一张图片时，会回到第一张。
- `@change="onChangeSwiper"`：绑定事件监听器，当轮播图切换时触发 `onChangeSwiper` 方法。
#### 4.1.4 match-media:匹配检测节点 

相当于

```java
@media screen and (max-width: 1500px) {}
```

代码示例：

```java
<template>
    <view>
        <match-media :min-width="375" :max-width="800" >
            <view>当页面最小宽度 375px， 页面宽度最大 800px 时显示</view>
        </match-media>

        <match-media :min-height="400" :orientation="landscape">
            <view>当页面高度不小于 400px 且屏幕方向为横向时展示这里</view>
        </match-media>
    </view>
</template>
```

#### 4.1.5 movable-area：可拖动区域 

由于app和小程序的架构是逻辑层与视图层分离，使用js监听拖动时会引发逻辑层和视图层的频繁通讯，影响性能。为了方便高性能的实现拖动，平台特封装了movable-area组件。

movable-area指代可拖动的范围，在其中内嵌movable-view组件用于指示可拖动的区域。

即手指/鼠标按住movable-view拖动或双指缩放，但拖不出movable-area规定的范围。

当然也可以不拖动，而使用代码来触发movable-view在movable-area里的移动缩放。

#### 4.1.6 movable-view：可移动的视图容器 

在页面中可以拖拽滑动或双指缩放。

movable-view必须在movable-area组件中，并且必须是直接子节点，否则不能移动。

#### 4.1.7 cover-view：覆盖在原生组件上的文本视图 

app-vue和小程序框架，渲染引擎是webview的。但为了优化体验，部分组件如map、video、textarea、canvas通过原生控件实现，原生组件层级高于前端组件（类似flash层级高于div）。为了能正常覆盖原生组件，设计了cover-view。

#### 4.1.8 cover-image：覆盖在原生组件上的图片视图 

可覆盖的原生组件同cover-view，支持嵌套在cover-view里。

### 4.2 基础内容 

#### 4.2.1 text:文本 

行内元素，相当于<span>

```java
<view class="area">
	<h1>text</h1>
	<text>沉醉不知归路</text>
	<!-- 长按可选择 -->
	<text selectable>沉醉不知归路</text>
</view>
```

![](https://i-blog.csdnimg.cn/direct/fcee04d1295748dfb8d06e881bca3045.png)

#### 4.2.2 icon:图标 

![](https://i-blog.csdnimg.cn/blog_migrate/7c91d0c412841d5699eaceafb92ab977.png)![](https://i-blog.csdnimg.cn/blog_migrate/5aa91a6cfb81e91f7ca29902cee6c7ad.png)

这是uniapp自带的图标，还可以通过[iconfont-阿里巴巴矢量图标库][iconfont-]进行图标添加，可下载图片，可下载样式。

下载样式的步骤：

步骤一：

![](https://i-blog.csdnimg.cn/direct/34272dbd723d4f8e8a6253939935d7af.png)

步骤二：

![](https://i-blog.csdnimg.cn/direct/df6c87398a6c4df5a35bdc0a8bd4c88f.png)

![](https://i-blog.csdnimg.cn/direct/bc937b8ba7e94c9e85fde588a8ddc82c.png)

步骤三：

![](https://i-blog.csdnimg.cn/direct/ae6edd0570894b919dfbacca3d788df9.png)

步骤四：

下载完成后解压：

![](https://i-blog.csdnimg.cn/direct/ac210cfae19f493581a762eef278a93a.png)

步骤五：

![](https://i-blog.csdnimg.cn/direct/3830af8be1804b2b83725b8e6df06668.png)

步骤六：

引入iconfont.css

![](https://i-blog.csdnimg.cn/direct/ef8f013226af48eab9a1235910504c44.png)

步骤七：

引入icon

```java
<view class="area">
	<view class="icon iconfont"></view>
</view>
```

运行后发现，icon显示出来了，但是，颜色是黑白的，如何改成彩色呢？

在阿里矢量图库中勾选彩色，并重新下载引用，即可得到彩色图标。

![](https://i-blog.csdnimg.cn/direct/3e7da1ac4ad74f75b4cb2681f6950702.png)

![](https://i-blog.csdnimg.cn/direct/192e080204bb47889433579220378c72.png)

#### 4.2.3 rich-text：富文本 

#### 4.2.4 progress：进度条 

属性说明

<table> 
 <thead> 
  <tr> 
   <th>属性名</th> 
   <th>类型</th> 
   <th>默认值</th> 
   <th>说明</th> 
   <th>平台差异说明</th> 
  </tr> 
 </thead> 
 <tbody> 
  <tr> 
   <td>percent</td> 
   <td>Number</td> 
   <td>无</td> 
   <td>百分比0~100</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>show-info</td> 
   <td>Boolean</td> 
   <td>false</td> 
   <td>在进度条右侧显示百分比</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>border-radius</td> 
   <td>Number/String</td> 
   <td>0</td> 
   <td>圆角大小</td> 
   <td>app-nvue、微信基础库2.3.1+、QQ小程序、快手小程序、京东小程序</td> 
  </tr> 
  <tr> 
   <td>font-size</td> 
   <td>Number/String</td> 
   <td>16</td> 
   <td>右侧百分比字体大小</td> 
   <td>app-nvue、微信基础库2.3.1+、QQ小程序、京东小程序</td> 
  </tr> 
  <tr> 
   <td>stroke-width</td> 
   <td>Number</td> 
   <td>6</td> 
   <td>进度条线的宽度，单位px</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>activeColor</td> 
   <td>Color</td> 
   <td>#09BB07（百度为#E6E6E6）</td> 
   <td>已选择的进度条的颜色</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>backgroundColor</td> 
   <td>Color</td> 
   <td>#EBEBEB</td> 
   <td>未选择的进度条的颜色</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>active</td> 
   <td>Boolean</td> 
   <td>false</td> 
   <td>进度条从左往右的动画</td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>active-mode</td> 
   <td>String</td> 
   <td>backwards</td> 
   <td>backwards: 动画从头播；forwards：动画从上次结束点接着播</td> 
   <td>App、H5、微信小程序、QQ小程序、快手小程序、京东小程序</td> 
  </tr> 
  <tr> 
   <td>duration</td> 
   <td>Number</td> 
   <td>30</td> 
   <td>进度增加1%所需毫秒数</td> 
   <td>App-nvue2.6.1+、微信基础库2.8.2+、H5 3.1.11+、App-Vue 3.1.11+、快手小程序、京东小程序</td> 
  </tr> 
  <tr> 
   <td>@activeend</td> 
   <td>EventHandle</td> 
   <td></td> 
   <td>动画完成事件</td> 
   <td>微信小程序、京东小程序</td> 
  </tr> 
 </tbody> 
</table>

代码示例：

```java
<view class="progress-box">
	<progress percent="50" show-info stroke-width="3"  activeColor="red" backgroundColor="blue"/>
</view>
```

![](https://i-blog.csdnimg.cn/direct/c103f24dc7654e2b9a0366114f143457.png)

### 4.3 表单组件 

所用到的标签跟html的差不多，有几个不一样：

<table> 
 <tbody> 
  <tr> 
   <td>外</td> 
   <td>input</td> 
   <td>checkbox-group</td> 
   <td>picker</td> 
   <td>radio-group</td> 
   <td>slider</td> 
   <td>switch</td> 
   <td>editor</td> 
  </tr> 
  <tr> 
   <td>内</td> 
   <td></td> 
   <td>checkbox</td> 
   <td></td> 
   <td>radio</td> 
   <td></td> 
   <td></td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>描述</td> 
   <td>单行输入框</td> 
   <td> <p>多选框组</p> </td> 
   <td>选择器</td> 
   <td>单项选择器</td> 
   <td>滑动选择器</td> 
   <td>开关选择器</td> 
   <td>富文本编辑器</td> 
  </tr> 
  <tr> 
   <td> <p>是否支持</p> <p>form表单</p> </td> 
   <td>是</td> 
   <td>是</td> 
   <td>是</td> 
   <td>是</td> 
   <td>是</td> 
   <td>是</td> 
   <td>否</td> 
  </tr> 
 </tbody> 
</table>

form表单：

#### 4.3.1 要点 

当点击 `<form>` 表单中 formType 为 submit 的 `<button>` 组件时，会将表单组件中的 value 值进行提交，需要在表单组件中加上 name 来作为 key。

也就是需要给支持form表单的组件上加name，不然提交的时候识别不到。例如：

![](https://i-blog.csdnimg.cn/direct/09fab693569b41d7a7201897bb3121f8.png)

注意：在表单中input只能写一个focus，不然也识别不到。

#### 4.3.2 form写法 

```java
<template>
	<view class="content">
		<form @submit="formSubmit" @reset="formReset">
            //这里写组件.....
			<button type="primary" form-type="submit">Submit</button>
			<button type="warn" form-type="reset">Reset</button>
		</form>
	</view>
</template>
<script>
	export default {
		methods: {
            submit: function(e) {
				var formdata = e.detail.value
				console.log(formdata)

			},
			formReset: function(e) {
				console.log('清空数据')
			},
		}
	}
</script>
```

点击提交或重置，就能自动识别到所写组件的值。

#### 4.3.3 代码示例 

```java
<template>
	<view class="content">
		<view class="area">
			<form @submit="formSubmit" @reset="formReset">
				<view>
					<text>姓名</text>
					<!-- @input 实时获取输入值-->
					<input focus maxlength="10" name="name" @input="onKeyInput" placeholder="姓名" />
				</view>
		
				<view>
					<!-- 
					 type:
						1.text	          文本输入键盘
						2.number	      数字输入键盘
						3.idcard          身份证输入键盘
						4.digit	          带小数点的数字键盘
						5.tel	          电话输入键盘	
						6.safe-password	  密码安全输入键盘
						7.nickname	      昵称输入键盘
					 -->
					<text>年纪</text>
					<input type="number" name="age" placeholder="年纪" />
				</view>
				<checkbox-group @change="checkboxChange" name="change">
					<label class="label" v-for="(item,index) in checkbox">
						<view>
							<checkbox :value="item.value" :checked="item.checked" />
						</view>
						<view>{
           
  
    
    {item.name}}</view>
					</label>

				</checkbox-group>
				<editor id="editor" class="ql-container" placeholder="开始输入..." show-img-size show-img-toolbar
					style="width: 100%;height: 100rpx;min-height: 100rpx;border: 1px solid #000000;" name="editor">
				</editor>
				<picker @change="bindPickerChange" :value="index" :range="array" name="week">
					<view class="uni-input">{
           
  
    
    {array[index]}}</view>
				</picker>
				<view>
					<radio-group name="radioGroup">

						<label class="uni-list-cell uni-list-cell-pd">
							<view>
								<radio value="r1" checked="true" />
							</view>
							<view>选中</view>
						</label>
						<label class="uni-list-cell uni-list-cell-pd">
							<view>
								<radio value="r2" />
							</view>
							<view>未选中</view>
						</label>
					</radio-group>
				</view>
				<view>
					<!-- 滑块 -->
					<slider value="80" min="50" max="200" activeColor="#FFCC33" backgroundColor="#000000"
						block-color="#8A6DE9" block-size="20" show-value name="slider"/>
				</view>
				<view>
					<!-- 开关选择器   修改样式大小是通过transform -->
					<switch checked @change="switch1Change" color="#FFCC33" style="transform:scale(0.7)" name="switch"/>
				</view>
				<view>
					<!-- 多行文本输入 其中auto-height 是否自动增高 -->
					<textarea placeholder="占位符" style="border: 1px solid #000000;margin: 20rpx;" name="textarea1"/>
					<textarea placeholder-style="color:#F76260" placeholder="占位符字体是红色的" auto-height
						style="border: 1px solid #000000;margin: 20rpx;"  name="textarea2"/>
				</view>
				<view class="buttonCon">
					<!--
						1.type：
							1.primary: 默认    2.default：白色     3.warn：红色
						2.loading:名称前是否带 loading 图标
						3.disabled:是否禁用
						4.size:大小
						    1.default:默认大小     2.mini:小尺寸
						 -->
					<button type="primary" form-type="submit">Submit</button>
					<button type="warn" form-type="reset" size="mini">Reset</button>
				</view>
			</form>


		</view>

	</view>
</template>

<script>
	export default {

		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			return {

				checkbox: [{
						value: 1,
						name: "选项一"
					},
					{
						value: 2,
						name: "选项二",
						checked: true
					},
					{
						value: 3,
						name: "选项三"
					},
				],
				array: ['星期一', '星期二', '星期三'],
				index: 0,
				years,
				year,
				months,
				month,
				days,
				day,
				value: [9999, month - 1, day - 1],
				visible: true,
				indicatorStyle: `height: 50px;`
			}
		},
		methods: {
			checkboxChange: function(e) {
				var items = this.items,
					values = e.detail.value;
				console.log(e)

			},
			formSubmit: function(e) {
				var formdata = e.detail.value
				console.log(formdata)

			},
			formReset: function(e) {
				console.log('清空数据')
			},
			onKeyInput: function(event) {
				console.log(event.target.value)
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},
			bindChange: function(e) {
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]
			},
			switch1Change: function(e) {
				console.log(e.detail.value)
			}
		}
	}
</script>
```

这里写了一些表单组件的简单示例和注解，运行结果：

![](https://i-blog.csdnimg.cn/direct/b6e591e1ace44c7f863512648935a038.png)

点击Submit，打印结果：

![](https://i-blog.csdnimg.cn/direct/28a55be408ec477a9334cdbf63547d4f.png)

### 4.4 媒体组件 

#### 4.4.1 audio:音频 

```java
<!-- 默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效 -->
<audio style="text-align: left" src="https://web-ext-storage.dcloud.net.cn/uni-app/ForElise.mp3" poster="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/music-a.png" name="致爱丽丝" author="暂无" controls></audio>
```

![](https://i-blog.csdnimg.cn/direct/e03b48dda57b4a41bb17ddeac2b79f11.png)

#### 4.4.2 camera:相机 

页面内嵌的区域相机组件。注意这不是点击后全屏打开的相机。

```java
<camera device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera>
```

#### 4.4.3 image:图片 

mode:有效值

<table> 
 <thead> 
  <tr> 
   <th>模式</th> 
   <th>值</th> 
   <th>说明</th> 
  </tr> 
 </thead> 
 <tbody> 
  <tr> 
   <td>缩放</td> 
   <td>scaleToFill</td> 
   <td>不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素</td> 
  </tr> 
  <tr> 
   <td>缩放</td> 
   <td>aspectFit</td> 
   <td>保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。</td> 
  </tr> 
  <tr> 
   <td>缩放</td> 
   <td>aspectFill</td> 
   <td>保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。</td> 
  </tr> 
  <tr> 
   <td>缩放</td> 
   <td>widthFix</td> 
   <td>宽度不变，高度自动变化，保持原图宽高比不变</td> 
  </tr> 
  <tr> 
   <td>缩放</td> 
   <td>heightFix</td> 
   <td>高度不变，宽度自动变化，保持原图宽高比不变&nbsp;<strong>App 和 H5 平台 HBuilderX 2.9.3+ 支持、微信小程序需要基础库 2.10.3</strong></td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>top</td> 
   <td>不缩放图片，只显示图片的顶部区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>bottom</td> 
   <td>不缩放图片，只显示图片的底部区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>center</td> 
   <td>不缩放图片，只显示图片的中间区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>left</td> 
   <td>不缩放图片，只显示图片的左边区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>right</td> 
   <td>不缩放图片，只显示图片的右边区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>top left</td> 
   <td>不缩放图片，只显示图片的左上边区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>top right</td> 
   <td>不缩放图片，只显示图片的右上边区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>bottom left</td> 
   <td>不缩放图片，只显示图片的左下边区域</td> 
  </tr> 
  <tr> 
   <td>裁剪</td> 
   <td>bottom right</td> 
   <td>不缩放图片，只显示图片的右下边区域</td> 
  </tr> 
 </tbody> 
</table>

```java
<image style="width: 200px; height: 200px; background-color: #eeeeee;" mode="aspectFit"
					src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg"></image>
```

#### 4.4.4 video:视频 

```java
<video id="myVideo" src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4"   enable-danmu  controls></video>
```

![](https://i-blog.csdnimg.cn/direct/b06c10893f8348a28fcb364d9bd20483.png)

### 4.5 map地图 

```java
<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers">
				</map>

			</view>
		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/pointer_orange.png',
					//marker宽高
					width:10,
					height:15
				}, {
					latitude: 39.90,
					longitude: 116.39,
					iconPath: '../../../static/pointer_orange.png',
					width:10,
					height:15
				}]
			}
		},
		methods: {

		}
	}
</script>
```

![](https://i-blog.csdnimg.cn/direct/6498e7494b14465fb00b82b984b3757e.png)

### 4.5 扩展组件 

当内置组件不能满足需求时，uniapp官网提供了一些扩展组件，[uni-app官网][uni-app 1]

比如，想要引用日历，

![](https://i-blog.csdnimg.cn/direct/78d0f8b6d6d04240967d185b28a02e33.png)

![](https://i-blog.csdnimg.cn/direct/2a2f5d2116a94f1abaa6fef1f54a669a.png) 现在好多好用的组件都需要打赏或者看广告，这里选择看广告 ，看完后：

![](https://i-blog.csdnimg.cn/direct/14ba557f56ce48e99c7d4f7dc21518d0.png)

![](https://i-blog.csdnimg.cn/direct/2f0708ca92c54652b2b593fb49e645c3.png)

点击确定后，该项目的uni\_modules文件夹下会多出一个uni-calendar的文件，这个就是日历的相关文件。

![](https://i-blog.csdnimg.cn/direct/7c4acc3216594c0baa05fe27f498fc08.png)

引入：

```java
<template>
	<view class="content">
		<view>
			<uni-calendar ref="calendar" :insert="false" @confirm="confirm" range="true" />
			<button @click="open">打开日历</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			open() {
				this.$refs.calendar.open();
			},
			confirm(e) {
				console.log(e);
			}
		}
	}
</script>
```

效果：

![](https://i-blog.csdnimg.cn/direct/1abb32bbacae4d8daff2da12725192e7.png)

其他扩展组件类似。

## 五、uniapp生命周期 

### 5.1 应用的生命周期 

`uni-app`支持如下应用生命周期函数

<table> 
 <thead> 
  <tr> 
   <th>函数名</th> 
   <th>说明</th> 
  </tr> 
 </thead> 
 <tbody> 
  <tr> 
   <td>onLauch</td> 
   <td>当uni-app初始化完成时触发（全局只触发一次）</td> 
  </tr> 
  <tr> 
   <td>onShow</td> 
   <td>当uni-app启动，或从后台进入前台显示</td> 
  </tr> 
  <tr> 
   <td>onHide</td> 
   <td>当uni-app从前台进入后台</td> 
  </tr> 
  <tr> 
   <td>onError</td> 
   <td>当uni-app报错时触发</td> 
  </tr> 
 </tbody> 
</table>

在创建项目时，App.vue已经写好了。

![](https://i-blog.csdnimg.cn/direct/cd1db15bb13c4b0289df81e0affd88fc.png)

打印结果：

![](https://i-blog.csdnimg.cn/direct/0de84a23a9254d8dab21f2f5c056baf6.png)

### 5.2 页面的生命周期 

详情请看：[页面 | uni-app官网][_ uni-app 1]

简单的示例：

(tabbar页面)

![](https://i-blog.csdnimg.cn/direct/ecbb353846af44029ee85ea518064593.png)

 第一次进入当前页面的打印结果（由此可看运行顺序）：

![](https://i-blog.csdnimg.cn/direct/32cc948660f64cd2944d860a4d29dcd9.png)

离开当前页面的打印结果：

![](https://i-blog.csdnimg.cn/direct/709b39ef7eb84cbf8106437f820296f5.png)

再次进入当前页面的打印结果：

![](https://i-blog.csdnimg.cn/direct/d449f33fafca4c7a9c92315875d62bae.png)

由此可见，在tabbar页面onLoad和onReady只在初始化执行一次。而onShow和onHide只要显示/隐藏当前页都会执行。

(非tabbar页面)

每次进入非tabbar页面都会执行onLoad和onShow。非 tabbar 页面，每次打开都会执行 `onLoad` 方法，因为这些页面会在每次打开时重新初始化。

### 5.3 组件的生命周期 

与vue标准组件的生命周期相同

详情请看官网：[页面 | uni-app官网][_ uni-app 2]

## 六、网络 

[uni.request(OBJECT) | uni-app官网][uni.request_OBJECT_ _ uni-app]

### 6.1 网络请求 

发起网络请求。uni.request

data 数据说明

最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String。转换规则如下：

1.对于 GET 方法，会将数据转换为 query string。例如 \{ name: 'name', age: 18 \} 转换后的结果是 name=name&age=18。

2.对于 POST 方法且 header\['content-type'\] 为 application/json 的数据，会进行 JSON 序列化。

3.对于 POST 方法且 header\['content-type'\] 为 application/x-www-form-urlencoded 的数据，会将数据转换为 query string。

```java
//网络请求api
    uni.request({
		 url:url, // 请求路径
		 data:{}, // 参数
		 header:{}, // 请求头
		 method:'GET', // 请求方法
		 timeout:10000, // 超时请求
		 dataType:'json',// 默认json，请求数据类型
		 success: (res) =>{ // 成功时的回调
		 	console.log(res);
		 },
		 fail: (err) => { // 失败时的回调
		 	console.log(JSON.stringify(err));
		 }
	})
```

我常用的（参考）：

```java
uni.request({
	url: api.base + "/app/xx",
	method: "POST",
	data: {
		id: id
	},
	header: {
	"content-type": "application/x-www-form-urlencoded"
	},
	success: (res) => {
        //...
    }
})
```

如果微信开发者工具中，没有发送成功，可以试试如下方法。

![](https://i-blog.csdnimg.cn/blog_migrate/0424504ec1cb17d00f964f54914b2088.png)

### 6.2 上传和下载 

 *  App支持多文件上传，微信小程序只支持单文件上传

1.文件上传chooseFile、下载downloadFile与打开openDocument

```java
<button @click="onuploadFlie">文件上传</button>
<button @click="ondownloadFile">下载</button>
 
 
//上传文件
onuploadFlie(){
    uni.chooseFile({
        count: 1, //默认100
        type:'file', //仅H5支持
        extension:['.doc', '.docx', '.pdf', '.pptx', '.ppt', '.xls', '.xlsx','.zip'], //选择上传文件的格式
	    success: function (res) {
	    	console.log(JSON.stringify(res.tempFilePaths));
	    }
    });
}
//下载文件并打开文件
ondownloadFile(){
    uni.downloadFile({
	url: 'https://www.example.com/file/test', //下载文件的路径
	success: (res) => {
        var filePath = res.tempFilePath; //文件路径
		uni.openDocument({ //打开下载完成的路径
            filePath: filePath, //文件路径
            showMenu: true,
            success: function (res) {
               console.log('打开文档成功');
            }
       });
	}
});
}
```

2.图片上传

```java
<button @click="onuploadphoto">图片上传</button>
<button @click="ondownload">下载</button>
<image :src="downloadfile" style="width: 300rpx;height: 270rpx;" mode="aspectFill"></image>
data() {
	return {
		downloadfile:''
	}
},
onuploadphoto(){ //上传图片
	uni.chooseImage({
		count:1, // 上传图片的数量
		sizeType:['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		sourceType:['album'], //从哪里选择图片(案例从相册选择)
		success: (res) => {
			console.log(JSON.stringify(res)); // 成功了查看图片信息
		},
		fail: () => {
			console.log(JSON.stringify(err));
		}
	})
},
ondownload(){ //下载图片
	uni.downloadFile({	url:'https://www.example.com/file/test', // 这里是图片接口地址 直接 url拼接参数可
	timeout:30000, //超时
        headers:{} , //是否需要携带请求头
        methods:'GET'/'POST', //是否需要添加请求方法
		success: (res) => {
			console.log(JSON.stringify(res));  //显示图片的信息
			this.downloadfile = res.tempFilePath;    //显示图片
		},
		fail: (err)=>{
			console.log(JSON.stringify(err));
		}
	})
}
```

## 七、数据缓存 

<table> 
 <tbody> 
  <tr> 
   <td colspan="1">描述</td> 
   <td>写法</td> 
   <td> <p>是否</p> <p>异步</p> </td> 
   <td> <p>是否</p> <p>同步</p> </td> 
  </tr> 
  <tr> 
   <td colspan="1" rowspan="2"> <p><strong>本地存储指定的键值对</strong></p> </td> 
   <td>uni.setStorage(OBJECT)</td> 
   <td><strong>&nbsp; &nbsp;√</strong></td> 
   <td></td> 
  </tr> 
  <tr> 
   <td>uni.setStorageSync(KEY,DATA)</td> 
   <td></td> 
   <td><strong>√</strong></td> 
  </tr> 
  <tr> 
   <td colspan="1" rowspan="2"> <p><strong>获取本地存储键对应的值</strong></p> </td> 
   <td> <p>uni.getStorage(OBJECT)</p> </td> 
   <td><strong>&nbsp; &nbsp;√</strong></td> 
   <td></td> 
  </tr> 
  <tr> 
   <td> <p>uni.getStorageSync(KEY,DATA)</p> </td> 
   <td></td> 
   <td><strong>&nbsp;√</strong></td> 
  </tr> 
  <tr> 
   <td colspan="1" rowspan="2"> <p><strong>移除缓存</strong></p> </td> 
   <td> <p>uni.removeStorage(OBJECT)</p> </td> 
   <td><strong>&nbsp; &nbsp;√</strong></td> 
   <td></td> 
  </tr> 
  <tr> 
   <td> <p>uni.removeStorageSync(KEY)</p> </td> 
   <td></td> 
   <td><strong>√</strong></td> 
  </tr> 
  <tr> 
   <td colspan="1" rowspan="2"> <p><strong>&nbsp;清空缓存</strong></p> </td> 
   <td> <p>uni.clearStorage()</p> </td> 
   <td><strong>&nbsp; &nbsp;√</strong></td> 
   <td></td> 
  </tr> 
  <tr> 
   <td> <p>uni.clearStorageSync()</p> </td> 
   <td></td> 
   <td><strong>&nbsp;√</strong></td> 
  </tr> 
 </tbody> 
</table>

代码示例：

### 7.1 异步存取指定键值对（对应的值） 

```java
uni.setStorage({
	key:'name',
	data:'小童',
	success() {
		console.log('success');
	}
})
uni.getStorage({
	key: 'name',
	success: function (res) {
		console.log(res.data);
	}
});
```

![](https://i-blog.csdnimg.cn/direct/714cf9a7fcf84385825c4f809a1005be.png)

![](https://i-blog.csdnimg.cn/direct/8a70a4e242cf4a5184ea35007207d36f.png)

### 7.2 同步存取指定键值对（对应的值） 

```java
try {
	uni.setStorageSync('name', '小童');
} catch (e) {
	// error
}

try {
	const value = uni.getStorageSync('name');
	if (value) {
	console.log(value);
}
} catch (e) {
	// error
}
```

### 7.3 移除指定键值对 

```java
//异步
uni.removeStorage({
	key: 'name',
	success: function (res) {
		console.log('success');
	}
});

//同步
try {
	uni.removeStorageSync('name');
} catch (e) {
	// error
}
```

### 7.4 清理本地数据缓存 

```java
//异步
uni.clearStorage();

//同步
try {
	uni.clearStorageSync();
} catch (e) {
	// error
}
```

## 八、页面跳转、传参 

### 8.1 路由跳转 

<table> 
 <tbody> 
  <tr> 
   <td></td> 
   <td>描述</td> 
   <td>注意</td> 
  </tr> 
  <tr> 
   <td>uni.navigateTo</td> 
   <td><strong>保留当前</strong>页面，跳转到应用内的某个页面</td> 
   <td colspan="1" rowspan="2">只能打开非 tabBar 页面</td> 
  </tr> 
  <tr> 
   <td> <p>uni.redirectTo</p> </td> 
   <td><strong>关闭当前</strong>页面，跳转到应用内的某个页面</td> 
  </tr> 
  <tr> 
   <td> <p>uni.switchTab</p> </td> 
   <td>跳转到<strong> tabBar </strong>页面，并<strong>关闭其他所有非 tabBa</strong>r 页面</td> 
   <td>只能打开&nbsp;<code>tabBar</code>&nbsp;页面</td> 
  </tr> 
  <tr> 
   <td> <p>uni.reLaunch</p> </td> 
   <td><strong>关闭所有</strong>页面，打开到应用内的某个页面</td> 
   <td>可以打开任意页面</td> 
  </tr> 
  <tr> 
   <td> <p>uni.navigateBack</p> </td> 
   <td><strong>关闭当前</strong>页面，返回上一页面或多级页面</td> 
   <td></td> 
  </tr> 
 </tbody> 
</table>

uni.navigateBack写法示例：

```java
uni.navigateBack({
	delta: 2 //返回两级
});
uni.navigateBack() //默认delta回退1时不用写
```

可通过`getCurrentPages()` 获取当前的页面栈，决定需要返回几层。

```java
let pagearr = getCurrentPages(); //获取应用页面栈
console.log(pagearr)
let currentPage = pagearr[pagearr.length - 1]; //获取当前页面信息

//currentPage里面带有当前页面信息。如果要获取当前页的url:
//currentPage.options
```

![](https://i-blog.csdnimg.cn/direct/d3d3c7bbe4f8489e9dcdeaf41932b1ed.png)

代表当前页面是第二层。返回到第一层delta肯定是1。若当前是第三层， 返回到第一层delta则是2.

### 8.2 路由传参 

1.通过URL携带参数  
在跳转页面时，可以将参数附加到URL中，然后在目标页面通过`this.$route.query`获取这些参数。例如：

```java
uni.navigateTo({
    url:'/pages/detail/detail?id=1&name=test'
})
```

2.在目标页面获取参数

```java
export default{
    onLoad:function(options){
        console.log(options); 
        console.log(options.id);    //输出 1
        console.log(options.name);  //输出test
    }
}
```

打印options的结果：

![](https://i-blog.csdnimg.cn/direct/ca3133ba6b3e49518c1ef97770813e3b.png)

### 8.3 事件传参 

页面A：

```java
// 页面A
				uni.navigateTo({
				  url: '/pages/practice/demo/pageB',
				  events: {
				    // 事件名
				    customEvent: (data) => {
				      console.log(data.userId); // 1
				      console.log(data.userName); // JohnDoe
				    },
				    // ... 其他事件处理
				  },
				  success: (res) => {
				    // 向页面B传递参数
				    res.eventChannel.emit('customEvent', { userId: 1, userName: 'JohnDoe' });
				  }
				});
```

页面B：

```java
onShow() {
			// 监听事件
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('customEvent', (data) => {
				console.log(data.userId); // 1
				console.log(data.userName); // JohnDoe
			});
		}
```

运行结果：

![](https://i-blog.csdnimg.cn/direct/31019e842e58455f8f5d651994f0b1cb.png)

### 8.4 组件传值 

#### 8.4.1 父组件给子组件传值 

1.  在父组件elementFather.vue里面定义了title:"name"
2.  在子组件中通过props来接收
3.  子组件接收到父组件传递过来的值以后,可在页面显示

 注意:若在子组件中同时定义title则会发生冲突

父组件（elementFather.vue）：

```java
<template>
	<view class="content">
		父页面
		<element :title='name'></element>
	</view>
</template>

<script>
	import element from 'components/element.vue'
	export default {
		data(){
			return{
				name:'父页面的标题'
			}
		},
		components:{
			element
		},
	}
</script>
```

子组件（element.vue）：

```java
<template>
	<view class="content">
		子页面
		<view>父组件传来的数据：{
           
  
    
    {title}}</view>
	</view>
</template>

<script>
	export default {
		props:['title'],
	}
</script>
```

运行结果：

![](https://i-blog.csdnimg.cn/direct/927e60d63f164f70a779d65c3af6a28c.png)

 ps:放一张之前学vue做的笔记

![](https://i-blog.csdnimg.cn/direct/f7c992aed8074fbf98b391274bfaf3ff.png)

#### 8.4.2 子组件给父组件传值 

1.在子组件中通过$emit方法给父组件传值this.$emit('myEven','我是子组件的数据')

>  $emit('方法名字',参数名)

2.在父组件中通过@myEven方法接收数据

子组件（element.vue）：

```java
<template>
	<view class="content">
		子页面
		<view>父组件传来的数据：{
           
  
    
    {title}}</view>
		<button @click="giveFather">给父组件传值</button>
	</view>
</template>

<script>
	export default {
		props:['title'],
		methods:{
			giveFather(){
				this.$emit('myEven','我是子组件的数据')
			}
		},
	}
</script>

<style>
</style>
```

父组件（elementFather.vue）：

```java
<template>
	<view class="content">
		父页面
		<element :title='name' @myEven="gitTitle"></element>
		<view>子组件传来的数据：{
           
  
    
    {father}}</view>
	</view>
</template>

<script>
	import element from 'components/element.vue'
	export default {
		data() {
			return {
				name: '父页面的标题',
				father:''
			}
		},
		components: {
			element
		},
		methods: {
			gitTitle(data) {
				console.log(data)
				this.father = data
			}

		},

	}
</script>

<style>
</style>
```

运行结果：

![](https://i-blog.csdnimg.cn/direct/10699a8e62ba4270945d5f4fa1f031e5.png)![](https://i-blog.csdnimg.cn/direct/9f72512bcecf434eb74b07a97313f82b.png)

 ps:放一张之前学vue做的笔记

![](https://i-blog.csdnimg.cn/direct/6a9f63d3a0144adb8064bef03d91f046.png)

## 九、位置 

<table> 
 <tbody> 
  <tr> 
   <td> <p><strong>获取位置</strong></p> </td> 
   <td><strong>查看位置</strong></td> 
  </tr> 
  <tr> 
   <td>uni.getLocation(OBJECT)</td> 
   <td> <p>uni.openLocation(OBJECT)</p> </td> 
  </tr> 
  <tr> 
   <td>获取当前的地理位置、速度。</td> 
   <td>使用应用内置地图查看位置。</td> 
  </tr> 
 </tbody> 
</table>

要获取位置首先检查uniapp的manifest文件发现位置权限已经开启：

![](https://i-blog.csdnimg.cn/direct/cd84cc7f2d564c9986f89d1656c69296.png)

也就是这种效果

![](https://i-blog.csdnimg.cn/direct/eba9bc471b12433484cb6c6fa3e3851b.png)

### 9.1 获取位置 

代码如下：

```java
//获取位置
uni.getLocation({
	//默认为 wgs84 返回 gps 坐标，gcj02 返回国测局坐标
	type: 'wgs84',
	success: function (res) {
	    console.log('当前位置的经度：' + res.longitude);
	    console.log('当前位置的纬度：' + res.latitude);
    }
});
```

打印结果：

![](https://i-blog.csdnimg.cn/direct/a5809a4abd69414fad4b0f7f975c60e9.png)

### 9.2 查看位置 

代码如下：

```java
uni.getLocation({
	type: 'gcj02', //返回可以用于uni.openLocation的经纬度
	success: function (res) {
	    const latitude = res.latitude;
		const longitude = res.longitude;
		uni.openLocation({
			latitude: latitude,
			longitude: longitude,
			success: function () {
				console.log('success');
			}
		});
    }
});
```

运行效果（微信开发者工具）：

![](https://i-blog.csdnimg.cn/direct/917d340f72564bc2aa52df41a0709f7d.png)

感觉位置有偏移。但是在微信开发者工具上用真机调试位置是准确的。

#### 9.3 使用腾讯地图获取定位\_uniapp 腾讯地图 

参考这个文章：[【uniapp小程序实战】—— 使用腾讯地图获取定位\_uniapp 腾讯地图(2)\_小程序地图定位服务-CSDN博客][uniapp_ _uniapp _2_-CSDN]

## 十、媒体 

### 10.1 图片 

代码如下：

```java
uni.chooseImage({
	count: 6, //默认9
	sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
	sourceType: ['album'], //从相册选择
	success: function (res) {
		console.log(res.tempFilePaths);
	}
});
```

可多选图片，打印结果：

![](https://i-blog.csdnimg.cn/direct/5a3212b6abf6471f83c37e49bd1604b8.png)

### 10.2 文件 

代码如下：

```java
uni.chooseFile({
  count: 6, //默认100
  extension:['.zip','.doc'],
	success: function (res) {
		console.log(JSON.stringify(res.tempFilePaths));
	}
});

// 选择图片文件
uni.chooseFile({
  count: 10,
  type: 'image',
  success (res) {
    // tempFilePath可以作为img标签的src属性显示图片
    const tempFilePaths = res.tempFiles
  }
})
```

### 10.3 视频 

代码如下：

```java
uni.chooseVideo({
	sourceType: ['camera', 'album'],
	success: function (res) {
		let src = res.tempFilePath;
	}
});
```

## 十一、界面 

### 11.1 交互反馈（提示框） 

<table> 
 <tbody> 
  <tr> 
   <td colspan="1" rowspan="2">消息提示框</td> 
   <td>uni.showToast(OBJECT)</td> 
   <td colspan="1" rowspan="2"><img alt="" height="114" src="https://i-blog.csdnimg.cn/direct/0af285ce39f1424d8f412093d18805cf.png" width="117"></td> 
   <td>显示</td> 
  </tr> 
  <tr> 
   <td> <p>uni.hideToast()</p> </td> 
   <td> <p>隐藏</p> </td> 
  </tr> 
  <tr> 
   <td colspan="1" rowspan="2">loading 提示框</td> 
   <td>uni.showLoading(OBJECT)</td> 
   <td colspan="1" rowspan="2"><img alt="" height="121" src="https://i-blog.csdnimg.cn/direct/8dee5b2f0aa74a1f840a39f8da2f641d.png" width="118"></td> 
   <td>显示</td> 
  </tr> 
  <tr> 
   <td>uni.hideLoading()</td> 
   <td> <p>隐藏</p> </td> 
  </tr> 
  <tr> 
   <td>模态弹窗</td> 
   <td> <p>uni.showModal(OBJECT)</p> </td> 
   <td><img alt="" height="195" src="https://i-blog.csdnimg.cn/direct/6970ef0a5432410bb1d775ed8c529130.png" width="317"></td> 
   <td>点击后隐藏</td> 
  </tr> 
  <tr> 
   <td> <p>从底部向上弹出</p> <p>操作菜单</p> </td> 
   <td> <p>uni.showActionSheet(OBJECT)</p> </td> 
   <td><img alt="" height="244" src="https://i-blog.csdnimg.cn/direct/72ff1d0758744c58a78838a3c921cb1c.png" width="379"></td> 
   <td>点击后隐藏</td> 
  </tr> 
 </tbody> 
</table>

#### 11.1 消息提示框 

代码示例：

```java
//显示
uni.showToast({
	title: '标题',
	duration: 2000    //提示的延迟时间
});

//隐藏
uni.hideToast();
```

#### 11.2 loading 提示框 

代码示例：

```java
//显示
uni.showLoading({
	title: '加载中'
});

//2秒后隐藏
setTimeout(function () {
	uni.hideLoading();
}, 2000);
```

#### 11.3 模态弹窗 

代码示例：

```java
uni.showModal({
	title: '提示',
	content: '这是一个模态弹窗',
	success: function (res) {
		if (res.confirm) {
			console.log('用户点击确定');
		} else if (res.cancel) {
			console.log('用户点击取消');
		}
	}
});
```

#### 11.4 从底部向上弹出操作菜单 

代码示例：

```java
uni.showActionSheet({
	itemList: ['A', 'B', 'C'],
	success: function (res) {
		console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
	},
	fail: function (res) {
		console.log(res.errMsg);
	}
});
```

### 11.2 滚动：uni.pageScrollTo(OBJECT) 

将页面滚动到目标位置。可以指定滚动到具体的scrollTop数值，也可以指定滚动到某个元素的位置。

```java
//滚到顶部
uni.pageScrollTo({
	scrollTop: 0,
	duration: 300  //滚动动画的时长 300ms
});

//滚动指定元素
uni.pageScrollTo({
	selector:'.scroll',  // 需要返回顶部的元素id或class名称
	duration: 300  //滚动动画的时长 300ms
});
```

### 11.3 窗口：uni.onWindowResize(CALLBACK) 

监听窗口尺寸变化事件

```java
const windowResizeCallback = (res) => {
  console.log('变化后的窗口宽度=' + res.size.windowWidth)
  console.log('变化后的窗口高度=' + res.size.windowHeight)
}
uni.onWindowResize(windowResizeCallback)
```

### 11.4 下拉刷新：onPullDownRefresh 

在 js 中定义 onPullDownRefresh 处理函数（和onLoad等生命周期函数同级），监听该页面用户下拉刷新事件。

 *  需要在`pages.json`里，找到的当前页面的pages节点，并在 `style` 选项中开启 `enablePullDownRefresh`。
 *  当处理完数据刷新后，`uni.stopPullDownRefresh` 可以停止当前页面的下拉刷新。

###  

uni.startPullDownRefresh(OBJECT)

开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致

示例：

pages.json

```java
{
    "pages": [
        {
        	"path": "pages/index/index",
        	"style": {
        		"navigationBarTitleText": "uni-app",
        		"enablePullDownRefresh": true  //是否开启下拉刷新
        	}
        }
    ],
    "globalStyle": {
    	"navigationBarTextStyle": "white",
    	"navigationBarBackgroundColor": "#0faeff",
    	"backgroundColor": "#fbf9fe"
    }
}
```

index.vue

```java
// 仅做示例，实际开发中延时根据需求来使用。
export default {
	data() {
		return {
			text: 'uni-app'
		}
	},
	onLoad: function (options) {
		setTimeout(function () {
			console.log('start pulldown');
		}, 1000);
		uni.startPullDownRefresh();
	},
	onPullDownRefresh() {
		console.log('refresh');
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 1000);
	}
}
```

运行结果：

![](https://i-blog.csdnimg.cn/direct/11344a015b124050977213944a30a406.png)

这是我复习一遍uniapp官网做的笔记，属于入门级教程，后续还会出关于uniapp在工作中遇到的问题，如有异议，欢迎留言改正。码字不易，给博主一个小小的赞吧~~~


[Link 1]: #main-toc
[Link 2]: #%E4%BA%8C%E3%80%81%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA
[2.1.]: #2.1.%E9%9C%80%E8%A6%81%E4%B8%8B%E8%BD%BD%E7%9A%84%E8%BD%AF%E4%BB%B6
[2.1.1 HBuilderX]: #2.1.1%20HBuilderX
[2.1.2]: #2.1.2%20%E4%B8%8B%E8%BD%BD%E5%BE%AE%E4%BF%A1%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7
[2.2 _uniapp]: #%C2%A02.2%20%E5%88%9B%E5%BB%BAuniapp%E9%A1%B9%E7%9B%AE
[2.2.1]: #2.2.1%20%E6%96%B0%E5%BB%BA%E9%A1%B9%E7%9B%AE
[2.2.2]: #2.2.2%20%E9%A1%B9%E7%9B%AE%E5%9F%BA%E6%9C%AC%E7%BB%93%E6%9E%84
[2.2.3]: #2.2.3%20%E5%9C%A8%E5%BE%AE%E4%BF%A1%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%E4%B8%8A%E8%BF%90%E8%A1%8C
[2.2.4]: #2.2.4%20%E5%8F%91%E5%B8%83%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F
[pages.json]: #%E4%B8%89%E3%80%81pages.json%20%E9%A1%B5%E9%9D%A2%E8%B7%AF%E7%94%B1
[Link 3]: #%E5%9B%9B%E3%80%81%E7%BB%84%E4%BB%B6
[4.1]: #4.1%20%E8%A7%86%E5%9B%BE%E5%AE%B9%E5%99%A8
[4.1.1 view]: #4.1.1%C2%A0view%EF%BC%9A%E8%A7%86%E5%9B%BE%E5%AE%B9%E5%99%A8
[4.1.2 scroll-view]: #4.1.2%C2%A0%C2%A0scroll-view%EF%BC%9A%E5%8F%AF%E6%BB%9A%E5%8A%A8%E8%A7%86%E5%9B%BE
[4.1.3 swiper]: #4.1.3%20swiper%3A%E6%BB%91%E5%9D%97%E8%A7%86%E5%9B%BE%E5%AE%B9%E5%99%A8
[4.1.4 match-media]: #4.1.4%C2%A0match-media%3A%E5%8C%B9%E9%85%8D%E6%A3%80%E6%B5%8B%E8%8A%82%E7%82%B9
[4.1.5 movable-area]: #4.1.5%C2%A0%20movable-area%EF%BC%9A%E5%8F%AF%E6%8B%96%E5%8A%A8%E5%8C%BA%E5%9F%9F
[4.1.6 movable-view]: #4.1.6%20movable-view%EF%BC%9A%E5%8F%AF%E7%A7%BB%E5%8A%A8%E7%9A%84%E8%A7%86%E5%9B%BE%E5%AE%B9%E5%99%A8
[4.1.7 cover-view]: #4.1.7%20cover-view%EF%BC%9A%E8%A6%86%E7%9B%96%E5%9C%A8%E5%8E%9F%E7%94%9F%E7%BB%84%E4%BB%B6%E4%B8%8A%E7%9A%84%E6%96%87%E6%9C%AC%E8%A7%86%E5%9B%BE
[4.1.8 cover-image]: #4.1.8%20cover-image%EF%BC%9A%E8%A6%86%E7%9B%96%E5%9C%A8%E5%8E%9F%E7%94%9F%E7%BB%84%E4%BB%B6%E4%B8%8A%E7%9A%84%E5%9B%BE%E7%89%87%E8%A7%86%E5%9B%BE
[4.2]: #4.2%C2%A0%E5%9F%BA%E7%A1%80%E5%86%85%E5%AE%B9
[4.2.1 text]: #4.2.1%20text%3A%E6%96%87%E6%9C%AC
[4.2.2 icon]: #4.2.2%C2%A0%20icon%3A%E5%9B%BE%E6%A0%87
[4.2.3 rich-text]: #%C2%A04.2.3%C2%A0rich-text%EF%BC%9A%E5%AF%8C%E6%96%87%E6%9C%AC
[4.2.4 progress]: #4.2.4%C2%A0progress%EF%BC%9A%E8%BF%9B%E5%BA%A6%E6%9D%A1
[4.3]: #%C2%A04.3%20%E8%A1%A8%E5%8D%95%E7%BB%84%E4%BB%B6
[4.3.1]: #4.3.1%20%E8%A6%81%E7%82%B9
[4.3.2 form]: #4.3.2%20form%E5%86%99%E6%B3%95
[4.3.3 _]: #4.3.3%20%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B%C2%A0
[4.4]: #%C2%A04.4%20%E5%AA%92%E4%BD%93%E7%BB%84%E4%BB%B6
[4.4.1 audio]: #4.4.1%20audio%3A%E9%9F%B3%E9%A2%91
[4.4.2 camera]: #4.4.2%20camera%3A%E7%9B%B8%E6%9C%BA
[4.4.3 image]: #4.4.3%20image%3A%E5%9B%BE%E7%89%87
[4.4.4 video]: #4.4.4%20video%3A%E8%A7%86%E9%A2%91
[4.5 map]: #4.5%20map%E5%9C%B0%E5%9B%BE
[4.5]: #4.5%20%E6%89%A9%E5%B1%95%E7%BB%84%E4%BB%B6
[uniapp]: #%E4%BA%94%E3%80%81uniapp%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
[5.1]: #5.1%20%E5%BA%94%E7%94%A8%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
[5.2]: #5.2%20%E9%A1%B5%E9%9D%A2%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
[5.3]: #5.3%20%E7%BB%84%E4%BB%B6%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
[Link 4]: #%E5%85%AD%E3%80%81%E7%BD%91%E7%BB%9C
[6.1]: #6.1%20%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82
[6.2]: #6.2%20%E4%B8%8A%E4%BC%A0%E5%92%8C%E4%B8%8B%E8%BD%BD
[Link 5]: #%E4%B8%83%E3%80%81%E6%95%B0%E6%8D%AE%E7%BC%93%E5%AD%98
[7.1]: #7.1%20%E5%BC%82%E6%AD%A5%E5%AD%98%E5%8F%96%E6%8C%87%E5%AE%9A%E9%94%AE%E5%80%BC%E5%AF%B9%EF%BC%88%E5%AF%B9%E5%BA%94%E7%9A%84%E5%80%BC%EF%BC%89
[7.2]: #7.2%20%E5%90%8C%E6%AD%A5%E5%AD%98%E5%8F%96%E6%8C%87%E5%AE%9A%E9%94%AE%E5%80%BC%E5%AF%B9%EF%BC%88%E5%AF%B9%E5%BA%94%E7%9A%84%E5%80%BC%EF%BC%89
[7.3]: #7.3%20%E7%A7%BB%E9%99%A4%E6%8C%87%E5%AE%9A%E9%94%AE%E5%80%BC%E5%AF%B9
[7.4]: #7.4%20%E6%B8%85%E7%90%86%E6%9C%AC%E5%9C%B0%E6%95%B0%E6%8D%AE%E7%BC%93%E5%AD%98
[Link 6]: #%E5%85%AB%E3%80%81%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC
[8.1]: #8.1%C2%A0%E8%B7%AF%E7%94%B1%E8%B7%B3%E8%BD%AC
[8.2]: #8.2%C2%A0%E8%B7%AF%E7%94%B1%E4%BC%A0%E5%8F%82
[8.3]: #8.3%20%E4%BA%8B%E4%BB%B6%E4%BC%A0%E5%8F%82
[8.4]: #8.4%20%E7%BB%84%E4%BB%B6%E4%BC%A0%E5%80%BC
[8.4.1 _]: #8.4.1%20%E7%88%B6%E7%BB%84%E4%BB%B6%E7%BB%99%E5%AD%90%E7%BB%84%E4%BB%B6%E4%BC%A0%E5%80%BC%C2%A0
[8.4.2 _]: #8.4.2%20%E5%AD%90%E7%BB%84%E4%BB%B6%E7%BB%99%E7%88%B6%E7%BB%84%E4%BB%B6%E4%BC%A0%E5%80%BC%C2%A0
[Link 7]: #%E4%B9%9D%E3%80%81%E4%BD%8D%E7%BD%AE
[9.1]: #9.1%20%E8%8E%B7%E5%8F%96%E4%BD%8D%E7%BD%AE
[9.2]: #9.2%20%E6%9F%A5%E7%9C%8B%E4%BD%8D%E7%BD%AE
[9.3 _uniapp]: #9.3%C2%A0%C2%A0%E4%BD%BF%E7%94%A8%E8%85%BE%E8%AE%AF%E5%9C%B0%E5%9B%BE%E8%8E%B7%E5%8F%96%E5%AE%9A%E4%BD%8D_uniapp%20%E8%85%BE%E8%AE%AF%E5%9C%B0%E5%9B%BE
[Link 8]: #%E5%8D%81%E3%80%81%E5%AA%92%E4%BD%93
[10.1]: #10.1%20%E5%9B%BE%E7%89%87
[10.2 _]: #10.2%20%E6%96%87%E4%BB%B6%C2%A0
[10.3]: #10.3%20%E8%A7%86%E9%A2%91
[Link 9]: #%E5%8D%81%E4%B8%80%E3%80%81%E7%95%8C%E9%9D%A2
[11.1]: #11.1%20%E4%BA%A4%E4%BA%92%E5%8F%8D%E9%A6%88%EF%BC%88%E6%8F%90%E7%A4%BA%E6%A1%86%EF%BC%89
[11.1 1]: #11.1%C2%A0%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA%E6%A1%86
[11.2 loading]: #%C2%A011.2%C2%A0loading%20%E6%8F%90%E7%A4%BA%E6%A1%86
[11.3]: #%C2%A011.3%C2%A0%E6%A8%A1%E6%80%81%E5%BC%B9%E7%AA%97
[11.4]: #%C2%A011.4%20%E4%BB%8E%E5%BA%95%E9%83%A8%E5%90%91%E4%B8%8A%E5%BC%B9%E5%87%BA%E6%93%8D%E4%BD%9C%E8%8F%9C%E5%8D%95
[11.2 _uni.pageScrollTo_OBJECT]: #11.2%20%E6%BB%9A%E5%8A%A8%EF%BC%9Auni.pageScrollTo%28OBJECT%29
[11.3 _uni.onWindowResize_CALLBACK]: #11.3%20%E7%AA%97%E5%8F%A3%EF%BC%9Auni.onWindowResize%28CALLBACK%29
[11.4 _onPullDownRefresh]: #11.4%20%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0%EF%BC%9AonPullDownRefresh
[Vue.js]: https://vuejs.org/
[uni-app]: https://uniapp.dcloud.net.cn/quickstart-hx.html
[HBuilderX-]: https://www.dcloud.io/hbuilderx.html
[Stable Build_ _]: https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html
[_ uni-app]: https://uniapp.dcloud.net.cn/tutorial/project.html#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84
[Link 10]: https://mp.weixin.qq.com/
[iconfont-]: https://www.iconfont.cn/
[uni-app 1]: https://uniapp.dcloud.net.cn/component/uniui/uni-calendar.html
[_ uni-app 1]: https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle
[_ uni-app 2]: https://uniapp.dcloud.net.cn/tutorial/page.html#componentlifecycle
[uni.request_OBJECT_ _ uni-app]: https://uniapp.dcloud.net.cn/api/request/request.html
[uniapp_ _uniapp _2_-CSDN]: https://blog.csdn.net/2401_84931310/article/details/138775678