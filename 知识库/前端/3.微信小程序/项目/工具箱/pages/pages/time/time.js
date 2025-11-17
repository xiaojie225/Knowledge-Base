Page({
    data: {
        year: "2021",
        month: "3",
        day: "11",
        ypencent: "0",
        mpencent: "0",
        dpencent: "0"
    },
    cal: function(e) {
        var n = Date.parse(new Date());
        n /= 1e3;
        var t = new Date(1e3 * n), a = t.getFullYear(), o = t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth() + 1, c = t.getDate() < 10 ? "0" + t.getDate() : t.getDate(), s = t.getHours(), r = t.getMinutes(), i = t.getSeconds(), p = 0, u = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if (parseInt(o) < 2) p = c; else {
            for (var f = 0; f < o - 1; f++) p += u[f];
            p = parseInt(p) + parseInt(c);
        }
        this.setData({
            year: a,
            month: o,
            day: c,
            ypencent: parseInt(p / 365 * 100),
            mpencent: parseInt(c / u[o - 1] * 100),
            dpencent: parseInt((60 * (60 * s + r) + i) / 86400 * 100)
        });
    },
    onLoad: function(e) {},
    onReady: function() {
        this.cal();
    },
    onShow: function() {
        var e = this;
        setInterval(function() {
            e.cal();
        }, 1e3);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});