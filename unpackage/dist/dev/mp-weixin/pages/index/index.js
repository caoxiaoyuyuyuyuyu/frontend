"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const login = () => "../../components/login/login.js";
const _sfc_main = {
  components: { login },
  data() {
    return {
      title: "智慧农业",
      showLoginPopup: false,
      hasLogin: false,
      userInfo: {}
    };
  },
  onLoad() {
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
          common_vendor.index.__f__("log", "at pages/index/index.vue:97", "拍照成功:", res.tempFilePaths);
          this.uploadAndIdentify(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:102", "拍照失败:", err);
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
          common_vendor.index.__f__("log", "at pages/index/index.vue:117", "选择照片成功:", res.tempFilePaths);
          this.uploadAndIdentify(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:122", "选择照片失败:", err);
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
if (!Array) {
  const _component_login = common_vendor.resolveComponent("login");
  _component_login();
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
    d: common_assets._imports_0,
    e: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    f: common_assets._imports_1,
    g: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
