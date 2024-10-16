<template>
	<view
		class="t-td"
		:style="{
			'border-width': thBorder + 'px',
			'border-color': borderColor,
			'justify-content': tdAlignCpd,
			'width': width
		}"
	>
		<slot></slot>
	</view>
</template>

<script>
export default {
  props: {
    align: String,
    width: String
  },
  data() {
    return {
      thBorder: "1",
      borderColor: "#DEDEDE",
		
      color: "#555c60",
      tdAlign: "center",
    }
  },
  computed: {
    tdAlignCpd() {
      let nameAlign = ""
      switch (this.tdAlign) {
      case "left":
        nameAlign = "flex-start"
        break
      case "center":
        nameAlign = "center"
        break
      case "right":
        nameAlign = "flex-end"
        break
      default:
        nameAlign = "center"
        break
      }
      return nameAlign
    }
  }
}
</script>

<style>
.t-td {
	/* flex: 1; */
	display: flex;
	align-items: center;
	/* width: 100%; */
	padding: 20rpx 0;
	border-top: 1px #DEDEDE solid;
	border-left: 1px #DEDEDE solid;
	text-align: center;
	color: #999;
	font-size: 24upx;
}
</style>
