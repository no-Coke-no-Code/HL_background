<template>
  <div class="pagination flex space-between align-center">
    <div>
      <slot></slot>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "pagination",
  props: {
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    total: {
      type: Number,
      default: 1000
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default() {
        return [100, 200, 300, 400];
      }
    }
  },
  computed: {
    pageSize() {
      return this.pageSizes[0] || 100;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("size-change", val);
    },
    handleCurrentChange(val) {
      this.$emit("current-change", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination {
  background: #fff;
  height: 50px;
  padding: 0 20 px;
  box-shadow: -1px -2px 4px 0px rgba(0, 0, 0, 0.1);
}
</style>
