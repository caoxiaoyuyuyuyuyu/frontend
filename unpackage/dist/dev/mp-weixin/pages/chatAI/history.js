"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      historyChats: [],
      // 历史对话列表
      searchKeyword: ""
      // 搜索关键词
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
      if (!this.searchKeyword.trim()) {
        return this.historyChats;
      }
      const keyword = this.searchKeyword.toLowerCase();
      return this.historyChats.filter((chat) => {
        if (chat.title && chat.title.toLowerCase().includes(keyword)) {
          return true;
        }
        if (chat.messages) {
          return chat.messages.some(
            (message) => message.content && message.content.toLowerCase().includes(keyword)
          );
        }
        return false;
      });
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 加载历史对话列表
    loadHistoryChats() {
      const storedChats = common_vendor.index.getStorageSync("historyChats");
      if (storedChats && storedChats.length > 0) {
        this.historyChats = [...storedChats].sort((a, b) => {
          const timeA = new Date(a.lastTime);
          const timeB = new Date(b.lastTime);
          return timeB - timeA;
        });
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
        common_vendor.index.setStorageSync("historyChats", this.historyChats);
      }
    },
    // 获取预览文本
    getPreviewText(messages) {
      if (messages.length === 0)
        return "";
      const lastMessage = messages[messages.length - 1];
      const text = lastMessage.content;
      return text.length > 30 ? text.substring(0, 30) + "..." : text;
    },
    // 加载指定对话
    loadChat(chat) {
      common_vendor.index.setStorageSync("selectedChat", chat);
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
    deleteChat(chatId) {
      common_vendor.index.showModal({
        title: "删除对话",
        content: "确定要删除这个对话吗？删除后无法恢复。",
        success: (res) => {
          if (res.confirm) {
            this.historyChats = this.historyChats.filter((chat) => chat.id !== chatId);
            common_vendor.index.setStorageSync("historyChats", this.historyChats);
            common_vendor.index.showToast({
              title: "删除成功",
              icon: "success"
            });
          }
        }
      });
    },
    // 清空所有历史
    clearAllHistory() {
      common_vendor.index.showModal({
        title: "清空历史",
        content: "确定要清空所有历史对话吗？此操作不可恢复。",
        success: (res) => {
          if (res.confirm) {
            this.historyChats = [];
            common_vendor.index.removeStorageSync("historyChats");
            common_vendor.index.showToast({
              title: "已清空所有历史",
              icon: "success"
            });
          }
        }
      });
    },
    // 搜索输入处理
    onSearchInput() {
    },
    // 执行搜索
    performSearch() {
      if (this.searchKeyword.trim()) {
        const count = this.filteredHistoryChats.length;
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
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.clearAllHistory && $options.clearAllHistory(...args)),
    c: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    d: common_vendor.o((...args) => $options.performSearch && $options.performSearch(...args)),
    e: $data.searchKeyword,
    f: $data.searchKeyword
  }, $data.searchKeyword ? {
    g: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    h: common_vendor.f($options.filteredHistoryChats, (chat, index, i0) => {
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
    i: $options.filteredHistoryChats.length === 0
  }, $options.filteredHistoryChats.length === 0 ? {
    j: common_vendor.t($data.searchKeyword ? "未找到相关对话" : "暂无历史对话"),
    k: common_vendor.t($data.searchKeyword ? "尝试其他关键词" : "开始新的对话吧")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a91f6b25"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/history.js.map
