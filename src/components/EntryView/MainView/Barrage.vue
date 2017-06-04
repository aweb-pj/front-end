<template>
  <div id="barrage_wrapper">
    <ul id="messages">
      <div v-for="(message, index) in message_history" :style="{borderColor: message.border_color.color}">
        <li v-bind:style="{backgroundColor: message.bg_color}">{{ message.content }}</li>
        <li><img src="../../../assets/like.png" @click="clickPlusOne(message.id)"></li>
      </div>
    </ul>
    <form action="">
      <textarea v-model="message_content" @keydown.enter="send" @keyup.enter="clear" name="message-to-send" id="message-to-send" placeholder ="输入弹幕" rows="3"></textarea>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'barrage',
    data () {
      return {
        message_content: '',
//        border_color: []
      }
    },
    computed: {
      ...mapGetters([
        'message_history'
      ])
    },

    mounted () {
      this.$store.dispatch('connect')
      this.$store.dispatch('time_watcher')
//      let that = this
//      setInterval(function () {
//        let now = Date.parse(new Date())
//        let bc = that.border_color
//        for (let i = 0; i < bc.length; i++) {
//          let diff = (now - bc[i].time) / 1000
//          if (diff > 5) {
//            bc[i].color = 'rgb(255,255,255)'
//          } else {
//            let val = 51 * diff
//            bc[i].color = 'rgb(' + val + ',' + val + ',255)'
//          }
//        }
//      }, 10)
    },

    methods: {
      clear () {
        if (this.message_content.trim() === '') {
          this.message_content = ''
        }
      },

      send () {
        if (this.message_content.trim() === '') {
          this.message_content = ''
        } else {
          this.message_content = this.message_content.trim()
          this.$store.dispatch('send_message', this.message_content)
          this.message_content = ''
//          this.border_color.unshift({color: 'rgb(0,0,255)', time: Date.parse(new Date())})
        }
      },

      clickPlusOne (id) {
        this.$store.dispatch('click_plus', id)
      }
    }
  }
</script>

<style scoped>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font: 13px Helvetica, Arial; }
  #barrage_wrapper {}
  form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
  form textarea { border: 0; padding: 10px; width: 90%; margin-right: .5%; resize: none; }
  form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
  #messages { list-style-type: none; margin: 0; padding: 0; }
  #messages li { padding: 5px 10px; word-wrap:break-word; word-break:break-all;min-height: 3%}
  #messages li:nth-child(odd) { background: #eee; }
  #messages { margin-bottom: 40px }
  #messages img {width: 8%; float: right}
  #messages div {border: 1px solid}
</style>
