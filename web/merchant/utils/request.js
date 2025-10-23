const API_BASE_URL = 'http://localhost:3000/api';
const request = (url, options = {}) => {
  const { method = 'GET', data = {}, showLoading = true } = options;
  if (showLoading) wx.showLoading({ title: '加载中...', mask: true });
  const app = getApp();
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      header: { 'Content-Type': 'application/json', 'Authorization': app.globalData.token ? `Bearer ${app.globalData.token}` : '' },
      success: (res) => {
        if (showLoading) wx.hideLoading();
        if (res.statusCode === 200 || res.statusCode === 201) {
          if (res.data.success) resolve(res.data.data);
          else { wx.showToast({ title: res.data.message || '请求失败', icon: 'none' }); reject(res.data); }
        } else if (res.statusCode === 401) {
          app.clearMerchantInfo();
          wx.showToast({ title: '请先登录', icon: 'none' });
          wx.redirectTo({ url: '/pages/login/login' });
          reject(res.data);
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: () => {
        if (showLoading) wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
        reject();
      }
    });
  });
};
module.exports = { get: (url, data, options = {}) => request(url, { method: 'GET', data, ...options }), post: (url, data, options = {}) => request(url, { method: 'POST', data, ...options }), put: (url, data, options = {}) => request(url, { method: 'PUT', data, ...options }), del: (url, data, options = {}) => request(url, { method: 'DELETE', data, ...options }) };
