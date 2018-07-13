<template>
  <div>
    <header-top title="升级赠送记录"></header-top>
    <main class='scroll-content-2'>
      <ul>
        <li class="item flex just-between" v-for="(item,index) in list" :key="index">
          <div>
            <p>{{formatTime(item.tradeTime,true)}}</p>
            <p class="danger-color">{{formatType(item.giveType)}}</p>
          </div>
          <div>
            <p>{{item.memberName}}</p>
            <p>{{item.memberMobile}}</p>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { findMerchantGiveHistory } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "GiveHistory",
  data() {
    return {
      list: []
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"])
  },
  created() {
    this.getInfo();
  },
  activated() {},
  mixins: [mixin],
  methods: {
    getInfo() {
      let vm = this;
      mui.ajax({
        url: findMerchantGiveHistory,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          token: md5(`gjfengfindMerchantGiveHistory${this.account}`)
        },
        success(res) {
          vm.list = res.result;
        }
      });
    },
    formatType(type) {
      switch (type) {
        case "1":
          return "商家版";
          break;
        case "2":
          return "企业版";
          break;
        case "3":
          return "商家代理版";
          break;
        case "4":
          return "企业代理版";
          break;
        case "5":
          return "地级市代理";
          break;
        case "6":
          return "市级代理";
          break;
        case "7":
          return "直辖市代理";
          break;
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.item {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  font-size: .3rem;
}
</style>