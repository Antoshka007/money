import './components/firebaseInit';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
	router,
	vuetify,
	render: h => h(App)
}).$mount('#app');

// let app;
// firebase.auth().onAuthStateChanged(function(user) {
// 	if (!app) {
// 		app = new Vue({
// 			el: '#app',
// 			router,
// 			template: '<App/>',
// 			components: { App }
// 		});
// 	}
// });
