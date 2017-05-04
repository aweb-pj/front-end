<template>
  <div>
    <el-row class="tac">
      <el-col :span="3">
        <sidebar></sidebar>
      </el-col>
      <el-col :span="18">
        <el-tabs  v-model="selectedTab" type="card" @tab-click="test_click">
          <el-tab-pane :label="tabs[0].title" :name="tabs[0].name">
            <div class="tabContent">
              <mind-map></mind-map>
            </div>
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

  import Sidebar from './Sidebar.vue'
  import MindMap from './MindMap.vue'
  import Barrage from './Barrage.vue'

  export default {
    name: 'main-view',
    components: {
      Sidebar,
      MindMap,
      Barrage
    },
    data () {
      return {
//        jm: null,
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
