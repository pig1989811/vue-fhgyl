<template>
  <div>
    <header-top title="京东自营"></header-top>
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
                <img :src="item.goodsThumb" :alt="item.goodsName">
              </div>
              <div class="product-info flex align-center">
                <div class="product-name">{{item.goodsName}}</div>
              </div>
              <div class="product-price">
                <span class="fs-16 danger-color">￥{{item.shopPrice || 0}}</span>
              </div>
            </li>
          </ul>
        </yd-infinitescroll>
      </main>
    </div>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { mapState } from "vuex";
import { getStore } from "components/common/mixin";
import {
  findProprietaryJdCategory,
  findJdProprietaryProByCatId,
  findJdProductListBySerch
} from "../../api/index";
export default {
  name: "JDSelf",
  data() {
    return {
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
  components: { HeaderTop },
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
    searchProduct() {
      this.$dialog.alert({
        mes: "搜索功能即将上线，敬请期待！"
      });
      return;
      if (!this.searchValue) {
        this.$dialog.alert({
          mes: "请输入关键词！"
        });
        return;
      }
      this.pageNo = 1;
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.productList = [];
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: findJdProductListBySerch,
        type: "get",
        data: {
          keyWord: this.searchValue,
          page: this.pageNo
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.productList = [...vm.productList, ...res];
          if (res.length < 30) {
            vm.$refs.pdlist.$emit("ydui.infinitescroll.loadedDone");
            return;
          }
          vm.$refs.pdlist.$emit("ydui.infinitescroll.finishLoad");
          vm.pageNo++;
        }
      });
    },
    changeTab(index) {
      this.pageNo = 1;
      this.curIndex = index;
      this.$refs.mainList.scrollTop = 0;
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.productList = [];
      this.getProduct();
    },
    getCatalog() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: findProprietaryJdCategory,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          token: md5(`gjfengfindProprietaryJdCategory`)
        },
        success(res) {
          vm.$dialog.loading.close();
          let _result = res.result;
          vm.tabList = _result.cat.firstLevel;
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
      this.$dialog.loading.open();
      mui.ajax({
        url: findJdProprietaryProByCatId,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          catId: this.tabList[this.curIndex].catId,
          page: this.pageNo,
          sup: "",
          rateBegin: "",
          token: md5(
            `gjfengfindJdProprietaryProByCatId${
              this.tabList[this.curIndex].catId
            }`
          )
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.productList = [...vm.productList, ...res.result.product];
          if (res.result.product.length == 0) {
            vm.noData = true;
            vm.$refs.pdlist.$emit("ydui.infinitescroll.loadedDone");
            return;
          }
          vm.$refs.pdlist.$emit("ydui.infinitescroll.finishLoad");
          vm.pageNo++;
        }
      });
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
      this.$router.push({ name: "JDProduct", query: { id: pd.goodsId } });
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