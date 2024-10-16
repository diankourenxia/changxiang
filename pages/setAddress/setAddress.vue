<template>
  <view class="setaddress">
    <!-- 头部提示 -->
    <view class="tips" v-if="isTips">
      <text style="width: 600rpx"
        >若所在省市无法选择，请在省市区选择其他，在详细地址 输入即可</text
      >
      <view class="icon" @click="deleteTips"></view>
    </view>
    <!-- 需要提交内容form做处理 -->
    <form report-submit="true" @submit="formSubmit">
      <view class="realName-page">
        <view class="contents">
          <view class="contents-item">
            <view class="contents-item-view">
              <view>收货人</view>
              <input
                class="contents-item-input"
                placeholder="请输入收货人"
                placeholder-class="contents-item-view-city"
                name="realname"
                :value="data.realname"
              />
            </view>
          </view>

          <view class="contents-item">
            <view class="contents-item-view">
              <view>手机号码</view>
              <input
                class="contents-item-input"
                placeholder="请输入手机号码"
                name="telephone"
                placeholder-class="contents-item-view-city"
                :value="data.telephone"
              />
            </view>
          </view>
          <view class="contents-item" style="padding-right: 10rpx">
            <view class="contents-item-view">
              <view
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                }"
              >
                所在区域
              </view>
              <view
                class="contents-item-view-city"
                v-if="!cityText.length"
              >
                <text @click="$refs.cityPicker.show()">请选择区域</text>
                <image
                  mode="scaleToFill"
                  class="iocn"
                  src="https://oss.chuangliukeji.com/backstage/2024-08-20/a9dbe560617a493c9d94e7e6d6849df0.png"
				  @click="getMyLocation"
                ></image>
              </view>
              <view
                class="contents-item-view-city"
                v-if="cityText.length"
              >
                <text @click="$refs.cityPicker.show()">{{ cityText }}</text>
                <image
                  mode="scaleToFill"
                  class="iocn"
                  src="https://oss.chuangliukeji.com/backstage/2024-08-20/a9dbe560617a493c9d94e7e6d6849df0.png"
				  @click="getMyLocation"
                ></image>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="street">
        <textarea
          name="street"
          placeholder="详细地址"
          class="text-area"
          auto-height
          :value="data.street"
       
        />
      </view>
      <view v-if="!isFromOrder" class="min-switch">
        <text class="text">设置默认地址</text>
        <view
          class="my-switch"
          :class="{ 'my-switch-on': isChecked }"
          :value="isChecked"
          @click="getSwitch"
        ></view>
      </view>
      <view style="display: flex; justify-content: center;">
<button form-type="submit" class="footer">保存</button>
      </view>
      
    </form>
    <view class="delete" v-if="isEdit">
      <text @click="deleteProvince">删除地址</text>
    </view>
    <!-- 选择省市区弹框 -->
    <gk-city
      ref="cityPicker"
      :pickerSize="3"
      headtitle="请选择所在区域"
      :provincedata="provincedata"
      @funcvalue="getpickerParentValue"
    ></gk-city>
  </view>
</template>

<script>
import gkCity from "@/components/gk-city/gk-city.vue"
import { notifyTopPageRefresh } from "../../components/orderItem/orderActionBtns/utils/checkShowBtn"

export default {
  data() {
    return {
      provincedata: [{ text: "请选择", value: "" }], //选择省市区默认值
      cityText: [], //省市区信息
      cityValue: [],
      isChecked: false, //控制默认地址开关
      isTips: true, //控制头部提示开关
      id: "", //地址id
      data: {}, //修改地址数据
      isEdit: false, //是否编辑
      isFromOrder: false, // 是否是从订单页面跳转过来的修改地址
      orderId: "",
    }
  },
  onLoad(e) {
    this.isFromOrder = e?.orderId != undefined // 判断是否来自订单模块中的修改地址
    this.orderId = e?.orderId
    const that = this
    if (e && e.id) {
      this.$request(
        "/hzsx/userAddress/getUserAddressById",
        { id: e.id },
        "get",
        true
      ).then((res) => {
        this.data = res.data
        this.cityText = [
          res.data.provinceStr,
          res.data.cityStr,
          res.data.areaStr,
        ]
        this.cityValue = [res.data.province, res.data.city, res.data.area]
        that.provincedata = [
          { text: res.data.provinceStr, value: res.data.province },
          { text: res.data.cityStr, value: res.data.city },
          { text: res.data.areaStr, value: res.data.area },
        ]
        this.isChecked = res.data.isDefault
        this.isEdit = true
      })
    }
  },
  components: { gkCity },
  methods: {
    //获取省市区信息
    getpickerParentValue(val) {
		console.log("val",val);
      let _city = val
      this.cityText = _city.map((item) => item.text)
      this.cityValue = _city.map((item) => item.value)
      this.provincedata = val
	  console.log("this.cityText",this.cityText);
	  console.log("this.cityValue",this.cityValue);
	  console.log("this.provincedata",this.provincedata);
    },

    //新增
    add(street, telephone, realname) {
      const url = this.isFromOrder ? "hzsx/api/order/userOrderAddressModify" : "hzsx/userAddress/addUserAddress"
      const postData = {
        province: this.cityValue[0],
        city: this.cityValue[1],
        area: this.cityValue[2],
        street,
        telephone,
      }

      if (this.isFromOrder) { // 来自订单模块修改地址时
        postData.orderId = this.orderId
        postData.realName = realname
      } else {
        postData.isDefault = this.isChecked
        postData.realname = realname
        postData.uid = this.$getUid()
      }

      this.$request(
        url,
        postData,
        "post"
      ).then(() => {
        if (this.isFromOrder) { // 来自订单模块时，修改完地址时通知组件更新
          notifyTopPageRefresh.apply(this) // 通知订单页面、订单详情页面进行刷新操作
        }
        uni.navigateBack({
          delta: 1,
        })
      })
    },

    //修改
    modify(street, telephone, realname) {
      this.$request(
        "hzsx/userAddress/modifyUserAddress",
        {
          province: this.cityValue[0],
          city: this.cityValue[1],
          area: this.cityValue[2],
          isDefault: this.isChecked,
          realname,
          street,
          telephone,
          uid: this.$getUid(),
          id: this.data.id,
        },
        "post"
      ).then((res) => {
        uni.navigateBack({
          delta: 1,
        })
      })
    },

    //提交按钮
    formSubmit(e) {
      const { street, telephone, realname } = e.detail.value
      if (!realname) {
        uni.showToast({ title: "请输入收货人姓名" })
        return
      }
      if (!telephone || telephone.length !== 11) {
        uni.showToast({ title: "请输入正确的手机号" })
        return
      }
      if (!this.cityText.length) {
        uni.showToast({ title: "请选择省市区" })
        return
      }
      if (!street) {
        uni.showToast({ title: "请输入详细地址" })
        return
      }
      if (this.isEdit) {
        this.modify(street, telephone, realname)
      } else {
        this.add(street, telephone, realname)
      }
    },
    //默认地址开关
    getSwitch(e) {
      this.isChecked = !this.isChecked
    },
    //删除头部提示
    deleteTips() {
      this.isTips = false
    },
    //删除
    deleteProvince() {
      this.$request(
        "hzsx/userAddress/deleteUserAddress",
        { id: this.data.id },
        "get",
        true
      ).then((res) => {
        uni.navigateBack({
          delta: 1,
        })
      })
    },
	
	// 地理位置弹窗
	getMyLocation() {
		my.getLocation({
			type: 2,
			success: (res) => {
				console.log("rtes",res);
				this.cityText = [res.province, res.city, res.district];
				this.cityValue = [res.provinceAdcode, res.cityAdcode, res.districtAdcode];
				this.provincedata = [
					{
						'text': res.province,
						'value': res.provinceAdcode
					},
					{
						'text': res.city,
						'value': res.cityAdcode
					},
					{
						'text': res.district,
						'value': res.districtAdcode
					},
				];
				this.data.street = res.streetNumber.street + res.streetNumber.number;
			},
			fail: (err) => {
				console.log("err",err);
			},
		});
	},
  },
}
</script>

<style lang="scss" scoped>
.setaddress {
  .tips {
    width: 100%;
    height: 98rpx;
    @include global-background-color2();
    font-size: 24rpx;
    font-weight: 400;
    color: #fff;
    line-height: 33rpx;
    padding-right: 120rpx;
    padding-left: 30rpx;
    display: flex;
    align-items: center;
    position: relative;
    .icon {
      position: absolute;
      right: 200rpx;
      top: 20rpx;
      &::before {
        position: absolute;
        left: 15rpx;
        content: " ";
        height: 20rpx;
        width: 3rpx;
        background-color: #111111;
      }
      &::after {
        position: absolute;
        left: 15rpx;
        content: " ";
        height: 20rpx;
        width: 3rpx;
        background-color: #111111;
      }
      &:before {
        transform: rotate(45deg);
      }
      &:after {
        transform: rotate(-45deg);
      }
    }
  }
  .realName-page {
    @include wh(100%, 100%);
    margin-top: 20rpx;
    .contents {
      padding: 0 20rpx 0 30rpx;
      background-color: #ffffff;
      border-radius: 20rpx;
      .contents-item-view {
        height: 100rpx;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: PingFangSC-Regular;
        color: #333333;
        font-size: 30rpx;
        padding: 20rpx 0;
        .contents-item-input {
          text-align: right;
          padding-left: 0;
  
        }
        /deep/ .contents-item-view-city {
          font-size: 28rpx;
          font-weight: normal;
          color: #999999;
		  display: flex;
		  align-items: center;
        }
      }
    }
    .iocn {
      width: 40rpx;
      height: 40rpx;
      margin-left: 10rpx;
    }
  }
  .street {
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    background: #fff;
    margin-top: 20rpx;
    .text-area {
      box-sizing: border-box;
      min-height: 200rpx;
     

      padding: 0 30rpx;
    }
  }
  .footer {
   
    @include global-background-color2();
 
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    position: fixed;
    bottom: 30rpx;
    border: beige;
      width: 690rpx;
    height: 90rpx;
    border-radius: 20rpx;
    line-height: 90rpx;
  }
  .min-switch {
    font-size: 28rpx;
    padding: 24rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: 20rpx;
    font-weight: 400;
    color: #333333;
    .my-switch {
      display: block;
      position: relative;
      width: 80rpx;
      height: 32rpx;
      outline: 0;
      border-radius: 16rpx;
      box-sizing: border-box;
      background-color: #dfdfdf;
      transition: background-color 0.1s, border 0.1s;
      &:after {
        content: " ";
        position: absolute;
        top: -5rpx;
        left: -15rpx;
        width: 40rpx;
        height: 40rpx;
        border-radius: 20rpx;
        background: #ffffff;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
      }
    }
    .my-switch-on {
      @include global-background-color2();
      &:after {
        transform: translateX(61rpx);
      }
    }
  }
  .delete {
    display: flex;
    justify-content: flex-end;
    padding: 30rpx 24rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
  }
}
</style>
