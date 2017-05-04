<template>
  <div>
    <el-row class="tac">
      <el-col :span="3">
        <sidebar></sidebar>
      </el-col>
      <el-col :span="18">
        <el-tabs  v-model="selectedTab" type="card" @tab-click="test_click">
          <el-tab-pane :label="tabs[0].title" :name="tabs[0].name">
            <div class="tabContent" id="jsmind_container"></div>
          </el-tab-pane>
          <el-tab-pane :label="tabs[1].title" :name="tabs[1].name" >
            <div class="tabContent">
<!--               <ol>
                <li>1</li>
                <li>2</li>
                <li>3</li>
              </ol> -->
              <pre id="json_dispaly">{{ json_str }}</pre>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="tabs[2].title" :name="tabs[2].name">
            <div class="tabContent"></div>
          </el-tab-pane>
        </el-tabs>
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

  export default {
    name: 'mind-map',
    components: {
      Sidebar,
      Barrage
    },
    data () {
      return {
        jm: null,
        selectedTab: '1',
        tabs: [
          { title: '思维导图', name: '1' },
          { title: '作业', name: '2' },
          { title: '课件', name: '3' }
        ],
        json_str: ''
      }
    },
    methods: {
      async test_click (tab) {
        console.log(tab.label, typeof tab.index)
        if (tab.index === '1') {
          try {
            let response = await this.$http.get('http://jtwang.me/files/school_bus.json')
            console.log(response.body)
            // get body data
            this.json_str = JSON.stringify(response.body, undefined, 2)
          } catch (error) {
              // error callback
            console.log(error)
          }
        }
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
//      let $menu = $('#contextMenu')
//      $menu.on('click', 'li', function (e) {
//        // hide the context menu
//        $menu.hide()
//        console.log('Context selection: ' + $(this).text())
//      })
    }
  }

</script>
<style>
  /*#contextMenu{position:absolute;}
  #contextMenu{
    border:1px solid green;
    background:white;
    list-style:none;
    padding:3px;
  }*/
  .tabContent {
    max-height: 92%;
  }
</style>
