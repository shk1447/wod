<template>
  <div class="viewer-area" @dragover="dragover" @drop="drop">
    <component v-for="item in instances" :key="item.id" :is="item.compName"
        :id="item.id" :props="item.props" :data="item.data" :input="item.input" :output="item.output"></component>
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
                me.$nextTick(function() {
                    this.core.flow.manager.executeFlow();
                });
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
    .viewer-area {
        position:absolute;
        height:calc(100% - 50px);
        width:calc(100% - 50px);
    }
</style>
