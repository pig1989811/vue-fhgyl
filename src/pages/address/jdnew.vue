<template>
  <div>
    <header-top title="京东地址添加"></header-top>
    <main class='scroll-content-2'>
      <group>
        <x-input title="收货人" v-model="consigneeName" placeholder="请输入收货人姓名" required></x-input>
        <x-input title="手机号码" v-model="mobile" placeholder="请输入收货人手机号码" type="tel" is-type="china-mobile" required></x-input>
        <cell title="性别">
          <div slot="default">
            <label for="male" class="self-radio">
              <input type="radio" value="1" id="male" v-model="consigneeSex">
              <span>男</span>
            </label>
            <label for="female" class="self-radio">
              <input type="radio" value="2" id="female" v-model="consigneeSex">
              <span>女</span>
            </label>
          </div>
        </cell>
        <selector ref="pRef" v-model="pid" :value-map="['provinceId', 'province']" title="请选择省份" :options="plist" @on-change="getInfo(pid,2)"></selector>
        <selector ref="cRef" v-model="cid" :value-map="['cityId', 'city']" title="请选择城市" :options="clist" @on-change="getInfo(cid,3)"></selector>
        <selector ref="aRef" v-model="aid" :value-map="['areaId', 'area']" title="请选择地区" :options="alist" @on-change="getInfo(aid,4)"></selector>
        <selector ref="tRef" v-model="tid" :value-map="['townId', 'townName']" title="请选择乡/镇" :options="tlist"></selector>
        <x-textarea title="详细地址：" v-model="addressDetail" placeholder="街道、楼牌号码等"></x-textarea>
      </group>
      <div style="padding:0 .2rem;">
        <yd-button :type="valid?'primary':'disabled'" @click.native="addAddress" size="large">保存</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { Group, Cell, XInput, XTextarea, Selector } from "vux";
import { getAreaByType ,newsAddress} from "../../api/index";
export default {
  name: "JDAddressNew",
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
      consigneeName: "",
      consigneeSex: "1",
      mobile: "",
      addressDetail: ""
    };
  },
  components: { HeaderTop, Group, Cell, XInput, XTextarea, Selector },
  computed: {
    ...mapState(["account"]),
    valid() {
      return (
        !!this.consigneeName &&
        /^1[3,4,5,7,8,9]\d{9}$/.test(this.mobile) &&
        !!this.pid &&
        !!this.cid &&
        !!this.aid &&
        !!this.addressDetail
      );
    }
  },
  created() {
    this.getInfo("", 1);
  },
  activated() {},
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
          goodSource: 1,
          token: md5(`gjfenggetAreaByType`)
        },
        success(res) {
          let _r = res.result;
          if (type == 4 && !_r.length) {
            vm.tlist = [
              {
                townName: "默认",
                townId: 0,
                id: 0
              }
            ];
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
    addAddress() {
      let vm = this;
      mui.ajax({
        url: newsAddress,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          goodSource: 1,
          consigneeName: this.consigneeName,
          consigneeSex: this.consigneeSex,
          mobile: this.mobile,
          proviceId: this.$refs.pRef.getFullValue()[0].id,
          cityId: this.$refs.cRef.getFullValue()[0].id,
          areaId: this.$refs.aRef.getFullValue()[0].id,
          townId: this.tid==0?'0': this.$refs.tRef.getFullValue()[0].id,
          addressDetail: this.addressDetail,
          token: md5(`gjfengnewsAddress${this.account}`)
        },
        success(res) {
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: "添加成功"
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
