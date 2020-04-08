<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile'"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 侧边栏 star -->
    <mt-menu title="用户管理系统" :menus="menus"> </mt-menu>
    <!-- 侧边栏 end -->
    <!-- 主窗口 star -->
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div>
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
    <!-- 主窗口 end -->
  </div>
</template>

<script>
import { AppMain, TagsView, mtMenu } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
/**
 * 对比两个字符串，去除字符串中指定的字符再链接起来进行对比
 * @param {String} OStr 用于对比的字符串1
 * @param {String} TStr 用于对比的字符串2
 * @param {String} replaceChar 需要剔除的字符串
 * @returns {Boolean}
 */
function contrastString(url, pathname) {
  if (typeof url !== "string" || typeof pathname !== "string") return false;
  // 如果pathname最后一个字符不是一个 '/' 则默认添加斜杠
  var len = pathname.length;
  if (pathname[len - 1] !== "/") {
    pathname = pathname + "/";
  }
  // 判断 url 是否存在与 pathname 中
  return pathname.toLocaleLowerCase().includes(url.toLocaleLowerCase());
}
export default {
  name: "Layout",
  components: {
    AppMain,
    TagsView,
    mtMenu
  },
  mixins: [ResizeMixin],
  data() {
    return {
      menus: [],
      needTagsView: true
    };
  },
  created() {
    // 监听事件：GetMenuTreeByUser，接口外面模板获取的菜单
    // this.bus.$on("GetMenuTreeByUser", menus => {
    //   var menusItem = {};
    //   menus.forEach(val => {
    //     // 此处对比必须除去多余的 / 符号才可以匹配
    //     if (!!val.Url && contrastString(val.Url, location.pathname)) {
    //       menusItem = val;
    //     }
    //   });
    //   console.log("menusItem", menusItem);
    //   if (menusItem.ChildNode && menusItem.ChildNode.length) {
    //     this.menus = menusItem.ChildNode;
    //   }
    // });
    this.getMenuGetMenuTreeByUser();
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    }),
    classObj() {
      return {
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    getMenuGetMenuTreeByUser() {
      this.$http.MCatSysMenu.MenuGetMenuTreeByUser({})
        .then(res => {
          var menus = res.ChildNode || [];
          this.bus.$emit("GetMenuTreeByUser", menus);
          var menusItem = {};
          menus.forEach(val => {
            // 此处对比必须除去多余的 / 符号才可以匹配
            if (!!val.Url && contrastString(val.Url, location.pathname)) {
              menusItem = val;
            }
          });
          console.log("menusItem", menusItem);
          if (menusItem.ChildNode && menusItem.ChildNode.length) {
            this.menus = menusItem.ChildNode;
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    getHash: function() {
      var hash = window.location.hash;
      if (!hash) return;
      var hashArray = hash.split("/"); // 例如：/#/home，只需要拿到home即可
      return hashArray[1];
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: calc(100vh - 50px);
  width: 100%;
  overflow: hidden;
  display: flex;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
.main-container {
  flex-grow: 1;
  overflow-y: auto;
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
