var app = getApp();
Page({
  data: {
    text: "",
    jxList:[],
  },

  onLoad: function(options) {
  
  },
  onShow: function() {
    
  },
  onShareAppMessage: function() {
    return {
        title: "这里可以VIP视频在线解析",
        path: ""
    };
},
onShareTimeline: function() {
    return {
        title: "这里可以VIP视频在线解析"
    };
},
  setTextData: function(t) {
    this.setData({
      text: t.detail.value
    });
  },
  clearIndex: function() {
    this.setData({
      selectIndex: null
    });
  },
  selectSource: function(t) {
    var e = this;
    this.clearIndex();
    var a = this.data,
      s = a.text,
      jx1 = '接口',
      n = a.sourceList;
    if (0 !== s.trim().length && -1 != s.indexOf("http")) {
      var o = t.currentTarget.dataset.index,
        i = jx1 + s;  // 解析接口1  
           /**
   * 本源码由十一云二改提供
   * 不懂的看：“http://shop.ajouter.top/ 在线指导文档”
   *  去水印接口一块钱 永久使用 
   *  步数接口一块钱   永久使用
   *  视频接口一口气   永久使用
   *  自主接口，稳定性好
   * 
   */
      console.log("URL：" + i), wx.setClipboardData({
        data: i,
        success: function() {
          setTimeout(function() {
            return e.setData({
              selectIndex: o
            });
          }, 800), wx.showToast({
            icon: "none",
            duration: 2500,
            title: "已复制，请在浏览器中打开地址"
          });
        }
      });
    }
  },
  selectSource2: function(t) {
    var e = this;
    this.clearIndex();
    var a = this.data,
      s = a.text,
      jx2 = '接口'
      n = a.sourceList;
    if (0 !== s.trim().length && -1 != s.indexOf("http")) {
      var o = t.currentTarget.dataset.index,
        i = jx2 + s;    
      console.log("URL：" + i), wx.setClipboardData({
        data: i,
        success: function() {
          setTimeout(function() {
            return e.setData({
              selectIndex: o
            });
          }, 800), wx.showToast({
            icon: "none",
            duration: 2500,
            title: "已复制，请在浏览器中打开地址"
          });
        }
      });
    }
  }

});
