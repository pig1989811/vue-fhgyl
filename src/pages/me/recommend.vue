<template>
  <div>
    <header-top title="我推荐的人"></header-top>
    <main class='scroll-content-2'>
      <yd-infinitescroll :callback="getRecommend" ref="re">
        <ul class="recommend-list" slot="list">
          <li v-for="item in info" :key="item.id" class="recommend-item flex">
            <img :src="formatUser(item.imgHeadUrl)" alt="" class="recommend-cover">
            <div class="recommend-info flex">
              <h3>{{item.nickName}}</h3>
              <p>推荐时间：{{formatTime(item.bindTime)}}</p>
            </div>
          </li>
        </ul>
      </yd-infinitescroll>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { getMemberLowerLevel } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "Recommend",
  data() {
    return {
      noData: false,
      pageNo: 1,
      info: []
    };
  },
  components: { HeaderTop },
  computed: {},
  mixins: [mixin],
  created() {
    this.getRecommend();
  },
  methods: {
    getRecommend() {
      let vm = this;
      if (!this.noData) {
        mui.ajax({
          url: getMemberLowerLevel,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            superId: this.$route.params.id,
            pageNo: this.pageNo,
            pageSize: 10,
            token: md5(`gjfenggetMemberLowerLevel${this.$route.params.id}`)
          },
          success(res) {
            let _list = res.result;
            vm.info = [...vm.info, ..._list];
            if (_list.length < 10) {
              vm.noData = true;
              vm.$refs.re.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.re.$emit("ydui.infinitescroll.finishLoad");
            vm.pageNo++;
          }
        });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.recommend-list {
  padding: 0.3rem;
  .recommend-item {
    .pd;
    margin-bottom: @pd;
    border-radius: 8px;
    background-color: @white;
    .recommend-cover {
      .wh(1rem, 1rem);
      border-radius: 50%;
    }
    .recommend-info {
      flex: 1;
      margin-left: @pd;
      .align-items(center);
      h3,
      p {
        width: 100%;
      }
    }
  }
}
</style>