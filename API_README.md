# API接口文档

## 概述

本项目为智慧害虫识别应用的前端API接口，采用模块化设计，每个页面都有对应的API文件。

## 目录结构

```
pages/
├── index/
│   ├── index.vue          # 首页
│   └── api.js            # 首页API接口
├── pestGallery/
│   ├── pestGallery.vue    # 害虫图库页面
│   └── api.js            # 害虫图库API接口
├── pestDetail/
│   ├── pestDetail.vue     # 害虫详情页面
│   └── api.js            # 害虫详情API接口
├── chatAI/
│   ├── chatAI.vue         # AI聊天页面
│   ├── history.vue        # 聊天历史页面
│   └── api.js            # AI聊天API接口
└── profile/
    ├── profile.vue        # 个人中心页面
    ├── record.vue         # 识别记录页面
    ├── recordDetail.vue   # 记录详情页面
    ├── pestShare.vue      # 害虫分享页面
    ├── help.vue           # 帮助页面
    └── api.js            # 个人中心API接口

utils/
└── apiConfig.js          # API配置文件
```

## API配置文件

### utils/apiConfig.js

统一的API配置文件，包含：

- **基础配置**: BASE_URL, API_VERSION, TIMEOUT等
- **请求方法**: request(), uploadFile(), requestWithRetry()
- **拦截器**: requestInterceptor(), responseInterceptor()
- **错误处理**: handleApiError()
- **工具函数**: getApiUrl(), getHeaders()

## 各页面API接口

### 1. 首页API (pages/index/api.js)

```javascript
import api from './api.js';

// 获取首页数据
const homeData = await api.getHomeData();

// 获取轮播图
const banners = await api.getBannerData();

// 获取推荐害虫
const recommendedPests = await api.getRecommendedPests();

// 获取用户统计
const userStats = await api.getUserStats();
```

**主要接口:**
- `getHomeData()` - 获取首页数据
- `getBannerData()` - 获取轮播图
- `getRecommendedPests()` - 获取推荐害虫
- `getQuickIdentifyData()` - 获取快速识别数据
- `getUserStats()` - 获取用户统计
- `getLatestNews()` - 获取最新资讯
- `recordUserAction()` - 记录用户行为

### 2. 害虫图库API (pages/pestGallery/api.js)

```javascript
import api from './api.js';

// 获取害虫分类
const categories = await api.getPestCategories();

// 获取害虫列表
const pestList = await api.getPestList({ page: 1, size: 20 });

// 搜索害虫
const searchResults = await api.searchPests({ keyword: '蚜虫' });

// 收藏害虫
await api.favoritePest('pest_id_123');
```

**主要接口:**
- `getPestCategories()` - 获取害虫分类
- `getPestList()` - 获取害虫列表
- `searchPests()` - 搜索害虫
- `getPestDetail()` - 获取害虫详情
- `favoritePest()` - 收藏害虫
- `unfavoritePest()` - 取消收藏
- `getFavoritePests()` - 获取收藏列表
- `getPestFilters()` - 获取筛选条件
- `getHotPests()` - 获取热门害虫
- `recordPestView()` - 记录查看历史

### 3. 害虫详情API (pages/pestDetail/api.js)

```javascript
import api from './api.js';

// 获取害虫详细信息
const pestDetail = await api.getPestDetailInfo('pest_id_123');

// 获取防治方法
const controlMethods = await api.getPestControlMethods('pest_id_123');

// 获取相关害虫
const relatedPests = await api.getRelatedPests('pest_id_123');

// 点赞害虫
await api.likePest('pest_id_123');
```

**主要接口:**
- `getPestDetailInfo()` - 获取害虫详细信息
- `getPestControlMethods()` - 获取防治方法
- `getPestImageGallery()` - 获取图片库
- `getRelatedPests()` - 获取相关害虫
- `getPestComments()` - 获取评论列表
- `addPestComment()` - 添加评论
- `likePest()` - 点赞害虫
- `unlikePest()` - 取消点赞
- `sharePest()` - 分享害虫信息
- `getPestStats()` - 获取统计信息
- `getPestProducts()` - 获取产品推荐
- `reportPestError()` - 报告错误

### 4. AI聊天API (pages/chatAI/api.js)

```javascript
import api from './api.js';

// 发送AI消息
const response = await api.sendAIMessage({
  message: '这是什么害虫？',
  chatId: 'chat_123'
});

// 图片识别
const result = await api.identifyImage('image_path', {
  type: 'pest'
});

// 获取聊天历史
const history = await api.getChatHistory({ page: 1, size: 20 });

// 删除对话
await api.deleteChat('chat_id_123');
```

**主要接口:**
- `sendAIMessage()` - 发送AI对话消息
- `identifyImage()` - 图片识别
- `getChatHistory()` - 获取聊天历史
- `getChatDetail()` - 获取指定对话记录
- `deleteChat()` - 删除对话记录
- `clearAllChats()` - 清空所有对话
- `searchChats()` - 搜索对话内容
- `exportChat()` - 导出对话记录
- `getAIModelInfo()` - 获取AI模型信息
- `submitFeedback()` - 提交反馈
- `getChatStats()` - 获取聊天统计
- `setChatPreferences()` - 设置聊天偏好

### 5. 个人中心API (pages/profile/api.js)

```javascript
import api from './api.js';

// 获取用户信息
const userInfo = await api.getUserInfo();

// 更新用户信息
await api.updateUserInfo({
  nickname: '新昵称',
  avatar: 'avatar_url'
});

// 获取识别记录
const records = await api.getIdentificationRecords({ page: 1, size: 20 });

// 分享害虫信息
await api.sharePestInfo({
  pestId: 'pest_123',
  platform: 'wechat'
});
```

**主要接口:**
- `getUserInfo()` - 获取用户信息
- `updateUserInfo()` - 更新用户信息
- `uploadAvatar()` - 上传用户头像
- `getUserSettings()` - 获取用户设置
- `updateUserSettings()` - 更新用户设置
- `getIdentificationRecords()` - 获取识别记录
- `getRecordDetail()` - 获取记录详情
- `deleteRecord()` - 删除记录
- `clearAllRecords()` - 清空所有记录
- `sharePestInfo()` - 分享害虫信息
- `getShareHistory()` - 获取分享历史
- `getHelpInfo()` - 获取帮助信息
- `submitUserFeedback()` - 提交反馈
- `getUserStatistics()` - 获取用户统计
- `logout()` - 退出登录

## 使用示例

### 在Vue组件中使用API

```javascript
<script>
import api from './api.js';

export default {
  data() {
    return {
      pestList: [],
      loading: false
    };
  },
  
  async onLoad() {
    try {
      this.loading = true;
      const result = await api.getPestList({ page: 1, size: 20 });
      this.pestList = result.data;
    } catch (error) {
      console.error('获取害虫列表失败:', error);
      uni.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    } finally {
      this.loading = false;
    }
  },
  
  methods: {
    async searchPests(keyword) {
      try {
        const result = await api.searchPests({ keyword });
        this.pestList = result.data;
      } catch (error) {
        console.error('搜索失败:', error);
      }
    }
  }
};
</script>
```

### 错误处理

```javascript
import { handleApiError } from '@/utils/apiConfig.js';

try {
  const result = await api.getPestList();
  // 处理成功结果
} catch (error) {
  // 使用统一的错误处理
  handleApiError(error, '获取害虫列表失败');
}
```

### 带重试的请求

```javascript
import { requestWithRetry } from '@/utils/apiConfig.js';

const result = await requestWithRetry(async () => {
  return await api.getPestList();
});
```

## 配置说明

### 环境配置

在 `utils/apiConfig.js` 中配置不同环境的API地址：

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api' 
    : 'https://api.example.com',
  // ... 其他配置
};
```

### 请求头配置

自动添加认证token：

```javascript
const headers = getHeaders({
  'Custom-Header': 'value'
});
// 结果: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token', 'Custom-Header': 'value' }
```

## 注意事项

1. **错误处理**: 所有API调用都应该使用try-catch进行错误处理
2. **加载状态**: 在请求期间显示加载状态，提升用户体验
3. **数据缓存**: 对于不经常变化的数据，可以考虑添加缓存机制
4. **网络状态**: 在弱网环境下，可以使用 `requestWithRetry` 进行重试
5. **权限验证**: 需要登录的接口会自动添加token，401错误会自动清除token

## 扩展说明

如需添加新的API接口：

1. 在对应页面的 `api.js` 文件中添加新的接口函数
2. 使用统一的 `request()` 或 `uploadFile()` 方法
3. 添加适当的错误处理和参数验证
4. 更新文档说明

## 版本历史

- v1.0.0 - 初始版本，包含基础API接口
- v1.1.0 - 添加统一错误处理和重试机制
- v1.2.0 - 优化请求拦截器和响应拦截器 