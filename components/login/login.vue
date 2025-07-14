<template>
  <view v-if="show" class="login-popup-mask">
    <view class="login-popup-box">
      <image src="/static/logo.png" mode="widthFix" class="login-popup-logo" />
      <view class="login-popup-title">请先登录</view>
      <button 
        open-type="getUserInfo" 
        @getuserinfo="handleGetUserInfo"
        class="login-popup-btn"
      >
        微信一键登录
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LoginPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasLogin: false,
      userInfo: {}
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.checkLogin();
      }
    }
  },
  methods: {
    // 检查登录状态
    checkLogin() {
      const token = uni.getStorageSync('token')
      if (token) {
        this.hasLogin = true
        this.userInfo = uni.getStorageSync('userInfo') || {}
        // 已登录直接通知父组件
        this.$emit('success', this.userInfo)
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
          url: 'http://192.168.241.56:5000/api/auth/login',
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
          // 通知父组件登录成功
          this.$emit('success', this.userInfo)
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
.login-popup-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-popup-box {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.15);
  min-width: 500rpx;
}
.login-popup-logo {
  width: 100rpx;
  margin-bottom: 30rpx;
}
.login-popup-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 40rpx;
  font-weight: bold;
}
.login-popup-btn {
  background-color: #07C160;
  color: white;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  font-size: 32rpx;
}
</style>