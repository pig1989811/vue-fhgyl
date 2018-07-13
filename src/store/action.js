import {
  SET_CERTIFICATE,
  RECORD_MEMBER_INFO,
  RECORD_BALANCE_MONEY,
  RECORD_BANK_CARD,
  RECORD_BANK_List,
  RECORD_ADDRESS_List,
  RECORD_DEFAULT_ADDRESS,
  RECORD_CART_LIST,
  RECORD_FHB_MONEY,
  RECORD_SETTLE_LIST
} from './mutation-types'
import {
  my,
  myBanks,
  getMyAddress,
  myCart,
  toFhTreasurePage,
  findOrderPos
} from '../api/index'
import {
  getStore
} from "../components/common/mixin"
export default {
  getInfo({
    commit,
    state
  }) {
    mui.ajax({
      url: my,
      type: "post",
      headers: {
        "app-version": "v1.0"
      },
      data: {
        account: getStore('account'),
        token: md5(`my${getStore('account')}`)
      },
      success(res) {
        let _result = res.result
        commit("SET_CERTIFICATE", _result.isReadName == "1" ? true : false);
        commit("RECORD_MEMBER_INFO", _result);
        commit('RECORD_BALANCE_MONEY', _result.balanceMoney)
      }
    });
  },
  getBankList({
    commit,
    state
  }) {
    mui.ajax({
      url: myBanks,
      type: 'post',
      headers: {
        'app-version': 'v1.0'
      },
      data: {
        account: state.account,
        token: md5(`gjfengmyBanks${state.account}`)
      },
      success(res) {
        let bankList = res.result;
        if (bankList.length) {
          let defaultBankCard = bankList[0];
          commit(RECORD_BANK_List, bankList);
          commit(RECORD_BANK_CARD, defaultBankCard);
        } else {
          commit(RECORD_BANK_List, []);
          commit(RECORD_BANK_CARD, null);
        }
      }
    })
  },
  getAddressList({
    commit,
    state
  }, {
    source
  }) {
    mui.ajax({
      url: getMyAddress,
      type: 'post',
      headers: {
        'app-version': 'v1.0'
      },
      data: {
        account: state.account,
        goodSource: source,
        token: md5('gjfenggetMyAddress')
      },
      success(res) {
        let _result = res.result;
        commit('RECORD_DEFAULT_ADDRESS', null)
        if (!_result.length) {
          commit('RECORD_ADDRESS_List', [])
        } else {
          _result.forEach((item, index) => {
            if (item.isDefault == '1') {
              commit('RECORD_DEFAULT_ADDRESS', item)
            }
          })
          commit('RECORD_ADDRESS_List', _result)
        }
      }
    })
  },
  getCartList({
    commit,
    state
  }) {
    mui.ajax({
      url: myCart,
      type: 'post',
      headers: {
        'app-version': 'v1.0'
      },
      data: {
        account: state.account,
        token: md5(`gjfengmyCart${state.account}`)
      },
      success(res) {
        let _result = res.result;
        _result.forEach((item, index) => {
          item.close = true;
          item.checked = false;
        })
        commit(RECORD_CART_LIST, _result);
      }
    })
  },
  getFHB({
    commit,
    state
  }) {
    mui.ajax({
      url: toFhTreasurePage,
      type: 'post',
      headers: {
        'app-version': 'v1.0'
      },
      data: {
        account: state.account,
        token: md5(`gjfengtoFhTreasurePage${state.account}`)
      },
      success(res) {
        commit(RECORD_FHB_MONEY, res.result.fhTreasureInfo.fhTreasureMoney);
      }
    })
  },
  refreshPos({commit,state},{addressId}){
    let vm = this;
    let a = [],b = [];
          state.settleList.orderAddVos.forEach(item=>{
            a.push(item.goodsId);
            b.push(item.goodsNum);
          })
    mui.ajax({
      url: findOrderPos,
      type: 'post',
      headers: {'app-version': 'v1.0'},
      data: {
        goodIds:a.join(','),
        goodNums:b.join(','),
        addsId:addressId,
        token: md5(`gjfengfindOrderPos`)
      },
      success(res){
        if(res.code==200){
          let _r = res.result;
          commit(RECORD_SETTLE_LIST,{...state.settleList,..._r})
        }
        else{
          return state;
        }
      }
    })
  }
}
