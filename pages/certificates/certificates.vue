<template>
  <view class="container_cer">
    <view class="toOther" v-if="type">
      未找到身份证照片
      <view
        class="toOtherBtn"
        @click="$onTo('pages/certificatesNoPhoto/certificatesNoPhoto')"
        >稍后再补拍</view
      >
    </view>
    <view class="content">
      <view class="item" @click="update('1')">
        <view class="item-l">
          <view class="item-l-title">头像面</view>
          <view class="item-l-text">上传您的身份证头像面</view>
        </view>
        <view class="update update-fir">
          <view class="update-border">
            <image
              :src="frontUrl"
              class="update-img"
              mode="scaleToFill"
              v-if="frontUrl"
            ></image>
            <image
              v-else
              class="update-img"
              src="https://zuwuzu.oss-cn-shanghai.aliyuncs.com/certificate/man-front.png"
              mode="scaleToFill"
            ></image>
          </view>
        </view>
      </view>
      <view class="item" @click="update('2')">
        <view class="item-l">
          <view class="item-l-title">国徽面</view>
          <view class="item-l-text">上传您的身份证国徽面</view>
        </view>
        <view class="update update-sed">
          <view class="update-border">
            <image
              :src="backUrl"
              class="update-img"
              mode="scaleToFill"
              v-if="backUrl"
            ></image>
            <image
              v-else
              class="update-img"
              src="https://zuwuzu.oss-cn-shanghai.aliyuncs.com/certificate/man-back.png"
              mode="scaleToFill"
            ></image>
          </view>
        </view>
      </view>
	  <!-- <view class="item" @click="update('3')">
	    <view class="item-l">
	      <view class="item-l-title">人像照</view>
	      <view class="item-l-text">上传您的半身人像正脸照</view>
	    </view>
	    <view class="update update-fir">
	      <view class="update-border">
	        <image
	          :src="imageRz"
	          class="update-img"
	          mode="scaleToFill"
	          v-if="imageRz"
	        ></image>
	        <image
	          v-else
	          class="update-img"
	          src="https://oss.chuangliukeji.com/backstage/2023-05-05/6c23bcc513fc4bb3873a0f0c068a1f12.png"
	          mode="scaleToFill"
	        ></image>
	      </view>
	    </view>
	  </view> -->
    </view>
    <view class="header-view"></view>

    <form report-submit="true" @submit="formSubmit">
      <view class="realName-page">
        <view class="contents">
          <view class="contents-item">
            <view class="contents-item-view">
              <view>姓名</view>
              <input
                class="contents-item-input"
                placeholder="上传身份证后自动识别"
                disabled
                name="userName"
                :value="identityData.userName"
              />
            </view>
          </view>

          <view class="contents-item">
            <view class="contents-item-view">
              <view>身份证号</view>
              <input
                class="contents-item-input"
                placeholder="上传身份证后自动识别"
                name="idcard"
                disabled
                :value="identityData.idCardNo"
              />
            </view>
          </view>
          <view class="contents-item border-none">
            <view class="contents-item-view border-none">
              <view
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                }"
              >
                身份证到期日
                <image
                  src="https://zuwuzu.oss-cn-shanghai.aliyuncs.com/certificate/icon-wenhao.png"
                  :style="{
                    display: 'block',
                    width: '14px',
                    height: '14px',
                    marginLeft: '4px',
                  }"
                  @click="isVisible"
                ></image>
              </view>
              <input
                class="contents-item-inputs"
                placeholder="上传身份证后自动识别"
                name="limitDate"
                disabled
                :value="identityData.limitDate"
              />
            </view>
          </view>
		  
		  <view class="header-view"></view>
		  
		  <!-- 紧急联系人 -->
		  <view class="contents-view" v-for="(item, index) in improntInfo" :key="index">
			  <!-- 标题 -->
			  <view class="contents-item">
			    <view class="contents-item-view">
			      <view style="display: flex;">
			  		<view class="inputRults">*</view>
			  		紧急联系人{{index+1}}
			  	  </view>
				</view>
			  </view>
			  <!-- 关系 -->
			  <view class="contents-item">
			    <view class="contents-item-view">
			      <view class="inputLeftText">
			  		<view class="inputRults">*</view>
			  		关系
			  	</view>
			      <!-- contents-item-input -->
				  <view style="flex: 1;">
				  	<picker @change="bindPickerChange($event,index)" :value="item.userIndex" :range="array">
				  		<view>{{array[item.userIndex] || '请选择您与联系人关系'}}</view>
				  	</picker>
				  </view>
				  <image class="jiantouImg" src="../../static/my/jiantou.png"></image>
			    </view>
			  </view>
			  <!-- 姓名 -->
		  	<view class="contents-item">
		  	  <view class="contents-item-view">
		  	    <view class="inputLeftText">
					<view class="inputRults">*</view>
					姓名
				</view>
		  	    <input
		  	      class="contents-item-input text_left"
		  	      placeholder="请填写"
				  @input="umenPlus5_7(index)"
		  	      v-model="item.realname"
		  	    />
				<view class="contents-item-chooseInfo" @click="chooseInfo(index)">选择通讯录</view>
		  	  </view>
		  	</view>
			<!-- 手机号 -->
			<view class="contents-item">
			  <view class="contents-item-view">
			    <view class="inputLeftText">
					<view class="inputRults">*</view>
					手机号
				</view>
			    <input
			      class="contents-item-input text_left"
			      placeholder="请填写"
			      type="number"
			      name="mobile"
				  @input="umenPlus12_13(index)"
			      v-model="item.phone"
			    />
			  </view>
			</view>
			<!-- <view class="contents-item border-none" v-if="index === improntInfo.length - 1">
				<view class="contents-item-view border-none">
					<view class="add-Btn" @click="addImprontInfoList">
						<uni-icons type="plus-filled" size="18" color="#fb6501"></uni-icons>
						<view style="margin-left: 8rpx;">继续添加(有助于提高审核成功率)</view>
					</view>
					<view v-if="improntInfo.length > 2" class="del-Btn" @click="delImprontInfoList">删除</view>
				</view>
			</view> -->
			<!-- 占位空白 -->
			<view class="header-view"></view>
		  </view>

          <view v-if="!mobile" class="contents-item">
            <view class="contents-item-view">
              <input
                class="contents-item-input"
                placeholder="请输入手机号"
                type="number"
                name="mobile"
                style="text-align: left"
                v-model="mobile"
              />
			  <button class="contents-item-inner-small" open-type="getAuthorize" scope="phoneNumber" @getAuthorize="getTelephone">
			    手机号授权
			  </button>
            </view>
          </view>
          <!-- <view class="contents-item" :style="{ borderBottom: 0 }">
            <view class="contents-item-view">
              <view class="contents-item-inner" :style="{ flexGrow: 1 }">
                <input
                  class="contents-item-inner-input"
                  placeholder="请输入短信验证码"
                  type="number"
				  @input="umenPlus10"
                  name="smsCode"
                />
                <view v-if="count" class="contents-item-inner-small">
                  {{ count }}S
                </view>
                <view class="contents-item-inner-small" v-else @click="getCode">
                  获取验证码
                </view>
              </view>
            </view>
          </view> -->
		  <!-- <view class="contents-item border-none">
		    <view class="contents-item-view border-none">
		      <input
		        class="contents-item-input"
		        placeholder="请输入电子邮箱(选填)"
		        type="text"
		        name="email"
		        style="text-align: left"
		        @input="handleMobileEmail"
		        v-model="email"
		      />
		    </view>
		  </view> -->
        </view>
        <view class="header-view"></view>
        <view class="header">温馨提示：</view>
        <view class="header"
          >请上传本人身份证照片，非本人信息无法通过审核。</view
        >
        <view class="header">确保证件边框完整，文字清晰可见；</view>
        <view class="header">可现场拍摄或从手机相册获取。</view>
        <view class="bottom-view">
          <!-- class={checked ? "bottom-button" : "bottom-button disabled"} -->
          <button form-type="submit" class="bottom-button">提交</button>
        </view>
      </view>
    </form>
    <cmd-curtain :visible="visible" mode="top-right">
      <image
        mode="scaleToFill"
        src="https://booleandata-zuwuzu.oss-cn-beijing.aliyuncs.com/ip12/shenfen1.png"
        style="width: 100%; height: 250px"
      ></image>
    </cmd-curtain>
  </view>
</template>

<script>
import { errHandler, saveUserId, loginHandler, checkHasPhone, getZWZUserDetail } from "../../utils/index";
import cmdCurtain from "@/components/cmd-curtain/cmd-curtain.vue";
import { shareConfigObj } from "../../utils/constant";

export default {
  data() {
    return {
      frontUrl: null,
	  frontUrlWz: null,
      backUrl: null,
	  backUrlWz: null,
	  imageRz:'1',
	  imageWz:'1',
      identityData: {
        idCardNo: "",
        limitDate: "",
        userName: "",
      },
      count: 0,
      mobile: "",
	  email:'',
      visible: false,
      smsApiRes: {}, // 获取短信接口所返回的数据
      type: false,
	  urlClass:'hzsx/userCertification/userCertificationAuth',//提交地址
	  array:['父母','子女','兄弟','姐妹','亲戚','朋友','配偶','同事'],
	  improntInfo:[]
	  // improntInfo:[{//紧急联系人信息
		 //  realname:'',
		 //  phone:'',
		 //  userIndex:'',
	  // },{
		 //  realname:'',
		 //  phone:'',
		 //  userIndex:'',
	  // }]
    };
  },

  onLoad(e) {
    if (e.type === "my") this.type = false;
	if(e.class) this.urlClass = 'hzsx/userCertification/userCertificationUpdate';
	if(checkHasPhone()){
		this.mobile = getZWZUserDetail()?.telephone || ''
	}
	console.log("this.mobile",this.mobile);
  },

  onShareAppMessage() {
    // 禁止分享当前页面，避免提交后点击回退按钮没有反应
    return shareConfigObj;
  },

  components: { cmdCurtain },
  methods: {
	async isSubmit(e) {
		// 支付宝本人判断
		return new Promise((resolve, reject) => {
			const { userName, idcard, mobile } = e.detail.value;
			my.getAuthCode({
			  scopes: 'id_verify',
			  success: (res) => {
			    const { authCode } = res
			    if (!authCode) {
			      uni.showToast({
			        title: "获取授权码失败",
			      })
			      reject(false)
			    }
				const postData = {
					'code': authCode,
					idCard: idcard,
					telephone: mobile,
					userName,
					uid: this.$getUid(),
				}
				this.$request(
				  '/hzsx/userCertification/aliPayUserInfo',
				  postData,
				  "POST",
				).then(res => {
					resolve(true)
				})
			  },
			  fail:(rej) => {
			  	uni.showToast({
			  	  title: "请同意授权~",
			  	})
			  	reject(false)
			  }
			})
		})
	},
	// 获取手机号授权
	getTelephone() {
		my.getPhoneNumber({
			success: (res) => {
				let encryptedData = res.response;
				this.sucHandler(encryptedData);
			},
			fail: (err) => {
				uni.showModal({
					title: '提示',
					content: '若点击不授权，将会影响订单审核',
					cancelText: '不授权',
					cancelColor: '#999',
					confirmText: '授权',
					confirmColor: '#FFCB31',
					success(res) {
						if (res.confirm) {
							// 选择弹框内授权
							uni.openSetting({
								success(res) {
									console.log(res.authSetting)
								}
							})
						} else if (res.cancel) {
							// 选择弹框内 不授权
							console.log('用户点击不授权')
						}
					}
				})
			},
		});
	},
	//获取到用户的手机号码
	sucHandler(encryString) {
		const _this = this;
		_this.$request(
			"hzsx/api/components/decrypt", {
				content: encryString
			},
			"get",
			true
		).then((res) => {
			let resObj = JSON.parse(res.data);
			if (resObj.code === "10000") {
				let obj = {
					telephone: resObj.mobile,
				};
				function fun() {
					_this.mobile = getZWZUserDetail()?.telephone || ''
				};
				loginHandler(true, obj, fun(), true);
			}
		});
	},
	// 提交
    async formSubmit(e) {
      const { userName, idcard, mobile, smsCode, limitDate } = e.detail.value;
	  const improntInfo = this.improntInfo;//紧急联系人信息数组
	  let message = '';
	  improntInfo.map((item,index)=>{
		  item.status = this.array[item.userIndex]
		  if (!/^1(\d){10}$/.test(item.phone + "")) {
			message = '请正确输入紧急人手机';
		  }
		  if (!item.status){
			message = '请选择您与紧急人关系';
		  }
		  if (!item.realname){
			message = '请填写真实紧急人姓名';
		  }
	  })
	  console.log("improntInfo",improntInfo);
	  if(message) {
		uni.showToast({ title: message });
		return;
	  }
      if (!userName) {
        uni.showToast({ title: "身份信息有误，请检查后重新上传" });
        return;
      }
      if (!limitDate) {
        uni.showToast({ title: "身份信息有误，请检查后重新上传" });
        return;
      }
      if (!idcard || idcard.length !== 18) {
        uni.showToast({ title: "身份信息有误，请检查后重新上传" });
        return;
      }
	  this.mobile = getZWZUserDetail()?.telephone || ''
	  if(!this.mobile) {
		  uni.showToast({ title: "请授权手机号" });
		  return;
	  }
      // if (!mobile || mobile.length !== 11) {
      //   uni.showToast({ title: "请输入正确的手机号" });
      //   return;
      // }
      // if (!smsCode) {
      //   uni.showToast({ title: "请输入短信验证码" });
      //   return;
      // }
	  // if (this.imageRz == null){
		 //  uni.showToast({title: "请上传上半身人像照"});
		 //  return;
	  // }
	  // var reg =/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
	  // if(this.email && !reg.test(this.email)){
	  // 	uni.showToast({
	  // 			title:"邮箱格式不正确",
	  // 			icon:"none"
	  // 	});
	  // 	return;
	  // }
	  // 
	  const res = await this.isSubmit(e);
	  console.log("dasda",res);
	  if(!res){
		  return
	  }
	  // 
      const postObj = this.email ? {
        uid: this.$getUid(),
        userName,
        idCard: idcard,
        telephone: this.mobile,
        // codeKey: this.smsApiRes?.codeKey,
        // smsCode,
        // codeTime: this.smsApiRes?.codeTime,
		email: this.email,
        idCardFrontUrl: this.frontUrl,
		idCardFrontUrlWz: this.frontUrlWz,
        idCardBackUrl: this.backUrl,
		idCardBackUrlWz: this.backUrlWz,
		images:this.imageRz,
		imagesWz:this.imageWz,
        limitDate,
        ...this.identityData,
		// userContactsInfoDtoList:improntInfo
      } : {
        uid: this.$getUid(),
        userName,
        idCard: idcard,
        telephone: this.mobile,
        // codeKey: this.smsApiRes?.codeKey,
        // smsCode,
        // codeTime: this.smsApiRes?.codeTime,
        idCardFrontUrl: this.frontUrl,
		idCardFrontUrlWz: this.frontUrlWz,
        idCardBackUrl: this.backUrl,
		idCardBackUrlWz: this.backUrlWz,
		images:this.imageRz,
		imagesWz:this.imageWz,
        limitDate,
        ...this.identityData,
		// userContactsInfoDtoList:improntInfo
      };
	  console.log("postObj",postObj);
      const { postData, pass } = this.$postDataGuard(postObj);
      if (!pass) return;
      if (this.submiting) return;
      this.submiting = true;
	  const url = this.urlClass;
      this.$request(
        url,
        postData,
        "POST",
        false,
        true
      )
        .then((res) => {
          const newUid = res.data; // 用户新的uid
          if (newUid) {
            // 更新uid，多平台渠道的话可以进行用户整合
            saveUserId(newUid); // 注意这里只更新了localStorage中单独的uid数据，并没有更新localStorage中userDetail里面的uid，所以在取uid的时候最好使用单独的uid字段
          }
          loginHandler(true, {}, null, true, false); // 调用接口重新保存我的信息，防止某些功能取身份证姓名一直获取不到，需要重新登录才行，注：该方法具有覆盖uid的副作用
          this.$eventEmitter.emit("refreshShiminRenZhengStatus"); // 通知我的页面重新判断一下实名认证状态
          this.$eventEmitter.emit("refreshMyPageConfigData"); // 通知我的页面重新拉取一下订单，以防止在其它平台下了单，实名认证回到我的页面订单气泡还是没变
          uni.navigateBack();
        })
        .finally(() => {
          this.submiting = false;
        });
    },
    handleMobile(e) {
		this.mobile = e.detail.value;
		if (e.detail.value.length == 1) {
		  this.$uma.trackEvent('8',{ path: '点击手机号' });
		}
    },
	handleMobileEmail(e) {
		this.email = e.detail.value;
		if (e.detail.value.length == 1) {
		  this.$uma.trackEvent('11',{ path: '点击电子邮箱' });
		}
	},
	// 选择通讯录联系人
	chooseInfo(index) {
		my.choosePhoneContact({
		    success: (res) => {
				let userInfo = this.improntInfo;
				userInfo[index].realname = res.name;
				const regex = /\d+/g;
				userInfo[index].phone = res.mobile.match(regex).join('');
				this.improntInfo = userInfo;
		    },
		    fail: (err) => {
				
		    },
		});
		if(index === 0){
			this.$uma.trackEvent('14',{ path: '点击联系人通讯录1' });
		}
		if(index === 1){
			this.$uma.trackEvent('15',{ path: '点击联系人通讯录2' });
		}
	},
	/**
	 * 友盟接口-记录点击填写联系人
	 * @param {Object} index 联系人的数组索引，0，1，2
	 */
	umenPlus5_7(index){
		if(index === 0){
			this.$uma.trackEvent('5',{ path: '点击联系人1姓名' });
		}
		if(index === 1){
			this.$uma.trackEvent('7',{ path: '点击联系人2姓名' });
		}
	},
	umenPlus12_13(index){
		if(index === 0){
			this.$uma.trackEvent('12',{ path: '点击联系人1手机号' });
		}
		if(index === 1){
			this.$uma.trackEvent('13',{ path: '点击联系人2手机号' });
		}
	},
	umenPlus10(e){
		if (e.detail.value.length == 1) {
		  this.$uma.trackEvent('10',{ path: '点击填写验证码' });
		}
	},
	// 选着关系
	bindPickerChange(e,index) {
		if(index === 0){
			this.$uma.trackEvent('4',{ path: '点击联系人1关系' });
		}
		if(index === 1){
			this.$uma.trackEvent('6',{ path: '点击联系人2关系' });
		}
		let userInfo = this.improntInfo;
		userInfo[index].userIndex = e.detail.value;
		this.improntInfo = userInfo;
	},
	// 继续添加联系人关系
	addImprontInfoList(){
		let improntInfo = this.improntInfo;
		improntInfo.push({
		  realname:'',
		  phone:'',
		  userIndex:'',
		});
		this.improntInfo = improntInfo;
	},
	// 删除添加联系人该项
	delImprontInfoList(){
		let improntInfo = this.improntInfo;
		this.improntInfo = improntInfo.slice(0,-1);
	},
    //打开到期身份证示意图
    isVisible() {
      this.visible = !this.visible;
    },
    //发送验证码
    getCode() {
      //校验手机号
      if (!/^1(\d){10}$/.test(this.mobile + "")) {
        uni.showToast({ title: "请正确输入手机号" });
        return;
      }
	  this.$uma.trackEvent('9',{ path: '点击获取验证码' });
      this.$request(
        "hzsx/userCertification/sendSmsCode",
        { mobile: this.mobile },
        "get",
        true
      ).then((res) => {
        this.smsApiRes = res.data || {}; // 提交身份证信息的时候需要用到验证码数据
        let count = 59;
        this.count = count;
        this.interval = setInterval(() => {
          count -= 1;
          this.count = count;
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
        uni.showToast({ title: "验证码已发送，5分钟内有效" });
      });
    },
    /**
     * 上传身份证号
     * @param val:1表示正面，2表示反面
     */
    update(val) {
      if (val === "1") {
		this.$uma.trackEvent('3',{ path: '点击身份证上传' });
        my.chooseImage({
          count: 1, //只能上传选择一张
          sizeType: ["compressed"],
          success: (res) => {
            // const { tempFilePaths } = res
            const tempFilePaths = res.apFilePaths;
            if (
              Object.prototype.toString.call(tempFilePaths) !== "[object Array]"
            ) {
              errHandler("请重新选择图片", true);
              return;
            }
            const fileUploadPromises = tempFilePaths.map((tempFileUrl) =>
              this.$fileUploadHandler(tempFileUrl)
            );
			const fileUploadPromisesWz = tempFilePaths.map((tempFileUrl) =>
			  this.$fileUploadHandlerWz(tempFileUrl)
			);
            Promise.all(fileUploadPromises).then((imgUrls) => {
              // 图片上传成功
              this.frontUrl = imgUrls[0];
              if (this.frontUrl && this.backUrl) {
                //调用OCR识别逻辑
                this.$request(
                  "hzsx/userCertification/certificationOcr",
                  {
                    frontUrl: this.frontUrl,
                    backUrl: this.backUrl,
                    uid: this.$getUid(),
                  },
                  "post"
                )
                  .then((res) => {
                    this.identityData = res.data;
                  })
                  .catch((err) => {
                    this.frontUrl = null;
                    this.backUrl = null;
                  });
              }
            });
			Promise.all(fileUploadPromisesWz).then((imgUrls) => {
			  // 图片上传成功--保存网络图片
			  this.frontUrlWz = imgUrls[0];
			});
          },
        });
      }
      if (val === "2") {
        my.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          success: (res) => {
            // const { tempFilePaths } = res
            const tempFilePaths = res.apFilePaths;
            if (
              Object.prototype.toString.call(tempFilePaths) !== "[object Array]"
            ) {
              errHandler("请重新选择图片", true);
              return;
            }
            const fileUploadPromises = tempFilePaths.map((tempFileUrl) =>
              this.$fileUploadHandler(tempFileUrl)
            );
			const fileUploadPromisesWz = tempFilePaths.map((tempFileUrl) =>
			  this.$fileUploadHandlerWz(tempFileUrl)
			);
            Promise.all(fileUploadPromises).then((imgUrls) => {
              // 图片上传成功
              this.backUrl = imgUrls[0];
			  // this.identityData = {
				 //  'idCardNo': "411526199901235114",
				 //  'limitDate': "2026-04-11",
				 //  'userName': "陈代奎",
			  // }
              if (this.frontUrl && this.backUrl) {
                //调用OCR识别逻辑
                this.$request(
                  "hzsx/userCertification/certificationOcr",
                  {
                    frontUrl: this.frontUrl,
                    backUrl: this.backUrl,
                    uid: this.$getUid(),
                  },
                  "post"
                )
                  .then((res) => {
                    this.identityData = res.data;
                  })
                  .catch((err) => {
                    this.frontUrl = null;
                    this.backUrl = null;
                  });
              }
            });
			Promise.all(fileUploadPromisesWz).then((imgUrls) => {
			  // 图片上传成功--保存网络图片
			  this.backUrlWz = imgUrls[0];
			});
          },
        });
      }
	  if (val === "3") {
	    my.chooseImage({
	      count: 1, //只能上传选择一张
	      sizeType: ["compressed"],
	      success: (res) => {
	        // const { tempFilePaths } = res
	        const tempFilePaths = res.apFilePaths;
	        if (
	          Object.prototype.toString.call(tempFilePaths) !== "[object Array]"
	        ) {
	          errHandler("请重新选择图片", true);
	          return;
	        }
	        const fileUploadPromises = tempFilePaths.map((tempFileUrl) =>
	          this.$fileUploadHandler(tempFileUrl)
	        );
			const fileUploadPromisesWz = tempFilePaths.map((tempFileUrl) =>
			  this.$fileUploadHandlerWz(tempFileUrl)
			);
			Promise.all(fileUploadPromises).then((imgUrls) => {
			  // 图片上传成功--保存网络图片
			  this.imageRz = imgUrls[0];
			});
			Promise.all(fileUploadPromisesWz).then((imgUrls) => {
			  // 图片上传成功--保存wz网络图片
			  this.imageWz = imgUrls[0];
			});
	      },
	    });
	  }
    },
  },
};
</script>

<style lang="scss">
.container_cer {
  @include wh(100%, 100vh);
  background: #f5f5f5;
  font-family: PingFangSC-Regular;
  padding-top: 1rpx;
  .header-view {
    height: 20rpx;
    background: #f3f4f9;
  }
  .header_chooseInfo {
	  font-size: 28rpx;
	  padding: 20rpx 30rpx;
	  text-align: right;
	  color: #fc766b;
  }
  .toOther {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 30rpx;
    width: 750rpx;
    height: 100rpx;
    @include global-background-color2();
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 400;
    margin-bottom: 20rpx;
    .toOtherBtn {
      width: 150rpx;
      height: 50rpx;
      border-radius: 49rpx;
      background: #1f2129;
      box-shadow: 0px 2px 4px 0px rgba(252, 73, 93, 0.5);
      font-size: 24rpx;
      @include global-color2();
      font-weight: 400;
      line-height: 50rpx;
      text-align: center;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: #fff;
    box-sizing: border-box;
    padding: 20rpx 0;
    border-radius: 20rpx;
    .item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      position: relative;
      background: #f7f8fa;
      border-radius: 10rpx;
      width: 691rpx;
      height: 307rpx;
      margin: 10rpx auto;
      box-sizing: border-box;
      padding: 30rpx 34rpx;
      .item-l {
        .item-l-title {
          font-family: PingFangSC-Medium;
          font-size: 38rpx;
          color: #333333;
          font-weight: bold;
          margin-bottom: 10rpx;
        }
        .item-l-text {
          font-family: PingFangSC-Regular;
          font-size: 24rpx;
          color: #586e98;
          font-weight: 400;
        }
      }

      .update {
        @include wh(370rpx, 243rpx);
        background: #e0f0ff;
        display: flex;
        align-items: center;
        justify-content: center;
        .update-border {
          width: 336rpx;
          height: 218rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url("https://zuwuzu.oss-cn-shanghai.aliyuncs.com/certificate/man-bg.png")
            no-repeat;
          background-size: 100% 100%;
        }
      }
      .update-img {
        @include wh(322rpx, 204rpx);
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
      .imgss {
        width: 22rpx;
        height: 22rpx;
      }
	  .border-none{
		  border: none;
	  }
	  .text_left {
		  text-align: left !important;
		  flex: 1;
	  }
	  .jiantouImg{
		  width: 11rpx;
		  height: 19rpx;
	  }
	  .contents-item{
		  border: 1rpx solid #f5f5f5;
	  }
	  .contents-item-chooseInfo {
		  color: #fc766b;
		  font-size: 28rpx;
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
		.add-Btn{
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #fb6501;
		}
		.del-Btn{
			font-size: 24rpx;
			color: #fb6501;
		}
		.inputLeftText {
			width: 150rpx;
			display: flex;
		}
		.inputRults {
		  color: #fc766b;
		  margin-right: 4rpx;
		}
        .phone-btn {
          color: #fc766b;
          font-family: PingFangSC-Regular;
          border: none;
          font-size: 30rpx;
          height: 45rpx;
          width: 200rpx;
          line-height: 45rpx;
        }
		.contents-item-inner-small {
			border: none;
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
          width: calc(100% - 350rpx);
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
    .xieyi {
      margin: 60rpx 30rpx 20rpx 30rpx;
      font-size: 24rpx;
      color: #999;
      .libs {
        display: flex;

        margin: 0 auto;
        justify-content: center;
        .img {
          @include wh(25rpx, 25rpx);
          margin: 2rpx 5rpx 0 0;
        }
      }
      .checkbox-text {
        .text {
          color: #c43737;
        }
      }
    }
    .bottom-view {
      background-color: #f3f4f9;
      box-sizing: border-box;
      padding: 80rpx 0 30rpx 0;
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
    }
    .disabled {
      background-color: #c43737;
      opacity: 0.64;
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
