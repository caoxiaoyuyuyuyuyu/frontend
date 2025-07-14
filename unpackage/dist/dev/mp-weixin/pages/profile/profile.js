"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      features: [
        { text: "识别记录", icon: "/static/logo.png", url: "/pages/profile/record" },
        { text: "害虫百科贡献", icon: "/static/logo.png", url: "/pages/profile/pestShare" },
        { text: "识别帮助", icon: "/static/logo.png", url: "/pages/profile/help" },
        { text: "联系客服", icon: "/static/logo.png", url: "" }
      ],
      avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      nickname: "微信用户"
    };
  },
  methods: {
    onFeatureClick(item) {
      if (item.url) {
        common_vendor.index.navigateTo({ url: item.url });
      } else {
        if (item.text === "联系客服") {
          common_vendor.index.showToast({ title: "请联系客服：123-456-7890", icon: "none" });
        } else {
          common_vendor.index.showToast({ title: item.text, icon: "none" });
        }
      }
    },
    showPointInfo() {
      common_vendor.index.showModal({
        title: "识别积分说明",
        content: "识别积分用于衡量用户在平台的活跃度和贡献度。积分可通过识别害虫、参与活动等方式获得，积分越高会员等级越高，可享受更多权益。",
        showCancel: false
      });
    },
    chooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.avatarUrl = res.tempFilePaths[0];
        }
      });
    },
    saveNickname() {
      common_vendor.index.showToast({ title: "昵称已修改", icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatarUrl,
    b: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    c: common_vendor.o((...args) => $options.saveNickname && $options.saveNickname(...args)),
    d: $data.nickname,
    e: common_vendor.o(($event) => $data.nickname = $event.detail.value),
    f: common_vendor.o((...args) => $options.showPointInfo && $options.showPointInfo(...args)),
    g: common_vendor.f($data.features, (item, k0, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.text),
        c: item.text,
        d: common_vendor.o(($event) => $options.onFeatureClick(item), item.text)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
