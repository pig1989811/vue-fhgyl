<template>
  <div>
    <header-top title="提现"></header-top>
    <main class='scroll-content-2'>
      <section>
        <p class="tips">可提取福利
          <span class="danger-color">{{fhbMoney}}</span>
        </p>
        <router-link :to="{path: '/trade/bankcard?type=choose'}" class="bank-card flex align-center" v-if="defaultBankCard">
          <div class="icon" :style="{'background-image':formatBg(defaultBankCard.bankPic)}"></div>
          <div class="bank-name flex-1">
            <p>{{defaultBankCard.bankName}}</p>
            <p>卡号：{{defaultBankCard.bankCard}}</p>
          </div>
          <span class="iconfont self-right"></span>
        </router-link>
        <yd-cell-group v-else>
          <yd-cell-item arrow href="/trade/bankcard" type="link">
            <span slot="icon" class="iconfont-large self-yinhangka"></span>
            <span slot="left">银行卡</span>
            <span slot="right">去添加</span>
          </yd-cell-item>
        </yd-cell-group>
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">提现金额：</span>
            <yd-input slot="right" v-model="money" placeholder="请输入提现金额(160~50000)"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-textarea slot="right" v-model="remark" placeholder="如有备注，请输入" maxlength="20"></yd-textarea>
          </yd-cell-item>
        </yd-cell-group>
        <div style="padding:0 .2rem;">
          <p class="danger-color">*提现说明：申请提现后会有专门的人员后台进行审核，审核不通过将自动返还到提现账户。到账时间为1到5个工作日，请耐心等待。</p>
          <yd-button :type="valid?'warning':'disabled'" size="large" @click.native="drawCash">提现</yd-button>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { toFhTreasureDrawCash, addFhTreasureDrawCash } from "../../api/index";
import { mixin, getStore } from "components/common/mixin";
export default {
  name: "TreasureCash",
  data() {
    return {
      money: "",
      remark: "",
      showDialog: false
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["fhbMoney", "account", "defaultBankCard"]),
    validMoney() {
      return !isNaN(this.money) && this.money >= 160 && this.money <= 50000;
    },
    valid() {
      return (
        this.defaultBankCard && this.validMoney && this.money < this.fhbMoney
      );
    }
  },
  mixins: [mixin],
  created() {},
  activated() {
    if (!this.defaultBankCard) this.$store.dispatch("getBankList");
  },
  methods: {
    drawCash() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: addFhTreasureDrawCash,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          myBankId: this.defaultBankCard.id,
          money: this.money,
          remark: this.remark,
          token: md5(`gjfengaddFhTreasureDrawCash${this.account}${this.money}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: res.msg
            });
          } else {
            vm.$dialog.alert({
              mes: res.msg
            });
          }
        }
      });
      // this.$http
      //   .request({
      //     url: addFhTreasureDrawCash,
      //     method: "post",
      //     data: {
      //       account: this.account,
      //       myBankId: this.defaultBankCard.id,
      //       money: this.money,
      //       remark: this.remark,
      //       token: md5(
      //         `gjfengaddFhTreasureDrawCash${this.account}${this.money}`
      //       )
      //     }
      //   })
      //   .then(res => {
      //     this.$dialog.toast({
      //         mes: res.msg
      //       });
      //   });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.tips {
  .pd;
}
.bank-card {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  .icon {
    .wh(0.8rem, 0.8rem);
    background-size: cover;
  }
  .bank-name {
    margin-left: @pd;
    color: @lightgray;
    text-align: left;
    p {
      margin-bottom: 0.1rem;
      &:first-of-type {
        font-size: 15px;
        color: #333;
      }
      &.selected {
        color: @red;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>