import { request, uploadFile } from '../../utils/apiConfig.js';

// 图片识别
export const identifyImage = (imagePath, params = {}) => {
  return uploadFile({
    url: '/detect/image',
    filePath: imagePath,
    formData: params
  });
};

export default {
  identifyImage
};