App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null  //用户数据为空
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {                             //如果有用户数据
      console.log("this.globalData.userInfo , run function")
      typeof cb == "function" && cb(this.globalData.userInfo)   //判断，如果传入的参数cb是一个函数，那么就执行&&后面的指令，否则不执行
    } else {                                                    //用户尚未登录，需要重新登录
      console.log("no this.globalData.userInfo, wx.login")
      //调用登录接口
      var currentkey=null
      wx.getStorage({//获取本地缓存
        key: "secretkey",
        success: function (res) {
          currentkey = res.data
        },
        fail:function(res){
          currentkey = null
        }
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            console.log("wx.request")
            wx.request({
              url: 'http://127.0.0.1:8000/faceaging/onLogin',
              data: {
                code: res.code
              },
              //设置header信息
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                "HTTP_SKEY": currentkey
              },

              //请求方式
              method: 'POST',

              //收到数据json处理
              dataType: 'json',

              //成功之后回调
              success: function (res) {
                console.log("request success, server secretkey:" + res.secretkey)
                wx.setStorage({
                  key: 'secretkey',
                  data: 'res.secretkey',
                  success: function(res){
                    console.log("login Secretkey save success")
                  },
                  fail: function(res){
                    console.log("login Secretkey save fail")
                  },
                  complete: function (res) {
                    console.log("login Secretkey save complete")
                  }
                })
                //存储secretkey
              },

              //失败回调
              fail: function (err) {
                console.log("request fail:" + err)
              },

              //结束回调
              complete: function (err) {
                console.log("request complete:" + err)
              }

              
            })

            //检测当前用户登录态是否有效
            wx.checkSession({
              success: function () {
                console.log("session 未过期，并且在本生命周期一直有效")
              },
              fail: function () {
                console.log("登录态过期-重新登录")
                wx.login()
              }
            })
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)   //判断，如果传入的参数cb是一个函数，那么就执行&&后面的指令，否则不执行
              }
            })

          } else {
            console.log('登录失败！' + res.errMsg)
          }

        }
      })
    }
  },
  
})
