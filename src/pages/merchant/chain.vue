<template>
  <div>
    <header-top title="商家专享"></header-top>
    <main class='scroll-content-2'>
      <div class="container">
        <img :src="getLocalImg('chain.jpg')" @click="goMerchant">
      </div>
    </main>
  </div>
</template>
<script>
import {mapState} from "vuex";
import HeaderTop from "components/header/index";
import { localImg } from "components/common/mixin";

export default {
  name: "MerchantChain",
  data() {
    return {};
  },
  components: { HeaderTop },
  computed: {
    ...mapState(['member'])
  },
  mixins: [localImg],
  created() {},
  activated() {},
  methods: {
    goMerchant(){
      if(!this.member){
        this.$dialog.alert({
          mes: "请先登录！",
          callback: () => {
            this.$router.push({ name: "Login" });
          }
        });
        return;
      }
      if (this.member.merchantType == "0") {
        this.$dialog.confirm({
          title: "提示",
          mes: "你不是联盟商家，去升级?",
          opts: () => {
            this.$router.push({ name: "Upgrade" });
          }
        });
      } else {
        this.$router.push({ name: "MerchantIndex", params: { update: true } });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.container {
  img{
    width:100%;
  }
}
</style>