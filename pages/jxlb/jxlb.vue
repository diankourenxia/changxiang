<template>
	<view class="jxlb">
		<image src="../../static/coupons/dbzs.png" mode="scaleToFill" class="bg"></image>
		<view style="height: 215rpx;"></view>
		<view class="content">
			<jxlb-item v-for="(item, index) in list" :item="item" :key="index"></jxlb-item>
		</view>
	</view>
</template>

<script>
import jxlbItem from "../../components/jxlb-item/jxlb-item.vue"
export default {
  data() {
    return {
      list: []
    }
  },
  components: {
    jxlbItem
  },
  onLoad() {
    this.getList()
  },
  methods: {
    onCoupons(e) {
      this.current = e.detail.current
    },
    getList() {
      this.$request("/hzsx/lite/couponCenter/indexPackage", {}, "get", true).then(res => {
        let _list = []
        _list = res.data
        for (let i = 0; i < _list.length; i++) {
          _list[i].couponList2 = []
          for (let j = 0; j < _list[i].couponList.length; j += 4) {
            _list[i].couponList2.push({
              list: [
                _list[i].couponList[j],
                _list[i].couponList[j + 1],
                _list[i].couponList[j + 2],
                _list[i].couponList[j + 3]
              ].filter(n => n)
            })
          }
        }
        this.list = _list
				
      })
    }
  }
}
</script>

<style lang="scss">
page {
	padding-bottom: 40rpx;
}
.jxlb {
	.bg {
		width: 750rpx;
		height: 535rpx;
		position: fixed;
		top: 0;
		z-index: -1;
	}
	.content {
	}
}
</style>
