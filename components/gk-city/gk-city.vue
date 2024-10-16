
<template>
	<view>
		<view class="mask" :class="{'maskShow' : showPicker}" @click="hide" @click.stop.prevent @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="cpicker-content" :class="{'cpickerShow' : showPicker}">
			<view class="city-head" @click.stop.prevent @touchmove.stop.prevent catchtouchmove="true">
				<view class="city-head-title">{{headtitle}}</view>
				<text v-if="rightIcon" class="rightIcon iconfont icon-quxiao" @click="hide('self')"></text>
			</view>
			<scroll-view id="nav-bar" class="nav-bar" scroll-x="true" scroll-with-animation="true" :scroll-left="scrollLeft" >
				<view
					v-for="(item,index) in tabbars" 
					class="nav-item"
					:key="index"
					:id="'tab'+index"
					@click="changeTab(index)"
				
				><text class="nav-bar-title">{{item.text}}
				<view class="nav-bar-title-icon" v-if="index === tabCurrentIndex">
					
				</view>
				</text></view>
			</scroll-view>
			<view class="city_content"> 
				<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" :cscrollTop="scrollTop" :current="tabCurrentIndex" :scroll-top="scrollTop">
					<block v-for="(item,index) in showData" :key="index">
						<view class="flex-row-c-c" @click="changCity(tabCurrentIndex,item)">
							<icon type="success_no_circle" v-if="tabbars[tabCurrentIndex].value==item.value" :id="'show'+tabCurrentIndex" class="ischeck" size="12" color="#FFCB31" ></icon>
							<text class="city-text" 
							:style="{
								fontWeight:tabbars[tabCurrentIndex].value==item.value ? 700:400
							}"
							>{{item.text}}</text>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import address from "@/utils/address.json"
let windowWidth = 0,scrollTimer = false, tabBar
export default {
  name: "UniCityNvue",
  props: {
    headtitle: {    // 使用多少个tab
      type: String,
      default: ""
    },
    pickerSize: {    // 使用多少个tab
      type: [String, Number],
      default: 1
    },
    data: {      // 默认的省市区id，如果不使用id的情况下则为[]；
      type:Array,
      default:function(){
        return  address
      },
    },
    provincedata: {      // 默认的省市区id，如果不使用id的情况下则为[]；
      type:Array,
      default:function(){
        return  []
      },
    }
  },
  data() {
    return {
      isFirst: true,
      rightIcon:true,
      scrollLeft: 500, //顶部选项卡左滑距离
      scrollTop:0,
      enableScroll: true,
      tabCurrentIndex: 0, //当前选项卡索引
      tabbars:this.provincedata,
      showData:address,
      showPicker: false
    }
  },
  watch: {
    showPicker(){
      if(this.isFirst){
        this.isFirst = false
      }
    },
    provincedata(val){
      this.tabbars=val
    }
  },
		
  methods: {
    show(){
      this.showPicker = true
      windowWidth = uni.getSystemInfoSync().windowWidth
      if(this.provincedata?.length>0&&this.provincedata?.length<this.pickerSize&&this.isFirst&&this.provincedata[this.provincedata?.length-1].value!=""){
        this.showData=this.findSameId(this.data,this.tabbars[this.provincedata.length],this.tabbars[this.provincedata.length-1])
        var current={
          text:"请选择",
          value:"",
        }
        this.tabbars.push(current)
        this.tabCurrentIndex=this.provincedata?.length-1
        this.scrollTop=0
        this.setScroll(this.tabCurrentIndex)
      }else{
        this.showData=this.findSameId(this.data,this.tabbars[this.provincedata?.length-1],this.tabbars[this.provincedata?.length-2])
        this.$nextTick(()=>{
          this.tabCurrentIndex=this.provincedata?.length-1
          this.scrollTop=0
          this.setScroll(this.tabCurrentIndex)
        })
      }
    },
    findSameId(tree, currentTab,preTab) {
      let retNode = null
      function deepSearch(tree, currentTab,preTab) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].children && tree[i].children.length > 0) {
            deepSearch(tree[i].children, currentTab,preTab)
          }
          var flag=currentTab==undefined?true:(currentTab.value===""?true:false)
          var value=tree[i].value+""
          var text=tree[i].text
          if (preTab!=null&&flag&&preTab.text=== text&&preTab.value+"" ===value) {
            retNode=tree[i].children
            break
          }else if (currentTab!=null&&currentTab.text=== text&&currentTab.value+"" === value) {
            retNode=tree
            break
          }
        }
      }
      deepSearch(tree, currentTab,preTab)
      return retNode==null?tree:retNode
    },
			
    hide(){
      this.showPicker = false
    },
    //tab切换
    changeTab(e){
      let index = e
      this.setScroll(index)
      //延迟300ms,等待swiper动画结束再修改tabbar
      this.tabCurrentIndex = index 
      this.showData=this.findSameId(this.data,this.tabbars[index],index===0?this.tabbars[index]:this.tabbars[index-1])
      setTimeout(()=>{
        this.getScroll("show"+index)
      }, 10)
    },
    //获得元素的size
    getElSize(id) { 
      return new Promise((res, rej) => {
        let el = uni.createSelectorQuery().in(this).select("#" + id)
        el.fields({
          size: true,
          scrollOffset: true,
          rect: true
        }, (data) => {
          res(data)
        }).exec()
      })
    },

    /**
     * 修改地址的时候触发
     * @param {number} index : 表示是省，还是市，还是区
     * @param {number} item : 表示当前点击的对象
     */
    changCity(index, item) {
      if (this.tabbars[index].value != item.value) {
        const selectUIValue = { text: item.text, value: item.value }
        this.$set(this.tabbars, index, selectUIValue) // 设置所选中的值
        
        // LOG: 说明这是在修改前面已选择好的省份或者城市
        if (index < (this.tabbars.length - 1)) {
          const newArr = [...this.tabbars]
          newArr.splice(index + 1)
          this.tabbars = newArr
        }

        if (this.tabbars.length < this.pickerSize) { // 说明地址还没有选择完全
          const current={
            text:"请选择",
            value:""
          } // 下一个地址（市或者区）的占位
          this.showData = item.children // 设置下一个地址选择的显示数据（比如说城市列表，区的列表）
          
          // LOG: 直接push的话Vue监测不到data发生变化，将不会更新，详情参考：https://blog.csdn.net/a303944689/article/details/81393263
          // this.tabbars.push(current)
          const newTabBars = [...this.tabbars]
          newTabBars.push(current)
          this.tabbars = newTabBars

          this.tabCurrentIndex++ 
          this.scrollTop = 0
          this.setScroll(index)
        } else { // 表明地址已经选中完全了，通知上层UI组件
          this.$emit("funcvalue",this.tabbars)
          this.hide()
        }
      }
    },

    async setScroll(index){
      let width = 0
      let nowWidth = 0
      for (let i = 0; i <= index; i++) {
        let result = await this.getElSize("tab" + i)
        width += result.width
        if(i === index){
          nowWidth = result.width
        }
      }
      if ((width+nowWidth)>windowWidth) {
        this.scrollLeft=width+nowWidth
      }else{
        this.scrollLeft = 0
      } 
    },
    getScroll(id) {
      uni.createSelectorQuery().in(this).select(".panel-scroll-box").boundingClientRect((data)=>{
        uni.createSelectorQuery().in(this).select("#" + id).boundingClientRect((res)=>{
          if(res != undefined && res != null && res != ""){
            this.scrollTop=res.top-data.top
          }
        }).exec()
      }).exec()
    }
  }
}
</script>

<style lang="scss">
.mask {
    visibility: hidden;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, .6);
    opacity: 0;
    transition: all .3s ease;
	
}
.maskShow {
    visibility: visible;
    opacity: 1;
}
.cpicker-content {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #FFFFFF;
    transition: all .3s ease;
    transform: translateY(100%);
    z-index: 3000;
	border-radius: 20rpx 20rpx 0 0;
}
.cpickerShow {
    transform: translateY(0);
}
.city-head {
    width: 750rpx;
    height: 88rpx;
    flex-direction: column;
   
}
.city-head-title {
 
    line-height: 88rpx;
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
    align-items: center;
    /* #ifndef APP-NVUE */
    text-align: center;
    /* #endif */
	
}
.rightIcon {
    position: absolute;
    right: 15rpx;
    top: 9rpx;
    font-size: 30rpx;
    color: #BEBEBE;
	right: 32rpx;
	top: 32rpx;
	width: 32rpx;
	height: 32rpx;
	
	&::before {
	  position: absolute;
	  left: 15rpx;
	  content: ' ';
	  height: 20rpx;
	  width: 3rpx;
	  background-color: #979AAA;

	}
	&::after{
		position: absolute;
		left: 15rpx;
		content: ' ';
		height: 20rpx;
		width: 3rpx;
		background-color: #979AAA;
	}
	&:before {
	  transform: rotate(45deg);
	}
	&:after {
	  transform: rotate(-45deg);
	}
}
.nav-bar {
    position: relative;
    z-index: 10;
    white-space: nowrap;
    
    background-color: #fff;
	border-bottom: 1px solid #F2F2F2;
}
.nav-bar::-webkit-scrollbar {
  display: none;
}
.nav-item {
    /* #ifndef APP-NVUE */
    display: inline-flex!important;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex-direction: row!important;
    /* #endif */
    // width: 33%;

    padding: 7px 0px;
    // line-height: 26px;
    align-items: center;
    justify-content: center;
    color: #303133;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
}
.nav-bar-title {
	width: 100%;
	font-size: 28rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #333333;
	padding: 0 40rpx;
	position: relative;
	.nav-bar-title-icon{
		width: 42rpx;
		height: 6rpx;
		@include global-background-color();
		border-radius: 6rpx;
		 position: absolute;
		    top: 130%;
		    transform: translateY(-50%);
		    left: 0;
		    right: 0;
			margin: 0 auto;
	}
	
}
.current {
    color: FFCB31;
    border-color: FFCB31;
    border-bottom-width: 4rpx;
    border-bottom-style: solid;
}
.current:after {
    width: 50%;
}
.panel-scroll-box {
    height: 516rpx;
    margin-top: 8px;
}
.flex-row-c-c {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex-direction: row;
    /* #endif */
    padding-left: 25px;
}
.city-text {
    /* #ifdef APP-NVUE */
    flex-direction: row;
    /* #endif */
    height: 35px;
    line-height: 35px;
    font-size: 13px;
}
.hide {
    opacity: 0;
}
.ischeck {
    /* #ifndef APP-NVUE */
    display: inline-flex!important;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex-direction: column;
    /* #endif */
    margin-right: 5px;
    vertical-align: middle;
}

</style>