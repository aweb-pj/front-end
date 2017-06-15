<template>
  <div>
    <el-row class="tac">
      <el-col :span="3">
        <sidebar :selectedNodeId="selectedNodeId"></sidebar>
      </el-col>
      <el-col :span="display_barrage ? 18 : 21">
        <el-tabs  v-model="selectedTab" type="card" @tab-click="click_tab">
          <el-tab-pane :label="tabs[0].title" :name="tabs[0].name">
            <div class="tabContent">
              <mind-map :selectedNodeId="selectedNodeId"></mind-map>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="tabs[1].title" :name="tabs[1].name" v-if="selectedNodeId !== null">
            <div class="tabContent" v-if="menu_index === '1'">
              <homework :selectedNodeId="selectedNodeId"></homework>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="tabs[2].title" :name="tabs[2].name" v-if="selectedNodeId !== null">
            <div class="tabContent" v-if="menu_index === '2'">
              <material :selectedNodeId="selectedNodeId"></material>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="tabs[3].title" :name="tabs[3].name" v-if="selectedNodeId !== null">
            <div class="tabContent" v-if="menu_index === '3'">

            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col class="barrage" :span="3" v-if="display_barrage">
        <barrage></barrage>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  /* eslint-disable new-cap */

  import Sidebar from './MainView/Sidebar.vue'
  import MindMap from './MainView/MindMap.vue'
  import Barrage from './MainView/Barrage.vue'
  import Homework from './MainView/Homework.vue'
  import Material from './MainView/Material.vue'
  import { mapGetters } from 'vuex'
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
          { title: '课件', name: '3' },
          { title: '资源', name: '4' }
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
      },
      ...mapGetters([
        'menu_index'
      ]),
      ...mapGetters([
        'display_barrage'
      ])
    },
    methods: {
      async click_tab (tab) {
        let index = tab.index
        this.$store.dispatch('change_menu', index)
//        if (index === '1') {
//         await this.$store.dispatch('get_homework', this.selectedNodeId)
//          await (new HomeworkHelper(this.$stash)).get_homework(this.selectedNodeId)
//        } else if (index === '2') {
//
//        }
      }
    }
  }

</script>
<style scoped>
  .tabContent {
    max-height: 94%;
  }
  .barrage {
    height: 100%;
    border-left: 1px solid rgb(209,219,229);
    overflow: auto;
  }
</style>
