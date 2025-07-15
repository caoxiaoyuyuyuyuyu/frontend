"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiConfig = require("../../utils/apiConfig.js");
const sendAIMessage = (data) => utils_apiConfig.request({ url: "/chat/send", method: "POST", data });
const saveChatToBackend = (chat) => utils_apiConfig.request({ url: "/chat/save", method: "POST", data: chat });
const loadHistoryChats = (params = {}) => utils_apiConfig.request({ url: "/chat/conversations", method: "GET", data: params });
const getChatDetail = (chatId) => {
  return utils_apiConfig.request({
    url: `/chat/conversation`,
    method: "GET",
    data: {
      "conversation_id": chatId
    }
  });
};
const searchChats = (keyword, filterType = "all") => utils_apiConfig.request({ url: "/chat/search", method: "GET", data: { keyword, filterType } });
const setSelectedChat = (chat) => {
  try {
    common_vendor.index.setStorageSync("selectedChat", chat);
  } catch (e) {
    common_vendor.index.__f__("error", "at pages/chatAI/api.js:77", "设置选中对话失败", e);
  }
};
const getSelectedChat = (id) => {
  try {
    const chat = common_vendor.index.getStorageSync("selectedChat");
    if (chat)
      common_vendor.index.removeStorageSync("selectedChat");
    return chat || null;
  } catch (e) {
    common_vendor.index.__f__("error", "at pages/chatAI/api.js:89", "获取选中对话失败", e);
    return null;
  }
};
const copyMessage = (content) => new Promise((resolve, reject) => {
  common_vendor.index.setClipboardData({
    data: content,
    success: () => resolve({ success: true }),
    fail: () => reject(new Error("复制失败"))
  });
});
const submitFeedback = (feedback) => utils_apiConfig.request({ url: "/chat/feedback", method: "POST", data: feedback });
exports.copyMessage = copyMessage;
exports.getChatDetail = getChatDetail;
exports.getSelectedChat = getSelectedChat;
exports.loadHistoryChats = loadHistoryChats;
exports.saveChatToBackend = saveChatToBackend;
exports.searchChats = searchChats;
exports.sendAIMessage = sendAIMessage;
exports.setSelectedChat = setSelectedChat;
exports.submitFeedback = submitFeedback;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chatAI/api.js.map
