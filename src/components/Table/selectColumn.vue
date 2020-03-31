<template>
  <el-table-column :align="col.align" :type="col.type" :width="col.width">
    <template v-slot="scope" v-if="useSlot">
      <slot :row="scope.row" :index="scope.$index"></slot>
    </template>
  </el-table-column>
</template>
<script>
export default {
  props: {
    col: Object,
    useSlot: Boolean
  }
};
</script>
<style lang="scss" scoped>
</style>
