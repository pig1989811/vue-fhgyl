<template>
  <div>
    <header-top title="订单详情"></header-top>
    <main class='scroll-content-2' v-if="info">
      <ul class="container">
        <li class="item">
          <span class="left">&emsp;流水账单号：</span>
          {{info.orderSn}}
        </li>
        <li class="item">
          <span class="left">&emsp;&emsp;下单时间：</span>
          {{formatTime(info.addTime,true)}}
        </li>
        <li class="item">
          <span class="left">订单付款时间：</span>
          {{formatTime(info.payTime,true)}}
        </li>
        <li class="item">
          <span class="left">订单发货时间：</span>
          {{formatTime(info.deliveryTime,true)}}
        </li>
        <li class="item">
          <span class="left">订单完成时间：</span>
          {{formatTime(info.finishedTime,true)}}
        </li>
      </ul>
      <section class="container">
        <div v-for="(item,index) in info.goodsVos" :key="index" class="pd-item">
          <ul>
            <li class="item flex">
              <span class="left">商品名称：</span>
              <span class="flex-1">{{item.goodsName}}</span>
            </li>
            <li class="item">
              <span class="left">商品价格：</span>
              <span class="danger-color">{{item.goodsAmount}}</span>
            </li>
            <li class="item">
              <span class="left">商品数量：</span>
              {{item.goodsNum}}
            </li>
            <li class="item" v-if="item.goodsAttr">
              <span class="left">商品属性：</span>
              {{item.goodsAttr}}
            </li>
          </ul>
        </div>
      </section>
      <ul class="container">
        <li class="item">
          <span class="left">购买人姓名：</span>
          {{info.memberId.name}}
        </li>
        <li class="item">
          <span class="left">购买人电话：</span>
          {{info.memberId.mobile}}
        </li>
        <li class="item">
          <span class="left">收货人姓名：</span>
          {{info.gjfOrderAddress.reciverName}}
        </li>
        <li class="item">
          <span class="left">收货人电话：</span>
          {{info.gjfOrderAddress.reciverMobile}}
        </li>
        <li class="item flex">
          <span class="left">收货人地址：</span>
          <p class="flex-1">
            {{info.gjfOrderAddress.reciverProvinceId.province}}{{info.gjfOrderAddress.reciverCityId.city}}<span v-if="info.gjfOrderAddress.reciverAreaId">{{info.gjfOrderAddress.reciverAreaId.area}}</span>{{info.gjfOrderAddress.reciverDetailAddress}}
          </p>
        </li>
      </ul>
      <ul class="container">
        <li class="item">
          <span class="left">订单类型：</span>
          {{orderType}}
        </li>
        <li class="item">
          <span class="left">订单状态：</span>
          <span class="status0" v-if="info.orderStatus=='0'">{{orderStatus}}</span>
          <span class="status1" v-if="info.orderStatus=='1'">{{orderStatus}}</span>
          <span class="status2" v-if="info.orderStatus=='2'">{{orderStatus}}</span>
          <span class="status3" v-if="info.orderStatus=='3'">{{orderStatus}}</span>
        </li>
        <li class="item">
          <span class="left">支付类型：</span>
          {{payType}}
        </li>
        <li class="item">
          <span class="left">线上支付：</span>
          <span class="danger-color">{{info.onlinePayAmount}}</span>
        </li>
        <li class="item">
          <span class="left">线下支付：</span>
          <span class="danger-color">{{info.offlinePayAmount}}</span>
        </li>
      </ul>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { orderDetail } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "OrderDetail",
  data() {
    return {
      info: null
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"]),
    payType() {
      switch (this.info.payType) {
        case "0":
          return "线上余额";
          break;
        case "1":
          return "微信支付";
          break;
        case "2":
          return "支付宝";
          break;
        case "3":
          return "银联支付";
          break;
        case "7":
          return "积分支付";
          break;
        case "8":
          return "责任消费金额";
          break;
        case "9":
          return "凤凰宝余额";
          break;
        case "10":
          return "代金券";
          break;
      }
    },
    orderType() {
      switch (this.info.orderType) {
        case "0":
          return "O2O";
          break;
        case "1":
          return "网上商城";
          break;
      }
    },
    orderStatus() {
      switch (this.info.orderStatus) {
        case "0":
          return "未支付";
          break;
        case "1":
          return "待发货";
          break;
        case "2":
          return "待收货";
          break;
        case "3":
          return "已收货";
          break;
      }
    }
  },
  created() {
    this.getDetail(this.$route.query.sn);
  },
  mixins: [mixin],
  methods: {
    getDetail(id) {
      let vm = this;
      mui.ajax({
        url: orderDetail,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          orderSn: this.$route.query.sn,
          token: md5(`gjfengdetail${this.account}${this.$route.query.sn}`)
        },
        success(res) {
          if(res.code==200){
            vm.info = res.result;
          }
          else {
            vm.$dialog.toast({
              mes:"查询失败",
              callback:()=>{
                vm.$router.go(-1);
              }
            })
          }
          
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.container {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  .item {
    font-size: 0.28rem;
    .left {
      color: @lightgray;
    }
  }
  .pd-item {
    .pd-v;
    border-bottom: 1px solid #f7f7f5;
    &:last-of-type {
      border-bottom: none;
    }
  }
}
.status0 {
  color: @blue;
}
.status1 {
  color: @purple;
}
.status2 {
  color: @red;
}
.status3 {
  color: @green;
}
</style>