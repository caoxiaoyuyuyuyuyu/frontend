<template>
  <view class="record-container">
    <!-- 搜索和筛选 -->
    <view class="search-filter">
      <input class="search-input" v-model="searchText" placeholder="搜索害虫名称" @input="filterRecords" />
      <picker :range="timeOptions" :value="timeFilter" @change="onTimeChange">
        <view class="filter-btn">{{ timeOptions[timeFilter] }}</view>
      </picker>
      <picker :range="confidenceOptions" :value="confidenceFilter" @change="onConfidenceChange">
        <view class="filter-btn">{{ confidenceOptions[confidenceFilter] }}</view>
      </picker>
    </view>

    <!-- 数据统计 -->
    <view class="stat-section">
      <text>本月识别：{{ stat.count }} 次，常见类型：{{ stat.topType }}</text>
    </view>

    <!-- 识别记录列表 -->
    <view v-if="filteredRecords.length === 0" class="empty-tip">暂无识别记录</view>
    <view v-for="item in filteredRecords" :key="item.id" class="record-row">
      <image :src="item.image" class="record-img" />
      <view class="record-info">
        <view class="record-title">{{ item.name }}</view>
        <view class="record-meta">
          <text>{{ item.time }}</text>
          <text class="confidence">{{ item.confidence }}匹配</text>
        </view>
        <view class="record-actions">
          <button @click="viewDetail(item)">详情</button>
          <button @click="deleteRecord(item)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      records: [
        // 示例数据，实际应从后端获取
        {
          id: 1,
          image: '/static/pest1.jpg',
          name: '棉铃虫',
          time: '2024/07/15 14:30:00',
          confidence: '92%',
          type: '蛾类'
        },
        // ...
      ],
      searchText: '',
      timeOptions: ['全部', '最近一周', '最近一个月'],
      timeFilter: 0,
      confidenceOptions: ['默认排序', '高可信度优先', '低可信度优先'],
      confidenceFilter: 0,
      filteredRecords: [],
      stat: {
        count: 0,
        topType: ''
      }
    }
  },
  created() {
    this.filterRecords()
    this.calcStat()
  },
  methods: {
    fixDateStr(str) {
      // "2024-07-15 14:30" => "2024/07/15 14:30:00"
      if (!str) return ''
      return str.replace(/-/g, '/').replace(/(\d{2}:\d{2})$/, '$1:00')
    },
    filterRecords() {
      // 搜索和筛选逻辑
      let list = this.records
      if (this.searchText) {
        list = list.filter(r => r.name.includes(this.searchText))
      }
      // 时间筛选
      if (this.timeFilter === 1) {
        // 最近一周
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        list = list.filter(r => new Date(this.fixDateStr(r.time)).getTime() > weekAgo)
      } else if (this.timeFilter === 2) {
        // 最近一个月
        const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
        list = list.filter(r => new Date(this.fixDateStr(r.time)).getTime() > monthAgo)
      }
      // 可信度排序
      if (this.confidenceFilter === 1) {
        list = list.slice().sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence))
      } else if (this.confidenceFilter === 2) {
        list = list.slice().sort((a, b) => parseInt(a.confidence) - parseInt(b.confidence))
      }
      this.filteredRecords = list
    },
    onTimeChange(e) {
      this.timeFilter = e.detail.value
      this.filterRecords()
    },
    onConfidenceChange(e) {
      this.confidenceFilter = e.detail.value
      this.filterRecords()
    },
    viewDetail(item) {
      uni.navigateTo({ url: `/pages/profile/recordDetail?id=${item.id}` })
    },
    deleteRecord(item) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该识别记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.records = this.records.filter(r => r.id !== item.id)
            this.filterRecords()
            this.calcStat()
          }
        }
      })
    },
    calcStat() {
      // 统计本月识别次数和常见类型
      const now = new Date()
      const month = now.getMonth() + 1
      const monthRecords = this.records.filter(r => new Date(this.fixDateStr(r.time)).getMonth() + 1 === month)
      this.stat.count = monthRecords.length
      // 统计最多的type
      const typeCount = {}
      monthRecords.forEach(r => {
        typeCount[r.type] = (typeCount[r.type] || 0) + 1
      })
      let topType = ''
      let max = 0
      for (const k in typeCount) {
        if (typeCount[k] > max) {
          max = typeCount[k]
          topType = k
        }
      }
      this.stat.topType = topType ? `${Math.round((max / (monthRecords.length || 1)) * 100)}%是${topType}` : '无'
    }
  }
}
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
}
.record-actions button {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  background: #e5d3b6;
  color: #7d5c1e;
  border: none;
}
</style>