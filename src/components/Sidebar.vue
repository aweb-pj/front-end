<template>
  <div>
    <div v-if="menu_index == 0">
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>导航一</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1" @click="save_mindmap">保存思维导图</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>
    <div v-else-if="menu_index == 1">
      <el-menu class="sidebar">
        <el-submenu index="1" >
          <template slot="title"><i class="el-icon-menu"></i>导航二</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1" @click="">新增题目</el-menu-item>
            <el-menu-item index="1-2">删除题目</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div v-else>
      <el-menu class="sidebar">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-setting"></i>导航三</template>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'sidebar',
    data () {
      return {
        openeds: ['2']
      }
    },
    computed: {
      ...mapGetters([
        'menu_index'
      ])
    },
    methods: {
      async save_mindmap () {
        console.log(this.$cosmos.jm.get_data())
      }
    }
  }
</script>
<style scoped>
  .sidebar {
    min-height: 100%;
  }
</style>
