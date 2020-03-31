<template>
  <div>
    <div class="el-upload__tip">
      {{ tip }}
    </div>
    <div class="custom-upload">
      <div class="flex flex-start align-center">
        <div class="img-block" v-for="(item, index) in imgList" :key="index">
          <div class="form-picture_show form-carouselMap">
            <i
              class="delete_icon el-icon-error"
              v-if="showDeleteIcon"
              @click="handleDelete(index)"
            ></i>
            <img :src="item" alt="" srcset="" />
            <div class="form-mask">
              <label :for="'mt-article_modify_' + index">
                <i class="el-icon-plus"></i>
                <span>修改图片</span>
              </label>
              <input
                type="file"
                name=""
                :id="'mt-article_modify_' + index"
                @change="e => handleImgChange(e, index)"
                style="display: none"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div style="display:inline-block">
          <el-upload
            v-if="imgList.length < limit || unlimmit"
            action=""
            :accept="accept"
            multiple
            :show-file-list="false"
            :file-list="fileList"
            :auto-upload="false"
            :on-change="handleUploadChange"
            :before-upload="beforeUpload"
          >
            <div class="el-upload el-upload--picture-card">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const Bucket = "shangxueyuan-1251312616"; //标准上传桶
const PrivateBucket = "shangxueyuansiyou-1251312616"; //私有上传桶
const Region = "ap-guangzhou"; //区域
const Protocol = location.protocol === "https:" ? "https:" : "http:"; //协议头
export default {
  data() {
    return {
      fileList: [], //文件列表
      audioDuration: 0, //音/视频时长
      percent: 0, //进度
      loadingDOM: null,
      // 公有读上传链接
      prefix: Protocol + "//" + Bucket + ".cos." + Region + ".myqcloud.com/",
      // 私有读上传链接
      privatePrefix:
        Protocol + "//" + PrivateBucket + ".cos." + Region + ".myqcloud.com/"
    };
  },
  props: {
    // 展示图片列表，外部传入
    imgList: {
      type: [Array, String],
      default() {
        return [];
      }
    },
    //   是否私有读
    isprivate: {
      type: Boolean,
      default: false
    },
    // 上传路径
    path: {
      type: String,
      default: "*"
    },
    // 提示语
    tip: {
      type: String,
      default: ""
    },
    // 数量限制
    limit: {
      type: Number,
      default: 1
    },
    // 文件类型
    accept: {
      type: String,
      default: "image/*"
    },
    // 是否显示删除按钮
    showDeleteIcon: {
      type: Boolean,
      default: true
    },
    // 不限制上传数量
    unlimmit: {
      type: Boolean,
      default: false
    },
    // 文件大小限制
    sizeLimmit: {
      type: Number,
      default: 10
    },
    // 是否通过校验 进行上传
    passVaild: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 图片修改事件
    handleImgChange(e, index) {
      let self = this;
      this.uploadFile(e.target.files[0], function(err, data) {
        console.log(err || data);
        // 上传完成把链接传给父级
        self.$emit("imgChange", data, index);
      });
    },

    // 删除图片事件，外部处理逻辑
    handleDelete(i) {
      this.$emit("handleDelete", i);
    },

    //   el组件文件变化事件触发上传事件
    handleUploadChange(file, fileList) {
      let self = this;
      console.log("fileList", fileList);
      this.uploadFile(file.raw, function(err, data) {
        console.log(err || data);
        // 上传完成把链接传给父级
        self.$emit("uploadFile", data);
      });
    },

    // 直接从外部触发的上传事件
    directUpload(file, type) {
      let self = this;
      this.uploadFile(file, function(err, data) {
        console.log(err || data);
        // 上传完成把链接传给父级
        self.$emit("uploadFile", data, type);
      });
    },

    // 上传之前事件，抛给富文本编辑器用的
    beforeUpload() {
      this.$emit("beforeUpload");
    },

    //   解码
    camSafeUrlEncode(str) {
      return encodeURIComponent(str)
        .replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
    },

    //   获取上传签名
    getAuthorization(options, callback) {
      this.$http.PcCommon
      .GetTencentOssSignCtl()
      .then((res)=>{
        let credentials = JSON.parse(res).Credentials;
        if (callback) 
        {
          callback(null, {
            XCosSecurityToken: credentials.Token,
            Authorization: CosAuth({
              SecretId: credentials.TmpSecretId,
              SecretKey: credentials.TmpSecretKey,
              Method: options.Method,
              Pathname: options.Pathname
            })
          });
        }
      })
      .catch((err)=>{
        console.log(err);
        // 失败事件，也是抛给富文本编辑器用来解除动画的
        this.$emit("uploadError");
        this.$message({
          type: "error",
          message: "获取上传签名失败"
        });
      });
    },

    // 上传文件 先校验 再触发获取上传签名方法
    uploadFile(file, callback) {
      let self = this;
      // 判断大小限制
      if (file.size > 1024 * 1024 * this.sizeLimmit) {
        this.$message({
          type: "warning",
          message: `上传文件大小不能超过 ${this.sizeLimmit}M`
        });
        return;
      }
      // 文件格式为音频类型时,获取时长
      let type = file.type.split("/");
      if (this.accept === "audio/*") {
        if (type && type.length && type[0] && type[0] === "audio") {
          console.log(type[0]);
          this.getTimes(file);
        } else {
          this.$message({
            type: "warning",
            message: `请选择正确的文件格式!`
          });
          return;
        }
      }
      // 为pdf 验证格式
      if (this.accept === ".pdf") {
        if (type && type.length && type[1] && type[1] === "pdf") {
          console.log(type[1]);
        } else {
          this.$message({
            type: "warning",
            message: `请选择正确的文件格式!`
          });
          return;
        }
      }
      var Key =
        "dir/tshangxueyuanbg/" + self.path + new Date().getTime() + file.name; // 这里指定上传目录和文件名
      this.getAuthorization({ Method: "PUT", Pathname: "/" + Key }, function(
        err,
        info
      ) {
        if (err) {
          alert(err);
          return;
        }
        var auth = info.Authorization;
        var XCosSecurityToken = info.XCosSecurityToken;
        var url =
          (self.isprivate ? self.privatePrefix : self.prefix) +
          self.camSafeUrlEncode(Key).replace(/%2F/, "/");
        var xhr = new XMLHttpRequest();
        // 开始上传 loading
        // 上传提示 图片以外都进行提示
        if (self.accept !== "image/*") {
          self.loadingDOM = self.$notify.info({
            title: "提示",
            message: `文件上传中，请勿进行其它操作...`,
            duration: 0
          });
        }
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Authorization", auth);
        XCosSecurityToken &&
          xhr.setRequestHeader("x-cos-security-token", XCosSecurityToken);
        xhr.upload.onprogress = function(e) {
          let presentShow = Math.round((e.loaded / e.total) * 10000) / 100;
          // 展示上传进度
          self.$emit("uploading", presentShow);
        };
        xhr.onload = function() {
          // 关闭提示
          if (self.loadingDOM) {
            self.loadingDOM.close();
          }
          if (/^2\d\d$/.test("" + xhr.status)) {
            var ETag = xhr.getResponseHeader("etag");
            callback(null, {
              url: url, //链接
              ETag: ETag,
              name: file.name, //文件名
              duration: self.audioDuration //时长
            });
          } else {
            // 失败事件，也是抛给富文本编辑器用来解除动画的
            self.$emit("uploadError");
            callback("文件 " + Key + " 上传失败，状态码：" + xhr.status);
          }
        };
        xhr.onerror = function() {
          // 关闭提示
          if (self.loadingDOM) {
            self.loadingDOM.close();
          }
          // 失败事件，也是抛给富文本编辑器用来解除动画的
          self.$emit("uploadError");
          callback("文件 " + Key + " 上传失败，请检查是否没配置 CORS 跨域规则");
        };
        xhr.send(file);
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
.el-upload__tip {
  margin: 0;
}
.custom-upload {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  .img-block {
    width: 148px;
    height: 148px;
    position: relative;
    margin-right: 10px;
    border: 1px dashed #c0ccda;
    .delete_icon {
      opacity: 0;
      cursor: pointer;
      color: #000;
      position: absolute;
      top: 0;
      right: 0;
      margin-top: -7px;
      margin-right: -7px;
      z-index: 99;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
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
  .form-picture_show:hover .delete_icon {
    opacity: 1;
  }

  .form-picture_upload {
    &.form-carouselMap {
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
      width: 148px;
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
