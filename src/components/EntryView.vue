<template>
  <div>
    <!--<login-view v-if="!is_logged_in"></login-view>-->
    <course-view></course-view>
    <main-view v-if="is_logged_in"></main-view>
  </div>
</template>

<script>
  import LoginView from './EntryView/LoginView'
  import MainView from './EntryView/MainView'
  import CourseView from './EntryView/CourseView'

  export default {
    data () {
      return {
        login_toggle: false
      }
    },
    components: {
      LoginView,
      MainView,
      CourseView
    },
    computed: {
      is_logged_in () {
        return this.$stash.is_logged_in
      }
    },
    name: 'entry-view'
  }
</script>

<style scoped>
  /*img {*/
    /*margin-top: -25px;*/
    /*width: 450px;*/
  /*}*/



</style>
