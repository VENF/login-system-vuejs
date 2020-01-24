import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  mutations: {
    asigToken(state,tokenAsig){
      state.token = tokenAsig;
      console.log(state.token)
    }
  },
  actions: {
  },
  modules: {
  }
})
