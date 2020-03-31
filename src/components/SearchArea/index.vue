<template>
  <div class="relative" ref="searchBox">
    <el-collapse-transition>
      <div v-show="showSearch" class="flex flex-wrap">
        <slot></slot>
      </div>
    </el-collapse-transition>
    <transition name="fade">
      <!-- 自定义搜索 -->
      <div class="customize absolute" v-show="showSearch">
        <el-button plain @click="dialogVisible = true">
          <i class="el-icon-edit theme-text-color"></i> 自定义搜索
        </el-button>
      </div>
    </transition>
    <!-- 收缩 -->
    <div class="shrink flex align-center flex-center border-b">
      <span class="pointer" @click="shrinkClick">
        {{showSearch ? '收缩' : '展开'}}
        <i
          class="el-icon-d-arrow-right theme-text-color"
          :style="shrinkSty"
        ></i>
      </span>
    </div>

    <!-- 自定义查询条件弹窗 -->
    <el-dialog
      width="500px"
      title="自定义查询条件"
      :visible.sync="dialogVisible"
      :lock-scroll="true"
      :append-to-body="true"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      @close="dialogClose"
      @open="dialogOpen"
    >
      <div class="main">
        <div class="body">
          <div class="reset">
            <el-button type="text" @click="resetSearchItem">重 置</el-button>
          </div>
          <div>
            <draggable v-model="SearchOptionsArray" class="checkbox_box">
              <div class="checkbox_item" v-for="(value, index) in SearchOptionsArray" :key="index">
                <el-checkbox
                  :label="value.label"
                  name="type"
                  v-model="value.isShow"
                  @change="checkboxChange($event,value,index)"
                ></el-checkbox>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSearch">取 消</el-button>
        <el-button type="primary" @click="submitSearchOptions">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable
  },
  props: {
    // 缓存key
    locKey: {
      type: String,
      default() {
        if (this.$router && this.$router.mode) {
          return "search_" + this.$route.path;
        } else {
          return "search_" + window.location.href.split("?")[0];
        }
      }
    },
    // 搜索选项
    SearchOptions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showSearch: true,
      dialogVisible: false,
      SearchOptionsArray: [],
      isClickedReset: false
    };
  },
  watch: {
    showSearch(n, o) {
      this.$nextTick(_ => {
        this.$emit("on-height");
      });
    }
  },
  computed: {
    shrinkSty() {
      return this.showSearch
        ? "transform: rotate(-90deg)"
        : "transform: rotate(90deg)";
    }
  },
  watch:{
    SearchOptions(val){ 
      this.SearchOptionsArray = val;
      // 给搜索加isShow和order
      this.SearchOptionsArray.forEach((item, index) => {
        this.$set(item, "isShow", true);
        this.$set(item, "order", index);
      });
    }
  },
  mounted() {
    this.getItemList(true);
  },
  methods: {
    // 收缩点击
    shrinkClick() {
      this.showSearch = !this.showSearch;
    },

    // 重置
    resetSearchItem() {
      window.localStorage.removeItem(this.locKey);
      this.isClickedReset = true;

      // 重新排序
      this.SearchOptionsArray = this.SearchOptionsArray.sort((a, b) => {
        return a.order - b.order;
      });
      // 设置为选中
      this.SearchOptionsArray.forEach(item => {
        item.isShow = true;
      });
    },

    // 单选按钮点击
    checkboxChange(val, item, index) {
      let arr = this.SearchOptionsArray.filter(item => item.isShow);
      if (arr.length <= 2) {
        this.$message({
          showClose: true,
          message: "最少有3个选中",
          type: "warning"
        });
        item.isShow = true;
      } else {
        item.isShow = val;
      }
    },

    // 取消弹窗
    closeSearch() {
      this.dialogVisible = false;
      if (this.isClickedReset) {
        window.localStorage.setItem(
          this.locKey,
          JSON.stringify(this.SearchOptionsArray)
        );
        this.isClickedReset = false;
      }
    },

    // 确认
    submitSearchOptions() {
      window.localStorage.setItem(
        this.locKey,
        JSON.stringify(this.SearchOptionsArray)
      );
      this.$emit("on-change", this.SearchOptionsArray);
      this.dialogVisible = false;
    },
    dialogClose() {
      if (this.isClickedReset) {
        window.localStorage.setItem(
          this.locKey,
          JSON.stringify(this.SearchOptionsArray)
        );
        this.isClickedReset = false;
      }
      this.$emit("dialogClose");
    },
    dialogOpen() {
      this.getItemList();
    },
    getItemList(code) {
      let searchOpts =
        (window.localStorage.getItem(this.locKey) &&
          JSON.parse(window.localStorage.getItem(this.locKey))) ||
        "";
      if (searchOpts) {
        this.SearchOptionsArray = searchOpts;
      } else {
        this.SearchOptionsArray = JSON.parse(
          JSON.stringify(this.SearchOptions)
        );
        // 给搜索加isShow和order
        this.SearchOptionsArray.forEach((item, index) => {
          this.$set(item, "isShow", true);
          this.$set(item, "order", index);
        });
      }
      if (code) {
        this.$emit("on-change", this.SearchOptionsArray);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.relative {
  padding-top: 10px;
}
.customize {
  right: 10px;
  bottom: 4px;
}

.shrink {
  height: 32px;
  font-size: 12px;
  color: rgba(74, 74, 74, 1);
  user-select: none;
  i {
    transition: 0.3s;
  }
}
.checkbox_box {
  .checkbox_item {
    display: inline-block;
    width: 50%;
  }
}
.body {
  display: flex;
  padding: 15px;
  background-color: #eeeeee;
  position: relative;
  .reset {
    position: absolute;
    right: 12px;
    top: 2px;
  }
  .el-checkbox {
    margin-left: 0;
    display: block;
    margin-top: 5px;
    margin-bottom: 5px;
    cursor: move;
  }
}
</style>

