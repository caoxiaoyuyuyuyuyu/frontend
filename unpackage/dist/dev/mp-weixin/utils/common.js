"use strict";
const formatDate = (dateTime) => {
  if (!dateTime)
    return dateTime;
  const date = new Date(dateTime);
  if (isNaN(date))
    return dateTime;
  return date.toISOString().replace("T", " ").split(".")[0];
};
exports.formatDate = formatDate;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/common.js.map
