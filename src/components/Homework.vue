<template>
  <div>
    <div class="card" v-for="exercise in exercises">
      <el-card>
        <div class="title"><h4>{{exercise.question}}</h4></div>
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
    margin-bottom: 0.5%;
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
