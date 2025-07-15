"use strict";
const common_vendor = require("../common/vendor.js");
const API_CONFIG = {
  // 基础URL
  BASE_URL: "http://localhost:5000",
  // API版本
  API_VERSION: "api",
  // 请求超时时间（毫秒）
  TIMEOUT: 5e4,
  // 重试次数
  RETRY_TIMES: 3,
  // 重试延迟（毫秒）
  RETRY_DELAY: 1e3
};
const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${endpoint}`;
};
const getHeaders = (customHeaders = {}) => {
  const token = common_vendor.index.getStorageSync("token");
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }
  return { ...defaultHeaders, ...customHeaders };
};
const requestInterceptor = (config) => {
  if (config.method === "GET") {
    config.data = {
      ...config.data,
      _t: Date.now()
    };
  }
  return config;
};
const responseInterceptor = (response) => {
  var _a;
  if (response.statusCode === 200) {
    return response.data;
  } else if (response.statusCode === 401) {
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.showModal({
      title: "提示",
      content: "登录已过期，请重新登录",
      showCancel: false,
      confirmText: "去登录",
      success: (res) => {
        if (res.confirm) {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }
      }
    });
    return Promise.reject(new Error("登录已过期"));
  } else if (response.statusCode === 403) {
    return Promise.reject(new Error("没有权限访问"));
  } else if (response.statusCode >= 500) {
    return Promise.reject(new Error("服务器错误"));
  } else {
    return Promise.reject(new Error(((_a = response.data) == null ? void 0 : _a.message) || "请求失败"));
  }
};
const request = (options) => {
  const { url, method = "GET", data = {}, headers = {}, ...rest } = options;
  const config = requestInterceptor({
    url: getApiUrl(url),
    method,
    data,
    header: getHeaders(headers),
    timeout: API_CONFIG.TIMEOUT,
    ...rest
  });
  common_vendor.index.__f__("log", "at utils/apiConfig.js:144", config);
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
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
        const apiError = new Error("网络请求失败");
        apiError.originalError = error;
        reject(apiError);
      }
    });
  });
};
const uploadFile = (options) => {
  const { url, filePath, name = "file", formData = {}, headers = {}, ...rest } = options;
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
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
            reject(new Error("文件上传失败"));
          }
        } catch (error) {
          reject(new Error("文件上传失败"));
        }
      },
      fail: (error) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
exports.getApiUrl = getApiUrl;
exports.request = request;
exports.uploadFile = uploadFile;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/apiConfig.js.map
