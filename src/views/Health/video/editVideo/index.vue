<template>
  <el-card class="card-layout">
    <el-form :model="video" ref="article" :rules="rules" label-width="100px" style="width: 40%;margin:auto">
      <el-form-item label="标题:" prop="name">
        <el-input v-model="video.name" type="text" maxlength="50" show-word-limit placeholder="请输入视频名称"/>
      </el-form-item>
      <el-form-item label="医生名:" prop="doctorName">
        <el-input v-model="video.doctorName" type="text" maxlength="20" show-word-limit placeholder="请输入医生名"/>
      </el-form-item>
      <el-form-item label="医生岗位:" prop="department">
        <el-input v-model="video.department" type="text" maxlength="20" show-word-limit placeholder="请输入医生岗位"/>
      </el-form-item>
      <el-form-item label="健康主题:" prop="healthThemeId">
        <el-select v-model="video.healthThemeId"
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
      <el-form-item label="视频上传:" prop="url">
        <el-upload class="upload-demo"
                   :on-remove="handleRemove"
                   drag
                   style="width: 100%"
                   :file-list="filsListArray"
                   action="/server/health/videoUpload"
                   name="multipartFile"
                   :on-success="successuploadhandle"
                   accept="video"
                   :before-upload="beforeUploadVideo">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            <em>
              <span>一次只看上传一部视频,请先删除之前的视频。
              <br/>
              视频格式推荐使用MP4
            </span>
            </em>
          </div>
        </el-upload>
      </el-form-item>
      <br/>
      <br/>
      <el-form-item label="视频预览:">
        <video width="320" height="240" :src="src" controls id="upvideo">
        </video>
      </el-form-item>
    </el-form>
    <el-dialog
      title="视频预览"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="40%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center;"
      class="dialog-layout"
    >
      <hr/>
      <video width="320" height="240" controls :src="video.url"></video>
      <br/>
      <el-button type="primary" size="small" round @click="Visible=false">关闭</el-button>
    </el-dialog>
    <el-form ref="form" label-width="80px">
      <el-form-item label="简介:" prop="content">
        <tinymce v-model="video.introduce" :height="400"/>
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
  import {updateVideo, findHealthThemeAll, findVideoById} from '@/api/health/index'
  import {files} from '@/api/user'
  import data2blob from '@/components/ImageCropper/utils/data2blob'

  export default {
    name: "index",
    components: {Tinymce},
    data() {
      return {
        video: {
          id: '',
          name: ``,
          introduce: ``,
          healthThemeId: ``,
          url: ``,
          doctorName: ``,
          department: ``,
          coverUrl: ''
        },
        src: '',
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
          introduce: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
        },
        filsListArray: [],
        Visible: false,
        url: null,
        file: null,
      }
    },
    methods: {
      onSubmit(article) {
        this.$refs[article].validate((valid) => {
          if (valid) {
            updateVideo(this.video).then(res => {
              if (res.queue.code === 1) {
                this.mess('编辑成功', 'success')
                this.$router.push({path: '/health/avideo'})
              }
            })
          } else {
            return false
          }
        })
      },
      QX() {
        this.$router.push({path: '/health/avideo'})
      },
      canvasVideo() {
        var canvas = document.createElement('canvas');
        var video = document.createElement('video');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 300, 200);
        var src = canvas.toDataURL('image/jpeg');
        canvas.toDataURL(`image/jpeg`, 0.92);
        video.addEventListener('loadeddata', function (e) {
          canvas.width = this.videoWidth
          canvas.height = this.videoHeight
          width = this.videoWidth
          height = this.videoHeight
          ctx.drawImage(this, 0, 0, width, height);
          var src = canvas.toDataURL('image/jpeg');
          img.src = src;
        })
      },
      successuploadhandle(response, file, fileList) {
        if (response.queue.code === 1) {
          this.video.url = response.data
          this.findvideocover()
          this.mess('添加成功', 'success')
        } else {
          this.mess(response.queue.message, 'warning')
        }
      },
      exceedhandle(files, fileList) {

      },
      beforeUploadVideo(file) {
        if ([
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1) {
          this.$message.error("请上传正确的视频格式");
          return false;
        }
        this.file = file
      },
      findvideocover() {
        let _this = this
        let url = URL.createObjectURL(this.file)
        this.$nextTick(() => {
          let video = document.getElementById("upvideo");
          let source = document.createElement("source");
          this.src = ''
          this.src = url
          source.type = "video/mp4";
          video.appendChild(source);
          video.addEventListener("loadeddata", function () {
            setTimeout(() => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = this.videoWidth
              canvas.height = this.videoHeight
              let width = this.videoWidth
              let height = this.videoHeight
              ctx.drawImage(video, 0, 0, width, height);
              var src = canvas.toDataURL('image/png');
              this.url = src
              let formData = new FormData()
              formData.append(
                `multipartFile`,
                data2blob(src, 'image/png'),
                _this.file.name.slice(0, _this.file.name.indexOf('.')) + '.png',
              )
              files(formData).then(res => {
                _this.video.coverUrl = res.data
              })
            }, 500)
          })
        })
      },
      showvideohandle() {
        this.$alert(
          `<video width="320" height="240" controls>
                      <source src="${
            this.filsListArray[0].url
          }"  type="video/mp4">
                      您的浏览器不支持 HTML5 video 标签。
                    </video>`,
          "视频预览",
          {
            dangerouslyUseHTMLString: true
          }
        );
      },
      handleRemove(file, fileList) {
        this.file = ''
        this.filsListArray = []
        this.video.url = null
        this.src = ''
      },
    },
    created() {
      findHealthThemeAll().then(res => {
        if (res.queue.code === 1) {
          this.options = res.data.list
        }
      })
      findVideoById(this.$route.query.id).then(res => {
        if (res.queue.code === 1) {
          this.video.id = res.data.id
          this.video.introduce = res.data.introduce
          this.video.coverUrl = res.data.coverUrl
          this.video.name = res.data.name
          this.video.healthThemeId = res.data.healthThemeId
          this.video.url = res.data.url
          this.video.doctorName = res.data.doctorName
          this.video.department = res.data.department
          this.filsListArray = [{url: res.data.url, name: res.data.url}]
        }
      })
    }
  }
</script>

<style scoped>
  .upload-demo {
    height: 182px;
  }
</style>
