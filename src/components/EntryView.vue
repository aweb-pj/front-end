<template>
  <div>
    <login-view v-if="!is_logged_in"></login-view>
    <course-view v-if="is_logged_in && !select_course"></course-view>
    <main-view v-if="select_course"></main-view>
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
      },
      select_course () {
        return this.$stash.select_course
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
