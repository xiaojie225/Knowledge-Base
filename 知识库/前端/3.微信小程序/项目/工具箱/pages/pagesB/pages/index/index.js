function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}
var a = getApp(), e = require("../../utils/api/index.js"), i = require("../../utils/api/search.js");
Page({
    data: {
        isIPX: a.isIPX,
        Android: a.Android,
        state: {
            loading: !0
        },
        tagData: {
            active: 0,
            item: [ {
                name: "精选",
                list: []
            }, {
                name: "星空",
                tag: "星空"
            }, {
                name: "风景",
                tag: "风景"
            }, {
                name: "爱情",
                tag: "爱情"
            }, {
                name: "二次元",
                tag: "二次元"
            }, {
                name: "游戏",
                tag: "游戏"
            }, {
                name: "插画",
                tag: "插画"
            }, {
                name: "科技",
                tag: "科技"
            }, {
                name: "创意",
                tag: "创意"
            }, {
                name: "汽车",
                tag: "汽车"
            }, {
                name: "美食",
                tag: "美食"
            }, {
                name: "潮流",
                tag: "潮流"
            } ]
        },
        cardCount: 20
    },
    onLoad: function() {
        var t = this, a = t.data.tagData;
        for (var e in a.item) e > 0 && (a.item[e].list = [], a.item[e].cardStart = 0, a.item[e].load = !0);
        t.setData({
            tagData: a
        }), 0 == a.active ? t.inGetList() : t.inGetCategory();
    },
    inGetList: function(t) {
        var a = this, i = a.data, n = i.state, r = i.tagData;
        n.loading && e.get({
            load: !1,
            data: {
                device: "weChat",
                system: "weChat",
                devicePixel: 480,
                homeOpenCount: -1,
                type: "WALLPAPER_INDEX",
                region: "CN"
            },
            success: function(t) {
                var e = t.apiData.cards[0].belowSubjectProducts;
                if (e.length) {
                    for (var i in e) "ios" == wx.getSystemInfoSync().platform && (e[i].imageUrl = e[i].imageUrl.replace("/webp/", "/jpeg/")), 
                    r.item[0].list.push(e[i]);
                    a.setData({
                        "tagData.item[0].list": r.item[0].list
                    });
                } else a.setData({
                    "state.loading": !1
                });
            }
        });
    },
    
    inGetCategory: function(a) {
        var e = this, n = e.data, r = n.tagData, s = n.cardCount, g = r.item[r.active];
        g.load && i.get({
            load: !1,
            data: {
                tag: g.tag,
                cardStart: g.cardStart,
                cardCount: s,
                devicePixel: 480,
                type: "WALLPAPER",
                region: "cn"
            },
            success: function(a) {
                var i = "tagData.item[" + r.active + "].load", n = "tagData.item[" + r.active + "].list", g = r.item[r.active].list, c = "tagData.item[" + r.active + "].cardStart", o = r.item[r.active].cardStart, l = a.apiData.cards[0].products;
                if (l.length) {
                    var d;
                    for (var m in l) "ios" == wx.getSystemInfoSync().platform && (l[m].imageUrl = l[m].imageUrl.replace("/webp/", "/jpeg/")), 
                    g.push(l[m]), m + 1 == l.length && m + 1 < s && e.setData(t({}, i, !1));
                    e.setData((d = {}, t(d, c, o + 1), t(d, n, g), d));
                } else e.setData(t({}, i, !1));
            }
        });
    },
    inToggleTag: function(t) {
        var a = this;
        a.setData({
            "tagData.active": t.detail.index
        });
        var e = a.data.tagData;
        !e.item[e.active].list.length && t.detail.index > 0 ? a.inGetCategory() : e.item[e.active].list.length || 0 != t.detail.index || a.inGetList();
    },
    inToSeeImg: function(t) {
        var a = t.currentTarget.dataset;
        wx.navigateTo({
            url: "/pagesB/pages/see-img/see-img?src=" + a.src
        });
    },
    onShareAppMessage: function() {
        return {
            title: "这些壁纸你喜欢吗？",
            path: "pagesB/pages/index/index"
        };
    }
});