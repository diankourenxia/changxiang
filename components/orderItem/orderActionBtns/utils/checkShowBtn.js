/**
 * 这个文件会放一些判断订单状态等逻辑，可用来复用判断按钮是否显示
 */
import {
	待付款,
	待发货,
	待收货,
	租用中,
	待结算,
	已关闭,
	已完成,
	结算待支付,
	待审核,
	等待审核,
	待审核中,
	审核拒绝
} from "../../../../utils/constant.js"


const MAX_SHOW_BTNS = 4 // 最多显示的按钮数量

// 获取到当前订单的状态
const getOrderStatus = orderObj => orderObj && orderObj.status

// 获取到当前订单签署状态 1//签署  0//未签署
const getOrderIsEqb = orderObj => orderObj && orderObj.isEqb

// 获取到当前订单的订单ID
export const getOrderId = orderObj => orderObj && orderObj.orderId

// 判断当前订单是否已经刷过脸
export const orderHasShuaLian = orderObj => orderObj && orderObj.faceAuthStatus == "03"

// 判断订单已经到期
export const checkOrderHasDaoQi = orderObj => orderObj && orderObj.showReletButton

/**
 * 判断订单是否待付款
 * @param {Object} orderVo : 订单对象
 */
export const checkOrderNeedPay = orderVo => {
	return getOrderStatus(orderVo) === 待付款
}

/**
 * 判断订单是否待发货
 * @param {Object} orderVo : 订单对象
 */
export const checkOrderNeedFahuo = orderVo => {
	return getOrderStatus(orderVo) === 待发货
}

/**
 * 判断订单是否待收货
 * @param {Object} orderVo : 订单对象
 */
export const checkOrderNeedShouhuo = orderVo => {
	return getOrderStatus(orderVo) === 待收货
}

/**
 * 判断订单是否待审核
 * @param {*} orderVo 
 * @returns 
 */
export const checkOrderNeedShenhe = orderVo => {
	return getOrderStatus(orderVo) === 待审核 || getOrderStatus(orderVo) === 等待审核 || getOrderStatus(orderVo) === 待审核中
}

/**
 * 判断订单是否审核拒绝
 * @param {*} orderVo 
 * @returns 
 */
export const checkOrderNeedShenheJuJue = orderVo => {
	return getOrderStatus(orderVo) === 审核拒绝
}

/**
 * 判断订单是否租用中
 * @param {Object} orderVo : 订单对象
 */
// 逾期的订单一定是租用中的
export const checkOrderRenting = (orderVo, usedInList = true) => {
	// if (checkOrderOverdue(orderVo, usedInList)) { // 表明订单是逾期的
	//   return false
	// }
	return getOrderStatus(orderVo) === 租用中
}
/**
 * 判断订单是否为签署订单
 * @param {Object} orderVo : 订单对象
 */
export const checkIsEqb = (orderVo, usedInList = true) => {
	console.log("2", getOrderIsEqb(orderVo));
	console.log("4", orderVo);
	return getOrderIsEqb(orderVo) == '0'
}

/**
 * 判断订单是否待结算
 * @param {Object} orderVo : 订单对象
 */
export const checkOrderSettle = orderVo => {
	return getOrderStatus(orderVo) === 待结算
}

/**
 * 判断订单是否处于结算待支付状态
 * @param {*} orderVo 
 * @returns 
 */
export const checkOrderSettleNeedPay = orderVo => {
	return getOrderStatus(orderVo) === 结算待支付
}

/**
 * 判断订单是否已逾期
 * @param {Object} orderVo : 订单对象
 */
export const checkOrderOverdue = (orderVo, usedInList = true) => {
	const key = usedInList ? "violationStatus" : "isViolation"
	return orderVo && orderVo[key] && orderVo[key] != "01"
}

/**
 * 判断订单是否已关闭
 * @param {Object} orderVo : 订单对象
 */
export const checkOrderHasClose = orderVo => {
	return getOrderStatus(orderVo) === 已关闭
}

/**
 * 判断订单是否完成
 * @param {Object} orderVo : 订单对象
 */
export const checkOrderHasDone = orderVo => {
	return getOrderStatus(orderVo) === 已完成
}

/**
 * 判断按钮是否显示在省略号里面
 */
export const isShowInMore = orderVo => {

}

/**
 * 确定按钮位置的工具方法，从右往左，从0开始计数表示位置
 * LOG: ----!!!! 下面每一个方法，第一个参数均表示订单对象，第二个参数均表示是否使用在订单列表页面 !!!!-----
 */
export const checkPosition = {
	/**
	 * 查看物流按钮
	 * @param {*} orderObj : 订单对象VO  ===蚂蚁链
	 * @param {bool} usedInList : 是否使用在订单列表页面
	 */
	// chakanwuliu: function(orderObj, usedInList = true) {
	// 	if (checkOrderNeedShouhuo(orderObj)) return 2
	// 	if (checkOrderRenting(orderObj, usedInList) && !usedInList) { // 租用中 且 使用在订单详情页面
	// 		const original = 5
	// 		let step = 0
	// 		if (this.xuzu(orderObj, usedInList) == undefined) step += 1 // 续租不展示，那么前进1步
	// 		if (this.maiduan(orderObj, usedInList) == undefined) step += 1 // 买断不展示，那么前进1位
	// 		if (this.guihuan(orderObj, usedInList) == undefined) step += 1 // 归还不展示，那么前进1位
	// 		return original - step
	// 	}
	// 	if (checkOrderSettle(orderObj) && !usedInList) return 1
	// 	if (checkOrderSettleNeedPay(orderObj) && !usedInList) return 3
	// 	// if (checkOrderOverdue(orderObj, usedInList) && !usedInList) {
	// 	//   let base = 4
	// 	//   if (this.guihuan(orderObj, usedInList) == undefined) base-- // 归还不显示，那么向前进一位
	// 	//   if (this.maiduan(orderObj, usedInList) == undefined) base-- // 买断不显示，向前进一位
	// 	//   return base
	// 	// }
	// 	if (checkOrderHasDone(orderObj) && !usedInList) return 3
	// },
	/**
	 * 查看物流按钮    ===  通联代扣
	 * @param {*} orderObj : 订单对象VO
	 * @param {bool} usedInList : 是否使用在订单列表页面
	 */
	chakanwuliu: function(orderObj, usedInList = true, orderDeatil) {
		if (checkOrderNeedShouhuo(orderObj)) {
			if (usedInList) { // 使用在订单列表页面
				return 2
			} else {
				console.log("orderDeatil.userOrdersDto.tlStatus",orderDeatil);
				if (orderDeatil && orderDeatil.userOrdersDto.tlStatus !== '1') { //重新签约代扣则详情不显示查看物流
					return 2
				}
			}
		}
		if (checkOrderRenting(orderObj, usedInList) && !usedInList) { // 租用中 且 使用在订单详情页面
			const original = 5
			let step = 0
			if (this.xuzu(orderObj, usedInList) == undefined) step += 1 // 续租不展示，那么前进1步
			if (this.maiduan(orderObj, usedInList) == undefined) step += 1 // 买断不展示，那么前进1位
			if (this.guihuan(orderObj, usedInList) == undefined) step += 1 // 归还不展示，那么前进1位
			return original - step
		}
		if (checkOrderSettle(orderObj) && !usedInList) return 1
		if (checkOrderSettleNeedPay(orderObj) && !usedInList) return 3
		// if (checkOrderOverdue(orderObj, usedInList) && !usedInList) {
		//   let base = 4
		//   if (this.guihuan(orderObj, usedInList) == undefined) base-- // 归还不显示，那么向前进一位
		//   if (this.maiduan(orderObj, usedInList) == undefined) base-- // 买断不显示，向前进一位
		//   return base
		// }
		if (checkOrderHasDone(orderObj) && !usedInList) return 3
	},

	/**
	 * 返回再次下单按钮的显示位置
	 * @param {*} orderObj : 订单对象
	 * @param {*} usedInList 
	 */
	zaicixiadan: function(orderObj) {
		if (checkOrderHasDone(orderObj)) return 0
	},

	/**
	 * 归还按钮
	 * @param {*} orderObj : 订单对象VO
	 */
	guihuan: function(orderObj, usedInList = true) {
		const {
			isShowReturnButton
		} = orderObj
		if (isShowReturnButton == 0) return undefined // 表示不显示归还按钮
		// if (checkOrderOverdue(orderObj, usedInList)) return 0
		if (checkOrderRenting(orderObj, usedInList)) {
			const origin = 3
			let step = 0
			if (this.xuzu(orderObj, usedInList) == undefined) step += 1 // 续租不展示
			if (this.maiduan(orderObj, usedInList) == undefined) step += 1 // 买断不展示
			return origin - step
		}
	},

	/**
	 * 买断按钮，是否展示买断完全取决于接口返回数据，这里只定义当显示时按钮的顺序
	 * @param {*} obj : 订单对象VO
	 */
	maiduan: function(obj, usedInList = true) {
		const {
			isShowBuyOutButton
		} = obj || {}
		if (isShowBuyOutButton == 0) return undefined

		if (checkOrderRenting(obj, usedInList)) { // 租用中
			if (checkOrderHasDaoQi(obj)) { // 订单到期的话，那么是会显示续租按钮的
				return 2
			} else {
				return 1
			}
		}
		// if (checkOrderOverdue(obj, usedInList)) {
		//   if (this.guihuan(obj, usedInList) == undefined) return 0
		//   return 1
		// }
	},

	/**
	 * 确认收货
	 * @param {*} obj : 订单对象VO
	 */
	querenshouhuo: function(obj, usedInList = true) {
		if (checkOrderNeedShouhuo(obj, usedInList)) return 0
	},

	/**
	 * 取消订单
	 * @param {*} obj : 订单对象VO
	 * @param {*} usedInList : 是否使用在订单列表页面
	 */
	quxiaodindan: function(obj, usedInList = true) {
		const isNeedPay = checkOrderNeedPay(obj)
		const checkIsEqbType = checkIsEqb(obj);
		if (usedInList) { // 使用在订单列表页面
			if (isNeedPay) return usedInList ? 1 : 2
		}

		const isNeedFukuan = checkOrderNeedPay(obj)
		if (isNeedFukuan) { // 待付款场景
			if (!usedInList) { // 不在订单列表页面
				if (!checkIsEqbType) { //
					return 2
				}
			}
		}

		const isNeedFahuo = checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj)

		if (isNeedFahuo) { // 待发货场景
			if (usedInList) { // 使用在订单列表页面
				if (orderHasShuaLian(obj)) { // 已刷过脸
					return 1
				} else { // 未刷过脸
					return 2
				}
			} else { // 使用在详情页面
				if (!checkIsEqbType) {
					return 1
				}
			}
		}
		
		const isShenHeJuJue = checkOrderNeedShenheJuJue(obj)//审核拒绝时，在订单列表只能取消订单
		if(isShenHeJuJue) return 0
	},

	/**
	 * 签署订单
	 * @param {*} obj : 订单对象VO
	 * @param {*} usedInList : 是否使用在订单列表页面
	 */
	qianshuxieyi: function(obj, usedInList = true) {
		const checkIsEqbType = checkIsEqb(obj);
		const isNeedFahuo = checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj)
		if (!usedInList) { // 不使用在订单列表页面
			if (checkIsEqbType) {
				// if (isNeedFahuo) { // 待发货场景
				// 	return 1
				// } else {
				// 	return 2
				// }
				if (isNeedFahuo) { // 待发货场景
					return 1
				}
				if (checkOrderNeedPay(obj)) { //待支付场景
					return 2
				}
			}
		}

	},

	/**
	 * 去支付按钮
	 * @param {*} obj : 订单对象VO
	 */
	quzhifu: function(obj, usedInList = true) {
		if (checkOrderNeedPay(obj, usedInList) || checkOrderSettleNeedPay(obj, usedInList)) return 0
	},

	/**
	 * 投诉按钮
	 * @param {*} obj : 订单对象VO
	 * @param {*} usedInList : 是否使用在订单列表页面
	 */
	tousu: function(obj, usedInList = true) {
		const needPay = checkOrderNeedPay(obj)
		if (needPay) return usedInList ? 2 : 3

		const needFahuo = checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj)
		if (needFahuo) {
			if (usedInList) { // 使用在订单列表页面
				if (orderHasShuaLian(obj)) { // 已刷过脸
					return 2
				} 
				// else { // 未刷过脸
				// 	return 3
				// }
			} else { // 订单详情页面
				return 2
			}
		}

		if (checkOrderNeedShouhuo(obj)) return 3
		if (checkOrderRenting(obj, usedInList)) { // 租用中状态，投诉按钮的位置即取决于买断是否展示，也取决于归还是否展示
			if (usedInList) { //使用在订单列表页面
				const original = 4
				let step = 0
				if (this.xuzu(obj, usedInList) == undefined) step += 1 // 说明续租不展示，那么前进1步
				if (this.maiduan(obj, usedInList) == undefined) step += 1 // 说明买断不展示，那么前进1步
				if (this.guihuan(obj, usedInList) == undefined) step += 1 // 说明归还不展示，那么前进1步
				return original - step
			}
		}
		if (checkOrderSettle(obj)) return 0
		if (checkOrderSettleNeedPay(obj)) return 2
		// if (checkOrderOverdue(obj, usedInList)) {
		//   let base = 3
		//   if (this.guihuan(obj, usedInList) == undefined) base-- // 归还不展示，向前进一步
		//   if (this.maiduan(obj, usedInList) == undefined) base-- // 买断不展示，向前进一步
		//   return base
		// }
		if (checkOrderHasDone(obj)) return 2
	},

	/**
	 * 修改地址按钮
	 * @param {*} obj : 订单对象VO
	 * @param {*} usedInList : 是否使用在订单列表页面
	 */
	xiugaidizhi: function(obj, usedInList = true) {
		if (checkOrderNeedPay(obj) && !usedInList) return 1
	},

	/**
	 * 续租按钮
	 * @param {*} obj : 订单对象VO
	 */
	xuzu: function(obj, usedInList) {
		if (checkOrderRenting(obj, usedInList) && checkOrderHasDaoQi(obj)) return 1 // 不仅是租用中，而且得是到期的状态
	},

	/**
	 * 账单按钮
	 * @param {*} obj : 订单对象
	 * @param {*} usedInList : 是否使用在订单列表页面
	 */
	zhangdan: function(obj, usedInList = true) {
		const needFahuo = checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj)
		if (needFahuo) {
			if (usedInList) { // 使用在订单列表页面
				if (orderHasShuaLian(obj)) { // 订单已刷脸过
					return 0
				} else { // 订单未刷过脸
					return 1
				}
			} else { // 使用在订单详情页面
				return 0
			}
		}
		if (checkOrderNeedShouhuo(obj)) return 1
		if (checkOrderRenting(obj, usedInList)) return 0
		// if (checkOrderOverdue(obj, usedInList)) {
		//   let base = 2
		//   if (this.guihuan(obj, usedInList) == undefined) base-- // 说明归还没有显示，那么向前进一位
		//   if (this.maiduan(obj, usedInList) == undefined) base-- // 说明买断没有显示，那么向前进一位
		//   return base
		// }
		if (checkOrderHasDone(obj)) return 1
	},

	/**
	 * 刷脸认证按钮
	 * @param {*} obj : 订单对象
	 * @param {*} usedInList : 是否使用在订单列表页面
	 */
	shualianrenzheng: function(obj, usedInList = true) {
		if (orderHasShuaLian(obj)) return undefined // 订单已经刷过脸的话，那么就不显示此按钮了
		if (
			(checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj)) && usedInList
		) return 0
	},

	/**
	 * 修改认证按钮
	 * @param {*} obj : 订单对象
	 * @param {*} usedInList : 是否使用在订单列表页面
	 */
	xiugairenzheng: function(obj, usedInList = true) {
		// const isNeedFahuo = checkOrderNeedShenhe(obj) || checkOrderNeedPay(obj) 

		if (checkOrderNeedShenhe(obj) && usedInList) { // 待审核场景
			return 3
		}
		if (checkOrderNeedPay(obj) && usedInList) { //待支付场景
			if (usedInList) {
				return 3
			}
		}
	},


	/**
	 * 申请修改按钮
	 * @param {*} obj : 订单对象
	 */
	shenqingxiugai: function(obj) {
		if (checkOrderSettleNeedPay(obj)) return 1
	},
	/**
	 * 签署
	 * @param {*} obj : 订单对象
	 */
	// --蚂蚁链签署
	// qianshu: function(obj, usedInList = false, orderDeatil) {
	// 	// console.log('orderDeatil====', orderDeatil, orderDeatil && orderDeatil.userOrdersDto.contractDeductSignStatus == 1)
	// 	const needFahuo = checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj)
	// 	if (needFahuo) {
	// 		if (orderDeatil && orderDeatil.userOrdersDto.contractDeductSignStatus == 1) {
	// 			return 3
	// 		}
	// 	} else {
	// 		if (orderDeatil && orderDeatil.userOrdersDto.contractDeductSignStatus == 1) {
	// 			return 2
	// 		}
	// 	}

	// },
	// 通联代扣===签署逻辑
	qianshu: function(obj, usedInList = false, orderDeatil) {
		const needFahuo = checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj) || checkOrderRenting(obj);
		const Shouhuo = checkOrderNeedShouhuo(obj);
		if (Shouhuo) {
			if (orderDeatil && (orderDeatil.userOrdersDto.ysStatus == 1 || orderDeatil.userOrdersDto.contractDeductSignStatus == 1)) {
				return 2
			}
		} else {
			if (orderDeatil && (orderDeatil.userOrdersDto.ysStatus == 1 || orderDeatil.userOrdersDto.contractDeductSignStatus == 1)) {
				return 3
			}
		}

	},
	daikouhetong: function(obj, usedInList = false, orderDeatil) {
		// console.log('orderDeatil====', orderDeatil.userOrdersDto.contractDeductSignStatus)
		// if (orderDeatil && orderDeatil.userOrdersDto.contractDeductSignStatus == 2) {
		//  return 2
		// }
		
		/**
		 * 支付宝代扣-去掉查看代扣合同
		 */
		// const needFahuo = checkOrderNeedFahuo(obj) || checkOrderNeedShenhe(obj)
		// if (needFahuo) {
		// 	if (orderDeatil && orderDeatil.userOrdersDto.contractDeductSignStatus == 2) {
		// 		return 3
		// 	}
		// } else {
		// 	if (orderDeatil && orderDeatil.userOrdersDto.contractDeductSignStatus == 2) {
		// 		return 2
		// 	}
		// }
	}

}

/**
 * 判断按钮是否显示
 * @param {*} position
 * @param {Bool} isUsedInMore : 是否使用在省略号的场景中
 */
export const showBtns = (position, isUsedInMore) => {
	if (isUsedInMore) {
		return position > MAX_SHOW_BTNS - 1
	} else {
		return position != undefined && (position <= MAX_SHOW_BTNS - 1)
	}
}

/**
 * 通知按钮使用的顶层页面进行页面刷新动作
 * 注意这里即通知了刷新订单列表页面，也通知了刷新订单详情页面，而不是只通知某一个页面
 * 这样可以避免在订单详情页面做了某个操作，订单详情刷新了，但是点击返回回到订单列表页面时，订单列表页面还是原样
 */
export function notifyTopPageRefresh() {
	this.$eventEmitter.emit("refreshOrderList")
	this.$eventEmitter.emit("refreshOrderDetail_jsjk12")
}