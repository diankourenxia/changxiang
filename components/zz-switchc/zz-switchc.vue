<template>
	<view>
		<view class="weui-switch" :class="{'weui-switch-on' : isChecked}" :value="value"  @click="toggle" :style="{color:bgcolor}">
			
		</view>
	</view>
</template>

<script>
	 export default {
  name: "switchComponent",
  props: {
    value: {
      type: Boolean,
      default: true
    },
    //背景颜色
    // bgcolor: {
    // 	type: String,
    // 	default: "#00bfff"
    // },
    //宽度 px
    width: {
      type: Number,
      default: 52
    },
    text: {
      type: String,
      default: ""
    },
    sid: {
      type: Number,
      default: 0,
    }
  },
  data () {
    return {
      isChecked: this.value,
    }
  },
  computed: {
    direction () {
      if (this.text) {
        return this.text.split("|")
      } else {
        return []
      }
    }
  },
  watch: {
    value (val) {
      this.isChecked = val
    },
    isChecked(val) {
      let textTemp = ""
      if(val) {
        textTemp = this.text.split("|")[0]
      } 
      if(!val) {
        textTemp = this.text.split("|")[1]
      }
      let ob = {
        sid: this.sid,
        value: val,
        text: textTemp
      }
      this.$emit("change", ob)
    }
  },
  methods: {
    toggle(e) {
      this.isChecked = !this.isChecked
    }
  }
}   
</script>

<style lang="scss">
	
	.weui-switch {
		position:relative;
        display: block;
        position: relative;
        width: 80rpx;
        height: 32rpx;
        outline: 0;
        border-radius: 16px;
        box-sizing: border-box;
        background-color: #DFDFDF;
        transition: background-color 0.1s, border 0.1s;
        cursor: pointer;
    }
	
  
    .weui-switch:after {
        content: " ";
        position: absolute;
        top: -5rpx;
        left: -10rpx;
        width: 40rpx;
        height: 40rpx;
        border-radius: 20rpx;
		background: #FFFFFF;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
		
    }
	
    .weui-switch-on {
        @include global-background-color();
    }
	
    .weui-switch-on:after {
        transform: translateX(66rpx);
    }	
	
	
</style>
