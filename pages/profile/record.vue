<template>
  <view class="record-container">
    <!-- 搜索和筛选 -->
   <!-- <view class="search-filter">
      <input class="search-input" v-model="searchText" placeholder="搜索害虫名称" @input="filterRecords" />
      <picker :range="timeOptions" :value="timeFilter" @change="onTimeChange">
        <view class="filter-btn">{{ timeOptions[timeFilter] }}</view>
      </picker>
      <picker :range="confidenceOptions" :value="confidenceFilter" @change="onConfidenceChange">
        <view class="filter-btn">{{ confidenceOptions[confidenceFilter] }}</view>
      </picker>
    </view> -->

    <!-- 数据统计 -->
    <view class="stat-section">
      <text>本月识别：{{ stat.count }} 次，常见类型：{{ stat.topType }}</text>
    </view>

    <!-- 识别记录列表 -->
    <view v-if="filteredRecords.length === 0" class="empty-tip">暂无识别记录</view>
    <view v-for="item in filteredRecords" :key="item.id" class="record-row">
      <image :src="getImageUrl(item.image_url)" class="record-img"
        @click="previewImage(item.image_url)"  />
      <view class="record-info">
        <view class="record-title">{{ item.pest_name }}</view>
        <view class="record-meta">
          <text>{{ formatDate(item.detection_time) }}</text>
        </view>
        <view class="record-meta">
          <text class="confidence">{{ formatConfidence(item.confidence) }}匹配</text>
        </view>
      </view>
	<view class="record-actions">
	  <button @click="viewDetail(item)">详情</button>
	  <!-- <button @click="deleteRecord(item)">删除</button> -->
	</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getRecords, getImageUrl } from './api.js'
import { formatDate } from '../../utils/common.js'

// 响应式数据
const records = ref([])
const searchText = ref('')
const timeOptions = ref(['全部', '最近一周', '最近一个月'])
const timeFilter = ref(0)
const confidenceOptions = ref(['默认排序', '高可信度优先', '低可信度优先'])
const confidenceFilter = ref(0)
const filteredRecords = ref([])
const stat = ref({
  count: 0,
  topType: ''
})

// 新增图片预览方法
const previewImage = (imageUrl) => {
  const fullUrl = getImageUrl(imageUrl)
  uni.previewImage({
    urls: [fullUrl], // 支持多张图片预览，这里我们只传当前图片
    current: fullUrl // 当前显示图片的链接
  })
}
// 添加格式化可信度的方法
const formatConfidence = (confidence) => {
  // 如果已经是字符串且包含%，直接返回
  if (typeof confidence === 'string' && confidence.includes('%')) {
    return confidence
  }
  // 如果是小数，转换为百分数
  const num = parseFloat(confidence)
  if (!isNaN(num)) {
    return `${Math.round(num * 100)}%`
  }
  // 其他情况原样返回
  return confidence
}
// 方法
const fixDateStr = (str) => {
  if (!str) return ''
  return str.replace(/-/g, '/').replace(/(\d{2}:\d{2})$/, '$1:00')
}

const filterRecords = () => {
  let list = [...records.value]
  
  // 搜索筛选
  if (searchText.value) {
    list = list.filter(r => r.name.includes(searchText.value))
  }
  
  // 时间筛选
  if (timeFilter.value === 1) {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    list = list.filter(r => new Date(fixDateStr(r.time)).getTime() > weekAgo)
  } else if (timeFilter.value === 2) {
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    list = list.filter(r => new Date(fixDateStr(r.time)).getTime() > monthAgo)
  }
  
  // 可信度排序
  if (confidenceFilter.value === 1) {
    list.sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence))
  } else if (confidenceFilter.value === 2) {
    list.sort((a, b) => parseInt(a.confidence) - parseInt(b.confidence))
  }
  
  filteredRecords.value = list
}

const onTimeChange = (e) => {
  timeFilter.value = e.detail.value
  filterRecords()
}

const onConfidenceChange = (e) => {
  confidenceFilter.value = e.detail.value
  filterRecords()
}

const viewDetail = (item) => {
  uni.navigateTo({ url: `/pages/pestDetail/pestDetail?pestId=${item.pest_id}` })
}

const deleteRecord = (item) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该识别记录吗？',
    success: (res) => {
      if (res.confirm) {
        records.value = records.value.filter(r => r.id !== item.id)
        filterRecords()
        calcStat()
      }
    }
  })
}

const calcStat = () => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  
  const monthRecords = records.value.filter(r => {
    const recordDate = new Date(r.detection_time)
    return (
      recordDate.getMonth() + 1 === currentMonth && 
      recordDate.getFullYear() === currentYear
    )
  })
  
  stat.value.count = monthRecords.length
  
  const typeCount = {}
  monthRecords.forEach(r => {
    typeCount[r.pest_name] = (typeCount[r.pest_name] || 0) + 1
  })
  
  let topType = ''
  let max = 0
  for (const k in typeCount) {
    if (typeCount[k] > max) {
      max = typeCount[k]
      topType = k
    }
  }
  
  stat.value.topType = topType 
    ? `${Math.round((max / (monthRecords.length || 1)) * 100)}%是${topType}` 
    : '无'
}
// 生命周期钩子
onMounted(async () => {
  const response = await getRecords()
  records.value = response.data
  filterRecords()
  calcStat()
})
</script>

<style scoped>
.record-container {
  padding: 32rpx 24rpx 32rpx 24rpx;
  background: #f8f9fb;
  min-height: 100vh;
}
.search-filter {
  display: flex;
  align-items: center;
  margin-bottom: 18rpx;
}
.search-input {
  flex: 1;
  font-size: 26rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 8rpx 12rpx;
  background: #fafafa;
  margin-right: 12rpx;
}
.filter-btn {
  font-size: 24rpx;
  color: #2d2e3a;
  background: #eee;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  margin-right: 8rpx;
}
.stat-section {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 18rpx;
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
.record-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  margin-right: 18rpx;
  object-fit: cover;
}
.record-info {
  flex: 1;
}
.record-title {
  font-size: 28rpx;
  color: #222;
  font-weight: bold;
}
.record-meta {
  font-size: 24rpx;
  color: #888;
  margin: 4rpx 0;
  display: flex;
  justify-content: space-between;
}
.confidence {
  color: #4caf50;
}
.record-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 8rpx;
  flex-direction: row;
}
.record-actions button {
  font-size: 16rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  background: #e5d3b6;
  color: #7d5c1e;
  border: none;
}
</style>