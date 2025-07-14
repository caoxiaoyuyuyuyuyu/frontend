<template>
  <view class="login-page">
    <button 
      v-if="!hasLogin"
      open-type="getUserInfo" 
      @getuserinfo="handleGetUserInfo"
      class="login-btn"
    >
      <image src="/static/logo.png" mode="widthFix" />
      微信一键登录
    </button>
    <view v-else class="welcome">
      欢迎回来，{{userInfo.nickname}}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      hasLogin: false,
      userInfo: {}
    }
  },
  onLoad() {
    this.checkLogin()
  },
  methods: {
    // 检查登录状态
    checkLogin() {
      const token = uni.getStorageSync('token')
      if (token) {
        this.hasLogin = true
        this.userInfo = uni.getStorageSync('userInfo') || {}
      }
    },
    
    // 获取用户信息
    async handleGetUserInfo(e) {
      const userInfo = e.detail.userInfo
      if (!userInfo) {
        uni.showToast({ title: '您拒绝了授权', icon: 'none' })
        return
      }

      uni.showLoading({ title: '登录中...' })
      
      try {
        // 获取code
        const loginRes = await uni.login({
          provider: 'weixin'
        })
        
        // 发送到后端
        const res = await uni.request({
          url: 'http://localhost:5000/api/auth/login',
          method: 'POST',
          data: {
            code: loginRes.code,
            userInfo: userInfo
          }
        })
        
        if (res.data.code === 200) {
          // 存储token和用户信息
          uni.setStorageSync('token', res.data.data.token)
          uni.setStorageSync('userInfo', res.data.data.userInfo)
          
          this.hasLogin = true
          this.userInfo = res.data.data.userInfo
          
          uni.hideLoading()
          uni.showToast({ title: '登录成功' })
          
          // 跳转到首页或返回上一页
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/index/index' })
          }, 1500)
        } else {
          uni.hideLoading()
          uni.showToast({ title: res.data.message || '登录失败', icon: 'none' })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '网络错误，请重试', icon: 'none' })
        console.error('登录错误:', error)
      }
    }
  }
}
</script>

<style>
.login-page {
  padding: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #07C160;
  color: white;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
}

.login-btn image {
  width: 40rpx;
  margin-right: 15rpx;
}

.welcome {
  font-size: 32rpx;
  color: #333;
}
</style>