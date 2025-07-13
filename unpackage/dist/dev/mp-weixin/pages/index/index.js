"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      title: "害虫识别"
    };
  },
  onLoad() {
  },
  methods: {
    // 拍照功能
    takePhoto() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:64", "拍照成功:", res.tempFilePaths);
          this.uploadAndIdentify(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:69", "拍照失败:", err);
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
          common_vendor.index.__f__("log", "at pages/index/index.vue:84", "选择照片成功:", res.tempFilePaths);
          this.uploadAndIdentify(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:89", "选择照片失败:", err);
          common_vendor.index.showToast({
            title: "选择照片失败",
            icon: "none"
          });
        }
      });
    },
    // 上传并识别
    uploadAndIdentify(imagePath) {
      common_vendor.index.showLoading({
        title: "正在识别..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "识别功能开发中",
          icon: "none"
        });
      }, 2e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    b: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
