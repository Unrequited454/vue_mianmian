import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style/base.css'
import DonMessage from '@/utils/message.js'
// 导入富文本js
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)
Vue.prototype.$message = DonMessage
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
