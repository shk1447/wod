import _ from 'lodash';
import Vue from 'vue';

// event handler
require('./utils/events');

// jquery ui
import 'expose-loader?$!expose-loader?jQuery!jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

// ui framework
import ElementUI from "element-ui";
import locale from 'element-ui/lib/locale/lang/en'
import './assets/style/index.css';

// Menu
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
Vue.use(VueSidebarMenu)

// Modal
import vmodal from 'vue-js-modal';
Vue.use(vmodal);
Vue.use(ElementUI, { locale });

// Custom Components
import common from './components/common';
_.each(common, function(comp_list, type) {
    _.each(comp_list, function(comp, i) {
        if(comp.type === "two_comp") {
            Vue.component(comp.name, comp);
        }
    })
});

import App from './components/Main.vue';
import router from './router';

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})