"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/chatAI/chatAI.js";
  "./pages/profile/profile.js";
  "./pages/pestGallery/pestGallery.js";
  "./pages/profile/record.js";
  "./pages/profile/help.js";
  "./pages/profile/pestShare.js";
  "./pages/chatAI/history.js";
  "./pages/pestDetail/pestDetail.js";
  "./pages/login/login.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    this.setupInterceptor();
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.reLaunch({ url: "/pages/login/login" });
        return false;
      }
      common_vendor.index.request({
        url: "http://localhost:5000/api/auth/check_login",
        method: "GET",
        header: { "Authorization": `Bearer ${token}` },
        success: (res) => {
          if (res.data.code === 401) {
            this.handleLogout();
          }
        },
        fail: () => {
          common_vendor.index.__f__("log", "at App.vue:27", "验证登录状态失败");
        }
      });
      return true;
    },
    handleLogout() {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    },
    setupInterceptor() {
      common_vendor.index.addInterceptor("request", {
        invoke(args) {
          const token = common_vendor.index.getStorageSync("token");
          if (token) {
            if (!args.header)
              args.header = {};
            args.header["Authorization"] = `Bearer ${token}`;
          }
          return args;
        },
        fail(err) {
          common_vendor.index.__f__("error", "at App.vue:52", "请求失败:", err);
        }
      });
      common_vendor.index.addInterceptor("request", {
        success(args) {
          if (args.data && args.data.code === 401) {
            this.handleLogout();
          }
          return args;
        }
      });
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
