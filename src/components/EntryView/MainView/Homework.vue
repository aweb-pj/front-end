<template>
  <div>
  <div v-if="!(!homework.publish && !isTeacher)">
    <div v-if="homework !== undefined">
    <draggable v-model="homework.questions">
      <div class="card" v-for="(question, index) in homework.questions" :key="question.question">
        <el-card>
          <div class="title clearfix">
            <span class="questionTitle">{{question.question}}</span>
            <el-button @click="deleteQuestion(index)" style="float: right">删除</el-button>
          </div>
          <div v-if="question.solution !== undefined && question.choice" >
            <span>{{question.A}}</span>
            <input type="checkbox" v-model="question.solution.A">
            <span>{{question.B}}</span>
            <input type="checkbox" v-model="question.solution.B" >
            <span>{{question.C}}</span>
            <input type="checkbox" v-model="question.solution.C" >
            <span>{{question.D}}</span>
            <input type="checkbox" v-model="question.solution.D">
          </div>
          <div v-else-if="question.choice">
            <span>{{question.A}}</span>
            <input type="checkbox">
            <span>{{question.B}}</span>
            <input type="checkbox" >
            <span>{{question.C}}</span>
            <input type="checkbox" >
            <span>{{question.D}}</span>
            <input type="checkbox">
          </div>
          <textarea class="fixedSize" v-else></textarea>

        </el-card>
        <div class="padding">
        </div>
      </div>
    </draggable>
    </div>
    <div class="card">
      <div v-if="isTeacher">
        <div class="button">
          <el-button type="primary" @click="saveHomework()">保存</el-button>
        </div>
        <div class="button">
          <el-button type="primary" @click="publishHomework()">发布</el-button>
        </div>
      </div>

      <div class="button" v-else>
        <el-button type="primary" @click="sendAnswers()">提交</el-button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>教师尚未发布作业</p>
  </div>
</div>
</template>

<script>
  import draggable from 'vuedraggable'
  import _ from 'lodash'
  import EventBus from '../../../EventBus.js'
  export default {
    name: 'homework',
    props: ['selectedNodeId'],
    stash: ['isTeacher', 'username'],
    components: {
      draggable
    },
    data () {
      return {
        check: true,
        homework: {publish: false, questions: []}
      }
    },
    created () {
      let that = this
      EventBus.$on('add_question', function (question) {
        that.homework.questions.push(question)
      })
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
      setInterval(function () {
        that.$forceUpdate()
      }, 100)
    },

    methods: {
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
        this.homework.publish = true
        this.saveHomework()
      },
      async sendAnswers () {
        let answer = _.map(this.homework.questions, (q) => {
          let solutions = q.solution
          let resultArr = []
          _.forEach(solutions, (value, key) => {
            if (value === true) {
              resultArr.push(key)
            }
          })
          return _.join(resultArr.sort(), '')
        })
        console.log(answer)
        await this.$http.post(_.join([this.$stash.AWEB_SERVER_ADDR, 'node', this.selectedNodeId, 'answer', this.username], '/'), {answer: answer})
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
