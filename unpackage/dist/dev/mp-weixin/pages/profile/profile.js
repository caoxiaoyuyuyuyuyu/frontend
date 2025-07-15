"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      showLoginPopup: false,
      hasLogin: false,
      userInfo: {},
      features: [
        { text: "识别记录", icon: "/static/logo.png", url: "/pages/profile/record" },
        { text: "识别帮助", icon: "/static/logo.png", url: "/pages/profile/help" },
        { text: "联系客服", icon: "/static/logo.png", url: "" },
        { text: "退出登录", icon: "/static/logo.png", url: "" }
      ]
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
    onFeatureClick(item) {
      if (item.url) {
        common_vendor.index.navigateTo({ url: item.url });
      } else if (item.text === "联系客服") {
        common_vendor.index.showToast({ title: "请联系客服：123-456-7890", icon: "none" });
      } else if (item.text === "退出登录") {
        common_vendor.index.removeStorageSync("userInfo");
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      } else {
        common_vendor.index.showToast({ title: item.text, icon: "none" });
      }
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
    d: $data.userInfo.avatar,
    e: common_vendor.o((...args) => _ctx.modifyNickname && _ctx.modifyNickname(...args)),
    f: $data.userInfo.nickname,
    g: common_vendor.o(($event) => $data.userInfo.nickname = $event.detail.value),
    h: common_vendor.f($data.features, (item, k0, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.text),
        c: item.text,
        d: common_vendor.o(($event) => $options.onFeatureClick(item), item.text)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
