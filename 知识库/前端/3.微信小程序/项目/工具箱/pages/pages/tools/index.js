
Page({
  data: {
    foodList:[],
  },
  
  
  /**
   * 本源码由小伊开发者中心提供
   * 不懂的+V：“xiaoyi20051126”
   * 
   */
  go13:function(){
    wx.navigateToMiniProgram({
           appId: 'wx4acb857b763d7a64',//要打开的小程序 appId
           path: ' ',//打开的页面路径，如果为空则打开首页
           envVersion: 'release',
          shortLink:'', 
           success(res) {
                // 打开成功
           },
           fail: function (err) {
             console.log(err);
          }
       })
  },
  
  go12:function(){
    wx.navigateToMiniProgram({
           appId: 'wxcd1bb2299ed463c3',//要打开的小程序 appId
           path: ' ',//打开的页面路径，如果为空则打开首页
           envVersion: 'release',
          shortLink:'', 
           success(res) {
                // 打开成功
           },
           fail: function (err) {
             console.log(err);
          }
       })
  },
  go113:function(){
    wx.navigateToMiniProgram({
           appId: 'wxcd1bb2299ed463c3',//要打开的小程序 appId
           path: 'pages/shuiyin/index',//打开的页面路径，如果为空则打开首页
           envVersion: 'release',
          shortLink:'', 
           success(res) {
                // 打开成功
           },
           fail: function (err) {
             console.log(err);
          }
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

  b2:function(){
    wx.navigateTo({
      url: '../../taskOuter/pages/util/material/poster'
    })
  
  },
  goys:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/life_time/life_time'
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
  go22:function(){
    wx.navigateTo({
      url: '../../pages/dm/newDanMu'
    })
  },
  go25:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/mnld/mnld'
    })
  },
  go26:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/24/24'
    })
  },
  
  go27:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/dh/dh'
    })
  },
  go28:function(){
    wx.navigateTo({
      url: '../../pagesA/pages/2048/2048'
    })
  },
  go29:function(){
    wx.navigateTo({
      url: '../../pagesB/pages/zsz/zsz'
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
      url: '../../pages/yasuo/yasuo'
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
  