/**
 * 个人中心API接口
 * 包含用户信息、设置、记录、分享等功能
 */

// 基础配置
const BASE_URL = 'http://192.168.241.56:5000'; // 替换为实际的API地址
const API_VERSION = 'api';


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

/**
 * 上传用户头像
 * @param {String} avatarPath - 头像路径
 * @returns {Promise} 返回上传结果
 */
export const uploadAvatar = (avatarPath) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}/${API_VERSION}/user/avatar`,
      filePath: avatarPath,
      name: 'avatar',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data);
          resolve(data);
        } else {
          reject(new Error('上传头像失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取用户设置
 * @returns {Promise} 返回用户设置
 */
export const getUserSettings = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/settings`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取用户设置失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 更新用户设置
 * @param {Object} settings - 设置数据
 * @returns {Promise} 返回更新结果
 */
export const updateUserSettings = (settings) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/settings`,
      method: 'PUT',
      data: settings,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '更新设置失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取识别记录列表
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回识别记录
 */
export const getIdentificationRecords = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/records`,
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
          reject(new Error(res.data.message || '获取识别记录失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取识别记录详情
 * @param {String} recordId - 记录ID
 * @returns {Promise} 返回记录详情
 */
export const getRecordDetail = (recordId) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/records/${recordId}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取记录详情失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 删除识别记录
 * @param {String} recordId - 记录ID
 * @returns {Promise} 返回删除结果
 */
export const deleteRecord = (recordId) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/records/${recordId}`,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '删除记录失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 清空所有识别记录
 * @returns {Promise} 返回清空结果
 */
export const clearAllRecords = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/records/clear-all`,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '清空记录失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 分享害虫信息
 * @param {Object} shareData - 分享数据
 * @returns {Promise} 返回分享结果
 */
export const sharePestInfo = (shareData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/share`,
      method: 'POST',
      data: shareData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '分享失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取分享历史
 * @param {Object} params - 请求参数
 * @returns {Promise} 返回分享历史
 */
export const getShareHistory = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/share-history`,
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
          reject(new Error(res.data.message || '获取分享历史失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 获取帮助信息
 * @returns {Promise} 返回帮助信息
 */
export const getHelpInfo = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/help`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取帮助信息失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 提交反馈
 * @param {Object} feedbackData - 反馈数据
 * @returns {Promise} 返回提交结果
 */
export const submitUserFeedback = (feedbackData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/feedback`,
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
 * 获取用户统计信息
 * @returns {Promise} 返回统计信息
 */
export const getUserStatistics = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/statistics`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '获取统计信息失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 退出登录
 * @returns {Promise} 返回退出结果
 */
export const logout = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${API_VERSION}/user/logout`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '退出登录失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

export default {
  getUserInfo,
  updateUserInfo,
  uploadAvatar,
  getUserSettings,
  updateUserSettings,
  getIdentificationRecords,
  getRecordDetail,
  deleteRecord,
  clearAllRecords,
  sharePestInfo,
  getShareHistory,
  getHelpInfo,
  submitUserFeedback,
  getUserStatistics,
  logout
}; 