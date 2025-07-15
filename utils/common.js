export const formatDate = (dateTime) => {
  if (!dateTime) return dateTime;
  const date = new Date(dateTime);
  if (isNaN(date)) return dateTime; // 处理无效日期
  
  return date.toISOString().replace('T', ' ').split('.')[0];
}