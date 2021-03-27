// shopping/pages/goodsDetail/goodsDetail.js
const app = getApp()
import toast from '../../../utils/toast'
import utils from '../../../utils/util'
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 商品id
    Gdscode: '',
    // EType,评论类型（0全部，好评1，中评2，差评3）
    EType: 0,
    // title
    title: '',
    // 会员类型，1：批发；2：普通
    Utype: 2,
    // 商品详情
    goodsDetail: '',
    // evaluation 好评率
    evaluation: 100,
    // 富文本
    describe: '',
    // 轮播点儿下标
    swiperCurrent: 0,
    // 评价列表
    commentList: [],
    // 购物车数量
    cartCount: 0,
    // 加购物车弹框显示开关
    dialogFlag: false,
    // 商品活动类别号码，用于获取商品拼团/砍价活动信息
    promotemode: 0,
    // 我的拼团/砍价号
    groupno: '',
    // 我的拼团/砍价信息
    groupDetail: '',
    // 拼团/砍价列表
    groupList: [],
    // 砍价成功标标识,默认0：不成功；1：成功
    pay: 0,
    // 拼团/砍价人数
    groupnum: 9999,
    // 参与弹窗显示开关
    joinDialogFlag: false,
    // 我的参与号
    joinno: '',
    // 参与号
    pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}],
    // focusFlag input框获取焦点开关
    focusFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      deptname: options.deptname,
      deptcode: options.deptcode,
      Gdscode: options.Gdscode,
      title: options.title,
      promotemode: Number(options.promotemode || 0),
      scene: options,
    })
    // 从分享进来时设置门店信息
    app.globalData.deptname = self.data.deptname
    app.globalData.deptcode = self.data.deptcode
    // 设置title
    wx.setNavigationBarTitle({
      title: self.data.title,
    })
    // 获取商品详情
    self.getGoodsDetail()
    // 获取商品评价列表
    self.getGoodsCommentList()
    // 判断有活动时请求
    if (self.data.promotemode) {
      // 获取我的拼团/砍价信息
      self.getGroupDetail()
      // 获取拼团/砍价列表
      self.getGroupList()
    }
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
    let self = this
    // 更新购物车数量
    self.getCartCount()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
    // 弹窗关闭
    self.dialogClose()
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
    let self = this
    // 获取商品详情
    self.getGoodsDetail()
    // 获取商品评价列表
    self.getGoodsCommentList()
    // 判断有活动时请求
    if (self.data.promotemode) {
      // 获取我的拼团/砍价信息
      self.getGroupDetail()
      // 获取拼团/砍价列表
      self.getGroupList()
    }
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
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
    let self = this
    return {
      title: self.data.title,
      path: '/shopping/pages/goodsDetail/goodsDetail?Gdscode=' + self.data.Gdscode + '&promotemode=' + self.data.promotemode + '&title=' + self.data.title + '&deptname=' + self.data.deptname + '&deptcode=' + self.data.deptcode
    }
  },

  // 获取商品详情
  getGoodsDetail () {
    let self = this
    let data = {
      Gdscode: self.data.Gdscode,
      Utype: self.data.Utype,
      Deptcode: self.data.deptcode
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    API.info.getProductDetails(data).then(result => {
      wx.hideLoading()
      let res = result.data
      if (res.flag === 1) {
        let goodsDetail = res.data
        // 数量保留两位小数
        goodsDetail.cumulativesales = (goodsDetail.cumulativesales || 0).toFixed(2)
        goodsDetail.deptstock = (goodsDetail.deptstock || 0).toFixed(2)
        // 设置评价相关
        let EvaluationGC = ''
        let EvaluationTC = ''
        let evaluation = ''
        if (res.data) {
          EvaluationGC = res.data.EvaluationGC
          EvaluationTC = res.data.EvaluationTC
          evaluation = (((EvaluationGC / EvaluationTC) || 1) * 100).toFixed(2)
        }
        self.setData({
          goodsDetail: goodsDetail,
          evaluation: evaluation,
        })
        app.globalData.goodsDetail = goodsDetail
        // 渲染富文本内容
        self.setDescribe()
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 渲染富文本内容
  setDescribe () {
    let self = this
    let describe = self.data.goodsDetail.describe || ''
    let baseUrl = self.data.baseUrl
    if (describe) {
      describe = describe.replace(/upload\/images/g, (baseUrl + 'upload/images')).replace(/\<img/g, '<img style="max-width:100%;height:auto;display:block;float:left;margin: 0 auto"')
    }
    self.setData({
      describe: describe
    })
  },

  // 获取商品评价列表
  getGoodsCommentList () {
    let self = this
    let data = {
      gdscode: self.data.Gdscode,
      EType: self.data.EType,
    }
    API.bill.getProductEvaluation(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data.length) {
          self.setData({
            commentList: res.data.slice(0,3)
          })
        }
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 获取拼团/砍价信息
  getGroupDetail () {
    let self = this
    let promotemode = self.data.promotemode
    let data = {
      goodscode: self.data.Gdscode,
      amount: 1,
    }
    // 页面加载获取顾客商品拼团信息
    if (promotemode === 100) {
      API.info.groupIncrease(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (res.data && res.data.temlist.length) {
            self.setData({
              groupno: res.data.groupno,
              groupDetail: res.data.temlist.reverse(),
            })
          }
        }
      }).catch(error => {
        toast(error.error)
      })
    }
    // 页面加载获取顾客商品的砍价信息
    if (promotemode === 102) {
      API.info.generateHackBill(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (res.data && res.data.list.length) {
            self.setData({
              groupno: res.data.list[0].groupno,
              groupDetail: res.data.list.reverse(),
              pay: res.data.pay,
              flag: res.data.flag,
            })
          }
        }
      }).catch(error => {
        toast(error.error)
      })
    }
  },

  // 获取拼团/砍价列表
  getGroupList () {
    let self = this
    let promotemode = self.data.promotemode
    let data = {
      goodscode: self.data.Gdscode,
      amount: 1,
    }
    // 页面加载获取拼团列表
    if (promotemode === 100) {
      API.info.getGroupList(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (res.data) {
            self.setData({
              groupList: res.data,
            })
          }
        }
      }).catch(error => {
        toast(error.error)
      })
    }
    // 页面加载获取砍价列表
    if (promotemode === 102) {
      API.info.getHackList(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          if (res.data) {
            self.setData({
              groupList: res.data,
            })
          }
        }
      }).catch(error => {
        toast(error.error)
      })
    }
  },

  // 发起砍价
  hackAdd () {
    let self = this
    let data = {
      goodscode: self.data.Gdscode,
      amount: 1,
    }
    API.info.hackAdd(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 获取拼团/砍价信息
        self.getGroupDetail()
      }
      toast(res.message)
    }).catch(error => {
      toast(error.error)
    })
  },

  // 设置参与弹窗显示开关
  setJoinDialogFlag () {
    let self = this
    let joinDialogFlag = self.data.joinDialogFlag
    if (!joinDialogFlag) {
      self.setData({
        joinno: '',
        pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}],
      })
    }
    self.setData({
      joinDialogFlag: !joinDialogFlag,
    })
  },

  // input框获取焦点
  focusInput () {
    let self = this
    self.setData({
      focusFlag: !self.data.focusFlag,
    })
  },

  // 设置参与号
  setJoinno (e) {
    let self = this
    let _password = e.detail.value
    self.setData({
      joinno: _password,
    })
    _password = _password.split('')
    if (_password.length) {
      let pd = self.data.pd
      for (let i = 0; i < 4; i++) {
        if (_password[i]) {
          pd[i].password = _password[i]
          self.setData({
            pd: pd
          })
        } else {
          pd[i].password = ''
          self.setData({
            pd: pd
          })
        }
      }
    } else {
      self.setData({
        pd: [{password: ''}, {password: ''}, {password: ''}, {password: ''}],
      })
    }
  },

  // 我要参与
  join (e) {
    let self = this
    let joinno = self.data.joinno
    let goodsDetail = self.data.goodsDetail
    let data = {
      goodscode: self.data.Gdscode,
      amount: 1,
      groupno: self.data.joinno,
    }
    // 验证活动号输入
    if (joinno.length < 4) {
      toast('请输入活动号')
      return false
    }
    // 参与拼团
    if (goodsDetail.promotemode === 100) {
      // 验证团号是否可用
      self.checkJoinno(e)
    }
    // 参与砍价
    if (goodsDetail.promotemode === 102) {
      API.info.hackIncrease(data).then(result => {
        let res = result.data
        if (res.flag === 1) {
          // 设置参与弹窗显示开关
          self.setJoinDialogFlag()
        }
        toast(res.message)
      }).catch(error => {
        toast(error.error)
      })
    }
  },

  // 验证团号是否可用
  checkJoinno (e) {
    let self = this
    let data = {
      goodscode: self.data.Gdscode,
      amount: 1,
      groupno: self.data.joinno,
    }
    API.info.getGroupInfo(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        // 添加购物车/立即购买(包括发起拼团、参与拼团)
        self.add(e)
        // 设置参与弹窗显示开关
        self.setJoinDialogFlag()
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 添加购物车/立即购买(包括发起拼团、参与拼团、砍价成功购买)
  add (e) {
    console.log(0)
    let self = this
    let goods = self.data.goodsDetail
    let orderTypeList = app.globalData.orderTypeList
    goods.Defaultimage = goods.image
    goods.Highpprice = goods.preferential
    goods.Highoprice = goods.originalcost
    goods.Gdscode = goods.gdscode
    goods.addType = e.currentTarget.dataset.addtype
    goods.orderType = Number(e.currentTarget.dataset.ordertype || 2)
    goods.groupno = self.data.groupno
    console.log(goods, 'goods')
    if (goods.addType === 'buyEnd') { // 立即购买时(包括发起拼团、参与拼团、砍价成功购买)
      let orderType = ''
      orderTypeList.forEach(item => {
        if (item.promotemode === goods.promotemode && item.orderType === goods.orderType) {
          orderType = item
        }
      })
      if (orderType) {
        goods.otc = orderType.otc
        goods.isotc = orderType.isotc
        goods.orderType = orderType.orderType
        if (orderType.orderType === 4) {
          goods.groupno = self.data.joinno
        }
      } else {
        goods.otc = 'now'
        goods.isotc = ''
      }
      console.log(goods, 'buyend')
    } else if (goods.addType === 'addCart') { // 添加购物车
      goods.otc = ''
      goods.isotc = ''
      console.log(goods, 'addcart')
    }
    if (goods.promotemode === 100 || goods.promotemode === 102) { // 拼团、砍价默认一份
      goods.amount = 1
      // 调用子组件方法
      self.componentAdd(goods)
    } else {
      // 调用数量/重量弹窗
      self.setData({
        dialogFlag: true,
        goods: goods,
      })
    }
  },

  // 调用子组件方法
  componentAdd (goods) {
    console.log(2)
    let self = this
    let addCart = self.selectComponent('#addCart')
    let buyEnd = self.selectComponent('#buyEnd')
    self.setData({
      goodsDetail: goods
    })
    // 调用子组件，传入商品信息
    if (goods.addType === 'addCart') {
      console.log(3)
      addCart.addCart(goods)
    } else if (goods.addType === 'buyEnd') {
      console.log(4)
      buyEnd.toBuyEnd(goods)
    }
  },

  // 弹窗关闭
  dialogClose () {
    let self = this
    self.setData({
      dialogFlag: false,
      goods: '',
    })
  },

  // 弹窗确认
  dialogConfirm (goods) {
    console.log(1)
    let self = this
    // 调用子组件方法
    self.componentAdd(goods.detail)
    self.dialogClose()
  },

  // 手指触摸后移动(阻止冒泡)
  catchTouchMove (res) {
    return false
  },

  // 更新购物车数量
  getCartCount () {
    let self = this
    let data = {}
    API.bill.getCarProductCount(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        if (res.data) {
          self.setData({
            cartCount: res.data.data || 0
          })
        }
      }
    }).catch(error => {
      toast(error.error)
    })
  },
})
