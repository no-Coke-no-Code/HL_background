<template>
  <div class="about">
    <h1>This is an about page</h1>
    <text-tip title="说明：必须启用才会生效，启用后不能删除。活动状态分别有：未启用/启用/进行中/已过期/已中止"></text-tip>
  </div>
</template>
<script>
import textTip from '@/components/TextTip/index.vue';

export default {
  created(){
    console.log(111)
  },
  components:{
    textTip
  }
}
</script>
