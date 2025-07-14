"use strict";
const utils_apiConfig = require("../../utils/apiConfig.js");
const getPestList = (params = {}) => {
  return utils_apiConfig.request({
    url: "/pest",
    method: "GET",
    data: params
  });
};
const getImageUrl = (imageName) => {
  if (!imageName)
    return "";
  return utils_apiConfig.getApiUrl(`/pest/images/${imageName}`);
};
exports.getImageUrl = getImageUrl;
exports.getPestList = getPestList;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pestGallery/api.js.map
