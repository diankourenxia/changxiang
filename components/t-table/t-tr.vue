<template>
	<view class="t-tr">
		<view v-if="isCheck" class="t-check-box" :style="{ 'border-width': thBorder + 'px' ,'border-color':borderColor}">
		</view>
		<slot></slot>
	</view>
</template>

<script>
export default {
  props: {
    fontSize: String,
    color: String,
    align: String
  },
  // inject: ['table'],
  provide() {
    return {
      tr: this
    }
  },
  data() {
    return {
      isCheck: false,
      checkboxData: {
        value: 0,
        checked: false
      },
      checked: false,
      thBorder: "1",
      borderColor: "#d0dee5"
    }
  },
}
</script>

<style>
	.t-tr {
		width: 100%;
		display: flex;
	}

	.t-tr t-th,
	.t-tr t-td {
		display: flex;
		flex: 1;
	}

	.t-tr .t-check-box {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80upx;
		color: #3b4246;
		border-left: 1px #d0dee5 solid;
		border-top: 1px #d0dee5 solid;
	}

	.t-tr .t-check-box checkbox {
		transform: scale(0.8);
	}
</style>
