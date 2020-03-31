<template>
<div class="tip-wrapper flex space-between" v-if="isShow" :style="Color">
  <span>{{title}}</span>
  <span class="close" @click="close">关闭</span>
</div>
</template>

<script>
export default {
  name: 'text-tip',
  props: {
    title: {
      type: String
    },
    type: {
      type: String,
      default: 'normal', //normal, success, error
    }
  },
  data(){
    return {
      isShow: true,
    }
  },
  computed:{
    Color(){
      switch (this.type) {
        case 'normal':
            return {color:'#509AF1',backgroundColor:'#E4F1FF'};
          break;
        case 'success':
            return {color:'#67C23A',backgroundColor:'#F0F9EB'};
          break;
        case 'error':
            return {color:'#67C23A',backgroundColor:'#F0F9EB'};
          break;


      }
    }
  },
  methods: {
    close(){
      this.isShow = !this.isShow;
    }
  }
}
</script>

<style lang="scss" scoped>
.tip-wrapper {
  padding: 5px 20px 5px 10px;
  font-size: 12px;
  border-radius:2px;

  .close {
    padding-left: 35px;
    cursor: pointer;
  }
}
</style>
