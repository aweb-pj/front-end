<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="3">
        <div>
          <el-dropdown @command="handleAddNodeDropdown">
            <el-button>
              新增结点<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addChildNode"><a>子结点</a></el-dropdown-item>
              <el-dropdown-item command="addSiblingNode"><a>兄弟结点</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :span="2"><div><el-button @click="deleteNode">删除</el-button></div></el-col>
      <el-col :span="3">
        <div>
          <el-dropdown>
            <el-button>
              修改颜色<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a @click="openColor(0)">修改背景色</a></el-dropdown-item>
              <el-dropdown-item><a @click="openColor(1)">修改前景色</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>

    <div id="jsmind_container"></div>

    <el-dialog title="新增结点" v-model="formVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="结点id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="结点名称">
          <el-input v-model="form.topic"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改颜色" v-model="colorVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="颜色">
          <el-input v-model="color"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colorVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyColor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable new-cap,camelcase */
  import './MindMap/jsmind/style/jsmind.css'
  import jsMind from './MindMap/jsmind/js/jsmind.js'
  import jsMindDraggable from './MindMap/jsmind/js/jsmind.draggable.js'

  export default {
    name: 'mind-map',
    data () {
      return {
        formVisible: false,
        newNodeType: -1,
        form: {
          id: '',
          topic: '',
          data: []
        },
        colorVisible: false,
        color: '',
        colorType: -1
      }
    },
    mounted () {
      jsMindDraggable(jsMind)

      let mind = {
        /* 元数据，定义思维导图的名称、作者、版本等信息 */
        'meta': {
          'name': 'jsMind-demo-tree',
          'author': 'hizzgdev@163.com',
          'version': '0.2'
        },
        /* 数据格式声明 */
        'format': 'node_tree',
        /* 数据内容 */
        'data': {'id': 'root',
          'topic': 'jsMind',
          'children': [
            {'id': 'easy',
              'topic': 'Easy',
              'direction': 'left',
              'expanded': false,
              'children': [
                {'id': 'easy1', 'topic': 'Easy to show'},
                {'id': 'easy2', 'topic': 'Easy to edit'},
                {'id': 'easy3', 'topic': 'Easy to store'},
                {'id': 'easy4', 'topic': 'Easy to embed'}
              ]},
            {'id': 'open',
              'topic': 'Open Source',
              'direction': 'right',
              'expanded': true,
              'children': [
                {'id': 'open1', 'topic': 'on GitHub'},
                {'id': 'open2', 'topic': 'BSD License'}
              ]},
            {'id': 'powerful',
              'topic': 'Powerful',
              'direction': 'right',
              'children': [
                {'id': 'powerful1', 'topic': 'Base on Javascript'},
                {'id': 'powerful2', 'topic': 'Base on HTML5'},
                {'id': 'powerful3', 'topic': 'Depends on you'}
              ]},
            {'id': 'other',
              'topic': 'test node',
              'direction': 'left',
              'children': [
                {'id': 'other1', 'topic': "I'm from local variable"},
                {'id': 'other2', 'topic': 'I can do everything'}
              ]}
          ]}
      }

      let options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'orange'
      }

      this.$cosmos.jm = new jsMind(options)
      this.$cosmos.jm.show(mind)
    },
    methods: {
      handleAddNodeDropdown (command) {
        this[command]()
      },
      openForm (type) {
        this.formVisible = true
        this.newNodeType = type
      },
//      createNode () {
//        this.formVisible = false
//        let node = this.$cosmos.jm.mind.selected
//        if (this.newNodeType === 0) {
//          this.$cosmos.jm.insert_node_before(node, this.form.id, this.form.topic, this.form.data)
//        } else if (this.newNodeType === 1) {
//          this.$cosmos.jm.insert_node_after(node, this.form.id, this.form.topic, this.form.data)
//        }
//        this.form.id = ''
//        this.form.topic = ''
//      },
      addSiblingNode () {
        let selected_node = this.$cosmos.jm.get_selected_node()
        if (selected_node && !selected_node.isroot) {
          let nodeid = jsMind.util.uuid.newid()
          let node = this.$cosmos.jm.insert_node_after(selected_node, nodeid, '新结点')
          if (node) {
            this.$cosmos.jm.select_node(nodeid)
            this.$cosmos.jm.begin_edit(nodeid)
          }
        }
      },
      addChildNode () {
        let selected_node = this.$cosmos.jm.get_selected_node()
        if (!selected_node) {
          this.$notify({
            title: '警告',
            message: '请先选择一个结点',
            type: 'error'
          })
          return
        }
        if (selected_node) {
          let nodeid = jsMind.util.uuid.newid()
          let node = this.$cosmos.jm.add_node(selected_node, nodeid, '新结点')
          if (node) {
            this.$cosmos.jm.select_node(nodeid)
            this.$cosmos.jm.begin_edit(nodeid)
          }
        }
      },
      deleteNode () {
        let node = this.$cosmos.jm.mind.selected
        this.$cosmos.jm.remove_node(node)
        this.$store.dispatch('delete_node', node.id)
      },
      openColor (type) {
        this.colorVisible = true
        this.colorType = type
      },
      modifyColor () {
        this.colorVisible = false
        let node = this.$cosmos.jm.mind.selected
        if (this.colorType === 0) {
          this.$cosmos.jm.set_node_color(node.id, this.color, null)
        } else if (this.colorType === 1) {
          this.$cosmos.jm.set_node_color(node.id, null, this.color)
        }
        this.color = ''
      }
    }
  }

</script>
<style scoped>
</style>
