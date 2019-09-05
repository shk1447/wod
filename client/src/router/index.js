import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import Editor from '../components/page/Editor.vue';
import Viewer from '../components/page/Viewer.vue';
import Manager from '../components/page/Manager.vue';
import Analysis from '../components/page/Analysis.vue';

// editor 잠시 쉬어라..
// {
//       path: '/editor',
//       name: 'editor',
//       component: Editor
// }
export default new Router({
      routes: [{
            path: '/editor',
            name: 'editor',
            component: Editor
      },{
            path: '/viewer',
            name: 'viewer',
            component: Viewer
      },{
            path: '/manager',
            name: 'manager',
            component: Manager
      },{
            path: '/analysis',
            name: 'analysis',
            component: Analysis
      }]
})