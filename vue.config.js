module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',
  devServer: {
    open: true, // 设置自动打开
    port: 8080, // 设置端口
    proxy: {
      // 设置代理
      '/api': {
        target: 'https://www.liulongbin.top:8888',
        changeOrigin: true,
        secure: false, // 如果是http接口，需要配置该参数
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
