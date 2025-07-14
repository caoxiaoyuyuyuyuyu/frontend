"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_chatAI_api = require("./api.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      messageList: [],
      // 消息列表
      inputMessage: "",
      // 输入框内容
      isLoading: false,
      // 是否正在加载
      scrollTop: 0,
      // 滚动位置
      scrollIntoView: "",
      // 滚动到指定消息
      userAvatar: "/static/logo.png",
      // 用户头像
      aiAvatar: "/static/logo.png",
      // AI头像
      currentChatId: null,
      // 当前对话ID
      historyChats: [],
      // 历史对话列表
      searchKeyword: "",
      // 搜索关键词
      searchResults: [],
      // 搜索结果
      quotedMessage: null
      // 引用的消息
    };
  },
  onLoad() {
    this.messageList = [];
    this.currentChatId = pages_chatAI_api.generateChatId();
    this.inputMessage = "";
  },
  onShow() {
    const selectedChat = pages_chatAI_api.getSelectedChat();
    if (selectedChat) {
      common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:177", "检测到历史对话数据:", selectedChat);
      this.loadChat(selectedChat);
    } else {
      if (this.messageList.length === 0) {
        this.currentChatId = pages_chatAI_api.generateChatId();
      }
    }
  },
  onHide() {
    if (this.messageList.length > 0) {
      this.saveCurrentChat();
    }
  },
  methods: {
    // 显示历史侧边栏
    showHistorySidebar() {
      common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:196", "showHistorySidebar 被调用");
      common_vendor.index.navigateTo({
        url: "/pages/chatAI/history"
      });
    },
    // 加载指定对话
    loadChat(chat) {
      common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:205", "加载历史对话:", chat);
      this.currentChatId = chat.id;
      this.messageList = [...chat.messages];
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      });
      common_vendor.index.showToast({
        title: "对话加载成功",
        icon: "success",
        duration: 1500
      });
    },
    // 显示历史对话列表
    showHistory() {
      common_vendor.index.showToast({
        title: "历史对话功能开发中",
        icon: "none"
      });
    },
    // 创建新对话
    createNewChat() {
      if (this.messageList.length > 0) {
        common_vendor.index.showModal({
          title: "创建新对话",
          content: "确定要开始新的对话吗？当前对话将被保存。",
          success: (res) => {
            if (res.confirm) {
              this.saveCurrentChat();
              this.resetToNewChat();
            }
          }
        });
      } else {
        this.resetToNewChat();
      }
    },
    // 重置为新对话
    resetToNewChat() {
      this.messageList = [];
      this.currentChatId = pages_chatAI_api.generateChatId();
      this.inputMessage = "";
      common_vendor.index.showToast({
        title: "已创建新对话",
        icon: "success"
      });
    },
    // 保存当前对话
    async saveCurrentChat() {
      if (this.messageList.length === 0)
        return;
      const title = pages_chatAI_api.getChatTitle(this.messageList);
      const chatId = this.currentChatId || pages_chatAI_api.generateChatId();
      const newChat = {
        id: chatId,
        title,
        lastTime: pages_chatAI_api.getCurrentDateTime(),
        messages: [...this.messageList]
      };
      try {
        await pages_chatAI_api.saveChatToBackend(newChat);
        common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:285", "对话已保存到后端:", newChat);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatAI/chatAI.vue:287", "保存对话失败:", error);
        common_vendor.index.showToast({
          title: "保存失败，请检查网络",
          icon: "none"
        });
      }
    },
    // 发送消息
    sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) {
        return;
      }
      let messageContent = this.inputMessage;
      let hasQuote = false;
      if (this.quotedMessage) {
        messageContent = `引用：${this.quotedMessage.content}

${this.inputMessage}`;
        hasQuote = true;
        this.quotedMessage = null;
      }
      this.addMessage({
        type: "user",
        content: messageContent,
        time: this.getCurrentTime(),
        hasQuote
      });
      const userQuestion = this.inputMessage;
      this.inputMessage = "";
      this.isLoading = true;
      setTimeout(() => {
        this.getAIResponse(userQuestion);
      }, 1e3);
    },
    // 获取AI回复
    async getAIResponse(question) {
      try {
        const response = await pages_chatAI_api.sendAIMessage({
          content: question,
          type: "user",
          time: pages_chatAI_api.getCurrentTime()
        });
        if (response.success) {
          this.addMessage({
            type: "ai",
            content: response.data.content,
            time: response.data.time
          });
        } else {
          common_vendor.index.showToast({
            title: "AI回复失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatAI/chatAI.vue:356", "AI回复错误:", error);
        common_vendor.index.showToast({
          title: "网络连接失败",
          icon: "none"
        });
      }
      this.isLoading = false;
      this.saveCurrentChat();
    },
    // 添加消息到列表
    addMessage(message) {
      this.messageList.push(message);
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      });
    },
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.messageList.length > 0) {
          const lastIndex = this.messageList.length - 1;
          this.scrollIntoView = `msg-${lastIndex}`;
        } else {
          this.scrollTop = 0;
        }
      });
    },
    // 获取当前时间
    getCurrentTime() {
      return pages_chatAI_api.getCurrentTime();
    },
    // 获取当前日期时间
    getCurrentDateTime() {
      return pages_chatAI_api.getCurrentDateTime();
    },
    // 搜索输入处理
    onSearchInput() {
      if (this.searchKeyword.trim()) {
        this.performSearch();
      } else {
        this.clearSearch();
      }
    },
    // 执行搜索
    performSearch() {
      if (!this.searchKeyword.trim()) {
        this.clearSearch();
        return;
      }
      const keyword = this.searchKeyword.toLowerCase();
      this.searchResults = [];
      this.messageList.forEach((message, index) => {
        if (message.content && message.content.toLowerCase().includes(keyword)) {
          this.searchResults.push(index);
        }
      });
      if (this.searchResults.length > 0) {
        this.scrollToMessage(this.searchResults[0]);
        common_vendor.index.showToast({
          title: `找到 ${this.searchResults.length} 个结果`,
          icon: "none"
        });
      } else {
        common_vendor.index.showToast({
          title: "未找到相关内容",
          icon: "none"
        });
      }
    },
    // 清除搜索
    clearSearch() {
      this.searchKeyword = "";
      this.searchResults = [];
    },
    // 检查消息是否高亮
    isMessageHighlighted(message) {
      if (!this.searchKeyword.trim())
        return false;
      const index = this.messageList.indexOf(message);
      return this.searchResults.includes(index);
    },
    // 高亮搜索文本（已移除，改用CSS样式实现）
    highlightSearchText(text) {
      return text;
    },
    // 滚动到指定消息
    scrollToMessage(index) {
      this.$nextTick(() => {
        this.scrollIntoView = `msg-${index}`;
      });
    },
    // 复制消息内容
    async copyMessage(content) {
      try {
        await pages_chatAI_api.copyMessage(content);
        common_vendor.index.showToast({
          title: "已复制到剪贴板",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "复制失败",
          icon: "none"
        });
      }
    },
    // 引用消息
    quoteMessage(message) {
      this.quotedMessage = message;
      common_vendor.index.showToast({
        title: "已引用消息",
        icon: "success"
      });
    },
    // 清除引用
    clearQuote() {
      this.quotedMessage = null;
    },
    // 切换收藏状态
    toggleStar(message, index) {
      this.$set(message, "starred", !message.starred);
      common_vendor.index.showToast({
        title: message.starred ? "已收藏" : "已取消收藏",
        icon: "success"
      });
    },
    // 反馈消息
    async feedbackMessage(message) {
      common_vendor.index.showActionSheet({
        itemList: ["有帮助", "无帮助", "内容错误", "其他问题"],
        success: async (res) => {
          const feedbackTypes = ["有帮助", "无帮助", "内容错误", "其他问题"];
          const selectedType = feedbackTypes[res.tapIndex];
          try {
            await pages_chatAI_api.submitFeedback({
              type: selectedType,
              message: message.content,
              chatId: this.currentChatId
            });
            common_vendor.index.showToast({
              title: `感谢您的反馈：${selectedType}`,
              icon: "success"
            });
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/chatAI/chatAI.vue:532", "提交反馈失败:", error);
            common_vendor.index.showToast({
              title: "反馈提交失败",
              icon: "none"
            });
          }
        }
      });
    },
    // 获取引用内容
    getQuoteContent(content) {
      if (content.includes("引用：")) {
        const parts = content.split("\n\n");
        if (parts.length > 1) {
          const quoteText = parts[0].replace("引用：", "");
          return quoteText.length > 30 ? quoteText.substring(0, 30) + "..." : quoteText;
        }
      }
      return "";
    },
    // 获取主要内容
    getMainContent(content) {
      if (content.includes("引用：")) {
        const parts = content.split("\n\n");
        if (parts.length > 1) {
          return parts.slice(1).join("\n\n");
        }
      }
      return content;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$1,
    b: common_vendor.o((...args) => $options.showHistorySidebar && $options.showHistorySidebar(...args)),
    c: common_assets._imports_1$1,
    d: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    e: common_vendor.o((...args) => $options.performSearch && $options.performSearch(...args)),
    f: $data.searchKeyword,
    g: $data.searchKeyword
  }, $data.searchKeyword ? {
    h: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    i: common_assets._imports_2,
    j: common_vendor.o((...args) => $options.createNewChat && $options.createNewChat(...args)),
    k: $data.isLoading,
    l: $data.messageList.length === 0
  }, $data.messageList.length === 0 ? {} : {}, {
    m: common_vendor.f($data.messageList, (message, index, i0) => {
      return common_vendor.e({
        a: message.type === "user" ? $data.userAvatar : $data.aiAvatar,
        b: message.hasQuote
      }, message.hasQuote ? {
        c: common_vendor.t($options.getQuoteContent(message.content))
      } : {}, {
        d: message.hasQuote
      }, message.hasQuote ? {} : {}, {
        e: !message.image
      }, !message.image ? {
        f: common_vendor.t($options.getMainContent(message.content))
      } : {}, {
        g: message.image
      }, message.image ? {
        h: message.image
      } : {}, {
        i: common_vendor.t(message.time),
        j: message.type === "ai"
      }, message.type === "ai" ? {
        k: common_assets._imports_3,
        l: common_vendor.o(($event) => $options.copyMessage(message.content), index),
        m: common_assets._imports_4,
        n: common_vendor.o(($event) => $options.quoteMessage(message), index),
        o: message.starred ? "/static/stars.png" : "/static/star.png",
        p: common_vendor.o(($event) => $options.toggleStar(message, index), index),
        q: common_assets._imports_5,
        r: common_vendor.o(($event) => $options.feedbackMessage(message), index)
      } : {}, {
        s: index,
        t: common_vendor.n(message.type === "user" ? "user-message" : "ai-message"),
        v: common_vendor.n($options.isMessageHighlighted(message) ? "highlighted-message" : ""),
        w: "msg-" + index
      });
    }),
    n: $data.isLoading
  }, $data.isLoading ? {
    o: $data.aiAvatar
  } : {}, {
    p: $data.scrollTop,
    q: $data.scrollIntoView,
    r: $data.quotedMessage
  }, $data.quotedMessage ? {
    s: common_vendor.t($data.quotedMessage.content),
    t: common_vendor.o((...args) => $options.clearQuote && $options.clearQuote(...args))
  } : {}, {
    v: $data.isLoading,
    w: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    x: $data.inputMessage,
    y: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    z: common_assets._imports_6,
    A: !$data.inputMessage.trim() || $data.isLoading,
    B: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a298e7ff"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/chatAI.js.map
