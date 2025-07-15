"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_index_api = require("./api.js");
const utils_apiConfig = require("../../utils/apiConfig.js");
const common_assets = require("../../common/assets.js");
const login = () => "../../components/login/login.js";
const _sfc_main = {
  components: { login },
  data() {
    return {
      title: "智慧农业",
      showLoginPopup: false,
      hasLogin: false,
      userInfo: {},
      showResultPopup: false,
      detectionResults: []
    };
  },
  onShow() {
    this.checkLogin();
  },
  methods: {
    // 检查登录状态
    checkLogin() {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        this.hasLogin = true;
        this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
        this.showLoginPopup = false;
      } else {
        this.hasLogin = false;
        this.showLoginPopup = true;
      }
    },
    // 登录弹窗回调
    onLoginSuccess(userInfo) {
      this.hasLogin = true;
      this.userInfo = userInfo;
      this.showLoginPopup = false;
    },
    // 拍照功能
    takePhoto() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:133", "拍照成功:", res.tempFilePaths);
          this.uploadAndIdentify(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:137", "拍照失败:", err);
          common_vendor.index.showToast({
            title: "拍照失败",
            icon: "none"
          });
        }
      });
    },
    // 选择照片功能
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:152", "选择照片成功:", res.tempFilePaths);
          this.uploadAndIdentify(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:156", "选择照片失败:", err);
          common_vendor.index.showToast({
            title: "选择照片失败",
            icon: "none"
          });
        }
      });
    },
    // 上传并识别
    async uploadAndIdentify(imagePath) {
      common_vendor.index.showLoading({
        title: "正在识别...",
        mask: true
      });
      try {
        const response = await pages_index_api.identifyImage(imagePath);
        common_vendor.index.__f__("log", "at pages/index/index.vue:174", "识别结果:", response);
        if (response.code === 200) {
          this.detectionResults = response.data;
          this.showResultPopup = true;
        } else {
          common_vendor.index.showToast({
            title: response.message || "识别失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:186", "识别出错:", error);
        common_vendor.index.showToast({
          title: "识别服务异常",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 获取图片完整URL
    getImageUrl(imagePath) {
      if (!imagePath)
        return "";
      return utils_apiConfig.getApiUrl(`/detect/images/${imagePath}`);
    },
    // 关闭结果弹窗
    closeResultPopup() {
      this.showResultPopup = false;
    },
    // 跳转到害虫详情页
    goToPestDetail(pestId) {
      common_vendor.index.navigateTo({
        url: `/pages/pestDetail/pestDetail?pestId=${pestId}`
      });
    },
    // 跳转到识别记录页
    goToRecordPage() {
      common_vendor.index.navigateTo({
        url: "/pages/profile/record"
      });
    }
  }
};
if (!Array) {
  const _easycom_login2 = common_vendor.resolveComponent("login");
  _easycom_login2();
}
const _easycom_login = () => "../../components/login/login.js";
if (!Math) {
  _easycom_login();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showLoginPopup
  }, $data.showLoginPopup ? {
    b: common_vendor.o($options.onLoginSuccess),
    c: common_vendor.p({
      show: $data.showLoginPopup
    })
  } : {}, {
    d: $data.showResultPopup
  }, $data.showResultPopup ? {
    e: common_vendor.o((...args) => $options.closeResultPopup && $options.closeResultPopup(...args)),
    f: common_vendor.o((...args) => $options.closeResultPopup && $options.closeResultPopup(...args)),
    g: common_vendor.t($data.detectionResults.length),
    h: common_vendor.f($data.detectionResults, (item, index, i0) => {
      return {
        a: $options.getImageUrl(item.image_url),
        b: common_vendor.t(item.pest_name),
        c: common_vendor.t((item.confidence * 100).toFixed(1)),
        d: index,
        e: common_vendor.o(($event) => $options.goToPestDetail(item.pest_id), index)
      };
    })
  } : {}, {
    i: common_assets._imports_0,
    j: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    k: common_assets._imports_1,
    l: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
