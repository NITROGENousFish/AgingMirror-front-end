// pages/agedetection/agedetection.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhotoUpLoad: false,
    isPhotoBack: false,
    photoUpLoad_local_url:"",
    photoUpLoad_server_url: "",
    nickname: "",
    total_pic :"",
    people_in_pic : 0,
    pic_base64: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      nickname: app.globalData.userInfo.nickName,
    })
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
  upload1pic: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var local_path = res.tempFilePaths[0]
        //列表中更新上传图片  
        that.setData({
          photoUpLoad_local_url: res.tempFilePaths[0]
        })
        wx.showLoading({
          title: '正在上传图片…',
        })
        wx.uploadFile({
          url: app.globalData['_ServerURLPrefix'] + '/faceaging/agedetection',
          header: { "Content-Type": "application/x-www-form-urlencoded" }, //身份校验
          filePath: res.tempFilePaths[0],
          name: 'agedetection',
          formData: {
            nickname: app.globalData['userInfo']['nickName'],
            pic: 0
          },
          success: (res) => {
            var photoUpLoad = that.data.isPhotoUpLoad
            photoUpLoad = local_path
            var res_out = JSON.parse(res.data)
            that.setData({
              isPhotoUpLoad: photoUpLoad,
              photoUpLoad_server_url: res_out['serverUrl']
            })
          },
          fail: (res) => {
            console.log();
          },
          complete: () => {
            wx.hideLoading()
            that.onLoad()
          }
        });
      }
    });
  },

  startCompare: function () {
    wx.showLoading({
      title: '正在检测年龄…',
    })
    var that = this
    wx.request({
      url: app.globalData['_ServerURLPrefix'] + '/faceaging/agedetection',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        image1path: that.data.photoUpLoad_server_url,
        nickname: app.globalData['userInfo']['nickName']
      },

      success: function (res) {
        wx.hideLoading()
        if (res.statusCode == 400) {
          wx.showToast({
            title: '年龄检测服务器\n暂未工作',
            icon: "none",
          })
        } else {
          var data = JSON.parse(res.data)

          that.setData({
            isPhotoBack: true,
            total_pic: data["overall-array"][0],
            people_in_pic : data["overall-array"][1],
            pic_base64: data["content-array"]
          })
        }
      }
    })
  }

})