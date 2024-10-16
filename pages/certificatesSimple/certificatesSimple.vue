<template>
  <view class="container_cer">
    <form report-submit="true" @submit="formSubmit">
		<view class="container_topView">
			<view class="container_top">
				<image src="https://oss.chuangliukeji.com/backstage/2024-07-29/e3312ae4001c41dfbf40ed39421dc582.png" class="top_image"></image>
				<view class="top_title">人脸实名认证</view>
				<view class="top_text">根据实名制下单要求，使用信用免押服务前你需要通过实名认证，并授权如下信息</view>
			</view>
			<view class="container_form">
				<view class="form_top">
					<image src="https://oss.chuangliukeji.com/backstage/2024-07-29/cc794b31b8824ff7a577ca48458027a5.png" class="form_top_image"></image>
					<text>姓名和身份证号需与当前支付宝实名认证信息一致</text>
				</view>
				<view class="form-item-view">
					<view class="view-title">您的姓名</view>
					<input
					  class="form-item-input"
					  placeholder="请输入姓名"
					  name="userName"
					/>
				</view>
				<view class="form-item-view borderRa">
					<view class="view-title">您的身份证</view>
					<input
					  class="form-item-input"
					  placeholder="请输入身份证号码"
					  name="idCard"
					/>
				</view>
				
				<button form-type="submit" class="bottom-button">进入人脸认证</button>
			</view>
		</view>
    </form>
  </view>
</template>

<script>
import { shareConfigObj } from "../../utils/constant"
import { loginHandler, saveUserId, getZWZUserDetail } from "../../utils/index"

export default {
  data() {
    return {
      frontUrl: null,
      backUrl: null,
      identityData: {
        idCardNo: "",
        limitDate: "",
        userName: "",
      },
      codeKey: "",
      codeTime: "",
      count: 0,
      telephone: "",
    }
  },

  onLoad(e) {
    // this.fromPage = e.from
  },

  onShareAppMessage() { // 禁止分享当前页面，避免提交后点击回退按钮没有反应
    return shareConfigObj
  },

  methods: {
	async isSubmit(e) {
		// 支付宝本人判断
		return new Promise((resolve, reject) => {
			const { userName, idCard, mobile } = e.detail.value;
			my.getAuthCode({
			  scopes: 'id_verify',
			  success: (res) => {
			    const { authCode } = res
			    if (!authCode) {
			      uni.showToast({
			        title: "获取授权码失败",
			      })
				  uni.hideLoading()
			      reject(false)
			    }
				const postData = {
					'code': authCode,
					idCard: idCard,
					telephone: getZWZUserDetail()?.telephone,
					userName,
					uid: this.$getUid(),
				}
				this.$request(
				  '/hzsx/userCertification/aliPayUserInfo',
				  postData,
				  "POST",
				).then(res => {
					uni.hideLoading()
					resolve(true)
				})
				.catch(rej => {
					uni.hideLoading()
				})
			  },
			  fail:(rej) => {
			  	uni.showToast({
			  	  title: "请同意授权~",
			  	})
				uni.hideLoading()
			  	reject(false)
			  }
			})
		})
	},
	// 处理最后一位为x状况
	formatIDNumber(idNumber) {
	    if (idNumber.slice(-1) === 'x') {
	        return idNumber.slice(0, -1) + 'X';
	    } else {
	        return idNumber;
	    }
	},
    formSubmit: async function (e) {
	  uni.showLoading({
	  	title: '加载中',
	  	mask: true
	  });
      const { userName, idCard } = e.detail.value
      if (!userName) {
		uni.hideLoading()
        uni.showToast({ title: "身份信息有误，请检查后重新上传" })
        return
      }
      if (!idCard || idCard.length !== 18) {
		uni.hideLoading()
        uni.showToast({ title: "身份信息有误，请检查后重新上传" })
        return
      }
	  //
	  // uni.showLoading({
	  // 	title: '加载中',
	  // 	mask: true
	  // });
	  const resss = await this.isSubmit(e);
	  console.log("dasda",resss);
	  if(!resss){
	  	return
	  }
	  uni.showLoading({
	  	title: '加载中',
	  	mask: true
	  });
	  const newIdCard = this.formatIDNumber(idCard);
      this.$request("hzsx/userCertification/userCertificationAuth", {
        userName,
        idCard: newIdCard,
		telephone: getZWZUserDetail()?.telephone,
        uid: this.$getUid(),
      },"post").then(res => {
		uni.hideLoading()
        const newUid = res.data // 用户新的uid
        if (newUid) { // 更新uid，多平台渠道的话可以进行用户整合
          saveUserId(newUid) // 注意这里只更新了localStorage中单独的uid数据，并没有更新localStorage中userDetail里面的uid，所以在取uid的时候最好使用单独的uid字段
        }
        loginHandler(true, {}, null, true, false) // 实名认证后调用登录接口获取用户最新的信息然后保存到localStorage，避免实名认证后除非重新登录了否则获取不到身份证姓名的情况
        this.$eventEmitter.emit("refreshShiminRenZhengStatus") // 通知我的页面重新判断一下实名认证状态
        this.$eventEmitter.emit("refreshMyPageConfigData") // 通知我的页面重新拉取一下订单，以防止在其它平台下了单，实名认证回到我的页面订单气泡还是没变
		if(res.responseType === 'SUCCESS') {
			console.log("emit>>>>>>>>>>>>>>>");
			// uni.$emit('isSubmit',true);
			// uni.navigateBack({
			// 	delta: 1,
			// 	success() {
			// 		uni.$emit('isSubmit',true);
			// 	}
			// })
			
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2];
			prevPage.setData({
				isSimple: 1
			})
			uni.navigateBack({
				delta: 1
			})
		}
	  })
    },
  },
}
</script>

<style lang="scss">
	view {
		box-sizing: border-box;
	}
.container_cer {
  @include wh(100%, 100vh);
  background: #f5f5f5;
  font-family: PingFangSC-Regular;
  padding-top: 1rpx;
  .header-view {
    height: 20rpx;
    background: #f3f4f9;
  }
  
  .container_topView {
	  margin-top: 24rpx;
	  position: relative;
	  .container_top {
	  	  width: calc(100% - 48rpx);
	  	  height: 532rpx;
	  	  @include global-background-color2();
	  	  margin-left: 24rpx;
	  	  border-radius: 24rpx;
		  .top_image{
			  width: 258rpx;
			  height: 258rpx;
			  margin: 64rpx 0 0 222rpx;
		  }
		  .top_title {
			  width: 100%;
			  text-align: center;
			  font-weight: 400;
			  font-size: 36rpx;
			  color: #FFFFFF;
			  line-height: 60rpx;
		  }
		  .top_text {
			  width: 100%;
			  padding: 0 56rpx;
			  font-weight: 400;
			  font-size: 24rpx;
			  color: #eeeeee;
			  line-height: 32rpx;
			  text-align: center;
		  }
	  }
	  .container_form{
		  width: calc(100% - 96rpx);
		  height: 264rpx;
		  border-radius: 24rpx;
		  background-color: #ffffff;
		  margin-left: 48rpx;
		  position: absolute;
		  top: 484rpx;
		  left: 0;
		  .form_top {
			  width: 100%;
			  height: 80rpx;
			  border-radius: 24rpx 24rpx 0 0;
			  background: rgba(22,119,255,0.11);
			  font-size: 24rpx;
			  display: flex;
			  align-items: center;
			  padding-left: 24rpx;
			  @include global-color2();
			  .form_top_image {
				  width: 32rpx;
				  height: 32rpx;
				  margin-right: 4rpx;
			  }
		  }
		  .form-item-view{
			  height: 92rpx;
			  width: 100%;
			  box-sizing: border-box;
			  background-color: #fff;
			  display: flex;
			  // justify-content: space-between;
			  align-items: center;
			  color: #333333;
			  font-weight: 500;
			  font-size: 28rpx;
			  padding: 20rpx 0;
			  padding-left: 24rpx;
			  .view-title {
				width: 150rpx;
				margin-right: 10rpx
			  }
			  .form-item-input {
				  // color: #cccccc;
				  font-size: 28rpx;
			  }
		  }
		  .borderRa {
			  border-radius: 0 0 24rpx 24rpx;
		  }
		  .bottom-button {
		    width: 650rpx;
		    height: 98rpx;
		    @include global-background-color2();
		    border-radius: 49rpx;
		    font-family: PingFangSC-Regular;
		    font-size: 34rpx;
		    color: #ffffff;
		    text-align: center;
		    letter-spacing: 0;
		    line-height: 98rpx;
		    font-weight: 700;
		    margin: 0 auto;
		    margin-top: 144rpx;
		  
		  }
	  }
  }
  
  
  .realName-page {
    @include wh(100%, 100%);

    .contents {
      .brb {
        border-bottom: 1rpx rgba(240, 240, 240, 1) solid;
      }
      .mt20 {
        margin: 20rpx 0 0 0;
      }

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
      }
      &-item {
        height: 100rpx;
        .phone-btn {
          color: #fc766b;
          font-family: PingFangSC-Regular;
          border: none;
          font-size: 30rpx;
          height: 45rpx;
          width: 200rpx;
          line-height: 45rpx;
        }
        .contents-item-input,
        .contents-item-inputs {
          text-align: right;
          padding-left: 0;
        }
        .contents-item-inner-input {
          padding-left: 0;
        }
        box-sizing: border-box;
        background-color: #fff;

        font-family: PingFangSC-Regular;
        color: #333333;
        font-size: 30rpx;
        padding: 0 30rpx;

        &-input {
          text-align: left;
          font-size: 30rpx;
          width: calc(100% - 200rpx);
        }
        &-inputs {
          text-align: left;
          font-size: 30rpx;
          width: calc(100% - 255rpx);
        }
        &-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-input {
            text-align: left;
            font-size: 30rpx;
            width: 280rpx;
          }
          &-image {
            height: 64rpx;
            width: 160rpx;
          }
          &-small {
            color: #fc766b;
            font-size: 28rpx;
          }
        }
      }
    }
    .forget {
      text-align: right;
      padding: 30rpx;
      font-family: PingFangSC-Regular;
      color: #666666;
      font-size: 26rpx;
      &-text {
        color: #fc766b;
      }
    }

    .bottom-view {
      background-color: #f3f4f9;
      box-sizing: border-box;
      padding: 304rpx 0 0 0;
      
      .bottom-tobutton {
        width: 650rpx;
        height: 98rpx;
        @include global-border(1px);
        border-radius: 49rpx;
        font-family: PingFangSC-Regular;
        font-size: 34rpx;
        color: #333333;
        text-align: center;
        letter-spacing: 0;
        line-height: 98rpx;
        font-weight: 500;
        margin: 0 auto;
background: #f5f5f5;
      }
    }

    .bottom-view {
      font-size: 28rpx;
      color: #999;
      text-align: center;
      &-text {
        color: #00a0ff;
      }
    }
    .header {
      background: #f3f4f9;
      font-family: PingFangSC-Regular;
      font-size: 24rpx;
      color: #999999;
      letter-spacing: 0;
      font-weight: 400;
      padding: 4rpx 0 4rpx 30rpx;
    }
  }
}
</style>
