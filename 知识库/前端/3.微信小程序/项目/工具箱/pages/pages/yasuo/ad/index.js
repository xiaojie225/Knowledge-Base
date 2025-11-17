const shareUtil = require('../../../utils/shareUtil.js');
Page({
    data: {},
    navi: function(n) {
        wx.reLaunch({
            url: "../yasuo"
        });
    },
    naviIndex: function(n) {
      wx.reLaunch({
          url: "/pages/tool/tool"
      });
  },
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage:shareUtil.shareConfig,
    onShareTimeline:shareUtil.shareConfig,
});