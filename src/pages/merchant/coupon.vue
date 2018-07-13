<template>
  <div>
    <header-top title="赠送代金券"></header-top>
    <main class='scroll-content-2'>
      <yd-cell-group title="赠送对象">
        <yd-cell-item>
          <span slot="left">赠送金额：</span>
          <yd-input slot="right" v-model="money" placeholder="输入金额（单位：元）"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">赠送会员：</span>
          <input type="tel" slot="right" v-model="mobile" placeholder="请输入会员手机号" @input="findMember">
        </yd-cell-item>
        <yd-cell-item v-if="mobileName">
          <span slot="left">会员名称：</span>
          <yd-input slot="right" readonly v-model="mobileName" :show-clear-icon="false"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group v-if="payMoney">
        <yd-cell-item>
          <span slot="left">应付金额</span>
          <span slot="right" style="font-size:0.3rem;color:#ff5350;">{{payMoney}}</span>
        </yd-cell-item>
        <!-- <yd-cell-item v-show="payType=='4'">
          <span slot="left">当前授信额度值</span>
          <input slot="right" type="text" readonly style="text-align:right;color:#04be02;" v-model="member.lineOfCrade">
        </yd-cell-item> -->
        <!-- <yd-cell-item v-show="payType=='6'">
          <span slot="left">当前凤凰宝余额</span>
          <input slot="right" type="text" readonly style="text-align:right;color:#04be02;" v-model="fhbMoney">
        </yd-cell-item> -->
      </yd-cell-group>
      <yd-cell-group title="支付方式" v-show="money>0">
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea;"></span>
          <span slot="left">支付宝</span>
          <input slot="right" type="radio" value="1" v-model="payType" />
        </yd-cell-item>
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-edu" style="color:#f9a340;"></span>
          <span slot="left">授信额度</span>
          <input slot="right" type="radio" value="4" v-model="payType" />
        </yd-cell-item> -->
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-yuanbao danger-color"></span>
          <span slot="left">凤凰宝</span>
          <input slot="right" type="radio" value="6" v-model="payType" />
        </yd-cell-item> -->
      </yd-cell-group>
      <div class="btn-container flex just-around" style="padding:0 .2rem;">
        <yd-button type="warning" @click.native="goCouponHistory" style="font-size:15px;"> 更 多 记 录
          <span class="iconfont self-right"></span>
        </yd-button>
        <yd-button :type="valid?'primary':'disabled'" @click.native="save" style="font-size:15px;"> 确 认 赠 送
          <span class="iconfont self-dui"></span>
        </yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from 'components/header/index'
import { addMemberVonchersHistory} from '../../api/index';
import { findMemberByMobile, payMixin } from "components/common/mixin";
export default {
  name: 'Coupon',
  data() {
    return {
      money: "",
      mobile: "",
      mobileName: "",
      payType: "",
      pays: {}
    }
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account", "member","fhbMoney"]),
    valid() {
      return (
        /^(([1-9]\d*)|([0-9]+\.[0-9]{1,2}))$/.test(this.money) &&
        /^1[3,4,5,7,8,9]\d{9}$/.test(this.mobile) &&
        !!this.payType
      );
    },
    payMoney() {
      return !this.payType || this.payType == "4"
        ? this.money
        : (+this.money * 0.1).toFixed(2);
    }
  },
  created() {
    this.$store.dispatch("getFHB");
  },
  activated() {

  },
  mixins: [findMemberByMobile, payMixin],
  methods: {
    save() {
      if (this.account == this.mobile) {
        this.$dialog.alert({
          mes: "赠送会员不能是自己"
        });
        return;
      }
      if (this.payType == "4" && this.member.lineOfCrade < +this.money) {
        this.$dialog.toast({
          mes: "授信金额不足请选择其他支付方式或充值授信金额"
        });
        return;
      }
      if (this.payType == "6" && this.fhbMoney < +this.payMoney) {
        this.$dialog.toast({
          mes: "凤凰宝余额不足请选择其他支付方式"
        });
        return;
      }
      let vm = this;
      this.$dialog.loading.open("赠送中...");
      mui.ajax({
        url: addMemberVonchersHistory,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          amount: this.money,
          mobile: this.mobile,
          payType: this.payType,
          account: this.account,
          token: md5(`gjfengaddMemberVonchersHistory${this.account}${this.mobile}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          //授信额度|凤凰宝直接录入
          if (vm.payType == "4" ) {
            vm.$dialog.toast({
              mes: res.msg
            });
            vm.$store.dispatch("getInfo");
          } else if (vm.payType == "6") {
            vm.$dialog.toast({
              mes: res.msg
            });
            vm.$store.dispatch("getFHB");
          } else if (vm.payType == "1") {
            //支付宝
            vm.checkService(vm.pays["alipay"], function() {
              plus.payment.request(
                vm.pays["alipay"],
                res.result.alyString,
                function(result) {
                  vm.$dialog.alert({
                    mes: "支付成功！"
                  });
                },
                function(e) {
                  vm.$dialog.alert({
                    mes: "支付失败:" + e.message
                  });
                }
              );
            });
          } else {
            //微信支付
          }
        },
        error() {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: "端口异常，请稍后重试"
          });
        }
      });
    },
    goCouponHistory() {
      this.$router.push({ name: "CouponHistory" });
    }
  }
}
</script>
