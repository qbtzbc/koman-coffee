/**
 * 本地存储封装
 */

/**
 * 设置存储
 */
const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (error) {
    console.error('设置存储失败:', error);
    return false;
  }
};

/**
 * 获取存储
 */
const getStorage = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key);
    return value || defaultValue;
  } catch (error) {
    console.error('获取存储失败:', error);
    return defaultValue;
  }
};

/**
 * 移除存储
 */
const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (error) {
    console.error('移除存储失败:', error);
    return false;
  }
};

/**
 * 清空存储
 */
const clearStorage = () => {
  try {
    wx.clearStorageSync();
    return true;
  } catch (error) {
    console.error('清空存储失败:', error);
    return false;
  }
};

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage
};
