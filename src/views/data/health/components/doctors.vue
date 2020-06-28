<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="出诊医院">
              <span>{{ props.row.hospitalName }}</span>
            </el-form-item>
            <el-form-item label="擅长主治">
              <span>{{ props.row.adeptDisease }}</span>
            </el-form-item>
            <el-form-item label="医院地址">
              <span>{{ props.row.address}}</span>
            </el-form-item>
            <el-form-item label="个人简介">
              <span>{{ props.row.introduce }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="上传时间"
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="url"
        align="center"
        label="医生头像">
        <template slot-scope="props">
          <el-image
            style="width: 80px; height: 80px;border-radius: 50%"
            :src="props.row.url"
            :preview-src-list="[props.row.url]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="healthThemeName"
        align="center"
        label="所属分类">
      </el-table-column>

      <el-table-column
        prop="num"
        align="center"
        sortable
        label="被关注数"
      />
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
  </div>
</template>

<script>
  import {findDoctor} from '@/api/data/index'
  import {findDoctors, findHealthThemeAll,deleteDoctors} from '@/api/health/doctors'
  export default {
    name: "doctorsData",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        options:null
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'created_time'
        findDoctor(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.list.forEach(item => {
              item.id = item.doctor.id
              item.name = item.doctor.name
              item.url = item.doctor.url
              item.hospitalName = item.doctor.hospitalName
              item.adeptDisease = item.doctor.adeptDisease
              item.introduce = item.doctor.introduce
              item.address = item.doctor.address
              item.healthThemeId = item.doctor.healthThemeId
              item.createdTime = item.doctor.createdTime
              item.num = item.num
              this.options.forEach(val=>{
                if(item.healthThemeId===val.id){
                  item.healthThemeName=val.name
                }
              })
            })
            this.total = res.data.total
          }
        })
      },
    },
    created() {
      findHealthThemeAll().then(res => {
        if (res.queue.code === 1) {
          this.options = res.data.list
          this.fetchData()
        }
      })
    },
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
