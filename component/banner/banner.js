// component/banner/banner.js
require('../../app.js')
const app = getApp()

Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // isMarginFlag,两侧是否留边距
    isMarginFlag: {
      type: Boolean,
      value: true,
    },
    // banner列表
    bannerList: {
      type: Array,
      value: []
    },
    // banner类型
    bannerType: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 轮播点儿下标
    swiperCurrent: 0,
    // 投诉类别列表
    typeList: app.globalData.typeList,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 修改轮播点儿
    swiperChange(e) {
      let self = this
      let { source, current } = e.detail
      if (source === 'autoplay' || source === 'touch') {
        self.setData({
          swiperCurrent: current
        })
      }
    },

    // 去banner详情
    toBannerDetail(e) {
      let self = this
      let { banner } = e.currentTarget.dataset
      let bannerType = self.data.bannerType
      if (bannerType === 'friendLink') {
        // 去友链，friendLink
        self.toFriendLink(banner)
      } else if (bannerType === 'autoModule') {
        // 去自定义功能区，autoModule
        self.toAutoModule(banner)
      } else if (!bannerType) {
        app.toBannerDetail(banner)
      }
    },

    // 去自定义功能区，autoModule
    toAutoModule(autoModule) {
      let self = this;
      let moduletype = autoModule.moduletype
      if (moduletype) {
        switch (moduletype) {
          case 2:
            // 电子会员
            wx.navigateTo({
              url: '/userInfo/pages/myCode/myCode',
            })
            break;
          case 3:
            // 分类选品
            wx.switchTab({
              url: '/pages/category/category',
            })
            break;
          case 4:
            // 购买记录
            wx.navigateTo({
              url: '/userInfo/pages/recordList/recordList',
            })
            break;
          case 6:
            // 扫码购
            wx.navigateTo({
              // url: '/scan/pages/scan/scan',
            })
            wx.switchTab({
              url: '/pages/scan/scan',
            })
            break;
          case 8:
            // 商品建议
            let typeList = self.data.typeList
            let type = 1
            wx.navigateTo({
              url: '/userInfo/pages/complaintList/complaintList?type=' + type + '&title=' + typeList[type],
            })
            break;
          case 10:
            // 我的订单
            wx.navigateTo({
              url: '/userInfo/pages/orderList/orderList?orderType=-2',
            })
            break;
          case 11:
            // 我的积分
            wx.navigateTo({
              url: '/userInfo/pages/balance/balance?type=score',
            })
            break;
          // case 12:
          //   // 直接录入
          //   break;

          // case 13:
          //   // 周边看看
          //   wx.navigateTo({
          //     url: '/autoModule/pages/nearby/nearby',
          //   })
          //   break;
          case 15:
            // 领券中心
            wx.navigateTo({
              url: '/autoModule/pages/tickList/tickList?from=auto',
            })
            break;
          case 16:
            // 购物评价
            wx.navigateTo({
              url: '/autoModule/pages/buyGoodsList/buyGoodsList',
            })
            break;
          case 17:
            // 我的余额
            wx.navigateTo({
              url: '/userInfo/pages/balance/balance?type=balance',
            })
            break;
          case 18:
            // 我的电子券
            wx.navigateTo({
              url: '/autoModule/pages/tickList/tickList?from=userInfo',
            })
            break;
          case 19:
            // 积分抽奖
            wx.navigateTo({
              url: '/autoModule/pages/lottery/lottery',
            })
            break;
          case 20:
            // 在线充值
            wx.navigateTo({
              url: '/autoModule/pages/recharge/recharge',
            })
            break;
          case 14:
            // 限时秒杀
            wx.navigateTo({
              url: '/shopping/pages/goodsList/goodsList?panicBuy=' + 'panicBuy' + '&title=' + autoModule.modulename + '&promotemode=101'
            })
            break;
          case 7:
            // 特价商品
            wx.navigateTo({
              url: '/shopping/pages/goodsList/goodsList?Datatype=' + '1' + '&title=' + autoModule.modulename,
            })
            break;
          case 5:
            // 会员特价
            wx.navigateTo({
              url: '/shopping/pages/goodsList/goodsList?Datatype=' + '2' + '&title=' + autoModule.modulename,
            })
            break;
          case 9:
            // 推荐商品
            wx.navigateTo({
              url: '/shopping/pages/goodsList/goodsList?Datatype=' + '3' + '&title=' + autoModule.modulename,
            })
            break;
          // case 1:
          //   // 常购商品
          //   wx.navigateTo({
          //     url: '/shopping/pages/goodsList/goodsList?Datatype=' + '4' + '&title=' + autoModule.modulename,
          //   })
          //   break;
          case 21:
            // 门店优选（多分类）
            wx.navigateTo({
              url: '/shopping/pages/goodsList/goodsList?Datatype=' + '6' + '&title=' + autoModule.modulename + '&Classid=' + autoModule.Classid,
            })
            break;
          case 22:
            // 单分类/集群
            wx.navigateTo({
              url: '/shopping/pages/goodsList/goodsList?Cateid=' + autoModule.Classid + '&title=' + autoModule.modulename
            })
            break;
          case 23:
            // 签到
            wx.navigateTo({
              url: '/autoModule/pages/signIn/signIn',
            })
            break;
          default:
        }
      }
    },

    // 去友链，friendLink
    toFriendLink(friendLink) {
      let self = this
      let sitetype = friendLink.sitetype
      switch (sitetype) {
        // 跳转小程序
        case 1:
          wx.navigateToMiniProgram({
            appId: friendLink.appId,
            path: friendLink.sitedescribe,
            extraData: '',
            envVersion: '',
            success(res) { },
            fail(res) { },
          })
          break
        // 跳转H5
        case 2:
          app.globalData.friendLink = friendLink
          wx.navigateTo({
            url: '/friendLink/pages/h5/h5'
          })
          break
        // 跳转App
        case 3:
          return false
          app.globalData.friendLink = friendLink
          wx.navigateTo({
            url: '/links/pages/app/app'
          })
          break
        // 其他（做为副banner）
        case 4:
          break
        default:
      }
    },

    // 预览图片
    preview() {
      let self = this
      let bannerList = self.data.bannerList
      let list = []
      bannerList.forEach(item => list.push(self.data.baseUrl + item))
      wx.previewImage({
        urls: list,
        current: list[self.data.swiperCurrent],
      })
    },
  }
})
