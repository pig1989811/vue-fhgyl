<template>
  <div>
    <header-top title="忘记密码"></header-top>
    <main class='scroll-content-2' style="padding: .3rem;">
      <yd-cell-group>
        <yd-cell-item>
          <span class="iconfont self-mobile" slot="icon"></span>
          <yd-input v-model="mobile" placeholder="请输入手机号码" required regex="mobile" slot="right"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span class="iconfont self-code" slot="icon"></span>
          <input type="tel" slot="right" placeholder="请输入验证码" v-model="code" maxlength="6">
          <yd-sendcode slot="right" v-model="startSend" @click.native="sendCode" :type="rightMobile?'warning':'disabled'"></yd-sendcode>
        </yd-cell-item>
        <yd-cell-item>
          <span class="iconfont self-lock" slot="icon"></span>
          <yd-input slot="right" type='password' v-model="password" required :max='16' :min='6' placeholder='请输入6-16位数字或字母的密码' regex="^[0-9a-zA-Z]{6,16}$"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span class="iconfont self-lock" slot="icon"></span>
          <yd-input slot="right" type='password' v-model="confirmPwd" required :max='16' :min='6' placeholder='请再次输入密码' regex="^[0-9a-zA-Z]{6,16}$"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <yd-button :type="valid?'primary':'disabled'" size="large" @click.native="submit">确定</yd-button>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { sendcode, forgetPassWord } from "../../api/index";
export default {
  name: "ForgetPwd",
  data() {
    return {
      mobile: "",
      password: "",
      confirmPwd:"",
      startSend: false,
      code: "",
      correctCode: ""
    };
  },
  components: { HeaderTop },
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
    equalPwd(){
      return this.password == this.confirmPwd;
    },
    valid() {
      return this.rightMobile && this.rightCode && this.rightPwd && this.equalPwd;
    }
  },
  methods: {
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
          }
        }
      });
    },
    submit() {
      let vm = this;
      mui.ajax({
        url: forgetPassWord,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          mobile: this.mobile,
          newPassword: this.password,
          reNewPassword: this.confirmPwd,
          token: md5("gjfengforgetPassWord")
        },
        success(res) {
          if (res.code == "200") {
            vm.$dialog.toast({
              mes: "修改成功",
              timeout: 1500,
              icon: "success",
              callback: () => {
                vm.$router.go(-1);
              }
            });
          } else {
            vm.$dialog.toast({
              mes: res.msg || "修改失败",
              timeout: 1500,
              icon: "error"
            });
            return;
          }
        }
      });
    }
  }
};
</script>