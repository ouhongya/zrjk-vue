<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" size="small" class="el-icon-plus" style="float: right" round
                 v-if="hasPerm(`heal:add`)"
                 @click="Visible=true">添加主题
      </el-button>
      <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search"
                size="small" v-model="search" placeholder="请输入搜索内容"
                clearable/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%"
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        @sort-change="fetchData"
      >
        <el-table-column
          prop="createdTime"
          label="日期"
          sortable
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          sortable
          label="标签"
        >
          <template slot-scope="props">
            <el-tag
              v-if="props.row.name!==``"
            >{{ props.row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          align="center"
          label="图片"
        >
          <template slot-scope="props">
            <el-image
              style="width: 80px; height: 80px;border-radius: 50%"
              :src="props.row.url"
              :preview-src-list="[props.row.url]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="背景图"
        >
          <template slot-scope="props">
            <el-image
              style="width: 100px; height: 50px;"
              :src="props.row.banner"
              :preview-src-list="[props.row.banner]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="primary" size="small" v-if="hasPerm(`heal:edit`)" class="el-icon-edit" round
                       @click="updateTag(props.row.id)">修改
            </el-button>
            <el-button class="el-icon-delete" type="danger" v-if="hasPerm(`heal:dele`)" round size="small"
                       @click="deleteTag(props.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        style="text-align: center"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>
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
      <el-form :model="healthTheme" ref="healthTheme" label-width="80px" style="width: 80%;margin:auto">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input size="small" v-model="healthTheme.name" type="text" maxlength="10" show-word-limit
                    placeholder="请输入标签名"/>
        </el-form-item>
        <el-form-item label="缩略图:" prop="url" :rules="[{ required: true, message: '名称不能为空'}]">
          <img v-if="healthTheme.url!==``" :src="healthTheme.url" width="80px" height="80px"
               style="border-radius: 50%"/>
          <el-button type="primary" size="mini" style="float: right;margin-top: 30px" icon="el-icon-upload"
                     @click="imagecropperShow=true">
            上传图片
          </el-button>
        </el-form-item>
        <el-form-item label="背景图:" prop="url" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change='changeUpload'>
            <img v-if="healthTheme.banner" :src="healthTheme.banner" class="avatar">
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
      <el-button type="primary" size="small" round @click="QX">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmit(`healthTheme`)">确认</el-button>
    </el-dialog>
    <el-dialog
      title="修改主题分类"
      :visible.sync="VisibleEdit"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="40%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="EdithealthTheme" ref="EdithealthTheme" label-width="80px" style="width: 80%;margin:auto">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input size="small" v-model="EdithealthTheme.name" type="text" maxlength="10" show-word-limit
                    placeholder="请输入标签名"/>
        </el-form-item>
        <el-form-item label="缩略图:" prop="url" :rules="[{ required: true, message: '名称不能为空'}]">
          <img v-if="EdithealthTheme.url!==``" :src="EdithealthTheme.url" width="80px" height="80px"
               style="border-radius: 50%"/>
          <el-button type="primary" size="mini" style="float: right;margin-top: 30px" icon="el-icon-upload"
                     @click="imagecropperShow1=true">
            上传图片
          </el-button>
        </el-form-item>
        <el-form-item label="背景图:" prop="url" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change='changeUpload'>
            <img v-if="EdithealthTheme.banner" :src="EdithealthTheme.banner" class="avatar">
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
      <el-button type="primary" size="small" round @click="QX">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmitEdit(`EdithealthTheme`)">确认</el-button>
    </el-dialog>
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="/health/videoUpload"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
    <image-cropper
      v-show="imagecropperShow1"
      :key="imagecropperKey1"
      :width="300"
      :height="300"
      url="/health/videoUpload"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess1"
    />
  </div>
</template>
<script>
  import ImageCropper from '@/components/ImageCropper'
  import {addHealthTheme, updateHealthTheme, deleteHealthTheme, findHealthTheme} from '@/api/health/index'
  import Cropper from 'cropperjs'
  import request from "@/utils/request"

  export default {
    name: 'index',
    components: {ImageCropper},
    data() {
      return {
        list: [],
        currentPage: 1,
        size: 10,
        total: 0,
        search: '',
        Visible: false,
        VisibleEdit: false,
        healthTheme: {
          name: '',
          url: '',
          banner: ""
        },
        EdithealthTheme: {
          id: '',
          name: '',
          url: '',
          banner: ""
        },
        imagecropperShow: false,
        imagecropperKey: 10,
        imagecropperShow1: false,
        imagecropperKey1: 100,
        croppable: false,
        panel: false,
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
          fixedNumber: [5, 2], // 截图框的宽高比例
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
      fetchData(val) {
        let sort = 'desc'
        let name = 'created_time'
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 'created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'created_time'
            sort = 'asc'
          }
        }
        findHealthTheme(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      deleteTag(id) {
        this.$confirm('是否删除此主题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteHealthTheme(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      updateTag(id) {
        this.list.forEach(item => {
          if (item.id === id) {
            this.EdithealthTheme.id = item.id
            this.EdithealthTheme.name = item.name
            this.EdithealthTheme.url = item.url
            this.EdithealthTheme.banner = item.banner
          }
        })
        this.VisibleEdit = true
      },
      onSubmit(healthTheme) {
        this.$refs[healthTheme].validate((valid) => {
          if (valid) {
            addHealthTheme(this.healthTheme).then(res => {
              if (res.queue.code === 1) {
                this.mess('添加成功', 'success')
                this.fetchData()
                this.QX()
              }
            })
          } else {
            return false;
          }
        })

      },
      onSubmitEdit(EdithealthTheme) {
        this.$refs[EdithealthTheme].validate((valid) => {
          if (valid) {
            let healthTheme = {
              id: this.EdithealthTheme.id,
              name: this.EdithealthTheme.name,
              url: this.EdithealthTheme.url,
              banner: this.EdithealthTheme.banner
            }
            updateHealthTheme(healthTheme).then(res => {
                if (res.queue.code === 1) {
                  this.mess('修改成功', 'success')
                  this.QX()
                  this.fetchData()
                }
              }
            )
          }
        })
      },
      QX() {
        this.healthTheme.name = ''
        this.healthTheme.url = ''
        this.healthTheme.banner = ''
        this.EdithealthTheme.name = ''
        this.EdithealthTheme.url = ''
        this.EdithealthTheme.id = ''
        this.EdithealthTheme.banner = ''
        this.Visible = false
        this.VisibleEdit = false
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.healthTheme.url = resData
      },
      cropSuccess1(resData) {
        this.imagecropperShow1 = false
        this.imagecropperKey1 = this.imagecropperKey1 + 1
        this.EdithealthTheme.url = resData
      },
      close() {
        this.imagecropperShow = false
        this.imagecropperShow1 = false
      },
      image() {
        //初始化这个裁剪框
        var self = this;
        this.cropper = new Cropper(self.$refs.image, {
          aspectRatio: 5 / 2,
          viewMode: 1,
          background: false,
          zoomable: false,
          ready: function () {
            self.croppable = true;
          },
          dragMode: 'none',
          initialAspectRatio: 1,
          preview: '.before',
          autoCropArea: 0.6,
          zoomOnWheel: false,
          checkCrossOrigin: true
        });
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
            if (this.EdithealthTheme.id === "") {
              this.healthTheme.banner = res.data
            } else {
              this.EdithealthTheme.banner = res.data
            }
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
      this.fetchData()
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          findHealthTheme(this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      }
    },
  }
</script>

<style scoped>
  .cropper-content .cropper {
    width: auto;
    height: 300px;
  }

  .card-layout {
    margin: 8px;
  }

  .el-card__body {
    padding: 8px;
  }

  .el-dialog__title {
    line-height: 24px;
    font-size: 25px;
    color: #303133;
    font-family: Avenir;
    font-weight: bold;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
