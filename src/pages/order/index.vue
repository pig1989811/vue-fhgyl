<template>
  <div>
    <header-top title="我的订单"></header-top>
    <tab :line-width="2" active-color='#ff5350' v-model="index" custom-bar-width="60px">
      <tab-item v-for="(item, index) in menu" :key="index" @on-item-click="toggleItem(index)">{{item.value}}</tab-item>
    </tab>
    <main class='scroll-content-1'>
      <div v-show="index==0">
        <yd-infinitescroll :callback="getMyOrder" ref="orderlist7">
          <ul slot="list">
            <order-item v-for="item in list7" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus" :evaluation="item.evaluationStatus" :paytype="item.payType" @pay="payOrder(item)" @update="updateOrder(item)" @comment="addComment(item)" @navigate="goDetail(item.orderSn)" @return-order="returnOrder(item)" @delete-order="deleteOrder(item)" @cancel-order="cancelOrder(item)"></order-item>
          </ul>
        </yd-infinitescroll>
      </div>
      <div v-show="index==1">
        <yd-infinitescroll :callback="getMyOrder" ref="orderlist0">
          <ul slot="list">
            <order-item v-for="item in list0" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus" :paytype="item.payType" @pay="payOrder(item,index)" @navigate="goDetail(item.orderSn)" @delete-order="deleteOrder(item)" @cancel-order="cancelOrder(item)"></order-item>
          </ul>
        </yd-infinitescroll>
      </div>
      <div v-show="index==2">
        <yd-infinitescroll :callback="getMyOrder" ref="orderlist1">
          <ul slot="list">
            <order-item v-for="item in list1" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus" :paytype="item.payType" @navigate="goDetail(item.orderSn)" @delete-order="deleteOrder(item)"></order-item>
          </ul>
        </yd-infinitescroll>
      </div>
      <div v-show="index==3">
        <yd-infinitescroll :callback="getMyOrder" ref="orderlist2">
          <ul slot="list">
            <order-item v-for="(item,index) in list2" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus" :paytype="item.payType" @update="updateOrder(item,index)" @navigate="goDetail(item.orderSn)" @return-order="returnOrder(item)" @delete-order="deleteOrder(item)"></order-item>
          </ul>
        </yd-infinitescroll>
      </div>
      <div v-show="index==4">
        <yd-infinitescroll :callback="getMyOrder" ref="orderlist3">
          <ul slot="list">
            <order-item v-for="item in list3" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus" :evaluation="item.evaluationStatus" :paytype="item.payType" @comment="addComment(item)" @navigate="goDetail(item.orderSn)" @delete-order="deleteOrder(item)"></order-item>
          </ul>
        </yd-infinitescroll>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import OrderItem from "components/common/OrderItem";
import { Tab, TabItem } from "vux";
import {
  getOrder,
  updateOrderStatus,
  payOrderSign,
  newProCommet
} from "../../api/index";
import { payMixin } from "components/common/mixin";
export default {
  name: "MyOrder",
  data() {
    return {
      menu: [
        { key: "7", value: "全部订单" },
        { key: "0", value: "待支付" },
        { key: "1", value: "待发货" },
        { key: "2", value: "待收货" },
        { key: "3", value: "交易完成" }
      ],
      index: 0, //控制tab
      orderType: "7", //控制订单类型
      noData0: false,
      noData1: false,
      noData2: false,
      noData3: false,
      noData7: false,
      list0: [],
      list1: [],
      list2: [],
      list3: [],
      list7: [],
      pageNo0: 1,
      pageNo1: 1,
      pageNo2: 1,
      pageNo3: 1,
      pageNo7: 1,
      pays: {}
    };
  },
  components: { HeaderTop, OrderItem, Tab, TabItem },
  computed: {
    ...mapState(["account", "positions", "cacheList"])
  },
  mixins: [payMixin],
  activated() {
    if (this.$route.params.update) {
      this.reset();
      this.index = +this.$route.query.id;
      this.toggleItem(this.index);
    } else {
      // if (this.cacheList[this.$route.path]) {
      this.index = this.cacheList[this.$route.path].index;
      this.orderType = this.menu[this.index].key;
      this[`noData${this.orderType}`] = this.cacheList[this.$route.path].noData;
      this[`pageNo${this.orderType}`] = this.cacheList[this.$route.path].page;
      this[`list${this.orderType}`] = this.cacheList[this.$route.path].list;
      // }
      if (this.positions[this.$route.path]) {
        document.querySelector("main").scrollTop = this.positions[
          this.$route.path
        ];
      }
    }
  },

  methods: {
    reset() {
      // this.orderType = "7";
      this.noData0 = false;
      this.noData1 = false;
      this.noData2 = false;
      this.noData3 = false;
      this.noData7 = false;
      this.list0 = [];
      this.list1 = [];
      this.list2 = [];
      this.list3 = [];
      this.list7 = [];
      this.pageNo0 = 1;
      this.pageNo1 = 1;
      this.pageNo2 = 1;
      this.pageNo3 = 1;
      this.pageNo7 = 1;
    },
    toggleItem(index) {
      this.orderType = this.menu[index].key;
      if (!this[`noData${this.orderType}`]) {
        this.getMyOrder();
      }
    },
    getMyOrder() {
      let vm = this;
      mui.ajax({
        url: getOrder,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          pageNo: this[`pageNo${this.orderType}`],
          pageSize: 10,
          account: this.account,
          status: this.orderType,
          token: md5(`gjfenggetOrder${this.account}${this.orderType}`)
        },
        success(res) {
          if (res.code == 200) {
            let _list = res.result;
            vm[`list${vm.orderType}`] = [
              ...vm[`list${vm.orderType}`],
              ..._list
            ];
            if (_list.length < 10) {
              vm[`noData${vm.orderType}`] = true;
              vm.$refs[`orderlist${vm.orderType}`].$emit(
                "ydui.infinitescroll.loadedDone"
              );
              return;
            }
            vm.$refs[`orderlist${vm.orderType}`].$emit(
              "ydui.infinitescroll.finishLoad"
            );
            vm[`pageNo${vm.orderType}`]++;
          } else {
            vm.$dialog.toast({
              mes: res.msg || "网络异常,请重试"
            });
            return;
          }
        }
      });
    },
    saveCache() {
      this.orderType = this.menu[this.index].key;
      this.$store.commit("SAVE_LIST_WITH_PAGE", {
        name: this.$route.path,
        cacheInfo: {
          index: this.index,
          noData: this[`noData${this.orderType}`],
          page: this[`pageNo${this.orderType}`],
          list: this[`list${this.orderType}`]
        }
      });
    },
    goDetail(sn) {
      this.saveCache();
      this.$router.push({ name: "OrderDetail", query: { sn } });
    },
    payOrder(item, index) {
      let vm = this;
      mui.ajax({
        url: payOrderSign,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          orderSn: item.orderSn,
          account: this.account,
          token: md5(`gjfengpayOrderSign${item.orderSn}${this.account}`)
        },
        success(res) {
          let _result = res.result;
          if (item.payType == "2") {
            //支付宝
            vm.checkService(vm.pays["alipay"], function() {
              plus.payment.request(
                vm.pays["alipay"],
                _result.payString||_result.alyString,
                function(result) {
                  vm.$dialog.alert({
                    mes: "支付成功",
                    callback: () => {
                      // 待支付->待发货
                      if (index) {
                        vm.list0.splice(index, 1);
                      } else {
                        //全部，只要改变状态
                        item.orderStatus = "1";
                      }
                      //待支付状态需要重置.
                      vm.list0 = [];
                      vm.pageNo0 = 1;
                      vm.noData0 = false;

                      //待发货状态需要重置.
                      vm.list1 = [];
                      vm.pageNo1 = 1;
                      vm.noData1 = false;
                    }
                  });
                },
                function(e) {
                  vm.$dialog.alert({
                    mes: "支付失败:" + e.message
                  });
                }
              );
            });
          } else if (item.payType == "3") {
            // let payInfo = {
            //   orderId: item.orderSn,
            //   payMoney: item.goodsTotalAmount,
            //   mobile: vm.account,
            //   retUrl:
            //     "http://gz.gjfeng.net/gjfeng-web-client/wx/notify/payOrderWangYiLNotify;"
            // };
            // vm.$store.commit("RECORD_PAY_INFO", payInfo);
            // vm.$router.push({ name: "YinLian" });
            vm.$dialog.alert({
              mes: "银联支付功能暂时无法使用，请更换其他支付方式重新下单"
            });
            //银联
          } else if (
            item.payType == "7" ||
            item.payType == "8"
          ) {
            //积分||责任金额||代金券
            vm.checkService(vm.pays["alipay"], function() {
              plus.payment.request(
                vm.pays["alipay"],
                _result.payString||_result.alyString,
                function(result) {
                  vm.$dialog.alert({
                    mes: "支付成功",
                    callback: () => {
                      // 待支付->待发货
                      if (index) {
                        vm.list0.splice(index, 1);
                      } else {
                        //全部，只要改变状态
                        item.orderStatus = "1";
                      }
                      //待支付状态需要重置.
                      vm.list0 = [];
                      vm.pageNo0 = 1;
                      vm.noData0 = false;

                      //待发货状态需要重置.
                      vm.list1 = [];
                      vm.pageNo1 = 1;
                      vm.noData1 = false;
                    }
                  });
                },
                function(e) {
                  vm.$dialog.alert({
                    mes: "支付失败:" + e.message
                  });
                }
              );
            });
          } else {
            vm.$dialog.alert({
              mes: "该支付功能暂时无法使用，请更换其他支付方式重新下单"
            });
          }
        }
      });
    },
    updateOrder(item, index) {
      let vm = this;
      this.$dialog.confirm({
        title: "确认收货吗？",
        mes: "确认收到相关商品，完成收货操作！",
        opts: () => {
          this.$dialog.loading.open();
          mui.ajax({
            url: updateOrderStatus,
            type: "post",
            headers: { "app-version": "v1.0" },
            data: {
              status: 3,
              orderSn: item.orderSn,
              account: this.account,
              token: md5(
                `gjfengupdateOrderStatus${this.account}${item.orderSn}`
              )
            },
            success(res) {
              vm.$dialog.loading.close();
              if (res.code == 200) {
                vm.$dialog.toast({
                  mes: "确认收货成功",
                  icon: "success",
                  callback: () => {
                    //更改状态
                    if (index) {
                      vm.list2.splice(index, 1);
                    } else {
                      //全部，只要改变状态
                      item.orderStatus = "3";
                    }
                    //待收货状态需要重置.
                    vm.list2 = [];
                    vm.pageNo2 = 1;
                    vm.noData2 = false;

                    //交易完成状态需要重置.
                    vm.list3 = [];
                    vm.pageNo3 = 1;
                    vm.noData3 = false;
                  }
                });
              } else {
                vm.$dialog.toast({
                  mes: res.msg,
                  icon: "error"
                });
              }
            }
          });
        }
      });
    },
    addComment(order) {
      this.saveCache();
      this.$router.push({ name: "AddComment", params: { order } });
    },
    returnOrder(order) {
      this.saveCache();
      this.$router.push({ name: "Return", params: { order } });
    },
    deleteOrder(order) {
      this.saveCache();
      this.$router.push({ name: "Return", params: { order } });
    },
    cancelOrder(order) {
      this.saveCache();
      this.$router.push({ name: "Return", params: { order } });
    }
  }
};
</script>
