"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "LoginPopup",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasLogin: false,
      userInfo: {}
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.checkLogin();
      }
    }
  },
  methods: {
    // 检查登录状态
    checkLogin() {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        this.hasLogin = true;
        this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
        this.$emit("success", this.userInfo);
      }
    },
    // 获取用户信息
    async handleGetUserInfo(e) {
      const userInfo = e.detail.userInfo;
      if (!userInfo) {
        common_vendor.index.showToast({ title: "您拒绝了授权", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "登录中..." });
      try {
        const loginRes = await common_vendor.index.login({
          provider: "weixin"
        });
        const res = await common_vendor.index.request({
          url: "http://192.168.241.56:5000/api/auth/login",
          method: "POST",
          data: {
            code: loginRes.code,
            userInfo
          }
        });
        if (res.data.code === 200) {
          common_vendor.index.setStorageSync("token", res.data.data.token);
          common_vendor.index.setStorageSync("userInfo", res.data.data.userInfo);
          this.hasLogin = true;
          this.userInfo = res.data.data.userInfo;
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "登录成功" });
          this.$emit("success", this.userInfo);
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: res.data.message || "登录失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误，请重试", icon: "none" });
        common_vendor.index.__f__("error", "at components/login/login.vue:89", "登录错误:", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? {
    b: common_assets._imports_0$3,
    c: common_vendor.o((...args) => $options.handleGetUserInfo && $options.handleGetUserInfo(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/login/login.js.map
