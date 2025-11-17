var t, e, a = "", o = "", i = "", n = 20, l = null;

Page({
    data: {
        imageWidth: 0,
        imageHeight: 0
    },
    onLoad: function(e) {
        a = e.photoPath, o = e.text, i = e.color, t = e.alpha, this.mark()
        var that = this;
    
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
    mark: function() {
        n = o.length > 5 ? 20 : 30, e = o.length * n;
        var l = this, s = wx.createCanvasContext("myCanvas");
        wx.getImageInfo({
            src: a,
            success: function(a) {
                var n = a.width, h = a.height;
                console.log("imgWidth=" + n), console.log("imgHeight=" + h);
                var c = wx.getSystemInfoSync().windowWidth;
                console.log("screenWidth=" + c);
                var r = c, g = h / n * r;
                console.log("canvasWidth=" + r), console.log("canvasHeight=" + g), l.setData({
                    imageWidth: r,
                    imageHeight: g
                }), s.drawImage(a.path, 0, 0, r, g), s.rotate(30 * Math.PI / 180);
                for (var d = 1; d < 30; d++) {
                    s.beginPath(), s.setGlobalAlpha(t), s.setFontSize(18), s.setFillStyle(i), s.fillText(o, 0, 80 * d);
                    for (var f = 1; f < 30; f++) s.beginPath(), s.setGlobalAlpha(t), s.setFontSize(18), 
                    s.setFillStyle(i), s.fillText(o, e * f, 80 * d);
                }
                for (var w = 0; w < 30; w++) {
                    s.beginPath(), s.setGlobalAlpha(t), s.setFontSize(18), s.setFillStyle(i), s.fillText(o, 0, -80 * w);
                    for (var m = 1; m < 30; m++) s.beginPath(), s.setGlobalAlpha(t), s.setFontSize(18), 
                    s.setFillStyle(i), s.fillText(o, e * m, -80 * w);
                }
                s.draw(!1, function() {
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: n,
                        height: h,
                        destWidth: n,
                        destHeight: h,
                        canvasId: "myCanvas",
                        success: function(t) {
                            wx.hideLoading(), l.addMarkPhotoPath = t.tempFilePath;
                        }
                    });
                });
            }
        });
    },
    ad_set: function () {
        var e = this;
        wx.createRewardedVideoAd && ((a = wx.createRewardedVideoAd({
          adUnitId: e.data.appConfig.ad.wxreward
        })).onLoad(function () {
          console.log("激励广告拉取成功");
        }), a.onError(function (e) {}), a.onClose(function (a) {
          a && a.isEnded || void 0 === a ? (console.log("发放奖励"), e.saveTap()) : wx.showModal({
            title: "提示",
            content: "Sorry...您需要看完视频才能保存～",
            showCancel: !1,
            confirmText: "好的"
          });
        }));
      },
    btnSave: function () {
        var t = this;
        console.log("打开激励视频"), wx.showModal({
          title: "提示",
          //content: "观看视频广告即可保存",
          content: t.data.appConfig.ad.wxadysz,
          success: function (e) {
            e.confirm ? (console.log("用户点击确定"),
              a && a.show().catch(function () {
                a.load().then(function () { //, a
                  return a.show();
                }).catch(function (e) {
                  t.saveTap()
                  console.log("激励视频 广告显示失败");
                });
              })
            ) : e.cancel && wx.showToast({
                title: "您放弃了保存图片",
                icon: "none"
            });
          }
        });
      },
    saveTap: function(t) {
        wx.showLoading({
            title: "保存中"
        }), 
        wx.saveImageToPhotosAlbum({
            filePath: this.addMarkPhotoPath,
            success: function(t) {
                wx.hideLoading(), wx.showModal({
                    content: "保存成功，请在相册中查看",
                    confirmText: "知道了",
                    showCancel: !1
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "这里可以免费给图片加水印",
            path: "pages/navigator/jiashuiyin/waterMark/waterMark"
        };
    }
});