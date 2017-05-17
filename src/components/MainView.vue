<template>
  <div>
    <el-row class="tac">
      <el-col :span="3">
        <sidebar :selectedNodeId="selectedNodeId"></sidebar>
      </el-col>
      <el-col :span="18">
        <el-tabs  v-model="selectedTab" type="card" @tab-click="click_tab">
          <el-tab-pane :label="tabs[0].title" :name="tabs[0].name">
            <div class="tabContent">
              <mind-map :selectedNodeId="selectedNodeId"></mind-map>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="tabs[1].title" :name="tabs[1].name" v-if="selectedNodeId !== null">
            <div class="tabContent">
              <homework :selectedNodeId="selectedNodeId"></homework>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="tabs[2].title" :name="tabs[2].name" v-if="selectedNodeId !== null">
            <div class="tabContent">
              <material></material>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col class="barrage" :span="3">
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
  import Homework from './Homework.vue'
  import Material from './Material.vue'

  export default {
    name: 'main-view',
    stash: ['jm'],
    components: {
      Sidebar,
      MindMap,
      Barrage,
      Homework,
      Material
    },
    data () {
      return {
        selectedTab: '1',
        tabs: [
          { title: '思维导图', name: '1' },
          { title: '作业', name: '2' },
          { title: '课件', name: '3' }
        ]
      }
    },
    computed: {
      selectedNodeId: function () {
        try {
          let selectedNode = this.jm.mind.selected
          if (selectedNode) {
            return selectedNode.id
          } else {
            return null
          }
        } catch (e) {
          return null
        }
      }
    },
    methods: {
      async click_tab (tab) {
        let index = tab.index
        this.$store.dispatch('change_menu', index)
        if (index === '1') {
          await this.$store.dispatch('get_homework', this.selectedNodeId)
        }
      }
    }
  }

</script>
<style scoped>
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
  .barrage {
    height: 100%;
    border-left: 1px solid rgb(209,219,229);
    overflow: auto;
  }
</style>
