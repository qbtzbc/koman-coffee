/**
 * 商品卡片组件
 */
Component({
  properties: {
    // 商品数据
    productData: {
      type: Object,
      value: {}
    },
    // 是否显示加购按钮
    showAddCart: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    /**
     * 点击卡片
     */
    onTap() {
      this.triggerEvent('tap', {
        productId: this.data.productData._id || this.data.productData.id
      });
    },

    /**
     * 点击加购按钮
     */
    onAddCart(e) {
      e.stopPropagation();
      this.triggerEvent('addcart', {
        productId: this.data.productData._id || this.data.productData.id,
        productData: this.data.productData
      });
    }
  }
});
