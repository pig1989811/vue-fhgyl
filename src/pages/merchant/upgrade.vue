<template>
  <div>
    <header-top title="商家升级"></header-top>
    <main class='scroll-content-2'>
      <div class="box">
        <checker v-model="type" class="flex" default-item-class="self-checker-item" selected-item-class="self-checker-selected" type="radio" :radio-required="true">
          <checker-item v-for="(item,index) in list" :key="index" :value="item" class="flex-1" v-if="+item.key>+member.merchantType">
            {{item.value}}
          </checker-item>
        </checker>
      </div>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">应付金额</span>
          <span slot="right" style="font-size:0.3rem;color:#ff5350;">{{payMoney}}</span>
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
      <check-icon :value.sync="checkProtocol" type="plain">{{checkProtocol?'同意':'不同意'}}</check-icon>
      <router-link :to="{name:'MerchantProtocol',params: {key: type && type.key}}" class="protocol">《服务条款》和《法律声明》</router-link>
      <div class="btn-container flex just-around" style="padding:0 .2rem;">
        <yd-button :type="valid?'primary':'disabled'" @click.native="save" size="large"> 确 认 充 值
        </yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { Checker, CheckerItem, CheckIcon } from "vux";
import { addMerchantRechargeHistory } from "../../api/index";
import { payMixin } from "components/common/mixin";
export default {
  name: "Upgrade",
  data() {
    return {
      type: null,
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
      pays: {}
    };
  },
  components: { HeaderTop, Checker, CheckerItem, CheckIcon },
  computed: {
    ...mapState(["account", "member"]),
    valid() {
      return this.type && !!this.payType && this.checkProtocol;
    },
    payMoney() {
      if (this.type) {
        switch (this.type.key) {
          case "1":
            return 1200;
          case "2":
            return 6000;
          case "3":
            return 18000;
        }
      }
    }
  },
  mixins: [payMixin],
  created() {},
  activated() {},
  methods: {
    save() {
      let vm = this;
      this.$dialog.loading.open("充值中...");
      mui.ajax({
        url: addMerchantRechargeHistory,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          merchantType: this.type.key,
          payType: this.payType,
          tradeMoney: this.payMoney,
          token: md5(
            `gjfengaddMerchantRechargeHistory${this.account}${this.type.key}`
          )
        },
        success(res) {
          vm.$dialog.loading.close();
          //凤凰宝直接充
          if (vm.payType == "3") {
            vm.$dialog.toast({
              mes: res.msg,
              callback: () => {
                if (res.code == 200) {
                  vm.$store.dispatch("getInfo");
                  vm.$router.go(-1);
                }
              }
            });
          } else if (vm.payType == "1") {
            //支付宝
            vm.checkService(vm.pays["alipay"], function() {
              plus.payment.request(
                vm.pays["alipay"],
                res.result.alyString,
                function(result) {
                  vm.$dialog.alert({
                    mes: "支付成功！",
                    callback: () => {
                      vm.$store.dispatch("getInfo");
                      vm.$router.go(-1);
                    }
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
        },
        error() {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: "端口异常，请稍后重试"
          });
        }
      });
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
