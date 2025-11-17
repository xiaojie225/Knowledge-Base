Page({
    data: {
        width: 320,
        height: 500,
        imageUrl: "",
        imageList: [],
        isChangeHeight: !1,
        text: "",
        isHiddenCanvas: !0,
        textConfig: {
            fontSize: 15,
            fontColor: "#000000",
            lineHeight: 30,
            fontStyle: "normal",
            bgColor: "#ffffff",
            padding: 30
        },
        color_array: ["白", "黑", "红", "橙", "黄", "绿", "青", "蓝", "紫"],
        color: ["#ffffff", "#000000", "#ff0000", "#ff8800", "#ffff00", "#00ff00", "#00fff0", "#0000ff", "#ff00ff"],
        fontColorIndex: 1,
        bgColorIndex: 0,
        testwidth: 320,
        testheight: 500,
        isHiddenTestCanvas: !0
    },
    onLoad: function (a) {
        var e = this;
        wx.getSystemInfo({
            success: function (t) {
                e.setData({
                    width: t.windowWidth,
                    height: t.screenHeight
                });
            }
        }), e.saveAndGetData("", !0);
            var that = this;
            if(wx.getStorageSync("adlist")){
                var e = wx.getStorageSync("adlist");
                
                that.setData({
                  appConfig: e
              })
                that.showinte();
            }
           
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

    createImage: function (t) {
        var e = this,
            a = t.detail.value.text,
            n = e.data.textConfig;
            n.fontSize = t.detail.value.fontSize,
            n.lineHeight = t.detail.value.lineHeight,
            n.padding = t.detail.value.padding, 
           
            
              
                         
            e.saveAndGetData(a, !1), wx.showLoading({
                title: "正在生成中...",
                mask: !0
            }), e.setData({
                isHiddenCanvas: !1
            }), e.drawCanvas("canvas", a, n.fontSize, n.fontColor, n.bgColor, n.lineHeight, n.padding, n.fontStyle),
            setTimeout(function (t) {
                wx.canvasToTempFilePath({
                    canvasId: "canvas",
                    success: function (t) {
                        wx.hideLoading(), console.log(t.tempFilePath);
                        var a = [];
                        a.push(t.tempFilePath), e.setData({
                            imageUrl: t.tempFilePath,
                            imageList: a
                        }), wx.previewImage({
                            urls: a,
                            current: t.tempFilePath,
                            success: function (t) {
                                e.setData({
                                    isHiddenCanvas: !0
                                });
                            }
                        });
                    }
                }, e);
            }, 500);
                e.setData({
                    text: ""
                }),
                wx.showModal({
                    title: f.data.data,
                    icon: "none",
                    duration: 800
                }); 
        
    },
    drawCanvas: function (t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 15,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "#000000",
            i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "yellow",
            o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 30,
            s = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 30,
            l = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : "normal",
            f = this,
            d = f.data.width,
            r = f.returnTestCanvasHeight("testCanvas", e, a, o, s, l);
        f.setData({
            height: r
        });
        var h = wx.createCanvasContext(t, f);
        h.setFillStyle(i), h.fillRect(0, 0, d, r), h.setTextBaseline("top"), h.font = l + " " + a + "px sans-serif",
            h.setFillStyle(n);
        for (var g = e.split(/\n/), v = (f.data.height, 0), c = s; v < g.length; v++) {
            var u = g[v].split(""),
                x = "",
                C = "",
                w = s;
            v > 0 && (c += o);
            for (var m = 0; m < u.length; m++) C = x + u[m], h.measureText(C).width > d - 2 * s && m > 0 ? (h.fillText(x, w, c),
                x = u[m], c += o) : x = C;
            h.fillText(x, w, c);
        }
        h.draw();
    },
    returnTestCanvasHeight: function (t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 15,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 30,
            i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 30,
            o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "normal",
            s = this;
        s.setData({
            isHiddenTestCanvas: !1
        });
        var l = s.data.testwidth,
            f = (s.data.testheight, wx.createCanvasContext(t, s));
        f.setTextBaseline("top"), f.font = o + " " + a + "px sans-serif";
        var d = e.split(/\n/);
        console.log(d);
        for (var r = s.data.testheight, h = 0, g = i; h < d.length; h++) {
            var v = d[h].split(""),
                c = "",
                u = "",
                x = i;
            h > 0 && (g += n);
            for (var C = 0; C < v.length; C++) u = c + v[C], f.measureText(u).width > l - 2 * i && C > 0 ? (f.fillText(c, x, g),
                c = v[C], g += n) : c = u;
            if (f.fillText(c, x, g), h == d.length - 1) return r = g + n + i, s.setData({
                isHiddenTestCanvas: !0
            }), r;
        }
    },
    clear: function (t) {
        var e = this;
        wx.showModal({
            title: "温馨提示",
            content: "全部清空文字？",
            confirmColor: "#ff4444",
            success: function (t) {
                t.confirm && (e.setData({
                    text: ""
                }), wx.showToast({
                    title: "全部清空了",
                    icon: "none"
                })), t.cancel && console.log("用户取消了清空");
            }
        }), e.saveAndGetData("", !1);
    },
    paste: function (t) {
        var e = this;
        console.log("粘贴"), wx.getClipboardData({
            success: function (t) {
                e.setData({
                    text: t.data
                }), e.saveAndGetData(t.data, !1);
            }
        });
    },
    setTextStyle: function (t) {
        this.setData({
            "textConfig.fontStyle": t.detail.value
        });
    },
    selectFontColor: function (t) {
        var e = this.data.color;
        this.setData({
            fontColorIndex: t.detail.value,
            "textConfig.fontColor": e[t.detail.value]
        });
    },
    selectBgColor: function (t) {
        var e = this.data.color;
        this.setData({
            bgColorIndex: t.detail.value,
            "textConfig.bgColor": e[t.detail.value]
        });
    },
    onShareAppMessage: function() {
        return {
            title: "文字转图片",
            path: "/pagesA/pages/indexsd/indexsd",
        };
    },
    saveAndGetData: function () {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
            e = this;
        0 == (arguments.length > 1 && void 0 !== arguments[1] && arguments[1]) ? wx.setStorage({
            key: "fontToImage_text",
            data: t
        }) : wx.getStorage({
            key: "fontToImage_text",
            success: function (t) {
                e.setData({
                    text: t.data
                });
            }
        });
    },
    inputSave: function (t) {
        this.saveAndGetData(t.detail.value, !1);
    }
});