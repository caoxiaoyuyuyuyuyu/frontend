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
				@tap="loadChat(chat.id)"
			>
				<view class="history-content">
					<text class="history-title">{{ getChatTitle(chat) }}</text>
					<text class="history-time">{{ formatTime(chat.lastTime || chat.messages[chat.messages.length-1]?.timestamp) }}</text>
					<text class="history-preview">{{ getPreviewText(chat.messages) }}</text>
				</view>
				<!-- <view class="history-actions">
					<view class="delete-btn" @tap.stop="deleteChat(chat.id)">
						<image src="/static/delete.png" class="delete-icon"></image>
					</view>
				</view> -->
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
		setSelectedChat
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
		onShow() {
			this.loadHistoryChats();
		},
		computed: {
			filteredHistoryChats() {
			    return this.historyChats.sort((a, b) => {
			        return new Date(b.lastTime) - new Date(a.lastTime);
			    });
			}
		},
		methods: {
			// 转换后端数据格式
			formatConversations(data) {
				if (!data || !data.conversations) return [];
				
				return data.conversations
			},
			
			// 加载历史对话列表
			async loadHistoryChats() {
				try {
					const response = await loadHistoryChats();
					if (response) {
						this.historyChats = this.formatConversations(response);
					} 
				} catch (error) {
					console.error('加载历史对话失败:', error);
					uni.showToast({
						title: '加载失败，请检查网络',
						icon: 'none'
					});
				}
			},
			
			// 格式化时间显示
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp);
				return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
			},
			
			// 获取对话标题
			getChatTitle(chat) {
				if (chat.title) return chat.title;
				if (chat.messages && chat.messages.length > 0) {
					const firstMessage = chat.messages[0];
					return firstMessage.content.substring(0, 20) + (firstMessage.content.length > 20 ? '...' : '');
				}
				return '未命名对话';
			},
			
			// 获取预览文本
			getPreviewText(messages) {
				if (!messages || messages.length === 0) return '';
				const lastMessage = messages[messages.length - 1];
				return lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '');
			},
			
			// 加载指定对话
			loadChat(chat_id) {
				setSelectedChat(chat_id);
				
				console.log(chat_id)
				
				uni.showToast({
					title: '正在加载对话',
					icon: 'loading'
				});
				
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/chatAI/chatAI',
						success: () => {
							console.log('switchTab跳转成功');
						},
						fail: (err) => {
							console.log('switchTab失败，尝试navigateTo:', err);
							uni.navigateTo({
								url: '/pages/chatAI/chatAI',
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
			
			// 搜索相关方法保持不变
			onSearchInput() {},
			
			async performSearch() {
				if (this.searchKeyword.trim()) {
					try {
						const response = await searchChats(this.searchKeyword, this.filterType);
						if (response.success) {
							this.historyChats = this.formatConversations(response.data) || [];
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
			
			clearSearch() {
				this.searchKeyword = '';
				this.loadHistoryChats();
			},
			
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
			
			isChatHighlighted(chat) {
				if (!this.searchKeyword.trim()) return false;
				
				const keyword = this.searchKeyword.toLowerCase();
				// 检查标题
				if (this.getChatTitle(chat).toLowerCase().includes(keyword)) {
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