<template>
	<view class="t-table" :style="{ 'border-width': border + 'px', 'border-color': borderColor }">
		<slot />
	</view>
</template>

<script>
export default {
  props: {
    border: {
      type: String,
      default: "1"
    },
    borderColor: {
      type: String,
      default: "#d0dee5"
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      table: this
    }
  },
  data() {
    return {}
  },

		
}
</script>

<style scoped>
	.t-table {
		width: 100%;
		border: 1px #d0dee5 solid;
		border-left: none;
		border-top: none;
		box-sizing: border-box;
	}

	.t-table>>>t-tr {
		display: flex;
	}

	.t-table>>>t-tr:nth-child(2n) {
		background: #f5f5f5;
	}

	/* #ifdef H5 */
	.t-table>>>.t-tr:nth-child(2n) {
		background: #f5f5f5;
	}
	/* #endif */
</style>
