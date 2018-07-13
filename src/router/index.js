import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index';
Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/online/index',
      name: 'Online',
      component: require('../pages/online/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/jdindex',
      name: 'JingDong',
      component: require('../pages/online/jdindex'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/jdself',
      name: 'JDSelf',
      component: require('../pages/online/jdself'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/online/jdproduct',
      name: 'JDProduct',
      component: require('../pages/online/jdproduct'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/online/jdsettle',
      name: 'JDSettle',
      component: require('../pages/online/jdsettle'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/address/jdaddress',
      name: 'JDAddress',
      component: require('../pages/address/jdaddress'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/address/jdedit',
      name: 'JDAddressEdit',
      component: require('../pages/address/jdedit'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/address/jdnew',
      name: 'JDAddressNew',
      component: require('../pages/address/jdnew'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/online/tmindex',
      name: 'TianMao',
      component: require('../pages/online/tmindex'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/tmdetail',
      name: 'TMDetail',
      component: require('../pages/online/tmdetail'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/online/products',
      name: 'Products',
      component: require('../pages/online/products'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/product',
      name: 'Product',
      component: require('../pages/online/product'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/comment',
      name: 'Comment',
      component: require('../pages/online/comment'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/online/settle',
      name: 'SettleBalance',
      component: require('../pages/online/settle'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/shoppingcart',
      name: 'ShoppingCart',
      component: require('../pages/online/cart'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/online/allcolumn',
      name: 'AllColumn',
      component: require('../pages/online/allcolumn'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/address/index',
      name: 'AddressManage',
      component: require('../pages/address/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/address/edit',
      name: 'AddressEdit',
      component: require('../pages/address/edit'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/address/new',
      name: 'AddressNew',
      component: require('../pages/address/new'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/index',
      name: 'Me',
      component: require('../pages/me/index'),
      meta: {
        requireAuth: true,
        keepAlive: true
      }
    }, {
      path: '/order/index',
      name: 'MyOrder',
      component: require('../pages/order/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/order/detail',
      name: 'OrderDetail',
      component: require('../pages/order/orderdetail'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/order/addcomment',
      name: 'AddComment',
      component: require('../pages/order/addcomment'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/mywallet',
      name: 'MyWallet',
      component: require('../pages/me/mywallet'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/qrcode',
      name: 'Qrcode',
      component: require('../pages/me/qrcode'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/recommend',
      name: 'Recommend',
      component: require('../pages/me/recommend'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/updateApp',
      name: 'UpdateApp',
      component: require('../pages/me/updateApp'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/login',
      name: 'Login',
      component: require('../pages/me/login'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/regpro',
      name: 'RegPro',
      component: require('../pages/me/regpro'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/forgetpwd',
      name: 'Forgetpwd',
      component: require('../pages/me/forgetpwd'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/pwdmanage',
      name: 'PwdManage',
      component: require('../pages/me/pwdmanage'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/update',
      name: 'Update',
      component: require('../pages/me/update'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/collect',
      name: 'MyCollect',
      component: require('../pages/me/collect'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/store/settle-2',
      name: 'IndividualSettle',
      component: require('../pages/store/settle2'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/my',
      name: 'MyStore',
      component: require('../pages/store/my'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/bankcard',
      name: 'BankCard',
      component: require('../pages/trade/bankcard'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/newbank',
      name: 'NewBank',
      component: require('../pages/trade/newbank'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/interest',
      name: 'Interest',
      component: require('../pages/trade/interest'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/cashhistory',
      name: 'CashHistory',
      component: require('../pages/trade/cashhistory'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/welfrecord',
      name: 'WelfareRecord',
      component: require('../pages/trade/welfrecord'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/index',
      name: 'TreasureIndex',
      component: require('../pages/treasure/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/treasure/in',
      name: 'TreasureIn',
      component: require('../pages/treasure/in'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/out',
      name: 'TreasureOut',
      component: require('../pages/treasure/out'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/list',
      name: 'TreasureList',
      component: require('../pages/treasure/list'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/cash',
      name: 'TreasureCash',
      component: require('../pages/treasure/cash'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/merchant/chain',
      name: 'MerchantChain',
      component: require('../pages/merchant/chain'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/merchant/index',
      name: 'MerchantIndex',
      component: require('../pages/merchant/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/merchant/give',
      name: 'MerchantGive',
      component: require('../pages/merchant/give'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/merchant/give2',
      name: 'MerchantGive2',
      component: require('../pages/merchant/give2'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/merchant/givehistory',
      name: 'GiveHistory',
      component: require('../pages/merchant/givehistory'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/merchant/upgrade',
      name: 'Upgrade',
      component: require('../pages/merchant/upgrade'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/merchant/coupon',
      name: 'Coupon',
      component: require('../pages/merchant/coupon'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/merchant/couponhistory',
      name: 'CouponHistory',
      component: require('../pages/merchant/couponhistory'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/merchant/protocol',
      name: 'MerchantProtocol',
      component: require('../pages/merchant/protocol'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/merchant/recommendhistory',
      name: 'RecommendHistory',
      component: require('../pages/merchant/recommendhistory'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/news/index',
      name: 'News',
      component: require('../pages/news/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/news/detail',
      name: 'NewsDetail',
      component: require('../pages/news/detail'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '*',
      redirect: '/online/index'
    }
  ]
})
router.afterEach((to, from) => {
  let s = document.querySelector("main") && document.querySelector("main").scrollTop
  store.commit('SAVE_POSITION', {
    name: from.path,
    position: s
  });
})
export default router;
