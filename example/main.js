import Vue from 'vue'
import App from './App.vue'
import router from './router'
import febAlive from '../src/index'

Vue.use(febAlive, { router })

Vue.config.productionTip = false

window.gvm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
