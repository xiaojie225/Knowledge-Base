module.exports = {
    analysis: function(t, a, e) {
        wx.request({
          // 去水印接口
       /**
   * 本源码由十一云二改提供
   * 不懂的看：“http://shop.ajouter.top/ 在线指导文档”
   *  去水印接口一块钱 永久使用 
   * 步数接口一块钱   永久使用
   * 
   */
            url: "购买请到指导文档",
            method: "GET",
            data: {
                url: t
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                t.data && "200" == t.data.code ? a(t.data.data) : e(t.data.message);
            },
            fail: function(t) {
                e("网络有问题");
            }
        });
    }
};