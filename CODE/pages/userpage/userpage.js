// userpage/userpage.js

// //获取全局变量
var app = getApp()      //后面有用到全局变量中的函数，见Components

//局部变量


Page({

  /**
   * 页面的初始数据
   */
  data: {
   //当前登录的用户数据存放.内容获取在下方OnLoad函数中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})

Component({
  lifetimes: {
    attached: function () {
      var that = this
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                console.log(res.userInfo)
                console.log("用户已经授权，将取消按钮")//用户已经授权过
                that.setData({
                  isAuthorized:true,
                })
              }
            })
          }
        }
      })

      console.log('Component:User Center Page | lifetimes: attached')
      app.getUserInfo(function (userInfo) {     //调用app.js中的函数来更新用户数据，并且后端要确认用户登录
        that.setData({    //更新数据
          userInfo: userInfo
        })
      })
    }
  },
  data:{
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorized:null
  },
  pageLifetimes: {
    show() {
      console.log("用户页面显示")
      console.log(app.globalData.isAuthorized)
      
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 3
        })
      }
    }
  },
  methods:{
    bindGetUserInfo: function (e) {
      var that = this
      console.log(e.detail.userInfo)
      if (e.detail.userInfo) {
        // wx.redirectTo({
        //   url: '../userpage/userpage',
        // })
        app.getUserInfo(function (userInfo) {     //调用app.js中的函数来更新用户数据，并且后端要确认用户登录
          that.setData({    //更新数据
            userInfo: userInfo,
            isAuthorized:true
          })
        })
      } else {
        //用户按了拒绝按钮
      }
    }
  }
})
