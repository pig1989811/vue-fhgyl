<template>
  <yd-navbar class="position:fixed;">
    <section slot="left" @click="$router.go(-1)" v-if="back" style="height:1rem;line-height:1rem;">
      <yd-navbar-back-icon>返回</yd-navbar-back-icon>
    </section>
    <div slot="center" @click="goTop" class="title">
      {{title}}
    </div>
    <router-link to="/me/login" slot="right" v-if="login" class="danger-color">
      注册|登录
    </router-link>
  </yd-navbar>
</template>
<script>
export default {
  name: 'HeaderTop',
  props: {
    back: {
      type: Boolean,
      default: true
    },
    login: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "凤凰云商供应链"
    }
  },
  data() {
    return {
      t: 0
    }
  },
  methods: {
    goTop() {
      var timer = null;
      let vm = this;
      const m = document.querySelector('main');
      window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
      window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAniamtionFrame;
      window.cancelAnimationFrame(timer);
      timer = window.requestAnimationFrame(function smoothScroll() {
        vm.t = m.scrollTop;
        if (vm.t > 0) {
          timer = window.requestAnimationFrame(smoothScroll);
          m.scrollTop -= vm.t / 5;
        }
        else {
          window.cancelAnimationFrame(timer);
        }
      })
    }
  },
}
</script>
<style lang='less' scoped>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(92, 92, 92);
  font-size: 0.4rem;
}
.scan-box{
  padding: 0 5px;
}
</style>