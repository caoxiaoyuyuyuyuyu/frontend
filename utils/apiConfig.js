/**
 * API配置文件
 * 统一管理所有API的基础配置
 */

// API基础配置
export const API_CONFIG = {
  // 基础URL
  BASE_URL: 'http://localhost:5000',
  
  // API版本
  API_VERSION: 'api',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 50000,
  
  // 重试次数
  RETRY_TIMES: 3,
  
  // 重试延迟（毫秒）
  RETRY_DELAY: 1000
};

/**
 * 获取完整的API URL
 * @param {String} endpoint - API端点
 * @returns {String} 完整的API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${endpoint}`;
};

/**
 * 获取请求头
 * @param {Object} customHeaders - 自定义请求头
 * @returns {Object} 请求头对象
 */
export const getHeaders = (customHeaders = {}) => {
  const token = uni.getStorageSync('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  return { ...defaultHeaders, ...customHeaders };
};

/**
 * 统一错误处理
 * @param {Error} error - 错误对象
 * @param {String} defaultMessage - 默认错误消息
 */
export const handleApiError = (error, defaultMessage = '请求失败') => {
  console.error('API Error:', error);
  
  let message = defaultMessage;
  if (error.message) {
    message = error.message;
  }
  
  // 显示错误提示
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
  
  return Promise.reject(error);
};

/**
 * 请求拦截器
 * @param {Object} config - 请求配置
 * @returns {Object} 处理后的配置
 */
export const requestInterceptor = (config) => {
  // 添加时间戳防止缓存
  if (config.method === 'GET') {
    config.data = {
      ...config.data,
      _t: Date.now()
    };
  }
  
  return config;
};

/**
 * 响应拦截器
 * @param {Object} response - 响应对象
 * @returns {Object} 处理后的响应
 */
export const responseInterceptor = (response) => {
  // 统一处理响应
  if (response.statusCode === 200) {
    return response.data;
  } else if (response.statusCode === 401) {
    // 未授权，清除token并弹窗跳转到登录页
    uni.removeStorageSync('token');
    uni.showModal({
      title: '提示',
      content: '登录已过期，请重新登录',
      showCancel: false,
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
    return Promise.reject(new Error('登录已过期'));
  } else if (response.statusCode === 403) {
    return Promise.reject(new Error('没有权限访问'));
  } else if (response.statusCode >= 500) {
    return Promise.reject(new Error('服务器错误'));
  } else {
    return Promise.reject(new Error(response.data?.message || '请求失败'));
  }
};

/**
 * 通用请求方法
 * @param {Object} options - 请求选项
 * @returns {Promise} 请求Promise
 */
export const request = (options) => {
  const { url, method = 'GET', data = {}, headers = {}, ...rest } = options;
  
  // 应用请求拦截器
  const config = requestInterceptor({
    url: getApiUrl(url),
    method,
    data,
    header: getHeaders(headers),
    timeout: API_CONFIG.TIMEOUT,
    ...rest
  });
  console.log(config)
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (response) => {
        try {
          const result = responseInterceptor(response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        const apiError = new Error('网络请求失败');
        apiError.originalError = error;
        reject(apiError);
      }
    });
  });
};

/**
 * 文件上传方法
 * @param {Object} options - 上传选项
 * @returns {Promise} 上传Promise
 */
export const uploadFile = (options) => {
  const { url, filePath, name = 'file', formData = {}, headers = {}, ...rest } = options;
  
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: getApiUrl(url),
      filePath,
      name,
      formData,
      header: getHeaders(headers),
      timeout: API_CONFIG.TIMEOUT,
      ...rest,
      success: (response) => {
        try {
          if (response.statusCode === 200) {
            const data = JSON.parse(response.data);
            resolve(data);
          } else {
            reject(new Error('文件上传失败'));
          }
        } catch (error) {
          reject(new Error('文件上传失败'));
        }
      },
      fail: (error) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
};

/**
 * 带重试的请求方法
 * @param {Function} requestFn - 请求函数
 * @param {Number} retryTimes - 重试次数
 * @returns {Promise} 请求Promise
 */
export const requestWithRetry = async (requestFn, retryTimes = API_CONFIG.RETRY_TIMES) => {
  let lastError;
  
  for (let i = 0; i <= retryTimes; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (i < retryTimes) {
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

export default {
  API_CONFIG,
  getApiUrl,
  getHeaders,
  handleApiError,
  request,
  uploadFile,
  requestWithRetry
}; 