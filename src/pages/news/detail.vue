<template>
  <div>
    <header-top title="资讯详情"></header-top>
    <main class='scroll-content-2' style="background-color:#fff;">
      <section>
        <h3 class="news-title">{{info.title}}</h3>
        <div class="flex just-between align-center news-detail">
          <p class="news-author">{{info.autor}}</p>
          <p class="news-time">{{formatTime(info.initTime,true)}}</p>
          <div class="news-content" v-html="info.contents"></div>
          <div class="news-img">
            <img :src="info.photo">
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { findNewsById } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "NewsDetail",
  data() {
    return {
      info: {}
    };
  },
  components: { HeaderTop },
  computed: {},
  mixins: [mixin],
  created() {
    this.getDetail(this.$route.query.id);
  },
  activated() {},
  methods: {
    getDetail(id) {
      let vm = this;
      mui.ajax({
        url: findNewsById,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id,
          token: md5(`gjfengfindNewsById`)
        },
        success(res) {
          vm.info = res.result;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
section{
  .pd;
}
.news-title {
  .text-center;
  font-size: 0.35rem;
}
.news-author{
  font-size: .28rem;
}
.news-time{
  font-size: .26rem;
  color:@lightgray;
}
.news-content{
  .mg-v;
}
.news-img{
  img{
    width: 100%;
  }
}
</style>