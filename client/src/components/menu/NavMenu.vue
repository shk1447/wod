<template>
    <sidebar-menu :menu="menu" :collapsed="true" @collapse="collapse" @itemClick="itemClick" />
</template>

<script>

const separator = {
  template: `<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">`
}

export default {
    props: {
        collapse: { type : Function },
        itemClick: { type : Function }
    },
    data () {
        return {
            menu: [
                {
                    header: true,
                    title: 'VISUALIZATION'
                },
                // {
                //     title: 'EDITOR',
                //     type:'content',
                //     icon: 'fa fa-edit',
                //     href:'/editor'
                // },
                {
                    title: 'VIEWER',
                    type:'content',
                    icon: 'fa fa-eye',
                    href:'/viewer'
                },
                {
                    header: true,
                    component: separator,
                    visibleOnCollapse: true
                },
                {
                    header: true,
                    title: 'DATA'
                },
                {
                    title: 'MANAGER',
                    type:'content',
                    icon: 'fas fa-database',
                    href:'/manager'
                },
                {
                    title: 'ANALYSIS',
                    type:'content',
                    icon: 'fas fa-cogs',
                    href:'/analysis'
                }
            ]
        }
    },
    components:{
        
    },
    methods: {
        
    },
    beforeCreate(){

    },
    created() {
        console.log('created')
    },
    beforeRouteUpdate(to,from){

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
        console.log('destroyed')
    }
}
</script>
<style>
    .v-sidebar-menu .vsm-icon {
        background-color: transparent !important;
    }
    .vsm-list {
        width: 100% !important;
        padding-right:0px !important;
    }
    .v-sidebar-menu .vsm-link {
        font-size: 12px !important;
    }
</style>