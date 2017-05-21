<template>
  <div>
    <draggable v-model="questions">
      <div class="card" v-for="(question, index) in questions" :key="question.question">
        <el-card>
          <div class="title clearfix">
            <span class="questionTitle">{{question.question}}</span>
            <el-button @click="deleteQuestion(index)" style="float: right">删除</el-button>
          </div>
          <el-checkbox-group v-if="question.choice">
            <el-checkbox :label="question.A" v-model="h"></el-checkbox>
            <el-checkbox :label="question.B" ></el-checkbox>
            <el-checkbox :label="question.C"></el-checkbox>
            <el-checkbox :label="question.D"></el-checkbox>
          </el-checkbox-group>
          <textarea class="fixedSize" v-else></textarea>
        </el-card>
        <div class="padding">
        </div>
      </div>
    </draggable>
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

  export default {
    name: 'homework',
    props: ['selectedNodeId'],
    components: {
      draggable
    },
    data () {
      return {
        h: true
      }
    },
    computed: {
      questions: {
        get () {
          try {
            return this.$store.state.homework[this.selectedNodeId].questions
          } catch (e) {
            return []
          }
        },
        set (questions) {
          this.$store.dispatch('update_questions', {nodeId: this.selectedNodeId, questions: questions})
        }
      }
    },
    methods: {
      deleteQuestion (index) {
        this.$store.dispatch('delete_question', {nodeId: this.selectedNodeId, index: index})
      },
      async saveHomework () {
        this.$store.dispatch('save_homework', this.selectedNodeId)
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
