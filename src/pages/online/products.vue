<template>
  <div>
    <header-top title="商品列表"></header-top>
    <div class="search-form" autocomplete="off">
      <div class="input-group  flex align-center">
        <span class="iconfont-large self-search"></span>
        <input type="text" name="search" class="search-input" placeholder="输入搜索的商品关键词" v-model="searchValue" @keyup.enter="searchProduct">
        <button type="button" class="search-submit" @click="searchProduct">搜索</button>
      </div>
    </div>
    <main class='scroll-content-1' style="background-color:#fff;">
      <yd-infinitescroll :callback="getProduct" ref="pdlist">
        <div slot="list" class="pd-list">
          <div class="pd-item flex align-center" v-for="(pd,index) in productList" :key='index' @click="navigate($event,pd)">
            <img v-lazy="pd.imgUrl" :alt="pd.name" class="pd-cover">
            <div class="pd-info flex-1">
              <h3>{{pd.name}}</h3>
              <div class="flex just-between align-center">
                <span class="fs-14 price1" v-if="pd.isCanUserCou=='1'">￥{{pd.pointNicePrice}}
                  <span class="price2">+{{formatPrice(pd.price-pd.pointNicePrice)}}积分</span>
                </span>
                <span class="fs-14 price1" v-else-if="pd.isCanUserCou=='2'">￥{{pd.pointNicePrice}}
                  <span class="price2">+{{pd.price}}责任金额</span>
                </span>
                <span class="fs-14 price1" v-else-if="pd.isCanUserCou=='3'">￥{{pd.pointNicePrice||0}}
                  <span class="price2">+{{pd.price}}代金券</span>
                </span>
                <span class="fs-14 price1" v-else>
                  ￥{{pd.price}}
                </span>
                <yd-button type="warning" v-if="account" @click.native="add2cart(pd.id,$event)">加入购物车</yd-button>
              </div>
            </div>
          </div>
        </div>
      </yd-infinitescroll>
    </main>
    <div class="shopping-container" v-show="account" @click="goShoppingCart">
      <div class="shopping-cart">
        <span class="iconfont-large self-shopcart"></span>
      </div>
      <yd-badge type="danger" class="shopping-num" v-show="cartNum>0">{{cartNum}}</yd-badge>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import HeaderTop from "components/header/index";
import {
  onlineProductsByAllColumn,
  onlineProductsDetailInfoInH5,
  addCart
} from "../../api/index";
import {mixin} from "components/common/mixin"
export default {
  name: "Products",
  data() {
    return {
      searchValue: "",
      columnId: "",
      type: "", //栏目级别
      pageNo: 1,
      noData: false,
      productList: []
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account", "cacheList", "positions","latitude","longitude"]),
    ...mapGetters(["cartNum"])
  },
  mixins:[mixin],
  created() {},
  activated() {
    if (this.$route.params.update==true) {
      this.$store.dispatch("getCartList");
      this.reset();
      this.type = this.$route.query.type;
      this.columnId = this.$route.query.id;
      this.searchValue = "";
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.getProduct();
    } else {
      // if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.positions[
        this.$route.path
      ];
      // }
      this.noData = this.cacheList[this.$route.path].noData;
      this.pageNo = this.cacheList[this.$route.path].page;
      this.productList = this.cacheList[this.$route.path].list;
    }
  },

  methods: {
    reset() {
      this.pageNo = 1;
      this.noData = false;
      this.productList = [];
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
    },
    getProduct() {
      if (!this.noData) {
        let vm = this;
        mui.ajax({
          url: `${onlineProductsByAllColumn}/${this.type}/${this.columnId}`,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            pageNo: this.pageNo,
            pageSize: 10,
            longitude: this.longitude,
            latitude: this.latitude,
            likeValue: this.searchValue,
            token: md5(`gjfengonlineProductsByAllColumn${this.longitude}${this.latitude}`)
          },
          success(res) {
            let _list = res.result;
            vm.productList = [...vm.productList, ..._list];
            if (_list.length < 10) {
              vm.noData = true;
              vm.$refs.pdlist.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.pdlist.$emit("ydui.infinitescroll.finishLoad");
            vm.pageNo++;
          }
        });
      }
    },
    searchProduct() {
      this.reset();
      this.getProduct();
    },
    navigate(event, pd) {
      let p = this.$route.path;
      if (event.target.tagName !== "BUTTON") {
        this.$store.commit("SAVE_LIST_WITH_PAGE", {
          name: this.$route.path,
          cacheInfo: {
            noData: this.noData,
            page: this.pageNo,
            list: this.productList
          }
        });
        this.$router.push({
          path: "/online/product",
          query: { id: pd.id }
        });
      }
    },
    add2cart(id, event) {
      let vm = this;
      var ct = event.currentTarget;
      var img = ct.parentElement.parentElement.parentElement.querySelector(
        "img"
      );
      var src = img.src;
      var bottom = window.innerHeight - ct.getBoundingClientRect().bottom;
      var left = ct.getBoundingClientRect().left;
      this.$dialog.loading.open("库存检测中...")
      mui.ajax({
        url: onlineProductsDetailInfoInH5,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id,
          token: md5(`gjfengonlineProductsDetailInfoInH5${id}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          let _result = res.result;
          if (!_result.productAttrStock.repertory) {
            vm.$dialog.toast({
              mes: "库存不足，请查看其他商品"
            });
            return;
          }

          mui.ajax({
            url: addCart,
            type: "post",
            headers: { "app-version": "v1.0" },
            data: {
              goodsId: id,
              goodsAttrStockId: _result.productAttrStock.id||'',
              goodsAttrIds: _result.productAttrStock.productAttrIds||'',
              goodsAttr: _result.productAttrStock.productAttrIds||'',
              goodsNum: 1,
              account: vm.account,
              logist: 0,
              token: md5(`gjfengaddCart${vm.account}`)
            },
            success(response) {
              vm.$dialog.toast({
                mes: response.msg,
                timeout: 1000
              });
              vm.$store.dispatch("getCartList");
              // 商品加入购物车动画

              var m = document.createElement("img");
              m.className = "img-animate";
              var tt = `bottom:${bottom}px;left:${left}px;`;
              m.setAttribute("style", tt);
              m.src = src;
              document.body.appendChild(m);

              setTimeout(() => {
                m.remove();
              }, 1500);
              
            }
          });
        }
      });
    },
    goShoppingCart() {
      this.$store.commit("SAVE_LIST_WITH_PAGE", {
        name: this.$route.path,
        cacheInfo: {
          noData: this.noData,
          page: this.pageNo,
          list: this.productList
        }
      });
      this.$router.push({ name: "ShoppingCart" });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.pd-list {
  margin-top: @pd;
}

.pd-item {
  .pd;
  border-bottom: 1px solid #f9f9f9;
  img {
    .wh(1.5rem, 1.5rem);
  }
  .pd-info {
    margin-left: @pd;
    h3 {
      .multi-ellipsis(2);
      margin-bottom: @pd;
      font-weight: normal;
    }
    .price1 {
      color: @red;
    }
    .price2 {
      color: @lightgray;
    }
  }
}
.shopping-container {
  position: fixed;
  left: @pd;
  bottom: @pd * 2;
  .wh(1rem,1rem);
  border-radius: 50%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  .shopping-cart {
    .hv-cen;
    color: @white;
  }
  .shopping-num {
    position: absolute;
    left: 0.5rem;
    top: 0.1rem;
  }
}
</style>