import Vue from 'vue';
import App from './App.vue';
import router from './router';
import febAlive from '../src/index';

Vue.use(febAlive, { router, keyName: 'feb', maxPage: 10 });

Vue.config.productionTip = false;

router.afterEach((to, from) => {
  console.log('[info] afterEach', location.href);
});

window.gvm = new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
