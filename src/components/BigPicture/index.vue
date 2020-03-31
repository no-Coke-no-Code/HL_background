<template>
  <div>
    <transition name="fade">
      <div class="bigPicture fixed_full" v-if="visible">
        <div class="bigPicture-mask fixed_full" @click="hideBigPicture"></div>
        <div class="bigPicture-img flex flex-center" v-if="images.length" @click="hideBigPicture">
          <template v-for="(item, index) in images">
            <img
              @click.stop
              @mousewheel="mousewheelFun"
              @DOMMouseScroll="mousewheelFun"
              v-if="index === currentIndex"
              :key="index"
              :style="{transform: 'scale(' + imagesScale + ') rotate(' + imagesRotate + 'deg)'}"
              :src="item"
              alt
            >
          </template>
        </div>
        <div class="bigPicture-img flex flex-center" @click="hideBigPicture" v-else>
          <p @click.stop class="tips">没有图片</p>
        </div>
        <div
          class="bigPicture-number flex space-around align-center"
          v-if="showNum"
        >{{currentIndex+1}}/{{images.length}}</div>
        <div class="bigPicture-action flex space-around align-center">
          <div class="bigPicture-action_item pointer" @click="tabPicture(-1)">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div
            class="bigPicture-action_item pointer"
            :class="parseFloat(imagesScale.toFixed(2)) <= minScale ? 'disabled' : ''"
            @click="pictureScaleFun(-1)"
          >
            <i class="el-icon-minus"></i>
          </div>
          <div class="bigPicture-action_item pointer" @click="pictureRotateFun">
            <i class="el-icon-refresh"></i>
          </div>
          <div
            class="bigPicture-action_item pointer"
            :class="parseFloat(imagesScale.toFixed(2)) >= maxScale ? 'disabled' : ''"
            @click="pictureScaleFun(1)"
          >
            <i class="el-icon-plus"></i>
          </div>
          <div class="bigPicture-action_item pointer" @click="tabPicture(1)">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dev: process.env.NODE_ENV === "development",
      imagesScale:0.6,
      imagesRotate: 0,
      currentIndex: this.imagesIndex
    };
  },
  props: {
    images: {
      type: Array,
      default: function() {
        return [];
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    imagesIndex: {
      type: [String, Number],
      default: 0
    },
    // 是否显示张数
    showNum: {
      type: Boolean,
      default: true
    },
    maxScale: {
      type: [String, Number],
      default: 1.8
    },
    minScale: {
      type: [String, Number],
      default: 0.6
    }
  },
  watch: {
    imagesIndex(value) {
      this.currentIndex = value;
    }
  },

  methods: {
    //图片选择放大
    pictureScaleFun: function(type) {
      var step = 0.2 * type;

      var imagesScale = this.imagesScale + step;

      if (imagesScale <= this.maxScale && imagesScale >= this.minScale)
        this.imagesScale = imagesScale;
    },
    //图片旋转
    pictureRotateFun: function() {
      var step = 90;
      this.imagesRotate += step;
    },
    // 切换图片
    tabPicture: function(type) {
      this.imagesScale =0.6;
      this.imagesRotate = 0;
      var len = this.images.length;
      var imagesIndex = this.currentIndex + type;

      if (imagesIndex < 0) this.currentIndex = len - 1;
      else if (imagesIndex >= len) this.currentIndex = 0;
      else this.currentIndex = imagesIndex;
    },
    //展示大图
    showBigPicture: function(i, index, detailIndex) {
      this.currentIndex = i;
      this.listIndex = index;
      this.detailPictureIndex = detailIndex;

      this.visible = true;
    },
    // 鼠标滚轮放大/缩小
    mousewheelFun(e) {
      var step = 0;
      if (e.wheelDelta > 0 || e.detail > 0) {
        step = 0.2 * 1;
      } else {
        step = 0.2 * -1;
      }
      var imagesScale = this.imagesScale + step;
      if (imagesScale <= this.maxScale && imagesScale >= this.minScale)
        this.imagesScale = imagesScale;
    },
    //隐藏大图
    hideBigPicture: function() {
      this.$emit("update:visible", false);
      this.imagesScale =0.6;
      this.imagesRotate = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
/* 图片放大 */
.fixed_full {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.bigPicture {
  z-index: 11;
}
.bigPicture-mask {
  background-color: rgba(0, 0, 0, 0.4);
}
.bigPicture-img {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 80%;
    height: 80%;
    transition: all 0.3s;
  }
}
.bigPicture-number {
  position: fixed;
  width: 400px;
  height: 60px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 80px;
  color: #fff;
  font-size: 18px;
}
.bigPicture-action {
  position: fixed;
  width: 400px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  .bigPicture-action_item {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    background-color: rgba(0, 0, 0, 0.4);
    line-height: 40px;
    text-align: center;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    i {
      font-size: 18px;
      line-height: 40px;
      font-weight: bold;
    }
  }
}

.disabled {
  color: #5d5d5d !important;
  &:hover {
    background-color: rgba(0, 0, 0, 0.4) !important;
  }
}

</style>
