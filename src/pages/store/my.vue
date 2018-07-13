<template>
  <div>
    <header-top title="我的店铺"></header-top>
    <main class='scroll-content-2' v-if="info">
      <section class="store-banner px-1" v-lazy:background-image="getImgPath(info.storeBanner)">
        <div class="upload-box">
          更换封面
        </div>
        <input type="file" name="upload-img" id="" accept="image/*" @change="previewImg($event)">
      </section>
      <section class="store-info">
        <h2 class="store-title flex align-center">
          <span class="flex-1">{{info.storeName}}</span>
          <!-- <span class="iconfont-large self-vip" style="color: #f5ca3a;"></span> -->
        </h2>
        <div class="flex align-center" @click="showEdit">
          <div class="flex-1 fs-15 flex align-center">
            <span class="iconfont-large self-location danger-color"></span>
            <span class="flex-1">{{info.provinceId.province}}{{info.cityId.city}}
              <span v-if="info.areaId">{{info.areaId.area}}</span>{{info.addressDetail}}</span>
          </div>
          <span class="iconfont self-bianji danger-color"></span>
        </div>
        <div class="flex align-center">
          <span class="iconfont-large self-tel"></span>
          <span class="fs-16">{{info.sellerMobile}}</span>
        </div>
        <div class="flex align-center">
          <span class="iconfont-large self-renzheng" style="color:#4cd864;"></span>
          <span>店铺审核状态：审核通过</span>
        </div>
      </section>
      <yd-cell-group title="店铺简介">
        <yd-cell-item>
          <yd-textarea slot="right" maxlength="200" placeholder="请输入店铺简介" v-model="info.storeDescription" :readonly="editTag" ref="storeIntro"></yd-textarea>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="right" @click="saveIntro" v-if="!editTag">
            <span class="iconfont self-dui"></span>保存</span>
          <span slot="right" @click="editTag=false" v-else>
            <span class="iconfont self-bianji">编辑</span>
          </span>
        </yd-cell-item>
      </yd-cell-group>
      <!-- <section class="store-menu">
        <yd-grids-group :rows="3">
          <yd-grids-item v-for="(item,index) in menu" :key="index" :link="item.link">
            <span slot="icon" :class="['iconfont-large',item.icon]" :style="{color:item.color}"></span>
            <span slot="text">{{item.text}}</span>
          </yd-grids-item>
        </yd-grids-group>
      </section> -->
    </main>
    <yd-popup v-model="showPopup" position="center" width="90%">
      <div class="edit-container">
        <div class="blue-header"></div>
        <group title="编辑店铺信息">
          <x-input title="联系电话" v-model="newMobile" placeholder="请输入手机号码" type="tel"></x-input>
          <x-address title="省市区" v-model="newAddress" :list="addressData" placeholder="请选择地址" :show.sync="show1" :popup-style="popupStyle"></x-address>
          <x-textarea title="详细地址：" v-model="newAddressDetail" placeholder="街道、楼牌号码等"></x-textarea>
        </group>
        <button class="save-btn" @click="saveInfo" :disabled="!valid">保存</button>
      </div>
    </yd-popup>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { getStore, setStore, mixin } from "components/common/mixin";
import {
  myStore,
  updateBanner,
  updateIntro,
  updateAddressInfo
} from "../../api/index";
import "lrz/dist/lrz.bundle.js";
import { Group, XInput, XTextarea, XAddress, ChinaAddressV4Data } from "vux";
export default {
  name: "MyStore",
  data() {
    return {
      oldBack: mui.back,
      editTag: true,
      info: null,
      showPopup: false,
      intro: "", //简介
      tag: false, //简介是否可编辑
      show1: false, //所在地标志
      addressData: ChinaAddressV4Data,
      newMobile: "",
      newAddress: [],
      newAddressDetail: "",
      popupStyle: {
        "z-index": 5000
      },
      menu: [
        {
          icon: "self-shangpinguanli",
          text: "商品管理",
          link: "/store/productmanage",
          color: "#fc9557"
        },
        // {
        //   icon: "self-dingdanguanli",
        //   text: "订单管理",
        //   link: "/store/ordermanage",
        //   color: "#fab652"
        // },
        {
          icon: "self-fabu",
          text: "发布管理",
          link: "/store/publishmanage",
          color: "#fab652"
        }
        // {
        //   icon: "self-shoukuan",
        //   text: "付款",
        //   link: "/store/receipt",
        //   color: "#fc9557"
        // },
        // {
      ]
    };
  },
  components: {
    HeaderTop,
    Group,
    XInput,
    XTextarea,
    XAddress
  },
  computed: {
    valid() {
      return (
        /^1[3,4,5,7,8,9]\d{9}$/.test(this.newMobile) && !!this.newAddressDetail
      );
    }
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
  mixins: [mixin],
  created() {},
  activated() {
    this.getMyStore();
    if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.$store.state.positions[
        this.$route.path
      ];
    }
  },
  mounted() {
    [
      ...document.querySelectorAll(
        "input[type='text'],input[type='tel'],input[type='number'],textarea"
      )
    ].forEach((item, index) => {
      item.addEventListener("click", function() {
        item.scrollIntoView();
      });
      item.addEventListener("focus", function() {
        item.scrollIntoView();
      });
    });
  },
  methods: {
    goBack() {
      if (this.show1) {
        this.show1 = false;
      } else if (this.showPopup) {
        this.showPopup = false;
      } else {
        this.$router.go(-1);
      }
    },
    getMyStore() {
      let vm = this;
      //this.$dialog.loading.open();
      mui.ajax({
        url: myStore,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: getStore("account"),
          token: md5(`gjfengmyStore${getStore("account")}`)
        },
        success(res) {
          //vm.$dialog.loading.close();
          vm.info = res.result;
          vm.$store.commit("RECORD_STORE_INFO", vm.info);
          setStore("storeId", vm.info.id);
        }
      });
    },
    previewImg(event) {
      let headImg = document.querySelector(".store-banner"),
        file = event.target.files[0];
      let vm = this;
      if (!/image\/\w+/.test(file.type)) {
        this.$dialog.toast({
          mes: "请上传图片",
          timeout: 1000,
          icon: "error"
        });
        return;
      }
      lrz(file, { width: 800 }).then(rst => {
        headImg.style.backgroundImage = `url(${rst.base64})`;
        mui.ajax({
          url: updateBanner,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            fileName: "123.png",
            storeId: vm.info.id,
            token: md5("gjfengupdateBanner"),
            fileContent: rst.base64
          },
          success(res) {
            vm.$dialog.toast({
              mes: res.msg
            });
          }
        });
      });
    },
    showEdit() {
      this.newMobile = this.info.sellerMobile;
      let area = this.info.areaId ? this.info.areaId.areaId + "" : "--";
      this.newAddress = [
        this.info.provinceId.provinceId + "",
        this.info.cityId.cityId + "",
        area
      ];
      this.newAddressDetail = this.info.addressDetail;
      this.showPopup = true;
    },
    saveInfo() {
      let vm = this;
      let area = this.newAddress[2] == "--" ? "0" : this.newAddress[2];
      mui.ajax({
        url: updateAddressInfo,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          storeId: this.info.id,
          sellerMobile: this.newMobile,
          cityValue: `${this.newAddress[0]},${this.newAddress[1]},${area}`,
          addressDetail: this.newAddressDetail,
          token: md5(`gjfengupdateAddressInfo${this.info.id}`)
        },
        success(res) {
          vm.$dialog.toast({
            mes: res.msg,
            callback: () => {
              vm.getMyStore();
              vm.showPopup = false;
            }
          });
        }
      });
    },
    saveIntro() {
      let vm = this;
      if (!this.info.storeDescription || this.info.storeDescription == "null") {
        this.$dialog.alert({
          mes: "请输入店铺简介"
        });
        return;
      }
      mui.ajax({
        url: updateIntro,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          description: this.info.storeDescription,
          storeId: this.info.id,
          token: md5(`gjfengupdateIntro${this.info.id}`)
        },
        success(res) {
          vm.$dialog.toast({
            mes: res.msg
          });
          vm.editTag = true;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.store-banner {
  background-color: @white;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  .wh(100%, 5rem);
  .upload-box {
    .hv-cen;
    .text-center;
    color: @white;
    .wh(2rem, 40px);
    line-height: 40px;
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.3);
    border: 2px solid @white;
  }
  input[type="file"] {
    .hv-cen;
    .wh(100%, 100%);
    opacity: 0;
  }
}

.store-info {
  background-color: @white;
  .pd;
  .mg-v;
  font-size: 14px;
  .store-title {
    font-size: 0.35rem;
    .pd-v;
    border-bottom: 1px solid #f7f5f5;
  }
  > div {
    margin: 0.1rem 0;
  }
}

.edit-container {
  border-radius: 5px;
  .blue-header {
    background-color: @blue;
    height: @pd;
  }
}
</style>