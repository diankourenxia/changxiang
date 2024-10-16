<template>
<view>
  <view class="wrapper">
    <view
      v-for="(imgSrc, idx) in imgList"
      :key="idx"
      class="item"
      @click="previewImgHandler(idx)"
    >
      <image :src="imgSrc" class="img" />
      <image @click.stop="delImgHandler(idx)" src="/static/complain/del.png" class="del-icon" />
    </view>
    <view @click="chooseFileHandler" class="item">
      <image v-if="imgList.length < limit" src="/static/complain/add.png" class="img add" />
    </view>
  </view>
  <view class="desc">最多可上传4张</view>
</view>
</template>

<script>
// 图片上传组件
import { errHandler,getShowLoading,getHideLoading } from "../../utils/index"
import { baseUrl } from "../../utils/constant"

export default {
  name:"imgUpload",

  data() {
    return {}
  },

  props: {
    limit: {
      type: Number,
      default: 6,
    }, // 张数限制
    imgList: {
      type: Array,
      default: [],
    }, //  图片的URL网络链接数组
  },

  methods: {
    /**
     * 设置图片链接数组
     * @param {newV} : 新的图片链接的值
     */
    setImgListHandler(newV) {
      this.$emit("change", newV)
    },

    /**
     * 删除图片的时候触发
     */
    delImgHandler(index) {
      const newImgList = [...this.imgList]
      newImgList.splice(index, 1)
      this.setImgListHandler(newImgList)
    },

    /**
     * 对图片进行合并
     */
    concatImgList(apiReturnList) {
      if (Object.prototype.toString.call(apiReturnList) !== "[object Array]") return
      const newV = this.imgList.concat(apiReturnList)
      this.setImgListHandler(newV)
    },

    /**
     * 选中文件的时候触发
     */
    chooseFileHandler() {
      let that = this
      my.chooseImage({
        count: this.limit - this.imgList.length, // 最多选择4张，如果已上传n张，那么最多只能选择4-n张
        sizeType: ["compressed"],
        success: function(res) {
          // const { tempFilePaths } = res
          const tempFilePaths = res.apFilePaths
          if (Object.prototype.toString.call(tempFilePaths) !== "[object Array]") {
            errHandler("请重新选择图片", true)
            return
          }
          const fileUploadPromises = tempFilePaths.map(tempFileUrl => that.$fileUploadHandler(tempFileUrl))
          getShowLoading({ title: "上传中", mask: true })
          Promise.all(fileUploadPromises).then(imgUrls => { // 所有图片都上传成功
            that.concatImgList(imgUrls)
          }).catch(imgUrls2 => { // 至少存在某张上传失败
            if (Object.prototype.toString.call(imgUrls2) !== "[object Array]") {
              errHandler("出现问题") // 如果上传接口报错的化，那么封装的request已经会进行弹窗了，那这里就不再弹窗了
              return
            }
            const usefulImgList = imgUrls2.filter(n => !!n) // 将有效的链接过滤出来
            errHandler("部分文件上传错误") // 同样不再弹窗提示，封装的request已经弹过一次窗了
            that.concatImgList(usefulImgList)
          }).finally(() => {
            getHideLoading()
          })
        },
        fail: function(err) {
          const { errMsg } = err || {}
          if (errMsg.includes("用户取消操作")) return
          errHandler("访问相册出现问题，请重试", true)
        }
      })
    },

    /**
     * 图片预览的时候触发
     * @param {Number} idx : 预览图片的索引位置
     */
    previewImgHandler(idx) {
      uni.previewImage({
        current: idx,
        urls: this.imgList,
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  .item {
    width: 120rpx;
    height: 120rpx;
    border-radius: 10rpx;
    position: relative;
    .del-icon {
      position: absolute;
      width: 30rpx;
      height: 30rpx;
      top: -15rpx;
      right: -15rpx;
      z-index: 3;
    }
  }
  .img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 10rpx;
  }
  .item+.item {
    margin-left: 30rpx;
  }
  .desc {
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
}
</style>
