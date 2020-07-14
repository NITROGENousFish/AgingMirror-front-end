// pages/crossagecompare/crossagecompare.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhotoUpLoad: [false, false],
    isPhotoBack: false,
    photoUpLoad_local_url: ["",""],
    photoUpLoad_server_url: ["", ""],
    nickname:"",
    pic_1_base64:"",
    pic_2_base64:"",
    rate:""
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
  upload1pic: function(){
      var that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          var local_path = res.tempFilePaths[0]
          //列表中更新上传图片
          var _photoUpLoad_local_url = that.data.photoUpLoad_local_url
          _photoUpLoad_local_url[0] = res.tempFilePaths[0]
          that.setData({
            photoUpLoad_local_url: _photoUpLoad_local_url
          })
          wx.showLoading({
            title: '正在上传图片…',
          })
        wx.uploadFile({
          url: app.globalData['_ServerURLPrefix'] + '/faceaging/crossagecomparation',
              header: { "Content-Type": "application/x-www-form-urlencoded" }, //身份校验
              filePath: res.tempFilePaths[0],
              name: 'crossagecomparation',
              formData: {
                nickname: app.globalData['userInfo']['nickName'],
                pic:0
              },
              success: (res) => {
                var photoUpLoad = that.data.isPhotoUpLoad
                photoUpLoad[0] = local_path
                var res_out = JSON.parse(res.data)
                var _photoUpLoad_server_url = that.data.photoUpLoad_server_url
                _photoUpLoad_server_url[0] = res_out['serverUrl']


                that.setData({
                  isPhotoUpLoad: photoUpLoad,
                  photoUpLoad_server_url: _photoUpLoad_server_url
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

  upload2pic: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        //列表中更新上传图片
        var local_path = res.tempFilePaths[0]
        var _photoUpLoad_local_url = that.data.photoUpLoad_local_url
        _photoUpLoad_local_url[1] = res.tempFilePaths[0]
        that.setData({
          photoUpLoad_local_url: _photoUpLoad_local_url
        })
        wx.showLoading({
          title: '正在上传图片…',
        })
        wx.uploadFile({
          url: app.globalData['_ServerURLPrefix'] + '/faceaging/crossagecomparation',
          header: { "Content-Type": "application/x-www-form-urlencoded" }, //身份校验
          filePath: res.tempFilePaths[0],
          name: 'crossagecomparation',
          formData: {
            nickname: app.globalData['userInfo']['nickName'],
            pic: 1
          },
          success: (res) => {
            //图片2上传的POS变成
            var photoUpLoad = that.data.isPhotoUpLoad
            photoUpLoad[1] = local_path          
            var res_out = JSON.parse(res.data)
            var _photoUpLoad_server_url = that.data.photoUpLoad_server_url
            _photoUpLoad_server_url[1] = res_out['serverUrl']
            that.setData({
              isPhotoUpLoad: photoUpLoad,
              _photoUpLoad_server_url: _photoUpLoad_server_url
            })
          },
          fail: (res) => {
            console.log();
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    });
  },

  startCompare: function (){
    
    var that = this
    wx.request({
      url: app.globalData['_ServerURLPrefix'] + '/faceaging/crossagecomparation',
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      method: 'POST',
      data: {
        image0path: that.data.photoUpLoad_server_url[0],
        image1path: that.data.photoUpLoad_server_url[1],
      },
      
      success: function (res) {
        console.log(res.data)
        // console.log(data.url1)
        // var url1 = data.url1+""
        // url1 = 'data:image/png;base64,' + wx.arrayBufferToBase64((wx.base64ToArrayBuffer(url1))+"").replace(/[\r\n]/g, "")
        // var url2 = data.url2+""
        // url2 = 'data:image/png;base64,' + wx.arrayBufferToBase64(wx.base64ToArrayBuffer(url2).replace(/[\r\n]/g, ""))
        
        // var url1 = 'data:image/png;base64,' + wx.arrayBufferToBase64(res["url1"])
        // var url1 = data.url1.replace(/[\r\n]/g, '') // 将回车换行换为空字符''
        // var url2 = 'data:image/png;base64,' + wx.arrayBufferToBase64(res["url2"])
        // var url2 = data.url2.replace(/[\r\n]/g, '') // 将回车换行换为空字符''
        
        that.setData({
          isPhotoBack: true,
          pic_1_base64: res.data["url1"],
          pic_2_base64: res.data["url2"],
          rate: res.data["rate"]
        })
        
      }
    })
  }
})