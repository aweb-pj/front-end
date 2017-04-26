<template>
  <div>
    <el-row class="tac">
      <el-col :span="3">
        <sidebar></sidebar>
      </el-col>
      <el-col :span="18">
        <div id="jsmind_container"></div>
      </el-col>
      <el-col :span="3">
        <barrage></barrage>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  /* eslint-disable new-cap */

  import './MindMap/jsmind/style/jsmind.css'
  import jsMind from './MindMap/jsmind/js/jsmind.js'
  import jsMindDraggable from './MindMap/jsmind/js/jsmind.draggable.js'

  import Sidebar from './Sidebar.vue'
  import Barrage from './Barrage.vue'

//  import _ from 'lodash'

  let teacherList = ['teacher1', 'teacher2']
  let studentList = ['student1', 'student2', 'student3']

  export default {
    name: 'mind-map',
    components: {
      Sidebar,
      Barrage
    },
    data () {
      return {
        sidebarShow: true,
        isTeacher: true,
        teacherList: teacherList,
        studentList: studentList,
        jm: null
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

      let that = this
      that.jm = new jsMind(options)
      that.jm.show(mind)
      /* below are the canvas contextmenu configuration */
      let $menu = $('#contextMenu')
      $menu.on('click', 'li', function (e) {
        // hide the context menu
        $menu.hide()
        console.log('Context selection: ' + $(this).text())
        that.sidebarShow = !that.sidebarShow
      })
    }
  }

</script>
<style>
  #contextMenu{position:absolute;}
  #contextMenu{
    border:1px solid green;
    background:white;
    list-style:none;
    padding:3px;
  }
</style>
