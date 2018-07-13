<template>
  <div class="modal-layer">
    <transition name="t-layer">
      <div class="v-layer" @click='closeOverlay' v-show="showCertificate"></div>
    </transition>
    <transition name="t-scale">
      <div class="v-modal" v-show='showCertificate'>
        <header>
          <h3>
            身份认证
            <p class="danger-color fs-12">注意：一经认证，无法再修改</p>
          </h3>
        </header>
        <main>
          <div class="cert-container">
            <div class="input-group">
              <label for="real-name">真实姓名</label>
              <input id="real-name" type="text" placeholder="请输入真实姓名" v-model="realName">
            </div>
            <div class="input-group">
              <label for="cert-num">身份证号码</label>
              <input id="cert-num" type="tel" placeholder="请输入身份证号码" v-model="certNum">
            </div>
            <button class="save-btn" @click="saveCert">确定</button>
          </div>
        </main>
        <footer>
          <slot name='footer'></slot>
        </footer>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { realNameByAly } from "../../api/index";
export default {
  name: "CertModal",
  props: {},
  data() {
    return {
      realName: "",
      certNum: ""
    };
  },
  computed: {
    ...mapState(["account", "showCertificate"])
  },
  created() {},
  methods: {
    closeOverlay() {
      this.$store.commit("SHOW_CERTIFICATE", false);
    },
    saveCert() {
      let vm = this;
      if (!this.realName || !this.certNum) {
        this.$dialog.toast({
          mes: "请完善信息",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      if (!/(^\d{15}$)|(^\d{17}([0-9]|[X|x])$)/.test(this.certNum)) {
        this.$dialog.toast({
          mes: "请输入正确的身份证号",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      mui.ajax({
        url: realNameByAly,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          idCardNo: this.certNum.replace(/x/gi, "X"),
          idCardName: this.realName,
          account: this.account,
          token: md5(`gjfengrealNameByAly${this.account}`)
        },
        success(res) {
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: res.msg,
              timeout: 1500,
              icon: "success",
              callback: () => {
                vm.$store.commit("SHOW_CERTIFICATE", false);
                vm.$store.commit("SET_CERTIFICATE", true);
                vm.$store.commit(
                  "RECORD_ID_CARD",
                  vm.certNum.replace(/x/gi, "X")
                );
                vm.$emit("update-name", vm.realName);
                vm.$emit('callback');
              }
            });
          } else {
            vm.$dialog.toast({
              mes: res.msg,
              timeout: 1500,
              icon: "error"
            });
          }
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.v-layer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
}

.v-modal {
  position: fixed;
  width: 6rem;
  min-height: 5rem;
  left: 50%;
  top: 50%;
  margin-left: -3rem;
  margin-top: -2.5rem;
  background: #fff;
  border-radius: 5px;
  background: #fff;
  z-index: 1001;
  header {
    font-size: 18px;
    text-align: center;
    padding: 10px 0;
    font-weight: normal;
  }
}

.t-scale-enter-active {
  animation: scale-in 0.5s linear;
}

.t-scale-leave-active {
  transform: scale(0);
  transition: transform 500ms;
}

@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.cert-container {
  .pd-h;
  .input-group {
    margin-bottom: @pd;
    border-bottom: 1px solid #fcfcfc;
    font-size: 14px;
    label {
      display: block;
      margin-bottom: @pd / 2;
    }
    input {
      outline: none;
      border: 1px solid #ddd;
      padding: @pd;
      width: 100%;
      font-family: Helvetica;
      &:focus {
        border-color: @blue;
        box-shadow: 0 0 5px @blue;
      }
    }
  }
  .sure-btn {
    display: block;
    width: 70%;
    margin: @pd auto;
    padding: @pd 0 @pd @pd;
    letter-spacing: @pd;
    background-color: @blue;
    color: @white;
    font-size: 16px;
    border-radius: 5px;
  }
}
</style>