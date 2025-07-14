<template>
	<view class="history-container">

		
		<!-- 搜索栏 -->
		<view class="search-container">
			<view class="filter-btn" @tap="showFilterOptions">
				<image src="/static/filter.png" class="filter-icon"></image>
			</view>
			<view class="search-box">
				<image src="/static/search.png" class="search-icon"></image>
				<input 
					class="search-input" 
					v-model="searchKeyword" 
					placeholder="搜索历史对话..."
					@input="onSearchInput"
					@confirm="performSearch"
				/>
				<view v-if="searchKeyword" class="clear-btn" @tap="clearSearch">
					<text class="clear-icon">×</text>
				</view>
			</view>
		</view>
		
		<!-- 历史对话列表 -->
		<scroll-view class="history-list" scroll-y="true" :show-scrollbar="false">
			<view 
				v-for="(chat, index) in filteredHistoryChats" 
				:key="index"
				:class="['history-item', isChatHighlighted(chat) ? 'highlighted' : '']"
				@tap="loadChat(chat)"
			>
				<view class="history-content">
					<text class="history-title">{{ chat.title }}</text>
					<text class="history-time">{{ chat.lastTime }}</text>
					<text class="history-preview">{{ getPreviewText(chat.messages) }}</text>
				</view>
				<view class="history-actions">
					<view class="delete-btn" @tap.stop="deleteChat(chat.id)">
						<image src="/static/delete.png" class="delete-icon"></image>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="filteredHistoryChats.length === 0" class="empty-history">
				<view class="empty-icon">📋</view>
				<text class="empty-title">{{ searchKeyword ? '未找到相关对话' : '暂无历史对话' }}</text>
				<text class="empty-subtitle">{{ searchKeyword ? '尝试其他关键词' : '开始新的对话吧' }}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { 
		loadHistoryChats, 
		deleteChat, 
		searchChats, 
		setSelectedChat,
		getMessagePreview
	} from './api.js';
	
	export default {
		data() {
			return {
				historyChats: [], // 历史对话列表
				searchKeyword: '', // 搜索关键词
				filterType: 'all', // 筛选类型：all, today, week, month
				filterOptions: [
					{ label: '全部', value: 'all' },
					{ label: '今天', value: 'today' },
					{ label: '本周', value: 'week' },
					{ label: '本月', value: 'month' }
				]
			}
		},
		onLoad() {
			this.loadHistoryChats();
		},
		onShow() {
			// 页面显示时重新加载并排序历史对话
			this.loadHistoryChats();
		},
		computed: {
			// 过滤后的历史对话列表
			filteredHistoryChats() {
				// 这里需要改为异步处理，暂时返回本地数据
				return this.historyChats;
			}
		},
		methods: {
			// 加载历史对话列表
			async loadHistoryChats() {
				try {
					// 使用API从后端加载历史对话数据
					const response = await loadHistoryChats();
					if (response.success) {
						this.historyChats = response.data || [];
					} else {
						// 如果后端没有数据，使用示例数据
						this.historyChats = [
							{
								id: 'chat1',
								title: '关于玉米害虫的咨询',
								lastTime: '2024-01-15 14:30',
								messages: [
									{
										type: 'user',
										content: '玉米地里发现了虫子，能帮我识别一下吗？',
										time: '14:30'
									},
									{
										type: 'ai',
										content: '根据您的描述，这可能是玉米螟。建议您上传图片进行更准确的识别。',
										time: '14:31'
									}
								]
							},
							{
								id: 'chat2',
								title: '水稻病虫害防治',
								lastTime: '2024-01-14 09:15',
								messages: [
									{
										type: 'user',
										content: '水稻叶子发黄，是什么原因？',
										time: '09:15'
									},
									{
										type: 'ai',
										content: '水稻叶子发黄可能是缺肥或病虫害导致的。建议您检查是否有虫害，并适当施肥。',
										time: '09:16'
									}
								]
							},
							{
								id: 'chat3',
								title: '蔬菜害虫识别',
								lastTime: '2024-01-13 16:45',
								messages: [
									{
										type: 'user',
										content: '白菜上有小虫子，怎么处理？',
										time: '16:45'
									},
									{
										type: 'ai',
										content: '这可能是菜青虫。建议使用生物农药或人工捕杀，避免使用高毒农药。',
										time: '16:46'
									}
								]
							},
							{
								id: 'chat4',
								title: '果树病虫害咨询',
								lastTime: '2024-01-12 11:20',
								messages: [
									{
										type: 'user',
										content: '苹果树上有蚜虫，用什么药比较好？',
										time: '11:20'
									},
									{
										type: 'ai',
										content: '对于苹果树蚜虫，建议使用吡虫啉或啶虫脒等药剂，注意轮换使用避免抗性。',
										time: '11:21'
									}
								]
							},
							{
								id: 'chat5',
								title: '小麦病虫害防治',
								lastTime: '2024-01-11 15:30',
								messages: [
									{
										type: 'user',
										content: '小麦叶子有白粉病，怎么防治？',
										time: '15:30'
									},
									{
										type: 'ai',
										content: '小麦白粉病可以使用三唑酮、戊唑醇等药剂防治，同时注意通风透光。',
										time: '15:31'
									}
								]
							}
						];
					}
				} catch (error) {
					console.error('加载历史对话失败:', error);
					uni.showToast({
						title: '加载失败，请检查网络',
						icon: 'none'
					});
					// 使用示例数据作为备用
					this.historyChats = [
						{
							id: 'chat1',
							title: '关于玉米害虫的咨询',
							lastTime: '2024-01-15 14:30',
							messages: [
								{
									type: 'user',
									content: '玉米地里发现了虫子，能帮我识别一下吗？',
									time: '14:30'
								},
								{
									type: 'ai',
									content: '根据您的描述，这可能是玉米螟。建议您上传图片进行更准确的识别。',
									time: '14:31'
								}
							]
						}
					];
				}
			},
			
			// 获取预览文本
			getPreviewText(messages) {
				return getMessagePreview(messages);
			},
			
			// 加载指定对话
			loadChat(chat) {
				// 使用API设置选中的对话
				setSelectedChat(chat);
				
				// 先显示加载提示
				uni.showToast({
					title: '正在加载对话',
					icon: 'loading'
				});
				
				// 使用更简单的跳转方式
				setTimeout(() => {
					// 尝试使用switchTab，因为chatAI是tabBar页面
					uni.switchTab({
						url: '/pages/chatAI/chatAI',
						success: () => {
							console.log('switchTab跳转成功');
						},
						fail: (err) => {
							console.log('switchTab失败，尝试navigateTo:', err);
							// 如果switchTab失败，尝试navigateTo
							uni.navigateTo({
								url: '/pages/chatAI/chatAI',
								success: () => {
									console.log('navigateTo跳转成功');
								},
								fail: (navigateErr) => {
									console.log('navigateTo也失败:', navigateErr);
									uni.showToast({
										title: '跳转失败，请手动返回',
										icon: 'none',
										duration: 2000
									});
								}
							});
						}
					});
				}, 100);
			},
			
			// 删除对话
			async deleteChat(chatId) {
				uni.showModal({
					title: '删除对话',
					content: '确定要删除这个对话吗？删除后无法恢复。',
					success: async (res) => {
						if (res.confirm) {
							try {
								// 使用API删除对话
								const response = await deleteChat(chatId);
								if (response.success) {
									// 更新本地数据
									this.historyChats = this.historyChats.filter(chat => chat.id !== chatId);
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: response.message || '删除失败',
										icon: 'none'
									});
								}
							} catch (error) {
								console.error('删除对话失败:', error);
								uni.showToast({
									title: '删除失败，请检查网络',
									icon: 'none'
								});
							}
						}
					}
				});
			},
			
			// 搜索输入处理
			onSearchInput() {
				// 实时搜索，不需要额外处理
			},
			
			// 执行搜索
			async performSearch() {
				if (this.searchKeyword.trim()) {
					try {
						const response = await searchChats(this.searchKeyword, this.filterType);
						if (response.success) {
							this.historyChats = response.data || [];
							const count = this.historyChats.length;
							if (count > 0) {
								uni.showToast({
									title: `找到 ${count} 个对话`,
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '未找到相关对话',
									icon: 'none'
								});
							}
						} else {
							uni.showToast({
								title: response.message || '搜索失败',
								icon: 'none'
							});
						}
					} catch (error) {
						console.error('搜索失败:', error);
						uni.showToast({
							title: '搜索失败，请检查网络',
							icon: 'none'
						});
					}
				}
			},
			
			// 清除搜索
			clearSearch() {
				this.searchKeyword = '';
			},
			
			// 高亮搜索文本（已移除，改用CSS样式实现）
			highlightSearchText(text) {
				return text; // 直接返回原文本，使用CSS样式实现高亮
			},
			
			// 显示筛选选项
			showFilterOptions() {
				const options = this.filterOptions.map(option => option.label);
				uni.showActionSheet({
					itemList: options,
					success: (res) => {
						const selectedOption = this.filterOptions[res.tapIndex];
						this.filterType = selectedOption.value;
						
						uni.showToast({
							title: `已筛选：${selectedOption.label}`,
							icon: 'success'
						});
					}
				});
			},
			
			// 按时间筛选对话（已移至API中）
			filterByTime(chats) {
				// 此方法已移至API中，保留空方法以避免错误
			},
			
			// 检查对话是否高亮
			isChatHighlighted(chat) {
				if (!this.searchKeyword.trim()) return false;
				
				const keyword = this.searchKeyword.toLowerCase();
				// 检查标题
				if (chat.title && chat.title.toLowerCase().includes(keyword)) {
					return true;
				}
				// 检查消息内容
				if (chat.messages) {
					return chat.messages.some(message => 
						message.content && message.content.toLowerCase().includes(keyword)
					);
				}
				return false;
			}
		}
	}
</script>

<style scoped>
	.history-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f5f5f5;
		width: 100%;
		box-sizing: border-box;
		position: relative;
	}ss
	
	/* 背景装饰 */
	.history-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
		pointer-events: none;
	}
	

	
	.search-container {
		background: rgba(255, 255, 255, 0.9);
		padding: 20rpx 40rpx;
		border-bottom: 1rpx solid rgba(76, 175, 80, 0.1);
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 20rpx;
	}
	
	.filter-btn {
		width: 60rpx;
		height: 60rpx;
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.filter-btn:active {
		opacity: 0.7;
		transform: scale(0.95);
	}
	
	.filter-icon {
		width: 40rpx;
		height: 40rpx;
		filter: brightness(0) saturate(0) invert(0.6);
	}
	
	.search-box {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 25rpx;
		padding: 20rpx 25rpx;
		border: 1rpx solid rgba(248, 248, 248, 0.2);
		position: relative;
		flex: 1;
	}
	
	.search-icon {
		width: 35rpx;
		height: 35rpx;
		margin-right: 20rpx;
	}
	
	.search-input {
		flex: 1;
		font-size: 28rpx;
		background: transparent;
		border: none;
		outline: none;
		color: #000000;
	}
	
	.search-input::placeholder {
		color: #000000;
	}
	
	.clear-btn {
		width: 40rpx;
		height: 40rpx;
		background-color: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 15rpx;
	}
	
	.clear-icon {
		color: white;
		font-size: 24rpx;
		font-weight: bold;
	}
	
	.history-list {
		flex: 1;
		padding: 20rpx;
		width: 100%;
		box-sizing: border-box;
		overflow-y: auto;
	}
	
	.history-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		margin-bottom: 20rpx;
		background-color: white;
		border-radius: 15rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
		width: 100%;
		box-sizing: border-box;
	}
	
	.history-content {
		flex: 1;
		margin-right: 20rpx;
		min-width: 0;
		overflow: hidden;
	}
	
	.history-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
		word-wrap: break-word;
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.history-time {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.history-preview {
		font-size: 26rpx;
		color: #666;
		line-height: 1.4;
		display: block;
		word-wrap: break-word;
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.history-actions {
		display: flex;
		align-items: center;
	}
	
	.delete-btn {
		width: 50rpx;
		height: 50rpx;
		background-color: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.delete-icon {
		width: 50rpx;
		height: 50rpx;
		filter: brightness(0) saturate(0) invert(0.3);
	}
	
	.empty-history {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 60vh;
		padding: 40rpx;
	}
	
	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}
	
	.empty-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 15rpx;
		display: block;
	}
	
	.empty-subtitle {
		font-size: 28rpx;
		color: #999;
		display: block;
	}
	
	.history-item.highlighted {
		background-color: rgba(255, 215, 0, 0.2);
		border: 2rpx solid #ffd700;
		box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.3);
	}
</style> 