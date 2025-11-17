Page({
    data: {
        guiling: !1,
        setting: !1,
        active1: !1,
        active2: !0,
        res: 0,
        num: 1,
        nums: 1,
        sn1: 0,
        sn2: 0
    },
    guiling: function() {
        var t = this;
        this.setData({
            res: 0,
            sn1: 0,
            sn2: 0,
            guiling: !0
        }), setTimeout(function() {
            t.setData({
                guiling: !1
            });
        }, 300);
    },
    setting: function() {
        this.setData({
            setting: !this.data.setting
        });
    },
    changenum: function(t) {
        this.setData({
            num: t.detail.value,
            nums: t.detail.value
        });
    },
    sorts: function() {
        this.setData({
            active1: !this.data.active1,
            res: 0,
            num: 1,
            nums: 1,
            sn1: 0,
            sn2: 0
        });
    },
    sounds: function() {
        this.setData({
            active2: !this.data.active2
        });
    },
    click1: function() {
        if (this.setData({
            setting: !1
        }), 1 == this.data.active2) {
            var t = wx.createInnerAudioContext();
            t.autoplay = !0, t.src = "/audio/week.mp3", t.onPlay(function() {}), this.setData({
                res: this.data.res + this.data.num
            });
        } else this.setData({
            res: this.data.res + this.data.num
        });
    },
    click2: function() {
        if (this.setData({
            setting: !1
        }), 1 == this.data.active2) {
            var t = wx.createInnerAudioContext();
            t.autoplay = !0, t.src = "/images/week.mp3", t.onPlay(function() {}), this.setData({
                res: this.data.res + this.data.num,
                sn1: this.data.num + this.data.sn1
            });
        } else this.setData({
            res: this.data.res + this.data.num,
            sn1: this.data.num + this.data.sn1
        });
    },
    click3: function() {
        if (this.setData({
            setting: !1
        }), 1 == this.data.active2) {
            var t = wx.createInnerAudioContext();
            t.autoplay = !0, t.src = "/audio/week.mp3", t.onPlay(function() {}), this.setData({
                res: this.data.res + this.data.nums,
                sn2: this.data.num + this.data.sn2
            });
        } else this.setData({
            res: this.data.res + this.data.nums,
            sn2: this.data.num + this.data.sn2
        });
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
   
});