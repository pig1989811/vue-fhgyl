// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import store from './store/index';
import VueLazyload from 'vue-lazyload'
import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css'
import './style/iconfont.css'
Vue.use(VueRouter)
Vue.use(YDUI)
Vue.use(VueLazyload,{
  error: process.env.NODE_ENV == 'development' ? "/static/img/default.png" : "./static/img/default.png" ,
  loading: process.env.NODE_ENV == 'development' ? "/static/img/loading.svg" : "./static/img/loading.svg" 
})
FastClick.attach(document.body)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
