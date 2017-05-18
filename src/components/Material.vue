<template>
<div>
  <draggable v-model="files">
    <div v-for="(file, index) in files" :key="file">
      <el-card>
        <span>{{file}}</span>
        <el-button @click="deleteFile(index)" style="float: right">删除</el-button>
      </el-card>
    </div>
  </draggable>
  <div>
    <el-upload
        class="upload-demo"
        drag
        :action="file_server_addr"
        :on-success="afterSuccessing"	>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <!--<div class="el-upload__tip" slot="tip">上传文件大小不超过 10 MB</div>-->
    </el-upload>
  </div>

  </div>
</template>
<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'homework',
    props: ['selectedNodeId'],
    components: {
      draggable
    },
    data () {
      return {
        file_server_addr: 'http://localhost:1234/node/root/material',
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    computed: {
      files: {
        get () {
          try {
            return this.$store.state.material[this.selectedNodeId]
          } catch (e) {
            return []
          }
        },
        set (files) {
          this.$store.dispatch('update_files', {nodeId: this.selectedNodeId, files: files})
        }
      }
    },
    methods: {
      afterSuccessing (response, file, fileList) {
        this.$store.commit('PUT_FILE', {nodeId: this.selectedNodeId, file: this.selectedNodeId + '_' + file.name.replace(/\s+/g, '_').toLowerCase()})
      },
      deleteFile (index) {
        this.$store.dispatch('delete_file', {nodeId: this.selectedNodeId, index: index})
      }
    }
  }
</script>
