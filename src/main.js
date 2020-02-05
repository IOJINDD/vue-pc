import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './plugins/element.js'
import CdtSearch from '@/components/cdt-search/index'
import CdtTable from '@/components/cdt-table/index'
import CdtForm from '@/components/cdt-form/index'
import common from '@/utils/common-for-vue.js'
import '@/font-awesome/css/font-awesome.min.css'
import './assets/css/icon.css'
import * as filters from './filters' // 全局vue filter

Vue.prototype.common = common;
Vue.config.productionTip = false
Vue.component('ComSearch', CdtSearch)
Vue.component('ComTable', CdtTable)
Vue.component('ComForm', CdtForm)

// 配置全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
