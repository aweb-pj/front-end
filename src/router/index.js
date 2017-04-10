import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import MindMap from '@/components/MindMap'

Vue.use(Router)

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
