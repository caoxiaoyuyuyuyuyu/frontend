<template>
  <view class="profile-container">
	<!-- 登录弹窗组件 -->
	<login v-if="showLoginPopup" :show="showLoginPopup" @success="onLoginSuccess" />
    <!-- 用户信息 -->
    <view class="profile-header">
      <view class="avatar-upload">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
      </view>
      <view class="user-info">
        <view class="user-row">
          <input class="nickname-input" v-model="userInfo.nickname" @blur="modifyNickname" />
        </view>
      </view>
    </view>

    <!-- 常用功能 -->
    <view class="profile-section">
      <view class="section-title">常用功能</view>
      <view class="feature-list">
        <view class="feature-item" v-for="item in features" :key="item.text" @click="onFeatureClick(item)">
          <image :src="item.icon" class="feature-icon" mode="aspectFit" />
          <text class="feature-text">{{ item.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
	  showLoginPopup: false,
	  hasLogin: false,
	  userInfo: {},
		features: [
		  { text: '识别记录', icon: '/static/scan2.png', url: '/pages/profile/record' },
		  { text: '识别帮助', icon: '/static/help.png', url: '/pages/profile/help' },
		  { text: '联系客服', icon: '/static/customer.png', url: '' },
		  { text: '退出登录', icon: '/static/door.png', url: '' },
		],
    }
  },
	onShow() {
		this.checkLogin();
	},
  methods: {
	// 检查登录状态
	checkLogin() {
		const token = uni.getStorageSync('token')
		if (token) {
			this.hasLogin = true
			this.userInfo = uni.getStorageSync('userInfo') || {}
			this.showLoginPopup = false
		} else {
			this.hasLogin = false
			this.showLoginPopup = true
		}
	},
	// 登录弹窗回调
	onLoginSuccess(userInfo) {
		this.hasLogin = true
		this.userInfo = userInfo
		this.showLoginPopup = false
	},
    onFeatureClick(item) {
	if (item.url) {
	  uni.navigateTo({ url: item.url });
	}
	else if(item.text === '联系客服') {
	  uni.showToast({ title: '请联系客服：123-456-7890', icon: 'none' });
	} 
	else if(item.text === '退出登录') {
		uni.removeStorageSync('userInfo')
		uni.removeStorageSync('token');
		uni.reLaunch({
			url:"/pages/index/index"
		})
	}
	else {
	  uni.showToast({ title: item.text, icon: 'none' });
	}
    },
  }
}
</script>

<style scoped>
.profile-container {
  background: #f8f9fb;
  min-height: 100vh;
  padding-bottom: 40rpx;
}
.profile-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 40rpx 30rpx 20rpx 30rpx;
  background: #fff;
  border-radius: 0 0 30rpx 30rpx;
  box-shadow: 0 2rpx 8rpx #eee;
}
.avatar-upload {
  position: relative;
  margin-right: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #f0f0f0;
}
.avatar-edit {
  font-size: 24rpx;
  color: #888;
  margin-top: 8rpx;
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.user-row {
  display: flex;
  align-items: center;
}
.nickname-input {
  font-size: 40rpx;
  font-weight: bold;
  margin-right: 16rpx;
  border: none;
  background: transparent;
  outline: none;
  width: 220rpx;
}
.arrow {
  font-size: 18rpx;
  margin-left: 4rpx;
}
.uid {
  font-size: 26rpx;
  color: #b0b0b0;
  margin: 8rpx 0 0 0;
}
.contribution-row {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}
.profile-section {
  background: #fff;
  margin: 30rpx 30rpx 0 30rpx;
  border-radius: 20rpx;
  padding: 24rpx 0 24rpx 0;
  box-shadow: 0 2rpx 8rpx #eee;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-left: 32rpx;
  margin-bottom: 18rpx;
}
.feature-list {
  display: flex;
  flex-direction: column;
}
.feature-item {
  display: flex;
  align-items: center;
  padding: 18rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}
.feature-item:last-child {
  border-bottom: none;
}
.feature-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 18rpx;
}
.feature-text {
  font-size: 30rpx;
}
</style>
