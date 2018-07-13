<template>
  <div>
    <header-top title="地址修改"></header-top>
    <main class='scroll-content-2'>
      <group>
        <x-input title="收货人" v-model="info.consigneeName" placeholder="请输入收货人姓名" required></x-input>
        <x-input title="手机号码" v-model="info.mobile" placeholder="请输入收货人手机号码" type="tel" required is-type="china-mobile"></x-input>
        <cell title="性别">
          <div slot="default">
            <label for="male" class="self-radio">
              <input type="radio" value="1" id="male" v-model="info.consigneeSex">
              <span>男</span>
            </label>
            <label for="female" class="self-radio">
              <input type="radio" value="2" id="female" v-model="info.consigneeSex">
              <span>女</span>
            </label>
          </div>
        </cell>
        <selector ref="pRef" v-model="pid" :value-map="['provinceId', 'province']" title="请选择省份" :options="plist" @on-change="getInfo(pid,2)"></selector>
        <selector ref="cRef" v-model="cid" :value-map="['cityId', 'city']" title="请选择城市" :options="clist" @on-change="getInfo(cid,3)" v-show="clist.length>0"></selector>
        <selector ref="aRef" v-model="aid" :value-map="['areaId', 'area']" title="请选择地区" :options="alist" @on-change="getInfo(aid,4)" v-show="alist.length>0"></selector>
        <selector ref="tRef" v-model="tid" :value-map="['townId', 'townName']" title="请选择乡/镇" :options="tlist" v-show="tlist.length>0"></selector>
        <x-textarea title="详细地址：" v-model="info.addressDetail" placeholder="街道、楼牌号码等"></x-textarea>
      </group>
      <div style="padding:0 .2rem;">
        <yd-button :type="valid?'warning':'disabled'" @click.native="editAddress" size="large">保存</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { updateAddressInIos ,getAreaByType} from "../../api/index";
import {
  Group,
  Cell,
  XInput,
  XTextarea,
  Selector
} from "vux";
export default {
  name: "AddressEdit",
  data() {
    return {
      pid: "",
      cid: "",
      aid: "",
      tid: "",
      plist: [],
      clist: [],
      alist: [],
      tlist: [],
      info:{},
    };
  },
  components: {
    HeaderTop,
    Group,
    Cell,
    XInput,
    XTextarea,
    Selector
  },
  computed: {
    ...mapState(["account"]),
    valid() {
      return (
        !!this.info.consigneeName &&
        /^[1][35789][0-9]{9}$/.test(this.info.mobile) &&
        !!this.info.addressDetail
      );
    }
  },
  created() {
      this.info = this.$route.params.item;
      this.pid = this.info.proviceId.provinceId;
      this.cid = this.info.cityId.cityId;
      this.aid = this.info.areaId?this.info.areaId.areaId:0;
      this.tid =  this.info.townId?this.info.townId.townId:0;
      this.getInfo("", 1);
  },
  methods: {
    getInfo(id, type) {
      let vm = this;
      if (type == 2) {
        vm.clist = [];
        vm.alist = [];
        vm.tlist = [];
      }
      mui.ajax({
        url: getAreaByType,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          fatherId: id,
          addressType: type,
          goodSource: 5,
          token: md5(`gjfenggetAreaByType`)
        },
        success(res) {
          let _r = res.result;
          if ((type == 3 || type == 4) && !_r.length) {
            vm.alist = [];
            vm.tlist = [];
            return;
          }
          type == 1
            ? (vm.plist = _r)
            : type == 2
              ? (vm.clist = _r)
              : type == 3 ? (vm.alist = _r) : (vm.tlist = _r);
        }
      });
    },
    editAddress() {
      let vm = this;
      mui.ajax({
        url: updateAddressInIos,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id: this.info.id,
          account: this.account,
          goodSource: 5,
          consigneeName: this.info.consigneeName,
          consigneeSex: this.info.consigneeSex,
          mobile: this.info.mobile,
          proviceId: this.$refs.pRef.getFullValue()[0].id,
          cityId: this.$refs.cRef.getFullValue()[0].id,
          areaId: this.alist.length>0?this.$refs.aRef.getFullValue()[0].id:0,
          townId: this.tlist.length>0?this.$refs.tRef.getFullValue()[0].id:0,
          addressDetail: this.info.addressDetail,
          token: md5(
            `gjfengupdateAddressInIos${this.info.id}${this.account}`
          )
        },
        success(res) {
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: "修改成功",
              callback: () => {
                vm.$router.go(-1);
              }
            });
          } else {
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