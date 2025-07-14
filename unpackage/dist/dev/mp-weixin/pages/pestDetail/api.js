"use strict";
const utils_apiConfig = require("../../utils/apiConfig.js");
const getImageUrl = (imageName) => {
  if (!imageName)
    return "";
  return utils_apiConfig.getApiUrl(`/pest/images/${imageName}`);
};
const getPestDetailInfo = (pestId) => {
  return utils_apiConfig.request({
    url: `/pest/${pestId}`,
    method: "GET"
  }).then((res) => res.data);
};
exports.getImageUrl = getImageUrl;
exports.getPestDetailInfo = getPestDetailInfo;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pestDetail/api.js.map
