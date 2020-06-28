<template>
  <el-card class="card-layout">
    <el-form :model="doctor" ref="doctor" :rules="rules" label-width="100px" style="width: 40%;margin:auto">
      <el-form-item label="头像:" prop="url">
        <img v-if="doctor.url!==``" :src="doctor.url" style="border-radius: 50%;margin-left: 34%" width="80px"
             height="80px"/>
        <el-button type="primary" size="mini" style="float: right;margin-top: 30px" icon="el-icon-upload"
                   @click="imagecropperShow=true">
          上传图片
        </el-button>
      </el-form-item>
      <el-form-item label="医生名:" prop="name">
        <el-input v-model="doctor.name" size="small" type="text" maxlength="10" show-word-limit placeholder="请输入医生名"/>
      </el-form-item>
      <el-form-item label="医生岗位:" prop="job">
        <el-input v-model="doctor.job" placeholder="请输入医生岗位"/>
      </el-form-item>
      <el-form-item label="擅长主治:" prop="adeptDisease">
        <el-input type="textarea"
                  maxlength="100"
                  show-word-limit
                  v-model="doctor.adeptDisease"
                  placeholder="请输入医生的擅长主治"/>
      </el-form-item>
      <el-form-item label="个人简介:" prop="introduce">
        <el-input type="textarea" maxlength="200" show-word-limit v-model="doctor.introduce" placeholder="请输入个人简介"/>
      </el-form-item>
      <el-form-item label="出诊医院:" prop="hospitalName">
        <el-input v-model="doctor.hospitalName" type="text" maxlength="20" show-word-limit placeholder="请输入出诊医院名"/>
      </el-form-item>
      <el-form-item label="医院地址:" prop="address">
        <el-input v-model="doctor.address" size="small" type="text" maxlength="20" show-word-limit
                  placeholder="请输入医院地址"/>
      </el-form-item>
      <el-form-item label="选择主题:" prop="themeIds">
        <el-select v-model="doctor.themeIds"
                   style="width: 100%;"
                   multiple
                   clearable
                   size="small"
                   placeholder="请选择一个健康主题">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二维码:" prop="healthThemeId">
        <el-upload
          class="avatar-uploader"
          name="multipartFile"
          action="/server/health/videoUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="doctor.qrCode" :src="doctor.qrCode" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="small" round @click="QX">取消</el-button>
        <el-button type="primary" size="small" round @click="onSubmit(`doctor`)">确认</el-button>
      </el-form-item>
    </el-form>
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
  </el-card>
</template>

<script>
  import ImageCropper from '@/components/ImageCropper'
  import {findDoctorById, updateDoctors, findHealthThemeAll} from '@/api/health/doctors'

  export default {
    name: "index",
    components: {ImageCropper},
    data() {
      return {
        doctor: {
          name: null,
          introduce: null,
          themeIds: [],
          url: null,
          hospitalName: null,
          doctorName: null,
          department: null,
          adeptDisease: null,
          qrCode: null,
          job: null
        },
        options: null,
        rules: {
          url: [
            {required: true, message: '请上传一张医生图片', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入医生姓名', trigger: 'blur'}
          ],
          job: [
            {required: true, message: '请输入医生岗位', trigger: 'blur'}
          ],
          adeptDisease: [
            {required: true, message: '请输入医生擅长主治', trigger: 'blur'}
          ],
          introduce: [
            {required: true, message: '请输入医生个人简介', trigger: 'blur'}
          ],
          hospitalName: [
            {required: true, message: '请输入医生出诊医院名', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入医生出诊医院地址', trigger: 'blur'}
          ],
          themeIds: [
            {required: true, message: '请选择主题', trigger: 'change'}
          ],

        },
        imagecropperShow: false,
        imagecropperKey: 0,
      }
    },
    methods: {
      onSubmit(doctor) {
        this.$refs[doctor].validate((valid) => {
          if (valid) {
            updateDoctors(this.doctor).then(res => {
              if (res.queue.code === 1) {
                this.mess('修改成功', 'success')
                this.$router.push({path: '/health/doctors'})
              }
            })
          } else {
            return false
          }
        })
      },
      QX() {
        this.$router.push({path: '/health/doctors'})
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.doctor.url = resData
      },
      close() {
        this.imagecropperShow = false
      },
      handleAvatarSuccess(res, file) {
        this.doctor.qrCode = res.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
    created() {
      findHealthThemeAll().then(res => {
        if (res.queue.code === 1) {
          this.options = res.data.list
          findDoctorById(this.$route.query.id).then(res => {
            if (res.queue.code == 1) {
              this.doctor = res.data
              this.doctor.themeIds=[]
              res.data.littleHealthThemes.forEach(item => {
                this.doctor.themeIds.push(item.id)
              })
            }
          })
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
