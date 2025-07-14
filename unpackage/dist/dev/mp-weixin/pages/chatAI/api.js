"use strict";
const common_vendor = require("../../common/vendor.js");
const BASE_URL = "http://192.168.241.56:5000";
const API_VERSION = "api";
const sendAIMessage = (messageData) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}/${API_VERSION}/chat/send`,
      method: "POST",
      data: messageData,
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || "发送消息失败"));
        }
      },
      fail: (err) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
const saveChatToBackend = (chatData) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}/${API_VERSION}/chat/save`,
      method: "POST",
      data: chatData,
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || "保存对话失败"));
        }
      },
      fail: (err) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
const loadHistoryChats = (params = {}) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}/${API_VERSION}/chat/history`,
      method: "GET",
      data: params,
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || "获取历史记录失败"));
        }
      },
      fail: (err) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
const deleteChat = (chatId) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}/${API_VERSION}/chat/${chatId}`,
      method: "DELETE",
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || "删除对话失败"));
        }
      },
      fail: (err) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
const searchChats = (keyword, filterType = "all") => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}/${API_VERSION}/chat/search`,
      method: "GET",
      data: {
        keyword,
        filterType
      },
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || "搜索对话失败"));
        }
      },
      fail: (err) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
const setSelectedChat = (chat) => {
  try {
    common_vendor.index.setStorageSync("selectedChat", chat);
  } catch (error) {
    common_vendor.index.__f__("error", "at pages/chatAI/api.js:229", "设置选中对话失败:", error);
  }
};
const getSelectedChat = () => {
  try {
    const selectedChat = common_vendor.index.getStorageSync("selectedChat");
    if (selectedChat) {
      common_vendor.index.removeStorageSync("selectedChat");
      return selectedChat;
    }
    return null;
  } catch (error) {
    common_vendor.index.__f__("error", "at pages/chatAI/api.js:246", "获取选中对话失败:", error);
    return null;
  }
};
const copyMessage = (content) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.setClipboardData({
      data: content,
      success: () => {
        resolve({ success: true });
      },
      fail: (err) => {
        reject(new Error("复制失败"));
      }
    });
  });
};
const submitFeedback = (feedbackData) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}/${API_VERSION}/chat/feedback`,
      method: "POST",
      data: feedbackData,
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || "提交反馈失败"));
        }
      },
      fail: (err) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
};
const getCurrentTime = () => {
  const now = /* @__PURE__ */ new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
const getCurrentDateTime = () => {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
const generateChatId = () => {
  return "chat" + Date.now();
};
const getChatTitle = (messages) => {
  const userMessages = messages.filter((msg) => msg.type === "user");
  if (userMessages.length > 0) {
    const firstUserMessage = userMessages[0];
    return firstUserMessage.content.length > 20 ? firstUserMessage.content.substring(0, 20) + "..." : firstUserMessage.content;
  }
  return "新对话";
};
const getMessagePreview = (messages) => {
  if (messages.length === 0)
    return "";
  const lastMessage = messages[messages.length - 1];
  const text = lastMessage.content;
  return text.length > 30 ? text.substring(0, 30) + "..." : text;
};
exports.copyMessage = copyMessage;
exports.deleteChat = deleteChat;
exports.generateChatId = generateChatId;
exports.getChatTitle = getChatTitle;
exports.getCurrentDateTime = getCurrentDateTime;
exports.getCurrentTime = getCurrentTime;
exports.getMessagePreview = getMessagePreview;
exports.getSelectedChat = getSelectedChat;
exports.loadHistoryChats = loadHistoryChats;
exports.saveChatToBackend = saveChatToBackend;
exports.searchChats = searchChats;
exports.sendAIMessage = sendAIMessage;
exports.setSelectedChat = setSelectedChat;
exports.submitFeedback = submitFeedback;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/api.js.map
