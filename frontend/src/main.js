import Vue from 'vue';
import app from './app.vue';
import './registerServiceWorker';
import router from './router/routes.js';
import store from './store/store.js';
import '@/styles/styles.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import VueDragscroll from 'vue-dragscroll'
import moment from 'moment';
import VueInputAutowidth from 'vue-input-autowidth';




Vue.use(VueInputAutowidth);
Vue.use(VueDragscroll);
Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;
Vue.prototype.moment = moment;

new Vue({
    router,
    store,
    render: h => h(app)
}).$mount('#app')