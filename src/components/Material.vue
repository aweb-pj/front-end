<template>
<div>
  <input v-model="file_server_addr" placeholder="file server addr">
  <p>file server is: {{ file_server_addr }}</p>
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
  </div>
</template>
<script>
  export default {
    name: 'homework',
    data () {
      return {
        file_server_addr: ''
      }
    }
  }
</script>
