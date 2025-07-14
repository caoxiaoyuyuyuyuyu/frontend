"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiConfig = require("../../utils/apiConfig.js");
const sendAIMessage = (data) => utils_apiConfig.request({ url: "/chat/send", method: "POST", data });
const saveChatToBackend = (chat) => utils_apiConfig.request({ url: "/chat/save", method: "POST", data: chat });
const loadHistoryChats = (params = {}) => utils_apiConfig.request({ url: "/chat/history", method: "GET", data: params });
const deleteChat = (chatId) => utils_apiConfig.request({ url: `/chat/${chatId}`, method: "DELETE" });
const searchChats = (keyword, filterType = "all") => utils_apiConfig.request({ url: "/chat/search", method: "GET", data: { keyword, filterType } });
const setSelectedChat = (chat) => {
  try {
    common_vendor.index.setStorageSync("selectedChat", chat);
  } catch (e) {
    common_vendor.index.__f__("error", "at pages/chatAI/api.js:74", "设置选中对话失败", e);
  }
};
const getSelectedChat = () => {
  try {
    const chat = common_vendor.index.getStorageSync("selectedChat");
    if (chat)
      common_vendor.index.removeStorageSync("selectedChat");
    return chat || null;
  } catch (e) {
    common_vendor.index.__f__("error", "at pages/chatAI/api.js:86", "获取选中对话失败", e);
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
const getCurrentTime = () => {
  const now = /* @__PURE__ */ new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
};
const getCurrentDateTime = () => {
  const now = /* @__PURE__ */ new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
};
const generateChatId = () => "chat" + Date.now();
const getChatTitle = (messages) => {
  const userMsg = messages.find((msg) => msg.type === "user");
  if (userMsg)
    return userMsg.content.length > 20 ? userMsg.content.slice(0, 20) + "..." : userMsg.content;
  return "新对话";
};
const getMessagePreview = (messages) => {
  if (!messages.length)
    return "";
  const text = messages[messages.length - 1].content;
  return text.length > 30 ? text.slice(0, 30) + "..." : text;
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
