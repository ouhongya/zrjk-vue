<template>
  <el-card class="card-layout">
    <div class="img-banner">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="url" class="image">
        <div style="padding: 14px;">
          <span>首页图片</span>
          <div class="bottom clearfix">
            <time class="time">{{  currentDate | dateformat('YYYY-MM-DD HH:mm')}}</time>
            <el-button type="text" class="button" @click="Visible=true"v-if="hasPerm(`ban:edit`)">修改图片</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="添加主题分类"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="40%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form ref="healthTheme" label-width="80px" style="width: 80%;margin:auto">
        <el-form-item label="首页图:" prop="url" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change='changeUpload'>
            <img v-if="url" :src="url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog title="背景图裁剪" :visible.sync="dialogVisible" append-to-body>
            <div class="cropper-content">
              <div class="cropper" style="text-align:center">
                <vueCropper
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="true"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :fixed="option.fixed"
                  :fixedNumber="option.fixedNumber"
                  :centerBox="option.centerBox"
                  :infoTrue="option.infoTrue"
                  :fixedBox="option.fixedBox"
                  @realTime="realTime"
                ></vueCropper>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="finish">确认</el-button>
            </div>
          </el-dialog>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round>取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmit(`healthTheme`)">确认</el-button>
    </el-dialog>
  </el-card>
</template>
<script>
  import {updateIndexBanner,findIndexBanner} from "@/api/health/index"
  import Cropper from 'cropperjs'
  import request from "@/utils/request"

  export default {
    data() {
      return {
        Visible: false,
        currentDate: new Date(),
        url: '',
        fileName: '',
        dialogVisible: false,
        // 裁剪组件的基础配置option
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'png', // 裁剪生成图片的格式
          canScale: false, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          // autoCropWidth: 300, // 默认生成截图框宽度
          // autoCropHeight: 200, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [2.08, 1], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
        headerImage: '',
        picValue: '',
      }
    },
    methods: {
      getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      async change(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.panel = true;
        this.picValue = files[0];
        this.url = this.getObjectURL(this.picValue);
        this.fileName = e.target.files[0].name
        //每次替换图片要重新得到新的url
        if (this.cropper) {
          await this.cropper.replace(this.url);
        }
        this.panel = true;
      },
      crop() {
        this.panel = false;
        var croppedCanvas;
        var roundedCanvas;
        if (!this.croppable) {
          return;
        }
        // Crop
        croppedCanvas = this.cropper.getCroppedCanvas();
        // Round
        roundedCanvas = this.getRoundedCanvas(croppedCanvas);
        this.headerImage = roundedCanvas.toDataURL();
        this.postImg()
      },
      getRoundedCanvas(sourceCanvas) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        /*
                context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        */
        context.fillRect(0, 0, width, height)
        context.fill();
        return canvas;
      },
      async postImg(data) {
        //这边写图片的上传
        var formData = new FormData();
        formData.append(
          'multipartFile',
          data,
          this.fileName
        )
        await request({
          url: '/health/videoUpload',
          method: 'post',
          data: formData
        }).then(res => {
          if (res.queue.code === 1) {
            this.mess('上传成功', 'success')
            this.url = res.data
            this.dialogVisible = false
            this.loading = false
          }
        }).catch(err => {
          this.loading = false
        })
      },
      // 上传按钮   限制图片大小
      changeUpload(file, fileList) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!')
          return false
        }
        this.fileinfo = file
        // 上传成功后将图片地址赋值给裁剪框显示图片
        this.$nextTick(() => {
          this.option.img = this.getObjectURL(file.raw);
          this.fileName = file.name
          this.dialogVisible = true
        })
      },
      // 点击裁剪，这一步是可以拿到处理后的地址
      finish() {
        this.$refs.cropper.getCropBlob((data) => {
          this.loading = true
          this.postImg(data)
        })
      },
      realTime(e) {

      },
      onSubmit() {
        updateIndexBanner(this.url).then(res => {
          if (res.queue.code === 1) {
            this.mess("上传成功", "success")
            this.Visible=false;
          }
        })
      }
    },
    created() {
      findIndexBanner().then(res=>{
        this.url=res.data
      })
    }
  }
</script>
<style scoped>
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 322px;
    height: 161px;
    text-align: center;
    line-height: 5.5;
  }

  .avatar {
    width: 322px;
    height: 161px;
    display: block;
  }
  .card-layout {
    margin: 5px;
  }

  .img-banner {

  }

  .cropper-content .cropper {
    width: auto;
    height: 300px;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 450px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
