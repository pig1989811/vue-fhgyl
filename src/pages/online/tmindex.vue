<template>
  <div>
    <yd-navbar title="淘宝|天猫" :fixed="true">
      <section slot="left" @click="goBack" style="line-height:1rem;">
        <yd-navbar-back-icon>返回</yd-navbar-back-icon>
      </section>
    </yd-navbar>
    <div class="search-form" autocomplete="off">
      <div class="input-group  flex align-center">
        <span class="iconfont-large self-search"></span>
        <input type="text" name="search" class="search-input" placeholder="输入搜索的商品关键词" v-model="searchValue" @keyup.enter="searchProduct">
        <button type="button" class="search-submit" @click="searchProduct">搜索</button>
      </div>
    </div>
    <div class="scroll-warpper">
      <ul class="tab-list">
        <li class="tab-item" :class="{'danger-bg':curIndex==index}" @click="changeTab(index)" v-for="(item,index) in tabList" :key="index">{{item.catName}}</li>
      </ul>
      <main class="main-list" ref="mainList">
        <yd-infinitescroll :callback="getProduct" ref="pdlist">
          <ul class="product-list flex" slot="list">
            <li class="product-item" v-for="(item,index) in productList" :key="index" @click="navigate(item)">
              <div class="product-img">
                <img :src="item.smallPic" :alt="item.title">
              </div>
              <div class="product-info flex align-center">
                <div class="product-name">{{item.title}}</div>
              </div>
              <div class="product-price">
                <span>优惠券：</span>
                <span class="fs-16 danger-color">￥{{item.yhqmoney || 0}}</span>
              </div>
            </li>
          </ul>
        </yd-infinitescroll>
      </main>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getStore } from "components/common/mixin";
import {
  findProdutCat,
  findProductList,
  findProductListBySerch
} from "../../api/index";
export default {
  name: "TianMao",
  data() {
    return {
      oldBack: mui.back,
      searchValue: "",
      noData: false,
      pageNo: 1,
      curIndex: 0,
      tabList: [],
      productList: []
    };
  },
  computed: {
    ...mapState(["member", "positions", "cacheList"])
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
  created() {
    this.getCatalog();
  },
  activated() {
    if (getStore("account") && getStore("account").length > 0) {
      this.$store.dispatch("getInfo");
    }
    if (this.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.positions[
        this.$route.path
      ];
    }
    if (this.cacheList[this.$route.path]) {
      this.noData = this.cacheList[this.$route.path].noData;
      this.pageNo = this.cacheList[this.$route.path].page;
      this.productList = this.cacheList[this.$route.path].list;
    }
  },
  methods: {
    goBack() {
      this.$router.replace("/online/index");
    },
    reset() {
      this.pageNo = 1;
      this.$refs.mainList.scrollTop = 0;
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.productList = [];
    },
    searchProduct() {
      if (!this.searchValue) {
        this.$dialog.alert({
          mes: "请输入关键词！"
        });
        return;
      }
      this.reset();
      this.curIndex = 0;
      this.getProduct();
    },
    changeTab(index) {
      this.searchValue = "";
      this.curIndex = index;
      this.reset();
      this.getProduct();
    },
    getCatalog() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: findProdutCat,
        type: "get",
        success(res) {
          vm.$dialog.loading.close();
          vm.tabList = res;
          vm.getProduct();
        },
        error(e) {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: "加载异常！"
          });
        }
      });
    },
    getProduct() {
      let vm = this;
      if (this.searchValue) {
        this.$dialog.loading.open();
        mui.ajax({
          url: findProductListBySerch,
          type: "get",
          data: {
            keyWord: this.searchValue,
            page: this.pageNo
          },
          success(res) {
            vm.$dialog.loading.close();
            vm.productList = [...vm.productList, ...res];
            if (res.length == 0) {
              vm.$refs.pdlist.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.pdlist.$emit("ydui.infinitescroll.finishLoad");
            vm.pageNo++;
          }
        });
      } else {
        mui.ajax({
          url: findProductList,
          type: "get",
          data: {
            type: this.tabList[this.curIndex].id,
            page: this.pageNo
          },
          success(res) {
            vm.productList = [...vm.productList, ...res];
            if (res.length == 0) {
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
    navigate(pd) {
      if (!this.member) {
        this.$router.push("/me/login");
        return;
      }
      this.$store.commit("SAVE_LIST_WITH_PAGE", {
        name: this.$route.path,
        cacheInfo: {
          noData: this.noData,
          page: this.pageNo,
          list: this.productList
        }
      });
      let pdId = pd.id;
      let userId = `1004${this.member.id}`; //广州：1004，O2O：1003，云南：1002，湛江：1001
      let url = `http://aihua.likecs.com/index.php?mod=aihua&act=fenghuang&param=detail&id=${pdId}&userid=${userId}&phone=${
        this.member.mobile
      }&email=102286545@qq.com&kh=fenghuang&tbnum=4654646465465`;
      mui.os.ios
        ? plus.runtime.openURL(url)
        : this.$router.push({ name: "TMDetail", params: { url } });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.scroll-warpper {
  position: absolute;
  left: 0;
  width: 100%;
  top: 2rem;
  bottom: 0;
  overflow: hidden;
  background-color: @white;
}
.tab-list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  width: 20%;
  border-right: 1px solid #ccc;
  .tab-item {
    line-height: 46px;
    height: 46px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    font-size: 0.28rem;
  }
}
.main-list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 20%;
  width: 80%;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  padding: 5px;
  .product-item {
    width: 50%;
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #f7f5f0;
    color: #333;
    .product-img {
      position: relative;
      padding: 50%;
      overflow: hidden;
      img {
        .hv-cen;
        width: 100%;
      }
    }
    .product-info {
      line-height: 20px;
      height: 40px;
      .product-name {
        display: -webkit-box;
        .multi-ellipsis(2);
        word-wrap: break-word;
        word-break: break-all;
      }
    }
    .product-price {
      font-size: 0.28rem;
      color: @red;
    }
  }
}
</style>