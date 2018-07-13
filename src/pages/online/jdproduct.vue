<template>
  <div>
    <header-top title="商品详情"></header-top>
    <main class='scroll-content'>
      <section class="info-1">
        <swiper :aspect-ratio="1" :show-desc-mask="false" dots-position="center" :loop="false">
          <swiper-item v-for="(item, index) in info&&info.gallery" :key="index">
            <img :src="item.imgUrl">
          </swiper-item>
        </swiper>
        <p>{{info.goodsName}}</p>
        <p class="danger-color fs-16 flex align-center">
          <span>￥{{info.shopPrice}}</span>
        </p>
      </section>
      <section>
        <load-more tip="商品图文详情" :show-loading="false" background-color="rgb(236, 227, 124)" style="margin-bottom:0;"></load-more>
        <div v-html="info.goodsDesc" class="pd-content"></div>
      </section>
    </main>
    <footer class="fix-footer flex align-center" style="border-top:1px solid #dfdfdf;">
      <x-button @click.native="show=true" type='warn'>立即购买</x-button>
    </footer>
    <div class="actionsheet-container">
      <transition name="actionsheet-mask">
        <div class="mask" @click="show=false" v-show="show"></div>
      </transition>
      <div class="actionsheet-content" :class="{'actionsheet-toggle':show}">
        <div class="top flex">
          <div class="img-cover">
            <img :src="info.goodsThumb" alt="">
          </div>
          <div class="info flex flex-1">
            <p>{{info.goodsName}}</p>
            <p class="danger-color fs-14">￥{{info.shopPrice}}</p>
          </div>
          <div class="close" @click="show=false">
            <span class="iconfont-large self-guanbi"></span>
          </div>
        </div>
        <div class="middle flex align-center">
          <h3>请选择数量</h3>
          <yd-spinner v-model="pdnum" :min="1" :max="999"></yd-spinner>
        </div>
        <div class="bottom">
          <yd-button size="large" type="danger" @click.native="buynow">确定</yd-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { XButton, Swiper, SwiperItem, LoadMore } from "vux";
import {
  findJdProprietaryProDetail,
  addJdProprietaryProduct,
  toAddOrder
} from "../../api/index";
export default {
  name: "JDProduct",
  data() {
    return {
      oldBack: mui.back,
      info: {},
      show: false,
      pdnum: 1
    };
  },
  components: { HeaderTop, XButton, Swiper, SwiperItem, LoadMore },
  computed: { ...mapState(["account"]) },
  created() {},
  activated() {
    this.getInfo();
    this.pdnum = 1;
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
  methods: {
    goBack() {
      this.show ? (this.show = false) : this.$router.go(-1);
    },
    getInfo() {
      let vm = this;
      mui.ajax({
        url: findJdProprietaryProDetail,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          goodsId: this.$route.query.id,
          token: md5(`gjfengfindJdProprietaryProDetail${this.$route.query.id}`)
        },
        success(res) {
          let _result = res.result;
          if(_result.gallery.length==0){
            _result.gallery.push({imgUrl:_result.goodsThumb})
          }
          vm.info = _result;
          vm.$nextTick(function() {
            Array.from(
              document
                .querySelector(".pd-content")
                .querySelectorAll("img,table,div,p")
            ).forEach(function(e) {
              e.style.width = "100%";
            });
            Array.from(
              document
                .querySelector(".pd-content")
                .querySelectorAll("div,p")
            ).forEach(function(e) {
              e.style.lineHeight = 1;
            });
          });
        }
      });
    },
    buynow() {
      let vm = this;
      this.$dialog.loading.open("正在发起订单...");
      mui.ajax({
        url: addJdProprietaryProduct,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          proId: this.$route.query.id,
          token: md5(`gjfengaddJdProprietaryProduct${this.$route.query.id}`)
        },
        success(res) {
          mui.ajax({
            url: toAddOrder,
            type: "post",
            headers: { "app-version": "v1.0" },
            data: {
              "orderAddVos[0].goodsId": vm.$route.query.id,
              "orderAddVos[0].goodsAttrIds": "",
              "orderAddVos[0].goodsNum": vm.pdnum,
              goodSource: 1,
              orderAddressId: "",
              logist: 0,
              account: vm.account,
              token: md5(`gjfengtoAddOrder${vm.account}`)
            },
            success(res) {
              vm.$dialog.loading.close();
              if (res.code == 200) {
                vm.show = false;
                let _result = res.result;
                vm.$store.commit("RECORD_SETTLE_LIST", _result);
                vm.$store.commit(
                  "SET_PAY_PASSWORD",
                  _result.gjfMemberInfo.payPassword ? true : false
                );
                vm.$router.push({
                  name: "JDSettle"
                });
              } else {
                vm.$dialog.alert({
                  mes: res.msg
                });
              }
            }
          });
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
section {
  background-color: @white;
  margin-bottom: @pd;
}

.info-1 {
  img {
    .wh(100%,100%);
  }
  p {
    .pd;
    font-size: 0.3rem;
  }
}

.actionsheet-mask-enter,
.actionsheet-mask-leave-active {
  opacity: 0;
}

.actionsheet-mask-leave-active,
.actionsheet-mask-enter-active {
  transition: opacity 300ms !important;
}

.mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.actionsheet-content {
  position: fixed;
  left: 0;
  bottom: 0;
  transform: translate3d(0, 120%, 0);
  backface-visibility: hidden;
  z-index: 1000;
  width: 100%;
  transition: transform 0.3s;
  background-color: @white;
  .top {
    position: relative;
    margin-bottom: 0.6rem;
    .img-cover {
      position: absolute;
      left: 8px;
      top: -0.4rem;
      border: 1px solid #dfdfdf;
      background-color: @white;
      .wh(2rem, 2rem);
      border-radius: 5px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }
    .info {
      padding-left: 2.3rem;
      flex-direction: column;
      justify-content: space-between;
      p {
        width: 90%;
        padding-top: @pd;
        &:first-of-type {
          .multi-ellipsis(2);
          font-size: 0.28rem;
        }
      }
    }
    .close {
      padding: 5px;
    }
  }
  .middle {
    padding-left: @pd;
    h3 {
      margin-right: @pd;
    }
  }
  .bottom {
    padding: 0 @pd @pd * 2;
  }
}

.actionsheet-toggle {
  transform: translate3d(0, 0, 0);
}
.pd-content{
  line-height: 0;
}
</style>