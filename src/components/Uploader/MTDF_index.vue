<template>
  <div>
    <div class="el-upload__tip">
      {{ tip }}
    </div>
    <div class="custom-upload">
      <div class="flex flex-start align-center">
        <!-- 默认是个图片处理器 图片数组外部传入 imgList不传入就不显示 可以隐藏 -->
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
          <!-- 上传核心处理用el-upload 默认状态下上传文件大于等于限制时 隐藏上传组件 -->
          <!-- 可以:unlimmit="true" 不做上传数量限制 保持显示/可用状态  -->
          <el-upload
            v-if="imgList.length < limit || unlimmit"
            action="http://mt-xqr68ke31583720894.img.hyxmt.cn/api/OpenApi/upload"
            :accept="accept"
            multiple
            :auto-upload="false"
            :data="uploadData"
            :show-file-list="false"
            :file-list="fileList"
            :on-change="handleUploadChange"
            :before-upload="beforeUpload"
          >
            <div class="el-upload el-upload--picture-card">
              <!-- 自定义slot -->
              <slot><i class="el-icon-plus"></i></slot>
            </div>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* 
  自行安装  cnpm install crypto-js
*/
// --------------START 腾讯云 上传参数自行修改--------------
const Bucket = "shangxueyuan-1251312616"; //标准上传桶
const PrivateBucket = "shangxueyuansiyou-1251312616"; //私有上传桶
const Region = "ap-guangzhou"; //区域
// --------------- END 腾讯云  参数自行修改--------------

// ------------START 引入接口 接口可能会有变化 自行修改-------------------------
// const UploadFileCtl = "/api/FileOssIntergrate/UploadFileCtl"; // POST 上传文件 猫态文件系统
// const GetSignKeyCtl = "/api/FileOssIntergrate/GetSignKeyCtl"; // POST MTDF获取上传文件签名
// const UploadFileByLocalCtl = "/api/FileOssIntergrate/UploadFileByLocalCtl"; //上传服务器本地
// -------------END 引入接口-------------------------

const crypt_key = "mt#131452033#mt"; //MTDF文件KEY 加解密用
const token = localStorage.getItem("SYSTEMSETTINGTOKEN"); //---------token自行配置！！！！！！！！！-----------------------
// 支持上传文件类型
// eslint-disable-next-line no-unused-vars
const upload_allow_ext = {
  //图像
  Image: ["jpg", "jpeg", "png", "gif", "bmp", "ico"],
  // 音频
  Audio: ["ogg", "mp3", "wma"],
  //视频
  Video: ["mp4", "avi", "movie", "mpeg", "wmv", "rmvb", "flv"],
  //应用
  APP: ["apk", "swf"],
  //包
  package: ["rar", "7z", "zip", "tar", "gz"],
  //文档
  File: [
    "pdf",
    "json",
    "htm",
    "html",
    "xhtml",
    "xml",
    "txt",
    "log",
    "css",
    "js",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx"
  ]
};
/// 上传方式 调用GetSignKeyCtl接口时返回type，根据type调用对应的上传方法
const UPLOAD_TYPE = {
  // 默认
  Default: 0,
  /// 腾讯云
  Tencent: 1,
  /// 阿里云
  Ali: 2,
  /// 猫态文件系统
  MtDFS: 3,
  /// 服务器本地文件夹
  Local: 4
};

// 请求头设置
const headers = {
  Authorization: token, // 设置token
  "Content-Type": "multipart/form-data" //form-data格式
};
const Protocol = location.protocol === "https:" ? "https:" : "http:"; //拼接用的协议头
const AJAX_SUCCESS = 1; //接口调用成功Code值
import axios from "axios";
import CryptoJS from "crypto-js"; //自行安装  cnpm install crypto-js
export default {
  data() {
    return {
      fileList: [], //文件列表
      audioDuration: 0, //音/视频时长
      percent: 0, //进度
      loadingDOM: null,
      uploadData: {},
      prefix: Protocol + "//" + Bucket + ".cos." + Region + ".myqcloud.com/", // 腾讯云 公有读上传链接
      privatePrefix:
        Protocol + "//" + PrivateBucket + ".cos." + Region + ".myqcloud.com/" // 腾讯云 私有读上传链接
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
    // 是否私有读
    isprivate: {
      type: Boolean,
      default: false
    },
    // 上传路径
    path: {
      type: String,
      default: "file/"
    },
    // 提示语
    tip: {
      type: String,
      default: ""
    },
    // 数量限制 默认有限制 手动修改数量限制 如果不想限制 可使用unlimmit
    limit: {
      type: Number,
      default: 1
    },
    // 接收文件类型
    accept: {
      type: String,
      default: "image/*"
    },
    // 是否显示删除按钮
    showDeleteIcon: {
      type: Boolean,
      default: true
    },
    // 默认状态如果有上传限制，上传到达数量限制时无法再上传，使用此属性可以不设置limmit始终保持可上传状态
    unlimmit: {
      type: Boolean,
      default: false
    },
    // 文件大小限制 单位M
    sizeLimmit: {
      type: Number,
      default: 10
    },
    // 上传类型
    uploadType: {
      type: Number,
      default: 0
    },
    // 是否通过beforeUpload校验，用于外部自定义beforeUpload，变为false则取消上传
    passVaild: {
      type: Boolean,
      default: true
    },
    // 显示上传提示
    showUploadTip: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 图片修改事件
    handleImgChange(e, index) {
      let self = this;
      this.uploadFile(e.target.files[0], function(err, data) {
        console.log(err || data);
        // 上传完成把链接传给父级 父级自行处理图片数组
        self.$emit("imgChange", data, index);
      });
    },

    // 删除图片事件，外部处理逻辑，显示的图片是用传入的imgList展示的，所以外部修改图片数组就行
    handleDelete(i) {
      this.$emit("handleDelete", i);
    },

    // el组件文件变化事件触发上传事件
    handleUploadChange(file, fileList) {
      let self = this;
      console.log("fileList", fileList);
      this.uploadFile(file.raw, function(err, data) {
        console.log(err || data);
        // 上传完成把链接传给父级
        self.$emit("uploadFile", data);
      });
    },

    // 直接从外部触发的上传事件 直接通过$refs触发此方法传入文件 不经过el-upload的相关方法
    directUpload(file, type) {
      let self = this;
      this.uploadFile(file, function(err, data) {
        console.log(err || data);
        // 上传完成把链接传给父级
        self.$emit("uploadFile", data, type);
      });
    },

    // 默认上传之前事件，抛出自定义
    beforeUpload() {
      this.$emit("beforeUpload");
    },

    //  腾讯云 路径解码
    camSafeUrlEncode(str) {
      return encodeURIComponent(str)
        .replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
    },

    //  腾讯云 文件封装
    TencentAuthorization(SignParam, options, callback) {
      console.log("封装腾讯云文件");
      console.log(SignParam);
      let credentials = JSON.parse(SignParam).Credentials;
      if (callback) {
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
    },

    // 上传文件 校验通过 再获取上传签名
    uploadFile(file, callback) {
      // 判断大小限制
      if (file.size > 1024 * 1024 * this.sizeLimmit) {
        this.$message({
          type: "warning",
          message: `上传文件大小不能超过 ${this.sizeLimmit} M`
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
      // 通过这个属性判断是否可以上传，用于外部自行定义校验方法
      if (this.passVaild) {
        // 调用获取上传签名方法
        this.getUploadSignMTDF(file, callback);
        console.log("我执行了");
      } else {
        console.log("不允许上传");
        return;
      }
    },

    // 猫态普通上传oss
    simpleUpload(file, callback) {
      let self = this;
      let param = new FormData();
      // 将得到的文件流添加到FormData对象
      param.append("file", file, file.name);
      axios({
        url: UploadFileCtl + "?type=" + this.uploadType,
        method: "post",
        data: param,
        headers,
        withCredentials: true,
        processData: false,
        onUploadProgress: progressEvent => {
          var complete = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          self.$emit("uploading", complete);
        }
      })
        .then(res => {
          console.log(res.Data);
          // 上传结束先关闭提示
          if (res.Code === AJAX_SUCCESS) {
            callback(null, {
              url: res.Data, //链接
              name: file.name, //文件名
              duration: self.audioDuration //时长
            });
          }
        })
        .catch(err => {
          console.log(err);
          // 失败事件，也是抛给富文本编辑器用来解除动画的
          self.$emit("uploadError");
          callback("文件 " + file.name + " 上传失败：" + err);
        });
    },

    // 腾讯云上传
    TCUpload(file, callback, SignParam) {
      console.log("腾讯云上传");
      let self = this;
      var Key =
        "dir/tshangxueyuanbg/" + self.path + new Date().getTime() + file.name; // 这里指定上传目录和文件名
      this.TencentAuthorization(
        SignParam,
        { Method: "PUT", Pathname: "/" + Key },
        function(err, info) {
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
          xhr.open("PUT", url, true);
          xhr.setRequestHeader("Authorization", auth);
          XCosSecurityToken &&
            xhr.setRequestHeader("x-cos-security-token", XCosSecurityToken);
          xhr.upload.onprogress = function(e) {
            // 展示上传进度 外部自行接收事件
            let presentShow = Math.round((e.loaded / e.total) * 10000) / 100;
            console.log(presentShow + "%");
            self.$emit("uploading", presentShow);
          };
          xhr.onload = function() {
            if (/^2\d\d$/.test("" + xhr.status)) {
              var ETag = xhr.getResponseHeader("etag");
              callback(null, {
                url: url, //链接
                ETag: ETag, //意义不明的标签
                name: file.name, //文件名
                duration: self.audioDuration //时长 音频和mp4才有，其它格式不支持
              });
            } else {
              // 抛出 失败事件
              self.$emit("uploadError");
              callback("文件 " + Key + " 上传失败，状态码：" + xhr.status);
            }
          };
          xhr.onerror = function() {
            // 抛出 失败事件
            self.$emit("uploadError");
            callback(
              "文件 " + Key + " 上传失败，请检查是否没配置 CORS 跨域规则"
            );
          };
          xhr.send(file);
        }
      );
    },

    // 阿里云上传
    AliUpload(file, callback, ossConfig) {
      console.log(ossConfig);
      const several = file.name.split(".");
      const suffix = several[several.length - 1];
      const newFile = new File([file], ossConfig.FileName + "." + suffix, {
        type: file.type
      });
      const fd = new FormData();
      fd.append("name", newFile.name);
      fd.append("key", ossConfig.DirUrl + "${filename}");
      fd.append("policy", ossConfig.Policy);
      fd.append("OSSAccessKeyId", ossConfig.AccessKeyId);
      fd.append("success_action_status", 200);
      fd.append("signature", ossConfig.Signature);
      fd.append("file", newFile);
      axios
        .post(ossConfig.OssUrl, fd, {
          headers,
          onUploadProgress: ({ total, loaded }) => {
            // 进行上传进度输出，更加直观
            this.$emit("uploading", Math.round((loaded / total) * 100));
          }
        })
        .then(response => {
          if (response.status !== 200) {
            return;
          }
          // 阿里云上传成功后要自行拼接链接
          if (callback) {
            callback(null, {
              name: file.name, //文件名
              url:
                ossConfig.OssUrl + "/" + ossConfig.DirUrl + ossConfig.FileName, //链接
              duration: this.audioDuration //时长 音/视频
            });
          }
        })
        .catch(onError => {
          this.$emit("uploadError", file.name, onError);
          callback("文件 " + file.name + " 上传失败：" + onError);
        });
    },

    // 猫态文件管理系统上传
    MtDFSUpload(file, callback, SignParam) {
      console.log(file, callback, SignParam);
      let token = {};
      token.key = SignParam.token; // 上传密钥
      token.time = parseInt(new Date().getTime() / 1000); // 当前时间戳(单位:秒)
      token = this.des_encrypt(JSON.stringify(token)); // json对象转字符串再des加密
      const fd = new FormData();
      fd.append("file", file);
      fd.append("token", token);
      axios
        .post(
          "http://mt-xqr68ke31583720894.img.hyxmt.cn/api/OpenApi/upload",
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data" //form-data格式
            },
            onUploadProgress: ({ total, loaded }) => {
              // 进行上传进度输出，更加直观
              this.$emit("uploading", Math.round((loaded / total) * 100));
            }
          }
        )
        .then(res => {
          console.log(res.data);
          // 200成功
          if (res.data.code === 200) {
            if (callback) {
              callback(null, {
                name: file.name, //文件名
                url: res.data.fileinfo.url || "", //链接
                duration: this.audioDuration //时长 音/视频
              });
            }
          } else {
            // 其它全部失败
            this.$emit("uploadError", res.data);
            callback("文件 " + file.name + " 上传失败：" + res.data.msg);
          }
        })
        .catch(err => {
          console.error(err);
          this.$emit("uploadError", err);
          callback("文件 " + file.name + " 上传失败：" + err.data.msg);
        });
    },

    // 本地上传
    LocalUpload(file, callback, SignParam) {
      const fd = new FormData();
      fd.append("name", file.name);
      fd.append("apikey", SignParam.apikey);
      fd.append("file", file);
      axios
        .post(UploadFileByLocalCtl, fd, {
          headers,
          withCredentials: true
        })
        .then(res => {
          if (res.data.Code === AJAX_SUCCESS) {
            if (callback) {
              callback(null, {
                name: file.name, //文件名
                url: res.data.Data, //链接
                duration: this.audioDuration //时长 音/视频
              });
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.$emit("uploadError", err);
          callback("文件 " + file.name + " 上传失败：" + err);
        });
    },

    // 获取时长 只支持普通音频和.mp4
    getTimes(file) {
      let content = file;
      let url = URL.createObjectURL(content);
      //经测试，发现audio也可获取视频的时长
      let audioElement = new Audio(url);
      audioElement.addEventListener("loadedmetadata", () => {
        this.audioDuration = parseInt(audioElement.duration);
        console.log(this.audioDuration);
      });
    },

    /* DES ECB模式加密 */
    des_encrypt(str) {
      let keyHex = CryptoJS.enc.Utf8.parse(crypt_key);
      let encrypted = CryptoJS.DES.encrypt(str, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      let base64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
      return base64;
    },

    /* DES ECB模式解密 */
    des_decrypt(base64_str) {
      let ciphertext = CryptoJS.enc.Base64.parse(base64_str);
      let keyHex = CryptoJS.enc.Utf8.parse(crypt_key);
      let decrypted = CryptoJS.DES.decrypt(
        {
          ciphertext: ciphertext
        },
        keyHex,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      let result_value = decrypted.toString(CryptoJS.enc.Utf8);
      return result_value;
    },

    // 获取MTDF猫态文件集成上传签名，根据返回参数调用对应的上传方法
    getUploadSignMTDF(file, callback) {
        this.$http.PcCommon
        .GetTencentOssSignCtl()
        .then(res => {
            console.log(res);
            this.TCUpload(file, callback, res);
            // let SignParam = res.data.Data.SignParam;
            // console.log(SignParam);
            // if (SignParam) {
            //   console.log(res.data.Data.Type);
            //   switch (res.data.Data.Type) {
            //     case UPLOAD_TYPE.Default: //普通上传（暂时保留）
            //       this.simpleUpload(file, callback);
            //       break;
            //     case UPLOAD_TYPE.Tencent: //腾讯云上传
            //       this.TCUpload(file, callback, SignParam);
            //       break;
            //     case UPLOAD_TYPE.Ali: //阿里云上传
            //       this.AliUpload(file, callback, SignParam);
            //       break;
            //     case UPLOAD_TYPE.MtDFS: //猫态文件上传
            //       this.MtDFSUpload(file, callback, SignParam);
            //       break;
            //     case UPLOAD_TYPE.Local: //服务器文件上传
            //       this.LocalUpload(file, callback, SignParam);
            //       break;
            //     default:
            //       break;
            //   }
            // }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: "获取上传凭证失败"
          });
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
