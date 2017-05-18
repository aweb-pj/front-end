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
        multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">上传文件大小不超过 10 MB</div>
    </el-upload>
  </div>


  <!--TODO: Below is the problematic part-->
  <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>

  <el-dialog title="收货地址" v-model="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="活动名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
<!--TODO: Problematic part ends-->

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
      deleteFile (index) {
        this.$store.dispatch('delete_file', {nodeId: this.selectedNodeId, index: index})
      }
    }
  }
</script>
