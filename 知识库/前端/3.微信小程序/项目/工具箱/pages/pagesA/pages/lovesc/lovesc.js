
function t(t) {
    if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
        if (Array.isArray(t) || (t = function(t, a) {
            if (!t) return;
            if ("string" == typeof t) return e(t, a);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n) return Array.from(n);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return e(t, a);
        }(t))) {
            var a = 0, n = function() {};
            return {
                s: n,
                n: function() {
                    return a >= t.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: t[a++]
                    };
                },
                e: function(t) {
                    throw t;
                },
                f: n
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var r, o, i = !0, l = !1;
    return {
        s: function() {
            r = t[Symbol.iterator]();
        },
        n: function() {
            var t = r.next();
            return i = t.done, t;
        },
        e: function(t) {
            l = !0, o = t;
        },
        f: function() {
            try {
                i || null == r.return || r.return();
            } finally {
                if (l) throw o;
            }
        }
    };
}
var a = require("../wxapp/love.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadShowIndex: 20,
        max: 12,
        inputData: "我爱你",
        lastInputData: "",
        lastResultData: "",
        lastIndex: -1,
        lastTypeIndex: 0,
        page: 1,
        pages: 0,
        dataList: [],
        scrollNum: 0,
        templeUnlock: !1,
        tempIndex: -1,
        tempData: "",
        styleColumnValue: "ＡＢＣＤ ＥＦＧＨ 　ＪＫ　\nＡ　　　 　　　Ｈ Ｉ　　Ｌ\nＡＢＣＤ ＥＦＧＨ Ｉ　　Ｌ\n　　　Ｄ Ｅ　　　 Ｉ　　Ｌ\nＡＢＣＤ ＥＦＧＨ 　ＪＫ　\n",
        styleRowValue: "ＡＡＡＡ ＡＡＡＡ 　ＡＡ　\nＢ　　　 　　　Ｂ Ｂ　　Ｂ\nＣＣＣＣ ＣＣＣＣ Ｃ　　Ｃ\n　　　Ｄ Ｄ　　　 Ｄ　　Ｄ\nＥＥＥＥ ＥＥＥＥ 　ＥＥ　\n",
        styleArr: [ "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ" ],
        styleTempleArr: {
            1: [ "ＡＡＡＡＡＡＡＡＡＡＡＡ" ],
            2: [ "ＡＡＡＡＡＡＢＢＢＢＢＢ", "ＡＢＢＢＢＢＢＢＢＢＢＢ", "ＡＡＢＢＢＢＢＢＢＢＢＢ", "ＡＡＡＢＢＢＢＢＢＢＢＢ", "ＡＡＡＡＢＢＢＢＢＢＢＢ", "ＡＡＡＡＡＢＢＢＢＢＢＢ", "ＡＡＡＡＡＡＡＢＢＢＢＢ", "ＡＡＡＡＡＡＡＡＢＢＢＢ", "ＡＡＡＡＡＡＡＡＡＢＢＢ", "ＡＡＡＡＡＡＡＡＡＡＢＢ", "ＡＡＡＡＡＡＡＡＡＡＡＢ" ],
            3: [ "ＡＡＡＡＢＢＢＢＣＣＣＣ", "ＡＡＡＢＢＢＢＢＢＣＣＣ", "ＡＡＢＢＢＢＢＢＢＢＣＣ", "ＡＢＢＢＢＢＢＢＢＢＢＣ" ],
            4: [ "ＡＡＡＡＢＢＣＣＤＤＤＤ", "ＡＡＡＢＢＢＣＣＣＤＤＤ", "ＡＡＢＢＢＢＣＣＣＣＤＤ", "ＡＢＢＢＢＢＣＣＣＣＣＤ" ],
            5: [ "ＡＡＢＢＣＣＤＤＥＥＥＥ", "ＡＡＡＡＢＢＣＣＤＤＥＥ", "ＡＡＢＢＢＢＣＣＤＤＥＥ", "ＡＡＢＢＣＣＣＣＤＤＥＥ", "ＡＡＢＢＣＣＤＤＤＤＥＥ" ],
            6: [ "ＡＡＢＢＣＣＤＤＥＥＦＦ", "ＡＡＡＡＢＣＤＥＦＦＦＦ", "ＡＡＡＡＢＢＢＢＣＤＥＦ" ],
            7: [ "ＡＢＣＣＤＤＥＥＦＦＧＧ", "ＡＡＢＢＣＣＤＤＥＥＦＧ", "ＡＢＢＣＣＤＤＥＥＦＦＧ" ],
            8: [ "ＡＡＢＢＣＣＤＤＥＦＧＨ", "ＡＢＣＤＥＥＦＦＧＧＨＨ" ],
            9: [ "ＡＡＢＢＣＣＤＥＦＧＨＩ", "ＡＢＣＤＥＦＧＧＨＨＩＩ" ],
            10: [ "ＡＡＢＢＣＤＥＦＧＨＩＪ", "ＡＢＣＤＥＦＧＨＩＩＪＪ" ],
            11: [ "ＡＡＢＣＤＥＦＧＨＩＪＫ", "ＡＢＣＤＥＦＧＨＩＪＫＫ" ],
            12: [ "ＡＢＣＤＥＦＧＨＩＪＫＬ" ]
        },
        rowTempleArr: {
            2: [ "ＡＡＡＢＢ", "ＡＡＢＢＢ", "ＡＡＡＡＢ", "ＡＢＢＢＢ" ],
            3: [ "ＡＡＢＣＣ", "ＡＢＢＢＣ", "ＡＡＢＢＣ", "ＡＢＣＣＣ", "ＡＡＡＢＣ" ],
            4: [ "ＡＢＣＤＤ", "ＡＡＢＣＤ", "ＡＢＢＣＤ", "ＡＢＣＣＤ" ],
            5: [ "ＡＢＣＤＥ" ]
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        

     
    },
    showinte:function(){
       
      },
    checkmsg: function (t) {
        var data = t.currentTarget.dataset.value;
        console.log(t)
        var that=this;
        
                        if (data) {
                    that.Inputsc(data)
                        } else 
                            wx.showToast({
                            title: "请输入内容，不能为空",
                            icon: "none",
                            duration: 1000
                        });
                        
                    
               
                 
                    wx.showModal({
                        title: f.data.data,
                        icon: "none",
                        duration: 800
                    }); 
                
            
        
    },
 
    Inputsc: function(e) {
        var n = a.getWordSize(e), r = this.data.max;
        n > r && (e = e.substring(0, r));
        var o = n % r;
        n >= r && (o = r);
        var i, l = [], s = [], c = "", u = t(e);
        try {
            for (u.s(); !(i = u.n()).done; ) {
                var d = i.value;
                s = this.data.styleTempleArr[1], c += this.makeAllWord(s, this.data.styleColumnValue, d) + "\n";
            }
        } catch (t) {
            u.e(t);
        } finally {
            u.f();
        }
        l.push(c), n < 6 ? ((s = this.data.styleTempleArr[o]) && (l = l.concat(this.makeData(s, this.data.styleColumnValue, e))), 
        (s = this.data.rowTempleArr[o]) && (l = l.concat(this.makeData(s, this.data.styleRowValue, e, n)))) : (s = this.data.styleTempleArr[o], 
        l = l.concat(this.makeData(s, this.data.styleColumnValue, e, n))), this.setData({
            dataList: l
        });
    },
    makeData: function(e, n, r, o) {
        for (var i = [], l = n, s = 0; s < e.length; s++) {
            l = n;
            var c, u = e[s], d = 0, f = t(r);
            try {
                for (f.s(); !(c = f.n()).done; ) {
                    var h = c.value, m = a.getFullChar(r, d);
                    u = u.replace(new RegExp(this.data.styleArr[d], "gm"), m), d++;
                }
            } catch (t) {
                f.e(t);
            } finally {
                f.f();
            }
            var p, y = 0, w = t(u);
            try {
                for (w.s(); !(p = w.n()).done; ) {
                    h = p.value;
                    l = l.replace(new RegExp(this.data.styleArr[y], "gm"), h), y++;
                }
            } catch (t) {
                w.e(t);
            } finally {
                w.f();
            }
            i.push(l);
        }
        return i;
    },
    makeAllWord: function(e, n, r, o) {
        for (var i = n, l = 0; l < e.length; l++) {
            i = n;
            var s, c = e[l], u = 0, d = t(r);
            try {
                for (d.s(); !(s = d.n()).done; ) {
                    var f = s.value, h = a.getFullChar(r, u);
                    c = c.replace(new RegExp(this.data.styleArr[u], "gm"), h), u++;
                }
            } catch (t) {
                d.e(t);
            } finally {
                d.f();
            }
            var m, p = 0, y = t(c);
            try {
                for (y.s(); !(m = y.n()).done; ) {
                    f = m.value;
                    i = i.replace(new RegExp(this.data.styleArr[p], "gm"), f), p++;
                }
            } catch (t) {
                y.e(t);
            } finally {
                y.f();
            }
        }
        return i;
    },
    clear: function(t) {
        this.setData({
            inputData: "",
            resultData: "",
            lastIndex: -1,
            dataList:""
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    bindKeyInput: function(t) {
        var e = t.detail.value;
        "" !== e && this.setData({
            inputData: e
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },
    selectData: function(t) {
        var a=this
        var e = t.currentTarget.dataset.index, n = t.currentTarget.dataset.value;
        e < this.data.loadShowIndex || this.data.convertUnlock ? a.CopyLink(n) : (this.setData({
            tempIndex: e,
            tempData: n
        }));
    },
    CopyLink: function(e) {
        wx.setClipboardData({
            data: e,
            success: function(t) {
                wx.showToast({
                    title: "已复制",
                    duration: 1000
                });
            }
        });
    },
    onShareTimeline: function() {
        return {
            title: "制作520表白神器"
        };
    },
    onShareAppMessage: function() {
        return {
            path: "/pagesA/pages/lovesc/lovesc",
            title: "制作520表白神器",
            imageUrl:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-07f1dadb-1b39-46b0-bb59-e357f1fc9cbb/e837628e-ac52-4d09-aa29-7cc3350c396c.jpg"
        };
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

  
})