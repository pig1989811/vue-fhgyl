<template>
  <div>
    <header-top title="修改资料"></header-top>
    <main class='scroll-content-2'>
      <yd-cell-group class="member-container">
        <yd-cell-item arrow style="padding:.2rem 0 .2rem .24rem;">
          <span slot="left">头像</span>
          <div slot="right">
            <div id="head-img" :style="{'background-image':'url('+info.imgHeadUrl+')'}"></div>
            <input type="file" accept="image/*" class="head-img" name="head-img" @change="previewImg($event)">
          </div>
        </yd-cell-item>
        <yd-cell-item :arrow="!certificateStatus">
          <span slot="left">身份实名</span>
          <span slot="right" @click="showModal" v-if="!certificateStatus">去认证</span>
          <span slot="right" v-else>{{info.name}}</span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">昵称</span>
          <input slot="right" v-model="info.nickName" type="text" style="text-align:right;" class="hight-input" placeholder="不要输入特殊符号">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">性别</span>
          <div slot="right">
            <label for="male" class="self-radio">
              <input type="radio" value="1" id="male" v-model="info.sex">
              <span>男</span>
            </label>
            <label for="female" class="self-radio">
              <input type="radio" value="2" id="female" v-model="info.sex">
              <span>女</span>
            </label>
            <label for="sex-x" class="self-radio">
              <input type="radio" value="3" id="sex-x" v-model="info.sex">
              <span>未知</span>
            </label>
          </div>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left" style="margin-right:.4rem;">简介</span>
          <yd-textarea slot="right" placeholder="请输入简介" maxlength="30" v-model="info.remark" class="hight-input"></yd-textarea>
        </yd-cell-item>
      </yd-cell-group>
      <div style="padding:0 .2rem;">
        <yd-button size="large" type="primary" @click.native="saveInfo">保存</yd-button>
      </div> 
    </main>
    <cert-modal @update-name="showRealName"></cert-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import CertModal from "components/common/CertModal";
import { update } from "../../api/index";
import { mixin } from "components/common/mixin";
import "lrz/dist/lrz.bundle.js";
export default {
  name: "Update",
  data() {
    return {
      info: {},
      base64Url: ""
    };
  },
  components: { HeaderTop, CertModal },
  computed: {
    ...mapState(["account","member", "certificateStatus"])
  },
  mixins: [mixin],
  created() {},
  mounted() {
    [...document.querySelectorAll("input[type='text'],input[type='tel'],input[type='number'],textarea")].forEach((item, index) => {
      item.addEventListener("focus", function() {
        item.scrollIntoView();
      });
    });
  },
  activated() {
    this.info = this.member;
  },
  methods: {
    previewImg(event) {
      let headImg = document.getElementById("head-img"),
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
        vm.base64Url = rst.base64;
      });
    },
    showModal() {
      this.$store.commit("SHOW_CERTIFICATE", true);
    },
    showRealName(val){
      this.info = Object.assign({},this.info,{name:val});
    },
    saveInfo() {
      if (!this.info.nickName) {
        this.$dialog.toast({
          mes: "昵称不能为空",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (!this.info.remark || this.info.remark == "null") {
        this.info.remark = "";
      }
      let vm = this;
      if (!this.base64Url) {
        lrz(this.info.imgHeadUrl).then(rst => {
          vm.base64Url = rst.base64;
          vm.submitInfo();
        });
          return;
      }
      this.submitInfo();
    },
    submitInfo() {
      let vm = this;
      this.$dialog.loading.open("更新中...");
      mui.ajax({
        url: update,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id: this.info.id,
          fileName: `123.png`,
          nickName: this.info.nickName,
          remark: this.info.remark,
          sex: this.info.sex,
          account: this.account,
          token: md5(`gjfengupdate${this.info.id}`),
          fileContent: this.base64Url
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.$dialog.toast({
            mes: "修改成功",
            timeout: 1000,
            icon: "success",
            callback: () => {
              vm.$store.dispatch("getInfo");  
              vm.$router.go(-1);
            }
          });
        },
        error(res) {
          vm.$dialog.toast({
            mes: "修改失败",
            timeout: 1500,
            icon: "error"
          });
          return;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.member-container {
  margin-top: @pd;
  img {
    border-radius: 50%;
    .wh(1.2rem, 1.2rem);
  }
  #head-img {
    border-radius: 50%;
    .wh(1.2rem, 1.2rem);
    background-size: cover;
    background-repeat: no-repeat;
  }
  .head-img {
    position: absolute;
    flex: 1;
    height: 1.2rem;
    right: 0.44rem;
    top: 0.24rem;
    opacity: 0;
  }
  .hight-input {
    &:focus {
      box-shadow: 0 0 5px @green inset;
      padding-right: @pd * 2;
      margin-left: @pd;
    }
  }
}
.self-radio {
  position: relative;
  display: inline-block;
  padding-right: 10px;
  padding-left: 25px;
  font-size: 14px;
  > input[type="radio"] {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 15;
    &:checked + span::before {
      border-color: rgb(76, 216, 100);
    }
    &:checked + span::after {
      color: rgb(76, 216, 100);
      opacity: 1;
      transform: scale(1);
      transition: all 0.2s ease-in-out;
    }
  }
  span {
    &::before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      border: 1px solid #ccc;
      border-radius: 50%;
      display: inline-block;
      z-index: 10;
      vertical-align: middle;
    }
    &::after {
      position: absolute;
      content: "";
      left: 5px;
      top: 5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: currentColor;
      opacity: 0;
      transform: scale(0);
    }
  }
}
</style>