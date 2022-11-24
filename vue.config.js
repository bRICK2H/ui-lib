const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/globally/mixins.scss";
          @import "@/assets/styles/globally/variables.scss";
          @import "@/assets/styles/globally/functions.scss";
        `,
      },
    },
  },
})
