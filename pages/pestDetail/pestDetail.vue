<template>
	<view class="pest-detail">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">←</text>
			</view>
			<view class="nav-title">害虫详情</view>
			<view class="action-buttons">
				<view class="feedback-btn" @click="showFeedback">
					<text class="feedback-icon">📝</text>
				</view>
				<view class="favorite-btn" @click="toggleFavorite">
					<text class="favorite-icon" :class="{ active: isFavorite }">{{ isFavorite ? '❤️' : '🤍' }}</text>
				</view>
			</view>
		</view>
		
		<!-- 害虫基本信息 -->
		<view class="pest-header">
			<view class="pest-icon-large">🐛</view>
			<view class="pest-name">{{ pestInfo.name }}</view>
			<view class="pest-category">{{ category }}害虫</view>
		</view>
		
		<!-- 详细信息卡片 -->
		<view class="detail-cards">
			<!-- 危害方式卡片 -->
			<view class="detail-card">
				<view class="card-title">
					<text class="title-icon">⚠️</text>
					<text class="title-text">危害方式</text>
				</view>
				<view class="card-content">
					<text class="content-text">{{ pestInfo.harmType }}</text>
				</view>
			</view>
			
			<!-- 危害描述卡片 -->
			<view class="detail-card">
				<view class="card-title">
					<text class="title-icon">📝</text>
					<text class="title-text">危害描述</text>
				</view>
				<view class="card-content">
					<text class="content-text">{{ pestInfo.description }}</text>
				</view>
			</view>
			
			<!-- 防治方法卡片 -->
			<view class="detail-card">
				<view class="card-title">
					<text class="title-icon">🛡️</text>
					<text class="title-text">防治方法</text>
				</view>
				<view class="card-content">
					<view class="method-item" v-for="(method, index) in preventionMethods" :key="index">
						<text class="method-number">{{ index + 1 }}</text>
						<text class="method-text">{{ method }}</text>
					</view>
				</view>
			</view>
			
			<!-- 识别特征卡片 -->
			<view class="detail-card">
				<view class="card-title">
					<text class="title-icon">🔍</text>
					<text class="title-text">识别特征</text>
				</view>
				<view class="card-content">
					<view class="feature-item" v-for="(feature, index) in identificationFeatures" :key="index">
						<text class="feature-dot">•</text>
						<text class="feature-text">{{ feature }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pestInfo: {},
				category: '',
				preventionMethods: [],
				identificationFeatures: [],
				isFavorite: false
			}
		},
		onLoad(options) {
			// 解析传递的参数
			if (options.pest) {
				this.pestInfo = JSON.parse(decodeURIComponent(options.pest));
			}
			if (options.category) {
				this.category = decodeURIComponent(options.category);
			}
			
			// 根据害虫名称设置防治方法和识别特征
			this.setPestDetails();
			
			// 检查是否已收藏
			this.checkFavoriteStatus();
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			toggleFavorite() {
				this.isFavorite = !this.isFavorite;
				
				// 获取当前收藏列表
				let favorites = uni.getStorageSync('pest_favorites') || [];
				
				if (this.isFavorite) {
					// 添加到收藏
					const favoriteItem = {
						name: this.pestInfo.name,
						category: this.category,
						harmType: this.pestInfo.harmType,
						description: this.pestInfo.description,
						timestamp: Date.now()
					};
					
					// 检查是否已经收藏过
					const existingIndex = favorites.findIndex(item => item.name === this.pestInfo.name);
					if (existingIndex === -1) {
						favorites.push(favoriteItem);
						uni.showToast({
							title: '已添加到收藏',
							icon: 'success'
						});
					}
				} else {
					// 取消收藏
					favorites = favorites.filter(item => item.name !== this.pestInfo.name);
					uni.showToast({
						title: '已取消收藏',
						icon: 'none'
					});
				}
				
				// 保存到本地存储
				uni.setStorageSync('pest_favorites', favorites);
			},
			checkFavoriteStatus() {
				const favorites = uni.getStorageSync('pest_favorites') || [];
				this.isFavorite = favorites.some(item => item.name === this.pestInfo.name);
			},
			showFeedback() {
				uni.showActionSheet({
					itemList: ['信息错误', '信息不完整', '其他错误'],
					success: (res) => {
						const feedbackTypes = ['信息错误', '信息不完整', '其他错误'];
						const selectedType = feedbackTypes[res.tapIndex];
						this.showFeedbackInput(selectedType);
					},
					fail: () => {
						console.log('用户取消选择');
					}
				});
			},
			showFeedbackInput(type) {
				uni.showModal({
					title: `反馈${type}`,
					content: '请输入具体的问题描述：',
					editable: true,
					placeholderText: '请详细描述您发现的问题...',
					success: (res) => {
						if (res.confirm && res.content) {
							this.submitFeedback(type, res.content);
						} else if (res.confirm && !res.content) {
							uni.showToast({
								title: '请输入反馈内容',
								icon: 'none'
							});
						}
					}
				});
			},
			submitFeedback(type, content) {
				const feedbackData = {
					pestName: this.pestInfo.name,
					category: this.category,
					feedbackType: type,
					content: content,
					timestamp: Date.now(),
					userAgent: navigator.userAgent || 'unknown'
				};
				
				// 获取现有反馈数据
				let feedbacks = uni.getStorageSync('pest_feedbacks') || [];
				feedbacks.push(feedbackData);
				
				// 保存反馈数据
				uni.setStorageSync('pest_feedbacks', feedbacks);
				
				// 显示成功提示
				uni.showToast({
					title: '反馈已提交',
					icon: 'success',
					duration: 2000
				});
				
				// 可以在这里添加发送到服务器的逻辑
				console.log('反馈数据:', feedbackData);
			},
			setPestDetails() {
				// 根据害虫名称设置具体的防治方法和识别特征
				const pestDetails = {
					'二星蝽': {
						preventionMethods: [
							'及时清除果园杂草，减少虫源',
							'使用黄色粘虫板诱杀成虫',
							'喷施高效低毒农药如吡虫啉',
							'加强果园管理，提高树体抗性'
						],
						identificationFeatures: [
							'成虫体长8-10毫米，黄褐色',
							'前胸背板有2个黑色圆斑',
							'若虫体色较浅，有黑色斑点',
							'常群集在果实表面吸食汁液'
						]
					},
					'小绿叶蝉': {
						preventionMethods: [
							'清除果园周边杂草',
							'使用蓝色粘虫板诱杀',
							'喷施阿维菌素等药剂',
							'加强果园通风透光'
						],
						identificationFeatures: [
							'成虫体长3-4毫米，淡绿色',
							'头部有淡黄色条纹',
							'若虫体色较浅，善跳跃',
							'危害叶片，传播病毒病'
						]
					},
					'桃蛀螟': {
						preventionMethods: [
							'及时清除落果和病果',
							'使用性诱剂诱杀成虫',
							'喷施氯虫苯甲酰胺等药剂',
							'果实套袋保护'
						],
						identificationFeatures: [
							'成虫体长10-12毫米，灰褐色',
							'前翅有黑色斑纹',
							'幼虫蛀食果实内部',
							'果实表面有蛀孔和虫粪'
						]
					},
					'桑天牛': {
						preventionMethods: [
							'及时清除被害树木',
							'人工捕杀成虫',
							'树干涂白防止产卵',
							'使用天牛诱捕器'
						],
						identificationFeatures: [
							'成虫体长25-35毫米，黑色',
							'鞘翅有云状斑纹',
							'幼虫蛀食树干木质部',
							'树干有蛀孔和木屑'
						]
					},
					'红颈天牛': {
						preventionMethods: [
							'及时清除被害树木',
							'人工捕杀成虫',
							'树干涂白防止产卵',
							'使用天牛诱捕器'
						],
						identificationFeatures: [
							'成虫体长25-35毫米，黑色',
							'前胸背板红色',
							'幼虫蛀食树干木质部',
							'树干有蛀孔和木屑'
						]
					},
					'茶翅蝽': {
						preventionMethods: [
							'及时清除果园杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强果园管理'
						],
						identificationFeatures: [
							'成虫体长12-15毫米，茶褐色',
							'前胸背板有茶色斑纹',
							'若虫体色较浅',
							'危害果实造成畸形'
						]
					},
					'绿刺蛾（幼虫）': {
						preventionMethods: [
							'人工摘除虫茧',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长20-25毫米，绿色',
							'体表有刺毛',
							'群集危害叶片',
							'叶片被啃食成缺刻'
						]
					},
					'扁刺蛾（幼虫）': {
						preventionMethods: [
							'人工摘除虫茧',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长18-22毫米，绿色',
							'体表有刺毛',
							'群集危害叶片',
							'叶片被啃食成缺刻'
						]
					},
					'玉带凤蝶（幼虫）': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长30-40毫米，绿色',
							'体表有白色条纹',
							'危害柑橘叶片',
							'叶片被啃食成缺刻'
						]
					},
					'斑须蝽若虫': {
						preventionMethods: [
							'及时清除果园杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强果园管理'
						],
						identificationFeatures: [
							'若虫体长5-8毫米，黄褐色',
							'体表有黑色斑点',
							'群集危害嫩梢',
							'吸食植物汁液'
						]
					},
					'云斑天牛': {
						preventionMethods: [
							'及时清除被害树木',
							'人工捕杀成虫',
							'树干涂白防止产卵',
							'使用天牛诱捕器'
						],
						identificationFeatures: [
							'成虫体长25-35毫米，黑色',
							'鞘翅有云状斑纹',
							'幼虫蛀食树干木质部',
							'树干有蛀孔和木屑'
						]
					},
					'光肩星天牛': {
						preventionMethods: [
							'及时清除被害树木',
							'人工捕杀成虫',
							'树干涂白防止产卵',
							'使用天牛诱捕器'
						],
						identificationFeatures: [
							'成虫体长20-30毫米，黑色',
							'鞘翅有白色斑点',
							'幼虫蛀食树干木质部',
							'树干有蛀孔和木屑'
						]
					},
					'墨天牛': {
						preventionMethods: [
							'及时清除被害树木',
							'人工捕杀成虫',
							'树干涂白防止产卵',
							'使用天牛诱捕器'
						],
						identificationFeatures: [
							'成虫体长25-35毫米，黑色',
							'鞘翅有墨色斑纹',
							'幼虫蛀食树干木质部',
							'树干有蛀孔和木屑'
						]
					},
					'美国白蛾': {
						preventionMethods: [
							'人工剪除网幕',
							'使用性诱剂诱杀',
							'喷施苏云金杆菌制剂',
							'释放天敌昆虫'
						],
						identificationFeatures: [
							'成虫体长12-15毫米，白色',
							'幼虫群集结网',
							'网幕内有大量幼虫',
							'危害多种阔叶树'
						]
					},
					'二尾舟蛾（幼虫）': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长25-35毫米，绿色',
							'尾部有2个突起',
							'危害杨树、柳树叶片',
							'叶片被啃食成缺刻'
						]
					},
					'扇舟蛾': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'成虫体长15-20毫米，灰褐色',
							'前翅有扇状斑纹',
							'幼虫危害杨树、栎树',
							'叶片被啃食成缺刻'
						]
					},
					'黑蚱蝉': {
						preventionMethods: [
							'及时清除被害树木',
							'人工捕杀成虫',
							'树干涂白防止产卵',
							'使用蝉诱捕器'
						],
						identificationFeatures: [
							'成虫体长35-45毫米，黑色',
							'若虫地下危害根系',
							'成虫产卵损伤枝条',
							'危害多种林木'
						]
					},
					'稻棘缘蝽': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长8-10毫米，黄褐色',
							'前胸背板有棘状突起',
							'危害水稻穗部',
							'造成秕谷'
						]
					},
					'菜蝽': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长8-12毫米，黄褐色',
							'前胸背板有黑色斑纹',
							'危害十字花科蔬菜',
							'吸食植物汁液'
						]
					},
					'三齿剑纹夜蛾幼虫': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长25-35毫米，绿色',
							'体表有剑状斑纹',
							'危害大豆、花生等',
							'叶片被啃食成缺刻'
						]
					},
					'菜粉蝶（幼虫）': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长20-30毫米，绿色',
							'体表有细毛',
							'危害甘蓝、白菜等',
							'叶片被啃食成缺刻'
						]
					},
					'蝼蛄': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用毒饵诱杀',
							'深耕翻土',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长25-35毫米，褐色',
							'前足发达，善挖掘',
							'地下危害根系',
							'危害小麦、玉米幼苗'
						]
					},
					'赤条蝽': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长8-12毫米，黄褐色',
							'体表有赤色条纹',
							'危害豆类、瓜类作物',
							'吸食植物汁液'
						]
					},
					'麻皮蝽': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长10-15毫米，黄褐色',
							'体表有麻点状斑纹',
							'多食性，危害多种作物',
							'吸食植物汁液'
						]
					},
					'八点广翅蜡蝉': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长8-10毫米，黄褐色',
							'前翅有8个黑色斑点',
							'危害月季、紫薇等',
							'吸食嫩枝汁液'
						]
					},
					'斑衣蜡蝉': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长10-12毫米，黄褐色',
							'前翅有斑衣状斑纹',
							'危害臭椿、海棠、樱花等',
							'吸食植物汁液'
						]
					},
					'碧蛾蜡蝉': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长8-10毫米，碧绿色',
							'前翅有蛾状斑纹',
							'危害桂花、茶花等',
							'吸食叶片汁液'
						]
					},
					'白星花金龟': {
						preventionMethods: [
							'及时清除田间杂草',
							'使用黄色粘虫板诱杀',
							'喷施高效低毒农药',
							'加强田间管理'
						],
						identificationFeatures: [
							'成虫体长15-20毫米，黑色',
							'鞘翅有白色星点',
							'危害月季、菊花等',
							'啃食花瓣'
						]
					},
					'红缘灯蛾（幼虫）': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长25-35毫米，黑色',
							'体侧有红色条纹',
							'危害菊花、一串红等',
							'叶片被啃食成缺刻'
						]
					},
					'柳蓝叶甲': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'成虫体长5-8毫米，蓝色',
							'幼虫危害柳树、杨树叶片',
							'成虫和幼虫都危害叶片',
							'叶片被啃食成缺刻'
						]
					},
					'旋目夜蛾（幼虫）': {
						preventionMethods: [
							'人工摘除虫卵和幼虫',
							'喷施苏云金杆菌制剂',
							'使用性诱剂诱杀成虫',
							'保护天敌昆虫'
						],
						identificationFeatures: [
							'幼虫体长25-35毫米，绿色',
							'体表有旋目状斑纹',
							'危害悬铃木、紫薇等',
							'叶片被啃食成缺刻'
						]
					}
				};
				
				// 设置默认值
				const defaultMethods = [
					'加强田间管理，及时清除病残体',
					'使用生物农药进行防治',
					'合理使用化学农药',
					'采用综合防治措施'
				];
				
				const defaultFeatures = [
					'根据害虫形态特征进行识别',
					'观察危害症状和部位',
					'结合发生规律判断',
					'必要时请专家鉴定'
				];
				
				const details = pestDetails[this.pestInfo.name] || {};
				this.preventionMethods = details.preventionMethods || defaultMethods;
				this.identificationFeatures = details.identificationFeatures || defaultFeatures;
			}
		}
	}
</script>

<style scoped>
.pest-detail {
	min-height: 100vh;
	background: #f5f5f5;
}

.nav-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background: #ffffff;
	border-bottom: 1px solid #e0e0e0;
	position: sticky;
	top: 0;
	z-index: 100;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #f0f0f0;
	margin-right: 20rpx;
}

.back-icon {
	font-size: 32rpx;
	color: #333;
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	text-align: center;
}

.action-buttons {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.feedback-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #f0f0f0;
	transition: all 0.3s ease;
}

.feedback-btn:hover {
	background: #74c865;
	transform: scale(1.1);
}

.feedback-icon {
	font-size: 28rpx;
	transition: all 0.3s ease;
}

.favorite-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #f0f0f0;
	transition: all 0.3s ease;
}

.favorite-btn:hover {
	background: #ff6b6b;
	transform: scale(1.1);
}

.favorite-icon {
	font-size: 32rpx;
	transition: all 0.3s ease;
}

.favorite-icon.active {
	animation: heartBeat 0.6s ease-in-out;
}

@keyframes heartBeat {
	0% { transform: scale(1); }
	50% { transform: scale(1.3); }
	100% { transform: scale(1); }
}

.pest-header {
	background: linear-gradient(135deg, #aaeb9f 0%, #74c865 100%);
	padding: 60rpx 40rpx;
	text-align: center;
	color: #ffffff;
}

.pest-icon-large {
	font-size: 120rpx;
	margin-bottom: 20rpx;
}

.pest-name {
	font-size: 48rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.pest-category {
	font-size: 28rpx;
	opacity: 0.9;
}

.detail-cards {
	padding: 30rpx;
}

.detail-card {
	background: #ffffff;
	border-radius: 16rpx;
	margin-bottom: 30rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-title {
	display: flex;
	align-items: center;
	margin-bottom: 25rpx;
}

.title-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
}

.title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.card-content {
	color: #666;
	line-height: 1.6;
}

.content-text {
	font-size: 28rpx;
	color: #666;
}

.method-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.method-number {
	width: 40rpx;
	height: 40rpx;
	background: #74c865;
	color: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: bold;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.method-text {
	font-size: 28rpx;
	color: #666;
	flex: 1;
}

.feature-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 15rpx;
}

.feature-dot {
	color: #74c865;
	font-size: 32rpx;
	margin-right: 15rpx;
	flex-shrink: 0;
}

.feature-text {
	font-size: 28rpx;
	color: #666;
	flex: 1;
}
</style> 