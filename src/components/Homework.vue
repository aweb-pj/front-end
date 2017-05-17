<template>
  <div>
    <div class="card" v-for="(exercise, index) in exercises" :key="exercise.question">
      <el-card>
        <div class="title clearfix">
          <span class="questionTitle">{{exercise.question}}</span>
          <el-button @click="deleteExercise(index)" style="float: right">删除</el-button>
        </div>
        <el-checkbox-group v-if="exercise.choice">
          <el-checkbox :label="exercise.A"></el-checkbox>
          <el-checkbox :label="exercise.B"></el-checkbox>
          <el-checkbox :label="exercise.C"></el-checkbox>
          <el-checkbox :label="exercise.D"></el-checkbox>
        </el-checkbox-group>
        <textarea class="fixedSize" v-else></textarea>
      </el-card>
      <div class="padding">
      </div>
    </div>
    <div class="card">
      <div class="button">
        <el-button type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'homework',
    computed: {
      ...mapGetters([
        'exercises'
      ])
    },
    methods: {
      deleteExercise (index) {
        this.$store.dispatch('delete_exercise', index)
      }
    }
  }
</script>
<style scoped>
  div.card {
    width: 90%;
    margin-left: 5%;
  }

  div.card div.button {
    float: right;
  }

  div.title {
    margin-bottom: 2%;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  div.title span.questionTitle {
    font-size: 100%;
  }

  div.title .delete {
    float: right;
  }

  div.padding {
    height: 5%;
  }

  textarea.fixedSize {
    border-color: rgb(209,219,229);
    resize: None;
    width: 100%;
    height: 20%;
  }
</style>
