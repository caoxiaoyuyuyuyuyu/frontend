"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_pestGallery_api = require("./api.js");
const _sfc_main = {
  // 启用下拉刷新
  onPullDownRefresh() {
    this.loadPestList().then(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  data() {
    return {
      tipTimer: null,
      // 害虫库数据
      pestList: [],
      knowledgeTips: [
        { icon: "💡", title: "害虫知识科普", content: "了解害虫分类和危害方式，科学防治病虫害，保护农作物和生态环境。", note: "点击下方害虫查看详细信息" },
        { icon: "🌱", title: "农作物保护", content: "了解害虫对农作物的危害，学习如何科学防治病虫害。", note: "点击下方害虫查看详细信息" },
        { icon: "🌳", title: "林业保护", content: "了解害虫对林业的影响，学习如何科学防治病虫害。", note: "点击下方害虫查看详细信息" },
        { icon: "🌼", title: "园林花卉保护", content: "了解害虫对园林花卉的危害，学习如何科学防治病虫害。", note: "点击下方害虫查看详细信息" },
        { icon: "🐛", title: "多食性/广食性害虫", content: "了解多食性/广食性害虫的危害方式，学习如何科学防治病虫害。", note: "点击下方害虫查看详细信息" }
      ],
      currentTipIndex: 0,
      loading: false,
      currentPage: 1,
      hasNextPage: false,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,
      visiblePages: []
    };
  },
  mounted() {
    this.startTipTimer();
    this.loadPestList();
  },
  beforeDestroy() {
    this.stopTipTimer();
  },
  methods: {
    // 获取图片URL
    getImageUrl(imageName) {
      return pages_pestGallery_api.getImageUrl(imageName);
    },
    // 加载害虫列表
    async loadPestList() {
      try {
        this.loading = true;
        const response = await pages_pestGallery_api.getPestList({
          page: this.currentPage,
          per_page: this.perPage
        });
        this.pestList = response.data || [];
        const pagination = response.pagination;
        this.hasNextPage = pagination.has_next;
        this.currentPage = pagination.current_page;
        this.totalPages = pagination.pages || 1;
        this.totalItems = pagination.total || 0;
        this.visiblePages = this.generateVisiblePages();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/pestGallery/pestGallery.vue:156", "加载害虫列表失败:", error);
        this.pestList = [
          { id: 4, name: "二星蝽", host_range: "麦类、水稻、棉花、大豆、胡麻、高粱、玉米、甘薯、茄子、桑、无花果等", image: "exc_Adult.png" },
          { id: 5, name: "云斑天牛", host_range: "核桃、苹果、梨等果树及杨、柳、桑、栎、白蜡、乌桕、女贞、泡桐、枇杷、苦楝、悬铃木、柑橘、紫薇等树木", image: "ybtn_Adult.png" },
          { id: 6, name: "光肩星天牛", host_range: "杨属、柳属、榆属、法桐、复叶槭、苹果、梨、李、樱桃、樱花、枫香、糖槭、苦楝、桑树等", image: "gjxtn_Adult.png" },
          { id: 7, name: "八点广翅蜡蝉", host_range: "苹果、梨、桃、杏、李、梅、樱桃、枣、栗、山楂、柑橘等果树", image: "bdgclc_Adult.png" },
          { id: 8, name: "棉古毒蛾", host_range: "芒果、荔枝、洋紫荆等40余种植物", image: "sxdde_Adult.png" },
          { id: 9, name: "松墨天牛", host_range: "马尾松、雪松、云杉、柳杉、五针松、赤松等松科植物", image: "mtn_Adult.png" },
          { id: 10, name: "小绿叶蝉", host_range: "葡萄、苹果等果树；棉花、小麦等农作物；十字花科蔬菜等共20+种寄主", image: "xlyc_Adult.png" },
          { id: 11, name: "扁刺蛾", host_range: "枣、苹果、梨、桃、梧桐、枫杨、白杨、泡桐、柿子等50+种果树/林木", image: "bce_larva.png" },
          { id: 12, name: "扇舟蛾属", host_range: "杨属、柳属树种为主", image: "sze_Adult.png" },
          { id: 13, name: "斑衣蜡蝉", host_range: "臭椿（最喜）、杨树、刺槐、葡萄、猕猴桃等30+种林木/果树", image: "bylc_Adult.png" }
        ];
        this.hasNextPage = false;
        this.totalPages = 1;
        this.totalItems = 13;
        this.visiblePages = this.generateVisiblePages();
      } finally {
        this.loading = false;
      }
    },
    showPestDetail(pest) {
      common_vendor.index.navigateTo({
        url: `/pages/pestDetail/pestDetail?pest=${encodeURIComponent(JSON.stringify(pest))}`
      });
    },
    switchTip(index) {
      this.currentTipIndex = index;
      this.stopTipTimer();
      this.startTipTimer();
    },
    onSwiperChange(e) {
      this.currentTipIndex = e.detail.current;
      this.stopTipTimer();
      this.startTipTimer();
    },
    startTipTimer() {
      this.tipTimer = setInterval(() => {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.knowledgeTips.length;
      }, 3e4);
    },
    stopTipTimer() {
      if (this.tipTimer) {
        clearInterval(this.tipTimer);
        this.tipTimer = null;
      }
    },
    generateVisiblePages() {
      const pages = [];
      const maxVisible = 5;
      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
          start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      return pages;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page;
        this.loadPestList();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.knowledgeTips, (tip, index, i0) => {
      return {
        a: common_vendor.t(tip.icon),
        b: common_vendor.t(tip.title),
        c: common_vendor.t(tip.content),
        d: common_vendor.t(tip.note),
        e: index
      };
    }),
    b: $data.currentTipIndex,
    c: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    d: common_vendor.f($data.knowledgeTips, (tip, index, i0) => {
      return {
        a: index,
        b: $data.currentTipIndex === index ? 1 : "",
        c: common_vendor.o(($event) => $options.switchTip(index), index)
      };
    }),
    e: $data.loading
  }, $data.loading ? {} : {
    f: common_vendor.f($data.pestList, (pest, index, i0) => {
      return {
        a: $options.getImageUrl(pest.image),
        b: common_vendor.t(pest.name),
        c: common_vendor.t(pest.host_range),
        d: pest.id,
        e: common_vendor.o(($event) => $options.showPestDetail(pest), pest.id)
      };
    })
  }, {
    g: !$data.loading && $data.pestList.length > 0
  }, !$data.loading && $data.pestList.length > 0 ? {
    h: $data.currentPage <= 1 ? 1 : "",
    i: $data.currentPage <= 1,
    j: common_vendor.o(($event) => $options.goToPage($data.currentPage - 1)),
    k: common_vendor.t($data.currentPage),
    l: common_vendor.t($data.totalPages),
    m: $data.currentPage >= $data.totalPages ? 1 : "",
    n: $data.currentPage >= $data.totalPages,
    o: common_vendor.o(($event) => $options.goToPage($data.currentPage + 1))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8469b550"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pestGallery/pestGallery.js.map
