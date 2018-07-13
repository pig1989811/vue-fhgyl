<template>
  <div>
    <header-top title="商家入驻"></header-top>
    <main class='scroll-content-2'>
      <yd-step :current="step1" current-color="#04be02">
        <yd-step-item>
          <span slot="bottom">基本信息</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">店铺地址</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">营业执照</span>
        </yd-step-item>
      </yd-step>
      <group v-show="step1==1">
        <x-textarea title="店铺名称：" v-model="storeName" placeholder="请填写店铺名称" :rows="2" inline-desc="(不可更改)"></x-textarea>
        <x-input title="联系人：" v-model="sellerName" placeholder="请填写企业联系人" :required="true"></x-input>
        <x-input title="联系电话：" v-model="sellerMobile" placeholder="请填写联系人的手机号码" type="tel" is-type="china-mobile" :required="true"></x-input>
      </group>
      <group v-show="step1==2">
        <x-address title="省份城市：" v-model="storeCitys" :list="addressData" placeholder="请选择地址" :show.sync="show1"></x-address>
        <x-textarea title="详细地址：" v-model="addressDetail" placeholder="街道、楼牌号码等" :max="200"></x-textarea>
      </group>
      <group v-show="step1==3">
        <div class="upload-container">
          <p class="tips">请确保营业执照图片清晰，文字可辨并有清晰的红色公章。</p>
          <img src="" alt="" class="licence-picture">
          <div class="upload-icon">
            <span class="iconfont self-upload"></span>
            <input type="file" accept="image/*" name="licence-upload" id="licence-upload" @change="choosePicture($event)">
          </div>
        </div>
      </group>
      <div class="flex just-center btn-groups">
        <yd-button size="large" type="danger" @click.native="step1--" v-if="step1>1&&step1<=3" class="flex-1">上一步</yd-button>
        <yd-button size="large" v-if="step1>=1&&step1<3" class="flex-1" @click.native="nextStep">下一步</yd-button>
        <yd-button size="large" :type="valid?'warning':'disabled'" v-if="step1==3" class="flex-1" @click.native="applicate">提交申请</yd-button>
      </div>

    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import {
  Group,
  Cell,
  XInput,
  XTextarea,
  XAddress,
  XButton,
  CheckIcon,
  ChinaAddressV4Data
} from "vux";
import { addStore } from "../../api/index";
import { validateSettle } from "components/common/mixin";
import "lrz/dist/lrz.bundle.js";
export default {
  name: "IndividualSettle",
  data() {
    return {
      oldBack: mui.back,
      step1: 1,
      show1: false, //店铺地址判断标志

      storeName: "", //店铺名称
      sellerName: "", //联系人
      sellerMobile: "", //联系电话

      storeCitys: [], //店铺地址id
      addressDetail: "", //街道

      fileContent: "", //营业执照base64
      addressData: ChinaAddressV4Data, //省市县数据

      checkProtocol: true
    };
  },
  components: {
    HeaderTop,
    Group,
    Cell,
    XInput,
    XTextarea,
    XAddress,
    XButton,
    CheckIcon
  },
  computed: {
    ...mapState(["account"]),
    valid() {
      return this.validFileContent;
    }
  },
  mixins: [validateSettle],
  created() {},
  activated() {},
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
      if (this.show1) {
        this.show1 = false;
      } else {
        this.$router.go(-1);
      }
    },
    nextStep() {
      switch (this.step1) {
        case 1:
          this.validStoreName && this.validSellerName && this.validSellerMobile
            ? this.step1++
            : this.$dialog.alert({ mes: "请完善基本信息" });
          break;
        case 2:
          this.validStoreCitys && this.validAddressDetail
            ? this.step1++
            : this.$dialog.alert({ mes: "请完善地址信息" });
          break;
      }
      // this.step1++;
    },
    choosePicture(event) {
      let p = document.querySelector(".licence-picture"),
        file = event.target.files[0];
      if (!/image\/\w+/.test(file.type)) {
        this.$dialog.toast({
          mes: "请上传图片",
          timeout: 1000,
          icon: "error"
        });
        return;
      }
      this.$dialog.loading.open("上传中...");
      lrz(file, { width: 800 }).then(rst => {
        this.$dialog.loading.close();
        p.src = rst.base64;
        this.fileContent = rst.base64;
      });
    },
    applicate() {
      let vm = this;
      let a1 = this.storeCitys[2] == "--" ? "0" : this.storeCitys[2];
      let params = {
        storePro: "0",  //店铺类型-O2O
        storeType: "0", //入驻类型-个体入驻
        storeName: this.storeName,
        sellerName: this.sellerName,
        sellerMobile: this.sellerMobile,
        storeCitys: `${this.storeCitys[0]},${this.storeCitys[1]},${a1}`,
        addressDetail: this.addressDetail,
        businessLicenceStart: "20160901",
        businessLicenceEnd: "20700901",
        fileName: "123.png",
        account: this.account,
        token: md5("gjfengaddStore"),
        fileContent: this.fileContent
      };
      this.$dialog.loading.open("申请中...");
      mui.ajax({
        url: addStore,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: params,
        success(res) {
          vm.$dialog.loading.close();
          if (res.code != 200) {
            vm.$dialog.alert({
              mes: res.msg
            });
            return;
          }
          vm.$dialog.toast({
            mes: "申请成功",
            timeout: 1500,
            callback: () => {
              vm.$store.dispatch("getInfo");
              vm.$router.go(-1);
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
.upload-container {
  padding: @pd;
  .tips {
    font-size: 12px;
    color: #999;
    margin-bottom: 0.1rem;
  }
  .licence-picture {
    width: 100%;
  }
  .upload-icon {
    position: relative;
    text-align: center;
    span {
      font-size: 40px;
    }
    #licence-upload {
      position: absolute;
      left: 0;
      .wh(100%, 40px);
      top: 0;
      opacity: 0;
    }
  }
}
.btn-groups {
  margin-top: 1rem;
  margin-bottom: @pd;
  button {
    &:first-of-type {
      .mg-h;
    }
    &:last-of-type {
      .mg-h;
    }
  }
}
</style>