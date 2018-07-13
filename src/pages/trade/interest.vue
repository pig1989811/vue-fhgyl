<template>
  <div>
    <header-top :title="pageTitle"></header-top>
    <main class='scroll-content-2'>
      <section v-if="info.length">
        <ul>
          <li class="item" v-for="(item,index) in info" :key="index">
            <div class="flex align-center">
              <span class="iconfont self-hongbao danger-color"></span>
              <span class="time">{{formatTime(item.addTime)}}</span>
            </div>
            <div class="flex just-between align-center">
              <span class="people">{{item.nickName}}</span>
              <span class="money">{{item.tradeMoney}}元</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="hv-cen text-center" v-else>
        <span class="iconfont self-noorder" style="font-size:40px;"></span>
        <p>没有数据</p>
      </section>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import {getInterests} from '../../api/index'
import {getStore,mixin} from 'components/common/mixin'
export default {
  name: 'Interest',
  data() {
    return {
      pageTitle:'',
      info:[]
    }
  },
  components: { HeaderTop },
  computed: {

  },
  mixins:[mixin],
  created() {
    this.pageTitle=this.$route.query.type=='0'?'累计消费':'累计贡献';
    this.getInfo();
  },
  methods: {
    getInfo(){
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: getInterests,
        type: 'post',
        headers: {'app-version': 'v1.0'},
        data: {
          account:getStore('account'),
          type:this.$route.query.type,
          token:md5(`gjfenggetInterests`)
        },
        success(res){
          vm.$dialog.loading.close();
          vm.info = res.result;
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
.item{
  background-color: @white;
  margin-top: @pd;
  .pd;
  .time{
    font-size: 15px;
    margin-left: @pd;
  }
  .people{
    color: @lightgray;
  }
  .money{
    color: @red;
    font-size: 16px;
  }
}

</style>