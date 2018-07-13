<template>
  <div>
    <header-top title="商家升级赠送"></header-top>
    <main class='scroll-content-2'>
      <div class="box">
        <checker v-model="type" class="flex" default-item-class="self-checker-item" selected-item-class="self-checker-selected" type="radio" :radio-required="true">
          <checker-item v-for="(item,index) in list" :key="index" :value="item" class="flex-1">
            {{item.value}}
          </checker-item>
        </checker>
      </div>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">赠送会员：</span>
          <input type="tel" slot="right" v-model="mobile" placeholder="请输入会员手机号" @input="findMember">
        </yd-cell-item>
        <yd-cell-item v-if="mobileName">
          <span slot="left">会员名称：</span>
          <yd-input slot="right" readonly v-model="mobileName" :show-clear-icon="false"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">应付金额</span>
          <span slot="right" style="font-size:0.3rem;color:#ff5350;">{{payMoney}}</span>
        </yd-cell-item>
        <yd-cell-item v-show="payType=='3'">
          <span slot="left">当前凤凰宝余额</span>
          <input slot="right" type="text" readonly style="text-align:right;color:#04be02;" v-model="fhbMoney">
        </yd-cell-item>
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea;"></span>
          <span slot="left">支付宝</span>
          <input slot="right" type="radio" value="1" v-model="payType" />
        </yd-cell-item>
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-yuanbao danger-color"></span>
          <span slot="left">凤凰宝</span>
          <input slot="right" type="radio" value="3" v-model="payType" />
        </yd-cell-item> -->
      </yd-cell-group>
      <div style="padding: .2rem;">
        <check-icon :value.sync="checkProtocol" type="plain">{{checkProtocol?'同意':'不同意'}}</check-icon>
        <router-link :to="{name:'MerchantProtocol',params: {key: type.key}}" class="protocol">《服务条款》和《法律声明》</router-link>
      </div>
      <div class="btn-container flex just-around" style="padding:0 .2rem;">
        <yd-button type="warning" @click.native="goMerchantHistory" style="font-size:15px;"> 赠 送 记 录
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
import HeaderTop from "components/header/index";
import { Checker, CheckerItem, CheckIcon } from "vux";
import { addMerchantRechargeToMemberHistory } from "../../api/index";
import { findMemberByMobile, payMixin } from "components/common/mixin";
export default {
  name: "MerchantIndex",
  data() {
    return {
      type: {
        key: "1",
        value: "商家版"
      },
      checkProtocol: true,
      payType: "1",
      list: [
        {
          key: "1",
          value: "商家版"
        },
        {
          key: "2",
          value: "企业版"
        },
        {
          key: "3",
          value: "商家代理"
        }
      ],
      mobile: "",
      mobileName: "",
      pays: {}
    };
  },
  components: { HeaderTop, Checker, CheckerItem, CheckIcon },
  computed: {
    ...mapState(["account", "fhbMoney"]),
    valid() {
      return (
        /^1[3,4,5,7,8,9]\d{9}$/.test(this.mobile) &&
        !!this.payType &&
        this.checkProtocol
      );
    },
    payMoney() {
      switch (this.type.key) {
        case "1":
          return 1200;
        case "2":
          return 6000;
        case "3":
          return 18000;
      }
    }
  },
  mixins: [findMemberByMobile, payMixin],
  created() {
    },
  activated() {
    this.$store.dispatch("getFHB");
  },
  methods: {
    save() {
      if (this.account == this.mobile) {
        this.$dialog.alert({
          mes: "赠送会员不能是自己"
        });
        return;
      }
      if (this.payType == "3" && this.fhbMoney < +this.payMoney) {
        this.$dialog.toast({
          mes: "凤凰宝余额不足请选择其他支付方式"
        });
        return;
      }
      let vm = this;
      this.$dialog.loading.open("赠送中...");
      mui.ajax({
        url: addMerchantRechargeToMemberHistory,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          mobile: this.mobile,
          merchantType: this.type.key,
          tradeMoney: this.payMoney,
          payType: this.payType,
          token: md5(
            `gjfengaddMerchantRechargeToMemberHistory${this.account}${this.mobile}${this.type.key}`
          )
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            //凤凰宝直接充
            if (vm.payType == "3") {
              vm.$dialog.toast({
                mes: res.msg
              });
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
            }
          } else {
            vm.$dialog.alert({
              mes: res.msg
            });
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
    goMerchantHistory() {
      this.$router.push({ name: "GiveHistory" });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.box {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
}
</style>