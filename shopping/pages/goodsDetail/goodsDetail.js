// shopping/pages/goodsDetail/goodsDetail.js
const app = getApp()
const toast = require("../../../utils/toast")
import API from '../../../api/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    errorImage: app.globalData.errorImage,
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
    // 商品数量
    amount: 1,
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
    // 弹框组件显示开关
    dialogFlag: false,
    // 商品信息
    goods: '',
    // 画布对象
    canvas: '',
    // 绘图上下文
    ctx: '',
    // 绘图开关
    drawFlag: true,
    // 海报画布显示开关
    posterFlag: false,
    // 商品图信息
    goodsPic: '',
    // 商品小程序码图路径
    qrCodePicPath: 'upload/cluster/6/6.jpg',
    // 商品小程序码图信息
    qrCodePic: '',
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
      path: '/shopping/pages/goodsDetail/goodsDetail?Gdscode=' + self.data.Gdscode + '&title=' + self.data.title + '&deptname=' + self.data.deptname + '&deptcode=' + self.data.deptcode
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
      let res = result.data
      if (res.flag === 1) {
        let EvaluationGC = ''
        let EvaluationTC = ''
        let evaluation = ''
        if (res.data) {
          EvaluationGC = res.data.EvaluationGC
          EvaluationTC = res.data.EvaluationTC
          evaluation = (((EvaluationGC / EvaluationTC) || 1) * 100).toFixed(2)
        }
        self.setData({
          goodsDetail: res.data,
          evaluation: evaluation,
        })
        // 渲染富文本内容
        self.setDescribe()
      } else {
        toast.toast(res.message)
      }
      wx.hideLoading()
    }).catch(error => {
      toast.toast(error.error)
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
        toast.toast(res.message)
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },

  // 修改轮播点儿
  swiperChange (e) {
    let self = this
    if (e.detail.source === 'autoplay' || e.detail.source === 'touch') {
      self.setData({
        swiperCurrent: e.detail.current
      })
    }
  },

  // 添加购物车
  addCart (e) {
    let self = this
    let goods = self.data.goodsDetail
    goods.Highpprice = goods.preferential
    goods.Gdscode = goods.gdscode
    // 判断是否散称
    if (goods.scaleflag) {
      self.setData({
        dialogFlag: true,
        goods: goods,
      })
    } else {
      // 调用子组件添加购物车方法
      self.componentAddCart(goods)
    }
  },

  // 调用子组件添加购物车方法
  componentAddCart (goods) {
    let self = this
    let addcart = self.selectComponent('#addCart')
    // 调用子组件，传入商品信息添加购物车
    addcart.addCart(goods)
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
    let self = this
    // 判断是否立即购买
    if (goods.detail.otc === 'now') {
      // 去编辑订单页面
      self.toEditorOrder(goods.detail)
    } else {
      // 调用子组件添加购物车方法
      self.componentAddCart(goods.detail)
    }
    self.dialogClose()
  },

  // 立即购买
  buyend () {
    let self = this
    let goods = self.data.goodsDetail
    goods.Highpprice = goods.preferential
    goods.Gdscode = goods.gdscode
    goods.otc = 'now'
    // 判断是否散称
    if (goods.scaleflag) {
      self.setData({
        dialogFlag: true,
        goods: goods,
      })
    } else {
      // 去编辑订单页面
      self.toEditorOrder(goods)
    }
  },

  // 去编辑订单页面
  toEditorOrder (goods) {
    let self = this
    wx.navigateTo({
      url: '/shopping/pages/editorOrder/editorOrder?otc=now&goodscode=' + goods.gdscode + '&amount=' + (goods.count || self.data.amount)
    })
  },

  // 查找画布
  queryCanvas () {
    let self = this
    const query = wx.createSelectorQuery()
    if (!self.data.drawFlag) {
      self.setData({
        posterFlag: true,
      })
      return
    }
    query.select('#posterCanvas').fields({
      node: true,
      size: true
    }).exec(res => {
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      // 新接口需显示设置画布宽高
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)
      self.setData({
        canvas: canvas,
        ctx: ctx
      })
      // 设置海报绘制基础参数
      self.setCanvasOptions()
      // 绘制海报
      self.drawPoster(ctx)
    })
  },

  // 设置海报绘制基础参数
  setCanvasOptions () {
    let self = this
    let goodsDetail = self.data.goodsDetail
    let goodsTitle = (goodsDetail.Name).split('')
    let goodsTitleArray = []
    // 为了防止标题过长，分割字符串,每行18个
    let breaknum = 18
    goodsTitle.forEach((item, index) => {
      if (index % breaknum === 0 && index / breaknum <= 1) {
        goodsTitleArray.push(goodsTitle.slice(index, index + breaknum).join(''))
      }
    })
    // y方向的偏移量，因为是从上往下绘制的，所以y一直向下偏移，不断增大。
    let yOffset = 20
    if (goodsTitleArray.length !== 1) {
      yOffset = 10
    }
    let xOffset = 20
    let goodsPicWidth = 260
    let goodsPicHeight = 260
    let qrCodePicWidth = 80
    let qrCodePicHeight = 80
    let n_price = 0
    let o_price = 0
    if (goodsDetail.scaleflag) {
      n_price = '￥' + goodsDetail.preferential / 2 + '/斤'
      o_price = '原价:￥' + goodsDetail.originalcost / 2 + '/斤'
    } else {
      n_price = '￥' + goodsDetail.preferential
      o_price = '原价:￥' + goodsDetail.originalcost
    }
    let codeTextArray = [
      '长按识别小程序码',
      '进入小程序下单购买',
    ]
    let canvasOptions = {
      goodsTitleArray: goodsTitleArray,
      xOffset: xOffset,
      yOffset: yOffset,
      goodsPicWidth: goodsPicWidth,
      goodsPicHeight: goodsPicHeight,
      qrCodePicWidth: qrCodePicWidth,
      qrCodePicHeight: qrCodePicHeight,
      n_price: n_price,
      o_price: o_price,
      codeTextArray: codeTextArray,
    }
    self.setData({
      canvasOptions: canvasOptions
    })
  },

  // 绘制海报
  drawPoster (ctx) {
    let self = this
    wx.showLoading({
      title: '正在生成海报...',
      mask: true,
    })
    // 绘制海报背景
    self.drawPosterBg(ctx)
    // 绘制商品图片
    self.drawPosterGoodsPic(ctx)
  },

  // 绘制海报背景
  drawPosterBg (ctx) {
    let self = this
    // 绘制背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 600, 860)
  },

  // 绘制商品图片
  drawPosterGoodsPic (ctx) {
    let self = this
    let canvas = self.data.canvas
    let canvasOptions = self.data.canvasOptions
    // 绘制图片边框
    ctx.strokeStyle = '#e7e7e7'
    ctx.strokeRect(canvasOptions.xOffset, canvasOptions.yOffset, canvasOptions.goodsPicWidth, canvasOptions.goodsPicHeight)
    // 绘制商品图片
    let goodsPic = canvas.createImage()
    goodsPic.src = self.data.baseUrl + self.data.goodsDetail.image
    goodsPic.onload = () => {
      ctx.drawImage(goodsPic, canvasOptions.xOffset, canvasOptions.yOffset, canvasOptions.goodsPicWidth, canvasOptions.goodsPicHeight)
      ctx.restore()
      canvasOptions.yOffset += (canvasOptions.goodsPicHeight + canvasOptions.yOffset)
      self.setData({
        canvasOptions: canvasOptions
      })
      // 绘制商品名称
      self.drawPosterGoodsName(ctx)
    }

  },

  // 绘制商品名称
  drawPosterGoodsName (ctx) {
    let self = this
    let canvasOptions = self.data.canvasOptions
    canvasOptions.goodsTitleArray.forEach(item => {
      ctx.font = '15px sans-serif'
      ctx.fillStyle = '#333333'
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillText(item, canvasOptions.xOffset, canvasOptions.yOffset)
      canvasOptions.yOffset += 24
    })
    self.setData({
      canvasOptions: canvasOptions
    })
    // 绘制商品小程序码
    self.drawPosterQrCode(ctx)
  },

  // 绘制商品小程序码
  drawPosterQrCode (ctx) {
    let self = this
    let canvas = self.data.canvas
    let canvasOptions = self.data.canvasOptions
    let qrCodePic = canvas.createImage()
    qrCodePic.src = self.data.baseUrl + self.data.qrCodePicPath
    qrCodePic.onload = () => {
      ctx.drawImage(qrCodePic, canvasOptions.xOffset + 180, canvasOptions.yOffset, canvasOptions.qrCodePicWidth, canvasOptions.qrCodePicHeight)
      ctx.restore()
      self.setData({
        canvasOptions: canvasOptions
      })
      // 绘制商品价格
      self.drawPosterGoodsPrice(ctx)
    }
  },

  // 绘制商品价格
  drawPosterGoodsPrice (ctx) {
    let self = this
    let canvasOptions = self.data.canvasOptions
    // 绘制售价
    canvasOptions.yOffset += 10
    ctx.font = 'normal bold 24px sans-serif'
    ctx.fillStyle = '#fa6400'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillText(canvasOptions.n_price, canvasOptions.xOffset, canvasOptions.yOffset)
    // 绘制原价
    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#999999'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillText(canvasOptions.o_price, canvasOptions.xOffset + canvasOptions.n_price.toString().length * 20, canvasOptions.yOffset)
    // 绘制原价的删除线
    ctx.lineWidth = 1
    ctx.moveTo(canvasOptions.xOffset + canvasOptions.n_price.toString().length * 20 - 5, canvasOptions.yOffset + 6)
    ctx.lineTo(canvasOptions.xOffset + canvasOptions.n_price.toString().length * 20 + canvasOptions.o_price.toString().length * 10, canvasOptions.yOffset + 6)
    ctx.strokeStyle = '#999999'
    ctx.stroke()
    // 绘制提示识别小程序码文字
    canvasOptions.yOffset += 40
    canvasOptions.codeTextArray.forEach(item => {
      ctx.font = '13px sans-serif'
      ctx.fillStyle = '#666666'
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillText(item, canvasOptions.xOffset, canvasOptions.yOffset)
      canvasOptions.yOffset += 18
    })
    wx.hideLoading()
    self.setData({
      posterFlag: true,
      drawFlag: false,
    })
  },

  // 保存海报图片
  savePosterImg () {
    let self = this
    // 将canvas生成图片
    wx.canvasToTempFilePath({
      canvas: self.data.canvas,
      x: 0,
      y: 0,
      width: 300,
      height: 480,
      destWidth: 300,     // 截取canvas的宽度
      destHeight: 480,   // 截取canvas的高度
      success (res) {
        // 保存图片到相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success () {
            toast.toast('保存图片成功！')
            // 关闭画布
            self.closedPosterCanvas()
          },
          fail (error) {
            toast.toast('请截屏手动保存！')
          }
        })
      },
    })
  },

  // 关闭画布
  closedPosterCanvas () {
    let self = this
    self.setData({
      posterFlag: false,
    })
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
            cartCount: res.data.data
          })
        }
      }
    }).catch(error => {
      toast.toast(error.error)
    })
  },
})
