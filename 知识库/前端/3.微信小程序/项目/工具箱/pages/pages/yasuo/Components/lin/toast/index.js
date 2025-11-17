var t = require("../../../../utils/js/defineProperty");

Component({
    externalClasses: [ "" ],
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: "",
            observer: "elip"
        },
        icon: {
            type: String,
            value: ""
        },
        iconStyle: {
            type: String,
            value: "size:60; color:#fff",
            observer: "parseIconStyle"
        },
        image: {
            type: String,
            value: ""
        },
        imageStyle: {
            type: String,
            value: "60*60",
            observer: "parseImageStyle"
        },
        placement: {
            type: String,
            value: "bottom"
        },
        duration: {
            type: Number,
            value: 1500
        },
        zIndex: {
            type: Number,
            value: 999
        },
        center: {
            type: Boolean,
            value: true
        },
        mask: {
            type: Boolean,
            value: false
        },
        openApi: {
            type: Boolean,
            value: true
        },
        offsetX: Number,
        offsetY: Number
    },
    observers: {
        show: function(t) {
            t && this.changeStatus();
        }
    },
    data: {
        status: false,
        success: "",
        fail: "",
        complete: ""
    },
    attached: function() {
        this.data.openApi && this.initToast();
    },
    lifetimes: {
        show: function() {
            this.data.openApi && this.initToast();
        }
    },
    methods: {
        initToast: function() {
            var t = this;
            wx.lin = wx.lin || {}, wx.lin.showToast = function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, i = e.title, a = void 0 === i ? "" : i, s = e.icon, o = void 0 === s ? "" : s, n = e.iconStyle, r = void 0 === n ? "size:60; color:#fff" : n, l = e.image, u = void 0 === l ? "" : l, c = e.imageStyle, f = void 0 === c ? "60*60" : c, p = e.placement, v = void 0 === p ? "bottom" : p, d = e.duration, h = void 0 === d ? 1500 : d, m = e.center, g = void 0 === m || m, y = e.mask, S = void 0 !== y && y, b = e.success, x = void 0 === b ? null : b, w = e.complete, T = void 0 === w ? null : w, D = e.offsetX, k = void 0 === D ? 0 : D, I = e.offsetY, N = void 0 === I ? 0 : I;
                return t.setData({
                    title: a,
                    icon: o,
                    iconStyle: r,
                    image: u,
                    imageStyle: f,
                    placement: v,
                    duration: h,
                    center: g,
                    mask: S,
                    show: true,
                    success: x,
                    complete: T,
                    offsetY: N,
                    offsetX: k
                }), t.changeStatus(), t;
            };
        },
        changeStatus: function() {
            var t = this;
            this.setData({
                status: true
            }), this.data.timer && clearTimeout(this.data.timer), this.data.timer = setTimeout(function() {
                t.setData({
                    status: false
                }), t.data.success && t.data.success(), t.data.timer = null;
            }, this.properties.duration);
        },
        parseIconStyle: function(e) {
            var i = this;
            (e ? e.split(";") : [ "size: 60", "color: #fff" ]).map(function(e) {
                return e = e.trim().split(":"), i.setData(t({}, e[0], e[1])), e;
            });
        },
        parseImageStyle: function(t) {
            var e = t ? t.split("*") : [ 60, 60 ];
            return 1 === e.length && (e = [ e[0], e[0] ]), this.setData({
                imageW: e[0],
                imageH: e[1]
            }), e;
        },
        elip: function(t) {
            return t = (t ? this.strlen(t) : 0) ? t.substring(0, 20) : "", this.setData({
                title: t
            }), t;
        },
        strlen: function(t) {
            for (var e = 0, i = 0; i < t.length; i++) {
                var a = t.charCodeAt(i);
                a >= "0x0001" && a <= "0x007e" || "0xff60" <= a && a <= "0xff9f" ? e++ : e += 2;
            }
            return e;
        },
        doNothingMove: function(t) {},
        onMaskTap: function(t) {
            true !== this.data.locked && this.setData({
                fullScreen: "hide",
                status: "hide"
            }), this.triggerEvent("linTap", true, {});
        }
    }
});