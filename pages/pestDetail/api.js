/**
 * 害虫详情API接口
 * 根据Vue文件需求编写
 */

// 基础配置
const BASE_URL = 'http://192.168.241.56:5000'; // 替换为实际的API地址
const API_VERSION = 'api';

/**
 * 获取图片URL
 * @param {String} imageName - 图片文件名
 * @returns {String} 返回完整的图片URL
 */
export const getImageUrl = (imageName) => {
  if (!imageName) return '';
  return `${BASE_URL}/${API_VERSION}/pest/images/${imageName}`;
};

/**
 * 获取害虫详细信息
 * @param {String} pestId - 害虫ID
 * @returns {Promise} 返回害虫详细信息
 */
export const getPestDetailInfo = (pestId) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/pest/${pestId}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 直接返回后端数据
          resolve(res.data.data);
        } else {
          reject(new Error(res.data.message || '获取害虫详情失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取害虫收藏状态
 * @param {String} pestName - 害虫名称
 * @returns {Boolean} 返回收藏状态
 */
export const getPestFavoriteStatus = (pestName) => {
  const favorites = uni.getStorageSync('pest_favorites') || [];
  return favorites.some(item => item.name === pestName);
};

/**
 * 切换害虫收藏状态
 * @param {Object} pestInfo - 害虫信息
 * @param {Boolean} isFavorite - 是否收藏
 * @returns {Promise} 返回操作结果
 */
export const togglePestFavorite = (pestInfo, isFavorite) => {
  return new Promise((resolve, reject) => {
    try {
      let favorites = uni.getStorageSync('pest_favorites') || [];
      
      if (isFavorite) {
        const favoriteItem = {
          name: pestInfo.name,
          image: pestInfo.image,
          timestamp: Date.now()
        };
        const existingIndex = favorites.findIndex(item => item.name === pestInfo.name);
        if (existingIndex === -1) {
          favorites.push(favoriteItem);
        }
      } else {
        favorites = favorites.filter(item => item.name !== pestInfo.name);
      }
      
      uni.setStorageSync('pest_favorites', favorites);
      resolve({ success: true, favorites });
    } catch (error) {
      reject(new Error('操作收藏失败'));
    }
  });
};

export default {
  getPestDetailInfo,
  getPestFavoriteStatus,
  togglePestFavorite
}; 