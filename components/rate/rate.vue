<template>
	<view class="rate-media">
		<view class="rate-media-body">
			<view class="rate-media-cell"
				  v-for="(item,index) in max"
				  :key="index"
				  @click="clickStars(index)">
				<image :style="{'width': size + 'rpx','height':size+'rpx','margin':margin+'rpx'}" :src="valueSync>index?star_fill:star_empty"/>
			</view>
		</view>
		<view class="rate-media-info" v-if="is_score||is_attitude">
			<view v-if="is_score">{{is_infos_text()}}</view>
			<view v-if="is_attitude">{{rateScoreText}}</view>
		</view>
	</view>
</template>

<script>
// uni社区开源组件，文档在https://ext.dcloud.net.cn/plugin?id=1698
export default{
  name:"rate",
  props:{
    star_fill: {
      //亮星星
      type: [String],
      default: "https://booleandata-zuwuzu.oss-cn-beijing.aliyuncs.com/imgtest/product/star.png"
    },
    star_empty: {
      //暗星星
      type: [String],
      default: "https://booleandata-zuwuzu.oss-cn-beijing.aliyuncs.com/imgtest/product/star-no.png"
    },
    score:{
      type:Array,
      default:function(){
        return ["1分","2分","3分","4分","5分"]
      }
    },
    is_score:{
      type: [Boolean, String],
      default: false
    },
    attitude:{
      type: Array,
      default:function(){
        return ["极差", "较差", "还行", "比较满意", "非常满意"]
      }
    },
    is_attitude:{
      type: [Boolean, String],
      default: true
    },
    size: {
      // 星星的大小
      type: [Number, String],
      default: 48
    },
    value: {
      // 当前评分
      type: [Number, String],
      default: 0
    },
    max: {
      // 最大评分
      type: [Number, String],
      default: 5
    },
    disabled: {
      // 是否可点击
      type: [Boolean, String],
      default: false
    },
    margin: {
      // 星星的间距
      type: [Number, String],
      default: "0 5"
    },
  },
  data() {
    return {
      valueSync: 0,
      rateScoreText:"",
    }
  },
  created() {
    this.valueSync = Number(this.value)
  },
  watch: {
    value: function(newV) {
      if (!newV) {
        this.valueSync = 0
        this.rateScoreText = ""
      }
    }
  },
  methods: {
    clickStars(i){
			  if (this.disabled) {
			  	return
			  }
			  this.rateScoreText = this.attitude[i]||""
			  this.valueSync = i+1
			  this.$emit("change", {
			  	value: this.valueSync,
        attitude: this.attitude[i]||"",
        score: this.score[i]||""
			  })
    },
    is_infos_text(){
      return this.score[this.valueSync-1||0]||""
    },
    // is_score_text(index){
    // 	return this.score[index]
    // }
  }
}
</script>

<style lang="scss">
	.rate-media{
		display: flex;
		line-height: 1;
		.rate-media-body{
			display: flex;
		}
		.rate-media-info{
			display: flex;
			align-items: center;
			font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
			view:nth-child(1){
				margin:0 20rpx;
			}
			
		}
	}
</style>
