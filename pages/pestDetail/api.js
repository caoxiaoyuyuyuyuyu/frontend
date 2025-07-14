/**
 * 害虫详情API接口
 * 根据Vue文件需求编写
 */

import { getApiUrl, request } from '../../utils/apiConfig.js';

/**
 * 获取图片URL
 * @param {String} imageName - 图片文件名
 * @returns {String} 返回完整的图片URL
 */
export const getImageUrl = (imageName) => {
  if (!imageName) return '';
  return getApiUrl(`/pest/images/${imageName}`);
};

/**
 * 获取害虫详细信息
 * @param {String} pestId - 害虫ID
 * @returns {Promise} 返回害虫详细信息
 */
export const getPestDetailInfo = (pestId) => {
  return request({
    url: `/pest/${pestId}`,
    method: 'GET'
  }).then(res => res.data);
};

export default {
  getPestDetailInfo,
  getImageUrl
}; 