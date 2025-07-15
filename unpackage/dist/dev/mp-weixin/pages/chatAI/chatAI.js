"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_chatAI_api = require("./api.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      messageList: [],
      // 消息列表
      message: "",
      // 输入框内容
      isLoading: false,
      // 是否正在加载
      scrollTop: 0,
      // 滚动位置
      scrollIntoView: "",
      // 滚动到指定消息
      userAvatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      // 用户头像
      aiAvatar: "/static/leaf.png",
      // AI头像
      conversation_id: null,
      // 当前对话ID
      new_conversation: true,
      searchKeyword: "",
      // 搜索关键词
      searchResults: []
      // 搜索结果
    };
  },
  onShow() {
    this.userAvatar = common_vendor.index.getStorageInfoSync("userInfo").avatar || "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132";
    const selectedChat = pages_chatAI_api.getSelectedChat();
    if (selectedChat) {
      this.conversation_id = selectedChat;
      this.new_conversation = false;
      this.loadChat(selectedChat);
    } else {
      this.initNewChat();
    }
  },
  methods: {
    // 渲染Markdown内容
    renderMarkdown(content) {
      if (!content)
        return "";
      const md = common_vendor.MarkdownIt({
        html: false,
        // 不解析HTML标签
        linkify: true,
        // 自动将URL转换为链接
        breaks: true,
        // 将换行符转换为<br>
        typographer: true
        // 启用一些排版替换
      });
      return md.render(content);
    },
    // 初始化新对话
    initNewChat() {
      this.messageList = [];
      this.conversation_id = null;
      this.new_conversation = true;
      this.message = "";
      common_vendor.index.removeStorageSync("selectedChat");
    },
    // 格式化时间显示
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
    // 加载指定对话
    async loadChat(conversation_id) {
      this.conversation_id = conversation_id;
      const response = await pages_chatAI_api.getChatDetail(this.conversation_id);
      if (response) {
        this.messageList = response.conversation || [];
      }
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
    // 创建新对话
    createNewChat() {
      this.initNewChat();
    },
    // 保存当前对话
    async saveCurrentChat() {
      if (this.messageList.length === 0)
        return;
      const chatData = {
        id: this.currentChatId,
        messages: this.messageList,
        lastTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      try {
        await pages_chatAI_api.saveChatToBackend(chatData);
        common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:231", "对话已保存:", chatData);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatAI/chatAI.vue:233", "保存对话失败:", error);
        common_vendor.index.showToast({
          title: "保存失败，请检查网络",
          icon: "none"
        });
      }
    },
    // 发送消息
    async sendMessage() {
      if (!this.message.trim() || this.isLoading)
        return;
      const userMessage = {
        role: "user",
        content: this.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.addMessage(userMessage);
      const question = this.message;
      this.message = "";
      this.isLoading = true;
      try {
        const response = await pages_chatAI_api.sendAIMessage({
          message: question,
          new_conversation: this.new_conversation,
          conversation_id: this.conversation_id
        });
        if (response) {
          this.messageList = response.history || [];
          this.conversation_id = response.conversation_id;
          this.new_conversation = false;
          pages_chatAI_api.setSelectedChat(this.conversation_id);
        } else {
          common_vendor.index.showToast({
            title: "AI回复失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatAI/chatAI.vue:278", "AI回复错误:", error);
        common_vendor.index.showToast({
          title: "网络连接失败",
          icon: "none"
        });
      }
      this.isLoading = false;
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
      if (this.messageList.length > 0) {
        const lastIndex = this.messageList.length - 1;
        this.scrollIntoView = `msg-${lastIndex}`;
      } else {
        this.scrollTop = 0;
      }
    },
    // 显示历史侧边栏
    showHistorySidebar() {
      common_vendor.index.navigateTo({
        url: "/pages/chatAI/history"
      });
    },
    // 搜索相关方法
    onSearchInput() {
      if (this.searchKeyword.trim()) {
        this.performSearch();
      } else {
        this.clearSearch();
      }
    },
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
      this.inputMessage = `引用：${message.content}

`;
      common_vendor.index.showToast({
        title: "已引用消息",
        icon: "success"
      });
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
            common_vendor.index.__f__("error", "at pages/chatAI/chatAI.vue:427", "提交反馈失败:", error);
            common_vendor.index.showToast({
              title: "反馈提交失败",
              icon: "none"
            });
          }
        }
      });
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
        a: message.role === "user" ? $data.userAvatar : $data.aiAvatar,
        b: $options.renderMarkdown(message.content),
        c: common_vendor.t($options.formatTime(message.timestamp)),
        d: message.role === "assistant"
      }, message.role === "assistant" ? {
        e: common_assets._imports_3,
        f: common_vendor.o(($event) => $options.copyMessage(message.content), index)
      } : {}, {
        g: index,
        h: common_vendor.n(message.role === "user" ? "user-message" : "ai-message"),
        i: common_vendor.n($options.isMessageHighlighted(message) ? "highlighted-message" : ""),
        j: "msg-" + index
      });
    }),
    n: $data.isLoading
  }, $data.isLoading ? {
    o: $data.aiAvatar
  } : {}, {
    p: $data.scrollTop,
    q: $data.scrollIntoView,
    r: $data.isLoading,
    s: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    t: $data.message,
    v: common_vendor.o(($event) => $data.message = $event.detail.value),
    w: $data.isLoading ? "/static/checkbox.png" : "/static/up.png",
    x: common_vendor.n($data.isLoading ? "checkbox-icon" : "send-icon"),
    y: !$data.message.trim() || $data.isLoading,
    z: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a298e7ff"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/chatAI.js.map
