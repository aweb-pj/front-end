import Vue from 'vue'
import Router from 'vue-router'
import EntryView from '@/components/EntryView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'EntryView',
      component: EntryView
    }
  ]
})
