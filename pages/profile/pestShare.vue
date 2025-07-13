<template>
  <view class="pest-share-container">
    <!-- 上传新害虫 -->
    <view class="section">
      <view class="section-title">上传新害虫</view>
      <view class="form-row">
        <view class="form-label">图片：</view>
        <view class="form-upload" @click="chooseImage">
          <image v-if="form.image" :src="form.image" class="upload-img" />
          <view v-else class="upload-placeholder">点击上传</view>
        </view>
      </view>
      <view class="form-row">
        <view class="form-label">害虫名称：</view>
        <input class="form-input" v-model="form.name" placeholder="必填，如：棉铃虫" />
      </view>
      <view class="form-row">
        <view class="form-label">特征描述：</view>
        <textarea class="form-textarea" v-model="form.feature" placeholder="如颜色、大小、触角形态等" />
      </view>
      <button class="submit-btn" @click="submit">提交审核</button>
    </view>

    <!-- 贡献记录 -->
    <view class="section">
      <view class="section-title">我的贡献记录</view>
      <view v-if="contributions.length === 0" class="empty-tip">暂无贡献记录</view>
      <view v-for="item in contributions" :key="item.id" class="record-row">
        <image :src="getStatusIcon(item.status)" class="status-icon" />
        <view class="record-info">
          <view class="record-title">{{ item.time }} | {{ item.name }}</view>
          <view class="record-status">
            <text :class="statusClass(item.status)">{{ item.status }}</text>
            <text v-if="item.status === '被驳回'" class="reject-reason">（{{ item.reason }}）</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        image: '',
        name: '',
        feature: ''
      },
      contributions: [] // 初始为空，用户提交后才有记录
    }
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.form.image = res.tempFilePaths[0]
        }
      })
    },
    submit() {
      if (!this.form.image || !this.form.name || !this.form.feature) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
      // 添加到贡献记录
      this.contributions.unshift({
        id: Date.now(),
        time: this.getNowTime(),
        name: this.form.name,
        status: '待审核',
        reason: '',
        image: this.form.image
      })
      // 这里可调用后端接口上传内容
      uni.showModal({
        title: '提交成功',
        content: '您的贡献将在一周内审核，通过后获得10积分。',
        showCancel: false
      })
      // 清空表单
      this.form = { image: '', name: '', feature: '' }
    },
    getStatusIcon(status) {
      if (status === '待审核') return '/static/icon_pending.png'
      if (status === '已通过') return '/static/icon_pass.png'
      if (status === '被驳回') return '/static/icon_reject.png'
      return ''
    },
    statusClass(status) {
      if (status === '待审核') return 'status-pending'
      if (status === '已通过') return 'status-pass'
      if (status === '被驳回') return 'status-reject'
      return ''
    },
    getNowTime() {
      const d = new Date()
      const pad = n => n < 10 ? '0' + n : n
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
  }
}
</script>

<style scoped>
.pest-share-container {
  padding: 32rpx 24rpx 32rpx 24rpx;
  background: #f8f9fb;
  min-height: 100vh;
}
.section {
  background: #fff;
  border-radius: 18rpx;
  margin-bottom: 28rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 2rpx 8rpx #eee;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d2e3a;
  margin-bottom: 16rpx;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 18rpx;
}
.form-label {
  width: 140rpx;
  font-size: 26rpx;
  color: #666;
}
.form-upload {
  width: 120rpx;
  height: 120rpx;
  background: #f0f0f0;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}
.upload-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload-placeholder {
  color: #bbb;
  font-size: 24rpx;
}
.form-input {
  flex: 1;
  font-size: 26rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 8rpx 12rpx;
  background: #fafafa;
}
.form-textarea {
  flex: 1;
  font-size: 26rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 8rpx 12rpx;
  background: #fafafa;
  min-height: 80rpx;
}
.submit-btn {
  width: 100%;
  background: #2d2e3a;
  color: #fff;
  font-size: 28rpx;
  border-radius: 12rpx;
  margin-top: 12rpx;
  padding: 16rpx 0;
}
.empty-tip {
  color: #bbb;
  font-size: 24rpx;
  text-align: center;
  margin: 32rpx 0;
}
.record-row {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 18rpx 0;
}
.status-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 18rpx;
}
.record-info {
  flex: 1;
}
.record-title {
  font-size: 26rpx;
  color: #222;
}
.record-status {
  font-size: 24rpx;
  margin-top: 4rpx;
}
.status-pending {
  color: #e5d3b6;
}
.status-pass {
  color: #4caf50;
}
.status-reject {
  color: #f44336;
}
.reject-reason {
  color: #f44336;
  margin-left: 8rpx;
}
</style>