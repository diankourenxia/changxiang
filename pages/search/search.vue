<template>
	<view class="searchs">
		<view class="search">
			<input
				type="text"
				placeholder="iphone"
				class="input"
				@confirm="onConfirm"
				@input="onChange"
				focus
				:value="content"
			/>
			<view class="confirm" @click="onConfirm">搜索</view>
			<image src="../../static/home/search.png" mode="scaleToFill" class="icon"></image>
		</view>
		<view class="hot">
			<view class="title">热门</view>
			<view class="hot-list">
				<view
					v-for="(item, index) in hotList"
					:key="index"
					class="item"
					@click="getContent(item)"
				>
					<text
						class="s"
						:style="{
							color:
								index === 0
									? '#FF2C1C'
									: index === 1
									? '#F7870C'
									: index === 2
									? '#FFC243'
									: '#999999'
						}"
					>
						{{ index + 1 }}
					</text>
					<text style="font-size: 28rpx;font-weight: 500;color: #333333;">
						{{ item }}
						<text class="ihot" v-if="index === 0">hot</text>
					</text>
				</view>
			</view>
		</view>
		<view class="history">
			<view class="title">
				<view class="title-left">历史</view>
				<view class="title-right" @click="onDelete">清空</view>
			</view>
			<text
				v-for="(item, index) in history"
				:key="index"
				class="historys"
				@click="getContent(item)"
			>
				{{ item }}
			</text>
		</view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      hotList: [],
      history: [],
	  content: "",
	 
    }
  },
  onLoad(e) {
    this.onQuery()
    this.content = e.swiperData
  },
  methods: {
    //搜索页面数据获取
    onQuery() {
      this.$request("hzsx/userWordHistory/searchPage", {}, "get", true).then(res => {
        this.hotList = res.data.hotSearchList
        this.history = res.data.history
      })
    },
    //清空
    onDelete() {
      this.$request("hzsx/userWordHistory/deleteUserWordHistory", {}, "get", true).then(
        res => {
          this.onQuery()
        }
      )
    },
    getContent(val) {
      this.$onTo(`/pages/goodsList/goodsList?content=${val}&name=商品列表`)
    },
    //获取input内容
    onChange(e) {
      this.content = e.detail.value
    },
    //搜索
    onConfirm() {
      if (this.content) {
        this.$onTo(`/pages/goodsList/goodsList?content=${this.content}&name=商品列表`)
      } else {
        uni.showToast({
          title: "请输入"
        })
      }
    }
  }
}
</script>

<style lang="scss">
page {
	background: #fff;
}
.searchs {
	.search {
		position: relative;
		padding-top: 20rpx;
		padding-left: 20rpx;
		margin-bottom: 30rpx;
		.input {
			width: 566rpx;
			height: 62rpx;
			background: #f7f8fb;
			border-radius: 36rpx 0 0 36rpx;
			padding-left: 80rpx;
		}
		.confirm {
			width: 114rpx;
			height: 70rpx;
			@include global-background-color2();
			border-radius: 0px 35rpx 35rpx 0px;
			text-align: center;
			line-height: 70rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #FFFFFF;
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}
		.icon {
			width: 29rpx;
			height: 29rpx;
			position: absolute;
			top: 40rpx;
			left: 50rpx;
		}
	}
	.hot {
		padding-left: 42rpx;
		padding-right: 30rpx;

		.hot-list {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.item {
				width: 50%;
				margin-top: 20rpx;
				.s {
					font-size: 28rpx;
					font-weight: 600;
					color: #999999;
					width: 40rpx;
					display: inline-block;
				}
				.ihot {
					background: #fff4c3;
					border-radius: 18rpx;
					padding: 2rpx 10rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #b7761a;
					margin-left: 10rpx;
				}
			}
		}
		.title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333333;
		}
	}
	.history {
		padding-left: 42rpx;
		padding-right: 30rpx;
		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 64rpx;
			margin-bottom: 20rpx;
			.title-left {
				font-size: 32rpx;
				font-weight: 600;
				color: #333333;
			}
			.title-right {
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
			}
		}
		.historys {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			background: #f5f5f8;
			padding: 6rpx 20rpx;
			border-radius: 29rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			display: inline-block;
		}
	}
}
</style>
