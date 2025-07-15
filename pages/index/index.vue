<template>
    <view class="container">
        <!-- 登录弹窗组件 -->
        <login v-if="showLoginPopup" :show="showLoginPopup" @success="onLoginSuccess" />
        
        <!-- 识别结果弹窗 -->
        <view class="result-popup" v-if="showResultPopup">
            <view class="popup-mask" @click="closeResultPopup"></view>
            <view class="popup-content">
                <view class="popup-header">
                    <text class="popup-title">识别结果</text>
                    <text class="close-btn" @click="closeResultPopup">×</text>
                </view>
                
                <view class="result-summary">
                    <text class="summary-text">共识别到 {{ detectionResults.length }} 种害虫</text>
                </view>
                
                <scroll-view class="result-list" scroll-y>
                    <view class="result-item" v-for="(item, index) in detectionResults" :key="index" @click="goToPestDetail(item.pest_id)">
                        <image class="result-image" :src="getImageUrl(item.image_url)" mode="aspectFill"></image>
                        <view class="result-info">
                            <text class="pest-name">{{ item.pest_name }}</text>
                            <text class="confidence">可信度: {{ (item.confidence * 100).toFixed(1) }}%</text>
                        </view>
                        <view class="result-arrow">›</view>
                    </view>
                </scroll-view>
                
                <!-- <view class="popup-footer">
                    <button class="record-btn" @click="goToRecordPage">查看识别记录</button>
                </view> -->
            </view>
        </view>
        
        <!-- 顶部标题区域 -->
        <view class="header">
            <view class="title-container">
                <text class="main-title">智慧农业</text>
                <text class="sub-title">AI智能害虫识别系统</text>
            </view>
            <view class="decoration">
                <view class="leaf leaf-1"></view>
                <view class="leaf leaf-2"></view>
                <view class="leaf leaf-3"></view>
            </view>
        </view>
        
        <!-- 中间按钮区域 -->
        <view class="button-container">
            <view class="button-group">
                <!-- 相机拍照按钮 -->
                <view class="action-button camera-button" @click="takePhoto">
                    <view class="button-icon">
                        <image src="/static/camera.png" class="icon-image"></image>
                    </view>
                    <view class="button-content">
                        <text class="button-text">拍照识别</text>
                        <text class="button-desc">实时拍摄害虫照片进行识别</text>
                    </view>
                    <view class="button-arrow">›</view>
                </view>
                
                <!-- 照片选择按钮 -->
                <view class="action-button gallery-button" @click="chooseImage">
                    <view class="button-icon">
                        <image src="/static/picture.png" class="icon-image"></image>
                    </view>
                    <view class="button-content">
                        <text class="button-text">相册选择</text>
                        <text class="button-desc">从相册选择照片进行识别</text>
                    </view>
                    <view class="button-arrow">›</view>
                </view>
            </view>
        </view>
        
        <!-- 底部说明区域 -->
        <view class="footer">
            <view class="footer-content">
                <text class="footer-text">支持识别常见农作物害虫</text>
                <text class="footer-sub-text">让AI为您的农业生产保驾护航</text>
            </view>
        </view>
    </view>
</template>

<script>
    import login from '../../components/login/login.vue'
    import { identifyImage } from './api.js'
	import { getApiUrl } from '../../utils/apiConfig.js';
    
    export default {
        components: { login },
        data() {
            return {
                title: '智慧农业',
                showLoginPopup: false,
                hasLogin: false,
                userInfo: {},
                showResultPopup: false,
                detectionResults: []
            }
        },
        onShow() {
            this.checkLogin();
        },
        methods: {
            // 检查登录状态
            checkLogin() {
                const token = uni.getStorageSync('token')
                if (token) {
                    this.hasLogin = true
                    this.userInfo = uni.getStorageSync('userInfo') || {}
                    this.showLoginPopup = false
                } else {
                    this.hasLogin = false
                    this.showLoginPopup = true
                }
            },
            // 登录弹窗回调
            onLoginSuccess(userInfo) {
                this.hasLogin = true
                this.userInfo = userInfo
                this.showLoginPopup = false
            },
            // 拍照功能
            takePhoto() {
                uni.chooseImage({
                    count: 1,
                    sourceType: ['camera'],
                    success: (res) => {
                        console.log('拍照成功:', res.tempFilePaths);
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
            
            // 选择照片功能
            chooseImage() {
                uni.chooseImage({
                    count: 1,
                    sourceType: ['album'],
                    success: (res) => {
                        console.log('选择照片成功:', res.tempFilePaths);
                        this.uploadAndIdentify(res.tempFilePaths[0]);
                    },
                    fail: (err) => {
                        console.error('选择照片失败:', err);
                        uni.showToast({
                            title: '选择照片失败',
                            icon: 'none'
                        });
                    }
                });
            },
            
            // 上传并识别
            async uploadAndIdentify(imagePath) {
                uni.showLoading({
                    title: '正在识别...',
                    mask: true
                });
                
                try {
                    const response = await identifyImage(imagePath);
                    console.log('识别结果:', response);
                    
                    if (response.code === 200) {
                        this.detectionResults = response.data;
                        this.showResultPopup = true;
                    } else {
                        uni.showToast({
                            title: response.message || '识别失败',
                            icon: 'none'
                        });
                    }
                } catch (error) {
                    console.error('识别出错:', error);
                    uni.showToast({
                        title: '识别服务异常',
                        icon: 'none'
                    });
                } finally {
                    uni.hideLoading();
                }
            },
            
            // 获取图片完整URL
            getImageUrl(imagePath) {
			  if (!imagePath) return '';
			  return getApiUrl(`/detect/images/${imagePath}`);
            },
            
            // 关闭结果弹窗
            closeResultPopup() {
                this.showResultPopup = false;
            },
            
            // 跳转到害虫详情页
            goToPestDetail(pestId) {
                uni.navigateTo({
                    url: `/pages/pestDetail/pestDetail?pestId=${pestId}`
                });
            },
            
            // 跳转到识别记录页
            goToRecordPage() {
                uni.navigateTo({
                    url: '/pages/profile/record'
                });
            }
        }
    }
</script>

<style>
    .container {
        min-height: 100vh;
        background: linear-gradient(180deg, #E8F5E8 0%, #D4EDD4 50%, #C8E6C8 100%);
        display: flex;
        flex-direction: column;
        padding: 40rpx;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
    }
    
    /* 背景装饰 */
    .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(129, 199, 132, 0.1) 0%, transparent 50%);
        pointer-events: none;
    }
    
    .header {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 60rpx;
        position: relative;
        z-index: 1;
    }
    
    .title-container {
        text-align: center;
        margin-bottom: 30rpx;
    }
    
    .main-title {
        font-size: 56rpx;
        font-weight: bold;
        color: #2E7D32;
        margin-bottom: 16rpx;
        display: block;
        text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
    }
    
    .sub-title {
        font-size: 28rpx;
        color: #4CAF50;
        display: block;
        font-weight: 500;
    }
    
    /* 装饰叶子 */
    .decoration {
        position: relative;
        width: 200rpx;
        height: 100rpx;
    }
    
    .leaf {
        position: absolute;
        width: 40rpx;
        height: 60rpx;
        background: #4CAF50;
        border-radius: 50% 0 50% 0;
        opacity: 0.3;
        animation: leafFloat 3s ease-in-out infinite;
    }
    
    .leaf-1 {
        top: 0;
        left: 30rpx;
        animation-delay: 0s;
    }
    
    .leaf-2 {
        top: 20rpx;
        left: 80rpx;
        animation-delay: 1s;
        transform: scale(0.8);
    }
    
    .leaf-3 {
        top: 40rpx;
        right: 30rpx;
        animation-delay: 2s;
        transform: scale(0.6);
    }
    
    @keyframes leafFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10rpx) rotate(5deg); }
    }
    
    .button-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
    }
    
    .button-group {
        display: flex;
        flex-direction: column;
        gap: 24rpx;
        width: 100%;
    }
    
    .action-button {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 28rpx;
        padding: 48rpx 40rpx;
        display: flex;
        align-items: center;
        box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        border: 2rpx solid rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
        margin-bottom: 32rpx;
    }
    
    .action-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .action-button:active {
        transform: translateY(2rpx);
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
    }
    
    .action-button:active::before {
        opacity: 1;
    }
    
    .camera-button {
        border-left: 6rpx solid #666;
    }
    
    .gallery-button {
        border-left: 6rpx solid #888;
    }
    
    .button-icon {
        width: 120rpx;
        height: 120rpx;
        background: #f5f5f5;
        border-radius: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 40rpx;
        flex-shrink: 0;
        border: 2rpx solid #e0e0e0;
    }
    
    .icon-image {
        width: 60rpx;
        height: 60rpx;
    }
    
    .button-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    
    .button-text {
        font-size: 40rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
    }
    
    .button-desc {
        font-size: 28rpx;
        color: #666;
        line-height: 1.4;
    }
    
    .button-arrow {
        font-size: 44rpx;
        color: #999;
        font-weight: bold;
        margin-left: 20rpx;
        opacity: 0.7;
    }
    
    .footer {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40rpx;
        position: relative;
        z-index: 1;
    }
    
    .footer-content {
        text-align: center;
        /* background: rgba(255, 255, 255, 0.8); */
        padding: 24rpx 32rpx;
        border-radius: 16rpx;
        /* border: 1rpx solid rgba(76, 175, 80, 0.2); */
    }
    
    .footer-text {
        font-size: 26rpx;
        color: #2E7D32;
        display: block;
        margin-bottom: 8rpx;
        font-weight: 500;
    }
    
    .footer-sub-text {
        font-size: 22rpx;
        color: #4CAF50;
        display: block;
        opacity: 0.8;
    }
    /* 结果弹窗样式 */
    .result-popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .popup-mask {
        position: absolute;
		z-index: -1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    
    .popup-content {
        width: 90%;
        max-height: 80vh;
        background-color: #fff;
        border-radius: 24rpx;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10rpx 50rpx rgba(0, 0, 0, 0.2);
    }
    
    .popup-header {
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1rpx solid #f5f5f5;
    }
    
    .popup-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
    }
    
    .close-btn {
        font-size: 44rpx;
        color: #999;
        padding: 10rpx 20rpx;
    }
    
    .result-summary {
        padding: 20rpx 30rpx;
        background-color: #f9f9f9;
    }
    
    .summary-text {
        font-size: 28rpx;
        color: #666;
    }
    
    .result-list {
        flex: 1;
        padding: 20rpx 0;
    }
    
    .result-item {
        display: flex;
        align-items: center;
        padding: 20rpx 30rpx;
        border-bottom: 1rpx solid #f5f5f5;
    }
    
    .result-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
    }
    
    .result-info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    
    .pest-name {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 10rpx;
    }
    
    .confidence {
        font-size: 26rpx;
        color: #666;
    }
    
    .result-arrow {
        font-size: 40rpx;
        color: #999;
        margin-left: 20rpx;
    }
    
    .popup-footer {
        padding: 20rpx 30rpx;
        border-top: 1rpx solid #f5f5f5;
    }
    
    .record-btn {
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        background-color: #4CAF50;
        color: white;
        border-radius: 40rpx;
        font-size: 30rpx;
        border: none;
    }
    
    .record-btn::after {
        border: none;
    }
</style>