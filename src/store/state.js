export default {
  latitude: '', // 当前位置纬度
  longitude: '', // 当前位置经度
  city: '', // 当前城市
  account: '', // 登录account
  searchValue: '', //搜索值
  showCertificate: false, //身份认证模态框
  certificateStatus: false, //身份认证状态
  idCard: '',
  storeInfo: null, //店铺信息
  balanceMoney: 0, //账户余额
  bankList: [], //银行卡列表
  defaultBankCard: null, //默认银行卡
  member: null, //用户信息
  addressList: [], // 地址列表
  defaultAddress: null, //默认地址
  cartList: [], //购物车列表
  settleList: null, //结算列表,
  paypwd: false, //支付密码状态
  positions: {}, //保存滚动条位置
  payInfo: null, //银联支付信息
  cacheList: {}, //缓存列表
  update: false, //升级
  fhbMoney: 0, // 凤凰宝余额
}
