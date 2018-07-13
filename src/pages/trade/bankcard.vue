<template>
  <div>
    <header-top title="银行卡"></header-top>
    <main class='scroll-content' style="background-color:#fff;">
      <section class="bank-list" v-show="bankList.length">
        <group-title>左滑银行卡可以删除</group-title>
        <swipeout>
          <swipeout-item transition-mode="reveal" v-for="(item,index) in bankList" :key="item.id" ref="aaa">
            <div slot="right-menu">
              <div class="delete-icon flex just-center align-center" @click="deleteBank(item,index)">
                <span class="iconfont-large self-delete danger-color"></span>
              </div>
            </div>
            <div slot="content" style="padding:12px;">
              <div class="bank-item flex align-center" @click="setDefaultBank(item)">
                <div class="bank-info flex-1" :style="{'background-color':item.bankColor}">
                  <div class="bank-label flex align-center">
                    <div class="icon" :style="{'background-image':formatBg(item.bankPic)}"></div>
                    <div class="bank-name flex-1">
                      <p>{{item.bankName}}</p>
                      <p>{{item.bankSub}}</p>
                    </div>
                  </div>
                  <div class="bank-card text-center">{{formatCard(item.bankCard)}}</div>
                </div>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </section>
      <div class="hv-cen text-center" v-show="!bankList.length">
        <span class="iconfont self-noorder" style="font-size:40px;"></span>
        <p>没有银行卡，赶紧去添加</p>
      </div>
    </main>
    <footer class="fix-footer">
      <button class="delete-btn btn-large" @click="newBank">
        <span class="iconfont self-add"></span>添加银行卡</button>
    </footer>
    <cert-modal @update-name="showRealName"></cert-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import HeaderTop from 'components/header/index'
import CertModal from 'components/common/CertModal'
import { GroupTitle, Swipeout, SwipeoutItem } from 'vux'
import { getStore, mixin } from 'components/common/mixin'
import { deleteMemBank } from '../../api/index'
export default {
  name: 'BankCard',
  data() {
    return {
    }
  },
  components: { HeaderTop, CertModal, GroupTitle, Swipeout, SwipeoutItem },
  computed: {
    ...mapState(['bankList', 'showCertificate', 'certificateStatus'])
  },
  mixins: [mixin],
  created() {

    },
  activated() {
      this.$store.dispatch('getBankList');
  },
  methods: {
    formatCard(num) {
      return `**** **** **** ${num.slice(-4)}`;
    },
    deleteBank(b,i) {
      let vm = this;
      this.$nextTick(()=>{
        this.$refs.aaa[i].close();
      })
      this.$dialog.loading.open("删除中...");
      mui.ajax({
        url: deleteMemBank,
        type: 'post',
        headers: { 'app-version': 'v1.0' },
        data: {
          bankId: b.id,
          account: getStore('account'),
          token: md5(`gjfengdeleteMemBank${getStore('account')}${b.id}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code !== 200) {
            vm.$dialog.toast({
              mes: res.msg,
            })
            return;
          }
          else {
            vm.$dialog.toast({
              mes: res.msg,
              callback: () => {
                vm.$store.dispatch('getBankList');
              }
            })
          }
        }
      })
    },
    newBank() {
      if (!this.certificateStatus) {
        this.$store.commit('SHOW_CERTIFICATE', true);
      }
      else {
        this.$router.push({ name: 'NewBank' })
      }
    },
    setDefaultBank(b){
      if(this.$route.query.type=='choose'){
        this.$store.commit("RECORD_BANK_CARD",b);
        this.$router.go(-1);
      }
    },
    showRealName(){
      this.$store.dispatch("getInfo");
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
.bank-item {
  margin-top: @pd;
  margin-left: @pd;
  color: @white;
  .bank-info {
    padding: @pd @pd @pd @pd *2;
    border-radius: 5px;
    .bank-label {
      width: 100%;
      .icon {
        .wh(.8rem, .8rem);
        background-size: cover;
      }
      .bank-name {
        margin-left: @pd * 2;
        p:first-of-type {
          font-size: 16px;
        }
        p {
          margin-bottom: @pd;
        }
      }
    }
    .bank-card {
      width: 100%;
      font-size: .3rem;
      letter-spacing: 3px;
    }
  }
}

.delete-icon {
  .wh(.8rem, .8rem);
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
}
</style>