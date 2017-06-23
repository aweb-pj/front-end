// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
// import VueCosmos from './vue-cosmos.js'
import VueStash from './vue-stash/src/index'
Vue.use(VueResource)
Vue.config.productionTip = false

Vue.use(ElementUI)
// Vue.use(VueCosmos)
Vue.use(VueStash)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    stash: {
      jm: null,
      nodeColors: {},
      homework: {},
      username: '',
      isTeacher: true,
      is_logged_in: false,
      select_course: false,
      courses: [],
      courseId: '',
      selectable_courses: [],
      AWEB_SERVER_ADDR: 'https://aweb.jtwang.me',
      statVisible: false,
      showMindmap: true,
      hsv2rgb: function (args) {
        let [h, s, v] = args
        let rgb = []
        let i = []
        let data = []
        if (s === 0) {
          rgb = [v, v, v]
        } else {
          h = h / 60
          i = Math.floor(h)
          data = [v * (1 - s), v * (1 - s * (h - i)), v * (1 - s * (1 - (h - i)))]
          switch (i) {
            case 0:
              rgb = [v, data[2], data[0]]
              break
            case 1:
              rgb = [data[1], v, data[0]]
              break
            case 2:
              rgb = [data[0], v, data[2]]
              break
            case 3:
              rgb = [data[0], data[1], v]
              break
            case 4:
              rgb = [data[2], data[0], v]
              break
            default:
              rgb = [v, data[0], data[1]]
              break
          }
        }
        return '#' + rgb.map(function (x) {
          return ('0' + Math.round(x * 255).toString(16)).slice(-2)
        }).join('')
      },
      num2hsv: function (num) {
        if (num > 100) {
          num = 100
        } else if (num < 0) {
          num = 0
        }
        let h = Math.floor((100 - num) * 120 / 100)
        let s = Math.abs(num - 50) / 50
        let v = 1
        return [h, s, v]
      }
    }
  }
})
