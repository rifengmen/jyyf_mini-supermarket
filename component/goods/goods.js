// component/goods/goods.js
require('../../app.js')
const app = getApp()
import toast from "../../utils/toast";
import API from "../../api/index";

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
    // goods，商品信息
    goods: {
      type: Object,
      value: {}
    },
    // showType，显示类型，0：一行一条商品；1：一行一条商品(放大显示)；2：一行两条商品；3：一行三条商品
    showType: {
      type: Number,
      value: 0
    },
    // cartType，购物车类型,0：加入购物车；1：购物车编辑数量，
    cartType: {
      type: Number,
      value: 0
    },
    // editorFlag，编辑数量显示开关
    editorFlag: {
      type: Boolean,
      value: false
    },
    // panicBuy，秒杀标识
    panicBuy: {
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
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 商品显示类型列表
    showTypeList: app.globalData.showTypeList,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 加购物车弹框显示开关
    dialogFlag: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 调用子组件添加购物车方法
    addCart(goods) {
      let self = this
      // 购物车修改数量
      if (self.data.cartType === 1) {
        let cartdesc = {
          Gdscode: goods.Gdscode,
          Xuhao: goods.xuhao,
          Count: goods.amount,
        }
        // 修改购物车商品数量的方法
        self.updateIntoCar(cartdesc)
      } else { // 普通加入购物车
        // 获取添加购物车组件
        let addcart = self.selectComponent('#addCart')
        // 传入商品信息添加购物车
        addcart.addCart(goods)
      }
    },

    // 加购物车弹框
    dialogConfirm(goods) {
      let self = this
      // 调用子组件添加购物车方法
      self.addCart(goods.detail)
      // 设置加购物车弹框开关
      self.setDialogFlag()
    },

    // 购物车数量操作
    editorCartCount(e) {
      let self = this
      let { type } = e.currentTarget.dataset
      let goods = self.data.goods
      // 判断是否为标签商品
      if (goods.striperbarcodeflag === 1) {
        toast('称签商品不允许修改数量')
      } else {
        let Count = goods.buyAMT
        let Xuhao = goods.xuhao
        let Gdscode = goods.Gdscode
        let saleflag = goods.scaleflag
        // 判断加减
        if (type === 'increaseCart') {
          Count++
        } else if (type === 'subtrackCart') {
          if (Count <= 1) {
            return false
          } else {
            Count--
          }
        }
        // 判断商品类型，saleflag：0是非散称，1是散称
        if (saleflag) {
          // 设置加购物车弹框开关
          self.setDialogFlag()
        } else {
          let cartdesc = {
            Gdscode: Gdscode,
            Xuhao: Xuhao,
            Count: Count,
          }
          // 修改购物车商品数量的方法
          self.updateIntoCar(cartdesc)
        }
      }
    },

    // 设置加购物车弹框开关
    setDialogFlag() {
      let self = this
      self.setData({
        dialogFlag: !self.data.dialogFlag
      })
    },

    // 修改购物车商品数量的方法
    updateIntoCar(cartdesc) {
      let self = this
      API.bill.updateIntoCar(cartdesc).then(result => {
        let res = result.data
        if (res.flag === 1) {
          cartdesc.SMGflag = res.data.SMGflag
          cartdesc.Skucount = res.data.Skucount
          cartdesc.pricemode = res.data.pricemode
          cartdesc.totalmoney = res.data.totalmoney
          cartdesc.actmoney = res.data.actmoney
          // 设置购物车
          self.setCartList(cartdesc)
          // 更新购物车数量
          self.getCartCount()
        } else {
          toast(res.message)
        }
      }).catch(error => {
        toast(error.error)
      })
    },

    // 设置购物车
    setCartList(cartdesc) {
      let self = this
      self.triggerEvent('setCartList', cartdesc)
    },

    // 更新购物车数量
    getCartCount() {
      let self = this
      self.triggerEvent('getCartCount')
    },
  },

  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    // 页面被展示
    show: function () {

    },
    // 页面被隐藏
    hide: function () {
      let self = this
      // 页面隐藏关闭弹框
      if (self.data.dialogFlag) {
        // 设置加购物车弹框开关
        self.setDialogFlag()
      }
    },
    // 页面尺寸变化
    resize: function (size) {

    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      let self = this
      self.setData({
        // 门店名称
        deptname: app.globalData.deptname,
        // 门店code
        deptcode: app.globalData.deptcode,
      })
    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {

    },
  },
})
