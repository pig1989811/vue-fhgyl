<template>
  <li class="order-item">
    <div class="flex">
      <h2 class="flex-1">{{name}}</h2>
      <!-- <span class="iconfont self-delete delete-icon" @click="deleteOrder"></span> -->
    </div>
    <div class="good-list" @click="navigate">
      <p class="order-id">订单编号：{{sn}}</p>
      <div class="good-item flex" v-for="good in goods" :key="good.goodsId">
        <img :src="getImgPath(good.goodsImg)" :alt="good.goodsName">
        <div class="good-info flex-1 flex just-between">
          <h3 class="good-title">{{good.goodsName}}</h3>
          <div class="good-price flex just-between">
            <span>数量：{{good.goodNum}}</span>
            <span>￥{{good.goodsPrice}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-operate flex just-between align-center">
      <p class="fs-14">合计
        <span class="danger-color  fs-16">￥{{total}}</span>
        <span class="pay-tag">{{payType(paytype)}}</span>
      </p>
      <div v-if="status=='0'">
        <yd-button type="warning" @click.native="pay">去付款</yd-button>
        <!-- <yd-button type="danger" @click.native="cancelOrder">取消订单</yd-button> -->
      </div>
      <yd-button type="hollow" v-if="status=='1'">待发货</yd-button>
      <div v-if="status=='2'">
        <yd-button bgcolor="#57A9FF" color="#fff" @click.native="update">确认收货</yd-button>
        <!-- <yd-button type="danger" @click.native="returnOrder">退货</yd-button> -->
      </div>
      <yd-button type="primary" v-if="status=='3' && evaluation=='0'" @click.native="comment">去评价</yd-button>
      <yd-button type="disabled" v-if="status=='3' && evaluation=='1'" @click.native="comment">已评价</yd-button>
      <yd-button type="disabled" v-if="status=='3' && evaluation=='2'" @click.native="comment">过期未评价</yd-button>
      <yd-button type="disabled" v-if="status=='6'">已退款</yd-button>
    </div>
  </li>
</template>
<script>
import { mapState } from "vuex";
import { mixin } from "./mixin";
export default {
  name: "OrderItem",
  props: {
    name: String,
    sn: String,
    goods: {
      type: Array,
      default: function() {
        return [];
      }
    },
    total: Number,
    status: String,
    evaluation: String,
    paytype: String
  },
  mixins: [mixin],
  methods: {
    payType(a) {
      switch (a) {
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
        default:
          return "其他";
      }
    },
    navigate() {
      this.$emit("navigate");
    },
    pay() {
      this.$emit("pay");
    },
    update() {
      this.$emit("update");
    },
    comment() {
      this.$emit("comment");
    },
    // deleteOrder() {
    //   this.$emit("delete-order");
    // },
    // cancelOrder() {
    //   this.$emit("cancel-order");
    // },
    // returnOrder() {
    //   this.$emit("return-order");
    // }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.order-item {
  margin-top: @pd;
  .pd;
  background-color: @white;
  h2 {
    padding-bottom: @pd;
    font-size: 0.28rem;
    border-bottom: 1px solid #f7f5f5;
  }
  .delete-icon {
    font-size: 0.4rem;
  }
}
.good-list {
  display: block;
  .pd-v;
  .order-id {
    margin-bottom: @pd;
    color: @lightgray;
  }
  .good-item {
    padding-bottom: 0.1rem;
    margin-bottom: 0.1rem;
    border-bottom: 1px solid #f7f5f5;
    img {
      .wh(1.5rem,1.5rem);
      overflow: hidden;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .good-info {
      flex-direction: column;
      margin-left: @pd * 2;
      .good-title {
        font-weight: normal;
      }
      .good-price {
        span:last-child {
          color: @red;
          font-size: 14px;
        }
      }
    }
  }
}
.pay-tag {
  padding: 2px;
  border: 1px solid @blue;
  border-radius: 4px;
  color: @white;
  background-color: @blue;
  font-size: 0.2rem;
  vertical-align: 2px;
}
</style>