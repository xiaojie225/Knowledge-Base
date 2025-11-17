var t = require("../utils/js/numUpToCase");
const shareUtil = require('../../utils/shareUtil');
Page({
    data: {
        orig: "0",
        word: "零元整",
        wheight: 500
    },
    naviIndex: function(n) {
        wx.reLaunch({
            url: "/pages/index/index"
        });
    },
    press: function(t) {
        var a = this.data.orig.split(".");
        if (a.length > 1 && "." == t.target.dataset.num) return null;
        if (a.length > 1 && 2 == a[1].length) return null;
        if (13 == this.data.orig.length) return null;
        var i = "";
        i = "0" === this.data.orig && "." != t.target.dataset.num ? t.target.dataset.num.toString() : this.data.orig + t.target.dataset.num.toString(), 
        this.setData({
            orig: i
        }), this.change();
    },
    change: function() {
        var a = t.Uppercase(this.data.orig);
        this.setData({
            word: a
        });
    },
    ac: function() {
        this.setData({
            orig: "0",
            word: "零元整"
        });
    },
    back: function() {
        var t = this.data.orig.split("");
        if (1 === t.length) return this.ac();
        t.pop(), this.setData({
            orig: t.join("")
        }), this.change();
    },
    onLoad: function() {
        var t = this;
        wx.getSystemInfo({
            success: function(a) {
                t.setData({
                    wheight: a.windowHeight
                });
            }
        });
    },
    onCopy: function() {
        wx.setClipboardData({
            data: this.data.word,
            success: function() {
                wx.showToast({
                    title: "复制成功"
                });
            }
        });
    },
    onShareAppMessage: function() {
      return {
          title: "这里数字转大写一键生成",
          path: ""
      };
  },
  onShareTimeline: function() {
      return {
          title: "这里数字转大写一键生成"
      };
  }
});