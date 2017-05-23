import Vue from 'vue'
import VueResource from 'vue-resource'
import App from 'components/App'
//vue ajax
Vue.use(VueResource);
import store from './data'
import router from './routes'
const app = new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

export default app;
