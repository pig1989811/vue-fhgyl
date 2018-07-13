<template>
  <div>
    <header-top title="APP更新"></header-top>
    <main class='scroll-content-2'>
      <section class="app-info text-center">
        <div class="fs-15">当前版本：{{curVersion}}</div>
        <a href="itms-apps://itunes.apple.com/ng/app/凤凰云商供应链/id1364282489?mt=8"  class="save-btn" v-if="type=='1'">去App Store更新</a>
        <button @click="getInfo" class="save-btn" v-else>检查更新</button>
      </section>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { findAppUpgredeByType } from "../../api/index";
export default {
  name: "UpdateApp",
  data() {
    return {
      type: "",
      curVersion: "" //app版本
    };
  },
  components: { HeaderTop },
  computed: {},
  created() {
    this.init();
  },
  mounted() {
    //document.addEventListener('plusready',this.getVersion,false)
    this.getVersion();
  },
  methods: {
    init() {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1; //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      this.type = isiOS ? "1" : "0";
      //this.curVersion = plus.runtime.version;
    },
    getVersion() {
      let vm = this;
      plus.runtime.getProperty(plus.runtime.appid, function(inf) {
        vm.curVersion = inf.version;
      });
    },
    getInfo() {
      let vm = this;
      this.$dialog.loading.open("检测中...");
      mui.ajax({
        url: findAppUpgredeByType,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          type: this.type,
          token: md5("gjfengfindAppUpgredeByType")
        },
        success(res) {
          vm.$dialog.loading.close();
          let _result = res.result;
          if (_result.version) {
            if (vm.curVersion < +_result.version) {
              vm.$dialog.confirm({
                title: `检测到新版本：${_result.version}，是否升级？`,
                mes: `${_result.describe}`,
                opts: () => {
                  let wgtUrl = _result.jumpUrl;
                  vm.downloadWgt(wgtUrl);
                }
              });
            } else {
              vm.$dialog.toast({
                mes: "当前版本已是最新！"
              });
            }
          } else {
            vm.$dialog.toast({
              mes: "没有版本发布！ "
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
            console.log("下载更新成功：" + d.filename);
            vm.installWgt(d.filename); // 安装更新包
          } else {
            console.log("下载更新失败！");
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
          console.log("安装更新成功！");
          vm.$dialog.alert({
            mes: "应用资源更新完成！",
            callback: () => {
              plus.runtime.restart();
            }
          });
        },
        function(e) {
          vm.$dialog.loading.close();
          console.log("安装更新失败[" + e.code + "]：" + e.message);
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
.app-info {
  .hv-cen;
  width: 70%;
  div {
    margin-bottom: 10%;
  }
}
</style>