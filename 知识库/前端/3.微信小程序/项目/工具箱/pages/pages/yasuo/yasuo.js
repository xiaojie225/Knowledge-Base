var o, s,  t = [ "then", "type", "imageUrl", "time", "从手机相册选择", "4bdbacf8-cc58-4d0c-81f3-74c8f942df15", "选择了压缩率:", "error", "show", "sizeType", "bubble_is_shown", "savesave", "tapIndex", "from", "target", "tempFiles", "success", "button", "show_dialog", "path", "original", "quality", "compressImage:ok", "chooseMessageFile", "好用的压缩图片工具，快来看一看吧", "compress_num", "switchTab", "foo", "gotobqb", "toFixed", "org_size", "getFileInfo", "camera", "保存图片或视频到你的相册", "请先上传", "toast_choose_compress", "loading_show", "clearStorage", "confirm", "toast_upload_success", "get", "text_toast_choose_compress", "navi_to_two", "toast_savepic_success", "clickToCloseHint", "extraData", "text", "res_size", "", "toString", "转发失败:", "navigateTo", "appId", "toast_savepic_fail", "title", "data", "already_upload", "正在计算", "cancel", "envVersion", "setData", "filePath", "tempFilePath", "src", "compressImage", "/pages/yasuo/ad/index", "formatFileSize", "show_dialog_typeerror", "fail", "stringify", "where", "size", "clickphotoway", "showpreview", "choose_compress", "url", "openSetting", "show_popup", "all_file_path", "微信授权", "saveImageToPhotosAlbum", "正在计算中", "onLoad", "choose_compress_item", "compress_try", "log", "showModal", "pages/home/home", "loading_upload", "content", "dataset", "toast_onDelTap", "onShareAppMessage", "scope.writePhotosAlbum", "record", "getSetting", "compress_change", "image_type", "digest", "", "mask_show", "sourceType", "get_Img", "itemList", "toast_endcompress", "confirmText", "album", "转发成功:", "count", "img_url", "../two/index", "chooseImage", "从聊天记录选择", "image", "collection", "tempFilePaths", "_id", "push", "showadd", "show_popup_convert", "show_convert", "scope", "bar" ];

o = t, s = 451, function(s) {
    for (;--s; ) o.push(o.shift());
}(++s);

var a = function(o, s) {
    return t[o -= 0];
};

Page({
    data: {
        choose_compress: [ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ],
        all_file_path: "",
        showadd: true,
        showpreview: false,
        compress_num: 30,
        show_popup: false,
        show_popup_convert: false,
        show_dialog: false,
        mask_show: false,
        img_url: "",
        org_size: a("0x4b"),
        res_size: a("0x4b"),
        text: "<数字越小，压缩后文件越小>",
        loading_show: false,
        loading_upload: false,
        navi_to_two: false,
        toast_choose_compress: false,
        text_toast_choose_compress: "",
        toast_onDelTap: false,
        toast_upload_success: false,
        toast_savepic_success: false,
        toast_savepic_fail: false,
        show_dialog_typeerror: false,
        bubble_is_shown: true
    },
    clickToCloseHint: function() {
        this[a("0x65")]({
            bubble_is_shown: false
        });
    },
    gotobqb: function() {
        wx[a("0x43")]({
            url: "../bqb/index"
        });
    },
    show_convert: function() {
        this[a("0x65")]({
            show_popup_convert: true
        });
    },
    gototwo: function(o) {
        wx[a("0x43")]({
            url: a("0x1c")
        });
    },
    onShareAppMessage: function() {
        return {
            title: "这里可以免费在线压缩各站图片",
            path: ""
        };
    },
    onShareTimeline: function() {
        return {
            title: "这里可以免费在线压缩各站图片"
        };
    },
    compress_try: function() {
        var o = this, s = o[a("0x60")][a("0x77")], e = o.data[a("0x42")];
        console[a("0x3")](e), wx[a("0x69")]({
            src: s,
            quality: e,
            success: function(s) {
                if (console[a("0x3")](s), a("0x3f") == s.errMsg) {
                    o[a("0x65")]({
                        res_size: a("0x7a"),
                        img_url: s[a("0x67")]
                    });
                    var e = s[a("0x67")];
                    console[a("0x3")]("n"), console[a("0x3")](e), wx[a("0x48")]({
                        filePath: e,
                        success: function(s) {
                            console[a("0x3")](s[a("0x10")]), o.setData({
                                res_size: o[a("0x6b")](s[a("0x70")])
                            });
                        }
                    });
                }
            },
            fail: function(o) {}
        });
    },
    chooseagain: function(o) {
        this[a("0x65")]({
            mask_show: false
        });
    },
    compress_change: function(o) {
        this[a("0x65")]({
            show_popup: true
        });
    },
    choose_compress_item: function(o) {
        console.log(o);
        var s = o[a("0x37")][a("0x8")].id;
        this[a("0x65")]({
            show_popup: false,
            compress_num: s
        });
        var e = s[a("0x5a")](), t = a("0x2f") + e;
        this[a("0x65")]({
            text_toast_choose_compress: t
        }), this[a("0x65")]({
            toast_choose_compress: true
        }), this.compress_try();
    },
    onPreviewTap: function(o) {
        var s = [], e = this[a("0x60")].all_file_path;
        s[a("0x23")](e), wx.previewImage({
            urls: s
        });
    },
    compress_end: function() {
        var o = this, s = this[a("0x60")][a("0x77")], e = o[a("0x60")][a("0x42")];
        console[a("0x3")](e), console.log(s), "" === s ? o.setData({
            toast_endcompress: true
        }) : wx[a("0x69")]({
            src: s,
            quality: e,
            success: function(s) {
                o[a("0x65")]({
                    img_url: s[a("0x67")],
                    show_dialog: true
                });
                var e = s[a("0x67")];
                wx[a("0x48")]({
                    filePath: e,
                    success: function(s) {
                        o[a("0x65")]({
                            res_size: o[a("0x6b")](s[a("0x70")])
                        });
                    }
                });
            },
            fail: function(s) {
                o[a("0x65")]({
                    show_dialog_typeerror: true
                });
            }
        });
    },
    onDelTap: function(o) {
        this.setData({
            all_file_path: "",
            showadd: true,
            showpreview: false,
            res_size: "请先上传",
            org_size: "请先上传",
            loading_upload: false,
            toast_onDelTap: true
        }), this.compress_try();
    },
    onLoad: function() {
        var o = this;
        setTimeout(function() {
            o.setData({
                bubble_is_shown: false
            });
        }, 3e3)
    },
    clickphotoway: function(o) {
        var s = this;
        
        wx.showActionSheet({
            itemList: [ "拍照", a("0x2d"), a("0x1e") ],
            success: function(o) {
                console[a("0x3")](o[a("0x35")]);
                var e = o[a("0x35")];
                0 === e && s[a("0xf")](a("0x49")), 1 === e && s[a("0xf")](a("0x18")), 2 === e ? s[a("0xf")](a("0xc")) : console[a("0x3")]("tapindex error");
            }
        });
    },
    image_type: function(o) {
        var s = this;
        s[a("0x65")]({
            showpreview: false,
            loading_upload: true,
            showadd: false
        }), o !== a("0xc") ? wx[a("0x1d")]({
            count: 1,
            sizeType: [ a("0x3d") ],
            sourceType: [ o ],
            success: function(o) {
                var e = o[a("0x21")][0], t = o[a("0x38")][0].size;
                s.setData({
                    all_file_path: e,
                    already_upload: 1,
                    org_size: s[a("0x6b")](t),
                    showadd: false,
                    showpreview: true,
                    res_size: a("0x62"),
                    loading_upload: false
                }), s[a("0x2")](), s[a("0x65")]({
                    toast_upload_success: true
                });
            },
            fail: function(o) {
                s[a("0x65")]({
                    loading_upload: false,
                    showadd: true
                });
            }
        }) : wx[a("0x40")]({
            count: 1,
            type: a("0x1f"),
            sizeType: [ a("0x3d") ],
            success: function(o) {
                o[a("0x38")][0].path, o[a("0x38")][0][a("0x70")];
                s[a("0x65")]({
                    all_file_path: o[a("0x38")][0].path,
                    org_size: s.formatFileSize(o[a("0x38")][0][a("0x70")]),
                    showadd: false,
                    showpreview: true,
                    res_size: "正在计算",
                    loading_upload: false
                }), console[a("0x3")](s[a("0x60")][a("0x77")]), s[a("0x2")](), s[a("0x65")]({
                    toast_upload_success: true
                });
            },
            fail: function(o) {
                s[a("0x65")]({
                    loading_upload: false,
                    showadd: true
                });
            }
        });
    },
    formatFileSize: function(o) {
        return o < 1024 ? o + "B" : o < 1048576 ? (o / 1024)[a("0x46")](2) + "KB" : o < 1073741824 ? (o / 1048576)[a("0x46")](2) + "MB" : void 0;
    },
    savesave: function() {
        var o = this;
        o.setData({
            loading_show: true
        }), wx[a("0xd")]({
            success: function(s) {
                s.authSetting["scope.writePhotosAlbum"] ? o[a("0x14")]() : wx.authorize({
                    scope: a("0xb"),
                    success: function(s) {
                        o[a("0x65")]({
                            loading_show: true
                        }), o[a("0x14")]();
                    },
                    fail: function(s) {
                        o[a("0x65")]({
                            loading_show: false
                        }), wx[a("0x4")]({
                            title: a("0x78"),
                            content: a("0x4a"),
                            confirmText: "允许",
                            success: function(o) {
                                o[a("0x4f")] ? wx[a("0x75")]({
                                    success: function() {}
                                }) : o[a("0x63")];
                            }
                        });
                    }
                });
            }
        });
    },
    get_Img: function() {
        var o = this;
        o[a("0x65")]({
            loading_show: true
        }), wx[a("0x79")]({
            filePath: o[a("0x60")][a("0x1b")],
            success: function(s) {
                o[a("0x65")]({
                    loading_show: false
                }), o[a("0x65")]({
                    toast_savepic_success: true
                }), wx[a("0x5c")]({
                    url: a("0x6a")
                });
            },
            fail: function(o) {
                o[a("0x65")]({
                    toast_savepic_fail: true
                });
            }
        });
    }
});