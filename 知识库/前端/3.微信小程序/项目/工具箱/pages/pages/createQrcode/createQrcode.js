function e(e, n, a) {
    return n in e ? Object.defineProperty(e, n, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[n] = a, e;
}
var n, a =require('../../utils/weapp.qrcode.min.js')
var app = getApp()
Page({
  data:{
    qrcode_url: '',
    qrcode_Value: '',
    logo_url: '',
    is_complete:0,
    height: '100%',
    qrcode_background:"#FFFFFF",
    qrcode_foreground:"#000000",
    background_tips:false
  },
  qrcode_Value: function (res) {
    this.setData({
      qrcode_url: this.toUtf8(res.detail.value),
      qrcode_zf:res.detail.value
    })
  },
  qrcode_background: function (res) {    
    if (res.detail.value !="#FFFFFF"){
      this.setData({
        qrcode_background: res.detail.value,
        background_tips: true
      });
    }else{
      this.setData({
        qrcode_background: res.detail.value,
        background_tips: false
      });
    }
  },
  qrcode_foreground: function (res) {
    this.setData({
      qrcode_foreground: res.detail.value
    })
  },

formBindsubmit: function(e) {
    var n = e;
    console.log(n)
    wx.showToast({
        title: "生成中...",
        icon: "loading",
        duration: 1000
    });
    var a = this.setCanvasSize(),  t = n;
    this.createQrCode(t, "mycanvas", a.w, a.h)
},
setCanvasSize: function() {
    var e = {};
    try {
        var n = wx.getSystemInfoSync().windowWidth / (750 / 686), a = n;
        e.w = n, e.h = a;
    } catch (e) {
        console.log("获取设备信息失败" + e);
    }
    return e;
},
createQrCode: function(e, n, t, i) {
    var o = this;
    var x=o.data.qrcode_background;
    var y=o.data.qrcode_foreground;
    a.api.draw(e, n, t, i,"","",x,y), setTimeout(function() {
        o.canvasToTempImage();
    }, 1000);
},
canvasToTempImage: function() {
    var e = this;
    wx.canvasToTempFilePath({
        canvasId: "mycanvas",
        success: function(n) {
            var a = n.tempFilePath;
            console.log(a), e.setData({
                imagePath: a
            });
        },
        fail: function(e) {
            console.log(e);
        }
    });
},
savePic: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 50,
      width: that.data.windowWidth * 2,
      height: that.data.contentHeight * 2,
      canvasId: "mycanvas",
      success: function (res) {
        // util.savePicToAlbum(res.tempFilePath);
        wx.hideLoading();
        var tempFilePath = res.tempFilePath;
        that.setData({
          canvasUrl: tempFilePath
        });
        if (tempFilePath !== "") {
          wx.hideLoading();
          wx.previewImage({
            current: that.data.canvasUrl, // 当前显示图片的http链接
            urls: [that.data.canvasUrl], // 需要预览的图片http链接列表
            success: function (_res) {
              console.log("预览成功啦");
            }
          });
        }
      }
    });
  },
queryIp: function () {
    let that = this;
    var y=that.data.qrcode_zf
    if (that.data.qrcode_url){
      
    that.formBindsubmit(y) ;
    that.setData({
        is_complete: 1
      })
      wx.showModal({
        title: f.data.data,
        icon: "none",
        duration: 800
    }); 
    } else{
      wx.showToast({
        title: "请输入字符串，可以是网址、文本等",
        icon: "none",
        duration: 1000
      });
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数    
    let that = this;    
  },
  toUtf8(str){//解决中文乱码的问题
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i<len; i++) {
  c = str.charCodeAt(i);
  if ((c >= 0x0001) && (c <= 0x007F)) {
    out += str.charAt(i);
  } else if (c > 0x07FF) {
    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
  } else {
    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
  }
}
return out;
},
  // 预览图片

  //下载小程序码
  downloadSkuQrCode: function (url) {
    let that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        that.setData({
          qrCode: res.tempFilePath
        });
        wx.hideLoading();
        //生成数据
        that.getData();
      },
      fail: function (err) {
        wx.showToast({
          title: "下载二维码失败,稍后重试！",
          icon: "none",
          duration: 5000
        });
      }
    });
  },
  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              // utils.aiCardActionRecord(19);
              wx.showModal({
                content: '已成功保存到手机相册。',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) { }
                },
                fail: function (res) { }
              })
            },
            fail: function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      });
    }, 1000);
  } ,
  onReady:function(){
    // 页面渲染完成    
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    app.pages = getCurrentPages();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 设置页面分享
  onShareAppMessage: function () {
    return {
      title: '二维码生成器',
      path: '/pagesA/pages/ewm/ewm'
    }
  }
})