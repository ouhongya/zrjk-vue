<template>
  <div class="login-container">
    <div class="login-layout">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
               label-position="left">
        <div class="title-container">
          <h1 style="padding-top: 22px" class="title">欢迎登录知润健康平台</h1>
        </div>
        <div style="padding-top: 50px">
          <el-form-item prop="username">
            <el-row :gutter="10">
              <el-col :span="5">
             <span class="svg-container">
                <svg-icon icon-class="log"/>
              </span>
              </el-col>
              <el-col :span="19">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  class="input-layout"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="password">
            <el-row :gutter="10">
              <el-col :span="5">
              <span class="svg-container">
                <svg-icon icon-class="password"/>
              </span>
              </el-col>
              <el-col :span="19">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  class="input-layout"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:50%;margin-bottom:30px;"
                     @click.native.prevent="handleLogin">登录
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {userInfo} from '@/api/user'
  import {getToken} from "../../utils/auth";

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入正确的登录名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码最少六位数'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate( (valid) => {
          if (valid) {
             this.$store.dispatch('user/login', this.loginForm).then(res => {
              if(res!==null){
                setTimeout(()=>{
                  this.$router.push({path: this.redirect || '/'})
                },700)
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="css">
  input:focus:-webkit-autofill,
  input:-webkit-autofill {
    -webkit-text-fill-color: #fff !important;
    -webkit-box-shadow: 0 0 0px 1000px #ffffff00 inset !important;
    transition: background-color 500000s ease-in-out 50000s;
  }

  .login-form .el-form-item__error {
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    padding-left: 105px !important;
    position: absolute;
    top: 100%;
    left: 0;
  }

  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
  }
</style>
<style scoped lang="css">
  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    background: url("./white-smartphone-beside-silver-laptop-computer-1036808.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .login-container .login-layout {
    width: 500px;
    height: 330px;
    margin: 0 auto;
    text-align: center;
    background-color: #00000060;
    margin-top: 12%;
  }

  .input-layout >>> .el-input__inner {
    border: 0 !important;
    border-bottom: 2px solid #fff !important;
    background-color: #ffffff00;
    width: 74% !important;
    border-radius: 0;
    float: left;
    color: #fff;
  }

  .svg-container {
    float: right;
    color: #fff;
  }

  .title-container {
    height: 40px;
  }

  .title {
    color: #fff;
  }

  .svg-container {
    padding-top: 5px;
    color: #fff;
  }
</style>

