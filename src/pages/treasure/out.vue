<template>
  <div>
    <header-top title="金额转移"></header-top>
    <main class='scroll-content-2'>
      <yd-cell-group title="转移信息">
        <yd-cell-item>
          <span slot="left">转移数额：</span>
          <yd-input slot="right" v-model="money" placeholder="输入转移数额"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">转移会员：</span>
          <input type="tel" slot="right" v-model="mobile" placeholder="请输入会员手机号" @input="findMember">
        </yd-cell-item>
        <yd-cell-item v-if="mobileName">
          <span slot="left">会员名称：</span>
          <yd-input slot="right" readonly v-model="mobileName" :show-clear-icon="false"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <div style="padding:0 .2rem;">
        <yd-button size="large" :type="valid?'primary':'disabled'" @click.native="showPassword=true"> 确 认 转 移 </yd-button>
      </div>
    </main>
    <yd-keyboard v-model="showPassword" :callback="checkPayPwd" ref="keyboard" title="安全键盘" input-text="请输入支付密码"></yd-keyboard>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import {transferFhTreasurePage} from "../../api/index";
import { findMemberByMobile } from "components/common/mixin";
export default {
  name: "TreasureOut",
  data() {
    return {
      money: "",
      mobile: "",
      mobileName: "",
      showPassword: false
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"]),
    valid() {
      return (
        /^(([1-9]\d*)|([0-9]+\.[0-9]{1,2}))$/.test(this.money) &&
        /^1[3,4,5,7,8,9]\d{9}$/.test(this.mobile) 
        && this.mobile != this.account
      );
    }
  },
  created() {},
  mixins: [findMemberByMobile],
  activated() {},
  methods: {
    checkPayPwd(val) {
      this.$dialog.loading.open("验证支付密码");
      this.save(val);
    },

    save(val) {
     
      let vm = this;
      mui.ajax({
        url: transferFhTreasurePage,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          tradeMoney: this.money,
          mobile: this.mobile,
          payPassword: val,
          account: this.account,
          token: md5(`gjfengtransferFhTreasurePage${this.mobile}${this.account}${val}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: res.msg,
              callback:()=>{
                 vm.$store.dispatch("getInfo");
              }
            });
            vm.showPassword = false;
           
          } else if (res.code == 401) {
            vm.$dialog.confirm({
              title: "忘记密码？",
              mes: `${res.msg}，前往设置`,
              opts: () => {
                vm.$router.push({ name: "PwdManage" });
              }
            });
            vm.$refs.keyboard.$emit(
              "ydui.keyboard.error",
              "对不起，您的支付密码不正确，请重新输入。"
            );
          } else if (res.code == 402) {
            vm.$dialog.alert({
              mes: res.msg,
              callback: () => {
                vm.$router.push({ name: "PwdManage" });
              }
            });
          } else {
            vm.$dialog.alert({
              mes: res.msg
            });
          }
        },
        error(err) {
          vm.$dialog.loading.close();
          vm.$dialog.toast({
            mes: "超时，请稍后重试",
            callback: () => {
              vm.$refs.keyboard.$emit("ydui.keyboard.error", "超时，请稍后重试");
            }
          });
        }
      });
    }
  }
};
</script>
