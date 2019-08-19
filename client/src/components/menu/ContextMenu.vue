<template>

<hsc-menu-style-white>
    <hsc-menu-context-menu ref="context_menu">
        <template slot="contextmenu">
            <hsc-menu-item label="Data">
                <hsc-menu-item label="Push" />
                <hsc-menu-item label="Polling" />
            </hsc-menu-item>
            <hsc-menu-item label="Reset">
                <hsc-menu-item label="Flow" />
                <hsc-menu-item label="Zoom" />
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
            params : {}
        }
    },
    components:{
        
    },
    methods: {
       handleContextMenu(d) {
            var me = this;
            if(d.active) {
                me.$refs.context_menu.openMenu(d.params.event);
            } else {
                me.$refs.context_menu.close();
            }
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
