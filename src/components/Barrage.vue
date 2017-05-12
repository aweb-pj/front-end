<template>
  <div id="barrage_wrapper">
    <ul id="messages">
      <li v-for="message in message_history" v-bind:style="{backgroundColor: message.bg_color}" @click="clickPlusOne(message.id)">{{ message.content }}</li>
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
        message_content: ''
      }
    },
    computed: {
      ...mapGetters([
        'message_history'
      ])
    },

    mounted () {
      // TODO: should add it back in production
      // this.$store.dispatch('connect')
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
          return
        } else {
          this.message_content = this.message_content.trim()
          this.$store.dispatch('send_message', this.message_content)
          this.message_content = ''
        }
      },

      clickPlusOne (id) {
        this.$store.dispatch('click_plus', id)
      }
    }
  }
</script>

<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font: 13px Helvetica, Arial; }
  #barrage_wrapper {}
  form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
  form textarea { border: 0; padding: 10px; width: 90%; margin-right: .5%; resize: none; }
  form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
  #messages { list-style-type: none; margin: 0; padding: 0; }
  #messages li { padding: 5px 10px; }
  #messages li:nth-child(odd) { background: #eee; }
  #messages { margin-bottom: 40px }


  /*textarea {*/
    /*width: 90%;*/
    /*border: none;*/
    /*padding: 10px 20px;*/
    /*font: 14px/22px "Lato", Arial, sans-serif;*/
    /*margin-bottom: 10px;*/
    /*border-radius: 5px;*/
    /*resize: none;*/
  /*}*/
</style>
