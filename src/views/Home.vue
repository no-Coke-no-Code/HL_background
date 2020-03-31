<template>
  <div class="home flex">

    <router-view class="flex-item"/>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'home',
  components: {
    mtMenu
  },
  data(){
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/common.scss';
.home {
  height: 100%;
}
</style>
