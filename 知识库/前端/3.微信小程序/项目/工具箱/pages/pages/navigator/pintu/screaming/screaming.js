var t = wx.createCanvasContext("myCanvas");

Page({
    data: {
        ldata: !0,
        fontSize: [ {
            name: "equal",
            value: "同等"
        }, {
            name: "gradually",
            value: "渐大",
            checked: "true"
        } ],
        canvasImg: "",
        isShowMask: !1,
        isBack: !1,
        isShowSave: !1,
        bColors: [ {
            color: "black",
            title: "黑色"
        }, {
            color: "red",
            title: "红色"
        }, {
            color: "yellow",
            title: "黄色"
        }, {
            color: "blue",
            title: "蓝色"
        }, {
            color: "green",
            title: "绿色"
        }, {
            color: "white",
            title: "白色",
            checked: !0
        } ],
        fontColors: [ {
            color: "black",
            title: "黑色",
            checked: !0
        }, {
            color: "red",
            title: "红色"
        }, {
            color: "yellow",
            title: "黄色"
        }, {
            color: "blue",
            title: "蓝色"
        }, {
            color: "green",
            title: "绿色"
        }, {
            color: "white",
            title: "白色"
        } ],
        fontInfo: {
            fontSize: "gradually",
            background: {
                color: "white",
                title: "白色"
            },
            fontColor: {
                color: "black",
                title: "黑色"
            }
        },
        content: ""
    },
    onLoad: function(t) {
        var e = 1;
        this.rnd(2, 10, function(t) {
            e = t;
        });
    },
    radioChange: function(t) {
        for (var e = t.detail.value, o = this.data.fontSize, a = 0, n = o.length; a < n; a++) if (o[a].name == e) {
            o[a].checked = !0;
            var i = o[a].name;
        } else o[a].checked = !1;
        this.setData({
            fontSize: o,
            "fontInfo.fontSize": i
        });
    },
    showMask: function(t) {
        var e = "true" == t.currentTarget.dataset.isback, o = this.data.isShowMask;
        this.setData({
            isShowMask: !o,
            isBack: e
        });
    },
    changeColor: function(t) {
        for (var e = t.currentTarget.dataset.colortype, o = t.currentTarget.dataset.index, a = this.data.isShowMask, n = "bColors" == e ? this.data.bColors : this.data.fontColors, i = 0, s = n.length; i < s; i++) n[i].checked = i == o;
        "bColors" == e ? (this.setData({
            bColors: n,
            isShowMask: !a,
            "fontInfo.background": n[o]
        }), this.transformImg()) : (this.setData({
            fontColors: n,
            isShowMask: !a,
            "fontInfo.fontColor": n[o]
        }), this.transformImg());
    },
    textInput: function(t) {
        var e = t.detail.value;
        this.setData({
            content: e
        });
    },
    transformImg: function(t) {
        var e = this.data.content;
        if ("" != e) {
            console.log(e);
            for (var o = [], a = 0, n = e.length; a < n; a++) o.push(e.charAt(a));
            this.drawImg(o);
        } else wx.showToast({
            title: "请输入内容"
        });
    },
    drawImg: function(e) {
        var o = this.data.fontInfo, a = o.fontSize;
        if (t.clearRect(0, 0, 525, 290), t.setFillStyle(o.background.color), t.fillRect(0, 0, 525, 290), 
        t.draw(), t.setTextAlign("left"), t.setTextBaseline("top"), t.setFillStyle(o.fontColor.color), 
        "gradually" == a) for (var n = 0, i = e.length; n < i; n++) s = n * (2 * n + 18), 
        t.setFontSize(4 * n + 18), t.fillText(e[n], s, 29.5), t.fillText(e[n], s - .5, 30); else if ("equal" == a) for (var n = 0, i = e.length; n < i; n++) {
            var s = 37 * n;
            t.setFontSize(37), t.fillText(e[n], s, 45);
        }
        t.draw(!0);
        var l = this;
        setTimeout(function() {
            l.saveImg();
        }, 200);
    },
    saveImg: function() {
        var t = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: "myCanvas",
            success: function(e) {
                t.setData({
                    canvasImg: e.tempFilePath
                });
            }
        });
    },
    downimg: function() {
        if ("" != this.data.content) {
            var t = this;
            wx.getSetting({
                success: function(e) {
                    console.log(e), e.authSetting["scope.writePhotosAlbum"] ? t.saveToPhone() : wx.authorize({
                        scope: "scope.writePhotosAlbum",
                        success: function() {
                            t.saveToPhone();
                        },
                        fail: function(e) {
                            t.setData({
                                ldata: !1
                            });
                        }
                    });
                }
            });
        } else wx.showToast({
            title: "请输入内容"
        });
    },
    saveToPhone: function(t) {
        wx.showLoading({
            title: "正在保存..."
        });
        var e = this.data.canvasImg;
        wx.saveImageToPhotosAlbum({
            filePath: e,
            success: function(t) {
                wx.hideLoading(), wx.showToast({
                    title: "保存成功"
                });
            }
        });
    },
    clearContent: function() {
        this.setData({
            content: ""
        });
    },
    shoucang: function() {},
    hotJumpPageID: function(t) {
        console.log(t);
        var e = t.detail.formId;
        "" != t.detail.formId && a.formAdd(e, function(t) {});
    },
    rnd: function(t, e, o) {
        var a = Math.floor(Math.random() * (e - t + 1) + t);
        return o(a), a;
    },
    back: function() {
        getCurrentPages().length > 1 ? wx.navigateBack({}) : wx.reLaunch({
            url: "/pages/index/index"
        });
    },
    handler: function(t) {
        var e = this;
        t.detail.authSetting["scope.writePhotosAlbum"] ? e.setData({
            ldata: !0
        }) : e.setData({
            ldata: !1
        });
    },
    onShareAppMessage: function() {
        var t = require("../../../7FF9148756B80DDF199F7C80BAACE943.js");
        return {
            title: t.title,
            path: "/pages/index/index",
            imageUrl: t.url
        };
    }
});