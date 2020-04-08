// vue.config.js
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "Static/HLbackground",
  configureWebpack: {
    externals: {
      'vue': "Vue",
      "element-ui": "ELEMENT"
    }
  },
  chainWebpack: config => {
    // 插件配置
    if (process.env.NODE_ENV === "production") {
      // 生产环境
      // 修改打包的模板
      config.plugin("html").tap(args => {
        args[0].template = "./public/index_cs.html"; // 生产环境打包时使用 cshtml 模板
        args[0].filename = "Views/Admin/HLbackground.cshtml"; // 生成符合后台框架的入口文件
        // args[0].inject = "head"; // script 标签在代码中的 head 上
        return args;
      });
    }
  },
  lintOnSave: undefined,
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      "/api/": {
        // 测试环境
        // target:`http://192.168.3.130:5060/`,

        // 义年IP
        taget:`http://192.168.3.212/`,

        // 正式环境
        // target:'https://sales.huiletoys.cn/',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          "^/api/": "/api/"
        }
      },
    }
  }
};
