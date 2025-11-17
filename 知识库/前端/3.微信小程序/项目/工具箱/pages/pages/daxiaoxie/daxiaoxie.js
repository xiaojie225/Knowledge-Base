Page({
    data: {
        num: 0,
        result: 0
    },
    yuan: function(t) {
        var n = t.detail.value;
        return "0" == n[0] ? n = 1 == n.length || "0" == n[1] ? "0" : "." == n[1] ? 2 == n.length ? "0." : 3 == n.length ? parseFloat(n).toFixed(1) : parseFloat(n).toFixed(2) : n.substr(1, n.length) : "" == n ? n = 0 : -1 == n.indexOf(".") ? n = n : -1 != n.substr(0, n.length - 1).indexOf(".") && "." == n[n.length - 1] ? "." == (n = n.substr(0, n.length - 1))[n.length - 4] && (n = n.substr(0, n.length - 1)) : "." == n[n.length - 4] && (n = n.substr(0, n.length - 1)), 
        this.setData({
            num: n
        }), this.cals(n), n;
    },
    cals: function(t) {
        var n, e, r, a = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"), s = new Array("", "拾", "佰", "仟"), o = new Array("", "万", "亿", "兆"), u = new Array("角", "分", "毫", "厘"), i = "";
        if ("" == t) return "";
        if ((t = parseFloat(t)) >= 1e15) return "";
        if (0 == t) return i = a[0] + "元整";
        if (-1 == (t = t.toString()).indexOf(".") ? (n = t, e = "") : (n = (r = t.split("."))[0], 
        e = r[1].substr(0, 4)), parseInt(n, 10) > 0) {
            for (var l = 0, f = n.length, h = 0; h < f; h++) {
                var c = f - h - 1, g = c / 4, d = c % 4;
                "0" == (p = n.substr(h, 1)) ? l++ : (l > 0 && (i += a[0]), l = 0, i += a[parseInt(p)] + s[d]), 
                0 == d && l < 4 && (i += o[g]);
            }
            i += "元";
        }
        if ("" != e) {
            var b = e.length;
            for (h = 0; h < b; h++) {
                var p;
                "0" != (p = e.substr(h, 1)) && (i += a[Number(p)] + u[h]);
            }
        }
        return "" == i ? i += a[0] + "元整" : "" == e && (i += "整"), this.setData({
            result: i
        }), i;
    },
    fuzhi: function(t) {
        wx.setClipboardData({
            data: this.data.result,
            success: function(t) {
                wx.getClipboardData({
                    success: function(t) {
                        wx.showToast({
                            title: "内容已复制"
                        });
                    }
                });
            }
        });
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});