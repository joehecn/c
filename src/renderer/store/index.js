
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    github: null,
    user: {
      userName: ''
    },
    workDir: '',
    date: new Date()
    // enterHomeFirstTime: true
  },
  mutations: {
    setGithub (state, github) {
      state.github = github
    },
    setUser (state, user) {
      state.user = user
    },
    setWorkDir (state, workDir) {
      state.workDir = workDir
    },
    setDate (state, date) {
      state.date = date
    },
    // setEnterHomeFirstTime (state) {
    //   state.enterHomeFirstTime = false
    // }
  },
  actions: {
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setWorkDir ({ commit }, workDir) {
      commit('setWorkDir', workDir)
    },
    setDate ({ commit }, date) {
      commit('setDate', date)
    }
    // setEnterHomeFirstTime({ commit }) {
    //   commit('setEnterHomeFirstTime')
    // }
  }
})

export default store
