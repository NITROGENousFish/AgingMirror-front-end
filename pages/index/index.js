const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：')
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')
  },
  goAboutusPage: function () {
    wx.showToast({
      title: '',
    })
  },

})
Component({
  data:{
    people_list:[]
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },

  methods:{
    getPicUpload: function(){
      var that = this
      wx.chooseImage({
        count:1,
        sourceType:['album'],
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          //开始请稍后图标
          wx.showLoading({
            title: '正在全力搜索',
          })
          console.log("正在上传图片")
          wx.uploadFile({
            url: app.globalData['_ServerURLPrefix'] +'/faceaging/findlostpeople',
            filePath: tempFilePaths[0],
            name: 'portrait',
            success: function(res){
              console.log("上传图片成功")
              //结束请稍后图标
              wx.hideLoading()
              //展示收到的返回消息
              var jsoncontent = JSON.parse(res.data)
              if(jsoncontent.status){
                // 在当前界面存储
                // that.setData({
                //   people_list: jsoncontent.datalist
                // })
                wx.navigateTo({
                  url: '../indexdetail/indexdetail?people_list=' + JSON.stringify(jsoncontent.datalist),
                })
              }
              else{
                //提示查找失败
                console.log("fail")
                wx.showToast({
                  title: '很遗憾没有找到任何内容\n请上传一张正确的人脸',
                  duration: 3000,
                  icon: 'none'
                })
              }

            },
            fail: function (res) {
              console.log("上传图片失败")
            },
            complete: function (res) {
              console.log("上传图片结束")
            }
          })

        },

      })
    }
  }
})
