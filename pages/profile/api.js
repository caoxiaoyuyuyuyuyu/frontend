/**
 * 个人中心API接口
 * 包含用户信息、设置、记录、分享等功能
 */

import { request, uploadFile, getApiUrl } from '../../utils/apiConfig.js';

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
export const getUserInfo = () => request({ url: '/user/info', method: 'GET' });

/**
 * 更新用户昵称
 * @param {String} nickname - 用户昵称
 * @returns {Promise} 返回更新结果
 */
export const updateNickname = (nickname) => request({ url: '/user/info', method: 'PUT', data: { nickname } });

/**
 * 上传用户头像
 * @param {String} avatarPath - 头像路径
 * @returns {Promise} 返回上传结果
 */
export const updateAvatar = (avatarPath) => uploadFile({ url: '/user/avatar', filePath: avatarPath, name: 'avatar' });

/**
 * 获取用户设置
 * @returns {Promise} 返回用户设置
 */
export const getUserSettings = () => request({ url: '/user/settings', method: 'GET' });

/**
 * 更新用户设置
 * @param {Object} settings - 设置数据
 * @returns {Promise} 返回更新结果
 */
export const updateUserSettings = (settings) => request({ url: '/user/settings', method: 'PUT', data: settings });

/**
 * 获取识别记录列表
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回识别记录
 */
export const getRecords = (params = {}) => request({ url: '/detect/records', method: 'GET', data: params });

/**
 * 获取害虫图片URL
 * @param {String} imageName - 图片文件名
 * @returns {String} 完整图片URL
 */
export const getImageUrl = (imageName) => {
  if (!imageName) return '';
  return getApiUrl(`/detect/images/${imageName}`);
};


/**
 * 获取识别记录详情
 * @param {String} id - 记录ID
 * @returns {Promise} 返回记录详情
 */
export const getRecordDetail = (id) => request({ url: `/user/records/${id}`, method: 'GET' });

/**
 * 删除识别记录
 * @param {String} id - 记录ID
 * @returns {Promise} 返回删除结果
 */
export const removeRecord = (id) => request({ url: `/user/records/${id}`, method: 'DELETE' });

/**
 * 清空所有识别记录
 * @returns {Promise} 返回清空结果
 */
export const clearRecords = () => request({ url: '/user/records/clear-all', method: 'DELETE' });

/**
 * 分享害虫信息
 * @param {Object} data - 分享数据
 * @returns {Promise} 返回分享结果
 */
export const sharePest = (data) => request({ url: '/user/share', method: 'POST', data });

/**
 * 获取分享历史
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回分享历史
 */
export const getShareHistory = (params = {}) => request({ url: '/user/share-history', method: 'GET', data: params });

/**
 * 获取帮助信息
 * @returns {Promise} 返回帮助信息
 */
export const getHelp = () => request({ url: '/help', method: 'GET' });

/**
 * 退出登录
 * @returns {Promise} 返回退出结果
 */
export const logout = () => request({ url: '/user/logout', method: 'POST' });

export default {
  getUserInfo,
  updateNickname,
  updateAvatar,
  getUserSettings,
  updateUserSettings,
  getRecords,
  getRecordDetail,
  removeRecord,
  clearRecords,
  sharePest,
  getShareHistory,
  getHelp,
  logout
}; 