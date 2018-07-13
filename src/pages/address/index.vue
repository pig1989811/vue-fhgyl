<template>
  <div>
    <header-top title="地址管理"></header-top>
    <main class='scroll-content' style="background-color:#fff;">
      <section class="address-list" v-show="addressList.length">
        <group-title>点击更换默认地址，左滑地址更多操作</group-title>
        <swipeout>
          <swipeout-item transition-mode="reveal" v-for="(item,index) in addressList" :key="item.id" ref="aaa">
            <div slot="right-menu">
              <div class="operate-icon flex just-center align-center">
                <span class="iconfont-large self-bianji" @click="editAddress(item,index)"></span>
                <span class="iconfont-large self-delete danger-color" @click="deleteAddress(item)"></span>
              </div>
            </div>
            <ul slot="content" style="padding:10px;">
              <li class="address-item" @click="setDefault(item)" :class="{'active':item.isDefault == '1'}">
                <div v-if="item.isDefault=='1'" class="default-tag">
                  <span class="iconfont self-dui"></span>
                  <span>默认地址</span>
                </div>
                <div class="address-info">
                  <span :class="['iconfont',item.consigneeSex=='1'?'self-male primary-color':'self-female danger-color']"></span>
                  <span class="address-name">{{item.consigneeName}}</span>
                  <span>{{item.mobile}}</span>
                </div>
                <div class="address-detail">{{item.proviceId.province}}{{item.cityId.city}}<span v-if="item.areaId">{{item.areaId.area}}</span><span v-if="item.townId">{{item.townId.townName}}</span>{{item.addressDetail}}</div>
              </li>
            </ul>
          </swipeout-item>
        </swipeout>
      </section>
      <div class="hv-cen text-center" v-show="!addressList.length">
        <span class="iconfont self-noorder" style="font-size:40px;"></span>
        <p>没有地址，赶紧去添加</p>
      </div>
    </main>
    <footer class="fix-footer flex align-center">
      <button class="delete-btn btn-large" @click="newAddress">
        <span class="iconfont self-add"></span>添加新地址</button>
    </footer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { GroupTitle, Swipeout, SwipeoutItem } from "vux";
import { getMyAddress, defaultAddress, delAdress } from "../../api/index";
import { getStore } from "components/common/mixin";
export default {
  name: "AddressManage",
  data() {
    return {};
  },
  components: { HeaderTop, GroupTitle, Swipeout, SwipeoutItem },
  computed: {
    ...mapState(["account", "addressList"])
  },
  activated() {
    this.$store.dispatch("getAddressList", { source: this.$route.query.source });
  },
  methods: {
    setDefault(address) {
      let vm = this;
      mui.ajax({
        url: defaultAddress,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id: address.id,
          goodSource: this.$route.query.source,
          account: this.account,
          token: md5(`gjfengdefault${address.id}${this.account}`)
        },
        success(res) {
          if (res.code == 200) {
            vm.$store.commit("RECORD_DEFAULT_ADDRESS", address);
            if (vm.$route.query.type == "choose") {
              // 选择地址，选择之后回退页面并返回订单邮费
              vm.$store.dispatch('refreshPos',{addressId:address.id});
              vm.$router.go(-1);
            } else {
              vm.$store.dispatch("getAddressList", { source: 5 });
              vm.$dialog.toast({
                mes: "设置默认地址成功"
              });
            }
          } else {
            vm.$dialog.toast({
              mes: res.msg
            });
          }
        }
      });
    },
    editAddress(item, index) {
      this.$nextTick(() => {
        this.$refs.aaa[index].close();
      });
      this.$router.push({ name: "AddressEdit", params: { item } ,query:{source:this.$route.query.source}});
    },
    deleteAddress(item) {
      this.$dialog.confirm({
        mes: "是否删除收货地址？",
        opts: () => {
          let vm = this;
          mui.ajax({
            url: delAdress,
            type: "post",
            headers: { "app-version": "v1.0" },
            data: {
              id: item.id,
              goodSource: this.$route.query.source,
              account: getStore("account"),
              token: md5(`gjfengdelAdress${item.id}${getStore("account")}`)
            },
            success(res) {
              if (res.code !== 200) {
                vm.$dialog.toast({
                  mes: res.msg,
                  timeout: 1000
                });
                return;
              }
              vm.$store.dispatch("getAddressList", { source: vm.$route.query.source });
            }
          });
        }
      });
    },
    newAddress() {
      this.$router.push({ name: "AddressNew",query:{source:this.$route.query.source}});
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.address-item {
  position: relative;
  padding: 0.3rem @pd;
  background-color: @white;
  border: 1px solid #dfdfdf;
  font-size: 0.3rem;
  &.active {
    border-color: @red;
    box-shadow: 0 0 5px @red;
  }
  .address-name {
    font-weight: 700;
    font-size: 0.32rem;
    margin-right: @pd;
  }
  .address-detail {
    margin-top: @pd;
  }
}

.operate-icon {
  height: 1.2rem;
  position: absolute;
  right: 2%;
  top: 50%;
  transform: translateY(-50%);
  span:first-of-type {
    margin-right: @pd;
  }
}

.default-tag {
  position: absolute;
  font-size: 12px;
  right: 0;
  top: 0;
  color: @green;
}
</style>