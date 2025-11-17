Page({
  data: {
    foodList:[],
    hideNotice: false,
    notice: '',
    //轮播图配置
    autoplay: true,
    interval: 3000,
    duration: 1200
  },
  // 点击关闭公告
switchNotice: function() {
  this.setData({
   hideNotice: true
  })
 },
 onLoad: function () {
  var that = this; 
  var data = {
    "datas": [
      {
        "id": 1,
        "imgurl": "../../static/h1.png"
      },
      {
        "id": 2,
        "imgurl": "../../static/h1.png"
      },
      {
        "id": 3,
        "imgurl": "../../static/h1.png"
      }
    ]
  }; 
  that.setData({
    lunboData: data.datas
  })
},
      /**
   * 本源码由十一云二改提供
   * 不懂的看：“http://shop.ajouter.top/ 在线指导文档”
   *  去水印接口一块钱 永久使用 
   * 步数接口一块钱   永久使用
   * 
   */
  
  goab:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/blood/blood'
    })
  
  },
  gocs:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/networkSpeed/networkSpeed'
    })
  
  },
  gosm:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/blind/blind'
    })
  
  },
  

  alicopy: function(e) {
    wx.setClipboardData ? wx.setClipboardData({
        data: e.currentTarget.dataset.ali,
        success: function(e) {
            wx.showToast({
                title: "复制成功，请前往微信粘贴搜一搜",
                icon: "none",
                duration: 4e3
            });
        }
    }) : wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    });
  },
  go520:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/lovesc/lovesc'
    })
  },
  
  wenzi3:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/fly/fly'
    })
  
  },
  goip:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/clock/clock'
    })
  
  },
  fanyi:function(){
    wx.navigateTo({
      url: '../../pagesC/pages/index/index'
    })
  
  },
  b4:function(){
    wx.navigateTo({
      url: '../../taskOuter/pages/util/share/share'
    })
  
  },
  b2:function(){
    wx.navigateTo({
      url: '../../taskOuter/pages/util/material/poster'
    })
  
  },
  b3:function(){
    wx.navigateTo({
      url: '../../taskOuter/pages/util/material/avatar'
    })
  
  },
  go2:function(){
    wx.navigateTo({
      url: '../../pages/vipvideo/vipvideo'
    })
  
  },
  go1:function(){
    wx.navigateTo({
      url: '../../pages/video/index'
    })
  
  },
  gosjs:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/randomNum/randomNum'
    })
  
  },
  go22:function(){
    wx.navigateTo({
      url: '../../pages/dm/newDanMu'
    })
  },
  go9:function(){
    wx.navigateTo({
      url: '../../pages/choujiang/choujiang'
    })
  },
  go21:function(){
    wx.navigateTo({
      url: '../../pages/tax/tax'
    })
  },
  go24:function(){
    wx.navigateTo({
      url: '../../pages/ruler/ruler'
    })
  },
  go25:function(){
    wx.navigateTo({
      url: '../../pages/navigator/jiashuiyin/waterMarkSet/waterMarkSet'
    })
  },
  go26:function(){
    wx.navigateTo({
      url: '../../pages/welcome/welcome'
    })
  },
  goqs:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/quse/index'
    })
  },
  go27:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/mm/mm'
    })
  },
  go28:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/protractor/protractor'
    })
  },
  go29:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/time/time'
    })
  },
  go23:function(){
    wx.navigateTo({
      url: '../../pages/time/time'
    })
  },
  go4:function(){
    wx.navigateTo({
      url: '../../pages/createQrcode/createQrcode'
    })
  },
  godk:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/album/index'
    })
  },
 bizhi:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/index/index'
    })
  },
  gotouxiang:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/hottouxiang/index'
    })
  },
  go5:function(){
    wx.navigateTo({
      url: '../../pages/numToCase/numToCase'
    })
  },
  go6:function(){
    wx.navigateTo({
      url: '../../pages/figure/figure'
    })
  },
  go8:function(){
    wx.navigateTo({
      url: '../../pages/color/color'
    })
  },
  go7:function(){
    wx.navigateTo({
      url: '../../pages/counter/counter'
    })
  },
  go3:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/imagepress/imagepress'
    })
  },
  go10:function(){
    wx.navigateTo({
      url: '../../pages/myphone/myphone'
    })
  },
  tothree:function(){
    wx.navigateTo({
      url: '../../components/text/text'
    })
  },
  tofour:function(){
    wx.navigateTo({
      url: '../../components/picture/picture'
    })
  },
  tofive:function(){
    wx.navigateTo({
      url: '../../pages/video/index'
    })
  },
  tosix:function(){
    wx.navigateTo({
      url: '../../pages/vipvideo/vipvideo'
    })
  },
  totool:function(){
    wx.navigateTo({
      url: '../../components/search_tool/search_tool'
    })
  },
  tu1:function(){
    wx.navigateTo({
      url: '../../pages/jietus/album/index'
    })
  },
  tu2:function(){
    wx.navigateTo({
      url: '../../pages/navigator/heart/heart'
    })
  },
  tu3:function(){
    wx.navigateTo({
      url: '../../pages/navigator/pintu/pintu/pintu'
    })
  },
  tu4:function(){
    wx.navigateTo({
      url: '../../pages/navigator/pintu/cut/cut'
    })
  },
  tu5:function(){
    wx.navigateTo({
      url: '../../pages/navigator/pintu/wenzi/wenzi'
    })
  },
  tu6:function(){
    wx.navigateTo({
      url: '../../pages/navigator/combine/combine'
    })
  },
  tu8:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/wzt/wzt'
    })
  },
  tu88:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/geshi/index'
    })
  },
  onShareAppMessage: function() {
    return {
        title: "给你推荐一个微信便捷工具箱，干嘛嘛方便~",
        path: ""
    };
  },
  onShareTimeline: function() {
    return {
        title: "给你推荐一个微信便捷工具箱，干嘛嘛方便~"
    };
  }
  })
  