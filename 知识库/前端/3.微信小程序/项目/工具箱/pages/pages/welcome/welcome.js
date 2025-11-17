getApp();

var t = require("../../utils/relationship.js");

Page({
    data: {
        second_height: 0,
        screenData: "我",
        result: "",
        id1: "丈夫",
        id2: "妻子",
        id3: "back",
        id4: "clean",
        id5: "爸爸",
        id6: "妈妈",
        id7: "哥哥",
        id8: "弟弟",
        id9: "姐姐",
        id10: "妹妹",
        id11: "儿子",
        id12: "女儿",
        id13: "each",
        id14: "=",
        id15: "?",
        isTrue: !1,
        sex: 1
    },
    onLoad: function(t) {},
    fx: function(t) {},
    onShareAppMessage: function() {
        return {
            title: "亲戚关系太复杂，还不知怎么称呼？快来算一算！",
            path: "/pages/index/index",
            imageUrl: "../../images/shareBack.jpg"
        };
    },
    switchChange: function(t) {
        t.detail.value ? this.setData({
            sex: 0
        }) : this.setData({
            sex: 1
        });
    },
    clickButton: function(e) {
        var i = this.data.screenData.toString(), s = this.data.result.toString(), a = e.target.id;
        if (a == this.data.id3) {
            if ("我" == i) return;
            i = i.substring(0, i.length - 3);
            s = d = t({
                text: i,
                sex: this.data.sex,
                reverse: !1,
                type: "default"
            });
        } else if (a == this.data.id4) i = "我", s = ""; else {
            i = i.substring(0, i.length);
            var d = t({
                text: i,
                sex: this.data.sex,
                reverse: !1,
                type: "default"
            });
            if (console.log(d), a == this.data.id14) {
                if (i.length >= 22) return void (s = "关系有点远，年长就叫老祖宗吧~");
                s = d;
            } else if (a == this.data.id13) {
                if (i.length >= 22) return void (s = "关系有点远，年长就叫老祖宗吧~");
                this.data.isTrue ? (d = t({
                    text: i,
                    sex: this.data.sex,
                    reverse: !1,
                    type: "default"
                }), this.setData({
                    isTrue: !1
                })) : (d = t({
                    text: i,
                    sex: this.data.sex,
                    reverse: !0,
                    type: "default"
                }), this.setData({
                    isTrue: !0
                })), s = d;
            } else a == this.data.id15 ? wx.previewImage({
                urls: [ "https://hfh7.com/wp-content/uploads/2020/09/202009011551592.jpg" ]
            }) : i.length >= 22 ? s = "关系有点远，年长就叫老祖宗~\n同龄人就叫帅哥美女吧" : 1 == this.data.sex && a == this.data.id1 && "我" == i || 0 == this.data.sex && a == this.data.id2 && "我" == i || (d = t({
                text: i = i + "的" + a,
                sex: this.data.sex,
                reverse: !1,
                type: "default"
            }), this.isNull(d) && (d = "哎呀，关系太复杂了啊，我算不出来"), s = d);
        }
        this.setData({
            screenData: i,
            result: s
        });
    },
    naviIndex: function(n) {
      wx.reLaunch({
          url: "/pages/index/index"
      });
  },
    isNull: function(t) {
        return 0 == t.length;
    }
});