<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    this.setupInterceptor()
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.reLaunch({ url: '/pages/login/login' })
        return false
      }

      // 可选：验证token有效性
      uni.request({
        url: 'http://localhost:5000/api/auth/check_login',
        method: 'GET',
        header: { 'Authorization': `Bearer ${token}` },
        success: (res) => {
          if (res.data.code === 401) {
            this.handleLogout()
          }
        },
        fail: () => {
          console.log('验证登录状态失败')
        }
      })
      
      return true
    },
    
    handleLogout() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      uni.reLaunch({ url: '/pages/login/login' })
    },
    
    setupInterceptor() {
      // 请求拦截器 - 添加token
      uni.addInterceptor('request', {
        invoke(args) {
          const token = uni.getStorageSync('token')
          if (token) {
            if (!args.header) args.header = {}
            args.header['Authorization'] = `Bearer ${token}`
          }
          return args
        },
        fail(err) {
          console.error('请求失败:', err)
        }
      })
      
      // 响应拦截器 - 处理401错误
      uni.addInterceptor('request', {
        success(args) {
          if (args.data && args.data.code === 401) {
            this.handleLogout()
          }
          return args
        }
      })
    }
  }
}
</script>
<style>
	/*每个页面公共css */
</style>
