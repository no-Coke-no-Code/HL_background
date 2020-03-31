<template>
  <el-table-column
    :align="col.align"
    :prop="col.prop"
    :label="col.label"
    :width="col.width || ''"
    :fixed="col.fixed"
    :min-width="col.minWidth || '' "
  >
    <template v-slot="scope" v-if="useSlot">
      <slot :row="scope.row" :index="scope.$index"></slot>
    </template>
  </el-table-column>
</template>
<script>
export default {
  props: {
    col: Object,
    useSlot: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
  },
  methods: {
    bigPictureClick(row) {
      this.$emit("bigPictureClick", row);
    }
  }
};
</script>
<style lang="scss" scoped>
.temp_img {
  width: 80px;
  height: 90px;
  cursor: pointer;
}
</style>
