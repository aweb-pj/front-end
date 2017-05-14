<template>
  <div>
  <el-menu default-active="2" class="sidebar" :default-openeds="openeds">
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
    <el-submenu index="2" >
      <template slot="title"><i class="el-icon-menu"></i>导航二</template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="1-1" @click="">新增题目</el-menu-item>
        <el-menu-item index="1-2">删除题目</el-menu-item>
      </el-menu-item-group>
      </el-submenu>

    <el-submenu index="3">
      <template slot="title"><i class="el-icon-setting"></i>导航三</template>
    </el-submenu>
  </el-menu>


  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    data () {
      return {
        openeds: ['2']
      }
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
