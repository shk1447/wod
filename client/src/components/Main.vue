<template>
    <div id="app-main">
        <div class="content-wrapper" ref="content_area">
            <tool-bar ref="tool_bar"></tool-bar>
            <div class="content-area">
                <router-view/>
            </div>
            <side-bar ref="side_bar"></side-bar>
        </div>
        <nav-menu :collapse="onCollapse" :itemClick="onItemClick"></nav-menu>

        <page-modal ref="pageModal"></page-modal>
    </div>
</template>

<script>

import NavMenu from './menu/NavMenu.vue';
import Toolbar from './menu/Toolbar.vue';
import Sidebar from './menu/Sidebar.vue';

import Editor from './page/Editor.vue';
import Viewer from './page/Viewer.vue';
import Manager from './page/Manager.vue';
import Analysis from './page/Analysis.vue';

import PageModal from './modal/CreatePageModal.vue';

export default {
    props: {

    },
    data() {
        return {
            active_content:'editor',
            tool:{
                editor: {
                    left:[],
                    right:[{
                        id:"",
                        icon: "fas fa-cloud-upload-alt",
                        label:'',
                        action:this.onPagePopup
                    }]
                },
                viewer: {
                    left:[],
                    right:[]
                },
                manager: {
                    left:[],
                    right:[]
                },
                analysis: {
                    left:[],
                    right:[]
                }
            }
        }
    },
    components: {
        "page-modal": PageModal,
        "nav-menu" : NavMenu,
        "tool-bar" : Toolbar,
        "side-bar" : Sidebar,
        "editor": Editor,
        "viewer": Viewer,
        "manager": Manager,
        "analysis": Analysis
    },
    methods: {
        onPagePopup() {
            this.$refs.pageModal.show();
        },
        onCollapse(state) {
            console.log(state);
        },
        onItemClick(event, item) {
            // this.active_content = this.$route.name;
            this.$refs.tool_bar.tool = this.tool[this.$route.name];
            this.$refs.side_bar.content_area = this.$refs.content_area;
        }
    },
    beforeCreate() {

    },
    created() {

    },
    beforeRouteUpdate(to, from) {

    },
    mounted() {
        // this.active_content = this.$route.name;
        this.$refs.tool_bar.tool = this.tool[this.$route.name];
        this.$refs.side_bar.content_area = this.$refs.content_area;
        console.log('mounted');
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
        height: calc(100% - 50px);
    }
</style>
