<template>
  <div>
    <div id="jsmind_container"></div>
    <ul id=contextMenu><li>Test</li></ul>
  </div>
</template>

<script>
  /* eslint-disable new-cap */

  import './MindMap/jsmind/style/jsmind.css'
  import jsMind from './MindMap/jsmind/js/jsmind.js'
  import jsMindDraggable from './MindMap/jsmind/js/jsmind.draggable.js'

//  import _ from 'lodash'

  export default {
    name: 'mind-map',
    data () {
      return {
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
        alert('Context selection: ' + $(this).text())
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
