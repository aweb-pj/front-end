<template>
  <div>
    <draggable v-model="files">
      <div @click="openFrame(file)" v-for="(file, index) in files" :key="file">
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
    <el-dialog title="课件" v-model="dialogVisible" size="large">
      <iframe class="frame" :src="viewURL">
      </iframe>
    </el-dialog>
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
        dialogVisible: false,
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
        selectedFile: ''
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
      },
      viewURL: function () {
        let serverUrl = 'http://localhost:1234/node/' + this.selectedNodeId + '/material/' + this.selectedFile
        if (this.selectedFile.search(/.+\.(ppt|pptx|doc|docx|xls|xlsx)/g) !== -1) {
          return 'https://view.officeapps.live.com/op/view.aspx?src=' + serverUrl
        } else {
          return serverUrl
        }
      }
    },
    methods: {
      afterSuccessing (response, file, fileList) {
        this.$store.commit('PUT_FILE', {nodeId: this.selectedNodeId, file: this.selectedNodeId + '_' + file.name.replace(/\s+/g, '_').toLowerCase()})
      },
      deleteFile (index) {
        this.$store.dispatch('delete_file', {nodeId: this.selectedNodeId, index: index})
      },
      openFrame (file) {
        this.dialogVisible = true
        this.selectedFile = file
      }
    }
  }
</script>
<style scoped>
  .frame {
    width: 800px;
    height: 600px;
  }
</style>
