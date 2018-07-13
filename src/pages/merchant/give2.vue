<template>
  <div>
    <header-top title="赠送尊享版商家"></header-top>
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
      <!-- <div style="padding: .2rem;">
        <check-icon :value.sync="checkProtocol" type="plain">{{checkProtocol?'同意':'不同意'}}</check-icon>
        <router-link :to="{name:'MerchantProtocol',params: {key: type.key}}" class="protocol">《服务条款》和《法律声明》</router-link>
      </div> -->
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
import { addMerchantGiveHistory } from "../../api/index";
import { findMemberByMobile } from "components/common/mixin";
export default {
  name: "MerchantIndex",
  data() {
    return {
      type: {
        key: "1",
        value: "商家版"
      },
      // checkProtocol: true,
      payType: "3",
      list: [
        {
          key: "1",
          value: "商家版"
        },
        {
          key: "2",
          value: "企业版"
        }
      ],
      mobile: "",
      mobileName: ""
    };
  },
  components: { HeaderTop, Checker, CheckerItem, CheckIcon },
  computed: {
    ...mapState(["account"]),
    valid() {
      return /^1[3,4,5,7,8,9]\d{9}$/.test(this.mobile);
    }
  },
  mixins: [findMemberByMobile],
  created() {},
  activated() {},
  methods: {
    save() {
      if (this.account == this.mobile) {
        this.$dialog.alert({
          mes: "赠送会员不能是自己"
        });
        return;
      }
      let vm = this;
      this.$dialog.loading.open("赠送中...");
      mui.ajax({
        url: addMerchantGiveHistory,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          mobile: this.mobile,
          type: this.type.key,
          token: md5(
            `gjfengaddMerchantGiveHistory${this.account}${this.mobile}`
          )
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: res.code == 200 ? "赠送成功！" : res.msg
          });
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