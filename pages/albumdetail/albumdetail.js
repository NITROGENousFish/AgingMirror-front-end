// pages/albumdetail/albumdetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral_layout_state: true,   // 平铺还是详细模式
    page_header:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var albumname = options.albumname
    var currentkey = null
    console.log("加载相册详细界面", albumname)
    wx.getStorage({//获取本地缓存
      key: "secretkey",
      success: function (res) {
        currentkey = res.data
      },
      fail: function (res) {
        currentkey = null
      }
    })
    wx.request({
      url: 'http://127.0.0.1:8000/faceaging/album',
      header: { "Content-Type": "application/x-www-form-urlencoded", "HTTP_SKEY": currentkey },
      method: 'GET',
      data: {
        nickname: app.globalData['userInfo']['nickName'],
        albumname: albumname
      },
      success: function (res) {
        console.log("相册头部详细信息加载完成")
        that.setData({
          page_header: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  integralOn: function() {
    this.setData({
      integral_layout_state: true
    })
  },

  layoutOn: function() {
    this.setData({
      integral_layout_state: false
    })
  }
})