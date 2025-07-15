<template>
	<view class="pest-detail">
		
		<!-- 顶部半模糊背景 -->
		<view class="pest-header">
			<image v-if="pestInfo.image" :src="getImageUrl(pestInfo.image)" mode="aspectFill" class="pest-header-bg" />
			<view v-else class="pest-header-bg-fallback"></view>
			<!-- <view class="pest-header-blur"></view> -->
		</view>
		<!-- 白色信息卡片 -->
		<view class="pest-info-card">
			<!-- <view class="info-img-box"> -->
				<!-- <image v-if="pestInfo.image" :src="getImageUrl(pestInfo.image)" mode="aspectFill" class="info-img" /> -->
				<!-- <view v-else class="pest-icon-large">🐛</view> -->
			<!-- </view> -->
			<view class="info-main-box">
				<view class="info-title">
					{{ pestInfo.name }}<span v-if="pestInfo.alias">（{{ pestInfo.alias }}）</span>
				</view>
				<view class="info-taxonomy">{{ pestInfo.taxonomy || '无' }}</view>
			</view>
		</view>
		<!-- 五栏横向分布 -->
		<view class="pest-tabs">
			<view class="pest-tab-item" v-for="(tab, idx) in tabs" :key="idx" @click="switchTab(idx)" :class="{ active: activeTab === idx }">
				{{ tab.title }}
			</view>
		</view>
		<view class="pest-tab-content">
			<view v-if="activeTab === 0">
				<view class="col-content">
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">成虫</view>
							<view class="col-row-desc">{{ pestInfo.adult_features || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">幼虫</view>
							<view class="col-row-desc">{{ pestInfo.larval_features || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">卵</view>
							<view class="col-row-desc">{{ pestInfo.egg_features || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">蛹</view>
							<view class="col-row-desc">{{ pestInfo.pupa_features || '无' }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="activeTab === 1">
				<view class="col-content">
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">寄主</view>
							<view class="col-row-desc">{{ pestInfo.host_range || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">环境</view>
							<view class="col-row-desc">{{ pestInfo.habitat || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">活动</view>
							<view class="col-row-desc">{{ pestInfo.activity_pattern || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">越冬</view>
							<view class="col-row-desc">{{ pestInfo.overwintering || '无' }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="activeTab === 2">
				<view class="col-content">
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">时期</view>
							<view class="col-row-desc">{{ pestInfo.damage_period || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">方式</view>
							<view class="col-row-desc">{{ pestInfo.damage_method || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">症状</view>
							<view class="col-row-desc">{{ pestInfo.damage_symptoms || '无' }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="activeTab === 3">
				<view class="col-content">
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">监测</view>
							<view class="col-row-desc">{{ pestInfo.monitoring_methods || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">农业</view>
							<view class="col-row-desc">{{ pestInfo.agricultural_control || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">物理</view>
							<view class="col-row-desc">{{ pestInfo.physical_control || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">生物</view>
							<view class="col-row-desc">{{ pestInfo.biological_control || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">化学</view>
							<view class="col-row-desc">{{ pestInfo.chemical_control || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">检疫</view>
							<view class="col-row-desc">{{ pestInfo.quarantine_requirements || '无' }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="activeTab === 4">
				<view class="col-content">
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">分布</view>
							<view class="col-row-desc">{{ pestInfo.geographical_distribution || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">世代</view>
							<view class="col-row-desc">{{ pestInfo.generations_per_year || '无' }}</view>
						</view>
					</view>
					<view class="col-row-card">
						<span class="dot"></span>
						<view class="col-row-main">
							<view class="col-row-title">繁殖</view>
							<view class="col-row-desc">{{ pestInfo.reproductive_characteristics || '无' }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部固定操作栏 -->
		<!-- <view class="fixed-bottom-bar">
			<button class="bottom-btn left-btn" @click="onContinue">
				<image src="/static/camera.png" class="btn-icon" />
				<text>继续识别</text>
			</button>
			<button class="bottom-btn right-btn" @click="onShare">
				<image src="/static/forward.png" class="btn-icon" />
				<text>分享给好友</text>
			</button>
		</view> -->
	</view>
</template>

<script>
import { getPestDetailInfo, getImageUrl } from './api.js';

export default {
	data() {
		return {
			pestInfo: {},
			activeTab: 0,
			tabs: [
				{ title: '形态特征' },
				{ title: '生态习性' },
				{ title: '危害特征' },
				{ title: '防控管理' },
				{ title: '发生分布' }
			]
		}
	},
	onLoad(options) {
		console.log(options)
		if (options.pestId) {
			getPestDetailInfo(options.pestId).then(data => {
				this.pestInfo = data;
			}).catch(() => {
				uni.showToast({ title: '获取详情失败', icon: 'none' });
			});
		} else if (options.pest) {
			this.pestInfo = JSON.parse(decodeURIComponent(options.pest));
		}
	},
	methods: {
		// 获取图片URL
		getImageUrl(imageName) {
			return getImageUrl(imageName);
		},

		switchTab(idx) {
			this.activeTab = idx;
		},
		onContinue() {
			// 调用相机拍照功能，与index.vue保持一致
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],
				success: (res) => {
					console.log('拍照成功:', res.tempFilePaths);
					// 这里可以跳转到识别页面或上传识别
					this.uploadAndIdentify(res.tempFilePaths[0]);
				},
				fail: (err) => {
					console.error('拍照失败:', err);
					uni.showToast({
						title: '拍照失败',
						icon: 'none'
					});
				}
			});
		},
		
		// 上传并识别
		uploadAndIdentify(imagePath) {
			uni.showLoading({
				title: '正在识别...'
			});
			
			// 模拟识别过程
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '识别功能开发中',
					icon: 'none'
				});
			}, 2000);
		},
		onShare() {
			uni.showToast({ title: '分享功能开发中', icon: 'none' });
		},
	}
}
</script>

<style scoped>
.pest-detail {
	min-height: 100vh;
	background: #f5f5f5;
}



.pest-header {
	position: relative;
	height: 320rpx;
	overflow: hidden;
}

.pest-header-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: 1;
}

.pest-header-bg-fallback {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #aaeb9f 0%, #74c865 100%);
	z-index: 1;
}

.pest-header-blur {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	backdrop-filter: blur(18px);
	-webkit-backdrop-filter: blur(18px);
	background: rgba(255,255,255,0.18);
}

.pest-info-card {
	position: relative;
	z-index: 3;
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.10);
	padding: 32rpx 48rpx;
	margin: 32rpx;
}

.info-img-box {
	width: 120rpx;
	height: 120rpx;
	border-radius: 16rpx;
	overflow: hidden;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 32rpx;
}

.info-img {
	width: 120rpx;
	height: 120rpx;
	object-fit: cover;
	border-radius: 16rpx;
}

.info-main-box {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.info-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #222;
	margin-bottom: 12rpx;
}

.info-title span {
	font-size: 28rpx;
	color: #888;
	font-weight: normal;
}

.info-taxonomy {
	font-size: 28rpx;
	color: #74c865;
}

.pest-tabs {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 8rpx;
	margin: 0 24rpx 0 24rpx;
	background: #fff;
	border-radius: 18rpx 18rpx 0 0;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
	padding: 0 12rpx;
}

.pest-tab-item {
	flex: 1;
	text-align: center;
	padding: 24rpx 0 18rpx 0;
	font-size: 28rpx;
	color: #888;
	font-weight: 500;
	cursor: pointer;
	border-bottom: 4rpx solid transparent;
	transition: color 0.2s, border-color 0.2s;
}

.pest-tab-item.active {
	color: #4caf50;
	border-bottom: 4rpx solid #4caf50;
	background: #f6fff6;
	font-weight: bold;
}

.pest-tab-content {
	background: #fff;
	border-radius: 0 0 18rpx 18rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
	margin: 0 24rpx 32rpx 24rpx;
	padding: 32rpx 24rpx;
	min-height: 180rpx;
}

.col-row-card {
	display: flex;
	align-items: flex-start;
	background: #fff;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
	padding: 22rpx 24rpx;
	margin-bottom: 22rpx;
}
.col-row-card:last-child {
	margin-bottom: 0;
}
.col-row-main {
	display: flex;
	flex-direction: column;
}
.col-row-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #222;
	margin-bottom: 8rpx;
	line-height: 1.2;
}
.col-row-desc {
	font-size: 26rpx;
	color: #888;
	line-height: 1.7;
	word-break: break-all;
}
.dot {
	display: inline-block;
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: #4caf50;
	margin-right: 18rpx;
	margin-top: 10rpx;
	flex-shrink: 0;
}
.fixed-bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 32rpx 32rpx 32rpx;
	background: transparent;
	pointer-events: none;
}
.bottom-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	border: none;
	border-radius: 32rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.10);
	font-size: 32rpx;
	color: #888;
	margin: 0 12rpx;
	padding: 24rpx 0;
	pointer-events: auto;
	transition: background 0.2s, color 0.2s;
}
.left-btn {
	color: #666;
	background: #f5f5f5;
}
.left-btn .btn-icon {
	filter: brightness(0) saturate(0) invert(0.4);
}
.right-btn {
	color: #fff;
	background: #19c37d;
}
.right-btn .btn-icon {
	filter: brightness(0) saturate(0) invert(1);
}
.right-btn:active {
	background: #73ca8e;
}
.btn-icon {
	width: 50rpx;
	height: 50rpx;
	margin-right: 16rpx;
	vertical-align: middle;
}
</style> 