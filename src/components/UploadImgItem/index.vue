<template>
  <div class="custom-upload">
    <div class="flex flex-center align-center">
      <div class="form-picture_show form-carouselMap" v-if="img">
        <img :src="img" alt="" srcset="" />
        <div class="form-mask">
          <label :for="'mt-article_modify_' + index">
            <i class="el-icon-plus"></i>
            <span>修改图片</span>
          </label>
          <input
            type="file"
            name=""
            :id="'mt-article_modify_' + index"
            @change="uploadImg($event, index)"
            style="display: none"
            accept="image/*"
          />
        </div>
      </div>
      <div class="form-picture_upload form-carouselMap" v-else>
        <label :for="'mt-article_upload_' + index">
          <i class="el-icon-plus"></i>
        </label>
        <input
          type="file"
          name=""
          :id="'mt-article_upload_' + index"
          @change="uploadImg($event, index)"
          style="display: none;"
          accept="image/*"
        />
      </div>
      <div style="display:none">
        <Uploader
          ref="singleUploader"
          :limit="1"
          @imgChange="handleImgChange"
          style="display:none"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Uploader from "@/components/Uploader/index.vue"; //图片上传组件
export default {
  name: "customUpload",
  data() {
    return {};
  },
  components: { Uploader },
  props: {
    img: {
      type: String,
      default() {
        return "";
      }
    },
    index: {
      type: Number,
      default() {
        return -1;
      }
    }
  },
  methods: {
    // 调用上传组件上传图片
    uploadImg(e, i) {
      this.$refs.singleUploader.handleImgChange(e, i);
    },
    // 获取图片，回调事件
    handleImgChange(data, index) {
      this.$emit("handleImgChange", data, index);
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-upload {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  [class^="el-icon-"] {
    font-size: 20px;
  }
  > div {
    width: 100%;
    height: 100%;
  }
  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
  }
  .form-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s ease-in 0.1s;
    i {
      color: #fff;
      font-size: 30px;
    }
  }

  .form-picture_show:hover .form-mask {
    opacity: 1;
  }

  .form-picture_upload {
    &.form-carouselMap {
      width: 100%;
      height: 100%;
    }
    &.form-navBar_upload {
      width: 100%;
      height: 100%;
    }
  }

  .form-picture_show {
    &.form-navBar_show {
      width: 100%;
      height: 100%;
    }
    &.form-carouselMap {
      height: 100%;
    }
    span {
      font-size: 12px;
    }
  }

  .form-table_navBar .el-input__inner {
    padding: 0 8px;
  }
}
</style>
