/**
 * 害虫图库API接口
 * 根据Vue文件需求编写
 */

// 基础配置
const BASE_URL = 'http://192.168.241.56:5000'; // 替换为实际的API地址
const API_VERSION = 'api';

/**
 * 获取害虫列表
 * @param {Object} params - 请求参数
 * @param {Number} params.page - 页码
 * @param {Number} params.per_page - 每页数量
 * @returns {Promise} 返回害虫列表和分页信息
 */
export const getPestList = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/pest`,
      method: 'GET',
      data: params,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 直接返回后端数据
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取害虫列表失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取害虫图片URL
 * @param {String} imageName - 图片文件名
 * @returns {String} 返回完整的图片URL
 */
export const getImageUrl = (imageName) => {
  if (!imageName) return '';
  return `${BASE_URL}/${API_VERSION}/pest/images/${imageName}`;
};

export default {
  getPestList,
  getImageUrl
}; 