"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        image: "",
        name: "",
        feature: ""
      },
      contributions: []
      // 初始为空，用户提交后才有记录
    };
  },
  methods: {
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.form.image = res.tempFilePaths[0];
        }
      });
    },
    submit() {
      if (!this.form.image || !this.form.name || !this.form.feature) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      this.contributions.unshift({
        id: Date.now(),
        time: this.getNowTime(),
        name: this.form.name,
        status: "待审核",
        reason: "",
        image: this.form.image
      });
      common_vendor.index.showModal({
        title: "提交成功",
        content: "您的贡献将在一周内审核，通过后获得10积分。",
        showCancel: false
      });
      this.form = { image: "", name: "", feature: "" };
    },
    getStatusIcon(status) {
      if (status === "待审核")
        return "/static/icon_pending.png";
      if (status === "已通过")
        return "/static/icon_pass.png";
      if (status === "被驳回")
        return "/static/icon_reject.png";
      return "";
    },
    statusClass(status) {
      if (status === "待审核")
        return "status-pending";
      if (status === "已通过")
        return "status-pass";
      if (status === "被驳回")
        return "status-reject";
      return "";
    },
    getNowTime() {
      const d = /* @__PURE__ */ new Date();
      const pad = (n) => n < 10 ? "0" + n : n;
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.image
  }, $data.form.image ? {
    b: $data.form.image
  } : {}, {
    c: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    d: $data.form.name,
    e: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    f: $data.form.feature,
    g: common_vendor.o(($event) => $data.form.feature = $event.detail.value),
    h: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    i: $data.contributions.length === 0
  }, $data.contributions.length === 0 ? {} : {}, {
    j: common_vendor.f($data.contributions, (item, k0, i0) => {
      return common_vendor.e({
        a: $options.getStatusIcon(item.status),
        b: common_vendor.t(item.time),
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.status),
        e: common_vendor.n($options.statusClass(item.status)),
        f: item.status === "被驳回"
      }, item.status === "被驳回" ? {
        g: common_vendor.t(item.reason)
      } : {}, {
        h: item.id
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f388e290"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/pestShare.js.map
