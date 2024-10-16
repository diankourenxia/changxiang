<template>
	<view class="uni-swiper__warp" :style="{'marginTop': marginTop}">
		<slot />
		<view
			v-if="mode === 'default'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
			key="default"
		>
			<view
				v-for="(item, index) in info"
				:style="{
					width: (index === currentData ? dots.width * 2 : dots.width) + 'px',
					height: dots.width / 3 + 'px',
					'background-color':
						index !== currentData ? dots.backgroundColor : dots.selectedBackgroundColor,
					'border-radius': '0px'
				}"
				:key="index"
				class="uni-swiper__dots-item uni-swiper__dots-bar"
			/>
		</view>
		<view
			v-if="mode === 'dot'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
			key="dot"
		>
			<view
				v-for="(item, index) in info"
				:style="{
					width: dots.width + 'px',
					height: dots.height + 'px',
					'background-color':
						index !== currentData ? dots.backgroundColor : dots.selectedBackgroundColor,
					border: index !== currentData ? dots.border : dots.selectedBorder
				}"
				:key="index"
				class="uni-swiper__dots-item"
			/>
		</view>
		<view
			v-if="mode === 'round'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
			key="round"
		>
			<view
				v-for="(item, index) in info"
				@click="onItem(index)"
				:class="[index === currentData && 'uni-swiper__dots-long']"
				:style="{
					width: (index === currentData ? dots.width * 4 : dots.width) + 'px',
					height: dots.height + 'px',
					'background-color':
						index !== currentData ? '#D8D8D8' : '#E42930',
					border: index !== currentData ? '#D8D8D8' : '#E42930',
					transition: '0.3s'
				}"
				:key="index"
				class="uni-swiper__dots-item "
			/>
		</view>
		<view
			v-if="mode === 'rounds'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-boxs"
			key="rounds"
		>
			<view
				v-for="(item, index) in info"
				:class="[index === currentData && 'uni-swiper__dots-long']"
				:style="{
					width: (index === currentData ? dots.width : dots.width) + 'px',
					height: dots.height + 'px',
					'background-color': index !== currentData ? dots.backgroundColor : '#FFCF2E',
					border: index !== currentData ? dots.border : '1px solid #FFCF2E',
					borderRadius: '50rpx'
				}"
				:key="index"
				class="uni-swiper__dots-item "
			/>
		</view>
		<view
			v-if="mode === 'block'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-block"
			key="block"
		>
			<view
				v-for="(item, index) in info"
				:style="{
					width: (index === currentData ? '30rpx' : '14rpx'),
					height: '14rpx',
					'background-color': index !== currentData ? '#DEDEDE' : '#1677FF',
					borderRadius: '50rpx'
				}"
				:key="index"
				class="uni-swiper__block-item"
			/>
		</view>
		
		<view
			v-if="mode === 'nav'"
			key="nav"
			:style="{ 'background-color': dotsStyles.backgroundColor, bottom: '0' }"
			class="uni-swiper__dots-box uni-swiper__dots-nav"
		>
			<text :style="{ color: dotsStyles.color }" class="uni-swiper__dots-nav-item">
				{{ currentData + 1 + '/' + info.length + ' ' + info[currentData][field] }}
			</text>
		</view>
		<view
			v-if="mode === 'indexes'"
			key="indexes"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
		>
			<view
				v-for="(item, index) in info"
				:style="{
					width: dots.width + 'px',
					height: dots.height + 'px',
					color: index === currentData ? dots.selectedColor : dots.color,
					'background-color':
						index !== currentData ? dots.backgroundColor : dots.selectedBackgroundColor,
					border: index !== currentData ? dots.selectedBorder : dots.selectedBorder
				}"
				:key="index"
				class="uni-swiper__dots-item uni-swiper__dots-indexes"
			>
				<text class="uni-swiper__dots-indexes-text">{{ index + 1 }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  name: "UniSwiperDot",
  props: {
    info: {
      type: Array,
      default() {
        return []
      }
    },
    current: {
      type: Number,
      default: 0
    },
    dotsStyles: {
      type: Object,
      default() {
        return {}
      }
    },
    // 类型 ：default(默认) indexes long nav
    mode: {
      type: String,
      default: "default"
    },
    // 只在 nav 模式下生效，变量名称
    field: {
      type: String,
      default: ""
    },
	marginTop: {
		type: Number,
		default: 0
	}
  },
  data() {
    return {
      dots: {
        width: 4,
        height: 4,
        bottom: 10,
        color: "#fff",
        backgroundColor: "#fff",
        border: "1px #fff solid",
        selectedBackgroundColor: "#fff",
        selectedBorder: "1px #fff solid"
	  },
	  currentData:0
    }
  },
  watch: {
    dotsStyles(newVal) {
      this.dots = Object.assign(this.dots, this.dotsStyles)
    },
    mode(newVal) {
      if (newVal === "indexes") {
        this.dots.width = 20
        this.dots.height = 20
      } else {
        this.dots.width = 8
        this.dots.height = 8
      }
    },
    current(newVal){
      this.currentData = newVal
    }
  },
  created() {
    if (this.mode === "indexes") {
      this.dots.width = 20
      this.dots.height = 20
    }
    this.dots = Object.assign(this.dots, this.dotsStyles)
  },
  methods: {
    onItem(index) {
      if (this.current !== index) {
        this.$emit("change", index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uni-swiper__warp {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: column;
	position: relative;
	overflow: hidden;
	justify-content: center;
}

.uni-swiper__dots-box {
	position: absolute;
	bottom: 10px;
	left: 0;
	right: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.uni-swiper__dots-boxs {
	position: absolute;
	bottom: 10px;
	left: 0;
	right: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 310rpx;
}
.uni-swiper__dots-block {
	position: absolute;
	bottom: 10px;
	left: 0;
	right: 0;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	padding-right: 20rpx;

}


.uni-swiper__dots-item {
	width: 8px;
	border-radius: 100px;
	margin-left: 6px;
	background-color: $uni-bg-color-mask;
	// transition: width 0.2s linear;  不要取消注释，不然会不能变色
}
.uni-swiper__block-item {
	width: 8px;
	margin-left: 6px;
	background-color: $uni-bg-color-mask;
	transition: width 0.3s ;
	border-radius: 50%;
}

.uni-swiper__dots-item:first-child {
	margin: 0;
}

.uni-swiper__dots-default {
	border-radius: 100px;
}

.uni-swiper__dots-long {
	border-radius: 50px;
}

.uni-swiper__dots-bar {
	border-radius: 50px;
}

.uni-swiper__dots-nav {
	bottom: 0px;
	height: 40px;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.2);
}

.uni-swiper__dots-nav-item {
	/* overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
	font-size: $uni-font-size-base;
	color: #fff;
	margin: 0 15px;
}

.uni-swiper__dots-indexes {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	// flex: 1;
	justify-content: center;
	align-items: center;
}

.uni-swiper__dots-indexes-text {
	color: #fff;
	font-size: $uni-font-size-sm;
}
</style>
