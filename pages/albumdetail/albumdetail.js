// pages/albumdetail/albumdetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pic_ip_prefix:"",
    integral_layout_state: true,   // 平铺还是详细模式
    page_header:{},
    albumdetail_full_data:[],    
    layoutList: [],
    hiddenmodalput: true,    //标识设置相册的弹出框是否弹出，true为不弹出，false为弹出
    template_array: null,
    newPicLogInfo: "",
    userAvator:null,
    usernickname:null,
    albumname:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      pic_ip_prefix: app.globalData['_ServerURLPrefix'],
      userAvator: app.globalData.userInfo.avatarUrl,
      usernickname: app.globalData.userInfo.nickName,
    })
    var albumname = options.albumname
    that.setData({
      albumname: albumname
    })
    console.log("加载相册详细界面", albumname)
    //////////////////////////////
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
    // 获取相册标题照片可见性
    wx.request({
      url: app.globalData['_ServerURLPrefix']+'/faceaging/album',
      header: { "Content-Type": "application/x-www-form-urlencoded", "HTTP_SKEY": currentkey },//////
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
        if(that.data.page_header.totalsum !=0 ){ 
        // 获取相册图片发送时间，文本内容，图片URL集合
        wx.request({
          url: app.globalData['_ServerURLPrefix'] + '/faceaging/albumdetail',
          header: { "Content-Type": "application/x-www-form-urlencoded", "HTTP_SKEY": currentkey },//////
          method: 'GET',
          data: {
            nickname: app.globalData['userInfo']['nickName'],
            albumname: albumname
          },
          success: function (res) {
            console.log("获取到当前相册的图片内容和详细信息")
            that.setData({
              albumdetail_full_data: res.data
            })
            // 将URL数组转化为平铺形式
            //首先通过照片总数，确定平铺数组行列数量
            var totalsum = that.data.page_header.totalsum
            var row = (totalsum - (totalsum % 3)) / 3 + 1
            var outarr = new Array(row) //进一步处理的数组
            for (var i = 0; i < outarr.length; i++) {
              outarr[i] = (new Array(3)).fill("");
            }


            //遍历得到的内容，填充数组
            let totalcounter = 0
            for (var i = 0; i < res.data.length; i++) {          
              for (var j = 0; j < res.data[i].url_list.length; j++) {
                let rrow = (totalcounter - (totalcounter % 3)) / 3
                let column = totalcounter % 3
                outarr[rrow][column] = res.data[i].url_list[j]
                totalcounter += 1
              }
            }
            //保存数据
            that.setData({
              layoutList: outarr
            })

          }
        })
        }
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
  },
      // 进入预览模式
  enterPreviewMode(e) {
    var current = e.target.dataset.src;
    console.log(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current], //需要预览的图片http链接列表 
      success:function(res){
        console.log("预览图片成功")
      }
    })
  },
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //修改弹窗可见性
  //内部函数，界面控制
  onClickSwitchHiddenVisability: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //获取输入内容
  newPicLogInfoChange: function (e) {
    this.setData({
      newPicLogInfo: e.detail.value
    })
  },
  chooseImage() { //  选取并上传多组图片
    var that = this
    that.setData({
      hiddenmodalput: !that.data.hiddenmodalput
    })
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showLoading({
          title: '正在上传图片…',
        })

        // 上传多组图片的逻辑,递归实现
        function innerUpload(data){
          var innerthat = this
          var i = data.i ? data.i : 0//当前上传的哪张图片
          var success = data.success ? data.success : 0//上传成功的个数
          var fail = data.fail ? data.fail : 0//上传失败的个数
          var currentkey = null
          wx.getStorage({//获取本地缓存key
            key: "secretkey",
            success: function (res) {
              currentkey = res.data
            },
            fail: function (res) {
              currentkey = null
            }
          })
          wx.uploadFile({
            url: app.globalData['_ServerURLPrefix'] +'/faceaging/albumdetail',
            header: { "Content-Type": "application/x-www-form-urlencoded", "HTTP_SKEY": currentkey }, //身份校验
            filePath: data.path[i],
            name: 'albumdetail',
            formData:{
              nickname: app.globalData['userInfo']['nickName'],
              albumname: that.data.page_header.albumname,
              createtime:data.createtime,
              upload_content: that.data.newPicLogInfo
            },
            success: (res) => {
              success++;//图片上传成功，图片上传成功的变量+1
              console.log(res)
              console.log(i);
              //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
            },
            fail: (res) => {
              fail++;//图片上传失败，图片上传失败的变量+1
              console.log('fail:' + i + "Total fail:" + fail);
            },
            complete: () => {
              console.log(i);
              i++;//这个图片执行完上传后，开始上传下一张
              if (i == data.path.length) {   //当图片传完时，停止调用          
                console.log('执行完毕');
                console.log('成功：' + success + " 失败：" + fail);
                wx.hideLoading()
                that.setData({
                  newPicLogInfo: ""
                })
                wx.redirectTo({
                  url: '../albumdetail/albumdetail?albumname=' + that.data.page_header.albumname,
                })
              } else {//若图片还没有传完，则继续调用函数
                console.log("继续上传图片：",i);
                data.i = i;
                data.success = success;
                data.fail = fail;
                innerUpload(data);
              }
            }
          });
        }
        //设置python接受的时间格式："%Y-%m-%d %H:%M:%S"
        var current_date = new Date()
        var time_for_python = JSON.stringify(current_date.getFullYear() + "-" + current_date.getMonth() + "-" + current_date.getDate() + " " + current_date.getHours() + ":" + current_date.getMinutes() + ":" + current_date.getSeconds())
        console.log(current_date.getMonth())
        innerUpload({
          path: res.tempFilePaths,
          createtime: time_for_python,
        })
      },
    });
  },


  albumStatusSetting(){
    var that = this
    wx.showActionSheet({
      itemList: ['删除相册'],
      itemColor: '#DC143C',
      success(res) {
        if(res.tapIndex == 0){  //删除相册
          wx.showModal({
            title: '删除相册',
            content: '确定要删除该相册？',
            showCancel: true,//是否显示取消按钮
            cancelColor: '#DC143C',//取消文字的颜色
            confirmColor: '#000000' ,//确定文字的颜色
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
              } else {
                //点击确定
                //向服务器发送删除相册请求
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
                  url: app.globalData['_ServerURLPrefix'] + '/faceaging/album',
                  header: { "Content-Type": "application/x-www-form-urlencoded", "HTTP_SKEY": currentkey },
                  method: 'DELETE',
                  data: {
                    nickname: app.globalData['userInfo']['nickName'],
                    albumname: that.data.albumname,
                  },
                  success: function (res) {
                    console.log("删除相册成功")
                    console.log(res)
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) {},//接口调用结束的回调函数（调用成功、失败都会执行）
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  albumContentSetting(e) {
    var that = this
    console.log(e)
    var iiiindex = parseInt(e.currentTarget.dataset.index)
    wx.showActionSheet({
      itemList: ['删除记录'],
      itemColor: '#DC143C',
      success(res) {
        if (res.tapIndex == 0) {  //删除相册
          wx.showModal({
            title: '删除记录',
            content: '确定要删除该记录？',
            showCancel: true,//是否显示取消按钮
            cancelColor: '#DC143C',//取消文字的颜色
            confirmColor: '#000000',//确定文字的颜色
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
              } else {
                //点击确定
                //向服务器发送删除相册请求
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
                  url: app.globalData['_ServerURLPrefix'] + '/faceaging/albumdetail',
                  header: { "Content-Type": "application/x-www-form-urlencoded", "HTTP_SKEY": currentkey },
                  method: 'DELETE',
                  data: {
                    nickname: app.globalData['userInfo']['nickName'],
                    albumname: that.data.albumname,
                    createtime: that.data.albumdetail_full_data[iiiindex]['createtime']
                  },
                  success: function (res) {
                    console.log("删除记录成功")
                    console.log(res)
                    wx.redirectTo({
                      url: '../albumdetail/albumdetail?albumname=' + that.data.page_header.albumname,
                    })
                  }
                })
              }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
})