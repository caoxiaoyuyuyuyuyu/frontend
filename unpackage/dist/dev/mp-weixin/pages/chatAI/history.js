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
  onShow() {
    this.loadHistoryChats();
  },
  computed: {
    filteredHistoryChats() {
      return this.historyChats.sort((a, b) => {
        return new Date(b.lastTime) - new Date(a.lastTime);
      });
    }
  },
  methods: {
    // 转换后端数据格式
    formatConversations(data) {
      if (!data || !data.conversations)
        return [];
      return data.conversations;
    },
    // 加载历史对话列表
    async loadHistoryChats() {
      try {
        const response = await pages_chatAI_api.loadHistoryChats();
        if (response) {
          this.historyChats = this.formatConversations(response);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatAI/history.vue:101", "加载历史对话失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请检查网络",
          icon: "none"
        });
      }
    },
    // 格式化时间显示
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
    // 获取对话标题
    getChatTitle(chat) {
      if (chat.title)
        return chat.title;
      if (chat.messages && chat.messages.length > 0) {
        const firstMessage = chat.messages[0];
        return firstMessage.content.substring(0, 20) + (firstMessage.content.length > 20 ? "..." : "");
      }
      return "未命名对话";
    },
    // 获取预览文本
    getPreviewText(messages) {
      if (!messages || messages.length === 0)
        return "";
      const lastMessage = messages[messages.length - 1];
      return lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? "..." : "");
    },
    // 加载指定对话
    loadChat(chat_id) {
      pages_chatAI_api.setSelectedChat(chat_id);
      common_vendor.index.__f__("log", "at pages/chatAI/history.vue:137", chat_id);
      common_vendor.index.showToast({
        title: "正在加载对话",
        icon: "loading"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/chatAI/chatAI",
          success: () => {
            common_vendor.index.__f__("log", "at pages/chatAI/history.vue:148", "switchTab跳转成功");
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at pages/chatAI/history.vue:151", "switchTab失败，尝试navigateTo:", err);
            common_vendor.index.navigateTo({
              url: "/pages/chatAI/chatAI",
              fail: (navigateErr) => {
                common_vendor.index.__f__("log", "at pages/chatAI/history.vue:155", "navigateTo也失败:", navigateErr);
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
    // 搜索相关方法保持不变
    onSearchInput() {
    },
    async performSearch() {
      if (this.searchKeyword.trim()) {
        try {
          const response = await pages_chatAI_api.searchChats(this.searchKeyword, this.filterType);
          if (response.success) {
            this.historyChats = this.formatConversations(response.data) || [];
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
          common_vendor.index.__f__("error", "at pages/chatAI/history.vue:196", "搜索失败:", error);
          common_vendor.index.showToast({
            title: "搜索失败，请检查网络",
            icon: "none"
          });
        }
      }
    },
    clearSearch() {
      this.searchKeyword = "";
      this.loadHistoryChats();
    },
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
    isChatHighlighted(chat) {
      if (!this.searchKeyword.trim())
        return false;
      const keyword = this.searchKeyword.toLowerCase();
      if (this.getChatTitle(chat).toLowerCase().includes(keyword)) {
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
      var _a;
      return {
        a: common_vendor.t($options.getChatTitle(chat)),
        b: common_vendor.t($options.formatTime(chat.lastTime || ((_a = chat.messages[chat.messages.length - 1]) == null ? void 0 : _a.timestamp))),
        c: common_vendor.t($options.getPreviewText(chat.messages)),
        d: index,
        e: common_vendor.n($options.isChatHighlighted(chat) ? "highlighted" : ""),
        f: common_vendor.o(($event) => $options.loadChat(chat.id), index)
      };
    }),
    j: $options.filteredHistoryChats.length === 0
  }, $options.filteredHistoryChats.length === 0 ? {
    k: common_vendor.t($data.searchKeyword ? "未找到相关对话" : "暂无历史对话"),
    l: common_vendor.t($data.searchKeyword ? "尝试其他关键词" : "开始新的对话吧")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a91f6b25"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/history.js.map
