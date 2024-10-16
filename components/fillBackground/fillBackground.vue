<template>
	<view :class="{'fillWerppt':true, 'relative': relative}" :style="{'height':height}">
		<view class="color"></view>
		<view class="color"></view>
		<view class="color"></view>
		<view class="color"></view>
		<view class="color"></view>
	</view>
</template>

<script>
	export default {
		name: "fillBackground",
		
		data() {
			return {}
		},
		
		props: {
			height: {
				type: String,
				default: '100%'
			},
			relative: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style>
	view {
		z-index: -999;
	}
	.relative{
		position: relative;
	}
	.fillWerppt {
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -999;
	}

	.color {
		position: absolute;
		filter: blur(100rpx);
	}

	.color:nth-child(1) {
		top: -350rpx;
		width: 100%;
		height: 600rpx;
		background: rgb(154, 100, 255);
		animation: colorOne 3s ease infinite alternate;
	}

	@keyframes colorOne {
		0% {
			background: rgb(154, 100, 255);
		}

		25% {
			background: rgb(154, 150, 255);
		}

		50% {
			background: rgb(154, 176, 255);
		}

		75% {
			background: rgb(154, 200, 255);
		}

		100% {
			background: rgb(154, 213, 255);
		}
	}

	.color:nth-child(2) {
		bottom: 0;
		left: 50%;
		width: 50%;
		height: 50%;
		background: rgb(255, 231, 240);
		animation: colorTwo 3s ease infinite alternate;
	}

	@keyframes colorTwo {
		0% {
			background: rgb(255, 237, 241);
		}

		25% {
			background: rgb(255, 250, 241);
		}

		50% {
			background: rgb(255, 250, 250);
		}

		75% {
			background: rgb(255, 200, 241);
		}

		100% {
			background: rgb(255, 250, 250);
		}
	}

	.color:nth-child(3) {
		bottom: 0;
		right: 50%;
		width: 50%;
		height: 50%;
		background: rgb(218, 252, 253);
		animation: colorThree 3s ease infinite alternate;
	}

	@keyframes colorThree {
		0% {
			background: rgb(218, 252, 255);
		}

		25% {
			background: rgb(230, 252, 253);
		}

		50% {
			background: rgb(218, 240, 253);
		}

		75% {
			background: rgb(240, 200, 253);
		}

		100% {
			background: rgb(218, 250, 253);
		}
	}

	.color:nth-child(4) {
		top: 0;
		right: 0;
		width: 100%;
		height: 80%;
		background: rgb(228, 197, 255);
		animation: colorFour 3s ease infinite alternate;
	}

	@keyframes colorFour {
		0% {
			background: rgb(228, 197, 255);
		}

		25% {
			background: rgb(228, 210, 255);
		}

		50% {
			background: rgb(228, 220, 255);
		}

		75% {
			background: rgb(228, 240, 255);
		}

		100% {
			background: rgb(228, 250, 255);
		}
	}

	.color:nth-child(5) {
		top: 0;
		right: 0;
		width: 40%;
		height: 50%;
		background-color: rgb(209, 224, 254);
		animation: colorFive 3s ease infinite alternate;
	}

	@keyframes colorFive {
		0% {
			background: rgb(209, 224, 254);
		}

		25% {
			background: rgb(209, 240, 254);
		}

		50% {
			background: rgb(215, 224, 254);
		}

		75% {
			background: rgb(215, 250, 254);
		}

		100% {
			background: rgb(230, 224, 254);
		}
	}
</style>