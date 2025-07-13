<template>
	<view class="chat-container">

		
		<!-- 顶部标题栏 -->
		<view class="header">
			<view class="header-left">
				<view class="header-btn" @tap="showHistorySidebar">
					<view class="hamburger-icon">
						<view class="line"></view>
						<view class="line"></view>
					</view>
				</view>
			</view>
			<view class="header-center">
				<text class="title">智慧害虫AI问答助手</text>
			</view>
			<view class="header-right">
				<view class="header-btn" @tap="createNewChat">
					<text class="header-icon">+</text>
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
					placeholder="搜索对话内容..."
					@input="onSearchInput"
					@confirm="performSearch"
				/>
				<view v-if="searchKeyword" class="clear-btn" @tap="clearSearch">
					<text class="clear-icon">×</text>
				</view>
			</view>
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
					<text class="welcome-subtitle">我可以帮您识别各种害虫并提供专业建议</text>
					<view class="welcome-features">
						<view class="feature-item">
							<text class="feature-text">智能识别害虫</text>
						</view>
						<view class="feature-item">
							<text class="feature-text">专业防治建议</text>
						</view>
						<view class="feature-item">
							<text class="feature-text">拍照上传识别</text>
						</view>
					</view>
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
						<text v-if="!message.image" class="message-text">{{ message.content }}</text>
						<image v-if="message.image" :src="message.image" class="message-image" mode="aspectFit"></image>
						<text class="message-time">{{ message.time }}</text>
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
		
		<!-- 底部输入区域 -->
		<view class="input-area">
			<view class="input-container">
				<button 
					class="plus-btn" 
					@tap="showImageOptions"
					:disabled="isLoading"
				>
					<text class="plus-icon">+</text>
				</button>
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
					发送
				</button>
			</view>
		</view>
	</view>
</template>

<script>
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
			}
		},
		onLoad() {
			// 页面加载时初始化新对话状态
			this.messageList = [];
			this.currentChatId = 'chat' + Date.now();
			this.inputMessage = '';
		},
		onShow() {
			// 检查是否有从历史页面传递过来的对话数据
			const selectedChat = uni.getStorageSync('selectedChat');
			if (selectedChat) {
				console.log('检测到历史对话数据:', selectedChat);
				this.loadChat(selectedChat);
				uni.removeStorageSync('selectedChat');
			} else {
				// 如果没有选择历史对话，确保是新的对话状态
				if (this.messageList.length === 0) {
					this.currentChatId = 'chat' + Date.now();
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
				this.currentChatId = 'chat' + Date.now();
				this.inputMessage = '';
				uni.showToast({
					title: '已创建新对话',
					icon: 'success'
				});
			},
			
			// 保存当前对话
			saveCurrentChat() {
				if (this.messageList.length === 0) return;
				
				// 获取对话标题（使用第一条用户消息）
				const userMessages = this.messageList.filter(msg => msg.type === 'user');
				let title = '新对话';
				if (userMessages.length > 0) {
					const firstUserMessage = userMessages[0];
					title = firstUserMessage.content.length > 20 
						? firstUserMessage.content.substring(0, 20) + '...' 
						: firstUserMessage.content;
				}
				
				// 确保有唯一的对话ID
				const chatId = this.currentChatId || 'chat' + Date.now();
				
				let historyChats = uni.getStorageSync('historyChats') || [];
				const existingChat = historyChats.find(chat => chat.id === chatId);
				
				// 检查是否有新消息
				let hasNewMessages = false;
				let lastTime = this.getCurrentDateTime();
				
				if (existingChat) {
					// 如果对话已存在，检查消息数量是否增加
					if (this.messageList.length > existingChat.messages.length) {
						hasNewMessages = true;
						lastTime = this.getCurrentDateTime(); // 有新消息时更新时间
					} else {
						// 没有新消息，保持原时间
						lastTime = existingChat.lastTime;
					}
				} else {
					// 新对话，使用当前时间
					hasNewMessages = true;
				}
				
				const newChat = {
					id: chatId,
					title: title,
					lastTime: lastTime,
					messages: [...this.messageList]
				};
				
				const existingIndex = historyChats.findIndex(chat => chat.id === chatId);
				
				if (existingIndex >= 0) {
					// 更新现有对话
					historyChats[existingIndex] = newChat;
					
					// 只有在有新消息时才重新排序
					if (hasNewMessages) {
						// 将更新的对话移到最前面
						historyChats.splice(existingIndex, 1);
						historyChats.unshift(newChat);
					}
				} else {
					// 添加新对话到最前面
					historyChats.unshift(newChat);
				}
				
				uni.setStorageSync('historyChats', historyChats);
				console.log('对话已保存:', newChat, '有新消息:', hasNewMessages);
			},
			
			// 显示图片选择选项
			showImageOptions() {
				uni.showActionSheet({
					itemList: ['拍照', '从相册选择'],
					success: (res) => {
						if (res.tapIndex === 0) {
							this.takePhoto();
						} else if (res.tapIndex === 1) {
							this.chooseImage();
						}
					}
				});
			},
			
			// 拍照
			takePhoto() {
				uni.chooseImage({
					count: 1,
					sourceType: ['camera'],
					success: (res) => {
						this.handleImageSelected(res.tempFilePaths[0]);
					},
					fail: (err) => {
						console.log('拍照失败:', err);
						uni.showToast({
							title: '拍照失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 从相册选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success: (res) => {
						this.handleImageSelected(res.tempFilePaths[0]);
					},
					fail: (err) => {
						console.log('选择图片失败:', err);
						uni.showToast({
							title: '选择图片失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 处理选中的图片
			handleImageSelected(imagePath) {
				// 添加用户图片消息
				this.addMessage({
					type: 'user',
					content: '[图片]',
					time: this.getCurrentTime(),
					image: imagePath
				});
				
				// 显示加载状态
				this.isLoading = true;
				
				// 模拟AI识别回复
				setTimeout(() => {
					this.getImageAnalysis(imagePath);
				}, 1500);
			},
			
			// 获取图片分析结果
			getImageAnalysis(imagePath) {
				// 这里应该调用真实的AI图像识别API
				// 目前使用模拟回复
				const responses = [
					'根据图片分析，这可能是某种害虫。建议您采取相应的防治措施。',
					'图片中的害虫特征明显，建议使用专业杀虫剂进行处理。',
					'这看起来像是常见的农业害虫，需要及时防治以避免扩散。'
				];
				
				const randomResponse = responses[Math.floor(Math.random() * responses.length)];
				
				// 添加AI回复
				this.addMessage({
					type: 'ai',
					content: randomResponse,
					time: this.getCurrentTime()
				});
				
				this.isLoading = false;
				
				// 保存对话到历史记录
				this.saveCurrentChat();
			},
			
			// 发送消息
			sendMessage() {
				if (!this.inputMessage.trim() || this.isLoading) {
					return;
				}
				
				// 添加用户消息
				this.addMessage({
					type: 'user',
					content: this.inputMessage,
					time: this.getCurrentTime()
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
			getAIResponse(question) {
				// 这里应该调用真实的AI API
				// 目前使用模拟回复
				let response = '';
				
				if (question.includes('识别') || question.includes('害虫')) {
					response = '我可以帮您识别各种害虫。请上传害虫图片，我会为您分析害虫类型并提供防治建议。';
				} else if (question.includes('防治') || question.includes('处理')) {
					response = '针对不同害虫，我们有不同的防治方法。建议您先上传害虫图片进行识别，然后我会为您提供具体的防治方案。';
				} else if (question.includes('图片') || question.includes('上传')) {
					response = '您可以通过点击输入框旁边的加号按钮来上传害虫图片。支持拍照和从相册选择图片。';
				} else {
					response = '我是专业的害虫识别助手，可以帮您识别害虫、提供防治建议。请告诉我您需要什么帮助，或者上传害虫图片进行识别。';
				}
				
				// 添加AI回复
				this.addMessage({
					type: 'ai',
					content: response,
					time: this.getCurrentTime()
				});
				
				this.isLoading = false;
				
				// 保存对话到历史记录（只有在有新消息时才更新）
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
				const now = new Date();
				const hours = now.getHours().toString().padStart(2, '0');
				const minutes = now.getMinutes().toString().padStart(2, '0');
				return `${hours}:${minutes}`;
			},
			
			// 获取当前日期时间
			getCurrentDateTime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1).toString().padStart(2, '0');
				const day = now.getDate().toString().padStart(2, '0');
				const hours = now.getHours().toString().padStart(2, '0');
				const minutes = now.getMinutes().toString().padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}`;
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
			}
		}
	}
</script>

<style scoped>
	.chat-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		position: relative;
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
	
	.header-btn {
		width: 60rpx;
		height: 60rpx;
		background: rgba(255,255,255,0.2);
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.header-btn:active {
		background: rgba(255,255,255,0.3);
		transform: scale(0.95);
	}
	
	.header-icon {
		color: white;
		font-size: 28rpx;
	}
	
	.hamburger-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 4rpx;
	}
	
	.line {
		width: 24rpx;
		height: 3rpx;
		background-color: #333;
		border-radius: 2rpx;
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
	
	.chat-list {
		flex: 1;
		padding: 20rpx;
		overflow-y: auto;
		width: 100%;
		box-sizing: border-box;
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
		background: white;
		border-radius: 20rpx;
		padding: 60rpx 40rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
		max-width: 600rpx;
	}
	
	.welcome-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.welcome-subtitle {
		font-size: 28rpx;
		color: #666;
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
		background: #f8f8f8;
		border-radius: 15rpx;
	}
	
	.feature-text {
		font-size: 28rpx;
		color: #333;
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
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 20rpx;
	}
	
	.avatar-img {
		width: 100%;
		height: 100%;
	}
	
	.message-bubble {
		max-width: 70%;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		position: relative;
		word-wrap: break-word;
		word-break: break-word;
	}
	
	.user-message .message-bubble {
		background-color: #4CAF50;
		color: white;
		border-bottom-right-radius: 5rpx;
	}
	
	.ai-message .message-bubble {
		background-color: white;
		color: #333;
		border-bottom-left-radius: 5rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}
	
	.message-text {
		font-size: 28rpx;
		line-height: 1.5;
		word-wrap: break-word;
	}
	
	.message-image {
		max-width: 100%;
		max-height: 400rpx;
		border-radius: 10rpx;
		margin-bottom: 10rpx;
	}
	
	.message-time {
		font-size: 24rpx;
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
		background-color: #999;
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
	
	.input-area {
		background-color: white;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #e0e0e0;
	}
	
	.input-container {
		display: flex;
		align-items: center;
	}
	
	.plus-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: white;
		border: 2rpx solid #4CAF50;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}
	
	.plus-btn[disabled] {
		background-color: #ccc;
	}
	
	.plus-icon {
		color: #4CAF50;
		font-size: 40rpx;
		font-weight: bold;
	}
	
	.message-input {
		flex: 1;
		height: 80rpx;
		padding: 0 20rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 40rpx;
		font-size: 28rpx;
		background-color: #f9f9f9;
	}
	
	.send-btn {
		margin-left: 20rpx;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 40rpx;
		background-color: #4CAF50;
		color: white;
		border-radius: 40rpx;
		font-size: 28rpx;
		border: none;
	}
	
	.send-btn[disabled] {
		background-color: #ccc;
		color: #999;
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
</style>

