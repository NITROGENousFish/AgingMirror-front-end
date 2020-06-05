// album/album.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  data: {
    hiddenmodalput: true,    //标识设置相册的弹出框是否弹出，true为不弹出，false为弹出
    template_array: null,
    newAlbumName: null,
    newAlbumVisiblity: true,

  },

  lifetimes: {
    attached: function () {
      console.log("刷新界面")
    }
  },
  pageLifetimes: {
    show: function () {
      var that = this
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
      var currentkey = null
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
          nickname: app.globalData['userInfo']['nickName']
        },
        success: function (res) {
          console.log("已经回到主菜单，加载中")
          console.log(res)
          that.setData({
            template_array: res.data
          })
        }
      })
      console.log("刷新列表完成")
    },
    hide: function () {
    },
  },
  methods: {
    onClickTemplate: function (e) {
      //点击跳转时，传递相册参数，album.wxml中wx.for有data-index="{{index}}"一项用于判定
      var index = parseInt(e.currentTarget.dataset.index);
      wx.navigateTo({
        url: '../albumdetail/albumdetail?albumname=' + this.data.template_array[index].albumname,
        success: function (res) {
          console.log("navigateTo success")
        },
        fail: function (res) {
          console.log("navigateTo fail")
        },
        complete: function (res) {
          console.log("navigateTo complete")
        }
      }),
        console.log("aaaaa")
    },


    //修改弹窗可见性
    //内部函数，界面控制
    onClickSwitchHiddenVisability: function () {
      this.setData({
        hiddenmodalput: !this.data.hiddenmodalput
      })
    },
    //创建相册表单中的选项值
    //内部函数，输入获取
    newAlbumVisiblityChange: function (e) {
      var after = e.detail.value === 'true';
      this.setData({
        newAlbumVisiblity: after
      })
    },
    //创建相册表单中的相册名称
    //内部函数，输入获取
    newAlbumNameChange: function (e) {
      this.setData({
        newAlbumName: e.detail.value
      })
    },
    uploadAlbumInfo: function (e) {
      var that = this
      //获取对应的输入状态：newAlbumVisiblityChange，在失去文本框失去焦点的时候获得输入；newAlbumNameChange，在改变选项时获得选择
      var in_newAlbumName = that.data.newAlbumName
      var in_newAlbumVisiblity = that.data.newAlbumVisiblity
      // this.data.template_array.lenth
      //上传到服务器同步设置
      //设置python接受的时间格式："%Y-%m-%d %H:%M:%S"
      var current_date = new Date()
      var time_for_python = new String(current_date.getFullYear() + "-" + current_date.getMonth() + "-" + current_date.getDate() + " " + current_date.getHours() + ":" + current_date.getMinutes() + ":" + current_date.getSeconds())
      var currentkey = null
      wx.getStorage({//获取本地缓存
        key: "secretkey",
        success: function (res) {
          currentkey = res.data
        },
      })
      var user_nickname = app.globalData.userInfo.nickName
      var newAlbumName_tonextpage = that.data.newAlbumName

      //向服务器请求添加数据，携带用户当前的key作为验证

      wx.request({
        url: 'http://127.0.0.1:8000/faceaging/album',
        header: { "Content-Type": "application/x-www-form-urlencoded", "HTTP_SKEY": currentkey },
        data: {
          albumname: that.data.newAlbumName,
          visibility: that.data.newAlbumVisiblity,
          createtime: time_for_python,
          nickname: user_nickname
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 400) {
            wx.showToast({
              title: '创建相册失败\n名称不得重复',
              
              icon: 'none'
            })
          }
          else {
            console.log("uploadAlbumInfo complete")
            //初始化下一次添加的数值,并且关闭窗口
            console.log("uploadAlbumInfo success")
            that.setData({
              hiddenmodalput: !that.data.hiddenmodalput
            })
            //弹窗提示用户创建成功
            wx.showToast({
              title: '相册创建成功',
              duration:2000,
              success: function () {
                //刷新界面进入新的相册,传递相册名称参数
                wx.navigateTo({
                  url: '../albumdetail/albumdetail?albumname=' + newAlbumName_tonextpage,
                })
              }
            })
          }
        }
      })
    },
  }
})
