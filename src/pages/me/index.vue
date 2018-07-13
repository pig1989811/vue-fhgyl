<template>
  <div>
    <header-top :back="false" title="个人中心"></header-top>
    <main class="scroll-content">
      <!-- 头部 -->
      <section class="head-container">
        <div class="head-cover" :style="{'background-image':formatBg('mine_background.png')}">
          <router-link :to="{name:'Update'}">
            <div class="head-img" v-lazy:background-image="getImgPath(member.imgHeadUrl)"></div>
          </router-link>
        </div>
        <div class="head-info">
          <div class="name">
            <span>{{member.nickName||member.mobile}}</span>
            <span class="iconfont self-male" :style="{'color':'#57A9FF'}" v-if="member.sex=='1'"></span>
            <span class="iconfont self-female" :style="{'color':'#f860ef'}" v-else-if="member.sex=='2'"></span>
            <span class="iconfont self-sex" :style="{'color':'#4cd864'}" v-else></span>
            <span class="iconfont self-vip2 vip-tag" v-if="member.isActiveMember=='1'"></span>
          </div>
          <p class="desc">{{member.remark||'-介绍信息-'}}</p>
        </div>
      </section>
      <!-- 订单 -->
      <section class="order-container">
        <yd-cell-group>
          <yd-cell-item arrow type="label" @click.native="goOrder(0)">
            <span class="iconfont self-dingdanguanli" slot="icon" style="font-size:20px;"></span>
            <span slot="left">我的订单</span>
            <span slot="right">查看所有订单</span>
          </yd-cell-item>
        </yd-cell-group>
      </section>
      <!-- 菜单 -->
      <yd-cell-group>
        <yd-cell-item arrow type="label" @click.native="navigate('/me/qrcode')">
          <span class="iconfont-large self-qrcode c1" slot="icon"></span>
          <span slot="left">分享二维码</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="goWallet">
          <span class="iconfont-large self-wallet c2" slot="icon"></span>
          <span slot="left">我的钱包</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="goStore" v-if="+member.type==0">
          <span class="iconfont-large self-seller c1" slot="icon"></span>
          <span slot="left">商家入驻</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="goStore" v-if="+member.type==1">
          <span class="iconfont-large self-seller c1" slot="icon"></span>
          <span slot="left">我是商家</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="navigate('/merchant/upgrade')" v-if="(member.type=='1' && +member.merchantType<3)">
          <span class="iconfont-large self-shenghuofuwu c2" slot="icon"></span>
          <span slot="left">联盟商家升级</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="navigate('/merchant/give2')" v-if="+member.merchantType>=3">
          <span class="iconfont-large self-shenghuofuwu c2" slot="icon"></span>
          <span slot="left">赠送商家版或企业版</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group>
        <yd-cell-item arrow type="label" @click.native="navigate('/me/pwdmanage')">
          <span class="iconfont-large self-setting c1" slot="icon"></span>
          <span slot="left">设置密码</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="navigate('/me/collect')">
          <span class="iconfont-large self-heart c1" slot="icon"></span>
          <span slot="left">我的收藏</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="navigate('/address/index?source=5')">
          <span class="iconfont-large self-address c2" slot="icon"></span>
          <span slot="left">地址管理</span>
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="navigate('/address/jdaddress')">
          <span class="iconfont-large self-address c2" slot="icon"></span>
          <span slot="left">京东地址管理</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group>
        <yd-cell-item arrow type="label" @click.native="showDialog = true">
          <span class="iconfont-large self-service c1" slot="icon"></span>
          <span slot="left">联系客服</span>
          <!-- <span slot="right" style="color:gold;">4009019517</span> -->
        </yd-cell-item>
        <yd-cell-item arrow type="label" @click.native="navigate('/me/updateApp')">
          <span class="iconfont-large self-gengxin c2" slot="icon"></span>
          <span slot="left">APP更新</span>
          <yd-badge slot="right" type="danger" v-if="update">新版本</yd-badge>
        </yd-cell-item>
      </yd-cell-group>
      <!-- 退出按钮 -->
      <section class="btn-container">
        <button type="button" class="sign-btn" @click="signOut">退出登录</button>
      </section>
    </main>
    <footer-bar></footer-bar>
    <cert-modal @callback="settle"></cert-modal>
    <yd-popup v-model="showDialog" position="center" width="80%">
      <div class="tel-container text-center">
        <a href="tel:4009019517" class="tel-box flex align-center">
          <span class="iconfont-large self-dianhua danger-color"></span>
          <span class="tel-num">拨打:4009019517</span>
        </a>
        <yd-button type="danger" @click.native="showDialog=false">关 闭</yd-button>
      </div>
    </yd-popup>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import HeaderTop from "components/header/index";
import FooterBar from "components/footer/index";
import CertModal from "components/common/CertModal";
import { mixin, getStore, removeStore } from "components/common/mixin";
export default {
  name: "Me",
  data() {
    return {
      oldBack: mui.back,
      showDialog: false
    };
  },
  components: { HeaderTop, FooterBar, CertModal },
  created() {},
  computed: {
    ...mapState([
      "certificateStatus",
      "showCertificate",
      "account",
      "member",
      "update"
    ]),
    ...mapGetters(["cartNum"])
  },
  mixins: [mixin],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.plusReady();
    });
  },
  beforeRouteLeave(to, from, next) {
    mui.back = this.oldBack;
    next();
  },
  activated() {
    if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.$store.state.positions[
        this.$route.path
      ];
    }
    if (getStore("account") && getStore("account").length > 0) {
      this.$store.commit("SET_ACCOUNT", getStore("account"));
      this.$store.dispatch("getInfo");
      this.$store.dispatch("getCartList");
    } else {
      this.$router.push("/me/login");
    }
  },
  methods: {
    navigate(url) {
      this.$router.push({ path: url });
    },
    goOrder(index) {
      this.$router.push({
        name: "MyOrder",
        params: { update: true },
        query: { id: index }
      });
    },
    goWallet() {
      this.$router.push({ name: "MyWallet", params: { update: true } });
    },
    goStore() {
      //入驻弹窗
      if (this.member.type == "0") {
        this.settle();
        return;
      }
      this.$router.push("/store/my");
    },
    settle() {
      this.$router.push({ path: "/store/settle-2" });
    },
    signOut() {
      removeStore("account");
      removeStore("storeId");
      removeStore("tips");
      this.$store.commit("SET_ACCOUNT", "");
      this.$store.commit("RECORD_BANK_List", []);
      this.$store.commit("RECORD_BANK_CARD", null);
      this.$store.commit("RECORD_MEMBER_INFO", null);

      this.$dialog.toast({
        mes: "退出成功",
        timeout: 1000,
        callback: () => {
          this.$router.replace("/me/login");
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
section {
  background-color: #fff;
  margin-bottom: @pd;
}

.c1 {
  color: #f37370;
}

.c2 {
  color: #f8a24e;
}

.head-container {
  .text-center;
  .head-cover {
    position: relative;
    height: 1.6rem;
    background-size: cover;
    padding: @pd 0;
    a {
      display: block;
      .wh(1.7rem,1.7rem);
      margin: 0 auto;
      z-index: 10;
      border-radius: 50%;
    }
    .head-img {
      .wh(1.6rem, 1.6rem);
      border-radius: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      z-index: 5;
      border: 3px solid rgba(228, 187, 145, 0.6);
    }
  }
  .head-info {
    min-height: 1.6rem;
    padding: @pd @pd/2 0;
    .flex;
    .just-cont(center);
    .align-items(center);
    flex-direction: column;
    .name {
      width: 100%;
      font-size: 0.32rem;
    }
    .desc {
      color: @lightgray;
    }
  }
}
.vip-tag {
  color: #f5ca3a;
  font-size: 0.35rem;
  font-weight: bold;
}
.order-container {
  .order-item {
    .pd-v;
    font-size: 14px;
    .order-left {
      padding-left: 0.2rem;
      color: #333;
    }
    .order-right {
      flex: 1;
      padding-right: 0.24rem;
      text-align: right;
    }
    .order-arrow {
      &::after {
        margin-left: 0.05rem;
        margin-right: -0.08rem;
        font-family: YDUI-INLAY;
        font-size: 12px;
        color: #c9c9c9;
        content: "\E608";
      }
    }
  }
  color: @lightgray;
  .text-center;
  ul {
    margin-top: -@pd;
    padding-bottom: @pd;
  }
  p {
    font-size: 12px;
    margin-top: 3px;
  }
}

.btn-container {
  .pd;
  .sign-btn {
    display: block;
    width: 90%;
    margin: 0 auto;
    color: @white;
    background-color: @red;
    font-size: 0.34rem;
    text-align: center;
    padding: 0.2rem 0;
    border-radius: 5px;
  }
}

.tel-container {
  .pd-h;
  margin: @pd *2 0;
  .tel-box {
    display: block;
    border-radius: 15px;
    border: 1px solid @red;
    box-shadow: 0 0 10px 5px @red inset;
    .pd;
    .mg-v;
    .tel-num {
      margin-left: 0.1rem;
      font-size: 16px;
      vertical-align: 2px;
    }
  }
  button {
    margin-top: @pd * 2;
  }
}
.bounce {
  animation: bounce 2s ease infinite;
}
@keyframes bounce {
  0% {
    transform: scale(0.7);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(0.9);
  }
}
</style>