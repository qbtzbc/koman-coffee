/**
 * 订单项组件
 */
const util = require('../../utils/util');

Component({
  properties: {
    // 订单项数据
    itemData: {
      type: Object,
      value: {}
    }
  },

  data: {
    customText: '',
    totalPrice: 0
  },

  observers: {
    'itemData': function(itemData) {
      if (itemData) {
        // 计算定制文本
        const customText = util.getCustomizationText(itemData.customization);
        
        // 计算总价
        const totalPrice = (itemData.price * itemData.quantity).toFixed(2);
        
        this.setData({
          customText,
          totalPrice
        });
      }
    }
  }
});
