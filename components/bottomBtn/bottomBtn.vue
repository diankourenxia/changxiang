<template>
  <view style="display: flex; justify-content: center">
    <view
      @click="clickBtnHandler"
      :class="{ btnWrapper: true, disabledBtn: disabled }"
    >
      <text v-if="text">{{ text }}</text>
      <slot name="ele"></slot>
    </view>
  </view>
</template>

<script>
// 底部按钮组件，fixed定位于底部，这里进行一个样式封装，便于后面做统一调整
// 注：凡是使用该按钮组件的页面，若页面内容长度可能会超一页的话，那么就需要注意一下底部的内容是否会被按钮给盖住，需预留足够的底部间距
export default {
  name: "bottomBtn",

  props: {
    text: {
      type: String,
      default: "",
    }, // 按钮显示文案，非必填
    disabled: {
      type: Boolean,
      default: "",
    }, // 按钮是否是禁止点击的样式。注：就不在这里做如果禁止点击就不emit事件的处理了
  },

  data() {
    return {}
  },

  methods: {
    /**
     * 点击按钮触发的方法
     */
    clickBtnHandler() {
      this.$emit("click")
    },
  },
}
</script>

<style lang="scss" scoped>
.btnWrapper {
  position: fixed;
  z-index: 16;
  @include global-background-color2();
  bottom: 30rpx;
  text-align: center;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fff;
  width: 690rpx;
  height: 90rpx;
  border-radius: 20rpx;
  line-height: 90rpx;
}
.disabledBtn {
  opacity: 0.5;
}
</style>
