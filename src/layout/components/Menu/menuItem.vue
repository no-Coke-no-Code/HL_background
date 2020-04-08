<template lang="html">
  <div class="">
    <div
      class="list-item "
      :class="[
        'list-level' + level,
        isOpen || level == 1 ? 'list-open' : 'list-close',
        menuId == one.id ? 'menu-act' : ''
      ]"
      :style="{ textIndent: 30 + 10 * (level - 1) + 'px' }"
      v-for="(one, index1) in Menus"
      :key="index1"
    >
      <div class="list-div" @click="openList(index1)">
        <template v-if="one.ChildNode.length">
          <i
            class="list-icon el-icon-caret-bottom"
            v-if="one.ChildNode.length"
            :class="one.opened ? 'arrow-open' : 'arrow-close'"
            :style="{ left: 15 + 10 * (level - 1) + 'px' }"
          ></i>
          <span
            ><span class="icon mtFont" :class="one.Icon"></span>&nbsp;&nbsp;{{
              one.MenuName
            }}</span
          >
        </template>
        <div
          v-if="!one.ChildNode || one.ChildNode.length <= 0"
          class="router"
          @click="goRouter(one)"
        >
          <i
            class="list-icon el-icon-caret-bottom"
            v-if="one.ChildNode.length"
            :class="one.opened ? 'arrow-open' : 'arrow-close'"
            :style="{ left: 15 + 10 * (level - 1) + 'px' }"
          ></i>
          <span
            ><span class="icon mtFont" :class="one.Icon"></span>&nbsp;&nbsp;{{
              one.MenuName
            }}</span
          >
        </div>
      </div>
      <!-- 下级菜单 -->
      <menu-item
        v-if="one.ChildNode"
        :menus="one.ChildNode"
        :level="level + 1"
        :open="one.opened"
        :prevId="one.idList"
      ></menu-item>
    </div>
  </div>
</template>

<script>
import { A_TARGET } from "@/utils/constant";
export default {
  name: "menu-item",
  props: {
    menus: {
      type: Array,
      defalult() {
        return [];
      }
    },
    level: {
      type: Number,
      default: 1
    },
    open: {
      type: Boolean,
      default: false
    },
    prevId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      Menus: [],
      opened: false, //控制下层的开关
      menuId: -1
    };
  },
  computed: {
    isOpen() {
      //控制本层的开关
      return this.open;
    }
  },
  watch: {
    menus(val) {
      if (val) {
        this.getMenus(JSON.parse(JSON.stringify(val)));
        this.setOpen();
      } else {
        this.getMenus();
      }
    },
    $route(to, from) {
      this.setOpen();
    }
  },
  created() {
    this.getMenus(this.menus);
    this.setOpen();
    //监听浏览器前进后退
    window.addEventListener("hashchange", e => {
      this.setOpen();
    });
  },
  mounted() {
    //监听菜单点击高亮事件，如果高亮的菜单项不是当前的，去掉高亮
    this.bus.$on("menu-act", id => {
      if (id != this.menuId) {
        this.menuId = -1;
      }
    });
  },
  methods: {
    // 路由跳转方式配置
    goRouter(menu) {
      var heaf = menu.Url;
      if (typeof menu.query === "object") {
        var queryArr = [];
        for (let key in menu.query) {
          queryArr.push(`${key}=${encodeURIComponent(menu.query[key])}`);
        }
        heaf = heaf + `?${queryArr.join("&")}`;
      }
      switch (menu.Target) {
        case A_TARGET.E: // "无页面";
          this.$router.push({ path: menu.Url, query: menu.query });
          break;
        case A_TARGET.FL: // "强制加载"
          location.href = heaf;
          break;
        case A_TARGET.IF: // "框架页";
          // 跳转到 webView 页面
          this.$router.push({ path: menu.Url, query: menu.query });
          break;
        case A_TARGET.O: // 待修改
          console.log("弹出页");
          this.$router.push({ path: menu.Url, query: menu.query });
          break;
        case A_TARGET.NEW:
          window.open(heaf);
          break;
      }
    },
    getMenus(menus) {
      if (menus) {
        menus.forEach((item, i) => {
          item.opened = false;
          item.idList = this.prevId
            ? this.prevId + "-" + item.id
            : item.id + "";
          if (item.query) {
            item.query.menuIdList = item.idList;
          } else {
            item.query = {
              menuIdList: item.idList
            };
          }
        });
        this.Menus = menus;
      } else {
        this.Menus = [];
      }
      // console.log("菜单列表", this.Menus);
    },
    openList(i) {
      if (this.Menus[i].ChildNode && this.Menus[i].ChildNode.length) {
        // 有下级，打开或者关闭
        this.$set(this.Menus[i], "opened", !this.Menus[i].opened);
      } else {
        // 没有下级，当前选中高亮
        this.menuId = this.Menus[i].id;
        this.bus.$emit("menu-act", this.Menus[i].id); //去掉其他菜单项的高亮显示
      }
    },
    setOpen() {
      // ---------------------
      // 获取链接的menuIdList,通过menuIdList找到当前所在的菜单项
      // menuIdList的格式类似 bbb-ccc-ddd ,每一个分组都是截取Id的第一组(xxx-xxx-xxx)
      let idList = this.$route.query && this.$route.query.menuIdList;
      if (!idList) {
        // 如果url上面没有idList，则通过菜单的url和 location.pathname进行判断
        this.menuId = -1;
        var pathname = window.location.pathname
          .replace(/\//g, "")
          .toLocaleLowerCase();
        Array.isArray(this.Menus) &&
          this.Menus.forEach(menu => {
            if (
              typeof menu.Url === "string" &&
              menu.Url.replace(/\//g, "").toLocaleLowerCase() === pathname
            ) {
              this.menuId = menu.id;
            }
          });
        return;
      }
      let idArray = idList.split("-");
      if (!idArray) idArray.push(idList);
      this.opened = false;
      this.Menus &&
        this.Menus.forEach((item, i) => {
          if (
            idArray.includes(item.id + "") &&
            idArray[idArray.length - 1] != item.id + ""
          ) {
            item.opened = true;
          } else if (idArray[idArray.length - 1] == item.id + "") {
            this.menuId = item.id;
            this.bus.$emit("menu-act", item.id); //去掉其他菜单项的高亮显示
          }
        });
      // ------------------------
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common.scss";
.list-item {
  width: 100%;
  height: 40px;
  // line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  .router {
    display: block;
    width: 100%;
    height: 100%;
    user-select: none;
    cursor: pointer;
  }

  .list-div {
    position: relative;
    cursor: pointer;
    line-height: 40px;
    padding: 0px 5px;
  }

  .list-icon {
    position: absolute;
    top: 30%;
    font-size: 15px;
    text-indent: 0;
  }

  .arrow-close {
    transform: rotate(-90deg);
  }

  .arrow-open {
    transform: rotate(0deg);
  }

  a {
    color: inherit;
  }
}

// .list-one {
//   text-indent: 30px;
//
//   .list-icon {
//     left: 15px;
//   }
// }
//
// .list-two {
//   text-indent: 40px;
//   overflow: hidden;
//   transition: height 0.3s linear;
//
//   .list-icon {
//     left: 25px;
//   }
// }

.list-close {
  height: 0;
}

.list-open {
  height: auto;
}

.menu-act {
  background: #fff !important;
}
</style>
