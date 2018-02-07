// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import ElTableColumnEdit from './components/table-column'
import ElementTableColumnEdit from 'element-table-column-edit'
// import VueFlagList from 'vue-flag-list'
// import 'vue-flag-list/dist/vue-flag-list.min.css'

console.log(ElementTableColumnEdit)
Vue.use(ElementUI)
// Vue.use(VueFlagList)
Vue.use(ElementTableColumnEdit)
// Vue.use(ElTableColumnEdit)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
