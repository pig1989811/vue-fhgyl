<template>
  <div>
    <header-top title="让利记录"></header-top>
    <main class='scroll-content-2'>
      <section v-if="info.length">
        <ul>
          <li class="item" v-for="(item,index) in info" :key="index">
            <div class="item-top flex just-between align-center">
              <p>
                <span class="iconfont-large self-weixinzhifu" style="color:#25d025;" v-if="item.payType=='0'"></span>
                <span class="iconfont-large self-zhifubao" style="color:#00a0ea;" v-if="item.payType=='1'"></span>
                <span class="iconfont-large self-yinlianzhifu1" style="color:#077d8d;" v-if="item.payType=='2'"></span>
                <span class="iconfont-large self-edu" style="color:#f9a340;" v-if="item.payType=='4'"></span>
                <span class="iconfont-large self-wallet danger-color" v-if="item.payType=='5'"></span>
                <span class="iconfont-large self-yuanbao danger-color" v-if="item.payType=='6'"></span>
                <span class="time">{{formatTime(item.addTime)}}</span>
                </p>
              <span class="status status-0" v-if="item.tradeStatus==0">待支付</span>
              <span class="status status-1" v-if="item.tradeStatus==1">已支付</span>
            </div>
            <div class="item-bottom flex just-between align-center">
              <span class="money">{{item.benefitMoney}}
                <span class="fs-14">元</span>
              </span>
              <p class="fs-14">{{item.mobile}}</p>
            </div>
          </li>
        </ul>
      </section>
      <section class="hv-cen text-center" v-else>
        <span class="iconfont self-noorder" style="font-size:40px;"></span>
        <p>没有数据</p>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { benefits } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "SaleHistory",
  data() {
    return {
      info: []
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"])
  },
  mixins: [mixin],
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      let vm = this;
      mui.ajax({
        url: benefits,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          token: md5(`gjfengbenefits${this.account}`)
        },
        success(res) {
          if (res.code !== 200) {
            vm.$dialog.toast({
              mes: res.msg
            });
            return;
          }
          vm.info = res.result;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.item {
  background-color: @white;
  margin-top: @pd;
  .pd;
  .time {
    font-size: 15px;
    margin-left: @pd;
    vertical-align: 2px;
  }
  .money {
    color: @red;
    font-size: 20px;
    vertical-align: top;
  }
  .status {
    font-size: 0.28rem;
    &.status-0 {
      color: @blue;
    }
    &.status-1 {
      color: @green;
    }
    &.status-2 {
      color: @gold;
    }
    &.status-3 {
      color: @lightgray;
    }
  }
}
</style>