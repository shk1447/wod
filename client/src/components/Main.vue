<template>
    <div id="app-main">
        <div class="content-wrapper">
            <tool-bar></tool-bar>
            <transition name="fade" mode="out-in">
                <div class="content-area">
                <router-view/>
                <!-- <editor v-if="active_content ==='editor'"></editor>
                <viewer v-if="active_content ==='viewer'"></viewer>
                <manager v-if="active_content ==='manager'"></manager>
                <analysis v-if="active_content ==='analysis'"></analysis> -->
                </div>
            </transition>
        </div>
        <nav-menu :collapse="onCollapse" :itemClick="onItemClick"></nav-menu>
    </div>
</template>

<script>

import NavMenu from './menu/NavMenu.vue';
import Toolbar from './menu/Toolbar.vue';

import Editor from './page/Editor.vue';
import Viewer from './page/Viewer.vue';
import Manager from './page/Manager.vue';
import Analysis from './page/Analysis.vue';

export default {
    props: {

    },
    data() {
        return {
            active_content:'editor'
        }
    },
    components: {
        "nav-menu" : NavMenu,
        "tool-bar" : Toolbar,
        "editor": Editor,
        "viewer": Viewer,
        "manager": Manager,
        "analysis": Analysis
    },
    methods: {
        onCollapse(state) {
            console.log(state);
        },
        onItemClick(event, item) {
            console.log(item);
        }
    },
    beforeCreate() {
        
    },
    created() {
        
    },
    beforeRouteUpdate(to, from) {

    },
    mounted() {
        
    },
    beforeUpdate() {
        
    },
    updated() {
        
    },
    beforeDestroy() {
        
    },
    destroyed() {
        
    }
}
</script>

<style>
    html, body {
    width: 100%;
    height: 100%;
    background: #ffffff;
    }

    body {
        font-family: Poppins-Regular, sans-serif;
        overflow: hidden;
        margin: 0px;
        font-size:12px;
    }

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width:15px;
        _background-color:#f0f0f0;
    }
    
    ::-webkit-scrollbar-corner {
    }
    
    ::-webkit-scrollbar-thumb {
        border-radius: 15px;
        border:4px solid rgba(255,255,255,0);
        background-clip:content-box;
        background-color: #e8eef1; 
    }
    .content-wrapper.show {
        width:calc(100% - 350px);
        left:350px;
    }
    .content-wrapper {
        position: fixed;
        left: 50px;
        width:calc(100% - 50px);
        height:100%;
        overflow: hidden;
        -webkit-transition: left .3s, width .3s;
        transition: left .3s, width .3s;
    }
    
    #app-main {
        width:100%;
        height:100%;
    }

    .content-area {
        height: calc(100% -50px);
    }
</style>
