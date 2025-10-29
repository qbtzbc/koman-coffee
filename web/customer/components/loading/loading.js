/**
 * 启动加载动画组件
 */
Component({
  properties: {
    // 是否显示加载动画
    show: {
      type: Boolean,
      value: false
    },
    // 加载文案
    loadingText: {
      type: String,
      value: '正在准备您的咖啡...'
    },
    // 最小显示时长（毫秒）
    minDuration: {
      type: Number,
      value: 800
    },
    // 超时时长（毫秒）
    timeout: {
      type: Number,
      value: 5000
    }
  },

  data: {
    showError: false,
    errorText: '加载超时，请检查网络连接'
  },

  lifetimes: {
    attached() {
      this.startTime = Date.now();
      this.timeoutTimer = null;
    },

    detached() {
      this.clearTimers();
    }
  },

  methods: {
    /**
     * 开始加载（启动超时计时器）
     */
    startLoading() {
      this.startTime = Date.now();
      this.setData({ showError: false });
      
      // 启动超时计时器
      if (this.data.timeout > 0) {
        this.timeoutTimer = setTimeout(() => {
          this.handleTimeout();
        }, this.data.timeout);
      }
    },

    /**
     * 完成加载（带最小显示时长控制）
     */
    finishLoading() {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.data.minDuration - elapsed);
      
      // 清除超时计时器
      this.clearTimers();
      
      // 确保最小显示时长
      setTimeout(() => {
        this.fadeOutAndHide();
      }, remaining);
    },

    /**
     * 淡出并隐藏
     */
    fadeOutAndHide() {
      // 添加淡出动画类名
      const query = this.createSelectorQuery();
      query.select('.loading-container').node();
      query.exec((res) => {
        if (res[0]) {
          // 通过triggerEvent通知父组件隐藏
          this.triggerEvent('hide');
        }
      });
    },

    /**
     * 处理超时
     */
    handleTimeout() {
      this.setData({
        showError: true,
        errorText: '加载超时，请检查网络连接'
      });
      
      this.triggerEvent('timeout');
    },

    /**
     * 重试按钮点击
     */
    onRetry() {
      this.setData({ showError: false });
      this.triggerEvent('retry');
      this.startLoading();
    },

    /**
     * 清除计时器
     */
    clearTimers() {
      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;
      }
    }
  }
});
