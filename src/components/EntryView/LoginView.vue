<template>
  <div id="register">
    <el-button  @click="open_login_box()" id="login_button">登录</el-button>
    <el-button  @click="registerVisible = true" id="register_button">注册</el-button>

    <el-dialog v-model="toggle">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off" autofocus></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div style="float: right">
        <el-radio class="radio" v-model="radio" label="1">教师</el-radio>
        <el-radio class="radio" v-model="radio" label="2">学生</el-radio>
      </div>
      <div class="alert" v-show="loginAlert !== ''">{{loginAlert}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close_login_box()">取消</el-button>
        <el-button type="primary" @click="login()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="registerVisible">
      <el-form :model="registerForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="registerForm.username" auto-complete="off" autofocus></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="registerForm.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" :label-width="formLabelWidth">
          <el-input v-model="registerForm.reInput" auto-complete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div style="float: right">
        <el-radio class="radio" v-model="radio" label="1">教师</el-radio>
        <el-radio class="radio" v-model="radio" label="2">学生</el-radio>
      </div>
      <div class="alert" v-show="registerAlert !== ''">{{registerAlert}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerVisible = false">取消</el-button>
        <el-button type="primary" @click="register()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import Vue from 'vue'

  export default {
    stash: ['AWEB_SERVER_ADDR', 'courses', 'username', 'selectable_courses'],
    data () {
      return {
        toggle: false,
        form: {
          username: '',
          password: ''
        },
        radio: '1',
        formLabelWidth: '80px',
        registerVisible: false,
        registerForm: {
          username: '',
          password: '',
          reInput: ''
        },
        registerAlert: '',
        loginAlert: ''
      }
    },
    methods: {
      open_login_box () {
        this.toggle = true
      },

      close_login_box () {
        this.toggle = false
      },

      async login () {
        this.$stash.username = this.form.username
        this.$stash.isTeacher = this.radio === '1'
//        this.$store.dispatch('login', {username: this.form.username, password: this.form.password, isTeacher: this.radio === '1'})
        if (this.form.username === '' || this.form.password === '') {
          this.loginAlert = '用户名密码不得为空！'
        } else {
          try {
            let body = {
              username: this.form.username,
              password: this.form.password,
              type: this.radio === '1' ? 'teacher' : 'student'
            }
            let response = await Vue.http.post(this.AWEB_SERVER_ADDR + '/login', body)
            if (response.status === 200) {
              this.username = this.form.username
              response = await Vue.http.get(this.AWEB_SERVER_ADDR + '/user/' + this.username + '/course')
              this.courses = response.body
              if (!this.isTeacher) {
                response = await Vue.http.get(this.AWEB_SERVER_ADDR + '/user/' + this.username + '/selectable_courses')
                this.selectable_courses = response.body
              }
              this.$stash.is_logged_in = true
              this.toggle = false
            }
          } catch (e) {
            this.loginAlert = '用户名或密码错误！'
          }
        }
      },

      async register () {
        if (this.registerForm.password !== this.registerForm.reInput) {
          this.registerAlert = '两次密码不一致！'
        } else {
          try {
            let body = {
              username: this.registerForm.username,
              password: this.registerForm.password,
              type: this.radio === '1' ? 'teacher' : 'student'
            }
            let response = await Vue.http.post(this.AWEB_SERVER_ADDR + '/register', body)
            if (response.status === 200) {
              this.registerAlert = ''
              this.registerVisible = false
              this.$notify.info({
                message: '注册成功'
              })
            }
          } catch (e) {
            this.registerAlert = '用户名已存在！'
          }
        }
      }
    }
  }
</script>


<style scoped>
  #login_button {
    position  : absolute;
    top       : 50%;
    left      : 47%;
    transform : translate(-50%,-50%);
  }
  #register_button {
    position  : absolute;
    top       : 50%;
    left      : 53%;
    transform : translate(-50%,-50%);
  }
  .alert {
    float: left;
    color: red;
  }
</style>
