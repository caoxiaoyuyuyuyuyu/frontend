"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_chatAI_api = require("./api.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      historyChats: [],
      // 历史对话列表
      searchKeyword: "",
      // 搜索关键词
      filterType: "all",
      // 筛选类型：all, today, week, month
      filterOptions: [
        { label: "全部", value: "all" },
        { label: "今天", value: "today" },
        { label: "本周", value: "week" },
        { label: "本月", value: "month" }
      ]
    };
  },
  onLoad() {
    this.loadHistoryChats();
  },
  onShow() {
    this.loadHistoryChats();
  },
  computed: {
    // 过滤后的历史对话列表
    filteredHistoryChats() {
      return this.historyChats;
    }
  },
  methods: {
    // 加载历史对话列表
    async loadHistoryChats() {
      try {
        const response = await pages_chatAI_api.loadHistoryChats();
        if (response.success) {
          this.historyChats = response.data || [];
        } else {
          this.historyChats = [
            {
              id: "chat1",
              title: "关于玉米害虫的咨询",
              lastTime: "2024-01-15 14:30",
              messages: [
                {
                  type: "user",
                  content: "玉米地里发现了虫子，能帮我识别一下吗？",
                  time: "14:30"
                },
                {
                  type: "ai",
                  content: "根据您的描述，这可能是玉米螟。建议您上传图片进行更准确的识别。",
                  time: "14:31"
                }
              ]
            },
            {
              id: "chat2",
              title: "水稻病虫害防治",
              lastTime: "2024-01-14 09:15",
              messages: [
                {
                  type: "user",
                  content: "水稻叶子发黄，是什么原因？",
                  time: "09:15"
                },
                {
                  type: "ai",
                  content: "水稻叶子发黄可能是缺肥或病虫害导致的。建议您检查是否有虫害，并适当施肥。",
                  time: "09:16"
                }
              ]
            },
            {
              id: "chat3",
              title: "蔬菜害虫识别",
              lastTime: "2024-01-13 16:45",
              messages: [
                {
                  type: "user",
                  content: "白菜上有小虫子，怎么处理？",
                  time: "16:45"
                },
                {
                  type: "ai",
                  content: "这可能是菜青虫。建议使用生物农药或人工捕杀，避免使用高毒农药。",
                  time: "16:46"
                }
              ]
            },
            {
              id: "chat4",
              title: "果树病虫害咨询",
              lastTime: "2024-01-12 11:20",
              messages: [
                {
                  type: "user",
                  content: "苹果树上有蚜虫，用什么药比较好？",
                  time: "11:20"
                },
                {
                  type: "ai",
                  content: "对于苹果树蚜虫，建议使用吡虫啉或啶虫脒等药剂，注意轮换使用避免抗性。",
                  time: "11:21"
                }
              ]
            },
            {
              id: "chat5",
              title: "小麦病虫害防治",
              lastTime: "2024-01-11 15:30",
              messages: [
                {
                  type: "user",
                  content: "小麦叶子有白粉病，怎么防治？",
                  time: "15:30"
                },
                {
                  type: "ai",
                  content: "小麦白粉病可以使用三唑酮、戊唑醇等药剂防治，同时注意通风透光。",
                  time: "15:31"
                }
              ]
            }
          ];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatAI/history.vue:191", "加载历史对话失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请检查网络",
          icon: "none"
        });
        this.historyChats = [
          {
            id: "chat1",
            title: "关于玉米害虫的咨询",
            lastTime: "2024-01-15 14:30",
            messages: [
              {
                type: "user",
                content: "玉米地里发现了虫子，能帮我识别一下吗？",
                time: "14:30"
              },
              {
                type: "ai",
                content: "根据您的描述，这可能是玉米螟。建议您上传图片进行更准确的识别。",
                time: "14:31"
              }
            ]
          }
        ];
      }
    },
    // 获取预览文本
    getPreviewText(messages) {
      return pages_chatAI_api.getMessagePreview(messages);
    },
    // 加载指定对话
    loadChat(chat) {
      pages_chatAI_api.setSelectedChat(chat);
      common_vendor.index.showToast({
        title: "正在加载对话",
        icon: "loading"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/chatAI/chatAI",
          success: () => {
            common_vendor.index.__f__("log", "at pages/chatAI/history.vue:241", "switchTab跳转成功");
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at pages/chatAI/history.vue:244", "switchTab失败，尝试navigateTo:", err);
            common_vendor.index.navigateTo({
              url: "/pages/chatAI/chatAI",
              success: () => {
                common_vendor.index.__f__("log", "at pages/chatAI/history.vue:249", "navigateTo跳转成功");
              },
              fail: (navigateErr) => {
                common_vendor.index.__f__("log", "at pages/chatAI/history.vue:252", "navigateTo也失败:", navigateErr);
                common_vendor.index.showToast({
                  title: "跳转失败，请手动返回",
                  icon: "none",
                  duration: 2e3
                });
              }
            });
          }
        });
      }, 100);
    },
    // 删除对话
    async deleteChat(chatId) {
      common_vendor.index.showModal({
        title: "删除对话",
        content: "确定要删除这个对话吗？删除后无法恢复。",
        success: async (res) => {
          if (res.confirm) {
            try {
              const response = await pages_chatAI_api.deleteChat(chatId);
              if (response.success) {
                this.historyChats = this.historyChats.filter((chat) => chat.id !== chatId);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({
                  title: response.message || "删除失败",
                  icon: "none"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/chatAI/history.vue:289", "删除对话失败:", error);
              common_vendor.index.showToast({
                title: "删除失败，请检查网络",
                icon: "none"
              });
            }
          }
        }
      });
    },
    // 搜索输入处理
    onSearchInput() {
    },
    // 执行搜索
    async performSearch() {
      if (this.searchKeyword.trim()) {
        try {
          const response = await pages_chatAI_api.searchChats(this.searchKeyword, this.filterType);
          if (response.success) {
            this.historyChats = response.data || [];
            const count = this.historyChats.length;
            if (count > 0) {
              common_vendor.index.showToast({
                title: `找到 ${count} 个对话`,
                icon: "none"
              });
            } else {
              common_vendor.index.showToast({
                title: "未找到相关对话",
                icon: "none"
              });
            }
          } else {
            common_vendor.index.showToast({
              title: response.message || "搜索失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/chatAI/history.vue:331", "搜索失败:", error);
          common_vendor.index.showToast({
            title: "搜索失败，请检查网络",
            icon: "none"
          });
        }
      }
    },
    // 清除搜索
    clearSearch() {
      this.searchKeyword = "";
    },
    // 高亮搜索文本（已移除，改用CSS样式实现）
    highlightSearchText(text) {
      return text;
    },
    // 显示筛选选项
    showFilterOptions() {
      const options = this.filterOptions.map((option) => option.label);
      common_vendor.index.showActionSheet({
        itemList: options,
        success: (res) => {
          const selectedOption = this.filterOptions[res.tapIndex];
          this.filterType = selectedOption.value;
          common_vendor.index.showToast({
            title: `已筛选：${selectedOption.label}`,
            icon: "success"
          });
        }
      });
    },
    // 按时间筛选对话（已移至API中）
    filterByTime(chats) {
    },
    // 检查对话是否高亮
    isChatHighlighted(chat) {
      if (!this.searchKeyword.trim())
        return false;
      const keyword = this.searchKeyword.toLowerCase();
      if (chat.title && chat.title.toLowerCase().includes(keyword)) {
        return true;
      }
      if (chat.messages) {
        return chat.messages.some(
          (message) => message.content && message.content.toLowerCase().includes(keyword)
        );
      }
      return false;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_vendor.o((...args) => $options.showFilterOptions && $options.showFilterOptions(...args)),
    c: common_assets._imports_1$1,
    d: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    e: common_vendor.o((...args) => $options.performSearch && $options.performSearch(...args)),
    f: $data.searchKeyword,
    g: $data.searchKeyword
  }, $data.searchKeyword ? {
    h: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    i: common_vendor.f($options.filteredHistoryChats, (chat, index, i0) => {
      return {
        a: common_vendor.t(chat.title),
        b: common_vendor.t(chat.lastTime),
        c: common_vendor.t($options.getPreviewText(chat.messages)),
        d: common_vendor.o(($event) => $options.deleteChat(chat.id), index),
        e: index,
        f: common_vendor.n($options.isChatHighlighted(chat) ? "highlighted" : ""),
        g: common_vendor.o(($event) => $options.loadChat(chat), index)
      };
    }),
    j: common_assets._imports_2$1,
    k: $options.filteredHistoryChats.length === 0
  }, $options.filteredHistoryChats.length === 0 ? {
    l: common_vendor.t($data.searchKeyword ? "未找到相关对话" : "暂无历史对话"),
    m: common_vendor.t($data.searchKeyword ? "尝试其他关键词" : "开始新的对话吧")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a91f6b25"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/history.js.map
