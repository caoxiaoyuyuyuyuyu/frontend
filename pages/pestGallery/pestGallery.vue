<template>
	<view class="pest-gallery">
		<!-- 顶部知识科普区域 -->
		<view class="knowledge-tip">
			<swiper class="tip-swiper" 
					:current="currentTipIndex" 
					@change="onSwiperChange"
					:autoplay="false"
					:circular="true"
					:indicator-dots="false"
					indicator-color="rgba(204, 204, 204, 0.6)"
					indicator-active-color="#74c865">
				<swiper-item v-for="(tip, index) in knowledgeTips" :key="index">
					<view class="tip-card">
						<view class="tip-header">
							<view class="tip-icon">{{ tip.icon }}</view>
							<view class="tip-title">{{ tip.title }}</view>
						</view>
						<view class="tip-content">
							<text class="tip-text">{{ tip.content }}</text>
						</view>
						<view class="tip-footer">
							<text class="tip-note">{{ tip.note }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- 指示器 -->
			<view class="tip-indicators">
				<view class="indicator" v-for="(tip, index) in knowledgeTips" :key="index" 
					  :class="{ active: currentTipIndex === index }" 
					  @click="switchTip(index)">
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-area">
			<!-- 害虫库标题 -->
			<view class="section-title">害虫图库</view>
			
			<!-- 加载状态 -->
			<view v-if="loading" class="loading-container">
				<view class="loading-spinner"></view>
				<text class="loading-text">正在加载害虫数据...</text>
			</view>
			
			<!-- 害虫网格展示 -->
			<view v-else class="pest-grid">
				<view class="pest-card" v-for="(pest, index) in pestList" :key="pest.id" @click="showPestDetail(pest.id)">
					<view class="pest-image">
						<image :src="getImageUrl(pest.image)" class="pest-image-file" mode="aspectFill"></image>
					</view>
					<view class="pest-card-info">
						<view class="pest-card-name">{{ pest.name }}</view>
						<view class="pest-card-desc">{{ pest.host_range }}</view>
					</view>
				</view>
			</view>
			
			<!-- 分页组件 -->
			<view v-if="!loading && pestList.length > 0" class="pagination">
				<view class="pagination-controls">
					<button 
						class="pagination-btn prev-btn" 
						:class="{ disabled: currentPage <= 1 }"
						:disabled="currentPage <= 1"
						@click="goToPage(currentPage - 1)"
					>
						‹ 上一页
					</button>
					
					<view class="pagination-info">
						<text class="pagination-text">第 {{ currentPage }} 页，共 {{ totalPages }} 页</text>
					</view>
					
					<button 
						class="pagination-btn next-btn" 
						:class="{ disabled: currentPage >= totalPages }"
						:disabled="currentPage >= totalPages"
						@click="goToPage(currentPage + 1)"
					>
						下一页 ›
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getPestList, getImageUrl } from './api.js';
	
	export default {
		// 启用下拉刷新
		onPullDownRefresh() {
			this.loadPestList().then(() => {
				uni.stopPullDownRefresh();
			});
		},
		data() {
			return {
				tipTimer: null,
				// 害虫库数据
				pestList: [],
				knowledgeTips: [
					{ icon: '💡', title: '害虫知识科普', content: '了解害虫分类和危害方式，科学防治病虫害，保护农作物和生态环境。', note: '点击下方害虫查看详细信息' },
					{ icon: '🌱', title: '农作物保护', content: '了解害虫对农作物的危害，学习如何科学防治病虫害。', note: '点击下方害虫查看详细信息' },
					{ icon: '🌳', title: '林业保护', content: '了解害虫对林业的影响，学习如何科学防治病虫害。', note: '点击下方害虫查看详细信息' },
					{ icon: '🌼', title: '园林花卉保护', content: '了解害虫对园林花卉的危害，学习如何科学防治病虫害。', note: '点击下方害虫查看详细信息' },
					{ icon: '🐛', title: '多食性/广食性害虫', content: '了解多食性/广食性害虫的危害方式，学习如何科学防治病虫害。', note: '点击下方害虫查看详细信息' }
				],
				currentTipIndex: 0,
				loading: false,
				currentPage: 1,
				hasNextPage: false,
				perPage: 10,
				totalPages: 1,
				totalItems: 0,
				visiblePages: []
			}
		},
		mounted() {
			this.startTipTimer();
			this.loadPestList();
		},
		beforeDestroy() {
			this.stopTipTimer();
		},
		methods: {
			// 获取图片URL
			getImageUrl(imageName) {
				return getImageUrl(imageName);
			},
			
			// 加载害虫列表
			async loadPestList() {
				try {
					this.loading = true;
					const response = await getPestList({
						page: this.currentPage,
						per_page: this.perPage
					});
					
					// 直接使用后端返回的数据结构
					this.pestList = response.data || [];
					
					// 更新分页信息
					const pagination = response.pagination;
					this.hasNextPage = pagination.has_next;
					this.currentPage = pagination.current_page;
					this.totalPages = pagination.pages || 1;
					this.totalItems = pagination.total || 0;
					this.visiblePages = this.generateVisiblePages();
				} catch (error) {
					console.error('加载害虫列表失败:', error);
					// 使用默认数据
					this.pestList = [];
					this.hasNextPage = false;
					this.totalPages = 1;
					this.totalItems = 0;
					this.visiblePages = this.generateVisiblePages();
				} finally {
					this.loading = false;
				}
			},
			
			showPestDetail(id) {
				// 跳转到害虫详情页面
				uni.navigateTo({
					url: `/pages/pestDetail/pestDetail?pestId=${(id)}`
				});
			},
			switchTip(index) {
				this.currentTipIndex = index;
				// 重置定时器
				this.stopTipTimer();
				this.startTipTimer();
			},
			onSwiperChange(e) {
				this.currentTipIndex = e.detail.current;
				// 重置定时器
				this.stopTipTimer();
				this.startTipTimer();
			},
			startTipTimer() {
				this.tipTimer = setInterval(() => {
					this.currentTipIndex = (this.currentTipIndex + 1) % this.knowledgeTips.length;
				}, 30000); // 30秒切换一次
			},
			stopTipTimer() {
				if (this.tipTimer) {
					clearInterval(this.tipTimer);
					this.tipTimer = null;
				}
			},
			generateVisiblePages() {
				const pages = [];
				const maxVisible = 5; // 最多显示5个页码
				
				if (this.totalPages <= maxVisible) {
					// 如果总页数少于等于最大显示数，显示所有页码
					for (let i = 1; i <= this.totalPages; i++) {
						pages.push(i);
					}
				} else {
					// 如果总页数大于最大显示数，显示当前页附近的页码
					let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
					let end = Math.min(this.totalPages, start + maxVisible - 1);
					
					// 调整起始页，确保显示maxVisible个页码
					if (end - start + 1 < maxVisible) {
						start = Math.max(1, end - maxVisible + 1);
					}
					
					for (let i = start; i <= end; i++) {
						pages.push(i);
					}
				}
				
				return pages;
			},
			goToPage(page) {
				if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
					this.currentPage = page;
					this.loadPestList();
				}
			}
		}
	}
</script>

<style scoped>
.pest-gallery {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f5f5f5;
}

/* 知识科普小tip样式 */
.knowledge-tip {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	padding: 30rpx 25rpx;
	border-bottom: 1px solid #e0e0e0;
	position: relative;
	overflow: hidden;
	min-height: 240rpx;
}

.tip-swiper {
	height: 180rpx;
	width: 100%;
}

.knowledge-tip::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(45deg, rgba(116, 200, 101, 0.05) 0%, rgba(170, 235, 159, 0.05) 100%);
}

.tip-card {
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	transition: all 0.4s ease;
	border: 2rpx solid rgba(116, 200, 101, 0.1);
	position: relative;
	overflow: hidden;
	height: 140rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.tip-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4rpx;
	background: linear-gradient(90deg, #74c865 0%, #aaeb9f 100%);
}

.tip-card:hover {
	transform: translateY(-3rpx);
	box-shadow: 0 8rpx 30rpx rgba(116, 200, 101, 0.15);
	border-color: rgba(116, 200, 101, 0.3);
}

.tip-header {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
	position: relative;
	z-index: 1;
}

.tip-icon {
	font-size: 40rpx;
	margin-right: 15rpx;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.1); }
}

.tip-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #2c3e50;
}

.tip-content {
	margin-bottom: 10rpx;
	position: relative;
	z-index: 1;
	flex: 1;
}

.tip-text {
	font-size: 26rpx;
	color: #5a6c7d;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tip-footer {
	position: relative;
	z-index: 1;
}

.tip-note {
	font-size: 24rpx;
	color: #74c865;
	font-style: italic;
}

.tip-indicators {
	display: flex;
	justify-content: center;
	margin-top: 20rpx;
	position: relative;
	z-index: 1;
}

.indicator {
	width: 16rpx;
	height: 16rpx;
	background: rgba(204, 204, 204, 0.6);
	border-radius: 50%;
	margin: 0 6rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 2rpx solid transparent;
}

.indicator:hover {
	background: rgba(116, 200, 101, 0.3);
	transform: scale(1.2);
}

.indicator.active {
	background: #74c865;
	border-color: rgba(116, 200, 101, 0.3);
	box-shadow: 0 0 10rpx rgba(116, 200, 101, 0.4);
}

.content-area {
	flex: 1;
	padding: 20rpx;
	background: #ffffff;
	margin: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	overflow-y: auto;
}

.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	text-align: center;
}

.pest-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
}

.pest-card {
	background: #ffffff;
	border-radius: 12rpx;
	padding: 25rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	cursor: pointer;
	border: 2rpx solid transparent;
}

.pest-card:hover {
	transform: translateY(-5rpx);
	box-shadow: 0 8rpx 25rpx rgba(116, 200, 101, 0.2);
	border-color: rgba(76, 175, 80, 0.2);
}

.pest-image {
	text-align: center;
	margin-bottom: 20rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.pest-image-file {
	width: 130rpx;
	height: 130rpx;
	border-radius: 8rpx;
	object-fit: cover;
}

.pest-icon {
	font-size: 60rpx;
}

.pest-card-info {
	text-align: center;
}

.pest-card-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.pest-card-desc {
	font-size: 22rpx;
	color: #666;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 50rpx;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid rgba(116, 200, 101, 0.2);
	border-top: 4rpx solid #74c865;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 20rpx;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 28rpx;
	color: #5a6c7d;
}

.pagination {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20rpx;
	padding: 10rpx 15rpx;
	background: #f8f9fa;
	border-radius: 8rpx;
}

.pagination-controls {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	max-width: 500rpx;
}

.pagination-btn {
	background: linear-gradient(135deg, #74c865 0%, #aaeb9f 100%);
	color: white;
	border: none;
	border-radius: 15rpx;
	padding: 6rpx 12rpx;
	font-size: 20rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	min-width: 50rpx;
	white-space: nowrap;
}

.pagination-btn:hover:not(.disabled) {
	transform: translateY(-1rpx);
	box-shadow: 0 2rpx 8rpx rgba(116, 200, 101, 0.3);
}

.pagination-btn.disabled {
	background: #e0e0e0;
	color: #999;
	cursor: not-allowed;
	transform: none;
	box-shadow: none;
}

.pagination-info {
	display: flex;
	align-items: center;
}

.pagination-text {
	font-size: 20rpx;
	color: #666;
}
</style>
