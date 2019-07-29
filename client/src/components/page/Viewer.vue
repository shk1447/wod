<template>
  <div style="position:absolute;height:100%;width:100%;" @dragover="dragover" @drop="drop">
    <component v-for="item in instances" :key="item.id" :is="item.compName" :id="item.id" :props="item.props" :action="item.action"></component>
  </div>
</template>

<script>
import { setTimeout } from 'timers';

export default {
    data () {
        return {
            instances : []
        }
    },
    components : {
        
    },
    methods: {
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var me = this;
            me.instances = [];
            var transfer_data = e.dataTransfer.getData("page");
            var data = JSON.parse(transfer_data);
            setTimeout(function() {
                me.$loading({})
                me.instances = data.instances;
                me.$loading({}).close();
            },0)
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    updated() {
        console.log('updated')
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>

<style>
</style>
