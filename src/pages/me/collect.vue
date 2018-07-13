<template>
  <div>
    <header-top title="我的收藏"></header-top>
     <main class="scroll-content-2">
        <yd-infinitescroll :callback="getCollect" ref="ctlist2">
          <ul slot="list">
            <li v-for="(p,q) in info2" :key="p.colId" class="collect-item flex align-center px-1" @click="go(p.id,$event)">
              <img :src="getImgPath(p.img)" alt="">
              <div class="collect-info flex-1">
                <h3>{{p.goodName}}</h3>
                <p>收藏时间：{{formatTime(p.addTime)}}</p>
              </div>
              <span class="iconfont self-delete danger-color" @click.stop="deleteCollect(p.colId,q)"></span>
            </li>
          </ul>
        </yd-infinitescroll>
     </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { Tab, TabItem } from "vux";
import { myCollect, delectMyCollect } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "MyCollect",
  data() {
    return {
      noData2: false,
      info2: [],
      pageNo2: 1,
      collectType: "2"
    };
  },
  components: { HeaderTop, Tab, TabItem },
  computed: {
    ...mapState(["account"])
  },
  mixins: [mixin],
  created() {
    this.getCollect();
  },
  activated() {

  },
  methods: {
    getCollect() {
      let vm = this;
      mui.ajax({
        url: myCollect,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          pageNo: this[`pageNo${this.collectType}`],
          pageSize: 10,
          collectType: this.collectType,
          account: this.account,
          token: md5(`gjfengmyCollect`)
        },
        success(res) {
          if (res.code == 200) {
            let _list = res.result;
            vm[`info${vm.collectType}`] = [...vm[`info${vm.collectType}`],..._list];
            if (_list.length < 10) {
              vm[`noData${vm.collectType}`] = true;
              vm.$refs[`ctlist${vm.collectType}`].$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs[`ctlist${vm.collectType}`].$emit("ydui.infinitescroll.finishLoad");
            vm[`pageNo${vm.collectType}`]++;
          } else {
            vm.$dialog.toast({
              mes: res.msg || "网络异常,请重试"
            });
            return;
          }
        }
      });
    },
    go(id,event){
      let t = event.currentTarget.tagName;
      t=='LI'?this.$router.push({name: 'Product',query:{id}}):'';
    },
    deleteCollect(id, index) {
      let vm = this;
      mui.ajax({
        url: delectMyCollect,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          colId: id,
          token: md5(`gjfengdelectMyCollect${id}`)
        },
        success(res) {
          if (res.code == 200) {
            vm[`info${vm.collectType}`].splice(index, 1);
            vm.$dialog.toast({
              mes: res.msg
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
.collect-item {
  .pd;
  background-color: @white;
  img {
    .wh(1.2rem,1.2rem);
    border-radius: 50%;
  }
  .collect-info {
    margin: 0 @pd /1;
    font-size: 14px;
    p:first-of-type {
      color: @lightgray;
      font-size: 12px;
    }
  }
  &.item-1 {
    h3 {
      margin-bottom: @pd;
    }
  }
}
</style>