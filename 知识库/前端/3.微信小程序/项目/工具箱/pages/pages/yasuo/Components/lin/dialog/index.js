Component({
    externalClasses: [ "l-class", "l-class-title", "l-class-content", "l-class-confirm", "l-class-cancel" ],
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        type: {
            type: String,
            value: "alert"
        },
        title: {
            type: String,
            value: "提示"
        },
        showTitle: {
            type: Boolean,
            value: true
        },
        content: {
            type: String,
            value: ""
        },
        locked: {
            type: Boolean,
            value: true
        },
        confirmText: {
            type: String,
            value: "确定"
        },
        confirmColor: {
            type: String,
            value: "#ff4444"
        },
        cancelText: {
            type: String,
            value: "取消"
        },
        cancelColor: {
            type: String,
            value: "#45526b"
        },
        openApi: {
            type: Boolean,
            value: true
        }
    },
    data: {
        success: null,
        fail: null
    },
    attached: function() {
        this.data.openApi && this.initDialog();
    },
    lifetimes: {
        show: function() {
            this.data.openApi && this.initDialog();
        }
    },
    methods: {
        initDialog: function() {
            var t = this, e = "alert", i = "提示", o = true, l = "", n = true, a = "确定", s = "#ff4444", c = "取消", r = "#45526b", h = null, u = null;
            wx.lin = wx.lin || {}, wx.lin.showDialog = function(v) {
                var d = v.type, p = void 0 === d ? e : d, f = v.title, g = void 0 === f ? i : f, w = v.showTitle, m = void 0 === w ? o : w, y = v.content, T = void 0 === y ? l : y, D = v.locked, x = void 0 === D ? n : D, C = v.confirmText, S = void 0 === C ? a : C, k = v.cancelColor, B = void 0 === k ? s : k, A = v.cancelText, E = void 0 === A ? c : A, b = v.confirmColor, M = void 0 === b ? r : b, j = v.success, q = void 0 === j ? h : j, z = v.fail, F = void 0 === z ? u : z;
                return t.setData({
                    type: p,
                    title: g,
                    showTitle: m,
                    content: T,
                    locked: x,
                    confirmText: S,
                    cancelColor: B,
                    cancelText: E,
                    confirmColor: M,
                    show: true,
                    fail: F,
                    success: q
                }), t;
            };
        },
        onConfirmTap: function(t) {
            var e = this.data.success;
            e && e({
                confirm: true,
                cancel: false,
                errMsg: "showDialog: success"
            }), this.setData({
                show: !this.data.show
            }), this.triggerEvent("linconfirm", "confirm", {});
        },
        onCancelTap: function(t) {
            var e = this.data.success;
            e && e({
                confirm: false,
                cancel: true,
                errMsg: "showDialog: success"
            }), this.setData({
                show: !this.data.show
            }), this.triggerEvent("lincancel", "cancel", {});
        },
        onDialogTap: function(t) {
            true !== this.data.locked && this.setData({
                show: !this.data.show
            }), this.triggerEvent("lintap", true, {});
        }
    }
});