//index.js
const app = getApp();
import toast from '../../utils/toast';
import utils from '../../utils/util';
import API from '../../api/index';

Page({
  data: {
    //导航栏高度
    navHeight: app.globalData.navHeight,
    // 基础路径
    baseUrl: app.globalData.baseUrl,
    // 图片路径为空时默认图路径
    defgoodsimg: app.globalData.defgoodsimg,
    // 等待动画开关
    loadingFlag: false,
    // 门店名称
    deptname: '',
    // 门店code
    deptcode: '',
    // 默认门店名称
    defaultDeptname: '',
    // 默认门店code
    defaultDeptcode: '',
    // 请求开关
    getFlag: false,
    // 搜索内容
    search_val: '',
    // 通知列表
    noticeList: [],
    // banner类型列表
    bannerTypeList: app.globalData.bannerTypeList,
    // 自定义模块列表
    modulePictureList: [],
    // 友链列表
    friendLinkList: [],
    // 推荐商品列表
    clusterList: [],
    // 集群是否请求完成
    clusterIsRequest: false,
    // 集群渲染列表
    clusterApplyList: [],
    // 选项卡标题列表
    tabsList: [],
    // tabs选中下标
    tabsActiveIndex: 0,
    // tabs滚动数据
    scrollTabsData: 'tabs_name0',
    // tabs商品列表距顶部距离
    tabsScrollTop: 0,
    // 页数
    page: 1,
    // 每页条数
    count: 16,
    // 商品总条数
    rowCount: 0,
    // tabs商品列表
    goodsList: [],
    // 活动一商品列表
    indexHotList: [],
    // 专区列表
    hotList: [],
    // 拼团、秒杀、砍价、预售商品轮播列表
    promotemodeList: app.globalData.promotemodeList,
    // 特价商品列表
    specialGoodsList: [],
    // 导航栏前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
    frontColor: '#ffffff',
    // banner两侧是否留边距
    isMarginFlag: true,
    // banner高度尺寸
    bannerHeight: 280,
    // 主题背景图
    home_bgurl: '',
    // 主题背景色
    home_bgcolor: '#71d793',
    // 秒杀/特价背景色
    home_promotebg: '#f68e74',
    // 加购物车弹框显示开关
    dialogFlag: false,
    // 弹框广告显示开关
    addialogFlag: false,
    // 弹窗广告图
    adDialogImg: '',
    // 分享门店名称
    shareDeptname: '',
    // 分享门店code
    shareDeptcode: '',
    // 自定义排列顺序
    autoSort: [
      { title: '定位', name: 'location', sort: 0 },
      { title: '轮播', name: 'banner', sort: 1 },
      { title: '通知', name: 'notice', sort: 2 },
      { title: '模块', name: 'module', sort: 3 },
      { title: '视频', name: 'video', sort: 4 },
      { title: '友链', name: 'friend', sort: 5 },
      { title: '海报', name: 'poster', sort: 6 },
      { title: '专区', name: 'zone', sort: 7 },
      { title: '秒杀', name: 'seckill', sort: 8 },
      { title: '特价', name: 'special', sort: 9 },
      { title: '活动一', name: 'activity1', sort: 10 },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let deptname = options.deptname || '';
    let deptcode = options.deptcode || '';
    // 获取当前线上版本号
    self.getVersion();
    // 获取店铺基础设置信息配置首页
    self.getShopOptions();
    // 新版本校验
    app.checkUpdateVersion();
    // 设置title
    wx.setNavigationBarTitle({
      title: app.globalData.apptitle,
    });
    if (deptname && deptcode) {
      self.setData({
        loadingFlag: false,
        deptname: deptname,
        deptcode: deptcode,
      });
      app.globalData.deptname = deptname;
      app.globalData.deptcode = deptcode;
    }
    // 是否请求openid
    self.isGetOpenid()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    // 校验是否首次登陆，非首次登录才更新购物车数量
    if (self.data.openid) {
      // 更新购物车数量
      self.getCartCount();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self = this;
    self.setData({
      page: 1,
      rowcount: 0,
      goodsList: [],
      clusterApplyList: [],
      tabsScrollTop: 0,
    });
    // 初始化
    self.init();
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this;
    let { rowCount, count, page, clusterIsRequest, goodsList, clusterApplyList } = self.data;
    // 计算总页数
    let totalPage = Math.ceil(rowCount / count);
    // 集群请求完成后执行
    if (clusterIsRequest && goodsList.length && clusterApplyList[clusterApplyList.length - 1].top < 0) {
      page++;
      if (page > totalPage) {
        toast('暂无更多');
        return false;
      }
      self.setData({
        page: page,
      });
      // 获取商品列表
      self.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let self = this;
    return {
      title: app.globalData.apptitle,
      path:
        '/pages/index/index?deptname=' +
        self.data.deptname +
        '&deptcode=' +
        self.data.deptcode,
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline: function () {
    let self = this
    return {
      title: app.globalData.apptitle,
      path:
        '/pages/index/index?deptname=' +
        self.data.deptname +
        '&deptcode=' +
        self.data.deptcode,
    };
  },

  /**
   * 页面滚动
   */
  onPageScroll: function (t) {
    let self = this;
    let query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset();
    query.select('.tabs_cont').boundingClientRect();
    query.selectAll('.apply-section').boundingClientRect();
    query.exec(function (res) {
      let n_tabsScrollTop = res[0].scrollTop + res[1].top;
      let clusterApplyList = res[2]
      // 集群请求完成后执行
      if (self.data.clusterIsRequest) {
        clusterApplyList.forEach((item, index) => {
          item.top = res[2][index].top;
        });
        self.setData({
          clusterApplyList: clusterApplyList,
          tabsScrollTop: n_tabsScrollTop,
        });
      }
    });
  },

  // 获取当前线上版本号
  getVersion() {
    let self = this;
    let accountInfo = wx.getAccountInfoSync();
    // 当前线上版本号
    app.globalData.version = accountInfo.miniProgram.version;
    console.log(accountInfo, 'accountInfo');
  },

  // 获取店铺基础设置信息配置首页
  getShopOptions() {
    let self = this;
    let data = {};
    API.system
      .getTheme(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          let options = res.data
          self.setData({
            home_bgurl: options.home_bgurl || '',
            home_bgcolor: app.colorRgb(options.home_bgcolor || '#71d793'),
            home_promotebg: options.home_promotebg || '#f68e74',
            isMarginFlag: Number(options.isMarginFlag) ? true : false,
            bannerHeight: options.bannerHeight || 280,
          });
          app.globalData.home_bgcolor = options.home_bgcolor;
          app.globalData.cent_istrunbg = options.cent_istrunbg;
          app.globalData.cent_bgurl = options.cent_bgurl;
          app.globalData.cent_turnurl = options.cent_turnurl;
          app.globalData.cent_btnurl = options.cent_btnurl;
          app.globalData.moneyType = options.moneyType;
        } else {
          toast(res.message);
        }
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 是否请求openid
  async isGetOpenid() {
    let self = this
    let openid = wx.getStorageSync('jyyfo2oopenid');
    // 判断openid是否存在
    if (!openid) {
      try {
        // 获取openid、session_key
        await app.getOpenID().then(result => {
          openid = result.data
        })
      } catch (error) {
        toast(error.msg)
        return false
      }
    }
    app.globalData.openid = openid
    // 获取用户信息
    self.login(openid)
  },

  // 获取用户信息
  login(openid) {
    let self = this;
    let { deptname, deptcode } = app.globalData;
    let data = {
      wxID: openid,
      usercode: '',
      password: '',
      // 团秒标志，0：否；1：是 ；2：小程序自动登录
      tmFlag: 2,
    };
    API.system
      .login(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          // 用户id
          let userid = res.data.customerid;
          // 手机号码
          let mobile = res.data.mobile;
          // 用户名称
          let memname = res.data.memname;
          // 用户code
          let memcode = res.data.memcode;
          // 用户身份标识，0：批发客户（app功能）；1：普通客户
          let iscustomer = res.data.iscustomer;
          // 身份信息，0：顾客；1：配送员；2：团长；3：核销员
          let role = res.data.role;
          // 卡支付标志，1：开通；0：未开通；null：未知
          let coflag = res.data.coflag;
          // 只允许普通客户登录小程序(批发客户不能登录)
          if (iscustomer !== 1) {
            toast('当前帐号类型不正确,不可使用');
            return;
          }
          app.globalData.userid = userid;
          app.globalData.mobile = mobile;
          app.globalData.memname = memname;
          app.globalData.memcode = memcode;
          app.globalData.role = role;
          app.globalData.coflag = coflag;
          // 默认门店标志
          let isdefaultdept = res.data.isDefaultDept;
          let defaultDeptname = res.data.shopInfo.shopname;
          let defaultDeptcode = res.data.shopInfo.shopcode;
          // 没有分享门店
          if (!deptname && !deptcode) {
            if (isdefaultdept) {
              // 存在默认门店
              self.setData({
                deptname: defaultDeptname,
                deptcode: defaultDeptcode,
              });
              app.globalData.deptname = defaultDeptname;
              app.globalData.deptcode = defaultDeptcode;
              // 初始化
              self.init();
            } else {
              // 不存在默认门店
              // 获取定位
              self.getLocation();
            }
          } else {
            self.setData({
              deptname: deptname,
              deptcode: deptcode,
            });
            // 初始化
            self.init();
          }
          // 更新购物车数量
          self.getCartCount();
        } else {
          toast(res.message);
        }
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 获取定位
  getLocation() {
    let self = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success(res) {
        app.globalData.longitude = res.longitude;
        app.globalData.latitude = res.latitude;
        // app.globalData.longitude = 113.292463
        // app.globalData.latitude = 35.770223
      },
      // 接口调用结束
      complete() {
        // 获取门店列表
        self.getShopList();
      },
    });
  },

  // 获取门店列表
  getShopList() {
    let self = this;
    let longitude = app.globalData.longitude || 0;
    let latitude = app.globalData.latitude || 0;
    let data = {
      Longitude: longitude,
      Latitude: latitude,
      deptType: 1,
    };
    API.system
      .listDeptInfo(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          // 设置当前门店为最近门店
          let shopList = res.data;
          shopList.forEach((item) => {
            if (item.distance > 1000) {
              item.distancekm = (item.distance / 1000).toFixed(2);
            } else {
              item.distancekm = 0;
            }
          });
          app.globalData.shopList = shopList;
          if (shopList.length === 1) {
            let deptname = shopList[0].deptname;
            let deptcode = shopList[0].deptcode;
            self.setData({
              deptname: deptname,
              deptcode: deptcode,
            });
            app.globalData.deptname = deptname;
            app.globalData.deptcode = deptcode;
            // 初始化
            self.init();
          } else {
            wx.reLaunch({
              url: '/pages/shopList/shopList',
            });
          }
        }
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 初始化
  init() {
    let self = this;
    let { bannerTypeList } = self.data;
    // 清空list
    bannerTypeList.forEach((item) => (item.list = []));
    // 获取各种banner图列表
    self.getBannerList();
    // 获取自定义功能列表
    self.getModulePictureList();
    // 获取公告列表
    self.getNoticeList();
    // 获取友链列表
    self.getFriendLinkList();
    // 获取集群商品列表
    self.getClusterList();
    // 获取专区列表
    self.getHotList();
    // 获取拼团、秒杀、砍价、预售商品轮播列表
    self.getProductListByPromote();
    // 获取特价商品列表
    self.getSpecialGoodsList();
    // 获取弹窗广告图
    self.getAdDialogImg();
  },

  // 手指触摸后移动(阻止冒泡)
  catchTouchMove() {
    return false;
  },

  // 获取各种banner图列表
  getBannerList() {
    let self = this;
    let data = {
      businessflag: 0,
    };
    API.system
      .listShopHomeSlide(data)
      .then((result) => {
        let res = result.data;
        let bannerTypeList = self.data.bannerTypeList;
        if (res.flag === 1) {
          let bannerList = res.data;
          bannerList.forEach((item) => {
            item.linkcode = item.objectcode;
            bannerTypeList[item.businessflag - 1].list.push(item);
          });
        } else {
          toast(res.message);
        }
        app.globalData.bannerTypeList = bannerTypeList;
        self.bannerTypeList = bannerTypeList;
        // 设置数据方法
        self.setDataFn();
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 去banner详情
  toBannerDetail(e) {
    let self = this;
    let banner = e.currentTarget.dataset.banner;
    app.toBannerDetail(banner);
  },

  // 获取公告列表
  getNoticeList() {
    let self = this;
    let data = {
      Listtype: 2,
    };
    API.info
      .listNotice(data)
      .then((result) => {
        let res = result.data;
        let noticeList = [];
        if (res.flag === 1) {
          noticeList = res.data;
        } else {
          toast(res.message);
        }
        self.noticeList = noticeList;
        // 设置数据方法
        self.setDataFn();
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 获取自定义功能列表
  getModulePictureList() {
    let self = this;
    let date = utils.formatDate(new Date()).split('/').join('');
    let data = {
      version: date,
    };
    API.system
      .getModulePictureList(data)
      .then((result) => {
        let res = result.data;
        let modulePictureList = [];
        if (res.flag === 1) {
          if (res.data) {
            modulePictureList = res.data.picturenamelist;
            let list_startindex = 0;
            let list_endindex = 10;
            let list = [];
            modulePictureList.forEach((item) => {
              if (modulePictureList.length > list_startindex) {
                list.push(
                  modulePictureList.slice(
                    list_startindex,
                    (list_startindex += list_endindex)
                  )
                );
              }
            });
            modulePictureList = list;
          }
        } else {
          toast(res.message);
        }
        self.modulePictureList = modulePictureList;
        // 设置数据方法
        self.setDataFn();
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 获取专区列表
  getHotList() {
    let self = this;
    let data = {};
    API.info
      .listHot180414(data)
      .then((result) => {
        let res = result.data;
        let hotList = [];
        if (res.flag === 1) {
          hotList = res.data;
          hotList.forEach((item, index) => {
            if (hotList.length % 2 === 1) {
              if (index === hotList.length - 1) {
                item.lastItem = 1;
              } else {
                item.lastItem = 0;
              }
            } else {
              if (
                index === hotList.length - 1 ||
                index === hotList.length - 2
              ) {
                item.lastItem = 1;
              } else {
                item.lastItem = 0;
              }
            }
          });
        } else {
          toast(res.message);
        }
        self.hotList = hotList;
        // 设置数据方法
        self.setDataFn();
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 获取拼团、秒杀、砍价、预售商品轮播列表
  getProductListByPromote() {
    let self = this;
    let data = {
      promotemode: 0,
      Page: 1,
      pageSize: 15,
    };
    API.info
      .getProductListByPromote(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          let goodsList = res.data;
          let promotemodeList = self.data.promotemodeList;
          goodsList.forEach((item) => {
            promotemodeList.forEach((modeitem) => {
              if (item.promotemode === modeitem.promotemode) {
                modeitem.list.push(item);
              }
            });
          });
          self.setData({
            promotemodeList: promotemodeList,
          });
        } else {
          toast(res.message);
        }
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 获取特价商品列表
  getSpecialGoodsList() {
    let self = this;
    let data = {
      Datatype: '1',
      Page: 1,
      pageSize: 5,
      Sortflg: 1,
      sorttype: 0,
    };
    API.info
      .getProductList(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          // 商品code统一字段
          let specialGoodsList = res.data;
          specialGoodsList.forEach((item) => {
            if (item.goodscode && !item.Gdscode) {
              item.Gdscode = item.goodscode;
            }
          });
          self.specialGoodsList = specialGoodsList;
          // 设置数据方法
          self.setDataFn();
        } else {
          toast(res.message);
        }
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 获取友链列表
  getFriendLinkList() {
    let self = this;
    let data = {};
    API.system
      .getFriendLinks(data)
      .then((result) => {
        let res = result.data;
        let friendLinkList = [];
        if (res.flag === 1) {
          friendLinkList = res.data;
          friendLinkList.forEach((item) => (item.Imageurl = item.siteurl));
        } else {
          toast(res.message);
        }
        self.friendLinkList = friendLinkList;
        // 设置数据方法
        self.setDataFn();
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 获取弹窗广告图
  getAdDialogImg() {
    let self = this;
    let adDialogImg = self.data.adDialogImg;
    let data = {};
    // 检验是否首次登录，首次登录请求弹框广告并显示
    if (adDialogImg) {
      return false;
    }
    API.system
      .getHomeAds(data)
      .then((result) => {
        let res = result.data;
        let adDialogImg = '';
        if (res.flag === 1) {
          if (res.data.length) {
            adDialogImg = res.data;
            // 设置弹框广告开关
            self.setAddialogFlag();
          }
        }
        self.adDialogImg = adDialogImg;
        // 设置数据方法
        self.setDataFn();
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 设置弹框广告开关
  setAddialogFlag() {
    let self = this;
    self.setData({
      addialogFlag: !self.data.addialogFlag,
    });
  },

  // 设置数据方法
  setDataFn() {
    let self = this;
    // 设置数据
    let {
      noticeList,
      bannerTypeList,
      modulePictureList,
      hotList,
      friendLinkList,
      specialGoodsList,
      adDialogImg,
    } = self;
    if (
      noticeList !== undefined &&
      bannerTypeList !== undefined &&
      modulePictureList !== undefined &&
      hotList !== undefined &&
      friendLinkList !== undefined &&
      specialGoodsList !== undefined &&
      adDialogImg !== undefined
    ) {
      self.setData({
        noticeList: noticeList || [],
        bannerTypeList: bannerTypeList || [],
        modulePictureList: modulePictureList || [],
        hotList: hotList || [],
        friendLinkList: friendLinkList || [],
        specialGoodsList: specialGoodsList || [],
        adDialogImg: adDialogImg[0] || [],
      });
      // 关闭等待动画
      self.setData({
        loadingFlag: true,
      });
    }
  },

  // 获取集群商品列表
  getClusterList() {
    let self = this;
    let data = {};
    // 判断是否为首次加载
    if (self.data.clusterList.length) {
      wx.showLoading({
        title: '正在加载',
        mask: true,
      });
    }
    API.info
      .getTheme(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          if (res.data.length) {
            let clusterList = res.data;
            self.setData({
              clusterList: clusterList.filter((item) => item.showway === 1),
              tabsList: clusterList.filter((item) => item.showway === 2),
              indexHotList: clusterList.filter((item) => item.showway === 3),
            });
            if (self.data.tabsList.length) {
              // 获取商品列表
              self.getGoodsList();
            }
          }
        } else {
          toast(res.message);
        }
        // 判断是否为首次加载
        if (self.data.clusterList.length) {
          wx.hideLoading();
        }
        // 设置集群是否请求完成
        self.setData({
          clusterIsRequest: true,
        });
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 设置选项卡选中项
  setTabsActiveIndex(e) {
    let self = this;
    let { index } = e.currentTarget.dataset;
    let { tabsActiveIndex, tabsScrollTop, navHeight } = self.data;
    self.setData({
      scrollTabsData: 'tabs_name' + (index - 1),
    });
    // 重复选择不发送请求
    if (index === tabsActiveIndex) {
      return false;
    }
    self.setData({
      tabsActiveIndex: index,
      page: 1,
    });
    wx.pageScrollTo({
      scrollTop: tabsScrollTop - navHeight,
      duration: 300,
    });
    // 获取商品列表
    self.getGoodsList('reset');
  },

  // 获取商品列表
  getGoodsList(reset) {
    let self = this;
    let { tabsList, tabsActiveIndex, page, count } = self.data;
    let data = {
      Cateid: tabsList[tabsActiveIndex].Id,
      Page: page,
      Count: count,
      Sortflg: 1,
      sorttype: 0,
      HotCategoryflag: 1,
    };
    // 判断首次加载
    if (self.data.goodsList.length) {
      wx.showLoading({
        title: '正在加载',
        mask: true,
      });
    }
    API.info
      .getProductListByCate(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          let goodsList = self.data.goodsList;
          // 商品code统一字段
          let list = res.data;
          list.forEach((item) => {
            if (item.goodscode && !item.Gdscode) {
              item.Gdscode = item.goodscode;
            }
          });
          if (reset) {
            goodsList = list;
          } else {
            goodsList.push(...list);
          }
          self.setData({
            goodsList: goodsList,
            rowCount: res.rowCount,
          });
        } else {
          toast(res.message);
        }
        // 判断首次加载
        if (self.data.goodsList.length) {
          wx.hideLoading();
        }
      })
      .catch((error) => {
        toast(error.error);
      });
  },

  // 更新购物车数量
  getCartCount() {
    let self = this;
    let data = {};
    API.bill
      .getCarProductCount(data)
      .then((result) => {
        let res = result.data;
        if (res.flag === 1) {
          let index = 3
          if (res.data) {
            if (res.data.data) {
              wx.setTabBarBadge({
                index: index,
                text: res.data.data.toString(),
              });
            } else {
              wx.removeTabBarBadge({
                index: index,
              });
            }
          }
        }
      })
      .catch((error) => {
        toast(error.error);
      });
  },
});
