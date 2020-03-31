const modulesFiles = require.context("./", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  if (moduleName !== "index") {
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
  }
  return modules;
}, {});

export default modules;
