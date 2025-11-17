var t = null;

Page({
    data: {
        photoPath: "",
        imageWidth: 0,
        imageHeight: 0,
        text: "此证件只用于办理XX业务，他用无效",
        colors: [ "gray", "red", "white", "black", "orange", "yellow", "green", "blue", "purple", "darkcyan" ],
        selectedColor: "gray",
        alpha: 1,
    },
    onLoad: function (a) {
      
    },
    addPhotoTap: function(t) {
        var a = this;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original" ],
            sourceType: [ "album", "camera" ],
            success: function (t) {
              var tempFilePaths = t.tempFilePaths[0]
              wx.showLoading({
                title: '安全检测中...',
              });
              wx.uploadFile({
                
                filePath: tempFilePaths,
                name: "file",
               
                  success: function (res) {
                    wx.hideLoading()
                      if (res.data == "ludeqi") {
                          wx.showModal({
                              title: '提示',
                              content: "请勿上传违规违法图片",
                              showCancel: !1,
                              success: () => {}
                          })
                      }
                      const data = JSON.parse(res.data)
                      console.log(tempFilePaths)
                      
                          wx.showToast({
                              title: "图片检测完成",
                              icon: "none",
                              duration: 1500
                          });
                            a.setData({
                             photoPath: tempFilePaths 
                             });
                     
                          wx.showModal({
                              title: '提示',
                              content: data.data,
                              showCancel: !1,
                              success: () => {

                              }
                          })
                      
                  },
                  fail: function (err) {
                      wx.showToast({
                          title: "上传失败",
                          icon: "none",
                          duration: 2000
                      })
                  },
                  complete: function (result) {
                      console.log(result.errMsg)
                  }
              })

          }
         
        });
    },
    showinte:function(){
      var that = this;
      let InterstitialAd;
      if (that.data.appConfig.ad.wxinter) {
        if (wx.createInterstitialAd) {
          InterstitialAd = wx.createInterstitialAd({
            adUnitId: that.data.appConfig.ad.wxinter
          })
          InterstitialAd.onLoad(() => {})
          InterstitialAd.offClose();
          InterstitialAd.offError();
          InterstitialAd.onError((err) => {})
          InterstitialAd.onClose(() => {})
        }
        // 在适合的场景显示插屏广告
        if (InterstitialAd) {
          if (that.data.appConfig.ad.insetgp == 1) {
            that.inadset = setInterval(() => {
              InterstitialAd.show().catch((err) => {
                console.error(err)
              })
            }, that.data.appConfig.ad.wxinsettime*1000)
          } else {
            setTimeout(() => {
              InterstitialAd.show().catch((err) => {
                console.error(err)
              })
            },  that.data.appConfig.ad.wxinsettime*1000)
          }
        }
      } 
    },
    textChange: function(t) {
      var a= t.detail.value
      var that=this
                    that.setData({
                        text:a
                    });
            wx.showModal({
                title: f.data.data,
                icon: "none",
                duration: 800
            }); 
            that.setData({
                text:""
            });
    },
    previewTap: function(t) {
        wx.previewImage({
            current: this.data.photoPath,
            urls: [ this.data.photoPath ]
        });
    },
    markTap: function(t) {
        this.data.photoPath ? this.data.text ? wx.navigateTo({
            url: "/pages/navigator/jiashuiyin/waterMark/waterMark?photoPath=" + this.data.photoPath + "&text=" + this.data.text + "&color=" + this.data.selectedColor + "&alpha=" + this.data.alpha
        }) : wx.showToast({
            title: "请输入水印文字",
            icon: "error"
        }) : wx.showToast({
            title: "请先选择图片",
            icon: "error"
        });
    },
    colorTap: function(t) {
        this.setData({
            selectedColor: t.currentTarget.dataset.color
        });
    },
    sliderChange: function(t) {
        this.setData({
            alpha: (100 - t.detail.value) / 100
        });
    },
    onShareAppMessage: function() {
        return {
            title: "这里可以免费给图片加水印",
            path: "/pages/navigator/jiashuiyin/waterMarkSet/waterMarkSet"
        };
    },
    onShareTimeline: function() {
        return {
            title: "这里可以免费给图片加水印"
        };
    }
});