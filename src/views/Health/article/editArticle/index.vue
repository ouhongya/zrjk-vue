<template>
  <el-card class="card-layout">
    <el-form :model="article" ref="article" :rules="rules" label-width="100px" style="width: 80%;margin:auto">
      <el-form-item label="标题:" prop="name">
        <el-input v-model="article.name" size="small" style="width: 36%" type="text" maxlength="50" show-word-limit
                  placeholder="请输入标题名称"/>
      </el-form-item>
      <el-form-item label="医生名:" prop="doctorName">
        <el-input v-model="article.doctorName" size="small" style="width: 36%" type="text" maxlength="10"
                  show-word-limit placeholder="请输入医生名"/>
      </el-form-item>
      <el-form-item label="医生岗位:" prop="department">
        <el-input v-model="article.department" size="small" style="width: 36%" type="text" maxlength="10"
                  show-word-limit placeholder="请输入医生岗位"/>
      </el-form-item>
      <el-form-item label="健康主题:" prop="healthThemeId">
        <el-select v-model="article.healthThemeId"
                   size="small"
                   placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缩略图:" prop="url">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-change='changeUpload'>
          <img v-if="article.url" :src="article.url" class="avatar">
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
      <el-form-item label="内容:" prop="content">
        <tinymce v-model="article.content" :height="400"/>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="small" round @click="QX">取消</el-button>
        <el-button type="primary" size="small" round @click="onSubmit(`article`)">确认</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import {updateArtcle, findHealthThemeAll, findArtcleById} from '@/api/health/index'
  import Cropper from 'cropperjs'
  import request from "@/utils/request"

  export default {
    name: "index",
    components: {Tinymce},
    data() {
      return {
        article: {
          id: ``,
          name: ``,
          content: ``,
          healthThemeId: ``,
          url: ``,
          doctorName: ``,
          department: ``
        },
        options: null,
        rules: {
          name: [
            {required: true, message: '请输入文章名称', trigger: 'blur'}
          ],
          healthThemeId: [
            {required: true, message: '请选择主题', trigger: 'change'}
          ],
          doctorName: [
            {required: true, message: '请输入医生名', trigger: 'blur'}
          ],
          department: [
            {required: true, message: '请输入医生岗位', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请上传图片', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
        },
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
          fixedNumber: [1.8, 1], // 截图框的宽高比例
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
      onSubmit(article) {
        this.$refs[article].validate((valid) => {
          if (valid) {
            updateArtcle(this.article).then(res => {
              if (res.queue.code === 1) {
                this.mess('修改成功', 'success')
                this.$router.push({path: '/health/aarticle'})
              }
            })
          } else {
            return false
          }
        })
      },
      QX() {
        this.$router.push({path: '/health/aarticle'})
      },
      handleAvatarSuccess(res, file) {
        this.article.url = res.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 / 1024 < 3;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传封面图片大小不能超过 3MB!');
        }
        return isJPG && isLt2M;
      },
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
            this.article.url = res.data
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
    },
    created() {
      findHealthThemeAll().then(res => {
        if (res.queue.code === 1) {
          this.options = res.data.list
        }
      })
      findArtcleById(this.$route.query.id).then(res => {
        if (res.queue.code === 1) {
          this.article.id = res.data.id
          this.article.content = res.data.content
          this.article.name = res.data.name
          this.article.healthThemeId = res.data.healthThemeId
          this.article.url = res.data.url
          this.article.doctorName = res.data.doctorName
          this.article.department = res.data.department
        }
      })
    }
  }
</script>

<style scoped>
  .card-layout {
    margin: 8px;
  }

  .cropper-content .cropper {
    width: auto;
    height: 300px;
  }

  .card-layout {
    margin: 8px;
  }

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
</style>
