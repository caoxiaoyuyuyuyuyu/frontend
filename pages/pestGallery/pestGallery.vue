<template>
	<view class="pest-gallery">
		<!-- 顶部图片区域 -->
		<view class="image-area">
			<!-- 这里放置您准备的图片 -->
		</view>
		
		<!-- 分类导航栏 -->
		<view class="category-nav">
			<view class="category-item" :class="{ active: activeCategory === '热度榜' }" @click="selectCategory('热度榜')">
				<text class="category-name">害虫热度榜</text>
			</view>
			<view class="category-item dropdown" :class="{ active: activeCategory === '危害方式' }" @click="toggleDropdown">
				<text class="category-name">{{ selectedSubCategory || '危害方式' }}</text>
				<text class="dropdown-arrow">▼</text>
				<!-- 下拉菜单 -->
				<view class="dropdown-menu" v-if="showDropdown">
					<view class="dropdown-item" v-for="(item, index) in dropdownItems" :key="index" @click.stop="selectDropdownItem(item)">
						<text class="dropdown-text">{{ item }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-area">
			<!-- 热度榜内容 -->
			<view v-if="activeCategory === '热度榜'" class="hot-list">
				<view class="section-title">害虫热度榜</view>
				<view class="pest-list">
					<view class="pest-item" v-for="(pest, index) in hotPests" :key="index" @click="showHotPestDetail(pest)">
						<view class="pest-rank">{{ index + 1 }}</view>
						<view class="pest-info">
							<view class="pest-name">{{ pest.name }}</view>
							<view class="pest-desc">{{ pest.description }}</view>
						</view>
						<view class="pest-score">{{ pest.searchCount }}次</view>
					</view>
				</view>
			</view>
			
			<!-- 危害方式内容 -->
			<view v-if="activeCategory === '危害方式' && selectedSubCategory" class="harm-category">
				<view class="section-title">{{ selectedSubCategory }}害虫</view>
				<view class="pest-grid">
					<view class="pest-card" v-for="(pest, index) in currentPests" :key="index" @click="showPestDetail(pest)">
						<view class="pest-image">
							<text class="pest-icon">🐛</text>
						</view>
						<view class="pest-card-info">
							<view class="pest-card-name">{{ pest.name }}</view>
							<view class="pest-card-desc">{{ pest.harmType }}</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 默认提示 -->
			<view v-else-if="activeCategory === '危害方式' && !selectedSubCategory" class="default-content">
				<text class="placeholder-text">请选择上方分类查看相关内容</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeCategory: '热度榜',
				showDropdown: false,
				dropdownItems: ['果树', '林业', '农作物', '园林花卉', '多食性/广食性'],
				selectedSubCategory: '',
				// 热度榜数据
				hotPests: [
					{ name: '美国白蛾', description: '林业+园林，100+寄主', searchCount: 15842, harmType: '食叶', category: '林业' },
					{ name: '二星蝽', description: '吸食果汁，导致果实畸形', searchCount: 12456, harmType: '吸食果汁', category: '果树' },
					{ name: '云斑天牛', description: '蛀干，危害杨树、柳树、核桃等', searchCount: 9876, harmType: '蛀干', category: '林业' },
					{ name: '菜粉蝶（幼虫）', description: '菜青虫，主要危害甘蓝、白菜等', searchCount: 8765, harmType: '食叶', category: '农作物' },
					{ name: '桃蛀螟', description: '蛀食桃、李、梨等果实', searchCount: 7654, harmType: '蛀食果实', category: '果树' },
					{ name: '稻棘缘蝽', description: '吸食水稻穗部，造成秕谷', searchCount: 6543, harmType: '吸食穗部', category: '农作物' },
					{ name: '麻皮蝽', description: '多食性，危害大豆、玉米、蔬菜等', searchCount: 5432, harmType: '多食性', category: '多食性/广食性' },
					{ name: '茶翅蝽', description: '吸食梨、苹果等果实，造成"鬼头果"', searchCount: 4321, harmType: '吸食果实', category: '果树' },
					{ name: '绿刺蛾（幼虫）', description: '食叶，危害苹果、梨、枣等', searchCount: 3210, harmType: '食叶', category: '果树' },
					{ name: '八点广翅蜡蝉', description: '吸食月季、紫薇等嫩枝', searchCount: 2109, harmType: '吸食嫩枝', category: '园林花卉' }
				],
				// 各分类害虫数据
				pestData: {
					'果树': [
						{ name: '二星蝽', harmType: '吸食果汁', description: '导致果实畸形，危害苹果、梨、桃、柑橘、葡萄、枣等果树' },
						{ name: '小绿叶蝉', harmType: '危害叶片，传播病毒', description: '危害桃、葡萄等叶片，传播病毒' },
						{ name: '桃蛀螟', harmType: '蛀食果实', description: '蛀食桃、李、梨等果实' },
						{ name: '桑天牛', harmType: '蛀干', description: '蛀干，危害苹果、梨、桑树等' },
						{ name: '红颈天牛', harmType: '蛀干', description: '蛀干，主要危害桃、杏、樱桃等核果类' },
						{ name: '茶翅蝽', harmType: '吸食果实', description: '吸食梨、苹果等果实，造成"鬼头果"' },
						{ name: '绿刺蛾（幼虫）', harmType: '食叶', description: '食叶，危害苹果、梨、枣等' },
						{ name: '扁刺蛾（幼虫）', harmType: '食叶', description: '食叶，危害柑橘、苹果等' },
						{ name: '玉带凤蝶（幼虫）', harmType: '食叶', description: '主要危害柑橘叶片' },
						{ name: '斑须蝽若虫', harmType: '吸食嫩梢', description: '吸食苹果、梨等嫩梢' }
					],
					'林业': [
						{ name: '云斑天牛', harmType: '蛀干', description: '蛀干，危害杨树、柳树、核桃等' },
						{ name: '光肩星天牛', harmType: '蛀干', description: '蛀干，主要危害杨树、柳树' },
						{ name: '墨天牛', harmType: '蛀干', description: '蛀干，危害松树、柏树等针叶林' },
						{ name: '桑天牛', harmType: '蛀干', description: '蛀干，也危害桑树、苹果等' },
						{ name: '美国白蛾', harmType: '食叶', description: '食叶，危害杨树、柳树、法桐等100+树种' },
						{ name: '二尾舟蛾（幼虫）', harmType: '食叶', description: '食叶，危害杨树、柳树' },
						{ name: '扇舟蛾', harmType: '食叶', description: '食叶，危害杨树、栎树等' },
						{ name: '黑蚱蝉', harmType: '地下危害根系', description: '若虫地下危害根系，成虫产卵损伤枝条' }
					],
					'农作物': [
						{ name: '稻棘缘蝽', harmType: '吸食穗部', description: '吸食水稻穗部，造成秕谷' },
						{ name: '菜蝽', harmType: '危害蔬菜', description: '危害十字花科蔬菜如白菜、油菜' },
						{ name: '三齿剑纹夜蛾幼虫', harmType: '食叶', description: '食叶，危害大豆、花生等' },
						{ name: '菜粉蝶（幼虫）', harmType: '食叶', description: '菜青虫，主要危害甘蓝、白菜等' },
						{ name: '蝼蛄', harmType: '地下害虫', description: '地下害虫，危害小麦、玉米幼苗根系' },
						{ name: '赤条蝽', harmType: '危害豆类', description: '危害豆类、瓜类作物' },
						{ name: '麻皮蝽', harmType: '多食性', description: '多食性，危害大豆、玉米、蔬菜等' }
					],
					'园林花卉': [
						{ name: '八点广翅蜡蝉', harmType: '吸食嫩枝', description: '吸食月季、紫薇等嫩枝' },
						{ name: '斑衣蜡蝉', harmType: '危害观赏植物', description: '危害臭椿、海棠、樱花等' },
						{ name: '碧蛾蜡蝉', harmType: '吸食叶片', description: '吸食桂花、茶花等叶片' },
						{ name: '白星花金龟', harmType: '啃食花瓣', description: '啃食月季、菊花等花瓣' },
						{ name: '红缘灯蛾（幼虫）', harmType: '食叶', description: '幼虫食叶，危害菊花、一串红等' },
						{ name: '柳蓝叶甲', harmType: '危害叶片', description: '成虫和幼虫危害柳树、杨树叶片' },
						{ name: '旋目夜蛾（幼虫）', harmType: '食叶', description: '幼虫食叶，危害悬铃木、紫薇等' }
					],
					'多食性/广食性': [
						{ name: '美国白蛾', harmType: '食叶', description: '林业+园林，100+寄主' },
						{ name: '麻皮蝽', harmType: '多食性', description: '农作物+果树' },
						{ name: '绿刺蛾（幼虫）', harmType: '食叶', description: '果树+林业' },
						{ name: '扁刺蛾（幼虫）', harmType: '食叶', description: '果树+园林' },
						{ name: '红缘灯蛾', harmType: '食叶', description: '园林+农作物' }
					]
				}
			}
		},
		computed: {
			currentPests() {
				return this.pestData[this.selectedSubCategory] || [];
			}
		},
		methods: {
			selectCategory(category) {
				this.activeCategory = category;
				this.showDropdown = false;
				this.selectedSubCategory = '';
			},
			toggleDropdown() {
				// 如果已经选择了子分类，点击时重置
				if (this.selectedSubCategory && !this.showDropdown) {
					this.selectedSubCategory = '';
					this.showDropdown = true;
				} else {
					this.showDropdown = !this.showDropdown;
				}
				this.activeCategory = '危害方式';
			},
			selectDropdownItem(item) {
				console.log('点击了下拉项:', item);
				this.activeCategory = '危害方式';
				this.selectedSubCategory = item;
				this.showDropdown = false;
				console.log('设置完成 - activeCategory:', this.activeCategory, 'selectedSubCategory:', this.selectedSubCategory);
			},
			showPestDetail(pest) {
				// 跳转到害虫详情页面
				uni.navigateTo({
					url: `/pages/pestDetail/pestDetail?pest=${encodeURIComponent(JSON.stringify(pest))}&category=${this.selectedSubCategory}`
				});
			},
			showHotPestDetail(pest) {
				// 跳转到热度榜害虫详情页面
				uni.navigateTo({
					url: `/pages/pestDetail/pestDetail?pest=${encodeURIComponent(JSON.stringify(pest))}&category=${pest.category}`
				});
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

.image-area {
	height: 200rpx;
	background: linear-gradient(135deg, #aaeb9f 0%, #74c865 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid #e0e0e0;
	position: relative;
	overflow: hidden;
}

.image-area::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.1);
}

.category-nav {
	display: flex;
	background: #ffffff;
	border-bottom: 2px solid #e0e0e0;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.category-item {
	flex: 1;
	padding: 25rpx 20rpx;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	border-right: 1px solid #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.category-item:last-child {
	border-right: none;
}

.category-item:hover {
	background: #f8f9fa;
}

.category-item.active {
	background: linear-gradient(135deg, #aaeb9f 0%, #74c865 100%);
	color: #ffffff;
	transform: translateY(-2rpx);
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
}

.category-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
	transition: color 0.3s ease;
}

.category-item.active .category-name {
	color: #ffffff;
}

.dropdown {
	position: relative;
}

.dropdown-arrow {
	font-size: 20rpx;
	margin-left: 8rpx;
	color: #666;
	transition: transform 0.3s ease;
}

.category-item.active .dropdown-arrow {
	color: #ffffff;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: #ffffff;
	border: 1px solid #e0e0e0;
	border-radius: 8rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	z-index: 1000;
	margin-top: 2rpx;
}

.dropdown-item {
	padding: 20rpx 25rpx;
	border-bottom: 1px solid #f0f0f0;
	cursor: pointer;
	transition: background 0.3s ease;
}

.dropdown-item:last-child {
	border-bottom: none;
}

.dropdown-item:hover {
	background: #f8f9fa;
}

.dropdown-text {
	font-size: 28rpx;
	color: #333;
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

.default-content {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.placeholder-text {
	color: #999;
	font-size: 28rpx;
}

/* 热度榜样式 */
.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	text-align: center;
}

.hot-list {
	padding: 20rpx 0;
}

.pest-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.pest-item {
	display: flex;
	align-items: center;
	padding: 25rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	border-left: 6rpx solid #74c865;
	transition: all 0.3s ease;
	cursor: pointer;
}

.pest-item:hover {
	transform: translateX(10rpx);
	box-shadow: 0 4rpx 15rpx rgba(116, 200, 101, 0.2);
	background: #f0f8f0;
}

.pest-item:active {
	transform: translateX(5rpx) scale(0.98);
}

.pest-rank {
	width: 60rpx;
	height: 60rpx;
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 28rpx;
	margin-right: 25rpx;
}

.pest-info {
	flex: 1;
}

.pest-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.pest-desc {
	font-size: 26rpx;
	color: #666;
}

.pest-score {
	font-size: 28rpx;
	font-weight: bold;
	color: #ff6b6b;
	background: rgba(255, 107, 107, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	border: 1px solid rgba(255, 107, 107, 0.3);
}

/* 危害方式分类样式 */
.harm-category {
	padding: 20rpx 0;
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
	border-color: #74c865;
}

.pest-image {
	text-align: center;
	margin-bottom: 20rpx;
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
	font-size: 24rpx;
	color: #666;
}
</style>
