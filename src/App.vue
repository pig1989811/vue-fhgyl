<template>
  <div id="app">
    <!-- <transition name="router-fade" mode="out-in"> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getStore } from 'components/common/mixin'
export default {
  name: 'app',
  computed: {
    ...mapState(['account'])
  },
  created() {
    this.redirect();
  },
  mouned() {
  },
  methods: {
    redirect() {
      this.$router.beforeEach((to, from, next) => {
        if (to.matched.some(record => record.meta.requireAuth)) {
          if (!(getStore("account") && getStore("account").length > 0)) {
            next({
              path: '/me/login'
            })
          }
          else {
            next();
          }
        }
        else {
          next();
        }
      })
    }
  }
}
</script>

<style lang="less">
@import 'style/common.less';
</style>
