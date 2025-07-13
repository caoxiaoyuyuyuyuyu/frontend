"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      activeCategory: "热度榜",
      showDropdown: false,
      dropdownItems: ["果树", "林业", "农作物", "园林花卉", "多食性/广食性"],
      selectedSubCategory: "",
      // 热度榜数据
      hotPests: [
        { name: "美国白蛾", description: "林业+园林，100+寄主", searchCount: 15842, harmType: "食叶", category: "林业" },
        { name: "二星蝽", description: "吸食果汁，导致果实畸形", searchCount: 12456, harmType: "吸食果汁", category: "果树" },
        { name: "云斑天牛", description: "蛀干，危害杨树、柳树、核桃等", searchCount: 9876, harmType: "蛀干", category: "林业" },
        { name: "菜粉蝶（幼虫）", description: "菜青虫，主要危害甘蓝、白菜等", searchCount: 8765, harmType: "食叶", category: "农作物" },
        { name: "桃蛀螟", description: "蛀食桃、李、梨等果实", searchCount: 7654, harmType: "蛀食果实", category: "果树" },
        { name: "稻棘缘蝽", description: "吸食水稻穗部，造成秕谷", searchCount: 6543, harmType: "吸食穗部", category: "农作物" },
        { name: "麻皮蝽", description: "多食性，危害大豆、玉米、蔬菜等", searchCount: 5432, harmType: "多食性", category: "多食性/广食性" },
        { name: "茶翅蝽", description: '吸食梨、苹果等果实，造成"鬼头果"', searchCount: 4321, harmType: "吸食果实", category: "果树" },
        { name: "绿刺蛾（幼虫）", description: "食叶，危害苹果、梨、枣等", searchCount: 3210, harmType: "食叶", category: "果树" },
        { name: "八点广翅蜡蝉", description: "吸食月季、紫薇等嫩枝", searchCount: 2109, harmType: "吸食嫩枝", category: "园林花卉" }
      ],
      // 各分类害虫数据
      pestData: {
        "果树": [
          { name: "二星蝽", harmType: "吸食果汁", description: "导致果实畸形，危害苹果、梨、桃、柑橘、葡萄、枣等果树" },
          { name: "小绿叶蝉", harmType: "危害叶片，传播病毒", description: "危害桃、葡萄等叶片，传播病毒" },
          { name: "桃蛀螟", harmType: "蛀食果实", description: "蛀食桃、李、梨等果实" },
          { name: "桑天牛", harmType: "蛀干", description: "蛀干，危害苹果、梨、桑树等" },
          { name: "红颈天牛", harmType: "蛀干", description: "蛀干，主要危害桃、杏、樱桃等核果类" },
          { name: "茶翅蝽", harmType: "吸食果实", description: '吸食梨、苹果等果实，造成"鬼头果"' },
          { name: "绿刺蛾（幼虫）", harmType: "食叶", description: "食叶，危害苹果、梨、枣等" },
          { name: "扁刺蛾（幼虫）", harmType: "食叶", description: "食叶，危害柑橘、苹果等" },
          { name: "玉带凤蝶（幼虫）", harmType: "食叶", description: "主要危害柑橘叶片" },
          { name: "斑须蝽若虫", harmType: "吸食嫩梢", description: "吸食苹果、梨等嫩梢" }
        ],
        "林业": [
          { name: "云斑天牛", harmType: "蛀干", description: "蛀干，危害杨树、柳树、核桃等" },
          { name: "光肩星天牛", harmType: "蛀干", description: "蛀干，主要危害杨树、柳树" },
          { name: "墨天牛", harmType: "蛀干", description: "蛀干，危害松树、柏树等针叶林" },
          { name: "桑天牛", harmType: "蛀干", description: "蛀干，也危害桑树、苹果等" },
          { name: "美国白蛾", harmType: "食叶", description: "食叶，危害杨树、柳树、法桐等100+树种" },
          { name: "二尾舟蛾（幼虫）", harmType: "食叶", description: "食叶，危害杨树、柳树" },
          { name: "扇舟蛾", harmType: "食叶", description: "食叶，危害杨树、栎树等" },
          { name: "黑蚱蝉", harmType: "地下危害根系", description: "若虫地下危害根系，成虫产卵损伤枝条" }
        ],
        "农作物": [
          { name: "稻棘缘蝽", harmType: "吸食穗部", description: "吸食水稻穗部，造成秕谷" },
          { name: "菜蝽", harmType: "危害蔬菜", description: "危害十字花科蔬菜如白菜、油菜" },
          { name: "三齿剑纹夜蛾幼虫", harmType: "食叶", description: "食叶，危害大豆、花生等" },
          { name: "菜粉蝶（幼虫）", harmType: "食叶", description: "菜青虫，主要危害甘蓝、白菜等" },
          { name: "蝼蛄", harmType: "地下害虫", description: "地下害虫，危害小麦、玉米幼苗根系" },
          { name: "赤条蝽", harmType: "危害豆类", description: "危害豆类、瓜类作物" },
          { name: "麻皮蝽", harmType: "多食性", description: "多食性，危害大豆、玉米、蔬菜等" }
        ],
        "园林花卉": [
          { name: "八点广翅蜡蝉", harmType: "吸食嫩枝", description: "吸食月季、紫薇等嫩枝" },
          { name: "斑衣蜡蝉", harmType: "危害观赏植物", description: "危害臭椿、海棠、樱花等" },
          { name: "碧蛾蜡蝉", harmType: "吸食叶片", description: "吸食桂花、茶花等叶片" },
          { name: "白星花金龟", harmType: "啃食花瓣", description: "啃食月季、菊花等花瓣" },
          { name: "红缘灯蛾（幼虫）", harmType: "食叶", description: "幼虫食叶，危害菊花、一串红等" },
          { name: "柳蓝叶甲", harmType: "危害叶片", description: "成虫和幼虫危害柳树、杨树叶片" },
          { name: "旋目夜蛾（幼虫）", harmType: "食叶", description: "幼虫食叶，危害悬铃木、紫薇等" }
        ],
        "多食性/广食性": [
          { name: "美国白蛾", harmType: "食叶", description: "林业+园林，100+寄主" },
          { name: "麻皮蝽", harmType: "多食性", description: "农作物+果树" },
          { name: "绿刺蛾（幼虫）", harmType: "食叶", description: "果树+林业" },
          { name: "扁刺蛾（幼虫）", harmType: "食叶", description: "果树+园林" },
          { name: "红缘灯蛾", harmType: "食叶", description: "园林+农作物" }
        ]
      }
    };
  },
  computed: {
    currentPests() {
      return this.pestData[this.selectedSubCategory] || [];
    }
  },
  methods: {
    selectCategory(category) {
      this.activeCategory = category;
      this.showDropdown = false;
      this.selectedSubCategory = "";
    },
    toggleDropdown() {
      if (this.selectedSubCategory && !this.showDropdown) {
        this.selectedSubCategory = "";
        this.showDropdown = true;
      } else {
        this.showDropdown = !this.showDropdown;
      }
      this.activeCategory = "危害方式";
    },
    selectDropdownItem(item) {
      common_vendor.index.__f__("log", "at pages/pestGallery/pestGallery.vue:161", "点击了下拉项:", item);
      this.activeCategory = "危害方式";
      this.selectedSubCategory = item;
      this.showDropdown = false;
      common_vendor.index.__f__("log", "at pages/pestGallery/pestGallery.vue:165", "设置完成 - activeCategory:", this.activeCategory, "selectedSubCategory:", this.selectedSubCategory);
    },
    showPestDetail(pest) {
      common_vendor.index.navigateTo({
        url: `/pages/pestDetail/pestDetail?pest=${encodeURIComponent(JSON.stringify(pest))}&category=${this.selectedSubCategory}`
      });
    },
    showHotPestDetail(pest) {
      common_vendor.index.navigateTo({
        url: `/pages/pestDetail/pestDetail?pest=${encodeURIComponent(JSON.stringify(pest))}&category=${pest.category}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.activeCategory === "热度榜" ? 1 : "",
    b: common_vendor.o(($event) => $options.selectCategory("热度榜")),
    c: common_vendor.t($data.selectedSubCategory || "危害方式"),
    d: $data.showDropdown
  }, $data.showDropdown ? {
    e: common_vendor.f($data.dropdownItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.selectDropdownItem(item), index)
      };
    })
  } : {}, {
    f: $data.activeCategory === "危害方式" ? 1 : "",
    g: common_vendor.o((...args) => $options.toggleDropdown && $options.toggleDropdown(...args)),
    h: $data.activeCategory === "热度榜"
  }, $data.activeCategory === "热度榜" ? {
    i: common_vendor.f($data.hotPests, (pest, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(pest.name),
        c: common_vendor.t(pest.description),
        d: common_vendor.t(pest.searchCount),
        e: index,
        f: common_vendor.o(($event) => $options.showHotPestDetail(pest), index)
      };
    })
  } : {}, {
    j: $data.activeCategory === "危害方式" && $data.selectedSubCategory
  }, $data.activeCategory === "危害方式" && $data.selectedSubCategory ? {
    k: common_vendor.t($data.selectedSubCategory),
    l: common_vendor.f($options.currentPests, (pest, index, i0) => {
      return {
        a: common_vendor.t(pest.name),
        b: common_vendor.t(pest.harmType),
        c: index,
        d: common_vendor.o(($event) => $options.showPestDetail(pest), index)
      };
    })
  } : $data.activeCategory === "危害方式" && !$data.selectedSubCategory ? {} : {}, {
    m: $data.activeCategory === "危害方式" && !$data.selectedSubCategory
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8469b550"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pestGallery/pestGallery.js.map
