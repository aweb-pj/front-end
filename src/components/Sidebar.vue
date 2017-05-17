<template>
  <div>
    <div v-if="menu_index == 0">
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>导航一</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1" @click="save_mindmap">保存思维导图</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>
    <div v-else-if="menu_index == 1">
      <el-menu class="sidebar">
        <el-submenu index="1" >
          <template slot="title"><i class="el-icon-menu"></i>导航二</template>
          <el-menu-item-group>
            <template slot="title">新增题目</template>
            <el-menu-item index="1-1" @click="choiceVisible = true">选择题</el-menu-item>
            <el-menu-item index="1-2" @click="shortAnswerVisible = true">简答题</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div v-else>
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-setting"></i>导航三</template>
        </el-submenu>
      </el-menu>
    </div>

    <el-dialog title="新增选择题" v-model="choiceVisible">
      <el-form ref="form" :model="choiceForm" label-width="80px">
        <el-form-item label="问题标题">
          <el-input v-model="choiceForm.question"></el-input>
        </el-form-item>
        <el-form-item label="选项A">
          <el-input v-model="choiceForm.A"></el-input>
        </el-form-item>
        <el-form-item label="选项B">
          <el-input v-model="choiceForm.B"></el-input>
        </el-form-item>
        <el-form-item label="选项C">
          <el-input v-model="choiceForm.C"></el-input>
        </el-form-item>
        <el-form-item label="选项D">
          <el-input v-model="choiceForm.D"></el-input>
        </el-form-item>
        <el-form-item label="答案">
          <el-checkbox-group v-model="choiceForm.answer">
            <el-checkbox label="A" name="answer"></el-checkbox>
            <el-checkbox label="B" name="answer"></el-checkbox>
            <el-checkbox label="C" name="answer"></el-checkbox>
            <el-checkbox label="D" name="answer"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="choiceVisible = false">取 消</el-button>
        <el-button type="primary" @click="addChoiceQuestion()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增简答题" v-model="shortAnswerVisible">
      <el-form ref="form" :model="shortAnswerForm" label-width="80px">
        <el-form-item label="问题标题">
          <el-input v-model="shortAnswerForm.question"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shortAnswerVisible = false">取 消</el-button>
        <el-button type="primary" @click="shortAnswerVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'sidebar',
    stash: ['jm'],
    data () {
      return {
        choiceVisible: false,
        choiceForm: {
          question: '',
          A: '',
          B: '',
          C: '',
          D: '',
          answer: [],
          choice: true
        },
        shortAnswerVisible: false,
        shortAnswerForm: {
          question: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'menu_index'
      ])
    },
    methods: {
      addChoiceQuestion () {
        this.$store.dispatch('put_exercise', {nodeId: this.selectedNodeId, exercise: this.choiceForm})
        this.choiceVisible = false
      },
      async save_mindmap () {
        try {
          await (this.$http.post('http://localhost:1234/tree', this.jm.get_data()))
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
<style scoped>
  .sidebar {
    min-height: 100%;
  }
</style>
