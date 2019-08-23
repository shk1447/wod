<template>

<hsc-menu-style-white>
    <hsc-menu-context-menu ref="context_menu">
        <template slot="contextmenu">
            <hsc-menu-item v-for="menu in menu_items" :label="menu.label" :key="menu.id">
                <hsc-menu-item v-for="sub_menu in menu.children" :label="sub_menu.label"
                :key="sub_menu.id" v-on:click="sub_menu.action(sub_menu)"/>
            </hsc-menu-item>
        </template>
    </hsc-menu-context-menu>
</hsc-menu-style-white>

</template>

<script>
import _ from 'lodash';
import moment from 'moment';
export default {
    props: {
        actionMenu: { type : Function }
    },
    data () {
        return {
            menu_items : [{
                id:"data",
                label:"Data",
                children:[{
                    id:"push",
                    label:"Push Node",
                    action:this.AddDataHandler
                },{
                    id:"polling",
                    label:"Polling Node",
                    action:this.AddDataHandler
                }]
            },{
                id:"reset",
                label:"Reset",
                children:[{
                    id:"flow",
                    label:"Data Flow",
                    action:this.resetDataFlow
                },{
                    id:"zoom",
                    label:"Zoom State",
                    action:this.resetZoomState
                }]
            }],
            params : {}
        }
    },
    components:{

    },
    methods: {
        resetDataFlow(menu) {
            console.log('reset flow', menu)
        },
        resetZoomState(menu) {
            console.log('reset zoom', menu)
        },
        AddDataHandler(menu) {
            console.log('add node', menu)
            switch(menu.id) {
                case 'push' :
                    console.log(this.params.event);
                    this.custom_events.emit('addNodes', [{
                        eventCallback: true,
                        id:'data_push',
                        type:'push_node',
                        flow : {
                            x:this.params.event.offsetX,
                            y: this.params.event.offsetY
                        },
                        input:false, output:true,
                        props:{
                            setter:{
                                data_key:""
                            },
                            fields:[{
                                "key":"id",
                                "label":"노드 아이디",
                                "type":"string",
                                "description":""
                            },{
                                "key":"props.setter.data_key",
                                "label":"데이터 기준 키",
                                "type":"string",
                                "description":""
                            }]
                        }
                    }])
                break;
                case 'polling' :
                    this.custom_events.emit('addNodes', [{
                        id:'data_polling',
                        type:'polling_node',
                        flow: {
                            x:this.params.event.offsetX,
                            y: this.params.event.offsetY,
                        },
                        input:false, output:true,
                        props:{
                            setter:{
                                url:""
                            },
                            fields:[{
                                "key":"id",
                                "label":"노드 아이디",
                                "type":"string",
                                "description":""
                            },{
                                "key":"props.setter.url",
                                "label":"데이터 URL",
                                "type":"string",
                                "description":""
                            }]
                        }
                    }])
                break;
            }
        },
        handleContextMenu(d) {
            var me = this;
            if(d.active) {
                me.$refs.context_menu.openMenu(d.params.event);
            } else {
                me.$refs.context_menu.close();
            }
            this.params = d.params;
        }
    },
    beforeCreate(){

    },
    created() {
        console.log('created')
    },
    beforeRouteUpdate(to,from){

    },
    mounted() {
        var me = this;
        console.log('mounted');
        this.custom_events.on('contextmenu', me.handleContextMenu)

    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {
        var me = this;
        console.log('destroyed')
        this.custom_events.off('contextmenu', me.handleContextMenu);
        me.$refs.context_menu.close();
    }
}
</script>
<style scoped>


</style>
