<template>
  <div>
    <el-card class="card-layout">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-steps :active="count" align-center>
            <el-step title="基本信息"/>
            <el-step title="角色选择"/>
            <el-step title="功能选择"/>
            <el-step title="完成"/>
          </el-steps>
          <br/>
        </el-col>
        <el-col :span="24" v-if="count===1">
          <el-form ref="user" :model="user" :rules="rules" class="form-layout" label-width="85px">
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="user.name" placeholder="请输入姓名" type="text" maxlength="10" show-word-limit/>
            </el-form-item>
            <el-form-item label="手机:" prop="phone">
              <el-input v-model.number="user.phone" placeholder="请输入手机号" type="text" maxlength="11" show-word-limit/>
            </el-form-item>
            <el-form-item label="账号:" prop="username">
              <el-input v-model="user.username" placeholder="请输入账号（最少6位数）" type="text" maxlength="10" show-word-limit/>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input v-model="user.password" type="password" placeholder="请输入密码（最少6位数）" maxlength="18"
                        show-word-limit/>
            </el-form-item>
            <el-form-item label="确认密码:" prop="confirmPassword">
              <el-input v-model="user.confirmPassword" type="password" placeholder="请确认密码（最少6位数）" maxlength="18"
                        show-word-limit/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-if="count===2" style="padding-right: 60px;padding-left: 45px;overflow-x: auto;">
        <el-col :span="24" v-for="role  in  roles" style="padding: 10px;">
          <el-checkbox-group v-model="checkRole">
            <el-checkbox style="margin-left: 6%" :key="role.id" :label="role.id"
                         @change="checkOutRole(role.flag,role.id)">
              <h3 style="padding: 5px;margin: 0px">{{role.roleName}}</h3></el-checkbox>
          </el-checkbox-group>
          <div v-for="item in role.parentFunctions">
            <el-checkbox-group v-model="parent">
              <el-checkbox disabled :key="item.id" style="margin-left: 12%" :label="item.uid"><h4
                style="padding: 5px;margin: 0px">{{item.pfName}}</h4></el-checkbox>
            </el-checkbox-group>
            <div v-for=" val in item.functions">
              <el-checkbox-group v-model="viwe">
                <el-checkbox disabled :key="val.id" style="margin-left: 18%;float: left" :label="val.uid"><h5
                  style="padding: 5px;margin: 0px">{{val.functionName}}</h5></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="count===3" v-for="item  in roleList" style="overflow-x: hidden">
        <el-col :span="8" style="padding: 20px;border: 1px solid #EFEEF0">
          <el-checkbox-group v-model="functionName">
            <el-checkbox :label="item.id" :key="item.id" style="margin-left: 30%" @change="check(item.flag,item.id)">
              <h3 style="padding: 5px;margin: 0px">{{item.functionName}}</h3>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="16" style="padding: 20px;border: 1px solid #EFEEF0">
          <el-checkbox-group v-for="city in item.buttons" v-model="buttons">
            <el-checkbox :label="city.id" :key="city.id" @change="checkButton(city.flag,city.id)"
                         style="float: left;margin-right: 10px">
              <h4 style="padding: 5px;margin: 0px">{{city.name}}</h4>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row v-show="buttons.indexOf(`AC0A573635234A948A7CD937A9DEF516`) > -1&&count===3">
        <el-col :span="8" v-show="buttons.indexOf(`AC0A573635234A948A7CD937A9DEF516`) > -1"
                style="padding: 20px;border: 1px solid #EFEEF0">
          <h4 style="padding: 5px;margin: 0px;margin-left: 37%;color: #888888">请选择医生</h4>
        </el-col>
        <el-col :span="16" style="padding: 20px;border: 1px solid #EFEEF0">
          <el-checkbox-group v-for="city in doctors" v-model="doctor">
            <el-checkbox :label="city.id" :key="city.id"
                         style="float: left;margin-right: 10px">
              <h4 style="padding: 5px;margin: 0px">{{city.name}}</h4>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="count===4">
        <el-col :span="8">
          <el-form ref="user" :model="user" :rules="rules" style="margin-left: 15%" label-width="85px">
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="user.name" placeholder="请输入姓名" type="text" maxlength="10" show-word-limit/>
            </el-form-item>
            <el-form-item label="手机:" prop="phone">
              <el-input v-model.number="user.phone" placeholder="请输入手机号" type="text" maxlength="11" show-word-limit/>
            </el-form-item>
            <el-form-item label="账号:" prop="username">
              <el-input v-model="user.username" placeholder="请输入账号（最少6位数）" type="text" maxlength="10" show-word-limit/>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input v-model="user.password" type="password" placeholder="请输入密码（最少6位数）" maxlength="18"
                        show-word-limit/>
            </el-form-item>
            <el-form-item label="确认密码:" prop="confirmPassword">
              <el-input v-model="user.confirmPassword" type="password" placeholder="请确认密码（最少6位数）" maxlength="18"
                        show-word-limit/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="float: right" :span="14" align="center">
          <div>
            <h4 style="color: #2b2f3a; padding: 0px;margin: 10px;margin-right:20%;margin-top: 0">角色:
              <ins>{{roleName}}</ins>
            </h4>
          </div>
          <div><h5 style=" color: #97a8be;padding: 0px;margin: 10px;margin-right: 88%">拥有权限:</h5></div>
        </el-col>
        <el-col :span="14" style="overflow-x: hidden;float: right">
          <el-col style="float: right" v-for="item  in obj">
            <el-col :span="4"
                    style="padding-top: 10px;padding-bottom:10px;padding-right: 0px;padding-left:0px;border: 1px solid #EFEEF0;height: 100%">
              <el-checkbox class="check" :label="item.functionName" :key="item.functionName"
                           @change="check(item.flag,item.id)">
                <h4 style="padding: 5px;margin: 0px;">{{item.roleListName}}</h4>
              </el-checkbox>
            </el-col>
            <el-col :span="16" style="padding: 10px;border: 1px solid #EFEEF0">
              <el-checkbox class="check" v-for="city in item.buttons" :key="city.buttonName">
                <h4 style="padding: 5px;margin: 0px">{{city.buttonName}}</h4>
              </el-checkbox>
            </el-col>
          </el-col>
          <el-col style="float: right" v-if="doctor!==[]">
            <el-col :span="4"
                    style="padding-top: 10px;padding-bottom:10px;padding-right: 0px;padding-left:0px;border: 1px solid #EFEEF0;height: 100%">
              <el-checkbox class="check">
                <h4 style="padding: 5px;margin: 0px;">已选医生</h4>
              </el-checkbox>
            </el-col>
            <el-col :span="16" style="padding: 10px;border: 1px solid #EFEEF0">
              <el-checkbox class="check" v-for="city in doctors" :key="city.name">
                <h5 style="padding: 5px;margin: 0px" v-if="doctor.indexOf(city.id) > -1">{{city.name}}</h5>
              </el-checkbox>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" align="center" style="padding-top: 20px">
          <el-button type="primary" size="small" round v-if="count===1" @click="cancel"><i
            class="el-icon-close"/>&nbsp;&nbsp;取消
          </el-button>
          <el-button type="primary" size="small" round v-if="count===2" icon="el-icon-arrow-left" @click="cancel">
            上一步
          </el-button>
          <el-button type="primary" size="small" round v-if="count===3" icon="el-icon-arrow-left" @click="cancel">
            上一步
          </el-button>
          <el-button type="primary" size="small" round v-if="count===4" icon="el-icon-arrow-left" @click="cancel">
            上一步
          </el-button>
          <el-button type="primary" size="small" round v-if="count===1" @click="next(`user`)">下一步<i
            class="el-icon-arrow-right el-icon--right"/></el-button>
          <el-button type="primary" size="small" round v-if="count===2" @click="nextUser">下一步<i
            class="el-icon-arrow-right el-icon--right"/></el-button>
          <el-button type="primary" size="small" round v-if="count===3" @click="nextUser">下一步<i
            class="el-icon-arrow-right el-icon--right"/></el-button>
          <el-button type="primary" size="small" round v-if="count===4" @click="next(`user`)">完成&nbsp;&nbsp;<i
            class="el-icon-arrow-right el-icon-check"/></el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {addUser, fetchDataByRole} from '@/api/system/acount/index'
  import {getRoleList} from '@/api/system/role/role'
  import {findDoctorsAll} from '@/api/health/doctors'

  export default {
    name: 'index',
    data() {
      let name = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入您的真实姓名'))
        } else {
          callback()
        }
      }
      let username = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入您的唯一登录名'))
        } else {
          callback()
        }
        let arr = value + ''
        if (arr.length < 6 || arr.length > 10) {
          return callback(new Error('长度在 6 到 10 个字符'))
        } else {
          callback()
        }
      }
      let phone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入您的手机号'))
        }
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {

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
          if (arr === '123456') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr === '654321') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr === '1234567') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr === '7654321') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr === '12345678') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr === '87654321') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr === '123456789') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr === '987654321') {
            callback(new Error('密码过于简单,请重新输入'))
          } else {
            callback()
          }
          if (arr.length < 6) {
            callback(new Error('密码最低长度六位'))
          } else {
            callback()
          }
          if (this.user.confirmPassword !== ``) {
            this.$refs.user.validateField('confirmPassword')
          } else {
            callback()
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
        } else if (arr === '123456') {
          callback(new Error('密码过于简单,请重新输入'))
        } else if (arr === '654321') {
          callback(new Error('密码过于简单,请重新输入'))
        } else if (arr === '1234567') {
          callback(new Error('密码过于简单,请重新输入'))
        } else if (arr === '7654321') {
          callback(new Error('密码过于简单,请重新输入'))
        } else if (arr === '12345678') {
          callback(new Error('密码过于简单,请重新输入'))
        } else if (arr === '87654321') {
          callback(new Error('密码过于简单,请重新输入'))
        } else if (arr === '123456789') {
          callback(new Error('密码过于简单,请重新输入'))
        } else if (arr === '987654321') {
          callback(new Error('密码过于简单,请重新输入'))
        } else {
          callback()
        }
      }
      return {
        user: {
          name: '',
          username: '',
          phone: '',
          password: ``,
          confirmPassword: ``
        },
        count: 1,
        rules: {
          username: [{validator: username, trigger: 'blur'}],
          phone: [
            {validator: phone, trigger: 'blur'}
          ],
          name: [
            {validator: name, trigger: 'blur'}
          ],
          password: [
            {validator: pass, trigger: 'blur'}
          ],
          confirmPassword: [
            {validator: confirmPassword, trigger: 'blur'}
          ]
        },
        roles: [],
        role: [],
        checkRole: [],
        parent: [],
        viwe: [],
        roleList: [],
        functionName: [],
        buttons: [],
        roleName: '',
        obj: [],
        doctors: [],
        doctor: [],
        RoleAll: null
      }
    },
    methods: {
      cancel() {
        if (this.count === 1) {
          this.$router.push({path: '/system/account'})
          return
        } else {
          this.count--
          return
        }
      },
      next(user) {
        this.$refs[user].validate((valid) => {
          if (valid) {
            if (this.count === 4) {
              let functionName = Array.from(new Set(this.functionName))
              let buttons = Array.from(new Set(this.buttons))
              let obj = {
                phoneNum: this.user.phone + '',
                roleId: this.checkRole[0],
                trueName: this.user.name,
                username: this.user.username,
                buttonIds: buttons,
                functionIds: functionName,
                password: this.user.password,
                doctorIds: this.doctor
              }
              addUser(obj).then(res => {
                if (res.queue.code === 1) {
                  this.mess('添加成功', 'success')
                  this.$router.push({path: '/system/account'})
                }
              })
            } else {
              this.count++
            }
          } else {
            return false
          }
        })
      },
      nextUser() {
        if (this.count === 2) {
          if (this.checkRole.length === 0) {
            this.mess('请选择一个角色', 'warning')
            return false
          }
          if (this.checkRole.length !== 0) {
            this.count = 3
            this.buttons = []
            this.roles.forEach(item => {
              if (item.id === this.checkRole[0]) {
                this.roleName = item.roleName
              }
              item.parentFunctions.forEach(key => {
                key.functions.forEach(val => {
                  this.viwe.forEach(ar => {
                    if (ar === val.uid) {
                      this.functionName.push(val.id)
                      val.buttons.forEach(ent => {
                        this.buttons.push(ent.id)
                      })
                    }
                  })
                })
              })
            })
            this.roleList.forEach(key => {
              this.functionName.forEach(item => {
                if (key.id === item) {
                  key.flag = true
                }
              })
              key.buttons.forEach(cc => {
                this.buttons.forEach(val => {
                  if (cc.id === val) {
                    cc.flag = true
                  }
                })
              })
            })
            return false
          }
        }
        if (this.count === 3) {
          if (this.buttons.indexOf(`AC0A573635234A948A7CD937A9DEF516`) > -1 && this.doctor.length === 0) {
            this.mess('必须选择一个医生', 'warning');
            return true
          }
          this.count++
        }
        if (this.count === 4) {
          let arr = []
          let a = []
          let b = []
          this.RoleAll.forEach(item => {
            item.functions.forEach(val => {
              Array.from(new Set(this.functionName)).forEach(ar => {
                if (ar === val.id) {
                  a.push({
                    roleListName: val.functionName,
                    buttons: [],
                    parentId: val.id
                  })
                }
              })
            })
          })
          this.RoleAll.forEach(item => {
            item.functions.forEach(val => {
              val.buttons.forEach(key => {
                Array.from(new Set(this.buttons)).forEach(cc => {
                  if (cc === key.id) {
                    b.push({
                      buttonName: key.name,
                      alias: key.alias,
                      id: val.id,
                    })
                  }
                })
              })
            })
          })
          this.cc(a).forEach(item => {
            this.bb(b).forEach(key => {
              if (item.parentId === key.id) {
                item.buttons.push(
                  {buttonName: key.buttonName}
                )
              }
            })
          })
          arr = this.cc(a)
          let obj = []
          for (let i = 0; i < arr.length; i++) {
            if (!obj[arr[i].roleListName]) {
              obj.push(arr[i])
              obj[arr[i].roleListName] = true
            }
          }
          this.obj = obj
        }
      },
      cc(arr) {
        var result = [];
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
          if (!obj[arr[i].roleListName]) {
            result.push(arr[i]);
            obj[arr[i].roleListName] = true;
          }
        }
        return result;
      },
      bb(arr) {
        var result = [];
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
          if (!obj[arr[i].alias]) {
            result.push(arr[i]);
            obj[arr[i].alias] = true;
          }
        }
        return result;
      },
      fetchData() {
        let arr = []
        this.doctors.forEach(rr => {
          let obj = {}
          obj.id = rr.id
          obj.name = rr.name
          arr.push(obj)
        })
        fetchDataByRole().then(res => {
          if (res.queue.code === 1) {
            let data = res.data.list
            data.forEach(item => {
              item.flag = false
              item.parentFunctions.forEach(key => {
                let num = Math.random().toString(36).substr(2)
                key.flag = false
                key.uid = num
                key.functions.forEach(val => {
                  let number = Math.random().toString(36).substr(2)
                  val.flag = false
                  val.uid = number
                  val.buttons.forEach(ent => {
                    let c = Math.random().toString(36).substr(2)
                    ent.flag = false
                    ent.uid = c
                  })
                })
              })
            })
            this.roles = data
          }
        })
        getRoleList().then(res => {
          if (res.queue.code === 1) {
            let data = res.data
            this.RoleAll = res.data
            data.forEach(item => {
              item.functions.forEach(val => {
                this.roleList.push(val)
              })
            })
            this.roleList.forEach(key => {
              key.flag = false
              key.buttons.forEach(val => {
                val.flag = false
              })
            })
          }
        })
      },
      checkOutRole(flag, id) {
        /*if (flag) {
          let ar = []
          let arr = []
          let arrRole = []
          let arrButton = []
          this.roles.forEach(item => {
            if (item.id === id) {
              item.flag = false
              ar.push(item.id)
              let add = this.checkRole.filter(item => !ar.some(ele => ele === item))
              this.checkRole = []
              this.checkRole = add
              item.parentFunctions.forEach(key => {
                key.flag = false
                arr.push(key.uid)
                let add = this.parent.filter(item => !arr.some(ele => ele === item))
                this.parent = []
                this.parent = add
                key.functions.forEach(val => {
                  val.flag = false
                  arrRole.push(val.uid)
                  let addRole = this.viwe.filter(item => !arrRole.some(ele => ele === item))
                  this.viwe = []
                  this.viwe = addRole
                  val.buttons.forEach(ent => {
                    ent.flag = false
                  })
                })
              })
            }
          })
        } else {
          this.checkRole = []
          this.viwe = []
          this.parent = []
          this.checkRole.push(id)
          this.roles.forEach(item => {
            if (item.id === id) {
              item.flag = true
              item.parentFunctions.forEach(key => {
                key.flag = true
                this.parent.push(key.uid)
                key.functions.forEach(val => {
                  this.viwe.push(val.uid)
                  val.flag = true
                  val.buttons.forEach(ent => {
                    ent.flag = true
                  })
                })
              })
            }
          })
        }*/
        this.checkRole = []
        this.viwe = []
        this.parent = []
        this.checkRole.push(id)
        this.roles.forEach(item => {
          if (item.id === id) {
            item.flag = true
            item.parentFunctions.forEach(key => {
              key.flag = true
              this.parent.push(key.uid)
              key.functions.forEach(val => {
                this.viwe.push(val.uid)
                val.flag = true
                val.buttons.forEach(ent => {
                  ent.flag = true
                })
              })
            })
          }
        })
      },
      check(flag, id) {
        if (flag) {
          this.roleList.slice(this.roleList.indexOf(id), 1)
          this.roleList.forEach(key => {
            if (key.id === id) {
              let arr = []
              key.buttons.forEach(item => {
                arr.push(item.id)
                item.flag = false
              })
              let add = this.buttons.filter(item => !arr.some(ele => ele === item))
              this.buttons = []
              this.buttons = add
              key.flag = false
            }
          })
        } else {
          this.roleList.forEach(key => {
            if (key.id === id) {
              key.flag = true
              key.buttons.forEach(item => {
                this.buttons.push(item.id)
                item.flag = true
              })
            }
          })
        }
      },
      checkButton(flag, id) {
        if (flag) {
          this.roleList.forEach(key => {
            key.buttons.forEach(item => {
              if (item.id === id) {
                item.flag = false
                this.buttons.slice(this.buttons.indexOf(id), 1)
              }
            })
          })
        } else {
          this.roleList.forEach(key => {
            key.buttons.forEach(val => {
              if (val.id === id) {
                if (this.functionName.indexOf(key.id) > -1) {
                  /*this.functionName.splice(this.functionName.indexOf(key.id),1)*/
                } else {
                  this.functionName.push(key.id)
                }
                val.flag = true
                key.flag = true
              }
            })
          })
        }
      }
    },
    created() {
      findDoctorsAll().then(res => {
        if (res.queue.code == 1) {
          this.doctors = res.data.list
          this.fetchData()
        }
      })
    }
  }
</script>

<style>
  span.el-checkbox__inner {
    display: inline-block;
    position: relative;
    /* border: 1px solid #DCDFE6; */
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* width: 14px; */
    height: 14px;
    background-color: #FFF;
    z-index: 1;
    -webkit-transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
  }

  .check span.el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 0px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #2b2f3a;
    cursor: not-allowed;
  }
</style>
