<template>
  <div v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-card class="card-layout">
      <el-button type="primary" size="small" class="el-icon-plus" style="float: right" round
                 v-if="hasPerm('rol:add')"  @click="addRole">添加角色
      </el-button>
      <el-input style="width: 300px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search" size="small" v-model="search" placeholder="请输入搜索内容" clearable/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data=list
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        @sort-change="fetchData"
        style="width: 100%">
        <el-table-column
          prop="createdTime"
          sortable
          align="center"
          label="日期">
          <template slot-scope="props">
            {{props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="roleName"
          sortable
          label="角色名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="role"
          align="center"
          label="拥有权限">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" v-if="hasPerm('rol:dele')" class="el-icon-edit" @click="edit(props.row.id)" round>编辑</el-button>
            <el-button type="primary" size="small" v-if="hasPerm('rol:view')" class="el-icon-view" @click="view(props.row.id)" round>查看</el-button>
            <el-button type="danger" size="small" v-if="hasPerm('rol:dele')" class="el-icon-delete" @click="strike(props.row.id)" round>删除
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
      title="角色详情"
      :visible.sync="Visible"
      width="70%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      align="center">
      <div style="border: 1px solid #EFEEF0">
        <el-row style="background: #EFEEF0">
          <el-col>
            <div style="padding: 10px">
              <el-form ref="user" :model="user" :rules="rules" label-width="80px">
                <el-form-item label="角色名:" id="roleID" prop="name">
                  <el-input disabled v-model="user.name" style="width: 20%;float: left" placeholder="请输入角色名"/>
                </el-form-item>
              </el-form>
              <div style="height: 8px"/>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :spam="24" style="border: 1px solid #EFEEF0">
            <div class="div-font" style="float: left">拥有权限：</div>
          </el-col>
        </el-row>
        <div style="overflow-y: auto;height: 300px">
          <el-row v-for="item  in role">
            <el-col :span="6" style="padding: 20px;border-bottom: 1px solid #EFEEF0;border-right: 1px solid #EFEEF0;">
              <el-checkbox class="checkbox-layout"
                           style="font-weight: bold;font-size: 16px;padding-left: 30%;color:rgba(0, 0, 0, 1)">
                <h4 style="padding: 0px;margin: 0px">{{item.functionName}}</h4>
              </el-checkbox>
            </el-col>
            <el-row :sapn="18" style="border-left: 1px solid #EFEEF0;border-bottom: 1px solid #EFEEF0;">
              <div style="padding: 20px">
                <el-checkbox class="checkbox-layout" v-for="city in item.buttons" :label="city.id" :key="city.id"
                             style="font-weight: bold;font-size: 14px;margin-left: 10px;color:rgba(102, 102, 102, 1);float: left">
                  <h5 style="padding: 0px;margin: 0px">{{city.name}}</h5>
                </el-checkbox>
              </div>
            </el-row>
          </el-row>
        </div>
      </div>
      <el-button type="primary" @click="Visible = false" round size="small">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { deleteRole, fetchData} from '@/api/system/role/role'

  export default {
    name: 'index',
    data() {
      return {
        list: [],
        search: '',
        currentPage: 1,
        total: 0,
        size: 10,
        loading: false,
        Visible: false,
        user: {
          name: '',
          textarea: ''
        },
        cities: ['添加按钮', '删除按钮', '编辑按钮', '禁用按钮'],
        role: [],
        rules: {
          name: [
            { validator: name, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'rcreatedtime'
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 'sr.created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'sr.created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'sr.created_time'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `roleName`) {
          if (val.order === undefined) {
            name = 'sr.role_name'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'sr.role_name'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'sr.role_name'
            sort = 'asc'
          }
        }
        fetchData(this.currentPage, this.search, this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            let data = res.data.list
            for (let i = 0; i < data.length; i++) {
              for (let r = 0; r < data[i].parentFunctions.length; r++) {
                data[i].role = data[i].parentFunctions[r].pfName
              }
            }
            this.list = data
            this.total = res.data.total
          }
        })
      },
      edit(id) {
        let name = ''
        this.list.forEach(item=>{
          if(item.id===id){
            name=item.roleName
          }
        })
        this.$router.push({ path: '/system/editRole', query: { id:id,name: name} })
      },
      strike(id) {
        this.$confirm('是否删除此角色', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(id).then(res => {
            if (res.queue.code === 1) {
              this.mess(`删除成功`, 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      addRole() {
        this.$router.push({ path: '/system/addRole' })
      },
      view(id) {
        this.list.forEach(item => {
          if (item.id === id) {
            this.user.name = item.roleName
            item.parentFunctions.forEach(val => {
               val.functions.forEach(item=>{
                 this.role.push(item)
               })
            })
          }
        })
        this.Visible = true
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          this.fetchData()
        }
      }
    }
  }
</script>

<style scoped>
  .card-layout {
    margin: 8px;
  }

  .el-card__body {
    padding: 8px;
  }

  .el-dialog__title {
    line-height: 24px;
    font-size: 25px;
    color: #bfcbd9;
    font-family: Avenir;
    font-weight: bold;
  }
  .el-card__body {
    padding: 8px;
  }

  .checkbox-layout .el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 0px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #FFF;
    z-index: 1;
  }
</style>
