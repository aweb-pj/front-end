<template>
<div>
  <!--<input v-model="file_server_addr" placeholder="file server addr">-->
  <!--<p>file server is: {{ file_server_addr }}</p>-->
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
  export default {
    name: 'homework',
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
    }
  }
</script>
