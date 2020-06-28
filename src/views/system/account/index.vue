<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" size="small" v-if="hasPerm(`acc:role`)" class="el-icon-plus" style="float: right" round
                 @click="addRole">添加账号
      </el-button>
      <el-input style="width: 300px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search" size="small" clearable v-model="search" placeholder="请输入搜索内容" clearable />
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%"
        :default-sort="{prop: 'createdTime', order: 'descending'}"
        @sort-change="fetchData"
      >
        <el-table-column
          prop="createdTime"
          sortable
          label="日期"
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat('YYYY-MM-DD hh:mm') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trueName"
          align="center"
          label="姓名"
          sortable
        />
        <el-table-column
          prop="username"
          align="center"
          label="账号"
          sortable
        />
        <el-table-column
          prop="phoneNum"
          align="center"
          label="手机"
        />
        <el-table-column
          prop="roleName"
          label="角色"
          align="center"
        >
        </el-table-column>
        <!--<el-table-column prop="permission" align="center" label="拥有权限">
          <template slot-scope="props">
            <el-button type="text" @click="view(props.row.id)">查看详情</el-button>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center" width="330px">
          <template slot-scope="props">
            <el-button icon="el-icon-edit" type="primary" v-if="hasPerm(`acc:edit`)" round size="small" @click="edit(props.row.id)">编辑</el-button>
            <el-button icon="el-icon-view" type="primary" v-if="hasPerm(`acc:dele`)" round size="small" @click="view(props.row.id,props.row.roleName)">查看</el-button>
            <el-button icon="el-icon-delete" type="danger" v-if="hasPerm(`acc:dele`)" round size="small" @click="strike(props.row.id)">删除</el-button>
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
      title="账号详情"
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
        <div style="overflow-y: auto;">
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
  import {fetchData,finByUserId,deleteUser} from '../../../api/system/acount'
  export default {
    name: 'index',
    data() {
      let phone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号'))
        }
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          console.log(value)
          let arr = value + ''
          if (arr.length !== 11) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }
      }
      let pass = (rule, value, callback) => {
        if (value === ``) {
          callback(new Error('请输入密码'))
        } else {
          let arr = value + ''
          if (arr.length < 6) {
            callback(new Error('密码最低长度六位'))
          }
          if (this.user.confirmPassword !== ``) {
            this.$refs.user.validateField('confirmPassword')
          }
          callback()
        }
      }
      let confirmPassword = (rule, value, callback) => {
        let arr = value + ''
        if (value === ``) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.user.password) {
          callback(new Error('两次输入密码不一致'))
        } else if (arr.length < 6) {
          callback(new Error('密码最低长度六位数'))
        } else {
          callback()
        }
      }
      return {
        Visible: false,
        user: {
          trueName:'',
          username: '',
          phone: '',
          phoneNum:'',
          password: ``,
          confirmPassword: ``
        },
        count: 1,
        rules: {
          username: [
            /*将会成为您唯一的登入名*/
            { required: true, message: '请输入您的唯一登录名', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
          ],
          phone: [
            { validator: phone, trigger: 'blur' }
          ],
          password: [
            { validator: pass, trigger: 'blur' }
          ],
          confirmPassword: [
            { validator: confirmPassword, trigger: 'blur' }
          ]
        },
        cities: ['账号管理', '系统设置', '角色管理'],
        list: [],
        search: '',
        currentPage: 1,
        total: 0,
        size: 10,
        loading:false,
        role:null,
        user:{
          name:null
        }
      }
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          fetchData(this.currentPage,search,this.size,name,sort).then(res=>{
            if(res.queue.code===1){
              let data = res.data.list
              this.list=data
              this.total=res.data.total
            }
          })
        }
      }
    },
    methods: {
      fetchData(val ){
        let sort = 'desc'
        let name = 's.created_time'
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 's.created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 's.created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 's.created_time'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `trueName`) {
          if (val.order === undefined) {
            name = 's.true_name'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 's.true_name'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 's.true_name'
            sort = 'asc'
          }
        }
        if (val !== undefined && val.prop === `username`) {
          if (val.order === undefined) {
            name = 's.username'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 's.username'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 's.username'
            sort = 'asc'
          }
        }
        fetchData(this.currentPage,this.search,this.size,name,sort).then(res=>{
            if(res.queue.code===1){
            this.list=res.data.list
            this.total=res.data.total
            }
        })
      },
      cancel() {
        if (this.count === 1) {
          return
        } else {
          this.count--
        }
      },
      next(user) {
        this.$refs[user].validate((valid) => {
          if (valid) {
            this.count++
          } else {
            return false
          }
        })
      },
      nextUser() {
        if (this.count === 4) {
          return
        } else {
          this.count++
        }
      },
      edit(id) {
        this.list.forEach(item=>{
          if(item.id===id){
            this.$router.push({path:'/system/editUser',query:{id:id,name:item.trueName,phone:item.phoneNum,roleId:item.roleId}})
          }
        })
      },
      strike(id) {
        this.$confirm('是否删除此账号吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(res => {
            if (res.queue.code === 1) {
              this.mess(`删除成功`, 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      addRole(){
        this.$router.push({path:'/system/addAcc'})
      },
      view(id,roleName){
        finByUserId(id).then(res=>{
          if(res.queue.code===1){
            let arr =[]
            res.data.forEach(item=>{
              item.functions.forEach(key=>{
                arr.push(key)
              })
            })
            this.user.name=roleName
            this.role=arr
            this.Visible = true
          }
        })
      },
    },
    created() {
      this.fetchData()
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
</style>
<style>
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
