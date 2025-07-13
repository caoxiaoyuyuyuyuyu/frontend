"use strict";
const common_vendor = require("../../common/vendor.js");
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
      searchResults: []
      // 搜索结果
    };
  },
  onLoad() {
    this.messageList = [];
    this.currentChatId = "chat" + Date.now();
    this.inputMessage = "";
  },
  onShow() {
    const selectedChat = common_vendor.index.getStorageSync("selectedChat");
    if (selectedChat) {
      common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:163", "检测到历史对话数据:", selectedChat);
      this.loadChat(selectedChat);
      common_vendor.index.removeStorageSync("selectedChat");
    } else {
      if (this.messageList.length === 0) {
        this.currentChatId = "chat" + Date.now();
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
      common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:183", "showHistorySidebar 被调用");
      common_vendor.index.navigateTo({
        url: "/pages/chatAI/history"
      });
    },
    // 加载指定对话
    loadChat(chat) {
      common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:192", "加载历史对话:", chat);
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
      this.currentChatId = "chat" + Date.now();
      this.inputMessage = "";
      common_vendor.index.showToast({
        title: "已创建新对话",
        icon: "success"
      });
    },
    // 保存当前对话
    saveCurrentChat() {
      if (this.messageList.length === 0)
        return;
      const userMessages = this.messageList.filter((msg) => msg.type === "user");
      let title = "新对话";
      if (userMessages.length > 0) {
        const firstUserMessage = userMessages[0];
        title = firstUserMessage.content.length > 20 ? firstUserMessage.content.substring(0, 20) + "..." : firstUserMessage.content;
      }
      const chatId = this.currentChatId || "chat" + Date.now();
      let historyChats = common_vendor.index.getStorageSync("historyChats") || [];
      const existingChat = historyChats.find((chat) => chat.id === chatId);
      let hasNewMessages = false;
      let lastTime = this.getCurrentDateTime();
      if (existingChat) {
        if (this.messageList.length > existingChat.messages.length) {
          hasNewMessages = true;
          lastTime = this.getCurrentDateTime();
        } else {
          lastTime = existingChat.lastTime;
        }
      } else {
        hasNewMessages = true;
      }
      const newChat = {
        id: chatId,
        title,
        lastTime,
        messages: [...this.messageList]
      };
      const existingIndex = historyChats.findIndex((chat) => chat.id === chatId);
      if (existingIndex >= 0) {
        historyChats[existingIndex] = newChat;
        if (hasNewMessages) {
          historyChats.splice(existingIndex, 1);
          historyChats.unshift(newChat);
        }
      } else {
        historyChats.unshift(newChat);
      }
      common_vendor.index.setStorageSync("historyChats", historyChats);
      common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:315", "对话已保存:", newChat, "有新消息:", hasNewMessages);
    },
    // 显示图片选择选项
    showImageOptions() {
      common_vendor.index.showActionSheet({
        itemList: ["拍照", "从相册选择"],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.takePhoto();
          } else if (res.tapIndex === 1) {
            this.chooseImage();
          }
        }
      });
    },
    // 拍照
    takePhoto() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (res) => {
          this.handleImageSelected(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:341", "拍照失败:", err);
          common_vendor.index.showToast({
            title: "拍照失败",
            icon: "none"
          });
        }
      });
    },
    // 从相册选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          this.handleImageSelected(res.tempFilePaths[0]);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/chatAI/chatAI.vue:359", "选择图片失败:", err);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    // 处理选中的图片
    handleImageSelected(imagePath) {
      this.addMessage({
        type: "user",
        content: "[图片]",
        time: this.getCurrentTime(),
        image: imagePath
      });
      this.isLoading = true;
      setTimeout(() => {
        this.getImageAnalysis(imagePath);
      }, 1500);
    },
    // 获取图片分析结果
    getImageAnalysis(imagePath) {
      const responses = [
        "根据图片分析，这可能是某种害虫。建议您采取相应的防治措施。",
        "图片中的害虫特征明显，建议使用专业杀虫剂进行处理。",
        "这看起来像是常见的农业害虫，需要及时防治以避免扩散。"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.addMessage({
        type: "ai",
        content: randomResponse,
        time: this.getCurrentTime()
      });
      this.isLoading = false;
      this.saveCurrentChat();
    },
    // 发送消息
    sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) {
        return;
      }
      this.addMessage({
        type: "user",
        content: this.inputMessage,
        time: this.getCurrentTime()
      });
      const userQuestion = this.inputMessage;
      this.inputMessage = "";
      this.isLoading = true;
      setTimeout(() => {
        this.getAIResponse(userQuestion);
      }, 1e3);
    },
    // 获取AI回复
    getAIResponse(question) {
      let response = "";
      if (question.includes("识别") || question.includes("害虫")) {
        response = "我可以帮您识别各种害虫。请上传害虫图片，我会为您分析害虫类型并提供防治建议。";
      } else if (question.includes("防治") || question.includes("处理")) {
        response = "针对不同害虫，我们有不同的防治方法。建议您先上传害虫图片进行识别，然后我会为您提供具体的防治方案。";
      } else if (question.includes("图片") || question.includes("上传")) {
        response = "您可以通过点击输入框旁边的加号按钮来上传害虫图片。支持拍照和从相册选择图片。";
      } else {
        response = "我是专业的害虫识别助手，可以帮您识别害虫、提供防治建议。请告诉我您需要什么帮助，或者上传害虫图片进行识别。";
      }
      this.addMessage({
        type: "ai",
        content: response,
        time: this.getCurrentTime()
      });
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
      const now = /* @__PURE__ */ new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    // 获取当前日期时间
    getCurrentDateTime() {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.showHistorySidebar && $options.showHistorySidebar(...args)),
    b: common_vendor.o((...args) => $options.createNewChat && $options.createNewChat(...args)),
    c: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    d: common_vendor.o((...args) => $options.performSearch && $options.performSearch(...args)),
    e: $data.searchKeyword,
    f: $data.searchKeyword
  }, $data.searchKeyword ? {
    g: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    h: $data.messageList.length === 0
  }, $data.messageList.length === 0 ? {} : {}, {
    i: common_vendor.f($data.messageList, (message, index, i0) => {
      return common_vendor.e({
        a: message.type === "user" ? $data.userAvatar : $data.aiAvatar,
        b: !message.image
      }, !message.image ? {
        c: common_vendor.t(message.content)
      } : {}, {
        d: message.image
      }, message.image ? {
        e: message.image
      } : {}, {
        f: common_vendor.t(message.time),
        g: index,
        h: common_vendor.n(message.type === "user" ? "user-message" : "ai-message"),
        i: common_vendor.n($options.isMessageHighlighted(message) ? "highlighted-message" : ""),
        j: "msg-" + index
      });
    }),
    j: $data.isLoading
  }, $data.isLoading ? {
    k: $data.aiAvatar
  } : {}, {
    l: $data.scrollTop,
    m: $data.scrollIntoView,
    n: common_vendor.o((...args) => $options.showImageOptions && $options.showImageOptions(...args)),
    o: $data.isLoading,
    p: $data.isLoading,
    q: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    r: $data.inputMessage,
    s: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    t: !$data.inputMessage.trim() || $data.isLoading,
    v: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a298e7ff"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/chatAI.js.map
