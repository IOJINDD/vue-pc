import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchForm: {}, // 默认搜索内容
  },
  plugins: [createPersistedState()],
  getters: {
    searchForm: state => state.searchForm 
  },
  mutations: {
    SET_searchForm: (state, searchForm) => {
      state.searchForm = searchForm
    }
  },
  actions: {

  }
})
