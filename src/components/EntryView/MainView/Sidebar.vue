<template>
  <div>
    <div v-if="menu_index == 0">
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>思维导图</template>
          <el-menu-item-group>
            <template slot="title">思维导图操作</template>
            <el-submenu index="1-1">
              <template slot="title">切换思维导图</template>
              <el-menu-item v-for="(id,index) in treeIds" :key="id" :index="'1-3-'+(index+1)" @click="switch_mindmap(id)">{{id}}</el-menu-item>
            </el-submenu>
            <el-menu-item index="1-2" @click="save_screenshot">思维导图截图</el-menu-item>
            <el-menu-item index="1-3" @click="save_mindmap" v-if="isTeacher">保存思维导图</el-menu-item>
            <el-menu-item index="1-4" @click="createMindVisible = true" v-if="isTeacher">创建思维导图</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="isTeacher">
            <template slot="title">作业正确率</template>
            <el-menu-item index="1-5">
              <el-switch v-model="statisticsVisible" on-color="#13ce66" off-color="#ff4949" @change="toggleStatistics">
              </el-switch>
            </el-menu-item>
          </el-menu-item-group>

        </el-submenu>
        <el-submenu index="2">
          <template slot="title">弹幕</template>
          <el-menu-item-group>
            <el-menu-item index="2-1">
              <el-switch v-model="barrageVisible" on-color="#13ce66" off-color="#ff4949" @change="toggleBarrage">
              </el-switch>
            </el-menu-item>
          </el-menu-item-group>
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
    <div v-else-if="menu_index == 2">
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-setting"></i>课件</template>
        </el-submenu>
      </el-menu>
    </div>
    <div v-else>
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-setting"></i>资源</template>
          <el-menu-item-group v-if="isTeacher">
            <template slot="title">新增资源</template>
            <el-menu-item index="1-1" @click="LinkVisible = true">链接</el-menu-item>
            <el-menu-item index="1-2" @click="FileVisible = true">文件</el-menu-item>
          </el-menu-item-group>
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

    <el-dialog title="创建思维导图" v-model="createMindVisible" size="tiny">
      <el-input v-model="newTreeId" placeholder="新导图id"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMindDialog">取 消</el-button>
        <el-button type="primary" @click="createMind">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增链接" v-model="LinkVisible" size="tiny">
      <el-input v-model="link" placeholder="链接"></el-input>
      <el-input class="description" v-model="linkDescription" placeholder="链接描述"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增文件" v-model="FileVisible" size="tiny">
      <el-upload
        v-if="isTeacher"
        class="upload-demo"
        drag
        :action="file_server_addr"
        :on-success="afterSuccessing"	>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-input class="description" v-model="fileDescription" placeholder="文件描述"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable new-cap,camelcase,no-unused-vars */
  import { mapGetters } from 'vuex'
  import _ from 'lodash'
  import EventBus from '../../../EventBus'
  import meld from 'meld'
  import './MindMap/jsmind/style/jsmind.css'
  import jsMind from './MindMap/jsmind/js/jsmind.js'
  import jsMindDraggable from './MindMap/jsmind/js/jsmind.draggable.js'
  import jsMindScreenshot from './MindMap/jsmind/js/jsmind.screenshot.js'

  export default {
    name: 'sidebar',
    stash: ['jm', 'nodeColors', 'hsv2rgb', 'num2hsv', 'isTeacher', 'statVisible', 'showMindmap'],
    props: ['selectedNodeId'],
    data () {
      return {
        canSave: true,
        statisticsVisible: false,
        barrageVisible: false,
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
        meldRemover: null,
        createMindVisible: false,
        newTreeId: '',
        opt: {
          container: 'jsmind_container',
          editable: true,
          theme: 'orange',
          shortcut: {
            enable: false        // 是否启用快捷键
          }
        },
        LinkVisible: false,
        FileVisible: false,
        link: '',
        linkDescription: '',
        fileDescription: ''
      }
    },
    computed: {
      ...mapGetters([
        'menu_index',
        'treeIds',
        'cur_treeId'
      ]),
      file_server_addr () {
        return _.join([this.$stash.AWEB_SERVER_ADDR, 'tree', this.cur_treeId, 'node', this.selectedNodeId, 'material'], '/')
      }
    },

    async mounted () {
      let that = this
      let AWEB_SERVER_ADDR = that.$stash.AWEB_SERVER_ADDR
      let options = this.opt
      let mind = null
      jsMindDraggable(jsMind)
      jsMindScreenshot(jsMind)
      try {
        let response = await this.$http.get(AWEB_SERVER_ADDR + '/tree')
        let treeIds = response.data
        _.remove(treeIds, function (e) { return e === '' })
        if (treeIds.length === 0) {
          that.jm = jsMind.show(options)
          if (that.isTeacher) {
            that.createMindVisible = true
          } else {
            that.showMindmap = false
          }
        } else {
          that.$store.dispatch('set_treeIds', treeIds)
          let default_treeId = treeIds[0]
          that.$store.dispatch('set_curTreeId', default_treeId)
          response = await that.$http.get(AWEB_SERVER_ADDR + '/tree/' + default_treeId)
          mind = response.data
          that.jm = jsMind.show(options)
          if (!_.isEmpty(mind)) {
            that.jm.show(mind)
          }
        }
      } catch (e) {
        that.jm = jsMind.show(options)
      }
    },

    watch: {
      jm: {
        handler: function (newJm) {
          if (this.canSave && this.isTeacher) {
            this.save_mindmap(false)
          }
        },
        deep: true
      }
    },

    methods: {
      save_screenshot () {
        try {
          this.jm.screenshot.shootDownload()
        } catch (e) {
          console.log(e)
        }
      },

      async toggleStatistics (newState) {
        let that = this

        function percentageToHsl (percentage, hue0, hue1) {
          let hue = (percentage * (hue1 - hue0)) + hue0
          return 'hsl(' + hue + ', 100%, 50%)'
        }
        if (newState === true) {
          that.canSave = false
        }

        that.statVisible = newState
        that.jm.mind.selected = null
        if (newState === true) {
          that.nodeColors = {}
          _.forEach(Object.keys(that.jm.mind.nodes), (key) => {
            that.nodeColors[key] = {}
          })
          let answerResultsResponse = await that.$http.get(_.join([that.$stash.AWEB_SERVER_ADDR, 'tree', this.cur_treeId, 'stat'], '/'))
          let answerResults = answerResultsResponse.data
          _.forEach(that.nodeColors, function (nodeColor, key) {
            if ((!_.isUndefined(answerResults[key])) && (!_.isNull(answerResults[key]))) {
              nodeColor.previous = that.jm.mind.nodes[key]._data.view.element.style.backgroundColor
              if (nodeColor.previous === '') {
                nodeColor.previous = 'rgb(241,196,15)'
              }
              let val = answerResults[key]
              let nodeId = that.jm.mind.nodes[key].id
              that.$store.dispatch('save_reports', {nodeId, val})
              that.jm.set_show_data(nodeId, true)
              let avg = _.meanBy(val, 'rate')
              that.jm.set_stat_color(nodeId, percentageToHsl(avg, 0, 120), null)
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
          that.canSave = true
        }
      },
      toggleBarrage (newState) {
        this.$store.dispatch('display_barrage', newState)
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

      async save_mindmap (shouldAlert = true) {
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
          await (that.$http.post(_.join([that.$stash.AWEB_SERVER_ADDR, 'tree'], '/'), {treeId: this.cur_treeId, nodesKeys: _.keys(that.jm.mind.nodes), data: treeData}))
          if (shouldAlert) {
            this.$alert('保存成功!', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        } catch (e) {
          console.log(e)
        }
      },

      closeMindDialog () {
        this.createMindVisible = false
        this.newTreeId = ''
      },

      async createMind () {
        this.canSave = false
        this.createMindVisible = false
        if (this.newTreeId !== '') {
          this.$store.dispatch('add_treeId', this.newTreeId)
          this.$store.dispatch('set_curTreeId', this.newTreeId)
          this.jm.show()
          this.newTreeId = ''
          await this.save_mindmap()
        }
        this.canSave = true
      },

      async switch_mindmap (id) {
        this.canSave = false
        if (this.cur_treeId !== id) {
          this.$store.dispatch('set_curTreeId', id)
          let response = await this.$http.get(this.$stash.AWEB_SERVER_ADDR + '/tree/' + id)
          let mind = response.data
          this.jm.show(mind)
        }
        this.canSave = true
      },

      afterSuccessing (response, file, fileList) {
        this.$store.commit('PUT_FILE', {nodeId: this.selectedNodeId, file: this.cur_treeId + '_' + this.selectedNodeId + '_' + file.name.replace(/\s+/g, '_').toLowerCase()})
      }
    }
  }
</script>
<style scoped>
  .sidebar {
    min-height: 100%;
  }
  .description {
    margin-top: 5%;
  }
</style>
