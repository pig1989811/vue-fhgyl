<template>
  <div>
    <header-top title="商品评价"></header-top>
    <yd-cell-group>
      <yd-cell-item>
        <span slot="left">全部评价
          <span class="danger-color">({{commentCount}})</span>
        </span>
      </yd-cell-item>
    </yd-cell-group>
    <main class='scroll-content-1'>
      <yd-infinitescroll :callback="getComment" ref="cmlist">
        <ul slot="list">
          <li v-for="(item,index) in info" class="item" :key="index">
            <yd-cell-group style="margin-bottom:0;">
              <yd-cell-item>
                <img slot="icon" :src="item.imgHeadUrl" :alt="item.nickName" class="icon">
                <span slot="left">{{item.nickName}}</span>
                <span slot="right">{{formatTime(item.comTime,true)}}</span>
              </yd-cell-item>
            </yd-cell-group>
            <div class="content-box">
              <crown :value="item.comScore" :disabled="true"></crown>
              <div class="comment">{{item.content}}</div>
              <div class="img-list" v-if="item.comImg">
                <img :src="item.comImg" alt="">
              </div>
            </div>
          </li>
        </ul>
      </yd-infinitescroll>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import Crown from "components/common/Crown";
import { getAllProCommetByPage } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "Comment",
  data() {
    return {
      noData: false,
      pageNo: 1,
      info: []
    };
  },
  components: { HeaderTop, Crown },
  computed: {
    commentCount() {
      return this.info.length;
    }
  },
  mixins: [mixin],
  created() {
    this.getComment();
  },
  activated() {},
  methods: {
    getComment() {
      if (!this.noData) {
        let vm = this;
        mui.ajax({
          url: getAllProCommetByPage,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            pageNo: this.pageNo,
            pageSize: 10,
            proId: this.$route.query.id,
            state: 2,
            token: md5(`gjfenggetAllProCommetByPage${this.$route.query.id}`)
          },
          success(res) {
            let _list = res.result.comm;
            vm.info = [...vm.info, ..._list];
            if (_list.length < 10) {
              vm.noData = true;
              vm.$refs.cmlist.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.cmlist.$emit("ydui.infinitescroll.finishLoad");
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
.item {
  background-color: @white;
  margin-bottom: @pd;
  .icon {
    border-radius: 50%;
    width: 0.4rem;
    font-size: 8px;
  }
  .content-box {
    .pd;
    .comment {
      font-size: 0.28rem;
    }
    .img-list {
      margin-top: @pd;
      img {
        .wh(1.2rem,1.2rem);
        margin-right: @pd;
      }
    }
  }
}
</style>  