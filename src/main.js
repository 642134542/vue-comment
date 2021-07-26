import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'

Vue.use(ElementUI);
Vue.config.productionTip = false

import '@/icons' // icon

import './less/home.less';
import './less/index.less';

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
