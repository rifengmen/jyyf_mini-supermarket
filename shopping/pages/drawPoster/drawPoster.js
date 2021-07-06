// shopping/pages/drawPoster/drawPoster.js
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
    // 商品详情(海报分享用)
    goodsDetail: '',
    // 画布对象
    canvas: '',
    // 像素比例
    dpr: '',
    // 绘图上下文
    ctx: '',
    // 绘图开关
    drawFlag: true,
    // 海报画布显示开关
    posterFlag: false,
    // 页面参数
    scene: '',
    // 商品小程序码图路径
    qrCodePicPath: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      goodsDetail: app.globalData.goodsDetail,
      deptname: options.deptname,
      deptcode: options.deptcode,
      Gdscode: options.Gdscode,
      title: options.title,
      promotemode: Number(options.promotemode || 0),
      scene: options,
    })
    // 获取商品码
    self.getQrCodePicPath()

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
  // onShareAppMessage: function () {
  //
  // },

  // 手指触摸后移动(阻止冒泡)
  catchTouchMove(res) {
    return false
  },

  // 获取商品码
  getQrCodePicPath() {
    let self = this
    let data = {
      goodscode: self.data.Gdscode,
      promotemode: self.data.promotemode,
      scene: self.data.scene,
      page: 'shopping/pages/wxScene/wxScene'
    }
    wx.showLoading({
      title: '正在生成海报...',
      mask: true,
    })
    API.info.getProductBuyCodeUrl(data).then(result => {
      let res = result.data
      if (res.flag === 1) {
        self.setData({
          qrCodePicPath: res.data.cardpath
        })
        // 查找画布
        self.queryCanvas()
      } else {
        toast(res.message)
      }
    }).catch(error => {
      toast(error.error)
    })
  },

  // 查找画布
  queryCanvas() {
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
      const dpr = app.globalData.dpr
      // 新接口需显示设置画布宽高
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)
      self.setData({
        canvas: canvas,
        ctx: ctx,
        dpr: dpr,
      })
      // 设置海报绘制基础参数
      self.setCanvasOptions()
      // 绘制海报
      self.drawPoster(ctx)
    })
  },

  // 设置海报绘制基础参数
  setCanvasOptions() {
    let self = this
    let canvas = self.data.canvas
    let dpr = self.data.dpr
    let goodsDetail = self.data.goodsDetail
    let goodsTitle = (goodsDetail.Name).split('')
    let goodsTitleArray = []
    // 为了防止标题过长，分割字符串
    let breaknum = 14
    goodsTitle.forEach((item, index) => {
      if (index % breaknum === 0 && index / breaknum <= 1) {
        goodsTitleArray.push(goodsTitle.slice(index, index + breaknum).join(''))
      }
    })
    let canvasW = canvas.width
    let canvasH = canvas.height
    let baseW = 600
    let baseH = 960
    // 单位
    let units = (canvasW / dpr) / (baseW / 2)
    self.setData({
      units: units,
    })
    let startX = 0
    let startY = 0
    let rectW = baseW / 2 * units
    let rectH = baseH / 2 * units
    let radius = 10 * units
    let goodsPicWidth = 260 * units
    let goodsPicHeight = 260 * units
    let qrCodePicWidth = 80 * units
    let qrCodePicHeight = 80 * units
    let xOffset = 20 * units
    let yOffset = 20 * units
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
      startX: startX,
      startY: startY,
      rectW: rectW,
      rectH: rectH,
      radius: radius,
      goodsPicWidth: goodsPicWidth,
      goodsPicHeight: goodsPicHeight,
      qrCodePicWidth: qrCodePicWidth,
      qrCodePicHeight: qrCodePicHeight,
      xOffset: xOffset,
      yOffset: yOffset,
      n_price: n_price,
      o_price: o_price,
      codeTextArray: codeTextArray,
    }
    self.setData({
      canvasOptions: canvasOptions
    })
  },

  // 绘制海报
  drawPoster(ctx) {
    let self = this
    // 绘制海报背景
    self.drawPosterBg(ctx)
    // 绘制商品图片
    self.drawPosterGoodsPic(ctx)
  },

  // 绘制海报背景
  drawPosterBg(ctx) {
    let self = this
    let canvasOptions = self.data.canvasOptions
    //圆的直径必然要小于矩形的宽高          
    if (2 * canvasOptions.radius > canvasOptions.rectW || 2 * canvasOptions.radius > canvasOptions.rectH) { return false; }
    // 保存状态
    ctx.save()
    // 绘制背景
    ctx.translate(canvasOptions.startX, canvasOptions.startY);
    //绘制圆角矩形的各个边  
    self.drawRoundRectPath(ctx);
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    // ctx.fillRect(canvasOptions.startX, canvasOptions.startY, canvasOptions.rectW, canvasOptions.rectH)
    // // 绘制一条路径
    // ctx.stroke()
    // 裁剪
    ctx.clip()
    // 恢复保存状态
    ctx.restore()
  },

  // 绘制圆角矩形的各个边
  drawRoundRectPath(ctx) {
    let self = this
    let { rectW: w, rectH: h, radius: r } = self.data.canvasOptions

    ctx.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI  
    ctx.arc((w - r), (h - r), r, Math.PI * 0, Math.PI * 1 / 2);
    //矩形下边线  
    ctx.lineTo(r, h);

    //左下角圆弧，弧度从1/2PI到PI  
    ctx.arc(r, h - r, r, Math.PI * 1 / 2, Math.PI * 2 / 2);
    //矩形左边线  
    ctx.lineTo(0, r);

    //左上角圆弧，弧度从PI到3/2PI  
    ctx.arc(r, r, r, Math.PI * 2 / 2, Math.PI * 3 / 2);
    //上边线  
    ctx.lineTo(w - r, 0);

    // //右上角圆弧  
    ctx.arc(w - r, r, r, Math.PI * 3 / 2, Math.PI * 4 / 2);
    //右边线  
    ctx.lineTo(w, h - r);

    ctx.closePath();
  },

  // 绘制商品图片
  drawPosterGoodsPic(ctx) {
    let self = this
    let canvas = self.data.canvas
    let canvasOptions = self.data.canvasOptions
    let src = self.data.baseUrl + self.data.goodsDetail.image
    let { units } = self.data
    let { rectW: w, radius: r } = self.data.canvasOptions
    let h = w - 20 * units
    // 裁剪尺寸长宽
    let sw = 0
    let sh = 0
    // 获取图片长宽
    wx.getImageInfo({
      src: src,
      success: (result) => {
        sw = result.width
        sh = result.height
        // 绘制商品图片
        let goodsPic = canvas.createImage()
        goodsPic.src = src
        goodsPic.onload = () => {
          ctx.save()
          ctx.beginPath()
          //矩形下边线  
          ctx.lineTo(0, h);

          //矩形左边线  
          ctx.lineTo(0, r);

          //左上角圆弧，弧度从PI到3/2PI  
          ctx.arc(r, r, r, Math.PI * 2 / 2, Math.PI * 3 / 2);
          //上边线  
          ctx.lineTo(w - r, 0);

          // //右上角圆弧  
          ctx.arc(w - r, r, r, Math.PI * 3 / 2, Math.PI * 4 / 2);
          //右边线  
          ctx.lineTo(w, h);

          ctx.closePath();
          ctx.fillStyle = '#ffffff'
          ctx.fill()
          ctx.clip()
          ctx.drawImage(goodsPic, canvasOptions.startX, canvasOptions.startY, sw, sh - canvasOptions.yOffset, canvasOptions.startX, canvasOptions.startY, canvasOptions.rectW, canvasOptions.rectW - canvasOptions.yOffset)
          ctx.restore()
          canvasOptions.yOffset += (canvasOptions.goodsPicHeight + (canvasOptions.yOffset / 2))
          self.setData({
            canvasOptions: canvasOptions
          })
          // 绘制商品名称
          self.drawPosterGoodsName(ctx)
        }
        goodsPic.onerror = () => {
          wx.hideLoading()
          toast('海报生成错误！')
        }
      },
      fail: () => {
        wx.hideLoading()
        toast('海报生成错误！')
      },
    });
    // // 绘制商品图片
    // let goodsPic = canvas.createImage()
    // goodsPic.src = src
    // goodsPic.onload = () => {
    //   ctx.save()
    //   ctx.beginPath()
    //   //矩形下边线  
    //   ctx.lineTo(0, h);

    //   //矩形左边线  
    //   ctx.lineTo(0, 0);

    //   //左上角圆弧，弧度从PI到3/2PI  
    //   ctx.arc(r, r, r, Math.PI * 2 / 2, Math.PI * 3 / 2);
    //   //上边线  
    //   ctx.lineTo(w - r, 0);

    //   // //右上角圆弧  
    //   ctx.arc(w - r, r, r, Math.PI * 3 / 2, Math.PI * 4 / 2);
    //   //右边线  
    //   ctx.lineTo(w, h);

    //   ctx.closePath();

    //   ctx.clip()
    //   // ctx.drawImage(goodsPic, canvasOptions.xOffset, canvasOptions.yOffset, canvasOptions.goodsPicWidth, canvasOptions.goodsPicHeight)
    //   ctx.drawImage(goodsPic, canvasOptions.startX, canvasOptions.startY, sw, sh - canvasOptions.yOffset, canvasOptions.startX, canvasOptions.startY, canvasOptions.rectW, canvasOptions.rectW - canvasOptions.yOffset)
    //   ctx.draw()
    //   ctx.restore()
    //   canvasOptions.yOffset += (canvasOptions.goodsPicHeight + (canvasOptions.yOffset / 2))
    //   self.setData({
    //     canvasOptions: canvasOptions
    //   })
    //   // 绘制商品名称
    //   self.drawPosterGoodsName(ctx)
    // }
    // goodsPic.onerror = () => {
    //   wx.hideLoading()
    //   toast('海报生成错误！')
    // }
  },

  // 绘制商品名称
  drawPosterGoodsName(ctx) {
    let self = this
    let units = self.data.units
    let canvasOptions = self.data.canvasOptions
    canvasOptions.goodsTitleArray.forEach(item => {
      ctx.font = '20px sans-serif'
      ctx.fillStyle = '#333333'
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillText(item, canvasOptions.xOffset, canvasOptions.yOffset)
      canvasOptions.yOffset += 24 * units
    })
    self.setData({
      canvasOptions: canvasOptions
    })
    // 绘制商品小程序码
    self.drawPosterQrCode(ctx)
  },

  // 绘制商品小程序码
  drawPosterQrCode(ctx) {
    let self = this
    let units = self.data.units
    let canvas = self.data.canvas
    let canvasOptions = self.data.canvasOptions
    let qrCodePic = canvas.createImage()
    qrCodePic.src = self.data.baseUrl + self.data.qrCodePicPath
    qrCodePic.onload = () => {
      canvasOptions.yOffset += 35 * units
      ctx.drawImage(qrCodePic, canvasOptions.xOffset + (180 * units), canvasOptions.yOffset, canvasOptions.qrCodePicWidth, canvasOptions.qrCodePicHeight)
      ctx.restore()
      self.setData({
        canvasOptions: canvasOptions
      })
      // 绘制商品价格
      self.drawPosterGoodsPrice(ctx)
    }
    qrCodePic.onerror = () => {
      wx.hideLoading()
      toast('海报生成错误！')
    }
  },

  // 绘制商品价格
  drawPosterGoodsPrice(ctx) {
    let self = this
    let units = self.data.units
    let { goodsDetail, canvasOptions } = self.data
    // 绘制售价
    canvasOptions.yOffset -= 20 * units
    ctx.font = 'normal bold 24px sans-serif'
    ctx.fillStyle = '#fa6400'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillText(canvasOptions.n_price, canvasOptions.xOffset, canvasOptions.yOffset)
    // 是否显示原价
    if (goodsDetail.preferential !== goodsDetail.originalcost) {
      // 绘制原价
      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#999999'
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillText(canvasOptions.o_price, canvasOptions.xOffset + canvasOptions.n_price.toString().length * 20, canvasOptions.yOffset)
      // 绘制原价的删除线
      ctx.lineWidth = 1
      ctx.moveTo(canvasOptions.xOffset + canvasOptions.n_price.toString().length * 20 - 5 * units, canvasOptions.yOffset + 6 * units)
      ctx.lineTo(canvasOptions.xOffset + canvasOptions.n_price.toString().length * 20 + canvasOptions.o_price.toString().length * 10, canvasOptions.yOffset + 6 * units)
      ctx.strokeStyle = '#999999'
      ctx.stroke()
    }
    // 绘制提示识别小程序码文字
    canvasOptions.yOffset += 45 * units
    canvasOptions.codeTextArray.forEach(item => {
      ctx.font = '13px sans-serif'
      ctx.fillStyle = '#666666'
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillText(item, canvasOptions.xOffset, canvasOptions.yOffset)
      canvasOptions.yOffset += 18 * units
    })
    wx.hideLoading()
  },

  // 保存海报图片
  savePosterImg() {
    let self = this
    let units = self.data.units
    // 将canvas生成图片
    wx.canvasToTempFilePath({
      canvas: self.data.canvas,
      x: 0,
      y: 0,
      width: 300 * units,
      height: 480 * units,
      destWidth: 1200 * units,     // 截取canvas的宽度
      destHeight: 1920 * units,   // 截取canvas的高度
      success(res) {
        // 保存图片到相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            // 关闭画布
            self.closedPosterCanvas()
            toast('保存图片成功！')
          },
          fail(error) {
            toast('请截屏手动保存！')
          }
        })
      },
    })
  },

  // 关闭画布
  closedPosterCanvas() {
    let self = this
    wx.navigateBack()
  },
})
