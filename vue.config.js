module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',
  devServer: {
    open: true, // 设置自动打开
    port: 8080, // 设置端口
    proxy: {
      // 设置反向代理
      // 当webpack的express服务器发现请求的路径是某一个路径时，
      // 就会使用target里的规则来代理请求
      '/api':{
        target:'https://www.liulongbin.top:8888',
        changeOrigin:true,
        secure:false,
        pathRewrite:{
           '^/api': '/'
        }
      }

      // '/baidu': {
      //   target:`http://baidu.com`,
      //   changeOrigin: true,
      //   secure: false, // 如果是http接口，需要配置该参数
      //   pathRewrite: {
      //     '^/baidu':'/'
      //   }
      // }
    }
  }
}
