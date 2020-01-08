import 'babel-polyfill';
import _ from 'lodash';
import Vue from 'vue';

// context menu
import * as VueMenu from '@hscmap/vue-menu'
Vue.use(VueMenu)

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

import * as VueGL from 'vue-gl';

Object.keys(VueGL).forEach((name) => { Vue.component(name, VueGL[name]) })

Vue.prototype.two_comp = {};
Vue.prototype.three_comp = {};
Vue.prototype.flow_comp = {};

// Custom Components
import common from './components/common';
_.each(common, function(comp_list, type) {
    _.each(comp_list, function(comp, i) {
        if(comp.type === "two_comp") {
            Vue.component(comp.compName, comp);
            Vue.prototype.two_comp[comp.compName] = comp;
        } else if(comp.type === "three_comp") {
            console.log(comp);
            Vue.component(comp.compName, comp);
            Vue.prototype.three_comp[comp.compName] = comp;
        }
    })
});

import flow_modules from './core/flow/module';
_.each(flow_modules, function(flow_module, k) {
    Vue.prototype[flow_module.type][flow_module.compName] = flow_module;
})

import App from './components/Main.vue';
import router from './router';

// web socket
import io from 'socket.io-client';

Vue.prototype.web_socket = io.connect({
    path:'/socket.io',
    transports:['websocket'],
    secure:true
});
Vue.prototype.web_socket.on('connected', function(data) {
    console.log('Web Socket 연결 : ', data.id);
})

// event handler
import custom_events from './utils/events';
Vue.prototype.custom_events = custom_events;

import core from './core';
Vue.prototype.core = core;

window.Vue = new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})

import * as THREE from 'three'
THREE.Cache.enabled = true; //파일 캐싱 처리
