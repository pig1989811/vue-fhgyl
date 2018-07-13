<template>
  <div>
    <header-top title="购物车"></header-top>
    <main class='scroll-content'>
      <p style="font-size:.3rem;padding: .2rem;" v-show="cartList.length">不同类型商品不能同时结算，限购商品超过限购数量会被移除购物车。</p>
      <ul class="cart-list" v-show="cartList.length">
        <li v-for="(item,index) in cartList" :key="index" class="cart-item flex align-center">
          <label class="cart-check flex align-center just-center" @click="countChange($event,item,index)" :class="{'checked':item.checked}">
          </label>
          <div class="flex-1">
              <router-link :to="{name:'Product',query:{id:item.goodsId.id}}">
            <yd-flexbox style="margin-bottom:5px;">
              <img :src="item.goodsId.imgUrl" alt="">
              <yd-flexbox-item style="margin-left:5px;">
                <h3>{{item.goodsId.name}}</h3>
                <p class="attrs">{{item.goodsAttr}}</p>
                <div class="flex just-between align-center">
                  <template v-if="item.goodsId.isWholesale=='1'">

                    <p class="fs-16 danger-color" v-if="+member.merchantType==1">
                      ￥{{item.goodsId.standardPrice}}
                    </p>
                    <p class="fs-16 danger-color" v-else-if="+member.merchantType>1">
                      ￥{{item.goodsId.honourPrice}}
                    </p>
                  </template>
                  <template v-else>
                    <p v-if="item.goodsId.isCanUserCou=='0'" class="fs-16 danger-color">
                      ￥{{item.goodsId.price}}
                    </p>
                    <p v-if="item.goodsId.isCanUserCou=='1'" class="fs-16 danger-color">
                      <yd-badge type="primary" style="vertical-align: text-bottom;">
                        <span>{{item.goodsId.price}}</span>积分</yd-badge>
                      <span v-if="item.goodsId.pointNicePrice">+￥{{item.goodsId.pointNicePrice}}</span>
                    </p>
                    <p v-if="item.goodsId.isCanUserCou=='2'" class="fs-16 danger-color">
                      <yd-badge type="warning" style="vertical-align: text-bottom;">
                        <span>{{item.goodsId.price}}</span>责任金</yd-badge>
                      <span v-if="item.goodsId.pointNicePric">+￥{{item.goodsId.pointNicePrice}}</span>
                    </p>
                    <p v-if="item.goodsId.isCanUserCou=='3'" class="fs-16 danger-color">
                      <yd-badge type="danger" style="vertical-align: text-bottom;">
                        <span>{{item.goodsId.price}}</span>代金券</yd-badge>
                      <span v-if="item.goodsId.pointNicePrice">+￥{{item.goodsId.pointNicePrice}}</span>
                    </p>
                  </template>
                  <yd-spinner v-model="item.goodsNum" :min="1" :max="(Math.floor(item.goodsId.repertory/(+item.goodsId.multipleNumber||1)))*(item.goodsId.multipleNumber||1)" v-show="!item.close" :unit="+item.goodsId.multipleNumber||1"></yd-spinner>
                  <div v-show="item.close" class="fs-14">
                    ×{{item.goodsNum}}
                  </div>
                </div>
              </yd-flexbox-item>
            </yd-flexbox>
              </router-link>
            <div class="cart-operate flex just-between">
              <p @click="editCart(item,index)" v-show="item.close">
                <span class="iconfont self-bianji"></span>编辑</p>
              <p @click="deleteCart(item,index)" v-show="item.close">
                <span class="iconfont self-delete"></span>删除</p>
              <p @click="updateCart(item,index)" v-show="!item.close">
                <span class="iconfont self-dui"></span>完成</p>
            </div>
          </div>
        </li>
      </ul>
      <section class="hv-cen text-center" v-show="!cartList.length">
        <span class="iconfont self-shopcart" style="font-size:40px;"></span>
        <p class="fs-14" style="margin-bottom:.5rem;">购物车空空如也</p>
        <yd-button type="warning" @click.native="goOnLine">去商城看看
          <span class="iconfont self-right"></span>
        </yd-button>
      </section>
    </main>
    <footer class="fix-footer flex align-center" style="border-top: 1px solid #dfdfdf;" v-show="cartList.length">
      <p @click="checkAll" class="flex align-center just-center fs-14">
        <label class="cart-check" :class="{'checked':isCheckAll}"></label>
        全选
      </p>
      <div class="flex-1 total-price">
        <p class="fs-16">合计：
          <span class="danger-color">{{formatPrice(totalPrice)}}</span>
        </p>
        <p>不含运费</p>
      </div>
      <button class="submit-btn" @click="settleCart" :disabled="!checkList.length">去结算
        <span class="fs-12">({{amount}}件)</span>
      </button>
    </footer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { updateCartNum, delCart, actCartInH5 } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "ShoppingCart",
  data() {
    return {
      isCheckAll: true,
      totalPrice: 0
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account", "member", "cartList", "member"]),
    checkList() {
      return this.cartList.filter((item, index) => {
        return item.checked;
      });
    },
    amount() {
      let num = 0;
      this.checkList.forEach(item => {
        num += item.goodsNum;
      });
      return num;
    }
  },
  created() {},
  activated() {
    this.$store.dispatch("getCartList");
    this.isCheckAll = false;
    this.totalPrice = 0;
  },
  mixins: [mixin],
  methods: {
    countChange(e, item, index) {
      item.checked = !item.checked;
      this.$store.commit("UPDATE_CART_ITEM", { item, index });
      this.isCheckAll = this.checkList.length === this.cartList.length;
      this.calcTotal();
    },
    checkAll() {
      this.isCheckAll = !this.isCheckAll;
      this.cartList.forEach((item, index) => {
        item.checked = this.isCheckAll;
        this.$store.commit("UPDATE_CART_ITEM", { item, index });
      });
      this.calcTotal();
    },
    updateCart(item, index) {
      let vm = this;
      mui.ajax({
        url: updateCartNum,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id: item.id,
          goodsNum: item.goodsNum,
          account: this.account,
          token: md5(`gjfengupdateCartNum`)
        },
        success(res) {
          vm.$store.commit("UPDATE_CART_ITEM", { item, index });
          vm.$dialog.toast({
            mes: res.msg
          });
          vm.calcTotal();
        }
      });
      item.close = true;
    },
    editCart(item, index) {
      item.close = false;
    },
    deleteCart(item, index) {
      this.$dialog.confirm({
        mes: "确定删除该商品？",
        opts: () => {
          let vm = this;
          mui.ajax({
            url: delCart + `/${item.id}`,
            type: "post",
            headers: { "app-version": "v1.0" },
            data: {
              id: item.id,
              account: this.account,
              token: md5(`gjfengdelCart`)
            },
            success(res) {
              vm.$store.commit("DELETE_CART_ITEM", index);
              vm.$dialog.toast({
                mes: res.msg,
                timeout: 800
              });
              vm.calcTotal();
              if (!vm.checkList.length) {
                vm.isCheckAll = false;
              }
            }
          });
        }
      });
    },
    calcTotal() {
      if (!this.checkList.length) {
        this.totalPrice = 0;
      } else {
        let a = 0;
        this.checkList.forEach((item, index) => {
          if (item.goodsId.isCanUserCou == "1") {
            a +=
              (item.goodsId.price + item.goodsId.pointNicePrice) *
              item.goodsNum;
          } else if (item.goodsId.isCanUserCou == "0") {
            if (item.goodsId.isWholesale == "1") {
              a +=
                +this.member.merchantType > 1
                  ? item.goodsId.honourPrice * item.goodsNum
                  : item.goodsId.standardPrice * item.goodsNum;
            } else {
              a += item.goodsId.price * item.goodsNum;
            }
          } else {
            a += item.goodsId.price * item.goodsNum;
          }
        });
        this.totalPrice = a;
      }
    },
    settleCart() {
      let vm = this;
      let settleList = [],
        orderType = "0"; //0普通商品 1积分换购 2责任消费 3代金券
      var length = this.checkList.length,
        count0 = 0,
        count1 = 0,
        count2 = 0,
        count3 = 0;
      this.checkList.forEach(item => {
        settleList.push(item.id);
        if (item.goodsId.isCanUserCou == "0") {
          count0++;
        } else if (item.goodsId.isCanUserCou == "1") {
          count1++;
        } else if (item.goodsId.isCanUserCou == "2") {
          count2++;
        } else if (item.goodsId.isCanUserCou == "3") {
          count3++;
        }
      });

      if (
        (count0 && count0 !== length) ||
        (count1 && count1 !== length) ||
        (count2 && count2 !== length) ||
        (count3 && count3 !== length)
      ) {
        this.$dialog.alert({
          mes: "不同类型商品不能同时结算"
        });
        return;
      }
      if (count0) orderType = "0";
      else if (count1) orderType = "1";
      else if (count2) orderType = "2";
      else if (count3) orderType = "3";
      this.$dialog.loading.open();
      mui.ajax({
        url: actCartInH5,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          cartIds: settleList.join(","),
          account: this.account,
          token: md5(`gjfengactCartInH5${settleList.join(",")}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code != 200) {
            vm.$dialog.alert({
              mes: res.msg
            });
            vm.$store.dispatch("getCartList");
            return;
          }
          let _result = res.result;
          vm.$store.commit(
            "SET_PAY_PASSWORD",
            !!_result.gjfMemberInfo.payPassword
          );
          var tips = "0";
          if (_result.isWohsalse == "1") {
            tips = "0";
          } else {
            if (_result.isCanUseCou == 0) {
              tips = "1";
            }
            if (_result.isCanUseCou == 3) {
              tips = "0";
            }
          }

          vm.$store.commit("RECORD_SETTLE_LIST", _result);
          vm.$router.push({
            name: "SettleBalance",
            query: { orderType, tips }
          });
        }
      });
    },
    goOnLine() {
      this.$router.replace("/online/index");
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";

.cart-item {
  padding: @pd @pd @pd 0;
  margin-bottom: @pd / 2;
  background-color: @white;
  img {
    .wh(1.5rem, 1.5rem);
    border: 1px solid #dfdfdf;
  }
  .attrs {
    color: @lightgray;
    margin-bottom: 0.1rem;
  }
  input[type="number"] {
    border: none;
    text-align: right;
    font-size: 14px;
    width: 0.5rem;
  }
  h3 {
    .multi-ellipsis(2);
    font-size: 0.32rem;
    font-weight: normal;
  }
  .cart-operate {
    padding-top: 5px;
    border-top: 1px solid #dfdfdf;
    font-size: 0.3rem;
    p {
      &:first-of-type {
        color: @blue;
      }
      &:nth-of-type(2) {
        color: @red;
      }
      &:last-of-type {
        color: @green;
      }
    }
  }
}

.total-price {
  text-align: right;
  p:last-of-type {
    color: @lightgray;
  }
}

.submit-btn {
  background: #e4393c;
  color: @white;
  height: 1rem;
  line-height: 1rem;
  padding: 0 10px;
  font-size: 0.32rem;
  margin-left: @pd;
  &[disabled] {
    background-color: #ccc;
    color: #f0f0f0;
  }
}

.cart-check {
  padding: @pd;
  .mg-h;
  z-index: 5;
  display: inline-block;
  .wh(25px, 25px);
  background-image: url(../../assets/1.png);
  background-size: contain;
  &.checked {
    background-image: url(../../assets/2.png);
  }
}
</style>
