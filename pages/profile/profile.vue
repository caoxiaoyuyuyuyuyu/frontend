<template>
  <view class="profile-container">
    <!-- 用户信息 -->
    <view class="profile-header">
      <view class="avatar-upload" @click="chooseAvatar">
        <image class="avatar" :src="avatarUrl" mode="aspectFill" />
        <view class="avatar-edit">更换头像</view>
      </view>
      <view class="user-info">
        <view class="user-row">
          <input class="nickname-input" v-model="nickname" @blur="saveNickname" />
          <view class="level-tag">lv.1 <text class="arrow">▼</text></view>
        </view>
        <text class="uid">UID: MU196338</text>
        <view class="contribution-row">
          <text class="contribution-label">识别积分：</text>
          <text class="contribution-value clickable" @click="showPointInfo">0</text>
        </view>
      </view>
    </view>

    <!-- 识别次数和进度条 -->
    <view class="profile-progress">
      <view class="progress-row">
        <text>剩余识别次数：5次</text>
      </view>
      <view class="progress-bar-bg">
        <view class="progress-bar-fill" :style="{ width: '10%' }"></view>
      </view>
      <view class="progress-info">
        <text>lv1</text>
        <text class="progress-tip">还需50识别积分升级</text>
        <text>lv2</text>
        <view class="member-tag">普通会员</view>
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
      features: [
        { text: '识别记录', icon: '/static/logo.png', url: '/pages/profile/record' },
        { text: '害虫百科贡献', icon: '/static/logo.png', url: '/pages/profile/pestShare' },
        { text: '识别帮助', icon: '/static/logo.png', url: '/pages/profile/help' },
        { text: '联系客服', icon: '/static/logo.png', url: '' },
      ],
      avatarUrl: '/static/logo.png',
      nickname: '微信用户',
    }
  },
  methods: {
    onFeatureClick(item) {
      if (item.url) {
          uni.navigateTo({ url: item.url });
        }  else {
        if (item.text === '联系客服') {
          uni.showToast({ title: '请联系客服：123-456-7890', icon: 'none' });
        } else {
          uni.showToast({ title: item.text, icon: 'none' });
        }
      }
    },
    showPointInfo() {
      uni.showModal({
        title: '识别积分说明',
        content: '识别积分用于衡量用户在平台的活跃度和贡献度。积分可通过识别害虫、参与活动等方式获得，积分越高会员等级越高，可享受更多权益。',
        showCancel: false
      })
    },
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.avatarUrl = res.tempFilePaths[0]
        }
      })
    },
    saveNickname() {
      // 可在此处添加保存昵称到后端的逻辑
      uni.showToast({ title: '昵称已修改', icon: 'none' })
    }
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
  font-size: 20rpx;
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
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 16rpx;
  border: none;
  background: transparent;
  outline: none;
  width: 220rpx;
}
.level-tag {
  background: #e5d3b6;
  color: #7d5c1e;
  font-size: 22rpx;
  border-radius: 20rpx;
  padding: 2rpx 16rpx;
  margin-right: 8rpx;
  display: flex;
  align-items: center;
}
.arrow {
  font-size: 18rpx;
  margin-left: 4rpx;
}
.uid {
  font-size: 22rpx;
  color: #b0b0b0;
  margin: 8rpx 0 0 0;
}
.contribution-row {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}
.contribution-label {
  font-size: 22rpx;
  color: #b0b0b0;
}
.contribution-value {
  font-size: 24rpx;
  color: #e5d3b6;
  margin-left: 4rpx;
}
.contribution-value.clickable {
  text-decoration: underline;
  cursor: pointer;
}
.profile-progress {
  background: #2d2e3a;
  margin: 24rpx 30rpx 0 30rpx;
  border-radius: 20rpx;
  padding: 24rpx 24rpx 16rpx 24rpx;
  color: #fff;
  position: relative;
}
.progress-row {
  font-size: 26rpx;
  margin-bottom: 12rpx;
}
.progress-bar-bg {
  width: 100%;
  height: 12rpx;
  background: #44455a;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}
.progress-bar-fill {
  height: 100%;
  background: #e5d3b6;
  border-radius: 8rpx;
  width: 10%;
}
.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 22rpx;
  margin-top: 4rpx;
}
.progress-tip {
  flex: 1;
  text-align: center;
  color: #e5d3b6;
}
.member-tag {
  background: #e5d3b6;
  color: #7d5c1e;
  border-radius: 20rpx;
  padding: 2rpx 16rpx;
  font-size: 22rpx;
}
.profile-section {
  background: #fff;
  margin: 30rpx 30rpx 0 30rpx;
  border-radius: 20rpx;
  padding: 24rpx 0 24rpx 0;
  box-shadow: 0 2rpx 8rpx #eee;
}
.section-title {
  font-size: 28rpx;
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
  font-size: 26rpx;
}
</style>
