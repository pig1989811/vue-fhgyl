<template>
  <div>
    <header-top title="我的钱包"></header-top>
    <main class='scroll-content'>
      <section class="wallet-top text-center" :style="{'background-image':formatBg('banner-wallet.png')}">
      </section>
      <!-- 个人福利 -->
      <section class="wallet-tab" v-show="!type">
        <ul class="flex text-center">
          <li v-for="(item,n) in tabs3" :key="'n'+n" class="tab-item">
            <a :href="item.link">
              <p>{{item.text}}</p>
              <p class="danger-color" v-if="item.param=='diviTotalMoney'">{{info[item.param] *100 ||0}}
                <span>%</span>
              </p>
              <p v-else class="danger-color">{{info[item.param] || 0}}</p>
            </a>
          </li>
        </ul>
      </section>
      <yd-grids-group :rows="3" v-if="member.type=='0'">
        <yd-grids-item v-for="(item,i) in menu0" :key="'i'+i" :link="item.link">
          <span slot="icon" :class="['iconfont-large',item.icon]" :style="{color:item.color}"></span>
          <span slot="text">{{item.text}}</span>
        </yd-grids-item>
      </yd-grids-group>
      <yd-grids-group :rows="3" v-if="member.type=='1'">
        <yd-grids-item link="/treasure/index">
          <span slot="icon" class="iconfont-large self-wallet" style="color: #e7d489;"></span>
          <span slot="text">凤凰宝</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/cashhistory">
          <span slot="icon" class="iconfont-large self-tiqulishi" style="color: #663355;"></span>
          <span slot="text">提取历史</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/bankcard">
          <span slot="icon" class="iconfont-large self-yinhangka" style="color: #e7d489;"></span>
          <span slot="text">银行卡</span>
        </yd-grids-item>
        <yd-grids-item v-if="+member.merchantType>0" link="/merchant/coupon">
          <span slot="icon" class="iconfont-large self-tiqufuli" style="color: #e7d489;"></span>
          <span slot="text">赠送代金券</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/welfrecord">
          <span slot="icon" class="iconfont-large self-fulijilu" style="color: #ee3355;"></span>
          <span slot="text">福利记录</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/interest?type=0">
          <span slot="icon" class="iconfont-large self-xiaofeijilu" style="color: #663355;"></span>
          <span slot="text">消费记录</span>
        </yd-grids-item>
        <!-- <yd-grids-item v-if="+member.merchantType>0" link="/merchant/give">
          <span slot="icon" class="iconfont-large self-shenghuofuwu" style="color: #e7d489;"></span>
          <span slot="text">升级赠送</span>
        </yd-grids-item> -->
        <!-- <yd-grids-item link="/trade/interest?type=0">
          <span slot="icon" class="iconfont-large self-xiaofeijilu" style="color: #663355;"></span>
          <span slot="text">消费记录</span>
        </yd-grids-item> -->
      </yd-grids-group>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { countMemberInfo, myWallet } from "../../api/index";
import { mixin, getStore } from "components/common/mixin";
export default {
  name: "MyWallet",
  data() {
    return {
      info0: {},
      info1: {},
      info: {},
      type: 0,
      tabs3: [
        {
          text: "商家联盟推荐奖励",
          param: "directMemberMoney",
          link: "#/merchant/recommendhistory"
        },
        {
          text: "代金券",
          param: "memberVoucherMoney",
          link: "javascript:"
        }
      ],
      menu0: [
        {
          icon: "self-wallet",
          text: "凤凰宝",
          link: "/treasure/index",
          color: "#e7d489"
        },
        {
          icon: "self-tiqulishi",
          text: "提取历史",
          link: "/trade/cashhistory",
          color: "#663355"
        },
        {
          icon: "self-yinhangka",
          text: "银行卡",
          link: "/trade/bankcard",
          color: "#e7d489"
        },
        {
          icon: "self-fulijilu",
          text: "福利记录",
          link: "/trade/welfrecord",
          color: "#ee3355"
        },
        {
          icon: "self-xiaofeijilu",
          text: "消费记录",
          link: "/trade/interest?type=0",
          color: "#663355"
        },
      ]
    };
  },
  components: { HeaderTop},
  computed: {
    ...mapState(["member"])
  },
  mixins: [mixin],
  created() {},
  activated() {
    if (getStore("account") && getStore("account").length > 0) {
      this.$store.commit("SET_ACCOUNT", getStore("account"));
      //this.getInfo();
      setTimeout(()=>{
        this.getWallet();
      },200)
    } else {
      this.$router.push("/me/login");
    }
    if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.$store.state.positions[
        this.$route.path
      ];
    }
  },
  methods: {
    getWallet() {
      let vm = this;
      mui.ajax({
        url: myWallet,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: getStore("account"),
          token: md5(`gjfengmyWallet${getStore("account")}`)
        },
        success(res) {
          vm.info = res.result;
        }
      });
    },
    getInfo() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: countMemberInfo,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: getStore("account"),
          type: this.type,
          token: md5(`gjfengcountMemberInfo${getStore("account")}${this.type}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          vm[`info${vm.type}`] = res.result;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.wallet-top {
  height: 2rem;
  background-size: cover;
  color: @white;
  font-size: 14px;
  .tab-list {
    .flex;
    .just-cont();
    font-size: 14px;
    padding-top: @pd * 2;
    margin-bottom: @pd * 3;
    .tab-item {
      border: 1px solid @white;
      padding: @pd 15px;
      &.tab-active {
        background-color: @white;
        color: @red;
      }
    }
   
  }
  .wallet-today {
    font-size: 16px;
    p {
      margin-top: @pd * 2;
      color: #f6ff00;
      font-size: 20px;
    }
  }
}

.wallet-tab {
  background-color: @white;
  margin-bottom: @pd;
  .tab-item {
    width: 50%;
    a {
      .pd-v;
      display: block;
      p:last-child {
        margin-top: 0.1rem;
        font-size: 16px;
        height: 16px;
      }
    }
    &.tab-item2 {
      width: 50%;
    }
  }
}

.operate-container {
  .pd;
  .mg-v;
  background-color: @white;
}
</style>