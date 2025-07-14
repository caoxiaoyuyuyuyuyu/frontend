/**
 * AI聊天API接口
 * 包含AI对话、历史记录管理、后端API连接等功能
 */

// 基础配置
const BASE_URL = 'http://192.168.241.56:5000'; // 后端API地址
const API_VERSION = 'api';

/**
 * 发送AI对话消息
 * @param {Object} messageData - 消息数据
 * @param {String} messageData.content - 消息内容
 * @param {String} messageData.type - 消息类型 (user/ai)
 * @param {String} messageData.time - 消息时间
 * @param {Boolean} messageData.hasQuote - 是否包含引用
 * @returns {Promise} 返回AI回复
 */
export const sendAIMessage = (messageData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/send`,
      method: 'POST',
      data: messageData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '发送消息失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 保存对话到后端
 * @param {Object} chatData - 对话数据
 * @param {String} chatData.id - 对话ID
 * @param {String} chatData.title - 对话标题
 * @param {String} chatData.lastTime - 最后更新时间
 * @param {Array} chatData.messages - 消息列表
 * @returns {Promise} 保存结果
 */
export const saveChatToBackend = (chatData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/save`,
      method: 'POST',
      data: chatData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '保存对话失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 从后端加载历史对话列表
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回历史对话列表
 */
export const loadHistoryChats = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/history`,
      method: 'GET',
      data: params,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取历史记录失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取指定对话详情
 * @param {String} chatId - 对话ID
 * @returns {Promise} 返回对话详情
 */
export const getChatDetail = (chatId) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/${chatId}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取对话详情失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 删除对话
 * @param {String} chatId - 对话ID
 * @returns {Promise} 返回删除结果
 */
export const deleteChat = (chatId) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/${chatId}`,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '删除对话失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 清空所有对话
 * @returns {Promise} 返回清空结果
 */
export const clearAllChats = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/clear-all`,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '清空对话失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 搜索对话内容
 * @param {String} keyword - 搜索关键词
 * @param {String} filterType - 筛选类型 (all/today/week/month)
 * @returns {Promise} 返回搜索结果
 */
export const searchChats = (keyword, filterType = 'all') => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/search`,
      method: 'GET',
      data: {
        keyword: keyword,
        filterType: filterType
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '搜索对话失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 设置选中的对话（临时存储）
 * @param {Object} chat - 对话数据
 */
export const setSelectedChat = (chat) => {
  try {
    uni.setStorageSync('selectedChat', chat);
  } catch (error) {
    console.error('设置选中对话失败:', error);
  }
};

/**
 * 获取选中的对话
 * @returns {Object|null} 选中的对话
 */
export const getSelectedChat = () => {
  try {
    const selectedChat = uni.getStorageSync('selectedChat');
    if (selectedChat) {
      uni.removeStorageSync('selectedChat');
      return selectedChat;
    }
    return null;
  } catch (error) {
    console.error('获取选中对话失败:', error);
    return null;
  }
};

/**
 * 复制消息到剪贴板
 * @param {String} content - 消息内容
 * @returns {Promise} 复制结果
 */
export const copyMessage = (content) => {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: content,
      success: () => {
        resolve({ success: true });
      },
      fail: (err) => {
        reject(new Error('复制失败'));
      }
    });
  });
};

/**
 * 提交反馈
 * @param {Object} feedbackData - 反馈数据
 * @param {String} feedbackData.type - 反馈类型
 * @param {String} feedbackData.message - 反馈消息
 * @param {String} feedbackData.chatId - 对话ID
 * @returns {Promise} 提交结果
 */
export const submitFeedback = (feedbackData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/chat/feedback`,
      method: 'POST',
      data: feedbackData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '提交反馈失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取当前时间
 * @returns {String} 当前时间字符串 (HH:MM)
 */
export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 获取当前日期时间
 * @returns {String} 当前日期时间字符串 (YYYY-MM-DD HH:MM)
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 生成对话ID
 * @returns {String} 对话ID
 */
export const generateChatId = () => {
  return 'chat' + Date.now();
};

/**
 * 获取对话标题
 * @param {Array} messages - 消息列表
 * @returns {String} 对话标题
 */
export const getChatTitle = (messages) => {
  const userMessages = messages.filter(msg => msg.type === 'user');
  if (userMessages.length > 0) {
    const firstUserMessage = userMessages[0];
    return firstUserMessage.content.length > 20 
      ? firstUserMessage.content.substring(0, 20) + '...' 
      : firstUserMessage.content;
  }
  return '新对话';
};

/**
 * 获取消息预览文本
 * @param {Array} messages - 消息列表
 * @returns {String} 预览文本
 */
export const getMessagePreview = (messages) => {
  if (messages.length === 0) return '';
  const lastMessage = messages[messages.length - 1];
  const text = lastMessage.content;
  return text.length > 30 ? text.substring(0, 30) + '...' : text;
};

/**
 * 图片识别API
 * @param {String} imagePath - 图片路径
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回识别结果
 */
export const identifyImage = (imagePath, params = {}) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}/${API_VERSION}/chat/identify`,
      filePath: imagePath,
      name: 'image',
      formData: params,
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data);
          resolve(data);
        } else {
          reject(new Error('图片识别失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 用户登录
 * @param {Object} loginData - 登录数据
 * @returns {Promise} 返回登录结果
 */
export const userLogin = (loginData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/auth/login`,
      method: 'POST',
      data: loginData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '登录失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 用户注册
 * @param {Object} registerData - 注册数据
 * @returns {Promise} 返回注册结果
 */
export const userRegister = (registerData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/auth/register`,
      method: 'POST',
      data: registerData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '注册失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/info`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取用户信息失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 更新用户信息
 * @param {Object} userData - 用户数据
 * @returns {Promise} 返回更新结果
 */
export const updateUserInfo = (userData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/info`,
      method: 'PUT',
      data: userData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '更新用户信息失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

export default {
  sendAIMessage,
  saveChatToBackend,
  loadHistoryChats,
  getChatDetail,
  deleteChat,
  clearAllChats,
  searchChats,
  setSelectedChat,
  getSelectedChat,
  copyMessage,
  submitFeedback,
  getCurrentTime,
  getCurrentDateTime,
  generateChatId,
  getChatTitle,
  getMessagePreview,
  identifyImage,
  userLogin,
  userRegister,
  getUserInfo,
  updateUserInfo
}; 