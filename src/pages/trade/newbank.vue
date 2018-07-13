<template>
  <div>
    <header-top title="添加银行卡"></header-top>
    <main class='scroll-content-2'>

      <group style="margin-bottom:.2rem;">
        <selector title="开户银行" v-model="bankId" placeholder="请选择开户银行" :options="bankNameList" direction="rtl"></selector>
        <x-input title="支行名称" v-model="bankSub" placeholder="如：广州珠江新城支行" text-align="right"></x-input>
        <x-address title="省份城市" v-model="cityValue" :list="addressData" placeholder="请选择开户银行省市" :show.sync="showAddress" :hide-district="true"></x-address>
        <x-input title="开户人" :value="member.name" :show-clear="false" :readonly="true"  text-align="right"></x-input>
        <x-input title="卡号" v-model="bankCard" placeholder="请输入卡号" type="tel"  text-align="right"></x-input>
      </group>
      <div style="padding:0 .2rem;">
        <yd-button size="large" :type="valid?'primary':'disabled'" @click.native="addBankCard">确定添加</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import {
  Group,
  Cell,
  Selector,
  XInput,
  XAddress,
  ChinaAddressV4Data,
  PopupPicker
} from "vux";
import { getStore } from "components/common/mixin";
import { bindBank } from "../../api/index";
import District from "ydui-district/dist/gov_province_city_id";
export default {
  name: "NewBank",
  data() {
    return {
      oldBack: mui.back,
      // bankId: [],
      // bankNameList: [[
      //   { name: "中国工商银行", value: "390" },
      //   { name: "华夏银行", value: "391" },
      //   { name: "中国民生银行", value: "402" },
      //   { name: "上海银行", value: "413" },
      //   { name: "北京银行", value: "424" },
      //   { name: "浦东发展银行", value: "468" },
      //   { name: "广发银行", value: "479" },
      //   { name: "平安银行", value: "490" },
      //   { name: "中国建设银行", value: "501" },
      //   { name: "中国农业银行", value: "529" },
      //   { name: "中国银行", value: "540" },
      //   { name: "中国人民银行", value: "549" },
      //   { name: "汇丰银行 ", value: "603" },
      //   { name: "花旗银行", value: "610" },
      //   { name: "交通银行", value: "618" },
      //   { name: "渣打银行", value: "688" },
      //   { name: "招商银行", value: "696" },
      //   { name: "广州银行", value: "704" },
      //   { name: "中国邮政储蓄银行", value: "707" },
      //   { name: "中信银行", value: "718" },
      //   { name: "中国光大银行", value: "729" }
      // ]],
      bankId: "",
      bankNameList: [
        { key: 390, value: "中国工商银行" },
        { key: 391, value: "华夏银行" },
        { key: 402, value: "中国民生银行" },
        { key: 413, value: "上海银行" },
        { key: 424, value: "北京银行" },
        { key: 468, value: "浦东发展银行" },
        { key: 479, value: "广发银行" },
        { key: 490, value: "平安银行" },
        { key: 501, value: "中国建设银行" },
        { key: 529, value: "中国农业银行" },
        { key: 540, value: "中国银行" },
        { key: 549, value: "中国人民银行" },
        { key: 603, value: "汇丰银行" },
        { key: 610, value: "花旗银行" },
        { key: 618, value: "交通银行" },
        { key: 688, value: "渣打银行" },
        { key: 696, value: "招商银行" },
        { key: 704, value: "广州银行" },
        { key: 707, value: "中国邮政储蓄银行" },
        { key: 718, value: "中信银行" },
        { key: 729, value: "中国光大银行" }
      ],
      bankSub: "",
      cityValue: [],
      addressData: ChinaAddressV4Data,
      showAddress: false,
      holder: "",
      bankCard: ""
    };
  },
  components: {
    HeaderTop,
    Group,
    Cell,
    Selector,
    XInput,
    XAddress,
    PopupPicker
  },
  computed: {
    ...mapState(["account", "certificateStatus", "member"]),
    validBankCard() {
      return /^\d{15,19}$/.test(this.bankCard);
    },
    valid() {
      return (
        !!this.bankId &&
        !!this.bankSub &&
        !!this.cityValue &&
        !!this.validBankCard
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      mui.back = vm.goBack;
    });
  },
  beforeRouteLeave(to, from, next) {
    mui.back = this.oldBack;
    next();
  },
  created() {},
  activated() {},
  methods: {
    goBack() {
      if (this.showAddress) {
        this.showAddress = false;
      }  else {
        this.$router.go(-1);
      }
    },
    addBankCard() {
      let vm = this;
      if (!this.certificateStatus && !this.holder) {
        this.$dialog.toast({
          mes: "请填写开户人"
        });
        return;
      }
      this.$dialog.loading.open("申请中...");
      mui.ajax({
        url: bindBank,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          bankId: this.bankId,
          bankSub: this.bankSub,
          bankCard: this.bankCard,
          holder: this.certificateStatus ? this.member.name : this.holder,
          cityValue: this.cityValue.join(","),
          account: this.account,
          token: md5(`gjfengbindBank${this.account}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: res.msg,
              callback: () => {
                vm.$router.go(-1);
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.tips {
  display: block;
  margin-top: 1rem;
  text-align: center;
}
</style>
