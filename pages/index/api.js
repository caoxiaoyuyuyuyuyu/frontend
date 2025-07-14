import { request, uploadFile } from '../../utils/apiConfig.js';

// 用户登录
export const userLogin = (loginData) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: loginData,
    headers: { 'Content-Type': 'application/json' }
  });
};

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET'
  });
};

// 图片识别
export const identifyImage = (imagePath, params = {}) => {
  return uploadFile({
    url: '/chat/identify',
    filePath: imagePath,
    formData: params
  });
};

export default {
  userLogin,
  getUserInfo,
  identifyImage
};