<template>
  <el-card class="box-card-component" style="margin:8px;">
    <div slot="header" class="box-card-header">
      <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
    </div>
    <div style="position:relative;">
      <pan-thumb image="https://wdnmd-1300857723.cos.ap-chengdu.myqcloud.com/picture/AE7DECC9D4294470836F3F109799D1E5d7e8f5294b6e8859202e771836cffcb1.jpeg" class="panThumb" />
      <mallki class-name="mallki-text" text="知润健康" />
      <div class="image-name">
      </div>
       <div style="padding-top:35px;" class="progress-item">
         <div>
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
           介绍:这是一条很长很长的介绍
         </div>
       </div>
      <!-- <div class="progress-item">
         <span>JavaScript</span>
         <el-progress :percentage="18" />
       </div>
       <div class="progress-item">
         <span>Css</span>
         <el-progress :percentage="12" />
       </div>
       <div class="progress-item">
         <span>ESLint</span>
         <el-progress :percentage="100" status="success" />
       </div>-->
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { PanThumb, Mallki },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    /deep/ .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  .image-name{
    margin-left: 30%;
    font-size: 16px;
    font-weight: initial;
    line-height: 1.4;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
