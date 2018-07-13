<template>
  <div>
    <header-top title="商品详情"></header-top>
    <main class='scroll-content'>
      <section class="info-1">
        <swiper :aspect-ratio="1" :show-desc-mask="false" dots-position="center" :loop="false">
          <swiper-item v-for="(item, index) in imgList" :key="index">
            <img :src="item">
          </swiper-item>
        </swiper>
        <p>{{info.proName}}</p>
        <p class="danger-color fs-16 flex just-between align-center">
          <template v-if="info.isWholesale=='0'">
            <span v-if="info.isCanUserCou=='0'">￥{{info.productAttrStock&&info.productAttrStock.price}}</span>
            <span v-else-if="info.isCanUserCou=='1'">{{info.productAttrStock&&info.productAttrStock.price}}
              <span class="fs-12">积分</span>
            </span>
            <span v-else-if="info.isCanUserCou=='2'">{{info.productAttrStock&&info.productAttrStock.price}}
              <span class="fs-12">责任金额</span>
            </span>
            <span v-else-if="info.isCanUserCou=='3'">{{info.productAttrStock&&info.productAttrStock.price}}
              <span class="fs-14">代金券</span>
            </span>
          </template>
          <template v-else>
            <span>零售价：￥{{info.productAttrStock&&info.productAttrStock.price}}</span>
          </template>
          <span class="iconfont self-star" @click="collect" v-show="account">收藏</span>
        </p>
      </section>
      <section class="info-2">
        <yd-cell-group>
          <template v-if="info.isWholesale=='0'">
            <yd-cell-item v-if="info.isCanUserCou=='1'">
              <span slot="left">积分使用说明:{{info.productAttrStock&&info.productAttrStock.price}}积分 +
                <span class="danger-color">￥{{info.pointNeedMoney || 0}}</span>
              </span>
            </yd-cell-item>
            <yd-cell-item v-else-if="info.isCanUserCou=='2'">
              <span slot="left">责任金额使用说明:{{info.productAttrStock&&info.productAttrStock.price}}责任金额 +
                <span class="danger-color">￥{{info.pointNeedMoney || 0}}</span>
              </span>
            </yd-cell-item>
            <yd-cell-item v-else-if="info.isCanUserCou=='3'">
              <span slot="left">代金券使用说明:{{info.productAttrStock&&info.productAttrStock.price}}代金券 +
                <span class="danger-color">￥{{info.pointNeedMoney || 0}}</span>
              </span>
            </yd-cell-item>
          </template>
          <template v-else>
            <yd-cell-item>
              <span slot="left" class="primary-color">商家兑换：{{info.productAttrStock&&formatPrice(info.productAttrStock.standardTotalAmount*10)}}
                <span class="iconfont self-quan"></span>
              </span>
            </yd-cell-item>
            <yd-cell-item>
              <span slot="left" class="royal-color">企业兑换：{{info.productAttrStock&&formatPrice(info.productAttrStock.honourTotalAmount*10)}}
                <span class="iconfont self-quan"></span>
              </span>
            </yd-cell-item>
          </template>
          <yd-cell-item v-if="info.isCanUserCou">
            <span slot="left">剩余：{{info.productAttrStock&&info.productAttrStock.repertory}}</span>
          </yd-cell-item>
          <yd-cell-item arrow type="link" :href="'/online/comment?id='+info.proId">
            <span slot="left">商品评价</span>
          </yd-cell-item>
        </yd-cell-group>
      </section>
      <section>
        <load-more tip="商品图文详情" :show-loading="false" background-color="rgb(236, 227, 124)" style="margin-bottom:0;"></load-more>
        <div v-html="info.content" class="pd-content"></div>
      </section>
    </main>
    <footer class="fix-footer flex align-center" style="border-top:1px solid #dfdfdf;">
      <div class="shopping-cart flex just-center align-center" @click="goShoppingCart">
        <span class="iconfont-large self-shopcart"></span>
        <yd-badge type="danger" class="shopping-num" v-show="account&&cartNum>0">{{cartNum}}</yd-badge>
      </div>
      <button @click="buynow" class="flex-1 btn-2">立即购买</button>
      <button @click="add2cart" class="flex-1 btn-1">加入购物车</button>
    </footer>
    <div class="actionsheet-container">
      <transition name="actionsheet-mask">
        <div class="mask" @click="show=false" v-show="show"></div>
      </transition>
      <div class="actionsheet-content" :class="{'actionsheet-toggle':show}">
        <div class="top flex">
          <div class="img-cover">
            <img :src="info.proImg" alt="">
          </div>
          <div class="info flex flex-1">
            <p>{{info.proName}}</p>
            <template v-if="info.isWholesale=='0'">
              <p class="danger-color fs-14" v-if="info.isCanUserCou=='1'">{{info.productAttrStock&&info.productAttrStock.price}}积分+￥{{info.pointNeedMoney}}</p>
              <p class="danger-color fs-14" v-else-if="info.isCanUserCou=='2'">{{info.productAttrStock&&info.productAttrStock.price}}责任金</p>
              <p class="danger-color fs-14" v-else-if="info.isCanUserCou=='3'">{{info.productAttrStock&&info.productAttrStock.price}}代金券</p>
              <p class="danger-color fs-14" v-else>￥{{info.productAttrStock&&info.productAttrStock.price}}</p>
            </template>
            <template v-else>
              <p class="danger-color fs-14" v-if="+member.merchantType>1">{{info.productAttrStock&&formatPrice(info.productAttrStock.honourTotalAmount*10)}}
                <span class="iconfont self-quan"></span>
              </p>
              <p class="danger-color fs-14" v-else>{{info.productAttrStock&&formatPrice(info.productAttrStock.standardTotalAmount*10)}}
                <span class="iconfont self-quan"></span>
              </p>
            </template>
          </div>
          <div class="close" @click="show=false">
            <span class="iconfont-large self-guanbi"></span>
          </div>
        </div>
        <div class="middle">
          <div class="middle-1" v-if="info.goodSoure!='5'">
            <h3>请选择属性：</h3>
            <div class="flex align-center" v-for="(item,index) in info.attrs" :key="index">
              <span class="attr-name fs-14" v-if="info.isCanUserCou=='2'">责任金兑换</span>
              <span class="attr-name fs-14" v-else-if="info.isCanUserCou=='3'">代金券兑换</span>
              <span class="attr-name fs-14" v-else>{{item.attrName}}</span>
              <ul class="attr-list flex-1">
                <li class="attr-item" :class="{'active':attr.selected}" v-for="(attr,attrIndex) in item.attrValues" :key="attr.id" :data-id="attr.id" @click="chooseAttr(item,attr,attrIndex)">{{attr.attrValueId.attrValue}}</li>
              </ul>
            </div>
          </div>
          <yd-cell-group v-else-if="info.isWholesale=='1' && +member.merchantType <2">
            <yd-cell-item arrow type="link" href="/merchant/upgrade">
              <p slot="left">企业版立省
                <span class="danger-color fs-14">￥{{info.productAttrStock.honourPreferentialMoney}}</span>
              </p>
              <span slot="right" class="fs-14">去升级</span>
            </yd-cell-item>
          </yd-cell-group>
          <div class="middle-2">
            <template v-if="info.isWholesale=='1'">
              <div class="flex align-center">
                <h3>请选择运输方式：</h3>
                <checker v-model="transport" @on-change="changeTransport" class="flex" default-item-class="self-checker-item" selected-item-class="self-checker-selected" type="radio" :radio-required="true">
                  <checker-item :value="0" class="flex-1" style="margin-right:.3rem;">
                    快递
                  </checker-item>
                  <checker-item :value="1" class="flex-1">
                    物流
                  </checker-item>
                </checker>
              </div>
              <div v-if="transport==1" class="flex align-center" style="margin-top:.3rem;">
                <h3>请选择数量：</h3>
                <yd-spinner v-model="pdnum" :min="1" :max="info.productAttrStock&&((Math.floor(info.productAttrStock.repertory/(+info.multipleNumber||1)))*(info.multipleNumber||1))" :unit="+info.multipleNumber||1" v-if="info.productAttrStock&&info.productAttrStock.repertory"></yd-spinner>
                <span style="margin-left:.3rem;">库存
                  <span class="danger-color">{{info.productAttrStock&&info.productAttrStock.repertory}}</span>件</span>
              </div>
            </template>
            <template v-if="transport==0">
              <h3>请选择数量</h3>
              <div class="flex align-center">
                <yd-spinner v-model="pdnum" :min="1" :max="1" v-if="info.purchasNum==1" readonly></yd-spinner>
                <div v-else>
                  <yd-spinner v-model="pdnum" :min="1" :max="info.productAttrStock&&((Math.floor(info.productAttrStock.repertory/(+info.multipleNumber||1)))*(info.multipleNumber||1))" :unit="+info.multipleNumber||1" v-if="info.productAttrStock&&info.productAttrStock.repertory"></yd-spinner>
                  <yd-spinner :min="0" :max="0" readonly v-else></yd-spinner>
                </div>
                <p style="margin-left:.2rem;">库存
                  <span class="danger-color">{{info.productAttrStock&&info.productAttrStock.repertory}}</span>件(商品限购
                  <span>{{info.purchasNum}}</span>件)
                </p>
              </div>
            </template>
          </div>
        </div>
        <div class="bottom">
          <yd-button size="large" type="danger" @click.native="cartOrBuy">确定</yd-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import HeaderTop from "components/header/index";
import { LoadMore, Swiper, SwiperItem, Checker, CheckerItem } from "vux";
import {
  onlineProductsDetailInfoInH5,
  addMyCollect,
  stockAndPrice,
  addCart,
  toAddOrder
} from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "Product",
  data() {
    return {
      oldBack: mui.back,
      info: {},
      imgList: [],
      show: false,
      buyType: 0, //购买方式--加入购物车：0，立即购买：1
      pdnum: 1,
      transport: 0, //运输方式--快递：0，物流：1
      attrId: ""
    };
  },
  components: { HeaderTop, LoadMore, Swiper, SwiperItem, Checker, CheckerItem },
  computed: {
    ...mapState(["account", "cartList", "member"]),
    ...mapGetters(["cartNum"]),
    orderType() {
      return this.info.isCanUserCou == "1"
        ? "1"
        : this.info.isCanUserCou == "2"
          ? "2"
          : this.info.isCanUserCou == "3" ? "3" : "0";
    }
  },
  mixins: [mixin],
  created() {},
  activated() {
    // this.imgList = [];
    this.info = {};
    //this.pdtype = this.$route.query.pdtype;
    this.pdnum = 1;
    this.transport = 0;
    if (this.account) {
      this.$store.dispatch("getCartList");
    }
    this.getInfo();
    // if (this.$store.state.positions[this.$route.path]) {
    //   document.querySelector("main").scrollTop = this.$store.state.positions[
    //     this.$route.path
    //   ];
    // }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      mui.back = vm.goBack;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.imgList = [];
    mui.back = this.oldBack;
    next();
  },
  mounted() {},
  methods: {
    goBack() {
      this.show ? (this.show = false) : this.$router.go(-1);
    },
    getInfo() {
      let vm = this;
      mui.ajax({
        url: onlineProductsDetailInfoInH5,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id: this.$route.query.id,
          token: md5(
            `gjfengonlineProductsDetailInfoInH5${this.$route.query.id}`
          )
        },
        success(res) {
          if (res.code !== 200) {
            vm.$dialog.alert({
              mes: "该商品数据异常",
              callback: () => {
                vm.$router.go(-1);
              }
            });
            return;
          }
          let _result = res.result;
          // 轮播图单独处理
          for (let i = 3; i <= 5; i++) {
            if (_result[`para${i}`]) {
              vm.imgList.push(_result[`para${i}`]);
            }
          }
          for (let i = 1; i <= 2; i++) {
            if (_result[`para${i}`]) {
              vm.imgList.push(_result[`para${i}`]);
            }
          }
          //图片路径处理
          _result.content = _result.content.replace(
            /"\/userfiles/g,
            "\"http://jin.gzfzsw.top/userfiles"
          );
          if (_result.goodSoure != "2"||_result.goodSoure != "5") {
            _result.attrs&&_result.attrs.forEach((item, index) => {
              //排序：防止数据错乱
              item.attrValues.sort(function(a, b) {
                return a.id - b.id;
              });
              //属性选中：默认第一个
              item.attrValues.forEach((i, j) => {
                if (j == 0) {
                  item.attrValues[j].selected = true;
                } else {
                  item.attrValues[j].selected = false;
                }
              });
            });
          }

          vm.info = _result;

          // 商品详情图片和表格填充布局
          vm.$nextTick(function() {
            Array.from(
              document
                .querySelector(".pd-content")
                .querySelectorAll("img,table,div,p")
            ).forEach(function(e) {
              e.style.width = "100%";
            });
          });
        }
      });
    },
    collect() {
      let vm = this;
      mui.ajax({
        url: addMyCollect,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          collectType: 2,
          id: this.info.proId,
          token: md5(`gjfengaddMyCollect${this.account}2`)
        },
        success(res) {
          vm.$dialog.toast({
            mes: res.msg
          });
        }
      });
    },
    chooseAttr(item, attr, attrIndex) {
      item.attrValues.forEach((i, j) => {
        if (attrIndex == j) {
          attr.selected = true;
        } else {
          i.selected = false;
        }
      });
      let attrIdStr = "";
      this.info.attrs.forEach(m => {
        m.attrValues.forEach(n => {
          if (n.selected) {
            attrIdStr += n.id + ",";
          }
        });
      });
      let vm = this;
      mui.ajax({
        url: stockAndPrice,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          proId: this.$route.query.id,
          attrIds: attrIdStr,
          token: md5(`gjfengstockAndPrice${this.$route.query.id}${attrIdStr}`)
        },
        success(res) {
          let _result = res.result;
          vm.info.productAttrStock = Object.assign(
            {},
            vm.info.productAttrStock,
            {
              id: _result.id,
              price: _result.price,
              productAttrIds: _result.productAttrIds,
              repertory: _result.repertory
            }
          );
          vm.info.pointNeedMoney = _result.productId.pointNicePrice;
        }
      });
    },
    changeTransport(value) {
      // if (value == 0) {
        this.pdnum = 1;
      // }
    },
    add2cart() {
      if (!this.account) {
        this.$router.push("/me/login");
        return;
      }
      this.buyType = 0;
      this.show = true;
    },
    buynow() {
      if (!this.account) {
        this.$router.push("/me/login");
        return;
      }
      this.buyType = 1;
      this.show = true;
    },
    cartOrBuy() {
      //加入购物车
      let vm = this;
      if (!this.info.productAttrStock.repertory) {
        this.$dialog.toast({
          mes: "库存不足，请查看其他商品",
          callback: () => {
            this.show = false;
          }
        });
        return;
      }
      if (this.buyType == 0) {
        this.$dialog.loading.open("加入中...");
        mui.ajax({
          url: addCart,
          type: "post",
          timeout: 10000,
          headers: { "app-version": "v1.0" },
          data: {
            goodsId: this.info.proId,
            goodsAttrStockId: this.info.productAttrStock.id||'',
            goodsAttrIds: this.info.productAttrStock.productAttrIds||'',
            goodsAttr: this.info.productAttrStock.productAttrIds||'',
            goodsNum: this.pdnum,
            logist:this.info.isWholesale=='0'?'0':this.transport,
            account: this.account,
            token: md5(`gjfengaddCart${this.account}`)
          },
          success(res) {
            vm.$dialog.loading.close();
            vm.show = false;
            vm.$dialog.toast({
              mes: res.msg,
              timeout: 1000
            });
            vm.$store.dispatch("getCartList");
          },
          error(e) {
            vm.$dialog.loading.close();
            vm.$dialog.toast({
              mes: "超时请稍后重试",
              timeout: 1000
            });
          }
        });
      } else {
        //立即购买
        // 商品属性拼接：报错暂不使用，使用ids
        let attrValueStr = [];
        this.info.attrs&&this.info.attrs.forEach(m => {
          m.attrValues.forEach(n => {
            if (n.selected) {
              attrValueStr.push(`${m.attrName}:${n.attrValueId.attrValue}`);
            }
          });
        });
        let attrIds = this.info.productAttrStock.productAttrIds?this.info.productAttrStock.productAttrIds:'';
        var tips = '0';
        if (this.info.isWholesale == "1") {
            tips = "0";
          } else {
            if (this.info.isCanUserCou == '0') {
              tips = "1";
            }
            if (this.info.isCanUserCou == '3') {
              tips = "0";
            }
          }
        this.$dialog.loading.open("正在发起订单...");
        mui.ajax({
          url: toAddOrder,
          type: "post",
          timeout: 10000,
          headers: { "app-version": "v1.0" },
          data: {
            "orderAddVos[0].goodsId": this.info.proId,
            "orderAddVos[0].goodsAttrIds": attrIds,
            "orderAddVos[0].goodsNum": this.pdnum,
            goodSource: this.info.goodSoure,
            orderAddressId: "",
            logist:this.info.isWholesale=='0'?'0':this.transport,
            account: this.account,
            token: md5(`gjfengtoAddOrder${this.account}`)
          },
          success(res) {
            vm.$dialog.loading.close();
            let _result = res.result;
            _result.orderAddVos[0].goodsAttr = attrValueStr.join(" ");
            _result.orderAddVos[0].goodsAttrIds =attrIds? attrIds.slice(
              0,
              attrIds.length - 1
            ):'';
            _result.orderAddVos[0].goodsAttrStockId =
              vm.info.productAttrStock.id;
            vm.show = false;
            vm.$store.commit("RECORD_SETTLE_LIST", _result);
            vm.$store.commit(
              "SET_PAY_PASSWORD",
              _result.gjfMemberInfo.payPassword ? true : false
            );
            vm.$router.push({
              name: "SettleBalance",
              query: { orderType: vm.orderType, buynow: true, tips }
            });
          },
          error(e) {
            vm.$dialog.loading.close();
            vm.$dialog.toast({
              mes: "超时请稍后重试",
              timeout: 1000
            });
          }
        });
      }
    },
    goShoppingCart() {
      if (!this.account) {
        this.$router.push("/me/login");
        return;
      }
      this.$router.push({ path: "/online/shoppingcart" });
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

footer {
  .shopping-cart {
    position: relative;
    .wh(1rem, 1rem);
    .shopping-num {
      position: absolute;
      font-size: 10px;
      left: 0.7rem;
      top: 0.4rem;
      transform: translate(-50%, -50%);
      text-align: center;
    }
  }
  button {
    line-height: 1rem;
    font-size: 0.35rem;
    color: @white;
    &.btn-1 {
      background-color: #ffb03f;
    }
    &.btn-2 {
      background-color: @red;
    }
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
    .middle-1 {
      margin-bottom: @pd;
    }
    h3 {
      margin-bottom: 5px;
    }
    .attr-name {
      color: @blue;
    }
    .attr-list {
      .attr-item {
        display: inline-block;
        border: 1px solid #bfbfbf;
        border-radius: 4px;
        font-size: 13px;
        color: #232326;
        margin: 0.1rem;
        padding: 3px @pd;
        .text-center;
        &.active {
          color: @red;
          border-color: currentColor;
        }
      }
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
