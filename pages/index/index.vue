<template>
    <view class="container">
        <!-- 登录弹窗组件 -->
        <login v-if="showLoginPopup" :show="showLoginPopup" @success="onLoginSuccess" />
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
    export default {
        components: { login },
        data() {
            return {
                title: '智慧农业',
                showLoginPopup: false,
                hasLogin: false,
                userInfo: {}
            }
        },
        onLoad() {
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
                        // 这里可以跳转到识别页面
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
                        // 这里可以跳转到识别页面
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
            uploadAndIdentify(imagePath) {
                // 这里可以添加图片上传和识别的逻辑
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
        background: rgba(255, 255, 255, 0.8);
        padding: 24rpx 32rpx;
        border-radius: 16rpx;
        border: 1rpx solid rgba(76, 175, 80, 0.2);
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
</style>