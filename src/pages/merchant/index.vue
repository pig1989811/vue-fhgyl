<template>
  <div>
    <header-top title="供应链"></header-top>
    <div class="search-form" autocomplete="off">
      <div class="input-group  flex align-center">
        <span class="iconfont-large self-search"></span>
        <input type="text" name="search" class="search-input" placeholder="输入搜索的商品关键词" v-model="searchValue" @keyup.enter="searchProduct">
        <button type="button" class="search-submit" @click="searchProduct">搜索</button>
      </div>
    </div>
    <div class="scroll-warpper">
      <ul class="tab-list">
        <li class="tab-item" :class="{'danger-bg':curIndex==index}" @click="changeTab(index)" v-for="(item,index) in tabList" :key="index">{{item.names}}</li>
      </ul>
      <div class="main-list" ref="mainList">
        <div class="flex align-center">
          <span class="fs-15 orange-color" style="color: #ff7625;">折扣筛选：</span>
          <select v-model="discount" @change="filterProduct" class="select-container flex-1">
            <option :value="item.key" v-for="(item,index) in dlist" :key="index">{{item.value}}</option>
          </select>
        </div>
        <main class="product-list">
          <yd-infinitescroll :callback="getProduct" ref="pdlist">
            <ul class="flex" slot="list">
              <li class="product-item" v-for="(item,index) in productList" :key="index" @click="navigate(item)">
                <div class="product-img">
                  <img :src="item.imgUrl" :alt="item.name">
                </div>
                <div class="product-info flex align-center">
                  <div class="product-name">{{item.name}}</div>
                </div>
                <div class="product-price">
                  <span>零售价:</span>
                  <span class="fs-16 danger-color">￥{{item.price}}</span>
                </div>
              </li>
            </ul>
          </yd-infinitescroll>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { findModelProductColumn, findVoucherProduct } from "../../api/index";
export default {
  name: "MerchantIndex",
  data() {
    return {
      searchValue: "",
      noData: false,
      pageNo: 1,
      curIndex: 0,
      discount: "",
      dlist: [
        { key: "", value: "全部" },
        { key: "1", value: "1折以下" },
        { key: "2", value: "1~2折" },
        { key: "3", value: "3~4折" },
        { key: "4", value: "4折以上" }
      ],
      tabList: [],
      productList: []
    };
  },
  computed: {
    ...mapState(["account", "positions", "cacheList"])
  },
  components: {
    HeaderTop
  },
  created() {
    this.getCatalog();
  },
  activated() {
    if (this.positions[this.$route.path]) {
      document.querySelector(".product-list").scrollTop = this.positions[
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
    getCatalog() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: findModelProductColumn,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          token: md5(`gjfengfindModelProductColumn`)
        },
        success(res) {
          vm.$dialog.loading.close();
          let all = [{ id: "", names: "全部" }];
          vm.tabList = [...all, ...res.result];
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
    reset() {
      this.pageNo = 1;
      this.noData = false;
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.productList = [];
    },
    changeTab(index) {
      this.reset();
      this.searchValue = "";
      this.discount = "";
      this.curIndex = index;
      this.$refs.mainList.scrollTop = 0;
      this.getProduct();
    },
    getProduct() {
      if (!this.noData) {
        let vm = this;
        mui.ajax({
          url: findVoucherProduct,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            account: this.account,
            pageNo: this.pageNo,
            pageSize: 10,
            likeName: this.searchValue,
            discount: this.discount,
            columnId: this.tabList[this.curIndex].id,
            token: md5(`gjfengfindVoucherProduct${this.account}`)
          },
          success(res) {
            let _list = res.result.products.result;
            vm.productList = [...vm.productList, ..._list];
            if (_list.length==0) {
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
      if (!this.searchValue) {
        this.$dialog.alert({
          mes: "请输入关键词！"
        });
        return;
      }
      this.reset();
      this.curIndex=0;
      this.getProduct();
    },
    filterProduct() {
      this.reset();
      this.getProduct();
    },
    navigate(pd) {
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
  padding: 5px;
  .select-container {
    height: 0.65rem;
    line-height: 0.65rem;
    overflow: hidden;
    background-image: url(../../assets/select.png);
    background-size: 100% 100%;
    padding-left: 0.15rem;
    font-size: 0.3rem;
    z-index: 1000;
    border: none;
  }
  .product-list {
    position: absolute;
    top: 1rem;
    bottom: 0;
    left: 0;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
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
      }
    }
  }
}
</style>
