<template>
  <div class="viewer-area" @dragover="dragover" @drop="drop">
    <component v-for="item in instances" :key="item._id" :is="item.compName" :meta="item"></component>
  </div>
</template>

<script>
import { setTimeout } from 'timers';

export default {
    data () {
        return {
            page_id:"",
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

            // drop하게 되면 manager가 관리하는 목록들(module, 컴포넌트 맵)을 비워줘야 한다.
            this.core.flow.manager.resetManager();
            var transfer_data = e.dataTransfer.getData("page");
            var data = JSON.parse(transfer_data);
            setTimeout(function() {
                me.$loading({})
                me.page_id = data.page_id;
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
        console.log('destroyed');
        this.core.flow.manager.destroyFlow();
    }
}
</script>

<style>
    .viewer-area {
        position:absolute;
        height:calc(100% - 50px);
        width:100%;
    }
</style>
