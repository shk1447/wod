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
            menu_items : [],
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
            this.params = d.params;
            this.menu_items = d.menu_items;
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
