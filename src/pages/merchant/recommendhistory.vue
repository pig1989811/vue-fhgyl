<template>
  <div>
    <header-top title="联盟商家推荐奖励"></header-top>
    <main class='scroll-content-2'>
      <section v-if="list.length">
        <ul>
          <li class="item" v-for="(item,index) in list" :key="index">
            <div class="item-top flex just-between align-center">
              <span class="time">{{formatTime(item.addTime, true)}}</span>
              <span>{{item.comMemberName}}</span>
            </div>
            <div class="item-bottom flex just-between align-center">
              <span class="money">{{item.directMemberMoney}}
                <span class="fs-14">元</span>
              </span>
              <p class="fs-14">{{item.comMemberMobile}}</p>
            </div>
          </li>
        </ul>
      </section>
      <section class="hv-cen text-center" v-else>
        <span class="iconfont self-noorder" style="font-size:40px;"></span>
        <p>没有数据</p>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { findMemberDirectMemberMoney } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "RecommendHistory",
  data() {
    return {
      list: []
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"])
  },
  mixins: [mixin],
  created() {
    this.getInfo();
  },
  activated() {},
  methods: {
    getInfo() {
      let vm = this;
      mui.ajax({
        url: findMemberDirectMemberMoney,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          token: md5(`gjfengfindMemberDirectMemberMoney`)
        },
        success(res) {
          vm.list = res.result;
        }
      });
    },
    tranferType(type) {
      switch (type) {
        case "0":
          return "分红权";
          break;
        case "1":
          return "余额";
          break;
        case "8":
          return "积分";
          break;
      }
    },
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.item {
  background-color: @white;
  margin-top: @pd;
  .pd;
  .time {
    font-size: 15px;
    vertical-align: 2px;
  }
  .money {
    color: @red;
    font-size: 20px;
    vertical-align: top;
  }
  .status {
    font-size: 0.28rem;
    &.status-0 {
      color: @blue;
    }
    &.status-1 {
      color: @green;
    }
    &.status-2 {
      color: @gold;
    }
    &.status-3 {
      color: @lightgray;
    }
  }
}
</style>
