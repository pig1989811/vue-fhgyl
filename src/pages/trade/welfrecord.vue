<template>
  <div>
    <header-top title="福利记录"></header-top>
    <main class='scroll-content-2'>
      <section v-if="info.length">
        <ul>
          <li class="item flex just-between align-center" v-for="(item,index) in info" :key="index">
            <div class="flex-1">
              <p class="type">{{formatType(item.tradeType)}}</p>
              <p class="time">{{formatTime(item.addTime)}}</p>
            </div>
            <div class="money">{{item.tradeMoney}}</div>
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
import { diviHis } from '../../api/index'
import { getStore ,mixin} from 'components/common/mixin'
export default {
  name: 'WelfareRecord',
  data() {
    return {
      info: []
    }
  },
  components: { HeaderTop },
  computed: {

  },
  mixins:[mixin],
  created() {
    this.getInfo();
  },

  methods: {
    getInfo() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: diviHis,
        type: 'post',
        headers: { 'app-version': 'v1.0' },
        data: {
          account: getStore('account'),
          token: md5('diviHis')
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.info = res.result;
        }
      })
    },
    formatType(t) {
      switch (t) {
        case '0':
          return '直推会员';
          break;
        case '1':
          return '直推商家';
          break;
        case '2':
          return '普通用户';
          break;
        case '3':
          return '普通商家';
          break;
        case '4':
          return '市代';
          break;
        case '5':
          return '区代';
          break;
        case '6':
          return '个代';
          break;
      }
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
.item{
  background-color: @white;
  .pd;
  margin-top: @pd;
  .type{
    font-size: 15px;
  }
  .time{
    color: @lightgray;
  }
  .money{
    font-size: 15px;
    color: @red;
  }
}
</style>