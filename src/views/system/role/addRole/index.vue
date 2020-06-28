<template>
  <el-card class="card-layout">
    <div style="border: 1px solid #EFEEF0">
      <el-row style="background: #EFEEF0">
        <el-col :span="24" align="center">
          <div class="div-title">添加角色</div>
        </el-col>
      </el-row>
      <el-row style="background: #EFEEF0">
        <el-col>
          <div style="padding: 10px">
            <el-form ref="user" :model="user" :rules="rules" label-width="80px">
              <el-form-item label="角色名:" id="roleID" prop="name">
                <el-input v-model="user.name" type="text" maxlength="10" show-word-limit style="width: 20%" placeholder="请输入角色名"/>
              </el-form-item>
            </el-form>
            <div style="height: 8px"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :spam="24" style="border: 1px solid #EFEEF0">
          <div class="div-font">拥有权限：</div>
        </el-col>
      </el-row>
      <div style="overflow-y: auto;height: 400px">
        <el-row v-for="item  in role">
          <el-col :span="6" style="padding: 20px;border-bottom: 1px solid #EFEEF0;border-right: 1px solid #EFEEF0;">
            <el-checkbox-group v-model="roles" @change="check(item.flag,item.id)"
                               style="font-weight: bold;font-size: 16px;padding-left: 30%;color:rgb(40, 52, 67)">
              <el-checkbox style="padding: 0px;margin: 0px" :label="item.id" :key="item.id">
                {{item.functionName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-row :sapn="18" style="border-left: 1px solid #EFEEF0;border-bottom: 1px solid #EFEEF0;">
            <div style="padding: 20px">
              <el-checkbox-group v-for="city in item.buttons" v-if="item.buttons.length!==null" v-model="button"
                                 @change="checkout(city.id,city.flag)"
                                 style="font-weight: bold;margin-left: 10px;float: left">
                <el-checkbox :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-row>
        </el-row>
      </div>
    </div>
    <el-row>
      <el-col :sapn="24" align="center" style="padding-top:5px">
        <el-button size="small" round type="primary" @click="cancel">取消</el-button>
        <el-button size="small" round type="primary" @click="submit(`user`)">确定</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  import {getRoleId, addRole, editRole, getRoleList} from '@/api/system/role/role'

  export default {
    name: 'addRole',
    data() {
      let name = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入角色名'))
        }
        let arr = value + ''
        if (arr.length < 2) {
          callback(new Error('最少输入两个字符'))
        } else {
          callback()
        }
      }
      return {
        user: {
          id: '',
          name: ''
        },
        role: [],
        rules: {
          name: [
            {validator: name, trigger: 'blur'}
          ]
        },
        roles: [],
        button: []
      }
    },
    methods: {
      fetchData() {
        getRoleList().then(res => {
          if (res.queue.code === 1) {
            let data = res.data
            data.forEach(item => {
              item.functions.forEach(val => {
                this.role.push(val)
              })
            })
            this.role.forEach(key => {
              key.flag = false
              key.buttons.forEach(val => {
                val.flag = false
              })
            })
          }
        })
      },
      submit(user) {
        this.$refs[user].validate((valid) => {
          if (valid) {
            if (this.user.id) {
              if (this.button !== [] && this.roles !== []) {
                let obj = {
                  id: this.user.id,
                  buttonIds: this.button,
                  functionIds: this.roles,
                  roleName: this.user.name
                }
                editRole(obj).then(res => {
                  if (res.queue.code === 1) {
                    this.mess('修改成功', 'success')
                    this.user.name = ''
                    this.user.id = ''
                    this.roles = []
                    this.button = []
                    this.$router.push({path: 'role'})
                  }
                })
              }
            } else {
              if (this.button !== [] && this.roles !== []) {
                let buttonIds = this.button
                let functionIds = this.roles
                let roleName = this.user.name
                let obj = {
                  buttonIds: this.button,
                  functionIds: this.roles,
                  roleName: this.user.name
                }
                addRole(obj).then(res => {
                  if (res.queue.code === 1) {
                    this.mess('添加成功', 'success')
                    this.user.name = ''
                    this.roles = []
                    this.button = []
                    this.$router.push({path: 'role'})
                  }
                })
              }
            }
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push({path: 'role'})
      },
      check(flag, id) {
        if (flag) {
          this.roles.slice(this.roles.indexOf(id), 1)
          this.role.forEach(key => {
            if (key.id === id) {
              let arr = []
              key.buttons.forEach(item => {
                arr.push(item.id)
                item.flag = false
              })
              let add = this.button.filter(item => !arr.some(ele => ele === item));
              this.button = []
              this.button = add
              key.flag = false
            }
          })
        } else {
          this.role.forEach(key => {
            if (key.id === id) {
              key.flag = true
              key.buttons.forEach(item => {
                item.flag = true
                this.button.push(item.id)
              })
            }
          })
        }
      },
      checkout(id,flag) {
        if(flag) {
          let arr = []
          this.role.forEach(item => {
            item.buttons.forEach(key => {
              if(id === key.id){
                arr=(item.buttons)
              }
            })
          })
          console.log(this.button)
          arr.forEach(val=>{
            console.log(val.id)
            console.log(!this.button.indexOf(val.id) > -1,'this.button.indexOf(val.id) > -1')
            if(!this.button.indexOf(val.id) > -1){
              this.role.forEach(item => {
                item.buttons.forEach(key => {
                  if (id === key.id) {
                    if (this.roles.indexOf(item.id) > -1) {
                      key.flag = false
                    } else {
                      item.flag = false
                      key.flag = false
                      this.roles.splice(this.roles.indexOf(item.id),1)
                    }
                  }
                })
              })
            }
          })
        }else{
          this.role.forEach(item => {
            item.buttons.forEach(key => {
              if (id === key.id) {
                if (this.roles.indexOf(item.id) > -1) {
                  key.flag = true
                } else {
                  item.flag = true
                  key.flag = true
                  this.roles.push(item.id)
                }
              }
            })
          })
        }
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>
<style>
  .div-title {
    color: #606266;
    padding: 15px 15px;
    background: #f2f6fc;
    font-weight: 700;
  }

  .div-font {
    font-size: 14px;
    font-family: "Andale Mono";
    color: #99a9bf;
    padding: 3px;
  }

  #roleID.el-form-item {
    padding: 0px;
    margin: 0px;
  }
</style>
