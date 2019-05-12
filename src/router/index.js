import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  mode: 'hash',
  routes: [{
    path: '/',
    name: 'vue-pc',
    component: (resolve) => require(['@/views/home/index'], resolve)
  }]
}) 
