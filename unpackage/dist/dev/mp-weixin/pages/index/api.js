"use strict";
const utils_apiConfig = require("../../utils/apiConfig.js");
const identifyImage = (imagePath, params = {}) => {
  return utils_apiConfig.uploadFile({
    url: "/detect/image",
    filePath: imagePath,
    formData: params
  });
};
exports.identifyImage = identifyImage;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/api.js.map
