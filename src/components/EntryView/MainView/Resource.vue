<template>
  <div>
    <div v-if="files !== undefined && files.length > 0">
      <h4>文件</h4>
      <draggable v-model="files" v-if="isTeacher">
        <div @click="check_file(file)" v-for="(file, index) in files" :key="file">
          <el-card>
            <span>{{file.url}}:{{file.description}}</span>
            <el-button @click="deleteFile(index, $event)" style="float: right">删除</el-button>
          </el-card>
        </div>
      </draggable>
    </div>
    <div v-if="links !== undefined && links.length > 0">
      <h4>链接</h4>
      <draggable v-model="links" v-if="isTeacher">
        <div @click="check_link(file)" v-for="(file, index) in links" :key="file">
          <el-card>
            <span>{{file.url}}:{{file.description}}</span>
            <el-button @click="deleteLink(index, $event)" style="float: right">删除</el-button>
          </el-card>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
  /* eslint-disable new-cap,camelcase,no-unused-vars */
  import draggable from 'vuedraggable'
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    name: 'resource',
    props: ['selectedNodeId'],
    stash: ['isTeacher', 'AWEB_SERVER_ADDR'],
    components: {
      draggable
    },
    data () {
      return {
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
    async mounted () {
      await this.$store.dispatch('get_resource_file', this.selectedNodeId)
      await this.$store.dispatch('get_resource_link', this.selectedNodeId)
    },
    computed: {
      ...mapGetters([
        'cur_treeId'
      ]),
      file_server_addr () {
        return _.join([this.$stash.AWEB_SERVER_ADDR, 'tree', this.cur_treeId, 'node', this.selectedNodeId, 'resource', 'file'], '/')
      },
      files: {
        get () {
          try {
            return this.$store.state.resourceFile[this.selectedNodeId]
          } catch (e) {
            return []
          }
        },
        set (files) {
          this.$store.dispatch('update_resource_files', {nodeId: this.selectedNodeId, files: files})
        }
      },
      links: {
        get () {
          try {
            return this.$store.state.resourceLink[this.selectedNodeId]
          } catch (e) {
            return []
          }
        },
        set (files) {
          this.$store.dispatch('update_resource_links', {nodeId: this.selectedNodeId, files: files})
        }
      },
      viewURL: function () {
        let that = this
        let serverUrl = _.join([that.$stash.AWEB_SERVER_ADDR, 'tree', this.cur_treeId, 'node', this.selectedNodeId, 'material', this.selectedFile], '/')
        if (this.selectedFile.search(/.+\.(ppt|pptx|doc|docx|xls|xlsx)/g) !== -1) {
          return 'https://view.officeapps.live.com/op/view.aspx?src=' + serverUrl
        } else {
          return serverUrl
        }
      }
    },
    methods: {
      deleteFile (index, event) {
        if (event.stopPropagation) {
          event.stopPropagation()
        } else {
          event.cancelBubble = true
        }
        this.$store.dispatch('delete_resource_file', {nodeId: this.selectedNodeId, index: index})
      },
      deleteLink (index, event) {
        if (event.stopPropagation) {
          event.stopPropagation()
        } else {
          event.cancelBubble = true
        }
        this.$store.dispatch('delete_resource_link', {nodeId: this.selectedNodeId, index: index})
      },
      async check_file (file) {
        let url = file.url
        let tmp = url.split('/')
        let filename = tmp[tmp.length - 1]
        let fileAddr = this.AWEB_SERVER_ADDR + '/tree/' + this.cur_treeId + '/node/' + this.selectedNodeId + '/resource/file/' + filename
        window.location.href = fileAddr
      },
      check_link (file) {
        window.location.href = file.url
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
