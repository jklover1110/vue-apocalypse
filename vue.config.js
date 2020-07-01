const { resolve } = require('path');

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        title: 'Vue.js 启示录',
        favicon: resolve(__dirname, 'public/favicon.png'),
      };

      return args;
    }),
      config.devServer
        .hot(!0)
        .port(9652)
        .open(!0);
  },
};
