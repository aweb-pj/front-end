<template>
  <div class="wrapper">
    <el-button v-if="isTeacher" @click="dialogVisible = true">添加课程</el-button>
    <el-row :gutter="5">
      <el-col :span="6" v-for="course in courses" :key="course">
        <el-card class="custom-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">{{course.courseId}}:{{course.courseName}}</span>
            <el-button type="text" class="enter-button" @click="enterCourse(course.courseId)">进入课程<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>
          <span class="text item">课程人数:{{course.stakeholders.length}}</span>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="添加课程" v-model="dialogVisible" size="tiny">
      <el-input v-model="course.courseId" placeholder="课程id"></el-input>
      <el-input class="description" v-model="course.courseName" placeholder="课程名称"></el-input>
      <div class="alert" v-show="alertMessage !== ''">{{alertMessage}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createCourse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default {
    stash: ['isTeacher', 'courses', 'username', 'AWEB_SERVER_ADDR', 'courseId', 'select_course'],
    data () {
      return {
        dialogVisible: false,
        course: {
          courseId: '',
          courseName: ''
        },
        alertMessage: ''
      }
    },
    methods: {
      async createCourse () {
        if (this.course.courseId === '' || this.course.courseName === '') {
          this.alertMessage = 'id名称不得为空！'
        } else {
          try {
            let body = {courseId: this.course.courseId, courseName: this.course.courseName}
            await Vue.http.post(this.AWEB_SERVER_ADDR + '/user/' + this.username + '/course', body)
            let response = await Vue.http.get(this.AWEB_SERVER_ADDR + '/user/' + this.username + '/course')
            this.courses = response.body
            this.dialogVisible = false
          } catch (e) {
            this.alertMessage = 'id或名称已存在！'
          }
        }
      },
      async enterCourse (courseId) {
        this.courseId = courseId
        this.select_course = true
      }
    }
  }
</script>
<style scoped>
  .wrapper {
    width: 90%;
    margin-top: 2%;
    margin-left: 5%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .enter-button {
    float: right;
  }
  .custom-card {
    margin-top: 2%;
  }
  .description {
    margin-top: 5%;
  }
  .alert {
    float: left;
    color: red;
  }
</style>
