<template>
  <div>
    <header-top title="网上商城" :back="false" :login="!loginAccount">注册|登录</header-top>
    <main class='scroll-content'>
      <yd-pullrefresh  ref="homepage" :callback="refresh" :show-init-tip="false">
      <section>
        <yd-slider :loop="false" :autoplay="3000">
          <yd-slider-item v-for="item in info.indexAds" :key="item.id">
            <router-link :to="{name:'Product',query:{id:item.address.substring(item.address.lastIndexOf('/')+1),tips:0}}">
              <img :src="item.photo" :alt="item.names">
            </router-link>
          </yd-slider-item>
        </yd-slider>
      </section>
      <section class="vocher-container">
        <div class="flex align-center news-box" v-show="info.newList&&info.newList.result.length">
          <div class="rolltip"><span class="iconfont-large self-announce danger-color"></span></div>
          <yd-rollnotice autoplay="4000" class="flex-1">
            <yd-rollnotice-item v-for="(item,index) in info.newList&&info.newList.result" :key="index">
              <router-link :to="{name:'NewsDetail',query:{id:item.id}}" class="flex align-center" style="width:100%;">
                <span class="news-tag">{{item.source}}</span>
                <span class="news-title flex-1 fs-14">{{item.title}}</span>
              </router-link>
            </yd-rollnotice-item>
          </yd-rollnotice>
          <router-link :to="{name:'News',query:{query:true}}">更多></router-link>
        </div>
      </section>
      <section class="platform-container flex just-around">
        <div class="discount-tag">优惠购</div>
        <div v-for="(item,index) in platform" :key="index" class="platform-item" @click="navigate(item.link,{id:item.id,type:item.type})">
          <img :src="getLocalImg(item.img)">
          <p>{{item.text}}</p>
        </div>
      </section>
      <section class="bank-container" @click="navigateBank">
        <div class="top-text">
          <span>&gt;&gt;&gt;</span>
          <span>民生银行分期购 0手续费</span>
          <span>&lt;&lt;&lt;</span>
        </div>
        <p>轻松购物 乐享生活</p>
      </section>
      <section class="high-container" v-for="(item,index) in info.indexActivity" :key="index">
          <img :src="item.photo" @click="navigate('Products',{id:item.address.slice(item.address.lastIndexOf('/')+1),type:1})">
        </section>
        <section class="hot-container">
          <div class="hot-box">
            <div class="hot-header">
              <img :src="getLocalImg('20180529_4.png')" alt="">
              <span>{{info.indexSupColumns&&info.indexSupColumns[0].faterColumnName}}</span>
            </div>
            <ul class="type-list clearfix">
              <li class="type-item pd-item fl" v-for="(item,index) in info.indexSupColumns&&info.indexSupColumns[0].supColumn" :key="index" @click="navigate('Products',{id:item.id,type:1})">
                <div class="img-cover">
                  <img :src="item.pic1">
                </div>
                <div class="type-title jianbian-bg1">{{item.shortName}}</div>
              </li>
            </ul>
          </div>
          <template v-for="(item,index) in info.indexProducts">
            <div :key="index" class="hot-box" v-if="item.product.length>0">
              <div class="hot-header">
                <img :src="getLocalImg('20180529_4.png')" alt="">
                <span>{{item.columnName}}</span>
              </div>
              <ul class="pd-list clearfix">
                <router-link :to="{path:'/online/product',query:{id:pd.id}}" v-for="pd in item.product" :key="pd.id" tag="li" class="pd-item fl">
                  <div class="img-cover">
                    <img :src="pd.imgUrl" :alt="pd.name">
                  </div>
                  <div class="title">
                    <h3>{{pd.name}}</h3>
                  </div>
                  <div class="price">
                    零售价:
                    <span class="danger-color fs-15">￥{{pd.price}}</span>
                  </div>
                </router-link>
              </ul>
            </div>
          </template>
        </section>
        <section class="activity-container clearfix" v-for="(item,index) in info.indexSupColumns&&info.indexSupColumns.slice(1)" :key="index">
          <div class="activity-header" :style="{'background-image':formatBg('20180529_2.png')}">
            <span class="jianbian-text1">{{item.faterColumnName}}</span>
          </div>
          <div class="activity-item fl" v-for="(aItem,aIndex) in item.supColumn" :key="aIndex" @click="navigate('Products',{id:aItem.id,type:1})">
            <div class="activity-text fl">
              <h3 class="activity-name">{{aItem.names}}</h3>
              <p>{{aItem.intro}}</p>
            </div>
            <div class="activity-thumb fr">
              <img :src="aItem.pic1||aItem.pic2" alt="">
            </div>
          </div>
        </section>
        <section class="merchant-container">
          <img :src="getLocalImg('20180529_3.jpg')" alt="开通跨行业盈利系统">
        </section>
      </yd-pullrefresh>
    </main>
    <footer-bar></footer-bar>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import FooterBar from "components/footer/index";
import { mixin, getStore, setStore, localImg } from "components/common/mixin";
import { supplyChainOnlineShopIndex, findAppUpgredeByType } from "../../api/index";
export default {
  name: "Online",
  data() {
    return {
      oldBack: mui.back,
      info: {},
      pds: [],
      loginAccount: false,
      platform: [
        { img: "taobao.jpg", link: "TianMao", text: "淘宝" },
        { img: "tianmao.png", link: "TianMao", text: "天猫" },
        { img: "jingdong.jpg", link: "JingDong", text: "京东" },
        { img: "ziying.png", link: "Products",text: "自营商城",id:1398,type:1 },
        { img: "column.png", link: "AllColumn", text: "所有分类" }
      ],
      type: "", //APP环境
      curVersion: "" //app版本
    };
  },
  components: { HeaderTop, FooterBar },
  computed: { ...mapState(["account", "member"]) },
  mixins: [mixin, localImg],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.plusReady();
    });
  },
  beforeRouteLeave(to, from, next) {
    mui.back = this.oldBack;
    next();
  },
  created() {
    this.init();
    this.getInfo();
  },
  mounted() {
    document.addEventListener("plusready", this.getVersion, false);
  },
  activated() {
    this.checkLogin();
    if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.$store.state.positions[
        this.$route.path
      ];
    }
  },
  methods: {
    init() {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1; //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      this.type = isiOS ? "1" : "0";
    },
    checkLogin() {
      if (getStore("account") && getStore("account").length > 0) {
        this.loginAccount = true;
        this.$store.commit("SET_ACCOUNT", getStore("account"));
        if (!this.member) {
          this.$store.dispatch("getInfo");
        }
      } else {
        this.loginAccount = false;
      }
    },
    getInfo() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: supplyChainOnlineShopIndex,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          token: md5(`gjfengsupplyChainOnlineShopIndex`)
        },
        success(res) {
          vm.$dialog.loading.close();
          let _pds = [];
          vm.info = res.result;
        },
        error(e) {
          vm.$dialog.loading.close();
          vm.$dialog.toast({
            mes: "网络异常，请稍后重试！"
          });
        }
      });
    },
    refresh(){
      let pa = Promise.resolve(this.getInfo());
      let pb = Promise.resolve(this.checkLogin());
      Promise.all([pa,pb]).then((a,b)=>{
        this.$refs.homepage.$emit('ydui.pullrefresh.finishLoad');
      })
    },
    navigate(link,p) {
      //商品列表
      if(p.id){
        this.$router.push({
        name: "Products",
        params:{update:true},
        query: p
      });
      }
        //其他平台
      else{
      if (!link) {
        this.$dialog.toast({
          mes: "数据对接中，敬请期待！"
        });
        return;
      }
      this.$router.push({ name: link});
      }
    },
    navigateBank(){
      location.href='https://wlg.creditcard.cmbc.com.cn/sub_center/login/login.action?code=WLGDG00038'
    },
    goVocher() {
      this.$router.push({
        name: "Products",
        params:{update:true},
        query: { type: 1, id: 1415 }
      });
    },
    getVersion() {
      let vm = this;
      plus.runtime.getProperty(plus.runtime.appid, function(inf) {
        vm.curVersion = inf.version;
        if (vm.type == "0") {
          vm.findUpgrade();
        }
      });
    },
    findUpgrade() {
      let vm = this;
      mui.ajax({
        url: findAppUpgredeByType,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          type: this.type,
          token: md5("gjfengfindAppUpgredeByType")
        },
        success(res) {
          let _result = res.result;
          if (_result.version && vm.curVersion < +_result.version) {
            vm.$store.commit("RECORD_UPDATE", true);
            vm.$dialog.confirm({
              title: `检测到新版本：${_result.version}，是否升级？`,
              mes: `${_result.describe}`,
              opts: () => {
                let wgtUrl = _result.jumpUrl;
                vm.downloadWgt(wgtUrl);
              }
            });
          }
        }
      });
    },
    downloadWgt(url) {
      let vm = this;
      this.$dialog.loading.open("下载更新...");
      plus.downloader
        .createDownload(url, { filename: "_doc/update/" }, function(d, status) {
          if (status == 200) {
            vm.installWgt(d.filename); // 安装更新包
          } else {
            vm.$dialog.alert({
              mes: "下载更新失败！"
            });
          }
          vm.$dialog.loading.close();
        })
        .start();
    },
    installWgt(path) {
      let vm = this;
      this.$dialog.loading.open("安装更新...");
      plus.runtime.install(
        path,
        {},
        function() {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: "应用资源更新完成！",
            callback: () => {
              plus.runtime.restart();
            }
          });
        },
        function(e) {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: "安装更新失败[" + e.code + "]：" + e.message
          });
        }
      );
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.yd-slider-item img {
  max-height: 4rem;
}
.platform-container {
   background-color: @white;
  padding: 0.5rem 0 0.1rem;
  position: relative;
  overflow: hidden;
  .discount-tag {
    position: absolute;
    left: -0.15rem;
    top: 0;
    border-radius: 10px;
    background-color: rgb(228, 1, 12);
    color: @white;
    font-size: 0.24rem;
    padding: 2px 0.1rem;
    width: 1rem;
    text-align: right;
  }
  .platform-item {
    margin-bottom: @pd;
    text-align: center;
    img {
      .wh(1rem,1rem);
      border-radius: 50%;
    }
    p {
      font-size: 0.26rem;
    }
  }
}
.vocher-container {
  img {
    width: 100%;
  }
  .news-box {
    padding: @pd 0.1rem 0;
    .news-tag {
      display: inline-block;
      margin: 0 0.1rem;
      color: @red;
      border: 1px solid @red;
      border-radius: 10px;
      padding: 1px 5px;
      .text-center;
    }
    .news-title {
      .ellipsis;
    }
  }
}
.bank-container{
  background-color: #308fd9;
  color: @white;
  text-align: center;
  .pd-v;
  .top-text{
    font-size: .34rem;
    span:nth-of-type(2){
      display: inline-block;
      margin: 0 .1rem;
    }
  }
  p{
    font-size: .24rem;
    margin-top: .1rem;
  }
}
.high-container {
  background-color: @white;
  img {
    width: 100%;
  }
}
.hot-container {
  padding-bottom: @pd;
  background-color: rgb(254, 30, 54);
  .hot-box {
    .hot-header {
      position: relative;
      color: @white;
      font-weight: bold;
      text-align: center;
      img {
        .wh(4rem,0.8rem);
      }

      span {
        .hv-cen;
        font-size: 0.32rem;
        z-index: 5;
      }
    }
  }
  .pd-item {
    width: 30.6%;
    margin-left: 2%;
    padding: 0.1rem;
    background-color: @white;
    .img-cover {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding: 50% 0;
      background-color: @white;
      border-radius: 2px;
      img {
        width: 100%;
        .hv-cen;
        border-radius: 2px;
      }
    }
    .title {
      height: 40px;
      line-height: 20px;
      h3 {
        .multi-ellipsis(2);
        padding: 0 2px;
        font-size: 0.26rem;
        font-weight: normal;
        word-wrap: break-word;
        word-break: break-all;
        color: #333;
      }
    }
    .price {
      margin-top: 0.1rem;
      font-size: 0.2rem;
      text-align: right;
    }
  }
  .type-item {
    .type-title {
      color: @white;
      font-size: 0.28rem;
      font-weight: 700;
      text-align: center;
      border-radius: 0.4rem;
      margin: 0.2rem;
      padding: 3px 0;
    }
  }
}
.jianbian-bg1 {
  background: -webkit-linear-gradient(left, rgb(252, 10, 34), rgb(242, 134, 0));
}
.jianbian-bg2 {
  background: -webkit-linear-gradient(
    left,
    rgb(248, 44, 131),
    rgb(250, 92, 65)
  );
}
.jianbian-text1 {
  display: inline-block;
  background: -webkit-linear-gradient(left, rgb(73, 38, 180), rgb(7, 158, 227));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.activity-container {
  background-color: rgb(242, 242, 242);
  .activity-header {
    .pd-v;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 5px;
    text-align: center;
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .activity-item {
    width: 50%;
    min-height: 2rem;
    padding: 10px 0;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background-color: @white;
    box-shadow: 0 0 1px rgba(120, 120, 120, 0.3);
    &:nth-of-type(2n+1) {
      border-right: none;
    }
    .activity-text {
      width: 60%;
      padding-left: 8px;
      
      p {
        font-size: 10px;
        color: rgb(153, 153, 153);
        margin:5px 0;
      }
      .activity-desc {
        color: #fff;
        font-size: 8px;
        padding: 3px 5px;
        border-radius: 3px;
      }
    }
    .activity-thumb {
      width: 40%;
      img {
        width: 100%;
        padding-right: 8px;
      }
    }
    .activity-name {
      font-size: 16px;
    }
  }
}
.merchant-container {
  .pd;
  img {
    width: 100%;
  }
}
</style>