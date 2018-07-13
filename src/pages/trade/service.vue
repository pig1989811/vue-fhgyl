<template>
  <div>
    <header-top title="服务协议"></header-top>
    <main class='scroll-content-2'>
      <iframe :src="url" frameborder="0" style="width:100%;height:100%;"></iframe>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import {memService } from '../../api/index'
export default {
  name: 'memService',
  data() {
    return {
      url:""
    }
  },
  components: { HeaderTop },
  created() {
    let vm = this;
    mui.ajax({
      url: memService,
      type: 'post',
      headers: {'app-version': 'v1.0'},
      data: {
        
        token: md5(`gjfengmemService`)
      },
      success(res){
        vm.url = res.result;
      }
    })
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';


</style>