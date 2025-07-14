"use strict";
const common_vendor = require("../../common/vendor.js");
const BASE_URL = "http://192.168.241.56:5000";
const API_VERSION = "api";
const getImageUrl = (imageName) => {
  if (!imageName)
    return "";
  return `${BASE_URL}/${API_VERSION}/pest/images/${imageName}`;
};
const getPestDetailInfo = (pestId) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}/${API_VERSION}/pest/${pestId}`,
      method: "GET",
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data.message || "获取害虫详情失败"));
        }
      },
      fail: (err) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
exports.getImageUrl = getImageUrl;
exports.getPestDetailInfo = getPestDetailInfo;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pestDetail/api.js.map
