Page({
    data: {
        imageInfo: [],
        imageUrls: []
    },
    onShareAppMessage: function() {
      return {
          title: "给你推荐一个在线截图拼接工具",
          path: ""
      };
    },
    onShareTimeline: function() {
      return {
          title: "给你推荐一个在线截图拼接工具"
      };
    },
    onReady: function() {},
    previewImage1: function(e) {
        var a = this;
        wx.chooseImage({
            count: 9,
            success: function(e) {
                for (var t = 0; t < e.tempFilePaths.length; t++)
                
                {
                var pic=e.tempFilePaths[t]
                
                wx.uploadFile({
                  
                    filePath: pic,
                    name: "file",
                  
                    success: function (res) {
                        wx.hideLoading()
                        const data = JSON.parse(res.data)
                        a.getImageInfo(pic);
                   
                        wx.showModal({
                            title:'提示',
                            content:data.data,
                            success:()=>{
            
                            }
                          })
                    
                    },
                    fail: function (err) {
                      wx.showToast({
                        title: "上传失败",
                        icon: "none",
                        duration: 2000
                      })
                    },
                    complete: function (result) {
                      console.log(result.errMsg)
                    }
                  })
              
                }
            }
        });
    },


    
    previewImage: function(e) {
        var a = this;
        wx.chooseImage({
            count: 9,
            success: function(e) {
                for (var t = 0; t < e.tempFilePaths.length; t++) 
                
                
                a.getImageInfo(e.tempFilePaths[t]);
            }
        });
    },
    getImageInfo: function(e) {
        var a = this;
        wx.getImageInfo({
            src: e,
            success: function(t) {
                var i = a.data.imageInfo, n = a.data.imageUrls, r = new Object();
                r.url = e, r.width = t.width, r.height = t.height, i.push(r), n.push(e), a.setData({
                    imageInfo: i,
                    imageUrls: n
                });
            }
        });
    },
    changePreview: function(e) {
        var a = this;
        wx.previewImage({
            current: e.currentTarget.dataset.src,
            urls: a.data.imageUrls
        });
    },
    removeImage: function(e) {
        var a = this, t = a.data.imageInfo, i = a.data.imageUrls, n = e.currentTarget.dataset.index;
        t.splice(n, 1), i.splice(n, 1), a.setData({
            imageInfo: t,
            imageUrls: i
        });
    },
    goToPage: function(e) {
        var a = this, t = e.currentTarget.dataset.direction;
        void 0 == a.data.imageInfo[1] ? wx.showToast({
            title: "请至少选择两张图！",
            icon: "none"
        }) : wx.navigateTo({
            url: "./show?imageInfo=" + JSON.stringify(a.data.imageInfo) + "&direction=" + t
        });
    }
   
});