<template>
	<view class="chat-container">
		<!-- 搜索栏 -->
		<view class="search-container">
			<view class="history-btn" @tap="showHistorySidebar">
				<image src="/static/history.png" class="history-icon"></image>
			</view>
			<view class="search-box">
				<image src="/static/search.png" class="search-icon"></image>
				<input 
					class="search-input" 
					v-model="searchKeyword" 
					placeholder="搜索对话内容..."
					@input="onSearchInput"
					@confirm="performSearch"
				/>
				<view v-if="searchKeyword" class="clear-btn" @tap="clearSearch">
					<text class="clear-icon">×</text>
				</view>
			</view>
			<button 
				class="new-chat-btn" 
				@tap="createNewChat"
				:disabled="isLoading"
			>
				<image src="/static/add.png" class="new-chat-icon"></image>
			</button>
		</view>
		
		<!-- 聊天消息列表 -->
		<scroll-view 
			class="chat-list" 
			scroll-y="true" 
			:scroll-top="scrollTop"
			:scroll-into-view="scrollIntoView"
			:show-scrollbar="false"
		>
			<!-- 欢迎界面 -->
			<view v-if="messageList.length === 0" class="welcome-container">
				<view class="welcome-content">
					<text class="welcome-title">欢迎使用智慧害虫AI问答助手</text>
					<text class="welcome-subtitle">我可以帮您识别各种害虫并提供专业建议，请详细描述您遇到的问题</text>		
				</view>
			</view>
			
			<view 
				v-for="(message, index) in messageList" 
				:key="index"
				:class="['message-item', message.type === 'user' ? 'user-message' : 'ai-message', isMessageHighlighted(message) ? 'highlighted-message' : '']"
				:id="'msg-' + index"
			>
				<view class="message-content">
					<view class="avatar">
						<image 
							:src="message.type === 'user' ? userAvatar : aiAvatar" 
							class="avatar-img"
						></image>
					</view>
					<view class="message-bubble">
						<!-- 引用内容显示 -->
						<text v-if="message.hasQuote" class="quote-content">{{ getQuoteContent(message.content) }}</text>
						<!-- 分隔线 -->
						<view v-if="message.hasQuote" class="quote-divider"></view>
						<text v-if="!message.image" class="message-text">{{ getMainContent(message.content) }}</text>
						<image v-if="message.image" :src="message.image" class="message-image" mode="aspectFit"></image>
						<text class="message-time">{{ message.time }}</text>
						
						<!-- AI消息的操作按钮 -->
						<view v-if="message.type === 'ai'" class="message-actions">
							<view class="action-btn" @tap="copyMessage(message.content)">
								<image src="/static/copy.png" class="action-icon"></image>
							</view>
							<view class="action-btn" @tap="quoteMessage(message)">
								<image src="/static/quote.png" class="action-icon"></image>
							</view>
							<view class="action-btn" @tap="toggleStar(message, index)">
								<image :src="message.starred ? '/static/stars.png' : '/static/star.png'" class="action-icon"></image>
							</view>
							<view class="action-btn" @tap="feedbackMessage(message)">
								<image src="/static/notification.png" class="action-icon"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载状态 -->
			<view v-if="isLoading" class="loading-message">
				<view class="message-content">
					<view class="avatar">
						<image :src="aiAvatar" class="avatar-img"></image>
					</view>
					<view class="message-bubble">
						<view class="typing-indicator">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 引用提示框 -->
		<view v-if="quotedMessage" class="quote-container">
			<view class="quote-content">
				<text class="quote-label">引用：</text>
				<text class="quote-text">{{ quotedMessage.content }}</text>
				<view class="quote-close" @tap="clearQuote">
					<text class="close-icon">×</text>
				</view>
			</view>
		</view>
		
		<!-- 底部输入区域 -->
		<view class="input-area">
			<view class="input-container">
				<input 
					class="message-input" 
					v-model="inputMessage" 
					placeholder="请输入您的问题..."
					:disabled="isLoading"
					@confirm="sendMessage"
				/>
				<button 
					class="send-btn" 
					:disabled="!inputMessage.trim() || isLoading"
					@tap="sendMessage"
				>
					<image src="/static/up.png" class="send-icon"></image>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { 
		sendAIMessage, 
		saveChatToBackend, 
		getSelectedChat, 
		copyMessage, 
		submitFeedback,
		getCurrentTime,
		getCurrentDateTime,
		generateChatId,
		getChatTitle
	} from './api.js';
	
	export default {
		data() {
			return {
				messageList: [], // 消息列表
				inputMessage: '', // 输入框内容
				isLoading: false, // 是否正在加载
				scrollTop: 0, // 滚动位置
				scrollIntoView: '', // 滚动到指定消息
				userAvatar: '/static/logo.png', // 用户头像
				aiAvatar: '/static/logo.png', // AI头像
				currentChatId: null, // 当前对话ID
				historyChats: [], // 历史对话列表
				searchKeyword: '', // 搜索关键词
				searchResults: [], // 搜索结果
				quotedMessage: null, // 引用的消息
			}
		},
		onLoad() {
			// 页面加载时初始化新对话状态
			this.messageList = [];
			this.currentChatId = generateChatId();
			this.inputMessage = '';
		},
		onShow() {
			// 检查是否有从历史页面传递过来的对话数据
			const selectedChat = getSelectedChat();
			if (selectedChat) {
				console.log('检测到历史对话数据:', selectedChat);
				this.loadChat(selectedChat);
			} else {
				// 如果没有选择历史对话，确保是新的对话状态
				if (this.messageList.length === 0) {
					this.currentChatId = generateChatId();
				}
			}
		},
		
		onHide() {
			// 页面隐藏时保存当前对话
			if (this.messageList.length > 0) {
				this.saveCurrentChat();
			}
		},
		methods: {
			// 显示历史侧边栏
			showHistorySidebar() {
				console.log('showHistorySidebar 被调用');
				// 跳转到历史页面
				uni.navigateTo({
					url: '/pages/chatAI/history'
				});
			},
			
			// 加载指定对话
			loadChat(chat) {
				console.log('加载历史对话:', chat);
				this.currentChatId = chat.id;
				this.messageList = [...chat.messages];
				this.$nextTick(() => {
					// 延迟滚动确保DOM完全渲染
					setTimeout(() => {
						this.scrollToBottom();
					}, 100);
				});
				
				// 显示加载成功提示
				uni.showToast({
					title: '对话加载成功',
					icon: 'success',
					duration: 1500
				});
			},
			
			// 显示历史对话列表
			showHistory() {
				uni.showToast({
					title: '历史对话功能开发中',
					icon: 'none'
				});
				// 这里可以跳转到历史对话页面或显示历史对话列表
			},
			
			// 创建新对话
			createNewChat() {
				// 如果当前有对话内容，询问是否保存
				if (this.messageList.length > 0) {
					uni.showModal({
						title: '创建新对话',
						content: '确定要开始新的对话吗？当前对话将被保存。',
						success: (res) => {
							if (res.confirm) {
								// 保存当前对话到历史记录
								this.saveCurrentChat();
								this.resetToNewChat();
							}
						}
					});
				} else {
					// 如果当前没有对话内容，直接创建新对话
					this.resetToNewChat();
				}
			},
			
			// 重置为新对话
			resetToNewChat() {
				this.messageList = [];
				// 生成新的对话ID，避免重复
				this.currentChatId = generateChatId();
				this.inputMessage = '';
				uni.showToast({
					title: '已创建新对话',
					icon: 'success'
				});
			},
			
			// 保存当前对话
			async saveCurrentChat() {
				if (this.messageList.length === 0) return;
				
				// 获取对话标题
				const title = getChatTitle(this.messageList);
				
				// 确保有唯一的对话ID
				const chatId = this.currentChatId || generateChatId();
				
				const newChat = {
					id: chatId,
					title: title,
					lastTime: getCurrentDateTime(),
					messages: [...this.messageList]
				};
				
				// 使用API保存对话到后端
				try {
					await saveChatToBackend(newChat);
					console.log('对话已保存到后端:', newChat);
				} catch (error) {
					console.error('保存对话失败:', error);
					uni.showToast({
						title: '保存失败，请检查网络',
						icon: 'none'
					});
				}
			},
			

			
			// 发送消息
			sendMessage() {
				if (!this.inputMessage.trim() || this.isLoading) {
					return;
				}
				
				// 如果有引用，将引用内容添加到消息中
				let messageContent = this.inputMessage;
				let hasQuote = false;
				if (this.quotedMessage) {
					messageContent = `引用：${this.quotedMessage.content}\n\n${this.inputMessage}`;
					hasQuote = true;
					// 清除引用
					this.quotedMessage = null;
				}
				
				// 添加用户消息
				this.addMessage({
					type: 'user',
					content: messageContent,
					time: this.getCurrentTime(),
					hasQuote: hasQuote
				});
				
				const userQuestion = this.inputMessage;
				this.inputMessage = '';
				
				// 显示加载状态
				this.isLoading = true;
				
				// 模拟AI回复（实际项目中应该调用真实的API）
				setTimeout(() => {
					this.getAIResponse(userQuestion);
				}, 1000);
			},
			
			// 获取AI回复
			async getAIResponse(question) {
				try {
					const response = await sendAIMessage({
						content: question,
						type: 'user',
						time: getCurrentTime()
					});
					
					if (response.success) {
						// 添加AI回复
						this.addMessage({
							type: 'ai',
							content: response.data.content,
							time: response.data.time
						});
					} else {
						uni.showToast({
							title: 'AI回复失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('AI回复错误:', error);
					uni.showToast({
						title: '网络连接失败',
						icon: 'none'
					});
				}
				
				this.isLoading = false;
				
				// 保存对话到历史记录
				this.saveCurrentChat();
			},
			
			// 添加消息到列表
			addMessage(message) {
				this.messageList.push(message);
				this.$nextTick(() => {
					// 延迟滚动确保新消息完全渲染
					setTimeout(() => {
						this.scrollToBottom();
					}, 100);
				});
			},
			
			// 滚动到底部
			scrollToBottom() {
				this.$nextTick(() => {
					// 使用scroll-into-view滚动到最后一个消息
					if (this.messageList.length > 0) {
						const lastIndex = this.messageList.length - 1;
						this.scrollIntoView = `msg-${lastIndex}`;
					} else {
						// 如果没有消息，滚动到顶部
						this.scrollTop = 0;
					}
				});
			},
			
			// 获取当前时间
			getCurrentTime() {
				return getCurrentTime();
			},
			
			// 获取当前日期时间
			getCurrentDateTime() {
				return getCurrentDateTime();
			},
			
			// 搜索输入处理
			onSearchInput() {
				if (this.searchKeyword.trim()) {
					this.performSearch();
				} else {
					this.clearSearch();
				}
			},
			
			// 执行搜索
			performSearch() {
				if (!this.searchKeyword.trim()) {
					this.clearSearch();
					return;
				}
				
				const keyword = this.searchKeyword.toLowerCase();
				this.searchResults = [];
				
				this.messageList.forEach((message, index) => {
					if (message.content && message.content.toLowerCase().includes(keyword)) {
						this.searchResults.push(index);
					}
				});
				
				if (this.searchResults.length > 0) {
					// 滚动到第一个搜索结果
					this.scrollToMessage(this.searchResults[0]);
					uni.showToast({
						title: `找到 ${this.searchResults.length} 个结果`,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '未找到相关内容',
						icon: 'none'
					});
				}
			},
			
			// 清除搜索
			clearSearch() {
				this.searchKeyword = '';
				this.searchResults = [];
			},
			
			// 检查消息是否高亮
			isMessageHighlighted(message) {
				if (!this.searchKeyword.trim()) return false;
				const index = this.messageList.indexOf(message);
				return this.searchResults.includes(index);
			},
			
			// 高亮搜索文本（已移除，改用CSS样式实现）
			highlightSearchText(text) {
				return text; // 直接返回原文本，使用CSS样式实现高亮
			},
			
			// 滚动到指定消息
			scrollToMessage(index) {
				this.$nextTick(() => {
					this.scrollIntoView = `msg-${index}`;
				});
			},
			
			// 复制消息内容
			async copyMessage(content) {
				try {
					await copyMessage(content);
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'success'
					});
				} catch (error) {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					});
				}
			},
			
			// 引用消息
			quoteMessage(message) {
				this.quotedMessage = message;
				uni.showToast({
					title: '已引用消息',
					icon: 'success'
				});
			},
			
			// 清除引用
			clearQuote() {
				this.quotedMessage = null;
			},
			
			// 切换收藏状态
			toggleStar(message, index) {
				// 使用Vue.set确保响应式更新
				this.$set(message, 'starred', !message.starred);
				
				uni.showToast({
					title: message.starred ? '已收藏' : '已取消收藏',
					icon: 'success'
				});
			},
			

			
			// 反馈消息
			async feedbackMessage(message) {
				uni.showActionSheet({
					itemList: ['有帮助', '无帮助', '内容错误', '其他问题'],
					success: async (res) => {
						const feedbackTypes = ['有帮助', '无帮助', '内容错误', '其他问题'];
						const selectedType = feedbackTypes[res.tapIndex];
						
						try {
							await submitFeedback({
								type: selectedType,
								message: message.content,
								chatId: this.currentChatId
							});
							
							uni.showToast({
								title: `感谢您的反馈：${selectedType}`,
								icon: 'success'
							});
						} catch (error) {
							console.error('提交反馈失败:', error);
							uni.showToast({
								title: '反馈提交失败',
								icon: 'none'
							});
						}
					}
				});
			},
			
			// 获取引用内容
			getQuoteContent(content) {
				if (content.includes('引用：')) {
					const parts = content.split('\n\n');
					if (parts.length > 1) {
						const quoteText = parts[0].replace('引用：', '');
						// 只显示前30个字符，确保一行显示
						return quoteText.length > 30 ? quoteText.substring(0, 30) + '...' : quoteText;
					}
				}
				return '';
			},
			
			// 获取主要内容
			getMainContent(content) {
				if (content.includes('引用：')) {
					const parts = content.split('\n\n');
					if (parts.length > 1) {
						return parts.slice(1).join('\n\n');
					}
				}
				return content;
			}
		}
	}
</script>

<style scoped>
	.chat-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f5f5f5;
		position: relative;
		width: 100%;
		box-sizing: border-box;
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
		.history-btn {
		width: 70rpx;
		height: 70rpx;
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	
	.history-btn:active {
		opacity: 0.7;
		transform: scale(0.95);
	}
	
	.history-icon {
		width: 50rpx;
		height: 50rpx;
		filter: brightness(0) saturate(0) invert(0.3);
	}
	
	.search-box {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 25rpx;
		padding: 20rpx 25rpx;
		border: 1rpx solid rgba(76, 175, 80, 0.2);
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
		color: #66BB6A;
	}
	
	.clear-btn {
		width: 40rpx;
		height: 40rpx;
		background-color: #66BB6A;
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
	
	.chat-list {
		flex: 1;
		padding: 30rpx 20rpx;
		overflow-y: auto;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	
	.welcome-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
		padding: 40rpx;
	}
	
	.welcome-content {
		text-align: center;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 20rpx;
		padding: 60rpx 40rpx;
		box-shadow: 0 4rpx 20rpx rgba(76, 175, 80, 0.15);
		max-width: 600rpx;
		border: 1rpx solid rgba(76, 175, 80, 0.1);
	}
	
	.welcome-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #2E7D32;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.welcome-subtitle {
		font-size: 28rpx;
		color: #4CAF50;
		margin-bottom: 40rpx;
		display: block;
	}
	
	.welcome-features {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.feature-item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		background: rgba(76, 175, 80, 0.1);
		border-radius: 15rpx;
		border: 1rpx solid rgba(76, 175, 80, 0.2);
	}
	
	.feature-text {
		font-size: 28rpx;
		color: #2E7D32;
	}
	
	.message-item {
		margin-bottom: 30rpx;
	}
	
	.message-content {
		display: flex;
		align-items: flex-start;
	}
	
	.user-message .message-content {
		flex-direction: row-reverse;
	}
	
	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 10rpx;
		border: 2rpx solid rgba(76, 175, 80, 0.2);
	}
	
	.avatar-img {
		width: 100%;
		height: 100%;
	}
	
	.message-bubble {
		max-width: 75%;
		padding: 25rpx 30rpx;
		border-radius: 20rpx;
		position: relative;
		word-wrap: break-word;
		word-break: break-word;
	}
	
	.user-message .message-bubble {
		background: linear-gradient(135deg, #cdecce 0%, #cdecce 0%);
		color: #333;
		border-bottom-right-radius: 5rpx;
		box-shadow: 0 4rpx 15rpx rgba(131, 212, 134, 0.2);
	}
	
	.user-message .quote-content {
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.7);
		line-height: 1.3;
		word-wrap: break-word;
		margin-bottom: 8rpx;
	}
	
	.ai-message .message-bubble {
		background: rgba(255, 255, 255, 0.95);
		color: rgba(0, 0, 0, 0.7);
		border-bottom-left-radius: 5rpx;
		box-shadow: 0 4rpx 15rpx rgba(76, 175, 80, 0.15);
		border: 1rpx solid rgba(76, 175, 80, 0.1);
	}
	
	.message-text {
		font-size: 32rpx;
		line-height: 1.6;
		word-wrap: break-word;
	}
	
	.message-image {
		max-width: 100%;
		max-height: 400rpx;
		border-radius: 10rpx;
		margin-bottom: 10rpx;
	}
	
	.message-time {
		font-size: 26rpx;
		opacity: 0.7;
		margin-top: 10rpx;
		display: block;
	}
	
	.loading-message {
		margin-bottom: 30rpx;
	}
	
	.typing-indicator {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
	}
	
	.dot {
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		background-color: #4CAF50;
		margin: 0 4rpx;
		animation: typing 1.4s infinite ease-in-out;
	}
	
	.dot:nth-child(1) {
		animation-delay: -0.32s;
	}
	
	.dot:nth-child(2) {
		animation-delay: -0.16s;
	}
	
	@keyframes typing {
		0%, 80%, 100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}
	
	.quote-container {
		background: rgba(255, 255, 255, 0.95);
		padding: 20rpx 40rpx;
		border-top: 1rpx solid rgba(76, 175, 80, 0.1);
		position: relative;
		z-index: 1;
	}
	
	.quote-content {
		display: flex;
		align-items: flex-start;
		background: rgba(76, 175, 80, 0.1);
		border-radius: 15rpx;
		padding: 20rpx;
		border: 1rpx solid rgba(76, 175, 80, 0.2);
		position: relative;
	}
	
	.quote-label {
		font-size: 24rpx;
		color: rgba(0, 0, 0, 0.7);
		font-weight: bold;
		margin-right: 15rpx;
		flex-shrink: 0;
	}
	
	.quote-text {
		font-size: 26rpx;
		color: rgba(0, 0, 0, 0.7);
		line-height: 1.4;
		flex: 1;
		word-wrap: break-word;
	}
	
	.quote-close {
		width: 40rpx;
		height: 40rpx;
		background: rgba(76, 175, 80, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 15rpx;
		flex-shrink: 0;
	}
	
	.close-icon {
		color: #4CAF50;
		font-size: 24rpx;
		font-weight: bold;
	}
	
	.input-area {
		background: rgba(255, 255, 255, 0.95);
		padding: 30rpx 40rpx;
		border-top: 1rpx solid rgba(76, 175, 80, 0.1);
		position: relative;
		z-index: 1;
	}
	
	.input-container {
		display: flex;
		align-items: center;
	}
	
	.new-chat-btn {
		width: 70rpx;
		height: 70rpx;
		background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
		border: none;
		outline: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border-radius: 30rpx;
		box-shadow: 0 4rpx 15rpx rgba(76, 175, 80, 0.3);
		transition: all 0.3s ease;
	}
	
	.new-chat-btn:active {
		transform: scale(0.95);
		opacity: 0.8;
	}
	
	.new-chat-btn[disabled] {
		opacity: 0.5;
		background: #ccc;
		box-shadow: none;
	}
	
	.new-chat-btn:focus {
		outline: none;
		border: none;
	}
	
	.new-chat-icon {
		width: 50rpx;
		height: 50rpx;
		filter: brightness(0) invert(1);
	}
	
	.message-input {
		flex: 1;
		height: 80rpx;
		padding: 0 25rpx;
		border: 1rpx solid rgba(76, 175, 80, 0.2);
		border-radius: 40rpx;
		font-size: 28rpx;
		background: rgba(255, 255, 255, 0.8);
		color: #000000;
	}
	
	.message-input::placeholder {
		color: #66BB6A;
	}
	
	.send-btn {
		margin-left: 20rpx;
		height: 70rpx;
		width: 70rpx;
		padding: 0;
		background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
		border-radius: 40rpx;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 15rpx rgba(76, 175, 80, 0.3);
	}
	
	.send-btn[disabled] {
		background: #ccc;
		box-shadow: none;
	}
	
	.send-icon {
		width: 50rpx;
		height: 50rpx;
		filter: brightness(0) invert(1);
	}
	
	.highlighted-message {
		background-color: rgba(255, 215, 0, 0.2);
		border: 2rpx solid #ffd700;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.3);
	}
	
	.highlighted-message .message-bubble {
		background-color: rgba(255, 215, 0, 0.1);
	}
	
	.message-actions {
		display: flex;
		align-items: center;
		margin-top: 15rpx;
		padding-top: 15rpx;
		border-top: 1rpx solid rgba(76, 175, 80, 0.1);
	}
	
	.action-btn {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		transition: all 0.3s ease;
	}
	
	.action-btn:active {
		transform: scale(0.9);
		opacity: 0.7;
	}
	
	.action-icon {
		width: 40rpx;
		height: 40rpx;
		filter: brightness(0) saturate(0) invert(0.3);
	}
	
	.quote-content {
		font-size: 28rpx;
		line-height: 1.3;
		word-wrap: break-word;
	}
	
	.quote-divider {
		height: 1rpx;
		background: rgba(0, 0, 0, 0.2);
		margin: 8rpx 0;
	}
</style>

