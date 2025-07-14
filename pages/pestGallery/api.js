/**
 * 害虫图库API接口
 * 根据Vue文件需求编写
 */

import { request, getApiUrl } from '../../utils/apiConfig.js';

/**
 * 获取害虫列表
 * @param {Object} params - 查询参数 { page, per_page }
 * @returns {Promise} 害虫列表及分页信息
 */
export const getPestList = (params = {}) => {
  return request({
    url: '/pest',
    method: 'GET',
    data: params
  });
};

/**
 * 获取害虫图片URL
 * @param {String} imageName - 图片文件名
 * @returns {String} 完整图片URL
 */
export const getImageUrl = (imageName) => {
  if (!imageName) return '';
  return getApiUrl(`/pest/images/${imageName}`);
};

export default {
  getPestList,
  getImageUrl
}; 