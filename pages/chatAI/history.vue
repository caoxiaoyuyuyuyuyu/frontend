<template>
	<view class="history-container">
		<!-- 顶部标题栏 -->
		<view class="header">
			<view class="header-left">
				<view class="back-btn" @tap="goBack">
					<text class="back-icon">←</text>
				</view>
			</view>
			<view class="header-center">
				<text class="title">历史对话</text>
			</view>
			<view class="header-right">
				<view class="clear-btn" @tap="clearAllHistory">
					<text class="clear-icon">🗑️</text>
				</view>
			</view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-container">
			<view class="search-box">
				<view class="search-icon">🔍</view>
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
						<text class="delete-icon">×</text>
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
	export default {
		data() {
			return {
				historyChats: [], // 历史对话列表
				searchKeyword: '', // 搜索关键词
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
				if (!this.searchKeyword.trim()) {
					return this.historyChats;
				}
				
				const keyword = this.searchKeyword.toLowerCase();
				return this.historyChats.filter(chat => {
					// 搜索标题
					if (chat.title && chat.title.toLowerCase().includes(keyword)) {
						return true;
					}
					// 搜索消息内容
					if (chat.messages) {
						return chat.messages.some(message => 
							message.content && message.content.toLowerCase().includes(keyword)
						);
					}
					return false;
				});
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 加载历史对话列表
			loadHistoryChats() {
				// 从本地存储加载历史对话数据
				const storedChats = uni.getStorageSync('historyChats');
				if (storedChats && storedChats.length > 0) {
					// 按最后消息时间排序（最新的在前面）
					this.historyChats = [...storedChats].sort((a, b) => {
						const timeA = new Date(a.lastTime);
						const timeB = new Date(b.lastTime);
						return timeB - timeA; // 降序排列，最新的在前面
					});
				} else {
					// 如果没有存储的数据，使用模拟数据作为示例
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
					// 保存模拟数据到本地存储
					uni.setStorageSync('historyChats', this.historyChats);
				}
			},
			
			// 获取预览文本
			getPreviewText(messages) {
				if (messages.length === 0) return '';
				const lastMessage = messages[messages.length - 1];
				const text = lastMessage.content;
				return text.length > 30 ? text.substring(0, 30) + '...' : text;
			},
			
			// 加载指定对话
			loadChat(chat) {
				// 将对话数据传递到聊天页面，但不更新时间
				uni.setStorageSync('selectedChat', chat);
				
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
			deleteChat(chatId) {
				uni.showModal({
					title: '删除对话',
					content: '确定要删除这个对话吗？删除后无法恢复。',
					success: (res) => {
						if (res.confirm) {
							this.historyChats = this.historyChats.filter(chat => chat.id !== chatId);
							// 更新本地存储
							uni.setStorageSync('historyChats', this.historyChats);
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				});
			},
			
			// 清空所有历史
			clearAllHistory() {
				uni.showModal({
					title: '清空历史',
					content: '确定要清空所有历史对话吗？此操作不可恢复。',
					success: (res) => {
						if (res.confirm) {
							this.historyChats = [];
							// 清空本地存储
							uni.removeStorageSync('historyChats');
							uni.showToast({
								title: '已清空所有历史',
								icon: 'success'
							});
						}
					}
				});
			},
			
			// 搜索输入处理
			onSearchInput() {
				// 实时搜索，不需要额外处理
			},
			
			// 执行搜索
			performSearch() {
				if (this.searchKeyword.trim()) {
					const count = this.filteredHistoryChats.length;
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
		background-color: #f5f5f5;
		width: 100%;
		box-sizing: border-box;
	}
	
	.header {
		background-color: #4CAF50;
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}
	
	.header-left, .header-right {
		width: 80rpx;
		display: flex;
		justify-content: center;
	}
	
	.header-center {
		flex: 1;
		text-align: center;
	}
	
	.back-btn, .clear-btn {
		width: 60rpx;
		height: 60rpx;
		background: rgba(255,255,255,0.2);
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}
	
	.back-btn:active, .clear-btn:active {
		background: rgba(255,255,255,0.3);
		transform: scale(0.95);
	}
	
	.back-icon {
		color: white;
		font-size: 28rpx;
	}
	
	.clear-icon {
		color: white;
		font-size: 28rpx;
	}
	
	.title {
		color: white;
		font-size: 36rpx;
		font-weight: bold;
	}
	
	.search-container {
		background-color: white;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #e0e0e0;
	}
	
	.search-box {
		display: flex;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 25rpx;
		padding: 15rpx 20rpx;
		position: relative;
	}
	
	.search-icon {
		font-size: 28rpx;
		margin-right: 15rpx;
		color: #999;
	}
	
	.search-input {
		flex: 1;
		font-size: 28rpx;
		background: transparent;
		border: none;
		outline: none;
	}
	
	.clear-btn {
		width: 40rpx;
		height: 40rpx;
		background-color: #ccc;
		border-radius: 50%;
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
		background-color: #ff4444;
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.delete-icon {
		color: white;
		font-size: 28rpx;
		font-weight: bold;
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