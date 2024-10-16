<template>
  <view :class="[isOpen ? 'cmd-curtain' : 'cmd-curtain--closed']" @tap="$_close">
    <view class="cmd-curtain__container">
      <view class="cmd-curtain__body">
        <slot></slot>
        <view class="cmd-curtain__btn-close" :class="setModeClass" @tap="$_close"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "cmd-curtain",

  props: {
    /**
       * 显示状态
       */
    visible: {
      type: Boolean,
      default: false
    },
    /**
       * 按钮方向模式
       */
    mode: {
      type: String,
      default: "bottom"
    }
  },

  data() {
    return {
      // 幕帘显示
      isOpen: false
    }
  },

  computed: {
    // 按钮方向样式
    setModeClass() {
      let modeClass = "cmd-curtain__btn-close--"
      if (this.mode != "bottom") {
        modeClass += this.mode
      } else {
        modeClass += this.mode
      }
      return modeClass
    }
  },

  watch: {
    /**
       * 监听显示状态
       */
    visible(val) {
      this.isOpen = true
    }
  },

  methods: {
    /**
       * 关闭事件
       */
    $_close(e) {
      this.isOpen = false
      setTimeout(() => {
        this.$emit("close",e)
      }, 300)
    }
  }

}
</script>

<style lang="scss">
  /**
   * 幕帘样式属性变量
   */
  $cmd-curtain-btn-color: #FFF;
  $cmd-curtain-btn-size: 64upx;
  $cmd-curtain-zindex: 1080;

  .cmd-curtain {
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba($color: #000, $alpha: 0.3);
    z-index: $cmd-curtain-zindex;

    &__container {
      display: flex;
      position: relative;
      margin: 0 auto;
      width: 80%;
      height: 100%;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      opacity: 1;
    }

    &__body {
      position: relative;
      width: 100%;
    }

    &__btn-close {
      display: flex;
      position: absolute;
      width: $cmd-curtain-btn-size;
      height: $cmd-curtain-btn-size;
      margin-left: -$cmd-curtain-btn-size / 2;
      left: 50%;
      bottom: -($cmd-curtain-btn-size + 24upx);
      align-items: center;
      justify-content: center;
      border: 2upx solid $cmd-curtain-btn-color;
      border-radius: 50%;
      box-sizing: border-box;
      z-index: $cmd-curtain-zindex;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        display: inline-block;
        width: 34upx;
        height: 2upx;
        border-radius: 1upx;
        background: $cmd-curtain-btn-color;
      }

      &::before {
        transform: translate3d(-50%, -50%, 0) rotate(45deg);
      }

      &::after {
        transform: translate3d(-50%, -50%, 0) rotate(-45deg);
      }

      &--top {
        margin-left: -$cmd-curtain-btn-size / 2;
        top: -($cmd-curtain-btn-size + 24upx);
        left: 50%;
        bottom: auto;
      }

      &--top-left {
        top: -($cmd-curtain-btn-size + 24upx);
        left: 0;
        bottom: auto;
      }

      &--top-right {
        top: -($cmd-curtain-btn-size + 24upx);
        left: auto;
        right: 0;
        bottom: auto;
      }

      &--bottom {
        margin-left: -$cmd-curtain-btn-size / 2;
        bottom: -($cmd-curtain-btn-size + 24upx);
        left: 50%;
      }

      &--bottom-left {
        bottom: -($cmd-curtain-btn-size + 24upx);
        left: 0;
      }

      &--bottom-right {
        bottom: -($cmd-curtain-btn-size + 24upx);
        left: auto;
        right: 0;
      }
    }

    /* modifiers */
    &--closed {
      visibility: hidden;
      display: none;
    }
  }
</style>
