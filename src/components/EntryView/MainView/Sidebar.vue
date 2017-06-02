<template>
  <div>
    <div v-if="menu_index == 0">
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>思维导图</template>
          <el-menu-item-group>
            <template slot="title"></template>
            <el-menu-item index="1-1" @click="save_mindmap" v-if="isTeacher">保存思维导图</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="">
            <el-menu-item index="1-2">
              作业正确率
              <el-switch v-model="statisticsVisible" on-color="#13ce66" off-color="#ff4949" @change="toggleStatistics">
                </el-switch>
                </el-menu-item>

          </el-menu-item-group>
          <!--<el-submenu index="1-4">-->
            <!--<template slot="title">选项4</template>-->
            <!--&lt;!&ndash;<el-menu-item index="1-4-1">选项1</el-menu-item>&ndash;&gt;-->
          <!--</el-submenu>-->
        </el-submenu>
      </el-menu>
    </div>
    <div v-else-if="menu_index == 1">
      <el-menu class="sidebar">
        <el-submenu index="1" >
          <template slot="title"><i class="el-icon-menu"></i>作业</template>
          <el-menu-item-group v-if="isTeacher">
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
          <template slot="title"><i class="el-icon-setting"></i>课件</template>
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
        <el-button type="primary" @click="addTextQuestion()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import _ from 'lodash'
  import EventBus from '../../../EventBus'
  import meld from 'meld'
  import jsMind from './MindMap/jsmind/js/jsmind'

  export default {
    name: 'sidebar',
    stash: ['jm', 'nodeColors', 'hsv2rgb', 'num2hsv', 'isTeacher', 'statVisible'],
    props: ['selectedNodeId'],
    data () {
      return {
        statisticsVisible: false,
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
        },
        meldRemover: null
      }
    },
    computed: {
      ...mapGetters([
        'menu_index'
      ])
    },
    methods: {
      async toggleStatistics (newState) {
        let that = this

        function percentageToHsl (percentage, hue0, hue1) {
          let hue = (percentage * (hue1 - hue0)) + hue0
          return 'hsl(' + hue + ', 100%, 50%)'
        }

        that.statVisible = newState
        that.jm.mind.selected = null
        if (newState === true) {
          that.nodeColors = {}
          _.forEach(Object.keys(that.jm.mind.nodes), (key) => {
            that.nodeColors[key] = {}
          })
          let answerResultsResponse = await that.$http.get(_.join([that.$stash.AWEB_SERVER_ADDR, 'stat'], '/'))
          let answerResults = answerResultsResponse.data

          _.forEach(that.nodeColors, function (nodeColor, key) {
            if ((!_.isUndefined(answerResults[key])) && (!_.isNull(answerResults[key]))) {
              nodeColor.previous = that.jm.mind.nodes[key]._data.view.element.style.backgroundColor
              let val = answerResults[key]
//            that.jm.mind.nodes[key]._data.view.element.style.backgroundColor = that.hsv2rgb(that.num2hsv(val))
//              that.jm.mind.nodes[key]._data.view.element.style.backgroundColor = percentageToHsl(val, 0, 120)
              that.jm.set_show_data(that.jm.mind.nodes[key].id, true)
              that.jm.set_stat_color(that.jm.mind.nodes[key].id, percentageToHsl(val, 0, 120), null)
            }
          })

          that.meldRemover = meld.on(jsMind.view_provider.prototype, 'reset_node_custom_style', function (node) {
            if (_.has(that.nodeColors, node.id)) {
              if ((!_.isUndefined(answerResults[node.id])) && (!_.isNull(answerResults[node.id]))) {
                let val = answerResults[node.id]
                that.jm.mind.nodes[node.id]._data.view.element.style.backgroundColor = percentageToHsl(val, 0, 120)
              }
            }
          })
          that.jm.disable_edit()
          this.$notify.info({
            message: '进入显示正确率状态，思维导图编辑功能已关闭'
          })
        } else {
          if (!_.isNull(that.meldRemover)) {
            that.meldRemover.remove()
          }
          that.jm.enable_edit()
          _.forEach(that.nodeColors, (nodeColor, key) => {
            if (_.has(nodeColor, 'previous')) {
//              that.jm.mind.nodes[key]._data.view.element.style.backgroundColor = nodeColor.previous
              that.jm.set_show_data(that.jm.mind.nodes[key].id, false)
              that.jm.set_node_color(that.jm.mind.nodes[key].id, nodeColor.previous, null)
            }
          })
//          that.jm.enable_edit()
          this.$notify.info({
            message: '退出显示正确率状态，思维导图编辑功能已启用'
          })
        }
      },
      addChoiceQuestion () {
        let answerArrToStr = function (answerArr) {
          return _.cloneDeep(answerArr).sort().join('')
        }
        let question = _.cloneDeep(this.choiceForm)
        question.answer = answerArrToStr(question.answer)
        EventBus.$emit('add_question', question)
//        this.$store.dispatch('put_question', {nodeId: this.selectedNodeId, question: question})
        this.choiceVisible = false
        let initialChoiceForm = {
          question: '',
          A: '',
          B: '',
          C: '',
          D: '',
          answer: [],
          choice: true
        }
        this.choiceForm = Object.assign({}, this.choiceForm, initialChoiceForm)
      },
      addTextQuestion () {
        let question = _.cloneDeep(this.shortAnswerForm)
        EventBus.$emit('add_question', question)
        this.shortAnswerVisible = false
        this.shortAnswerForm.question = ''
      },

      async save_mindmap () {
        let that = this
        if (that.statVisible) {
          that.toggleStatistics(false)
        }

        try {
          let jm = _.cloneDeep(that.jm)
          if (!jm.get_editable()) {
            jm.enable_edit()
          }
          _.forEach(that.nodeColors, (nodeColor, key) => {
            if (_.has(nodeColor, 'previous')) {
              jm.set_node_color(jm.mind.nodes[key].id, nodeColor.previous, null)
            }
          })
          let treeData = that.statVisible ? jm.get_data() : that.jm.get_data()
          await (that.$http.post(_.join([that.$stash.AWEB_SERVER_ADDR, 'tree'], '/'), {nodesKeys: _.keys(that.jm.mind.nodes), data: treeData}))
          this.$alert('保存成功!', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
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
