"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_profile_api = require("./api.js");
const utils_common = require("../../utils/common.js");
const _sfc_main = {
  __name: "record",
  setup(__props) {
    const records = common_vendor.ref([]);
    const searchText = common_vendor.ref("");
    common_vendor.ref(["全部", "最近一周", "最近一个月"]);
    const timeFilter = common_vendor.ref(0);
    common_vendor.ref(["默认排序", "高可信度优先", "低可信度优先"]);
    const confidenceFilter = common_vendor.ref(0);
    const filteredRecords = common_vendor.ref([]);
    const stat = common_vendor.ref({
      count: 0,
      topType: ""
    });
    const previewImage = (imageUrl) => {
      const fullUrl = pages_profile_api.getImageUrl(imageUrl);
      common_vendor.index.previewImage({
        urls: [fullUrl],
        // 支持多张图片预览，这里我们只传当前图片
        current: fullUrl
        // 当前显示图片的链接
      });
    };
    const formatConfidence = (confidence) => {
      if (typeof confidence === "string" && confidence.includes("%")) {
        return confidence;
      }
      const num = parseFloat(confidence);
      if (!isNaN(num)) {
        return `${Math.round(num * 100)}%`;
      }
      return confidence;
    };
    const fixDateStr = (str) => {
      if (!str)
        return "";
      return str.replace(/-/g, "/").replace(/(\d{2}:\d{2})$/, "$1:00");
    };
    const filterRecords = () => {
      let list = [...records.value];
      if (searchText.value) {
        list = list.filter((r) => r.name.includes(searchText.value));
      }
      if (timeFilter.value === 1) {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1e3;
        list = list.filter((r) => new Date(fixDateStr(r.time)).getTime() > weekAgo);
      } else if (timeFilter.value === 2) {
        const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1e3;
        list = list.filter((r) => new Date(fixDateStr(r.time)).getTime() > monthAgo);
      }
      if (confidenceFilter.value === 1) {
        list.sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence));
      } else if (confidenceFilter.value === 2) {
        list.sort((a, b) => parseInt(a.confidence) - parseInt(b.confidence));
      }
      filteredRecords.value = list;
    };
    const viewDetail = (item) => {
      common_vendor.index.navigateTo({ url: `/pages/pestDetail/pestDetail?pestId=${item.pest_id}` });
    };
    const calcStat = () => {
      const now = /* @__PURE__ */ new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const monthRecords = records.value.filter((r) => {
        const recordDate = new Date(r.detection_time);
        return recordDate.getMonth() + 1 === currentMonth && recordDate.getFullYear() === currentYear;
      });
      stat.value.count = monthRecords.length;
      const typeCount = {};
      monthRecords.forEach((r) => {
        typeCount[r.pest_name] = (typeCount[r.pest_name] || 0) + 1;
      });
      let topType = "";
      let max = 0;
      for (const k in typeCount) {
        if (typeCount[k] > max) {
          max = typeCount[k];
          topType = k;
        }
      }
      stat.value.topType = topType ? `${Math.round(max / (monthRecords.length || 1) * 100)}%是${topType}` : "无";
    };
    common_vendor.onMounted(async () => {
      const response = await pages_profile_api.getRecords();
      records.value = response.data;
      filterRecords();
      calcStat();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(stat.value.count),
        b: common_vendor.t(stat.value.topType),
        c: filteredRecords.value.length === 0
      }, filteredRecords.value.length === 0 ? {} : {}, {
        d: common_vendor.f(filteredRecords.value, (item, k0, i0) => {
          return {
            a: common_vendor.unref(pages_profile_api.getImageUrl)(item.image_url),
            b: common_vendor.o(($event) => previewImage(item.image_url), item.id),
            c: common_vendor.t(item.pest_name),
            d: common_vendor.t(common_vendor.unref(utils_common.formatDate)(item.detection_time)),
            e: common_vendor.t(formatConfidence(item.confidence)),
            f: common_vendor.o(($event) => viewDetail(item), item.id),
            g: item.id
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bd838ad3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/record.js.map
