
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    github: null,
    // logining: false,
    user: {
      userName: ''
    },
    workDir: ''
  },
  mutations: {
    setGithub (state, github) {
      state.github = github
    },
    // setLogining (state, logining) {
    //   state.logining = logining
    // },
    setUser (state, user) {
      state.user = user
    },
    setWorkDir (state, workDir) {
      state.workDir = workDir
    }
  },
  actions: {
    // setLogining ({ commit }, logining) {
    //   commit('setLogining', logining)
    // },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setWorkDir ({ commit }, workDir) {
      commit('setWorkDir', workDir)
    }
  }
})

export default store
