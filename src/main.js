import Vue from 'vue'
import VueResource from 'vue-resource'
import App from 'components/App'
import Axios from "axios";

//vue ajax
Vue.use(VueResource);
Vue.prototype.$axios = Axios

import store from './data'
import router from './routes'
const app = new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

export default app;
