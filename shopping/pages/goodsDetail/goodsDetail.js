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
    self.setData({
      swiperCurrent: e.detail.current
    })
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

  // 获取海报
  getPoster () {
    let self = this
    // wx.getImageInfo({
    //   src:'https://www.91jyrj.com/eshop',
    //   success: function (res) {
    //     //res.path是网络图片的本地地址
    //     qrCodePath = res.path;
    //   },
    //   fail: function (res) {
    //     //失败回调
    //   }
    // })
    console.log('getPoster')
    // let goodsPicPath = 'https://www.91jyrj.com/eshop/upload/goods/115434/3-zip-300.jpg'
    // let goodsPicPath = '/lib/images/ceshi000.png'
    let goodsPicPath = ''
    // let qrCodePath = 'https://www.91jyrj.com/eshop/upload/goods/72892/3-zip-300.jpg'
    // let qrCodePath = '/lib/images/ceshi001.png'
    let qrCodePath = ''
    // 绘制海报
    self.drawSharePic(goodsPicPath, qrCodePath)
  },

  // 绘制海报
  drawSharePic (goodsPicPath, qrCodePath) {
    let self = this
    console.log('drawSharePic')
    let goodsDetail = self.data.goodsDetail
    // wx.showLoading({
    //   title: '正在生成海报...',
    //   mask: true,
    // })
    // y方向的偏移量，因为是从上往下绘制的，所以y一直向下偏移，不断增大。
    let yOffset = 20
    let goodsTitle = goodsDetail.Name
    let goodsTitleArray = []
    // 为了防止标题过长，分割字符串,每行18个
    for (let i = 0; i < goodsTitle.length / 18; i++) {
      if (i > 2) {
        break
      }
      goodsTitleArray.push(goodsTitle.substr(i * 18, 18))
    }
    let n_price = 0
    let o_price = 0
    if (goodsDetail.scaleflag) {
      n_price = goodsDetail.preferential / 2
      o_price = goodsDetail.originalcost / 2
    } else {
      n_price = goodsDetail.preferential
      o_price = goodsDetail.originalcost
    }
    let title1 = '您的好友邀请您一起分享精品好货'
    let title2 = '立即打开看看吧'
    let codeText = '长按识别小程序码查看详情'
    let imgWidth = 780
    let imgHeight = 1600

    const query = wx.createSelectorQuery()
    query.select('.shareCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          console.log(res, 'exec')
          const canvas = res[0].node
          console.log(canvas, 'canvas')
          const canvasCtx = canvas.getContext('2d')
          console.log(canvasCtx, 'canvasCtx')

          // const dpr = wx.getSystemInfoSync().pixelRatio
          // canvas.width = res[0].width * dpr
          // canvas.height = res[0].height * dpr
          // ctx.scale(dpr, dpr)
          //
          // ctx.fillRect(0, 0, 100, 100)

          // 绘制背景
          // canvasCtx.setFillStyle('white');
          canvasCtx.fillRect(0, 0, 390, 800);
          // 绘制分享的标题文字
          canvasCtx.setFontSize(24);
          canvasCtx.setFillStyle('#333333');
          canvasCtx.setTextAlign('center');
          canvasCtx.fillText(title1, 195, 40);
          // 绘制分享的第二行标题文字
          canvasCtx.fillText(title2, 195, 70);
          // 绘制商品图片
          canvasCtx.drawImage(goodsPicPath, 0, 90, 390, 390);
          // 绘制商品标题
          yOffset = 490;
          goodsTitleArray.forEach(function (value) {
            canvasCtx.setFontSize(20);
            canvasCtx.setFillStyle('#333333');
            canvasCtx.setTextAlign('left');
            canvasCtx.fillText(value, 20, yOffset);
            yOffset += 25;
          });
          // 绘制价格
          yOffset += 8;
          canvasCtx.setFontSize(20);
          canvasCtx.setFillStyle('#fa6400');
          canvasCtx.setTextAlign('left');
          canvasCtx.fillText('￥', 20, yOffset);
          canvasCtx.setFontSize(30);
          canvasCtx.setFillStyle('#fa6400');
          canvasCtx.setTextAlign('left');
          canvasCtx.fillText(n_price, 40, yOffset);
          // 绘制原价
          const xOffset = (n_price.length / 2 + 1) * 24 + 50;
          canvasCtx.setFontSize(20);
          canvasCtx.setFillStyle('#999999');
          canvasCtx.setTextAlign('left');
          canvasCtx.fillText('原价:¥' + o_price, xOffset, yOffset);
          // 绘制原价的删除线
          canvasCtx.setLineWidth(1);
          canvasCtx.moveTo(xOffset, yOffset - 6);
          canvasCtx.lineTo(xOffset + (3 + o_price.toString().length / 2) * 20, yOffset - 6);
          canvasCtx.setStrokeStyle('#999999');
          canvasCtx.stroke();
          // 绘制最底部文字
          canvasCtx.setFontSize(18);
          canvasCtx.setFillStyle('#333333');
          canvasCtx.setTextAlign('center');
          canvasCtx.fillText(codeText, 195, 780);
          // 绘制二维码
          canvasCtx.drawImage(qrCodePath, 95, 550, 200, 200);
          // 绘制之前描述的海报
          canvasCtx.draw(false, function (eee) {
            console.log(eee, 'eee');
            console.log(self, 'creatPoster');
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: 390,
              height: 800,
              destWidth: 390,
              destHeight: 800,
              canvasId: 'shareCanvas',
              success: function (res) {
                self.setData({
                  shareImage: res.tempFilePath,
                  showSharePic: true
                })
                wx.hideLoading();
              },
              fail: function (res) {
                console.log(res)
                wx.hideLoading();
              }
            })
          })
        })

    const canvasCtx = wx.createCanvasContext('shareCanvas')
    // canvasCtx.draw()
    // 绘制之后加一个延时去生成图片，如果直接生成可能没有绘制完成，导出图片会有问题。
    // setTimeout(function () {
    //   wx.canvasToTempFilePath({
    //     x: 0,
    //     y: 0,
    //     width: 390,
    //     height: 800,
    //     destWidth: 390,
    //     destHeight: 800,
    //     canvasId: 'shareCanvas',
    //     success: function (res) {
    //       self.setData({
    //         shareImage: res.tempFilePath,
    //         showSharePic: true
    //       })
    //       wx.hideLoading();
    //     },
    //     fail: function (res) {
    //       console.log(res)
    //       wx.hideLoading();
    //     }
    //   })
    // }, 2000);
  },

  // 导出海报
  toTempFilePath () {
    let self = this
    console.log(self, 'creatPoster');
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 390,
      height: 800,
      destWidth: 390,
      destHeight: 800,
      canvasId: 'shareCanvas',
      success: function (res) {
        self.setData({
          shareImage: res.tempFilePath,
          showSharePic: true
        })
        wx.hideLoading();
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading();
      }
    })
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
