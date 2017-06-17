<template>
  <div class="wrapper">
    <el-row :gutter="5">
      <el-col :span="6" v-for="course in courses" :key="course">
        <el-card class="custom-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">{{course.name}}</span>
            <el-button type="text" class="enter-button">进入课程<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>
          <span class="text item">课程人数:{{course.students}}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        courses: [
          {name: '1', students: 2},
          {name: '1', students: 2},
          {name: '1', students: 2},
          {name: '1', students: 2},
          {name: '1', students: 2}
        ]
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
</style>
