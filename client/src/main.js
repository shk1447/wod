import Vue from 'vue';

// ui framework
import ElementUI from "element-ui";
import locale from 'element-ui/lib/locale/lang/en'
//import './assets/style/style.css';

// Menu
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
Vue.use(VueSidebarMenu)

// Modal
import vmodal from 'vue-js-modal';
Vue.use(vmodal);
Vue.use(ElementUI, { locale });

import App from './components/Main.vue';
import router from './router';

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})