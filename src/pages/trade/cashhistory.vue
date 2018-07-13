<template>
  <div>
    <header-top title="提取历史"></header-top>
    <main class='scroll-content-2'>
      <section>
        <yd-infinitescroll :callback="getInfo" ref="historyList">
          <ul slot="list">
            <li class="item" v-for="(item,index) in info" :key="index">
              <div class="flex align-center">
                <span class="iconfont-large self-rmb1 danger-color"></span>
                <span class="time">{{formatTime(item.addTime)}}</span>
              </div>
              <div class="flex just-between align-center">
                <span>提现<span class="money">{{item.tradeMoney}}</span>元</span>
                <span class="status status-0" v-if="item.tradeStatus==0">审核中</span>
                <span class="status status-1" v-if="item.tradeStatus==1">审核通过</span>
                <span class="status status-2" v-if="item.tradeStatus==2">审核失败</span>
              </div>
            </li>
          </ul>
        </yd-infinitescroll>
      </section>

    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import { getDrawHistory } from '../../api/index'
import { getStore, mixin } from 'components/common/mixin'
export default {
  name: 'CashHistory',
  data() {
    return {
      noData: false,
      info: [],
      pageNo: 1
    }
  },
  components: { HeaderTop },
  computed: {

  },
  mixins: [mixin],
  created() {
    this.getInfo();
  },
  activated() {
 
  },
  methods: {
    getInfo() {
      let vm = this;
      if (!this.noData) {
        mui.ajax({
          url: getDrawHistory,
          type: 'post',
          headers: { 'app-version': 'v1.0' },
          data: {
            account: getStore('account'),
            pageNo: this.pageNo,
            pageSize: 10,
            token: md5(`gjfenggetDrawHistory${getStore('account')}`)
          },
          success(res) {
            let _list = res.result;
            vm.info = [...vm.info, ..._list];
            if (_list.length < 10) {
              vm.noData = true;
              vm.$refs.historyList.$emit('ydui.infinitescroll.loadedDone');
              return;
            }
            vm.$refs.historyList.$emit('ydui.infinitescroll.finishLoad');
            vm.pageNo++;
          }
        })
      }
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
.item {
  background-color: @white;
  margin-top: @pd;
  .pd;
  .time {
    font-size: 15px;
    margin-left: @pd;
  }
  .money {
    color: @red;
    font-size: 16px;
  }
  .status {
    &.status-0 {
      color: @blue;
    }
    &.status-1 {
      color: @green;
    }
    &.status-2 {
      color: @lightgray;
    }
  }
}
</style>