<template>
  <div>
    <header-top title="资讯列表"></header-top>
    <main class='scroll-content-2'>
      <yd-infinitescroll :callback="getNews" ref="pdlist">
        <div slot="list" class="pd-list">
          <div v-for="(item,index) in list" :key="index" class="news-item" @click="navigate(item.id)">
            <div class="news-top flex align-center just-between">
              <p>{{item.source}}</p>
              <p class="fs-13">{{formatTime(item.initTime,true)}}</p>
            </div>
            <div class="news-middle">
              <img :src="item.photo" :alt="item.title">
            </div>
            <div class="news-bottom" v-html="item.title">
            </div>
            <div class="flex just-between align-center" style="padding-top:.1rem;">
              <span class="primary-color fs-12">查看详情</span>
              <span class="iconfont self-right fs-14" style="color:#999;"></span>
            </div>
          </div>
        </div>
      </yd-infinitescroll>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { findNewsList } from "../../api/index";
import { time } from "components/common/mixin";
export default {
  name: "News",
  data() {
    return {
      pageNo: 1,
      noData: false,
      list: []
    };
  },
  components: { HeaderTop },
  computed: {...mapState([ "cacheList", "positions"]),},
  mixins: [time],
  created() {},
  activated() {
    if (this.$route.query.update=='true') {
      this.reset();
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.getNews();
    } else {
      document.querySelector("main").scrollTop = this.positions[
        this.$route.path
      ];
      this.noData = this.cacheList[this.$route.path].noData;
      this.pageNo = this.cacheList[this.$route.path].page;
      this.list = this.cacheList[this.$route.path].list;
    }
  },
  methods: {
    reset() {
      this.pageNo = 1;
      this.noData = false;
      this.list = [];
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
    },
    getNews() {
      if (!this.noData) {
        let vm = this;
        mui.ajax({
          url: findNewsList,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            pageNo: this.pageNo,
            pageSize: 10,
            keyWord: "",
            token: md5(`gjfengfindNewsList`)
          },
          success(res) {
            let _list = res.result;
            vm.list = [...vm.list, ..._list];
            if (_list.length < 10) {
              vm.noData = true;
              vm.$refs.pdlist.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.pdlist.$emit("ydui.infinitescroll.finishLoad");
            vm.pageNo++;
          }
        });
      }
    },
    navigate(id) {
      this.$store.commit("SAVE_LIST_WITH_PAGE", {
        name: this.$route.path,
        cacheInfo: {
          noData: this.noData,
          page: this.pageNo,
          list: this.list
        }
      });
      this.$router.push({ name: "NewsDetail", query:{id} });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.news-item{
  margin:@pd .1rem 0;
  border-radius: 5px;
  .pd;
  background-color: @white;
}
.news-top {
  margin-bottom: @pd;
  font-size: 0.32rem;
  p:last-child{
    color: @lightgray;
  }
}
.news-middle {
  img {
    width: 100%;
    border-radius: 10px;
  }
}
.news-bottom {
  border-bottom: 1px solid #f7f5f5;
  .pd-v;
}
</style>