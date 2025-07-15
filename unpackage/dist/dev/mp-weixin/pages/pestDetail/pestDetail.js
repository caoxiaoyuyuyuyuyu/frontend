"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_pestDetail_api = require("./api.js");
const _sfc_main = {
  data() {
    return {
      pestInfo: {},
      activeTab: 0,
      tabs: [
        { title: "形态特征" },
        { title: "生态习性" },
        { title: "危害特征" },
        { title: "防控管理" },
        { title: "发生分布" }
      ]
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/pestDetail/pestDetail.vue:223", options);
    if (options.pestId) {
      pages_pestDetail_api.getPestDetailInfo(options.pestId).then((data) => {
        this.pestInfo = data;
      }).catch(() => {
        common_vendor.index.showToast({ title: "获取详情失败", icon: "none" });
      });
    } else if (options.pest) {
      this.pestInfo = JSON.parse(decodeURIComponent(options.pest));
    }
  },
  methods: {
    // 获取图片URL
    getImageUrl(imageName) {
      return pages_pestDetail_api.getImageUrl(imageName);
    },
    switchTab(idx) {
      this.activeTab = idx;
    },
    onContinue() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/pestDetail/pestDetail.vue:249", "拍照成功:", res.tempFilePaths);
          this.uploadAndIdentify(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/pestDetail/pestDetail.vue:254", "拍照失败:", err);
          common_vendor.index.showToast({
            title: "拍照失败",
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
    },
    onShare() {
      common_vendor.index.showToast({ title: "分享功能开发中", icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.pestInfo.image
  }, $data.pestInfo.image ? {
    b: $options.getImageUrl($data.pestInfo.image)
  } : {}, {
    c: common_vendor.t($data.pestInfo.name),
    d: $data.pestInfo.alias
  }, $data.pestInfo.alias ? {
    e: common_vendor.t($data.pestInfo.alias)
  } : {}, {
    f: common_vendor.t($data.pestInfo.taxonomy || "无"),
    g: common_vendor.f($data.tabs, (tab, idx, i0) => {
      return {
        a: common_vendor.t(tab.title),
        b: idx,
        c: common_vendor.o(($event) => $options.switchTab(idx), idx),
        d: $data.activeTab === idx ? 1 : ""
      };
    }),
    h: $data.activeTab === 0
  }, $data.activeTab === 0 ? {
    i: common_vendor.t($data.pestInfo.adult_features || "无"),
    j: common_vendor.t($data.pestInfo.larval_features || "无"),
    k: common_vendor.t($data.pestInfo.egg_features || "无"),
    l: common_vendor.t($data.pestInfo.pupa_features || "无")
  } : {}, {
    m: $data.activeTab === 1
  }, $data.activeTab === 1 ? {
    n: common_vendor.t($data.pestInfo.host_range || "无"),
    o: common_vendor.t($data.pestInfo.habitat || "无"),
    p: common_vendor.t($data.pestInfo.activity_pattern || "无"),
    q: common_vendor.t($data.pestInfo.overwintering || "无")
  } : {}, {
    r: $data.activeTab === 2
  }, $data.activeTab === 2 ? {
    s: common_vendor.t($data.pestInfo.damage_period || "无"),
    t: common_vendor.t($data.pestInfo.damage_method || "无"),
    v: common_vendor.t($data.pestInfo.damage_symptoms || "无")
  } : {}, {
    w: $data.activeTab === 3
  }, $data.activeTab === 3 ? {
    x: common_vendor.t($data.pestInfo.monitoring_methods || "无"),
    y: common_vendor.t($data.pestInfo.agricultural_control || "无"),
    z: common_vendor.t($data.pestInfo.physical_control || "无"),
    A: common_vendor.t($data.pestInfo.biological_control || "无"),
    B: common_vendor.t($data.pestInfo.chemical_control || "无"),
    C: common_vendor.t($data.pestInfo.quarantine_requirements || "无")
  } : {}, {
    D: $data.activeTab === 4
  }, $data.activeTab === 4 ? {
    E: common_vendor.t($data.pestInfo.geographical_distribution || "无"),
    F: common_vendor.t($data.pestInfo.generations_per_year || "无"),
    G: common_vendor.t($data.pestInfo.reproductive_characteristics || "无")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bf770616"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pestDetail/pestDetail.js.map
