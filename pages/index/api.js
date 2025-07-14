/**
 * 首页API接口
 * 包含首页数据获取、轮播图、推荐内容等接口
 */

// 基础配置
const BASE_URL = 'http://192.168.241.56:5000'; // 替换为实际的API地址
const API_VERSION = 'api';

/**
 * 获取首页数据
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回首页数据
 */
export const getHomeData = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/home`,
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
          reject(new Error(res.data.message || '获取首页数据失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取轮播图数据
 * @returns {Promise} 返回轮播图数据
 */
export const getBannerData = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/banners`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取轮播图失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取推荐害虫列表
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回推荐害虫列表
 */
export const getRecommendedPests = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/pests/recommended`,
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
          reject(new Error(res.data.message || '获取推荐害虫失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取快速识别功能数据
 * @returns {Promise} 返回快速识别功能数据
 */
export const getQuickIdentifyData = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/quick-identify`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取快速识别数据失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取用户统计信息
 * @returns {Promise} 返回用户统计信息
 */
export const getUserStats = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/stats`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取用户统计失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取最新资讯
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回最新资讯
 */
export const getLatestNews = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/news/latest`,
      method: 'GET',
      data: params,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取最新资讯失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 记录用户行为
 * @param {Object} data - 行为数据
 * @returns {Promise} 返回记录结果
 */
export const recordUserAction = (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/action`,
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '记录用户行为失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

export default {
  getHomeData,
  getBannerData,
  getRecommendedPests,
  getQuickIdentifyData,
  getUserStats,
  getLatestNews,
  recordUserAction
}; 