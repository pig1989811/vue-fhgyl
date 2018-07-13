<template>
  <div>
    <header-top title="凤凰宝交易记录"></header-top>
    <main class='scroll-content-2'>
      <yd-infinitescroll :callback="getInfo" ref="historyList">
        <ul slot="list">
          <li class="item" v-for="(item,index) in info" :key="index">
            <div class="flex just-between">
              <span>{{formatTime(item.addTime,true)}}</span>
              <span v-if="item.tradeType=='0'" class="status-1">储值</span>
              <span v-if="item.tradeType=='1'&&account!=item.memebrMobile" class="status-1">转账收入</span>
              <span v-if="item.tradeType=='1'&&account==item.memebrMobile" class="status-0">转账支出</span>
              <span v-if="item.tradeType=='2'" class="status-0">让利支付</span>
              <span v-if="item.tradeType=='3'" class="status-1">余额转入</span>
              <span v-if="item.tradeType=='4'" class="status-2">提现[{{item.tradeStatus=='0'?'待审核':'审核通过'}}]</span>
              <span v-if="item.tradeType=='5'" class="status-0">订单支付</span>
              <span v-if="item.tradeType=='6'" class="danger-color">其他[提现退回、代金券付款等]</span>
              <span v-if="item.tradeType=='8'" class="status-1">充值商家联盟</span>
              <span v-if="item.tradeType=='9'" class="status-0">赠送商家联盟</span>
              <span v-if="item.tradeType=='10'" class="status-0">奖励转入</span>
            </div>
            <!-- 转出 -->
            <section v-if="account!=item.transferMemberMobile">
              <div class="flex just-between" v-if="item.tradeType!='3'&&item.tradeType!='4'&&item.tradeType!='5'&&item.tradeType!='6'&&item.tradeType!='8'&&item.tradeType!='9' &&item.tradeType!='10'">
                <span>交易对象</span>
                <p>
                  <span>{{item.transferMemberName}}</span>
                  <span>{{item.transferMemberMobile}}</span>
                </p>
              </div>
              <div class="flex just-between">
                <span>交易数额</span>
                <span><span v-if="item.tradeType=='1'">-</span>{{item.memberTreasureTradeMoney}}</span>
              </div>
              <div class="flex just-between" v-if="item.tradeType!='6'">
                <span>交易前</span>
                <span>{{item.memberTreasureMoneyBf}}</span>
              </div>
              <div class="flex just-between" v-if="item.tradeType!='6'">
                <span>交易后</span>
                <span class="danger-color">{{item.memberTreasureMoneyAf}}</span>
              </div>
            </section>
            <!-- 被转入 -->
            <section v-else>
              <div class="flex just-between" v-if="item.tradeType!='3'&&item.tradeType!='4'&&item.tradeType!='5'&&item.tradeType!='6'">
                <span>交易对象</span>
                <p>
                  <span>{{item.memberName}}</span>
                  <span>{{item.memebrMobile}}</span>
                </p>
              </div>
              <div class="flex just-between">
                <span>交易数额</span>
                <span><span v-if="item.tradeType=='1'">+</span>{{item.memberTreasureTradeMoney}}</span>
              </div>
              <div class="flex just-between" v-if="item.tradeType!='6'">
                <span>交易前</span>
                <span>{{item.transferMemberMoneyBf}}</span>
              </div>
              <div class="flex just-between" v-if="item.tradeType!='6'">
                <span>交易后</span>
                <span class="danger-color">{{item.transferMemberMoneyAf}}</span>
              </div>
            </section>
          </li>
        </ul>
      </yd-infinitescroll>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { toFhTreasureTradeHistory } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "TreasureList",
  data() {
    return {
      noData: false,
      info: [],
      pageNo: 1
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"])
  },
  created() {
    this.getInfo();
  },
  mixins: [mixin],
  methods: {
    getInfo() {
      let vm = this;
      if (!this.noData) {
        mui.ajax({
          url: toFhTreasureTradeHistory,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            account: this.account,
            pageNo: this.pageNo,
            pageSize: 10,
            token: md5(`gjfengtoFhTreasureTradeHistory${this.account}`)
          },
          success(res) {
            let _list = res.result.resultList;
            vm.info = [...vm.info, ..._list];
            if (_list.length < 10) {
              vm.noData = true;
              vm.$refs.historyList.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.historyList.$emit("ydui.infinitescroll.finishLoad");
            vm.pageNo++;
          }
        });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.item {
  background-color: @white;
  .pd;
  margin-bottom: @pd;
  font-size: 0.28rem;
  .status-0 {
    color: @blue;
  }
  .status-1 {
    color: @green;
  }
  .status-2 {
    color: @gold;
  }
}
</style>