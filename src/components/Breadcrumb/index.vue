<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{
          item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
    // 设置面包屑的第一项
    //   const first = matched[0]
    //   if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
        //     matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
    //   }
      console.log(this.$route.matched)

      this.levelList = this.$route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
        console.log(item)
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color:#333333;
    cursor: text;
  }
  /deep/.el-breadcrumb__item .el-breadcrumb__inner,/deep/.el-breadcrumb__item .el-breadcrumb__inner a{
      color:#999999;
      font-weight: normal;
  }
  /deep/.el-breadcrumb__item .el-breadcrumb__inner a:hover{
      color:#409EFF;
  }
  /deep/.el-breadcrumb__item:last-child .el-breadcrumb__inner{
      color:#333333;
  }
}
</style>
