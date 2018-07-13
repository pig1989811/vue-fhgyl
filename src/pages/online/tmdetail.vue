<template>
  <div>
    <header-top title="优惠券"></header-top>
    <main class='scroll-content-2'>
      <iframe :src="$route.params.url" style="width: 100%;height: 100%;"  frameborder="0"></iframe>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
export default {
  name: 'TMDetail',
  components: { HeaderTop }
}
</script>
