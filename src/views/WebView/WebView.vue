<template>
  <div>
    <iframe :src="url" id="iframe" frameborder="0" seamless="seamless"></iframe>
    <big-Picture
      :images="imgList"
      :visible.sync="bigPictureVisible"
    ></big-Picture>
  </div>
</template>
<script>
import bigPicture from "@/components/BigPicture";
export default {
  components: {
    bigPicture
  },
  data() {
    return {
      url: "",
      imgList: [],
      bigPictureVisible: false
    };
  },
  created() {
    console.log("this.$route.query.url", this.$route.query);
    var that = this;
    this.url = decodeURIComponent(this.$route.query.url);
    // 补偿旧控价后台的部分功能
    // 查看大图功能
    if (typeof window.getimg !== "function") {
      window.getimg = function(url) {
        that.imgList[0] = url;
        that.bigPictureVisible = true;
      };
    }
  }
};
</script>
<style lang="scss" scoped>
#iframe {
  width: 100%;
  height: calc(100vh - 91px);
  border: none;
  outline: none;
}
</style>
