"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      records: [
        // 示例数据，实际应从后端获取
        {
          id: 1,
          image: "/static/pest1.jpg",
          name: "棉铃虫",
          time: "2024/07/15 14:30:00",
          confidence: "92%",
          type: "蛾类"
        }
        // ...
      ],
      searchText: "",
      timeOptions: ["全部", "最近一周", "最近一个月"],
      timeFilter: 0,
      confidenceOptions: ["默认排序", "高可信度优先", "低可信度优先"],
      confidenceFilter: 0,
      filteredRecords: [],
      stat: {
        count: 0,
        topType: ""
      }
    };
  },
  created() {
    this.filterRecords();
    this.calcStat();
  },
  methods: {
    fixDateStr(str) {
      if (!str)
        return "";
      return str.replace(/-/g, "/").replace(/(\d{2}:\d{2})$/, "$1:00");
    },
    filterRecords() {
      let list = this.records;
      if (this.searchText) {
        list = list.filter((r) => r.name.includes(this.searchText));
      }
      if (this.timeFilter === 1) {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1e3;
        list = list.filter((r) => new Date(this.fixDateStr(r.time)).getTime() > weekAgo);
      } else if (this.timeFilter === 2) {
        const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1e3;
        list = list.filter((r) => new Date(this.fixDateStr(r.time)).getTime() > monthAgo);
      }
      if (this.confidenceFilter === 1) {
        list = list.slice().sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence));
      } else if (this.confidenceFilter === 2) {
        list = list.slice().sort((a, b) => parseInt(a.confidence) - parseInt(b.confidence));
      }
      this.filteredRecords = list;
    },
    onTimeChange(e) {
      this.timeFilter = e.detail.value;
      this.filterRecords();
    },
    onConfidenceChange(e) {
      this.confidenceFilter = e.detail.value;
      this.filterRecords();
    },
    viewDetail(item) {
      common_vendor.index.navigateTo({ url: `/pages/profile/recordDetail?id=${item.id}` });
    },
    deleteRecord(item) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除该识别记录吗？",
        success: (res) => {
          if (res.confirm) {
            this.records = this.records.filter((r) => r.id !== item.id);
            this.filterRecords();
            this.calcStat();
          }
        }
      });
    },
    calcStat() {
      const now = /* @__PURE__ */ new Date();
      const month = now.getMonth() + 1;
      const monthRecords = this.records.filter((r) => new Date(this.fixDateStr(r.time)).getMonth() + 1 === month);
      this.stat.count = monthRecords.length;
      const typeCount = {};
      monthRecords.forEach((r) => {
        typeCount[r.type] = (typeCount[r.type] || 0) + 1;
      });
      let topType = "";
      let max = 0;
      for (const k in typeCount) {
        if (typeCount[k] > max) {
          max = typeCount[k];
          topType = k;
        }
      }
      this.stat.topType = topType ? `${Math.round(max / (monthRecords.length || 1) * 100)}%是${topType}` : "无";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o([($event) => $data.searchText = $event.detail.value, (...args) => $options.filterRecords && $options.filterRecords(...args)]),
    b: $data.searchText,
    c: common_vendor.t($data.timeOptions[$data.timeFilter]),
    d: $data.timeOptions,
    e: $data.timeFilter,
    f: common_vendor.o((...args) => $options.onTimeChange && $options.onTimeChange(...args)),
    g: common_vendor.t($data.confidenceOptions[$data.confidenceFilter]),
    h: $data.confidenceOptions,
    i: $data.confidenceFilter,
    j: common_vendor.o((...args) => $options.onConfidenceChange && $options.onConfidenceChange(...args)),
    k: common_vendor.t($data.stat.count),
    l: common_vendor.t($data.stat.topType),
    m: $data.filteredRecords.length === 0
  }, $data.filteredRecords.length === 0 ? {} : {}, {
    n: common_vendor.f($data.filteredRecords, (item, k0, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.time),
        d: common_vendor.t(item.confidence),
        e: common_vendor.o(($event) => $options.viewDetail(item), item.id),
        f: common_vendor.o(($event) => $options.deleteRecord(item), item.id),
        g: item.id
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bd838ad3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/record.js.map
