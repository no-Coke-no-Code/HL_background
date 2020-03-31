<template>
  <el-table-column
    :align="col.align"
    :prop="col.prop"
    :label="col.label"
    :width="col.width || ''"
    :min-width="col.minWidth  || ''"
  >
    <template v-slot="scope" v-if="useSlot">
      <slot :row="scope.row" :index="scope.$index"></slot>
    </template>

    <template v-slot="scope" v-else>
      <slot :row="scope.row" :index="scope.$index">
        <img
          class="img"
          :class="imgCls"
          :style="imgSty"
          :src="scope.row.TemplatePath"
          :alt="scope.row.BrandName"
          @click="bigPictureClick(scope.row)"
        >
      </slot>
    </template>
  </el-table-column>
</template>
<script>
export default {
  props: {
    col: Object,
    useSlot: Boolean,
    imgCls: String,
    imgSty: String,
    imgkey: {
      type: String,
      default: ""
    }
  },
  methods: {
    bigPictureClick(row) {
      this.$emit("on-preview", row);
    }
  }
};
</script>
<style lang="scss" scoped>
.img {
  width: 80%;
  height: 80%;
  cursor: pointer;
}
</style>
