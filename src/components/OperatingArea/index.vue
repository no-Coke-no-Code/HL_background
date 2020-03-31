<template>
  <div class="container flex space-between">
    <div>
      <slot></slot>
    </div>
    <div class="oper_right">
      <el-tooltip
        placement="bottom"
        effect="dark"
        v-for="(item,index) in showBtnList"
        :key="index"
        :content="item | filterTooltip"
      >
        <el-button :type="item | filterType" :icon="item | filterIcon" @click="btnClick(item)"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
const defaultList = ["delete", "export", "setting"];
const defaultListAttr = {
  type: {
    [defaultList[0]]: "danger",
    [defaultList[1]]: "primary",
    [defaultList[2]]: "default"
  },
  icon: {
    [defaultList[0]]: "el-icon-delete",
    [defaultList[1]]: "el-icon-upload2",
    [defaultList[2]]: "el-icon-setting"
  },
  tooltip: {
    [defaultList[0]]: "删除",
    [defaultList[1]]: "导出",
    [defaultList[2]]: "设置"
  }
};
export default {
  props: {
    showBtn: {
      type: String,
      default() {
        return defaultList.join(",");
      }
    }
  },
  data() {
    return {
      list: defaultList
    };
  },
  computed: {
    showBtnList() {
      let arr = [],
        tempArr = [],
        str = this.showBtn;
      tempArr = str.replace(/ /g, "").split(",");
      tempArr.forEach(i => {
        this.list.forEach(l => {
          if (i == l) {
            arr.push(i);
          }
        });
      });
      return arr;
    }
  },
  methods: {
    btnClick(type) {
      this.$emit("on-click", type);
    }
  },
  filters: {
    filterType(val) {
      return defaultListAttr.type[val] || "default";
    },
    filterIcon(val) {
      return defaultListAttr.icon[val] || "el-icon-loading";
    },
    filterTooltip(val) {
      return defaultListAttr.tooltip[val] || "Hi";
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 10px 0;
}
.oper_right {
  i {
    font-size: 14px !important;
  }
}
</style>


