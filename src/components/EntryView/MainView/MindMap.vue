<template>
  <div>
    <el-row :gutter="20" v-if="selectedNodeId !== null">
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
          <el-dropdown @command="handleChangeColorDropdown">
            <el-button>
              修改颜色<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="openColor(0)"><a>结点颜色</a></el-dropdown-item>
              <el-dropdown-item command="openColor(1)"><a>文字颜色</a></el-dropdown-item>
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
      <el-color-picker v-model="color" show-alpha></el-color-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colorVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyColor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable new-cap,camelcase,no-unused-vars */
  import './MindMap/jsmind/style/jsmind.css'
  import jsMind from './MindMap/jsmind/js/jsmind.js'
  import jsMindDraggable from './MindMap/jsmind/js/jsmind.draggable.js'
  import _ from 'lodash'

  export default {
    name: 'mind-map',
    props: ['selectedNodeId'],
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
        color: 'rgba(0, 0, 0, 1)',
        colorType: -1
      }
    },
    stash: ['jm'],
    async mounted () {
      let that = this
      let AWEB_SERVER_ADDR = that.$stash.AWEB_SERVER_ADDR
      let options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'orange'
      }
      let mind = null
      jsMindDraggable(jsMind)

      try {
        let response = await this.$http.get(AWEB_SERVER_ADDR + '/tree')
        mind = response.data
        if (_.isEmpty(mind)) {
          this.jm = jsMind.show(options)
        } else {
          this.jm = new jsMind(options)
          this.jm.show(mind)
        }
      } catch (e) {
        this.jm = jsMind.show(options)
      }
//      setInterval(async function () {
//        try {
//          await (that.$http.post('http://localhost:1234/tree', {nodesKeys: _.keys(that.jm.mind.nodes), data: that.jm.get_data()}))
//        } catch (e) {
//          console.log(e)
//        }
//      }, 100)
    },

    methods: {
      handleAddNodeDropdown (command) {
        this[command]()
      },
      handleChangeColorDropdown (command) {
        let [colorFn, colorArg] = _.filter(command.split(/(\w+)\((\d+)\)/), (subStr) => {
          return subStr.length > 0
        })
        this[colorFn](_.parseInt(colorArg))
      },
      openForm (type) {
        this.formVisible = true
        this.newNodeType = type
      },

      addSiblingNode () {
        let selected_node = this.jm.get_selected_node()
        if (selected_node && !selected_node.isroot) {
          let nodeid = jsMind.util.uuid.newid()
          let node = this.jm.insert_node_after(selected_node, nodeid, '新结点')
          if (node) {
            this.jm.select_node(nodeid)
            this.jm.begin_edit(nodeid)
          }
        }
      },
      addChildNode () {
        let selected_node = this.jm.get_selected_node()
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
          let node = this.jm.add_node(selected_node, nodeid, '新结点')
          if (node) {
            this.jm.select_node(nodeid)
            this.jm.begin_edit(nodeid)
          }
        }
      },
      deleteNode () {
        let selected_node = this.jm.get_selected_node()
        if (!selected_node) {
          this.$notify({
            title: '警告',
            message: '请先选择一个结点',
            type: 'error'
          })
          return
        }
        this.jm.remove_node(selected_node.id)
        // this.$store.dispatch('delete_node', node.id)
      },
      openColor (type) {
        this.colorVisible = true
        this.colorType = type
      },
      modifyColor () {
        this.colorVisible = false
        let node = this.jm.get_selected_node()
        if (!node) {
          this.$notify({
            title: '警告',
            message: '请先选择一个结点',
            type: 'error'
          })
          return
        }
        if (this.colorType === 0) {
          this.jm.set_node_color(node.id, this.color, null)
        } else if (this.colorType === 1) {
          this.jm.set_node_color(node.id, null, this.color)
        }
        this.color = 'black'
      }
    }
  }

</script>
<style scoped>
</style>
