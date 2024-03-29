<template>
    <div id="app-main">
        <div class="content-wrapper" ref="content_area">
            <tool-bar ref="tool_bar"></tool-bar>
            <div class="content-area">
                <router-view ref="content_comp"/>
            </div>
            <side-bar ref="side_bar"></side-bar>
        </div>
        <nav-menu :collapse="onCollapse" :itemClick="onItemClick"></nav-menu>

        <setting-modal ref="settingModal"></setting-modal>
        <login-modal ref="loginModal"></login-modal>
        <context-menu ref="contextMenu"></context-menu>
    </div>
</template>

<script>

import NavMenu from './menu/NavMenu.vue';
import Toolbar from './menu/Toolbar.vue';
import Sidebar from './menu/Sidebar.vue';
import ContextMenu from './menu/ContextMenu.vue'

import Editor from './page/Editor.vue';
import Viewer from './page/Viewer.vue';
import Draw from './page/Draw.vue';
import Manager from './page/Manager.vue';
import Analysis from './page/Analysis.vue';

import LoginModal from './modal/LoginModal.vue';
import SettingModal from './modal/SettingModal.vue';


export default {
    props: {

    },
    data() {
        return {
            active_content:'viewer',
            tool:{
                editor: {
                    left:[],
                    right:[{
                        id:"save",
                        icon: "fas fa-save",
                        label:'',
                        action:this.onSavePage,
                        disabled:true
                    },{
                        id:"setting",
                        icon: "fas fa-cog",
                        label:'',
                        action:this.onSetting
                    }],
                    panels:[{
                        name:'Page',
                        comp:'page-panel'
                    },{
                        name:'Component',
                        comp:'component-panel'
                    },{
                        name:'Outline',
                        comp:'outline-panel'
                    },{
                        name:'Property',
                        comp:'property-panel'
                    }]
                },
                viewer: {
                    left:[],
                    right:[{
                        id:"",
                        label:"",
                        icon:"fas fa-code",
                        action:this.onFlow,
                        disabled:false
                    }],
                    panels:[{
                        name:'Page',
                        comp:'page-panel'
                    }]
                },
                manager: {
                    left:[],
                    right:[],
                    panels:[]
                },
                analysis: {
                    left:[],
                    right:[],
                    panels:[]
                },
                draw: {
                    left:[],
                    right:[],
                    panels:[]
                }
            },
            flow:false
        }
    },
    components: {
        "setting-modal": SettingModal,
        "login-modal": LoginModal,
        "context-menu": ContextMenu,
        "nav-menu" : NavMenu,
        "tool-bar" : Toolbar,
        "side-bar" : Sidebar,
        "editor": Editor,
        "viewer": Viewer,
        "draw": Draw,
        "manager": Manager,
        "analysis": Analysis
    },
    methods: {
        onFlow() {
            this.flow = !this.flow;
            if(this.flow) {
                this.tool.viewer.panels.push({
                    name:'Property',
                    comp:'property-panel'
                });
            } else {
                this.tool.viewer.panels.pop();
                this.onSaveFlow();
            }
            Vue.custom_events.emit('toggle_flip', {page_id:this.$refs.content_comp.page_id});
        },
        onSetting() {
            this.$refs.settingModal.show();
        },
        onSavePage() {
            console.log('save');
            var me = this;
            if(this.$refs.content_comp && this.$refs.content_comp.save) {
                this.$refs.content_comp.save().then(function() {
                    me.custom_events.emit('refresh', {});
                    //me.custom_events.emit('outline', {});
                })
            }
        },
        onSaveFlow() {
            var me = this;
            this.core.flow.manager.saveFlow().then(function() {
                me.custom_events.emit('refresh', {});
                //me.custom_events.emit('outline', {});
                me.$refs.content_comp.reload();
            });
        },
        onCollapse(state) {
            console.log(state);
        },
        onItemClick(event, item) {
            // this.active_content = this.$route.name;
            if(this.$route.name) {
                this.$refs.tool_bar.tool = this.tool[this.$route.name];
                this.$refs.side_bar.panels = this.tool[this.$route.name].panels;
            }
            this.$refs.side_bar.content_area = this.$refs.content_area;
        },
        activeSaveBtn(page_id) {
            this.tool.editor.right[0].disabled = false;
        }
    },
    beforeCreate() {

    },
    created() {
        if(!this.$route.name) {
            this.$router.push({path:'editor'})
        }
    },
    beforeRouteUpdate(to, from) {

    },
    mounted() {
        this.$refs.loginModal.show();
        // this.active_content = this.$route.name;
        if(this.$route.name) {
            this.$refs.tool_bar.tool = this.tool[this.$route.name];
            this.$refs.side_bar.panels = this.tool[this.$route.name].panels;
        }
        this.$refs.side_bar.content_area = this.$refs.content_area;
        this.custom_events.on('onloaded_page', this.activeSaveBtn);
        console.log('mounted');
    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {
        this.custom_events.off('onloaded_page', this.activeSaveBtn);
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
