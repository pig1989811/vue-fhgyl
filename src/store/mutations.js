import {
  RECORD_ADDRESS,
  RECORD_CITY,
  SET_ACCOUNT,
  RECORD_SEARCH_VALUE,
  SHOW_CERTIFICATE,
  SET_CERTIFICATE,
  RECORD_ID_CARD,
  RECORD_STORE_INFO,
  RECORD_BALANCE_MONEY,
  RECORD_BANK_CARD,
  RECORD_BANK_List,
  RECORD_MEMBER_INFO,
  RECORD_ADDRESS_List,
  RECORD_DEFAULT_ADDRESS,
  RECORD_CART_LIST,
  UPDATE_CART_ITEM,
  DELETE_CART_ITEM,
  RECORD_SETTLE_LIST,
  SET_PAY_PASSWORD,
  RECORD_PAY_INFO,
  SAVE_POSITION,
  SAVE_LIST_WITH_PAGE,
  RECORD_UPDATE,
  RECORD_FHB_MONEY
} from './mutation-types'
export default {
  [RECORD_ADDRESS](state, {
    latitude,
    longitude
  }) {
    state.latitude = latitude;
    state.longitude = longitude;
  },
  [RECORD_CITY](state, city) {
    state.city = city;
  },
  [SET_ACCOUNT](state, account) {
    state.account = account;
  },
  [RECORD_SEARCH_VALUE](state, searchValue) {
    state.searchValue = searchValue;
  },
  [SHOW_CERTIFICATE](state, showCertificate) {
    state.showCertificate = showCertificate;
  },
  [SET_CERTIFICATE](state, status) {
    state.certificateStatus = status;
  },
  [RECORD_ID_CARD](state, num) {
    state.idCard = num;
  },
  [RECORD_STORE_INFO](state, info) {
    state.storeInfo = info;
  },
  [RECORD_BALANCE_MONEY](state, m) {
    state.balanceMoney = m;
  },
  [RECORD_BANK_CARD](state, bankcard) {
    state.defaultBankCard = bankcard;
  },
  [RECORD_BANK_List](state, list) {
    state.bankList = list;
  },
  [RECORD_MEMBER_INFO](state, info) {
    state.member = info;
  },
  [RECORD_DEFAULT_ADDRESS](state, address) {
    state.defaultAddress = address;
  },
  [RECORD_ADDRESS_List](state, list) {
    state.addressList = list;
  },
  [RECORD_CART_LIST](state, list) {
    state.cartList = list;
  },
  [UPDATE_CART_ITEM](state, payload) {
    let _list = state.cartList;
    _list.splice(payload.index, 1, payload.item);
    state.cartList = _list;
  },
  [DELETE_CART_ITEM](state, index) {
    let _list = state.cartList;
    _list.splice(index, 1);
    state.cartList = _list;
  },
  [RECORD_SETTLE_LIST](state, list) {
    state.settleList = list;
  },
  [SET_PAY_PASSWORD](state, sta) {
    state.paypwd = sta;
  },
  [SAVE_POSITION](state, payload) {
    state.positions[payload.name] = payload.position
  },
  [RECORD_PAY_INFO](state, payInfo) {
    state.payInfo = payInfo;
  },
  [SAVE_LIST_WITH_PAGE](state, payload) {
    state.cacheList[payload.name] = payload.cacheInfo;
  },
  [RECORD_UPDATE](state, tag) {
    state.update = tag;
  },
  [RECORD_FHB_MONEY](state, m) {
    state.fhbMoney = m;
  },
}
