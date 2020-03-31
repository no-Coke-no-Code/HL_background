<template>
  <div class="menu" :class="opened ? '' : 'menu-closed'">
    <div class="menu-wrapper " :class="opened ? '' : 'menu-closed'">
      <div class="wrapper-inner">
        <h2 class="menu-title">{{ Title }}</h2>
        <div class="menu-list">
          <menu-item :menus="Menus"></menu-item>
        </div>
      </div>
    </div>

    <div
      class="open-btn "
      :class="opened ? 'opened' : 'closed'"
      @click="changeOpen"
    >
      <span
        class="icon mtFont "
        :class="opened ? 'mtui-icon-shouqi_L' : 'mtui-icon-shouqi_R'"
      ></span>
    </div>
  </div>
</template>

<script>
import menuItem from "./menuItem.vue";
import { mapState } from "vuex";
export default {
  // name: 'mt-menu',
  props: {
    title: {
      type: String
    },
    menus: {
      type: Array,
      defalult() {
        return [];
      }
    }
  },
  data() {
    return {
      Menus: null,
      // opened: true, //菜单默认打开
      Title: "",
      inited: false
    };
  },
  watch: {
    menus(val) {
      this.onMenusWatch(val);
    }
  },
  created() {
    this.onMenusWatch(this.menus);
    // 获取title: 当前title->下级title->默认title
    this.Title =
      this.$route.meta.title ||
      (this.$route.matched[0] && this.$route.matched[0].meta.title) ||
      this.title;
  },

  mounted() {
    console.log("opened", this.opened);
    let _this = this;
    //由于菜单栏的打开或者关闭只能通过修改store状态来触发，所以对于不同的vue实例，可定义一个全局的对象来实现订阅事件
    app.bus.$on("barChange", () => {
      console.log("barChange");
      _this.$store.dispatch("menu/openMenu");
    });
  },
  computed: {
    ...mapState({
      opened: state => state.menu.menuSlider.opened
    })
  },
  components: {
    menuItem
  },
  methods: {
    //
    onMenusWatch(val) {
      if (val && val.length > 0) {
        this.Menus = JSON.parse(JSON.stringify(val));
        if (!this.inited) {
          this.Menus = this.Maps(this.Menus);
          this.inited = true;
        }
      } else {
        this.Menus = [];
      }
    },
    Maps(arr) {
      console.log("初始化id", arr);
      arr.forEach((item, i) => {
        item.id = item.Id.split("-")[0]; // 取每个Id的头一组数值
        // item.isOpen = false; //是否打开下级
        if (item.ChildNode.length > 0) {
          //循环遍历下级
          this.Maps(item.ChildNode);
        }
      });
      return arr;
    },
    changeOpen() {
      this.$store.dispatch("menu/toggleMenu");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~@/assets/styles/common.scss";
.menu-closed {
  width: 0 !important;
}
.menu {
  width: #{$sideBarWidth};
  position: relative;
  flex-shrink: 0;
  transition: width 0.3s linear;
}
.menu-wrapper {
  width: #{$sideBarWidth};
  height: 100%;
  color: #333333;
  background: #eeeeee;
  transition: width 0.3s linear;
  overflow: hidden;

  .wrapper-inner {
    width: #{$sideBarWidth};
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar-track-piece,
    &::-webkit-scrollbar-thumb {
      background-color: transparent;
      transition: all 0.9s linear;
    }

    &:hover {
      &::-webkit-scrollbar-track-piece,
      &::-webkit-scrollbar-thumb {
        background-color: #dddddd;
      }
    }
  }

  .menu-title {
    position: absolute;
    z-index: 4;
    width: #{$sideBarWidth};
    line-height: 37px;
    font-size: 14px;
    font-weight: bold;
    background: #e4f1ff;
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
    padding: 0 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .menu-list {
    padding-top: 37px;
  }
}

.open-btn {
  position: absolute;
  top: 50%;
  z-index: 8;
  width: 20px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background: #eeeeee;
  box-shadow: -5px 0px 10px #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s linear;

  &:hover {
    background: #e5e5e5;
  }
}

.opened {
  transform: translate($sideBarWidth - 10, -50%);
}

.closed {
  transform: translate(-10px, -50%);
  &:hover {
    width: 28px;
    font-size: 16px;
  }
}
</style>
