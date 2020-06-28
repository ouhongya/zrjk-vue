<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" size="small" v-if="hasPerm(`doct:add`)" class="el-icon-plus" style="float: right" round
                 @click="addArticle()">
        添加医生
      </el-button>
      <el-select v-model="id"
                 size="small"
                 placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search"
                size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label=所属标签">
                <div v-for="item in props.row.littleHealthThemesa">{{item.name}}</div>
              </el-form-item>
              <el-form-item label="个人简介">
                <span>{{ props.row.introduce }}</span>
              </el-form-item>
              <el-form-item label="医生岗位">
                <span>{{ props.row.job }}</span>
              </el-form-item>
              <el-form-item label="出诊医院">
                <span>{{ props.row.hospitalName }}</span>
              </el-form-item>
              <el-form-item label="擅长主治">
                <span>{{ props.row.adeptDisease }}</span>
              </el-form-item>
              <el-form-item label="医院地址">
                <span>{{ props.row.address}}</span>
              </el-form-item>
              <el-form-item label="所属主题">
                <el-tag
                  v-for="tag in props.row.littleHealthThemes"
                  :key="tag.id"
                  type="primary">
                  {{tag.name}}
                </el-tag>
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
          align="center"
          width="300px"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" round @click="editArticle(props.row.id)" v-if="hasPerm(`doct:edit`)">
              编辑
            </el-button>
            <el-button type="danger" size="small" round
                       @click="deleArticle(props.row.id)" v-if="hasPerm(`doct:dele`)">删除
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
      <el-dialog
        :title="title"
        :visible.sync="Visible"
        :close-on-click-modal="false"
        custom-class="customWidth"
        width="50%"
        :close-on-press-escape="false"
        show-clos="false"
        style="text-align: center;"
        class="dialog-layout"
      >
        <hr/>
        <div v-html="content"/>
        <el-button type="primary" size="small" round @click="content=null,title=null,Visible=false">取消</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {findDoctors, findHealthThemeAll, deleteDoctors} from '@/api/health/doctors'

  export default {
    name: "index",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        options: null,
        id: 'default',
        content: null,
        Visible: false,
        title: null,
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'created_time'
        findDoctors(this.id, this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.list.forEach(item => {
              this.options.forEach(val => {
                if (item.healthThemeId === val.id) {
                  item.healthThemeName = val.name
                }
              })
            })
            this.total = res.data.total
          }
        })
      },
      addArticle() {
        this.$router.push({path: '/health/addDoctors'})
      },
      editArticle(id) {
        this.$router.push({path: '/health/editDoctors', query: {id: id}})
      },
      deleArticle(id) {
        this.$confirm('是否删除此医生?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDoctors(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
    },
    created() {
      findHealthThemeAll().then(res => {
        if (res.queue.code === 1) {
          this.options = res.data.list
          this.options.push({id: 'default', name: '全部'})
          this.fetchData()
        }
      })
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          findDoctors(this.id, this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      },
      id(id) {
        if (id !== '' || id !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'name'
          findDoctors(id, this.currentPage, '', this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .card-layout {
    margin: 8px;
  }

  .el-image-layout {
    border-radius: 50%;
  }

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
<style>

</style>
