<template>
  <div>
    <div v-for="exercise in exercises">
      <el-card>
        <div>{{exercise.question}}</div>
        <el-checkbox-group v-if="exercise.choice">
          <el-checkbox :label="exercise.A"></el-checkbox>
          <el-checkbox :label="exercise.B"></el-checkbox>
          <el-checkbox :label="exercise.C"></el-checkbox>
          <el-checkbox :label="exercise.D"></el-checkbox>
        </el-checkbox-group>
        <textarea v-else></textarea>
      </el-card>
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
