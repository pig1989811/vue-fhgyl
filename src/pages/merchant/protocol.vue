<template>
  <div>
    <header-top title="合作协议"></header-top>
    <main class='scroll-content-2'>
      <iframe :src="url+($route.params.key || 1)" frameborder="0" style="width:100%;height:100%;"></iframe>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import {memberCooperationRule} from "../../api/index"
export default {
  name: 'MerchantProtocol',
  data() {
    return {
      url: `${memberCooperationRule}?key=merchant_`
    }
  },
  components: { HeaderTop }
}
</script>
