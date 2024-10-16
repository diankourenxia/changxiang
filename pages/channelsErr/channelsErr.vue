<template>
	<view class="channelsErr">
		<view class="main">
			<image src="https://oss.chuangliukeji.com/backstage/2023-12-05/8b163fc752ff45a9ababf64d139389db.png" mode="widthFix" class="channelsErrImg"></image>
			<view class="textBox"><text class="colorFirebrick">此渠道已停用</text>无法访问该小程序，请通过<text
					class="colorBlud">正常渠道进入</text>或<text class="colorBlud">支付宝打开搜 畅享易租</text> 方可正常使用！</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			uni.hideHomeButton();
		},
		methods: {

		},
	}
</script>

<style>
	.channelsErr {
		width: 100%;
	}

	.main {
		width: calc(100% - 30%);
		padding: 150rpx 15% 0 15%;
	}

	.channelsErrImg {
		width: 100%;
	}

	.colorFirebrick {
		color: red;
	}

	.colorBlud {
		color: dodgerblue;
	}

	.textBox {
		border-radius: 20rpx;
		padding: 17rpx 20rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #986828;
		line-height: 38rpx;
	}
</style>