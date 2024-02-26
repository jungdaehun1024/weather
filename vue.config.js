const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  //multi-word-component-names에러 해결
  lintOnSave: false
})
