"use strict";
const utils_apiConfig = require("../../utils/apiConfig.js");
const getRecords = (params = {}) => utils_apiConfig.request({ url: "/detect/records", method: "GET", data: params });
const getImageUrl = (imageName) => {
  if (!imageName)
    return "";
  return utils_apiConfig.getApiUrl(`/detect/images/${imageName}`);
};
exports.getImageUrl = getImageUrl;
exports.getRecords = getRecords;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/api.js.map
