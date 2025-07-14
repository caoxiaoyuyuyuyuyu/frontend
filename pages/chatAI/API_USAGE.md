# AI聊天API使用说明

## 概述

这个API封装了AI聊天功能的核心操作，所有功能都通过后端API进行，包括消息发送、历史记录管理、用户认证等功能。

## 基础配置

```javascript
const BASE_URL = 'http://192.168.241.56:5000'; // 后端API地址
const API_VERSION = 'api';
```

## 主要功能

### 1. AI对话功能

#### sendAIMessage(messageData)
发送消息给AI并获取回复

```javascript
import { sendAIMessage } from './api.js';

// 使用示例
try {
  const response = await sendAIMessage({
    content: '请帮我识别这个害虫',
    type: 'user',
    time: '14:30',
    hasQuote: false
  });
  
  if (response.success) {
    console.log('AI回复:', response.data.content);
  }
} catch (error) {
  console.error('发送消息失败:', error);
}
```

### 2. 历史记录管理

#### saveChatToBackend(chatData)
保存对话到后端

```javascript
import { saveChatToBackend, getCurrentDateTime } from './api.js';

const chatData = {
  id: 'chat123',
  title: '关于害虫识别的咨询',
  lastTime: getCurrentDateTime(),
  messages: [
    { type: 'user', content: '问题', time: '14:30' },
    { type: 'ai', content: '回答', time: '14:31' }
  ]
};

try {
  const response = await saveChatToBackend(chatData);
  if (response.success) {
    console.log('对话保存成功');
  }
} catch (error) {
  console.error('保存对话失败:', error);
}
```

#### loadHistoryChats(params)
从后端加载历史对话列表

```javascript
import { loadHistoryChats } from './api.js';

try {
  const response = await loadHistoryChats({ page: 1, limit: 20 });
  if (response.success) {
    console.log('历史对话数量:', response.data.length);
  }
} catch (error) {
  console.error('加载历史对话失败:', error);
}
```

#### getChatDetail(chatId)
获取指定对话详情

```javascript
import { getChatDetail } from './api.js';

try {
  const response = await getChatDetail('chat123');
  if (response.success) {
    console.log('对话标题:', response.data.title);
    console.log('消息数量:', response.data.messages.length);
  }
} catch (error) {
  console.error('获取对话详情失败:', error);
}
```

### 3. 对话管理

#### deleteChat(chatId)
删除指定对话

```javascript
import { deleteChat } from './api.js';

try {
  const response = await deleteChat('chat123');
  if (response.success) {
    console.log('对话删除成功');
  }
} catch (error) {
  console.error('删除对话失败:', error);
}
```

#### clearAllChats()
清空所有对话

```javascript
import { clearAllChats } from './api.js';

try {
  const response = await clearAllChats();
  if (response.success) {
    console.log('所有对话已清空');
  }
} catch (error) {
  console.error('清空对话失败:', error);
}
```

### 4. 搜索功能

#### searchChats(keyword, filterType)
搜索对话内容

```javascript
import { searchChats } from './api.js';

// 搜索所有包含"害虫"的对话
try {
  const response = await searchChats('害虫', 'all');
  if (response.success) {
    console.log('搜索结果:', response.data);
  }
} catch (error) {
  console.error('搜索失败:', error);
}

// 搜索今天的对话
try {
  const response = await searchChats('', 'today');
  if (response.success) {
    console.log('今天的对话:', response.data);
  }
} catch (error) {
  console.error('搜索失败:', error);
}
```

### 5. 用户认证

#### userLogin(loginData)
用户登录

```javascript
import { userLogin } from './api.js';

try {
  const response = await userLogin({
    username: 'user123',
    password: 'password123'
  });
  
  if (response.success) {
    // 保存token
    uni.setStorageSync('token', response.data.token);
    console.log('登录成功');
  }
} catch (error) {
  console.error('登录失败:', error);
}
```

#### userRegister(registerData)
用户注册

```javascript
import { userRegister } from './api.js';

try {
  const response = await userRegister({
    username: 'newuser',
    password: 'password123',
    email: 'user@example.com'
  });
  
  if (response.success) {
    console.log('注册成功');
  }
} catch (error) {
  console.error('注册失败:', error);
}
```

#### getUserInfo()
获取用户信息

```javascript
import { getUserInfo } from './api.js';

try {
  const response = await getUserInfo();
  if (response.success) {
    console.log('用户信息:', response.data);
  }
} catch (error) {
  console.error('获取用户信息失败:', error);
}
```

#### updateUserInfo(userData)
更新用户信息

```javascript
import { updateUserInfo } from './api.js';

try {
  const response = await updateUserInfo({
    nickname: '新昵称',
    avatar: 'avatar_url'
  });
  
  if (response.success) {
    console.log('用户信息更新成功');
  }
} catch (error) {
  console.error('更新用户信息失败:', error);
}
```

### 6. 工具函数

#### getCurrentTime()
获取当前时间 (HH:MM)

```javascript
import { getCurrentTime } from './api.js';

const time = getCurrentTime(); // 例如: "14:30"
```

#### getCurrentDateTime()
获取当前日期时间 (YYYY-MM-DD HH:MM)

```javascript
import { getCurrentDateTime } from './api.js';

const datetime = getCurrentDateTime(); // 例如: "2024-01-15 14:30"
```

#### generateChatId()
生成对话ID

```javascript
import { generateChatId } from './api.js';

const chatId = generateChatId(); // 例如: "chat1705123456789"
```

#### getChatTitle(messages)
根据消息列表生成对话标题

```javascript
import { getChatTitle } from './api.js';

const title = getChatTitle(messages); // 返回第一条用户消息的前20个字符
```

#### getMessagePreview(messages)
获取消息预览文本

```javascript
import { getMessagePreview } from './api.js';

const preview = getMessagePreview(messages); // 返回最后一条消息的前30个字符
```

### 7. 消息操作

#### copyMessage(content)
复制消息到剪贴板

```javascript
import { copyMessage } from './api.js';

try {
  await copyMessage('要复制的内容');
  console.log('复制成功');
} catch (error) {
  console.log('复制失败');
}
```

#### submitFeedback(feedbackData)
提交反馈

```javascript
import { submitFeedback } from './api.js';

try {
  const response = await submitFeedback({
    type: '有帮助',
    message: 'AI回答很准确',
    chatId: 'chat123'
  });
  
  if (response.success) {
    console.log('反馈提交成功');
  }
} catch (error) {
  console.error('反馈提交失败:', error);
}
```

### 8. 图片识别

#### identifyImage(imagePath, params)
图片识别

```javascript
import { identifyImage } from './api.js';

try {
  const response = await identifyImage('/path/to/image.jpg', {
    description: '害虫图片'
  });
  
  if (response.success) {
    console.log('识别结果:', response.data);
  }
} catch (error) {
  console.error('图片识别失败:', error);
}
```

### 9. 页面间通信

#### setSelectedChat(chat)
设置选中的对话（临时存储）

```javascript
import { setSelectedChat } from './api.js';

setSelectedChat(chatData);
// 然后跳转到聊天页面
uni.navigateTo({ url: '/pages/chatAI/chatAI' });
```

#### getSelectedChat()
获取选中的对话

```javascript
import { getSelectedChat } from './api.js';

const selectedChat = getSelectedChat();
if (selectedChat) {
  // 加载选中的对话
  this.loadChat(selectedChat);
}
```

## 错误处理

所有API函数都返回Promise，需要使用try-catch进行错误处理：

```javascript
try {
  const response = await apiFunction(params);
  if (response.success) {
    // 处理成功响应
    console.log('操作成功:', response.data);
  } else {
    // 处理业务错误
    console.error('操作失败:', response.message);
  }
} catch (error) {
  // 处理网络错误
  console.error('网络错误:', error.message);
}
```

## 认证机制

API使用Bearer Token认证，token存储在本地：

```javascript
// 登录后保存token
uni.setStorageSync('token', response.data.token);

// API自动在请求头中添加token
header: {
  'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
}
```

## 响应格式

所有API响应都遵循统一格式：

```javascript
{
  success: true/false,        // 操作是否成功
  message: '提示信息',        // 提示信息
  data: {},                   // 响应数据
  code: 200                  // 状态码
}
```

## 使用建议

1. **错误处理**：始终使用try-catch包装API调用
2. **加载状态**：在API调用期间显示加载提示
3. **网络检查**：在调用API前检查网络连接
4. **Token管理**：及时更新和清理token
5. **用户体验**：提供友好的错误提示和重试机制

## 后端API接口

### 聊天相关接口

- `POST /api/chat/send` - 发送AI消息
- `POST /api/chat/save` - 保存对话
- `GET /api/chat/history` - 获取历史对话
- `GET /api/chat/{id}` - 获取对话详情
- `DELETE /api/chat/{id}` - 删除对话
- `DELETE /api/chat/clear-all` - 清空所有对话
- `GET /api/chat/search` - 搜索对话
- `POST /api/chat/feedback` - 提交反馈
- `POST /api/chat/identify` - 图片识别

### 用户相关接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/user/info` - 获取用户信息
- `PUT /api/user/info` - 更新用户信息

## 示例页面

参考 `chatAI.vue` 和 `history.vue` 页面了解完整的使用示例。 