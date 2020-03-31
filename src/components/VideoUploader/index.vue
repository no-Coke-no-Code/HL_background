<template>
  <div>
    <div class="el-upload__tip">
      {{ tip }}
    </div>
    <el-upload
      :disabled="uploading"
      action=""
      multiple
      :auto-upload="false"
      accept="video/*"
      :on-change="handleUploadChange"
      :show-file-list="false"
    >
      <el-button type="primary" :disabled="uploading">{{
        uploadText
      }}</el-button>
      <span v-if="FileName" class="file-name"
        ><img src="@/assets/images/Video.png" alt="" /> {{ FileName }}</span
      >
      <i
        v-if="uploading"
        title="取消上传"
        @click.stop="cancelUpload"
        class="cancel el-icon-circle-close"
      ></i>
    </el-upload>
  </div>
</template>
<script>
import {
  constGetUploadSignatureAsyncCtl //获取上传签名(视频)
} from "@/api/request.js";
import TcVod from "vod-js-sdk-v6";
export default {
  data() {
    return {
      Sign: "", // 请求签名
      file: "", //文件
      uploader: null, //上传使用的实体
      uploading: false, //是否正在上传
      audioDuration: 0, //时长
      loadingDOM: null //提示消息实例
    };
  },
  props: {
    // 提示
    tip: {
      type: String,
      default: "支持格式：mp4、mov、avi、amv、flv，大小不超过500M"
    },
    // 文本
    uploadText: {
      type: String,
      default: "上传视频"
    },
    // 数量
    limit: {
      type: Number,
      default: 1
    },
    // 大小限制
    sizeLimmit: {
      type: Number,
      default: 500
    },
    // 文件名
    FileName: {
      type: String,
      default: ""
    }
  },
  methods: {
    // 文件变化触发上传事件
    handleUploadChange(file) {
      let mediaFile = file.raw ? file.raw : file;
      let type = mediaFile.type.split("/");
      // 判断文件大小是否超过限制
      if (mediaFile.size > 1024 * 1024 * this.sizeLimmit) {
        this.$message({
          type: "warning",
          message: `上传文件大小不能超过 ${this.sizeLimmit}M !`
        });
        return;
      }
      // 规定文件格式为视频类型
      if (type && type[0] && type[0] && type[0] === "video") {
        console.log(type[0]);
        this.uploadTest(file);
      } else {
        this.$message({
          type: "warning",
          message: `请选择正确的文件格式!`
        });
        return;
      }
    },
    // 获取请求签名
    GetSign() {
      return this.$http({
        url: constGetUploadSignatureAsyncCtl,
        method: "get"
      })
        .then(res => {
          if (res.Code === 1) {
            this.Sign = res.Data;
            return res.Data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 取消上传
    cancelUpload() {
      if (this.uploading && this.uploader) {
        this.uploader.cancel();
        this.uploading = false;
        this.$emit("cancelUpload");
        if (this.loadingDOM) {
          this.loadingDOM.close();
        }
        this.$message({
          type: "info",
          message: "已取消上传"
        });
      }
    },
    // 上传云点播
    uploadTest(file) {
      // eslint-disable-next-line no-undef
      if (this.uploading) {
        return;
      }
      let self = this;
      const tcVod = new TcVod({
        getSignature: this.GetSign
      });
      var mediaFile = file.raw ? file.raw : file;
      this.getTimes(mediaFile);
      this.uploader = tcVod.upload({
        mediaFile: mediaFile // 媒体文件（视频或音频或图片），类型为 File
      });
      // 上传提示
      self.uploading = true;
      self.loadingDOM = self.$notify.info({
        title: "提示",
        message: `视频上传中，请勿进行其它操作...`,
        duration: 0
      });
      self.uploader.on("media_progress", function(info) {
        console.log(info.percent); // 进度
        // 展示上传进度
        self.$emit("uploading", info.percent * 100);
      });
      // 视频上传完成时
      self.uploader.on("media_upload", function(info) {
        self.uploading = false;
        if (self.loadingDOM) {
          self.loadingDOM.close();
        }
        console.log("视频上传完成时", info);
      });
      self.uploader.done().then(function(doneResult) {
        self.uploading = false;
        if (self.loadingDOM) {
          self.loadingDOM.close();
        }
        // 视频上传结果
        self.$emit(
          "onVideoUpload",
          doneResult,
          mediaFile.name,
          self.audioDuration
        );
      });
    },
    //获取时长
    getTimes(file) {
      var content = file;
      var url = URL.createObjectURL(content);
      //经测试，发现audio也可获取视频的时长
      var audioElement = new Audio(url);
      audioElement.addEventListener("loadedmetadata", () => {
        this.audioDuration = parseInt(audioElement.duration);
        console.log(this.audioDuration);
      });
    }
  }
};
</script>
<style lang="scss">
.file-name {
  padding-left: 20px;
  img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    vertical-align: middle;
  }
}
.cancel {
  color: red;
  font-size: 18px;
  margin-left: 10px;
  line-height: 32px;
  cursor: pointer;
}
</style>
