<template>
  <view class="help-container">
    <view class="help-section">
      <view class="help-title">1. 小程序简介</view>
      <view class="help-content">
        智慧害虫识别小程序，致力于为用户提供便捷、准确的害虫识别服务。用户只需上传害虫图片，系统即可自动分析并返回识别结果，帮助用户快速了解害虫信息。
      </view>
    </view>
    <view class="help-section">
      <view class="help-title">2. 无法识别害虫的可能原因及建议</view>
      <view class="help-content">
        <text>常见原因：</text>
        <view>1）图片模糊、光线不足或遮挡，导致特征无法提取。</view>
        <view>2）上传的不是害虫图片或图片内容不清晰。</view>
        <view>3）该害虫暂未收录于系统数据库。</view>
        <view>建议：</view>
        <view>1）请确保拍摄清晰、无遮挡的害虫特写图片。</view>
        <view>2）尽量在自然光下拍摄，避免反光和阴影。</view>
        <view>3）如多次无法识别，可通过“联系客服”反馈，我们会持续完善数据库。</view>
      </view>
    </view>
    <view class="help-section">
      <view class="help-title">3. 如何反馈问题/联系客服</view>
      <view class="help-content">
        <view>如遇到识别异常、功能建议或其他问题，可通过“我的-联系客服”进行反馈，或拨打客服电话：123-456-7890。</view>
      </view>
    </view>
    <view class="help-section">
      <view class="help-title">4. 会员等级介绍</view>
      <view class="help-content">
        <view>普通会员：注册即为普通会员，可享受基础识别服务。</view>
        <view>高级会员：通过贡献识别积分升级，享受更多识别次数和专属服务。</view>
        <view>等级越高，识别次数和功能权限越多。</view>
      </view>
    </view>
    <view class="help-section">
      <view class="help-title">5. 识别次数说明</view>
      <view class="help-content">
        <view>每位用户每日有一定免费识别次数，会员等级越高，次数越多。识别次数用完后可通过提升等级或参与活动获得更多机会。</view>
      </view>
    </view>
    <view class="help-section">
      <view class="help-title">6. 常见问题</view>
      <view class="help-content">
        <view>Q：识别结果准确吗？</view>
        <view>A：系统基于大量数据和AI算法，准确率较高，但部分罕见害虫可能存在误差。</view>
        <view>Q：识别结果能保存吗？</view>
        <view>A：识别记录会自动保存，可在“识别记录”中查看历史结果。</view>
        <view>Q：如何保护我的隐私？</view>
        <view>A：我们严格保护用户隐私，图片仅用于识别，不会泄露给第三方。</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {}
</script>

<style scoped>
.help-container {
  padding: 32rpx 24rpx 32rpx 24rpx;
  background: #f8f9fb;
  min-height: 100vh;
}
.help-section {
  background: #fff;
  border-radius: 18rpx;
  margin-bottom: 28rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 2rpx 8rpx #eee;
}
.help-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d2e3a;
  margin-bottom: 16rpx;
}
.help-content {
  font-size: 26rpx;
  color: #444;
  line-height: 1.8;
}
</style>
