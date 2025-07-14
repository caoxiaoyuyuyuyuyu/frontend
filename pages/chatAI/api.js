/**
 * AI聊天API接口
 * 包含AI对话、历史记录管理、后端API连接等功能
 */

import { getApiUrl, getHeaders, request, uploadFile } from '../../utils/apiConfig.js';

/**
 * 发送AI对话消息
 * @param {Object} messageData - 消息数据
 * @param {String} messageData.content - 消息内容
 * @param {String} messageData.type - 消息类型 (user/ai)
 * @param {String} messageData.time - 消息时间
 * @param {Boolean} messageData.hasQuote - 是否包含引用
 * @returns {Promise} 返回AI回复
 */
export const sendAIMessage = (data) =>
  request({ url: '/chat/send', method: 'POST', data });

/**
 * 保存对话到后端
 * @param {Object} chatData - 对话数据
 * @param {String} chatData.id - 对话ID
 * @param {String} chatData.title - 对话标题
 * @param {String} chatData.lastTime - 最后更新时间
 * @param {Array} chatData.messages - 消息列表
 * @returns {Promise} 保存结果
 */
export const saveChatToBackend = (chat) =>
  request({ url: '/chat/save', method: 'POST', data: chat });

/**
 * 从后端加载历史对话列表
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回历史对话列表
 */
export const loadHistoryChats = (params = {}) =>
  request({ url: '/chat/history', method: 'GET', data: params });

/**
 * 获取指定对话详情
 * @param {String} chatId - 对话ID
 * @returns {Promise} 返回对话详情
 */
export const getChatDetail = (chatId) => {
  return request({
    url: `/chat/${chatId}`,
    method: 'GET'
  });
};

/**
 * 删除对话
 * @param {String} chatId - 对话ID
 * @returns {Promise} 返回删除结果
 */
export const deleteChat = (chatId) =>
  request({ url: `/chat/${chatId}`, method: 'DELETE' });

/**
 * 搜索对话内容
 * @param {String} keyword - 搜索关键词
 * @param {String} filterType - 筛选类型 (all/today/week/month)
 * @returns {Promise} 返回搜索结果
 */
export const searchChats = (keyword, filterType = 'all') =>
  request({ url: '/chat/search', method: 'GET', data: { keyword, filterType } });

/**
 * 设置选中的对话（临时存储）
 * @param {Object} chat - 对话数据
 */
export const setSelectedChat = (chat) => {
  try { uni.setStorageSync('selectedChat', chat); } catch (e) { console.error('设置选中对话失败', e); }
};

/**
 * 获取选中的对话
 * @returns {Object|null} 选中的对话
 */
export const getSelectedChat = () => {
  try {
    const chat = uni.getStorageSync('selectedChat');
    if (chat) uni.removeStorageSync('selectedChat');
    return chat || null;
  } catch (e) { console.error('获取选中对话失败', e); return null; }
};

/**
 * 复制消息到剪贴板
 * @param {String} content - 消息内容
 * @returns {Promise} 复制结果
 */
export const copyMessage = (content) =>
  new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: content,
      success: () => resolve({ success: true }),
      fail: () => reject(new Error('复制失败'))
    });
  });

/**
 * 提交反馈
 * @param {Object} feedbackData - 反馈数据
 * @param {String} feedbackData.type - 反馈类型
 * @param {String} feedbackData.message - 反馈消息
 * @param {String} feedbackData.chatId - 对话ID
 * @returns {Promise} 提交结果
 */
export const submitFeedback = (feedback) =>
  request({ url: '/chat/feedback', method: 'POST', data: feedback });

/**
 * 获取当前时间
 * @returns {String} 当前时间字符串 (HH:MM)
 */
export const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * 获取当前日期时间
 * @returns {String} 当前日期时间字符串 (YYYY-MM-DD HH:MM)
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
};

/**
 * 生成对话ID
 * @returns {String} 对话ID
 */
export const generateChatId = () => 'chat' + Date.now();

/**
 * 获取对话标题
 * @param {Array} messages - 消息列表
 * @returns {String} 对话标题
 */
export const getChatTitle = (messages) => {
  const userMsg = messages.find(msg => msg.type === 'user');
  if (userMsg) return userMsg.content.length > 20 ? userMsg.content.slice(0, 20) + '...' : userMsg.content;
  return '新对话';
};

/**
 * 获取消息预览文本
 * @param {Array} messages - 消息列表
 * @returns {String} 预览文本
 */
export const getMessagePreview = (messages) => {
  if (!messages.length) return '';
  const text = messages[messages.length - 1].content;
  return text.length > 30 ? text.slice(0, 30) + '...' : text;
};

/**
 * 图片识别API
 * @param {String} imagePath - 图片路径
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回识别结果
 */
export const identifyImage = (imagePath, params = {}) => {
  return uploadFile({
    url: '/chat/identify',
    filePath: imagePath,
    formData: params
  });
};

/**
 * 用户登录
 * @param {Object} loginData - 登录数据
 * @returns {Promise} 返回登录结果
 */
export const userLogin = (loginData) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: loginData,
    headers: { 'Content-Type': 'application/json' }
  });
};

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET'
  });
};

/**
 * 更新用户信息
 * @param {Object} userData - 用户数据
 * @returns {Promise} 返回更新结果
 */
export const updateUserInfo = (userData) => {
  return request({
    url: '/user/info',
    method: 'PUT',
    data: userData
  });
};

export default {
  sendAIMessage,
  saveChatToBackend,
  loadHistoryChats,
  getChatDetail,
  deleteChat,
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
  getUserInfo,
  updateUserInfo
}; 