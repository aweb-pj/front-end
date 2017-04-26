import Vue from 'vue'
import Router from 'vue-router'
import VueSocketio from 'vue-socket.io'
import Hello from '@/components/Hello'
import MindMap from '@/components/MindMap'

Vue.use(Router)
Vue.use(VueSocketio, 'http://localhost:3000/')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/mindmap',
      name: 'MindMap',
      component: MindMap
    }
  ]
})
