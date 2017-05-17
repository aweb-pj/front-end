/* eslint-disable camelcase */
import Vue from 'vue'
import Vuex from 'vuex'
// import moment from 'moment'
import _ from 'lodash'

import io from 'socket.io-client'

Vue.use(Vuex)

const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'

// <<<<<<< HEAD
// let BARRAGE_SERVER_ADDR = 'http://'
// if (process.env.NODE_ENV === 'production') {
//   BARRAGE_SERVER_ADDR += 'barrage.jtwang.me'
// } else {
//   BARRAGE_SERVER_ADDR += 'localhost:3000'
// }
// =======
// let BARRAGE_SERVER_ADDR = 'http://' + (process.env.NODE_ENV === 'production') ? 'barrage.jtwang.me' : 'localhost:3000'
let BARRAGE_SERVER_ADDR = 'https://barrage.jtwang.me'

let socket = null

const state = {
  username: 'test_username', // TODO: should use real login function to replace with it
  connection_status: false,
  login_toggle: false,
  is_logged_in: !!localStorage.getItem('token'),
  login_pending: false,
  token: '',
  account: '',
  message_history: [],
  exercises: [],
  menu_index: 0,
  delete_node_id: -1
}

const mutations = {
  TOGGLE_LOGIN_BOX (state, status) {
    state.login_toggle = status
  },

  CHANGE_CONNECTION_STATUS (state, status) {
    state.connection_status = status
  },

  [LOGIN] (state) {
    state.login_pending = true
  },

  [LOGIN_SUCCESS] (state, username) {
    state.is_logged_in = true
    state.login_pending = false
    state.username = username
  },

  [LOGOUT] (state) {
    state.is_logged_in = false
  },

  PUT_MESSAGE (state, message) {
    state.message_history.unshift(message)
  },

  CLICK_PLUS_ONE (state, id) {
    let index = _.findIndex(state.message_history, function (message) { return message.id === id })
    let click = 255 - 2 * (++state.message_history[index].clicks < 200 ? state.message_history[index].clicks : 200)
    state.message_history[index].bg_color = 'rgb(' + click + ',' + click + ',' + click + ')'
  },

  PUT_EXERCISES (state, exercises) {
    while (state.exercises.length !== 0) {
      state.exercises.pop()
    }
    _.forEach(exercises, function (exercise) {
      state.exercises.push(exercise)
    })
  },

  CHANGE_MENU_INDEX (state, index) {
    state.menu_index = index
  },
  DELETE_EXERCISE (state, index) {
    state.exercises.splice(index, 1)
  },
  DELETE_NODE (state, id) {
    state.delete_node_id = id
  }
}

const actions = {
  connect ({commit, state}) {
    if (state.connection_status === false) {
      socket = io(BARRAGE_SERVER_ADDR)
      socket.on('connect', () => {
        commit('CHANGE_CONNECTION_STATUS', true)
      })
    }

    if (state.username === '') {
      if (localStorage.getItem('token') !== null && localStorage.getItem('username') !== null) {
        commit(LOGIN_SUCCESS, localStorage.getItem('username'))
      }
    }

    socket.on('disconnect', () => {
      commit('CHANGE_CONNECTION_STATUS', false)
    })
    socket.on('server_message', (message) => {
      commit('PUT_MESSAGE', message)
    })
    socket.on('server_click', (id) => {
      commit('CLICK_PLUS_ONE', id)
    })
    // socket.on('update_contacts', (people) => {
    //   console.log('HERE!!!!!!!!')
    //   commit('CLEAR_CONTACTS')
    //   _.forEach(people, (person) => { commit('ADD_CONTACT', person) })
    //   commit('SET_CURRENT_WITH', state.contacts[0])// should check if 0 in production mode
    // })
  },

  login ({commit}, {username, password}) {
    commit(LOGIN)
    // console.log('store: ', username, password)
    socket.emit('login', {'username': username, 'password': password})
    socket.on('login_success', () => {
      localStorage.setItem('token', 'JWT')
      localStorage.setItem('username', username)
      commit(LOGIN_SUCCESS, username)
    })
  },

  logout ({commit}) {
    localStorage.removeItem('token')
    commit(LOGOUT)
  },

  send_message ({commit}, content) {
    // let time = moment().calendar()
    socket.emit('client_message', content)
  },

  click_plus ({commit}, id) {
    socket.emit('client_click', id)
    commit('CLICK_PLUS_ONE', id)
  },

  async get_exercises ({commit}, id) {
    // console.log(id)
    try {
      let response = await Vue.http.get('https://file.jtwang.me/homework.json')
      let exercises = response.body.data
      commit('PUT_EXERCISES', exercises)
    } catch (error) {
      console.log(error)
    }
  },

  change_menu ({commit}, index) {
    commit('CHANGE_MENU_INDEX', index)
  },
  delete_exercise ({commit}, index) {
    commit('DELETE_EXERCISE', index)
  },
  delete_node ({commit}, id) {
    commit('DELETE_NODE', id)
  }
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: {
    connection_status () {
      return state.connection_status
    },
    is_logged_in () {
      return state.is_logged_in
    },
    login_pending () {
      return state.login_pending
    },
    username () {
      return state.username
    },
    message_history () {
      return state.message_history
    },
    exercises () {
      return state.exercises
    },
    menu_index () {
      return state.menu_index
    }
  },

  strict: process.env.NODE_ENV !== 'production'
})
