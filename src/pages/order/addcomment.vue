<template>
  <div>
    <header-top title="添加评论"></header-top>
    <main class='scroll-content-2'>
      <yd-cell-group style="margin-bottom:0;">
        <yd-cell-item>
          <span slot="left">订单编号</span>
          <span slot="right">{{info.orderSn}}</span>
        </yd-cell-item>
      </yd-cell-group>
      <section v-for="(item,index) in info.goods" :key="index" class="good-container">
        <div class="content-box flex">
          <img :src="item.goodsImg" alt="" class="pdimg">
          <div class="flex-1 flex just-between flex-column">
            <p>{{item.goodsName}}</p>
            <p class="flex just-between">
              <span>￥{{item.goodsAmount}}</span>
              <span>×{{item.goodNum}}</span>
            </p>
          </div>
          <yd-textarea placeholder="商品如何，评价下吧" class="comment-content" v-model="item.comment"></yd-textarea>
        </div>
        <yd-cell-group style="margin-bottom:0;">
          <yd-cell-item>
            <span slot="left">评分</span>
            <crown slot="right" v-model="item.score" :font-size="24"></crown>
          </yd-cell-item>
        </yd-cell-group>
        <div class="img-box upload-box" v-if="item.toggle">
          <!-- <img :src="img" alt="" v-for="(img,i) in item.imgs" :key="i" class="img-item"> -->
          <img :src="item.imgs" alt="">
          <div class="upload-icon flex just-center align-center">
            <span class="iconfont-large self-upload"></span>
          </div>
          <input type="file" name="" id="upload-img" accept="image/*" @change="chooseImg($event,item)">
        </div>
        <div class="img-box" v-else>
          <yd-button type="warning" @click.native="item.toggle = true">我还要上传图片</yd-button>
        </div>
      </section>
      <div style="padding:0 .2rem .2rem;">
        <yd-button size="large" @click.native="publish" :type="valid?'primary':'disabled'">立即发布</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import Crown from "components/common/Crown";
import { newProCommet } from "../../api/index";
export default {
  name: "AddComment",
  data() {
    return {
      info: {}
    };
  },
  components: { HeaderTop, Crown },
  computed: {
    ...mapState(["member"]),
    valid() {
      return this.info.goods.every(item => {
        return !!item.comment;
      });
    }
  },
  created() {
    let order = this.$route.params.order;
    let goods = order.goods;
    let newGoods = [];
    newGoods = goods.map(item => {
      let newItem = {};
      newItem = Object.assign({}, item, {
        imgs: "",
        score: 5,
        comment: "",
        toggle: false
      });
      return newItem;
    });
    order = Object.assign({}, order, { goods: newGoods });
    this.info = order;
  },
  methods: {
    chooseImg(event, item) {
      let files = event.target.files;
      // for (let i = 0; i < 5; i++) {
      let file = files[0];
      if (!/image\/\w+/.test(file.type)) {
        this.$dialog.toast({
          mes: "请上传图片",
          timeout: 1000,
          icon: "error"
        });
        return;
      }
      lrz(file, { width: 800 }).then(rst => {
        // item.imgs.push(rst.base64);
        item.imgs = rst.base64;
      });
      // }
    },
    publish() {
      let vm = this;
      let proId = [],
        score = [],
        content = [],
        pictures = [];
      this.info.goods.forEach(item => {
        proId.push(item.goodsId);
        score.push(item.score);
        content.push(item.comment);
        pictures.push(
          item.imgs ? item.imgs.replace("data:image/jpeg;base64,", "") : "abc"
        );
      });

      mui.ajax({
        url: newProCommet,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          memberId: this.member.id,
          proId: proId.join(","),
          comScore: score.join(","),
          content: content.join("&"),
          fileContent: pictures.join(","),
          fileName: "123.png",
          orderSn: this.info.orderSn,
          token: md5(`gjfengnewProCommet${this.member.id}${this.info.orderSn}`)
        },
        success(res) {
          if (res.code !== 200) {
            vm.$dialog.alert({
              mes: res.msg
            });
          } else {
            vm.$dialog.toast({
              mes: res.msg,
              icon: "success",
              callback: () => {
                vm.$router.go(-1);
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.good-container {
  margin-bottom: @pd;
  background-color: @white;
}
.content-box {
  .pd-h;
  padding-top: @pd;
  background-color: @white;
  img {
    .wh(1rem,1rem);
    margin-right: @pd;
    border: 1px solid #f7f5f0;
    border-radius: 5px;
  }
}
.img-box {
  position: relative;
  .pd;
  img {
    width: 100%;
  }
  .upload-icon {
    border: 1px solid #ccc;
    .wh(1rem,1rem);
    border-radius: 50%;
    .hv-cen;
    background-color: #ccc;
    color: @white;
  }
  #upload-img {
    .hv-cen;
    .wh(100%,100%);
    opacity: 0;
    z-index: 5;
  }

  &.upload-box {
    min-height: 1.2rem;
  }
}
</style>