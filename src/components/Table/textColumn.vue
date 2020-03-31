<template>
  <el-table-column
    v-if="col.cellType === 'boolean'"
    :align="col.align"
    :prop="col.prop"
    :label="col.label"
    :width="col.width || ''"
    :min-width="col.minWidth || '' "
    :show-overflow-tooltip="col.showTip || false"
  >
    <template v-slot="scope">
      <p>{{scope.row[col.prop]? '补号':'不补号'}}</p>
    </template>
  </el-table-column>
  <el-table-column
    v-else
    :align="col.align"
    :prop="col.prop"
    :label="col.label"
    :width="col.width || ''"
    :min-width="col.minWidth || '' "
    :show-overflow-tooltip="col.showTip || false"
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
    useSlot: Boolean
  }
};
</script>
<style lang="scss" scoped>
</style>
