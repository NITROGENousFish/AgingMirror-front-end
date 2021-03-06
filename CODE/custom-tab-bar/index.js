Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/image/house.png",
      selectedIconPath: "/image/house_HL.png",
      text: "主页"
    }, {
      pagePath: "/pages/toolbox/toolbox",
      iconPath: "/image/box.png",
      selectedIconPath: "/image/box_HL.png",
      text: "功能"
    }, {
      pagePath: "/pages/album/album",
      iconPath: "/image/image.png",
      selectedIconPath: "/image/image_HL.png",
      text: "相册"
    }, {
      pagePath: "/pages/userpage/userpage",
      iconPath: "/image/user.png",
      selectedIconPath: "/image/user_HL.png",
      text: "用户"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})