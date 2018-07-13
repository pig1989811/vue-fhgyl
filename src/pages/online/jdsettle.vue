<template>
  <div>
    <header-top title="确认订单"></header-top>
    <main class='scroll-content-2'>
      <section class="address-container">
        <yd-cell-group v-if="!defaultAddress">
          <yd-cell-item arrow type="link" href="/address/jdaddress?type=choose">
            <span slot="icon" class="iconfont-large self-location"></span>
            <span slot="left">收货人</span>
            <span slot="right">去添加</span>
          </yd-cell-item>
        </yd-cell-group>
        <router-link v-else to="/address/jdaddress?type=choose" class="flex align-center">
          <div v-if="defaultAddress" class="fs-14 flex-1">
            <p>收货人：
              <span style="margin-right:.2rem;font-weight:bold;">{{defaultAddress.consigneeName}}</span>
              <span>{{defaultAddress.mobile}}</span>
            </p>
            <p>收货地址：{{defaultAddress.proviceId.province}}{{defaultAddress.cityId.city}}<span v-if="defaultAddress.areaId">{{defaultAddress.areaId.area}}</span><span v-if="defaultAddress.townId">{{defaultAddress.townId.townName}}</span>{{defaultAddress.addressDetail}}</p>
          </div>
          <div v-else-if="addressList[0]" class="fs-14 flex-1">
            <p>收货人：
              <span style="margin-right:.2rem;font-weight:bold;">{{addressList[0].consigneeName}}</span>
              <span>{{addressList[0].mobile}}</span>
            </p>
            <p>收货地址：{{addressList[0].proviceId.province}}{{addressList[0].cityId.city}}<span v-if="addressList[0].areaId">{{addressList[0].areaId.area}}</span><span v-if="addressList[0].townId">{{addressList[0].townId.townName}}</span>{{addressList[0].addressDetail}}</p>
          </div>
          <span class="iconfont self-right"></span>
        </router-link>
      </section>
      <section class="order-list">
        <h2>订单信息</h2>
        <ul>
          <li v-for="(item,index) in settleList.goodsVos" :key="index" class="order-item flex">
            <img :src="item.goodsImg" :alt="item.goodsName" class="pd-img">
            <div class="order-info flex-1">
              <h3 class="pd-name">{{item.goodsName}}</h3>
              <div class="flex just-between">
                <span class="danger-color fs-16">￥{{item.goodsAmount}}</span>
                <span class="fs-14">x{{item.goodsNum}}</span>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">配送方式</span>
          <span slot="right" class="fs-14">快递费用合计到总金额</span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">支付明细</span>
          <span slot="right" class="danger-color fs-16">￥{{formatPrice(settleList.totalAmount)}}</span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">买家留言：</span>
          <yd-input slot="right" v-model="remark" placeholder="选填-可告诉卖家您的特殊要求"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <p slot="right" class="fs-16">
            支付：
            <span class="danger-color">￥{{formatPrice(total)}}</span>
          </p>
        </yd-cell-item>
      </yd-cell-group>
      <group title="选择赠送方式">
        <div class="box">
          <checker v-model="commissionType" class="flex" default-item-class="self-checker-item" selected-item-class="self-checker-selected" type="radio" :radio-required="true">
            <checker-item value="1" class="flex-1">
              代金券(确认收货后到账)
            </checker-item>
             <!-- <checker-item value="0" class="flex-1" style="margin-right:.2rem;">
              积分(约{{settleList.pointMoney}})
            </checker-item> -->
          </checker>
        </div>
      </group>
      <yd-cell-group title="选择支付方式">
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea"></span>
          <span slot="left">支付宝支付</span>
          <input slot="right" type="radio" value="2" v-model="payType" />
        </yd-cell-item>
      </yd-cell-group>
      <div style="padding:0 .2rem .2rem;">
        <yd-button size="large" :type="valid ?'danger':'disabled'" @click.native="pay">确认支付</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { addOrder } from "../../api/index";
import { mixin, payMixin } from "components/common/mixin";
import HeaderTop from "components/header/index";
import { Group, Checker, CheckerItem } from "vux";
export default {
  name: "JDSettle",
  data() {
    return {
      oldBack: mui.back,
      remark: "", //备注
      payType: "2", //支付方式
      commissionType: "1", //赠送方式
      pays: {}
    };
  },
  components: { Group, Checker, CheckerItem, HeaderTop },
  computed: {
    ...mapState(["account", "defaultAddress", "addressList", "settleList"]),
    total() {
      return this.settleList.totalAmount + this.settleList.pos;
    },
    valid() {
      return this.defaultAddress || !!this.addressList.length;
    }
  },
  created() {},
  activated() {
    this.$store.dispatch("getAddressList", { source: 1 });
  },
  mixins: [mixin, payMixin],
  methods: {
    goBack(b) {
      this.$router.go(b);
    },
    pay() {
      if (!this.payType) {
        this.$dialog.toast({
          mes: "请选择支付方式",
          timeout: 1000
        });
        return;
      }
      this.placeAnOrder();
    },
    placeAnOrder() {
      let vm = this;
      //购物车下单参数
      let cmParams = null;
      let a = [],
        b = [],
        c = [],
        d = [],
        e = [];
      this.settleList.orderAddVos.forEach(item => {
        if (/(,)$/.test(item.goodsAttrIds))
          item.goodsAttrIds = item.goodsAttrIds.slice(
            0,
            item.goodsAttrIds.length - 1
          );
        a.push(item.goodsId);
        b.push(item.goodsAttrStockId);
        c.push(item.goodsAttrIds);
        d.push(item.goodsAttr);
        e.push(item.goodsNum);
      });
      cmParams = {
        goodsId: this.settleList.proId,
        goodsAttrStockId: b.join(","),
        goodsAttrIds: c.join(";"),
        goodsAttr: d.join(","),
        goodsNum: e.join(","),

        payType: this.payType,
        remark: this.remark,
        couponsId: 0,
        orderAddressId:
          (this.defaultAddress && this.defaultAddress.id) ||
          this.addressList[0].id,
        payPassword: "",
        account: this.account,
        logist: this.settleList.logist,
        commissionType: this.commissionType,
        goodSource: this.settleList.goodSource,
        orderSn:this.settleList.orderSn,
        customerSn:this.settleList.customerSn,
        postage:this.settleList.pos,
        token: md5(`gjfengaddOrder${this.payType}`)
      };
      mui.ajax({
        url: addOrder,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: cmParams,
        success(res) {
          let _result = res.result;
          res.code == 200
            ? vm.zfbPay(_result.alyString)
            : vm.$dialog.toast({
                mes: res.msg
              });
        },
        error(err) {
          vm.$dialog.toast({
            mes: "超时，请稍后重试"
          });
        }
      });
    },
    zfbPay(payParams) {
      let vm = this;
      this.checkService(this.pays["alipay"], function() {
        plus.payment.request(
          vm.pays["alipay"],
          payParams,
          function(result) {
            vm.$dialog.confirm({
              mes: "支付成功！",
              opts: [
                {
                  txt: "返回购物",
                  color: false,
                  stay: false,
                  callback: () => {
                    vm.goBack(-2);
                  }
                },
                {
                  txt: "查看订单",
                  color: true,
                  stay: false,
                  callback: () => {
                    vm.$router.replace({
                      name: "MyOrder",
                      params: { update: true },
                      query: { id: 0 }
                    });
                  }
                }
              ]
            });
          },
          function(e) {
            vm.$dialog.alert({
              mes: "支付失败:" + e.message
            });
          }
        );
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.address-container {
  background-color: @white;
  margin-bottom: @pd;
  .pd;
}
.order-list {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  h2 {
    font-size: 0.3rem;
    padding-bottom: @pd;
    font-weight: normal;
  }
  .order-item {
    .pd-v;
    border-top: 1px solid #f9f9f9;
    img {
      .wh(1.5rem,1.5rem);
      overflow: hidden;
    }
    .order-info {
      margin-left: @pd;
      .pd-name {
        .multi-ellipsis(2);
        margin-bottom: 0.12rem;
        color: #333;
        font-size: 0.28rem;
        word-break: break-all;
      }
      p {
        color: @lightgray;
      }
    }
  }
}
.box {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  width: 70%;
}
</style>