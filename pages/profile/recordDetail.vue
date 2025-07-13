<template>
  <view class="detail-container">
    <image class="detail-img" :src="record.image" mode="aspectFit" />
    <view class="detail-info">
      <view class="detail-title">{{ record.name }}</view>
      <view class="detail-row">AI匹配度：<text class="confidence">{{ record.confidence }}</text></view>
      <view class="detail-row">特征描述：{{ record.feature || '暂无' }}</view>
      <view class="detail-row">识别时间：{{ record.time }}</view>
      <view class="detail-row">识别类型：{{ record.type }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      record: {
        image: '',
        name: '',
        confidence: '',
        feature: '',
        time: '',
        type: ''
      }
    }
  },
  onLoad(query) {
    // 实际应从后端获取，演示用本地数据
    // 这里可通过 query.id 获取记录ID
    // 你可以用 uni.getStorage 或请求后端接口获取详情
    // 这里用模拟数据
    const demo = {
      1: {
        image: '/static/pest1.jpg',
        name: '棉铃虫',
        confidence: '92%',
        feature: '体长5mm，绿色，有黑色斑点',
        time: '2024/07/15 14:30:00',
        type: '蛾类'
      }
      // ...
    }
    this.record = demo[query.id] || {
      image: '', name: '未知', confidence: '', feature: '', time: '', type: ''
    }
  }
}
</script>

<style scoped>
.detail-container {
  padding: 32rpx 24rpx 32rpx 24rpx;
  background: #f8f9fb;
  min-height: 100vh;
}
.detail-img {
  width: 100%;
  max-width: 500rpx;
  height: 300rpx;
  border-radius: 18rpx;
  background: #eee;
  margin: 0 auto 24rpx auto;
  display: block;
}
.detail-info {
  background: #fff;
  border-radius: 18rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 2rpx 8rpx #eee;
}
.detail-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 18rpx;
}
.detail-row {
  font-size: 26rpx;
  color: #444;
  margin-bottom: 12rpx;
}
.confidence {
  color: #4caf50;
  font-weight: bold;
}
</style> 