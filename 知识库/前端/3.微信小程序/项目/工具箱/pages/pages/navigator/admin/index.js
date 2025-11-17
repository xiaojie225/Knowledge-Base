Page({
  data: {
    cardCur: 0,
  
   
  
 
    contents: 'jinwangkf'
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制微信号成功！请打开微信添加开发者微信',
              icon:'none',
              duration: 6000
            })
          }
        })
      }
    })
  },
  onLoad() {
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  
  jumpPage: function () {
    wx.navigateToMiniProgram({
      appId: 'wxcd1bb2299ed463c3',
      path: '',
      envVersion: 'release',
      extraData: {
        foo: 'bar'
      },

      success(res) {
        // 打开成功
      }
    })
  },

  about() {
    wx.showModal({
      title: '获取本程序源码',
      content: '."',
      showCancel: false
    })
  },
  jw: function () {
    wx.navigateTo({
      url: '../calendar/calendar',
    })
  },
  jumpPage2: function () {
    wx.navigateTo({
      url: '../home/home',
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  onShareTimeline: function(res){
    let img = this.data.path_image+this.data.shop.shop_img  //取得是称
    console.log(img)
    return {
      title: '有料工具箱上线啦~' , //字符串  自定义标题
      query: '有料工具箱',  //页面携带参数
      imageUrl: "https://jinjinyl.cn/ylapi/fx.jpg"   //图片地址
    }
  },
onShareAppMessage: function() {
    return {
        path: "/pages/navigator/index/index",
        title: "有料工具箱上线啦~",
        desc: "",
        imageUrl: "https://jinjinyl.cn/ylapi/fx.jpg"
    };
},


  showQrcode() {
    wx.previewImage({
      urls: ['http://mingtools.cn/tupian/zan.png'],
      current: 'http://mingtools.cn/tupian/zan.png' // 当前显示图片的http链接      
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})
  
