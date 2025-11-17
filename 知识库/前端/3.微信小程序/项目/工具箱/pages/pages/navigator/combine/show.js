Page({
    data: {
        imageInfo: [],
        direction: "vertical",
        canvasWidth: 0,
        canvasHeight: 0,
        systemHeight: 0,
        systemWidth: 0,
        showImage: {
            url: "",
            width: 0,
            height: 0
        },
        hidden: !1
    },
    onLoad: function(t) {
        var e = this;
        e.setData({
            imageInfo: JSON.parse(t.imageInfo),
            direction: t.direction
        }), wx.getSystemInfo({
            success: function(t) {
                e.setData({
                    systemWidth: t.windowWidth,
                    systemHeight: t.windowHeight
                });
            }
        }), console.log(e.data.imageInfo), wx.showLoading({
            title: "正在合并",
            mask: !0
        }), e.connectImage();
    },
    connectImage: function() {
        var t = this, e = wx.createCanvasContext("draw", t), a = 0, i = 0, h = t.data.imageInfo;
        if ("vertical" == t.data.direction) {
            a = t.data.systemWidth;
            for (var s = 0, n = 0; s < h.length; s++) i += n = h[s].height * a / h[s].width;
            t.setData({
                canvasWidth: a,
                canvasHeight: i
            });
            for (var s = 0, n = 0, o = 0; s < h.length; s++) n = h[s].height * a / h[s].width, 
            s > 0 && (o += h[s - 1].height * a / h[s - 1].width), e.drawImage(h[s].url, 0, o, a, n);
        } else {
            i = t.data.systemHeight;
            for (var s = 0, d = 0; s < h.length; s++) a += d = h[s].width * i / h[s].height;
            t.setData({
                canvasWidth: a,
                canvasHeight: i
            });
            for (var s = 0, d = 0, g = 0; s < h.length; s++) d = h[s].width * i / h[s].height, 
            s > 0 && (g += h[s - 1].width * i / h[s - 1].height), e.drawImage(h[s].url, g, 0, d, i);
        }
        e.draw(), setTimeout(function(e) {
            wx.canvasToTempFilePath({
                canvasId: "draw",
                success: function(e) {
                    console.log(e.tempFilePath), t.setData({
                        "showImage.url": e.tempFilePath,
                        hidden: !0
                    }), t.setShowImage(e.tempFilePath), wx.hideLoading();
                }
            }, t);
        }, 500);
    },
    previewImage: function(t) {
        var e = this, a = [];
        a.push(e.data.showImage.url), wx.previewImage({
            current: a[0],
            urls: a
        });
    },
    setShowImage: function(t) {
        var e = this, a = e.data.direction, i = 0, h = 0;
        wx.getSystemInfo({
            success: function(s) {
                wx.getImageInfo({
                    src: t,
                    success: function(t) {
                        if ("vertical" == a) n = .93, i = s.windowWidth * n, h = s.windowWidth / t.width * t.height * n; else {
                            var n = .5;
                            h = s.windowHeight * n, i = s.windowHeight / t.height * t.width * n;
                        }
                        e.setData({
                            "showImage.width": i,
                            "showImage.height": h
                        });
                    }
                });
            }
        });
    }
   
});