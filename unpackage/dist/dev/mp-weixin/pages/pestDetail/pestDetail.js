"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      pestInfo: {},
      category: "",
      preventionMethods: [],
      identificationFeatures: [],
      isFavorite: false
    };
  },
  onLoad(options) {
    if (options.pest) {
      this.pestInfo = JSON.parse(decodeURIComponent(options.pest));
    }
    if (options.category) {
      this.category = decodeURIComponent(options.category);
    }
    this.setPestDetails();
    this.checkFavoriteStatus();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      let favorites = common_vendor.index.getStorageSync("pest_favorites") || [];
      if (this.isFavorite) {
        const favoriteItem = {
          name: this.pestInfo.name,
          category: this.category,
          harmType: this.pestInfo.harmType,
          description: this.pestInfo.description,
          timestamp: Date.now()
        };
        const existingIndex = favorites.findIndex((item) => item.name === this.pestInfo.name);
        if (existingIndex === -1) {
          favorites.push(favoriteItem);
          common_vendor.index.showToast({
            title: "已添加到收藏",
            icon: "success"
          });
        }
      } else {
        favorites = favorites.filter((item) => item.name !== this.pestInfo.name);
        common_vendor.index.showToast({
          title: "已取消收藏",
          icon: "none"
        });
      }
      common_vendor.index.setStorageSync("pest_favorites", favorites);
    },
    checkFavoriteStatus() {
      const favorites = common_vendor.index.getStorageSync("pest_favorites") || [];
      this.isFavorite = favorites.some((item) => item.name === this.pestInfo.name);
    },
    showFeedback() {
      common_vendor.index.showActionSheet({
        itemList: ["信息错误", "信息不完整", "其他错误"],
        success: (res) => {
          const feedbackTypes = ["信息错误", "信息不完整", "其他错误"];
          const selectedType = feedbackTypes[res.tapIndex];
          this.showFeedbackInput(selectedType);
        },
        fail: () => {
          common_vendor.index.__f__("log", "at pages/pestDetail/pestDetail.vue:161", "用户取消选择");
        }
      });
    },
    showFeedbackInput(type) {
      common_vendor.index.showModal({
        title: `反馈${type}`,
        content: "请输入具体的问题描述：",
        editable: true,
        placeholderText: "请详细描述您发现的问题...",
        success: (res) => {
          if (res.confirm && res.content) {
            this.submitFeedback(type, res.content);
          } else if (res.confirm && !res.content) {
            common_vendor.index.showToast({
              title: "请输入反馈内容",
              icon: "none"
            });
          }
        }
      });
    },
    submitFeedback(type, content) {
      const feedbackData = {
        pestName: this.pestInfo.name,
        category: this.category,
        feedbackType: type,
        content,
        timestamp: Date.now(),
        userAgent: navigator.userAgent || "unknown"
      };
      let feedbacks = common_vendor.index.getStorageSync("pest_feedbacks") || [];
      feedbacks.push(feedbackData);
      common_vendor.index.setStorageSync("pest_feedbacks", feedbacks);
      common_vendor.index.showToast({
        title: "反馈已提交",
        icon: "success",
        duration: 2e3
      });
      common_vendor.index.__f__("log", "at pages/pestDetail/pestDetail.vue:208", "反馈数据:", feedbackData);
    },
    setPestDetails() {
      const pestDetails = {
        "二星蝽": {
          preventionMethods: [
            "及时清除果园杂草，减少虫源",
            "使用黄色粘虫板诱杀成虫",
            "喷施高效低毒农药如吡虫啉",
            "加强果园管理，提高树体抗性"
          ],
          identificationFeatures: [
            "成虫体长8-10毫米，黄褐色",
            "前胸背板有2个黑色圆斑",
            "若虫体色较浅，有黑色斑点",
            "常群集在果实表面吸食汁液"
          ]
        },
        "小绿叶蝉": {
          preventionMethods: [
            "清除果园周边杂草",
            "使用蓝色粘虫板诱杀",
            "喷施阿维菌素等药剂",
            "加强果园通风透光"
          ],
          identificationFeatures: [
            "成虫体长3-4毫米，淡绿色",
            "头部有淡黄色条纹",
            "若虫体色较浅，善跳跃",
            "危害叶片，传播病毒病"
          ]
        },
        "桃蛀螟": {
          preventionMethods: [
            "及时清除落果和病果",
            "使用性诱剂诱杀成虫",
            "喷施氯虫苯甲酰胺等药剂",
            "果实套袋保护"
          ],
          identificationFeatures: [
            "成虫体长10-12毫米，灰褐色",
            "前翅有黑色斑纹",
            "幼虫蛀食果实内部",
            "果实表面有蛀孔和虫粪"
          ]
        },
        "桑天牛": {
          preventionMethods: [
            "及时清除被害树木",
            "人工捕杀成虫",
            "树干涂白防止产卵",
            "使用天牛诱捕器"
          ],
          identificationFeatures: [
            "成虫体长25-35毫米，黑色",
            "鞘翅有云状斑纹",
            "幼虫蛀食树干木质部",
            "树干有蛀孔和木屑"
          ]
        },
        "红颈天牛": {
          preventionMethods: [
            "及时清除被害树木",
            "人工捕杀成虫",
            "树干涂白防止产卵",
            "使用天牛诱捕器"
          ],
          identificationFeatures: [
            "成虫体长25-35毫米，黑色",
            "前胸背板红色",
            "幼虫蛀食树干木质部",
            "树干有蛀孔和木屑"
          ]
        },
        "茶翅蝽": {
          preventionMethods: [
            "及时清除果园杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强果园管理"
          ],
          identificationFeatures: [
            "成虫体长12-15毫米，茶褐色",
            "前胸背板有茶色斑纹",
            "若虫体色较浅",
            "危害果实造成畸形"
          ]
        },
        "绿刺蛾（幼虫）": {
          preventionMethods: [
            "人工摘除虫茧",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长20-25毫米，绿色",
            "体表有刺毛",
            "群集危害叶片",
            "叶片被啃食成缺刻"
          ]
        },
        "扁刺蛾（幼虫）": {
          preventionMethods: [
            "人工摘除虫茧",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长18-22毫米，绿色",
            "体表有刺毛",
            "群集危害叶片",
            "叶片被啃食成缺刻"
          ]
        },
        "玉带凤蝶（幼虫）": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长30-40毫米，绿色",
            "体表有白色条纹",
            "危害柑橘叶片",
            "叶片被啃食成缺刻"
          ]
        },
        "斑须蝽若虫": {
          preventionMethods: [
            "及时清除果园杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强果园管理"
          ],
          identificationFeatures: [
            "若虫体长5-8毫米，黄褐色",
            "体表有黑色斑点",
            "群集危害嫩梢",
            "吸食植物汁液"
          ]
        },
        "云斑天牛": {
          preventionMethods: [
            "及时清除被害树木",
            "人工捕杀成虫",
            "树干涂白防止产卵",
            "使用天牛诱捕器"
          ],
          identificationFeatures: [
            "成虫体长25-35毫米，黑色",
            "鞘翅有云状斑纹",
            "幼虫蛀食树干木质部",
            "树干有蛀孔和木屑"
          ]
        },
        "光肩星天牛": {
          preventionMethods: [
            "及时清除被害树木",
            "人工捕杀成虫",
            "树干涂白防止产卵",
            "使用天牛诱捕器"
          ],
          identificationFeatures: [
            "成虫体长20-30毫米，黑色",
            "鞘翅有白色斑点",
            "幼虫蛀食树干木质部",
            "树干有蛀孔和木屑"
          ]
        },
        "墨天牛": {
          preventionMethods: [
            "及时清除被害树木",
            "人工捕杀成虫",
            "树干涂白防止产卵",
            "使用天牛诱捕器"
          ],
          identificationFeatures: [
            "成虫体长25-35毫米，黑色",
            "鞘翅有墨色斑纹",
            "幼虫蛀食树干木质部",
            "树干有蛀孔和木屑"
          ]
        },
        "美国白蛾": {
          preventionMethods: [
            "人工剪除网幕",
            "使用性诱剂诱杀",
            "喷施苏云金杆菌制剂",
            "释放天敌昆虫"
          ],
          identificationFeatures: [
            "成虫体长12-15毫米，白色",
            "幼虫群集结网",
            "网幕内有大量幼虫",
            "危害多种阔叶树"
          ]
        },
        "二尾舟蛾（幼虫）": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长25-35毫米，绿色",
            "尾部有2个突起",
            "危害杨树、柳树叶片",
            "叶片被啃食成缺刻"
          ]
        },
        "扇舟蛾": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "成虫体长15-20毫米，灰褐色",
            "前翅有扇状斑纹",
            "幼虫危害杨树、栎树",
            "叶片被啃食成缺刻"
          ]
        },
        "黑蚱蝉": {
          preventionMethods: [
            "及时清除被害树木",
            "人工捕杀成虫",
            "树干涂白防止产卵",
            "使用蝉诱捕器"
          ],
          identificationFeatures: [
            "成虫体长35-45毫米，黑色",
            "若虫地下危害根系",
            "成虫产卵损伤枝条",
            "危害多种林木"
          ]
        },
        "稻棘缘蝽": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长8-10毫米，黄褐色",
            "前胸背板有棘状突起",
            "危害水稻穗部",
            "造成秕谷"
          ]
        },
        "菜蝽": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长8-12毫米，黄褐色",
            "前胸背板有黑色斑纹",
            "危害十字花科蔬菜",
            "吸食植物汁液"
          ]
        },
        "三齿剑纹夜蛾幼虫": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长25-35毫米，绿色",
            "体表有剑状斑纹",
            "危害大豆、花生等",
            "叶片被啃食成缺刻"
          ]
        },
        "菜粉蝶（幼虫）": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长20-30毫米，绿色",
            "体表有细毛",
            "危害甘蓝、白菜等",
            "叶片被啃食成缺刻"
          ]
        },
        "蝼蛄": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用毒饵诱杀",
            "深耕翻土",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长25-35毫米，褐色",
            "前足发达，善挖掘",
            "地下危害根系",
            "危害小麦、玉米幼苗"
          ]
        },
        "赤条蝽": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长8-12毫米，黄褐色",
            "体表有赤色条纹",
            "危害豆类、瓜类作物",
            "吸食植物汁液"
          ]
        },
        "麻皮蝽": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长10-15毫米，黄褐色",
            "体表有麻点状斑纹",
            "多食性，危害多种作物",
            "吸食植物汁液"
          ]
        },
        "八点广翅蜡蝉": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长8-10毫米，黄褐色",
            "前翅有8个黑色斑点",
            "危害月季、紫薇等",
            "吸食嫩枝汁液"
          ]
        },
        "斑衣蜡蝉": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长10-12毫米，黄褐色",
            "前翅有斑衣状斑纹",
            "危害臭椿、海棠、樱花等",
            "吸食植物汁液"
          ]
        },
        "碧蛾蜡蝉": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长8-10毫米，碧绿色",
            "前翅有蛾状斑纹",
            "危害桂花、茶花等",
            "吸食叶片汁液"
          ]
        },
        "白星花金龟": {
          preventionMethods: [
            "及时清除田间杂草",
            "使用黄色粘虫板诱杀",
            "喷施高效低毒农药",
            "加强田间管理"
          ],
          identificationFeatures: [
            "成虫体长15-20毫米，黑色",
            "鞘翅有白色星点",
            "危害月季、菊花等",
            "啃食花瓣"
          ]
        },
        "红缘灯蛾（幼虫）": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长25-35毫米，黑色",
            "体侧有红色条纹",
            "危害菊花、一串红等",
            "叶片被啃食成缺刻"
          ]
        },
        "柳蓝叶甲": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "成虫体长5-8毫米，蓝色",
            "幼虫危害柳树、杨树叶片",
            "成虫和幼虫都危害叶片",
            "叶片被啃食成缺刻"
          ]
        },
        "旋目夜蛾（幼虫）": {
          preventionMethods: [
            "人工摘除虫卵和幼虫",
            "喷施苏云金杆菌制剂",
            "使用性诱剂诱杀成虫",
            "保护天敌昆虫"
          ],
          identificationFeatures: [
            "幼虫体长25-35毫米，绿色",
            "体表有旋目状斑纹",
            "危害悬铃木、紫薇等",
            "叶片被啃食成缺刻"
          ]
        }
      };
      const defaultMethods = [
        "加强田间管理，及时清除病残体",
        "使用生物农药进行防治",
        "合理使用化学农药",
        "采用综合防治措施"
      ];
      const defaultFeatures = [
        "根据害虫形态特征进行识别",
        "观察危害症状和部位",
        "结合发生规律判断",
        "必要时请专家鉴定"
      ];
      const details = pestDetails[this.pestInfo.name] || {};
      this.preventionMethods = details.preventionMethods || defaultMethods;
      this.identificationFeatures = details.identificationFeatures || defaultFeatures;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.showFeedback && $options.showFeedback(...args)),
    c: common_vendor.t($data.isFavorite ? "❤️" : "🤍"),
    d: $data.isFavorite ? 1 : "",
    e: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args)),
    f: common_vendor.t($data.pestInfo.name),
    g: common_vendor.t($data.category),
    h: common_vendor.t($data.pestInfo.harmType),
    i: common_vendor.t($data.pestInfo.description),
    j: common_vendor.f($data.preventionMethods, (method, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(method),
        c: index
      };
    }),
    k: common_vendor.f($data.identificationFeatures, (feature, index, i0) => {
      return {
        a: common_vendor.t(feature),
        b: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bf770616"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pestDetail/pestDetail.js.map
