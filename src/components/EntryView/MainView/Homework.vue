<template>
  <div>
    <div v-if="homework !== undefined">
    <draggable v-model="homework.questions">
      <div class="card" v-for="(question, index) in homework.questions" :key="question.question">
        <el-card>
          <div class="title clearfix">
            <span class="questionTitle">{{question.question}}</span>
            <el-button @click="deleteQuestion(index)" style="float: right">删除</el-button>
          </div>
          <div v-if="question.solution !== undefined && question.choice" >
              <el-checkbox :label="question.A"></el-checkbox>
              <el-checkbox :label="question.B"></el-checkbox>
              <el-checkbox :label="question.C"></el-checkbox>
              <el-checkbox :label="question.D"></el-checkbox>
          </div>

          <textarea class="fixedSize" v-else></textarea>
        </el-card>
        <div class="padding">
        </div>
      </div>
    </draggable>
    </div>
    <div class="card">
      <div class="button">
        <el-button type="primary" @click="saveHomework()">保存</el-button>
      </div>
      <div class="button">
        <el-button type="primary" @click="publishHomework()">发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import _ from 'lodash'

  export default {
    name: 'homework',
    props: ['selectedNodeId'],
    stash: ['isTeacher'],
    components: {
      draggable
    },
    data () {
      return {
        homework: {publish: false, questions: []}
      }
    },
    async mounted () {
      let that = this
      let response = await this.$http.get(_.join([this.$stash.AWEB_SERVER_ADDR, 'node', this.selectedNodeId, 'homework'], '/'))
      this.homework = Object.assign({}, this.homework, response.data)
      if (!that.isTeacher) {
        _.forEach(this.homework.questions, function (question) {
          question.solution = {A: false, B: false, C: false, D: false}
        })
      }
    },

    methods: {
      print () {
        alert('fuck')
      },
      deleteQuestion (index) {
        this.homework.questions.splice(index, 1)
      },
      async saveHomework () {
        try {
          let that = this
          let homeworkToSave = _.cloneDeep(that.homework)
          if (!that.isTeacher) {
            _.forEach(homeworkToSave.questions, function (question) {
              _.unset(question, 'solution')
            })
          }
          await this.$http.post(_.join([this.$stash.AWEB_SERVER_ADDR, 'node', this.selectedNodeId, 'homework'], '/'), homeworkToSave)
        } catch (e) {
        }
      },
      async publishHomework () {
        // TODO
        console.log(this.homework)
      },
      async sendAnswers () {}
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
