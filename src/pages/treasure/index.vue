<template>
  <div>
    <header-top title="凤凰宝"></header-top>
    <main class='scroll-content-2'>
      <section class="container">
        <p>凤凰宝余额</p>
        <div>{{fhbMoney}}</div>
      </section>
      <yd-cell-group>
        <yd-cell-item arrow v-for="(item,index) in menu" :key="index" type="label" @click.native="navigate(item.link)">
          <span slot="icon" :class="['iconfont-large',item.icon]" :style="{'color':item.color}"></span>
          <span slot="left">{{item.text}}</span>
        </yd-cell-item>
      </yd-cell-group>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { toFhTreasurePage } from "../../api/index";
import {getStore} from "components/common/mixin"
export default {
  name: "TreasureIndex",
  data() {
    return {
      menu: [
        {
          icon: "self-zhuanru",
          text: "奖励金转入凤凰宝",
          link: "/treasure/in",
          color: "#f47874"
        },
        {
          icon: "self-zhuanchu",
          text: "凤凰宝金额转移",
          link: "/treasure/out",
          color: "#ffd700"
        },
        {
          icon: "self-xiaofeijilu",
          text: "凤凰宝交易记录",
          link: "/treasure/list",
          color: "#0f8ee9"
        },
        {
          icon: "self-tixian",
          text: "凤凰宝提现",
          link: "/treasure/cash",
          color: "#f9a340"
        }
      ],
      info:{}
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account","fhbMoney"])
  },
  created() {},
  activated() {
    this.$store.dispatch("getFHB");
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.container {
  padding: 0.8rem 0.3rem;
  margin-bottom: @pd *2;
  background-color: @red;
  color: @white;
  p {
    font-size: 0.32rem;
  }
  div {
    margin-top: @pd * 3;
    font-size: 1rem;
    font-weight: bold;
  }
}
</style>