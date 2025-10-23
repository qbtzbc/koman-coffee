/**
 * 定制选项组件
 */
Component({
  properties: {
    // 选项配置数组
    options: {
      type: Array,
      value: []
    }
  },

  data: {
    selectedValues: {} // 存储已选择的值
  },

  lifetimes: {
    attached() {
      // 初始化默认选项
      this.initDefaultValues();
    }
  },

  observers: {
    'options': function(newOptions) {
      if (newOptions && newOptions.length > 0) {
        this.initDefaultValues();
      }
    }
  },

  methods: {
    /**
     * 初始化默认选项
     */
    initDefaultValues() {
      const selectedValues = {};
      
      this.data.options.forEach(group => {
        const defaultOption = group.options.find(opt => opt.default);
        if (defaultOption) {
          selectedValues[group.type] = defaultOption.value;
        } else if (group.options.length > 0) {
          selectedValues[group.type] = group.options[0].value;
        }
      });
      
      this.setData({ selectedValues });
      
      // 触发初始值变化事件
      this.triggerChange();
    },

    /**
     * 选择选项
     */
    onSelectOption(e) {
      const { type, value } = e.currentTarget.dataset;
      
      this.setData({
        [`selectedValues.${type}`]: value
      });
      
      this.triggerChange();
    },

    /**
     * 触发值变化事件
     */
    triggerChange() {
      this.triggerEvent('change', {
        customization: this.data.selectedValues
      });
    },

    /**
     * 获取当前选择的值
     */
    getValue() {
      return this.data.selectedValues;
    }
  }
});
