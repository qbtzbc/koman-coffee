/**
 * 网络请求封装
 * 支持多环境配置
 */

// 导入环境配置
const config = require('../config/index');

// API基础URL - 从环境配置加载
const API_BASE_URL = config.API_BASE_URL;
const TIMEOUT = config.TIMEOUT || 10000;

/**
 * 发起网络请求
 */
const request = (url, options = {}) => {
  const {
    method = 'GET',
    data = {},
    showLoading = true,
    loadingText = '加载中...'
  } = options;

  // 显示加载提示
  if (showLoading) {
    wx.showLoading({
      title: loadingText,
      mask: true
    });
  }

  // 获取token
  const app = getApp();
  const token = app.globalData.token;

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      timeout: TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }

        // 处理成功响应
        if (res.statusCode === 200 || res.statusCode === 201) {
          if (res.data.success) {
            resolve(res.data.data);
          } else {
            // 业务错误
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none',
              duration: 2000
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // 未授权，清除登录信息
          app.clearUserInfo();
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
          });
          reject(res.data);
        } else {
          // 其他错误
          wx.showToast({
            title: res.data.message || '请求失败',
            icon: 'none',
            duration: 2000
          });
          reject(res.data);
        }
      },
      fail: (error) => {
        if (showLoading) {
          wx.hideLoading();
        }

        // 网络错误
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
          duration: 2000
        });
        reject(error);
      }
    });
  });
};

/**
 * GET请求
 */
const get = (url, data, options = {}) => {
  return request(url, {
    method: 'GET',
    data,
    ...options
  });
};

/**
 * POST请求
 */
const post = (url, data, options = {}) => {
  return request(url, {
    method: 'POST',
    data,
    ...options
  });
};

/**
 * PUT请求
 */
const put = (url, data, options = {}) => {
  return request(url, {
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * DELETE请求
 */
const del = (url, data, options = {}) => {
  return request(url, {
    method: 'DELETE',
    data,
    ...options
  });
};

/**
 * 上传文件
 */
const uploadFile = (filePath, options = {}) => {
  const { name = 'image', formData = {} } = options;

  wx.showLoading({
    title: '上传中...',
    mask: true
  });

  const app = getApp();
  const token = app.globalData.token;

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${API_BASE_URL}/upload/image`,
      filePath,
      name,
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        wx.hideLoading();

        const data = JSON.parse(res.data);
        if (data.success) {
          resolve(data.data);
        } else {
          wx.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          });
          reject(data);
        }
      },
      fail: (error) => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        reject(error);
      }
    });
  });
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  uploadFile,
  API_BASE_URL
};
