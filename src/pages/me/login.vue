<template>
  <div>
    <header-top title="登录注册"></header-top>
    <div class="page-container">
      <yd-cell-group>
        <yd-cell-item>
          <span class="iconfont self-mobile" slot="icon"></span>
          <yd-input :debug="true" v-model="mobile" placeholder="请输入手机号码" required regex="mobile" slot="right"></yd-input>
        </yd-cell-item>
        <yd-cell-item v-if="loginWay">
          <span class="iconfont self-code" slot="icon"></span>
          <input type="tel" slot="right" placeholder="请输入验证码" v-model="code" maxlength="6" @input="formatDigit($event)">
          <yd-sendcode slot="right" v-model="startSend" @click.native="sendCode" :type="rightMobile?'warning':'disabled'"></yd-sendcode>
        </yd-cell-item>
        <yd-cell-item>
          <span class="iconfont self-lock" slot="icon"></span>
          <yd-input slot="right" type='password' v-model="password" required :max='16' :min='6' placeholder='请输入6-16位数字或字母的密码' regex="^[0-9a-zA-Z]{6,16}$"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <div v-if="loginWay">
        <check-icon :value.sync="checkProtocol" type="plain">{{checkProtocol?'同意':'不同意'}}</check-icon>
        <router-link to="/me/regpro" class="protocol">《用户注册协议》</router-link>
        <yd-button size="large" type="warning" :disabled="!validRegister" @click.native="register">注册</yd-button>
        <div class="tips text-center">
          已有账号？
          <span style="color:#10aeff;" @click="loginWay=false">直接登录</span>
        </div>
      </div>
      <div class="flex just-between" v-else>
        <yd-button type="primary" size="large" :disabled="!validLogin" @click.native="login">登 录</yd-button>
        <yd-button type="danger" size="large" @click.native="forget">忘记密码</yd-button>
        <div class="tips text-center">
          没有账号？
          <span style="color:#10aeff;" @click="loginWay=true">注册账户</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { sendcode, register, login } from "../../api/index";
import { CheckIcon } from "vux";
import { setStore } from "components/common/mixin";
export default {
  name: "Login",
  data() {
    return {
      loginWay: false, //judge login or register,default way is login
      mobile: "",
      code: "",
      correctCode: "",
      password: "",
      startSend: false,
      checkProtocol: true
    };
  },
  components: { HeaderTop, CheckIcon },
  computed: {
    rightMobile() {
      return /^1[3,4,5,7,8,9]\d{9}$/.test(
        this.mobile
      );
    },
    rightCode() {
      return /^\d{6}$/gi.test(this.code) && this.code == this.correctCode;
    },
    rightPwd() {
      return /[0-9a-zA-Z]{6,16}/.test(this.password);
    },
    validRegister() {
      return (
        this.rightMobile &&
        this.rightCode &&
        this.rightPwd &&
        this.checkProtocol
      );
    },
    validLogin() {
      return this.rightMobile && this.rightPwd;
    }
  },
  activated() {
    this.password = "";
  },
  methods: {
    formatDigit(event) {
      this.code = event.target.value.replace(/\D/g, "");
    },
    sendCode() {
      let vm = this;
      this.code = "";
      this.correctCode = "";
      this.$dialog.loading.open("发送中...");
      mui.ajax({
        url: sendcode,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          mobile: this.mobile,
          token: md5(`gjfengsend${this.mobile}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res) {
            vm.correctCode = res.content;
            vm.startSend = true;
            vm.$dialog.toast({
              mes: "已发送",
              icon: "success",
              timeout: 1500
            });
          } else {
            vm.correctCode = "";
            vm.startSend = false;
          }
        },
        error(e) {
          vm.correctCode = "";
          vm.startSend = false;
        }
      });
    },

    register() {
      let vm = this;
      mui.ajax({
        url: register,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.mobile,
          password: this.password,
          nickname: "",
          token: md5("gjfengregister")
        },
        success(res) {
          if (res.code == "200") {
            vm.$dialog.toast({
              mes: "注册成功",
              timeout: 1500,
              callback: () => {
                vm.$store.commit("SET_ACCOUNT", vm.mobile);
                setStore("account", vm.mobile);
                vm.$router.push({ path: "/me/index" });
              }
            });
          } else {
            vm.$dialog.toast({
              mes: res.msg || "注册失败",
              timeout: 1500
            });
            return;
          }
        },
        error(res) {
          vm.$dialog.toast({
            mes: res.msg || "注册失败",
            timeout: 1500
          });
          return;
        }
      });
    },
    login() {
      let vm = this;
      this.$dialog.loading.open("登录中...")
      mui.ajax({
        url: login,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.mobile,
          password: this.password,
          token: md5("gjfenglogin")
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == "200") {
            vm.$dialog.toast({
              mes: "登录成功",
              timeout: 1000,
              callback: () => {
                vm.$store.commit("SET_ACCOUNT", vm.mobile);
                localStorage.setItem("account", vm.mobile);
                vm.$store.dispatch("getInfo");
                vm.$router.go(-1);
              }
            });
          } else {
            vm.$dialog.toast({
              mes: res.msg || "登录信息有误请检查",
              timeout: 1500
            });
            return;
          }
        }
      });
    },
    forget() {
      this.$router.push({ name: "Forgetpwd" });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.page-container {
  padding: 0.3rem;
  .forget-pwd {
    display: block;
    width: 2rem;
    padding: 0.1rem 0;
    .text-center;
    margin: 0.8rem auto;
    color: @blue;
    border: 1px solid currentColor;
    border-radius: 5px;
    &:active {
      background-color: @blue;
      color: @white;
    }
  }
}

.tips {
  margin: 1rem auto 0;
  font-size: 0.32rem;
}
</style>